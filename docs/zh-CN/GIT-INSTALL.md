# Git 安装与现有 daemon 的来源切换

[English](../GIT-INSTALL.md)

Paseo 0.11 将选定 Git 版本克隆到受管目录，不会仅根据 lockfile 自动安装依赖。
本仓库在 manifest 的 `build` 中声明 `node server/prepare.mjs`。Git checkout
先运行 `npm ci --include=dev --ignore-scripts --no-audit --no-fund`，再运行
`npm run build`，然后才编译并激活插件。显式包含开发依赖也适用于 daemon 设置
`NODE_ENV=production` 的情况。daemon 的 PATH 须包含 Node >=22.13 和 npm。

准备脚本还为每份新取得的安装包写入唯一安装标记。ESM 命令从自身模块定位；
Paseo 的 CJS 服务端包装在 staging 移到正式受管目录后通过此标记定位，
避免宿主激活升级时仍读到旧配置路径。标记不含宿主绝对路径，每次准备都会刷新。

服务端 API 类型来自 `@getpaseo/plugin/server` 的 `PluginHandlerContext["paseo"]`。
后台任务在首个 handler 或 hook 运行前也需要连接；`npm run build` 从开发依赖中的
客户端 SDK 生成 `server/paseo-client.bundle.mjs`，其 protocol、relay、Zod 是锁定的
生产依赖。服务端导入此本地生成文件；CLI 和服务端 bundle 含第三方代码，已被 Git
忽略，不要提交。修改输入或 SDK 后重新构建，插件 ID、界面和注册方式不变。

`bin/build-commands.mjs` 生成 roles、doctor、migrate、coupon、leader 五个 CLI
bundle，加上后台客户端共六个文件；准备脚本要求全部存在，npm 包也包含这六个文件。
Paseo 提供 Zod 和支持的 SDK 运行时入口，普通 Node 模块仍须声明依赖。
共享代码（含类型导入）须保持运行时中立。开发机 node_modules 下的离线构建不足以
证明 Git 发版可用；应在全新 daemon home 中测试初始没有依赖和 bundle 的 tag checkout。
安装需要 registry 网络，以及安装开发工具和构建源码所需的时间与空间。

准备流程与 Kanban 相同：普通 Node 入口安装包含开发工具的依赖、禁用 lifecycle scripts，
在 Git checkout 中构建被忽略的 bundle，并检查文件齐全。AFC 还构建后台 Node 客户端，
保留其普通 ESM 导入所需的 protocol 和 relay 生产依赖。

`npm run pack:check` 和 npm 的 `prepack` 在检查或打包白名单前构建 bundle。
npm 包保留准备入口，不包含 lockfile 和仓库构建工具，但已带预构建文件。
准备脚本在没有 lockfile 时改用 `npm install --include=dev --ignore-scripts --no-audit --no-fund`，
只验证预打包文件，不调用省略的构建工具。

