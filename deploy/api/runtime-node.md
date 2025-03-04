---
title: "Node.js 内置 API"
oldUrl:
  - /deploy/docs/runtime-node/
  - /deploy/manual/runtime-node/
---

Deno Deploy 原生支持通过 `node:` 标识符导入内置的 Node.js 模块，如 `fs`、`path`
和 `http`。这使得原本为 Node.js 编写的代码无需修改即可在 Deno Deploy 中运行。

以下是一个在 Deno Deploy 上运行的 Node.js HTTP 服务器示例：

```js
import { createServer } from "node:http";
import process from "node:process";

const server = createServer((req, res) => {
  const message = `Hello from ${process.env.DENO_REGION} at ${new Date()}`;
  res.end(message);
});

server.listen(8080);
```

_你可以在此处查看此示例的实时演示：
https://dash.deno.com/playground/node-specifiers_

使用 `node:` 标识符时，Deno Deploy 的所有其他功能仍然可用。例如，即使在使用
Node.js 模块时，你也可以使用 `Deno.env` 来访问环境变量。你还可以像往常一样从外部
URL 导入其他 ESM 模块。

以下 Node.js 模块可用：

- `assert`
- `assert/strict`
- `async_hooks`
- `buffer`
- `child_process`
- `cluster`
- `console`
- `constants`
- `crypto`
- `dgram`
- `diagnostics_channel`
- `dns`
- `dns/promises`
- `domain`
- `events`
- `fs`
- `fs/promises`
- `http`
- `http2`
- `https`
- `module`
- `net`
- `os`
- `path`
- `path/posix`
- `path/win32`
- `perf_hooks`
- `process`
- `punycode`
- `querystring`
- `readline`
- `stream`
- `stream/consumers`
- `stream/promises`
- `stream/web`
- `string_decoder`
- `sys`
- `timers`
- `timers/promises`
- `tls`
- `tty`
- `url`
- `util`
- `util/types`
- `v8`
- `vm`
- `worker_threads`
- `zlib`

在大多数情况下，这些模块的行为应与 Node.js 一致。由于 Deno Deploy
的沙盒行为，某些功能不可用：

- 使用 `child_process` 执行二进制文件
- 使用 `worker_threads` 生成工作线程
- 使用 `vm` 创建上下文并评估代码

> 注意：Node.js
> 模块的模拟足以满足大多数用例，但尚未完美。如果你遇到任何问题，请[提交问题](https://github.com/denoland/deno)。
