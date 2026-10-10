import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/zod/v4/core/util.js
var util_exports = {};
__export(util_exports, {
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
  CONSTANT_CATCH: () => CONSTANT_CATCH,
  Class: () => Class,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  aborted: () => aborted,
  allowsEval: () => allowsEval,
  assert: () => assert,
  assertEqual: () => assertEqual,
  assertIs: () => assertIs,
  assertNever: () => assertNever,
  assertNotEqual: () => assertNotEqual,
  assignProp: () => assignProp,
  attachSchema: () => attachSchema,
  base64ToUint8Array: () => base64ToUint8Array,
  base64urlToUint8Array: () => base64urlToUint8Array,
  cached: () => cached,
  captureStackTrace: () => captureStackTrace,
  cleanEnum: () => cleanEnum,
  cleanRegex: () => cleanRegex,
  clone: () => clone,
  cloneDef: () => cloneDef,
  codePointLength: () => codePointLength,
  constantCatch: () => constantCatch,
  createTransparentProxy: () => createTransparentProxy,
  defineLazy: () => defineLazy,
  defineLazyInternal: () => defineLazyInternal,
  derived: () => derived,
  esc: () => esc,
  escapeRegex: () => escapeRegex,
  explicitlyAborted: () => explicitlyAborted,
  extend: () => extend,
  finalizeIssue: () => finalizeIssue,
  floatSafeRemainder: () => floatSafeRemainder,
  getElementAtPath: () => getElementAtPath,
  getEnumValues: () => getEnumValues,
  getLengthableOrigin: () => getLengthableOrigin,
  getParsedType: () => getParsedType,
  getSizableOrigin: () => getSizableOrigin,
  hexToUint8Array: () => hexToUint8Array,
  hide: () => hide,
  installLazyProp: () => installLazyProp,
  isObject: () => isObject,
  isPlainObject: () => isPlainObject,
  issue: () => issue,
  joinValues: () => joinValues,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  members: () => members,
  merge: () => merge,
  mergeDefs: () => mergeDefs,
  normalizeParams: () => normalizeParams,
  nullish: () => nullish,
  numKeys: () => numKeys,
  objectClone: () => objectClone,
  omit: () => omit,
  optionalKeys: () => optionalKeys,
  own: () => own,
  parsedType: () => parsedType,
  partial: () => partial,
  pick: () => pick,
  prefixIssues: () => prefixIssues,
  primitiveTypes: () => primitiveTypes,
  promiseAllObject: () => promiseAllObject,
  propertyKeyTypes: () => propertyKeyTypes,
  randomString: () => randomString,
  rawShape: () => rawShape,
  required: () => required,
  safeExtend: () => safeExtend,
  shallowClone: () => shallowClone,
  slugify: () => slugify,
  stringifyPrimitive: () => stringifyPrimitive,
  toZod: () => toZod,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToHex: () => uint8ArrayToHex,
  unwrapMessage: () => unwrapMessage
});
function assertEqual(val) {
  return val;
}
function assertNotEqual(val) {
  return val;
}
function toZod() {
  return (schema) => schema;
}
function assertIs(_arg) {
}
function assertNever(_x) {
  throw new Error("Unexpected value in exhaustive check");
}
function assert(_) {
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array2, separator = "|") {
  return array2.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
var Cached = class {
  constructor(getter) {
    this._getter = getter;
    this._value = void 0;
  }
  get value() {
    const getter = this._getter;
    if (getter !== void 0) {
      this._value = getter();
      this._getter = void 0;
    }
    return this._value;
  }
};
function cached(getter) {
  return new Cached(getter);
}
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object2, key, getter) {
  let value = void 0;
  Object.defineProperty(object2, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object2, key, {
        value: v
        // configurable: true,
      });
    },
    configurable: true
  });
}
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function rawShape(def) {
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
  return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
  Object.defineProperty(target, key, {
    get() {
      const value = getter();
      assignProp(this, key, value);
      return value;
    },
    enumerable: true,
    configurable: true
  });
}
function putProp(target, key, value) {
  if (key in target)
    assignProp(target, key, value);
  else
    target[key] = value;
}
function mirrorShape(target, source, keys, wrap) {
  const raw = sourceShape(source);
  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(raw, key);
    if (!desc.enumerable)
      continue;
    if (desc.get) {
      deferProp(target, key, () => {
        const value = source._zod.def.shape[key];
        return wrap ? wrap(value, key) : value;
      });
    } else
      putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
  }
}
function mirrorProps(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp(target, key, () => source[key]);
    else
      putProp(target, key, desc.value);
  }
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
  if (!path)
    return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i = 0; i < keys.length; i++) {
      resolvedObj[keys[i]] = results[i];
    }
    return resolvedObj;
  });
}
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str2 = "";
  for (let i = 0; i < length; i++) {
    str2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return str2;
}
function esc(str2) {
  return JSON.stringify(str2);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
var getParsedType = (data) => {
  const t2 = typeof data;
  switch (t2) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t2}`);
  }
};
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
var primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function escapeRegex(str2) {
  return str2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value, receiver);
    },
    has(_, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = /* @__PURE__ */ (() => ({
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const newShape = {};
  mirrorShape(newShape, schema, maskedKeys(schema, mask));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function maskedKeys(schema, mask) {
  const raw = sourceShape(schema);
  const keys = [];
  for (const key of Reflect.ownKeys(mask)) {
    if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) {
      throw new Error(`Unrecognized key: "${String(key)}"`);
    }
    if (mask[key])
      keys.push(key);
  }
  return keys;
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const omitted = new Set(maskedKeys(schema, mask));
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = sourceShape(schema);
    for (const key of Reflect.ownKeys(shape)) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
  mirrorProps(newShape, shape);
  return newShape;
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
  if (!b?._zod?.def) {
    throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  }
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const newShape = {};
  mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
  mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
  const def = mergeDefs(a._zod.def, {
    shape: newShape,
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class2, schema, mask, name = "partial") {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
  }
  const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class2 && ((value, key) => selected && !selected.has(key) ? value : new Class2({ type: "optional", innerType: value })));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape, checks: [] }));
}
function required(Class2, schema, mask) {
  const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => (
    // overwrite with non-optional
    selected && !selected.has(key) ? value : new Class2({ type: "nonoptional", innerType: value })
  ));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a3;
    (_a3 = iss).path ?? (_a3.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
  var _a3;
  for (let i = start; i < issues.length; i++) {
    (_a3 = issues[i]).schema ?? (_a3.schema = inst);
  }
}
function finalizeIssue(iss, ctx, config2) {
  var _a3;
  const traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType")) {
    if (traits.has("$ZodCheck"))
      (_a3 = iss).schema ?? (_a3.schema = iss.inst);
    else
      iss.schema = iss.inst;
  }
  const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const full = {};
  for (const k of Object.keys(iss)) {
    if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__")
      continue;
    full[k] = iss[k];
  }
  full.path ?? (full.path = []);
  full.message = message;
  if (ctx?.reportInput) {
    full.input = iss.input;
  }
  return full;
}
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
var highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str2) {
  const units = str2.length;
  if (!highSurrogate.test(str2))
    return units;
  let count = units;
  for (let i = 0; i < units - 1; i++) {
    if ((str2.charCodeAt(i) & 64512) === 55296 && (str2.charCodeAt(i + 1) & 64512) === 56320) {
      count--;
      i++;
    }
  }
  return count;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  const t2 = typeof data;
  switch (t2) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t2;
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k, _]) => {
    return Number.isNaN(Number.parseInt(k, 10));
  }).map((el) => el[1]);
}
function base64ToUint8Array(base642) {
  const binaryString = atob(base642);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}
function base64urlToUint8Array(base64url2) {
  const base642 = base64url2.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base642.length % 4) % 4);
  return base64ToUint8Array(base642 + padding);
}
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
  const cleanHex = hex.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var Class = class {
  constructor(..._args) {
  }
};
function members(proto, table) {
  for (const key in table) {
    const desc = Object.getOwnPropertyDescriptor(table, key);
    if (desc.get)
      Object.defineProperty(proto, key, { ...desc, enumerable: false });
    else
      defineBound(proto, key, desc.value);
  }
}
function own(inst, key, value, enumerable = true) {
  Object.defineProperty(inst, key, { configurable: true, writable: true, enumerable, value });
  return value;
}
function hide(inst, key, value) {
  return own(inst, key, value, false);
}
// @__NO_SIDE_EFFECTS__
function derived(computes, table) {
  for (const key in computes) {
    const compute = computes[key];
    Object.defineProperty(table, key, {
      configurable: true,
      enumerable: true,
      get() {
        return own(this, key, compute(this));
      },
      set(value) {
        own(this, key, value);
      }
    });
  }
  return table;
}
function defineBound(proto, key, fn) {
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      return this == null ? fn : own(this, key, fn.bind(this));
    },
    set(value) {
      own(this, key, value);
    }
  });
}
function claim(inst, sentinel) {
  const proto = Object.getPrototypeOf(inst);
  return sentinel in proto ? void 0 : proto;
}
var installing;
var broke = false;
var breaker = {
  configurable: true,
  get() {
    broke = true;
    return void 0;
  }
};
function defineLazyInternal(inst, key, compute) {
  const proto = Object.getPrototypeOf(inst._zod);
  if (key in proto && installing !== inst._zod) {
    installing = void 0;
    return;
  }
  installing = inst._zod;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      Object.defineProperty(this, key, breaker);
      const outer = broke;
      broke = false;
      try {
        const value = compute(this);
        if (broke)
          delete this[key];
        else
          Object.defineProperty(this, key, { configurable: true, writable: true, value });
        broke = broke || outer;
        return value;
      } catch (err) {
        delete this[key];
        broke = broke || outer;
        throw err;
      }
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, value });
    }
  });
}
function installLazyProp(inst, key, make, enumerable) {
  const proto = claim(inst, key);
  if (!proto)
    return;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      const desc = { configurable: true, writable: true, enumerable, value: void 0 };
      Object.defineProperty(this, key, desc);
      desc.value = make(this);
      Object.defineProperty(this, key, desc);
      return desc.value;
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, enumerable, value });
    }
  });
}
var CONSTANT_CATCH = "~constantCatch";
function constantCatch(value) {
  const fn = () => value;
  fn[CONSTANT_CATCH] = true;
  return fn;
}

// node_modules/zod/v4/core/core.js
var _a;
var _zodDesc = { value: void 0, enumerable: false };
var _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
  const E = _E;
  if (E) {
    const saved = E.stackTraceLimit;
    if (typeof saved === "number") {
      try {
        E.stackTraceLimit = 0;
      } catch {
        _E = null;
        return new Definition();
      }
      try {
        return new Definition();
      } finally {
        E.stackTraceLimit = saved;
      }
    }
  }
  return new Definition();
}
// @__NO_SIDE_EFFECTS__
function $constructor(name, initializer3, proto, params) {
  const zodProto = {};
  function Internals(def) {
    this.def = def;
    this.constr = _;
    this.traits = /* @__PURE__ */ new Set();
  }
  Internals.prototype = zodProto;
  const protoMembers = proto;
  const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
  function init(inst, def) {
    if (!inst._zod) {
      _zodDesc.value = new Internals(def);
      try {
        Object.defineProperty(inst, "_zod", _zodDesc);
      } finally {
        _zodDesc.value = void 0;
      }
    } else if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer3(inst, def);
    if (initialized) {
      const own2 = Object.getPrototypeOf(inst);
      const ctorProto = inst._zod.constr.prototype;
      let up = own2;
      while (up && up !== ctorProto)
        up = Object.getPrototypeOf(up);
      const target = up ?? own2;
      if (!initialized.has(target)) {
        initialized.add(target);
        members(target, protoMembers);
      }
    }
    const proto2 = _.prototype;
    for (const k in proto2) {
      if (!Object.prototype.hasOwnProperty.call(proto2, k))
        continue;
      if (!(k in inst)) {
        inst[k] = proto2[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    const inst = params?.Parent ? newError(Definition) : this;
    init(inst, def);
    const deferred = inst._zod.deferred;
    if (deferred) {
      for (const fn of deferred) {
        fn();
      }
      inst._zod.deferred = void 0;
    }
    const pp = globalThis.__zod_globalConfig?.postProcessor;
    if (pp)
      pp(inst);
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $ZodAsyncError = class extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
};
var $ZodEncodeError = class extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
};
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}

// node_modules/zod/v4/core/errors.js
function _getMessage() {
  const internals = this._zod;
  internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
  return internals.message;
}
function _setMessage(value) {
  this._zod.message = value;
}
var _messageDesc = {
  get: _getMessage,
  set: _setMessage,
  enumerable: true,
  configurable: true
};
var _issuesDesc = { value: void 0, enumerable: false };
var _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  _issuesDesc.value = def;
  Object.defineProperty(inst, "issues", _issuesDesc);
  _issuesDesc.value = void 0;
  Object.defineProperty(inst, "message", _messageDesc);
  const proto = Object.getPrototypeOf(inst);
  if (!_installedToString.has(proto)) {
    _installedToString.add(proto);
    Object.defineProperty(proto, "toString", {
      configurable: true,
      enumerable: false,
      get() {
        const value = () => this.message;
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
        return value;
      },
      set(value) {
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
      }
    });
  }
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, void 0, {
  Parent: Error
});
function node(obj, key, make) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    if (key === "__proto__") {
      Object.defineProperty(obj, key, { value: make(), writable: true, enumerable: true, configurable: true });
    } else {
      obj[key] = make();
    }
  }
  return obj[key];
}
function flattenError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error2.issues) {
    if (sub.path.length > 0) {
      node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error3, path = []) => {
    for (const issue2 of error3.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (el === "_errors") {
              if (terminal)
                curr._errors.push(mapper(issue2));
              i++;
              continue;
            }
            if (!Object.prototype.hasOwnProperty.call(curr, el)) {
              Object.defineProperty(curr, el, {
                value: { _errors: [] },
                enumerable: true,
                writable: true,
                configurable: true
              });
            }
            const node2 = curr[el];
            if (terminal) {
              node2._errors.push(mapper(issue2));
            }
            curr = node2;
            i++;
          }
        }
      }
    }
  };
  processError(error2);
  return fieldErrors;
}

// node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
  return { callee: params?.callee ?? callee, Err: params?.Err };
}
var _parse = (_Err) => {
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    if (result.issues.length) {
      const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, _params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _parseAsync = (_Err) => {
  const fn = async (schema, value, _ctx, params) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
function failure(Err, issues, ctx) {
  let error2;
  return {
    success: false,
    get error() {
      if (!error2) {
        error2 = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
        issues = void 0;
        ctx = void 0;
      }
      return error2;
    },
    set error(e) {
      error2 = e;
      issues = void 0;
      ctx = void 0;
    }
  };
}
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
var COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
var COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
var validate = ((schema, value, _ctx) => {
  const validator = schema._zod.bag.validator;
  if (validator !== void 0) {
    if (validator(value) !== COMPILE_INVALID)
      return true;
    if (validator.definite === true && _ctx === void 0)
      return false;
  }
  return validateFallback(schema, value, _ctx);
});
function validateFallback(schema, value, _ctx) {
  const ctx = _ctx ? { ..._ctx, async: false, abortEarly: true } : { async: false, abortEarly: true };
  const fallbackRun = schema._zod.bag.fallbackRun;
  let result;
  if (fallbackRun) {
    ctx[COMPILE_FALLBACK] = true;
    result = fallbackRun({ value, issues: [] }, ctx);
  } else {
    result = schema._zod.run({ value, issues: [] }, ctx);
  }
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length === 0;
}
var validateAsync = async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true, abortEarly: true } : { async: true, abortEarly: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length === 0;
};
var _encode = (_Err) => {
  const parse2 = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return parse2(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decode = (_Err) => {
  const parse2 = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    return parse2(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _encodeAsync = (_Err) => {
  const parseAsync2 = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return await parseAsync2(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decodeAsync = (_Err) => {
  const parseAsync2 = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    return await parseAsync2(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};

// node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version2) => {
  if (!version2)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
function anchor(source) {
  return new RegExp(`^${source}$`);
}
var date = /* @__PURE__ */ anchor(dateSource);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const opts = ["Z"];
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const qualified = `${timeSource({ precision: args.precision, seconds: true })}(?:${opts.join("|")})`;
  const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var anyString = /^[\s\S]{0,}$/;
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a3;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a3 = inst._zod).onattach ?? (_a3.onattach = []);
});
var _whenHasLength = (payload) => {
  const val = payload.value;
  return !nullish(val) && val.length !== void 0;
};
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? (
      // `value % 0n` throws, and nothing is a multiple of zero — the number branch already fails this way via NaN
      def.value !== BigInt(0) && payload.value % def.value === BigInt(0)
    ) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units > def.maximum ? codePointLength(input) : units;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a3, _b;
  $ZodCheck.init(inst, def);
  if (def.pattern)
    (_a3 = inst._zod).check ?? (_a3.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {
    });
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
var Doc = class {
  constructor(args = [], closed = {}) {
    this.content = [];
    this.indent = 0;
    this.args = args;
    this.closed = closed;
  }
  // the compiler catches a child's throw and keeps writing into this doc, so the indent has to unwind with it
  indented(fn) {
    this.indent += 1;
    try {
      fn(this);
    } finally {
      this.indent -= 1;
    }
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split("\n").filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const content = this?.content ?? [``];
    const factory = new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${content.join("\n")}
};`);
    return factory(...Object.values(this.closed));
  }
};

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 6,
  patch: 5
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a3;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const defChecks = inst._zod.def.checks;
  const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks2, ctx) => {
      if (payload.memo)
        return payload;
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks2) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            attachSchema(payload.issues, currLen, inst);
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          attachSchema(payload.issues, currLen, inst);
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return result.then((result2) => runChecks(result2, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
}, {
  // Wrappers extend this by installing a richer factory over it; reading it eagerly would defeat the laziness.
  get "~standard"() {
    return hide(this, "~standard", standardProps(this));
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  }
});
var toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync2(inst, value) {
  const ctx = { async: true };
  return toStandardResult(await inst._zod.run({ value, issues: [] }, ctx), ctx);
}
function standardProps(inst) {
  return {
    validate: (value) => {
      const ctx = { async: false };
      try {
        const r = inst._zod.run({ value, issues: [] }, ctx);
        if (!(r instanceof Promise))
          return toStandardResult(r, ctx);
      } catch (_) {
      }
      return validateAsync2(inst, value);
    },
    vendor: "zod",
    version: 1
  };
}
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = def.pattern ?? anyString;
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_2) {
      }
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === void 0)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var URL_BAD_FORMAT = 1;
var URL_UNPARSEABLE = 2;
function canParseURL(input) {
  try {
    if (typeof URL !== "undefined" && typeof URL.canParse === "function")
      return URL.canParse(input);
    new URL(input);
    return true;
  } catch {
    return false;
  }
}
function validateURL(trimmed, def) {
  if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) {
    return canParseURL(trimmed) || URL_UNPARSEABLE;
  }
  return parseURLObject(trimmed, def);
}
function parseURLObject(trimmed, def) {
  if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) {
    return URL_BAD_FORMAT;
  }
  try {
    if (typeof URL !== "undefined") {
      const URLStatic = URL;
      if (typeof URLStatic.parse === "function")
        return URLStatic.parse(trimmed) ?? URL_UNPARSEABLE;
    }
    return new URL(trimmed);
  } catch {
    return URL_UNPARSEABLE;
  }
}
var asciiTabOrNewline = /[\t\n\r]/g;
function stripTabAndNewline(value) {
  return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url2, hostname) {
  hostname.lastIndex = 0;
  return hostname.test(url2.hostname);
}
function urlProtocolOk(url2, protocol) {
  protocol.lastIndex = 0;
  return protocol.test(url2.protocol.endsWith(":") ? url2.protocol.slice(0, -1) : url2.protocol);
}
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      const url2 = validateURL(trimmed, def);
      if (url2 === URL_BAD_FORMAT) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url2 === URL_UNPARSEABLE) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url2 === true) {
        payload.value = stripTabAndNewline(trimmed);
        return;
      }
      if (def.hostname && !urlHostnameOk(url2, def.hostname)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid hostname",
          pattern: def.hostname.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      if (def.protocol && !urlProtocolOk(url2, def.protocol)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid protocol",
          pattern: def.protocol.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      payload.value = def.normalize ? url2.href : stripTabAndNewline(trimmed);
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1))
    throw new Error(`Invalid nanoid length: ${def.length}`);
  def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
});
var ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
  if (!ipv6Alphabet.test(value))
    return false;
  return canParseURL(`http://[${value}]`);
}
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidIPv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
  const parts = value.split("/");
  if (parts.length !== 2)
    return false;
  const [address, prefix] = parts;
  if (!prefix)
    return false;
  const prefixNum = Number(prefix);
  if (`${prefixNum}` !== prefix)
    return false;
  if (prefixNum < 0 || prefixNum > 128)
    return false;
  return isValidIPv6(address);
}
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidCIDRv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64Charset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
  if (!base64urlCharset.test(data))
    return false;
  const base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64urlCharset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null;
  inst._zod.values = /* @__PURE__ */ new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  const memo2 = globalConfig.memoizer;
  memo2?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo2 ? memo2.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
    const proms = [];
    const abortEarly = ctx?.abortEarly;
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
        if (abortEarly && result.issues.length !== 0 && aborted(result))
          break;
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, optin, optout) {
  const isPresent = key in input;
  const isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional") {
    return;
  }
  if (result.issues.length) {
    if (optin !== void 0 && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && optin === void 0) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    }
    return;
  }
  if (result.value === void 0) {
    if (isPresent || optin === "defaulted" && !isOptionalOut) {
      final.value[key] = void 0;
    }
  } else {
    final.value[key] = result.value;
  }
}
var NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  const ownSymbols = Object.getOwnPropertySymbols(def.shape);
  const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
  const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (const k of allKeys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    // string-only: handleCatchall matches it against `for...in`, which never yields a symbol
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t2 = _catchall.def.type;
  const optin = _catchall.optin;
  const optout = _catchall.optout;
  let seen = 0;
  for (const key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted(payload, seen))
        break;
      seen = payload.issues.length;
    }
    if (keySet.has(key))
      continue;
    if (key === "__proto__") {
      if (t2 === "never")
        unrecognized.push(key);
      continue;
    }
    if (t2 === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, optin, optout)));
    } else {
      handlePropertyResult(r, payload, key, input, optin, optout);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst,
      // Describes the shape of the input, not the validity of the parsed value, so it never aborts. The parse still fails; the schema's own checks just get to run first, and an enclosing intersection can reconcile the key against a sibling operand.
      continue: true
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  const sh = desc?.get ? desc.get.raw : def.shape ?? {};
  if (sh) {
    const get = () => {
      const newSh = { ...sh };
      Object.defineProperty(def, "shape", { value: newSh });
      get.raw = newSh;
      return newSh;
    };
    get.raw = sh;
    Object.defineProperty(def, "shape", { get });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazyInternal(inst, "propValues", (zod) => {
    const shape = zod.def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        if (!Object.prototype.hasOwnProperty.call(propValues, key)) {
          assignProp(propValues, key, /* @__PURE__ */ new Set());
        }
        for (const v of field.values)
          propValues[key].add(v);
        if (field.optin !== void 0)
          propValues[key].add(void 0);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  const memo2 = globalConfig.memoizer;
  memo2?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo2 ? memo2.alloc(inst, payload, {}, ctx) : {};
    const proms = [];
    const shape = value.shape;
    const abortEarly = ctx?.abortEarly;
    let seen = payload.issues.length;
    for (const key of value.allKeys) {
      if (abortEarly && payload.issues.length !== seen) {
        if (aborted(payload, seen))
          break;
        seen = payload.issues.length;
      }
      if (key === "__proto__")
        continue;
      const el = shape[key];
      const optin = el._zod.optin;
      const optout = el._zod.optout;
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, optin, optout)));
      } else {
        handlePropertyResult(r, payload, key, input, optin, optout);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const memo2 = globalConfig.memoizer;
  const generateFastpass = (shape) => {
    const normalized = _normalized.value;
    const syms = normalized.symbolKeys;
    const doc = new Doc(["payload", "ctx"], { shape, inst, memo: memo2, syms });
    const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
    doc.write(`const input = payload.value;`);
    const ids = /* @__PURE__ */ Object.create(null);
    let counter = 0;
    for (const key of normalized.allKeys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(memo2 ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
    for (const key of normalized.allKeys) {
      if (key === "__proto__")
        continue;
      const id = ids[key];
      const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
      const isPresent = `${k} in input`;
      const schema = shape[key];
      const optin = schema?._zod?.optin;
      const isOptionalIn = optin !== void 0;
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(k)};`);
      if (isOptionalIn && isOptionalOut) {
        const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
        doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
        if (optin === "defaulted") {
          doc.write(`newResult[${k}] = ${id}.value;`);
        } else {
          doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
        }
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    return doc.compile();
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
  defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
  defineLazyInternal(inst, "values", (zod) => {
    if (zod.def.options.every((o) => o._zod.values)) {
      return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return void 0;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    if (zod.def.options.every((o) => o._zod.pattern)) {
      const patterns = zod.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return void 0;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
function discriminatorMap(def) {
  const map = /* @__PURE__ */ new Map();
  for (const option of def.options) {
    const values = option._zod.propValues?.[def.discriminator];
    if (!values || values.size === 0)
      throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
    for (const value of values) {
      if (map.has(value)) {
        if (value !== void 0)
          throw new Error(`Duplicate discriminator value "${String(value)}"`);
        map.set(value, null);
      } else {
        map.set(value, option);
      }
    }
  }
  return map;
}
var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = false;
  $ZodUnion.init(inst, def);
  const _super = inst._zod.parse;
  defineLazyInternal(inst, "propValues", (zod) => {
    const propValues = {};
    let undefinedCount = 0;
    for (const option of zod.def.options) {
      const pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw new Error(`Invalid discriminated union option at index "${zod.def.options.indexOf(option)}"`);
      if (pv[zod.def.discriminator]?.has(void 0))
        undefinedCount++;
      for (const [k, v] of Object.entries(pv)) {
        if (!Object.prototype.hasOwnProperty.call(propValues, k)) {
          assignProp(propValues, k, /* @__PURE__ */ new Set());
        }
        for (const val of v) {
          propValues[k].add(val);
        }
      }
    }
    if (!zod.def.unionFallback && undefinedCount > 1)
      propValues[zod.def.discriminator]?.delete(void 0);
    return propValues;
  });
  def.options.forEach((option, i) => {
    const propShape = rawShape(option._zod.def);
    if (propShape && !Object.prototype.hasOwnProperty.call(propShape, def.discriminator)) {
      throw new Error(`Invalid discriminated union option at index "${i}"`);
    }
  });
  const disc = cached(() => discriminatorMap(def));
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      });
      return payload;
    }
    const value = input?.[def.discriminator];
    const opt = disc.value.get(value);
    if (opt && (value !== void 0 || ctx.direction !== "backward")) {
      return opt._zod.run(payload, ctx);
    }
    if (def.unionFallback || ctx.direction === "backward") {
      return _super(payload, ctx);
    }
    payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def.discriminator,
      options: Array.from(disc.value.keys()).filter((value2) => disc.value.get(value2) !== null),
      input,
      path: [def.discriminator],
      inst
    });
    return payload;
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (const key of sharedKeys) {
      if (key === "__proto__")
        continue;
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  const keyIssues = /* @__PURE__ */ new Map();
  const collect = (iss, side) => {
    let keys;
    if (iss.code === "unrecognized_keys" && !iss.path?.length) {
      unrecIssue ?? (unrecIssue = iss);
      keys = iss.keys;
    } else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
      const k = String(iss.path[0]);
      if (!keyIssues.has(k))
        keyIssues.set(k, iss);
      keys = [k];
    } else {
      return false;
    }
    for (const k of keys) {
      if (!unrecKeys.has(k))
        unrecKeys.set(k, {});
      unrecKeys.get(k)[side] = true;
    }
    return true;
  };
  for (const iss of left.issues) {
    if (!collect(iss, "l"))
      result.issues.push(iss);
  }
  for (const iss of right.issues) {
    if (!collect(iss, "r"))
      result.issues.push(iss);
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length) {
    const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
    if (aggregated.length)
      result.issues.push({ ...unrecIssue, keys: aggregated });
    for (const k of bothKeys) {
      if (!aggregated.includes(k) && keyIssues.has(k))
        result.issues.push(keyIssues.get(k));
    }
  }
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    if (aborted(result))
      return result;
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  const memo2 = globalConfig.memoizer;
  memo2?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values && !def.partial) {
      payload.value = memo2 ? memo2.alloc(inst, payload, {}, ctx) : {};
      const recordKeys = /* @__PURE__ */ new Set();
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          if (key === "__proto__")
            continue;
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          if (outKey === "__proto__")
            continue;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[outKey] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          if (def.mode === "loose") {
            if (key === "__proto__")
              continue;
            payload.value[key] = input[key];
          } else {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          }
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    } else {
      payload.value = memo2 ? memo2.alloc(inst, payload, {}, ctx) : {};
      let unrecognized;
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else if (values) {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const outKey = keyResult.value;
        if (outKey === "__proto__")
          continue;
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => {
            if (result2.issues.length) {
              payload.issues.push(...prefixIssues(key, result2.issues));
            }
            payload.value[outKey] = result2.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[outKey] = result.value;
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  defineLazyInternal(inst, "pattern", (zod) => {
    const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
    return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  const values = new Set(def.values);
  inst._zod.values = values;
  defineLazyInternal(inst, "pattern", (zod) => {
    const vals = zod.def.values;
    return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  globalConfig.memoizer?.guard(inst);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError();
    }
    payload.value = _out;
    return payload;
  };
});
function handleOptionalResult(payload, result) {
  payload.value = result.issues.length ? void 0 : result.value;
  return payload;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  inst._zod.optout = "optional";
  defineLazyInternal(inst, "values", (zod) => {
    const values = zod.def.innerType._zod.values;
    return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === void 0) {
      if (def.innerType._zod.optin !== "defaulted")
        return payload;
      const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
      if (result instanceof Promise)
        return result.then((result2) => handleOptionalResult(payload, result2));
      return handleOptionalResult(payload, result);
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  });
  defineLazyInternal(inst, "values", (zod) => {
    return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => {
    const v = zod.def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
function handleCatchResult(payload, result, def, ctx) {
  if (!result.issues.length) {
    payload.value = result.value;
    if (result.memo)
      payload.memo = true;
    return payload;
  }
  payload.value = def.catchValue({
    ...result,
    value: payload.value,
    error: {
      issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
    },
    input: payload.value
  });
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleCatchResult(payload, result2, def, ctx));
    }
    return handleCatchResult(payload, result, def, ctx);
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  if (!payload.memo)
    payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "innerType", () => {
    const d = def;
    if (!d._cachedInner)
      d._cachedInner = def.getter();
    return d._cachedInner;
  });
  defineLazyInternal(inst, "pattern", (zod) => zod.innerType?._zod?.pattern);
  defineLazyInternal(inst, "propValues", (zod) => zod.innerType?._zod?.propValues);
  defineLazyInternal(inst, "optin", (zod) => zod.innerType?._zod?.optin ?? void 0);
  defineLazyInternal(inst, "optout", (zod) => zod.innerType?._zod?.optout ?? void 0);
  inst._zod.parse = (payload, ctx) => {
    const inner = inst._zod.innerType;
    return inner._zod.run(payload, ctx);
  };
});
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}

// node_modules/zod/v4/core/memoizer.js
var $ZodCyclicError = class extends Error {
  constructor() {
    super(`Cannot parse a reference cycle that closes through a transform`);
    this.name = "ZodCyclicError";
  }
};
var STATE = "~memo";
var NO_ISSUES = [];
function isRef(value) {
  return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
  return issues.map((iss) => iss.path ? { ...iss, path: iss.path.slice() } : { ...iss });
}
var recursive = /* @__PURE__ */ new WeakMap();
var NONE = 0;
var ASSUMED = 1;
var PROVEN = 2;
function isRecursive(inst, stack, resolve2) {
  const cached2 = recursive.get(inst);
  if (cached2 !== void 0)
    return cached2 ? PROVEN : NONE;
  if (stack.has(inst))
    return PROVEN;
  stack.add(inst);
  let result = NONE;
  const check = (child) => {
    if (result !== PROVEN && child?._zod) {
      const answer = isRecursive(child, stack, resolve2);
      if (answer > result)
        result = answer;
    }
  };
  const shape = (sh, spread) => {
    let answer = NONE;
    for (const key of Reflect.ownKeys(sh)) {
      const desc = Object.getOwnPropertyDescriptor(sh, key);
      if (spread && !desc.enumerable)
        continue;
      const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve2) : NONE;
      if (child > answer)
        answer = child;
    }
    return answer;
  };
  const merge2 = (answer) => {
    if (answer > result)
      result = answer;
  };
  const def = inst._zod.def;
  const kind = def.type;
  switch (kind) {
    case "object": {
      const raw = rawShape(def);
      merge2(raw ? shape(raw, true) : ASSUMED);
      check(def.catchall);
      break;
    }
    case "array":
      check(def.element);
      break;
    case "tuple":
      for (const el of def.items)
        check(el);
      check(def.rest);
      break;
    case "record":
    case "map":
      check(def.keyType);
      check(def.valueType);
      break;
    case "set":
      check(def.valueType);
      break;
    case "union":
      for (const el of def.options)
        check(el);
      break;
    case "intersection":
      check(def.left);
      check(def.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      check(def.innerType);
      break;
    case "pipe":
      check(def.in);
      check(def.out);
      break;
    case "function":
      check(def.input);
      check(def.output);
      break;
    // `$ZodLazy` caches its inner on the def, so a resolved edge is followed exactly
    case "lazy": {
      const inner = def._cachedInner ?? (resolve2 ? inst._zod.innerType : void 0);
      merge2(inner ? isRecursive(inner, stack, false) : ASSUMED);
      break;
    }
    // a leaf by choice: `parts` are regex fragments, not data positions
    case "template_literal":
    // leaves
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default: {
      kind;
      for (const key in def) {
        const desc = Object.getOwnPropertyDescriptor(def, key);
        if (!desc || desc.get)
          continue;
        const value = desc.value;
        if (!value || typeof value !== "object")
          continue;
        if (value._zod)
          check(value);
        else if (Array.isArray(value))
          for (const el of value)
            check(el);
      }
    }
  }
  stack.delete(inst);
  return settle(inst, result);
}
function settle(inst, answer) {
  if (answer !== ASSUMED)
    recursive.set(inst, answer === PROVEN);
  return answer;
}
function bucketFor(state, inst) {
  let bucket = state.buckets.get(inst);
  if (!bucket) {
    bucket = /* @__PURE__ */ new WeakMap();
    state.buckets.set(inst, bucket);
  }
  return bucket;
}
var handoff;
var open = [];
var memo = {
  alloc(_inst, payload, empty) {
    const bucket = handoff;
    if (!bucket)
      return empty;
    handoff = void 0;
    const entry = { value: empty, issues: null };
    bucket.set(payload.value, entry);
    open.push(entry);
    return empty;
  },
  guard(inst) {
    var _a3;
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value))
          throw new $ZodCyclicError();
        return base(payload, ctx);
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  },
  attach(inst) {
    var _a3;
    let isRecursiveInst;
    let rechecked = false;
    let lastCtx;
    let lastBucket;
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (isRecursiveInst === void 0) {
          const walked = isRecursive(inst, /* @__PURE__ */ new Set(), false);
          if (walked === NONE) {
            inst._zod.parse = base;
            if (inst._zod.run === wrapped)
              inst._zod.run = base;
            return base(payload, ctx);
          }
          if (walked === PROVEN || rechecked)
            isRecursiveInst = true;
          else
            rechecked = true;
        }
        const input = payload.value;
        if (!isRef(input))
          return base(payload, ctx);
        let state = ctx[STATE];
        if (!state) {
          state = { buckets: /* @__PURE__ */ new WeakMap(), backEdges: void 0 };
          ctx[STATE] = state;
        }
        let bucket;
        if (lastCtx === ctx) {
          bucket = lastBucket;
        } else {
          bucket = bucketFor(state, inst);
          lastCtx = ctx;
          lastBucket = bucket;
        }
        const hit = bucket.get(input);
        if (hit) {
          payload.value = hit.value;
          if (hit.issues) {
            if (hit.issues.length)
              payload.issues.push(...cloneIssues(hit.issues));
          } else {
            payload.memo = true;
            state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet());
            state.backEdges.add(hit.value);
          }
          return payload;
        }
        handoff = bucket;
        const depth = open.length;
        const result = base(payload, ctx);
        handoff = void 0;
        const entry = open.length > depth ? open.pop() : void 0;
        if (result instanceof Promise) {
          return result.then((r) => {
            if (entry)
              entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
            return r;
          });
        }
        if (entry)
          entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
        return result;
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  }
};
function memoizer() {
  return memo;
}
function isBackEdge(ctx, value) {
  const backEdges = ctx[STATE]?.backEdges;
  return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}

// node_modules/zod/v4/locales/en.js
var error = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    currency_code: "currency code",
    credit_card: "credit card number",
    iban: "IBAN",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  function getTypeName(type, input) {
    if (type === "number" && typeof input === "number" && !Number.isFinite(input)) {
      return String(input);
    }
    return TypeDictionary[type] ?? type;
  }
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = getTypeName(issue2.expected);
        const receivedType = parsedType(issue2.input);
        const received = getTypeName(receivedType, issue2.input);
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.exact ? "exactly " : issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.exact ? "exactly " : issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue2.origin}`;
      case "invalid_union":
        if (issue2.options && Array.isArray(issue2.options) && issue2.options.length > 0) {
          const opts = issue2.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        if (issue2.inclusive === false) {
          return "Invalid input: more than one option matched";
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue2.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}

// node_modules/zod/v4/core/registries.js
var _a2;
var $ZodRegistry = class {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta2 = _meta[0];
    this._map.set(schema, meta2);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.set(meta2.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta2 = this._map.get(schema);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.delete(meta2.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
};
function registry() {
  return new $ZodRegistry();
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
  if (def.checks)
    def.checks = [...def.checks];
  return def;
}
// @__NO_SIDE_EFFECTS__
function _string(Class2, params) {
  return new Class2(snapshotChecks({ type: "string", ...normalizeParams(params) }));
}
// @__NO_SIDE_EFFECTS__
function _email(Class2, params) {
  return new Class2({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _guid(Class2, params) {
  return new Class2({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _url(Class2, params) {
  return new Class2({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _emoji2(Class2, params) {
  return new Class2({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class2, params) {
  return new Class2({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _xid(Class2, params) {
  return new Class2({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _e164(Class2, params) {
  return new Class2({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class2, params) {
  return new Class2({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class2, params) {
  return new Class2({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class2, params) {
  return new Class2({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _number(Class2, params) {
  return new Class2(snapshotChecks({ type: "number", checks: [], ...normalizeParams(params) }));
}
// @__NO_SIDE_EFFECTS__
function _int(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class2, params) {
  return new Class2({
    type: "boolean",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _null2(Class2, params) {
  return new Class2({
    type: "null",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class2) {
  return new Class2({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function _never(Class2, params) {
  return new Class2({
    type: "never",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class2, element, params) {
  return new Class2({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _refine(Class2, fn, _params) {
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}

// node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
  for (const source of sources) {
    for (const key of Reflect.ownKeys(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        assignProp(target, key, source[key]);
      }
    }
  }
  return target;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    sharedDefsExtractedFor: void 0,
    sharedEmitDoneFor: void 0,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: params?.external ?? void 0
  };
}
function handleUnrepresentable(schema, ctx, json2, params, message) {
  const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({ zodSchema: schema, path: params.path, message }) : ctx.unrepresentable;
  if (result === "any")
    return false;
  if (result === void 0 || result === "throw")
    throw new Error(message);
  Object.assign(json2, result);
  return true;
}
function processSchema(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a3;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  ctx.sharedDefsExtractedFor = void 0;
  ctx.sharedEmitDoneFor = void 0;
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      processSchema(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta2 = ctx.metadataRegistry.get(schema);
  if (meta2)
    assignProps(result.schema, meta2);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a3 = result.schema).default ?? (_a3.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function encodeJSONPointerSegment(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external)
    return;
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}` };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    if (entry[1] === root && !entry[1].schema.id) {
      return { ref: uriPrefix };
    }
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + encodeJSONPointerSegment(defId) };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
      }
    }
  }
  if (ctx.external)
    ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion(schema) {
  const options = schema.anyOf;
  if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0)
    return;
  const types = [];
  for (const option of options) {
    if (!option || typeof option !== "object")
      return;
    compactTypeUnion(option);
    const keys = Object.keys(option);
    if (keys.length !== 1 || keys[0] !== "type")
      return;
    const type = option.type;
    for (const member of Array.isArray(type) ? type : [type]) {
      if (typeof member !== "string")
        return;
      if (!types.includes(member))
        types.push(member);
    }
  }
  delete schema.anyOf;
  schema.type = types.length === 1 ? types[0] : types;
}
var FOLDABLE_KEYS = /* @__PURE__ */ new Set(["type", "properties", "required", "additionalProperties"]);
var UNION_KEYS = ["oneOf", "anyOf"];
function undeclaredConstraint(member) {
  const extra = member.additionalProperties;
  if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null)
    return null;
  return Object.keys(extra).length ? extra : null;
}
function foldObjects(members2) {
  const objects = [];
  for (const member of members2) {
    if (typeof member !== "object" || member.type !== "object")
      return null;
    for (const key in member) {
      if (!FOLDABLE_KEYS.has(key))
        return null;
    }
    objects.push(member);
  }
  const properties = {};
  const required2 = /* @__PURE__ */ new Set();
  for (const object2 of objects) {
    for (const key in object2.properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key))
        continue;
      const parts = [];
      for (const other of objects) {
        const part = other.properties?.[key] ?? undeclaredConstraint(other);
        if (part === null || part === void 0)
          continue;
        if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part)))
          parts.push(part);
      }
      const merged = parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts };
      assignProp(properties, key, merged);
    }
    for (const key of object2.required ?? [])
      required2.add(key);
  }
  const folded = { type: "object", properties };
  if (required2.size)
    folded.required = [...required2];
  if (objects.every((object2) => object2.additionalProperties === false)) {
    folded.additionalProperties = false;
  } else {
    const constraints = [];
    for (const object2 of objects) {
      const constraint = undeclaredConstraint(object2);
      if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint)))
        constraints.push(constraint);
    }
    if (constraints.length === 1)
      folded.additionalProperties = constraints[0];
    else if (constraints.length > 1)
      folded.additionalProperties = { allOf: constraints };
  }
  return folded;
}
function foldIntersection(json2) {
  const allOf = json2.allOf;
  if (!Array.isArray(allOf) || allOf.length < 2)
    return;
  for (const key of FOLDABLE_KEYS)
    if (key in json2)
      return;
  const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
  let folded = null;
  if (!unions.length) {
    folded = foldObjects(allOf);
  } else {
    const union2 = unions[0];
    const keyword = UNION_KEYS.find((k) => Array.isArray(union2[k]));
    if (Object.keys(union2).length !== 1)
      return;
    const rest = allOf.filter((m) => m !== union2);
    const branches = union2[keyword].map((branch) => foldObjects([...rest, branch]));
    if (branches.some((b) => !b))
      return;
    folded = { [keyword]: branches };
  }
  if (!folded)
    return;
  delete json2.allOf;
  assignProps(json2, folded);
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        assignProps(schema2, refSchema);
      }
      assignProps(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of [...ctx.seen.entries()].reverse()) {
      flattenRef(entry[0]);
    }
    if (ctx.target !== "openapi-3.0") {
      for (const entry of ctx.seen.entries()) {
        compactTypeUnion(entry[1].def ?? entry[1].schema);
      }
    }
    for (const rewrite of ctx.deferred)
      rewrite();
    if (ctx.intersections.length) {
      const carriers = /* @__PURE__ */ new Map();
      for (const seen of ctx.seen.values()) {
        for (const json2 of [seen.schema, seen.def]) {
          const allOf = json2?.allOf;
          if (!Array.isArray(allOf))
            continue;
          const existing = carriers.get(allOf);
          if (existing)
            existing.push(json2);
          else
            carriers.set(allOf, [json2]);
        }
      }
      for (const allOf of ctx.intersections) {
        for (const json2 of carriers.get(allOf) ?? [])
          foldIntersection(json2);
      }
    }
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {
  } else {
  }
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        if (seen.def.id === seen.defId)
          delete seen.def.id;
        assignProp(defs, seen.defId, seen.def);
      }
    }
  }
  if (ctx.external)
    ctx.sharedEmitDoneFor = ctx.external;
  if (ctx.external) {
  } else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};

// node_modules/zod/v4/core/json-schema-processors.js
var narrowMin = (agg, key, value) => {
  if (agg[key] === void 0 || value > agg[key])
    agg[key] = value;
};
var narrowMax = (agg, key, value) => {
  if (agg[key] === void 0 || value < agg[key])
    agg[key] = value;
};
var narrowBoth = (agg, value) => {
  narrowMin(agg, "minimum", value);
  narrowMax(agg, "maximum", value);
};
var addDivisor = (agg, value) => {
  agg.multipleOf ?? (agg.multipleOf = []);
  if (!agg.multipleOf.includes(value))
    agg.multipleOf.push(value);
};
var addPattern = (agg, pattern) => {
  agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set());
  agg.patterns.add(pattern);
};
var intersectMime = (agg, mime) => {
  agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
var setFormat = (agg, format) => {
  agg.format = format;
  if (format.includes("int"))
    agg.isInt = true;
};
var minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
var maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
var formatContributor = (ranges) => (agg, def) => {
  setFormat(agg, def.format);
  const [minimum, maximum] = ranges[def.format];
  narrowMin(agg, "minimum", minimum);
  narrowMax(agg, "maximum", maximum);
};
var contributors = {
  greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
  less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
  multiple_of: (agg, def) => addDivisor(agg, def.value),
  number_format: formatContributor(NUMBER_FORMAT_RANGES),
  bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
  min_length: minContributor,
  max_length: maxContributor,
  length_equals: (agg, def) => narrowBoth(agg, def.length),
  min_size: minContributor,
  max_size: maxContributor,
  size_equals: (agg, def) => narrowBoth(agg, def.size),
  string_format: (agg, def) => {
    setFormat(agg, def.format);
    if (def.pattern)
      addPattern(agg, def.pattern);
    if (def.format === "base64" || def.format === "base64url")
      agg.contentEncoding = def.format;
    if (def.local || def.precision === -1)
      agg.laxFormat = true;
  },
  mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
  const agg = {};
  const def = schema._zod.def;
  const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
  for (const ch of list)
    contributors[ch._zod.def.check]?.(agg, ch._zod.def);
  const bag = schema._zod.bag;
  if (bag.minimum !== void 0)
    narrowMin(agg, "minimum", bag.minimum);
  if (bag.exclusiveMinimum !== void 0)
    narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
  if (bag.maximum !== void 0)
    narrowMax(agg, "maximum", bag.maximum);
  if (bag.exclusiveMaximum !== void 0)
    narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
  if (bag.multipleOf !== void 0)
    addDivisor(agg, bag.multipleOf);
  if (bag.format !== void 0) {
    agg.format ?? (agg.format = bag.format);
    if (bag.format.includes("int"))
      agg.isInt = true;
  }
  if (bag.mime)
    intersectMime(agg, bag.mime);
  for (const pattern of bag.patterns ?? [])
    addPattern(agg, pattern);
  return agg;
}
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
};
var exactPatterns = /* @__PURE__ */ new Map([
  [base64Charset, base64],
  [base64urlCharset, base64url]
]);
var exactPattern = (p) => exactPatterns.get(p) ?? p;
var stringProcessor = (schema, ctx, _json, _params) => {
  const json2 = _json;
  json2.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json2.minLength = minimum;
  if (typeof maximum === "number")
    json2.maxLength = maximum;
  if (format) {
    json2.format = formatMap[format] ?? format;
    if (json2.format === "")
      delete json2.format;
    if (format === "time" || laxFormat) {
      delete json2.format;
    }
  }
  if (contentEncoding)
    json2.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const patternList = [...patterns].map(exactPattern);
    if (patternList.length === 1)
      json2.pattern = patternList[0].source;
    else if (patternList.length > 1) {
      json2.allOf = [
        ...patternList.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
  json2.type = isInt ? "integer" : "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json2.minimum = exclusiveMinimum;
      json2.exclusiveMinimum = true;
    } else {
      json2.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json2.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json2.maximum = exclusiveMaximum;
      json2.exclusiveMaximum = true;
    } else {
      json2.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json2.maximum = maximum;
  }
  if (multipleOf) {
    const divisors = /* @__PURE__ */ new Set();
    for (const divisor of multipleOf) {
      if (Number.isFinite(divisor) && divisor !== 0)
        divisors.add(Math.abs(divisor));
      else
        handleUnrepresentable(schema, ctx, json2, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
    }
    const [first, ...rest] = divisors;
    if (first !== void 0)
      json2.multipleOf = first;
    if (rest.length)
      json2.allOf = [...json2.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
  }
};
var booleanProcessor = (_schema, _ctx, json2, _params) => {
  json2.type = "boolean";
};
var nullProcessor = (_schema, ctx, json2, _params) => {
  if (ctx.target === "openapi-3.0") {
    json2.type = "string";
    json2.nullable = true;
    json2.enum = [null];
  } else {
    json2.type = "null";
  }
};
var neverProcessor = (_schema, _ctx, json2, _params) => {
  json2.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {
};
var enumProcessor = (schema, _ctx, json2, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.length === 0) {
    json2.not = {};
    return;
  }
  if (values.every((v) => typeof v === "number"))
    json2.type = "number";
  if (values.every((v) => typeof v === "string"))
    json2.type = "string";
  json2.enum = values;
};
var literalProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  if (def.values.length === 0) {
    json2.not = {};
    return;
  }
  const vals = [];
  for (const val of def.values) {
    if (val === void 0) {
      if (handleUnrepresentable(schema, ctx, json2, params, "Literal `undefined` cannot be represented in JSON Schema"))
        return;
    } else if (typeof val === "bigint") {
      if (handleUnrepresentable(schema, ctx, json2, params, "BigInt literals cannot be represented in JSON Schema"))
        return;
      vals.push(Number(val));
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {
  } else if (vals.length === 1) {
    const val = vals[0];
    json2.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json2.enum = [val];
    } else {
      json2.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json2.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json2.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json2.type = "boolean";
    if (vals.every((v) => v === null))
      json2.type = "null";
    json2.enum = vals;
  }
};
var customProcessor = (schema, ctx, json2, params) => {
  handleUnrepresentable(schema, ctx, json2, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (schema, ctx, json2, params) => {
  handleUnrepresentable(schema, ctx, json2, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json2.minItems = minimum;
  if (typeof maximum === "number")
    json2.maxItems = maximum;
  json2.type = "array";
  json2.items = processSchema(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
function inputOptin(schema) {
  const def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) {
    return inputOptin(def.out);
  }
  if (def.type === "catch") {
    return inputOptin(def.innerType);
  }
  return schema._zod.optin;
}
var objectProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  const shape = def.shape;
  const symbolKeys = Object.getOwnPropertySymbols(shape);
  if (symbolKeys.length && handleUnrepresentable(schema, ctx, json2, params, "Symbol keys cannot be represented in JSON Schema")) {
    return;
  }
  json2.type = "object";
  json2.properties = {};
  for (const key in shape) {
    assignProp(json2.properties, key, processSchema(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    }));
  }
  const requiredKeys = [];
  for (const key of Object.keys(shape)) {
    const field = def.shape[key];
    if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) {
      requiredKeys.push(key);
    }
  }
  if (requiredKeys.length > 0) {
    json2.required = requiredKeys;
  }
  if (def.catchall?._zod.def.type === "never") {
    json2.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json2.additionalProperties = false;
  } else if (def.catchall) {
    json2.additionalProperties = processSchema(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => processSchema(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json2.oneOf = options;
  } else {
    json2.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const a = processSchema(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = processSchema(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json2.allOf = allOf;
  ctx.intersections.push(allOf);
};
function stringifyKeyNames(bySchema, json2, visited) {
  if (json2.$ref) {
    if (visited.has(json2))
      return json2;
    visited.add(json2);
    const def = bySchema.get(json2)?.def;
    if (!def)
      return json2;
    const inlined = stringifyKeyNames(bySchema, def, visited);
    return inlined === def ? json2 : inlined;
  }
  for (const keyword of ["anyOf", "oneOf"]) {
    const branches = json2[keyword];
    if (!Array.isArray(branches))
      continue;
    const mapped = branches.map((branch) => stringifyKeyNames(bySchema, branch, visited));
    if (mapped.some((branch, i) => branch !== branches[i]))
      json2 = { ...json2, [keyword]: mapped };
  }
  const types = Array.isArray(json2.type) ? json2.type : [json2.type];
  const numericType = !types.includes("string") && types.some((t2) => t2 === "number" || t2 === "integer");
  const values = json2.enum ?? (json2.const !== void 0 ? [json2.const] : void 0);
  if (!numericType && !values?.some((v) => typeof v === "number"))
    return json2;
  const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json2;
  if (rest.enum)
    rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
  else if (typeof rest.const === "number")
    rest.const = String(rest.const);
  if (!numericType)
    return rest;
  rest.type = "string";
  if (!values)
    rest.pattern = (types.includes("number") ? number : integer).source;
  return rest;
}
var pendingRecords = /* @__PURE__ */ new WeakMap();
function rewriteKeyNames(ctx) {
  const bySchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.values()) {
    if (entry.def && !bySchema.has(entry.schema))
      bySchema.set(entry.schema, entry);
  }
  const rewrites = /* @__PURE__ */ new Map();
  for (const record3 of pendingRecords.get(ctx) ?? []) {
    const seen = ctx.seen.get(record3);
    const names = (seen?.def ?? seen?.schema)?.propertyNames;
    if (!names || names === true || rewrites.has(names))
      continue;
    const rewritten = stringifyKeyNames(bySchema, names, /* @__PURE__ */ new Set());
    if (rewritten !== names)
      rewrites.set(names, rewritten);
  }
  if (!rewrites.size)
    return;
  for (const entry of ctx.seen.values()) {
    for (const carrier of [entry.schema, entry.def]) {
      const rewritten = carrier && rewrites.get(carrier.propertyNames);
      if (rewritten)
        carrier.propertyNames = rewritten;
    }
  }
}
var recordProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  json2.type = "object";
  const keyType = def.keyType;
  const patterns = aggregateChecks(keyType).patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json2.patternProperties = {};
    for (const pattern of patterns) {
      assignProp(json2.patternProperties, exactPattern(pattern).source, valueSchema);
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json2.propertyNames = processSchema(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
      let pending = pendingRecords.get(ctx);
      if (!pending) {
        pending = [];
        pendingRecords.set(ctx, pending);
        ctx.deferred.push(() => rewriteKeyNames(ctx));
      }
      pending.push(schema);
    }
    json2.additionalProperties = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  const omittableOnInput = ctx.io === "input" && inputOptin(def.valueType) !== void 0;
  if (keyValues && !def.partial && !omittableOnInput) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json2.required = validKeyValues.map(String);
    }
  }
};
var nullableProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const inner = processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json2.nullable = true;
  } else {
    json2.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var UNREPRESENTABLE_DEFAULT = /* @__PURE__ */ Symbol();
function serializeDefaultValue(value, schema, ctx, json2, params) {
  let unrepresentable = false;
  const serialized = JSON.stringify(value, (_, val) => {
    if (typeof val !== "bigint")
      return val;
    unrepresentable = true;
    return null;
  });
  if (!unrepresentable)
    return JSON.parse(serialized);
  handleUnrepresentable(schema, ctx, json2, params, "BigInt defaults cannot be represented in JSON Schema");
  return UNREPRESENTABLE_DEFAULT;
}
var defaultProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json2, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json2.default = value;
};
var prefaultProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io !== "input")
    return;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json2, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json2._prefault = value;
};
var catchProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    handleUnrepresentable(schema, ctx, json2, params, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  json2.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  processSchema(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json2.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var lazyProcessor = (schema, ctx, _json, params) => {
  const innerType = schema._zod.innerType;
  processSchema(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};

// node_modules/zod/v4/classic/errors.js
var _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: false,
    get() {
      const value = make(this);
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
      return value;
    },
    set(value) {
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
    }
  });
}
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  const proto = Object.getPrototypeOf(inst);
  if (_installedErrorProtos.has(proto))
    return;
  _installedErrorProtos.add(proto);
  _lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
  _lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
  _lazyMethod(proto, "addIssue", (self) => (issue2) => {
    self.issues.push(issue2);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  _lazyMethod(proto, "addIssues", (self) => (issues2) => {
    self.issues.push(...issues2);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  Object.defineProperty(proto, "isEmpty", {
    configurable: true,
    enumerable: false,
    get() {
      return this.issues.length === 0;
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, void 0, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
  if (!globalConfig.localeError)
    config(en_default());
}
function _ensureDefaultMemoizer() {
  if (!globalConfig.memoizer)
    config({ memoizer: memoizer() });
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  _ensureDefaultLocale();
  $ZodType.init(inst, def);
  inst.def = def;
  inst.type = def.type;
  return inst;
}, {
  check(...chks) {
    const def = this.def;
    return this.clone(util_exports.mergeDefs(def, {
      checks: [
        ...def.checks ?? [],
        ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    }), { parent: true });
  },
  with(...chks) {
    return this.check(...chks);
  },
  clone(def, params) {
    return clone(this, def, params);
  },
  brand() {
    return this;
  },
  register(reg, meta2) {
    reg.add(this, meta2);
    return this;
  },
  refine(check, params) {
    return this.check(refine(check, params));
  },
  superRefine(refinement, params) {
    return this.check(superRefine(refinement, params));
  },
  overwrite(fn) {
    return this.check(_overwrite(fn));
  },
  optional() {
    return optional(this);
  },
  exactOptional() {
    return exactOptional(this);
  },
  nullable() {
    return nullable(this);
  },
  nullish() {
    return optional(nullable(this));
  },
  nonoptional(params) {
    return nonoptional(this, params);
  },
  array() {
    return array(this);
  },
  or(arg) {
    return union([this, arg]);
  },
  and(arg) {
    return intersection(this, arg);
  },
  transform(tx) {
    return pipe(this, transform(tx));
  },
  default(d) {
    return _default(this, d);
  },
  prefault(d) {
    return prefault(this, d);
  },
  catch(params) {
    return _catch(this, params);
  },
  pipe(target) {
    return pipe(this, target);
  },
  readonly() {
    return readonly(this);
  },
  describe(description) {
    const cl = this.clone();
    globalRegistry.add(cl, { description });
    return cl;
  },
  meta(...args) {
    if (args.length === 0)
      return globalRegistry.get(this);
    const cl = this.clone();
    globalRegistry.add(cl, args[0]);
    return cl;
  },
  isOptional() {
    return this.safeParse(void 0).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(fn, ...args) {
    return args.length === 0 ? fn(this) : fn(this, ...args);
  },
  // Overrides core's `~standard` to add `jsonSchema`. Must stay a prototype entry: redefining it per instance demotes instances to dictionary mode.
  get "~standard"() {
    return util_exports.hide(this, "~standard", {
      ...standardProps(this),
      jsonSchema: {
        input: createStandardJSONSchemaMethod(this, "input"),
        output: createStandardJSONSchemaMethod(this, "output")
      }
    });
  },
  set "~standard"(value) {
    util_exports.own(this, "~standard", value);
  },
  parse: function _parse2(data, params) {
    return parse(this, data, params, { callee: _parse2 });
  },
  parseAsync: async function _parseAsync2(data, params) {
    return await parseAsync(this, data, params, { callee: _parseAsync2 });
  },
  safeParse(data, params) {
    return safeParse(this, data, params);
  },
  async safeParseAsync(data, params) {
    return safeParseAsync(this, data, params);
  },
  // `spa` is an alias: same function object as `safeParseAsync`, as before.
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(value) {
    util_exports.own(this, "spa", value);
  },
  validate(data, params) {
    return validate(this, data, params);
  },
  validateAsync(data, params) {
    return validateAsync(this, data, params);
  },
  encode: function _encode2(data, params) {
    return encode(this, data, params, { callee: _encode2 });
  },
  decode: function _decode2(data, params) {
    return decode(this, data, params, { callee: _decode2 });
  },
  encodeAsync: async function _encodeAsync2(data, params) {
    return await encodeAsync(this, data, params, { callee: _encodeAsync2 });
  },
  decodeAsync: async function _decodeAsync2(data, params) {
    return await decodeAsync(this, data, params, { callee: _decodeAsync2 });
  },
  safeEncode(data, params) {
    return safeEncode(this, data, params);
  },
  safeDecode(data, params) {
    return safeDecode(this, data, params);
  },
  async safeEncodeAsync(data, params) {
    return safeEncodeAsync(this, data, params);
  },
  async safeDecodeAsync(data, params) {
    return safeDecodeAsync(this, data, params);
  },
  toJSONSchema(params) {
    return createToJSONSchemaMethod(this, {})(params);
  },
  // Reads through to the registry on every access, so it must not cache.
  get description() {
    return globalRegistry.get(this)?.description;
  },
  // No setter: `schema._def = x` throws, as it did when `_def` was a non-writable own property.
  get _def() {
    return this._zod.def;
  }
});
var _ZodString = /* @__PURE__ */ $constructor(
  "_ZodString",
  (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => stringProcessor(inst, ctx, json2, params);
  },
  /* @__PURE__ */ util_exports.derived({
    format: (inst) => aggregateChecks(inst).format ?? null,
    minLength: (inst) => aggregateChecks(inst).minimum ?? null,
    maxLength: (inst) => aggregateChecks(inst).maximum ?? null
  }, {
    regex(...args) {
      return this.check(_regex(...args));
    },
    includes(...args) {
      return this.check(_includes(...args));
    },
    startsWith(...args) {
      return this.check(_startsWith(...args));
    },
    endsWith(...args) {
      return this.check(_endsWith(...args));
    },
    min(...args) {
      return this.check(_minLength(...args));
    },
    max(...args) {
      return this.check(_maxLength(...args));
    },
    length(...args) {
      return this.check(_length(...args));
    },
    nonempty(...args) {
      return this.check(_minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args) {
      return this.check(_normalize(...args));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  })
);
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
}, {
  email(params) {
    return this.check(_email(ZodEmail, params));
  },
  url(params) {
    return this.check(_url(ZodURL, params));
  },
  jwt(params) {
    return this.check(_jwt(ZodJWT, params));
  },
  emoji(params) {
    return this.check(_emoji2(ZodEmoji, params));
  },
  guid(params) {
    return this.check(_guid(ZodGUID, params));
  },
  uuid(params) {
    return this.check(_uuid(ZodUUID, params));
  },
  uuidv4(params) {
    return this.check(_uuidv4(ZodUUID, params));
  },
  uuidv6(params) {
    return this.check(_uuidv6(ZodUUID, params));
  },
  uuidv7(params) {
    return this.check(_uuidv7(ZodUUID, params));
  },
  nanoid(params) {
    return this.check(_nanoid(ZodNanoID, params));
  },
  cuid(params) {
    return this.check(_cuid(ZodCUID, params));
  },
  cuid2(params) {
    return this.check(_cuid2(ZodCUID2, params));
  },
  ulid(params) {
    return this.check(_ulid(ZodULID, params));
  },
  base64(params) {
    return this.check(_base64(ZodBase64, params));
  },
  base64url(params) {
    return this.check(_base64url(ZodBase64URL, params));
  },
  xid(params) {
    return this.check(_xid(ZodXID, params));
  },
  ksuid(params) {
    return this.check(_ksuid(ZodKSUID, params));
  },
  ipv4(params) {
    return this.check(_ipv4(ZodIPv4, params));
  },
  ipv6(params) {
    return this.check(_ipv6(ZodIPv6, params));
  },
  cidrv4(params) {
    return this.check(_cidrv4(ZodCIDRv4, params));
  },
  cidrv6(params) {
    return this.check(_cidrv6(ZodCIDRv6, params));
  },
  e164(params) {
    return this.check(_e164(ZodE164, params));
  },
  datetime(params) {
    return this.check(_isoDateTime(ZodISODateTime, params));
  },
  date(params) {
    return this.check(_isoDate(ZodISODate, params));
  },
  time(params) {
    return this.check(_isoTime(ZodISOTime, params));
  },
  duration(params) {
    return this.check(_isoDuration(ZodISODuration, params));
  }
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function url(params) {
  return _url(ZodURL, params);
}
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor(
  "ZodNumber",
  (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => numberProcessor(inst, ctx, json2, params);
    inst.isFinite = true;
  },
  /* @__PURE__ */ util_exports.derived({
    minValue: (inst) => {
      const { minimum, exclusiveMinimum } = aggregateChecks(inst);
      return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
    },
    maxValue: (inst) => {
      const { maximum, exclusiveMaximum } = aggregateChecks(inst);
      return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
    },
    isInt: (inst) => {
      const { isInt, multipleOf } = aggregateChecks(inst);
      return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
    },
    format: (inst) => aggregateChecks(inst).format ?? null
  }, {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  })
);
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => booleanProcessor(inst, ctx, json2, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullProcessor(inst, ctx, json2, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unknownProcessor(inst, ctx, json2, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => neverProcessor(inst, ctx, json2, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => arrayProcessor(inst, ctx, json2, params);
  inst.element = def.element;
}, {
  min(n, params) {
    return this.check(_minLength(n, params));
  },
  nonempty(params) {
    return this.check(_minLength(1, params));
  },
  max(n, params) {
    return this.check(_maxLength(n, params));
  },
  length(n, params) {
    return this.check(_length(n, params));
  },
  unwrap() {
    return this.element;
  }
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => objectProcessor(inst, ctx, json2, params);
  util_exports.installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
  keyof() {
    return _enum(Object.keys(this._zod.def.shape));
  },
  catchall(catchall) {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall }));
  },
  passthrough() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  loose() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  strict() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: never() }));
  },
  strip() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: void 0 }));
  },
  extend(incoming) {
    return util_exports.extend(this, incoming);
  },
  safeExtend(incoming) {
    return util_exports.safeExtend(this, incoming);
  },
  merge(other) {
    return util_exports.merge(this, other);
  },
  pick(mask) {
    return util_exports.pick(this, mask);
  },
  omit(mask) {
    return util_exports.omit(this, mask);
  },
  partial(...args) {
    return util_exports.partial(ZodOptional, this, args[0]);
  },
  exactPartial(...args) {
    return util_exports.partial(ZodExactOptional, this, args[0], "exactPartial");
  },
  required(...args) {
    return util_exports.required(ZodNonOptional, this, args[0]);
  }
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...util_exports.normalizeParams(params)
  };
  return new ZodObject(def);
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...util_exports.normalizeParams(params)
  });
}
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...util_exports.normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => intersectionProcessor(inst, ctx, json2, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => recordProcessor(inst, ctx, json2, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...util_exports.normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => enumProcessor(inst, ctx, json2, params);
  inst.enum = def.entries;
  inst.options = [...inst._zod.values];
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...util_exports.normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => literalProcessor(inst, ctx, json2, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...util_exports.normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => transformProcessor(inst, ctx, json2, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(util_exports.issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(util_exports.issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        return payload;
      });
    }
    payload.value = output;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullableProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => defaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => prefaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nonoptionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...util_exports.normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => catchProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : util_exports.constantCatch(catchValue)
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => pipeProcessor(inst, ctx, json2, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => readonlyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
  $ZodLazy.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => lazyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => customProcessor(inst, ctx, json2, params);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
function json(params) {
  const jsonSchema = lazy(() => {
    return union([string2(params), number2(), boolean2(), _null3(), array(jsonSchema), record(string2(), jsonSchema)]);
  });
  return jsonSchema;
}

// node_modules/zod/v4/classic/iso.js
var iso_exports = {};
__export(iso_exports, {
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  date: () => date2,
  datetime: () => datetime2,
  duration: () => duration2,
  time: () => time2
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
function date2(params) {
  return _isoDate(ZodISODate, params);
}
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// node_modules/@getpaseo/plugin/dist/rpc.js
var RPC_NAME = /^[a-z][a-z0-9._-]*$/;
function defineRpc(definition) {
  const name = definition.name.trim();
  if (!RPC_NAME.test(name))
    throw new Error(`Invalid plugin RPC method: ${definition.name}`);
  return { ...definition, name };
}

// node_modules/@getpaseo/plugin/dist/settings.js
var SettingsReadResultSchema = discriminatedUnion("status", [
  object({ status: literal("ready"), revision: string2(), values: json() }),
  object({ status: literal("invalid"), revision: string2(), error: string2() })
]);
var SettingsWriteResultSchema = discriminatedUnion("status", [
  object({ status: literal("saved"), revision: string2(), values: json() }),
  object({ status: literal("conflict"), error: string2() }),
  object({ status: literal("invalid"), error: string2() })
]);

// node_modules/@getpaseo/plugin/dist/attachments.js
var PluginAttachmentItemSchema = object({
  id: string2(),
  identifier: string2(),
  title: string2(),
  subtitle: string2().optional(),
  url: url(),
  text: string2(),
  resourceType: string2()
});
var PluginAttachmentSearchPayloadSchema = object({
  items: array(PluginAttachmentItemSchema)
});

// shared/locales/en.json
var en_default2 = {
  "access.account.personal": "personal account",
  "access.account.registered": "{note} (registered)",
  "access.account.registeredMark": " (registered)",
  "access.account.withNote": "{account} ({note})",
  "access.detail.blocked": "Check command not on the allow list",
  "access.detail.checking": "Checking",
  "access.detail.checkingMcp": "Checking with claude mcp list",
  "access.detail.checkingPrefix": "Checking",
  "access.detail.commandFailed": "Command failed",
  "access.detail.commandMissing": "Command not found",
  "access.detail.connector": "claude.ai {name}. {method}",
  "access.detail.connectorFailed": "claude.ai {name} failed to connect. {method}",
  "access.detail.connectorMissing": "claude.ai {name} not in the output. {method}",
  "access.detail.connectorNeedsAuth": "claude.ai {name} needs authorization. {method}",
  "access.detail.connectorUnknown": "claude.ai {name} status not recognized. {method}",
  "access.detail.grokMethod": "grok.com, checked with grok models",
  "access.detail.join": ". ",
  "access.detail.loginNoBrowser": "Not logged in; browser authorization not continued",
  "access.detail.loginStopped": "Not logged in; stopped without continuing browser authorization",
  "access.detail.mcpMethod": "claude.ai connector, checked with claude mcp list",
  "access.detail.noParser": "No parsing rule",
  "access.detail.slackMissing": "Slack plugin: not found",
  "access.detail.slackRunning": "Slack plugin: running",
  "access.detail.slackStopped": "Slack plugin: not running",
  "access.detail.timedOut": "Timed out",
  "access.detail.tokenDropped": "Dropped a possible token",
  "access.detail.unrecognized": "Output not recognized",
  "access.listJoin": ", ",
  "access.mode.acceptEdits": "asks before editing files",
  "access.mode.agent": "can edit files and run commands",
  "access.mode.bypassPermissions": "runs commands without asking each time",
  "access.mode.default": "tool default; still asks when it should",
  "access.mode.fullAccess": "full access; runs commands without asking each time",
  "access.mode.known": "{plain} ({id})",
  "access.mode.none": "Profile sets no permission mode",
  "access.mode.other": "Permission mode from the profile ({id})",
  "access.mode.plan": "plans only, does not edit files",
  "access.notes.boilerplate": "do not paste|do not read or print|say so when data is missing|do not make things up|no business code|forbidden actions",
  "access.notes.colons": ":",
  "access.notes.negations": "not|never|only",
  "access.notes.none": "No specific prohibitions",
  "access.notes.pauseMarker": "[Paused]",
  "access.notes.pausePrefix": "Paused: {text}",
  "access.notes.sentenceEnd": ". ",
  "access.notes.specialMarker": "Special constraint",
  "access.page.byRole": "By role",
  "access.page.byService": "By service",
  "access.page.checkFailed": "Check failed: {error}",
  "access.page.checking": "Checking\u2026",
  "access.page.constraint": "Constraint: {constraint}",
  "access.page.lastChecked": "Last checked {ago}",
  "access.page.limit": "Limits: {limit}",
  "access.page.loading": "Loading\u2026",
  "access.page.login": "Login: {login}",
  "access.page.mode": "Permission mode: {mode}",
  "access.page.neverChecked": "Not checked yet",
  "access.page.noDispatch": "No dispatch",
  "access.page.noProfiles": "Cannot read profiles",
  "access.page.noServices": "No registered services",
  "access.page.permission": "Permission: {permission}",
  "access.page.readFailed": "Read failed: {error}",
  "access.page.recheck": "Check again",
  "access.page.role": "Role: {role}",
  "access.page.scopes": ". {count} scopes this check",
  "access.page.services": "Services it can use: {services}",
  "access.page.users": "Used by: {users}",
  "access.pending": "To be checked",
  "access.role.candidate": "Stand-in",
  "access.role.none": "No role set",
  "access.role.patrol": "Patrol",
  "access.role.personal": "Personal",
  "access.state.checking": "Checking",
  "access.state.linked": "Connected",
  "access.state.loggedIn": "Logged in",
  "access.state.loggedOut": "Not logged in",
  "access.state.unknown": "Unknown",
  "access.state.unlinked": "Not connected",
  "access.view.account": "Account: {account}",
  "access.view.accountRegistered": "Registered account: {account}",
  "access.view.foldCount": "{count}",
  "access.view.foldLinked": "connected {count}",
  "access.view.foldLoggedIn": "logged in {count}",
  "access.view.foldUnknown": "unknown {count}",
  "access.view.noServices": "None registered",
  "access.view.noUsers": "No profile says it uses this",
  "access.view.permission": "Permission: {permission}",
  "access.view.permissionScopes": "Permission: {permission}. {count} scopes this check",
  "access.view.profiles": "{count} profiles",
  "access.warning.noMap": "Cannot read access-map.json",
  "access.where.noPool": "Runs on {vendor}, no separate quota pool",
  "access.where.pool": "Runs on {vendor}, spends {label}",
  "access.where.poolQuota": "{label} quota",
  "access.where.quotaWord": "quota",
  "access.where.unknownVendor": "unknown",
  "board.color.dark": "Dark",
  "board.color.light": "Light",
  "board.color.paseo": "Follow Paseo",
  "board.colorMode": "Theme",
  "board.font.lg": "L",
  "board.font.md": "M",
  "board.font.sm": "S",
  "board.fontSize": "Text size",
  "board.leaderReply.empty": "Write a sentence first",
  "board.loading": "Loading\u2026",
  "board.loadingQuota": "Loading quota\u2026",
  "board.openFailed": "Could not open: {error}",
  "board.prefsSaveFailed": "Preferences were not saved. Please try again.",
  "board.readFailed": "Could not load: {error}",
  "board.refresh": "Refresh",
  "board.refreshNow": "Refresh now",
  "board.tabHint.access": "How each service is signed in, which account, how much access it has, which profiles use it, and where each profile runs and under what limits.",
  "board.tabHint.leader": "Each project's <leader>, decisions waiting on you, new replies, and alerts.",
  "board.tabHint.quota": "Whether quota will last, who to dispatch to by pace, and plan cost and payback.",
  "board.tabHint.records": "Logs for the <leader>, plus a Kanban overview. Sections stay folded showing only title and count; open one to read.",
  "board.tabHint.roles": 'One card per role: which quota, model and thinking depth each tier uses, whether it can be dispatched, and how many tasks it did in 7 days. "Change model" switches right away; "History" under the card can undo.',
  "board.tabHint.usage": "Tokens over the last 7 days, and what each role did.",
  "board.updatedAgo": "Updated {ago}",
  "board.warnings.count": "{count}",
  "board.warnings.title": "Read notes",
  "cli.roles.detailNeedsOptions": `An open decision's --detail must have options A and B and a "Recommend"; example: --detail "A: do it now; B: wait. Recommend: A". Use --force-open (marked as an open question) only when it really cannot be written as options.`,
  "cli.roles.forceOpenTag": " [open question (--force-open)]",
  "cli.roles.help.force": "No warning when adding to a paused project",
  "cli.roles.help.forceOpen": "Add it even though it cannot be written as options; marked as an open question",
  "cli.roles.notePrefix.rewritten": "Rewritten as",
  "cli.roles.notePrefix.shelved": "Shelved",
  "cli.roles.notePrefix.stale": "Stale",
  "cli.roles.notePrefix.supervisor": "Leader decided",
  "cli.roles.optionMarkAfter": ".:)/",
  "cli.roles.optionMarkBefore": ";/:,",
  "cli.roles.overturnDetail": "The user overturned the leader's decision: {body}",
  "cli.roles.overturnJoin": "; ",
  "cli.roles.ownerLeader": "{project} <leader>",
  "cli.roles.ownerNone": "no <leader>",
  "cli.roles.pauseAlready": "roles pause: {project} is already paused",
  "cli.roles.pauseNone": "No paused projects",
  "cli.roles.pausedWarning": "Warning: {project} is paused; the AFC panel will not show this item or remind the user (added; pass --force to skip this warning)",
  "cli.roles.recommendWord": "Recommend",
  "cli.roles.refuse.detail": "{reason} (now {provider}/{model})",
  "cli.roles.resumeNotPaused": "roles resume: {project} is not paused",
  "cli.roles.sourceLeader": "leader",
  "cli.roles.staleNone": "No item has waited more than {days} days without blocking work",
  "cli.roles.staleRow": "  {id} waiting {days} d {title}",
  "cli.roles.status.done": "user decided",
  "cli.roles.status.open": "open",
  "cli.roles.status.overturned": "overturned",
  "cli.roles.status.rewritten": "rewritten",
  "cli.roles.status.shelved": "shelved",
  "cli.roles.status.stale": "stale",
  "cli.roles.status.supervisor": "leader decided",
  "cli.roles.unknownRole": "roles: unknown role {key}. Known: {known}, patrol (inspection). Candidate profiles: {cands}",
  "cli.roles.addRequired": "roles decide add: --project and --title are required",
  "cli.roles.check.badParams": "invalid params {params}",
  "cli.roles.check.codexStale": " (found in Codex catalog; Paseo's model list is stale until the daemon restarts)",
  "cli.roles.check.cursorMissing": "Cursor has no model {model}",
  "cli.roles.check.cursorModels": "cannot list Cursor models (not logged in?)",
  "cli.roles.check.cursorOk": "cursor-cloud/{model} ok",
  "cli.roles.check.familiesDiffer": "families differ ({left} vs {right})",
  "cli.roles.check.modelMissing": "model {model} not offered by {provider}",
  "cli.roles.check.modelPolicy": "model {model} not allowed by policy {allowed}",
  "cli.roles.check.noProfile": "no profile for this role",
  "cli.roles.check.ok": "{provider}/{model} ok{note}",
  "cli.roles.check.paramPolicy": "param {name} must be {value} by policy",
  "cli.roles.check.providerDown": "provider {provider} not available ({status})",
  "cli.roles.check.sameFamily": "same family ({family}); maker and checker must differ",
  "cli.roles.check.thinking": "thinking {thinking} not in {options}",
  "cli.roles.commentIdRequired": "roles decide comment: id is required",
  "cli.roles.commentNoteRequired": "roles decide comment: --note is required",
  "cli.roles.decideBusy": "roles decide: decisions.json is busy, try again",
  "cli.roles.decideFailed": "roles decide: {message}",
  "cli.roles.decidedNoteRequired": "roles decide decided: --note is required",
  "cli.roles.decidedRequired": "roles decide decided: --project and --title are required",
  "cli.roles.doneIdRequired": "roles decide done: id is required",
  "cli.roles.lsFailed": "roles ls failed",
  "cli.roles.migrateNone": "no decisions.json to migrate",
  "cli.roles.migrateRaced": "decisions.json changed while migrating; nothing written",
  "cli.roles.noItem": "no item {id}",
  "cli.roles.notSupervisor": "{id} is not a supervisor decision (status {status})",
  "cli.roles.overturnIdRequired": "roles decide overturn: id is required",
  "cli.roles.pauseUnreadable": "roles pause: cannot read paused-projects.json: {error}",
  "cli.roles.projectRequired": "roles {cmd}: project is required",
  "cli.roles.set.cloudExecutor": "roles: cloud_executor runs on Cursor Cloud; use cursor/<model>",
  "cli.roles.set.droppedFeatures": "note: provider changed; dropped old featureValues (pass --feature to set)",
  "cli.roles.set.droppedMode": "note: provider changed; dropped old modeId (pass --mode to set one)",
  "cli.roles.set.dryRun": "dry run: nothing written",
  "cli.roles.set.noPool": "roles: no plan in plans.json lists provider {provider}, so there is no quota pool to move to; nothing written",
  "cli.roles.set.poolMoved": "note: provider changed; pool {old} -> {new}",
  "cli.roles.set.target": "roles: target must be <provider>/<model>",
  "cli.roles.set.validationFailed": "roles: validation failed; nothing written (use --force to override)",
  "cli.roles.set.validationForced": "roles: validation failed but --force given",
  "cli.roles.set.written": "written; Paseo reloaded; backup in {dir}",
  "cli.roles.staleDays": "roles decide stale: --days must be >= 0",
  "cli.roles.decideUnreadable": "cannot read decisions.json: {error}",
  "cli.roles.decideNotList": "decisions.json is not a list",
  "cli.roles.decideRaced": "decisions.json changed while updating; nothing written",
  "cli.roles.prefixed": "roles: {message}",
  "cli.roles.unregistered": "not registered",
  "cli.roles.waitedDays": "waiting {days} d",
  "cli.roles.waitedUnknown": "waiting ? d",
  "compat.audit.agentFields": "paseo ls -g --json lacks id, cwd or name",
  "compat.audit.claudeTranscripts": "Claude transcripts",
  "compat.audit.cmdFailed": "{command} failed: {error}",
  "compat.audit.codexTranscripts": "Codex transcripts",
  "compat.audit.commandFailed": "command failed",
  "compat.audit.configModelMissing": "The config.model field is gone from the agent record files",
  "compat.audit.configUnreadable": "config.json is unreadable or not JSON",
  "compat.audit.daemonLogUnreadable": "Can't read daemon.log",
  "compat.audit.fieldMissing": "{command} lacks the {key} field",
  "compat.audit.formatMismatch": "The format of {label} does not match",
  "compat.audit.helpNoJson": "The help of {command} does not mention --json",
  "compat.audit.labelsRoleMissing": "The labels.role field is gone from the agent record files",
  "compat.audit.noDaemonVersion": "daemon.log has no daemonVersion",
  "compat.audit.noProfiles": "config.json has no valid daemon.agentProfiles array",
  "compat.audit.emptyRecords": "Agent record field sampling skipped: a new host has no profiles or agent history.",
  "compat.audit.emptyProfiles": "Profile field sampling skipped: this host has no configured profiles.",
  "compat.audit.notJson": "output is not JSON",
  "compat.audit.notList": "{command} did not return a list",
  "compat.audit.parentMissing": "The paseo.parent-agent-id field is gone from the agent record files",
  "compat.audit.pluginError": "agent-fleet-cockpit has a non-empty ERROR: {error}",
  "compat.audit.pluginMissing": "agent-fleet-cockpit is not in paseo plugin ls",
  "compat.audit.pluginNotRunning": "agent-fleet-cockpit is not running (it is {status})",
  "compat.audit.profileFields": "Agent profiles lack role, provider or name",
  "compat.audit.recordKeyMissing": "The {key} field is gone from the agent record files",
  "compat.audit.recordsUnreadable": "Can't read the agent record files",
  "compat.audit.serverIdUnreadable": "Can't read server-id",
  "compat.audit.sessionMissing": "The persistence.sessionId field is gone from the agent record files",
  "compat.audit.startupTimeUnparsed": "Can't parse the time field of Starting daemon worker in daemon.log",
  "compat.audit.statusEmpty": "empty",
  "compat.audit.timelineTypesMissing": "Timeline types tool_call / assistant_message / reasoning are not in the SDK declarations",
  "compat.audit.turnEndedMissing": "Plugin event agent.turn_ended is not in the SDK declarations",
  "compat.script.failed": "Compatibility check failed: {detail} (Paseo {version})",
  "compat.script.filesPassed": "Record files check passed",
  "compat.script.livePassed": "Commands and events check passed",
  "compat.script.noTests": "no offline tests in tmp/harness",
  "compat.script.passed": "Compatibility check passed (Paseo {version})",
  "compat.script.pluginRunning": "Plugin is running",
  "compat.script.testFailed": "offline test {name} failed",
  "compat.script.testPassed": "Offline test passed {name}",
  "compat.script.tscFailed": "type check tsc --noEmit failed",
  "compat.script.tscPassed": "Type check passed",
  "compat.script.unknownVersion": "unknown version",
  "compat.script.untracked": "Compatibility check failed: tmp/harness has tests not tracked by git (add them with git add -f, or delete them):\n{names}\n(Paseo {version})",
  "compat.script.untrackedUnknown": "can't tell whether tmp/harness has untracked tests (git ls-files failed): {error}",
  "coupons.alerts.ask": "{lead}: {company}, coupon {index} of {total}, {type}, {used}, {gap}, {extra}",
  "coupons.alerts.claudeExpiringKind": "Claude reset coupon expires soon",
  "coupons.alerts.claudeExpiringText": "This coupon expires in {days} days and is unused",
  "coupons.alerts.claudeUseNowKind": "You can use the Claude reset coupon now",
  "coupons.alerts.codexExpiringText": "ChatGPT has 1 reset coupon expiring in {days} days",
  "coupons.alerts.codexKind": "ChatGPT reset coupon",
  "coupons.alerts.gain": "using it adds about {pct}%",
  "coupons.alerts.gainUnknown": "how much it would add not read yet",
  "coupons.alerts.howTo": "Use it at claude.ai Settings \u2192 Usage \u2192 Reset for free",
  "coupons.alerts.resetGapUnknown": "time to the natural reset not read yet",
  "coupons.alerts.resetInDays": "{days} d {hours} h to the natural reset",
  "coupons.alerts.resetInHours": "{hours} h to the natural reset",
  "coupons.alerts.resetReached": "natural reset reached",
  "coupons.alerts.resetUnderHour": "under 1 h to the natural reset",
  "coupons.alerts.typeKnown": 'type "{type}"',
  "coupons.alerts.typeUnknown": "type not read yet",
  "coupons.alerts.usedNow": "{pct}% used now",
  "coupons.alerts.usedUnknown": "usage not read yet",
  "coupons.alerts.waitingText": "{waiting}. {ask}",
  "coupons.bin.captureFailed": "Screenshot failed; no key pressed",
  "coupons.bin.chose": "Chose: {phrase}",
  "coupons.bin.claudeClosed": "Claude screen closed",
  "coupons.bin.claudeMissing": "claude not found; the screen was not opened",
  "coupons.bin.commandMissing": "Required command {command} was not found on PATH.",
  "coupons.bin.claudeOpened": "Claude screen opened",
  "coupons.bin.codexInterrupted": "codex interrupted",
  "coupons.bin.codexRequestFailed": "codex request failed",
  "coupons.bin.codexTimeout": "codex timed out",
  "coupons.bin.codexTooLong": "codex reply too long",
  "coupons.bin.cursorUnclear": "Cursor position unclear; did not press Enter",
  "coupons.bin.fakeFileMissing": "Fake screen file missing",
  "coupons.bin.keyFailed": "Key press failed; did not press Enter",
  "coupons.bin.noNextRead": "No next reading",
  "coupons.bin.notWeeklyAnymore": "The box no longer says weekly quota; no key pressed",
  "coupons.bin.recaptureFailed": "Screenshot after moving the cursor failed; did not press Enter",
  "coupons.bin.redeemArgsEmpty": "Coupon arguments are empty",
  "coupons.bin.redeemSent": "Coupon request submitted",
  "coupons.bin.screenExit": "screen did not exit normally",
  "coupons.bin.screenTimeout": "screen timed out",
  "coupons.bin.typed": "Typed /limit-reset",
  "coupons.bin.unreadable": "Could not read the screen; no key pressed",
  "coupons.burn.back": "back half",
  "coupons.burn.banner": "Claude burn week ({start}\u2013{end}): push to 100%, use the coupon at the cap, then use up to 97%. Now in the {where}",
  "coupons.burn.chatgptBanner": "ChatGPT burning coupons: {count} left (earliest expires {clock}); this week's target is the cap in 3.5 days",
  "coupons.burn.doubleWeekAnnounce": "This week Claude quota is backed by a reset coupon: send more of the backlog; hard work can use a stronger model",
  "coupons.burn.front": "front half",
  "coupons.cli.checkedOn": ", last checked {date}",
  "coupons.cli.checkedUnknown": ", last check not recorded",
  "coupons.cli.confirmedDaysAgo": "confirmed {days} days ago",
  "coupons.cli.confirmedToday": "confirmed earlier today",
  "coupons.cli.loginWord": "please log in",
  "coupons.cli.manualClosed": "CLI check is off; showing the hand entry",
  "coupons.cli.manualUnseen": "The CLI cannot see coupons; showing the hand entry",
  "coupons.cli.notConfirmed": "not confirmed yet",
  "coupons.cli.reasonLogin": "Login text on screen; did not choose Yes",
  "coupons.cli.reasonLookOnly": "Look only; chose No",
  "coupons.cli.reasonNotWeekly": "The box is not the weekly quota; chose No",
  "coupons.cli.reasonSession": "The box is the 5-hour window; chose No",
  "coupons.cli.reasonTimeout": "Timed out; did not choose Yes",
  "coupons.cli.reasonUnreadable": "Could not read the screen; did not choose Yes",
  "coupons.cli.reasonWeekly": "The box says weekly quota",
  "coupons.codex.defaultTitle": "Reset coupon",
  "coupons.codex.excerpt": "{title} \xD7{count}",
  "coupons.codex.gateLow": "{pct}% used, under {min}%; refusing to use a coupon",
  "coupons.codex.gateNone": "No usable reset coupon; refusing to use one",
  "coupons.codex.gateUnread": "Could not read the used percent; refusing to use a coupon",
  "coupons.codexRead.initFailed": "codex initialize failed",
  "coupons.codexRead.interrupted": "codex usage read interrupted",
  "coupons.codexRead.loggedOut": "codex is stuck at login",
  "coupons.codexRead.readFailed": "codex reset coupon read failed",
  "coupons.codexRead.refused": "Refused reset coupon command",
  "coupons.codexRead.timeout": "codex usage read timed out",
  "coupons.codexRead.tooLong": "codex usage read too long",
  "coupons.core.askLead": "Please ask the user whether to use the coupon now",
  "coupons.core.burnCapReason": "At the cap, waiting for the coupon",
  "coupons.core.cardEstimateUnknown": "plenty of quota (per-card usage not measured yet)",
  "coupons.core.claudeCapKind": "Claude is at the cap; time to use the coupon",
  "coupons.core.codexCapKind": "ChatGPT is at the cap; time to use the coupon",
  "coupons.core.codexExpiryKind": "ChatGPT coupon expires soon; time to use it",
  "coupons.core.dateLabel": "{m}/{d}",
  "coupons.core.waitingConfirm": "Waiting for you to confirm the coupon",
  "coupons.credits.datesUnread": "Credits dates unreadable; dispatch paused",
  "coupons.credits.expired": "Credits expired; dispatch paused",
  "coupons.credits.floor": "Credits balance {balance}, not above {floor}; dispatch paused",
  "coupons.credits.line": "Credits: balance {balance}{stale}, {when}",
  "coupons.credits.lineUnread": "Credits: balance unreadable, {when}",
  "coupons.credits.overBudget": "{used} credits used this week, over the weekly budget of {budget}; dispatch paused",
  "coupons.credits.stale": " (not read for over 1 hour)",
  "coupons.credits.unread": "Credits unreadable; dispatch paused",
  "coupons.credits.using": "Weekly quota used up; using credits (balance {balance}, this week's budget about {budget}, used {used} this week)",
  "coupons.credits.weekUnknown": "This week's credits use cannot be confirmed; dispatch paused",
  "coupons.credits.when": "usable from {start}, expires {end}",
  "coupons.doubleWeek.fallback": "{head}. The fallback week has started; dispatching double this week too",
  "coupons.doubleWeek.head": "Planned double week {start}\u2013{mid}, fallback week {mid}\u2013{end}",
  "coupons.doubleWeek.planned": "{head}. Dispatching double this week (stop line 90%, send work here first)",
  "coupons.doubleWeek.used": "{head}. This coupon is used; stop line back to 75%",
  "coupons.kind.full": "restores all",
  "coupons.kind.session": "restores 5-hour",
  "coupons.kind.unknown": "restores weekly / type unverified",
  "coupons.kind.weekly": "restores weekly",
  "coupons.line.daysLeft": "{days} days left",
  "coupons.line.expired": "expired",
  "coupons.line.expiresOn": "expires {date}",
  "coupons.line.expiresToday": "expires today",
  "coupons.line.expiryUnknown": "expiry date unknown",
  "coupons.line.full": "Reset coupons: {count} ({kind}{typeBit}), {date}{tail}{where}{used}{note}{pieces}",
  "coupons.line.none": "No reset coupon{note}",
  "coupons.line.note": " ({note})",
  "coupons.line.piece": "#{n} {title}, {when}",
  "coupons.line.pieceExpires": "expires {clock}",
  "coupons.line.pieces": ". {pieces}",
  "coupons.line.piecesJoin": "; ",
  "coupons.line.tail": ", {left}",
  "coupons.line.typeBit": ", confirmation box: {type}",
  "coupons.line.used": ". This coupon is used",
  "coupons.line.where": "; {where}",
  "coupons.page.excerpt": "usage API field {key}: {count}",
  "coupons.signals.episode": "{kind}. {text}. {noSelfUse} {cli}.",
  "coupons.signals.noSelfUse": "AFC never uses a coupon by itself. After the user agrees, run bin/afc-use-coupon",
  "coupons.signals.officialKind": "ChatGPT was just reset officially",
  "coupons.signals.redUse": "{kind}. {text}. AFC will not tap it for you.",
  "coupons.signals.suspectedKind": "Claude usage dropped sharply",
  "coupons.signals.suspectedText": "Claude usage dropped about {points} points within the same period. Possibly an official reset or you used the coupon. Ask the user: did you just use the coupon?",
  "coupons.signals.usedKind": "Coupon used",
  "coupons.signals.usedText": "Coupon used. {company} usage dropped about {points} points. Be sure to tell the user.",
  "coupons.surplus.addWorkPrefix": "[Quota notice \xB7 AFC <leader> only] ",
  "coupons.surplus.addWorkSuffix": "Report to the user first with A/B/C options; dispatch only after the user names the projects. Do not forward this to project <leader>s.",
  "coupons.surplus.allUsable": " ({roles} can all use it)",
  "coupons.surplus.message": "Burn week, more work. By the progress line you can still dispatch today: {parts}",
  "coupons.surplus.notice": "{prefix}{text}. {suffix}",
  "coupons.surplus.official": "{name} was just reset officially, about {pct}% more; {many}",
  "coupons.surplus.officialCards": "about {cards} more cards today by the progress line{roles}",
  "coupons.surplus.officialRoleJoin": "/",
  "coupons.surplus.officialRoles": " ({roles})",
  "coupons.surplus.partJoin": ". ",
  "coupons.surplus.poolCards": "{name}: about {cards} cards today{share}",
  "coupons.surplus.poolUnknown": "{name}{share}: {estimate}",
  "coupons.surplus.roleExecutor": "executor",
  "coupons.surplus.roleJoin": ", ",
  "coupons.surplus.roleReader": "reader",
  "coupons.surplus.roleReviewer": "reviewer",
  "coupons.surplus.shared": " ({roles} share it)",
  "coupons.surplus.usable": " ({roles} can use it)",
  "coupons.use.claudeConfirmWeekly": "Claude: reading the confirmation box; confirm only if it says weekly",
  "coupons.use.claudeLookOnly": "Claude: only reading the confirmation box, not using",
  "coupons.use.codexReadFirst": "Codex: reading the count and usage first",
  "coupons.use.confirmed": "One coupon fewer, and usage is back down",
  "coupons.use.frameEmpty": "(empty)",
  "coupons.use.frameSummary": "Screen summary: {text}",
  "coupons.use.lockRefusal": "Another coupon command is running or exited abnormally last time: lock file {path}, pid {pid}, started {started}. Once you are sure it is not running, delete this lock file by hand and retry",
  "coupons.use.noCredit": "No usable coupon read; refusing to use one",
  "coupons.use.noOutcome": "no outcome field",
  "coupons.use.notConfirmed": "Have not yet seen both one coupon fewer and usage back down",
  "coupons.use.notPressed": "Did not press the confirm key",
  "coupons.use.outcome": "Result: {outcome}",
  "coupons.use.pct": "{pct}%",
  "coupons.use.pickEarliest": "Using the coupon that expires first ({title}). The coupon id is not logged",
  "coupons.use.readAfter": "After use: {count} coupons, {used} used",
  "coupons.use.readCount": "Read {count} coupons, {used} used",
  "coupons.use.refillText": "Confirmation box text: {text}",
  "coupons.use.typeLimitReset": "Typing /limit-reset",
  "coupons.use.unknown": "unknown",
  "coupons.use.usage": "Usage: bin/afc-use-coupon <claude|codex> [--confirm-weekly]",
  "coupons.use.waitRefresh": "Wait for the next quota refresh to see whether usage returns to zero",
  "coupons.view.burnMode": "Coupon burn mode",
  "coupons.view.summary": "{name}: {count}, {kind}, {when}{note}",
  "coupons.view.summaryExpires": "expires {date}",
  "coupons.view.summaryJoin": "; ",
  "coupons.view.summaryNone": "{name}: no reset coupon{note}",
  "cursor.access.in": "Logged in",
  "cursor.access.notChecked": "Not checked yet. {caveat}",
  "cursor.access.out": "Not logged in",
  "cursor.access.partialDetail": "Half logged in (no refresh credential; it drops when it expires, log in again). {caveat}",
  "cursor.access.unknown": "Unknown",
  "cursor.access.unknownDetail": "Unknown ({why}). {caveat}",
  "cursor.access.whyMissing": "command not found",
  "cursor.access.whyTimeout": "timed out",
  "cursor.access.whyUnclear": "could not tell the login state this time",
  "cursor.api.format": "Official API response format changed",
  "cursor.api.grokDenied": "No permission to read Agent sandbox",
  "cursor.api.grokFormat": "Agent sandbox response format changed",
  "cursor.api.grokNetwork": "Agent sandbox part: network error",
  "cursor.api.grokNotSeparate": "This plan has no separate Agent sandbox quota",
  "cursor.api.network": "Official API network error",
  "cursor.api.reconnect": "Connection lost, please reconnect",
  "cursor.join.clause": "{a}; {b}",
  "cursor.join.sentence": "{a}. {b}",
  "cursor.login.alarm": "Cursor is not logged in (version {version}); Cursor executor cards will fail",
  "cursor.login.alertKind": "Cursor not logged in",
  "cursor.login.maybeUpgrade": "{base}. Possibly caused by the upgrade",
  "cursor.login.notifyFailed": "{when} notice not sent {count}/{limit}",
  "cursor.login.partialLabel": "Half logged in",
  "cursor.login.partialNotice": "Cursor is only half logged in (no refresh credential; it drops when it expires. Run cursor-agent login again)",
  "cursor.login.poolResume": "Cursor login is back; cursor pool reopened",
  "cursor.login.poolStop": "cursor pool stopped dispatching",
  "cursor.login.unknownVersion": "unknown",
  "cursor.login.versionNote": "cursor-agent upgraded from {from} to {to}",
  "cursor.token.mode": "Cursor login file has wrong permissions",
  "cursor.token.save": "Cursor login info was not saved back",
  "cursor.token.unreadable": "Login info can't be read right now",
  "cursor.token.write": 'Login info was not saved. Click "Connect Cursor" again.',
  "cursor.usage.browser": 'The browser did not open. Click "Connect Cursor" again.',
  "cursor.usage.connectFailed": 'The connection did not finish. Click "Connect Cursor" again.',
  "cursor.usage.disconnect": "Cursor disconnected. Switching to the CLI screen; until then old official numbers are not taken as current quota.",
  "cursor.usage.disconnected": "Cursor disconnected; login file deleted.",
  "cursor.usage.loginLost": "Cursor lost its login after the usage read. Automatic reading has stopped and did not log in again. Log in to Cursor again on this machine.",
  "cursor.usage.loginRefused": 'Authorization did not finish. You can click "Connect Cursor" again.',
  "cursor.usage.loginTimeout": 'No authorization after 5 minutes. You can click "Connect Cursor" again.',
  "cursor.usage.manual": "The CLI screen failed too; showing the hand copy",
  "cursor.usage.noAutoOnScreen": "No Auto used percent on the screen",
  "cursor.usage.noAutoPct": "No Auto used percent after typing /usage",
  "cursor.usage.noPrompt": "The input box never appeared",
  "cursor.usage.opened": "Browser opened. Log in and authorize on the page. This is AFC's own login; no other app's token is used.",
  "cursor.usage.screen": "This read used the CLI screen",
  "cursor.usage.screenNotRead": "Nothing read from the CLI screen",
  "cursor.usage.staleOfficial": "The card still shows the last successful official reading",
  "cursor.usage.statusUnknown": "cursor-agent status did not confirm login; screen not opened",
  "cursor.usage.unlinked": `Cursor is not connected yet. Click "Connect Cursor" and authorize in the browser. This is AFC's own login.`,
  "cursor.usage.waiting": "Waiting for you to authorize in the browser. Until then, quota is shown the old way.",
  "daemon.crash.detailAgent": "Agent involved: {agent}",
  "daemon.crash.detailCwd": "Directory: {cwd}",
  "daemon.crash.detailError": "{time} error text: {message}",
  "daemon.crash.homeClause": "The Paseo daemon crashed {count} times today",
  "daemon.crash.kind": "Daemon crashes",
  "daemon.crash.none24h": "No crashes in the last 24 hours",
  "daemon.crash.none24hLast": "No crashes in the last 24 hours (last one {time})",
  "daemon.crash.notRead": "not read",
  "daemon.crash.noticeAgent": "Agent involved: {agent}. ",
  "daemon.crash.noticeCwd": "Directory: {cwd}. ",
  "daemon.crash.noticeEmpty": "The Paseo daemon just crashed repeatedly. Check the alerts on the home page. Do not open agents whose working directory no longer exists.",
  "daemon.crash.noticeError": "Error text: {message}. ",
  "daemon.crash.noticeHead": "The Paseo daemon crashed {count} times in 10 minutes, last at {time}. ",
  "daemon.crash.noticeTail": "Check the alerts on the home page. Do not open agents whose working directory no longer exists.",
  "daemon.crash.today": "The Paseo daemon crashed {count} times today, last at {time}",
  "daemon.crash.within24h": "{count} crashes in the last 24 hours, none today yet, last at {time}",
  "daemon.missing.checkKind": "Missing-directory check",
  "daemon.missing.found": "{count} agents have a missing working directory (this can crash the daemon), list: {path}",
  "daemon.missing.kind": "Working directory missing",
  "daemon.missing.unavailable": "The missing-directory check is unavailable for now",
  "decisions.actions.addNote": "Add a note",
  "decisions.actions.askOptions": "Ask the <leader> to rewrite it as options",
  "decisions.actions.cancel": "Cancel",
  "decisions.actions.cancelPick": "Cancel choice",
  "decisions.actions.change": "Change",
  "decisions.actions.changingNote": "Changing sends one more notice. If it cannot be sent, the earlier choice stays.",
  "decisions.actions.confirm": "Confirm",
  "decisions.actions.confirmPick": "Confirm {letter}",
  "decisions.actions.hideNote": "Hide note box",
  "decisions.actions.keep": "Keep it",
  "decisions.actions.noOptions": "This one has no options",
  "decisions.actions.noText": "(no text)",
  "decisions.actions.noteHint": '"Send" only passes it to the <leader>; this stays undecided.',
  "decisions.actions.noteHintWithOptions": '"Send" only passes it to the <leader>; this stays undecided. Picking an option also sends this note.',
  "decisions.actions.openSession": "Open this <leader>'s session",
  "decisions.actions.openSessionLabel": "Open this <leader>'s session {title}",
  "decisions.actions.pick": "Pick {letter}",
  "decisions.actions.pickWithText": "Pick {letter}: {text}",
  "decisions.actions.reason": "Why: {reason}",
  "decisions.actions.recommended": "Recommended",
  "decisions.actions.recommendedSuffix": " (recommended)",
  "decisions.actions.saving": "Saving\u2026",
  "decisions.actions.send": "Send",
  "decisions.actions.sendNote": "Send this note",
  "decisions.actions.sessionMissing": "Cannot find this <leader>'s session",
  "decisions.actions.shelve": "Shelve",
  "decisions.actions.shelveConfirm": "This project has no <leader>. Shelve this item? It will be recorded as shelved.",
  "decisions.actions.shelveNo": "Cancel shelving",
  "decisions.actions.shelveYes": "Shelve",
  "decisions.actions.shelveYesLabel": "Confirm shelving this item",
  "decisions.card.chosen": "Picked {letter} \xB7 {middle} \xB7 {clock}",
  "decisions.card.chosenShort": "Picked {letter} \xB7 {clock}",
  "decisions.card.confirm": "Pick {letter}?",
  "decisions.card.confirmWithText": "Pick {letter}: {summary}?",
  "decisions.card.notified": "Notified {who}",
  "decisions.card.summary": "{count} to decide",
  "decisions.card.summaryBlocking": "{count} to decide \xB7 {blocking} blocking work",
  "decisions.card.waitDays": "Waiting {days} days",
  "decisions.card.waitUnderDay": "Waiting less than 1 day",
  "decisions.card.waitUnknown": "Waiting time unknown",
  "decisions.cardView.openAgent": "View the responsible agent",
  "decisions.cardView.showAll": "Show all",
  "decisions.cardView.showLess": "Show less",
  "decisions.change.badChoice": "Choice not recognized; nothing was changed",
  "decisions.change.badId": "This item's id is invalid; nothing was changed",
  "decisions.change.failed": "Could not change it, {kept}: {error}",
  "decisions.change.kept": "your earlier choice still stands",
  "decisions.change.noNewId": "no id came back for the new item",
  "decisions.change.notFound": "Answered decision not found; could not change it, {kept}",
  "decisions.change.recordedNoLeader": "Recorded: changed to {to}; {noLeader}",
  "decisions.change.recordedNotified": "Recorded: changed to {to}. Notified {title}",
  "decisions.change.recordedNotifyFailed": "Recorded: changed to {to}, but notifying failed: {error}",
  "decisions.change.same": "Same as the current choice ({from}); nothing changed",
  "decisions.change.tooOld": "Answered more than 24 hours ago; it can no longer be changed, {kept}",
  "decisions.change.unfinishedNote": "Shelved: the change did not finish; put away automatically",
  "decisions.change.unreadable": "Could not tell which option was picked; not changed, {kept}",
  "decisions.hanging.days": "Open {days} days",
  "decisions.hanging.underDay": "Open less than 1 day",
  "decisions.hanging.unknown": "Open for an unknown time",
  "decisions.list.empty": "Nothing needs your decision right now",
  "decisions.list.filterAll": "All {count}",
  "decisions.list.filterOnly": "Only {label}",
  "decisions.list.maintOff": "Stale reminders off",
  "decisions.list.maintOn": "Stale reminders on",
  "decisions.list.maintTurnOff": "Turn off stale reminders and auto-shelve",
  "decisions.list.maintTurnOn": "Turn on stale reminders and auto-shelve",
  "decisions.list.overturn": "Overturn",
  "decisions.list.overturnLabel": "Overturn {id}",
  "decisions.list.overturning": "Overturning\u2026",
  "decisions.list.settingsHint": 'Blocking items come first. Tap an option, then "Confirm", to decide; a note goes to this <leader>.',
  "decisions.list.shelveAll": "Shelve all",
  "decisions.list.shelveAllCancel": "Cancel shelve all",
  "decisions.list.shelveAllConfirm": "Confirm shelve all",
  "decisions.list.shelveAllConfirmLabel": "Confirm shelving all {count} items of {project}",
  "decisions.list.shelveAllLabel": "Shelve all of {project}",
  "decisions.list.shelving": "Shelving\u2026",
  "decisions.list.supervisorEmpty": "No <leader> decisions from the last 7 days for you to overturn",
  "decisions.list.unreadTitle": "<leader> replied",
  "decisions.maint.autoShelveNote": "Shelved: open 7 days with no answer (AFC auto)",
  "decisions.maint.digestHead": "You have {reminds} decisions open for 3 days, and {shelves} shelved today under the 7-day rule.",
  "decisions.maint.legacyIdRef": "({id})",
  "decisions.maint.remindBlocking": "{line}. Blocking items are never shelved automatically.",
  "decisions.maint.remindLine": '{id} \xB7 {project} \xB7 {title} \xB7 open {days} days \xB7 suggested command: roles decide done {id} --as stale --note "Stale: \u2026"',
  "decisions.maint.shelveLine": '[Decision auto-shelved] {id} \xB7 {project} \xB7 {title} \xB7 open {days} days \xB7 suggested command: roles decide done {id} --as shelved --note "{note}"',
  "decisions.meta.blocking": "Blocking work",
  "decisions.meta.deferred": "Not now",
  "decisions.meta.maybeStale": "May be stale",
  "decisions.note.changed": "User changed to {choice} in the AFC panel",
  "decisions.note.join": "{a}. {b}",
  "decisions.note.picked": "User picked {choice} in the AFC panel",
  "decisions.note.superseded": "The user changed this from {from} to {to}; see {newId}",
  "decisions.note.text": ": {text}",
  "decisions.note.wasPicked": " (was {oldId}, picked {from})",
  "decisions.overturn.failed": "Overturn failed",
  "decisions.overturn.notice": "The user overturned: {project} \xB7 {title}. {body}",
  "decisions.overturn.reopenedNotNotified": "Reopened; the <leader> was not notified",
  "decisions.overturn.reopenedNotified": "Reopened and notified the <leader>",
  "decisions.overturn.reopenedNotifyFailed": "Reopened; notifying the <leader> failed: {error}",
  "decisions.owner.none": "No <leader>",
  "decisions.parse.bullets": "\u2022",
  "decisions.parse.contextLead": "Now|Status|Context",
  "decisions.parse.optionsTail": "Options|Choose one|Choose|Pick one",
  "decisions.parse.pick": "picked|changed to",
  "decisions.parse.reasonLead": "Reason|Because|Why",
  "decisions.parse.recommend": "Recommended|Recommend|recommended",
  "decisions.parse.recommendPick": "option|pick",
  "decisions.parse.recorded": "Recorded",
  "decisions.prompt.askOptions": '[Add options] {id} "{title}": the user cannot follow this one. Rewrite it as A/B/C options with a recommendation (rewrite it with roles decide, or close it and open a new one), then tell the user.',
  "decisions.prompt.changed": '[User changed choice] The user changed {oldId} "{title}" from {from} to {to}. {said}Undo what was set up for {from}, carry out {to} instead, and report back.',
  "decisions.prompt.decided": '[User decision] {id} "{title}": the user picked {choice}. {said}Carry out this decision and report back.',
  "decisions.prompt.said": "{text}. ",
  "decisions.prompt.userComment": '[User message] {id} "{title}": {text}. Still undecided; please respond.',
  "decisions.proxy.item": "{project} ({code})",
  "decisions.proxy.itemEnded": "{project} ({code}) ended",
  "decisions.proxy.line": "Also covers: {list}",
  "decisions.proxy.listSeparator": ", ",
  "decisions.proxy.titleSeparators": "\xB7",
  "decisions.reply.askFailed": "Request not sent: {error}",
  "decisions.reply.asked": "Asked {title} to add options",
  "decisions.reply.badChoice": "Choice not recognized; nothing was submitted",
  "decisions.reply.badId": "This item's id is invalid; nothing was submitted",
  "decisions.reply.commentSavedNoLeader": "Note saved; {noLeader}",
  "decisions.reply.commentSavedNotifyFailed": "Note saved, but notifying failed: {error}",
  "decisions.reply.needText": "Write a sentence first",
  "decisions.reply.noLeader": "This project has no <leader>; no message was sent",
  "decisions.reply.notOpen": "No such open decision, or it is already closed",
  "decisions.reply.notRecorded": "Not recorded: {error}",
  "decisions.reply.notifyFailed": "Notifying failed: {error}",
  "decisions.reply.nowOwned": "This project now has a <leader>; refresh the panel and try again",
  "decisions.reply.passedOn": "Passed on to {title}; still undecided",
  "decisions.reply.projectLeader": "this project's <leader>",
  "decisions.reply.recordedNoLeader": "Recorded: picked {choice}; {noLeader}",
  "decisions.reply.recordedNotified": "Recorded: picked {choice}. Notified {title}",
  "decisions.reply.recordedNotifyFailed": "Recorded: picked {choice}, but notifying failed: {error}",
  "decisions.reply.shelveFailed": "Not shelved: {error}",
  "decisions.reply.shelved": "Shelved this item",
  "decisions.reply.userShelveNote": "Shelved: the user put it away in the panel (project has no <leader>)",
  "decisions.source.default": "<leader>",
  "decisions.unowned.confirmFirst": "Confirm shelving them all first",
  "decisions.unowned.failureSeparator": "; ",
  "decisions.unowned.hint": "To move these forward, open a <leader> for the project in Paseo with the supervisor profile; otherwise shelve them all",
  "decisions.unowned.itemFailure": "{id}: {message}",
  "decisions.unowned.notInGroup": "not part of this project without a <leader>",
  "decisions.unowned.shelved": "Shelved {closed} / {total}",
  "decisions.unowned.shelvedWithFailures": "Shelved {closed} / {total}; {failures}",
  "decisions.unowned.title": "{project} has no <leader> yet (only you can open one)",
  "decisions.view.hintDecide": "If there are letters, tap one and it is recorded. A note only goes to the <leader>; this stays undecided. No letters? Ask the <leader> to rewrite it as options.",
  "decisions.view.hintUnread": "Just open that <leader>'s session and take a look",
  "decisions.view.shelveConfirm": "Shelve all {count} items of {project}? They will be recorded as shelved.",
  "dispatch.candidateTag": "(candidate)",
  "dispatch.clauseSeparator": "; ",
  "dispatch.effortDefault": "profile default",
  "dispatch.lineupItem": "{name} \xB7 {family} \xB7 {model} \xB7 {effort} \xB7 {pool} \xB7 {status} \xB7 {runs} today",
  "dispatch.noPool": "No quota pool",
  "dispatch.noProfiles": "Cannot read profiles; dispatch order is left unchanged",
  "dispatch.pauseMark": "[Paused]",
  "dispatch.priority.auto": "automatic, by quota",
  "dispatch.priority.line": "Dispatch order ({how}): {names}",
  "dispatch.priority.manual": "set by you, until {until}",
  "dispatch.priority.need": " ({need})",
  "dispatch.priority.needFirst": " (still {need} pts/day to use)",
  "dispatch.priority.unread": " (unreadable)",
  "dispatch.priority.unreadFirst": " (usage unreadable)",
  "dispatch.reasonSeparator": ": ",
  "dispatch.role.batch": "Batch",
  "dispatch.role.decision": "Decision",
  "dispatch.role.executor": "Executor",
  "dispatch.role.opsCloudflare": "Ops \xB7 Cloudflare",
  "dispatch.role.opsGithub": "Ops \xB7 GitHub",
  "dispatch.role.opsNotion": "Docs \xB7 Notion",
  "dispatch.role.opsVercel": "Ops \xB7 Vercel",
  "dispatch.role.reader": "Reader",
  "dispatch.role.reviewer": "Reviewer",
  "dispatch.role.supervisor": "<leader>",
  "dispatch.slot.batchGpt": "Batch \xB7 GPT-6.1-Sol",
  "dispatch.slot.batchGrok": "Batch \xB7 Grok (SuperGrok)",
  "dispatch.slot.decisionGpt": "Decision \xB7 GPT-6.1-Sol",
  "dispatch.slot.decisionGrok": "Decision \xB7 Grok (SuperGrok)",
  "dispatch.slot.executorGpt": "Executor \xB7 GPT-6.1-Sol",
  "dispatch.slot.executorOpus": "Executor \xB7 Opus (long documents)",
  "dispatch.slot.executorSonnet": "Executor \xB7 Sonnet (Claude)",
  "dispatch.slot.readerGpt": "Reader \xB7 GPT-6.1-Sol",
  "dispatch.slot.readerGrok": "Reader \xB7 Grok (SuperGrok)",
  "dispatch.slot.reviewerFable": "Reviewer \xB7 Fable (high risk)",
  "dispatch.slot.reviewerGpt": "Reviewer \xB7 GPT-6.1-Sol",
  "dispatch.slot.reviewerGrok": "Reviewer \xB7 Grok (SuperGrok)",
  "dispatch.roleLine": "{label}: {items}",
  "dispatch.roleLineEmpty": "{label}: no profiles",
  "dispatch.spend.batch": "Batch",
  "dispatch.spend.decision": "Decision",
  "dispatch.spend.executor": "Executor",
  "dispatch.spend.ops": "Ops",
  "dispatch.spend.outside": "Sessions outside Paseo",
  "dispatch.spend.personal": "User's own chats",
  "dispatch.spend.reader": "Reader",
  "dispatch.spend.reviewer": "Reviewer",
  "dispatch.spend.supervisor": "<leader>",
  "dispatch.status.paused": "Paused",
  "dispatch.status.pausedBecause": "Paused: {reason}",
  "dispatch.status.pausedUntil": "Paused until {when}: {head}",
  "dispatch.status.prefer": "Use first",
  "dispatch.status.ready": "Can take work",
  "dispatch.status.readyLater": "Can take work, use others first",
  "dispatch.status.reviewOnly": "Paused: review only this week (temporary exception)",
  "dispatch.title.docs": "Docs",
  "dispatch.title.ops": "Ops",
  "dispatch.unresolvedSlotsWarning": "[afc] Warning: unresolved dispatch slots: {slots}. Existing matrices are preserved; first publication contains only resolved entries.",
  "doctor.age.days": "{n} days",
  "doctor.age.hours": "{n} h",
  "doctor.age.minutes": "{n} min",
  "doctor.checks.claude.configNoVersion": "Config points to {command}, but --version fails",
  "doctor.checks.claude.configOk": "Config points to {command}, version {version}",
  "doctor.checks.claude.desktop": "Claude Code bundled with the Claude desktop app runs {count} ({versions}), not counted",
  "doctor.checks.claude.evidenceConfig": "agents.providers.claude.command in ~/.paseo/config.json",
  "doctor.checks.claude.evidenceWhich": "which -a claude (search PATH)",
  "doctor.checks.claude.noConfig": "agents.providers.claude.command is not set",
  "doctor.checks.claude.noConfigSummary": "The Paseo config has no Claude command",
  "doctor.checks.claude.pathDiff": " (config is {version}, mismatch)",
  "doctor.checks.claude.pathOther": "Another claude on PATH: {path} version {version}{match}",
  "doctor.checks.claude.pathSame": " (same as config)",
  "doctor.checks.claude.sessionPath": "{path} ({version})",
  "doctor.checks.claude.sessionVersionUnknown": "version unknown",
  "doctor.checks.claude.sessionsAwaySame": " ({count} of them on a different path but the same version)",
  "doctor.checks.claude.sessionsOff": "{count} running Claude sessions do not use the configured path or version ({paths}); config is {version}. Old sessions are normal; wait for them to end",
  "doctor.checks.claude.sessionsOk": "{count} Claude sessions all use the configured version{detail}",
  "doctor.checks.claude.summaryOk": "Claude Code {version} is consistent",
  "doctor.checks.claude.summaryRed": "The Claude command in the Paseo config has a problem",
  "doctor.checks.claude.summaryYellow": "Claude Code has mismatched versions or old sessions",
  "doctor.checks.claude.versionNotFound": "unknown",
  "doctor.checks.compat.ago": "{age} ago",
  "doctor.checks.compat.none": "compat-state.json is missing or has no results",
  "doctor.checks.compat.row": "{label}: {status}{conclusion}",
  "doctor.checks.compat.rowConclusion": " ({conclusion})",
  "doctor.checks.compat.summaryFailed": "{count} compatibility checks failed (Paseo {version}, {when})",
  "doctor.checks.compat.summaryNone": "No compatibility check recorded yet",
  "doctor.checks.compat.summaryOk": "All compatibility checks passed (Paseo {version}, {when})",
  "doctor.checks.compat.title": "Paseo compatibility check",
  "doctor.checks.compat.whenUnknown": "time unknown",
  "doctor.checks.coupons.expired": "expired {days} days ago (not used yet?)",
  "doctor.checks.coupons.expiresIn": "expires in {days} days",
  "doctor.checks.coupons.line": "{company}: {count}, earliest {date} ({when}){soon}",
  "doctor.checks.coupons.noExpiry": "{company}: {count}, no expiry date",
  "doctor.checks.coupons.soonNote": ", expiring within {days} days unused",
  "doctor.checks.coupons.summaryOk": "{total} coupons in all, none expiring in the next {days} days",
  "doctor.checks.coupons.summarySoon": "Coupons of {count} companies expire within {days} days",
  "doctor.checks.coupons.title": "Reset coupons",
  "doctor.checks.coupons.zero": "{company}: 0",
  "doctor.checks.kanban.counts": "Board check: red {red} \xB7 yellow {yellow} \xB7 info {info}",
  "doctor.checks.kanban.error": "kanban doctor --last --json failed, has no record yet, or did not print JSON: {error}",
  "doctor.checks.kanban.errorSummary": "The board check gave no result",
  "doctor.checks.kanban.evidence": "{bin} doctor --last --json (reads the latest result only; no fresh check, does not overwrite data/doctor-report.json)",
  "doctor.checks.kanban.missing": "{bin} does not exist",
  "doctor.checks.kanban.missingSummary": "The board's doctor command was not found",
  "doctor.checks.kanban.noOutput": "no output",
  "doctor.checks.kanban.stale": "The board check record is {age} old; the board should run it every 30 minutes, so it may not be running",
  "doctor.checks.kanban.staleNoTime": "The board check record has no time",
  "doctor.checks.kanban.summaryOk": "The board check found no problems",
  "doctor.checks.kanban.summaryRed": "The board check has {count} red",
  "doctor.checks.kanban.summaryStale": "The board check record is too old",
  "doctor.checks.kanban.summaryYellow": "The board check has {count} yellow, no red",
  "doctor.checks.kanban.timeout": "kanban doctor --last --json timed out",
  "doctor.checks.kanban.timeoutSummary": "The board check timed out",
  "doctor.checks.kanban.title": "Board",
  "doctor.checks.listSeparator": ", ",
  "doctor.checks.profiles.evidenceProfiles": "daemon.agentProfiles in ~/.paseo/config.json",
  "doctor.checks.profiles.familyMissing": "Executor ({executor}) or reviewer ({reviewer}) has no family",
  "doctor.checks.profiles.familyNoMain": "No main executor or reviewer profile, so the family split can't be checked",
  "doctor.checks.profiles.familyOk": "Main executor ({executor}) and reviewer ({reviewer}) profiles are different families",
  "doctor.checks.profiles.familySame": "Main executor and reviewer profiles are the same family (both {family})",
  "doctor.checks.profiles.label": "{name} ({provider}/{model})",
  "doctor.checks.profiles.modelMissing": "{label}: model is not in the {provider} list",
  "doctor.checks.profiles.modelOk": "{label}: model is in the list",
  "doctor.checks.profiles.noModels": "{label}: can't get the {provider} model list, so it can't be checked",
  "doctor.checks.profiles.noProvider": "{label}: Paseo has no {provider} provider",
  "doctor.checks.profiles.none": "No profiles were read",
  "doctor.checks.profiles.paused": "{label}: not dispatched ({pool} pool is paused, not an error)",
  "doctor.checks.profiles.providerOff": "{label}: provider {provider} is turned off, so this profile can't be dispatched",
  "doctor.checks.profiles.providersUnreadable": "Can't read paseo provider ls; models not checked",
  "doctor.checks.profiles.summaryAllOk": "all models are in the lists",
  "doctor.checks.profiles.summaryBad": "{count} with problems",
  "doctor.checks.profiles.summaryChecked": "Checked {count} profiles (incl. candidates): {result}{idle}",
  "doctor.checks.profiles.summaryIdle": ", {count} not dispatched",
  "doctor.checks.profiles.summaryNone": "Can't read profiles (~/.paseo/config.json)",
  "doctor.checks.profiles.summaryUnchecked": "Can't read the provider list (paseo provider ls); models of {count} profiles not checked",
  "doctor.checks.profiles.title": "Profiles and models",
  "doctor.checks.quota.age": "generatedAt {at} ({age} ago; yellow after {yellowMin} min, red after {redHours} h)",
  "doctor.checks.quota.fresh": "Quota readings are {age} old, fresh enough",
  "doctor.checks.quota.missing": "pool-status.json is missing or unreadable",
  "doctor.checks.quota.missingSummary": "Can't read the quota snapshot pool-status.json",
  "doctor.checks.quota.noTime": "pool-status.json has no generatedAt",
  "doctor.checks.quota.noTimeSummary": "The quota snapshot has no time, so its freshness is unknown",
  "doctor.checks.quota.pool": "{name}: {used} used \xB7 {verdict}",
  "doctor.checks.quota.stale": "Quota readings not updated for {age}",
  "doctor.checks.quota.title": "Quota readings",
  "doctor.checks.quota.verdictBlocked": "not dispatchable",
  "doctor.checks.quota.verdictOk": "dispatchable",
  "doctor.checks.quota.verdictPaused": "not dispatched (paused)",
  "doctor.checks.residue.none": "{workspaces} workspaces, {projects} projects, none under /tmp",
  "doctor.checks.residue.project": "Project {name} is in {path}",
  "doctor.checks.residue.summaryFound": "{count} workspace/project directories are under /tmp, probably left by tests",
  "doctor.checks.residue.summaryNone": "No workspaces or projects left in /tmp",
  "doctor.checks.residue.title": "Test leftovers",
  "doctor.checks.residue.workspace": "Workspace {name} (project {project}) is in {cwd}",
  "doctor.checks.schedules.failed": "{label}: last run ({at}) {status}{error}",
  "doctor.checks.schedules.failedError": ": {error}",
  "doctor.checks.schedules.inactive": "{label}: {status} (listed only)",
  "doctor.checks.schedules.label": "{name} ({id})",
  "doctor.checks.schedules.logsError": "{label}: can't read run history ({error})",
  "doctor.checks.schedules.neverRan": "{label}: has not run yet",
  "doctor.checks.schedules.ok": "{label}: last run {status} ({at})",
  "doctor.checks.schedules.paused": "paused",
  "doctor.checks.schedules.summaryFailed": "{count} schedules failed on their last run",
  "doctor.checks.schedules.summaryInactive": " ({count} paused or expired)",
  "doctor.checks.schedules.summaryNone": "No schedules",
  "doctor.checks.schedules.summaryOk": "{count} schedules, none failed on the last run{inactive}",
  "doctor.checks.schedules.title": "Schedules",
  "doctor.checks.schedules.unknown": "{label}: last run status {status} is not recognized",
  "doctor.checks.services.available": "{label}: available",
  "doctor.checks.services.down": "{label}: on but {status}, can't connect",
  "doctor.checks.services.evidenceLog": "~/.paseo/daemon.log (and recently rotated *-daemon.log)",
  "doctor.checks.services.label": "{label} ({provider})",
  "doctor.checks.services.logProblem": "Can't read daemon.log, so repeated timeouts are unknown: {problem}",
  "doctor.checks.services.none": "paseo provider ls returned no services",
  "doctor.checks.services.off": "{label}: turned off (listed only, not an error)",
  "doctor.checks.services.summaryBad": "{count} services have problems",
  "doctor.checks.services.summaryNoLog": "{count} services look fine, but daemon.log is unreadable, so timeouts were not checked",
  "doctor.checks.services.summaryNone": "Can't read the provider list (paseo provider ls)",
  "doctor.checks.services.summaryOk": "{count} services: {on} on and all fine, {off} turned off",
  "doctor.checks.services.timeout": "{name}: {count} background refresh timeouts in the last {window} min{extra}",
  "doctor.checks.services.timeoutRed": " (\u2265{limit}, login prompts will keep popping up)",
  "doctor.checks.services.title": "Services",
  "doctor.checks.services.unknownService": "unknown service",
  "doctor.cli.crashed": "afc-doctor itself failed:",
  "doctor.daily.line": "- {title}: {text}",
  "doctor.daily.more": "- {count} more red; see Health check on the panel's Access tab",
  "doctor.daily.notice": "[AFC daily health check {day}] {count} red, <leader> please take a look (all of it: Health check on the panel's Access tab; command line: bin/afc-doctor):\n{lines}",
  "doctor.panel.button": "Health check",
  "doctor.panel.cardLabel": "Health check {title} {status}",
  "doctor.panel.detailCount": "{count} items",
  "doctor.panel.details": "Details",
  "doctor.panel.evidence": "Evidence: {line}",
  "doctor.panel.failed": "Health check failed: {error}",
  "doctor.panel.intro": "Everything at once: quotas, profiles, services, Claude Code, leftovers, schedules, compatibility, coupons, board (read-only)",
  "doctor.panel.noDetails": "No details",
  "doctor.panel.ranAt": "Checked {ago}: red {red} \xB7 yellow {yellow} \xB7 green {green}",
  "doctor.panel.running": "Checking\u2026",
  "doctor.server.countFailed": "Can't count the timeouts in {dir}/{name}: {error}",
  "doctor.server.crashFinding": "Unknown: {message}",
  "doctor.server.crashSummary": "Unknown: this check itself failed ({message})",
  "doctor.server.daemonLogMissing": "{dir}/daemon.log does not exist",
  "doctor.server.daemonLogUnreadable": "Can't read {dir}/daemon.log",
  "doctor.server.listDirFailed": "Can't read directory {dir}: {error}",
  "doctor.server.notJson": "output is not JSON",
  "doctor.server.residueUnreadable": "paseo workspace ls / project ls returned no JSON",
  "doctor.server.residueUnreadableSummary": "Can't read the workspace or project list",
  "doctor.server.schedulesUnreadable": "paseo schedule ls returned no JSON",
  "doctor.server.schedulesUnreadableSummary": "Can't read the schedule list",
  "doctor.status.green": "Green",
  "doctor.status.red": "Red",
  "doctor.status.yellow": "Yellow",
  "doctor.table.compact": "({total} in all; {hidden} normal ones not listed, add --json to see everything)",
  "doctor.table.counts": "Red {red} \xB7 Yellow {yellow} \xB7 Green {green}",
  "doctor.table.evidence": "Evidence: {evidence}",
  "doctor.table.header": "AFC health check {at} (took {seconds} s)",
  "earlyReset.couponNone": "This plan has no coupon that moves the reset time, so it was not a coupon.",
  "earlyReset.couponShifting": "The coupon count did not drop (still {count}) and there is no afc-use-coupon record, so it was not a coupon.",
  "earlyReset.line": "{date} official early reset (not a coupon)",
  "earlyReset.notice": "{name} was reset early by the vendor around {at}: usage {before}% \u2192 {after}%, reset time {beforeReset} \u2192 {afterReset}. {coupon}The dispatch order has been re-sorted for the new quota. Please tell the user.",
  "grok.diff.line": "{at} CLI {cli} vs Paseo {paseo}: {diff} points apart",
  "grok.diff.lineStuck": "{at} CLI {cli} vs Paseo {paseo}: {diff} points apart (Paseo looks stuck)",
  "grok.source.cli": "CLI {pct}",
  "grok.source.cliAt": "CLI {pct} ({when})",
  "grok.source.paseoStuckUnused": "Paseo {pct}, looks stuck, not used",
  "grok.source.withPaseoStuck": "{head} \xB7 Paseo {pct}, looks stuck",
  "grok.usage.copiedAt": "{alarm} (hand copy from {at})",
  "grok.usage.loginLost": "After reading SuperGrok usage, grok models no longer shows logged in. The screen was closed; no other key was pressed and no login was attempted.",
  "grok.usage.modelsOut": "grok models does not show logged in; usage screen not opened",
  "grok.usage.modelsUnknown": "grok models did not confirm login; usage screen not opened",
  "grok.usage.noPct": "No weekly used percent after typing /usage show",
  "grok.usage.noPrompt": "The input box never appeared; /usage show not typed",
  "grok.usage.stuckAlarm": "SuperGrok's Paseo reading looks stuck (unchanged for {hours} h while cards ran) and there is no CLI reading. Run /usage show in grok and copy it by hand",
  "grok.usage.unreadAlarm": "SuperGrok usage unread for {hours} h. Run /usage show in grok and copy it by hand",
  "home.alerts.none": "No alerts that need a look right now",
  "home.alerts.other": "Other alerts",
  "home.banner.collapseLabel": "Collapse burn banner: {banner}",
  "home.banner.expandLabel": "Expand burn banner: {banner}",
  "home.card.a11y": "{title}, open {tab}",
  "home.card.decisions": "Waiting on you",
  "home.card.leaders": "Project <leader>s",
  "home.card.quota": "Quota by provider",
  "home.card.waiting": "Blocked / awaiting acceptance",
  "home.collapse": "Collapse",
  "home.compat.check": "Check the three plugins now",
  "home.compat.starting": "Starting\u2026",
  "home.dot.a11y": "{code}, {context}, {status}, {lamp}",
  "home.dot.normal": "Normal",
  "home.dot.paused": "{code} paused",
  "home.dot.pausedA11y": "{code}, paused",
  "home.expand": "Expand",
  "home.leader.summary": "{waiting} <leader>s waiting on you \xB7 {acceptance} cards awaiting acceptance \xB7 {blocked} cards blocked",
  "home.leader.unresponsive": " \xB7 {count} unresponsive",
  "home.noLeaders": "No registrations readable yet",
  "home.noQuota": "Quota not readable yet",
  "home.paused.label": "{project} \xB7 paused",
  "home.paused.since": "since {date}",
  "home.paused.sinceSuffix": " ({since})",
  "home.status.allClear": "All clear, nothing needs you",
  "home.status.blocking": "{count} blocked items need your decision",
  "home.status.clauseSep": "; ",
  "home.status.commaSep": ", ",
  "home.status.problems": "{count} problems ({where})",
  "home.status.relaxed": "{count} more can wait",
  "home.status.seeBelow": 'see "Your to-dos" below',
  "home.status.seeLeader": 'see "Your to-dos" on Leader',
  "home.status.thenProblem": "{line}. {problem}",
  "home.status.unread": "{count} <leader>s have replies you have not read",
  "home.summary.cards": "{count} cards",
  "home.summary.decisions": "{count} items",
  "home.summary.kanbanUnreadable": "Kanban not readable right now",
  "home.summary.newReplies": " \xB7 {count} new replies",
  "home.tokens.byWho": "Last 7 days, by who used them",
  "home.tokens.last7Days": "Last 7 days",
  "home.tokens.noShares": "Cannot split by role yet",
  "home.tokens.none": "No token counts in the last 7 days yet",
  "home.tokens.poolLast7Days": "{pool} \xB7 last 7 days",
  "home.tokens.title": "Token usage",
  "home.unregistered": "Items with no registered <leader>",
  "i18n.languageName": "English",
  "insights.sandboxAgentsReadFailed": "Could not read the Agent sandbox list: {error}",
  "insights.modelsReadFailed": "Could not read the model list: {error}",
  "insights.prReadFailed": "Could not read GitHub PRs: {error}",
  "insights.verdict.approve": "approve|ready to merge|LGTM",
  "insights.verdict.changes": "changes required|request changes|must fix|blocking issue",
  "insights.verdict.issueList": "issue list",
  "insights.verdict.none": "none",
  "kanban.blockedKind.dependency": "dependency",
  "kanban.blockedKind.quota": "quota",
  "kanban.blockedKind.transient": "transient",
  "kanban.column.acceptance": "Acceptance",
  "kanban.column.blocked": "Blocked",
  "kanban.column.inReview": "To review",
  "kanban.column.ready": "Ready",
  "kanban.column.reviewing": "Reviewing",
  "kanban.column.rework": "Rework",
  "kanban.column.running": "Running",
  "kanban.column.triage": "Triage",
  "kanban.dbReadFailed": "Could not read kanban.db; nothing archived this round: {error}",
  "kanban.dbUnopenable": "Cannot open kanban.db; nothing archived this round",
  "kanban.missingCardColumns": "Card columns missing",
  "kanban.readFailed": "Could not read Paseo Kanban: {error}",
  "kanban.unreadableWithError": "Kanban not readable right now: {error}",
  "kanban.view.noneWaiting": "No cards waiting or stuck",
  "kanban.view.queueUnavailable": "Waiting cards not readable yet",
  "kanban.view.unavailable": "Kanban not readable yet (plugin not installed, or no cards yet).",
  "keychain.alert.authKind": "Not logged in",
  "keychain.alert.authText": "{count} Claude session(s) in the last 24 hours did not start: not logged in",
  "keychain.alert.cursorUnlinked": "Cursor not connected",
  "keychain.alert.emptyRun": "{name} ran empty (not logged in); not re-run automatically",
  "keychain.alert.kind": "Keychain",
  "keychain.alert.rerun": "Re-ran {name} automatically",
  "keychain.alert.scheduleKind": "Schedules",
  "keychain.alert.stillOut": "{name} is still not logged in after a re-run; needs a person",
  "keychain.alert.text": `The keychain can't be read right now: new Claude/Cursor sessions started meanwhile will say "not logged in". A restart usually fixes it`,
  "keychain.cursorCaveat": "Only means the keychain has this item, not that Cursor works; status is what counts",
  "keychain.log.recovered": "{at} recovered",
  "keychain.log.rerun": "{at} rerun schedule={id} name={name}",
  "keychain.log.rerunFailed": "{at} rerun failed schedule={id} exit={code}",
  "keychain.match.opsPrefix": "[Ops\xB7",
  "leader.attention.askedAgo": "Asked {elapsed} ago; no newer registered decision found",
  "leader.attention.closeReply": "Close reply box",
  "leader.attention.decide": "Decide",
  "leader.attention.empty": "Nothing needs you right now",
  "leader.attention.heading": "Needs you",
  "leader.attention.headingCount": "Needs you \xB7 {count}",
  "leader.attention.question": "{code} asked you without registering it",
  "leader.attention.reply": "Reply",
  "leader.attention.seeResult": "See result",
  "leader.attention.staleAcceptance": "{code} \xB7 {count} card(s) waiting for acceptance over 2 hours",
  "leader.attention.unresponsive": "{code} <leader> not responding \xB7 {count} card(s) waiting for acceptance \xB7 woken {wakes} more time(s)",
  "leader.elapsed.daysHours": "{days} d {hours} h",
  "leader.elapsed.hoursMinutes": "{hours} h {minutes} min",
  "leader.elapsed.minutes": "{minutes} min",
  "leader.elapsed.underMinute": "under 1 min",
  "leader.elapsed.unreadable": "time not readable yet",
  "leader.group.acceptance": "Awaiting acceptance (its turn)",
  "leader.group.blocked": "Blocked",
  "leader.group.parents": "Waiting on parent cards",
  "leader.group.rework": "In rework",
  "leader.help.hideA11y": "Hide help",
  "leader.help.lamp": "The lamp follows context size: up to 250K is green, over 250K yellow, over 500K red. Nothing switches without a click.",
  "leader.help.order": "One card per <leader>: blocked work and non-responding ones come first, those with nothing to handle come last; paused projects fold into one line at the bottom.",
  "leader.help.reply": 'Click a letter when there is one; a line you write goes to this <leader>. Press "Expand" for decision details, cards, 7-day counts, the shift and the handover.',
  "leader.help.show": "Help",
  "leader.help.showA11y": "Show help",
  "leader.help.top": '"Needs you" at the top lists only what needs your action: decisions blocking work, questions asked without registering, a <leader> not responding, and acceptance waiting over 2 hours.',
  "leader.input.noticeOpen": "[",
  "leader.input.userMarker": "[User message",
  "leader.kindLabel.question": "Not registered",
  "leader.kindLabel.staleAcceptance": "Acceptance over 2 h",
  "leader.kindLabel.unresponsive": "Not responding",
  "leader.lamp.normal": "OK",
  "leader.lastReply.ago": "last reply {elapsed} ago",
  "leader.lastReply.unreadable": "last reply not readable right now",
  "leader.prompt.acceptanceReminder": "Please review the cards waiting for acceptance: {codes}. Accept deliveries supported by evidence and return those requiring changes.",
  "leader.prompt.delegationReminder": "Follow the repository instructions and the Kanban leader protocol. Coordinate work through cards, review delivery evidence, register decisions requiring human input, and communicate progress. Handle pending acceptance, blocked work and completed dependencies. Use the operations role for authorized merges.",
  "leader.prompt.statusRequest": "Please report the current state in plain words: which cards you hold, where each one is, and what you are waiting for me to decide. Register anything I must decide with roles decide add as A/B/C plus a recommendation; do not leave it only in the chat.",
  "leader.question.optionMarks": ".:)",
  "leader.question.recommend": "Recommend",
  "leader.repeatWakes": "Woken {count} more time(s)",
  "leader.reply.badProject": "Wrong project; not sent",
  "leader.reply.empty": "Write something first",
  "leader.reply.tooLong": "{limit} characters at most; shorten it and send again",
  "leader.reply.userPrefix": "[User message (from the AFC panel)]",
  "leader.selfWork.longBusy": "Busy for over 15 minutes straight; check whether this should be a card",
  "leader.selfWork.overWeek": "Did more work itself than it dispatched in the last 7 days and is busy again; check whether this should be a card",
  "leader.selfWork.recentWork": "Recently edited files, ran checks or merged",
  "leader.server.activityTimeout": "Reading the recent session timed out",
  "leader.server.activityWarning": "Recent replies and actions cannot be read right now: {error}",
  "leader.server.notRegistered": "No <leader> is registered for this project yet; not sent",
  "leader.server.sendFailed": "Send failed: {error}",
  "leader.server.sent": "Sent",
  "leader.status.busy": "Busy",
  "leader.status.idle": "Idle",
  "leader.status.notListed": "Not listed",
  "leader.tag.acceptance": "To accept {count}",
  "leader.tag.blocked": "Blocked {count}",
  "leader.tag.selfWork": "Doing work itself \u26A0",
  "leader.tag.shift": "Shift: {label}",
  "leader.tag.shiftCancelled": "Shift cancelled",
  "leader.tag.shiftFailed": "Shift failed",
  "leader.tag.unread": "Unread reply",
  "leader.tag.unresponsive": "Not responding {count}",
  "leader.tag.waiting": "Waiting on you {count}",
  "leader.title.oldPrefix": "[Supervisor]",
  "leader.ui.actionsUnreadable": "Recent actions cannot be read right now",
  "leader.ui.ago": "{elapsed} ago",
  "leader.ui.askedUnregistered": "Asked you without registering",
  "leader.ui.blockingWork": "Blocking work",
  "leader.ui.cardCount": "{count} card(s)",
  "leader.ui.cardsHere": "Cards held by it",
  "leader.ui.cardsUnreadable": "Card status cannot be read right now",
  "leader.ui.collapse": "Collapse",
  "leader.ui.collapseFull": "Collapse full text",
  "leader.ui.collapseGroup": "Collapse {label}",
  "leader.ui.count": "{count} / {limit} characters",
  "leader.ui.countTooLong": "{count} / {limit} characters; shorten it and send again",
  "leader.ui.detailsA11y": "{action} details of {code}",
  "leader.ui.expand": "Expand",
  "leader.ui.expandFull": "Show full text",
  "leader.ui.expandGroup": "Show all {count} cards in {label}",
  "leader.ui.forceOpen": "open question (--force-open)",
  "leader.ui.inStateFor": "In this state for {elapsed}",
  "leader.ui.itemCount": "{count} item(s)",
  "leader.ui.mayBeWaiting": "This may be waiting for your reply; no newer registered decision was found.",
  "leader.ui.moreCards": "{count} more \xB7 Expand",
  "leader.ui.noBlockReason": "No reason for the block written yet",
  "leader.ui.noOpenDecisions": "No open decisions",
  "leader.ui.noRegistry": "Project registrations cannot be read yet",
  "leader.ui.none": "None",
  "leader.ui.openSession": "Open session",
  "leader.ui.owner": "Owner: {owner}",
  "leader.ui.pausedCanSend": "Project paused (you can still send)",
  "leader.ui.remindAcceptance": "Remind to accept",
  "leader.ui.remindAcceptanceA11y": "Remind it to accept",
  "leader.ui.remindDelegation": "Remind it to only dispatch",
  "leader.ui.replyToIt": "Reply to it",
  "leader.ui.replyToThis": "Reply to this",
  "leader.ui.sectionA11y": "{action} {title}",
  "leader.ui.sectionA11ySummary": "{action} {title}, {summary}",
  "leader.ui.selfWorking": "Doing work itself",
  "leader.ui.send": "Send",
  "leader.ui.sendToA11y": "Send to the {project} <leader>",
  "leader.ui.sending": "Sending\u2026",
  "leader.ui.sentAt": "Sent \xB7 {time}",
  "leader.ui.statusRequest": "Status report",
  "leader.ui.statusRequestA11y": "Ask it to report its status",
  "leader.ui.unreadable": "not readable right now",
  "leader.ui.unresponsive": "<leader> not responding",
  "leader.ui.waitingOnYou": "Waiting on you",
  "leader.ui.writeToIt": "Write a line to it",
  "leader.ui.writeToLeader": "Write a line to this <leader>",
  "leader.unresponsiveLine": "\u25CF <leader> not responding \xB7 {count} card(s)",
  "leader.week.commit": "code commits itself",
  "leader.week.counting": "Last 7 days: counting\u2026",
  "leader.week.dispatched": "Last 7 days: cards dispatched {count}",
  "leader.week.docCommits": "doc commits {count}",
  "leader.week.merge": "PRs merged itself",
  "leader.week.nudge": "[AFC reminder] You asked the user a question in the chat ({head}); the user cannot see it. Register it with roles decide add as A/B/C plus a recommendation.",
  "leader.week.test": "tests run itself",
  "leader.week.uncountable": "Last 7 days: cannot be counted",
  "leader.week.writingCode": "Writing code itself; should make cards",
  "leader.work.mergeQueueScript": "merge-queue",
  "pools.alerts.cursorOfficialFormat": "Cursor official API response format changed; using the hand-copied value (copied {when})",
  "pools.alerts.cursorOfficialNetwork": "Cursor official API network failure; using the hand-copied value (copied {when})",
  "pools.alerts.cursorReadFailed": "Could not read Cursor usage; using the hand-copied value (copied {when})",
  "pools.alerts.cursorSpent": "Cursor model quota is {pct}% used; the plan quota is used up. Stopped dispatching to Cursor",
  "pools.alerts.grokLoginLost": "After reading SuperGrok usage, grok models no longer shows a login. The screen was closed; no other key was pressed and no login was attempted.",
  "pools.alerts.kind.cursorLoginLost": "Cursor logged out after reading",
  "pools.alerts.kind.cursorReadFailed": "Cursor usage read failed",
  "pools.alerts.kind.disconnected": "Cursor connection lost",
  "pools.alerts.kind.filePermission": "Cursor login file permissions wrong",
  "pools.alerts.kind.formatChanged": "Cursor official API format changed",
  "pools.alerts.kind.grokLoginLost": "SuperGrok logged out after reading",
  "pools.alerts.kind.grokUnread": "SuperGrok usage unreadable",
  "pools.alerts.kind.loggedOut": "Cursor logged out",
  "pools.alerts.kind.loginUnreadable": "Cursor login unreadable for now",
  "pools.alerts.kind.networkFailure": "Cursor official API network failure",
  "pools.alerts.kind.notWritten": "Cursor login not written",
  "pools.alerts.kind.notWrittenBack": "Cursor login not written back",
  "pools.alerts.kind.overPlan": "Over plan quota",
  "pools.alerts.kind.snapshotStale": "Quota snapshot stale",
  "pools.alerts.noCopyTime": "no copy time",
  "pools.alerts.snapshotMissing": "Quota snapshot pool-status.json is missing or has no readable time; Kanban will treat every pool as dispatchable",
  "pools.alerts.snapshotStale": "Quota snapshot pool-status.json has not updated for {minutes} min (should be every 5 min); Kanban is dispatching on old data. See [afc] pool refresh in the Paseo log",
  "pools.hard.doubleWeekReserve": "This week: {used}% used, double-week stop line {stop}%; the rest is kept for the <leader>",
  "pools.hard.leaderReserve": "This week: {used}% used; the rest is kept for the <leader>",
  "pools.hard.planStop": "{period}: {used}% used, stops at {stop}%; the rest is kept for you",
  "pools.hard.planStopCoupon": "{period}: {used}% used, a reset coupon is in hand, stops at {stop}%",
  "pools.hard.sessionPause": "5-hour window {used}% used; wait for the window to refresh before starting new work",
  "pools.hard.subWeekSpent": "{name} weekly quota is used up",
  "pools.hard.thisMonth": "This month",
  "pools.hard.thisWeek": "This week",
  "pools.hard.weekSpent": "This week's quota is used up",
  "pools.pace.ahead": "Ahead of pace: {used}% used, pace line at {pace}%, {tail}",
  "pools.pace.aheadNoPause": "Ahead of pace: {used}% used, pace line at {pace}% (not paused for being ahead, as you asked)",
  "pools.pace.aheadSoftened": "Ahead of pace: {used}% used, pace line at {line}%; no other pool of the same role can take work, so keep using it",
  "pools.pace.behind": "Behind pace, use first",
  "pools.pace.canDispatch": "Can take work",
  "pools.pace.catchUpAt": "expected {when} once the pace line catches up",
  "pools.pace.expectedToken": "expected",
  "pools.pace.noCatchUp": "the pace line will not catch up this period",
  "pools.pace.reset": "reset",
  "pools.pace.tokyoTime": "{date} (Tokyo time)",
  "pools.reviewer.band": "This week: {used}% used. Temporary exception: only {who} work, stops at {stop}% ({decision})",
  "pools.reviewer.decision": "{who}; back to normal after the {when} reset",
  "pools.reviewer.resetDay": "reset day",
  "pools.reviewer.reviewRole": "review",
  "pools.reviewer.roleSeparator": ", ",
  "pools.reviewer.stop": "This week: {used}% used; at the {stop}% temporary stop line",
  "pools.reviewer.temporary": "temporary exception",
  "pools.reviewer.userDecided": "user decision of {date}",
  "pools.reviewer.userToken": "user",
  "pools.status.campaignAhead.back": " (coupon burn week, second half: dispatch here first)",
  "pools.status.campaignAhead.double": " (double week from a reset coupon: not paused for being ahead, dispatch here first)",
  "pools.status.campaignAhead.front": " (coupon burn week, first half: not paused for being ahead, dispatch here first)",
  "pools.status.campaignBehind.back": "Coupon burn week, second half: dispatch here first",
  "pools.status.campaignBehind.double": "Double week from a reset coupon: dispatch here first",
  "pools.status.campaignBehind.front": "Coupon burn week, first half: dispatch here first",
  "pools.status.couponPreferNote": " (reset coupon in hand, use first)",
  "pools.status.planNotUsed": "This plan is not used for dispatch",
  "pools.status.subFollowsMain": "{sub} uses {main}: {reason}",
  "pools.status.withNote": "{reason} ({note})",
  "pools.unread.agoMinutes": "{minutes} min ago",
  "pools.unread.agoUnderMinute": "under 1 min ago",
  "pools.unread.carryMark": "usage not read, reusing",
  "pools.unread.carryNote": "{mark} the {pct}% read {ago}{readAt}",
  "pools.unread.claudeReset": "Claude's weekly window has reset and the last reading is void; usage was not read this time, so it is treated as unknown and allowed",
  "pools.unread.claudeStop": "Cannot read Claude usage; dispatch paused (the <leader> reserve must hold)",
  "pools.unread.codexStop": "Cannot read ChatGPT usage; dispatch paused",
  "pools.unread.paren": " ({text})",
  "pools.unread.readAt": " (read at {at})",
  "pools.unread.unknownAllowedToken": "treated as unknown and allowed",
  "pools.windows.beforeReset": "before reset",
  "pools.windows.beforeWhen": " before {when}",
  "pools.windows.cursorDownUseGrok": "Cursor is off, so the remaining SuperGrok quota has to be used",
  "pools.windows.cursorLogoutHold": "Dispatch is disabled for this pool",
  "pools.windows.shortGrok": "At this rate it runs out{until}; execution goes to Cursor instead. When Cursor is busy, cards queue rather than fall back to SuperGrok",
  "prices.fastCatalogId": "{id} \xD7{k} (fast)",
  "queue.alert.acceptance": "{card} has waited {waited} for acceptance; the project <leader> has not come to accept it",
  "queue.alert.blockedByParent": "{card} is waiting on parents, held up by {names}",
  "queue.alert.idle": "{card}{stayed} still shows running, but the responsible agent has been silent for {idle}; it may be stuck",
  "queue.alert.kind.blockedByParent": "Held up by parent",
  "queue.alert.kind.stuck": "Possibly stuck",
  "queue.alert.nameSeparator": ", ",
  "queue.alert.stayed": " has sat here for {waited},",
  "queue.alert.timed": "{card}{verb}, for {waited} now. Reason: {why}",
  "queue.cardLabel": '{code} {project} "{title}"',
  "queue.category.acceptance": "Waiting for acceptance",
  "queue.category.agentIdle": "Running but agent idle",
  "queue.category.autoStartOff": "Auto-start off",
  "queue.category.other": "Other",
  "queue.category.unattended": "Nobody picked it up",
  "queue.category.waitDir": "Waiting for the folder",
  "queue.category.waitParent": "Waiting on parent",
  "queue.category.waitSlot": "Waiting for a slot",
  "queue.hold.autoStartOff": "auto-start is off",
  "queue.hold.concurrencyFull": "concurrency full",
  "queue.hold.cooldown": "cooldown",
  "queue.hold.noLeader": "no <leader> registered",
  "queue.hold.noSupervisorOld": "no supervisor registered",
  "queue.hold.parent": "parent",
  "queue.hold.poolUnavailable": "pool cannot take work",
  "queue.hold.sameDir": "same working directory",
  "queue.shown.acceptance": "Waiting for acceptance",
  "queue.shown.agentIdle": "The responsible agent is idle",
  "queue.shown.cooldown": "Cooling down ({until})",
  "queue.shown.unattended": "Nobody picked it up",
  "queue.shown.waitParent": "Waiting for parents to finish",
  "queue.shown.waitSlot": "Waiting for a slot",
  "queue.verb.stalled": " has stopped moving",
  "queue.verb.unattended": ": nobody picked it up",
  "queue.verb.waitDir": " is waiting for the folder",
  "queue.verb.waitSlot": " is waiting for a slot",
  "queue.waited.days": "{days} d",
  "queue.waited.daysHours": "{days} d {hours} h",
  "queue.waited.hours": "{hours} h",
  "queue.waited.hoursMinutes": "{hours} h {mins} min",
  "queue.waited.minutes": "{mins} min",
  "queue.waited.underMinute": "under 1 min",
  "queue.waited.unknown": "unknown",
  "quota.adapters.cardAlias": "{name} ({alias})",
  "quota.adapters.cursorModelUsed": "Cursor model quota used",
  "quota.adapters.cursorSpent": "Cursor model quota {used}% used, at the {stop}% stop line",
  "quota.adapters.grokWeekUsed": "SuperGrok weekly quota used",
  "quota.adapters.handCopyStop": "{label} {used}% (copied by hand from {source}), at the {stop}% stop line",
  "quota.adapters.mainQuota": "{name} main quota",
  "quota.adapters.manualEmpty": "No percent copied yet; treated as available",
  "quota.adapters.manualSpent": "{name}: {used}% used, at the {stop}% stop line",
  "quota.adapters.manualStop": "{name}: {used}% used (copied by hand), at the {stop}% stop line",
  "quota.adapters.noHandCopyYet": "No used percent copied yet; treated as available",
  "quota.adapters.via": "Uses {name} quota",
  "quota.adapters.weekSpent": "This week's quota is used up",
  "quota.companies.cursorApi": "Other models (API)",
  "quota.companies.cursorAuto": "Cursor's own models (Auto)",
  "quota.companies.cursorDefaultWho": "Executor (Grok 4.7)",
  "quota.companies.cursorLoginAlarm": "The Cursor CLI lost its login, so Cursor quota can't be read (using the numbers copied at {when}). Run cursor-agent login in a terminal",
  "quota.companies.cursorReconnect": "Cursor connection dropped; please reconnect",
  "quota.companies.cursorScreenOff": "Reading the CLI screen is off (it drops the login); showing hand-copied numbers",
  "quota.companies.direct": "{model} direct",
  "quota.companies.dispatchable": "Dispatchable",
  "quota.companies.fableDefaultWho": "Decision (Fable), high-risk review",
  "quota.companies.fableSub": "Fable sub-quota",
  "quota.companies.fableWho": "{who} (also counts against the weekly total)",
  "quota.companies.fiveHourLabel": "5-hour",
  "quota.companies.fiveHourWindow": "5-hour window",
  "quota.companies.grokDefaultWho": "Executor (Grok 4.7 direct)",
  "quota.companies.inDaysHours": "in {days} d {hours} h",
  "quota.companies.inHours": "in {hours} h",
  "quota.companies.inUnderHour": "in under 1 h",
  "quota.companies.linkBroken": "Connection dropped; please reconnect",
  "quota.companies.listSep": ", ",
  "quota.companies.loginScreenMarker": "login screen",
  "quota.companies.noDispatch": "No dispatch",
  "quota.companies.nobody": "No role uses it now",
  "quota.companies.onDemand": "On-demand",
  "quota.companies.ownChats": "your own chats",
  "quota.companies.paused": "Paused",
  "quota.companies.personModel": "{name} ({model})",
  "quota.companies.resetAt": "{rel} ({clock})",
  "quota.companies.resetDue": "Reset time reached ({clock})",
  "quota.companies.sameAsWeek": "Same people as the weekly total",
  "quota.companies.source.at": "{label} \xB7 {when}",
  "quota.companies.source.auto": "Read automatically",
  "quota.companies.source.manual": "Copied by hand",
  "quota.companies.source.official": "Cursor official API",
  "quota.companies.source.screen": "CLI screen",
  "quota.companies.source.screenOff": "CLI screen reading is off",
  "quota.companies.source.stale": "Can't read; showing old numbers",
  "quota.companies.source.staleAt": "Can't read; showing old numbers (copied by hand {when})",
  "quota.companies.source.unread": "AFC can't read it yet",
  "quota.companies.staleHeadline": "Can't read; showing old numbers \xB7 {remaining}",
  "quota.companies.stopped": "Stopped",
  "quota.companies.unreadMarker": "can't read",
  "quota.companies.unverified": "Use not verified",
  "quota.companies.userReserved": "Reserved for the user",
  "quota.companies.weekQuota": "Weekly quota",
  "quota.companies.weekTotal": "Weekly total",
  "quota.home.barHint": "Bars show what is left",
  "quota.home.dispatch": "Dispatch",
  "quota.home.markerHint": "The thin line is where pace says you should be; the red line is where dispatch stops. Drawn only on windows used for dispatch.",
  "quota.home.noCompanies": "No quotas grouped by company yet",
  "quota.home.oldNumbers": "Old numbers",
  "quota.home.tapForDetail": "Tap a company for details",
  "quota.home.tileA11yCollapse": "{name}, {figure}, {summary}, tap to hide details",
  "quota.home.tileA11yExpand": "{name}, {figure}, {summary}, tap to show details",
  "quota.home.title": "Is the quota enough?",
  "quota.home.who": "Used by: {who}",
  "quota.line.ahead": "using faster than plan",
  "quota.line.behindPrefer": "behind plan, send work here first",
  "quota.line.enough": "enough until reset at this rate",
  "quota.line.gapEven": "on pace",
  "quota.line.gapFast": "{points} pts fast",
  "quota.line.gapSlow": "{points} pts slow",
  "quota.line.head": "{name}: {used}",
  "quota.line.hitsStop": "at this rate it reaches the stop line {date} {part}",
  "quota.line.joined": "{head}, {tail}",
  "quota.line.monthUnread": "this month's usage not read yet",
  "quota.line.monthUsed": "{pct}% used this month",
  "quota.line.paceRemaining": "pace says {pct}% left",
  "quota.line.paceRemainingUnknown": "pace says \u2014 left",
  "quota.line.part.afternoon": "afternoon",
  "quota.line.part.evening": "evening",
  "quota.line.part.lateNight": "late night",
  "quota.line.part.morning": "morning",
  "quota.line.part.noon": "midday",
  "quota.line.pausedUntil": "paused until {clock}",
  "quota.line.pausedUntilWindow": "paused until the window refreshes",
  "quota.line.remaining": "{pct}% left",
  "quota.line.remainingUnknown": "\u2014 left",
  "quota.line.stopRemain": "stop at {pct}% left",
  "quota.line.stopped": "stopped",
  "quota.line.untilResetLeft": "At this rate about {pct}% will go unused by reset",
  "quota.line.untilResetUsedUp": "At this rate it runs out by reset",
  "quota.line.weekUnread": "this week's usage not read yet",
  "quota.line.weekUsed": "{pct}% used this week",
  "quota.page.aboutCards": "about {cards} cards",
  "quota.page.avgCost": "avg {tokens} tokens \xB7 {usd}",
  "quota.page.effortCost": "{profile} \xB7 {effort} \xB7 {runs} runs \xB7 {avg}",
  "quota.page.period.30d": "Last 30 days",
  "quota.page.period.7d": "Last 7 days",
  "quota.page.period.today": "Today",
  "quota.page.periodSpend": "{period}, all models at API list price",
  "quota.page.planFee": "Plan fee for this span: about {usd}{extra}",
  "quota.page.planFeeRatio": " \xB7 that is {ratio}x the plan fee",
  "quota.page.pricesFootnote": "Amounts are estimates at public API list prices (models.dev{when}), not actual charges; use them to judge whether a plan is worth it.",
  "quota.page.pricesUpdated": ", updated {when}",
  "quota.page.tierNoProfile": "{tier} \xB7 no profile can take work",
  "quota.page.tokens.cacheRead": "Cache read {n}",
  "quota.page.tokens.cacheWrite": "Cache write {n}",
  "quota.page.tokens.calls": "{n} calls",
  "quota.page.tokens.input": "Input {n}",
  "quota.page.tokens.output": "Output {n}",
  "quota.page.unpriced": " \xB7 no public price",
  "quota.pageReason.cliPercent": "CLI percent",
  "quota.pageReason.doubleWeek": "double week ({stop})",
  "quota.pageReason.stopRestored": "stop line restored ({stop})",
  "quota.pageReason.usedUp": "used up",
  "quota.plans.claude.leftAtReset": "about {remaining} at reset",
  "quota.plans.claude.paceSentence": "At this rate, {projected}. To land at {target}, use at most {daily} more per day.",
  "quota.plans.claude.period": "This period",
  "quota.plans.claude.periodResets": "This period (resets {when})",
  "quota.plans.claude.runsOut": "it runs out by reset",
  "quota.plans.cursor.connect": "Connect Cursor",
  "quota.plans.cursor.copiedAt": " (copied {when})",
  "quota.plans.cursor.manualFail": "Couldn't read Cursor usage; using the hand-copied value{when}{why}",
  "quota.plans.cursor.opening": "Opening\u2026",
  "quota.plans.cursor.reopenAuth": "Open the sign-in page again",
  "quota.plans.cursor.why": ": {error}",
  "quota.plans.cursor.withWhen": "{text} ({when})",
  "quota.plans.elapsed": " \xB7 {pct}% of the time gone",
  "quota.plans.manual.copiedAt": "This percent was copied by hand at {when}.",
  "quota.plans.manual.cursor": "Copy by hand when neither the official API nor the CLI can read it.",
  "quota.plans.manual.cursorScreenOff": "CLI screen reading is off; showing hand-copied numbers.",
  "quota.plans.manual.grok": "When neither Paseo nor the grok CLI can read it, copy the weekly percent from /usage show here; {stop}.",
  "quota.plans.manual.noApi": "The provider has no API for this.",
  "quota.plans.manual.preview": "= {remaining}",
  "quota.plans.notDispatched": "Dispatch does not use this plan",
  "quota.plans.notEnoughData": "Not enough data",
  "quota.plans.pace.daily": "{daily} left per day \xB7 about {per} per run \xB7 about {runs} per day",
  "quota.plans.pace.days": "{days} d / {left} d left",
  "quota.plans.pace.notEstimated": "not estimated",
  "quota.plans.pace.runs": "{runs} runs",
  "quota.plans.pool.deprioritize": "Dispatchable, other pools first",
  "quota.plans.pool.paused": "Dispatch paused",
  "quota.plans.pool.prefer": "Use first (would go to waste)",
  "quota.plans.price.enterNumber": "Enter a number",
  "quota.plans.price.fill": "Set monthly fee",
  "quota.plans.price.included": "Included",
  "quota.plans.price.monthly": "${price}/mo",
  "quota.plans.resetsAt": " \xB7 resets {when}",
  "quota.plans.roi.line": "Last 30 days used {usd}{roi}",
  "quota.plans.roi.ratio": ", {ratio}x the monthly fee",
  "quota.plans.usageUnknown": "Usage unknown",
  "quota.plans.value.full": " \xB7 a full period is worth about {usd}",
  "quota.plans.value.line": "API value used this period: {usd}{plan}{full}",
  "quota.plans.value.planShare": " (plan fee for this period {usd})",
  "quota.plans.verdict.earlyBy": ", about {hours} h before reset",
  "quota.plans.verdict.noPercent": "No usage percent available",
  "quota.plans.verdict.onTrack": "On pace: about fully used by reset",
  "quota.plans.verdict.runsOutAt": "At this rate it runs out around {when}{early}",
  "quota.plans.verdict.short": "At this rate it runs out before reset",
  "quota.plans.verdict.tooEarly": "This period just started; too early to tell the pace",
  "quota.plans.window.fableWeekly": "Fable this week",
  "quota.plans.window.monthly": "This month's quota",
  "quota.plans.window.session": "5-hour window",
  "quota.plans.window.weekly": "This week's quota",
  "quota.plansUi.cursorApi": "Other models (API, shown only) {remaining} \xB7 plan total {included}",
  "quota.plansUi.cursorAuto": "Cursor models (Auto, used for dispatch) {remaining}",
  "quota.plansUi.cursorCapText": "The Cursor model quota is used up; dispatch has stopped",
  "quota.plansUi.disconnect": "Disconnect Cursor",
  "quota.plansUi.editPriceA11y": "Edit the monthly fee of {name}",
  "quota.plansUi.manualPrompt": "Enter the used % from the CLI",
  "quota.plansUi.noSnapshot": "No quota snapshot yet",
  "quota.plansUi.onDemand": "On-demand (shown only) {amount}",
  "quota.plansUi.overCap": "Over cap",
  "quota.plansUi.pctInputA11y": "{name} percent",
  "quota.plansUi.priceInputA11y": "{name} monthly fee (USD)",
  "quota.plansUi.pricePlaceholder": "USD/mo",
  "quota.plansUi.save": "Save",
  "quota.plansUi.savePctA11y": "Save percent",
  "quota.plansUi.savePriceA11y": "Save monthly fee",
  "quota.plansUi.source": "Source: {via} \xB7 {when}",
  "quota.plansUi.unmatchedDirs": "Sessions outside Paseo, top-spending folders: {dirs}",
  "quota.reason.doubleWeekStopN": "double-week stop line {n}%",
  "quota.reason.noDispatchMarker": "not used for dispatch",
  "quota.reason.notReliedMarker": "dispatch does not rely on",
  "quota.reason.offLineN": "at the {n}% stop line",
  "quota.reason.paceAtN": "pace line at {n}%",
  "quota.reason.planNotUsedMarker": "does not use this plan",
  "quota.reason.spentN": "{n}% spent",
  "quota.reason.stopAtLookbehind": "until ",
  "quota.reason.stopAtN": "stops at {n}%",
  "quota.reason.stopLineN": "stop line {n}%",
  "quota.reason.stopRestoredN": "stop line back to {n}%",
  "quota.reason.tempStopLineN": "at the {n}% temporary stop line",
  "quota.reason.usedN": "{n}% used",
  "quota.reason.usedPercent": "used percent",
  "quota.reason.usedUp": "used up",
  "quota.reason.waitWindowMarker": "wait for the window to refresh",
  "quota.ui.byModel": "By model",
  "quota.ui.byRole": "By role",
  "quota.ui.byRoleHint": "Grouped by the role Paseo dispatched under",
  "quota.ui.claudeWhoHint": "At public prices. This period counts from the weekly reset",
  "quota.ui.claudeWhoTitle": "Who spends the Claude quota",
  "quota.ui.companiesHint": "Each company lists its own quota windows",
  "quota.ui.companiesTitle": "What each company has left",
  "quota.ui.costHint": "Last 7 days. No average under 3 runs",
  "quota.ui.costTitle": "Profile \xD7 effort",
  "quota.ui.countedAt": "Counted {ago}",
  "quota.ui.counting": "Counting usage\u2026",
  "quota.ui.loadFailed": "Couldn't load: {error}",
  "quota.ui.noUsage": "No usage in this period",
  "quota.ui.paceHint": "Aim to reach the pace line by reset. Ahead: pause first; behind: use first",
  "quota.ui.paceTitle": "Dispatch by pace",
  "quota.ui.plansHint": "Quota percents come from each provider; amounts are at API list price",
  "quota.ui.plansTitle": "Are the plans fully used?",
  "quota.ui.recheck": "Recheck",
  "quota.ui.recheckCouponsA11y": "Recheck reset coupons",
  "quota.ui.rechecking": "Checking\u2026",
  "quota.ui.scanning": "Reading local records\u2026",
  "quota.ui.tierHint": "First profile in the executor matrix that can still take work. Daily allowance left divided by the cost of one run",
  "quota.ui.tierTitle": "Cards per day left at each tier",
  "records.baseline": "Recorded since {date}. ",
  "records.cards": "{count} cards",
  "records.change.empty": "No records",
  "records.change.title": "Role changes",
  "records.count": "{count}",
  "records.cursor.empty": "Version has not changed yet",
  "records.cursor.title": "Cursor CLI",
  "records.fresh.empty": "No new model since recording began (models at first open are the baseline)",
  "records.fresh.firstSeen": "{label} \xB7 first seen {ago}",
  "records.fresh.footnote": "{count} available now ({providers}). In use: {models}",
  "records.fresh.loading": "Loading models\u2026",
  "records.fresh.title": "New models",
  "records.handoff.before": " \xB7 before the switch {tokens}",
  "records.handoff.empty": "No handoffs yet",
  "records.handoff.noNewSession": "no new session",
  "records.handoff.title": "<leader> handoffs",
  "records.kanban.title": "Kanban overview",
  "records.listJoin": ", ",
  "records.loadingShort": "Loading",
  "records.merge.allReviewed": "\u2713 Everything merged in the last 7 days was reviewed",
  "records.merge.loading": "Loading merge records\u2026",
  "records.merge.mergedAt": "merged {ago}",
  "records.merge.note": "Merged in the last 7 days with no review record found. Bot PRs are listed too; you decide.",
  "records.merge.open": "Open PR {number}",
  "records.merge.title": "Merged without review",
  "records.none": "none",
  "records.off": "Off",
  "records.on": "On",
  "records.overturn.summary": "{count} in the last 7 days",
  "records.overturn.title": "Decided for you (can be overturned)",
  "records.recentCount": "last {count}",
  "records.rolesLink.label": "Go to the Roles page to switch",
  "records.rolesLink.text": "Change a role's company and model: go to Roles \u2192",
  "records.schedule.empty": "No schedules",
  "records.schedule.idle": " \xB7 nobody under it is working; maybe forgot to delete",
  "records.schedule.last": "Last {when}: {result}{output}",
  "records.schedule.next": " \xB7 next {when}",
  "records.schedule.owner": " \xB7 belongs to {owner}",
  "records.schedule.succeeded": "succeeded",
  "records.schedule.title": "Schedules",
  "records.score.empty": "No records in the last 14 days",
  "records.score.errors": "{count} errors",
  "records.score.interrupted": "{count} likely interrupted",
  "records.score.loading": "Loading scores\u2026",
  "records.score.note": "Last 14 days. Rework counts and review verdicts come from agent records; older records fill in over time.",
  "records.score.reviews": "Review verdicts: approved {approved} \xB7 changes requested {changes}",
  "records.score.runs": "{runs} runs \xB7 avg {minutes} min \xB7 {followUps} rework follow-ups",
  "records.score.title": "Role scorecard",
  "records.sweep.aborted": "Skipped this round",
  "records.sweep.archived": "Archived",
  "records.sweep.empty": "No records yet",
  "records.sweep.failed": "Failed",
  "records.sweep.idleHours": " \xB7 idle {hours} h",
  "records.sweep.offLabel": "Off; only logs what would have been archived",
  "records.sweep.onLabel": "Archive after 24 hours idle",
  "records.sweep.rule": "Executor, reviewer, reader, decision and batch agents are archived only when idle over 24 hours with no unfinished card. <leader>, ops and your own chats are never touched.",
  "records.sweep.summary": "{count} \xB7 {state}",
  "records.sweep.title": "Auto-archive log",
  "records.sweep.turnOff": "Turn off auto-archive",
  "records.sweep.turnOn": "Turn on auto-archive",
  "records.sweep.wouldArchive": "Would have archived",
  "records.unreadable": "Unreadable",
  "records.usedJoin": ", ",
  "records.waiting.title": "Waiting cards",
  "roles.cards.batch": "Batch",
  "roles.cards.currentModel": "current model",
  "roles.cards.decision": "Decision",
  "roles.cards.executor": "Executor",
  "roles.cards.listJoin": ", ",
  "roles.cards.nobody": "Nobody yet",
  "roles.cards.ops": "Ops",
  "roles.cards.pausedUntil": "Paused until {when}",
  "roles.cards.reader": "Reader",
  "roles.cards.ready": "Ready",
  "roles.cards.reviewer": "Reviewer",
  "roles.cards.stopped": "Stopped",
  "roles.cards.who": "{name} ({via})",
  "roles.history.changedSince": "Changed again since; only the latest change can be undone",
  "roles.history.changedSinceNow": "Changed again since (now {spec}); only the latest change can be undone",
  "roles.history.noThinkingBefore": "It had no thinking level before; the page cannot set that back. Use roles set in a terminal",
  "roles.history.profileGone": "This profile no longer exists",
  "roles.history.undone": "Undone",
  "roles.historyUi.cancel": "Cancel",
  "roles.historyUi.cancelLabel": "Cancel undo",
  "roles.historyUi.confirm": "Confirm undo",
  "roles.historyUi.confirmNote": "Checked first, like a model swap; nothing changes if the check fails.",
  "roles.historyUi.confirmQuestion": 'Change "{name}" back to {spec}?',
  "roles.historyUi.count": "{count}",
  "roles.historyUi.failed": "Not undone: {message}",
  "roles.historyUi.none": "History: no model swaps from here yet",
  "roles.historyUi.title": "History",
  "roles.historyUi.undo": "Undo",
  "roles.historyUi.undoLabel": 'Undo this change to "{name}"',
  "roles.historyUi.undoOf": "Undo \xB7 {name}",
  "roles.historyUi.undoing": "Undoing\u2026",
  "roles.historyUi.undone": "Undone",
  "roles.home.empty": "No roles read yet",
  "roles.home.hint": "Last 7 days",
  "roles.home.manage": "Manage roles and models \u2192",
  "roles.home.manageLabel": "Manage roles and models on the Roles tab",
  "roles.home.noCards": "No cards in these 7 days",
  "roles.home.title": "Roles and what they did",
  "roles.home.tokens": "Tokens, last 7 days",
  "roles.home.tokensMissing": "Tokens for the last 7 days not counted yet",
  "roles.home.weekCount": "Tasks in the last 7 days",
  "roles.page.allPaused": "all paused",
  "roles.page.legacyLeader": "Supervisor",
  "roles.page.mainProfile": "Main profile",
  "roles.page.noOrder": "The dispatch matrix has no order for this role yet",
  "roles.page.noProfilesWarning": "{label}: no profiles read",
  "roles.page.onlyOne": "Only this one profile; no order needed",
  "roles.page.orderFamily": "When the executor is {family}, first pick: {list}",
  "roles.page.orderFlat": "Same order for every difficulty: {list}",
  "roles.page.orderTier": "First pick by difficulty: {list}",
  "roles.page.patrol": "Patrol",
  "roles.page.paused": " (paused)",
  "roles.policy.cursorNotUsed": "Dispatch is disabled for this provider",
  "roles.policy.refuseBannedProvider": "Provider {provider} is excluded by bannedProviders in afc.config.json",
  "roles.policy.refuseProvider": "Cannot switch to an empty provider",
  "roles.policy.unknownProvider": "unknown provider",
  "roles.policy.viaCursor": " (via Cursor)",
  "roles.server.cannotUndo": "Cannot undo: {reason}",
  "roles.server.entryMissing": "History entry not found; it may have been cleared",
  "roles.server.historyNotRecorded": " (not recorded in history this time, so the page cannot undo it; roles keeps its own backups as usual)",
  "roles.server.noConfig": "Cannot read ~/.paseo/config.json; profiles are not shown yet",
  "roles.server.noConfigNoSwap": "Cannot read ~/.paseo/config.json; nothing changed",
  "roles.server.noConfigNoUndo": "Cannot read ~/.paseo/config.json; nothing undone",
  "roles.server.noHistory": "No history; nothing to undo",
  "roles.server.noProfile": 'Profile "{profile}" not found, or it is not a role profile that can be switched',
  "roles.server.setFailed": "roles set failed",
  "roles.server.setTimedOut": "roles set timed out; result not confirmed",
  "roles.server.swapDone": 'Switched "{name}"',
  "roles.server.undoDone": 'Undone: "{name}" is back on {spec}',
  "roles.swap.after": "After: {spec}",
  "roles.swap.before": "Before: {spec}",
  "roles.swap.confirm": 'Switch "{name}" from {from} to {to}',
  "roles.swap.executor": "executor",
  "roles.swap.familyConflict": 'After the swap "{name}" will be {company}, the same company as {opposite} "{other}" ({otherCompany}); executor and reviewer must differ',
  "roles.swap.reviewer": "reviewer",
  "roles.swap.spec": "{provider}/{model}",
  "roles.swap.specThinking": "{provider}/{model} \xB7 thinking {thinking}",
  "roles.tab.cancel": "Cancel",
  "roles.tab.close": "Close",
  "roles.tab.collapse": "Close",
  "roles.tab.confirm": "Confirm switch",
  "roles.tab.confirmLabel": "Confirm switch",
  "roles.tab.confirmNote": "First checks the model is available and that executor and reviewer are different companies; nothing changes if the check fails.",
  "roles.tab.hint": 'One card per role: whose quota, which model, whether it can take work, tasks in the last 7 days. "Switch model" switches directly; "History" under a card can undo.',
  "roles.tab.loading": "Loading roles\u2026",
  "roles.tab.mainProfile": "Main profile",
  "roles.tab.modelsLoading": 'Pickable models are still loading; "Switch model" works once they arrive.',
  "roles.tab.next": "Next",
  "roles.tab.nextLabel": "Next: confirm",
  "roles.tab.noModels": "No pickable models read yet",
  "roles.tab.noProfiles": "No profiles read",
  "roles.tab.notSwapped": "Not switched: {message}",
  "roles.tab.paused": "Paused",
  "roles.tab.prefer": "Preferred",
  "roles.tab.profiles": "{count} profiles",
  "roles.tab.quota": "{quota} quota \xB7 ",
  "roles.tab.readFailed": "Read failed: {error}",
  "roles.tab.ready": "Ready",
  "roles.tab.runs": "{week} tasks in the last 7 days \xB7 dispatched {today} times today \xB7 via {pool}",
  "roles.tab.stepCompany": "\u2460 Pick a company",
  "roles.tab.stepModel": "\u2461 Pick a model",
  "roles.tab.stepThinking": "\u2462 Pick a thinking level",
  "roles.tab.swap": "Switch model",
  "roles.tab.swapLabel": 'Switch the model of "{name}"',
  "roles.tab.switching": "Switching\u2026",
  "roles.tab.thinking": " \xB7 thinking {thinking}",
  "roles.tab.title": "Roles, quotas and models",
  "screen.fail.redactedError": "Read failed (details redacted)",
  "screen.fail.redactedLine": "[redacted]",
  "screen.leaderNote": "[AFC] {text}",
  "screen.loginScreen": "Login text on the screen; session ended, no keys sent",
  "screen.match.loginScreenStuck": "stuck on the login screen",
  "screen.run.exitCode": "{label} exited with code {code}",
  "screen.run.timeout": "{label} timed out",
  "screen.window.quotaHidden": "Quota not public",
  "server.open.cwdMissing": "This agent's working directory no longer exists ({cwd}). Not opening it, to keep Paseo from failing.",
  "server.open.noServerId": "Cannot read ~/.paseo/server-id, so this agent's link cannot be opened",
  "server.open.noWorkspace": "Cannot find the project this agent belongs to",
  "server.shift.notStarted": "Shift change did not start: {error}",
  "shift.button.continue": "Continue",
  "shift.confirm.cardsPending": "{count} card(s) still wait for its acceptance ({cards}); better let it accept them first.",
  "shift.confirm.cardsUnreadable": "Cards waiting for acceptance cannot be read right now; check the board before switching.",
  "shift.confirm.question": "Give the {code} <leader> a new session?",
  "shift.context.amount": "{n}K",
  "shift.context.unit": "1000",
  "shift.context.unreadable": "Context size not readable yet",
  "shift.detail.archiveFailed": "Could not archive the old session: {error}. The new session is still there; nothing was deleted.",
  "shift.detail.askingHandover": 'Asking the old session to write the handover; waiting for it to reply "{done}".',
  "shift.detail.cancelled": "Cancelled; not switched.",
  "shift.detail.detachFailed": "Detach failed: {error}. The old session is still there; nothing was deleted.",
  "shift.detail.detaching": "Unlinking the new session from the old one so archiving the old one does not take it along.",
  "shift.detail.done": "Done. The new session is in the original workspace; the panel will open it.",
  "shift.detail.handoverTimeout": 'No "{done}" reply after 15 minutes. Press Continue to open the new session, or stop here.',
  "shift.detail.noHandoverReply": 'Its turn ended, but the reply has no "{done}". Press Continue to open the new session, or stop here.',
  "shift.detail.noModel": "Could not read the original model; no new session was opened.",
  "shift.detail.noNewSession": "No new session to check again.",
  "shift.detail.noTakenReply": 'The new session has not replied "{taken}" yet; the old session was not archived.',
  "shift.detail.noWorkspace": "The original workspace was not found; no new session and no new workspace were created.",
  "shift.detail.notClicked": "Not clicked; no shift change",
  "shift.detail.notFound": "Session not found; nothing was sent and no new session was opened.",
  "shift.detail.notTaken": "{why} Press Continue to check again; no other session will be opened.",
  "shift.detail.oldIdLost": "The old session id is lost; please archive {which} by hand (not the new session {newId}). The shift stopped here and archived nothing.",
  "shift.detail.oldSameTitle": "the old session with the same title",
  "shift.detail.oldTitled": 'the old session titled "{title}"',
  "shift.detail.openFailed": "Could not open the new session: {error}",
  "shift.detail.opening": "Opening a new session in the original workspace.",
  "shift.detail.queueGone": "The session disappeared while queued; nothing was sent and no new session was opened.",
  "shift.detail.recheckFailed": "Could not check the takeover: {error}. The old session is still there.",
  "shift.detail.sameId": "The old and new session ids are the same, so the session to archive cannot be confirmed. The shift stopped here and archived nothing.",
  "shift.detail.sendFailed": "Could not send to the old session: {why}",
  "shift.detail.takenNotRegistered": 'The new session said "{taken}", but the registry does not show the new id yet; the old session was not archived.',
  "shift.detail.waiting": 'Waiting for the new session to reply "{taken}" and for the registry to show the new id.',
  "shift.detail.wrongWorkspace": "The new session landed in another workspace ({workspace}); the old session was not archived and nothing else was created.",
  "shift.elapsed.days": "running {days} d",
  "shift.elapsed.daysHours": "running {days} d {hours} h",
  "shift.elapsed.hours": "running {hours} h",
  "shift.elapsed.minutes": "running {minutes} min",
  "shift.elapsed.underMinute": "running under 1 min",
  "shift.handover.ask": `[Shift change] First finish the cards waiting for your acceptance (accept or rework); for any you cannot handle, write the card number and the reason under "who we are waiting on" in the handover file. Then write the current state into your repo's handover file (if docs/STATUS.md exists, use its "What we are doing now, who we are waiting on" section; otherwise write HANDOVER.md at the repo root), in five columns: Landed (with card or commit number) / Broken / Unverified (claimed done but nobody tested it independently) / To do (the user asked for it but it is not done yet) / Dead ends (tried and dropped, plus why). Every entry must cite a card number, commit or decision id; leave out anything without evidence. Leave history to git instead of piling it up here; one entry per item. Commit when done, reply "{done}", then stop and take no new work.`,
  "shift.handover.sectionMarker": "What we are doing now",
  "shift.headline.failed": "Last <leader> switch for {name} failed: {reason}",
  "shift.headline.running": "Switching the <leader> for {name}: {label}",
  "shift.lamp.suggest": "Shift change suggested",
  "shift.list.separator": ", ",
  "shift.phase.cancelled": "Cancelled",
  "shift.phase.done": "Done",
  "shift.phase.failed": "Failed",
  "shift.phase.handover": "Handing over",
  "shift.phase.opening": "Opening new session",
  "shift.phase.queued": "Queued",
  "shift.phase.waiting": "Waiting for takeover",
  "shift.queue.detail": "Queued: switching once it finishes this reply",
  "shift.queue.timeoutDetail": "Queued for over 30 minutes and its turn has not ended; not switched.",
  "shift.reply.handoverDone": "Handover done",
  "shift.reply.takenOver": "Taken over",
  "shift.result.archiveFailed": "Archive failed",
  "shift.result.detachFailed": "Detach failed",
  "shift.result.done": "Done",
  "shift.result.handoverTimeout": "Handover timed out",
  "shift.result.noHandoverReply": 'No "{done}" seen',
  "shift.result.noModel": "Model not readable",
  "shift.result.noNewSession": "No new session",
  "shift.result.noWorkspace": "No workspace",
  "shift.result.notFound": "Session not found",
  "shift.result.notTaken": "Not taken over yet",
  "shift.result.oldIdLost": "Old session id lost; archive it by hand",
  "shift.result.openFailed": "New session failed",
  "shift.result.queueTimeout": "Queue timed out; not switched",
  "shift.result.recheckFailed": "Check failed",
  "shift.result.sameId": "Old and new session ids match; not finished",
  "shift.result.sendFailed": "Handover send failed",
  "shift.result.wrongWorkspace": "Workspace mismatch",
  "shift.server.alreadyRunning": "A shift is already running; no second one was started.",
  "shift.server.cancelling": "Cancelling.",
  "shift.server.cancellingAfterCheck": "Cancelling; stops after this check.",
  "shift.server.checkingBusy": "Checking whether it is busy.",
  "shift.server.interrupted": "Shift interrupted: {error}",
  "shift.server.notRegistered": "This project is not in the registry.",
  "shift.server.nothingToContinue": "There is no shift to continue right now.",
  "shift.server.oldSessionError": "The old session reported an error",
  "shift.started": "Started {clock}, {elapsed}",
  "shift.started.unreadable": "Start time not readable yet",
  "shift.takeover.body": 'You are the new session of <leader> \xB7 {project}, taking over from old session {oldId} (the user pressed shift change on the AFC home page). First read the handover file and ~/.claude/CLAUDE.md, then follow "Session switch" in the project STATUS: register with kanban supervise, rebuild the heartbeats under your name, and tell the Kanban <leader> and related <leader>s the new id; once you have taken over, reply "{taken}". AFC archives the old session; you do not need to.',
  "shift.takeover.cards": 'Cards waiting for acceptance at the time ({count}): {cards}. After registering, handle these first (accept or rework); for any you cannot handle, write the card number and the reason under "who we are waiting on" in the handover file.',
  "shift.takeover.cardsUnreadable": "Cards waiting for acceptance could not be read; after registering, first look up this project's acceptance cards and accept or rework them.",
  "shift.takeover.emptyFile": "(handover file has no content yet)",
  "shift.takeover.message": "{body}\n\n{acceptance}\n\nHandover file: {path}\nSummary:\n{summary}",
  "shift.takeover.noCards": "This project had no cards waiting for acceptance at the time; after registering, check the board for new ones.",
  "shift.takeover.noFile": "(handover file not found yet)",
  "shift.todayUsd": "About ${usd} today",
  "shift.ui.againA11y": "Switch again",
  "shift.ui.cancel": "Cancel",
  "shift.ui.cancelA11y": "Cancel the shift change",
  "shift.ui.cancelQueueA11y": "Cancel the queue",
  "shift.ui.confirm": "Confirm",
  "shift.ui.confirmA11y": "Confirm the shift change for {code}",
  "shift.ui.continueA11y": "Continue the shift change",
  "shift.ui.failedLine": "{label}: {detail}",
  "shift.ui.hideHandover": "Hide handover",
  "shift.ui.noHandoverFile": "No handover file yet",
  "shift.ui.retry": "Retry",
  "shift.ui.retryA11y": "Retry the shift change",
  "shift.ui.showHandover": "View handover",
  "shift.ui.start": "Switch <leader>",
  "shift.ui.startA11y": "Switch the <leader> for {code}",
  "shift.ui.starting": "Starting\u2026",
  "shift.view.continuing": "Continuing.",
  "shift.view.retrying": "Retrying.",
  "shift.view.starting": "Starting the handover.",
  "snapshot.agentsReadFailed": "Could not read Paseo agents: {error}",
  "snapshot.alertKind.awaitingApproval": "Awaiting approval",
  "snapshot.alertKind.error": "Error",
  "snapshot.alertKind.maybeStuck": "May be stuck",
  "snapshot.alertKind.restartInterrupted": "May have been cut off by a restart",
  "snapshot.couponsUnread": "Coupon alerts not read this round",
  "snapshot.crashesUnread": "Daemon crash log not read this round",
  "snapshot.cursorLoginUnread": "Cursor login state not read this round",
  "snapshot.errorSuffix": ": {error}",
  "snapshot.kanbanBlocked.detail": "{why}{reason}. Unblock it in Paseo Kanban.",
  "snapshot.kanbanBlocked.noReason": "no reason given",
  "snapshot.kanbanBlocked.reason": "Blocked: ",
  "snapshot.kanbanBlocked.reasonWithKind": "Blocked ({kind}): ",
  "snapshot.kanbanBlocked.title": "{code} {title} (blocked in Kanban)",
  "snapshot.keychainUnread": "Keychain probe not read this round",
  "snapshot.legacyLeaderName": "Supervisor",
  "snapshot.permitAction": "an action",
  "snapshot.permitRequest": "{title}: requests {tool}",
  "snapshot.permitsFormatChanged": "Pending-approval list format changed; approval waits not shown this round",
  "snapshot.quietFor": "{title}: no activity for {minutes} min",
  "snapshot.recordsReadFailed": "Could not read agent records: {error}",
  "snapshot.restartInterrupted": "{title} (stopped around the Paseo restart at {time}; ask the <leader> whether it needs to continue)",
  "snapshot.role.mode": "mode {value}",
  "snapshot.role.thinking": "thinking {value}",
  "snapshot.roleProfileMissing": "Role profile missing: {role}",
  "snapshot.schedulesFormatChanged": "Schedule list format changed; not shown this round",
  "snapshot.schedulesReadFailed": "Could not read schedules; skipped this round",
  "snapshot.unread.detail": "It replied and you have not read it yet; it may include something you need to decide",
  "snapshot.unread.source": "Unread reply",
  "snapshot.unread.title": "{title} has an unread reply",
  "sweep.archiveFailed": "Archive failed",
  "sweep.idleReason": "Idle {hours} h, status {status}",
  "sweep.kanbanUnreadable": "kanban.db not readable; nothing archived this round",
  "sweep.noResponse60s": "no response in 60 s",
  "sweep.pendingNotList": "Cannot read the pending-approval list (reply is not a list); nothing archived this round",
  "sweep.pendingUnreadable": "Cannot read the pending-approval list; nothing archived this round: {error}",
  "sweep.switchOff": "Switch is off; candidates only recorded",
  "sweep.timedOut": "Timed out, skipped: {error}",
  "sweep.title.close": "]",
  "sweep.title.open": "[",
  "tabs.a11y": "{label}, {count} items",
  "tabs.access": "Access",
  "tabs.overview": "Overview",
  "tabs.quota": "Quota",
  "tabs.records": "Records",
  "tabs.roles": "Roles",
  "tabs.usage": "Usage",
  "tokens.day.today": "Today",
  "tokens.share.batch": "Batch",
  "tokens.share.decision": "Decision",
  "tokens.share.executor": "Executor",
  "tokens.share.leader": "<leader>",
  "tokens.share.ops": "Ops",
  "tokens.share.outside": "Outside Paseo",
  "tokens.share.personal": "User's own chats",
  "tokens.share.reader": "Reader",
  "tokens.share.reviewer": "Reviewer",
  "tokens.unit.billion": "{n}B",
  "tokens.unit.million": "{n}M",
  "tokens.unit.thousand": "{n}K",
  "tokens.unit.wan": "{n} \xD7 10k",
  "tokens.unit.yi": "{n} \xD7 100M",
  "ui.agentStatus.closed": "Closed",
  "ui.agentStatus.error": "Error",
  "ui.agentStatus.finished": "Finished",
  "ui.agentStatus.idle": "Idle",
  "ui.agentStatus.running": "Running",
  "ui.agentStatus.starting": "Starting",
  "ui.fold.collapseLabel": "Collapse {title}",
  "ui.fold.collapsedSuffix": " \xB7 Collapse",
  "ui.fold.expandLabel": "Expand {title}, {summary}",
  "ui.open": "Open",
  "ui.segmented.optionLabel": "{label}: {option}",
  "ui.time.ago": "{span} ago",
  "ui.time.days": "{n} d",
  "ui.time.hours": "{n} h",
  "ui.time.later": "in {span}",
  "ui.time.minutes": "{n} min",
  "ui.time.underMinute": "under 1 min",
  "upgrade.alert.failed": "{label}: {conclusion}{who}",
  "upgrade.alert.missing": "{label}: no compatibility check provided",
  "upgrade.alert.nobody": " (nobody to tell)",
  "upgrade.alert.notSent": " (notice not sent)",
  "upgrade.conclusion.failed": "Compatibility check failed",
  "upgrade.conclusion.missing": "No compatibility check provided",
  "upgrade.conclusion.passed": "Compatibility check passed",
  "upgrade.conclusion.timedOut": "Compatibility check timed out (over 10 minutes)",
  "upgrade.handoffMark.supervisor": "supervisor",
  "upgrade.handoffMark.takeover": "takeover",
  "upgrade.notice.failure": "[AFC] {change}. The compatibility check of {label} failed: {conclusion}. Fix it item by item following that plugin's PASEO-DEPENDENCIES.md; once npm run compat passes, run paseo plugin reload.",
  "upgrade.notice.version": "Paseo version {to}",
  "upgrade.notice.versionChange": "Paseo went from {from} to {to}",
  "upgrade.reason.changed": "Version changed",
  "upgrade.reason.firstSeen": "First run only records the version",
  "upgrade.reason.manual": "Manual check",
  "upgrade.reason.noVersion": "Can't read the Paseo version",
  "upgrade.reason.unchanged": "Version unchanged",
  "upgrade.watch.noNpm": "npm not found, so the compatibility check can't run",
  "upgrade.watch.running": "Already checking the three plugins",
  "upgrade.watch.startedForce": "Started checking the three plugins; results will show in the alerts",
  "upgrade.watch.startedQuiet": "Started checking the Paseo version",
  "upgrade.workerRole.batch": "Batch",
  "upgrade.workerRole.decision": "Decision",
  "upgrade.workerRole.executor": "Executor",
  "upgrade.workerRole.reader": "Reader",
  "upgrade.workerRole.reviewer": "Reviewer",
  "usage.balance.note": "From Paseo: {used} spent this period at API prices, plan allowance {limit} (all blocks together, for reference only){billing}",
  "usage.balance.overageOff": "; pay-as-you-go off",
  "usage.balance.overageOn": "; pay-as-you-go on",
  "usage.model.estimated": " \xB7 usage estimated (the provider reports no tokens; output only)",
  "usage.model.noPrice": "no price",
  "usage.pace.ahead": "Ahead, limited",
  "usage.pace.behind": "Behind, use first",
  "usage.pace.normal": "Normal",
  "usage.pace.stopped": "Stopped",
  "usage.plan.notFound": "No such plan: {id}",
  "usage.plan.saved": "Saved",
  "usage.role.outside": "You, directly outside Paseo (terminal, desktop app, etc.)",
  "usage.role.paseoOther": "Your other chats in Paseo",
  "usage.timeout": "{what} did not answer within {seconds} s",
  "usage.view.loginScreenMarker": "login screen",
  "usage.warn.firstScan": "The first count reads this machine's last 40 days of records, which takes a minute or two; it shows up automatically when done",
  "usage.warn.listJoin": ", ",
  "usage.warn.missingPrice": "These plans have no monthly fee yet, so the payback ratio can't be computed: {plans}",
  "usage.warn.quotaUnread": "Can't read the vendors' quotas ({error}); quota percentages are missing and the quota snapshot is not updated this round",
  "usage.warn.unpriced": "These models have no price in the public price list and are not counted: {models} (add them under prices in plans.json)",
  "quota.adapters.muse": "Muse",
  "quota.adapters.opencodeGo": "OpenCode Go",
  "quota.plans.window.rolling": "Rolling",
  "quota.plans.window.current": "Current window",
  "quota.plans.window.hours": "{count}-hour",
  "quota.plans.window.minutes": "{count}-minute",
  "quota.plans.window.days": "{count}-day",
  "settings.title": "Fleet settings",
  "settings.intro": "Edit each section and save it. Refresh discards unsaved changes.",
  "settings.general": "General settings",
  "settings.plans": "Quota pools",
  "settings.loading": "Loading settings\u2026",
  "settings.on": "On",
  "settings.off": "Off",
  "settings.language": "Language",
  "settings.lang.system": "System",
  "settings.lang.en": "English",
  "settings.lang.zh-CN": "Simplified Chinese",
  "settings.hiddenHint": "Only hides matching quota cards; dispatch and profile lists are unaffected.",
  "settings.banned": "Providers excluded from dispatch",
  "settings.bannedHint": "These providers cannot receive dispatched work and do not appear in profile lists. Unlike hidden pool terms, this changes dispatch policy, not just quota card visibility.",
  "settings.provider": "Provider id",
  "settings.addProvider": "Add provider",
  "settings.removeProvider": "Remove {provider}",
  "settings.hidden": "Hidden pool terms (comma separated)",
  "settings.adapters": "Optional adapters",
  "settings.cursor": "Cursor usage API",
  "settings.keychain": "Keychain presence check",
  "settings.reloadHint": "Language applies to the panel after refresh. Adapter timers update on the next plugin load. The host title keeps the language known when the page was registered.",
  "settings.saved": "Saved.",
  "settings.conflict": "This file changed elsewhere. Your edits were not saved. Refresh to load the latest version before editing again.",
  "settings.error": "Settings could not be read or saved: {error}",
  "settings.save": "Save",
  "settings.refresh": "Refresh",
  "settings.add": "Add pool",
  "settings.remove": "Remove pool",
  "settings.priority": "Dispatch priority",
  "settings.priorityHint": "Pool ids in priority order, with an expiry time. Clear the override to use quota order.",
  "settings.order": "Pool ids (comma separated)",
  "settings.until": "Valid until (ISO date and time)",
  "settings.quotaOrder": "Use quota order",
  "settings.plan.id": "Pool id",
  "settings.plan.name": "Name",
  "settings.plan.providers": "Providers (comma separated)",
  "settings.plan.priceUsdMonthly": "Monthly price (USD)",
  "settings.plan.stopPct": "Stop at used percent",
  "settings.plan.cycleDay": "Monthly cycle day",
  "settings.plan.adapter": "Quota adapter",
  "settings.plan.dispatch": "Allow dispatch",
  "settings.plan.pacePause": "Pause when ahead of pace",
  "settings.adapterId": "{id}",
  "onboarding.title": "Set up roles (preview)",
  "onboarding.previewOnly": "Preview only. Installation does not create profiles or change review routing.",
  "onboarding.privacy": "The host has no narrow profiles API. Only provider catalogs are read; create profiles in Paseo yourself.",
  "onboarding.discover": "Discover models / retry",
  "onboarding.loading": "Discovering capabilities\u2026",
  "onboarding.failed": "Discovery or preview failed. Retry or create profiles in Paseo manually.",
  "onboarding.status.ready": "Catalog discovery finished.",
  "onboarding.status.timeout": "Discovery timed out. Please retry.",
  "onboarding.status.unknown": "Capabilities unknown. Retry or use manual setup.",
  "onboarding.authUnknown": "Authentication, subscriptions, quota and real requests are unverified. Discoverable does not mean logged in.",
  "onboarding.provider.discoverable": "Discoverable",
  "onboarding.provider.unavailable": "Disabled or unavailable",
  "onboarding.provider.unknown": "Unknown",
  "onboarding.noModels": "No selectable models. Install and sign in to a local provider yourself, then retry. No task is created.",
  "onboarding.primary": "Primary roles",
  "onboarding.reviewer": "Independent reviewer",
  "onboarding.familyHint": "Confirm the model manufacturer as its family: direct Claude \u2192 anthropic, Codex \u2192 openai, Grok \u2192 xai. Cursor is a provider, not a model family, and can run models from multiple manufacturers. Do not use provider names or pricing attribution as family. Confirm the actual model source yourself; ask an unknown proxy's operator. Provider count does not prove independence.",
  "onboarding.family": "Model family for {role}",
  "onboarding.confirm": "Confirm family for {role}",
  "onboarding.confirmed": "Family confirmed for {role} (change)",
  "onboarding.options": "Optional mode and thinking overrides; other features use host defaults.",
  "onboarding.defaults": "Use host defaults for {role}",
  "onboarding.mode": "{role} mode: {value}",
  "onboarding.thinking": "{role} thinking: {value}",
  "onboarding.addReviewer": "Include a reviewer from another family",
  "onboarding.removeReviewer": "Use manual review preview",
  "onboarding.generate": "Generate preview",
  "onboarding.reviewA": "Single family option A (proposal): deliver for human review; independent review requires another model family.",
  "onboarding.reviewB": "Single family option B (proposal): a new session may self-check ordinary low-risk work. This is not independent review. This option is not enabled.",
  "onboarding.l4": "L4, permissions, money and migrations require another family or human review. Self-check cannot automatically approve them.",
  "onboarding.noQuota": "No quota pool is assigned. Quota protection is not configured.",
  "onboarding.independent": "Six role templates with different executor and reviewer families. Routing and storage are unchanged.",
  "onboarding.manual": "Five role templates. No single-family reviewer is generated; delivery needs human review or another family.",
  "onboarding.copyHint": "Select and copy this JSON as a reference for creating profiles in Paseo. It is not a replacement config or an array to patch. Check existing names and IDs and bind roles manually. Extension-key persistence is unverified.",
  "onboarding.issue.none": "Preview unavailable. Retry.",
  "onboarding.issue.capability": "A selected model is unavailable or capabilities changed. Discover again.",
  "onboarding.issue.family": "Confirm known model families. Independent review requires a different family.",
  "onboarding.issue.options": "A selected mode or thinking option is unavailable. Discover again.",
  "onboarding.role.supervisor": "Leader",
  "onboarding.notes.supervisor": "Coordinate tasks, check evidence, request human decisions and communicate. Follow repository instructions and the Kanban leader protocol when available.",
  "onboarding.role.executor": "Executor",
  "onboarding.notes.executor": "Implement the assigned scope and commit completed steps. Report files, verification and risks. Do not perform final acceptance.",
  "onboarding.role.reviewer": "Reviewer",
  "onboarding.notes.reviewer": "Review the delivery independently and report findings with evidence. Do not edit or merge the delivery.",
  "onboarding.role.reader": "Reader",
  "onboarding.notes.reader": "Investigate the assigned scope read-only. Report evidence and uncertainties.",
  "onboarding.role.decision": "Decision",
  "onboarding.notes.decision": "Compare technical options, costs and risks. Recommend an option with evidence.",
  "onboarding.role.batch": "Operations",
  "onboarding.notes.batch": "Perform only the authorized operational task. Report verification and risks.",
  "settings.dispatch.title": "Dispatch depth",
  "settings.dispatch.hint": "Override thinking depth and order for each role, difficulty and profile slot. Explicit orders come first, in ascending order; empty orders use quota priority. Quota pauses and review family restrictions still apply. Save these changes with General settings.",
  "settings.dispatch.tier": "{tier}",
  "settings.dispatch.target": "{slot} / {tier}",
  "settings.dispatch.profile": "{slot} \u2014 {profile}",
  "settings.dispatch.missing": "No matching profile",
  "settings.dispatch.defaults": "Defaults: {values}",
  "settings.dispatch.defaultValue": "{context}: {effort}, position {order}",
  "settings.dispatch.all": "All tasks",
  "settings.dispatch.inherit": "Profile depth",
  "settings.dispatch.unknown": "Thinking options are unavailable. Depth overrides will be ignored until capabilities can be verified.",
  "settings.dispatch.savedEffort": "Override: {effort}",
  "settings.dispatch.default": "Use default",
  "settings.dispatch.defaultAction": "Use default depth for {target}",
  "settings.dispatch.inheritAction": "Use profile depth for {target}",
  "settings.dispatch.effort": "{effort}",
  "settings.dispatch.effortAction": "Set {target} depth to {effort}",
  "settings.dispatch.order": "Order (1\u20131000; empty uses quota priority)",
  "settings.dispatch.orderAction": "Position for {target}",
  "settings.dispatch.clearRow": "Clear overrides",
  "settings.dispatch.clearAction": "Clear overrides for {target}",
  "settings.dispatch.clearAll": "Clear all dispatch overrides",
  "settings.dispatch.empty": "No default dispatch slots are available.",
  "quota.setup.readFailed": "Automatic usage is unavailable. Enter a manual reading in Fleet Settings.",
  "quota.setup.fixedWindow": "Fixed duration",
  "quota.setup.monthWindow": "Monthly",
  "quota.setup.weekWindow": "Weekly",
  "quota.setup.dayWindow": "Daily",
  "quota.setup.liveNoPace": "Live usage belongs to {window}. Its cycle cannot be compared with the configured cycle; dispatch uses the stop threshold without a progress line.",
  "quota.setup.windowAtStop": "{window} usage {used}% reached the {stop}% stop threshold.",
  "quota.setup.unknownWindow": "Unknown cycle",
  "quota.setup.staleHold": "Reading expired. Enter a new reading or explicitly disable quota protection.",
  "quota.setup.unknownHold": "Usage is unknown. Enter a reading or explicitly disable quota protection.",
  "quota.setup.atStop": "Usage {used}% reached the configured stop {stop}%.",
  "quota.setup.unprotected": "Quota protection is disabled for this pool.",
  "quota.setup.manualReason": "{reason} Manual reading at {at}. {error}",
  "quota.setup.reading": "Source: {state}. Recorded: {at}. {error}",
  "quota.setup.staleReading": "Expired reading: {used}%. Recorded: {at}. Enter a fresh reading.",
  "settings.emptyPools": "No quota pools configured. You can continue without quota protection; profiles without a pool use the base dispatch order.",
  "settings.plan.usageProvider": "Usage source id",
  "settings.plan.bindingHint": "Bind profiles using this pool id. Automatic sources must match the usage source id reported by Paseo; separate accounts need distinct source ids or manual readings.",
  "settings.cycle": "Reset cycle",
  "settings.cycle.unknown": "Unknown",
  "settings.cycle.day": "Daily",
  "settings.cycle.week": "Weekly",
  "settings.cycle.month": "Monthly",
  "settings.cycle.duration": "Fixed duration",
  "settings.cycle.timeZone": "IANA time zone",
  "settings.cycle.hour": "Reset hour (0-23)",
  "settings.cycle.minute": "Reset minute (0-59)",
  "settings.cycle.dayOfMonth": "Reset day (1-31)",
  "settings.cycle.weekday": "Reset weekday (0=Sunday)",
  "settings.cycle.seconds": "Duration in seconds",
  "settings.cycle.startsAt": "Duration anchor (ISO with offset)",
  "settings.cycle.hint": "Calendar resets follow this time zone. Short months clamp to the last day. DST gaps shift forward; overlaps use the earlier instant. Changing the cycle expires old manual readings. Unknown cycles have no pace estimate.",
  "settings.cycle.legacy": "Existing cycle retained until you choose a new one.",
  "settings.manual": "Manual reading / automatic fallback",
  "settings.manual.usedPct": "Used percent (blank = unknown)",
  "settings.manual.at": "Recorded at (ISO with offset)",
  "settings.manual.source": "Reading source",
  "settings.manual.ttlSeconds": "Reading validity in seconds",
  "settings.manual.startsAt": "Window start (optional ISO)",
  "settings.manual.resetsAt": "Reset at (optional ISO)",
  "settings.manual.hint": "Automatic readings win when available. The adapter stays selected during failures; manual copies expire by age or reset. A postponed reset requires a new reading.",
  "settings.manual.now": "Record current time",
  "settings.manual.clear": "Clear manual reading",
  "settings.noProtection": "Disable quota protection for this pool",
  "settings.noProtectionHint": "Explicit opt-in: work may start even when usage is unknown or exhausted.",
  "quota.setup.ambiguousSource": "This usage source is assigned to multiple pools. Choose distinct source ids or enter manual readings.",
  "usage.noPools": "No quota pools configured; dispatch has no quota protection for profiles without a pool.",
  "quota.setup.state.live": "Automatic",
  "quota.setup.state.manual": "Manual",
  "quota.setup.state.unknown": "Unknown",
  "doctor.platform.title": "Platform capabilities",
  "doctor.platform.summary": "{platform}, Node {node}",
  "doctor.platform.target": "macOS/Linux release target; end-to-end validation is not yet recorded.",
  "doctor.platform.unverified": "This operating system is unverified; native Windows is not a release target.",
  "doctor.platform.keychainOptional": "Keychain presence checks are macOS-only and optional.",
  "doctor.platform.keychainSkipped": "Keychain checks are not applicable on this operating system and are skipped.",
  "doctor.platform.processSkipped": "Unix process inspection was skipped on this operating system; process findings are unverified.",
  "cursor.api.sandboxLabel": "Agent sandbox",
  "access.detail.pluginUnconfigured": "No plugin id is configured for this status check"
};

// shared/locales/zh-CN.json
var zh_CN_default = {
  "access.account.personal": "\u4E2A\u4EBA\u8D26\u53F7",
  "access.account.registered": "{note}\uFF08\u767B\u8BB0\uFF09",
  "access.account.registeredMark": "\uFF08\u767B\u8BB0\uFF09",
  "access.account.withNote": "{account}\uFF08{note}\uFF09",
  "access.detail.blocked": "\u6838\u5BF9\u547D\u4EE4\u4E0D\u5728\u5141\u8BB8\u5217\u8868",
  "access.detail.checking": "\u6B63\u5728\u6838\u5BF9",
  "access.detail.checkingMcp": "\u6B63\u5728\u7528 claude mcp list \u6838\u5BF9",
  "access.detail.checkingPrefix": "\u6B63\u5728",
  "access.detail.commandFailed": "\u547D\u4EE4\u5931\u8D25",
  "access.detail.commandMissing": "\u547D\u4EE4\u4E0D\u5B58\u5728",
  "access.detail.connector": "claude.ai {name}\u3002{method}",
  "access.detail.connectorFailed": "claude.ai {name} \u8FDE\u63A5\u5931\u8D25\u3002{method}",
  "access.detail.connectorMissing": "\u8F93\u51FA\u91CC\u6CA1\u6709 claude.ai {name}\u3002{method}",
  "access.detail.connectorNeedsAuth": "claude.ai {name} \u9700\u8981\u6388\u6743\u3002{method}",
  "access.detail.connectorUnknown": "claude.ai {name} \u7684\u72B6\u6001\u8BA4\u4E0D\u51FA\u3002{method}",
  "access.detail.grokMethod": "grok.com\uFF0Cgrok models \u6838\u5BF9",
  "access.detail.join": "\u3002",
  "access.detail.loginNoBrowser": "\u672A\u767B\u5F55\uFF0C\u6CA1\u6709\u7EE7\u7EED\u6D4F\u89C8\u5668\u6388\u6743",
  "access.detail.loginStopped": "\u672A\u767B\u5F55\uFF0C\u5DF2\u505C\u6B62\uFF0C\u6CA1\u6709\u7EE7\u7EED\u6D4F\u89C8\u5668\u6388\u6743",
  "access.detail.mcpMethod": "claude.ai \u8FDE\u63A5\u5668\uFF0Cclaude mcp list \u6838\u5BF9",
  "access.detail.noParser": "\u6CA1\u6709\u89E3\u6790\u89C4\u5219",
  "access.detail.slackMissing": "Slack \u63D2\u4EF6\uFF1A\u6CA1\u627E\u5230",
  "access.detail.slackRunning": "Slack \u63D2\u4EF6\uFF1A\u8FD0\u884C\u4E2D",
  "access.detail.slackStopped": "Slack \u63D2\u4EF6\uFF1A\u6CA1\u5728\u8FD0\u884C",
  "access.detail.timedOut": "\u8D85\u65F6",
  "access.detail.tokenDropped": "\u5DF2\u4E22\u5F03\u7591\u4F3C\u4EE4\u724C",
  "access.detail.unrecognized": "\u8F93\u51FA\u65E0\u6CD5\u8BC6\u522B",
  "access.listJoin": "\u3001",
  "access.mode.acceptEdits": "\u6539\u6587\u4EF6\u65F6\u4F1A\u5148\u95EE",
  "access.mode.agent": "\u80FD\u6539\u6587\u4EF6\u3001\u8DD1\u547D\u4EE4",
  "access.mode.bypassPermissions": "\u6267\u884C\u547D\u4EE4\u4E0D\u518D\u9010\u6761\u95EE\u4EBA",
  "access.mode.default": "\u6309\u5DE5\u5177\u9ED8\u8BA4\uFF0C\u8BE5\u95EE\u7684\u8FD8\u4F1A\u95EE",
  "access.mode.fullAccess": "\u5B8C\u6574\u8BBF\u95EE\uFF0C\u6267\u884C\u547D\u4EE4\u4E0D\u518D\u9010\u6761\u95EE\u4EBA",
  "access.mode.known": "{plain}\uFF08{id}\uFF09",
  "access.mode.none": "\u6863\u6848\u6CA1\u5199\u6743\u9650\u6A21\u5F0F",
  "access.mode.other": "\u6863\u6848\u91CC\u7684\u6743\u9650\u6A21\u5F0F\uFF08{id}\uFF09",
  "access.mode.plan": "\u53EA\u51FA\u65B9\u6848\uFF0C\u4E0D\u6539\u6587\u4EF6",
  "access.notes.boilerplate": "\u4E0D\u5728\u56DE\u590D\u91CC\u8D34|\u4E0D\u8BFB\u53D6\u3001\u4E0D\u6253\u5370|\u7F3A\u6570\u636E\u5C31\u8BF4|\u7981\u6B62\u7F16\u9020|\u4E0D\u5199\u4E1A\u52A1\u4EE3\u7801|\u7981\u6B62\u64CD\u4F5C",
  "access.notes.colons": "\uFF1A:",
  "access.notes.negations": "\u4E0D|\u7981\u6B62|\u53EA\u51C6",
  "access.notes.none": "\u6CA1\u6709\u5355\u72EC\u7684\u7981\u6B62\u9879",
  "access.notes.pauseMarker": "\u3010\u6682\u505C\u3011",
  "access.notes.pausePrefix": "\u6682\u505C\uFF1A{text}",
  "access.notes.sentenceEnd": "\u3002",
  "access.notes.specialMarker": "\u7279\u522B\u7EA6\u675F",
  "access.page.byRole": "\u6309\u89D2\u8272",
  "access.page.byService": "\u6309\u670D\u52A1",
  "access.page.checkFailed": "\u6838\u5BF9\u5931\u8D25\uFF1A{error}",
  "access.page.checking": "\u6B63\u5728\u6838\u5BF9\u2026",
  "access.page.constraint": "\u7EA6\u675F\uFF1A{constraint}",
  "access.page.lastChecked": "\u4E0A\u6B21\u6838\u5BF9 {ago}",
  "access.page.limit": "\u9650\u5236\uFF1A{limit}",
  "access.page.loading": "\u6B63\u5728\u8BFB\u53D6\u2026",
  "access.page.login": "\u767B\u5F55\u65B9\u5F0F\uFF1A{login}",
  "access.page.mode": "\u6743\u9650\u6A21\u5F0F\uFF1A{mode}",
  "access.page.neverChecked": "\u8FD8\u6CA1\u6838\u5BF9",
  "access.page.noDispatch": "\u4E0D\u6D3E\u6D3B",
  "access.page.noProfiles": "\u8BFB\u4E0D\u5230\u6863\u6848",
  "access.page.noServices": "\u6CA1\u6709\u767B\u8BB0\u7684\u670D\u52A1",
  "access.page.permission": "\u6743\u9650\uFF1A{permission}",
  "access.page.readFailed": "\u8BFB\u53D6\u5931\u8D25\uFF1A{error}",
  "access.page.recheck": "\u91CD\u65B0\u6838\u5BF9",
  "access.page.role": "\u89D2\u8272\uFF1A{role}",
  "access.page.scopes": "\u3002\u8FD9\u6B21\u6838\u5BF9 {count} \u9879",
  "access.page.services": "\u80FD\u7528\u7684\u670D\u52A1\uFF1A{services}",
  "access.page.users": "\u8C01\u5728\u7528\uFF1A{users}",
  "access.pending": "\u5F85\u6838\u5BF9",
  "access.role.candidate": "\u5019\u9009",
  "access.role.none": "\u672A\u6807\u89D2\u8272",
  "access.role.patrol": "\u5DE1\u68C0",
  "access.role.personal": "\u4E2A\u4EBA",
  "access.state.checking": "\u6B63\u5728\u6838\u5BF9",
  "access.state.linked": "\u5DF2\u8FDE\u63A5",
  "access.state.loggedIn": "\u5DF2\u767B\u5F55",
  "access.state.loggedOut": "\u672A\u767B\u5F55",
  "access.state.unknown": "\u67E5\u4E0D\u5230",
  "access.state.unlinked": "\u672A\u8FDE\u63A5",
  "access.view.account": "\u8D26\u53F7\uFF1A{account}",
  "access.view.accountRegistered": "\u767B\u8BB0\u7684\u8D26\u53F7\uFF1A{account}",
  "access.view.foldCount": "{count} \u4E2A",
  "access.view.foldLinked": "\u5DF2\u8FDE\u63A5 {count}",
  "access.view.foldLoggedIn": "\u5DF2\u767B\u5F55 {count}",
  "access.view.foldUnknown": "\u67E5\u4E0D\u5230 {count}",
  "access.view.noServices": "\u6CA1\u6709\u767B\u8BB0",
  "access.view.noUsers": "\u6CA1\u6709\u6863\u6848\u5199\u660E\u4F1A\u7528",
  "access.view.permission": "\u6743\u9650\uFF1A{permission}",
  "access.view.permissionScopes": "\u6743\u9650\uFF1A{permission}\u3002\u8FD9\u6B21\u6838\u5BF9 {count} \u9879",
  "access.view.profiles": "{count} \u4E2A\u6863\u6848",
  "access.warning.noMap": "\u8BFB\u4E0D\u5230 access-map.json",
  "access.where.noPool": "\u8DD1\u5728 {vendor}\uFF0C\u6CA1\u6709\u5355\u72EC\u7684\u989D\u5EA6\u6C60",
  "access.where.pool": "\u8DD1\u5728 {vendor}\uFF0C\u82B1 {label}",
  "access.where.poolQuota": "{label} \u989D\u5EA6",
  "access.where.quotaWord": "\u989D\u5EA6",
  "access.where.unknownVendor": "\u672A\u77E5",
  "board.color.dark": "\u6DF1\u8272",
  "board.color.light": "\u6D45\u8272",
  "board.color.paseo": "\u8DDF\u968F Paseo",
  "board.colorMode": "\u6DF1\u6D45\u8272",
  "board.font.lg": "\u5927",
  "board.font.md": "\u4E2D",
  "board.font.sm": "\u5C0F",
  "board.fontSize": "\u5B57\u53F7",
  "board.leaderReply.empty": "\u8BF7\u5148\u5199\u4E00\u53E5\u8BDD",
  "board.loading": "\u6B63\u5728\u8BFB\u53D6\u2026",
  "board.loadingQuota": "\u6B63\u5728\u8BFB\u53D6\u989D\u5EA6\u2026",
  "board.openFailed": "\u6253\u5F00\u5931\u8D25\uFF1A{error}",
  "board.prefsSaveFailed": "\u504F\u597D\u6CA1\u6709\u4FDD\u5B58\uFF0C\u8BF7\u518D\u8BD5\u4E00\u6B21",
  "board.readFailed": "\u8BFB\u53D6\u5931\u8D25\uFF1A{error}",
  "board.refresh": "\u5237\u65B0",
  "board.refreshNow": "\u7ACB\u5373\u5237\u65B0",
  "board.tabHint.access": "\u8FD9\u4E00\u9875\u770B\u73B0\u5728\u6BCF\u4E2A\u670D\u52A1\u600E\u4E48\u767B\u5F55\u3001\u8D26\u53F7\u662F\u8C01\u3001\u6743\u9650\u6709\u591A\u5927\u3001\u54EA\u4E9B\u6863\u6848\u5728\u7528\uFF0C\u4EE5\u53CA\u6BCF\u4E2A\u6863\u6848\u8DD1\u5728\u54EA\u5BB6\u3001\u53D7\u4EC0\u4E48\u9650\u5236\u3002",
  "board.tabHint.leader": "\u5404\u9879\u76EE\u7684 <leader>\u3001\u5F85\u62CD\u677F\u3001\u65B0\u56DE\u590D\u548C\u63D0\u9192\u3002",
  "board.tabHint.quota": "\u989D\u5EA6\u591F\u4E0D\u591F\u7528\u3001\u6309\u8FDB\u5EA6\u8BE5\u6D3E\u8C01\uFF0C\u4EE5\u53CA\u5957\u9910\u82B1\u8D39\u548C\u56DE\u672C\u3002",
  "board.tabHint.records": "\u8FD9\u4E00\u9875\u7ED9 <leader> \u770B\u6D41\u6C34\uFF0C\u8FD8\u6709\u770B\u677F\u6982\u51B5\u3002\u5E73\u65F6\u90FD\u6298\u7740\uFF0C\u53EA\u663E\u793A\u6807\u9898\u548C\u6761\u6570\uFF0C\u70B9\u5F00\u518D\u770B\u3002",
  "board.tabHint.roles": "\u6BCF\u4E2A\u89D2\u8272\u4E00\u5F20\u5361\uFF1A\u6BCF\u6863\u7528\u54EA\u5BB6\u989D\u5EA6\u3001\u54EA\u4E2A\u6A21\u578B\u548C\u601D\u8003\u6DF1\u5EA6\u3001\u80FD\u4E0D\u80FD\u6D3E\u3001\u8FD1 7 \u5929\u505A\u4E86\u51E0\u4EF6\uFF1B\u300C\u6362\u6A21\u578B\u300D\u76F4\u63A5\u6362\uFF0C\u5361\u4E0B\u300C\u5386\u53F2\u300D\u53EF\u4EE5\u64A4\u9500\u3002",
  "board.tabHint.usage": "\u8FD1 7 \u5929 Token\uFF0C\u4EE5\u53CA\u6BCF\u4E2A\u89D2\u8272\u505A\u4E86\u4EC0\u4E48\u3002",
  "board.updatedAgo": "\u66F4\u65B0\u4E8E {ago}",
  "board.warnings.count": "{count} \u6761",
  "board.warnings.title": "\u8BFB\u53D6\u63D0\u793A",
  "cli.roles.detailNeedsOptions": '\u5F85\u62CD\u677F\u7684 --detail \u5FC5\u987B\u6709 A\u3001B \u4E24\u4E2A\u9009\u9879\u548C\u300C\u63A8\u8350\u300D\uFF1B\u793A\u4F8B\uFF1A--detail "A\uFF1A\u73B0\u5728\u505A\uFF1BB\uFF1A\u6682\u7F13\u3002\u63A8\u8350\uFF1AA"\u3002\u786E\u5B9E\u65E0\u6CD5\u5199\u6210\u9009\u9879\u65F6\u624D\u7528 --force-open\uFF08\u4F1A\u6807\u6CE8\u5F00\u653E\u95EE\u9898\uFF09\u3002',
  "cli.roles.forceOpenTag": " [\u5F00\u653E\u95EE\u9898\uFF08--force-open\uFF09]",
  "cli.roles.help.force": "\u767B\u8BB0\u5230\u5DF2\u6682\u505C\u7684\u9879\u76EE\u65F6\u4E0D\u8B66\u544A",
  "cli.roles.help.forceOpen": "\u786E\u5B9E\u65E0\u6CD5\u5217\u9009\u9879\u65F6\u767B\u8BB0\uFF0C\u6807\u6CE8\u4E3A\u5F00\u653E\u95EE\u9898",
  "cli.roles.notePrefix.rewritten": "\u6539\u5199\u4E3A",
  "cli.roles.notePrefix.shelved": "\u6401\u7F6E",
  "cli.roles.notePrefix.stale": "\u5DF2\u8FC7\u65F6",
  "cli.roles.notePrefix.supervisor": "\u603B\u7BA1\u5DF2\u5B9A",
  "cli.roles.optionMarkAfter": "\uFF0E\u3002\uFF1A\u3001\uFF09\uFF0F",
  "cli.roles.optionMarkBefore": "\uFF1B\uFF0F\uFF1A\u3001\uFF0C",
  "cli.roles.overturnDetail": "\u7528\u6237\u63A8\u7FFB\u4E86\u603B\u7BA1\u7684\u51B3\u5B9A\uFF1A{body}",
  "cli.roles.overturnJoin": "\uFF1B",
  "cli.roles.ownerLeader": "{project} <leader>",
  "cli.roles.ownerNone": "\u65E0 <leader>",
  "cli.roles.pauseAlready": "roles pause: {project} \u5DF2\u7ECF\u6682\u505C",
  "cli.roles.pauseNone": "\u6CA1\u6709\u6682\u505C\u7684\u9879\u76EE",
  "cli.roles.pausedWarning": "\u8B66\u544A\uFF1A{project} \u5DF2\u6682\u505C\uFF0CAFC \u9762\u677F\u4E0D\u4F1A\u663E\u793A\u8FD9\u6761\uFF0C\u4E5F\u4E0D\u4F1A\u63D0\u9192\u7528\u6237\uFF08\u5DF2\u767B\u8BB0\uFF1B\u52A0 --force \u4E0D\u518D\u63D0\u793A\uFF09",
  "cli.roles.recommendWord": "\u63A8\u8350",
  "cli.roles.refuse.detail": "{reason}\uFF08\u5F53\u524D {provider}/{model}\uFF09",
  "cli.roles.resumeNotPaused": "roles resume: {project} \u6CA1\u6709\u6682\u505C",
  "cli.roles.sourceLeader": "\u603B\u7BA1",
  "cli.roles.staleNone": "\u6CA1\u6709\u6302\u4E86\u8D85\u8FC7 {days} \u5929\u3001\u4E14\u6CA1\u5361\u4F4F\u5F00\u5DE5\u7684\u6761\u76EE",
  "cli.roles.staleRow": "  {id} \u6302\u4E86{days}\u5929 {title}",
  "cli.roles.status.done": "\u7528\u6237\u5B9A\u4E86",
  "cli.roles.status.open": "\u5F85\u62CD\u677F",
  "cli.roles.status.overturned": "\u5DF2\u63A8\u7FFB",
  "cli.roles.status.rewritten": "\u6539\u5199",
  "cli.roles.status.shelved": "\u6401\u7F6E",
  "cli.roles.status.stale": "\u5DF2\u8FC7\u65F6",
  "cli.roles.status.supervisor": "\u603B\u7BA1\u5DF2\u5B9A",
  "cli.roles.unknownRole": "roles: unknown role {key}. Known: {known}, patrol (\u5DE1\u68C0). Candidate profiles: {cands}",
  "cli.roles.addRequired": "roles decide add\uFF1A\u5FC5\u987B\u5199 --project \u548C --title",
  "cli.roles.check.badParams": "\u53C2\u6570\u65E0\u6548 {params}",
  "cli.roles.check.codexStale": "\uFF08\u5728 Codex \u76EE\u5F55\u91CC\u627E\u5230\u4E86\uFF1BPaseo \u7684\u6A21\u578B\u5217\u8868\u8981\u7B49 daemon \u91CD\u542F\u624D\u66F4\u65B0\uFF09",
  "cli.roles.check.cursorMissing": "Cursor \u6CA1\u6709\u6A21\u578B {model}",
  "cli.roles.check.cursorModels": "\u5217\u4E0D\u51FA Cursor \u7684\u6A21\u578B\uFF08\u53EF\u80FD\u6CA1\u767B\u5F55\uFF09",
  "cli.roles.check.cursorOk": "cursor-cloud/{model} \u6B63\u5E38",
  "cli.roles.check.familiesDiffer": "\u5BB6\u65CF\u4E0D\u540C\uFF08{left} \u5BF9 {right}\uFF09",
  "cli.roles.check.modelMissing": "{provider} \u4E0D\u63D0\u4F9B\u6A21\u578B {model}",
  "cli.roles.check.modelPolicy": "\u7B56\u7565\u4E0D\u5141\u8BB8\u6A21\u578B {model}\uFF08\u5141\u8BB8 {allowed}\uFF09",
  "cli.roles.check.noProfile": "\u8FD9\u4E2A\u89D2\u8272\u6CA1\u6709\u6863\u6848",
  "cli.roles.check.ok": "{provider}/{model} \u6B63\u5E38{note}",
  "cli.roles.check.paramPolicy": "\u7B56\u7565\u8981\u6C42\u53C2\u6570 {name} \u5FC5\u987B\u662F {value}",
  "cli.roles.check.providerDown": "\u670D\u52A1\u5546 {provider} \u4E0D\u53EF\u7528\uFF08{status}\uFF09",
  "cli.roles.check.sameFamily": "\u5BB6\u65CF\u76F8\u540C\uFF08{family}\uFF09\uFF1B\u505A\u4E8B\u7684\u548C\u68C0\u67E5\u7684\u5FC5\u987B\u4E0D\u662F\u540C\u4E00\u5BB6",
  "cli.roles.check.thinking": "\u601D\u8003\u6863 {thinking} \u4E0D\u5728 {options} \u91CC",
  "cli.roles.commentIdRequired": "roles decide comment\uFF1A\u5FC5\u987B\u5199 id",
  "cli.roles.commentNoteRequired": "roles decide comment\uFF1A\u5FC5\u987B\u5199 --note",
  "cli.roles.decideBusy": "roles decide\uFF1Adecisions.json \u6B63\u88AB\u5360\u7528\uFF0C\u8BF7\u518D\u8BD5\u4E00\u6B21",
  "cli.roles.decideFailed": "roles decide\uFF1A{message}",
  "cli.roles.decidedNoteRequired": "roles decide decided\uFF1A\u5FC5\u987B\u5199 --note",
  "cli.roles.decidedRequired": "roles decide decided\uFF1A\u5FC5\u987B\u5199 --project \u548C --title",
  "cli.roles.doneIdRequired": "roles decide done\uFF1A\u5FC5\u987B\u5199 id",
  "cli.roles.lsFailed": "roles ls \u5931\u8D25",
  "cli.roles.migrateNone": "\u6CA1\u6709 decisions.json \u53EF\u8FC1\u79FB",
  "cli.roles.migrateRaced": "\u8FC1\u79FB\u65F6 decisions.json \u88AB\u6539\u8FC7\uFF0C\u4EC0\u4E48\u90FD\u6CA1\u5199",
  "cli.roles.noItem": "\u6CA1\u6709\u6761\u76EE {id}",
  "cli.roles.notSupervisor": "{id} \u4E0D\u662F\u603B\u7BA1\u5DF2\u5B9A\u7684\u6761\u76EE\uFF08\u72B6\u6001 {status}\uFF09",
  "cli.roles.overturnIdRequired": "roles decide overturn\uFF1A\u5FC5\u987B\u5199 id",
  "cli.roles.pauseUnreadable": "roles pause\uFF1A\u8BFB\u4E0D\u4E86 paused-projects.json\uFF1A{error}",
  "cli.roles.projectRequired": "roles {cmd}\uFF1A\u5FC5\u987B\u5199\u9879\u76EE\u540D",
  "cli.roles.set.cloudExecutor": "roles\uFF1Acloud_executor \u8DD1\u5728 Cursor Cloud \u4E0A\uFF0C\u8BF7\u7528 cursor/<model>",
  "cli.roles.set.droppedFeatures": "\u63D0\u793A\uFF1A\u670D\u52A1\u5546\u6362\u4E86\uFF0C\u4E22\u6389\u4E86\u539F\u6765\u7684 featureValues\uFF08\u8981\u7528 --feature \u518D\u8BBE\uFF09",
  "cli.roles.set.droppedMode": "\u63D0\u793A\uFF1A\u670D\u52A1\u5546\u6362\u4E86\uFF0C\u4E22\u6389\u4E86\u539F\u6765\u7684 modeId\uFF08\u8981\u7528 --mode \u518D\u8BBE\uFF09",
  "cli.roles.set.dryRun": "\u6F14\u7EC3\uFF1A\u4EC0\u4E48\u90FD\u6CA1\u5199",
  "cli.roles.set.noPool": "roles\uFF1Aplans.json \u91CC\u6CA1\u6709\u5217\u51FA\u670D\u52A1\u5546 {provider} \u7684\u5957\u9910\uFF0C\u6CA1\u6709\u53EF\u6362\u7684\u989D\u5EA6\u6C60\uFF1B\u4EC0\u4E48\u90FD\u6CA1\u5199",
  "cli.roles.set.poolMoved": "\u63D0\u793A\uFF1A\u670D\u52A1\u5546\u6362\u4E86\uFF0C\u989D\u5EA6\u6C60 {old} -> {new}",
  "cli.roles.set.target": "roles\uFF1A\u76EE\u6807\u5FC5\u987B\u662F <provider>/<model>",
  "cli.roles.set.validationFailed": "roles\uFF1A\u68C0\u67E5\u6CA1\u8FC7\uFF0C\u4EC0\u4E48\u90FD\u6CA1\u5199\uFF08\u8981\u5F3A\u5199\u5C31\u52A0 --force\uFF09",
  "cli.roles.set.validationForced": "roles\uFF1A\u68C0\u67E5\u6CA1\u8FC7\uFF0C\u4F46\u52A0\u4E86 --force",
  "cli.roles.set.written": "\u5DF2\u5199\u5165\uFF1BPaseo \u5DF2\u91CD\u65B0\u52A0\u8F7D\uFF1B\u5907\u4EFD\u5728 {dir}",
  "cli.roles.staleDays": "roles decide stale\uFF1A--days \u5FC5\u987B >= 0",
  "cli.roles.decideUnreadable": "\u8BFB\u4E0D\u4E86 decisions.json\uFF1A{error}",
  "cli.roles.decideNotList": "decisions.json \u4E0D\u662F\u5217\u8868",
  "cli.roles.decideRaced": "\u66F4\u65B0\u65F6 decisions.json \u88AB\u6539\u4E86\uFF0C\u4EC0\u4E48\u90FD\u6CA1\u5199",
  "cli.roles.prefixed": "roles\uFF1A{message}",
  "cli.roles.unregistered": "\u672A\u767B\u8BB0",
  "cli.roles.waitedDays": "\u6302\u4E86{days}\u5929",
  "cli.roles.waitedUnknown": "\u6302\u4E86?\u5929",
  "compat.audit.agentFields": "paseo ls -g --json \u7F3A\u5C11 id\u3001cwd \u6216 name",
  "compat.audit.claudeTranscripts": "Claude \u8BB0\u5F55",
  "compat.audit.cmdFailed": "{command} \u5931\u8D25\uFF1A{error}",
  "compat.audit.codexTranscripts": "Codex \u8BB0\u5F55",
  "compat.audit.commandFailed": "\u547D\u4EE4\u5931\u8D25",
  "compat.audit.configModelMissing": "agent \u8BB0\u5F55\u6587\u4EF6\u7684 config.model \u5B57\u6BB5\u4E0D\u89C1\u4E86",
  "compat.audit.configUnreadable": "config.json \u8BFB\u4E0D\u5230\u6216\u4E0D\u662F JSON",
  "compat.audit.daemonLogUnreadable": "daemon.log \u8BFB\u4E0D\u5230",
  "compat.audit.fieldMissing": "{command} \u7F3A\u5C11 {key} \u5B57\u6BB5",
  "compat.audit.formatMismatch": "{label} \u7684\u683C\u5F0F\u5BF9\u4E0D\u4E0A",
  "compat.audit.helpNoJson": "{command} \u7684\u5E2E\u52A9\u91CC\u6CA1\u6709 --json",
  "compat.audit.labelsRoleMissing": "agent \u8BB0\u5F55\u6587\u4EF6\u7684 labels.role \u5B57\u6BB5\u4E0D\u89C1\u4E86",
  "compat.audit.noDaemonVersion": "daemon.log \u91CC\u6CA1\u6709 daemonVersion",
  "compat.audit.noProfiles": "config.json \u91CC\u6CA1\u6709 daemon.agentProfiles",
  "compat.audit.emptyRecords": "\u65B0\u4E3B\u673A\u5C1A\u65E0\u6863\u6848\u6216 agent \u5386\u53F2\uFF0C\u8DF3\u8FC7\u8BB0\u5F55\u5B57\u6BB5\u62BD\u6837\u3002",
  "compat.audit.emptyProfiles": "\u6B64\u4E3B\u673A\u5C1A\u672A\u914D\u7F6E\u6863\u6848\uFF0C\u8DF3\u8FC7\u6863\u6848\u5B57\u6BB5\u62BD\u6837\u3002",
  "compat.audit.notJson": "\u8F93\u51FA\u4E0D\u662F JSON",
  "compat.audit.notList": "{command} \u8FD4\u56DE\u7684\u4E0D\u662F\u5217\u8868",
  "compat.audit.parentMissing": "agent \u8BB0\u5F55\u6587\u4EF6\u7684 paseo.parent-agent-id \u5B57\u6BB5\u4E0D\u89C1\u4E86",
  "compat.audit.pluginError": "agent-fleet-cockpit \u7684 ERROR \u4E0D\u662F\u7A7A\u7684\uFF1A{error}",
  "compat.audit.pluginMissing": "paseo plugin ls \u91CC\u627E\u4E0D\u5230 agent-fleet-cockpit",
  "compat.audit.pluginNotRunning": "agent-fleet-cockpit \u4E0D\u662F running\uFF08\u73B0\u5728\u662F {status}\uFF09",
  "compat.audit.profileFields": "agent \u6863\u6848\u7F3A\u5C11 role\u3001provider \u6216 name",
  "compat.audit.recordKeyMissing": "agent \u8BB0\u5F55\u6587\u4EF6\u7684 {key} \u5B57\u6BB5\u4E0D\u89C1\u4E86",
  "compat.audit.recordsUnreadable": "agent \u8BB0\u5F55\u6587\u4EF6\u8BFB\u4E0D\u5230",
  "compat.audit.serverIdUnreadable": "server-id \u8BFB\u4E0D\u5230",
  "compat.audit.sessionMissing": "agent \u8BB0\u5F55\u6587\u4EF6\u7684 persistence.sessionId \u5B57\u6BB5\u4E0D\u89C1\u4E86",
  "compat.audit.startupTimeUnparsed": "daemon.log \u91CC Starting daemon worker \u7684 time \u5B57\u6BB5\u89E3\u6790\u4E0D\u4E86",
  "compat.audit.statusEmpty": "\u7A7A",
  "compat.audit.timelineTypesMissing": "\u65F6\u95F4\u7EBF\u7C7B\u578B tool_call / assistant_message / reasoning \u4E0D\u5728 SDK \u58F0\u660E\u91CC",
  "compat.audit.turnEndedMissing": "\u63D2\u4EF6\u4E8B\u4EF6 agent.turn_ended \u4E0D\u5728 SDK \u58F0\u660E\u91CC",
  "compat.script.failed": "\u517C\u5BB9\u68C0\u67E5\u5931\u8D25\uFF1A{detail}\uFF08Paseo {version}\uFF09",
  "compat.script.filesPassed": "\u8BB0\u5F55\u6587\u4EF6\u6838\u5BF9\u901A\u8FC7",
  "compat.script.livePassed": "\u547D\u4EE4\u548C\u4E8B\u4EF6\u6838\u5BF9\u901A\u8FC7",
  "compat.script.noTests": "tmp/harness \u91CC\u6CA1\u6709\u79BB\u7EBF\u6D4B\u8BD5",
  "compat.script.passed": "\u517C\u5BB9\u68C0\u67E5\u901A\u8FC7\uFF08Paseo {version}\uFF09",
  "compat.script.pluginRunning": "\u63D2\u4EF6\u5728\u8FD0\u884C",
  "compat.script.testFailed": "\u79BB\u7EBF\u6D4B\u8BD5 {name} \u6CA1\u901A\u8FC7",
  "compat.script.testPassed": "\u79BB\u7EBF\u6D4B\u8BD5\u901A\u8FC7 {name}",
  "compat.script.tscFailed": "\u7C7B\u578B\u68C0\u67E5 tsc --noEmit \u6CA1\u901A\u8FC7",
  "compat.script.tscPassed": "\u7C7B\u578B\u68C0\u67E5\u901A\u8FC7",
  "compat.script.unknownVersion": "\u672A\u77E5\u7248\u672C",
  "compat.script.untracked": "\u517C\u5BB9\u68C0\u67E5\u5931\u8D25\uFF1Atmp/harness \u91CC\u6709\u672A\u88AB git \u8DDF\u8E2A\u7684\u6D4B\u8BD5\uFF08\u7528 git add -f \u7EB3\u5165\uFF0C\u6216\u5220\u9664\uFF09\uFF1A\n{names}\n\uFF08Paseo {version}\uFF09",
  "compat.script.untrackedUnknown": "\u67E5\u4E0D\u4E86 tmp/harness \u6709\u6CA1\u6709\u672A\u8DDF\u8E2A\u7684\u6D4B\u8BD5\uFF08git ls-files \u51FA\u9519\uFF09\uFF1A{error}",
  "coupons.alerts.ask": "{lead}\uFF1A{company}\uFF0C\u7B2C {index} \u5F20\uFF08\u5171 {total} \u5F20\uFF09\uFF0C{type}\uFF0C{used}\uFF0C{gap}\uFF0C{extra}",
  "coupons.alerts.claudeExpiringKind": "Claude \u91CD\u7F6E\u5238\u5FEB\u8FC7\u671F",
  "coupons.alerts.claudeExpiringText": "\u8FD9\u5F20\u5238 {days} \u5929\u540E\u8FC7\u671F\uFF0C\u8FD8\u6CA1\u7528",
  "coupons.alerts.claudeUseNowKind": "\u73B0\u5728\u53EF\u4EE5\u53BB\u7528 Claude \u91CD\u7F6E\u5238",
  "coupons.alerts.codexExpiringText": "ChatGPT \u6709 1 \u5F20\u91CD\u7F6E\u5238{days} \u5929\u540E\u8FC7\u671F",
  "coupons.alerts.codexKind": "ChatGPT \u91CD\u7F6E\u5238",
  "coupons.alerts.gain": "\u7528\u4E86\u80FD\u591A\u51FA\u7EA6 {pct}%",
  "coupons.alerts.gainUnknown": "\u7528\u4E86\u80FD\u591A\u51FA\u591A\u5C11\u8FD8\u6CA1\u8BFB\u5230",
  "coupons.alerts.howTo": "\u5728 claude.ai \u8BBE\u7F6E \u2192 \u7528\u91CF \u2192 Reset for free \u91CC\u7528",
  "coupons.alerts.resetGapUnknown": "\u79BB\u81EA\u7136\u91CD\u7F6E\u591A\u4E45\u8FD8\u6CA1\u8BFB\u5230",
  "coupons.alerts.resetInDays": "\u79BB\u81EA\u7136\u91CD\u7F6E\u8FD8\u6709 {days} \u5929 {hours} \u5C0F\u65F6",
  "coupons.alerts.resetInHours": "\u79BB\u81EA\u7136\u91CD\u7F6E\u8FD8\u6709 {hours} \u5C0F\u65F6",
  "coupons.alerts.resetReached": "\u5DF2\u7ECF\u5230\u81EA\u7136\u91CD\u7F6E",
  "coupons.alerts.resetUnderHour": "\u79BB\u81EA\u7136\u91CD\u7F6E\u4E0D\u5230 1 \u5C0F\u65F6",
  "coupons.alerts.typeKnown": "\u7C7B\u578B\u300C{type}\u300D",
  "coupons.alerts.typeUnknown": "\u7C7B\u578B\u8FD8\u6CA1\u8BFB\u5230",
  "coupons.alerts.usedNow": "\u73B0\u5728\u5DF2\u7528 {pct}%",
  "coupons.alerts.usedUnknown": "\u5DF2\u7528\u8FD8\u6CA1\u8BFB\u5230",
  "coupons.alerts.waitingText": "{waiting}\u3002{ask}",
  "coupons.bin.captureFailed": "\u622A\u56FE\u5931\u8D25\uFF0C\u6CA1\u6709\u6309\u952E",
  "coupons.bin.chose": "\u9009\u62E9\uFF1A{phrase}",
  "coupons.bin.claudeClosed": "\u5DF2\u5173\u95ED Claude \u753B\u9762",
  "coupons.bin.claudeMissing": "\u627E\u4E0D\u5230 claude\uFF0C\u6CA1\u6709\u6253\u5F00\u753B\u9762",
  "coupons.bin.commandMissing": "PATH \u4E2D\u627E\u4E0D\u5230\u5FC5\u9700\u7684\u547D\u4EE4 {command}\u3002",
  "coupons.bin.claudeOpened": "\u5DF2\u6253\u5F00 Claude \u753B\u9762",
  "coupons.bin.codexInterrupted": "codex \u4E2D\u65AD",
  "coupons.bin.codexRequestFailed": "codex \u8BF7\u6C42\u5931\u8D25",
  "coupons.bin.codexTimeout": "codex \u8D85\u65F6",
  "coupons.bin.codexTooLong": "codex \u56DE\u590D\u8FC7\u957F",
  "coupons.bin.cursorUnclear": "\u770B\u4E0D\u6E05\u5149\u6807\uFF0C\u6CA1\u6709\u6309\u56DE\u8F66",
  "coupons.bin.fakeFileMissing": "\u7F3A\u5C11\u5047\u753B\u9762\u6587\u4EF6",
  "coupons.bin.keyFailed": "\u6309\u952E\u5931\u8D25\uFF0C\u6CA1\u6709\u6309\u56DE\u8F66",
  "coupons.bin.noNextRead": "\u6CA1\u6709\u4E0B\u4E00\u6B21\u8BFB\u6570",
  "coupons.bin.notWeeklyAnymore": "\u786E\u8BA4\u6846\u5DF2\u4E0D\u662F\u6BCF\u5468\u989D\u5EA6\uFF0C\u6CA1\u6709\u6309\u952E",
  "coupons.bin.recaptureFailed": "\u79FB\u52A8\u5149\u6807\u540E\u622A\u56FE\u5931\u8D25\uFF0C\u6CA1\u6709\u6309\u56DE\u8F66",
  "coupons.bin.redeemArgsEmpty": "\u7528\u5238\u53C2\u6570\u662F\u7A7A\u7684",
  "coupons.bin.redeemSent": "\u5DF2\u63D0\u4EA4\u7528\u5238\u8BF7\u6C42",
  "coupons.bin.screenExit": "screen \u6CA1\u6709\u6B63\u5E38\u9000\u51FA",
  "coupons.bin.screenTimeout": "screen \u8D85\u65F6",
  "coupons.bin.typed": "\u5DF2\u8F93\u5165 /limit-reset",
  "coupons.bin.unreadable": "\u770B\u4E0D\u61C2\u753B\u9762\uFF0C\u6CA1\u6709\u6309\u952E",
  "coupons.burn.back": "\u540E\u6BB5",
  "coupons.burn.banner": "Claude \u70E7\u5238\u5468\uFF08{start}\uFF5E{end}\uFF09\uFF1A\u5148\u51B2\u5230 100%\uFF0C\u5230\u9876\u540E\u7528\u5238\uFF0C\u518D\u7528\u5230 97%\u3002\u5F53\u524D\u5904\u5728{where}",
  "coupons.burn.chatgptBanner": "ChatGPT \u70E7\u5238\u4E2D\uFF1A\u8FD8\u6709 {count} \u5F20\u5238\uFF08\u6700\u65E9 {clock} \u8FC7\u671F\uFF09\uFF0C\u672C\u5468\u76EE\u6807 3.5 \u5929\u7528\u5230\u9876",
  "coupons.burn.doubleWeekAnnounce": "\u672C\u5468 Claude \u989D\u5EA6\u6709\u91CD\u7F6E\u5238\u6491\u7740\uFF0C\u6709\u79EF\u538B\u7684\u6D3B\u53EF\u4EE5\u591A\u6D3E\uFF1B\u96BE\u7684\u6D3B\u53EF\u4EE5\u7528\u66F4\u5F3A\u7684\u6A21\u578B",
  "coupons.burn.front": "\u524D\u6BB5",
  "coupons.cli.checkedOn": "\uFF0C\u4E0A\u6B21\u6838\u5BF9 {date}",
  "coupons.cli.checkedUnknown": "\uFF0C\u4E0A\u6B21\u6838\u5BF9\u65F6\u95F4\u6CA1\u6709\u767B\u8BB0",
  "coupons.cli.confirmedDaysAgo": "{days} \u5929\u524D\u786E\u8BA4",
  "coupons.cli.confirmedToday": "\u4ECA\u5929\u65E9\u4E9B\u65F6\u5019\u786E\u8BA4",
  "coupons.cli.loginWord": "\u8BF7\u767B\u5F55",
  "coupons.cli.manualClosed": "\u547D\u4EE4\u884C\u6838\u5BF9\u5DF2\u5173\uFF0C\u6309\u624B\u5DE5\u767B\u8BB0\u663E\u793A",
  "coupons.cli.manualUnseen": "\u547D\u4EE4\u884C\u67E5\u4E0D\u5230\u5238\uFF0C\u6309\u624B\u5DE5\u767B\u8BB0\u663E\u793A",
  "coupons.cli.notConfirmed": "\u8FD8\u6CA1\u786E\u8BA4\u5230",
  "coupons.cli.reasonLogin": "\u767B\u5F55\u5B57\u6837\uFF0C\u6CA1\u6709\u9009 Yes",
  "coupons.cli.reasonLookOnly": "\u53EA\u770B\u4E0D\u7528\uFF0C\u9009 No",
  "coupons.cli.reasonNotWeekly": "\u786E\u8BA4\u6846\u4E0D\u662F\u6BCF\u5468\u989D\u5EA6\uFF0C\u9009 No",
  "coupons.cli.reasonSession": "\u786E\u8BA4\u6846\u662F 5 \u5C0F\u65F6\u7A97\u53E3\uFF0C\u9009 No",
  "coupons.cli.reasonTimeout": "\u8D85\u65F6\uFF0C\u6CA1\u6709\u9009 Yes",
  "coupons.cli.reasonUnreadable": "\u770B\u4E0D\u61C2\u753B\u9762\uFF0C\u6CA1\u6709\u9009 Yes",
  "coupons.cli.reasonWeekly": "\u786E\u8BA4\u6846\u5199\u660E\u6BCF\u5468\u989D\u5EA6",
  "coupons.codex.defaultTitle": "\u91CD\u7F6E\u5238",
  "coupons.codex.excerpt": "{title} {count} \u5F20",
  "coupons.codex.gateLow": "\u5DF2\u7528 {pct}%\uFF0C\u4E0D\u5230 {min}%\uFF0C\u62D2\u7EDD\u7528\u5238",
  "coupons.codex.gateNone": "\u6CA1\u6709\u53EF\u7528\u7684\u91CD\u7F6E\u5238\uFF0C\u62D2\u7EDD\u7528\u5238",
  "coupons.codex.gateUnread": "\u6CA1\u6709\u8BFB\u5230\u5DF2\u7528\u767E\u5206\u6BD4\uFF0C\u62D2\u7EDD\u7528\u5238",
  "coupons.codexRead.initFailed": "codex initialize \u5931\u8D25",
  "coupons.codexRead.interrupted": "codex \u7528\u91CF\u8BFB\u53D6\u4E2D\u65AD",
  "coupons.codexRead.loggedOut": "codex \u505C\u5728\u767B\u5F55",
  "coupons.codexRead.readFailed": "codex \u91CD\u7F6E\u5238\u8BFB\u53D6\u5931\u8D25",
  "coupons.codexRead.refused": "\u62D2\u7EDD\u7684\u91CD\u7F6E\u5238\u547D\u4EE4",
  "coupons.codexRead.timeout": "codex \u7528\u91CF\u8BFB\u53D6\u8D85\u65F6",
  "coupons.codexRead.tooLong": "codex \u7528\u91CF\u8BFB\u53D6\u8FC7\u957F",
  "coupons.core.askLead": "\u8BF7\u95EE\u7528\u6237\u662F\u5426\u73B0\u5728\u7528\u5238",
  "coupons.core.burnCapReason": "\u5230\u9876\u4E86\uFF0C\u7B49\u7528\u5238",
  "coupons.core.cardEstimateUnknown": "\u989D\u5EA6\u5F88\u5145\u8DB3\uFF08\u5355\u5F20\u5361\u7528\u91CF\u8FD8\u6CA1\u6D4B\u51C6\uFF09",
  "coupons.core.claudeCapKind": "Claude \u5230\u9876\u4E86\uFF0C\u8BE5\u7528\u5238",
  "coupons.core.codexCapKind": "ChatGPT \u5230\u9876\u4E86\uFF0C\u8BE5\u7528\u5238",
  "coupons.core.codexExpiryKind": "ChatGPT \u5238\u5FEB\u8FC7\u671F\uFF0C\u8BE5\u7528\u5238",
  "coupons.core.dateLabel": "{m} \u6708 {d} \u65E5",
  "coupons.core.waitingConfirm": "\u7B49\u4F60\u786E\u8BA4\u7528\u5238",
  "coupons.credits.datesUnread": "credits \u671F\u9650\u8BFB\u4E0D\u5230\uFF0C\u5148\u505C\u6D3E",
  "coupons.credits.expired": "credits \u5DF2\u8FC7\u671F\uFF0C\u5148\u505C\u6D3E",
  "coupons.credits.floor": "credits \u4F59\u989D {balance}\uFF0C\u4E0D\u9AD8\u4E8E {floor}\uFF0C\u5148\u505C\u6D3E",
  "coupons.credits.line": "credits\uFF1A\u4F59\u989D {balance}{stale}\uFF0C{when}",
  "coupons.credits.lineUnread": "credits\uFF1A\u4F59\u989D\u8BFB\u4E0D\u5230\uFF0C{when}",
  "coupons.credits.overBudget": "\u672C\u5468 credits \u5DF2\u7528 {used}\uFF0C\u8D85\u8FC7\u6BCF\u5468\u9884\u7B97 {budget}\uFF0C\u5148\u505C\u6D3E",
  "coupons.credits.stale": "\uFF08\u8D85\u8FC7 1 \u5C0F\u65F6\u6CA1\u8BFB\u5230\uFF09",
  "coupons.credits.unread": "\u8BFB\u4E0D\u5230 credits\uFF0C\u5148\u505C\u6D3E",
  "coupons.credits.using": "\u5468\u989D\u5EA6\u5DF2\u7528\u5B8C\uFF0C\u6539\u7528 credits\uFF08\u4F59\u989D {balance}\uFF0C\u672C\u5468\u9884\u7B97\u7EA6 {budget}\uFF0C\u672C\u5468\u5DF2\u7528 {used}\uFF09",
  "coupons.credits.weekUnknown": "\u672C\u5468 credits \u7528\u91CF\u786E\u8BA4\u4E0D\u4E86\uFF0C\u5148\u505C\u6D3E",
  "coupons.credits.when": "{start} \u8D77\u7528\uFF0C{end} \u8FC7\u671F",
  "coupons.doubleWeek.fallback": "{head}\u3002\u515C\u5E95\u5468\u5DF2\u5F00\u59CB\uFF0C\u8FD9\u5468\u4E5F\u6309\u53CC\u500D\u6D3E",
  "coupons.doubleWeek.head": "\u8BA1\u5212\u53CC\u500D\u5468 {start}\uFF5E{mid}\uFF0C\u515C\u5E95\u5468 {mid}\uFF5E{end}",
  "coupons.doubleWeek.planned": "{head}\u3002\u8FD9\u5468\u6309\u53CC\u500D\u6D3E\uFF08\u505C\u6D3E\u7EBF 90%\uFF0C\u4F18\u5148\u6D3E\u5230\u8FD9\u91CC\uFF09",
  "coupons.doubleWeek.used": "{head}\u3002\u8FD9\u5F20\u5238\u5DF2\u7528\uFF0C\u505C\u6D3E\u7EBF\u6062\u590D 75%",
  "coupons.kind.full": "\u5168\u90E8\u6062\u590D",
  "coupons.kind.session": "\u6062\u590D 5 \u5C0F\u65F6",
  "coupons.kind.unknown": "\u6062\u590D\u6BCF\u5468\uFF0F\u7C7B\u578B\u672A\u6838\u5B9E",
  "coupons.kind.weekly": "\u6062\u590D\u6BCF\u5468",
  "coupons.line.daysLeft": "\u8FD8\u5269 {days} \u5929",
  "coupons.line.expired": "\u5DF2\u8FC7\u671F",
  "coupons.line.expiresOn": "{date}\u8FC7\u671F",
  "coupons.line.expiresToday": "\u4ECA\u5929\u8FC7\u671F",
  "coupons.line.expiryUnknown": "\u8FC7\u671F\u65E5\u672A\u77E5",
  "coupons.line.full": "\u91CD\u7F6E\u5238\uFF1A{count} \u5F20\uFF08{kind}{typeBit}\uFF09\uFF0C{date}{tail}{where}{used}{note}{pieces}",
  "coupons.line.none": "\u6CA1\u6709\u91CD\u7F6E\u5238{note}",
  "coupons.line.note": "\uFF08{note}\uFF09",
  "coupons.line.piece": "\u7B2C {n} \u5F20 {title}\uFF0C{when}",
  "coupons.line.pieceExpires": "{clock} \u8FC7\u671F",
  "coupons.line.pieces": "\u3002{pieces}",
  "coupons.line.piecesJoin": "\uFF1B",
  "coupons.line.tail": "\uFF0C{left}",
  "coupons.line.typeBit": "\uFF0C\u786E\u8BA4\u6846\uFF1A{type}",
  "coupons.line.used": "\u3002\u8FD9\u5F20\u5238\u5DF2\u7528",
  "coupons.line.where": "\uFF1B{where}",
  "coupons.page.excerpt": "\u7528\u91CF\u63A5\u53E3\u5B57\u6BB5 {key}\uFF1A{count}",
  "coupons.signals.episode": "{kind}\u3002{text}\u3002{noSelfUse} {cli}\u3002",
  "coupons.signals.noSelfUse": "AFC \u4E0D\u4F1A\u81EA\u5DF1\u7528\u5238\u3002\u7528\u6237\u540C\u610F\u540E\u518D\u8FD0\u884C bin/afc-use-coupon",
  "coupons.signals.officialKind": "ChatGPT \u521A\u88AB\u5B98\u65B9\u91CD\u7F6E",
  "coupons.signals.redUse": "{kind}\u3002{text}\u3002AFC \u4E0D\u4F1A\u4EE3\u70B9\u3002",
  "coupons.signals.suspectedKind": "Claude \u7528\u91CF\u9AA4\u964D",
  "coupons.signals.suspectedText": "Claude \u7528\u91CF\u5728\u540C\u4E00\u5468\u671F\u91CC\u6389\u4E86\u7EA6 {points} \u4E2A\u70B9\u3002\u7591\u4F3C\u5B98\u65B9\u91CD\u7F6E\u6216\u4F60\u70B9\u4E86\u5238\u3002\u8BF7\u95EE\u7528\u6237\uFF1A\u521A\u624D\u662F\u4F60\u70B9\u4E86\u5238\u5417\uFF1F",
  "coupons.signals.usedKind": "\u5DF2\u7528\u5238",
  "coupons.signals.usedText": "\u5DF2\u7528\u5238\u3002{company} \u7528\u91CF\u6389\u4E86\u7EA6 {points} \u4E2A\u70B9\u3002\u8BF7\u4E00\u5B9A\u544A\u8BC9\u7528\u6237\u3002",
  "coupons.surplus.addWorkPrefix": "\u3010\u989D\u5EA6\u63D0\u9192\xB7\u53EA\u7ED9 AFC <leader>\u3011",
  "coupons.surplus.addWorkSuffix": "\u8BF7\u5148\u62A5\u544A\u7528\u6237\u3001\u7ED9 A\uFF0FB\uFF0FC \u9009\u9879\uFF0C\u7528\u6237\u70B9\u540D\u9879\u76EE\u540E\u518D\u6D3E\uFF1B\u4E0D\u8981\u8F6C\u53D1\u7ED9\u5404\u9879\u76EE <leader>\u3002",
  "coupons.surplus.allUsable": "\uFF08{roles}\u90FD\u80FD\u7528\uFF09",
  "coupons.surplus.message": "\u70E7\u5238\u5468\u52A0\u6D3B\u3002\u4ECA\u5929\u6309\u8FDB\u5EA6\u8FD8\u80FD\u591A\u6D3E\uFF1A{parts}",
  "coupons.surplus.notice": "{prefix}{text}\u3002{suffix}",
  "coupons.surplus.official": "{name} \u521A\u88AB\u5B98\u65B9\u91CD\u7F6E\uFF0C\u591A\u51FA\u7EA6 {pct}%\uFF0C{many}",
  "coupons.surplus.officialCards": "\u6309\u8FDB\u5EA6\u4ECA\u5929\u53EF\u591A\u6D3E\u7EA6 {cards} \u5F20{roles}",
  "coupons.surplus.officialRoleJoin": "\uFF0F",
  "coupons.surplus.officialRoles": "\uFF08{roles}\uFF09",
  "coupons.surplus.partJoin": "\u3002",
  "coupons.surplus.poolCards": "{name}\uFF1A\u4ECA\u5929\u7EA6 {cards} \u5F20{share}",
  "coupons.surplus.poolUnknown": "{name}{share}\uFF1A{estimate}",
  "coupons.surplus.roleExecutor": "\u6267\u884C",
  "coupons.surplus.roleJoin": "\u3001",
  "coupons.surplus.roleReader": "\u901A\u8BFB",
  "coupons.surplus.roleReviewer": "\u5BA1\u67E5",
  "coupons.surplus.shared": "\uFF08{roles}\u5171\u7528\uFF09",
  "coupons.surplus.usable": "\uFF08{roles}\u53EF\u7528\uFF09",
  "coupons.use.claudeConfirmWeekly": "Claude\uFF1A\u770B\u786E\u8BA4\u6846\uFF0C\u53EA\u6709\u5199\u660E weekly \u624D\u786E\u8BA4",
  "coupons.use.claudeLookOnly": "Claude\uFF1A\u53EA\u770B\u786E\u8BA4\u6846\uFF0C\u4E0D\u4F7F\u7528",
  "coupons.use.codexReadFirst": "Codex\uFF1A\u5148\u8BFB\u5F20\u6570\u548C\u5DF2\u7528",
  "coupons.use.confirmed": "\u5F20\u6570\u5C11\u4E86 1\uFF0C\u7528\u91CF\u56DE\u5230\u4F4E\u4F4D",
  "coupons.use.frameEmpty": "\uFF08\u7A7A\uFF09",
  "coupons.use.frameSummary": "\u753B\u9762\u6458\u8981\uFF1A{text}",
  "coupons.use.lockRefusal": "\u5DF2\u6709\u4E00\u4E2A\u7528\u5238\u547D\u4EE4\u5728\u8FD0\u884C\u6216\u4E0A\u6B21\u5F02\u5E38\u9000\u51FA\uFF1A\u9501\u6587\u4EF6 {path}\uFF0Cpid {pid}\uFF0C\u5F00\u59CB\u4E8E {started}\u3002\u786E\u8BA4\u6CA1\u6709\u5728\u8FD0\u884C\u540E\uFF0C\u624B\u52A8\u5220\u9664\u8FD9\u4E2A\u9501\u6587\u4EF6\u518D\u91CD\u8BD5",
  "coupons.use.noCredit": "\u6CA1\u6709\u8BFB\u5230\u53EF\u7528\u7684\u5238\uFF0C\u62D2\u7EDD\u7528\u5238",
  "coupons.use.noOutcome": "\u6CA1\u6709 outcome \u5B57\u6BB5",
  "coupons.use.notConfirmed": "\u8FD8\u6CA1\u540C\u65F6\u770B\u5230\u5F20\u6570\u5C11 1 \u548C\u7528\u91CF\u56DE\u5230\u4F4E\u4F4D",
  "coupons.use.notPressed": "\u6CA1\u6709\u6309\u786E\u8BA4\u952E",
  "coupons.use.outcome": "\u8FD4\u56DE\uFF1A{outcome}",
  "coupons.use.pct": "{pct}%",
  "coupons.use.pickEarliest": "\u51C6\u5907\u7528\u6700\u65E9\u5230\u671F\u7684\u4E00\u5F20\uFF08{title}\uFF09\u3002\u5238\u7F16\u53F7\u4E0D\u5199\u5165\u65E5\u5FD7",
  "coupons.use.readAfter": "\u518D\u7528\u540E\u8BFB\u5230 {count} \u5F20\uFF0C\u5DF2\u7528 {used}",
  "coupons.use.readCount": "\u8BFB\u5230 {count} \u5F20\uFF0C\u5DF2\u7528 {used}",
  "coupons.use.refillText": "\u786E\u8BA4\u6846\u539F\u6587\uFF1A{text}",
  "coupons.use.typeLimitReset": "\u8F93\u5165 /limit-reset",
  "coupons.use.unknown": "\u672A\u77E5",
  "coupons.use.usage": "\u7528\u6CD5\uFF1Abin/afc-use-coupon <claude|codex> [--confirm-weekly]",
  "coupons.use.waitRefresh": "\u7B49\u4E0B\u4E00\u6B21\u989D\u5EA6\u5237\u65B0\u770B\u662F\u5426\u5F52\u96F6",
  "coupons.view.burnMode": "\u70E7\u5238\u6A21\u5F0F\u4E2D",
  "coupons.view.summary": "{name} {count} \u5F20\uFF0C{kind}\uFF0C{when}{note}",
  "coupons.view.summaryExpires": "{date} \u8FC7\u671F",
  "coupons.view.summaryJoin": "\uFF1B",
  "coupons.view.summaryNone": "{name} \u6CA1\u6709\u91CD\u7F6E\u5238{note}",
  "cursor.access.in": "\u5DF2\u767B\u5F55",
  "cursor.access.notChecked": "\u8FD8\u6CA1\u6838\u5BF9\u3002{caveat}",
  "cursor.access.out": "\u672A\u767B\u5F55",
  "cursor.access.partialDetail": "\u53EA\u767B\u5F55\u4E86\u4E00\u534A\uFF08\u7F3A\u7EED\u671F\u51ED\u8BC1\uFF0C\u8FC7\u671F\u4F1A\u6389\u7EBF\uFF0C\u9700\u8981\u91CD\u65B0\u767B\u5F55\uFF09\u3002{caveat}",
  "cursor.access.unknown": "\u67E5\u4E0D\u5230",
  "cursor.access.unknownDetail": "\u67E5\u4E0D\u5230\uFF08{why}\uFF09\u3002{caveat}",
  "cursor.access.whyMissing": "\u547D\u4EE4\u4E0D\u5B58\u5728",
  "cursor.access.whyTimeout": "\u8D85\u65F6",
  "cursor.access.whyUnclear": "\u8FD9\u6B21\u6CA1\u6709\u8BA4\u51FA\u767B\u5F55\u72B6\u6001",
  "cursor.api.format": "\u5B98\u65B9\u63A5\u53E3\u7684\u8FD4\u56DE\u683C\u5F0F\u53D8\u4E86",
  "cursor.api.grokDenied": "Agent sandbox \u6CA1\u6709\u6743\u9650\u8BFB",
  "cursor.api.grokFormat": "Agent sandbox \u7684\u8FD4\u56DE\u683C\u5F0F\u53D8\u4E86",
  "cursor.api.grokNetwork": "Agent sandbox \u8FD9\u4E00\u5757\u7F51\u7EDC\u5931\u8D25",
  "cursor.api.grokNotSeparate": "\u8FD9\u4EFD\u5957\u9910\u6CA1\u6709\u5355\u72EC\u7684 Agent sandbox \u989D\u5EA6",
  "cursor.api.network": "\u5B98\u65B9\u63A5\u53E3\u7F51\u7EDC\u5931\u8D25",
  "cursor.api.reconnect": "\u8FDE\u63A5\u65AD\u4E86\uFF0C\u8BF7\u91CD\u65B0\u8FDE\u63A5",
  "cursor.join.clause": "{a}\uFF1B{b}",
  "cursor.join.sentence": "{a}\u3002{b}",
  "cursor.login.alarm": "Cursor \u6CA1\u767B\u5F55\uFF08\u7248\u672C {version}\uFF09\uFF0CCursor \u6267\u884C\u5361\u4F1A\u5931\u8D25",
  "cursor.login.alertKind": "Cursor \u6CA1\u767B\u5F55",
  "cursor.login.maybeUpgrade": "{base}\u3002\u53EF\u80FD\u662F\u5347\u7EA7\u5BFC\u81F4",
  "cursor.login.notifyFailed": "{when} \u901A\u77E5\u6CA1\u53D1\u51FA\u53BB {count}/{limit}",
  "cursor.login.partialLabel": "\u53EA\u767B\u5F55\u4E86\u4E00\u534A",
  "cursor.login.partialNotice": "Cursor \u53EA\u767B\u5F55\u4E86\u4E00\u534A\uFF08\u7F3A\u7EED\u671F\u51ED\u8BC1\uFF0C\u8FC7\u671F\u4F1A\u6389\u7EBF\uFF0C\u9700\u8981\u91CD\u65B0 cursor-agent login\uFF09",
  "cursor.login.poolResume": "Cursor \u767B\u5F55\u5DF2\u6062\u590D\uFF0Ccursor \u6C60\u5DF2\u653E\u5F00",
  "cursor.login.poolStop": "cursor \u6C60\u5DF2\u505C\u6D3E",
  "cursor.login.unknownVersion": "\u67E5\u4E0D\u5230",
  "cursor.login.versionNote": "cursor-agent \u4ECE {from} \u5347\u5230 {to}",
  "cursor.token.mode": "Cursor \u767B\u5F55\u6587\u4EF6\u6743\u9650\u4E0D\u5BF9",
  "cursor.token.save": "Cursor \u767B\u5F55\u4FE1\u606F\u6CA1\u6709\u5199\u56DE\u53BB",
  "cursor.token.unreadable": "\u6682\u65F6\u8BFB\u4E0D\u5230\u767B\u5F55\u4FE1\u606F",
  "cursor.token.write": "\u767B\u5F55\u4FE1\u606F\u6CA1\u6709\u5199\u6210\uFF0C\u8BF7\u518D\u70B9\u4E00\u6B21\u300C\u8FDE\u63A5 Cursor\u300D\u3002",
  "cursor.usage.browser": "\u6D4F\u89C8\u5668\u6CA1\u6709\u6253\u5F00\u3002\u8BF7\u518D\u70B9\u4E00\u6B21\u300C\u8FDE\u63A5 Cursor\u300D\u3002",
  "cursor.usage.connectFailed": "\u8FD9\u6B21\u8FDE\u63A5\u6CA1\u6709\u5B8C\u6210\uFF0C\u8BF7\u518D\u70B9\u4E00\u6B21\u300C\u8FDE\u63A5 Cursor\u300D\u3002",
  "cursor.usage.disconnect": "\u5DF2\u65AD\u5F00 Cursor\u3002\u6B63\u5728\u6539\u7528\u547D\u4EE4\u884C\u753B\u9762\uFF1B\u5728\u90A3\u4E4B\u524D\u4E0D\u628A\u5B98\u65B9\u63A5\u53E3\u7684\u65E7\u6570\u5F53\u6210\u73B0\u5728\u7684\u989D\u5EA6\u3002",
  "cursor.usage.disconnected": "\u5DF2\u65AD\u5F00 Cursor\uFF0C\u767B\u5F55\u6587\u4EF6\u5DF2\u5220\u9664\u3002",
  "cursor.usage.loginLost": "Cursor \u5728\u8BFB\u53D6\u7528\u91CF\u4E4B\u540E\u6389\u4E86\u767B\u5F55\u3002\u81EA\u52A8\u8BFB\u53D6\u5DF2\u505C\u4E0B\uFF0C\u6CA1\u6709\u7EE7\u7EED\u767B\u5F55\u3002\u8BF7\u5728\u672C\u673A\u91CD\u65B0\u767B\u5F55 Cursor\u3002",
  "cursor.usage.loginRefused": "\u8FD9\u6B21\u6388\u6743\u6CA1\u6709\u5B8C\u6210\u3002\u53EF\u4EE5\u518D\u70B9\u300C\u8FDE\u63A5 Cursor\u300D\u3002",
  "cursor.usage.loginTimeout": "\u7B49\u4E86 5 \u5206\u949F\u8FD8\u6CA1\u6388\u6743\u5B8C\u6210\u3002\u53EF\u4EE5\u518D\u70B9\u300C\u8FDE\u63A5 Cursor\u300D\u3002",
  "cursor.usage.manual": "\u547D\u4EE4\u884C\u753B\u9762\u4E5F\u6CA1\u8BFB\u5230\uFF0C\u663E\u793A\u7684\u662F\u624B\u6284\u6570",
  "cursor.usage.noAutoOnScreen": "\u5C4F\u5E55\u91CC\u6CA1\u6709 Auto \u7684\u5DF2\u7528\u767E\u5206\u6BD4",
  "cursor.usage.noAutoPct": "\u8F93\u5165 /usage \u540E\u6CA1\u6709\u8BFB\u5230 Auto \u7684\u5DF2\u7528\u767E\u5206\u6BD4",
  "cursor.usage.noPrompt": "\u6CA1\u7B49\u5230\u8F93\u5165\u6846",
  "cursor.usage.opened": "\u5DF2\u6253\u5F00\u6D4F\u89C8\u5668\u3002\u8BF7\u5728\u9875\u9762\u91CC\u767B\u5F55\u5E76\u6388\u6743\u3002\u8FD9\u662F AFC \u81EA\u5DF1\u7684\u767B\u5F55\uFF0C\u4E0D\u4F1A\u7528\u522B\u7684\u8F6F\u4EF6\u7684\u4EE4\u724C\u3002",
  "cursor.usage.screen": "\u8FD9\u4E00\u6B21\u7528\u7684\u662F\u547D\u4EE4\u884C\u753B\u9762",
  "cursor.usage.screenNotRead": "\u547D\u4EE4\u884C\u753B\u9762\u6CA1\u6709\u8BFB\u5230",
  "cursor.usage.staleOfficial": "\u5361\u7247\u4E0A\u4ECD\u662F\u4E0A\u6B21\u6210\u529F\u7684\u5B98\u65B9\u8BFB\u6570",
  "cursor.usage.statusUnknown": "cursor-agent status \u6CA1\u6709\u786E\u8BA4\u5DF2\u767B\u5F55\uFF0C\u6CA1\u6709\u6253\u5F00\u754C\u9762",
  "cursor.usage.unlinked": "\u8FD8\u6CA1\u8FDE\u63A5 Cursor\u3002\u70B9\u300C\u8FDE\u63A5 Cursor\u300D\uFF0C\u5728\u6D4F\u89C8\u5668\u91CC\u6388\u6743\u3002\u8FD9\u662F AFC \u81EA\u5DF1\u7684\u4E00\u6B21\u767B\u5F55\u3002",
  "cursor.usage.waiting": "\u6B63\u5728\u7B49\u4F60\u5728\u6D4F\u89C8\u5668\u91CC\u6388\u6743\u3002\u6388\u6743\u5B8C\u6210\u524D\uFF0C\u989D\u5EA6\u4ECD\u6309\u539F\u6765\u7684\u529E\u6CD5\u663E\u793A\u3002",
  "daemon.crash.detailAgent": "\u6D89\u53CA\u7684 agent\uFF1A{agent}",
  "daemon.crash.detailCwd": "\u76EE\u5F55\uFF1A{cwd}",
  "daemon.crash.detailError": "{time} \u9519\u8BEF\u539F\u6587\uFF1A{message}",
  "daemon.crash.homeClause": "Paseo \u540E\u53F0\u4ECA\u5929\u5D29\u8FC7 {count} \u6B21",
  "daemon.crash.kind": "\u540E\u53F0\u5D29\u6E83",
  "daemon.crash.none24h": "\u8FC7\u53BB 24 \u5C0F\u65F6\u6CA1\u6709\u5D29\u6E83",
  "daemon.crash.none24hLast": "\u8FC7\u53BB 24 \u5C0F\u65F6\u6CA1\u6709\u5D29\u6E83\uFF08\u4E0A\u6B21 {time}\uFF09",
  "daemon.crash.notRead": "\u6CA1\u6709\u8BFB\u5230",
  "daemon.crash.noticeAgent": "\u6D89\u53CA\u7684 agent\uFF1A{agent}\u3002",
  "daemon.crash.noticeCwd": "\u76EE\u5F55\uFF1A{cwd}\u3002",
  "daemon.crash.noticeEmpty": "Paseo \u540E\u53F0\u521A\u521A\u8FDE\u7EED\u5D29\u6E83\u3002\u8BF7\u5230\u9996\u9875\u770B\u62A5\u8B66\u3002\u4E0D\u8981\u6253\u5F00\u5DE5\u4F5C\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u7684 agent\u3002",
  "daemon.crash.noticeError": "\u9519\u8BEF\u539F\u6587\uFF1A{message}\u3002",
  "daemon.crash.noticeHead": "Paseo \u540E\u53F0 10 \u5206\u949F\u5185\u5D29\u6E83\u4E86 {count} \u6B21\uFF0C\u6700\u8FD1\u4E00\u6B21 {time}\u3002",
  "daemon.crash.noticeTail": "\u8BF7\u5230\u9996\u9875\u770B\u62A5\u8B66\u3002\u4E0D\u8981\u6253\u5F00\u5DE5\u4F5C\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u7684 agent\u3002",
  "daemon.crash.today": "Paseo \u540E\u53F0\u4ECA\u5929\u5D29\u6E83 {count} \u6B21\uFF0C\u6700\u8FD1\u4E00\u6B21 {time}",
  "daemon.crash.within24h": "\u8FC7\u53BB 24 \u5C0F\u65F6\u5D29\u6E83 {count} \u6B21\uFF0C\u4ECA\u5929\u8FD8\u6CA1\u6709\uFF0C\u6700\u8FD1\u4E00\u6B21 {time}",
  "daemon.missing.checkKind": "\u5931\u76EE\u5F55\u68C0\u67E5",
  "daemon.missing.found": "\u6709 {count} \u4E2A agent \u7684\u5DE5\u4F5C\u76EE\u5F55\u4E0D\u5B58\u5728\uFF08\u53EF\u80FD\u8BA9\u540E\u53F0\u5D29\u6E83\uFF09\uFF0C\u6E05\u5355\uFF1A{path}",
  "daemon.missing.kind": "\u5DE5\u4F5C\u76EE\u5F55\u4E0D\u5B58\u5728",
  "daemon.missing.unavailable": "\u5931\u76EE\u5F55\u68C0\u67E5\u6682\u4E0D\u53EF\u7528",
  "decisions.actions.addNote": "\u8865\u5145\u4E00\u53E5\u8BDD",
  "decisions.actions.askOptions": "\u8BF7 <leader> \u6539\u6210\u9009\u9879",
  "decisions.actions.cancel": "\u53D6\u6D88",
  "decisions.actions.cancelPick": "\u53D6\u6D88\u9009\u62E9",
  "decisions.actions.change": "\u6539\u9009",
  "decisions.actions.changingNote": "\u6539\u9009\uFF1A\u4F1A\u518D\u53D1\u4E00\u6761\u901A\u77E5\u3002\u53D1\u4E0D\u51FA\u53BB\u5C31\u4FDD\u7559\u539F\u6765\u7684\u9009\u62E9\u3002",
  "decisions.actions.confirm": "\u786E\u5B9A",
  "decisions.actions.confirmPick": "\u786E\u5B9A\u9009 {letter}",
  "decisions.actions.hideNote": "\u6536\u8D77\u8F93\u5165\u6846",
  "decisions.actions.keep": "\u4E0D\u6539\u4E86",
  "decisions.actions.noOptions": "\u8FD9\u6761\u6CA1\u5199\u6210\u9009\u9879",
  "decisions.actions.noText": "\uFF08\u6CA1\u5199\u5185\u5BB9\uFF09",
  "decisions.actions.noteHint": "\u70B9\u300C\u63D0\u4EA4\u300D\u53EA\u8F6C\u7ED9 <leader>\uFF0C\u8FD9\u6761\u8FD8\u6CA1\u5B9A\u3002",
  "decisions.actions.noteHintWithOptions": "\u70B9\u300C\u63D0\u4EA4\u300D\u53EA\u8F6C\u7ED9 <leader>\uFF0C\u8FD9\u6761\u8FD8\u6CA1\u5B9A\uFF1B\u9009\u4E86\u9009\u9879\u4F1A\u4E00\u5E76\u5E26\u4E0A\u8FD9\u53E5\u8BDD\u3002",
  "decisions.actions.openSession": "\u6253\u5F00\u8FD9\u4E2A <leader> \u7684\u4F1A\u8BDD",
  "decisions.actions.openSessionLabel": "\u6253\u5F00\u8FD9\u4E2A <leader> \u7684\u4F1A\u8BDD {title}",
  "decisions.actions.pick": "\u9009 {letter}",
  "decisions.actions.pickWithText": "\u9009 {letter}\uFF1A{text}",
  "decisions.actions.reason": "\u63A8\u8350\u7406\u7531\uFF1A{reason}",
  "decisions.actions.recommended": "\u63A8\u8350",
  "decisions.actions.recommendedSuffix": "\uFF08\u63A8\u8350\uFF09",
  "decisions.actions.saving": "\u6B63\u5728\u8BB0\u4E0B\u2026",
  "decisions.actions.send": "\u63D0\u4EA4",
  "decisions.actions.sendNote": "\u63D0\u4EA4\u8FD9\u53E5\u8BDD",
  "decisions.actions.sessionMissing": "\u627E\u4E0D\u5230\u8FD9\u4E2A <leader> \u7684\u4F1A\u8BDD\uFF0C\u6253\u4E0D\u5F00",
  "decisions.actions.shelve": "\u6536\u8D77",
  "decisions.actions.shelveConfirm": "\u8FD9\u4E2A\u9879\u76EE\u6CA1\u6709 <leader>\u3002\u6536\u8D77\u8FD9\u6761\uFF1F\u4F1A\u8BB0\u4E3A\u6401\u7F6E\u3002",
  "decisions.actions.shelveNo": "\u53D6\u6D88\u6536\u8D77",
  "decisions.actions.shelveYes": "\u786E\u5B9A\u6536\u8D77",
  "decisions.actions.shelveYesLabel": "\u786E\u5B9A\u6536\u8D77\u8FD9\u6761",
  "decisions.card.chosen": "\u5DF2\u9009 {letter} \xB7 {middle} \xB7 {clock}",
  "decisions.card.chosenShort": "\u5DF2\u9009 {letter} \xB7 {clock}",
  "decisions.card.confirm": "\u9009 {letter}\uFF1F",
  "decisions.card.confirmWithText": "\u9009 {letter}\uFF1A{summary}\uFF1F",
  "decisions.card.notified": "\u5DF2\u901A\u77E5 {who}",
  "decisions.card.summary": "{count} \u4EF6\u8981\u4F60\u5B9A",
  "decisions.card.summaryBlocking": "{count} \u4EF6\u8981\u4F60\u5B9A \xB7 \u5176\u4E2D {blocking} \u4EF6\u5361\u4F4F\u5F00\u5DE5",
  "decisions.card.waitDays": "\u7B49\u4E86 {days} \u5929",
  "decisions.card.waitUnderDay": "\u7B49\u4E86\u4E0D\u5230 1 \u5929",
  "decisions.card.waitUnknown": "\u7B49\u4E86\u591A\u4E45\u4E0D\u6E05\u695A",
  "decisions.cardView.openAgent": "\u770B\u8D1F\u8D23\u7684 agent",
  "decisions.cardView.showAll": "\u5C55\u5F00\u5168\u6587",
  "decisions.cardView.showLess": "\u6536\u8D77\u5168\u6587",
  "decisions.change.badChoice": "\u6CA1\u6709\u8BA4\u51FA\u9009\u9879\uFF0C\u6CA1\u6709\u6539\u9009",
  "decisions.change.badId": "\u8FD9\u6761\u7684\u7F16\u53F7\u4E0D\u5BF9\uFF0C\u6CA1\u6709\u6539\u9009",
  "decisions.change.failed": "\u6CA1\u80FD\u6539\u9009\uFF0C{kept}\uFF1A{error}",
  "decisions.change.kept": "\u539F\u6765\u7684\u9009\u62E9\u8FD8\u8BB0\u7740",
  "decisions.change.noNewId": "\u6CA1\u62FF\u5230\u65B0\u6761\u76EE\u7684\u7F16\u53F7",
  "decisions.change.notFound": "\u6CA1\u6709\u627E\u5230\u8FD9\u6761\u5DF2\u9009\u7684\u5F85\u62CD\u677F\uFF0C\u6CA1\u80FD\u6539\u9009\uFF0C{kept}",
  "decisions.change.recordedNoLeader": "\u5DF2\u8BB0\u4E0B\uFF1A\u6539\u9009 {to}\uFF1B{noLeader}",
  "decisions.change.recordedNotified": "\u5DF2\u8BB0\u4E0B\uFF1A\u6539\u9009 {to}\uFF0C\u5DF2\u901A\u77E5 {title}",
  "decisions.change.recordedNotifyFailed": "\u5DF2\u8BB0\u4E0B\uFF1A\u6539\u9009 {to}\uFF0C\u901A\u77E5\u5931\u8D25\uFF1A{error}",
  "decisions.change.same": "\u548C\u73B0\u5728\u9009\u7684\u4E00\u6837\uFF08{from}\uFF09\uFF0C\u6CA1\u6709\u6539",
  "decisions.change.tooOld": "\u8FD9\u6761\u9009\u5B8C\u5DF2\u8D85\u8FC7 24 \u5C0F\u65F6\uFF0C\u4E0D\u80FD\u518D\u6539\u9009\uFF0C{kept}",
  "decisions.change.unfinishedNote": "\u6401\u7F6E\uFF1A\u6539\u9009\u6CA1\u5199\u5B8C\uFF0C\u81EA\u52A8\u6536\u8D77",
  "decisions.change.unreadable": "\u8BFB\u4E0D\u51FA\u539F\u6765\u9009\u7684\u662F\u54EA\u4E00\u9879\uFF0C\u6CA1\u80FD\u6539\u9009\uFF0C{kept}",
  "decisions.hanging.days": "\u6302\u4E86 {days} \u5929",
  "decisions.hanging.underDay": "\u6302\u4E86\u4E0D\u5230 1 \u5929",
  "decisions.hanging.unknown": "\u6302\u4E86\u591A\u4E45\u4E0D\u6E05\u695A",
  "decisions.list.empty": "\u76EE\u524D\u6CA1\u6709\u9700\u8981\u4F60\u51B3\u5B9A\u7684\u4E8B",
  "decisions.list.filterAll": "\u5168\u90E8 {count}",
  "decisions.list.filterOnly": "\u53EA\u770B {label}",
  "decisions.list.maintOff": "\u8FC7\u65F6\u63D0\u9192\u5173",
  "decisions.list.maintOn": "\u8FC7\u65F6\u63D0\u9192\u5F00",
  "decisions.list.maintTurnOff": "\u5173\u95ED\u8FC7\u65F6\u63D0\u9192\u548C\u81EA\u52A8\u6401\u7F6E",
  "decisions.list.maintTurnOn": "\u6253\u5F00\u8FC7\u65F6\u63D0\u9192\u548C\u81EA\u52A8\u6401\u7F6E",
  "decisions.list.overturn": "\u63A8\u7FFB",
  "decisions.list.overturnLabel": "\u63A8\u7FFB {id}",
  "decisions.list.overturning": "\u6B63\u5728\u63A8\u7FFB\u2026",
  "decisions.list.settingsHint": "\u5361\u4F4F\u5F00\u5DE5\u7684\u6392\u6700\u524D\u3002\u70B9\u9009\u9879\u6309\u94AE\u3001\u518D\u70B9\u300C\u786E\u5B9A\u300D\u5C31\u5B9A\u4E86\uFF1B\u8865\u5145\u4E00\u53E5\u8BDD\u4F1A\u8F6C\u7ED9\u8FD9\u4E2A <leader>\u3002",
  "decisions.list.shelveAll": "\u5168\u90E8\u6536\u8D77",
  "decisions.list.shelveAllCancel": "\u53D6\u6D88\u5168\u90E8\u6536\u8D77",
  "decisions.list.shelveAllConfirm": "\u786E\u8BA4\u5168\u90E8\u6536\u8D77",
  "decisions.list.shelveAllConfirmLabel": "\u786E\u8BA4\u6536\u8D77 {project} \u7684\u5168\u90E8 {count} \u6761",
  "decisions.list.shelveAllLabel": "\u5168\u90E8\u6536\u8D77 {project}",
  "decisions.list.shelving": "\u6B63\u5728\u6536\u8D77\u2026",
  "decisions.list.supervisorEmpty": "\u8FD1 7 \u5929\u6CA1\u6709 <leader> \u5148\u5B9A\u3001\u4F60\u53EF\u4EE5\u63A8\u7FFB\u7684\u4E8B",
  "decisions.list.unreadTitle": "<leader> \u6709\u65B0\u56DE\u590D",
  "decisions.maint.autoShelveNote": "\u6401\u7F6E\uFF1A\u6302\u6EE1 7 \u5929\u65E0\u4EBA\u5904\u7406\uFF08AFC \u81EA\u52A8\uFF09",
  "decisions.maint.digestHead": "\u4F60\u540D\u4E0B\u6709 {reminds} \u6761\u5F85\u62CD\u677F\u6302\u6EE1 3 \u5929\u3001{shelves} \u6761\u4ECA\u5929\u6309 7 \u5929\u89C4\u5219\u6401\u7F6E\u3002",
  "decisions.maint.legacyIdRef": "\uFF08{id}\uFF09",
  "decisions.maint.remindBlocking": "{line}\u3002\u5361\u4F4F\u5F00\u5DE5\u7684\u6761\u76EE\u4E0D\u4F1A\u81EA\u52A8\u6536\u8D77\u3002",
  "decisions.maint.remindLine": '{id} \xB7 {project} \xB7 {title} \xB7 \u6302\u4E86 {days} \u5929 \xB7 \u5EFA\u8BAE\u547D\u4EE4\uFF1Aroles decide done {id} --note "\u5DF2\u8FC7\u65F6\uFF1A\u2026"',
  "decisions.maint.shelveLine": '\u3010\u5F85\u62CD\u677F\u81EA\u52A8\u6401\u7F6E\u3011{id} \xB7 {project} \xB7 {title} \xB7 \u6302\u4E86 {days} \u5929 \xB7 \u5EFA\u8BAE\u547D\u4EE4\uFF1Aroles decide done {id} --note "{note}"',
  "decisions.meta.blocking": "\u5361\u4F4F\u5F00\u5DE5",
  "decisions.meta.deferred": "\u5148\u4E0D\u5B9A",
  "decisions.meta.maybeStale": "\u53EF\u80FD\u8FC7\u65F6",
  "decisions.note.changed": "\u7528\u6237\u5728 AFC \u9762\u677F\u6539\u9009 {choice}",
  "decisions.note.join": "{a}\u3002{b}",
  "decisions.note.picked": "\u7528\u6237\u5728 AFC \u9762\u677F\u9009 {choice}",
  "decisions.note.superseded": "\u7528\u6237\u5DF2\u628A\u8FD9\u6761\u4ECE {from} \u6539\u6210 {to}\uFF0C\u89C1 {newId}",
  "decisions.note.text": "\uFF1A{text}",
  "decisions.note.wasPicked": "\uFF08\u539F {oldId} \u9009 {from}\uFF09",
  "decisions.overturn.failed": "\u63A8\u7FFB\u5931\u8D25",
  "decisions.overturn.notice": "\u7528\u6237\u63A8\u7FFB\u4E86\uFF1A{project} \xB7 {title}\u3002{body}",
  "decisions.overturn.reopenedNotNotified": "\u5DF2\u91CD\u65B0\u6253\u5F00\u8FD9\u6761\uFF0C\u6CA1\u901A\u77E5\u5230 <leader>",
  "decisions.overturn.reopenedNotified": "\u5DF2\u91CD\u65B0\u6253\u5F00\uFF0C\u5E76\u901A\u77E5\u4E86 <leader>",
  "decisions.overturn.reopenedNotifyFailed": "\u5DF2\u91CD\u65B0\u6253\u5F00\u8FD9\u6761\uFF0C\u901A\u77E5 <leader> \u5931\u8D25\uFF1A{error}",
  "decisions.owner.none": "\u65E0 <leader>",
  "decisions.parse.bullets": "\u2022\u30FB",
  "decisions.parse.contextLead": "\u73B0\u5728|\u73B0\u72B6",
  "decisions.parse.optionsTail": "\u9009\u9879|\u8BF7\u9009\u62E9|\u8BF7\u9009",
  "decisions.parse.pick": "\u9009",
  "decisions.parse.reasonLead": "\u7406\u7531|\u56E0\u4E3A|\u539F\u56E0",
  "decisions.parse.recommend": "\u63A8\u8350",
  "decisions.parse.recommendPick": "\u9009\u62E9|\u9009",
  "decisions.parse.recorded": "\u5DF2\u8BB0\u4E0B",
  "decisions.prompt.askOptions": "\u3010\u8BF7\u8865\u9009\u9879\u3011{id}\u300C{title}\u300D\uFF1A\u7528\u6237\u770B\u4E0D\u61C2\u8FD9\u6761\uFF0C\u8BF7\u6539\u5199\u6210 A\uFF0FB\uFF0FC \u9009\u9879\u52A0\u63A8\u8350\uFF08\u7528 roles decide \u6539\u5199\u6216\u5173\u65E7\u5F00\u65B0\uFF09\uFF0C\u6539\u597D\u544A\u8BC9\u7528\u6237\u3002",
  "decisions.prompt.changed": "\u3010\u7528\u6237\u6539\u9009\u3011\u7528\u6237\u628A {oldId}\u300C{title}\u300D\u4ECE {from} \u6539\u6210 {to}\u3002{said}\u8BF7\u64A4\u9500\u6309 {from} \u505A\u7684\u5B89\u6392\uFF0C\u6539\u6309 {to} \u6267\u884C\u5E76\u6C47\u62A5\u3002",
  "decisions.prompt.decided": "\u3010\u7528\u6237\u62CD\u677F\u3011{id}\u300C{title}\u300D\uFF1A\u7528\u6237\u9009 {choice}\u3002{said}\u8BF7\u6309\u8FD9\u4E2A\u51B3\u5B9A\u6267\u884C\u5E76\u6C47\u62A5\u3002",
  "decisions.prompt.said": "{text}\u3002",
  "decisions.prompt.userComment": "\u3010\u7528\u6237\u7559\u8A00\u3011{id}\u300C{title}\u300D\uFF1A{text}\u3002\u8FD9\u6761\u4ECD\u672A\u5B9A\uFF0C\u8BF7\u56DE\u5E94\u3002",
  "decisions.proxy.item": "{project}\uFF08{code}\uFF09",
  "decisions.proxy.itemEnded": "{project}\uFF08{code}\uFF09 \u5DF2\u7ED3\u675F",
  "decisions.proxy.line": "\u53E6\u5916\u4EE3\u7BA1\uFF1A{list}",
  "decisions.proxy.listSeparator": "\u3001",
  "decisions.proxy.titleSeparators": "\xB7\u30FB",
  "decisions.reply.askFailed": "\u6CA1\u8BF7\u5230\uFF1A{error}",
  "decisions.reply.asked": "\u5DF2\u8BF7 {title} \u8865\u9009\u9879",
  "decisions.reply.badChoice": "\u6CA1\u6709\u8BA4\u51FA\u9009\u9879\uFF0C\u6CA1\u6709\u63D0\u4EA4",
  "decisions.reply.badId": "\u8FD9\u6761\u7684\u7F16\u53F7\u4E0D\u5BF9\uFF0C\u6CA1\u6709\u63D0\u4EA4",
  "decisions.reply.commentSavedNoLeader": "\u7559\u8A00\u5DF2\u8BB0\u4E0B\uFF1B{noLeader}",
  "decisions.reply.commentSavedNotifyFailed": "\u7559\u8A00\u5DF2\u8BB0\u4E0B\uFF0C\u901A\u77E5\u5931\u8D25\uFF1A{error}",
  "decisions.reply.needText": "\u8BF7\u5148\u5199\u4E00\u53E5\u8BDD",
  "decisions.reply.noLeader": "\u8FD9\u4E2A\u9879\u76EE\u6CA1\u6709 <leader>\uFF0C\u6D88\u606F\u6CA1\u6709\u53D1\u51FA",
  "decisions.reply.notOpen": "\u6CA1\u6709\u8FD9\u6761\u5F85\u62CD\u677F\uFF0C\u6216\u5B83\u5DF2\u7ECF\u5173\u6389\u4E86",
  "decisions.reply.notRecorded": "\u6CA1\u8BB0\u4E0B\uFF1A{error}",
  "decisions.reply.notifyFailed": "\u901A\u77E5\u5931\u8D25\uFF1A{error}",
  "decisions.reply.nowOwned": "\u8FD9\u4E2A\u9879\u76EE\u5DF2\u6709 <leader>\uFF0C\u8BF7\u5237\u65B0\u9762\u677F\u540E\u518D\u5904\u7406",
  "decisions.reply.passedOn": "\u5DF2\u8F6C\u7ED9 {title}\uFF0C\u8FD9\u6761\u8FD8\u6CA1\u5B9A",
  "decisions.reply.projectLeader": "\u8BE5\u9879\u76EE <leader>",
  "decisions.reply.recordedNoLeader": "\u5DF2\u8BB0\u4E0B\uFF1A\u9009 {choice}\uFF1B{noLeader}",
  "decisions.reply.recordedNotified": "\u5DF2\u8BB0\u4E0B\uFF1A\u9009 {choice}\uFF0C\u5DF2\u901A\u77E5 {title}",
  "decisions.reply.recordedNotifyFailed": "\u5DF2\u8BB0\u4E0B\uFF1A\u9009 {choice}\uFF0C\u901A\u77E5\u5931\u8D25\uFF1A{error}",
  "decisions.reply.shelveFailed": "\u6CA1\u6536\u8D77\uFF1A{error}",
  "decisions.reply.shelved": "\u5DF2\u6536\u8D77\u8FD9\u6761",
  "decisions.reply.userShelveNote": "\u6401\u7F6E\uFF1A\u7528\u6237\u5728\u9762\u677F\u6536\u8D77\uFF08\u9879\u76EE\u65E0 <leader>\uFF09",
  "decisions.source.default": "\u603B\u7BA1",
  "decisions.unowned.confirmFirst": "\u8BF7\u5148\u786E\u8BA4\u5168\u90E8\u6536\u8D77",
  "decisions.unowned.failureSeparator": "\uFF1B",
  "decisions.unowned.hint": "\u8981\u63A8\u8FDB\u5C31\u5728 Paseo \u7528\u300E\u603B\u7BA1\u300F\u6863\u6848\u7ED9\u5B83\u5F00\u4E00\u4E2A <leader>\uFF1B\u4E0D\u63A8\u8FDB\u53EF\u4EE5\u5168\u90E8\u6536\u8D77",
  "decisions.unowned.itemFailure": "{id}\uFF1A{message}",
  "decisions.unowned.notInGroup": "\u4E0D\u5C5E\u4E8E\u8FD9\u4E2A\u65E0 <leader> \u9879\u76EE",
  "decisions.unowned.shelved": "\u5DF2\u6536\u8D77 {closed} / {total} \u6761",
  "decisions.unowned.shelvedWithFailures": "\u5DF2\u6536\u8D77 {closed} / {total} \u6761\uFF1B{failures}",
  "decisions.unowned.title": "{project} \u8FD8\u6CA1\u6709 <leader>\uFF08<leader> \u53EA\u80FD\u7531\u4F60\u624B\u52A8\u5F00\uFF09",
  "decisions.view.hintDecide": "\u6709\u5B57\u6BCD\u5C31\u70B9\u5B57\u6BCD\uFF0C\u4F1A\u8BB0\u4E0B\u3002\u53EA\u5199\u4E00\u53E5\u8BDD\u53EA\u8F6C\u7ED9 <leader>\uFF0C\u8FD9\u6761\u5148\u4E0D\u5B9A\u3002\u6CA1\u6709\u5B57\u6BCD\u5C31\u8BF7 <leader> \u6539\u6210\u9009\u9879\u3002",
  "decisions.view.hintUnread": "\u70B9\u5F00\u90A3\u4E2A <leader> \u7684\u4F1A\u8BDD\u770B\u4E00\u773C\u5373\u53EF",
  "decisions.view.shelveConfirm": "\u786E\u5B9A\u628A {project} \u7684 {count} \u6761\u5168\u90E8\u6536\u8D77\uFF1F\u4F1A\u8BB0\u4E3A\u6401\u7F6E\u3002",
  "dispatch.candidateTag": "\uFF08\u5019\u9009\uFF09",
  "dispatch.clauseSeparator": "\uFF1B",
  "dispatch.effortDefault": "\u6863\u6848\u9ED8\u8BA4",
  "dispatch.lineupItem": "{name} \xB7 {family} \xB7 {model} \xB7 {effort} \xB7 {pool} \xB7 {status} \xB7 \u4ECA\u5929 {runs} \u6B21",
  "dispatch.noPool": "\u672A\u6302\u989D\u5EA6\u6C60",
  "dispatch.noProfiles": "\u8BFB\u4E0D\u5230\u6863\u6848\uFF0C\u6D3E\u6D3B\u987A\u5E8F\u5148\u4E0D\u6539",
  "dispatch.pauseMark": "\u3010\u6682\u505C\u3011",
  "dispatch.priority.auto": "\u6309\u989D\u5EA6\u81EA\u52A8",
  "dispatch.priority.line": "\u6D3E\u6D3B\u5148\u540E\uFF08{how}\uFF09\uFF1A{names}",
  "dispatch.priority.manual": "\u4F60\u4E34\u65F6\u6307\u5B9A\uFF0C\u5230 {until} \u4E3A\u6B62",
  "dispatch.priority.need": "\uFF08{need}\uFF09",
  "dispatch.priority.needFirst": "\uFF08\u6BCF\u5929\u8FD8\u8981\u7528 {need} \u70B9\uFF09",
  "dispatch.priority.unread": "\uFF08\u8BFB\u4E0D\u5230\uFF09",
  "dispatch.priority.unreadFirst": "\uFF08\u8BFB\u4E0D\u5230\u7528\u91CF\uFF09",
  "dispatch.reasonSeparator": "\uFF1A",
  "dispatch.role.batch": "\u6742\u6D3B",
  "dispatch.role.decision": "\u51B3\u7B56",
  "dispatch.role.executor": "\u6267\u884C",
  "dispatch.role.opsCloudflare": "\u8FD0\u7EF4\xB7Cloudflare",
  "dispatch.role.opsGithub": "\u8FD0\u7EF4\xB7GitHub",
  "dispatch.role.opsNotion": "\u8D44\u6599\xB7Notion",
  "dispatch.role.opsVercel": "\u8FD0\u7EF4\xB7Vercel",
  "dispatch.role.reader": "\u901A\u8BFB",
  "dispatch.role.reviewer": "\u5BA1\u67E5",
  "dispatch.role.supervisor": "<leader>",
  "dispatch.slot.batchGpt": "\u6742\u6D3B \xB7 GPT-6.1-Sol",
  "dispatch.slot.batchGrok": "\u6742\u6D3B \xB7 Grok\uFF08SuperGrok\uFF09",
  "dispatch.slot.decisionGpt": "\u51B3\u7B56 \xB7 GPT-6.1-Sol",
  "dispatch.slot.decisionGrok": "\u51B3\u7B56 \xB7 Grok\uFF08SuperGrok\uFF09",
  "dispatch.slot.executorGpt": "\u6267\u884C \xB7 GPT-6.1-Sol",
  "dispatch.slot.executorOpus": "\u6267\u884C \xB7 Opus\uFF08\u590D\u6742\u6587\u6863\u7C7B\uFF09",
  "dispatch.slot.executorSonnet": "\u6267\u884C \xB7 Sonnet\uFF08Claude\uFF09",
  "dispatch.slot.readerGpt": "\u901A\u8BFB \xB7 GPT-6.1-Sol",
  "dispatch.slot.readerGrok": "\u901A\u8BFB \xB7 Grok\uFF08SuperGrok\uFF09",
  "dispatch.slot.reviewerFable": "\u5BA1\u67E5 \xB7 Fable\uFF08\u9AD8\u98CE\u9669\uFF09",
  "dispatch.slot.reviewerGpt": "\u5BA1\u67E5 \xB7 GPT-6.1-Sol",
  "dispatch.slot.reviewerGrok": "\u5BA1\u67E5 \xB7 Grok\uFF08SuperGrok\uFF09",
  "dispatch.roleLine": "{label}\uFF1A{items}",
  "dispatch.roleLineEmpty": "{label}\uFF1A\u6CA1\u6709\u6863\u6848",
  "dispatch.spend.batch": "\u6742\u6D3B",
  "dispatch.spend.decision": "\u51B3\u7B56",
  "dispatch.spend.executor": "\u6267\u884C",
  "dispatch.spend.ops": "\u8FD0\u7EF4",
  "dispatch.spend.outside": "\u6CA1\u8FDB Paseo \u7684\u4F1A\u8BDD",
  "dispatch.spend.personal": "\u7528\u6237\u81EA\u5DF1\u7684\u5BF9\u8BDD",
  "dispatch.spend.reader": "\u901A\u8BFB",
  "dispatch.spend.reviewer": "\u5BA1\u67E5",
  "dispatch.spend.supervisor": "<leader>",
  "dispatch.status.paused": "\u6682\u505C",
  "dispatch.status.pausedBecause": "\u6682\u505C\uFF1A{reason}",
  "dispatch.status.pausedUntil": "\u6682\u505C\u5230 {when}\uFF1A{head}",
  "dispatch.status.prefer": "\u4F18\u5148\u7528",
  "dispatch.status.ready": "\u53EF\u6D3E",
  "dispatch.status.readyLater": "\u53EF\u6D3E\uFF0C\u5148\u7528\u522B\u7684",
  "dispatch.status.reviewOnly": "\u6682\u505C\uFF1A\u672C\u5468\u53EA\u6D3E\u5BA1\u67E5\uFF08\u4E34\u65F6\u4F8B\u5916\uFF09",
  "dispatch.title.docs": "\u8D44\u6599",
  "dispatch.title.ops": "\u8FD0\u7EF4",
  "dispatch.unresolvedSlotsWarning": "[afc] \u8B66\u544A\uFF1A\u6D3E\u6D3B\u69FD\u4F4D\u672A\u89E3\u6790\uFF1A{slots}\u3002\u4FDD\u7559\u5DF2\u6709\u77E9\u9635\uFF1B\u9996\u6B21\u53D1\u5E03\u4EC5\u5305\u542B\u5DF2\u89E3\u6790\u6761\u76EE\u3002",
  "doctor.age.days": "{n} \u5929",
  "doctor.age.hours": "{n} \u5C0F\u65F6",
  "doctor.age.minutes": "{n} \u5206\u949F",
  "doctor.checks.claude.configNoVersion": "\u914D\u7F6E\u6307\u5411 {command}\uFF0C\u4F46 --version \u8DD1\u4E0D\u51FA\u6765",
  "doctor.checks.claude.configOk": "\u914D\u7F6E\u6307\u5411 {command}\uFF0C\u7248\u672C {version}",
  "doctor.checks.claude.desktop": "Claude \u684C\u9762\u7248\u81EA\u5E26\u7684 Claude Code \u5728\u8DD1 {count} \u4E2A\uFF08{versions}\uFF09\uFF0C\u4E0D\u7B97\u5728\u5185",
  "doctor.checks.claude.evidenceConfig": "~/.paseo/config.json \u7684 agents.providers.claude.command",
  "doctor.checks.claude.evidenceWhich": "which -a claude\uFF08\u6309 PATH \u627E\uFF09",
  "doctor.checks.claude.noConfig": "agents.providers.claude.command \u6CA1\u6709\u8BBE\u7F6E",
  "doctor.checks.claude.noConfigSummary": "Paseo \u914D\u7F6E\u91CC\u6CA1\u5199 Claude \u547D\u4EE4",
  "doctor.checks.claude.pathDiff": "\uFF08\u914D\u7F6E\u662F {version}\uFF0C\u4E0D\u4E00\u81F4\uFF09",
  "doctor.checks.claude.pathOther": "PATH \u91CC\u53E6\u6709\u4E00\u4E2A claude\uFF1A{path} \u7248\u672C {version}{match}",
  "doctor.checks.claude.pathSame": "\uFF08\u548C\u914D\u7F6E\u4E00\u81F4\uFF09",
  "doctor.checks.claude.sessionPath": "{path}\uFF08{version}\uFF09",
  "doctor.checks.claude.sessionVersionUnknown": "\u7248\u672C\u672A\u77E5",
  "doctor.checks.claude.sessionsAwaySame": "\uFF08\u5176\u4E2D {count} \u4E2A\u8DEF\u5F84\u4E0D\u540C\u4F46\u7248\u672C\u4E00\u81F4\uFF09",
  "doctor.checks.claude.sessionsOff": "{count} \u4E2A\u6B63\u5728\u8DD1\u7684 Claude \u4F1A\u8BDD\u7528\u7684\u4E0D\u662F\u914D\u7F6E\u8DEF\u5F84\u6216\u7248\u672C\uFF08{paths}\uFF09\uFF0C\u914D\u7F6E\u662F {version}\u3002\u8001\u4F1A\u8BDD\u5C5E\u6B63\u5E38\uFF0C\u7B49\u5B83\u4EEC\u7ED3\u675F\u5C31\u597D",
  "doctor.checks.claude.sessionsOk": "{count} \u4E2A Claude \u4F1A\u8BDD\u90FD\u7528\u914D\u7F6E\u7248\u672C{detail}",
  "doctor.checks.claude.summaryOk": "Claude Code {version} \u4E00\u81F4",
  "doctor.checks.claude.summaryRed": "Paseo \u914D\u7F6E\u7684 Claude \u547D\u4EE4\u6709\u95EE\u9898",
  "doctor.checks.claude.summaryYellow": "Claude Code \u6709\u4E0D\u4E00\u81F4\u7684\u7248\u672C\u6216\u8001\u4F1A\u8BDD",
  "doctor.checks.claude.versionNotFound": "\u67E5\u4E0D\u5230",
  "doctor.checks.compat.ago": "{age}\u524D",
  "doctor.checks.compat.none": "compat-state.json \u4E0D\u5B58\u5728\u6216\u6CA1\u6709\u7ED3\u679C",
  "doctor.checks.compat.row": "{label}\uFF1A{status}{conclusion}",
  "doctor.checks.compat.rowConclusion": "\uFF08{conclusion}\uFF09",
  "doctor.checks.compat.summaryFailed": "{count} \u9879\u517C\u5BB9\u68C0\u67E5\u6CA1\u901A\u8FC7\uFF08Paseo {version}\uFF0C{when}\uFF09",
  "doctor.checks.compat.summaryNone": "\u8FD8\u6CA1\u6709\u517C\u5BB9\u68C0\u67E5\u8BB0\u5F55",
  "doctor.checks.compat.summaryOk": "\u517C\u5BB9\u68C0\u67E5\u5168\u90E8\u901A\u8FC7\uFF08Paseo {version}\uFF0C{when}\uFF09",
  "doctor.checks.compat.title": "Paseo \u517C\u5BB9\u68C0\u67E5",
  "doctor.checks.compat.whenUnknown": "\u65F6\u95F4\u672A\u77E5",
  "doctor.checks.coupons.expired": "\u5DF2\u8FC7\u671F {days} \u5929\uFF08\u8FD8\u6CA1\u7528\u6389\uFF1F\uFF09",
  "doctor.checks.coupons.expiresIn": "{days} \u5929\u540E\u8FC7\u671F",
  "doctor.checks.coupons.line": "{company}\uFF1A{count} \u5F20\uFF0C\u6700\u8FD1\u7684 {date}\uFF08{when}\uFF09{soon}",
  "doctor.checks.coupons.noExpiry": "{company}\uFF1A{count} \u5F20\uFF0C\u6CA1\u5199\u8FC7\u671F\u65E5",
  "doctor.checks.coupons.soonNote": "\uFF0C{days} \u5929\u5185\u8FC7\u671F\u6CA1\u7528",
  "doctor.checks.coupons.summaryOk": "\u5171 {total} \u5F20\u5238\uFF0C\u8FD1 {days} \u5929\u6CA1\u6709\u8981\u8FC7\u671F\u7684",
  "doctor.checks.coupons.summarySoon": "{count} \u5BB6\u7684\u5238 {days} \u5929\u5185\u8981\u8FC7\u671F",
  "doctor.checks.coupons.title": "\u91CD\u7F6E\u5238",
  "doctor.checks.coupons.zero": "{company}\uFF1A0 \u5F20",
  "doctor.checks.kanban.counts": "\u770B\u677F\u4F53\u68C0\uFF1A\u7EA2 {red} \xB7 \u9EC4 {yellow} \xB7 \u63D0\u793A {info}",
  "doctor.checks.kanban.error": "kanban doctor --last --json \u51FA\u9519\u3001\u8FD8\u6CA1\u6709\u4F53\u68C0\u8BB0\u5F55\uFF0C\u6216\u8F93\u51FA\u4E0D\u662F JSON\uFF1A{error}",
  "doctor.checks.kanban.errorSummary": "\u770B\u677F\u4F53\u68C0\u6CA1\u6709\u7ED9\u51FA\u7ED3\u679C",
  "doctor.checks.kanban.evidence": "{bin} doctor --last --json\uFF08\u53EA\u8BFB\u6700\u8FD1\u4E00\u6B21\u7ED3\u679C\uFF1B\u4E0D\u91CD\u65B0\u4F53\u68C0\uFF0C\u4E5F\u4E0D\u8986\u76D6 data/doctor-report.json\uFF09",
  "doctor.checks.kanban.missing": "{bin} \u4E0D\u5B58\u5728",
  "doctor.checks.kanban.missingSummary": "\u6CA1\u6709\u627E\u5230\u770B\u677F\u7684 doctor \u547D\u4EE4",
  "doctor.checks.kanban.noOutput": "\u65E0\u8F93\u51FA",
  "doctor.checks.kanban.stale": "\u770B\u677F\u4F53\u68C0\u8BB0\u5F55\u662F {age} \u524D\u7684\uFF0C\u770B\u677F\u81EA\u5DF1\u5E94\u6BCF 30 \u5206\u949F\u8DD1\u4E00\u6B21\uFF0C\u53EF\u80FD\u6CA1\u5728\u8DD1",
  "doctor.checks.kanban.staleNoTime": "\u770B\u677F\u4F53\u68C0\u8BB0\u5F55\u6CA1\u6709\u65F6\u95F4",
  "doctor.checks.kanban.summaryOk": "\u770B\u677F\u4F53\u68C0\u6CA1\u53D1\u73B0\u95EE\u9898",
  "doctor.checks.kanban.summaryRed": "\u770B\u677F\u4F53\u68C0\u6709 {count} \u4E2A\u7EA2",
  "doctor.checks.kanban.summaryStale": "\u770B\u677F\u4F53\u68C0\u8BB0\u5F55\u592A\u65E7",
  "doctor.checks.kanban.summaryYellow": "\u770B\u677F\u4F53\u68C0\u6709 {count} \u4E2A\u9EC4\uFF0C\u6CA1\u6709\u7EA2",
  "doctor.checks.kanban.timeout": "kanban doctor --last --json \u8D85\u65F6",
  "doctor.checks.kanban.timeoutSummary": "\u770B\u677F\u4F53\u68C0\u8D85\u65F6",
  "doctor.checks.kanban.title": "\u770B\u677F",
  "doctor.checks.listSeparator": "\u3001",
  "doctor.checks.profiles.evidenceProfiles": "~/.paseo/config.json \u7684 daemon.agentProfiles",
  "doctor.checks.profiles.familyMissing": "\u6267\u884C\uFF08{executor}\uFF09\u6216\u5BA1\u67E5\uFF08{reviewer}\uFF09\u6CA1\u5199 family",
  "doctor.checks.profiles.familyNoMain": "\u627E\u4E0D\u5230\u6267\u884C\u6216\u5BA1\u67E5\u7684\u4E3B\u6863\u6848\uFF0C\u6CA1\u6CD5\u6838\u5BF9\u662F\u4E0D\u662F\u4E0D\u540C\u5BB6",
  "doctor.checks.profiles.familyOk": "\u6267\u884C\uFF08{executor}\uFF09\u548C\u5BA1\u67E5\uFF08{reviewer}\uFF09\u4E3B\u6863\u6848\u4E0D\u540C\u5BB6",
  "doctor.checks.profiles.familySame": "\u6267\u884C\u548C\u5BA1\u67E5\u7684\u4E3B\u6863\u6848\u540C\u4E00\u5BB6\uFF08\u90FD\u662F {family}\uFF09",
  "doctor.checks.profiles.label": "{name}\uFF08{provider}/{model}\uFF09",
  "doctor.checks.profiles.modelMissing": "{label}\uFF1A\u6A21\u578B\u4E0D\u5728 {provider} \u7684\u5217\u8868\u91CC",
  "doctor.checks.profiles.modelOk": "{label}\uFF1A\u6A21\u578B\u5728\u5217\u8868\u91CC",
  "doctor.checks.profiles.noModels": "{label}\uFF1A\u67E5\u4E0D\u5230 {provider} \u7684\u6A21\u578B\u5217\u8868\uFF0C\u6CA1\u6CD5\u6838\u5BF9",
  "doctor.checks.profiles.noProvider": "{label}\uFF1APaseo \u91CC\u6CA1\u6709 {provider} \u8FD9\u4E2A\u670D\u52A1",
  "doctor.checks.profiles.none": "\u6CA1\u6709\u8BFB\u5230\u4EFB\u4F55\u6863\u6848",
  "doctor.checks.profiles.paused": "{label}\uFF1A\u4E0D\u6D3E\uFF08{pool} \u989D\u5EA6\u6C60\u6682\u505C\uFF0C\u4E0D\u7B97\u9519\uFF09",
  "doctor.checks.profiles.providerOff": "{label}\uFF1A{provider} \u670D\u52A1\u88AB\u5173\u6389\u4E86\uFF0C\u8FD9\u4E2A\u6863\u6848\u6D3E\u4E0D\u51FA\u53BB",
  "doctor.checks.profiles.providersUnreadable": "\u8BFB\u4E0D\u5230 paseo provider ls\uFF0C\u6A21\u578B\u6CA1\u6838\u5BF9",
  "doctor.checks.profiles.summaryAllOk": "\u6A21\u578B\u90FD\u5728\u5217\u8868\u91CC",
  "doctor.checks.profiles.summaryBad": "{count} \u4E2A\u6709\u95EE\u9898",
  "doctor.checks.profiles.summaryChecked": "\u6838\u5BF9\u4E86 {count} \u4E2A\u6863\u6848\uFF08\u542B\u5019\u9009\uFF09\uFF1A{result}{idle}",
  "doctor.checks.profiles.summaryIdle": "\uFF0C{count} \u4E2A\u4E0D\u6D3E",
  "doctor.checks.profiles.summaryNone": "\u8BFB\u4E0D\u5230\u6863\u6848\uFF08~/.paseo/config.json\uFF09",
  "doctor.checks.profiles.summaryUnchecked": "\u8BFB\u4E0D\u5230\u670D\u52A1\u5217\u8868\uFF08paseo provider ls\uFF09\uFF0C{count} \u4E2A\u6863\u6848\u7684\u6A21\u578B\u6CA1\u6838\u5BF9",
  "doctor.checks.profiles.title": "\u6863\u6848\u548C\u6A21\u578B",
  "doctor.checks.quota.age": "generatedAt {at}\uFF08{age} \u524D\uFF1B\u8D85 {yellowMin} \u5206\u949F\u9EC4\u3001\u8D85 {redHours} \u5C0F\u65F6\u7EA2\uFF09",
  "doctor.checks.quota.fresh": "\u989D\u5EA6\u8BFB\u6570\u662F {age} \u524D\u7684\uFF0C\u591F\u65B0",
  "doctor.checks.quota.missing": "pool-status.json \u4E0D\u5B58\u5728\u6216\u8BFB\u4E0D\u51FA\u6765",
  "doctor.checks.quota.missingSummary": "\u8BFB\u4E0D\u5230\u989D\u5EA6\u5FEB\u7167 pool-status.json",
  "doctor.checks.quota.noTime": "pool-status.json \u91CC\u6CA1\u6709 generatedAt",
  "doctor.checks.quota.noTimeSummary": "\u989D\u5EA6\u5FEB\u7167\u6CA1\u6709\u65F6\u95F4\uFF0C\u4E0D\u77E5\u9053\u65B0\u4E0D\u65B0",
  "doctor.checks.quota.pool": "{name}\uFF1A\u5DF2\u7528 {used} \xB7 {verdict}",
  "doctor.checks.quota.stale": "\u989D\u5EA6\u8BFB\u6570\u5DF2\u7ECF {age} \u6CA1\u66F4\u65B0",
  "doctor.checks.quota.title": "\u989D\u5EA6\u8BFB\u6570",
  "doctor.checks.quota.verdictBlocked": "\u4E0D\u53EF\u6D3E",
  "doctor.checks.quota.verdictOk": "\u53EF\u6D3E",
  "doctor.checks.quota.verdictPaused": "\u4E0D\u6D3E\uFF08\u6682\u505C\uFF09",
  "doctor.checks.residue.none": "{workspaces} \u4E2A\u5DE5\u4F5C\u533A\u3001{projects} \u4E2A\u9879\u76EE\uFF0C\u6CA1\u6709\u653E\u5728 /tmp \u4E0B\u7684",
  "doctor.checks.residue.project": "\u9879\u76EE {name} \u5728 {path}",
  "doctor.checks.residue.summaryFound": "{count} \u4E2A\u5DE5\u4F5C\u533A\uFF0F\u9879\u76EE\u7684\u76EE\u5F55\u5728 /tmp \u4E0B\uFF0C\u591A\u534A\u662F\u6D4B\u8BD5\u7559\u4E0B\u7684",
  "doctor.checks.residue.summaryNone": "\u6CA1\u6709\u7559\u5728 /tmp \u7684\u5DE5\u4F5C\u533A\u6216\u9879\u76EE",
  "doctor.checks.residue.title": "\u6D4B\u8BD5\u6B8B\u7559",
  "doctor.checks.residue.workspace": "\u5DE5\u4F5C\u533A {name}\uFF08\u9879\u76EE {project}\uFF09\u5728 {cwd}",
  "doctor.checks.schedules.failed": "{label}\uFF1A\u6700\u8FD1\u4E00\u6B21\uFF08{at}\uFF09{status}{error}",
  "doctor.checks.schedules.failedError": "\uFF1A{error}",
  "doctor.checks.schedules.inactive": "{label}\uFF1A{status}\uFF08\u53EA\u5217\u51FA\uFF09",
  "doctor.checks.schedules.label": "{name}\uFF08{id}\uFF09",
  "doctor.checks.schedules.logsError": "{label}\uFF1A\u8BFB\u4E0D\u5230\u8FD0\u884C\u8BB0\u5F55\uFF08{error}\uFF09",
  "doctor.checks.schedules.neverRan": "{label}\uFF1A\u8FD8\u6CA1\u8DD1\u8FC7",
  "doctor.checks.schedules.ok": "{label}\uFF1A\u6700\u8FD1\u4E00\u6B21 {status}\uFF08{at}\uFF09",
  "doctor.checks.schedules.paused": "\u5DF2\u6682\u505C",
  "doctor.checks.schedules.summaryFailed": "{count} \u4E2A\u5B9A\u65F6\u4EFB\u52A1\u6700\u8FD1\u4E00\u6B21\u5931\u8D25\u4E86",
  "doctor.checks.schedules.summaryInactive": "\uFF08{count} \u4E2A\u6682\u505C\u6216\u8FC7\u671F\uFF09",
  "doctor.checks.schedules.summaryNone": "\u6CA1\u6709\u5B9A\u65F6\u4EFB\u52A1",
  "doctor.checks.schedules.summaryOk": "{count} \u4E2A\u5B9A\u65F6\u4EFB\u52A1\uFF0C\u6700\u8FD1\u4E00\u6B21\u90FD\u6CA1\u5931\u8D25{inactive}",
  "doctor.checks.schedules.title": "\u5B9A\u65F6\u4EFB\u52A1",
  "doctor.checks.schedules.unknown": "{label}\uFF1A\u6700\u8FD1\u4E00\u6B21\u72B6\u6001 {status}\uFF0C\u4E0D\u8BA4\u8BC6",
  "doctor.checks.services.available": "{label}\uFF1A\u53EF\u7528",
  "doctor.checks.services.down": "{label}\uFF1A\u5F00\u7740\u4F46 {status}\uFF0C\u8FDE\u4E0D\u4E0A",
  "doctor.checks.services.evidenceLog": "~/.paseo/daemon.log\uFF08\u53CA\u6700\u8FD1\u8F6C\u5B58\u7684 *-daemon.log\uFF09",
  "doctor.checks.services.label": "{label}\uFF08{provider}\uFF09",
  "doctor.checks.services.logProblem": "\u8BFB\u4E0D\u5230 daemon.log\uFF0C\u4E0D\u77E5\u9053\u6709\u6CA1\u6709\u53CD\u590D\u8D85\u65F6\uFF1A{problem}",
  "doctor.checks.services.none": "paseo provider ls \u6CA1\u6709\u8FD4\u56DE\u4EFB\u4F55\u670D\u52A1",
  "doctor.checks.services.off": "{label}\uFF1A\u5DF2\u5173\u95ED\uFF08\u53EA\u5217\u51FA\uFF0C\u4E0D\u7B97\u9519\uFF09",
  "doctor.checks.services.summaryBad": "{count} \u4E2A\u670D\u52A1\u6709\u95EE\u9898",
  "doctor.checks.services.summaryNoLog": "{count} \u4E2A\u670D\u52A1\u770B\u8D77\u6765\u6B63\u5E38\uFF0C\u4F46\u8BFB\u4E0D\u5230 daemon.log\uFF0C\u8D85\u65F6\u6CA1\u6838\u5BF9",
  "doctor.checks.services.summaryNone": "\u8BFB\u4E0D\u5230\u670D\u52A1\u5217\u8868\uFF08paseo provider ls\uFF09",
  "doctor.checks.services.summaryOk": "{count} \u4E2A\u670D\u52A1\uFF1A{on} \u4E2A\u5F00\u7740\u90FD\u6B63\u5E38\uFF0C{off} \u4E2A\u5DF2\u5173\u95ED",
  "doctor.checks.services.timeout": "{name}\uFF1A\u6700\u8FD1 {window} \u5206\u949F\u540E\u53F0\u5237\u65B0\u8D85\u65F6 {count} \u6B21{extra}",
  "doctor.checks.services.timeoutRed": "\uFF08\u2265{limit} \u6B21\uFF0C\u4F1A\u53CD\u590D\u5F39\u767B\u5F55\uFF09",
  "doctor.checks.services.title": "\u670D\u52A1\u72B6\u6001",
  "doctor.checks.services.unknownService": "\u672A\u77E5\u670D\u52A1",
  "doctor.cli.crashed": "afc-doctor \u81EA\u5DF1\u51FA\u9519\u4E86\uFF1A",
  "doctor.daily.line": "- {title}\uFF1A{text}",
  "doctor.daily.more": "- \u53E6\u6709 {count} \u6761\u7EA2\uFF0C\u89C1\u9762\u677F\u300C\u6743\u9650\u300D\u9875\u7684\u300C\u4F53\u68C0\u300D",
  "doctor.daily.notice": "\u3010AFC \u6BCF\u65E5\u4F53\u68C0 {day}\u3011\u6709 {count} \u6761\u7EA2\uFF0C\u8BF7 <leader> \u770B\u4E00\u4E0B\uFF08\u9762\u677F\u300C\u6743\u9650\u300D\u9875\u70B9\u300C\u4F53\u68C0\u300D\u53EF\u770B\u5168\u90E8\uFF1B\u547D\u4EE4\u884C\uFF1Abin/afc-doctor\uFF09\uFF1A\n{lines}",
  "doctor.panel.button": "\u4F53\u68C0",
  "doctor.panel.cardLabel": "\u4F53\u68C0 {title} {status}",
  "doctor.panel.detailCount": "{count} \u6761",
  "doctor.panel.details": "\u660E\u7EC6",
  "doctor.panel.evidence": "\u8BC1\u636E\uFF1A{line}",
  "doctor.panel.failed": "\u4F53\u68C0\u5931\u8D25\uFF1A{error}",
  "doctor.panel.intro": "\u4E00\u952E\u770B\u5168\uFF1A\u989D\u5EA6\u3001\u6863\u6848\u3001\u670D\u52A1\u3001Claude Code\u3001\u6B8B\u7559\u3001\u5B9A\u65F6\u4EFB\u52A1\u3001\u517C\u5BB9\u3001\u5238\u3001\u770B\u677F\uFF08\u53EA\u8BFB\uFF09",
  "doctor.panel.noDetails": "\u6CA1\u6709\u660E\u7EC6",
  "doctor.panel.ranAt": "\u4F53\u68C0\u4E8E {ago}\uFF1A\u7EA2 {red} \xB7 \u9EC4 {yellow} \xB7 \u7EFF {green}",
  "doctor.panel.running": "\u6B63\u5728\u4F53\u68C0\u2026",
  "doctor.server.countFailed": "\u6570\u4E0D\u4E86 {dir}/{name} \u91CC\u7684\u8D85\u65F6\uFF1A{error}",
  "doctor.server.crashFinding": "\u67E5\u4E0D\u51FA\uFF1A{message}",
  "doctor.server.crashSummary": "\u67E5\u4E0D\u51FA\uFF1A\u8FD9\u4E00\u9879\u68C0\u67E5\u672C\u8EAB\u51FA\u9519\u4E86\uFF08{message}\uFF09",
  "doctor.server.daemonLogMissing": "{dir}/daemon.log \u4E0D\u5B58\u5728",
  "doctor.server.daemonLogUnreadable": "\u8BFB\u4E0D\u4E86 {dir}/daemon.log",
  "doctor.server.listDirFailed": "\u8BFB\u4E0D\u4E86\u76EE\u5F55 {dir}\uFF1A{error}",
  "doctor.server.notJson": "\u8F93\u51FA\u4E0D\u662F JSON",
  "doctor.server.residueUnreadable": "paseo workspace ls\uFF0Fproject ls \u6CA1\u6709\u8FD4\u56DE JSON",
  "doctor.server.residueUnreadableSummary": "\u8BFB\u4E0D\u5230\u5DE5\u4F5C\u533A\u6216\u9879\u76EE\u5217\u8868",
  "doctor.server.schedulesUnreadable": "paseo schedule ls \u6CA1\u6709\u8FD4\u56DE JSON",
  "doctor.server.schedulesUnreadableSummary": "\u8BFB\u4E0D\u5230\u5B9A\u65F6\u4EFB\u52A1\u5217\u8868",
  "doctor.status.green": "\u7EFF",
  "doctor.status.red": "\u7EA2",
  "doctor.status.yellow": "\u9EC4",
  "doctor.table.compact": "\uFF08\u5171 {total} \u6761\uFF0C{hidden} \u6761\u6B63\u5E38\u6CA1\u5217\u51FA\uFF0C\u52A0 --json \u770B\u5168\u90E8\uFF09",
  "doctor.table.counts": "\u7EA2 {red} \xB7 \u9EC4 {yellow} \xB7 \u7EFF {green}",
  "doctor.table.evidence": "\u8BC1\u636E\uFF1A{evidence}",
  "doctor.table.header": "AFC \u4F53\u68C0 {at}\uFF08\u7528\u65F6 {seconds} \u79D2\uFF09",
  "earlyReset.couponNone": "\u8FD9\u4E2A\u5957\u9910\u6CA1\u6709\u4F1A\u6539\u91CD\u7F6E\u65F6\u95F4\u7684\u5238\uFF0C\u6240\u4EE5\u4E0D\u662F\u7528\u5238\u3002",
  "earlyReset.couponShifting": "\u5238\u6570\u6CA1\u51CF\u5C11\uFF08\u8FD8\u662F {count} \u5F20\uFF09\uFF0C\u4E5F\u6CA1\u6709 afc-use-coupon \u8BB0\u5F55\uFF0C\u6240\u4EE5\u4E0D\u662F\u7528\u5238\u3002",
  "earlyReset.line": "{date} \u5B98\u65B9\u63D0\u524D\u91CD\u7F6E\uFF08\u4E0D\u662F\u7528\u5238\uFF09",
  "earlyReset.notice": "{name} \u7EA6 {at} \u88AB\u5B98\u65B9\u63D0\u524D\u91CD\u7F6E\uFF1A\u7528\u91CF {before}% \u2192 {after}%\uFF0C\u91CD\u7F6E\u65F6\u95F4 {beforeReset} \u2192 {afterReset}\u3002{coupon}\u6D3E\u6D3B\u5148\u540E\u5DF2\u6309\u65B0\u7684\u989D\u5EA6\u81EA\u52A8\u91CD\u6392\u3002\u8BF7\u544A\u8BC9\u7528\u6237\u3002",
  "grok.diff.line": "{at} \u547D\u4EE4\u884C {cli} \u4E0E Paseo {paseo} \u5DEE {diff} \u70B9",
  "grok.diff.lineStuck": "{at} \u547D\u4EE4\u884C {cli} \u4E0E Paseo {paseo} \u5DEE {diff} \u70B9\uFF08Paseo \u7591\u4F3C\u5361\u4F4F\uFF09",
  "grok.source.cli": "\u547D\u4EE4\u884C {pct}",
  "grok.source.cliAt": "\u547D\u4EE4\u884C {pct}\uFF08{when}\uFF09",
  "grok.source.paseoStuckUnused": "Paseo {pct}\uFF0C\u7591\u4F3C\u5361\u4F4F\uFF0C\u6CA1\u6709\u7528",
  "grok.source.withPaseoStuck": "{head} \xB7 Paseo {pct}\uFF0C\u7591\u4F3C\u5361\u4F4F",
  "grok.usage.copiedAt": "{alarm}\uFF08\u624B\u6284\u4E8E {at}\uFF09",
  "grok.usage.loginLost": "\u8BFB\u53D6 SuperGrok \u7528\u91CF\u4E4B\u540E\uFF0Cgrok models \u4E0D\u518D\u663E\u793A\u5DF2\u767B\u5F55\u3002\u753B\u9762\u5DF2\u9000\u51FA\uFF0C\u6CA1\u6709\u6309\u522B\u7684\u952E\uFF0C\u4E5F\u6CA1\u6709\u767B\u5F55\u3002",
  "grok.usage.modelsOut": "grok models \u6CA1\u6709\u663E\u793A\u5DF2\u767B\u5F55\uFF0C\u6CA1\u6709\u6253\u5F00\u7528\u91CF\u753B\u9762",
  "grok.usage.modelsUnknown": "grok models \u6CA1\u6709\u786E\u8BA4\u5DF2\u767B\u5F55\uFF0C\u6CA1\u6709\u6253\u5F00\u7528\u91CF\u753B\u9762",
  "grok.usage.noPct": "\u8F93\u5165 /usage show \u540E\u6CA1\u6709\u8BFB\u5230\u6BCF\u5468\u5DF2\u7528\u767E\u5206\u6BD4",
  "grok.usage.noPrompt": "\u6CA1\u7B49\u5230\u8F93\u5165\u6846\uFF0C\u6CA1\u6709\u8F93\u5165 /usage show",
  "grok.usage.stuckAlarm": "SuperGrok \u7684 Paseo \u8BFB\u6570\u7591\u4F3C\u5361\u4F4F\uFF08\u5DF2 {hours} \u5C0F\u65F6\u4E0D\u53D8\uFF0C\u671F\u95F4\u6709\u6D3E\u6D3B\uFF09\uFF0C\u6CA1\u6709\u547D\u4EE4\u884C\u8BFB\u6570\uFF0C\u8BF7\u5728 grok \u91CC /usage show \u624B\u6284",
  "grok.usage.unreadAlarm": "SuperGrok \u7528\u91CF\u8BFB\u4E0D\u5230 {hours} \u5C0F\u65F6\uFF0C\u8BF7\u5728 grok \u91CC /usage show \u624B\u6284",
  "home.alerts.none": "\u6CA1\u6709\u8981\u9A6C\u4E0A\u770B\u7684\u62A5\u8B66",
  "home.alerts.other": "\u5176\u4ED6\u63D0\u9192",
  "home.banner.collapseLabel": "\u6536\u8D77\u70E7\u5238\u6A2A\u5E45\uFF1A{banner}",
  "home.banner.expandLabel": "\u5C55\u5F00\u70E7\u5238\u6A2A\u5E45\uFF1A{banner}",
  "home.card.a11y": "{title}\uFF0C\u6253\u5F00{tab}",
  "home.card.decisions": "\u5F85\u4F60\u62CD\u677F",
  "home.card.leaders": "\u5404\u9879\u76EE <leader>",
  "home.card.quota": "\u5404\u5BB6\u989D\u5EA6",
  "home.card.waiting": "\u5361\u4F4F\uFF0F\u5F85\u9A8C\u6536",
  "home.collapse": "\u6536\u8D77",
  "home.compat.check": "\u7ACB\u5373\u68C0\u67E5\u4E09\u4E2A\u63D2\u4EF6",
  "home.compat.starting": "\u6B63\u5728\u53D1\u8D77\u2026",
  "home.dot.a11y": "{code}\uFF0C{context}\uFF0C{status}\uFF0C{lamp}",
  "home.dot.normal": "\u6B63\u5E38",
  "home.dot.paused": "{code} \u6682\u505C",
  "home.dot.pausedA11y": "{code}\uFF0C\u6682\u505C",
  "home.expand": "\u5C55\u5F00",
  "home.leader.summary": "{waiting} \u4E2A <leader> \u5728\u7B49\u4F60 \xB7 {acceptance} \u5F20\u5361\u7B49\u9A8C\u6536 \xB7 {blocked} \u5F20\u5361\u5361\u4F4F",
  "home.leader.unresponsive": " \xB7 {count} \u4E2A\u65E0\u54CD\u5E94",
  "home.noLeaders": "\u8FD8\u8BFB\u4E0D\u5230\u767B\u8BB0",
  "home.noQuota": "\u8FD8\u8BFB\u4E0D\u5230\u989D\u5EA6",
  "home.paused.label": "{project} \xB7 \u5DF2\u6682\u505C",
  "home.paused.since": "{date} \u8D77",
  "home.paused.sinceSuffix": "\uFF08{since}\uFF09",
  "home.status.allClear": "\u4E00\u5207\u6B63\u5E38\uFF0C\u6CA1\u6709\u8981\u4F60\u5904\u7406\u7684\u4E8B",
  "home.status.blocking": "\u6709 {count} \u4EF6\u4E8B\u5361\u4F4F\u7B49\u4F60\u5B9A",
  "home.status.clauseSep": "\uFF1B",
  "home.status.commaSep": "\uFF0C",
  "home.status.problems": "{count} \u4E2A\u95EE\u9898\uFF08{where}\uFF09",
  "home.status.relaxed": "\u53E6\u6709 {count} \u4EF6\u53EF\u4EE5\u6162\u6162\u5B9A",
  "home.status.seeBelow": "\u89C1\u4E0B\u65B9\u300E\u8981\u4F60\u505A\u7684\u300F",
  "home.status.seeLeader": "\u89C1 Leader\u300E\u8981\u4F60\u505A\u7684\u300F",
  "home.status.thenProblem": "{line}\u3002{problem}",
  "home.status.unread": "{count} \u4E2A <leader> \u6709\u65B0\u56DE\u590D\u4F60\u8FD8\u6CA1\u770B",
  "home.summary.cards": "{count} \u5F20",
  "home.summary.decisions": "{count} \u4EF6",
  "home.summary.kanbanUnreadable": "\u770B\u677F\u6682\u65F6\u8BFB\u4E0D\u5230",
  "home.summary.newReplies": " \xB7 {count} \u4E2A\u65B0\u56DE\u590D",
  "home.tokens.byWho": "\u8FD1 7 \u5929\uFF0C\u6309\u8C01\u5728\u7528",
  "home.tokens.last7Days": "\u8FD1 7 \u5929",
  "home.tokens.noShares": "\u8FD8\u5206\u4E0D\u51FA\u5404\u89D2\u8272\u5360\u591A\u5C11",
  "home.tokens.none": "\u8FD1 7 \u5929\u8FD8\u6CA1\u6709 token \u7EDF\u8BA1",
  "home.tokens.poolLast7Days": "{pool} \xB7 \u8FD1 7 \u5929",
  "home.tokens.title": "Token \u7528\u4E86\u591A\u5C11",
  "home.unregistered": "\u5C1A\u672A\u767B\u8BB0 <leader> \u7684\u4E8B\u9879",
  "i18n.languageName": "\u7B80\u4F53\u4E2D\u6587",
  "insights.sandboxAgentsReadFailed": "\u8BFB\u53D6 Agent sandbox \u5217\u8868\u5931\u8D25\uFF1A{error}",
  "insights.modelsReadFailed": "\u8BFB\u53D6\u6A21\u578B\u5217\u8868\u5931\u8D25\uFF1A{error}",
  "insights.prReadFailed": "\u8BFB\u53D6 GitHub PR \u5931\u8D25\uFF1A{error}",
  "insights.verdict.approve": "\u53EF\u63A8\u9001|\u53EF\u4EE5\u5408\u5E76|\u9A8C\u6536\u901A\u8FC7|\u5BA1\u67E5\u901A\u8FC7",
  "insights.verdict.changes": "\u9700\u8981\u4FEE\u6539|\u9700\u4FEE\u6539|\u6253\u56DE|\u4E0D\u901A\u8FC7",
  "insights.verdict.issueList": "\u95EE\u9898\u6E05\u5355",
  "insights.verdict.none": "\u65E0",
  "kanban.blockedKind.dependency": "\u7B49\u524D\u7F6E",
  "kanban.blockedKind.quota": "\u989D\u5EA6\u4E0D\u8DB3",
  "kanban.blockedKind.transient": "\u4E34\u65F6\u6545\u969C",
  "kanban.column.acceptance": "\u5F85\u9A8C\u6536",
  "kanban.column.blocked": "\u5361\u4F4F",
  "kanban.column.inReview": "\u5F85\u5BA1\u67E5",
  "kanban.column.ready": "\u53EF\u5F00\u5DE5",
  "kanban.column.reviewing": "\u5BA1\u67E5\u4E2D",
  "kanban.column.rework": "\u8FD4\u5DE5",
  "kanban.column.running": "\u8FDB\u884C\u4E2D",
  "kanban.column.triage": "\u5F85\u5206\u62E3",
  "kanban.dbReadFailed": "\u8BFB\u53D6 kanban.db \u5931\u8D25\uFF0C\u672C\u8F6E\u4E0D\u5F52\u6863\uFF1A{error}",
  "kanban.dbUnopenable": "kanban.db \u6253\u4E0D\u5F00\uFF0C\u672C\u8F6E\u4E0D\u5F52\u6863",
  "kanban.missingCardColumns": "\u7F3A\u5C11\u5361\u7247\u5B57\u6BB5",
  "kanban.readFailed": "\u8BFB\u53D6 Paseo Kanban \u5931\u8D25\uFF1A{error}",
  "kanban.unreadableWithError": "\u770B\u677F\u6682\u65F6\u8BFB\u4E0D\u5230\uFF1A{error}",
  "kanban.view.noneWaiting": "\u6CA1\u6709\u5728\u7B49\u6216\u6302\u4F4F\u7684\u5361",
  "kanban.view.queueUnavailable": "\u8FD8\u8BFB\u4E0D\u5230\u5728\u7B49\u7684\u5361",
  "kanban.view.unavailable": "\u8FD8\u8BFB\u4E0D\u5230\u770B\u677F\uFF08\u63D2\u4EF6\u672A\u88C5\u6216\u8FD8\u6CA1\u6709\u5361\u7247\uFF09\u3002",
  "keychain.alert.authKind": "\u672A\u767B\u5F55",
  "keychain.alert.authText": "\u8FC7\u53BB 24 \u5C0F\u65F6 {count} \u4E2A Claude \u4F1A\u8BDD\u56E0\u672A\u767B\u5F55\u6CA1\u5F00\u8D77\u6765",
  "keychain.alert.cursorUnlinked": "Cursor \u672A\u8FDE\u63A5",
  "keychain.alert.emptyRun": "{name} \u56E0\u672A\u767B\u5F55\u7A7A\u8DD1\uFF0C\u6CA1\u6709\u81EA\u52A8\u91CD\u8DD1",
  "keychain.alert.kind": "\u94A5\u5319\u4E32",
  "keychain.alert.rerun": "\u5DF2\u81EA\u52A8\u91CD\u8DD1 {name}",
  "keychain.alert.scheduleKind": "\u5B9A\u65F6\u4EFB\u52A1",
  "keychain.alert.stillOut": "{name} \u91CD\u8DD1\u540E\u4ECD\u672A\u767B\u5F55\uFF0C\u9700\u8981\u4EBA\u770B",
  "keychain.alert.text": "\u94A5\u5319\u4E32\u6682\u65F6\u8BFB\u4E0D\u5230\uFF1A\u8FD9\u671F\u95F4\u65B0\u5F00\u7684 Claude\uFF0FCursor \u4F1A\u8BDD\u4F1A\u62A5\u300E\u672A\u767B\u5F55\u300F\u3002\u4E00\u822C\u91CD\u542F\u7535\u8111\u80FD\u6062\u590D",
  "keychain.cursorCaveat": "\u53EA\u8BF4\u660E\u94A5\u5319\u4E32\u91CC\u6709\u8FD9\u6761\uFF0C\u4E0D\u7B49\u4E8E Cursor \u771F\u7684\u80FD\u7528\uFF0C\u4EE5 status \u4E3A\u51C6",
  "keychain.log.recovered": "{at} \u6062\u590D",
  "keychain.log.rerun": "{at} \u91CD\u8DD1 schedule={id} name={name}",
  "keychain.log.rerunFailed": "{at} \u91CD\u8DD1\u5931\u8D25 schedule={id} exit={code}",
  "keychain.match.opsPrefix": "\u3010\u8FD0\u7EF4\xB7",
  "leader.attention.askedAgo": "{elapsed}\u524D\u95EE\u7684\uFF0C\u5C1A\u672A\u627E\u5230\u66F4\u65B0\u7684\u5F85\u62CD\u677F",
  "leader.attention.closeReply": "\u6536\u8D77\u56DE\u590D\u6846",
  "leader.attention.decide": "\u53BB\u62CD\u677F",
  "leader.attention.empty": "\u73B0\u5728\u6CA1\u6709\u8981\u4F60\u5904\u7406\u7684",
  "leader.attention.heading": "\u8981\u4F60\u5904\u7406\u7684",
  "leader.attention.headingCount": "\u8981\u4F60\u5904\u7406\u7684 \xB7 {count} \u4EF6",
  "leader.attention.question": "{code} \u95EE\u4E86\u4F60\uFF0C\u6CA1\u767B\u8BB0",
  "leader.attention.reply": "\u56DE\u5B83",
  "leader.attention.seeResult": "\u770B\u7ED3\u679C",
  "leader.attention.staleAcceptance": "{code} \xB7 {count} \u5F20\u5361\u5F85\u9A8C\u6536\u8D85 2 \u5C0F\u65F6",
  "leader.attention.unresponsive": "{code} <leader> \u65E0\u54CD\u5E94 \xB7 {count} \u5F20\u5361\u7B49\u9A8C\u6536 \xB7 \u5DF2\u518D\u53EB {wakes} \u6B21",
  "leader.elapsed.daysHours": "{days} \u5929 {hours} \u5C0F\u65F6",
  "leader.elapsed.hoursMinutes": "{hours} \u5C0F\u65F6 {minutes} \u5206\u949F",
  "leader.elapsed.minutes": "{minutes} \u5206\u949F",
  "leader.elapsed.underMinute": "\u4E0D\u5230 1 \u5206\u949F",
  "leader.elapsed.unreadable": "\u65F6\u95F4\u8FD8\u8BFB\u4E0D\u5230",
  "leader.group.acceptance": "\u5F85\u9A8C\u6536\uFF08\u7B49\u5B83\u9A8C\u6536\uFF09",
  "leader.group.blocked": "\u5361\u4F4F",
  "leader.group.parents": "\u7B49\u524D\u7F6E\u5361",
  "leader.group.rework": "\u8FD4\u5DE5\u4E2D",
  "leader.help.hideA11y": "\u6536\u8D77\u8BF4\u660E",
  "leader.help.lamp": "\u72B6\u6001\u706F\u770B\u4E0A\u4E0B\u6587\uFF1A25 \u4E07\u53CA\u4EE5\u4E0B\u662F\u7EFF\u706F\uFF0C\u8D85\u8FC7 25 \u4E07\u4EAE\u9EC4\u706F\uFF0C\u8D85\u8FC7 50 \u4E07\u4EAE\u7EA2\u706F\u3002\u6CA1\u6709\u70B9\u51FB\u4E0D\u4F1A\u6362\u73ED\u3002",
  "leader.help.order": "\u6BCF\u4E2A <leader> \u4E00\u5F20\u5361\uFF0C\u5361\u4F4F\u5F00\u5DE5\u3001\u65E0\u54CD\u5E94\u7684\u6392\u6700\u524D\uFF0C\u4EC0\u4E48\u90FD\u4E0D\u7528\u5904\u7406\u7684\u6392\u540E\u9762\uFF1B\u6682\u505C\u7684\u9879\u76EE\u6536\u6210\u4E00\u884C\u653E\u6700\u5E95\u3002",
  "leader.help.reply": "\u6709\u5B57\u6BCD\u5C31\u70B9\u5B57\u6BCD\uFF1B\u5199\u4E00\u53E5\u8BDD\u4F1A\u8F6C\u7ED9\u8FD9\u4E2A <leader>\u3002\u70B9\u300C\u5C55\u5F00\u300D\u770B\u5F85\u62CD\u677F\u660E\u7EC6\u3001\u5361\u7247\u30017 \u5929\u8BA1\u6570\u3001\u6362\u73ED\u548C\u4EA4\u63A5\u3002",
  "leader.help.show": "\u8BF4\u660E",
  "leader.help.showA11y": "\u5C55\u5F00\u8BF4\u660E",
  "leader.help.top": "\u9876\u90E8\u300C\u8981\u4F60\u5904\u7406\u7684\u300D\u53EA\u5217\u8981\u4F60\u52A8\u624B\u7684\u4E8B\uFF1A\u5361\u4F4F\u5F00\u5DE5\u7684\u5F85\u62CD\u677F\u3001\u95EE\u4E86\u6CA1\u767B\u8BB0\u3001<leader> \u65E0\u54CD\u5E94\u3001\u5F85\u9A8C\u6536\u8D85 2 \u5C0F\u65F6\u3002",
  "leader.input.noticeOpen": "\u3010",
  "leader.input.userMarker": "\u3010\u7528\u6237\u7559\u8A00",
  "leader.kindLabel.question": "\u6CA1\u767B\u8BB0",
  "leader.kindLabel.staleAcceptance": "\u9A8C\u6536\u8D85 2 \u5C0F\u65F6",
  "leader.kindLabel.unresponsive": "\u65E0\u54CD\u5E94",
  "leader.lamp.normal": "\u6B63\u5E38",
  "leader.lastReply.ago": "\u6700\u540E\u56DE\u590D {elapsed}\u524D",
  "leader.lastReply.unreadable": "\u6700\u540E\u56DE\u590D\u6682\u65F6\u8BFB\u4E0D\u5230",
  "leader.prompt.acceptanceReminder": "\u8BF7\u5BA1\u9605\u5F85\u9A8C\u6536\u5361\u7247\uFF1A{codes}\u3002\u6709\u8BC1\u636E\u652F\u6301\u7684\u4EA4\u4ED8\u4E88\u4EE5\u9A8C\u6536\uFF0C\u9700\u8981\u4FEE\u6539\u7684\u9000\u56DE\u3002",
  "leader.prompt.delegationReminder": "\u9075\u5FAA\u4ED3\u5E93\u8BF4\u660E\u548C Kanban \u8D1F\u8D23\u4EBA\u534F\u8BAE\u3002\u901A\u8FC7\u5361\u7247\u534F\u8C03\u5DE5\u4F5C\u3001\u5BA1\u9605\u4EA4\u4ED8\u8BC1\u636E\u3001\u767B\u8BB0\u9700\u4EBA\u51B3\u5B9A\u7684\u4E8B\u9879\u5E76\u6C9F\u901A\u8FDB\u5EA6\u3002\u5904\u7406\u5F85\u9A8C\u6536\u3001\u5361\u4F4F\u548C\u4F9D\u8D56\u5DF2\u5B8C\u6210\u7684\u5DE5\u4F5C\u3002\u5DF2\u6388\u6743\u7684\u5408\u5E76\u7531\u6742\u6D3B\u89D2\u8272\u6267\u884C\u3002",
  "leader.prompt.statusRequest": "\u8BF7\u7528\u5927\u767D\u8BDD\u6C47\u62A5\u73B0\u72B6\uFF1A\u624B\u4E0A\u6709\u54EA\u4E9B\u5361\u3001\u5404\u5361\u5728\u54EA\u3001\u5728\u7B49\u6211\u5B9A\u4EC0\u4E48\u3002\u8981\u6211\u5B9A\u7684\u4E8B\u7528 roles decide add \u767B\u8BB0 A\uFF0FB\uFF0FC\uFF0B\u63A8\u8350\uFF0C\u4E0D\u8981\u53EA\u5199\u5728\u5BF9\u8BDD\u91CC\u3002",
  "leader.question.optionMarks": "\uFF0E\u3001\uFF1A\uFF09",
  "leader.question.recommend": "\u63A8\u8350",
  "leader.repeatWakes": "\u5DF2\u518D\u53EB {count} \u6B21",
  "leader.reply.badProject": "\u9879\u76EE\u4E0D\u5BF9\uFF0C\u6CA1\u6709\u53D1\u51FA",
  "leader.reply.empty": "\u8BF7\u5148\u5199\u4E00\u53E5\u8BDD",
  "leader.reply.tooLong": "\u6700\u591A {limit} \u5B57\uFF0C\u8BF7\u7F29\u77ED\u540E\u518D\u53D1",
  "leader.reply.userPrefix": "\u3010\u7528\u6237\u7559\u8A00\uFF08\u6765\u81EA AFC \u9762\u677F\uFF09\u3011",
  "leader.selfWork.longBusy": "\u8FDE\u7EED\u5728\u5FD9\u8D85\u8FC7 15 \u5206\u949F\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u8BE5\u6D3E\u5361",
  "leader.selfWork.overWeek": "\u8FD1 7 \u5929\u81EA\u5DF1\u5E72\u6D3B\u591A\u4E8E\u6D3E\u5361\uFF0C\u73B0\u5728\u53C8\u5728\u5FD9\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u8BE5\u6D3E\u5361",
  "leader.selfWork.recentWork": "\u6700\u8FD1\u6709\u6539\u6587\u4EF6\u3001\u9A8C\u8BC1\u6216\u5408\u5E76\u52A8\u4F5C",
  "leader.server.activityTimeout": "\u6700\u8FD1\u4F1A\u8BDD\u8BFB\u53D6\u8D85\u65F6",
  "leader.server.activityWarning": "\u6700\u8FD1\u56DE\u590D\u548C\u52A8\u4F5C\u6682\u65F6\u8BFB\u4E0D\u5230\uFF1A{error}",
  "leader.server.notRegistered": "\u8FD9\u4E2A\u9879\u76EE\u8FD8\u6CA1\u767B\u8BB0 <leader>\uFF0C\u6CA1\u6709\u53D1\u51FA",
  "leader.server.sendFailed": "\u53D1\u9001\u5931\u8D25\uFF1A{error}",
  "leader.server.sent": "\u5DF2\u53D1\u51FA",
  "leader.status.busy": "\u5728\u5FD9",
  "leader.status.idle": "\u7A7A\u95F2",
  "leader.status.notListed": "\u4E0D\u5728\u5217\u8868\u91CC",
  "leader.tag.acceptance": "\u5F85\u9A8C\u6536 {count}",
  "leader.tag.blocked": "\u5361\u4F4F {count}",
  "leader.tag.selfWork": "\u81EA\u5DF1\u5E72\u6D3B \u26A0",
  "leader.tag.shift": "\u6362\u73ED\uFF1A{label}",
  "leader.tag.shiftCancelled": "\u6362\u73ED\u5DF2\u53D6\u6D88",
  "leader.tag.shiftFailed": "\u6362\u73ED\u5931\u8D25",
  "leader.tag.unread": "\u672A\u8BFB\u56DE\u590D",
  "leader.tag.unresponsive": "\u65E0\u54CD\u5E94 {count}",
  "leader.tag.waiting": "\u7B49\u4F60 {count}",
  "leader.title.oldPrefix": "\u3010\u603B\u7BA1\u3011",
  "leader.ui.actionsUnreadable": "\u6700\u8FD1\u52A8\u4F5C\u6682\u65F6\u8BFB\u4E0D\u5230",
  "leader.ui.ago": "{elapsed}\u524D",
  "leader.ui.askedUnregistered": "\u95EE\u4E86\u4F60\u4F46\u6CA1\u767B\u8BB0",
  "leader.ui.blockingWork": "\u5361\u4F4F\u5F00\u5DE5",
  "leader.ui.cardCount": "{count} \u5F20",
  "leader.ui.cardsHere": "\u5361\u5728\u5B83\u8FD9\u91CC\u7684\u5361",
  "leader.ui.cardsUnreadable": "\u5361\u7247\u72B6\u6001\u6682\u65F6\u8BFB\u4E0D\u5230",
  "leader.ui.collapse": "\u6536\u8D77",
  "leader.ui.collapseFull": "\u6536\u8D77\u5168\u6587",
  "leader.ui.collapseGroup": "\u6536\u8D77{label}",
  "leader.ui.count": "{count} / {limit} \u5B57",
  "leader.ui.countTooLong": "{count} / {limit} \u5B57\uFF0C\u8BF7\u7F29\u77ED\u540E\u518D\u53D1",
  "leader.ui.detailsA11y": "{action} {code} \u7684\u8BE6\u60C5",
  "leader.ui.expand": "\u5C55\u5F00",
  "leader.ui.expandFull": "\u5C55\u5F00\u5168\u6587",
  "leader.ui.expandGroup": "\u5C55\u5F00{label}\u5168\u90E8 {count} \u5F20",
  "leader.ui.forceOpen": "\u5F00\u653E\u95EE\u9898\uFF08--force-open\uFF09",
  "leader.ui.inStateFor": "\u5728\u6B64\u72B6\u6001 {elapsed}",
  "leader.ui.itemCount": "{count} \u4EF6",
  "leader.ui.mayBeWaiting": "\u8FD9\u6BB5\u8BDD\u53EF\u80FD\u5728\u7B49\u4F60\u56DE\u590D\uFF0C\u5C1A\u672A\u627E\u5230\u66F4\u65B0\u7684\u5F85\u62CD\u677F\u3002",
  "leader.ui.moreCards": "\u8FD8\u6709 {count} \u5F20 \xB7 \u5C55\u5F00",
  "leader.ui.noBlockReason": "\u5C1A\u672A\u5199\u660E\u5361\u4F4F\u539F\u56E0",
  "leader.ui.noOpenDecisions": "\u6CA1\u6709\u672A\u5173\u7684\u5F85\u62CD\u677F",
  "leader.ui.noRegistry": "\u8FD8\u8BFB\u4E0D\u5230\u5404\u9879\u76EE\u7684\u767B\u8BB0",
  "leader.ui.none": "\u6CA1\u6709",
  "leader.ui.openSession": "\u6253\u5F00\u4F1A\u8BDD",
  "leader.ui.owner": "\u8D1F\u8D23\uFF1A{owner}",
  "leader.ui.pausedCanSend": "\u9879\u76EE\u5DF2\u6682\u505C\uFF08\u4ECD\u53EF\u53D1\u9001\uFF09",
  "leader.ui.remindAcceptance": "\u50AC\u9A8C\u6536",
  "leader.ui.remindAcceptanceA11y": "\u50AC\u5B83\u9A8C\u6536",
  "leader.ui.remindDelegation": "\u63D0\u9192\u5B83\u53EA\u6D3E\u6D3B",
  "leader.ui.replyToIt": "\u7ED9\u5B83\u56DE\u8BDD",
  "leader.ui.replyToThis": "\u56DE\u590D\u8FD9\u6BB5\u8BDD",
  "leader.ui.sectionA11y": "{action}{title}",
  "leader.ui.sectionA11ySummary": "{action}{title}\uFF0C{summary}",
  "leader.ui.selfWorking": "\u5728\u81EA\u5DF1\u5E72\u6D3B",
  "leader.ui.send": "\u53D1\u9001",
  "leader.ui.sendToA11y": "\u53D1\u7ED9 {project} \u7684 <leader>",
  "leader.ui.sending": "\u53D1\u9001\u4E2D\u2026",
  "leader.ui.sentAt": "\u5DF2\u53D1\u51FA \xB7 {time}",
  "leader.ui.statusRequest": "\u6C47\u62A5\u73B0\u72B6",
  "leader.ui.statusRequestA11y": "\u8BF7\u5B83\u6C47\u62A5\u73B0\u72B6",
  "leader.ui.unreadable": "\u6682\u65F6\u8BFB\u4E0D\u5230",
  "leader.ui.unresponsive": "<leader> \u65E0\u54CD\u5E94",
  "leader.ui.waitingOnYou": "\u5B83\u5728\u7B49\u4F60",
  "leader.ui.writeToIt": "\u5199\u4E00\u53E5\u8BDD\u7ED9\u5B83",
  "leader.ui.writeToLeader": "\u5199\u4E00\u53E5\u8BDD\u7ED9\u8FD9\u4E2A <leader>",
  "leader.unresponsiveLine": "\u25CF <leader> \u65E0\u54CD\u5E94 \xB7 {count} \u5F20\u5361",
  "leader.week.commit": "\u81EA\u5DF1\u4EE3\u7801 commit",
  "leader.week.counting": "\u8FD1 7 \u5929\uFF1A\u7EDF\u8BA1\u4E2D\u2026",
  "leader.week.dispatched": "\u8FD1 7 \u5929\uFF1A\u6D3E\u5361 {count}",
  "leader.week.docCommits": "\u6587\u6863 commit {count}",
  "leader.week.merge": "\u81EA\u5DF1\u5408 PR",
  "leader.week.nudge": "\u3010AFC \u63D0\u9192\u3011\u4F60\u5728\u5BF9\u8BDD\u91CC\u95EE\u4E86\u7528\u6237\uFF08{head}\uFF09\uFF0C\u7528\u6237\u770B\u4E0D\u5230\uFF0C\u8BF7 roles decide add \u767B\u8BB0\u6210 A\uFF0FB\uFF0FC\uFF0B\u63A8\u8350\u3002",
  "leader.week.test": "\u81EA\u5DF1\u8DD1\u6D4B\u8BD5",
  "leader.week.uncountable": "\u8FD1 7 \u5929\uFF1A\u4E0D\u53EF\u7EDF\u8BA1",
  "leader.week.writingCode": "\u81EA\u5DF1\u5728\u5199\u4EE3\u7801\uFF0C\u5E94\u5EFA\u5361",
  "leader.work.mergeQueueScript": "\u5408\u5E76\u961F\u5217",
  "pools.alerts.cursorOfficialFormat": "Cursor \u5B98\u65B9\u63A5\u53E3\u7684\u8FD4\u56DE\u683C\u5F0F\u53D8\u4E86\uFF0C\u7528\u7684\u662F\u624B\u586B\u503C\uFF08{when}\u6284\u7684\uFF09",
  "pools.alerts.cursorOfficialNetwork": "Cursor \u5B98\u65B9\u63A5\u53E3\u7F51\u7EDC\u5931\u8D25\uFF0C\u7528\u7684\u662F\u624B\u586B\u503C\uFF08{when}\u6284\u7684\uFF09",
  "pools.alerts.cursorReadFailed": "Cursor \u7528\u91CF\u8BFB\u53D6\u5931\u8D25\uFF0C\u7528\u7684\u662F\u624B\u586B\u503C\uFF08{when}\u6284\u7684\uFF09",
  "pools.alerts.cursorSpent": "Cursor \u6A21\u578B\u989D\u5EA6\u5DF2\u7528 {pct}%\uFF0C\u5957\u9910\u5185\u989D\u5EA6\u5DF2\u7528\u5B8C\uFF1B\u5DF2\u505C\u6B62\u5F80 Cursor \u6D3E\u6D3B",
  "pools.alerts.grokLoginLost": "\u8BFB\u53D6 SuperGrok \u7528\u91CF\u4E4B\u540E\uFF0Cgrok models \u4E0D\u518D\u663E\u793A\u5DF2\u767B\u5F55\u3002\u753B\u9762\u5DF2\u9000\u51FA\uFF0C\u6CA1\u6709\u6309\u522B\u7684\u952E\uFF0C\u4E5F\u6CA1\u6709\u767B\u5F55\u3002",
  "pools.alerts.kind.cursorLoginLost": "Cursor \u8BFB\u53D6\u540E\u6389\u767B\u5F55",
  "pools.alerts.kind.cursorReadFailed": "Cursor \u7528\u91CF\u8BFB\u53D6\u5931\u8D25",
  "pools.alerts.kind.disconnected": "Cursor \u8FDE\u63A5\u65AD\u4E86",
  "pools.alerts.kind.filePermission": "Cursor \u767B\u5F55\u6587\u4EF6\u6743\u9650\u4E0D\u5BF9",
  "pools.alerts.kind.formatChanged": "Cursor \u5B98\u65B9\u63A5\u53E3\u683C\u5F0F\u53D8\u4E86",
  "pools.alerts.kind.grokLoginLost": "SuperGrok \u8BFB\u53D6\u540E\u6389\u767B\u5F55",
  "pools.alerts.kind.grokUnread": "SuperGrok \u7528\u91CF\u8BFB\u4E0D\u5230",
  "pools.alerts.kind.loggedOut": "Cursor \u6389\u767B\u5F55",
  "pools.alerts.kind.loginUnreadable": "Cursor \u6682\u65F6\u8BFB\u4E0D\u5230\u767B\u5F55\u4FE1\u606F",
  "pools.alerts.kind.networkFailure": "Cursor \u5B98\u65B9\u63A5\u53E3\u7F51\u7EDC\u5931\u8D25",
  "pools.alerts.kind.notWritten": "Cursor \u767B\u5F55\u4FE1\u606F\u6CA1\u6709\u5199\u6210",
  "pools.alerts.kind.notWrittenBack": "Cursor \u767B\u5F55\u4FE1\u606F\u6CA1\u6709\u5199\u56DE\u53BB",
  "pools.alerts.kind.overPlan": "\u8D85\u51FA\u5957\u9910\u989D\u5EA6",
  "pools.alerts.kind.snapshotStale": "\u989D\u5EA6\u5FEB\u7167\u8FC7\u671F",
  "pools.alerts.noCopyTime": "\u6CA1\u6709\u6284\u5199\u65F6\u95F4",
  "pools.alerts.snapshotMissing": "\u989D\u5EA6\u5FEB\u7167 pool-status.json \u4E0D\u5B58\u5728\u6216\u8BFB\u4E0D\u51FA\u65F6\u95F4\uFF0CKanban \u6D3E\u6D3B\u4F1A\u6309\u300C\u90FD\u53EF\u6D3E\u300D\u5904\u7406",
  "pools.alerts.snapshotStale": "\u989D\u5EA6\u5FEB\u7167 pool-status.json \u5DF2 {minutes} \u5206\u949F\u6CA1\u66F4\u65B0\uFF08\u5E94\u6BCF 5 \u5206\u949F\u4E00\u6B21\uFF09\uFF0CKanban \u6D3E\u6D3B\u7528\u7684\u662F\u65E7\u6570\u636E\uFF1B\u539F\u56E0\u770B Paseo \u65E5\u5FD7\u91CC\u7684 [afc] pool refresh",
  "pools.hard.doubleWeekReserve": "\u672C\u5468\u5DF2\u7528 {used}%\uFF0C\u53CC\u500D\u5468\u505C\u6D3E\u7EBF {stop}%\uFF0C\u5269\u4E0B\u7684\u7559\u7ED9 <leader>",
  "pools.hard.leaderReserve": "\u672C\u5468\u5DF2\u7528 {used}%\uFF0C\u5269\u4E0B\u7684\u7559\u7ED9 <leader>",
  "pools.hard.planStop": "{period}\u5DF2\u7528 {used}%\uFF0C\u5230 {stop}% \u505C\uFF0C\u5269\u4E0B\u7559\u7ED9\u4F60\u81EA\u5DF1\u7528",
  "pools.hard.planStopCoupon": "{period}\u5DF2\u7528 {used}%\uFF0C\u624B\u91CC\u6709\u91CD\u7F6E\u5238\uFF0C\u5230 {stop}% \u505C",
  "pools.hard.sessionPause": "5 \u5C0F\u65F6\u7A97\u53E3\u5DF2\u7528 {used}%\uFF0C\u7B49\u7A97\u53E3\u5237\u65B0\u518D\u5F00\u65B0\u6D3B",
  "pools.hard.subWeekSpent": "{name} \u672C\u5468\u989D\u5EA6\u5DF2\u7528\u5B8C",
  "pools.hard.thisMonth": "\u672C\u6708",
  "pools.hard.thisWeek": "\u672C\u5468",
  "pools.hard.weekSpent": "\u672C\u5468\u989D\u5EA6\u5DF2\u7528\u5B8C",
  "pools.pace.ahead": "\u7528\u5F97\u6BD4\u8FDB\u5EA6\u5FEB\uFF1A\u5DF2\u7528 {used}%\uFF0C\u6309\u8FDB\u5EA6\u5E94\u5728 {pace}%\uFF0C{tail}",
  "pools.pace.aheadNoPause": "\u7528\u5F97\u6BD4\u8FDB\u5EA6\u5FEB\uFF1A\u5DF2\u7528 {used}%\uFF0C\u6309\u8FDB\u5EA6\u5E94\u5728 {pace}%\uFF08\u5DF2\u6309\u4F60\u7684\u8981\u6C42\u4E0D\u56E0\u8D85\u524D\u6682\u505C\uFF09",
  "pools.pace.aheadSoftened": "\u7528\u5F97\u6BD4\u8FDB\u5EA6\u5FEB\uFF1A\u5DF2\u7528 {used}%\uFF0C\u6309\u8FDB\u5EA6\u5E94\u5728 {line}%\uFF0C\u540C\u4E00\u89D2\u8272\u7684\u5176\u4ED6\u6C60\u90FD\u4E0D\u53EF\u6D3E\uFF0C\u5148\u7EE7\u7EED\u7528",
  "pools.pace.behind": "\u7528\u5F97\u6BD4\u8FDB\u5EA6\u6162\uFF0C\u4F18\u5148\u7528",
  "pools.pace.canDispatch": "\u53EF\u4EE5\u6D3E\u6D3B",
  "pools.pace.catchUpAt": "\u9884\u8BA1 {when} \u8FDB\u5EA6\u7EBF\u8FFD\u4E0A\u540E\u6062\u590D",
  "pools.pace.expectedToken": "\u9884\u8BA1",
  "pools.pace.noCatchUp": "\u672C\u5468\u671F\u5185\u8FDB\u5EA6\u7EBF\u8FFD\u4E0D\u4E0A",
  "pools.pace.reset": "\u91CD\u7F6E",
  "pools.pace.tokyoTime": "{date}\uFF08\u4E1C\u4EAC\u65F6\u95F4\uFF09",
  "pools.reviewer.band": "\u672C\u5468\u5DF2\u7528 {used}%\uFF1A\u4E34\u65F6\u4F8B\u5916\u53EA\u6D3E{who}\uFF0C\u5230 {stop}% \u505C\uFF08{decision}\uFF09",
  "pools.reviewer.decision": "{who}\uFF0C{when} \u91CD\u7F6E\u540E\u6062\u590D",
  "pools.reviewer.resetDay": "\u91CD\u7F6E\u65E5",
  "pools.reviewer.reviewRole": "\u5BA1\u67E5",
  "pools.reviewer.roleSeparator": "\u3001",
  "pools.reviewer.stop": "\u672C\u5468\u5DF2\u7528 {used}%\uFF0C\u5230\u4E86 {stop}% \u4E34\u65F6\u505C\u6D3E\u7EBF",
  "pools.reviewer.temporary": "\u4E34\u65F6\u4F8B\u5916",
  "pools.reviewer.userDecided": "\u7528\u6237 {date} \u51B3\u5B9A",
  "pools.reviewer.userToken": "\u7528\u6237",
  "pools.status.campaignAhead.back": "\uFF08\u70E7\u5238\u5468\u540E\u6BB5\uFF0C\u4F18\u5148\u6D3E\uFF09",
  "pools.status.campaignAhead.double": "\uFF08\u91CD\u7F6E\u5238\u53CC\u500D\u5468\uFF0C\u4E0D\u56E0\u8D85\u524D\u6682\u505C\uFF0C\u4F18\u5148\u6D3E\uFF09",
  "pools.status.campaignAhead.front": "\uFF08\u70E7\u5238\u5468\u524D\u6BB5\uFF0C\u4E0D\u56E0\u8D85\u524D\u6682\u505C\uFF0C\u4F18\u5148\u6D3E\uFF09",
  "pools.status.campaignBehind.back": "\u70E7\u5238\u5468\u540E\u6BB5\uFF0C\u4F18\u5148\u6D3E\u5230\u8FD9\u91CC",
  "pools.status.campaignBehind.double": "\u91CD\u7F6E\u5238\u53CC\u500D\u5468\uFF0C\u4F18\u5148\u6D3E\u5230\u8FD9\u91CC",
  "pools.status.campaignBehind.front": "\u70E7\u5238\u5468\u524D\u6BB5\uFF0C\u4F18\u5148\u6D3E\u5230\u8FD9\u91CC",
  "pools.status.couponPreferNote": "\uFF08\u6709\u91CD\u7F6E\u5238\uFF0C\u4F18\u5148\u7528\uFF09",
  "pools.status.planNotUsed": "\u6D3E\u6D3B\u4E0D\u4F7F\u7528\u8FD9\u4E2A\u5957\u9910",
  "pools.status.subFollowsMain": "{sub} \u7528\u7684\u662F {main}\uFF1A{reason}",
  "pools.status.withNote": "{reason}\uFF08{note}\uFF09",
  "pools.unread.agoMinutes": "{minutes} \u5206\u949F\u524D",
  "pools.unread.agoUnderMinute": "\u4E0D\u5230 1 \u5206\u949F\u524D",
  "pools.unread.carryMark": "\u7528\u91CF\u6CA1\u8BFB\u5230\uFF0C\u6CBF\u7528",
  "pools.unread.carryNote": "{mark} {ago}\u7684 {pct}%{readAt}",
  "pools.unread.claudeReset": "Claude \u5468\u7A97\u53E3\u5DF2\u91CD\u7F6E\uFF0C\u4E0A\u6B21\u8BFB\u6570\u4F5C\u5E9F\uFF1B\u8FD9\u6B21\u6CA1\u8BFB\u5230\u7528\u91CF\uFF0C\u6309\u672A\u77E5\u653E\u884C",
  "pools.unread.claudeStop": "Claude \u7528\u91CF\u8BFB\u4E0D\u5230\uFF0C\u5148\u505C\u6D3E\uFF08<leader> \u9884\u7559\u8981\u4FDD\u4F4F\uFF09",
  "pools.unread.codexStop": "ChatGPT \u7528\u91CF\u8BFB\u4E0D\u5230\uFF0C\u5148\u505C\u6D3E",
  "pools.unread.paren": "\uFF08{text}\uFF09",
  "pools.unread.readAt": "\uFF08\u8BFB\u4E8E {at}\uFF09",
  "pools.unread.unknownAllowedToken": "\u6309\u672A\u77E5\u653E\u884C",
  "pools.windows.beforeReset": "\u91CD\u7F6E\u524D",
  "pools.windows.beforeWhen": " {when}\u524D",
  "pools.windows.cursorDownUseGrok": "Cursor \u5DF2\u505C\u7528\uFF0C\u53EA\u597D\u7528 SuperGrok \u5269\u4F59\u989D\u5EA6",
  "pools.windows.cursorLogoutHold": "\u6B64\u6C60\u5DF2\u5173\u95ED\u6D3E\u6D3B",
  "pools.windows.shortGrok": "\u7167\u73B0\u5728\u7684\u901F\u5EA6\u4F1A\u5728{until}\u7528\u5B8C\uFF0C\u6267\u884C\u6539\u8D70 Cursor\uFF1BCursor \u5FD9\u65F6\u6392\u961F\uFF0C\u4E0D\u56DE\u9000\u5230 SuperGrok",
  "prices.fastCatalogId": "{id} \xD7{k}\uFF08fast\uFF09",
  "queue.alert.acceptance": "{card}\u7B49\u9A8C\u6536\u5DF2\u7ECF {waited}\uFF0C\u9879\u76EE <leader> \u8FD8\u6CA1\u6765\u9A8C\u6536",
  "queue.alert.blockedByParent": "{card}\u5728\u7B49\u524D\u7F6E\uFF0C\u88AB {names} \u62D6\u4F4F",
  "queue.alert.idle": "{card}{stayed}\u8FD8\u663E\u793A\u8FDB\u884C\u4E2D\uFF0C\u4F46\u8D1F\u8D23\u7684 agent \u5DF2\u7ECF {idle} \u6CA1\u6709\u52A8\u9759\uFF0C\u53EF\u80FD\u6302\u4F4F\u4E86",
  "queue.alert.kind.blockedByParent": "\u88AB\u524D\u7F6E\u62D6\u4F4F",
  "queue.alert.kind.stuck": "\u53EF\u80FD\u6302\u4F4F",
  "queue.alert.nameSeparator": "\u3001",
  "queue.alert.stayed": "\u8FD9\u5F20\u5361\u505C\u5728\u8FD9\u91CC\u5DF2\u7ECF {waited}\uFF0C",
  "queue.alert.timed": "{card}{verb}\uFF0C\u5DF2\u7ECF {waited}\u3002\u539F\u56E0\uFF1A{why}",
  "queue.cardLabel": "{code} {project}\u300C{title}\u300D",
  "queue.category.acceptance": "\u7B49\u9A8C\u6536",
  "queue.category.agentIdle": "\u8FDB\u884C\u4E2D\u4F46 agent \u5DF2\u7A7A\u95F2",
  "queue.category.autoStartOff": "\u81EA\u52A8\u5F00\u5DE5\u5173\u95ED",
  "queue.category.other": "\u5176\u4ED6",
  "queue.category.unattended": "\u6CA1\u4EBA\u63A5",
  "queue.category.waitDir": "\u7B49\u76EE\u5F55",
  "queue.category.waitParent": "\u7B49\u524D\u7F6E",
  "queue.category.waitSlot": "\u7B49\u540D\u989D",
  "queue.hold.autoStartOff": "\u81EA\u52A8\u5F00\u5DE5\u5DF2\u5173\u95ED",
  "queue.hold.concurrencyFull": "\u5E76\u53D1\u5DF2\u6EE1",
  "queue.hold.cooldown": "\u51B7\u5374",
  "queue.hold.noLeader": "\u672A\u767B\u8BB0 <leader>",
  "queue.hold.noSupervisorOld": "\u672A\u767B\u8BB0\u603B\u7BA1",
  "queue.hold.parent": "\u524D\u7F6E",
  "queue.hold.poolUnavailable": "\u6C60\u5F53\u524D\u4E0D\u53EF\u6D3E",
  "queue.hold.sameDir": "\u540C\u4E00\u5DE5\u4F5C\u76EE\u5F55",
  "queue.shown.acceptance": "\u7B49\u5F85\u9A8C\u6536",
  "queue.shown.agentIdle": "\u8D1F\u8D23\u7684 agent \u5DF2\u7A7A\u95F2",
  "queue.shown.cooldown": "\u51B7\u5374\u672A\u5230\uFF08{until}\uFF09",
  "queue.shown.unattended": "\u6CA1\u4EBA\u63A5",
  "queue.shown.waitParent": "\u7B49\u5F85\u524D\u7F6E\u5B8C\u6210",
  "queue.shown.waitSlot": "\u7B49\u5F85\u540D\u989D",
  "queue.verb.stalled": "\u505C\u7740\u6CA1\u5F80\u4E0B\u8D70",
  "queue.verb.unattended": "\u6CA1\u4EBA\u63A5",
  "queue.verb.waitDir": "\u5728\u7B49\u76EE\u5F55",
  "queue.verb.waitSlot": "\u5728\u7B49\u540D\u989D",
  "queue.waited.days": "{days} \u5929",
  "queue.waited.daysHours": "{days} \u5929 {hours} \u5C0F\u65F6",
  "queue.waited.hours": "{hours} \u5C0F\u65F6",
  "queue.waited.hoursMinutes": "{hours} \u5C0F\u65F6 {mins} \u5206\u949F",
  "queue.waited.minutes": "{mins} \u5206\u949F",
  "queue.waited.underMinute": "\u4E0D\u5230 1 \u5206\u949F",
  "queue.waited.unknown": "\u672A\u77E5",
  "quota.adapters.cardAlias": "{name}\uFF08{alias}\uFF09",
  "quota.adapters.cursorModelUsed": "Cursor \u6A21\u578B\u989D\u5EA6\u5DF2\u7528",
  "quota.adapters.cursorSpent": "Cursor \u6A21\u578B\u989D\u5EA6\u5DF2\u7528 {used}%\uFF0C\u5230\u4E86 {stop}% \u505C\u7528\u7EBF",
  "quota.adapters.grokWeekUsed": "SuperGrok \u5468\u989D\u5EA6\u5DF2\u7528",
  "quota.adapters.handCopyStop": "{label} {used}%\uFF08\u4ECE {source} \u624B\u6284\uFF09\uFF0C\u5230\u4E86 {stop}% \u505C\u7528\u7EBF",
  "quota.adapters.mainQuota": "{name} \u4E3B\u989D\u5EA6",
  "quota.adapters.manualEmpty": "No percent copied yet; treated as available",
  "quota.adapters.manualSpent": "{name}: {used}% used, at the {stop}% stop line",
  "quota.adapters.manualStop": "{name}: {used}% used (copied by hand), at the {stop}% stop line",
  "quota.adapters.noHandCopyYet": "\u6CA1\u6709\u586B\u5199\u5DF2\u7528\u767E\u5206\u6BD4\uFF0C\u6309\u53EF\u7528\u5904\u7406",
  "quota.adapters.via": "\u8D70 {name} \u989D\u5EA6",
  "quota.adapters.weekSpent": "\u672C\u5468\u989D\u5EA6\u5DF2\u7528\u5B8C",
  "quota.companies.cursorApi": "\u5176\u4ED6\u6A21\u578B\uFF08API\uFF09",
  "quota.companies.cursorAuto": "Cursor \u81EA\u5BB6\u6A21\u578B\uFF08Auto\uFF09",
  "quota.companies.cursorDefaultWho": "\u6267\u884C\uFF08Grok 4.7\uFF09",
  "quota.companies.cursorLoginAlarm": "Cursor \u547D\u4EE4\u884C\u6389\u767B\u5F55\u4E86\uFF0CCursor \u989D\u5EA6\u8BFB\u4E0D\u5230\uFF08\u73B0\u5728\u7528 {when} \u624B\u6284\u7684\u6570\uFF09\u3002\u8BF7\u5728\u7EC8\u7AEF\u8FD0\u884C cursor-agent login",
  "quota.companies.cursorReconnect": "Cursor \u8FDE\u63A5\u65AD\u4E86\uFF0C\u8BF7\u91CD\u65B0\u8FDE\u63A5",
  "quota.companies.cursorScreenOff": "\u547D\u4EE4\u884C\u753B\u9762\u8BFB\u53D6\u5DF2\u5173\uFF08\u5B83\u4F1A\u5F04\u6389\u767B\u5F55\uFF09\uFF0C\u663E\u793A\u7684\u662F\u624B\u6284\u6570",
  "quota.companies.direct": "{model} \u76F4\u8FDE",
  "quota.companies.dispatchable": "\u53EF\u6D3E",
  "quota.companies.fableDefaultWho": "\u51B3\u7B56\uFF08Fable\uFF09\u3001\u9AD8\u98CE\u9669\u5BA1\u67E5",
  "quota.companies.fableSub": "Fable \u5B50\u989D\u5EA6",
  "quota.companies.fableWho": "{who}\uFF08\u540C\u65F6\u4E5F\u6263\u6BCF\u5468\u603B\u989D\u5EA6\uFF09",
  "quota.companies.fiveHourLabel": "5 \u5C0F\u65F6",
  "quota.companies.fiveHourWindow": "5 \u5C0F\u65F6\u7A97\u53E3",
  "quota.companies.grokDefaultWho": "\u6267\u884C\uFF08Grok 4.7 \u76F4\u8FDE\uFF09",
  "quota.companies.inDaysHours": "{days} \u5929 {hours} \u5C0F\u65F6\u540E",
  "quota.companies.inHours": "{hours} \u5C0F\u65F6\u540E",
  "quota.companies.inUnderHour": "\u4E0D\u5230 1 \u5C0F\u65F6\u540E",
  "quota.companies.linkBroken": "\u8FDE\u63A5\u65AD\u4E86\uFF0C\u8BF7\u91CD\u65B0\u8FDE\u63A5",
  "quota.companies.listSep": "\u3001",
  "quota.companies.loginScreenMarker": "\u767B\u5F55\u753B\u9762",
  "quota.companies.noDispatch": "\u4E0D\u6D3E\u6D3B",
  "quota.companies.nobody": "\u5F53\u524D\u6CA1\u6709\u89D2\u8272\u5728\u7528",
  "quota.companies.onDemand": "\u6309\u91CF\u4ED8\u8D39",
  "quota.companies.ownChats": "\u4F60\u81EA\u5DF1\u7684\u5BF9\u8BDD",
  "quota.companies.paused": "\u6682\u505C",
  "quota.companies.personModel": "{name}\uFF08{model}\uFF09",
  "quota.companies.resetAt": "{rel}\uFF08{clock}\uFF09",
  "quota.companies.resetDue": "\u5DF2\u5230\u91CD\u7F6E\u65F6\u95F4\uFF08{clock}\uFF09",
  "quota.companies.sameAsWeek": "\u548C\u6BCF\u5468\u603B\u989D\u5EA6\u540C\u4E00\u6279\u4EBA",
  "quota.companies.source.at": "{label} \xB7 {when}",
  "quota.companies.source.auto": "\u81EA\u52A8\u8BFB",
  "quota.companies.source.manual": "\u624B\u6284",
  "quota.companies.source.official": "Cursor \u5B98\u65B9\u63A5\u53E3",
  "quota.companies.source.screen": "\u547D\u4EE4\u884C\u753B\u9762",
  "quota.companies.source.screenOff": "\u547D\u4EE4\u884C\u753B\u9762\u8BFB\u53D6\u5DF2\u5173",
  "quota.companies.source.stale": "\u8BFB\u4E0D\u5230\uFF0C\u663E\u793A\u7684\u662F\u65E7\u6570",
  "quota.companies.source.staleAt": "\u8BFB\u4E0D\u5230\uFF0C\u663E\u793A\u7684\u662F\u65E7\u6570\uFF08{when} \u624B\u6284\uFF09",
  "quota.companies.source.unread": "AFC \u8FD8\u8BFB\u4E0D\u5230",
  "quota.companies.staleHeadline": "\u8BFB\u4E0D\u5230\uFF0C\u663E\u793A\u7684\u662F\u65E7\u6570 \xB7 {remaining}",
  "quota.companies.stopped": "\u505C\u7528",
  "quota.companies.unreadMarker": "\u8BFB\u4E0D\u5230",
  "quota.companies.unverified": "\u7528\u9014\u672A\u6838\u5B9E",
  "quota.companies.userReserved": "\u7528\u6237\u4FDD\u7559",
  "quota.companies.weekQuota": "\u6BCF\u5468\u989D\u5EA6",
  "quota.companies.weekTotal": "\u6BCF\u5468\u603B\u989D\u5EA6",
  "quota.home.barHint": "\u8272\u6761\u662F\u8FD8\u5269\u7684",
  "quota.home.dispatch": "\u6D3E\u6D3B",
  "quota.home.markerHint": "\u7EC6\u7EBF\u662F\u6309\u8FDB\u5EA6\u5E94\u5269\uFF0C\u7EA2\u7EBF\u662F\u5269\u5230\u8FD9\u91CC\u505C\u3002\u53EA\u753B\u5728\u6D3E\u6D3B\u7528\u7684\u7A97\u53E3\u4E0A\u3002",
  "quota.home.noCompanies": "\u8FD8\u6CA1\u6709\u6309\u516C\u53F8\u6574\u7406\u7684\u989D\u5EA6",
  "quota.home.oldNumbers": "\u65E7\u6570",
  "quota.home.tapForDetail": "\u70B9\u4E00\u5BB6\u770B\u660E\u7EC6",
  "quota.home.tileA11yCollapse": "{name}\uFF0C{figure}\uFF0C{summary}\uFF0C\u70B9\u6309\u6536\u8D77\u660E\u7EC6",
  "quota.home.tileA11yExpand": "{name}\uFF0C{figure}\uFF0C{summary}\uFF0C\u70B9\u6309\u5C55\u5F00\u660E\u7EC6",
  "quota.home.title": "\u989D\u5EA6\u591F\u4E0D\u591F\u7528",
  "quota.home.who": "\u8C01\u5728\u7528\uFF1A{who}",
  "quota.line.ahead": "\u7528\u5F97\u6BD4\u8BA1\u5212\u5FEB",
  "quota.line.behindPrefer": "\u6BD4\u8BA1\u5212\u6162\uFF0C\u4F18\u5148\u6D3E\u7ED9\u5B83",
  "quota.line.enough": "\u7167\u73B0\u5728\u7684\u901F\u5EA6\u5230\u91CD\u7F6E\u8FD8\u591F\u7528",
  "quota.line.gapEven": "\u5BF9\u9F50",
  "quota.line.gapFast": "\u7528\u5F97\u5FEB {points} \u70B9",
  "quota.line.gapSlow": "\u7528\u5F97\u6162 {points} \u70B9",
  "quota.line.head": "{name}\uFF1A{used}",
  "quota.line.hitsStop": "\u7167\u73B0\u5728\u901F\u5EA6 {date} {part}\u5230\u505C\u6D3E\u7EBF",
  "quota.line.joined": "{head}\uFF0C{tail}",
  "quota.line.monthUnread": "\u672C\u6708\u7528\u91CF\u8FD8\u6CA1\u8BFB\u5230",
  "quota.line.monthUsed": "\u672C\u6708\u7528\u4E86 {pct}%",
  "quota.line.paceRemaining": "\u6309\u8FDB\u5EA6\u5E94\u5269 {pct}%",
  "quota.line.paceRemainingUnknown": "\u6309\u8FDB\u5EA6\u5E94\u5269 \u2014",
  "quota.line.part.afternoon": "\u4E0B\u5348",
  "quota.line.part.evening": "\u665A\u4E0A",
  "quota.line.part.lateNight": "\u51CC\u6668",
  "quota.line.part.morning": "\u65E9\u4E0A",
  "quota.line.part.noon": "\u4E2D\u5348",
  "quota.line.pausedUntil": "\u6682\u505C\u5230 {clock}",
  "quota.line.pausedUntilWindow": "\u6682\u505C\u5230\u7A97\u53E3\u5237\u65B0",
  "quota.line.remaining": "\u8FD8\u5269 {pct}%",
  "quota.line.remainingUnknown": "\u8FD8\u5269 \u2014",
  "quota.line.stopRemain": "\u5269\u5230 {pct}% \u505C",
  "quota.line.stopped": "\u5DF2\u505C\u7528",
  "quota.line.untilResetLeft": "\u7167\u73B0\u5728\u7684\u901F\u5EA6\uFF0C\u5230\u91CD\u7F6E\u7EA6\u8FD8\u5269 {pct}% \u7528\u4E0D\u6389",
  "quota.line.untilResetUsedUp": "\u7167\u73B0\u5728\u7684\u901F\u5EA6\uFF0C\u5230\u91CD\u7F6E\u4F1A\u7528\u5B8C",
  "quota.line.weekUnread": "\u672C\u5468\u7528\u91CF\u8FD8\u6CA1\u8BFB\u5230",
  "quota.line.weekUsed": "\u672C\u5468\u7528\u4E86 {pct}%",
  "quota.page.aboutCards": "\u7EA6 {cards} \u5F20",
  "quota.page.avgCost": "\u5E73\u5747 {tokens} token \xB7 {usd}",
  "quota.page.effortCost": "{profile} \xB7 {effort} \xB7 {runs} \u6B21 \xB7 {avg}",
  "quota.page.period.30d": "\u8FD1 30 \u5929",
  "quota.page.period.7d": "\u8FD1 7 \u5929",
  "quota.page.period.today": "\u4ECA\u5929",
  "quota.page.periodSpend": "{period}\uFF0C\u6240\u6709\u6A21\u578B\u6309 API \u6807\u4EF7\u6298\u7B97",
  "quota.page.planFee": "\u5957\u9910\u8D39\u644A\u5230\u8FD9\u6BB5\u65F6\u95F4\u7EA6 {usd}{extra}",
  "quota.page.planFeeRatio": " \xB7 \u76F8\u5F53\u4E8E\u7528\u51FA\u4E86\u5957\u9910\u8D39\u7684 {ratio} \u500D",
  "quota.page.pricesFootnote": "\u91D1\u989D\u662F\u6309\u516C\u5F00 API \u6807\u4EF7\uFF08models.dev{when}\uFF09\u6298\u7B97\u7684\u53C2\u8003\u503C\uFF0C\u4E0D\u662F\u5B9E\u9645\u6263\u8D39\uFF1B\u7528\u6765\u5224\u65AD\u5957\u9910\u662F\u5426\u7269\u6709\u6240\u503C\u3002",
  "quota.page.pricesUpdated": "\uFF0C{when} \u66F4\u65B0",
  "quota.page.tierNoProfile": "{tier} \xB7 \u6CA1\u6709\u53EF\u6D3E\u7684\u6863\u6848",
  "quota.page.tokens.cacheRead": "\u7F13\u5B58\u8BFB {n}",
  "quota.page.tokens.cacheWrite": "\u7F13\u5B58\u5199 {n}",
  "quota.page.tokens.calls": "{n} \u6B21\u8C03\u7528",
  "quota.page.tokens.input": "\u8F93\u5165 {n}",
  "quota.page.tokens.output": "\u8F93\u51FA {n}",
  "quota.page.unpriced": " \xB7 \u65E0\u516C\u5F00\u4EF7\u683C",
  "quota.pageReason.cliPercent": "\u547D\u4EE4\u884C\u4E0A\u7684\u767E\u5206\u6BD4",
  "quota.pageReason.doubleWeek": "\u53CC\u500D\u5468{stop}",
  "quota.pageReason.stopRestored": "\u505C\u6D3E\u7EBF\u6062\u590D\u4E3A{stop}",
  "quota.pageReason.usedUp": "\u7528\u5B8C\u4E86",
  "quota.plans.claude.leftAtReset": "\u5230\u91CD\u7F6E\u7EA6{remaining}",
  "quota.plans.claude.paceSentence": "\u6309\u8FD9\u4E2A\u901F\u5EA6\uFF0C{projected}\u3002\u8981\u843D\u5230{target}\uFF0C\u6BCF\u5929\u6700\u591A\u518D\u7528 {daily}\u3002",
  "quota.plans.claude.period": "\u672C\u5468\u671F",
  "quota.plans.claude.periodResets": "\u672C\u5468\u671F\uFF08{when} \u91CD\u7F6E\uFF09",
  "quota.plans.claude.runsOut": "\u5230\u91CD\u7F6E\u4F1A\u7528\u5B8C",
  "quota.plans.cursor.connect": "\u8FDE\u63A5 Cursor",
  "quota.plans.cursor.copiedAt": "\uFF08{when} \u6284\u7684\uFF09",
  "quota.plans.cursor.manualFail": "Cursor \u7528\u91CF\u8BFB\u53D6\u5931\u8D25\uFF0C\u7528\u7684\u662F\u624B\u586B\u503C{when}{why}",
  "quota.plans.cursor.opening": "\u6B63\u5728\u6253\u5F00\u2026",
  "quota.plans.cursor.reopenAuth": "\u518D\u6253\u5F00\u6388\u6743\u9875",
  "quota.plans.cursor.why": "\uFF1A{error}",
  "quota.plans.cursor.withWhen": "{text}\uFF08{when}\uFF09",
  "quota.plans.elapsed": " \xB7 \u65F6\u95F4\u8FC7\u4E86 {pct}%",
  "quota.plans.manual.copiedAt": "\u8FD9\u4E2A\u767E\u5206\u6BD4\u662F {when} \u624B\u6284\u7684\u3002",
  "quota.plans.manual.cursor": "\u5B98\u65B9\u63A5\u53E3\u548C\u547D\u4EE4\u884C\u90FD\u8BFB\u4E0D\u5230\u65F6\u7528\u624B\u6284\u3002",
  "quota.plans.manual.cursorScreenOff": "\u547D\u4EE4\u884C\u753B\u9762\u8BFB\u53D6\u5DF2\u5173\uFF0C\u663E\u793A\u7684\u662F\u624B\u6284\u6570\u3002",
  "quota.plans.manual.grok": "Paseo \u548C grok \u547D\u4EE4\u884C\u90FD\u8BFB\u4E0D\u5230\u65F6\uFF0C\u628A /usage show \u7684\u6BCF\u5468\u767E\u5206\u6BD4\u6284\u5728\u8FD9\u91CC\uFF0C{stop}\u3002",
  "quota.plans.manual.noApi": "\u670D\u52A1\u5546\u4E0D\u63D0\u4F9B\u63A5\u53E3\u3002",
  "quota.plans.manual.preview": "\uFF1D {remaining}",
  "quota.plans.notDispatched": "\u6D3E\u6D3B\u4E0D\u4F7F\u7528\u8FD9\u4E2A\u5957\u9910",
  "quota.plans.notEnoughData": "\u6570\u636E\u4E0D\u8DB3",
  "quota.plans.pace.daily": "\u5269\u4E0B\u6BCF\u5929 {daily} \xB7 \u6BCF\u6B21\u6267\u884C\u5927\u7EA6 {per} \xB7 \u6BCF\u5929\u7EA6\u80FD\u6D3E {runs}",
  "quota.plans.pace.days": "{days} \u5929\uFF0F\u5269 {left} \u5929",
  "quota.plans.pace.notEstimated": "\u672A\u4F30",
  "quota.plans.pace.runs": "{runs} \u6B21",
  "quota.plans.pool.deprioritize": "\u53EF\u6D3E\u4F46\u4F18\u5148\u6362\u6C60",
  "quota.plans.pool.paused": "\u6682\u505C\u6D3E\u6D3B",
  "quota.plans.pool.prefer": "\u4F18\u5148\u7528\uFF08\u4F1A\u6D6A\u8D39\uFF09",
  "quota.plans.price.enterNumber": "\u8BF7\u8F93\u5165\u6570\u5B57",
  "quota.plans.price.fill": "\u586B\u6708\u8D39",
  "quota.plans.price.included": "\u9644\u8D60",
  "quota.plans.price.monthly": "${price}/\u6708",
  "quota.plans.resetsAt": " \xB7 {when} \u91CD\u7F6E",
  "quota.plans.roi.line": "\u8FD1 30 \u5929\u7528\u51FA {usd}{roi}",
  "quota.plans.roi.ratio": "\uFF0C\u662F\u6708\u8D39\u7684 {ratio} \u500D",
  "quota.plans.usageUnknown": "\u7528\u91CF\u672A\u77E5",
  "quota.plans.value.full": " \xB7 \u7528\u6EE1\u4E00\u671F\u7EA6\u503C {usd}",
  "quota.plans.value.line": "\u8FD9\u4E00\u671F\u7528\u51FA API \u4EF7\u503C {usd}{plan}{full}",
  "quota.plans.value.planShare": "\uFF08\u5957\u9910\u8D39\u644A\u5230\u8FD9\u4E00\u671F {usd}\uFF09",
  "quota.plans.verdict.earlyBy": "\uFF0C\u6BD4\u91CD\u7F6E\u65E9\u7EA6 {hours} \u5C0F\u65F6",
  "quota.plans.verdict.noPercent": "\u62FF\u4E0D\u5230\u7528\u91CF\u767E\u5206\u6BD4",
  "quota.plans.verdict.onTrack": "\u8282\u594F\u6B63\u597D\uFF0C\u91CD\u7F6E\u524D\u5DEE\u4E0D\u591A\u521A\u597D\u7528\u8DB3",
  "quota.plans.verdict.runsOutAt": "\u7167\u73B0\u5728\u7684\u901F\u5EA6\uFF0C\u7EA6 {when} \u7528\u5B8C{early}",
  "quota.plans.verdict.short": "\u7167\u73B0\u5728\u7684\u901F\u5EA6\u4F1A\u5728\u91CD\u7F6E\u524D\u7528\u5B8C",
  "quota.plans.verdict.tooEarly": "\u8FD9\u4E00\u671F\u521A\u5F00\u59CB\uFF0C\u8FD8\u770B\u4E0D\u51FA\u8282\u594F",
  "quota.plans.window.fableWeekly": "Fable \u672C\u5468\u989D\u5EA6",
  "quota.plans.window.monthly": "\u672C\u6708\u989D\u5EA6",
  "quota.plans.window.session": "5 \u5C0F\u65F6\u7A97\u53E3",
  "quota.plans.window.weekly": "\u672C\u5468\u989D\u5EA6",
  "quota.plansUi.cursorApi": "\u5176\u4ED6\u6A21\u578B\uFF08API\uFF0C\u53EA\u663E\u793A\uFF09 {remaining} \xB7 \u5957\u9910\u5185\u5408\u8BA1 {included}",
  "quota.plansUi.cursorAuto": "Cursor \u6A21\u578B\uFF08Auto\uFF0C\u6D3E\u6D3B\u7528\u8FD9\u5757\uFF09 {remaining}",
  "quota.plansUi.cursorCapText": "Cursor \u6A21\u578B\u8FD9\u5757\u989D\u5EA6\u7528\u5B8C\u4E86\uFF0C\u5DF2\u505C\u6B62\u6D3E\u6D3B",
  "quota.plansUi.disconnect": "\u65AD\u5F00 Cursor",
  "quota.plansUi.editPriceA11y": "\u4FEE\u6539 {name} \u7684\u6708\u8D39",
  "quota.plansUi.manualPrompt": "\u7167\u547D\u4EE4\u884C\u586B\u5DF2\u7528 %",
  "quota.plansUi.noSnapshot": "\u8FD8\u6CA1\u6709\u989D\u5EA6\u5FEB\u7167",
  "quota.plansUi.onDemand": "\u6309\u91CF\u4ED8\u8D39\uFF08\u53EA\u663E\u793A\uFF09 {amount}",
  "quota.plansUi.overCap": "\u8D85\u989D",
  "quota.plansUi.pctInputA11y": "{name} \u767E\u5206\u6BD4",
  "quota.plansUi.priceInputA11y": "{name} \u6708\u8D39\uFF08\u7F8E\u5143\uFF09",
  "quota.plansUi.pricePlaceholder": "\u7F8E\u5143/\u6708",
  "quota.plansUi.save": "\u4FDD\u5B58",
  "quota.plansUi.savePctA11y": "\u4FDD\u5B58\u767E\u5206\u6BD4",
  "quota.plansUi.savePriceA11y": "\u4FDD\u5B58\u6708\u8D39",
  "quota.plansUi.source": "\u6765\u6E90\uFF1A{via} \xB7 {when}",
  "quota.plansUi.unmatchedDirs": "\u6CA1\u8FDB Paseo \u7684\u4F1A\u8BDD\u91CC\uFF0C\u82B1\u8D39\u6700\u591A\u7684\u76EE\u5F55\uFF1A{dirs}",
  "quota.reason.doubleWeekStopN": "\u53CC\u500D\u5468\u505C\u6D3E\u7EBF {n}%",
  "quota.reason.noDispatchMarker": "\u6D3E\u6D3B\u4E0D\u4F7F\u7528",
  "quota.reason.notReliedMarker": "\u6D3E\u6D3B\u4E0D\u4F9D\u8D56",
  "quota.reason.offLineN": "\u5230\u4E86 {n}% \u505C\u7528\u7EBF",
  "quota.reason.paceAtN": "\u6309\u8FDB\u5EA6\u5E94\u5728 {n}%",
  "quota.reason.planNotUsedMarker": "\u4E0D\u4F7F\u7528\u8FD9\u4E2A\u5957\u9910",
  "quota.reason.spentN": "\u7528\u4E86 {n}%",
  "quota.reason.stopAtLookbehind": "\u5269",
  "quota.reason.stopAtN": "\u5230 {n}% \u505C",
  "quota.reason.stopLineN": "\u505C\u6D3E\u7EBF {n}%",
  "quota.reason.stopRestoredN": "\u505C\u6D3E\u7EBF\u6062\u590D {n}%",
  "quota.reason.tempStopLineN": "\u5230\u4E86 {n}% \u4E34\u65F6\u505C\u6D3E\u7EBF",
  "quota.reason.usedN": "\u5DF2\u7528 {n}%",
  "quota.reason.usedPercent": "\u5DF2\u7528\u767E\u5206\u6BD4",
  "quota.reason.usedUp": "\u5DF2\u7528\u5B8C",
  "quota.reason.waitWindowMarker": "\u7B49\u7A97\u53E3\u5237\u65B0",
  "quota.ui.byModel": "\u6309\u6A21\u578B",
  "quota.ui.byRole": "\u6309\u89D2\u8272",
  "quota.ui.byRoleHint": "\u6309 Paseo \u6D3E\u51FA\u65F6\u7684\u89D2\u8272\u5F52\u7C7B",
  "quota.ui.claudeWhoHint": "\u6309\u516C\u5F00\u4EF7\u6298\u7B97\u3002\u672C\u5468\u671F\u4ECE\u6BCF\u5468\u91CD\u7F6E\u7B97\u8D77",
  "quota.ui.claudeWhoTitle": "Claude \u989D\u5EA6\u82B1\u5728\u8C01\u8EAB\u4E0A",
  "quota.ui.companiesHint": "\u6BCF\u5BB6\u516C\u53F8\u4E0B\u9762\u662F\u5B83\u81EA\u5DF1\u7684\u989D\u5EA6\u7A97\u53E3",
  "quota.ui.companiesTitle": "\u5404\u516C\u53F8\u8FD8\u5269\u591A\u5C11",
  "quota.ui.costHint": "\u8FD1 7 \u5929\u3002\u6B21\u6570\u5C11\u4E8E 3 \u6B21\u4E0D\u53D6\u5E73\u5747",
  "quota.ui.costTitle": "\u6863\u6848 \xD7 \u6DF1\u5EA6",
  "quota.ui.countedAt": "\u7EDF\u8BA1\u4E8E {ago}",
  "quota.ui.counting": "\u6B63\u5728\u7EDF\u8BA1\u7528\u91CF\u2026",
  "quota.ui.loadFailed": "\u8BFB\u53D6\u5931\u8D25\uFF1A{error}",
  "quota.ui.noUsage": "\u8FD9\u6BB5\u65F6\u95F4\u6CA1\u6709\u7528\u91CF",
  "quota.ui.paceHint": "\u76EE\u6807\u662F\u91CD\u7F6E\u524D\u7528\u5230\u8FDB\u5EA6\u7EBF\u3002\u8D85\u524D\u5C31\u5148\u505C\uFF0C\u843D\u540E\u5C31\u5148\u7528",
  "quota.ui.paceTitle": "\u6309\u8FDB\u5EA6\u6D3E\u6D3B",
  "quota.ui.plansHint": "\u989D\u5EA6\u767E\u5206\u6BD4\u6765\u81EA\u5404\u670D\u52A1\u5546\uFF1B\u91D1\u989D\u6309 API \u6807\u4EF7\u6298\u7B97",
  "quota.ui.plansTitle": "\u5957\u9910\u7528\u8DB3\u4E86\u5417",
  "quota.ui.recheck": "\u91CD\u65B0\u786E\u8BA4",
  "quota.ui.recheckCouponsA11y": "\u91CD\u65B0\u786E\u8BA4\u91CD\u7F6E\u5238",
  "quota.ui.rechecking": "\u6B63\u5728\u786E\u8BA4\u2026",
  "quota.ui.scanning": "\u6B63\u5728\u8BFB\u53D6\u672C\u673A\u8BB0\u5F55\u2026",
  "quota.ui.tierHint": "\u6267\u884C\u77E9\u9635\u91CC\u7B2C\u4E00\u4E2A\u8FD8\u80FD\u6D3E\u7684\u6863\u6848\u3002\u5269\u4E0B\u6BCF\u5929\u53EF\u7528\u9664\u4EE5\u6BCF\u6B21\u5927\u7EA6\u6D88\u8017",
  "quota.ui.tierTitle": "\u6BCF\u7EA7\u96BE\u5EA6\u6BCF\u5929\u8FD8\u80FD\u6D3E\u51E0\u5F20",
  "records.baseline": "\u4ECE {date} \u8D77\u8BB0\u5F55\u3002",
  "records.cards": "{count} \u5F20",
  "records.change.empty": "\u6682\u65E0\u8BB0\u5F55",
  "records.change.title": "\u6362\u4EBA\u8BB0\u5F55",
  "records.count": "{count} \u6761",
  "records.cursor.empty": "\u7248\u672C\u8FD8\u6CA1\u53D8\u8FC7",
  "records.cursor.title": "Cursor \u547D\u4EE4\u884C",
  "records.fresh.empty": "\u8BB0\u5F55\u5F00\u59CB\u540E\u8FD8\u6CA1\u6709\u65B0\u6A21\u578B\u51FA\u73B0\uFF08\u7B2C\u4E00\u6B21\u6253\u5F00\u65F6\u7684\u6A21\u578B\u4F5C\u4E3A\u57FA\u51C6\uFF09",
  "records.fresh.firstSeen": "{label} \xB7 \u9996\u6B21\u51FA\u73B0 {ago}",
  "records.fresh.footnote": "\u5F53\u524D\u53EF\u7528 {count} \u4E2A\uFF08{providers}\uFF09\u3002 \u6B63\u5728\u4F7F\u7528\uFF1A{models}",
  "records.fresh.loading": "\u6B63\u5728\u8BFB\u53D6\u6A21\u578B\u2026",
  "records.fresh.title": "\u65B0\u6A21\u578B",
  "records.handoff.before": " \xB7 \u6362\u4E4B\u524D {tokens}",
  "records.handoff.empty": "\u8FD8\u6CA1\u6709\u6362\u8FC7",
  "records.handoff.noNewSession": "\u6CA1\u6709\u65B0\u4F1A\u8BDD",
  "records.handoff.title": "\u6362 <leader> \u8BB0\u5F55",
  "records.kanban.title": "\u770B\u677F\u6982\u51B5",
  "records.listJoin": "\u3001",
  "records.loadingShort": "\u8BFB\u53D6\u4E2D",
  "records.merge.allReviewed": "\u2713 \u8FD1 7 \u5929\u5408\u5E76\u7684\u90FD\u6709\u4EBA\u5BA1\u8FC7",
  "records.merge.loading": "\u6B63\u5728\u8BFB\u53D6\u5408\u5E76\u8BB0\u5F55\u2026",
  "records.merge.mergedAt": "\u5408\u5E76\u4E8E {ago}",
  "records.merge.note": "\u8FD1 7 \u5929\u5408\u5E76\u3001\u4F46\u627E\u4E0D\u5230\u5BA1\u67E5\u8BB0\u5F55\u7684\u3002\u673A\u5668\u4EBA\u5F00\u7684\u4E5F\u4F1A\u5217\u51FA\u6765\uFF0C\u7531\u4F60\u5224\u65AD\u3002",
  "records.merge.open": "\u6253\u5F00 PR {number}",
  "records.merge.title": "\u6CA1\u5BA1\u5C31\u5408\u5E76",
  "records.none": "\u6CA1\u6709",
  "records.off": "\u5173",
  "records.on": "\u5F00",
  "records.overturn.summary": "\u8FD1 7 \u5929 {count} \u6761",
  "records.overturn.title": "\u5DF2\u66FF\u4F60\u51B3\u5B9A\uFF08\u53EF\u63A8\u7FFB\uFF09",
  "records.recentCount": "\u6700\u8FD1 {count} \u6761",
  "records.rolesLink.label": "\u53BB\u300C\u89D2\u8272\u300D\u9875\u6362\u4EBA",
  "records.rolesLink.text": "\u6362\u89D2\u8272\u7684\u516C\u53F8\u548C\u6A21\u578B\uFF1A\u53BB\u300C\u89D2\u8272\u300D\u9875 \u2192",
  "records.schedule.empty": "\u76EE\u524D\u6CA1\u6709\u5B9A\u65F6\u4EFB\u52A1",
  "records.schedule.idle": " \xB7 \u624B\u4E0B\u6CA1\u4EBA\u5728\u5E72\u6D3B\uFF0C\u53EF\u80FD\u5FD8\u4E86\u5220",
  "records.schedule.last": "\u4E0A\u6B21 {when}\uFF1A{result}{output}",
  "records.schedule.next": " \xB7 \u4E0B\u6B21 {when}",
  "records.schedule.owner": " \xB7 \u5C5E\u4E8E {owner}",
  "records.schedule.succeeded": "\u6210\u529F",
  "records.schedule.title": "\u5B9A\u65F6\u4EFB\u52A1",
  "records.score.empty": "\u8FD1 14 \u5929\u6CA1\u6709\u8BB0\u5F55",
  "records.score.errors": "\u51FA\u9519 {count} \u6B21",
  "records.score.interrupted": "\u7591\u4F3C\u88AB\u6253\u65AD {count} \u6B21",
  "records.score.loading": "\u6B63\u5728\u8BFB\u53D6\u6210\u7EE9\u2026",
  "records.score.note": "\u8FD1 14 \u5929\u3002\u8FD4\u4FEE\u6B21\u6570\u548C\u5BA1\u67E5\u7ED3\u8BBA\u6765\u81EA agent \u8BB0\u5F55\uFF0C\u8F83\u65E9\u7684\u8BB0\u5F55\u4F1A\u9010\u6B65\u8865\u9F50\u3002",
  "records.score.reviews": "\u5BA1\u67E5\u7ED3\u8BBA\uFF1A\u901A\u8FC7 {approved} \xB7 \u6253\u56DE {changes}",
  "records.score.runs": "{runs} \u6B21 \xB7 \u5E73\u5747 {minutes} \u5206\u949F \xB7 \u8FD4\u4FEE\u8FFD\u52A0 {followUps} \u6B21",
  "records.score.title": "\u89D2\u8272\u6210\u7EE9\u5355",
  "records.sweep.aborted": "\u672C\u8F6E\u8DF3\u8FC7",
  "records.sweep.archived": "\u5DF2\u5F52\u6863",
  "records.sweep.empty": "\u8FD8\u6CA1\u6709\u8BB0\u5F55",
  "records.sweep.failed": "\u5931\u8D25",
  "records.sweep.idleHours": " \xB7 \u95F2\u7F6E {hours} \u5C0F\u65F6",
  "records.sweep.offLabel": "\u5DF2\u5173\u95ED\uFF0C\u53EA\u8BB0\u4E0B\u672C\u6765\u4F1A\u5F52\u6863\u7684",
  "records.sweep.onLabel": "\u95F2\u7F6E\u8D85\u8FC7 24 \u5C0F\u65F6\u5C31\u5F52\u6863",
  "records.sweep.rule": "\u6267\u884C\u3001\u5BA1\u67E5\u3001\u901A\u8BFB\u3001\u51B3\u7B56\u3001\u6742\u6D3B\uFF0C\u95F2\u7F6E\u8D85\u8FC7 24 \u5C0F\u65F6\u4E14\u6CA1\u6709\u672A\u5B8C\u6210\u7684\u5361\u7247\u65F6\u624D\u6536\u3002<leader>\u3001\u8FD0\u7EF4\u548C\u81EA\u5DF1\u5F00\u7684\u5BF9\u8BDD\u4E0D\u52A8\u3002",
  "records.sweep.summary": "{count} \u6761 \xB7 {state}",
  "records.sweep.title": "\u81EA\u52A8\u5F52\u6863\u8BB0\u5F55",
  "records.sweep.turnOff": "\u5173\u95ED\u81EA\u52A8\u5F52\u6863",
  "records.sweep.turnOn": "\u6253\u5F00\u81EA\u52A8\u5F52\u6863",
  "records.sweep.wouldArchive": "\u672C\u6765\u4F1A\u5F52\u6863",
  "records.unreadable": "\u8BFB\u4E0D\u5230",
  "records.usedJoin": "\uFF0C",
  "records.waiting.title": "\u5728\u7B49\u7684\u5361",
  "roles.cards.batch": "\u6742\u6D3B",
  "roles.cards.currentModel": "\u5F53\u524D\u6A21\u578B",
  "roles.cards.decision": "\u51B3\u7B56",
  "roles.cards.executor": "\u6267\u884C",
  "roles.cards.listJoin": "\u3001",
  "roles.cards.nobody": "\u8FD8\u6CA1\u6709\u4EBA",
  "roles.cards.ops": "\u8FD0\u7EF4",
  "roles.cards.pausedUntil": "\u6682\u505C\u5230 {when}",
  "roles.cards.reader": "\u901A\u8BFB",
  "roles.cards.ready": "\u53EF\u6D3E",
  "roles.cards.reviewer": "\u5BA1\u67E5",
  "roles.cards.stopped": "\u505C\u7528",
  "roles.cards.who": "{name}\uFF08{via}\uFF09",
  "roles.history.changedSince": "\u4E4B\u540E\u53C8\u6362\u8FC7\uFF0C\u53EA\u80FD\u64A4\u9500\u6700\u8FD1\u4E00\u6B21",
  "roles.history.changedSinceNow": "\u4E4B\u540E\u53C8\u6362\u8FC7\uFF08\u73B0\u5728\u662F {spec}\uFF09\uFF0C\u53EA\u80FD\u64A4\u9500\u6700\u8FD1\u4E00\u6B21",
  "roles.history.noThinkingBefore": "\u539F\u6765\u6CA1\u6709\u8BBE\u601D\u8003\u6863\uFF0C\u9875\u9762\u6539\u4E0D\u56DE\u53BB\uFF0C\u8BF7\u5728\u7EC8\u7AEF\u7528 roles set",
  "roles.history.profileGone": "\u8FD9\u4E2A\u6863\u6848\u5DF2\u7ECF\u4E0D\u5728\u4E86",
  "roles.history.undone": "\u5DF2\u64A4\u9500",
  "roles.historyUi.cancel": "\u53D6\u6D88",
  "roles.historyUi.cancelLabel": "\u53D6\u6D88\u64A4\u9500",
  "roles.historyUi.confirm": "\u786E\u8BA4\u64A4\u9500",
  "roles.historyUi.confirmNote": "\u548C\u300C\u6362\u6A21\u578B\u300D\u4E00\u6837\u4F1A\u5148\u68C0\u67E5\uFF1B\u68C0\u67E5\u4E0D\u8FC7\u5C31\u4E0D\u4F1A\u6539\u3002",
  "roles.historyUi.confirmQuestion": "\u628A\u300C{name}\u300D\u6539\u56DE {spec}\uFF1F",
  "roles.historyUi.count": "{count} \u6761",
  "roles.historyUi.failed": "\u6CA1\u6709\u64A4\u9500\uFF1A{message}",
  "roles.historyUi.none": "\u5386\u53F2\uFF1A\u8FD8\u6CA1\u6709\u4ECE\u8FD9\u91CC\u6362\u8FC7\u6A21\u578B",
  "roles.historyUi.title": "\u5386\u53F2",
  "roles.historyUi.undo": "\u64A4\u9500",
  "roles.historyUi.undoLabel": "\u64A4\u9500\u8FD9\u6B21\u5BF9\u300C{name}\u300D\u7684\u6539\u52A8",
  "roles.historyUi.undoOf": "\u64A4\u9500 \xB7 {name}",
  "roles.historyUi.undoing": "\u6B63\u5728\u64A4\u9500\u2026",
  "roles.historyUi.undone": "\u5DF2\u64A4\u9500",
  "roles.home.empty": "\u8FD8\u8BFB\u4E0D\u5230\u89D2\u8272",
  "roles.home.hint": "\u8FD1 7 \u5929",
  "roles.home.manage": "\u7BA1\u7406\u89D2\u8272\u548C\u6A21\u578B \u2192",
  "roles.home.manageLabel": "\u53BB\u300C\u89D2\u8272\u300D\u9875\u7B7E\u7BA1\u7406\u89D2\u8272\u548C\u6A21\u578B",
  "roles.home.noCards": "\u8FD9 7 \u5929\u6CA1\u6709\u7559\u4E0B\u5361\u7247",
  "roles.home.title": "\u89D2\u8272\u548C\u5B83\u4EEC\u505A\u4E86\u4EC0\u4E48",
  "roles.home.tokens": "\u8FD1 7 \u5929 token",
  "roles.home.tokensMissing": "\u8FD1 7 \u5929 token \u8FD8\u6CA1\u7EDF\u8BA1\u5230",
  "roles.home.weekCount": "\u8FD1 7 \u5929\u505A\u4E86\u51E0\u4EF6",
  "roles.page.allPaused": "\u5168\u90E8\u6682\u505C",
  "roles.page.legacyLeader": "\u603B\u7BA1",
  "roles.page.mainProfile": "\u4E3B\u6863\u6848",
  "roles.page.noOrder": "\u6D3E\u6D3B\u77E9\u9635\u91CC\u8FD8\u6CA1\u5199\u8FD9\u4E2A\u89D2\u8272\u7684\u987A\u5E8F",
  "roles.page.noProfilesWarning": "{label} \u6CA1\u6709\u8BFB\u5230\u6863\u6848",
  "roles.page.onlyOne": "\u53EA\u6709\u8FD9\u4E00\u4E2A\u6863\u6848\uFF0C\u4E0D\u7528\u6392\u987A\u5E8F",
  "roles.page.orderFamily": "\u6267\u884C\u662F {family} \u65F6\u5148\u6D3E\uFF1A{list}",
  "roles.page.orderFlat": "\u4E0D\u5206\u96BE\u5EA6\uFF0C\u5148\u540E\u987A\u5E8F\uFF1A{list}",
  "roles.page.orderTier": "\u6309\u96BE\u5EA6\u5148\u6D3E\uFF1A{list}",
  "roles.page.patrol": "\u5DE1\u68C0",
  "roles.page.paused": "\uFF08\u6682\u505C\uFF09",
  "roles.policy.cursorNotUsed": "\u6B64\u63D0\u4F9B\u65B9\u5DF2\u5173\u95ED\u6D3E\u6D3B",
  "roles.policy.refuseBannedProvider": "afc.config.json \u7684 bannedProviders \u5DF2\u7981\u7528\u63D0\u4F9B\u5546 {provider}",
  "roles.policy.refuseProvider": "\u4E0D\u80FD\u5207\u6362\u5230\u7A7A\u63D0\u4F9B\u5546",
  "roles.policy.unknownProvider": "\u672A\u77E5\u670D\u52A1\u5546",
  "roles.policy.viaCursor": "\uFF08\u7ECF Cursor\uFF09",
  "roles.server.cannotUndo": "\u4E0D\u80FD\u64A4\u9500\uFF1A{reason}",
  "roles.server.entryMissing": "\u627E\u4E0D\u5230\u8FD9\u6761\u5386\u53F2\uFF0C\u53EF\u80FD\u5DF2\u7ECF\u88AB\u6E05\u6389",
  "roles.server.historyNotRecorded": "\uFF08\u8FD9\u6B21\u6CA1\u8BB0\u8FDB\u5386\u53F2\uFF0C\u9875\u9762\u4E0A\u64A4\u9500\u4E0D\u4E86\uFF1Broles \u81EA\u5DF1\u7684\u5907\u4EFD\u7167\u65E7\uFF09",
  "roles.server.noConfig": "\u8BFB\u4E0D\u5230 ~/.paseo/config.json\uFF0C\u6863\u6848\u5148\u4E0D\u663E\u793A",
  "roles.server.noConfigNoSwap": "\u8BFB\u4E0D\u5230 ~/.paseo/config.json\uFF0C\u6CA1\u6709\u6362",
  "roles.server.noConfigNoUndo": "\u8BFB\u4E0D\u5230 ~/.paseo/config.json\uFF0C\u6CA1\u6709\u64A4\u9500",
  "roles.server.noHistory": "\u6CA1\u6709\u5386\u53F2\u8BB0\u5F55\uFF0C\u64A4\u9500\u4E0D\u4E86",
  "roles.server.noProfile": "\u627E\u4E0D\u5230\u6863\u6848\u300C{profile}\u300D\uFF0C\u6216\u5B83\u4E0D\u662F\u53EF\u4EE5\u6362\u7684\u89D2\u8272\u6863\u6848",
  "roles.server.setFailed": "roles set \u5931\u8D25",
  "roles.server.setTimedOut": "roles set \u8D85\u65F6\uFF0C\u6CA1\u6709\u786E\u8BA4\u7ED3\u679C",
  "roles.server.swapDone": "\u5DF2\u628A\u300C{name}\u300D\u6362\u597D",
  "roles.server.undoDone": "\u5DF2\u64A4\u9500\uFF1A\u300C{name}\u300D\u6539\u56DE {spec}",
  "roles.swap.after": "\u6362\u4E4B\u540E\uFF1A{spec}",
  "roles.swap.before": "\u6362\u4E4B\u524D\uFF1A{spec}",
  "roles.swap.confirm": "\u628A\u300C{name}\u300D\u4ECE {from} \u6362\u6210 {to}",
  "roles.swap.executor": "\u6267\u884C",
  "roles.swap.familyConflict": "\u6362\u5B8C\u300C{name}\u300D\u4F1A\u662F {company}\uFF0C\u548C{opposite}\u7684\u300C{other}\u300D\uFF08{otherCompany}\uFF09\u540C\u4E00\u5BB6\uFF0C\u6267\u884C\u548C\u5BA1\u67E5\u4E0D\u80FD\u540C\u4E00\u5BB6",
  "roles.swap.reviewer": "\u5BA1\u67E5",
  "roles.swap.spec": "{provider}/{model}",
  "roles.swap.specThinking": "{provider}/{model} \xB7 \u601D\u8003 {thinking}",
  "roles.tab.cancel": "\u53D6\u6D88",
  "roles.tab.close": "\u5173\u95ED",
  "roles.tab.collapse": "\u6536\u8D77",
  "roles.tab.confirm": "\u786E\u8BA4\u6362",
  "roles.tab.confirmLabel": "\u786E\u8BA4\u6362",
  "roles.tab.confirmNote": "\u4F1A\u5148\u68C0\u67E5\u6A21\u578B\u662F\u5426\u53EF\u7528\u3001\u6267\u884C\u548C\u5BA1\u67E5\u662F\u5426\u540C\u4E00\u5BB6\uFF1B\u68C0\u67E5\u4E0D\u8FC7\u5C31\u4E0D\u4F1A\u6362\u3002",
  "roles.tab.hint": "\u6BCF\u4E2A\u89D2\u8272\u4E00\u5F20\u5361\uFF1A\u7528\u54EA\u5BB6\u989D\u5EA6\u3001\u54EA\u4E2A\u6A21\u578B\u3001\u80FD\u4E0D\u80FD\u6D3E\u3001\u8FD1 7 \u5929\u505A\u4E86\u51E0\u4EF6\uFF1B\u70B9\u300C\u6362\u6A21\u578B\u300D\u76F4\u63A5\u6362\uFF0C\u5361\u4E0B\u300C\u5386\u53F2\u300D\u53EF\u64A4\u9500",
  "roles.tab.loading": "\u6B63\u5728\u8BFB\u53D6\u89D2\u8272\u2026",
  "roles.tab.mainProfile": "\u4E3B\u6863\u6848",
  "roles.tab.modelsLoading": "\u53EF\u9009\u6A21\u578B\u8FD8\u5728\u8BFB\u53D6\uFF0C\u8BFB\u5230\u540E\u300C\u6362\u6A21\u578B\u300D\u624D\u80FD\u9009\u3002",
  "roles.tab.next": "\u4E0B\u4E00\u6B65",
  "roles.tab.nextLabel": "\u4E0B\u4E00\u6B65\uFF1A\u786E\u8BA4",
  "roles.tab.noModels": "\u8FD8\u6CA1\u8BFB\u5230\u53EF\u9009\u6A21\u578B",
  "roles.tab.noProfiles": "\u6CA1\u6709\u8BFB\u5230\u6863\u6848",
  "roles.tab.notSwapped": "\u6CA1\u6709\u6362\uFF1A{message}",
  "roles.tab.paused": "\u6682\u505C",
  "roles.tab.prefer": "\u4F18\u5148",
  "roles.tab.profiles": "{count} \u4E2A\u6863\u6848",
  "roles.tab.quota": "{quota} \u989D\u5EA6 \xB7 ",
  "roles.tab.readFailed": "\u8BFB\u53D6\u5931\u8D25\uFF1A{error}",
  "roles.tab.ready": "\u53EF\u6D3E",
  "roles.tab.runs": "\u8FD1 7 \u5929\u505A\u4E86 {week} \u4EF6 \xB7 \u4ECA\u5929\u6D3E\u4E86 {today} \u6B21 \xB7 \u8D70 {pool}",
  "roles.tab.stepCompany": "\u2460 \u9009\u516C\u53F8",
  "roles.tab.stepModel": "\u2461 \u9009\u6A21\u578B",
  "roles.tab.stepThinking": "\u2462 \u9009\u601D\u8003\u6863",
  "roles.tab.swap": "\u6362\u6A21\u578B",
  "roles.tab.swapLabel": "\u6362\u300C{name}\u300D\u7684\u6A21\u578B",
  "roles.tab.switching": "\u6B63\u5728\u6362\u2026",
  "roles.tab.thinking": " \xB7 \u601D\u8003 {thinking}",
  "roles.tab.title": "\u89D2\u8272\u3001\u989D\u5EA6\u548C\u6A21\u578B",
  "screen.fail.redactedError": "\u8BFB\u53D6\u5931\u8D25\uFF08\u8BE6\u60C5\u5DF2\u8131\u654F\uFF09",
  "screen.fail.redactedLine": "[\u5DF2\u8131\u654F]",
  "screen.leaderNote": "\u3010AFC\u3011{text}",
  "screen.loginScreen": "\u753B\u9762\u51FA\u73B0\u767B\u5F55\u5B57\u6837\uFF0C\u5DF2\u7ED3\u675F\u4F1A\u8BDD\uFF0C\u6CA1\u6709\u6309\u952E",
  "screen.match.loginScreenStuck": "\u505C\u5728\u767B\u5F55\u753B\u9762",
  "screen.run.exitCode": "{label} \u9000\u51FA\u7801 {code}",
  "screen.run.timeout": "{label} \u8D85\u65F6",
  "screen.window.quotaHidden": "\u989D\u5EA6\u4E0D\u516C\u5F00",
  "server.open.cwdMissing": "\u8FD9\u4E2A agent \u7684\u5DE5\u4F5C\u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728\uFF08{cwd}\uFF09\uFF0C\u4E3A\u907F\u514D Paseo \u51FA\u9519\uFF0C\u4E0D\u6253\u5F00\u5B83\u3002",
  "server.open.noServerId": "\u8BFB\u4E0D\u5230 ~/.paseo/server-id\uFF0C\u6253\u4E0D\u5F00\u8FD9\u4E2A agent \u7684\u94FE\u63A5",
  "server.open.noWorkspace": "\u627E\u4E0D\u5230\u8FD9\u4E2A agent \u6240\u5C5E\u7684\u9879\u76EE",
  "server.shift.notStarted": "\u6362\u73ED\u6CA1\u6709\u5F00\u59CB\uFF1A{error}",
  "shift.button.continue": "\u7EE7\u7EED",
  "shift.confirm.cardsPending": "\u8FD8\u6709 {count} \u5F20\u5361\u7B49\u5B83\u9A8C\u6536\uFF08{cards}\uFF09\uFF0C\u5EFA\u8BAE\u5148\u8BA9\u5B83\u9A8C\u6536\u5B8C\u518D\u6362\u3002",
  "shift.confirm.cardsUnreadable": "\u5F85\u9A8C\u6536\u5361\u6682\u65F6\u8BFB\u4E0D\u5230\uFF0C\u5EFA\u8BAE\u5148\u6838\u5BF9\u770B\u677F\u518D\u6362\u3002",
  "shift.confirm.question": "\u786E\u5B9A\u7ED9 {code} \u7684 <leader> \u6362\u65B0\u4F1A\u8BDD\uFF1F",
  "shift.context.amount": "{n}\u4E07",
  "shift.context.unit": "10000",
  "shift.context.unreadable": "\u4E0A\u4E0B\u6587\u8FD8\u8BFB\u4E0D\u5230",
  "shift.detail.archiveFailed": "\u5F52\u6863\u65E7\u4F1A\u8BDD\u5931\u8D25\uFF1A{error}\u3002\u65B0\u4F1A\u8BDD\u8FD8\u5728\uFF0C\u6CA1\u6709\u5220\u9664\u4EFB\u4F55\u4E1C\u897F\u3002",
  "shift.detail.askingHandover": "\u6B63\u5728\u8BF7\u65E7\u4F1A\u8BDD\u5199\u4EA4\u63A5\uFF0C\u7B49\u5B83\u56DE\u590D\u300C{done}\u300D\u3002",
  "shift.detail.cancelled": "\u5DF2\u53D6\u6D88\uFF0C\u6CA1\u6709\u6362\u3002",
  "shift.detail.detachFailed": "detach \u5931\u8D25\uFF1A{error}\u3002\u65E7\u4F1A\u8BDD\u8FD8\u5728\uFF0C\u6CA1\u6709\u5220\u9664\u4EFB\u4F55\u4E1C\u897F\u3002",
  "shift.detail.detaching": "\u6B63\u5728\u89E3\u5F00\u548C\u65E7\u4F1A\u8BDD\u7684\u7236\u5B50\u5173\u7CFB\uFF0C\u907F\u514D\u5F52\u6863\u65E7\u4F1A\u8BDD\u65F6\u65B0\u4F1A\u8BDD\u4E00\u8D77\u6D88\u5931\u3002",
  "shift.detail.done": "\u5DF2\u5B8C\u6210\u3002\u65B0\u4F1A\u8BDD\u5728\u539F\u6765\u7684 workspace \u91CC\uFF0C\u754C\u9762\u4F1A\u6253\u5F00\u5B83\u3002",
  "shift.detail.handoverTimeout": "\u4EA4\u63A5\u8D85\u8FC7 15 \u5206\u949F\uFF0C\u8FD8\u6CA1\u56DE\u590D\u300C{done}\u300D\u3002\u53EF\u4EE5\u70B9\u7EE7\u7EED\u5F00\u65B0\u4F1A\u8BDD\uFF0C\u6216\u505C\u5728\u8FD9\u91CC\u3002",
  "shift.detail.noHandoverReply": "\u8FD9\u4E00\u8F6E\u7ED3\u675F\u4E86\uFF0C\u4F46\u56DE\u590D\u91CC\u6CA1\u6709\u300C{done}\u300D\u3002\u53EF\u4EE5\u70B9\u7EE7\u7EED\u5F00\u65B0\u4F1A\u8BDD\uFF0C\u6216\u505C\u5728\u8FD9\u91CC\u3002",
  "shift.detail.noModel": "\u8BFB\u4E0D\u5230\u539F\u6765\u7684\u6A21\u578B\uFF0C\u6CA1\u6709\u5F00\u65B0\u4F1A\u8BDD\u3002",
  "shift.detail.noNewSession": "\u6CA1\u6709\u53EF\u590D\u67E5\u7684\u65B0\u4F1A\u8BDD\u3002",
  "shift.detail.noTakenReply": "\u65B0\u4F1A\u8BDD\u8FD8\u6CA1\u56DE\u590D\u300C{taken}\u300D\uFF0C\u65E7\u4F1A\u8BDD\u6CA1\u6709\u5F52\u6863\u3002",
  "shift.detail.noWorkspace": "\u627E\u4E0D\u5230\u539F\u6765\u7684 workspace\uFF0C\u6CA1\u6709\u5F00\u65B0\u4F1A\u8BDD\uFF0C\u4E5F\u6CA1\u6709\u65B0\u5EFA workspace\u3002",
  "shift.detail.notClicked": "\u6CA1\u6709\u70B9\u51FB\uFF0C\u672A\u6362\u73ED",
  "shift.detail.notFound": "\u627E\u4E0D\u5230\u8FD9\u4E2A\u4F1A\u8BDD\uFF0C\u6CA1\u6709\u53D1\u6D88\u606F\uFF0C\u4E5F\u6CA1\u6709\u5F00\u65B0\u4F1A\u8BDD\u3002",
  "shift.detail.notTaken": "{why}\u53EF\u4EE5\u70B9\u7EE7\u7EED\u518D\u67E5\u4E00\u6B21\uFF0C\u4E0D\u4F1A\u518D\u5F00\u4E00\u4E2A\u4F1A\u8BDD\u3002",
  "shift.detail.oldIdLost": "\u65E7\u4F1A\u8BDD id \u627E\u4E0D\u56DE\uFF0C\u8BF7\u4EBA\u5DE5\u5F52\u6863{which}\uFF08\u4E0D\u8981\u5F52\u6863\u65B0\u4F1A\u8BDD {newId}\uFF09\u3002\u6362\u73ED\u505C\u5728\u8FD9\u91CC\uFF0C\u6CA1\u6709\u5F52\u6863\u4EFB\u4F55\u4F1A\u8BDD\u3002",
  "shift.detail.oldSameTitle": "\u540C\u6807\u9898\u7684\u65E7\u4F1A\u8BDD",
  "shift.detail.oldTitled": "\u6807\u9898\u4E3A\u300C{title}\u300D\u7684\u65E7\u4F1A\u8BDD",
  "shift.detail.openFailed": "\u5F00\u65B0\u4F1A\u8BDD\u5931\u8D25\uFF1A{error}",
  "shift.detail.opening": "\u6B63\u5728\u539F\u6765\u7684 workspace \u91CC\u5F00\u65B0\u4F1A\u8BDD\u3002",
  "shift.detail.queueGone": "\u6392\u961F\u65F6\u627E\u4E0D\u5230\u8FD9\u4E2A\u4F1A\u8BDD\u4E86\uFF0C\u6CA1\u6709\u53D1\u6D88\u606F\uFF0C\u4E5F\u6CA1\u6709\u5F00\u65B0\u4F1A\u8BDD\u3002",
  "shift.detail.recheckFailed": "\u590D\u67E5\u63A5\u624B\u5931\u8D25\uFF1A{error}\u3002\u65E7\u4F1A\u8BDD\u8FD8\u5728\u3002",
  "shift.detail.sameId": "\u65E7\u4F1A\u8BDD id \u548C\u65B0\u4F1A\u8BDD id \u76F8\u540C\uFF0C\u65E0\u6CD5\u786E\u8BA4\u8981\u5F52\u6863\u7684\u65E7\u4F1A\u8BDD\u3002\u6362\u73ED\u505C\u5728\u8FD9\u91CC\uFF0C\u6CA1\u6709\u5F52\u6863\u4EFB\u4F55\u4F1A\u8BDD\u3002",
  "shift.detail.sendFailed": "\u53D1\u7ED9\u65E7\u4F1A\u8BDD\u5931\u8D25\uFF1A{why}",
  "shift.detail.takenNotRegistered": "\u65B0\u4F1A\u8BDD\u8BF4{taken}\uFF0C\u4F46\u767B\u8BB0\u8FD8\u4E0D\u662F\u65B0 id\uFF0C\u65E7\u4F1A\u8BDD\u6CA1\u6709\u5F52\u6863\u3002",
  "shift.detail.waiting": "\u7B49\u65B0\u4F1A\u8BDD\u56DE\u590D\u300C{taken}\u300D\uFF0C\u5E76\u7B49\u767B\u8BB0\u6539\u6210\u65B0 id\u3002",
  "shift.detail.wrongWorkspace": "\u65B0\u4F1A\u8BDD\u843D\u5728\u4E86\u522B\u7684 workspace\uFF08{workspace}\uFF09\uFF0C\u6CA1\u6709\u5F52\u6863\u65E7\u4F1A\u8BDD\uFF0C\u4E5F\u6CA1\u6709\u518D\u65B0\u5EFA\u3002",
  "shift.elapsed.days": "\u5DF2 {days} \u5929",
  "shift.elapsed.daysHours": "\u5DF2 {days} \u5929 {hours} \u5C0F\u65F6",
  "shift.elapsed.hours": "\u5DF2 {hours} \u5C0F\u65F6",
  "shift.elapsed.minutes": "\u5DF2 {minutes} \u5206\u949F",
  "shift.elapsed.underMinute": "\u5DF2\u4E0D\u5230 1 \u5206\u949F",
  "shift.handover.ask": "\u3010\u6362\u73ED\u3011\u5148\u628A\u5F85\u9A8C\u6536\u7684\u5361\u5904\u7406\u5B8C\uFF08\u9A8C\u6536\u6216 rework\uFF09\uFF0C\u5904\u7406\u4E0D\u4E86\u7684\u628A\u5361\u53F7\u548C\u539F\u56E0\u5199\u8FDB\u4EA4\u63A5\u6587\u4EF6\u300E\u5728\u7B49\u8C01\u300F\u3002\u8BF7\u628A\u73B0\u72B6\u5199\u8FDB\u4F60\u4ED3\u5E93\u7684\u4EA4\u63A5\u6587\u4EF6\uFF08\u6709 docs/STATUS.md \u5C31\u5199\u5B83\u7684\u300E\u73B0\u5728\u5728\u505A\u4EC0\u4E48\u3001\u5728\u7B49\u8C01\u300F\u4E00\u8282\uFF1B\u6CA1\u6709\u5C31\u5728\u4ED3\u5E93\u6839\u76EE\u5F55\u5199 HANDOVER.md\uFF09\uFF0C\u8FD9\u4E00\u8282\u6309\u4E94\u680F\u5199\uFF1A\u5DF2\u843D\u5730\uFF08\u9644\u5361\u53F7\u6216\u63D0\u4EA4\u53F7\uFF09\uFF0F\u574F\u4E86\uFF0F\u672A\u9A8C\u8BC1\uFF08\u8BF4\u505A\u4E86\u4F46\u6CA1\u4EBA\u72EC\u7ACB\u6D4B\u8FC7\uFF09\uFF0F\u5F85\u505A\uFF08\u7528\u6237\u8981\u6C42\u4E86\u4F46\u8FD8\u6CA1\u505A\uFF09\uFF0F\u6B7B\u8DEF\uFF08\u8BD5\u8FC7\u653E\u5F03\u4E86\uFF0B\u539F\u56E0\uFF09\u3002\u6BCF\u6761\u5FC5\u987B\u9644\u5361\u53F7\u3001\u63D0\u4EA4\u53F7\u6216\u5F85\u62CD\u677F\u7F16\u53F7\uFF0C\u6CA1\u6709\u8BC1\u636E\u7684\u4E0D\u5199\uFF1B\u5386\u53F2\u7559\u7ED9 git\uFF0C\u4E0D\u5F80\u91CC\u5806\uFF1B\u540C\u4E00\u4EF6\u4E8B\u53EA\u5199\u4E00\u6761\u3002\u5199\u5B8C\u63D0\u4EA4\uFF0C\u56DE\u590D\u300E{done}\u300F\u540E\u505C\u624B\uFF0C\u4E0D\u518D\u5F00\u65B0\u6D3B\u3002",
  "shift.handover.sectionMarker": "\u73B0\u5728\u5728\u505A\u4EC0\u4E48",
  "shift.headline.failed": "\u4E0A\u6B21\u7ED9 {name} \u6362 <leader> \u5931\u8D25\uFF1A{reason}",
  "shift.headline.running": "\u6B63\u5728\u7ED9 {name} \u6362 <leader>\uFF1A{label}",
  "shift.lamp.suggest": "\u5EFA\u8BAE\u6362\u73ED",
  "shift.list.separator": "\u3001",
  "shift.phase.cancelled": "\u5DF2\u53D6\u6D88",
  "shift.phase.done": "\u5DF2\u5B8C\u6210",
  "shift.phase.failed": "\u5931\u8D25",
  "shift.phase.handover": "\u4EA4\u63A5\u4E2D",
  "shift.phase.opening": "\u5F00\u65B0\u4F1A\u8BDD",
  "shift.phase.queued": "\u6392\u961F\u4E2D",
  "shift.phase.waiting": "\u7B49\u63A5\u624B",
  "shift.queue.detail": "\u6392\u961F\u4E2D\uFF1A\u7B49\u5B83\u8BF4\u5B8C\u8FD9\u53E5\u5C31\u6362",
  "shift.queue.timeoutDetail": "\u6392\u961F\u8D85\u8FC7 30 \u5206\u949F\uFF0C\u5B83\u8FD9\u4E00\u8F6E\u8FD8\u6CA1\u7ED3\u675F\uFF0C\u6CA1\u6709\u6362\u3002",
  "shift.reply.handoverDone": "\u4EA4\u63A5\u597D\u4E86",
  "shift.reply.takenOver": "\u5DF2\u63A5\u624B",
  "shift.result.archiveFailed": "\u5F52\u6863\u5931\u8D25",
  "shift.result.detachFailed": "detach \u5931\u8D25",
  "shift.result.done": "\u5DF2\u5B8C\u6210",
  "shift.result.handoverTimeout": "\u4EA4\u63A5\u8D85\u65F6",
  "shift.result.noHandoverReply": "\u6CA1\u770B\u5230{done}",
  "shift.result.noModel": "\u8BFB\u4E0D\u5230\u6A21\u578B",
  "shift.result.noNewSession": "\u6CA1\u6709\u65B0\u4F1A\u8BDD",
  "shift.result.noWorkspace": "\u6CA1\u6709 workspace",
  "shift.result.notFound": "\u627E\u4E0D\u5230\u4F1A\u8BDD",
  "shift.result.notTaken": "\u8FD8\u6CA1\u63A5\u624B",
  "shift.result.oldIdLost": "\u65E7\u4F1A\u8BDD id \u627E\u4E0D\u56DE\uFF0C\u9700\u4EBA\u5DE5\u5F52\u6863",
  "shift.result.openFailed": "\u5F00\u65B0\u4F1A\u8BDD\u5931\u8D25",
  "shift.result.queueTimeout": "\u6392\u961F\u8D85\u65F6\uFF0C\u672A\u6362",
  "shift.result.recheckFailed": "\u590D\u67E5\u5931\u8D25",
  "shift.result.sameId": "\u65E7\u65B0\u4F1A\u8BDD id \u76F8\u540C\uFF0C\u672A\u5B8C\u6210",
  "shift.result.sendFailed": "\u4EA4\u63A5\u53D1\u9001\u5931\u8D25",
  "shift.result.wrongWorkspace": "workspace \u4E0D\u4E00\u81F4",
  "shift.server.alreadyRunning": "\u8FD9\u4E00\u8F6E\u5DF2\u7ECF\u5728\u6362\uFF0C\u6CA1\u6709\u518D\u5F00\u4E00\u4E2A\u3002",
  "shift.server.cancelling": "\u6B63\u5728\u53D6\u6D88\u3002",
  "shift.server.cancellingAfterCheck": "\u6B63\u5728\u53D6\u6D88\uFF0C\u7B49\u8FD9\u4E00\u773C\u770B\u5B8C\u5C31\u505C\u3002",
  "shift.server.checkingBusy": "\u6B63\u5728\u770B\u5B83\u73B0\u5728\u5FD9\u4E0D\u5FD9\u3002",
  "shift.server.interrupted": "\u6362\u73ED\u4E2D\u65AD\uFF1A{error}",
  "shift.server.notRegistered": "\u767B\u8BB0\u91CC\u6CA1\u6709\u8FD9\u4E2A\u9879\u76EE\u3002",
  "shift.server.nothingToContinue": "\u73B0\u5728\u6CA1\u6709\u53EF\u4EE5\u7EE7\u7EED\u7684\u6362\u73ED\u3002",
  "shift.server.oldSessionError": "\u65E7\u4F1A\u8BDD\u62A5\u9519",
  "shift.started": "{clock} \u5F00\u59CB\uFF0C{elapsed}",
  "shift.started.unreadable": "\u5F00\u59CB\u65F6\u95F4\u8FD8\u8BFB\u4E0D\u5230",
  "shift.takeover.body": "\u4F60\u662F <leader> \xB7 {project} \u7684\u65B0\u4F1A\u8BDD\uFF0C\u63A5\u66FF\u65E7\u4F1A\u8BDD {oldId}\uFF08\u7528\u6237\u5728 AFC \u9996\u9875\u70B9\u4E86\u6362\u73ED\uFF09\u3002\u5148\u8BFB\u4EA4\u63A5\u6587\u4EF6\u548C ~/.claude/CLAUDE.md\uFF0C\u6309\u9879\u76EE STATUS \u91CC\u7684\u300E\u4F1A\u8BDD\u5207\u6362\u300F\u505A\uFF1Akanban supervise \u767B\u8BB0\u3001\u91CD\u5EFA\u4F60\u540D\u4E0B\u7684 heartbeat\u3001\u628A\u65B0 id \u544A\u8BC9 Kanban <leader> \u548C\u76F8\u5173 <leader>\uFF1B\u786E\u8BA4\u63A5\u624B\u540E\u56DE\u590D\u300E{taken}\u300F\u3002\u65E7\u4F1A\u8BDD\u7531 AFC \u5F52\u6863\uFF0C\u4F60\u4E0D\u7528\u7BA1\u3002",
  "shift.takeover.cards": "\u5F53\u65F6\u672C\u9879\u76EE\u5F85\u9A8C\u6536\u5361\uFF08{count} \u5F20\uFF09\uFF1A{cards}\u3002\u767B\u8BB0\u63A5\u624B\u540E\u5148\u5904\u7406\u8FD9\u4E9B\u5361\uFF08\u9A8C\u6536\u6216 rework\uFF09\uFF0C\u5904\u7406\u4E0D\u4E86\u7684\u628A\u5361\u53F7\u548C\u539F\u56E0\u5199\u8FDB\u4EA4\u63A5\u6587\u4EF6\u300E\u5728\u7B49\u8C01\u300F\u3002",
  "shift.takeover.cardsUnreadable": "\u5F85\u9A8C\u6536\u5361\u6682\u65F6\u8BFB\u4E0D\u5230\uFF1B\u767B\u8BB0\u63A5\u624B\u540E\u5148\u67E5\u8BE2\u672C\u9879\u76EE\u7684\u5F85\u9A8C\u6536\u5361\uFF0C\u4F18\u5148\u9A8C\u6536\u6216 rework\u3002",
  "shift.takeover.emptyFile": "\uFF08\u4EA4\u63A5\u6587\u4EF6\u8FD8\u6CA1\u6709\u5185\u5BB9\uFF09",
  "shift.takeover.message": "{body}\n\n{acceptance}\n\n\u4EA4\u63A5\u6587\u4EF6\uFF1A{path}\n\u6458\u8981\uFF1A\n{summary}",
  "shift.takeover.noCards": "\u5F53\u65F6\u672C\u9879\u76EE\u6CA1\u6709\u5F85\u9A8C\u6536\u5361\uFF1B\u767B\u8BB0\u63A5\u624B\u540E\u5148\u6838\u5BF9\u770B\u677F\u6709\u65E0\u65B0\u589E\u5F85\u9A8C\u6536\u5361\u3002",
  "shift.takeover.noFile": "\uFF08\u4EA4\u63A5\u6587\u4EF6\u8FD8\u6CA1\u627E\u5230\uFF09",
  "shift.todayUsd": "\u4ECA\u5929\u7EA6 ${usd}",
  "shift.ui.againA11y": "\u518D\u6362\u4E00\u6B21",
  "shift.ui.cancel": "\u53D6\u6D88",
  "shift.ui.cancelA11y": "\u53D6\u6D88\u6362\u73ED",
  "shift.ui.cancelQueueA11y": "\u53D6\u6D88\u6392\u961F",
  "shift.ui.confirm": "\u786E\u5B9A",
  "shift.ui.confirmA11y": "\u786E\u5B9A\u7ED9 {code} \u6362\u73ED",
  "shift.ui.continueA11y": "\u7EE7\u7EED\u6362\u73ED",
  "shift.ui.failedLine": "{label}\uFF1A{detail}",
  "shift.ui.hideHandover": "\u6536\u8D77\u4EA4\u63A5",
  "shift.ui.noHandoverFile": "\u8FD8\u6CA1\u6709\u4EA4\u63A5\u6587\u4EF6",
  "shift.ui.retry": "\u91CD\u8BD5",
  "shift.ui.retryA11y": "\u91CD\u8BD5\u6362\u73ED",
  "shift.ui.showHandover": "\u770B\u4EA4\u63A5",
  "shift.ui.start": "\u6362 <leader>",
  "shift.ui.startA11y": "\u7ED9 {code} \u6362 <leader>",
  "shift.ui.starting": "\u6B63\u5728\u53D1\u8D77\u2026",
  "shift.view.continuing": "\u6B63\u5728\u7EE7\u7EED\u3002",
  "shift.view.retrying": "\u6B63\u5728\u91CD\u8BD5\u3002",
  "shift.view.starting": "\u6B63\u5728\u5F00\u59CB\u4EA4\u63A5\u3002",
  "snapshot.agentsReadFailed": "\u8BFB\u53D6 Paseo agent \u5931\u8D25\uFF1A{error}",
  "snapshot.alertKind.awaitingApproval": "\u7B49\u5F85\u6279\u51C6",
  "snapshot.alertKind.error": "\u51FA\u9519",
  "snapshot.alertKind.maybeStuck": "\u53EF\u80FD\u5361\u4F4F",
  "snapshot.alertKind.restartInterrupted": "\u53EF\u80FD\u88AB\u91CD\u542F\u6253\u65AD",
  "snapshot.couponsUnread": "\u91CD\u7F6E\u5238\u63D0\u9192\u8FD9\u4E00\u8F6E\u6CA1\u8BFB\u5230",
  "snapshot.crashesUnread": "\u540E\u53F0\u5D29\u6E83\u8BB0\u5F55\u8FD9\u4E00\u8F6E\u6CA1\u8BFB\u5230",
  "snapshot.cursorLoginUnread": "Cursor \u767B\u5F55\u72B6\u6001\u8FD9\u4E00\u8F6E\u6CA1\u8BFB\u5230",
  "snapshot.errorSuffix": "\uFF1A{error}",
  "snapshot.kanbanBlocked.detail": "{why}{reason}\u3002\u5728 Paseo Kanban \u91CC\u89E3\u9664\u5361\u4F4F\u3002",
  "snapshot.kanbanBlocked.noReason": "\u672A\u5199\u660E",
  "snapshot.kanbanBlocked.reason": "\u5361\u4F4F\u539F\u56E0\uFF1A",
  "snapshot.kanbanBlocked.reasonWithKind": "\u5361\u4F4F\u539F\u56E0\uFF08{kind}\uFF09\uFF1A",
  "snapshot.kanbanBlocked.title": "{code} {title}\uFF08Kanban \u5361\u4F4F\uFF09",
  "snapshot.keychainUnread": "\u94A5\u5319\u4E32\u63A2\u9488\u8FD9\u4E00\u8F6E\u6CA1\u8BFB\u5230",
  "snapshot.legacyLeaderName": "\u603B\u7BA1",
  "snapshot.permitAction": "\u64CD\u4F5C",
  "snapshot.permitRequest": "{title}\uFF1A\u8BF7\u6C42 {tool}",
  "snapshot.permitsFormatChanged": "\u5F85\u6279\u51C6\u5217\u8868\u683C\u5F0F\u53D8\u4E86\uFF0C\u8FD9\u4E00\u8F6E\u4E0D\u663E\u793A\u7B49\u5F85\u6279\u51C6",
  "snapshot.quietFor": "{title}\uFF1A{minutes} \u5206\u949F\u6CA1\u6709\u52A8\u9759",
  "snapshot.recordsReadFailed": "\u8BFB\u53D6 agent \u8BB0\u5F55\u5931\u8D25\uFF1A{error}",
  "snapshot.restartInterrupted": "{title}\uFF08Paseo \u4E8E {time} \u91CD\u542F\u524D\u540E\u505C\u6B62\uFF0C\u8BF7\u8BA9 <leader> \u786E\u8BA4\u662F\u5426\u9700\u8981\u7EED\u505A\uFF09",
  "snapshot.role.mode": "\u6A21\u5F0F {value}",
  "snapshot.role.thinking": "\u601D\u8003 {value}",
  "snapshot.roleProfileMissing": "\u7F3A\u5C11\u89D2\u8272\u6863\u6848\uFF1A{role}",
  "snapshot.schedulesFormatChanged": "\u5B9A\u65F6\u4EFB\u52A1\u5217\u8868\u683C\u5F0F\u53D8\u4E86\uFF0C\u8FD9\u4E00\u8F6E\u4E0D\u663E\u793A",
  "snapshot.schedulesReadFailed": "\u8BFB\u53D6\u5B9A\u65F6\u4EFB\u52A1\u5931\u8D25\uFF0C\u8FD9\u4E00\u8F6E\u8DF3\u8FC7",
  "snapshot.unread.detail": "\u5B83\u56DE\u590D\u4E86\uFF0C\u4F60\u8FD8\u6CA1\u770B\uFF1B\u53EF\u80FD\u5305\u542B\u9700\u8981\u4F60\u51B3\u5B9A\u7684\u4E8B",
  "snapshot.unread.source": "\u672A\u8BFB\u56DE\u590D",
  "snapshot.unread.title": "{title} \u6709\u672A\u8BFB\u56DE\u590D",
  "sweep.archiveFailed": "\u5F52\u6863\u5931\u8D25",
  "sweep.idleReason": "\u95F2\u7F6E {hours} \u5C0F\u65F6\uFF0C\u72B6\u6001 {status}",
  "sweep.kanbanUnreadable": "kanban.db \u8BFB\u4E0D\u5230\uFF0C\u672C\u8F6E\u4E0D\u5F52\u6863",
  "sweep.noResponse60s": "60 \u79D2\u65E0\u54CD\u5E94",
  "sweep.pendingNotList": "\u8BFB\u4E0D\u5230\u5F85\u6279\u51C6\u5217\u8868\uFF08\u8FD4\u56DE\u4E0D\u662F\u5217\u8868\uFF09\uFF0C\u672C\u8F6E\u4E0D\u5F52\u6863",
  "sweep.pendingUnreadable": "\u8BFB\u4E0D\u5230\u5F85\u6279\u51C6\u5217\u8868\uFF0C\u672C\u8F6E\u4E0D\u5F52\u6863\uFF1A{error}",
  "sweep.switchOff": "\u5F00\u5173\u5DF2\u5173\uFF0C\u53EA\u8BB0\u5F55\u5019\u9009",
  "sweep.timedOut": "\u8D85\u65F6\uFF0C\u5DF2\u8DF3\u8FC7\uFF1A{error}",
  "sweep.title.close": "\u3011",
  "sweep.title.open": "\u3010",
  "tabs.a11y": "{label}\uFF0C{count} \u9879",
  "tabs.access": "\u6743\u9650",
  "tabs.overview": "\u603B\u89C8",
  "tabs.quota": "\u989D\u5EA6",
  "tabs.records": "\u8BB0\u5F55",
  "tabs.roles": "\u89D2\u8272",
  "tabs.usage": "\u7528\u91CF",
  "tokens.day.today": "\u4ECA\u5929",
  "tokens.share.batch": "\u6742\u6D3B",
  "tokens.share.decision": "\u51B3\u7B56",
  "tokens.share.executor": "\u6267\u884C",
  "tokens.share.leader": "<leader>",
  "tokens.share.ops": "\u8FD0\u7EF4",
  "tokens.share.outside": "\u4E0D\u5728 Paseo \u91CC\u7684",
  "tokens.share.personal": "\u7528\u6237\u81EA\u5DF1\u7684\u5BF9\u8BDD",
  "tokens.share.reader": "\u901A\u8BFB",
  "tokens.share.reviewer": "\u5BA1\u67E5",
  "tokens.unit.billion": "{n}B",
  "tokens.unit.million": "{n}M",
  "tokens.unit.thousand": "{n}K",
  "tokens.unit.wan": "{n}\u4E07",
  "tokens.unit.yi": "{n}\u4EBF",
  "ui.agentStatus.closed": "\u5DF2\u5173\u95ED",
  "ui.agentStatus.error": "\u51FA\u9519",
  "ui.agentStatus.finished": "\u5DF2\u5B8C\u6210",
  "ui.agentStatus.idle": "\u7A7A\u95F2",
  "ui.agentStatus.running": "\u8FD0\u884C\u4E2D",
  "ui.agentStatus.starting": "\u542F\u52A8\u4E2D",
  "ui.fold.collapseLabel": "\u6536\u8D77{title}",
  "ui.fold.collapsedSuffix": " \xB7 \u6536\u8D77",
  "ui.fold.expandLabel": "\u5C55\u5F00{title}\uFF0C{summary}",
  "ui.open": "\u6253\u5F00",
  "ui.segmented.optionLabel": "{label}\uFF1A{option}",
  "ui.time.ago": "{span}\u524D",
  "ui.time.days": "{n} \u5929",
  "ui.time.hours": "{n} \u5C0F\u65F6",
  "ui.time.later": "{span}\u540E",
  "ui.time.minutes": "{n} \u5206\u949F",
  "ui.time.underMinute": "\u4E0D\u5230 1 \u5206\u949F",
  "upgrade.alert.failed": "{label}\uFF1A{conclusion}{who}",
  "upgrade.alert.missing": "{label}\uFF1A\u672A\u63D0\u4F9B\u517C\u5BB9\u68C0\u67E5",
  "upgrade.alert.nobody": "\uFF08\u65E0\u4EBA\u63A5\uFF09",
  "upgrade.alert.notSent": "\uFF08\u901A\u77E5\u6CA1\u53D1\u51FA\u53BB\uFF09",
  "upgrade.conclusion.failed": "\u517C\u5BB9\u68C0\u67E5\u5931\u8D25",
  "upgrade.conclusion.missing": "\u672A\u63D0\u4F9B\u517C\u5BB9\u68C0\u67E5",
  "upgrade.conclusion.passed": "\u517C\u5BB9\u68C0\u67E5\u901A\u8FC7",
  "upgrade.conclusion.timedOut": "\u517C\u5BB9\u68C0\u67E5\u8D85\u65F6\uFF08\u8D85\u8FC7 10 \u5206\u949F\uFF09",
  "upgrade.handoffMark.supervisor": "\u603B\u7BA1",
  "upgrade.handoffMark.takeover": "\u63A5\u624B",
  "upgrade.notice.failure": "\u3010AFC\u3011{change}\u3002{label} \u7684\u517C\u5BB9\u68C0\u67E5\u5931\u8D25\uFF1A{conclusion}\u3002\u8BF7\u6309\u8BE5\u63D2\u4EF6\u7684 PASEO-DEPENDENCIES.md \u9010\u9879\u4FEE\uFF0Cnpm run compat \u901A\u8FC7\u540E\u518D paseo plugin reload\u3002",
  "upgrade.notice.version": "Paseo \u7248\u672C {to}",
  "upgrade.notice.versionChange": "Paseo \u4ECE {from} \u5347\u5230 {to}",
  "upgrade.reason.changed": "\u7248\u672C\u5DF2\u53D8",
  "upgrade.reason.firstSeen": "\u9996\u6B21\u53EA\u8BB0\u7248\u672C",
  "upgrade.reason.manual": "\u624B\u52A8\u68C0\u67E5",
  "upgrade.reason.noVersion": "\u8BFB\u4E0D\u5230 Paseo \u7248\u672C",
  "upgrade.reason.unchanged": "\u7248\u672C\u672A\u53D8",
  "upgrade.watch.noNpm": "\u627E\u4E0D\u5230 npm\uFF0C\u6CA1\u6CD5\u8DD1\u517C\u5BB9\u68C0\u67E5",
  "upgrade.watch.running": "\u6B63\u5728\u68C0\u67E5\u4E09\u4E2A\u63D2\u4EF6",
  "upgrade.watch.startedForce": "\u5DF2\u5F00\u59CB\u68C0\u67E5\u4E09\u4E2A\u63D2\u4EF6\uFF0C\u7ED3\u679C\u4F1A\u51FA\u73B0\u5728\u62A5\u8B66\u91CC",
  "upgrade.watch.startedQuiet": "\u5DF2\u5F00\u59CB\u6838\u5BF9 Paseo \u7248\u672C",
  "upgrade.workerRole.batch": "\u6742\u6D3B",
  "upgrade.workerRole.decision": "\u51B3\u7B56",
  "upgrade.workerRole.executor": "\u6267\u884C",
  "upgrade.workerRole.reader": "\u901A\u8BFB",
  "upgrade.workerRole.reviewer": "\u5BA1\u67E5",
  "usage.balance.note": "Paseo \u8BFB\u5230\uFF1A\u672C\u671F\u6309 API \u4EF7\u6298\u7B97\u5DF2\u82B1 {used}\uFF0C\u5957\u9910\u989D\u5EA6 {limit}\uFF08\u4E0D\u5206\u989D\u5EA6\u5757\uFF0C\u4EC5\u4F9B\u53C2\u8003\uFF09{billing}",
  "usage.balance.overageOff": "\uFF1B\u672A\u5F00\u6309\u91CF\u4ED8\u8D39",
  "usage.balance.overageOn": "\uFF1B\u5DF2\u5F00\u6309\u91CF\u4ED8\u8D39",
  "usage.model.estimated": " \xB7 \u7528\u91CF\u4E3A\u4F30\u7B97\uFF08\u670D\u52A1\u5546\u4E0D\u62A5 token\uFF0C\u53EA\u7B97\u8F93\u51FA\uFF09",
  "usage.model.noPrice": "\u65E0\u4EF7\u683C",
  "usage.pace.ahead": "\u8D85\u524D\u9650\u6D3E",
  "usage.pace.behind": "\u843D\u540E\u4F18\u5148\u7528",
  "usage.pace.normal": "\u6B63\u5E38",
  "usage.pace.stopped": "\u505C\u7528",
  "usage.plan.notFound": "\u6CA1\u6709\u8FD9\u4E2A\u5957\u9910\uFF1A{id}",
  "usage.plan.saved": "\u5DF2\u4FDD\u5B58",
  "usage.role.outside": "\u4F60\u5728 Paseo \u5916\u76F4\u63A5\u7528\uFF08\u7EC8\u7AEF\u3001\u684C\u9762\u7AEF\u7B49\uFF09",
  "usage.role.paseoOther": "\u4F60\u5728 Paseo \u91CC\u7684\u5176\u4ED6\u5BF9\u8BDD",
  "usage.timeout": "{what} \u8D85\u8FC7 {seconds} \u79D2\u6CA1\u6709\u56DE\u5E94",
  "usage.view.loginScreenMarker": "\u767B\u5F55\u753B\u9762",
  "usage.warn.firstScan": "\u7B2C\u4E00\u6B21\u7EDF\u8BA1\u8981\u628A\u672C\u673A\u8FD1 40 \u5929\u7684\u8BB0\u5F55\u5168\u90E8\u8BFB\u4E00\u904D\uFF0C\u9700\u8981\u4E00\u4E24\u5206\u949F\uFF0C\u8BFB\u5B8C\u4F1A\u81EA\u52A8\u663E\u793A",
  "usage.warn.listJoin": "\u3001",
  "usage.warn.missingPrice": "\u8FD9\u4E9B\u5957\u9910\u8FD8\u6CA1\u586B\u6708\u8D39\uFF0C\u65E0\u6CD5\u7B97\u56DE\u672C\u500D\u6570\uFF1A{plans}",
  "usage.warn.quotaUnread": "\u8BFB\u4E0D\u5230\u5404\u670D\u52A1\u5546\u7684\u989D\u5EA6\uFF08{error}\uFF09\uFF0C\u989D\u5EA6\u767E\u5206\u6BD4\u6682\u7F3A\uFF0C\u989D\u5EA6\u5FEB\u7167\u8FD9\u4E00\u8F6E\u4E0D\u66F4\u65B0",
  "usage.warn.unpriced": "\u8FD9\u4E9B\u6A21\u578B\u5728\u516C\u5F00\u4EF7\u76EE\u8868\u91CC\u627E\u4E0D\u5230\u4EF7\u683C\uFF0C\u672A\u8BA1\u5165\u91D1\u989D\uFF1A{models}\uFF08\u53EF\u5728 plans.json \u7684 prices \u91CC\u8865\uFF09",
  "quota.adapters.muse": "Muse",
  "quota.adapters.opencodeGo": "OpenCode Go",
  "quota.plans.window.rolling": "\u6EDA\u52A8\u7A97\u53E3",
  "quota.plans.window.current": "\u5F53\u524D\u7A97\u53E3",
  "quota.plans.window.hours": "{count} \u5C0F\u65F6\u7A97\u53E3",
  "quota.plans.window.minutes": "{count} \u5206\u949F\u7A97\u53E3",
  "quota.plans.window.days": "{count} \u5929\u7A97\u53E3",
  "settings.title": "\u673A\u7FA4\u8BBE\u7F6E",
  "settings.intro": "\u7F16\u8F91\u5404\u90E8\u5206\u540E\u4FDD\u5B58\u3002\u5237\u65B0\u4F1A\u653E\u5F03\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\u3002",
  "settings.general": "\u901A\u7528\u8BBE\u7F6E",
  "settings.plans": "\u989D\u5EA6\u6C60",
  "settings.loading": "\u6B63\u5728\u8BFB\u53D6\u8BBE\u7F6E\u2026",
  "settings.on": "\u5F00\u542F",
  "settings.off": "\u5173\u95ED",
  "settings.language": "\u8BED\u8A00",
  "settings.lang.system": "\u8DDF\u968F\u7CFB\u7EDF",
  "settings.lang.en": "\u82F1\u8BED",
  "settings.lang.zh-CN": "\u7B80\u4F53\u4E2D\u6587",
  "settings.hiddenHint": "\u53EA\u9690\u85CF\u5339\u914D\u7684\u989D\u5EA6\u5361\uFF0C\u4E0D\u5F71\u54CD\u6D3E\u6D3B\u548C\u6863\u6848\u5217\u8868\u3002",
  "settings.banned": "\u4E0D\u6D3E\u6D3B\u7684\u670D\u52A1",
  "settings.bannedHint": "\u8FD9\u4E9B\u670D\u52A1\u4E0D\u63A5\u6536\u6D3E\u6D3B\uFF0C\u4E5F\u4E0D\u8FDB\u5165\u6863\u6848\u5217\u8868\u3002\u4E0E\u9690\u85CF\u989D\u5EA6\u6C60\u5173\u952E\u8BCD\u4E0D\u540C\uFF0C\u8FD9\u4F1A\u6539\u53D8\u6D3E\u6D3B\u89C4\u5219\uFF0C\u800C\u4E0D\u53EA\u662F\u989D\u5EA6\u5361\u7684\u663E\u793A\u3002",
  "settings.provider": "\u670D\u52A1 ID",
  "settings.addProvider": "\u6DFB\u52A0\u670D\u52A1",
  "settings.removeProvider": "\u79FB\u9664 {provider}",
  "settings.hidden": "\u9690\u85CF\u989D\u5EA6\u6C60\u7684\u5173\u952E\u8BCD\uFF08\u9017\u53F7\u5206\u9694\uFF09",
  "settings.adapters": "\u53EF\u9009\u9002\u914D\u5668",
  "settings.cursor": "Cursor \u7528\u91CF API",
  "settings.keychain": "\u94A5\u5319\u4E32\u5B58\u5728\u68C0\u67E5",
  "settings.reloadHint": "\u5237\u65B0\u540E\u9762\u677F\u8BED\u8A00\u751F\u6548\u3002\u9002\u914D\u5668\u5B9A\u65F6\u5668\u5728\u4E0B\u6B21\u63D2\u4EF6\u52A0\u8F7D\u65F6\u66F4\u65B0\u3002\u5BBF\u4E3B\u6807\u9898\u4FDD\u7559\u8BBE\u7F6E\u9875\u6CE8\u518C\u65F6\u5DF2\u77E5\u7684\u8BED\u8A00\u3002",
  "settings.saved": "\u5DF2\u4FDD\u5B58\u3002",
  "settings.conflict": "\u6587\u4EF6\u5DF2\u88AB\u5176\u4ED6\u64CD\u4F5C\u4FEE\u6539\uFF0C\u672C\u6B21\u7F16\u8F91\u672A\u4FDD\u5B58\u3002\u8BF7\u5237\u65B0\u8BFB\u53D6\u6700\u65B0\u7248\u672C\u540E\u91CD\u65B0\u7F16\u8F91\u3002",
  "settings.error": "\u65E0\u6CD5\u8BFB\u53D6\u6216\u4FDD\u5B58\u8BBE\u7F6E\uFF1A{error}",
  "settings.save": "\u4FDD\u5B58",
  "settings.refresh": "\u5237\u65B0",
  "settings.add": "\u6DFB\u52A0\u989D\u5EA6\u6C60",
  "settings.remove": "\u79FB\u9664\u989D\u5EA6\u6C60",
  "settings.priority": "\u6D3E\u6D3B\u4F18\u5148\u987A\u5E8F",
  "settings.priorityHint": "\u6309\u4F18\u5148\u987A\u5E8F\u8F93\u5165\u989D\u5EA6\u6C60\u6807\u8BC6\u53CA\u6709\u6548\u671F\u3002\u6E05\u9664\u8986\u76D6\u503C\u53EF\u6062\u590D\u989D\u5EA6\u987A\u5E8F\u3002",
  "settings.order": "\u989D\u5EA6\u6C60\u6807\u8BC6\uFF08\u9017\u53F7\u5206\u9694\uFF09",
  "settings.until": "\u6709\u6548\u671F\u622A\u6B62\uFF08ISO \u65E5\u671F\u65F6\u95F4\uFF09",
  "settings.quotaOrder": "\u4F7F\u7528\u989D\u5EA6\u987A\u5E8F",
  "settings.plan.id": "\u989D\u5EA6\u6C60\u6807\u8BC6",
  "settings.plan.name": "\u540D\u79F0",
  "settings.plan.providers": "\u63D0\u4F9B\u5546\uFF08\u9017\u53F7\u5206\u9694\uFF09",
  "settings.plan.priceUsdMonthly": "\u6708\u8D39\uFF08\u7F8E\u5143\uFF09",
  "settings.plan.stopPct": "\u5DF2\u7528\u767E\u5206\u6BD4\u505C\u6D3E\u7EBF",
  "settings.plan.cycleDay": "\u6708\u5EA6\u5468\u671F\u8D77\u59CB\u65E5",
  "settings.plan.adapter": "\u989D\u5EA6\u9002\u914D\u5668",
  "settings.plan.dispatch": "\u5141\u8BB8\u6D3E\u6D3B",
  "settings.plan.pacePause": "\u7528\u91CF\u8D85\u8FC7\u8FDB\u5EA6\u7EBF\u65F6\u6682\u505C",
  "settings.adapterId": "{id}",
  "onboarding.title": "\u8BBE\u7F6E\u89D2\u8272\uFF08\u9884\u89C8\uFF09",
  "onboarding.previewOnly": "\u4EC5\u9884\u89C8\u3002\u5B89\u88C5\u4E0D\u4F1A\u521B\u5EFA\u6863\u6848\uFF0C\u4E5F\u4E0D\u4F1A\u6539\u53D8\u5BA1\u67E5\u8DEF\u7531\u3002",
  "onboarding.privacy": "\u4E3B\u673A\u6CA1\u6709\u7A84\u8303\u56F4\u6863\u6848 API\u3002\u53EA\u8BFB\u53D6 provider \u80FD\u529B\u76EE\u5F55\uFF1B\u8BF7\u81EA\u884C\u5728 Paseo \u4E2D\u521B\u5EFA\u6863\u6848\u3002",
  "onboarding.discover": "\u53D1\u73B0\u6A21\u578B\uFF0F\u91CD\u8BD5",
  "onboarding.loading": "\u6B63\u5728\u53D1\u73B0\u80FD\u529B\u2026",
  "onboarding.failed": "\u53D1\u73B0\u6216\u9884\u89C8\u5931\u8D25\u3002\u8BF7\u91CD\u8BD5\u6216\u624B\u5DE5\u521B\u5EFA\u6863\u6848\u3002",
  "onboarding.status.ready": "\u80FD\u529B\u76EE\u5F55\u53D1\u73B0\u5B8C\u6210\u3002",
  "onboarding.status.timeout": "\u53D1\u73B0\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "onboarding.status.unknown": "\u80FD\u529B\u672A\u77E5\u3002\u8BF7\u91CD\u8BD5\u6216\u624B\u5DE5\u8BBE\u7F6E\u3002",
  "onboarding.authUnknown": "\u767B\u5F55\u3001\u8BA2\u9605\u3001\u989D\u5EA6\u548C\u771F\u5B9E\u8BF7\u6C42\u5747\u672A\u9A8C\u8BC1\u3002\u53EF\u53D1\u73B0\u4E0D\u4EE3\u8868\u5DF2\u767B\u5F55\u3002",
  "onboarding.provider.discoverable": "\u53EF\u53D1\u73B0",
  "onboarding.provider.unavailable": "\u5DF2\u505C\u7528\u6216\u4E0D\u53EF\u7528",
  "onboarding.provider.unknown": "\u672A\u77E5",
  "onboarding.noModels": "\u6CA1\u6709\u53EF\u9009\u6A21\u578B\u3002\u8BF7\u81EA\u884C\u5B89\u88C5\u5E76\u767B\u5F55\u672C\u5730 provider\uFF0C\u7136\u540E\u91CD\u8BD5\u3002\u4E0D\u4F1A\u521B\u5EFA\u4EFB\u52A1\u3002",
  "onboarding.primary": "\u4E3B\u8981\u89D2\u8272",
  "onboarding.reviewer": "\u72EC\u7ACB\u5BA1\u67E5\u8005",
  "onboarding.familyHint": "\u8BF7\u6309\u6A21\u578B\u5382\u5546\u786E\u8BA4\u5BB6\u65CF\uFF1A\u76F4\u8FDE Claude\u2192anthropic\u3001Codex\u2192openai\u3001Grok\u2192xai\u3002Cursor \u662F provider\uFF0C\u4E0D\u662F\u6A21\u578B\u5BB6\u65CF\uFF0C\u53EF\u8FD0\u884C\u591A\u5BB6\u5382\u5546\u7684\u6A21\u578B\u3002\u4E0D\u8981\u628A provider \u540D\u79F0\u6216\u4EF7\u683C\u5F52\u56E0\u5F53\u4F5C\u5BB6\u65CF\u3002\u8BF7\u81EA\u884C\u786E\u8BA4\u5B9E\u9645\u6A21\u578B\u6765\u6E90\uFF1B\u672A\u77E5\u4EE3\u7406\u8BF7\u54A8\u8BE2\u8FD0\u8425\u8005\u3002provider \u6570\u91CF\u4E0D\u80FD\u8BC1\u660E\u72EC\u7ACB\u5BA1\u67E5\u3002",
  "onboarding.family": "{role}\u7684\u6A21\u578B\u5BB6\u65CF",
  "onboarding.confirm": "\u786E\u8BA4{role}\u7684\u5BB6\u65CF",
  "onboarding.confirmed": "\u5DF2\u786E\u8BA4{role}\u7684\u5BB6\u65CF\uFF08\u4FEE\u6539\uFF09",
  "onboarding.options": "\u53EF\u9009\u6A21\u5F0F\u4E0E\u601D\u8003\u8986\u76D6\uFF1B\u5176\u4ED6\u529F\u80FD\u4F7F\u7528\u4E3B\u673A\u9ED8\u8BA4\u503C\u3002",
  "onboarding.defaults": "{role}\u4F7F\u7528\u4E3B\u673A\u9ED8\u8BA4\u503C",
  "onboarding.mode": "{role}\u6A21\u5F0F\uFF1A{value}",
  "onboarding.thinking": "{role}\u601D\u8003\uFF1A{value}",
  "onboarding.addReviewer": "\u52A0\u5165\u53E6\u4E00\u5BB6\u65CF\u7684\u5BA1\u67E5\u8005",
  "onboarding.removeReviewer": "\u4F7F\u7528\u4EBA\u5DE5\u5BA1\u67E5\u9884\u89C8",
  "onboarding.generate": "\u751F\u6210\u9884\u89C8",
  "onboarding.reviewA": "\u5355\u5BB6\u65B9\u6848 A\uFF08\u63D0\u6848\uFF09\uFF1A\u4EA4\u4ED8\u540E\u7531\u4EBA\u5BA1\u67E5\uFF1B\u72EC\u7ACB\u5BA1\u67E5\u9700\u8981\u53E6\u4E00\u6A21\u578B\u5BB6\u65CF\u3002",
  "onboarding.reviewB": "\u5355\u5BB6\u65B9\u6848 B\uFF08\u63D0\u6848\uFF09\uFF1A\u666E\u901A\u4F4E\u98CE\u9669\u5DE5\u4F5C\u53EF\u7531\u65B0\u4F1A\u8BDD\u81EA\u68C0\u3002\u8FD9\u4E0D\u662F\u72EC\u7ACB\u5BA1\u67E5\u3002\u6B64\u65B9\u6848\u5C1A\u672A\u542F\u7528\u3002",
  "onboarding.l4": "L4\u3001\u6743\u9650\u3001\u8D44\u91D1\u4E0E\u8FC1\u79FB\u987B\u5F02\u5BB6\u6216\u4EBA\u5DE5\u5BA1\u67E5\u3002\u81EA\u68C0\u4E0D\u80FD\u81EA\u52A8\u901A\u8FC7\u3002",
  "onboarding.noQuota": "\u672A\u5206\u914D\u989D\u5EA6\u6C60\u3002\u5C1A\u672A\u914D\u7F6E\u989D\u5EA6\u4FDD\u62A4\u3002",
  "onboarding.independent": "\u516D\u4E2A\u89D2\u8272\u6A21\u677F\uFF0C\u6267\u884C\u4E0E\u5BA1\u67E5\u5BB6\u65CF\u4E0D\u540C\u3002\u8DEF\u7531\u548C\u5B58\u50A8\u672A\u6539\u53D8\u3002",
  "onboarding.manual": "\u4E94\u4E2A\u89D2\u8272\u6A21\u677F\u3002\u5355\u5BB6\u4E0D\u751F\u6210\u5BA1\u67E5\u6863\u6848\uFF1B\u4EA4\u4ED8\u9700\u8981\u4EBA\u5DE5\u6216\u5F02\u5BB6\u5BA1\u67E5\u3002",
  "onboarding.copyHint": "\u9009\u4E2D\u5E76\u590D\u5236 JSON\uFF0C\u4F5C\u4E3A\u624B\u5DE5\u521B\u5EFA\u6863\u6848\u7684\u53C2\u8003\u3002\u5B83\u4E0D\u662F\u66FF\u6362\u914D\u7F6E\uFF0C\u4E0D\u80FD\u4F5C\u4E3A patch \u6570\u7EC4\u63D0\u4EA4\u3002\u8BF7\u68C0\u67E5\u5DF2\u6709\u540D\u79F0\u548C ID \u5E76\u624B\u5DE5\u7ED1\u5B9A\u89D2\u8272\u3002\u6269\u5C55\u952E\u4FDD\u5B58\u5C1A\u672A\u9A8C\u8BC1\u3002",
  "onboarding.issue.none": "\u9884\u89C8\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "onboarding.issue.capability": "\u6240\u9009\u6A21\u578B\u4E0D\u53EF\u7528\u6216\u80FD\u529B\u5DF2\u53D8\u5316\u3002\u8BF7\u91CD\u65B0\u53D1\u73B0\u3002",
  "onboarding.issue.family": "\u8BF7\u786E\u8BA4\u5DF2\u77E5\u6A21\u578B\u5BB6\u65CF\u3002\u72EC\u7ACB\u5BA1\u67E5\u9700\u8981\u4E0D\u540C\u5BB6\u65CF\u3002",
  "onboarding.issue.options": "\u6240\u9009\u6A21\u5F0F\u6216\u601D\u8003\u9009\u9879\u4E0D\u53EF\u7528\u3002\u8BF7\u91CD\u65B0\u53D1\u73B0\u3002",
  "onboarding.role.supervisor": "\u8D1F\u8D23\u4EBA",
  "onboarding.notes.supervisor": "\u534F\u8C03\u4EFB\u52A1\u3001\u6838\u5BF9\u8BC1\u636E\u3001\u63D0\u51FA\u9700\u4EBA\u51B3\u5B9A\u7684\u4E8B\u9879\u5E76\u6C9F\u901A\u3002\u9075\u5FAA\u4ED3\u5E93\u8BF4\u660E\u53CA\u53EF\u7528\u7684 Kanban \u8D1F\u8D23\u4EBA\u534F\u8BAE\u3002",
  "onboarding.role.executor": "\u6267\u884C",
  "onboarding.notes.executor": "\u5B9E\u65BD\u6307\u5B9A\u8303\u56F4\uFF0C\u6BCF\u5B8C\u6210\u4E00\u6B65\u63D0\u4EA4\u3002\u62A5\u544A\u6587\u4EF6\u3001\u9A8C\u8BC1\u548C\u98CE\u9669\uFF0C\u4E0D\u4F5C\u6700\u7EC8\u9A8C\u6536\u3002",
  "onboarding.role.reviewer": "\u5BA1\u67E5",
  "onboarding.notes.reviewer": "\u72EC\u7ACB\u5BA1\u67E5\u4EA4\u4ED8\uFF0C\u4EE5\u8BC1\u636E\u62A5\u544A\u95EE\u9898\uFF0C\u4E0D\u4FEE\u6539\u6216\u5408\u5E76\u4EA4\u4ED8\u3002",
  "onboarding.role.reader": "\u901A\u8BFB",
  "onboarding.notes.reader": "\u53EA\u8BFB\u8C03\u67E5\u6307\u5B9A\u8303\u56F4\uFF0C\u62A5\u544A\u8BC1\u636E\u548C\u4E0D\u786E\u5B9A\u4E4B\u5904\u3002",
  "onboarding.role.decision": "\u51B3\u7B56",
  "onboarding.notes.decision": "\u6BD4\u8F83\u6280\u672F\u9009\u9879\u3001\u6210\u672C\u548C\u98CE\u9669\uFF0C\u4EE5\u8BC1\u636E\u63D0\u51FA\u5EFA\u8BAE\u3002",
  "onboarding.role.batch": "\u6742\u6D3B",
  "onboarding.notes.batch": "\u53EA\u6267\u884C\u5DF2\u6388\u6743\u7684\u64CD\u4F5C\u4EFB\u52A1\uFF0C\u62A5\u544A\u9A8C\u8BC1\u548C\u98CE\u9669\u3002",
  "settings.dispatch.title": "\u6D3E\u6D3B\u6DF1\u5EA6",
  "settings.dispatch.hint": "\u6309\u89D2\u8272\u3001\u96BE\u5EA6\u548C\u6863\u6848\u69FD\u4F4D\u8986\u76D6\u601D\u8003\u6DF1\u5EA6\u4E0E\u987A\u5E8F\u3002\u663E\u5F0F\u987A\u5E8F\u6309\u6570\u5B57\u4ECE\u5C0F\u5230\u5927\u6392\u5728\u524D\u9762\uFF0C\u987A\u5E8F\u7559\u7A7A\u7684\u5019\u9009\u6309\u989D\u5EA6\u4F18\u5148\u7EA7\u6392\u5728\u540E\u9762\u3002\u989D\u5EA6\u6682\u505C\u548C\u5BA1\u67E5\u5F02\u5BB6\u9650\u5236\u7EE7\u7EED\u751F\u6548\u3002\u4FEE\u6539\u540E\u70B9\u51FB\u901A\u7528\u8BBE\u7F6E\u7684\u4FDD\u5B58\u3002",
  "settings.dispatch.tier": "{tier}",
  "settings.dispatch.target": "{slot} / {tier}",
  "settings.dispatch.profile": "{slot} \u2014 {profile}",
  "settings.dispatch.missing": "\u6CA1\u6709\u5339\u914D\u7684\u6863\u6848",
  "settings.dispatch.defaults": "\u9ED8\u8BA4\uFF1A{values}",
  "settings.dispatch.defaultValue": "{context}\uFF1A{effort}\uFF0C\u7B2C {order} \u4F4D",
  "settings.dispatch.all": "\u6240\u6709\u4EFB\u52A1",
  "settings.dispatch.inherit": "\u6863\u6848\u81EA\u8EAB\u6DF1\u5EA6",
  "settings.dispatch.unknown": "\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u601D\u8003\u6863\u4F4D\u3002\u80FD\u529B\u6838\u5B9E\u4E4B\u524D\u4F1A\u5FFD\u7565\u6DF1\u5EA6\u8986\u76D6\u3002",
  "settings.dispatch.savedEffort": "\u8986\u76D6\uFF1A{effort}",
  "settings.dispatch.default": "\u4F7F\u7528\u9ED8\u8BA4",
  "settings.dispatch.defaultAction": "{target} \u4F7F\u7528\u9ED8\u8BA4\u6DF1\u5EA6",
  "settings.dispatch.inheritAction": "{target} \u4F7F\u7528\u6863\u6848\u81EA\u8EAB\u6DF1\u5EA6",
  "settings.dispatch.effort": "{effort}",
  "settings.dispatch.effortAction": "{target} \u6DF1\u5EA6\u8BBE\u4E3A {effort}",
  "settings.dispatch.order": "\u987A\u5E8F\uFF081\u20131000\uFF1B\u7559\u7A7A\u4F7F\u7528\u989D\u5EA6\u4F18\u5148\u7EA7\uFF09",
  "settings.dispatch.orderAction": "{target} \u7684\u987A\u5E8F",
  "settings.dispatch.clearRow": "\u6E05\u7A7A\u8986\u76D6",
  "settings.dispatch.clearAction": "\u6E05\u7A7A {target} \u7684\u8986\u76D6",
  "settings.dispatch.clearAll": "\u6E05\u7A7A\u5168\u90E8\u6D3E\u6D3B\u8986\u76D6",
  "settings.dispatch.empty": "\u6CA1\u6709\u53EF\u7528\u7684\u9ED8\u8BA4\u6D3E\u6D3B\u69FD\u4F4D\u3002",
  "quota.setup.readFailed": "\u81EA\u52A8\u7528\u91CF\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5230\u673A\u7FA4\u8BBE\u7F6E\u624B\u586B\u8BFB\u6570\u3002",
  "quota.setup.fixedWindow": "\u56FA\u5B9A\u65F6\u957F",
  "quota.setup.monthWindow": "\u6708\u5EA6",
  "quota.setup.weekWindow": "\u6BCF\u5468",
  "quota.setup.dayWindow": "\u6BCF\u65E5",
  "quota.setup.liveNoPace": "\u81EA\u52A8\u8BFB\u6570\u5C5E\u4E8E{window}\u7A97\u53E3\uFF0C\u65E0\u6CD5\u4E0E\u914D\u7F6E\u7684\u5468\u671F\u6BD4\u8F83\uFF1B\u6D3E\u6D3B\u53EA\u6309\u505C\u6D3E\u9608\u503C\u5224\u65AD\uFF0C\u4E0D\u8BA1\u7B97\u8FDB\u5EA6\u7EBF\u3002",
  "quota.setup.windowAtStop": "{window}\u7528\u91CF {used}% \u5DF2\u8FBE\u5230 {stop}% \u505C\u6D3E\u9608\u503C\u3002",
  "quota.setup.unknownWindow": "\u672A\u77E5\u5468\u671F",
  "quota.setup.staleHold": "\u8BFB\u6570\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u66F4\u65B0\u8BFB\u6570\u6216\u660E\u786E\u5173\u95ED\u989D\u5EA6\u4FDD\u62A4\u3002",
  "quota.setup.unknownHold": "\u7528\u91CF\u672A\u77E5\uFF0C\u8BF7\u586B\u5199\u8BFB\u6570\u6216\u660E\u786E\u5173\u95ED\u989D\u5EA6\u4FDD\u62A4\u3002",
  "quota.setup.atStop": "\u5DF2\u7528 {used}%\uFF0C\u8FBE\u5230\u8BBE\u7F6E\u7684\u505C\u6D3E\u7EBF {stop}%\u3002",
  "quota.setup.unprotected": "\u6B64\u989D\u5EA6\u6C60\u5DF2\u5173\u95ED\u989D\u5EA6\u4FDD\u62A4\u3002",
  "quota.setup.manualReason": "{reason} \u624B\u586B\u65F6\u95F4\uFF1A{at}\u3002{error}",
  "quota.setup.reading": "\u6765\u6E90\uFF1A{state}\u3002\u8BB0\u5F55\u65F6\u95F4\uFF1A{at}\u3002{error}",
  "quota.setup.staleReading": "\u8FC7\u671F\u8BFB\u6570\uFF1A{used}%\u3002\u8BB0\u5F55\u65F6\u95F4\uFF1A{at}\u3002\u8BF7\u586B\u5199\u65B0\u8BFB\u6570\u3002",
  "settings.emptyPools": "\u5C1A\u672A\u914D\u7F6E\u989D\u5EA6\u6C60\u3002\u53EF\u4EE5\u4E0D\u505A\u989D\u5EA6\u4FDD\u62A4\u7EE7\u7EED\uFF1B\u672A\u7ED1\u5B9A\u6C60\u7684\u6863\u6848\u6309\u57FA\u7840\u987A\u5E8F\u6D3E\u6D3B\u3002",
  "settings.plan.usageProvider": "\u7528\u91CF\u6765\u6E90 ID",
  "settings.plan.bindingHint": "\u7528\u6B64\u6C60 ID \u7ED1\u5B9A\u6863\u6848\u3002\u81EA\u52A8\u6765\u6E90\u5FC5\u987B\u5339\u914D Paseo \u8FD4\u56DE\u7684\u7528\u91CF\u6765\u6E90 ID\uFF1B\u4E0D\u540C\u8D26\u53F7\u9700\u8981\u4E0D\u540C\u6765\u6E90 ID \u6216\u624B\u586B\u8BFB\u6570\u3002",
  "settings.cycle": "\u91CD\u7F6E\u5468\u671F",
  "settings.cycle.unknown": "\u672A\u77E5",
  "settings.cycle.day": "\u6BCF\u65E5",
  "settings.cycle.week": "\u6BCF\u5468",
  "settings.cycle.month": "\u6BCF\u6708",
  "settings.cycle.duration": "\u56FA\u5B9A\u65F6\u957F",
  "settings.cycle.timeZone": "IANA \u65F6\u533A",
  "settings.cycle.hour": "\u91CD\u7F6E\u5C0F\u65F6\uFF080-23\uFF09",
  "settings.cycle.minute": "\u91CD\u7F6E\u5206\u949F\uFF080-59\uFF09",
  "settings.cycle.dayOfMonth": "\u91CD\u7F6E\u65E5\uFF081-31\uFF09",
  "settings.cycle.weekday": "\u91CD\u7F6E\u661F\u671F\uFF080=\u5468\u65E5\uFF09",
  "settings.cycle.seconds": "\u65F6\u957F\uFF08\u79D2\uFF09",
  "settings.cycle.startsAt": "\u65F6\u957F\u8D77\u70B9\uFF08\u542B\u65F6\u533A\u504F\u79FB\u7684 ISO\uFF09",
  "settings.cycle.hint": "\u65E5\u5386\u91CD\u7F6E\u6309\u6B64\u65F6\u533A\u8BA1\u7B97\u3002\u77ED\u6708\u94B3\u5230\u672B\u65E5\uFF1B\u590F\u4EE4\u65F6\u8DF3\u7A7A\u5411\u540E\u5E73\u79FB\uFF0C\u91CD\u590D\u65F6\u523B\u53D6\u8F83\u65E9\u4E00\u6B21\u3002\u66F4\u6539\u5468\u671F\u4F1A\u4F7F\u65E7\u624B\u586B\u8FC7\u671F\u3002\u672A\u77E5\u5468\u671F\u4E0D\u4F30\u7B97\u8FDB\u5EA6\u3002",
  "settings.cycle.legacy": "\u9009\u62E9\u65B0\u5468\u671F\u524D\u4FDD\u7559\u539F\u5468\u671F\u3002",
  "settings.manual": "\u624B\u586B\u8BFB\u6570\uFF0F\u81EA\u52A8\u8BFB\u53D6\u5931\u8D25\u65F6\u4F7F\u7528",
  "settings.manual.usedPct": "\u5DF2\u7528\u767E\u5206\u6BD4\uFF08\u7A7A\u767D=\u672A\u77E5\uFF09",
  "settings.manual.at": "\u8BB0\u5F55\u65F6\u95F4\uFF08\u542B\u65F6\u533A\u504F\u79FB\u7684 ISO\uFF09",
  "settings.manual.source": "\u8BFB\u6570\u6765\u6E90",
  "settings.manual.ttlSeconds": "\u8BFB\u6570\u6709\u6548\u671F\uFF08\u79D2\uFF09",
  "settings.manual.startsAt": "\u7A97\u53E3\u5F00\u59CB\uFF08\u53EF\u9009 ISO\uFF09",
  "settings.manual.resetsAt": "\u91CD\u7F6E\u65F6\u95F4\uFF08\u53EF\u9009 ISO\uFF09",
  "settings.manual.hint": "\u53EF\u7528\u65F6\u4F18\u5148\u81EA\u52A8\u8BFB\u6570\u3002\u8BFB\u53D6\u5931\u8D25\u65F6\u4FDD\u7559\u9002\u914D\u5668\uFF1B\u624B\u586B\u6309\u6709\u6548\u671F\u6216\u91CD\u7F6E\u5931\u6548\u3002\u91CD\u7F6E\u5EF6\u671F\u9700\u8981\u65B0\u8BFB\u6570\u3002",
  "settings.manual.now": "\u8BB0\u5F55\u5F53\u524D\u65F6\u95F4",
  "settings.manual.clear": "\u6E05\u9664\u624B\u586B\u8BFB\u6570",
  "settings.noProtection": "\u5173\u95ED\u6B64\u6C60\u7684\u989D\u5EA6\u4FDD\u62A4",
  "settings.noProtectionHint": "\u660E\u786E\u9009\u62E9\u540E\uFF0C\u5373\u4F7F\u7528\u91CF\u672A\u77E5\u6216\u8017\u5C3D\u4E5F\u53EF\u80FD\u5F00\u5DE5\u3002",
  "quota.setup.ambiguousSource": "\u6B64\u7528\u91CF\u6765\u6E90\u88AB\u5206\u914D\u7ED9\u591A\u4E2A\u6C60\u3002\u8BF7\u9009\u62E9\u4E0D\u540C\u6765\u6E90 ID \u6216\u624B\u586B\u8BFB\u6570\u3002",
  "usage.noPools": "\u5C1A\u672A\u914D\u7F6E\u989D\u5EA6\u6C60\uFF1B\u672A\u7ED1\u5B9A\u6C60\u7684\u6863\u6848\u6D3E\u6D3B\u6CA1\u6709\u989D\u5EA6\u4FDD\u62A4\u3002",
  "quota.setup.state.live": "\u81EA\u52A8",
  "quota.setup.state.manual": "\u624B\u586B",
  "quota.setup.state.unknown": "\u672A\u77E5",
  "doctor.platform.title": "\u5E73\u53F0\u80FD\u529B",
  "doctor.platform.summary": "{platform}\uFF0CNode {node}",
  "doctor.platform.target": "macOS/Linux \u4E3A\u9996\u53D1\u76EE\u6807\uFF1B\u5C1A\u65E0\u7AEF\u5230\u7AEF\u9A8C\u8BC1\u8BB0\u5F55\u3002",
  "doctor.platform.unverified": "\u6B64\u7CFB\u7EDF\u5C1A\u672A\u9A8C\u8BC1\uFF1B\u539F\u751F Windows \u4E0D\u5728\u9996\u53D1\u76EE\u6807\u5185\u3002",
  "doctor.platform.keychainOptional": "\u94A5\u5319\u4E32\u5B58\u5728\u6027\u68C0\u67E5\u4EC5\u9650 macOS\uFF0C\u53EF\u9009\u5F00\u542F\u3002",
  "doctor.platform.keychainSkipped": "\u6B64\u7CFB\u7EDF\u4E0D\u9002\u7528\u94A5\u5319\u4E32\u68C0\u67E5\uFF0C\u5DF2\u8DF3\u8FC7\u3002",
  "doctor.platform.processSkipped": "\u6B64\u7CFB\u7EDF\u5DF2\u8DF3\u8FC7 Unix \u8FDB\u7A0B\u68C0\u67E5\uFF1B\u8FDB\u7A0B\u72B6\u6001\u5C1A\u672A\u9A8C\u8BC1\u3002",
  "cursor.api.sandboxLabel": "\u4EE3\u7406\u6C99\u76D2",
  "access.detail.pluginUnconfigured": "\u6B64\u72B6\u6001\u68C0\u67E5\u5C1A\u672A\u914D\u7F6E\u63D2\u4EF6 ID"
};

// shared/i18n.ts
var LANGUAGES = ["en", "zh-CN"];
var LANGUAGE_SETTINGS = ["system", ...LANGUAGES];
var DEFAULT_LANGUAGE = "en";
var LANGUAGE_ENV = "AFC_LANGUAGE";
var CATALOGS = { en: en_default2, "zh-CN": zh_CN_default };
var current = null;
function isLanguage(value) {
  return typeof value === "string" && LANGUAGES.includes(value);
}
function isLanguageSetting(value) {
  return value === "system" || isLanguage(value);
}
function languageFromLocale(locale) {
  const tag = (locale ?? "").trim().toLowerCase().replace(/_/g, "-");
  if (!tag || tag === "c" || tag.startsWith("c.") || tag === "posix") return null;
  if (tag.startsWith("zh")) return "zh-CN";
  if (tag.startsWith("en")) return "en";
  return null;
}
function processEnv() {
  const proc = globalThis.process;
  return proc?.env ?? {};
}
function systemLanguage(env = processEnv(), runtimeLocale = intlLocale) {
  for (const name of ["LC_ALL", "LC_MESSAGES", "LANG"]) {
    const value = env[name];
    if (!value) continue;
    const lang = languageFromLocale(value);
    if (lang) return lang;
  }
  return languageFromLocale(runtimeLocale()) ?? DEFAULT_LANGUAGE;
}
function intlLocale() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return void 0;
  }
}
function resolveLanguage(setting, env = processEnv()) {
  return isLanguage(setting) ? setting : systemLanguage(env);
}
function languageOverride(env = processEnv()) {
  const value = env[LANGUAGE_ENV]?.trim();
  return isLanguage(value) ? value : null;
}
function setLanguage(lang) {
  current = lang;
}
function language() {
  if (!current) current = languageOverride() ?? systemLanguage();
  return current;
}
function fill(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name) => name in vars ? String(vars[name]) : whole);
}
function tIn(lang, key, vars) {
  const template = CATALOGS[lang][key] ?? CATALOGS.en[key] ?? key;
  return fill(template, vars);
}
function t(key, vars) {
  return tIn(language(), key, vars);
}

// shared/doctor.ts
var RANK = { green: 0, yellow: 1, red: 2 };
function worstStatus(statuses) {
  return statuses.reduce((worst, next) => RANK[next] > RANK[worst] ? next : worst, "green");
}
function makeItem(input) {
  return { ...input, status: worstStatus(input.findings.map((finding2) => finding2.status)) };
}
function buildReport(items, at, durationMs) {
  const counts = { red: 0, yellow: 0, green: 0 };
  for (const item of items) counts[item.status] += 1;
  return { at, durationMs, counts, worst: worstStatus(items.map((item) => item.status)), items };
}
function doctorExitCode(report) {
  return report.worst === "red" ? 2 : report.worst === "yellow" ? 1 : 0;
}
var STATUS_KEY = { green: "doctor.status.green", yellow: "doctor.status.yellow", red: "doctor.status.red" };
function statusLabel(status) {
  return t(STATUS_KEY[status]);
}
var TABLE_MAX_LISTED = 12;
var STATUS_DOT = { green: "\u{1F7E2}", yellow: "\u{1F7E1}", red: "\u{1F534}" };
function formatDoctorTable(report) {
  const lines = [];
  lines.push(t("doctor.table.header", { at: report.at, seconds: (report.durationMs / 1e3).toFixed(1) }));
  lines.push(t("doctor.table.counts", report.counts));
  lines.push("");
  for (const item of report.items) {
    lines.push(`${STATUS_DOT[item.status]} ${statusLabel(item.status)}  ${item.title} \u2014 ${item.summary}`);
    const compact = item.findings.length > TABLE_MAX_LISTED;
    const shown = item.findings.filter((finding2) => !compact || finding2.status !== "green");
    for (const finding2 of shown) lines.push(`      ${STATUS_DOT[finding2.status]} ${finding2.text}`);
    if (compact) lines.push(`      ${t("doctor.table.compact", { total: item.findings.length, hidden: item.findings.length - shown.length })}`);
    for (const evidence of item.evidence) lines.push(`      ${t("doctor.table.evidence", { evidence })}`);
  }
  return lines.join("\n");
}
var doctorFindingShape = object({ key: string2(), status: _enum(["green", "yellow", "red"]), text: string2() });
var itemSchema = object({
  id: string2(),
  title: string2(),
  status: _enum(["green", "yellow", "red"]),
  summary: string2(),
  evidence: array(string2()),
  findings: array(doctorFindingShape)
});
var doctorRpc = defineRpc({
  name: "board.doctor",
  input: object({}),
  output: object({
    at: string2(),
    durationMs: number2(),
    counts: object({ red: number2(), yellow: number2(), green: number2() }),
    worst: _enum(["green", "yellow", "red"]),
    items: array(itemSchema)
  })
});

// server/doctor.ts
import { existsSync as existsSync3, realpathSync } from "node:fs";
import { open as open2, readdir as readdir2, readFile, stat } from "node:fs/promises";
import { delimiter as delimiter3, join as join7 } from "node:path";

// server/platform.ts
import { delimiter, dirname, join } from "node:path";
import { homedir } from "node:os";
function platformCapabilities(platform = process.platform) {
  return {
    keychain: platform === "darwin",
    unixProcesses: platform === "darwin" || platform === "linux",
    releaseTarget: platform === "darwin" || platform === "linux"
  };
}
function commandPath(env = process.env, home = homedir()) {
  return [.../* @__PURE__ */ new Set([join(home, ".local", "bin"), ...(env.PATH ?? "").split(delimiter).filter(Boolean), dirname(process.execPath)])].join(delimiter);
}

// shared/migration.ts
var MIGRATION_FILE = "MIGRATION.json";
var MIGRATION_SCHEMA = "afc-migration/v1";
var OBSERVATION_DAYS = 7;
var DAY_MS = 864e5;
var MIGRATION_ID_PATTERN = /^\d{8}T\d{6}Z$/;
var DATA_FILE = /\.(json|jsonl|log)$/;
var NOT_DATA = /* @__PURE__ */ new Set(["package.json", "package-lock.json", "tsconfig.json", "jsconfig.json", MIGRATION_FILE]);
var SOURCE_SECRETS_DIR = "state";
var TARGET_SECRETS_DIR = "secrets";
var SOURCE_BACKUPS_DIR = "backups";
var TARGET_BACKUPS_DIR = "backups/legacy";
function isTopLevelDataFile(name) {
  return !name.startsWith(".") && DATA_FILE.test(name) && !NOT_DATA.has(name);
}
function targetFor(from) {
  const parts = from.split("/");
  if (parts.some((part) => part === "" || part === "." || part === ".." || part.startsWith("."))) return null;
  if (parts.length === 1) return isTopLevelDataFile(parts[0]) ? { to: from, kind: "data" } : null;
  if (parts[0] === SOURCE_SECRETS_DIR) return parts.length === 2 ? { to: `${TARGET_SECRETS_DIR}/${parts[1]}`, kind: "secret" } : null;
  if (parts[0] === SOURCE_BACKUPS_DIR) return { to: `${TARGET_BACKUPS_DIR}/${parts.slice(1).join("/")}`, kind: "backup" };
  return null;
}
var sha256 = string2().regex(/^[0-9a-f]{64}$/);
var isoDateTime = iso_exports.datetime({ offset: true });
var MigrationFile = object({
  /** Path relative to the source directory, "/"-separated. */
  from: string2(),
  /** Path relative to the data directory, "/"-separated. */
  to: string2(),
  kind: _enum(["data", "secret", "backup"]),
  size: number2().int().nonnegative(),
  sha256,
  /** Source modification time when it was copied; the doctor compares it to spot later writes. */
  mtimeMs: number2()
}).refine((file) => {
  const target = targetFor(file.from);
  return target !== null && target.to === file.to && target.kind === file.kind;
}, "file paths do not follow the migration layout");
var MigrationRecord = object({
  schema: literal(MIGRATION_SCHEMA),
  id: string2().regex(MIGRATION_ID_PATTERN),
  status: _enum(["migrated", "rolled-back", "finished"]),
  /** Absolute source directory (symbolic links resolved). */
  from: string2(),
  /** Absolute data directory. */
  to: string2(),
  migratedAt: isoDateTime,
  /** Copy of the source taken at migration time, relative to the data directory. */
  backupDir: string2().regex(/^backups\/migration-\d{8}T\d{6}Z$/),
  files: array(MigrationFile),
  checks: object({
    /** Items in decisions.json at migration time; null when there was none or it was unreadable. */
    decisions: number2().int().nonnegative().nullable(),
    plansSha256: sha256.nullable()
  }),
  plugin: string2(),
  rolledBackAt: isoDateTime.nullable(),
  rollback: object({
    exportFile: string2(),
    setAsideDir: string2(),
    /** Legacy files that were missing and came back from the backup. */
    restored: array(string2()),
    /** Legacy files that changed after migration; the newer legacy version was kept. */
    changedInLegacy: array(string2()),
    /** The legacy link the rollback pointed back at the legacy directory (it pointed at the data directory). */
    linkRestored: object({ path: string2(), from: string2(), to: string2() }).nullable().default(null)
  }).nullable(),
  finishedAt: isoDateTime.nullable(),
  finish: object({
    archive: string2(),
    archiveSha256: sha256,
    removed: number2().int().nonnegative()
  }).nullable()
});
function parseMigrationRecord(text2) {
  let json2;
  try {
    json2 = JSON.parse(text2);
  } catch (error2) {
    return { ok: false, reason: `bad JSON: ${error2 instanceof Error ? error2.message : String(error2)}` };
  }
  const parsed = MigrationRecord.safeParse(json2);
  if (parsed.success) return { ok: true, record: parsed.data };
  const issue2 = parsed.error.issues[0];
  return { ok: false, reason: `${issue2?.path.join(".") || "(root)"}: ${issue2?.message ?? "invalid"}` };
}
function daysSince(iso, now) {
  const at = Date.parse(iso);
  return Number.isNaN(at) ? 0 : Math.max(0, Math.floor((now - at) / DAY_MS));
}
var isItem = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
function decisionItems(json2) {
  return Array.isArray(json2) ? json2.filter(isItem) : null;
}

// shared/quota-adapters.ts
var CLAUDE_CLI = "claude-cli";
var CODEX_CLI = "codex-cli";
var GROK_CLI = "grok-cli";
var CURSOR_API = "cursor-api";
var MUSE_MSP = "muse-msp";
var OPENCODE_GO_API = "opencode-go-api";
var MANUAL = "manual";
var ADAPTER_IDS = [CLAUDE_CLI, CODEX_CLI, GROK_CLI, CURSOR_API, MUSE_MSP, OPENCODE_GO_API, MANUAL];
var KEYCHAIN = "keychain";
var ADAPTERS_OFF = { [CURSOR_API]: false, [KEYCHAIN]: false };
function providerOf(adapter) {
  return adapter.slice(0, adapter.lastIndexOf("-"));
}
var CLAUDE_PROVIDER = providerOf(CLAUDE_CLI);
var CODEX_PROVIDER = providerOf(CODEX_CLI);
var GROK_PROVIDER = providerOf(GROK_CLI);
var CURSOR_PROVIDER = providerOf(CURSOR_API);
var MUSE_PROVIDER = providerOf(MUSE_MSP);
var OPENCODE_GO_PROVIDER = providerOf(OPENCODE_GO_API);
function handCopyStop(label, source) {
  return (used, stopPct) => t("quota.adapters.handCopyStop", { label, used: Math.round(used), source, stop: stopPct });
}
function providerWeekSpec(name, rank, session) {
  return {
    optional: false,
    readsProvider: true,
    period: "week",
    neverPrefer: false,
    leaderPool: false,
    session,
    keepsLabels: true,
    unread: null,
    judgedWhenOff: true,
    firstWindowFallback: false,
    subWindows: [],
    handCopy: null,
    companyKey: null,
    couponShiftsReset: false,
    judgeRank: rank,
    cardRank: rank,
    names: { line: name, label: name, short: name, via: t("quota.adapters.via", { name }), surplus: name },
    cardName: name,
    couponName: name
  };
}
function buildSpecs() {
  const noHandCopyYet = t("quota.adapters.noHandCopyYet");
  return {
    [CLAUDE_CLI]: {
      optional: false,
      readsProvider: true,
      period: "window",
      neverPrefer: true,
      leaderPool: true,
      session: /session/i,
      keepsLabels: true,
      unread: "reset",
      judgedWhenOff: true,
      firstWindowFallback: false,
      subWindows: [{ key: "fable", match: /fable/i, names: { line: "Fable", label: "Claude Fable", short: "Claude Fable", via: t("quota.adapters.via", { name: "Fable" }) } }],
      handCopy: null,
      companyKey: "claude",
      couponShiftsReset: false,
      judgeRank: 0,
      cardRank: 0,
      names: { line: "Claude", label: t("quota.adapters.mainQuota", { name: "Claude" }), short: "Claude", via: t("quota.adapters.via", { name: "Claude" }), surplus: t("quota.adapters.mainQuota", { name: "Claude" }) },
      cardName: "Claude",
      couponName: "Claude"
    },
    [GROK_CLI]: {
      optional: false,
      readsProvider: true,
      period: "week",
      neverPrefer: false,
      leaderPool: false,
      session: null,
      keepsLabels: false,
      unread: null,
      judgedWhenOff: true,
      firstWindowFallback: true,
      subWindows: [],
      handCopy: {
        sources: ["manual"],
        stopText: handCopyStop(t("quota.adapters.grokWeekUsed"), "/usage show"),
        emptyText: noHandCopyYet,
        spentText: () => t("quota.adapters.weekSpent")
      },
      companyKey: null,
      couponShiftsReset: false,
      judgeRank: 1,
      cardRank: 2,
      names: { line: "SuperGrok", label: "SuperGrok", short: "SuperGrok", via: t("quota.adapters.via", { name: "SuperGrok" }), surplus: "SuperGrok" },
      cardName: t("quota.adapters.cardAlias", { name: "SuperGrok", alias: "Grok" }),
      couponName: "SuperGrok"
    },
    [CURSOR_API]: {
      optional: true,
      readsProvider: true,
      period: "month",
      neverPrefer: false,
      leaderPool: false,
      session: null,
      keepsLabels: false,
      unread: null,
      judgedWhenOff: true,
      firstWindowFallback: true,
      subWindows: [],
      handCopy: {
        sources: ["manual", "none"],
        stopText: handCopyStop(t("quota.adapters.cursorModelUsed"), "/usage"),
        emptyText: noHandCopyYet,
        spentText: (used, spentPct) => t("quota.adapters.cursorSpent", { used: Math.round(used), stop: spentPct })
      },
      companyKey: null,
      couponShiftsReset: false,
      judgeRank: 2,
      cardRank: 1,
      names: { line: "Cursor", label: "Cursor", short: "Cursor", via: t("quota.adapters.via", { name: "Cursor" }), surplus: "Cursor" },
      cardName: "Cursor",
      couponName: "Cursor"
    },
    [CODEX_CLI]: {
      optional: false,
      readsProvider: true,
      period: "week",
      neverPrefer: true,
      leaderPool: false,
      session: null,
      keepsLabels: false,
      unread: "stop",
      judgedWhenOff: false,
      firstWindowFallback: true,
      subWindows: [],
      handCopy: null,
      companyKey: "chatgpt",
      couponShiftsReset: true,
      judgeRank: 3,
      cardRank: 3,
      names: { line: "ChatGPT", short: "GPT", surplus: "ChatGPT" },
      cardName: t("quota.adapters.cardAlias", { name: "ChatGPT", alias: "Codex" }),
      couponName: "ChatGPT"
    },
    [MUSE_MSP]: providerWeekSpec(t("quota.adapters.muse"), 4, /^(?:\d+(?:\.\d+)?-(?:hour|minute|day)|Current window)$/i),
    [OPENCODE_GO_API]: providerWeekSpec(t("quota.adapters.opencodeGo"), 5, null),
    [MANUAL]: {
      optional: false,
      readsProvider: false,
      period: "month",
      neverPrefer: false,
      leaderPool: false,
      session: null,
      keepsLabels: false,
      unread: null,
      judgedWhenOff: true,
      firstWindowFallback: true,
      subWindows: [],
      handCopy: {
        sources: ["manual", "none"],
        stopText: (used, stopPct, name) => t("quota.adapters.manualStop", { name, used: Math.round(used), stop: stopPct }),
        emptyText: t("quota.adapters.manualEmpty"),
        spentText: (used, spentPct, name) => t("quota.adapters.manualSpent", { name, used: Math.round(used), stop: spentPct })
      },
      companyKey: null,
      couponShiftsReset: false,
      judgeRank: 6,
      cardRank: 6,
      names: {},
      cardName: null,
      couponName: null
    }
  };
}
var built = null;
function specs() {
  const lang = language();
  if (!built || built.lang !== lang) built = { lang, specs: buildSpecs() };
  return built.specs;
}
function isAdapterId(value) {
  return typeof value === "string" && ADAPTER_IDS.includes(value);
}
function providersOf(plan) {
  const listed = Array.isArray(plan.providers) ? plan.providers : [];
  return [plan.usageProvider, ...listed].filter((p) => typeof p === "string" && p.length > 0);
}
function baseAdapterOf(plan) {
  if (isAdapterId(plan.adapter)) return plan.adapter;
  for (const provider of providersOf(plan)) {
    const hit = ADAPTER_IDS.find((id) => id !== MANUAL && providerOf(id) === provider);
    if (hit) return hit;
  }
  return MANUAL;
}
function companyKeyOf(plan) {
  return specs()[baseAdapterOf(plan)].companyKey ?? plan.id;
}

// shared/doctor-checks.ts
var QUOTA_YELLOW_MIN = 30;
var QUOTA_RED_MIN = 120;
var TIMEOUT_RED_COUNT = 3;
var TIMEOUT_WINDOW_MIN = 60;
var COUPON_SOON_DAYS = 7;
var MIN_MS = 6e4;
var DAY_MS2 = 864e5;
var finding = (key, status, text2) => ({ key, status, text: text2 });
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var str = (value) => typeof value === "string" && value ? value : null;
var num = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
var asArray = (value) => Array.isArray(value) ? value : [];
var joinList = (items) => items.join(t("doctor.checks.listSeparator"));
function ageText(minutes) {
  if (minutes < 60) return t("doctor.age.minutes", { n: Math.round(minutes) });
  if (minutes < 48 * 60) return t("doctor.age.hours", { n: (minutes / 60).toFixed(1) });
  return t("doctor.age.days", { n: Math.round(minutes / 1440) });
}
function quotaVerdict(paused, dispatchable) {
  if (paused) return t("doctor.checks.quota.verdictPaused");
  return dispatchable === false ? t("doctor.checks.quota.verdictBlocked") : t("doctor.checks.quota.verdictOk");
}
function checkQuota(poolStatus, disabledPools2, now, path) {
  const evidence = [path];
  const base = { id: "quota", title: t("doctor.checks.quota.title"), evidence };
  if (!isRecord(poolStatus)) {
    return makeItem({ ...base, summary: t("doctor.checks.quota.missingSummary"), findings: [finding("quota:missing", "red", t("doctor.checks.quota.missing"))] });
  }
  const at = Date.parse(str(poolStatus.generatedAt) ?? "");
  const findings = [];
  let summary;
  if (Number.isNaN(at)) {
    findings.push(finding("quota:age", "red", t("doctor.checks.quota.noTime")));
    summary = t("doctor.checks.quota.noTimeSummary");
  } else {
    const minutes = Math.max(0, (now - at) / MIN_MS);
    const status = minutes > QUOTA_RED_MIN ? "red" : minutes > QUOTA_YELLOW_MIN ? "yellow" : "green";
    const age = ageText(minutes);
    summary = status === "green" ? t("doctor.checks.quota.fresh", { age }) : t("doctor.checks.quota.stale", { age });
    findings.push(finding("quota:age", status, t("doctor.checks.quota.age", { at: new Date(at).toISOString(), age, yellowMin: QUOTA_YELLOW_MIN, redHours: QUOTA_RED_MIN / 60 })));
  }
  const pools = isRecord(poolStatus.pools) ? poolStatus.pools : {};
  for (const [name, raw] of Object.entries(pools)) {
    const pool = isRecord(raw) ? raw : {};
    const used = num(pool.usedPct);
    const verdict = quotaVerdict(disabledPools2.includes(name), pool.dispatchable);
    findings.push(finding(`quota:pool:${name}`, "green", t("doctor.checks.quota.pool", { name, used: used === null ? "?" : `${Math.round(used)}%`, verdict })));
  }
  return makeItem({ ...base, summary, findings });
}
function stripContextSuffix(model) {
  return model.replace(/\[1m\]$/, "");
}
function parseProfiles(config2) {
  const list = isRecord(config2) && isRecord(config2.daemon) ? asArray(config2.daemon.agentProfiles) : [];
  const out = [];
  for (const raw of list) {
    if (!isRecord(raw)) continue;
    const name = str(raw.name);
    if (!name) continue;
    out.push({
      name,
      provider: str(raw.provider) ?? "",
      model: str(raw.model) ?? "",
      role: str(raw.role),
      candidateFor: str(raw.candidateFor),
      pool: str(raw.pool),
      family: str(raw.family)
    });
  }
  return out;
}
var inDispatchChain = (profile) => profile.role !== "personal" || profile.candidateFor !== null;
var onPausedPool = (profile, disabledPools2) => profile.pool !== null && disabledPools2.includes(profile.pool);
function checkOneProfile(profile, models, providers, disabledPools2) {
  const key = `profile:${profile.name}`;
  const label = t("doctor.checks.profiles.label", { name: profile.name, provider: profile.provider, model: profile.model });
  const provider = profile.provider;
  if (onPausedPool(profile, disabledPools2)) return finding(key, "green", t("doctor.checks.profiles.paused", { label, pool: profile.pool ?? "" }));
  const state = providers.find((row) => row.provider === provider);
  if (!state) return finding(key, "red", t("doctor.checks.profiles.noProvider", { label, provider }));
  if (!state.enabled) return finding(key, "red", t("doctor.checks.profiles.providerOff", { label, provider }));
  const list = models[provider];
  if (!list) return finding(key, "yellow", t("doctor.checks.profiles.noModels", { label, provider }));
  const known = new Set(list.map(stripContextSuffix));
  if (!known.has(stripContextSuffix(profile.model))) return finding(key, "red", t("doctor.checks.profiles.modelMissing", { label, provider }));
  return finding(key, "green", t("doctor.checks.profiles.modelOk", { label }));
}
function checkFamilySplit(profiles) {
  const main2 = (role) => profiles.find((profile) => profile.role === role && profile.candidateFor === null);
  const executor = main2("executor");
  const reviewer = main2("reviewer");
  if (!executor || !reviewer) return finding("profiles:family", "yellow", t("doctor.checks.profiles.familyNoMain"));
  if (!executor.family || !reviewer.family) return finding("profiles:family", "yellow", t("doctor.checks.profiles.familyMissing", { executor: executor.name, reviewer: reviewer.name }));
  if (executor.family === reviewer.family) return finding("profiles:family", "red", t("doctor.checks.profiles.familySame", { family: executor.family }));
  return finding("profiles:family", "green", t("doctor.checks.profiles.familyOk", { executor: executor.family, reviewer: reviewer.family }));
}
function profilesSummary(count, unchecked, bad, idle) {
  if (count === 0) return t("doctor.checks.profiles.summaryNone");
  if (unchecked) return t("doctor.checks.profiles.summaryUnchecked", { count });
  const result = bad === 0 ? t("doctor.checks.profiles.summaryAllOk") : t("doctor.checks.profiles.summaryBad", { count: bad });
  return t("doctor.checks.profiles.summaryChecked", { count, result, idle: idle ? t("doctor.checks.profiles.summaryIdle", { count: idle }) : "" });
}
function checkProfiles(input) {
  const chain = input.profiles.filter(inDispatchChain);
  const providers = input.providers;
  const findings = [
    ...providers === null ? [finding("profiles:providers", "yellow", t("doctor.checks.profiles.providersUnreadable"))] : chain.map((profile) => checkOneProfile(profile, input.models, providers, input.disabledPools)),
    checkFamilySplit(chain)
  ];
  const profileRows = findings.filter((row) => row.key.startsWith("profile:"));
  const bad = profileRows.filter((row) => row.status !== "green").length;
  const unchecked = providers === null;
  const idle = unchecked ? 0 : chain.filter((profile) => onPausedPool(profile, input.disabledPools)).length;
  const summary = profilesSummary(chain.length, unchecked, bad, idle);
  if (chain.length === 0) findings.unshift(finding("profiles:none", "red", t("doctor.checks.profiles.none")));
  return makeItem({
    id: "profiles",
    title: t("doctor.checks.profiles.title"),
    summary,
    evidence: [t("doctor.checks.profiles.evidenceProfiles"), "paseo provider models <provider>"],
    findings
  });
}
function countRefreshTimeouts(lines, now, windowMin = TIMEOUT_WINDOW_MIN) {
  const since = now - windowMin * MIN_MS;
  const counts = {};
  for (const line of lines) {
    if (!line.includes("Timed out refreshing")) continue;
    const time3 = /"time":(\d{10,})/.exec(line);
    if (!time3 || Number(time3[1]) < since) continue;
    const name = /Timed out refreshing (.+?) after \d+ms/.exec(line)?.[1] ?? t("doctor.checks.services.unknownService");
    counts[name] = (counts[name] ?? 0) + 1;
  }
  return counts;
}
function serviceFinding(row) {
  const key = `service:${row.provider}`;
  const label = t("doctor.checks.services.label", { label: row.label, provider: row.provider });
  if (!row.enabled) return finding(key, "green", t("doctor.checks.services.off", { label }));
  if (row.status === "available") return finding(key, "green", t("doctor.checks.services.available", { label }));
  return finding(key, "red", t("doctor.checks.services.down", { label, status: row.status }));
}
function servicesSummary(providers, badCount, logProblem) {
  const count = providers.length;
  if (count === 0) return t("doctor.checks.services.summaryNone");
  if (badCount > 0) return t("doctor.checks.services.summaryBad", { count: badCount });
  if (logProblem) return t("doctor.checks.services.summaryNoLog", { count });
  const off = providers.filter((row) => !row.enabled).length;
  return t("doctor.checks.services.summaryOk", { count, on: count - off, off });
}
function checkServices(input) {
  const findings = [];
  if (input.logProblem) findings.push(finding("service:log", "yellow", t("doctor.checks.services.logProblem", { problem: input.logProblem })));
  for (const row of input.providers) findings.push(serviceFinding(row));
  for (const [name, count] of Object.entries(input.timeouts).sort((a, b) => b[1] - a[1])) {
    const red = count >= TIMEOUT_RED_COUNT;
    const extra = red ? t("doctor.checks.services.timeoutRed", { limit: TIMEOUT_RED_COUNT }) : "";
    findings.push(finding(`service:timeout:${name}`, red ? "red" : "green", t("doctor.checks.services.timeout", { name, window: TIMEOUT_WINDOW_MIN, count, extra })));
  }
  const bad = findings.filter((row) => row.status === "red");
  const summary = servicesSummary(input.providers, bad.length, input.logProblem);
  if (input.providers.length === 0) findings.push(finding("service:none", "red", t("doctor.checks.services.none")));
  return makeItem({ id: "services", title: t("doctor.checks.services.title"), summary, evidence: ["paseo provider ls --json", t("doctor.checks.services.evidenceLog")], findings });
}
var DESKTOP_APP_MARK = "/Library/Application Support/Claude/claude-code/";
var SESSION_LINE = /^\s*(\d+)\s+(\/.*?\/claude(?:\.app\/Contents\/MacOS\/claude)?)\s+(?:--output-format|-p\s)/;
function parseClaudeSessions(psOutput) {
  const out = [];
  for (const line of psOutput.split("\n")) {
    if (line.includes("/Helpers/disclaimer")) continue;
    const hit = SESSION_LINE.exec(line);
    if (hit) out.push({ pid: Number(hit[1]), path: hit[2] });
  }
  return out;
}
function claudePathFindings(input) {
  const findings = [];
  const seen = /* @__PURE__ */ new Set();
  for (const bin of input.pathBinaries) {
    if (bin.real === input.configReal || seen.has(bin.real)) continue;
    seen.add(bin.real);
    const same = bin.version !== null && bin.version === input.configVersion;
    const match = same ? t("doctor.checks.claude.pathSame") : t("doctor.checks.claude.pathDiff", { version: input.configVersion ?? "?" });
    findings.push(finding(`claude:path:${bin.path}`, same ? "green" : "yellow", t("doctor.checks.claude.pathOther", { path: bin.path, version: bin.version ?? t("doctor.checks.claude.versionNotFound"), match })));
  }
  return findings;
}
function claudeSessionFindings(input) {
  const findings = [];
  const away = input.sessions.filter((row) => row.real !== input.configReal && !row.path.includes(DESKTOP_APP_MARK));
  const desktop = input.sessions.filter((row) => row.path.includes(DESKTOP_APP_MARK));
  const off = away.filter((row) => row.version === null || row.version !== input.configVersion);
  if (off.length > 0) {
    const paths = joinList([...new Set(off.map((row) => t("doctor.checks.claude.sessionPath", { path: row.path, version: row.version ?? t("doctor.checks.claude.sessionVersionUnknown") })))]);
    findings.push(finding("claude:sessions", "yellow", t("doctor.checks.claude.sessionsOff", { count: off.length, paths, version: input.configVersion ?? "?" })));
  } else {
    const detail = away.length > 0 ? t("doctor.checks.claude.sessionsAwaySame", { count: away.length }) : "";
    findings.push(finding("claude:sessions", "green", t("doctor.checks.claude.sessionsOk", { count: input.sessions.length - desktop.length, detail })));
  }
  if (desktop.length > 0) {
    const versions = joinList([...new Set(desktop.map((row) => row.path.split("/claude-code/")[1]?.split("/")[0] ?? "?"))]);
    findings.push(finding("claude:desktop", "green", t("doctor.checks.claude.desktop", { count: desktop.length, versions })));
  }
  return findings;
}
function checkClaudeCode(input) {
  const evidence = [t("doctor.checks.claude.evidenceConfig"), t("doctor.checks.claude.evidenceWhich"), "ps -axo pid,command"];
  const findings = [];
  if (!input.configCommand) {
    return makeItem({ id: "claude-code", title: "Claude Code", summary: t("doctor.checks.claude.noConfigSummary"), evidence, findings: [finding("claude:config", "red", t("doctor.checks.claude.noConfig"))] });
  }
  if (!input.configVersion) findings.push(finding("claude:config", "red", t("doctor.checks.claude.configNoVersion", { command: input.configCommand })));
  else findings.push(finding("claude:config", "green", t("doctor.checks.claude.configOk", { command: input.configCommand, version: input.configVersion })));
  findings.push(...claudePathFindings(input), ...claudeSessionFindings(input));
  const yellow = findings.some((row) => row.status === "yellow");
  const red = findings.some((row) => row.status === "red");
  const summary = red ? t("doctor.checks.claude.summaryRed") : yellow ? t("doctor.checks.claude.summaryYellow") : t("doctor.checks.claude.summaryOk", { version: String(input.configVersion) });
  return makeItem({ id: "claude-code", title: "Claude Code", summary, evidence, findings });
}
var isTmpPath = (path) => /^(\/private)?\/tmp(\/|$)/.test(path);
function checkResidue(input) {
  const findings = [];
  for (const row of input.workspaces.filter((ws) => isTmpPath(ws.cwd))) {
    findings.push(finding(`residue:workspace:${row.workspaceId}`, "yellow", t("doctor.checks.residue.workspace", { name: row.name, project: row.project, cwd: row.cwd })));
  }
  for (const row of input.projects.filter((project) => isTmpPath(project.path))) {
    findings.push(finding(`residue:project:${row.projectId}`, "yellow", t("doctor.checks.residue.project", { name: row.name, path: row.path })));
  }
  if (findings.length === 0) findings.push(finding("residue:none", "green", t("doctor.checks.residue.none", { workspaces: input.workspaces.length, projects: input.projects.length })));
  const count = findings.filter((row) => row.status === "yellow").length;
  return makeItem({
    id: "residue",
    title: t("doctor.checks.residue.title"),
    summary: count === 0 ? t("doctor.checks.residue.summaryNone") : t("doctor.checks.residue.summaryFound", { count }),
    evidence: ["paseo workspace ls --json", "paseo project ls --json"],
    findings
  });
}
var FAILED_RUN = /fail|error|timeout|timed_out|cancel/i;
var OK_RUN = /^(succeeded|success|completed|ok|running|pending|queued)$/i;
function scheduleFinding(row) {
  const key = `schedule:${row.id}`;
  const label = t("doctor.checks.schedules.label", { name: row.name, id: row.id });
  if (row.status !== "active") {
    return finding(key, "green", t("doctor.checks.schedules.inactive", { label, status: row.status === "paused" ? t("doctor.checks.schedules.paused") : row.status }));
  }
  if (row.logsError) return finding(key, "yellow", t("doctor.checks.schedules.logsError", { label, error: row.logsError }));
  const run = row.lastRun;
  if (!run) return finding(key, "green", t("doctor.checks.schedules.neverRan", { label }));
  const at = run.startedAt ?? "?";
  if (FAILED_RUN.test(run.status)) {
    const error2 = run.error ? t("doctor.checks.schedules.failedError", { error: run.error.slice(0, 120) }) : "";
    return finding(key, "red", t("doctor.checks.schedules.failed", { label, at, status: run.status, error: error2 }));
  }
  if (!OK_RUN.test(run.status)) return finding(key, "yellow", t("doctor.checks.schedules.unknown", { label, status: run.status }));
  return finding(key, "green", t("doctor.checks.schedules.ok", { label, status: run.status, at }));
}
function checkSchedules(rows) {
  const findings = rows.map(scheduleFinding);
  const failed = findings.filter((row) => row.status === "red").length;
  const inactive = rows.filter((row) => row.status !== "active").length;
  const okSummary = () => t("doctor.checks.schedules.summaryOk", { count: rows.length, inactive: inactive ? t("doctor.checks.schedules.summaryInactive", { count: inactive }) : "" });
  return makeItem({
    id: "schedules",
    title: t("doctor.checks.schedules.title"),
    summary: rows.length === 0 ? t("doctor.checks.schedules.summaryNone") : failed > 0 ? t("doctor.checks.schedules.summaryFailed", { count: failed }) : okSummary(),
    evidence: ["paseo schedule ls --json", "paseo schedule logs <id> --json"],
    findings
  });
}
function checkCompat(state, now, path) {
  const base = { id: "compat", title: t("doctor.checks.compat.title"), evidence: [path] };
  const results = isRecord(state) ? asArray(state.results).filter(isRecord) : [];
  if (results.length === 0) {
    return makeItem({ ...base, summary: t("doctor.checks.compat.summaryNone"), findings: [finding("compat:none", "yellow", t("doctor.checks.compat.none"))] });
  }
  const findings = results.map((row) => {
    const id = str(row.id) ?? "?";
    const status = str(row.status) ?? "?";
    const conclusion = str(row.conclusion);
    const label = t("doctor.checks.compat.row", { label: str(row.label) ?? id, status, conclusion: conclusion ? t("doctor.checks.compat.rowConclusion", { conclusion }) : "" });
    return finding(`compat:${id}`, status === "pass" ? "green" : "red", label);
  });
  const recordedAt = Date.parse(isRecord(state) ? str(state.recordedAt) ?? "" : "");
  const when = Number.isNaN(recordedAt) ? t("doctor.checks.compat.whenUnknown") : t("doctor.checks.compat.ago", { age: ageText(Math.max(0, now - recordedAt) / MIN_MS) });
  const failed = findings.filter((row) => row.status === "red").length;
  const version2 = (isRecord(state) ? str(state.version) : null) ?? "?";
  return makeItem({ ...base, summary: failed === 0 ? t("doctor.checks.compat.summaryOk", { version: version2, when }) : t("doctor.checks.compat.summaryFailed", { count: failed, version: version2, when }), findings });
}
function earliest(dates) {
  const ok = dates.filter((date3) => date3 !== null && !Number.isNaN(Date.parse(date3))).sort();
  return ok[0] ?? null;
}
function couponLines(couponState, plans) {
  const companies = isRecord(couponState) && isRecord(couponState.companies) ? couponState.companies : {};
  const fromPlans = {};
  for (const plan of isRecord(plans) ? asArray(plans.plans).filter(isRecord) : []) {
    const id = str(plan.id);
    if (!id) continue;
    const company = companyKeyOf({ ...plan, id });
    const coupons = asArray(plan.resetCoupons).filter(isRecord);
    const count = coupons.reduce((sum, row) => sum + (num(row.count) ?? 0), 0);
    fromPlans[company] = { company, count, expiresAt: earliest(coupons.map((row) => str(row.expiresAt))) };
  }
  const names = /* @__PURE__ */ new Set([...Object.keys(companies), ...Object.keys(fromPlans)]);
  return [...names].map((company) => {
    const live = isRecord(companies[company]) ? companies[company] : {};
    const trusted = live.via === "cli" || live.via === "paseo";
    const confirmed = trusted && Boolean(str(live.confirmedAt)) && (live.status === "ok" || live.status === "unreadable");
    if (confirmed) {
      const items = asArray(live.items).filter(isRecord).map((row) => str(row.expiresAt));
      return { company, count: num(live.count) ?? 0, expiresAt: earliest([...items, str(live.expiresAt)]) };
    }
    return fromPlans[company] ?? { company, count: 0, expiresAt: null };
  });
}
function couponFinding(line, now) {
  const key = `coupon:${line.company}`;
  const { company, count } = line;
  if (count === 0) return finding(key, "green", t("doctor.checks.coupons.zero", { company }));
  if (!line.expiresAt) return finding(key, "green", t("doctor.checks.coupons.noExpiry", { company, count }));
  const days = (Date.parse(line.expiresAt) - now) / DAY_MS2;
  const soon = days <= COUPON_SOON_DAYS;
  const when = days < 0 ? t("doctor.checks.coupons.expired", { days: Math.ceil(-days) }) : t("doctor.checks.coupons.expiresIn", { days: Math.ceil(days) });
  const soonNote = soon ? t("doctor.checks.coupons.soonNote", { days: COUPON_SOON_DAYS }) : "";
  return finding(key, soon ? "yellow" : "green", t("doctor.checks.coupons.line", { company, count, date: line.expiresAt.slice(0, 10), when, soon: soonNote }));
}
function checkCoupons(couponState, plans, now, evidence = ["<data dir>/reset-coupons.json", "<data dir>/plans.json"]) {
  const findings = couponLines(couponState, plans).map((line) => couponFinding(line, now));
  const soon = findings.filter((row) => row.status === "yellow").length;
  const total = couponLines(couponState, plans).reduce((sum, line) => sum + line.count, 0);
  return makeItem({
    id: "coupons",
    title: t("doctor.checks.coupons.title"),
    summary: soon > 0 ? t("doctor.checks.coupons.summarySoon", { count: soon, days: COUPON_SOON_DAYS }) : t("doctor.checks.coupons.summaryOk", { total, days: COUPON_SOON_DAYS }),
    evidence,
    findings
  });
}
var KANBAN_REPORT_STALE_MIN = 90;
function kanbanSummary(red, yellow, stale) {
  if (red > 0) return t("doctor.checks.kanban.summaryRed", { count: red });
  if (yellow > 0) return t("doctor.checks.kanban.summaryYellow", { count: yellow });
  return stale ? t("doctor.checks.kanban.summaryStale") : t("doctor.checks.kanban.summaryOk");
}
function checkKanban(outcome, now, bin = "kanban") {
  const evidence = [t("doctor.checks.kanban.evidence", { bin })];
  const base = { id: "kanban", title: t("doctor.checks.kanban.title"), evidence };
  if (outcome.absent) {
    return makeItem({ ...base, evidence: ["exports/kanban.json"], summary: "Kanban is not installed; board checks skipped", findings: [finding("kanban:absent", "green", "kanban absent: no exports/kanban.json, so the board panels and the idle sweep are off")] });
  }
  if (!outcome.ran) return makeItem({ ...base, summary: t("doctor.checks.kanban.missingSummary"), findings: [finding("kanban:missing", "yellow", t("doctor.checks.kanban.missing", { bin }))] });
  if (outcome.timedOut) return makeItem({ ...base, summary: t("doctor.checks.kanban.timeoutSummary"), findings: [finding("kanban:timeout", "yellow", t("doctor.checks.kanban.timeout"))] });
  const json2 = outcome.json;
  if (!isRecord(json2) || !isRecord(json2.counts)) {
    const error2 = (outcome.error ?? t("doctor.checks.kanban.noOutput")).slice(0, 160);
    return makeItem({ ...base, summary: t("doctor.checks.kanban.errorSummary"), findings: [finding("kanban:error", "yellow", t("doctor.checks.kanban.error", { error: error2 }))] });
  }
  const red = num(json2.counts.red) ?? 0;
  const yellow = num(json2.counts.yellow) ?? 0;
  const findings = [finding("kanban:counts", red > 0 ? "red" : yellow > 0 ? "yellow" : "green", t("doctor.checks.kanban.counts", { red, yellow, info: num(json2.counts.info) ?? 0 }))];
  const seen = /* @__PURE__ */ new Set();
  for (const row of asArray(json2.findings).filter(isRecord)) {
    const severity = str(row.severity);
    if (severity !== "red" && severity !== "yellow") continue;
    const label = `${str(row.project) ?? ""} ${str(row.card) ?? ""} ${str(row.symptom) ?? "?"}`.replace(/\s+/g, " ").trim();
    if (seen.has(label)) continue;
    seen.add(label);
    findings.push(finding(`kanban:${label}`, severity, label));
  }
  const reportAt = Date.parse(str(json2.at) ?? "");
  const ageMin = Number.isNaN(reportAt) ? null : Math.max(0, now - reportAt) / MIN_MS;
  const stale = ageMin === null || ageMin > KANBAN_REPORT_STALE_MIN;
  if (stale) findings.push(finding("kanban:stale", "yellow", ageMin === null ? t("doctor.checks.kanban.staleNoTime") : t("doctor.checks.kanban.stale", { age: ageText(ageMin) })));
  return makeItem({ ...base, summary: kanbanSummary(red, yellow, stale), findings });
}
function checkDataDir(view) {
  const base = { id: "data-dir", title: "Data directory", evidence: [view.dir] };
  if (view.source === "legacy") {
    return makeItem({
      ...base,
      summary: `Not migrated yet: using the legacy state directory ${view.dir} (after migration: ${view.dataDir})`,
      findings: [finding("data-dir:legacy", "green", "Not migrated yet; `afc migrate --from <legacy dir>` moves it when you are ready")]
    });
  }
  const why = view.source === "override" ? " (from AFC_DATA_DIR)" : "";
  return makeItem({ ...base, summary: `Using ${view.dir}${why}`, findings: [] });
}
var MIGRATION_TITLE = "Migration check";
var LEGACY_LISTED = 5;
function listNames(names) {
  const head = names.slice(0, LEGACY_LISTED).join(", ");
  return names.length > LEGACY_LISTED ? `${head} and ${names.length - LEGACY_LISTED} more` : head;
}
function activeMigrationFindings(view, now) {
  const { record: record3 } = view;
  const findings = [];
  if (view.usingLegacy) findings.push(finding("migration:not-in-use", "red", `The cockpit reads the legacy directory although migration ${record3.id} is active; decisions.json and plans.json are missing from ${record3.to}`));
  const copied = record3.checks.decisions;
  if (copied !== null) {
    if (view.decisionsNow === null) findings.push(finding("migration:decisions-unreadable", "yellow", `decisions.json in ${record3.to} is missing or unreadable (${copied} items at migration)`));
    else if (view.decisionsNow < copied) findings.push(finding("migration:decisions-shrank", "red", `decisions.json has ${view.decisionsNow} items, fewer than the ${copied} copied at migration`));
    else findings.push(finding("migration:decisions", "green", `decisions.json: ${view.decisionsNow} items (${copied} at migration)`));
  }
  const missing = view.legacy.filter((file) => file.now === null).map((file) => file.from);
  const changed = view.legacy.filter((file) => file.now !== null && (file.now.size !== file.recorded.size || file.now.mtimeMs !== file.recorded.mtimeMs)).map((file) => file.from);
  if (changed.length > 0) findings.push(finding("migration:legacy-changed", "yellow", `Legacy files changed after migration, so something still writes to ${record3.from}: ${listNames(changed)}`));
  if (missing.length > 0) findings.push(finding("migration:legacy-missing", "yellow", `Legacy files are gone before --finish: ${listNames(missing)}`));
  if (changed.length === 0 && missing.length === 0) findings.push(finding("migration:legacy", "green", `Legacy directory untouched (${view.legacy.length} files)`));
  const days = daysSince(record3.migratedAt, now);
  findings.push(
    days >= OBSERVATION_DAYS ? finding("migration:observation-over", "green", `Observation period over (${days} days): finish with \`afc migrate --finish ${record3.id}\``) : finding("migration:observation", "green", `Day ${days} of ${OBSERVATION_DAYS} of the observation period`)
  );
  return findings;
}
function checkMigration(view, now) {
  const base = { id: "migration", title: MIGRATION_TITLE, evidence: [view.path] };
  if (view.state === "absent") return makeItem({ ...base, summary: "No migration recorded", findings: [] });
  if (view.state === "invalid") {
    return makeItem({ ...base, summary: "MIGRATION.json is unreadable", findings: [finding("migration:invalid", "yellow", `MIGRATION.json is unreadable: ${view.reason}`)] });
  }
  const { record: record3 } = view;
  if (record3.status === "rolled-back") return makeItem({ ...base, summary: `Migration ${record3.id} was rolled back (${record3.rolledBackAt ?? "?"}); the legacy directory is in use`, findings: [] });
  if (record3.status === "finished") return makeItem({ ...base, summary: `Migration ${record3.id} finished (${record3.finishedAt ?? "?"}); legacy files archived in ${record3.finish?.archive ?? "?"}`, findings: [] });
  const findings = activeMigrationFindings(view, now);
  const problem = findings.find((row) => row.status === "red") ?? findings.find((row) => row.status === "yellow");
  const days = daysSince(record3.migratedAt, now);
  const summary = problem ? problem.text : `Migration ${record3.id}: day ${days} of ${OBSERVATION_DAYS}; the data only grew and the legacy directory is untouched`;
  return makeItem({ ...base, summary, findings });
}

// server/kanban-source.ts
import { existsSync, readFileSync, statSync } from "node:fs";
import { homedir as homedir3 } from "node:os";

// shared/contract/schema.ts
var CONTRACT_SCHEMA = "fleet-quota/v1";
var PLUGIN_IDS = {
  cockpit: "agent-fleet-cockpit",
  kanban: "paseo-kanban"
};
var isoDateTime2 = iso_exports.datetime({ offset: true });
var Envelope = object({
  schema: literal(CONTRACT_SCHEMA),
  producer: _enum([PLUGIN_IDS.cockpit, PLUGIN_IDS.kanban]),
  producerVersion: string2(),
  /** Optional for v1.0 readers and files; additive contract revisions use semantic versions. */
  contractVersion: string2().optional(),
  generatedAt: isoDateTime2,
  ttlSeconds: number2().int().positive()
});
var byCockpit = { producer: literal(PLUGIN_IDS.cockpit) };
var byKanban = { producer: literal(PLUGIN_IDS.kanban) };
var infoFields = {
  dataDir: string2(),
  cli: string2().nullable(),
  features: array(string2())
};
var CockpitInfo = Envelope.extend({ ...byCockpit, ...infoFields });
var KanbanInfo = Envelope.extend({ ...byKanban, ...infoFields });
var PoolState = object({
  quotaProtection: _enum(["pause", "none"]).optional(),
  readingExpiresAt: isoDateTime2.nullable().optional(),
  dispatchable: boolean2(),
  deprioritize: boolean2(),
  prefer: boolean2(),
  usedPct: number2().min(0).max(100).nullable(),
  resetsAt: isoDateTime2.nullable(),
  onlyRoles: array(string2()).nullable(),
  reason: string2().nullable()
});
var PoolStatus = Envelope.extend({
  quotaConfigured: boolean2().optional(),
  ...byCockpit,
  pools: record(string2(), PoolState),
  priority: object({
    order: array(string2()),
    mode: _enum(["user", "auto"])
  }).nullable()
});
var MatrixEntry = object({
  profile: string2(),
  effort: string2().nullable(),
  paused: boolean2().optional(),
  /** Explicit candidate order, ahead of quota-sorted candidates without this field. */
  order: number2().int().min(1).max(1e3).optional()
});
var TierMap = record(string2(), array(MatrixEntry));
var RoleMatrix = union([object({ byExecutorFamily: record(string2(), TierMap) }), TierMap]);
var DispatchMatrix = Envelope.extend({
  ...byCockpit,
  version: number2().int(),
  defaultTier: string2(),
  roles: record(string2(), RoleMatrix),
  downgradeWhenTight: array(string2()),
  priority: object({
    order: array(string2()),
    until: isoDateTime2,
    mode: _enum(["quota", "manual"]).optional()
  }).nullable().optional()
});
var OpenDecision = object({
  id: string2(),
  project: string2(),
  title: string2(),
  detail: string2(),
  blocking: boolean2(),
  agentId: string2().nullable(),
  createdAt: isoDateTime2,
  owner: string2().nullable().optional(),
  userComments: array(object({ at: isoDateTime2, note: string2() })).optional()
});
var Decision = OpenDecision.extend({ status: string2().min(1) });
var Decisions = Envelope.extend({ ...byCockpit, items: array(Decision) });
var PausedProjects = Envelope.extend({
  ...byCockpit,
  projects: array(object({ project: string2().min(1), since: isoDateTime2.nullable(), note: string2() }))
});
var DecisionsOpen = Envelope.extend({ ...byCockpit, items: array(OpenDecision) });
var BoardProject = object({
  name: string2(),
  code: string2(),
  leaderAgentId: string2().nullable(),
  root: string2().nullable()
});
var BoardCard = object({
  code: string2(),
  project: string2(),
  status: string2(),
  role: string2(),
  agentId: string2().nullable(),
  pool: string2().nullable(),
  profile: string2().nullable(),
  startedAt: isoDateTime2.nullable(),
  finishedAt: isoDateTime2.nullable()
});
var BoardSummary = Envelope.extend({
  ...byKanban,
  projects: array(BoardProject),
  cards: array(BoardCard),
  /** Optional: the board database, which the cockpit may open read-only for deeper queries. */
  dbPath: string2().nullable()
});
var EXPORTS = {
  cockpit: { producer: PLUGIN_IDS.cockpit, file: "cockpit.json", ttlSeconds: 1800, schema: CockpitInfo },
  poolStatus: { producer: PLUGIN_IDS.cockpit, file: "pool-status.json", ttlSeconds: 900, schema: PoolStatus },
  dispatchMatrix: {
    producer: PLUGIN_IDS.cockpit,
    file: "dispatch-matrix.json",
    ttlSeconds: 900,
    schema: DispatchMatrix
  },
  decisionsOpen: { producer: PLUGIN_IDS.cockpit, file: "decisions-open.json", ttlSeconds: 600, schema: DecisionsOpen },
  decisions: { producer: PLUGIN_IDS.cockpit, file: "decisions.json", ttlSeconds: 600, schema: Decisions },
  pausedProjects: { producer: PLUGIN_IDS.cockpit, file: "paused-projects.json", ttlSeconds: 600, schema: PausedProjects },
  kanban: { producer: PLUGIN_IDS.kanban, file: "kanban.json", ttlSeconds: 1800, schema: KanbanInfo },
  boardSummary: { producer: PLUGIN_IDS.kanban, file: "board-summary.json", ttlSeconds: 900, schema: BoardSummary }
};

// server/contract/paths.ts
import { homedir as homedir2 } from "node:os";
import { isAbsolute, join as join2, resolve } from "node:path";
var EXPORTS_DIR_NAME = "exports";
var DATA_DIR_ENV = {
  [PLUGIN_IDS.cockpit]: "AFC_DATA_DIR",
  [PLUGIN_IDS.kanban]: "KANBAN_DATA_DIR"
};
function envPath(env, name, home) {
  const raw = env[name]?.trim();
  if (!raw) return null;
  if (raw === "~") return home;
  if (raw.startsWith("~/")) return join2(home, raw.slice(2));
  return isAbsolute(raw) ? raw : resolve(raw);
}
function paseoHome(env = process.env, home = homedir2()) {
  return envPath(env, "PASEO_HOME", home) ?? join2(home, ".paseo");
}
function pluginDataDir(pluginId, env = process.env, home = homedir2()) {
  return envPath(env, DATA_DIR_ENV[pluginId], home) ?? join2(paseoHome(env, home), "plugin-data", pluginId);
}
function exportsDir(pluginId, env = process.env, home = homedir2()) {
  return join2(pluginDataDir(pluginId, env, home), EXPORTS_DIR_NAME);
}
function exportPath(kind, env = process.env, home = homedir2()) {
  const spec = EXPORTS[kind];
  return join2(exportsDir(spec.producer, env, home), spec.file);
}

// server/contract/io.ts
var STALE_FACTOR = 3;
function envelopeAgeSeconds(envelope, now) {
  const age = (now.getTime() - Date.parse(envelope.generatedAt)) / 1e3;
  return Math.max(0, age);
}
function classifyFreshness(envelope, now) {
  return envelopeAgeSeconds(envelope, now) > envelope.ttlSeconds * STALE_FACTOR ? "stale" : "fresh";
}
function errorMessage(error2) {
  return error2 instanceof Error ? error2.message : String(error2);
}
function describeIssues(error2) {
  return error2.issues.slice(0, 3).map((issue2) => `${issue2.path.join(".") || "(root)"}: ${issue2.message}`).join("; ");
}
function parseContract(text2, schema, now = /* @__PURE__ */ new Date()) {
  let json2;
  try {
    json2 = JSON.parse(text2);
  } catch (error2) {
    return { state: "invalid", reason: `bad JSON: ${errorMessage(error2)}` };
  }
  const declared = typeof json2 === "object" && json2 !== null ? json2.schema : void 0;
  if (declared !== CONTRACT_SCHEMA) {
    return { state: "invalid", reason: `schema is ${JSON.stringify(declared)}, expected ${CONTRACT_SCHEMA}` };
  }
  const parsed = schema.safeParse(json2);
  if (!parsed.success) return { state: "invalid", reason: describeIssues(parsed.error) };
  const value = parsed.data;
  const ageSeconds = envelopeAgeSeconds(value, now);
  return { state: classifyFreshness(value, now), value, ageSeconds };
}
function onceLogger(log) {
  const seen = /* @__PURE__ */ new Set();
  return (file, reason) => {
    const key = `${file}
${reason}`;
    if (seen.has(key)) return;
    seen.add(key);
    log(`fleet-quota: ignoring invalid ${file}: ${reason}`);
  };
}

// server/kanban-source.ts
var ABSENT_SOURCE = { presence: "absent", info: null, summary: null, dbPath: null, staleSeconds: null };
function valueOf(result) {
  return result.state === "fresh" || result.state === "stale" ? result.value : null;
}
function resolveKanbanSource(info, summary, exists = existsSync) {
  const infoValue = valueOf(info);
  if (!infoValue) return ABSENT_SOURCE;
  const summaryValue = valueOf(summary);
  const staleAges = [info, summary].flatMap((read) => read.state === "stale" ? [read.ageSeconds] : []);
  const candidate = summaryValue?.dbPath ?? null;
  return {
    presence: staleAges.length > 0 || !summaryValue ? "stale" : "fresh",
    info: infoValue,
    summary: summaryValue,
    dbPath: candidate && exists(candidate) ? candidate : null,
    staleSeconds: staleAges.length > 0 ? Math.round(Math.max(...staleAges)) : null
  };
}
var fileMemo = /* @__PURE__ */ new Map();
var logInvalid = onceLogger((message) => console.error(`[afc] ${message}`));
function readContractSync(file, schema, now) {
  let mtimeMs;
  let size;
  try {
    const stat2 = statSync(file);
    mtimeMs = stat2.mtimeMs;
    size = stat2.size;
  } catch {
    fileMemo.delete(file);
    return { state: "absent" };
  }
  let memo2 = fileMemo.get(file);
  if (!memo2 || memo2.mtimeMs !== mtimeMs || memo2.size !== size) {
    let parsed;
    try {
      const result = parseContract(readFileSync(file, "utf8"), schema, now);
      parsed = result.state === "invalid" ? { kind: "invalid", reason: result.reason } : result.state === "absent" ? { kind: "invalid", reason: "empty" } : { kind: "value", value: result.value };
    } catch (error2) {
      parsed = { kind: "invalid", reason: `unreadable: ${String(error2).slice(0, 120)}` };
    }
    memo2 = { mtimeMs, size, parsed };
    fileMemo.set(file, memo2);
  }
  if (memo2.parsed.kind === "invalid") {
    logInvalid(file, memo2.parsed.reason);
    return { state: "invalid", reason: memo2.parsed.reason };
  }
  const value = memo2.parsed.value;
  return { state: classifyFreshness(value, now), value, ageSeconds: envelopeAgeSeconds(value, now) };
}
function kanbanSource(options = {}) {
  const env = options.env ?? process.env;
  const home = options.home ?? homedir3();
  const now = options.now ?? /* @__PURE__ */ new Date();
  const info = readContractSync(exportPath("kanban", env, home), KanbanInfo, now);
  if (info.state === "absent" || info.state === "invalid") return ABSENT_SOURCE;
  const summary = readContractSync(exportPath("boardSummary", env, home), BoardSummary, now);
  return resolveKanbanSource(info, summary);
}

// server/node-paths.ts
import { readdir } from "node:fs/promises";
import { join as join6 } from "node:path";

// server/util.ts
import { execFile } from "node:child_process";
import { homedir as homedir5 } from "node:os";
import { basename as basename2, dirname as dirname3, join as join5 } from "node:path";

// server/paths.ts
import { existsSync as existsSync2, readFileSync as readFileSync2, statSync as statSync2 } from "node:fs";
import { homedir as homedir4 } from "node:os";
import { basename, dirname as dirname2, join as join3 } from "node:path";
var STATE_MARKERS = ["decisions.json", "plans.json"];
var KANBAN_MARKERS = ["kanban.config.json", "kanban.db"];
function legacyStateDir(home = homedir4(), env = process.env) {
  return env.AFC_LEGACY_DATA_DIR?.trim() || join3(home, ".config", "fleet-roles");
}
function hasAny(dir, names, exists) {
  return names.some((name) => exists(join3(dir, name)));
}
function chooseDataDir(env = process.env, home = homedir4(), exists = existsSync2) {
  const legacyDir = legacyStateDir(home, env);
  const dataDir2 = pluginDataDir(PLUGIN_IDS.cockpit, env, home);
  if (env.AFC_DATA_DIR?.trim()) return { dir: dataDir2, source: "override", dataDir: dataDir2, legacyDir };
  if (hasAny(dataDir2, STATE_MARKERS, exists)) return { dir: dataDir2, source: "data-dir", dataDir: dataDir2, legacyDir };
  if (hasAny(legacyDir, STATE_MARKERS, exists)) return { dir: legacyDir, source: "legacy", dataDir: dataDir2, legacyDir };
  return { dir: dataDir2, source: "data-dir", dataDir: dataDir2, legacyDir };
}
var choiceMemo = /* @__PURE__ */ new Map();
function dataDirChoice(env = process.env, home = homedir4()) {
  const key = [home, env.AFC_DATA_DIR ?? "", env.PASEO_HOME ?? ""].join("\0");
  const hit = choiceMemo.get(key);
  if (hit) return hit;
  const choice = chooseDataDir(env, home);
  choiceMemo.set(key, choice);
  return choice;
}
function dataDir(env = process.env, home = homedir4()) {
  return dataDirChoice(env, home).dir;
}
function paseoConfigPath(env = process.env, home = homedir4()) {
  return join3(paseoHome(env, home), "config.json");
}
var pluginsMemo = /* @__PURE__ */ new Map();
function installedPlugins(configPath) {
  let mtimeMs;
  try {
    mtimeMs = statSync2(configPath).mtimeMs;
  } catch {
    return {};
  }
  const hit = pluginsMemo.get(configPath);
  if (hit && hit.mtimeMs === mtimeMs) return hit.plugins;
  let plugins = {};
  try {
    const parsed = JSON.parse(readFileSync2(configPath, "utf8"));
    const raw = parsed && typeof parsed === "object" ? parsed.plugins : void 0;
    plugins = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  } catch (error2) {
    console.error(`[afc] paths: cannot read plugins from ${configPath}:`, String(error2).slice(0, 160));
  }
  pluginsMemo.set(configPath, { mtimeMs, plugins });
  return plugins;
}
function pluginInstallDir(pluginId, env = process.env, home = homedir4()) {
  const row = installedPlugins(paseoConfigPath(env, home))[pluginId];
  if (!row || typeof row !== "object") return null;
  const path = row.path;
  return typeof path === "string" && path.trim() ? path.trim() : null;
}
function envDir(env, name) {
  const raw = env[name]?.trim();
  return raw ? raw : null;
}
function kanbanPluginDir(env = process.env, home = homedir4()) {
  return envDir(env, "KANBAN_HOME") ?? pluginInstallDir(PLUGIN_IDS.kanban, env, home);
}
function chooseKanbanDataDir(env = process.env, home = homedir4(), exists = existsSync2) {
  const dataDir2 = pluginDataDir(PLUGIN_IDS.kanban, env, home);
  if (env.KANBAN_DATA_DIR?.trim()) return dataDir2;
  if (hasAny(dataDir2, KANBAN_MARKERS, exists)) return dataDir2;
  const plugin = kanbanPluginDir(env, home);
  const legacy = plugin ? join3(plugin, "data") : null;
  if (legacy && hasAny(legacy, KANBAN_MARKERS, exists)) return legacy;
  return dataDir2;
}
var kanbanMemo = /* @__PURE__ */ new Map();
function kanbanDataDir(env = process.env, home = homedir4()) {
  const key = [home, env.KANBAN_DATA_DIR ?? "", env.KANBAN_HOME ?? "", env.PASEO_HOME ?? ""].join("\0");
  const hit = kanbanMemo.get(key);
  if (hit) return hit;
  const dir = chooseKanbanDataDir(env, home);
  kanbanMemo.set(key, dir);
  return dir;
}
function kanbanRoot(env = process.env, home = homedir4()) {
  return kanbanPluginDir(env, home) ?? join3(paseoHome(env, home), "plugins", PLUGIN_IDS.kanban);
}

// server/commands.ts
import { accessSync, constants, statSync as statSync3 } from "node:fs";
import { delimiter as delimiter2, isAbsolute as isAbsolute2, join as join4 } from "node:path";
function findCommand(name, path = commandPath()) {
  const candidates = isAbsolute2(name) ? [name] : path.split(delimiter2).filter(Boolean).map((dir) => join4(dir, name));
  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.X_OK);
      if (statSync3(candidate).isFile()) return candidate;
    } catch {
    }
  }
  return null;
}
function commandInvocation(command, args) {
  return command.endsWith(".mjs") ? { command: process.execPath, args: [command, ...args] } : { command, args: [...args] };
}

// server/util.ts
var HOME = homedir5();
var PASEO_DIR = paseoHome();
var CONFIG = paseoConfigPath();
var STATE_DIR = dataDir();
var CHANGES = join5(STATE_DIR, "changes.log");
var DECISIONS = join5(STATE_DIR, "decisions.json");
var LEDGER = join5(STATE_DIR, "usage-ledger.json");
var SEEN_MODELS = join5(STATE_DIR, "seen-models.json");
var LOG_CACHE = join5(STATE_DIR, "board-log-cache.json");
var commandOverrides = {};
var BIN = {
  get paseo() {
    return commandOverrides.paseo ?? findCommand("paseo") ?? "paseo";
  },
  set paseo(value) {
    commandOverrides.paseo = value;
  },
  get gh() {
    return commandOverrides.gh ?? findCommand("gh") ?? "gh";
  },
  set gh(value) {
    commandOverrides.gh = value;
  },
  get git() {
    return commandOverrides.git ?? findCommand("git") ?? "git";
  },
  set git(value) {
    commandOverrides.git = value;
  }
};
var ENV = { ...process.env, PATH: commandPath() };
function runOutcome(cmd, args, timeoutMs = 3e4) {
  return new Promise((resolve2) => {
    const invocation = commandInvocation(cmd, args);
    execFile(invocation.command, invocation.args, { timeout: timeoutMs, env: ENV, maxBuffer: 32 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (!err) {
        resolve2({ ok: true, stdout: String(stdout ?? ""), timedOut: false, error: null, exitCode: 0 });
        return;
      }
      const failed = err;
      const rawCode = err.code;
      const timedOut = Boolean(failed.killed) || rawCode === "ETIMEDOUT";
      resolve2({
        ok: false,
        stdout: String(stdout ?? ""),
        timedOut,
        error: String(stderr || err.message).replace(/\s+/g, " ").slice(0, 300),
        exitCode: typeof rawCode === "number" ? rawCode : null
      });
    });
  });
}
function tilde(path) {
  return path.startsWith(HOME) ? `~${path.slice(HOME.length)}` : path;
}

// server/node-paths.ts
function nvmNodeRoot(home) {
  return join6(home, ".nvm", "versions", "node");
}
function nvmVersionBin(version2, home = HOME) {
  return join6(nvmNodeRoot(home), version2, "bin");
}
var versionParts = (name) => name.replace(/^v/, "").split(".").map((part) => Number(part) || 0);
function compareNodeVersionsDesc(a, b) {
  const av = versionParts(a);
  const bv = versionParts(b);
  for (let i = 0; i < 3; i += 1) {
    const diff = (bv[i] ?? 0) - (av[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
async function nvmBinDirs(home = HOME) {
  let versions;
  try {
    versions = await readdir(nvmNodeRoot(home));
  } catch (error2) {
    if (error2.code !== "ENOENT") {
      console.error("[afc] nvm directory not readable:", String(error2).slice(0, 160));
    }
    return [];
  }
  return [...versions].sort(compareNodeVersionsDesc).map((version2) => nvmVersionBin(version2, home));
}

// server/doctor.ts
var LOG_TAIL_BYTES = 16 * 1024 * 1024;
var CMD_TIMEOUT_MS = 3e4;
var KANBAN_TIMEOUT_MS = 3e4;
var VERSION_TIMEOUT_MS = 1e4;
var MAX_SCHEDULE_LOGS = 40;
function productionDoctorDeps() {
  return {
    now: Date.now,
    stateDir: STATE_DIR,
    paseoDir: PASEO_DIR,
    configPath: CONFIG,
    kanbanRoot: kanbanRoot(),
    kanbanDataDir: kanbanDataDir(),
    kanban: () => {
      const source = kanbanSource();
      return { absent: source.presence === "absent", cli: source.info?.cli ?? null };
    },
    dataDir: dataDirChoice(),
    paseoBin: BIN.paseo,
    run: runOutcome,
    readJson: async (path) => {
      try {
        return JSON.parse(await readFile(path, "utf8"));
      } catch {
        return null;
      }
    },
    readTail: async (path, maxBytes) => {
      try {
        const handle = await open2(path, "r");
        try {
          const { size } = await handle.stat();
          const start = Math.max(0, size - maxBytes);
          const buffer = Buffer.alloc(size - start);
          const { bytesRead } = await handle.read(buffer, 0, buffer.length, start);
          return buffer.subarray(0, bytesRead).toString("utf8");
        } finally {
          await handle.close();
        }
      } catch {
        return null;
      }
    },
    listLogs: async (dir) => {
      const names = (await readdir2(dir)).filter((name) => name.endsWith("daemon.log"));
      const rows = await Promise.all(names.map(async (name) => ({ name, mtimeMs: (await stat(join7(dir, name))).mtimeMs })));
      return rows;
    },
    pathDirs: async () => [.../* @__PURE__ */ new Set([...commandPath().split(delimiter3), ...(await nvmBinDirs()).slice(0, 1)])],
    isFile: (path) => existsSync3(path),
    realpath: (path) => {
      try {
        return realpathSync(path);
      } catch {
        return path;
      }
    },
    readText: readTextFile,
    statFile: statRegularFile
  };
}
async function readTextFile(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error2) {
    if (error2.code === "ENOENT") return null;
    throw error2;
  }
}
async function statRegularFile(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? { size: info.size, mtimeMs: info.mtimeMs } : null;
  } catch (error2) {
    if (error2.code === "ENOENT") return null;
    throw error2;
  }
}
var record2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
var text = (value) => typeof value === "string" ? value : "";
function parseJsonList(out) {
  if (!out.ok) return null;
  try {
    const parsed = JSON.parse(out.stdout);
    return Array.isArray(parsed) ? parsed.map(record2) : null;
  } catch {
    return null;
  }
}
async function paseoList(deps, args) {
  return parseJsonList(await deps.run(deps.paseoBin, args, CMD_TIMEOUT_MS));
}
async function disabledPools(deps) {
  const config2 = record2(await deps.readJson(join7(deps.kanbanDataDir ?? join7(deps.kanbanRoot, "data"), "kanban.config.json")));
  return Array.isArray(config2.disabledPools) ? config2.disabledPools.filter((name) => typeof name === "string") : [];
}
async function providerStates(deps) {
  const rows = await paseoList(deps, ["provider", "ls", "--json"]);
  if (!rows) return null;
  return rows.map((row) => ({
    provider: text(row.provider),
    label: text(row.label) || text(row.provider),
    status: text(row.status),
    enabled: text(row.enabled).toLowerCase() === "enabled"
  }));
}
async function modelLists(deps, providers) {
  const entries = await Promise.all(providers.map(async (provider) => {
    const out = await deps.run(deps.paseoBin, ["provider", "models", provider, "--json"], CMD_TIMEOUT_MS);
    const rows = parseJsonList(out);
    return [provider, rows ? rows.map((row) => text(row.id)).filter(Boolean) : null];
  }));
  return Object.fromEntries(entries);
}
async function daemonTimeouts(deps, now) {
  const since = now - TIMEOUT_WINDOW_MIN * 6e4;
  let logs = [];
  try {
    logs = await deps.listLogs(deps.paseoDir);
  } catch (error2) {
    return { timeouts: {}, problem: t("doctor.server.listDirFailed", { dir: deps.paseoDir, error: String(error2).slice(0, 100) }) };
  }
  if (!logs.some((row) => row.name === "daemon.log")) return { timeouts: {}, problem: t("doctor.server.daemonLogMissing", { dir: deps.paseoDir }) };
  let timeouts = {};
  let problem = null;
  for (const log of logs.filter((row) => row.mtimeMs >= since || row.name === "daemon.log")) {
    const body = await deps.readTail(join7(deps.paseoDir, log.name), LOG_TAIL_BYTES);
    if (body === null) {
      if (log.name === "daemon.log") problem = t("doctor.server.daemonLogUnreadable", { dir: deps.paseoDir });
      continue;
    }
    try {
      timeouts = addCounts(timeouts, countRefreshTimeouts(body.split("\n"), now));
    } catch (error2) {
      problem = t("doctor.server.countFailed", { dir: deps.paseoDir, name: log.name, error: String(error2).slice(0, 100) });
    }
  }
  return { timeouts, problem };
}
function addCounts(a, b) {
  const sum = { ...a };
  for (const [name, count] of Object.entries(b)) sum[name] = (sum[name] ?? 0) + count;
  return sum;
}
async function claudeVersion(deps, path) {
  const out = await deps.run(path, ["--version"], VERSION_TIMEOUT_MS);
  return out.ok ? (/(\d+\.\d+\.\d+)/.exec(out.stdout)?.[1] ?? out.stdout.trim().slice(0, 40)) || null : null;
}
var VERSIONED_PATH = /\/(?:versions|claude-code)\/(\d+\.\d+\.\d+)(?:\/|$)/;
async function sessionsWithVersion(deps, rows, configReal, configVersion) {
  const byPath = /* @__PURE__ */ new Map();
  for (const path of new Set(rows.map((row) => row.path))) {
    const real = deps.realpath(path);
    byPath.set(path, real === configReal ? configVersion : VERSIONED_PATH.exec(real)?.[1] ?? (deps.isFile(path) ? await claudeVersion(deps, path) : null));
  }
  return rows.map((row) => ({ ...row, real: deps.realpath(row.path), version: byPath.get(row.path) ?? null }));
}
async function claudeItem(deps, config2) {
  if (!platformCapabilities(deps.platform).unixProcesses) return makeItem({
    id: "claude-code",
    title: "Claude Code",
    summary: t("doctor.platform.processSkipped"),
    evidence: [],
    findings: [{ key: "process:skipped", status: "yellow", text: t("doctor.platform.processSkipped") }]
  });
  const command = record2(record2(record2(record2(config2).agents).providers).claude).command;
  const configCommand = Array.isArray(command) && typeof command[0] === "string" ? command[0] : null;
  const configReal = configCommand ? deps.realpath(configCommand) : null;
  const configVersion = configCommand ? await claudeVersion(deps, configCommand) : null;
  const found = /* @__PURE__ */ new Map();
  for (const dir of await deps.pathDirs()) {
    const path = join7(dir, "claude");
    if (deps.isFile(path)) found.set(deps.realpath(path), path);
  }
  const pathBinaries = await Promise.all([...found].filter(([real]) => real !== configReal).map(async ([real, path]) => ({ path, real, version: await claudeVersion(deps, path) })));
  const ps = await deps.run("ps", ["-axo", "pid,command"], CMD_TIMEOUT_MS);
  const sessions = await sessionsWithVersion(deps, parseClaudeSessions(ps.stdout), configReal, configVersion);
  return checkClaudeCode({ configCommand, configReal, configVersion, pathBinaries, sessions });
}
async function scheduleRows(deps) {
  const list = await paseoList(deps, ["schedule", "ls", "--json"]);
  if (!list) return null;
  return Promise.all(list.slice(0, MAX_SCHEDULE_LOGS).map(async (row) => {
    const id = text(row.id);
    const base = { id, name: text(row.name) || id, status: text(row.status) };
    if (base.status !== "active") return { ...base, lastRun: null, logsError: null };
    const out = await deps.run(deps.paseoBin, ["schedule", "logs", id, "--json"], CMD_TIMEOUT_MS);
    const runs = parseJsonList(out);
    if (!runs) return { ...base, lastRun: null, logsError: (out.error ?? t("doctor.server.notJson")).slice(0, 100) };
    const last = [...runs].sort((a, b) => text(a.startedAt).localeCompare(text(b.startedAt))).at(-1);
    return { ...base, lastRun: last ? { status: text(last.status), startedAt: text(last.startedAt) || null, error: text(last.error) || null } : null, logsError: null };
  }));
}
function kanbanBin(deps) {
  return deps.kanban?.().cli ?? join7(deps.kanbanRoot, "bin", "kanban");
}
async function kanbanOutcome(deps) {
  if (deps.kanban?.().absent) return { absent: true, ran: false, ok: false, timedOut: false, error: null, json: null };
  const bin = kanbanBin(deps);
  if (!deps.isFile(bin)) return { ran: false, ok: false, timedOut: false, error: null, json: null };
  const out = await deps.run(bin, ["doctor", "--last", "--json"], KANBAN_TIMEOUT_MS);
  let json2 = null;
  try {
    json2 = JSON.parse(out.stdout);
  } catch {
    json2 = null;
  }
  return { ran: true, ok: out.ok, timedOut: out.timedOut, error: out.error, json: json2 };
}
function viewOfDataDir(deps) {
  const choice = deps.dataDir ?? { dir: deps.stateDir, source: "data-dir", dataDir: deps.stateDir };
  return { dir: tilde(choice.dir), source: choice.source, dataDir: tilde(choice.dataDir) };
}
async function migrationView(deps) {
  const dir = deps.dataDir?.dataDir ?? deps.stateDir;
  const path = join7(dir, MIGRATION_FILE);
  const text2 = deps.readText ? await deps.readText(path) : null;
  if (text2 === null) return { state: "absent", path: tilde(path) };
  const parsed = parseMigrationRecord(text2);
  if (!parsed.ok) return { state: "invalid", path: tilde(path), reason: parsed.reason };
  const { record: record3 } = parsed;
  const statFile = deps.statFile ?? (async () => null);
  const legacy = record3.status !== "migrated" ? [] : await Promise.all(
    record3.files.map(async (file) => ({ from: file.from, recorded: { size: file.size, mtimeMs: file.mtimeMs }, now: await statFile(join7(record3.from, ...file.from.split("/"))) }))
  );
  const decisionsNow = decisionItems(await deps.readJson(join7(record3.to, "decisions.json")))?.length ?? null;
  return { state: "ok", path: tilde(path), record: record3, decisionsNow, legacy, usingLegacy: deps.dataDir?.source === "legacy" };
}
function crashed(id, title, error2) {
  const message = String(error2).slice(0, 160);
  return makeItem({ id, title, summary: t("doctor.server.crashSummary", { message: message.slice(0, 80) }), evidence: [], findings: [{ key: `${id}:crash`, status: "yellow", text: t("doctor.server.crashFinding", { message }) }] });
}
async function runDoctor(deps = productionDoctorDeps()) {
  const started = deps.now();
  const guard = async (id, title, work) => {
    try {
      return await work();
    } catch (error2) {
      return crashed(id, title, error2);
    }
  };
  const config2 = await deps.readJson(deps.configPath);
  const stopped = await disabledPools(deps);
  const providers = await providerStates(deps);
  const profiles = parseProfiles(config2);
  const items = await Promise.all([
    guard("platform", t("doctor.platform.title"), async () => {
      const platform = deps.platform ?? process.platform;
      const capabilities = platformCapabilities(platform);
      return makeItem({
        id: "platform",
        title: t("doctor.platform.title"),
        summary: t("doctor.platform.summary", { platform, node: process.version }),
        evidence: [platform, process.version],
        findings: [
          { key: "platform:target", status: "yellow", text: t(capabilities.releaseTarget ? "doctor.platform.target" : "doctor.platform.unverified") },
          { key: "platform:keychain", status: "green", text: t(capabilities.keychain ? "doctor.platform.keychainOptional" : "doctor.platform.keychainSkipped") }
        ]
      });
    }),
    guard("quota", t("doctor.checks.quota.title"), async () => checkQuota(await deps.readJson(join7(deps.stateDir, "pool-status.json")), stopped, deps.now(), tilde(join7(deps.stateDir, "pool-status.json")))),
    guard("profiles", t("doctor.checks.profiles.title"), async () => {
      const wanted = [...new Set(profiles.filter(inDispatchChain).map((profile) => profile.provider).filter(Boolean))];
      return checkProfiles({ profiles, models: await modelLists(deps, wanted), providers, disabledPools: stopped });
    }),
    guard("services", t("doctor.checks.services.title"), async () => {
      const { timeouts, problem } = await daemonTimeouts(deps, deps.now());
      return checkServices({ providers: providers ?? [], timeouts, logProblem: problem });
    }),
    guard("claude-code", "Claude Code", () => claudeItem(deps, config2)),
    guard("residue", t("doctor.checks.residue.title"), async () => {
      const [workspaces, projects] = await Promise.all([paseoList(deps, ["workspace", "ls", "--json"]), paseoList(deps, ["project", "ls", "--json"])]);
      if (!workspaces || !projects) return makeItem({ id: "residue", title: t("doctor.checks.residue.title"), summary: t("doctor.server.residueUnreadableSummary"), evidence: ["paseo workspace ls --json", "paseo project ls --json"], findings: [{ key: "residue:unreadable", status: "yellow", text: t("doctor.server.residueUnreadable") }] });
      return checkResidue({
        workspaces: workspaces.map((row) => ({ workspaceId: text(row.workspaceId), project: text(row.project), name: text(row.name), cwd: text(row.cwd) })),
        projects: projects.map((row) => ({ projectId: text(row.projectId), name: text(row.name), path: text(row.path) }))
      });
    }),
    guard("schedules", t("doctor.checks.schedules.title"), async () => {
      const rows = await scheduleRows(deps);
      if (!rows) return makeItem({ id: "schedules", title: t("doctor.checks.schedules.title"), summary: t("doctor.server.schedulesUnreadableSummary"), evidence: ["paseo schedule ls --json"], findings: [{ key: "schedules:unreadable", status: "yellow", text: t("doctor.server.schedulesUnreadable") }] });
      return checkSchedules(rows);
    }),
    guard("compat", t("doctor.checks.compat.title"), async () => checkCompat(await deps.readJson(join7(deps.stateDir, "compat-state.json")), deps.now(), tilde(join7(deps.stateDir, "compat-state.json")))),
    guard("coupons", t("doctor.checks.coupons.title"), async () => checkCoupons(await deps.readJson(join7(deps.stateDir, "reset-coupons.json")), await deps.readJson(join7(deps.stateDir, "plans.json")), deps.now(), [tilde(join7(deps.stateDir, "reset-coupons.json")), tilde(join7(deps.stateDir, "plans.json"))])),
    guard("data-dir", "Data directory", async () => checkDataDir(viewOfDataDir(deps))),
    guard("migration", "Migration check", async () => checkMigration(await migrationView(deps), deps.now())),
    guard("kanban", t("doctor.checks.kanban.title"), async () => checkKanban(await kanbanOutcome(deps), deps.now(), tilde(kanbanBin(deps))))
  ]);
  return buildReport(items, new Date(started).toISOString(), deps.now() - started);
}

// server/language.ts
import { readFileSync as readFileSync3 } from "node:fs";
import { join as join8 } from "node:path";

// server/adapters/config.ts
var AFC_CONFIG_FILE = "afc.config.json";
var IN_USE_MARKERS = {
  [CURSOR_API]: ["cursor-usage.json", "cursor-login-state.json"],
  [KEYCHAIN]: ["keychain-probe-state.json"]
};

// server/language.ts
function languageSetting(raw) {
  const value = raw && typeof raw === "object" && !Array.isArray(raw) ? raw.language : void 0;
  return isLanguageSetting(value) ? value : "system";
}
function readSetting(dir) {
  try {
    return languageSetting(JSON.parse(readFileSync3(join8(dir, AFC_CONFIG_FILE), "utf8")));
  } catch {
    return "system";
  }
}
function initLanguage(dir = STATE_DIR, env = process.env) {
  const lang = languageOverride(env) ?? resolveLanguage(readSetting(dir), env);
  setLanguage(lang);
  return lang;
}

// server/doctor-cli.ts
initLanguage();
async function main() {
  const report = await runDoctor();
  console.log(process.argv.includes("--json") ? JSON.stringify(report, null, 2) : formatDoctorTable(report));
  process.exitCode = doctorExitCode(report);
}
main().catch((error2) => {
  console.error(t("doctor.cli.crashed"), String(error2).slice(0, 300));
  process.exitCode = 2;
});
