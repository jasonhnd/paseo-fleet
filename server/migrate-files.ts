/// <reference types="node" />
// File work for `afc migrate`: find the files the layout moves, hash them, copy them safely.
// The layout itself (which source path goes where) is the pure rule in shared/migration.ts.
import { createHash, randomBytes } from "node:crypto";
import { createReadStream } from "node:fs";
import { chmod, copyFile, lstat, mkdir, readdir, readFile, rename, rm, rmdir, stat } from "node:fs/promises";
import { dirname, join, sep } from "node:path";
import { type FileKind, isLayoutTarget, targetFor, TARGET_SECRETS_DIR } from "../shared/migration";

/** A refusal or failure the user can act on; the message is printed as is. */
export class MigrationError extends Error {}

export const SECRET_FILE_MODE = 0o600;
export const SECRET_DIR_MODE = 0o700;

export interface SourceFile {
  from: string;
  to: string;
  kind: FileKind;
  size: number;
  mtimeMs: number;
}

export interface SourceScan {
  files: SourceFile[];
  /** Top-level entries that stay in the source (docs, code, other folders), for the dry run. */
  leftInPlace: string[];
  /** Entries the layout would take but that are not regular files (symbolic links and the like). */
  skipped: Array<{ path: string; reason: string }>;
}

/** "/"-separated relative path. */
export const toPosix = (path: string): string => path.split(sep).join("/");
/** Absolute path of a "/"-separated relative path under `root`. */
export const under = (root: string, rel: string): string => join(root, ...rel.split("/"));

export function errorCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : undefined;
}

export async function sha256File(path: string): Promise<string> {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk as Buffer);
  return hash.digest("hex");
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (errorCode(error) === "ENOENT") return false;
    throw error;
  }
}

export async function fileStat(path: string): Promise<{ size: number; mtimeMs: number } | null> {
  try {
    const info = await stat(path);
    return info.isFile() ? { size: info.size, mtimeMs: info.mtimeMs } : null;
  } catch (error) {
    if (errorCode(error) === "ENOENT") return null;
    throw error;
  }
}

async function listDir(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir)).sort();
  } catch (error) {
    if (errorCode(error) === "ENOENT") return [];
    throw error;
  }
}

async function walk(root: string, rel: string, scan: SourceScan): Promise<void> {
  for (const name of await listDir(under(root, rel))) {
    const path = rel ? `${rel}/${name}` : name;
    const info = await lstat(under(root, path));
    if (info.isDirectory()) {
      const enters = path === "state" || path === "backups" || path.startsWith("backups/");
      if (enters && !name.startsWith(".")) await walk(root, path, scan);
      else if (rel) scan.skipped.push({ path: `${path}/`, reason: "folder the layout does not move" });
      else if (!name.startsWith(".")) scan.leftInPlace.push(`${name}/`);
      continue;
    }
    const target = targetFor(path);
    if (!target) {
      if (rel) scan.skipped.push({ path, reason: "hidden file" });
      else if (!name.startsWith(".")) scan.leftInPlace.push(name);
      continue;
    }
    if (!info.isFile()) {
      scan.skipped.push({ path, reason: info.isSymbolicLink() ? "symbolic link" : "not a regular file" });
      continue;
    }
    scan.files.push({ from: path, to: target.to, kind: target.kind, size: info.size, mtimeMs: info.mtimeMs });
  }
}

/** Every file the layout takes from `root`, plus what stays behind. */
export async function scanSource(root: string): Promise<SourceScan> {
  const scan: SourceScan = { files: [], leftInPlace: [], skipped: [] };
  await walk(root, "", scan);
  return scan;
}

async function walkTarget(root: string, rel: string, out: string[]): Promise<void> {
  for (const name of await listDir(under(root, rel))) {
    const path = rel ? `${rel}/${name}` : name;
    const info = await lstat(under(root, path));
    if (info.isDirectory()) {
      const enters = path === TARGET_SECRETS_DIR || path === "backups" || path.startsWith("backups/legacy");
      if (enters) await walkTarget(root, path, out);
    } else if (info.isFile() && isLayoutTarget(path)) {
      out.push(path);
    }
  }
}

/** Files in the data directory that the layout fills (relative paths). */
export async function scanTarget(root: string): Promise<string[]> {
  const out: string[] = [];
  await walkTarget(root, "", out);
  return out;
}

/** Create `dir` and its parents; only `dir` itself gets `mode` (parents keep the default). */
export async function ensureDir(dir: string, mode?: number): Promise<void> {
  if (mode === undefined) {
    await mkdir(dir, { recursive: true });
    return;
  }
  await mkdir(dirname(dir), { recursive: true });
  await mkdir(dir, { recursive: true, mode });
  await chmod(dir, mode);
}

/**
 * Copy `from` to `to` through a temporary file next to `to`, check the copy's hash, then rename it into place.
 * Refuses to replace an existing file unless `replace` is set. Secret files get mode 0600 in a 0700 folder.
 */
export async function copyVerified(from: string, to: string, expectedSha256: string, options: { secret: boolean; replace?: boolean }): Promise<void> {
  await ensureDir(dirname(to), options.secret ? SECRET_DIR_MODE : undefined);
  if (!options.replace && (await fileStat(to))) throw new Error(`${to} already exists`);
  const temp = `${to}.${randomBytes(6).toString("hex")}.migrate-tmp`;
  try {
    await copyFile(from, temp);
    if (options.secret) await chmod(temp, SECRET_FILE_MODE);
    const got = await sha256File(temp);
    if (got !== expectedSha256) throw new Error(`copy of ${from} does not match (sha256 ${got.slice(0, 12)}…, expected ${expectedSha256.slice(0, 12)}…)`);
    await rename(temp, to);
  } catch (error) {
    await rm(temp, { force: true });
    throw error;
  }
}

/** Move a file within one filesystem, creating the destination folder. */
export async function moveFile(from: string, to: string, secret: boolean): Promise<void> {
  await ensureDir(dirname(to), secret ? SECRET_DIR_MODE : undefined);
  await rename(from, to);
}

/** Remove now-empty folders below `root`, deepest first; never `root` itself and never a folder with anything left in it. */
export async function removeEmptyDirs(root: string, rels: readonly string[]): Promise<void> {
  const dirs = new Set<string>();
  for (const rel of rels) {
    const parts = rel.split("/");
    for (let i = parts.length - 1; i > 0; i -= 1) dirs.add(parts.slice(0, i).join("/"));
  }
  const deepestFirst = [...dirs].sort((a, b) => b.split("/").length - a.split("/").length);
  for (const dir of deepestFirst) {
    if ((await listDir(under(root, dir))).length > 0) continue;
    try {
      await rmdir(under(root, dir));
    } catch (error) {
      // Cosmetic step: a folder that vanished or filled up in the meantime simply stays (or is already gone).
      if (errorCode(error) !== "ENOENT" && errorCode(error) !== "ENOTEMPTY") throw error;
    }
  }
}

/** Parsed JSON, or null when the file is missing or is not valid JSON. */
export async function readJsonFile(path: string): Promise<unknown> {
  let text: string;
  try {
    text = await readFile(path, "utf8");
  } catch (error) {
    if (errorCode(error) === "ENOENT") return null;
    throw error;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
