# Node.js 内置 API

Deno Deploy 本地支持通过 `node:` 特定符号导入内置 Node.js 模块，如 `fs`、`path`
和 `http`。这允许在 Deno Deploy 中运行最初为 Node.js 编写的代码而无需更改。

以下是在 Deno Deploy 上运行的 Node.js HTTP 服务器的示例：

```js
import { createServer } from "node:http";
import process from "node:process";

const server = createServer((req, res) => {
  const message = `来自 ${process.env.DENO_REGION} 在 ${new Date()} 的问候`;
  res.end(message);
});

server.listen(8080);
```

您可以在此处实时查看此示例： https://dash.deno.com/playground/node-specifiers

使用 `node:` 特定符号时，Deno Deploy 的所有其他功能仍然可用。例如，即使使用
Node.js 模块，您也可以使用 `Deno.env` 访问环境变量。您还可以像往常一样从外部 URL
导入其他 ESM 模块。

以下是可用的 Node.js 模块：

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

这些模块的行为在大多数情况下应与 Node.js 相同。由于 Deno Deploy
的沙箱行为，某些功能不可用：

- 使用 `child_process` 执行二进制文件
- 使用 `worker_threads` 生成工作线程
- 使用 `vm` 创建上下文和评估代码

> 注意：对 Node.js
> 模块的模拟对大多数用例已经足够，但尚不完美。如果遇到任何问题，请
> [提出问题](https://github.com/denoland/deno)。
