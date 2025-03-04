---
title: "不稳定的功能标志"
oldUrl:
 - /runtime/tools/unstable_flags/
 - /runtime/manual/tools/unstable_flags/
---

Deno
运行时的新功能通常会在功能标志后面发布，因此用户可以在功能最终确定之前尝试新的
API 和功能。当前不稳定的功能标志列在此页面上，也可以通过运行以下命令在 CLI
帮助文本中找到：

```sh
deno --help
```

## 在命令行中使用标志

当您从命令行运行 Deno 程序时，可以通过将标志作为选项传递给 CLI
来启用功能标志。以下是一个启用 `--unstable-node-globals` 标志运行程序的示例：

```sh
deno run --unstable-node-globals main.ts
```

## 在 `deno.json` 中配置标志

您可以使用 [`deno.json` 中的配置选项](/runtime/fundamentals/configuration/)
为您的项目指定要启用的不稳定功能。

```json title="deno.json"
{
  "unstable": ["bare-node-builtins", "webgpu"]
}
```

`unstable` 数组中的可能值是去除了 `--unstable-` 前缀的标志名称。

## 通过环境变量配置

某些标志可以通过为给定名称的环境变量设置值（任何值）来启用，而不是作为标志或
`deno.json` 配置选项传递。可以通过环境变量设置的标志将在下面注明。

以下是通过环境变量设置 `--unstable-bare-node-builtins` 标志的示例：

```sh
export DENO_UNSTABLE_BARE_NODE_BUILTINS=true
```

## `--unstable-bare-node-builtins`

**环境变量：** `DENO_UNSTABLE_BARE_NODE_BUILTINS`

此标志允许您[导入 Node.js 内置模块](/runtime/fundamentals/node/#node-built-in-modules)
而无需使用 `node:` 说明符，如下例所示。如果您手动管理 Node.js 依赖项（请参阅
[`byonm` 标志](#--unstable-byonm)），也可以使用此标志启用 npm 包而无需使用
`npm:` 说明符。

```ts title="example.ts"
import { readFileSync } from "fs";

console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

## `--unstable-detect-cjs`

**环境变量：** `DENO_UNSTABLE_DETECT_CJS`

在以下额外场景中将 `.js`、`.jsx`、`.ts` 和 `.tsx` 模块加载为可能是 CommonJS：

1. _package.json_ 没有 `"type"` 字段。
1. 不存在 _package.json_。

默认情况下，Deno 仅在您位于具有 _package.json_ 的项目中且最近的 _package.json_
具有 `{ "type": "commonjs" }` 时将这些模块加载为可能是 CommonJS。

需要 Deno >= 2.1.2

## `--unstable-node-globals`

此标志将 Node 特定的全局变量注入到全局作用域中。注入的全局变量包括：

- `Buffer`
- `global`
- `setImmediate`
- `clearImmediate`

请注意，从 Deno 2.0 开始，`process` 已经作为全局变量可用。

需要 Deno >= 2.1.0

## `--unstable-sloppy-imports`

**环境变量：** `DENO_UNSTABLE_SLOPPY_IMPORTS`

此标志启用从没有文件扩展名的导入中推断文件扩展名的行为。通常，下面的导入语句会产生错误：

```ts title="foo.ts"
import { Example } from "./bar";
console.log(Example);
```

```ts title="bar.ts"
export const Example = "Example";
```

启用 sloppy imports 执行脚本将消除错误，但会建议使用更高效的语法。

Sloppy imports 将允许（但会打印警告）以下情况：

- 从导入中省略文件扩展名
- 使用错误的文件扩展名（例如，使用 `.js` 扩展名导入，而实际文件是 `.ts`）
- 导入目录路径，并自动使用 `index.js` 或 `index.ts` 作为该目录的导入

[`deno compile`](/runtime/reference/cli/compile/) 不支持 sloppy imports。

## `--unstable-unsafe-proto`

Deno 出于安全考虑决定不支持 `Object.prototype.__proto__`。然而，仍然有许多 npm
包依赖此属性才能正常工作。

此标志启用此属性。请注意，不建议使用此功能，但如果您确实需要使用依赖它的包，现在可以使用此逃生舱口。

## `--unstable-webgpu`

在全局作用域中启用
[`WebGPU` API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGPU_API)，就像在浏览器中一样。以下是使用此
API 获取 GPU 基本信息的简单示例：

```ts
// 尝试从用户代理获取适配器。
const adapter = await navigator.gpu.requestAdapter();
if (adapter) {
  // 打印出适配器的一些基本信息。
  const adapterInfo = await adapter.requestAdapterInfo();

  // 在某些系统上，这将是空白的...
  console.log(`找到适配器：${adapterInfo.device}`);

  // 打印 GPU 功能列表
  const features = [...adapter.features.values()];
  console.log(`支持的功能：${features.join(", ")}`);
} else {
  console.error("未找到适配器");
}
```

查看 [此仓库](https://github.com/denoland/webgpu-examples) 以获取更多使用 WebGPU
的示例。

## `--unstable-broadcast-channel`

启用此标志使
[`BroadcastChannel`](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel)
web API 在全局作用域中可用，就像在浏览器中一样。

## `--unstable-worker-options`

启用不稳定的
[Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
API 选项。具体来说，它允许您指定 worker 可用的权限：

```ts
new Worker(`data:application/javascript;base64,${btoa(`postMessage("ok");`)}`, {
  type: "module",
  deno: {
    permissions: {
      read: true,
    },
  },
}).onmessage = ({ data }) => {
  console.log(data);
};
```

## `--unstable-cron`

启用此标志使 [`Deno.cron`](/deploy/kv/manual/cron) API 在 `Deno`
命名空间中可用。

## `--unstable-kv`

启用此标志使 [Deno KV](/deploy/kv/manual) API 在 `Deno` 命名空间中可用。

## `--unstable-net`

在 `Deno` 命名空间中启用不稳定的 net API。这些 API 包括：

- [`Deno.DatagramConn`](https://docs.denohub.com/api/deno/~/Deno.DatagramConn)

## `--unstable-otel`

启用 [Deno 的 OpenTelemetry 集成](/runtime/fundamentals/open_telemetry)。

## `--unstable`

:::caution --unstable 已弃用 - 请使用细粒度标志

`--unstable`
标志不再用于新功能，并将在未来的版本中移除。所有使用此标志可用的不稳定功能现在都作为细粒度的不稳定标志提供，特别是：

- `--unstable-kv`
- `--unstable-cron`

请从现在开始使用这些功能标志。

:::

在较新的 Deno 版本（1.38+）之前，不稳定的 API 是使用 `--unstable`
标志一次性提供的。特别是，[Deno KV](/deploy/kv/manual) 和其他云原语 API
在此标志后面可用。要运行可以访问这些不稳定功能的程序，您可以使用以下命令运行脚本：

```sh
deno run --unstable your_script.ts
```

建议您使用细粒度的不稳定标志而不是此标志，`--unstable` 标志现已弃用，并将在 Deno
2 中移除。
