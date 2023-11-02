---
displayed_sidebar: deployAPIHome
sidebar_position: 1
sidebar_label: 概览
pagination_next: api/runtime-broadcast-channel
---

# API 参考

这是有关 Deno Deploy 上可用的运行时 API 的参考。这个 API 与标准
[运行时 API](/runtime/manual/runtime) 非常相似，但由于 Deno Deploy
是一个无服务器环境，某些 API 不是以相同的方式可用。

请使用本文档的此部分来探索 Deno Deploy 上可用的 API。

### Web APIs

- [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console)
- [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob)
- [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  - `fetch`
  - `Request`
  - `Response`
  - `URL`
  - `File`
  - `Blob`
- [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream)
- [TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)
- [Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)
  - `randomUUID()`
  - `getRandomValues()`
  - [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Timers](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
  (`setTimeout`, `clearTimeout`, and `setInterval`)
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
  - `ReadableStream`
  - `WritableStream`
  - `TransformStream`
- [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- [Import Maps](https://deno.land/manual/linking_to_external_code/import_maps)
  - 注意：`import maps` 目前仅通过
    [deployctl](https://github.com/denoland/deployctl) 或
    [deployctl GitHub Action](https://github.com/denoland/deployctl/blob/main/action/README.md)
    工作流程提供。

### Deno APIs

> 注意：只有 Deno 的稳定 API 可在 Deploy 中使用。

- [`Deno.env`](https://doc.deno.land/deno/stable/~/Deno.env) -
  与环境变量（机密）交互。
  - `get(key: string): string | undefined` - 获取环境变量的值。
  - `toObject(): { [key: string]: string }` - 将所有环境变量获取为对象。
- [`Deno.connect`](https://doc.deno.land/deno/stable/~/Deno.connect) - 连接到
  TCP 套接字。
- [`Deno.connectTls`](https://doc.deno.land/deno/stable/~/Deno.connectTls) -
  使用 TLS 连接到 TCP 套接字。
- [`Deno.startTls`](https://doc.deno.land/deno/stable/~/Deno.startTls) -
  从现有的 TCP 连接开始 TLS 握手。
- [`Deno.resolveDns`](https://doc.deno.land/deno/stable/~/Deno.resolveDns) -
  进行 DNS 查询
- 文件系统 API
  - [`Deno.cwd`](https://doc.deno.land/deno/stable/~/Deno.cwd) -
    获取当前工作目录
  - [`Deno.readDir`](https://doc.deno.land/deno/stable/~/Deno.readDir) -
    获取目录列表
  - [`Deno.readFile`](https://doc.deno.land/deno/stable/~/Deno.readFile) -
    将文件读入内存
  - [`Deno.readTextFile`](https://doc.deno.land/deno/stable/~/Deno.readTextFile) -
    将文本文件读入内存
  - [`Deno.open`](https://doc.deno.land/deno/stable/~/Deno.open) -
    打开文件以进行流式读取
  - [`Deno.stat`](https://doc.deno.land/deno/stable/~/Deno.stat) -
    获取文件系统条目信息
  - [`Deno.lstat`](https://doc.deno.land/deno/stable/~/Deno.lstat) -
    获取文件系统条目信息，而不跟随符号链接
  - [`Deno.realPath`](https://doc.deno.land/deno/stable/~/Deno.realPath) -
    在解析符号链接后获取文件的真实路径
  - [`Deno.readLink`](https://doc.deno.land/deno/stable/~/Deno.readLink) -
    获取给定符号链接的目标路径

## 未来支持

将来，这些 API 也将被添加：

- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- UDP API：
  - 用于出站 UDP 套接字的 `Deno.connectDatagram`
- 使用 `Deno.createHttpClient` 的可自定义的 `fetch` 选项

## 限制

与 Deno CLI 一样，我们不实现 ECMA Script 附录 B 中规定的 `__proto__` 对象字段。