参考：[发布](https://github.com/getpaseo/paseo/blob/main/public-docs/plugins/publishing.md)、
[运行时与 CLI](https://github.com/getpaseo/paseo/blob/main/public-docs/plugins/reference.md)。

## 隔离验证

在本任务临时目录下新建 home。启动 daemon 前写好 `config.json`：使用不同的
`daemon.listen`，禁用 relay，并通过 `agents.providers` 禁用 providers。
HOME、PASEO_HOME、AFC_DATA_DIR、AFC_LEGACY_DATA_DIR、KANBAN_DATA_DIR、ROLES_STATE_DIR
均指向隔离目录。使用内置 Web UI 和独立浏览器 profile；用 `--host` 明确指定隔离端点，
不要同时使用 `--host` 和 `--home`。

发版检查须覆盖临时 tag 的 `file://` 安装、`running` 状态、ID `agent-fleet-cockpit`、
后台日志、真实 cockpit 与设置页面、安装目录的 `node bin/afc.mjs --help`、`leader --help`、
`roles ls`、`update --check --ref`，以及移除后 plugin-data 标记仍在。之后只删除测试 tag。
全新 daemon 可能没有 agent 记录或角色档案，未配置的派活槽位会告警；这与编译或运行时错误不同。

命令块请用 Bash 或 POSIX `sh` 执行。直接粘贴到 zsh 可能出现 `bad substitution`；
在 zsh 中先运行 `bash`。

## 日常 AFC 切换清单

这些命令是操作手册，不是自动迁移。只在选定日常 daemon 的 shell 中、发版 tag 已审查后执行。
切换 AFC 时会暂停该 daemon 的所有插件，避免新插件在恢复设置前运行；恢复原全局开关后，
其他插件也会恢复。

设置仓库、批准的 tag、checkout 外的新备份目录和命令 shim 目录。保留旧目录来源用于回退，
并先核对 AFC_DATA_DIR 和 ROLES_STATE_DIR 覆盖值。备份只含 AFC 来源和启用状态、插件设置、
命令 shim，不复制 daemon 配置或凭证。下面代码与英文版相同，切换与回退共用函数。

```sh
set -eu
export PASEO_HOME="${PASEO_HOME:-$HOME/.paseo}"
AFC_REPO="/absolute/path/to/paseo-fleet"
AFC_TAG="<approved-release-tag>"
AFC_BACKUP="/absolute/path/to/new-afc-switch-backup"
AFC_SHIM_DIR="$HOME/.local/bin"
export AFC_BACKUP AFC_SHIM_DIR
p() { paseo --home "$PASEO_HOME" "$@"; }

# Confirm this is the selected daily daemon and the current source is a directory.
p status --json
mkdir -m 700 "$AFC_BACKUP"
p plugin ls agent-fleet-cockpit --json > "$AFC_BACKUP/plugin-before.json"
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const home = process.env.PASEO_HOME, backup = process.env.AFC_BACKUP;
const cfg = JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8"));
const raw = JSON.parse(fs.readFileSync(path.join(backup, "plugin-before.json"), "utf8"));
const plugin = Array.isArray(raw) ? raw.find(row => row.id === "agent-fleet-cockpit") : raw;
const identity = plugin?.installation?.identity;
const oldDirectory = identity ? (identity.kind === "directory" ? identity.path : null)
  : (plugin?.source === "git" ? null : plugin?.path);
if (!oldDirectory) throw new Error("Expected the old directory source");
const state = { oldDirectory, enabled: plugin.enabled,
  pluginsEnabled: cfg.pluginsEnabled === true, shims: {} };
fs.mkdirSync(path.join(backup, "shims"));
for (const name of ["afc", "roles"]) {
  const from = path.join(process.env.AFC_SHIM_DIR, name);
  try {
    fs.lstatSync(from);
    fs.cpSync(from, path.join(backup, "shims", name), { dereference: false, verbatimSymlinks: true });
    state.shims[name] = true;
  } catch (error) { if (error.code !== "ENOENT") throw error; state.shims[name] = false; }
}
fs.writeFileSync(path.join(backup, "state.json"), JSON.stringify(state, null, 2), { mode: 0o600 });
NODE

# Poll after restoring/reloading; rollback uses this function too.
afc_wait() {
  AFC_EXPECTED="$(node -e 'const fs=require("node:fs");const s=JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/state.json"));console.log(s.enabled && s.pluginsEnabled ? "running" : "disabled")')"
  AFC_ATTEMPT=0
  while :; do
    if p plugin ls agent-fleet-cockpit --json > "$AFC_BACKUP/plugin-status.json"; then
      if AFC_STATUS="$(node -e 'const fs=require("node:fs");const raw=JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/plugin-status.json"));const p=Array.isArray(raw) ? raw.find(p=>p.id==="agent-fleet-cockpit") : raw;console.log(p?.status || "unknown")')"; then
        if [ "$AFC_STATUS" = "$AFC_EXPECTED" ]; then
          cat "$AFC_BACKUP/plugin-status.json"
          p plugin logs agent-fleet-cockpit --json
          return 0
        fi
      fi
    fi
    if [ "$AFC_ATTEMPT" -ge 30 ]; then
      echo "AFC did not reach $AFC_EXPECTED within 60 seconds; inspect logs before rollback." >&2
      p plugin logs agent-fleet-cockpit --json
      return 1
    fi
    sleep 2
    AFC_ATTEMPT=$((AFC_ATTEMPT + 1))
  done
}

# Define pause and restore functions once; rollback uses the same functions.
afc_pause() {
  node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const file = path.join(process.env.PASEO_HOME, "config.json");
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
cfg.pluginsEnabled = false;
fs.writeFileSync(file, JSON.stringify(cfg, null, 2), { mode: 0o600 });
NODE
  p reload --json
}
afc_restore() {
  node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const from = path.join(process.env.AFC_BACKUP, "settings");
const to = path.join(process.env.PASEO_HOME, "plugin-settings", "agent-fleet-cockpit");
fs.rmSync(to, { recursive: true, force: true });
if (fs.existsSync(from)) fs.cpSync(from, to, { recursive: true });
NODE
  AFC_ENABLED="$(node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/state.json")).enabled ? "yes" : "no")')"
  if [ "$AFC_ENABLED" = yes ]; then p plugin enable agent-fleet-cockpit --json
  else p plugin disable agent-fleet-cockpit --json; fi
  node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const file = path.join(process.env.PASEO_HOME, "config.json");
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
const state = JSON.parse(fs.readFileSync(path.join(process.env.AFC_BACKUP, "state.json"), "utf8"));
cfg.pluginsEnabled = state.pluginsEnabled;
fs.writeFileSync(file, JSON.stringify(cfg, null, 2), { mode: 0o600 });
NODE
  p reload --json
}

# Stop plugin activity before taking a consistent settings backup.
afc_pause
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const from = path.join(process.env.PASEO_HOME, "plugin-settings", "agent-fleet-cockpit");
if (fs.existsSync(from)) fs.cpSync(from, path.join(process.env.AFC_BACKUP, "settings"), { recursive: true });
NODE

# Removal preserves the old directory and plugin-data, but clears plugin-settings.
p plugin remove agent-fleet-cockpit --json
p plugin install "file://$AFC_REPO" --ref "$AFC_TAG" --json > "$AFC_BACKUP/plugin-after.json"
afc_restore
afc_wait

# Point both commands at the installed, already-built Node entry, with the correct home.
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const plugin = JSON.parse(fs.readFileSync(path.join(process.env.AFC_BACKUP, "plugin-after.json"), "utf8"));
const entry = path.join(plugin.path, "bin", "afc.mjs");
const commands = ["roles", "doctor", "migrate", "coupon", "leader"];
if (!fs.existsSync(entry) || commands.some(name => !fs.existsSync(path.join(plugin.path, "bin", `${name}.bundle.mjs`))))
  throw new Error("Installed commands are missing");
const quote = value => "'" + value.replaceAll("'", "'\\''") + "'";
fs.mkdirSync(process.env.AFC_SHIM_DIR, { recursive: true });
for (const name of ["afc", "roles"]) {
  const target = path.join(process.env.AFC_SHIM_DIR, name);
  const script = `#!/bin/sh\nset -eu\nexport PASEO_HOME=${quote(process.env.PASEO_HOME)}\n` +
    `exec node ${quote(entry)}${name === "roles" ? " roles" : ""} "$@"\n`;
  fs.rmSync(target, { force: true });
  fs.writeFileSync(target, script, { mode: 0o755 });
}
NODE

# Check identity, revision, data and the built commands after afc_wait.
p plugin update agent-fleet-cockpit --check --ref "$AFC_TAG" --json
"$AFC_SHIM_DIR/afc" --help
"$AFC_SHIM_DIR/afc" leader --help
"$AFC_SHIM_DIR/roles" ls

# Verify the exported CLI against the currently running installation.
p plugin ls agent-fleet-cockpit --json > "$AFC_BACKUP/plugin-status.json"
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const raw = JSON.parse(fs.readFileSync(path.join(process.env.AFC_BACKUP, "plugin-status.json"), "utf8"));
const plugin = Array.isArray(raw) ? raw.find(row => row.id === "agent-fleet-cockpit") : raw;
const data = process.env.AFC_DATA_DIR || path.join(process.env.PASEO_HOME, "plugin-data", "agent-fleet-cockpit");
const info = JSON.parse(fs.readFileSync(path.join(data, "exports", "cockpit.json"), "utf8"));
if (!info.cli || info.cli !== path.join(plugin.path, "bin", "afc.mjs") || !fs.statSync(info.cli).isFile())
  throw new Error("cockpit.json CLI does not name the current installation");
fs.accessSync(info.cli, fs.constants.X_OK);
console.log("cockpit.json CLI matches the current installation and is executable");
NODE
```

reload 或恢复全局开关后，`plugin ls` 可能让 AFC 和其他插件短暂显示 `failed`，
5–10 秒后变成 `running`，且日志没有错误。每次恢复／reload 并恢复插件运行后，使用
`afc_wait`：在选定 home 上轮询 `paseo plugin ls agent-fleet-cockpit --json`，
每 2 秒一次，最多等待 60 秒（另加命令执行时间）。两个保存的开关均开启时等待 `running`，
否则等待 `disabled`。短暂状态不算失败；只有超时仍未到预期状态才判状态检查失败并进入回退。
判断切换成功或需要回退时，同时检查 `plugin logs` 是否有编译或初始化错误。

reload 输出的 `restartRequiredPaths: plugins.agent-fleet-cockpit.path` 表示来源路径变更。
若列表确认 AFC 已从新安装路径 `running` 且日志无错，不必重启 daemon；
若仍使用旧路径，才需重启选定 daemon，然后再次运行 `afc_wait` 并检查日志。
保存状态为关闭时，核对新路径与 `disabled` 状态。

确认 Git 来源 identity、批准 tag 的 commit，以及两个保存开关均开启时的 `running`
（否则为 `disabled`）。打开日常 host 的 AFC cockpit 和设置页，确认语言、配置、plugin-data
仍在，并检查编译或初始化错误。`afc` shim 已包含 `afc leader`，无需独立 leader shim。
确认 `exports/cockpit.json` 的 `cli` 指向当前安装目录的 `bin/afc.mjs` 且可执行，
上面的命令会核对这项。CLI 为 null 或指向旧安装目录都算失败，须查看插件日志中的警告。
用 `command -v afc` 和 `command -v roles` 确认选中了这些 shim。Git 更新会替换受管目录，
每次应用更新后须重新生成 shim；普通 update 检查默认 HEAD，要保留发版版本须显式 `--ref`。

若安装、60 秒状态检查或其他检查失败，保持插件暂停，并在同一 shell 中回退。
从未修改的备份再次恢复设置，恢复旧来源和启用状态，再恢复旧 shim；旧目录须仍有原依赖和构建产物。

```sh
afc_pause
# If a failed install left no AFC entry, skip this remove command.
p plugin remove agent-fleet-cockpit --json
AFC_OLD_DIRECTORY="$(node -e 'const fs=require("node:fs");console.log(JSON.parse(fs.readFileSync(process.env.AFC_BACKUP+"/state.json")).oldDirectory)')"
p plugin install "$AFC_OLD_DIRECTORY" --json
afc_restore
afc_wait
node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
const backup = process.env.AFC_BACKUP;
const state = JSON.parse(fs.readFileSync(path.join(backup, "state.json"), "utf8"));
for (const name of ["afc", "roles"]) {
  const target = path.join(process.env.AFC_SHIM_DIR, name);
  fs.rmSync(target, { force: true });
  if (state.shims[name]) fs.cpSync(path.join(backup, "shims", name), target,
    { dereference: false, verbatimSymlinks: true });
}
NODE
if [ -x "$AFC_SHIM_DIR/afc" ]; then "$AFC_SHIM_DIR/afc" --help; fi
if [ -x "$AFC_SHIM_DIR/roles" ]; then "$AFC_SHIM_DIR/roles" ls; fi
```

回退后使用相同的轮询和日志检查，不要把首次列表状态判为最终失败。
保留备份，直到选定日常 daemon 已被独立检查。这些命令不迁移、替换或删除 AFC plugin-data。
