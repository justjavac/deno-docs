---
title: "API 参考"
sidebar_title: "概述"
pagination_next: /deploy/api/runtime-broadcast-channel
oldUrl:
  - /deploy/docs/runtime-api/
  - /deploy/manual/runtime-api/
---

这是 Deno Deploy 上可用的运行时 API 的参考。此 API 与标准的
[运行时 API](/runtime/manual/runtime) 非常相似，但由于 Deno Deploy
是一个无服务器环境，某些 API 的可用性有所不同。

请使用本文档的此部分来探索 Deno Deploy 上可用的 API。

### Web API

- [`console`](https://developer.mozilla.org/zh-CN/docs/Web/API/console)
- [`atob`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/atob)
- [`btoa`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/btoa)
- [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
  - `fetch`
  - `Request`
  - `Response`
  - `URL`
  - `File`
  - `Blob`
- [TextEncoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoder)
- [TextDecoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoder)
- [TextEncoderStream](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoderStream)
- [TextDecoderStream](https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoderStream)
- [Performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
- [Web Crypto API](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto)
  - `randomUUID()`
  - `getRandomValues()`
  - [SubtleCrypto](https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto)
- [WebSocket API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [Timers](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
  (`setTimeout`, `clearTimeout`, 和 `setInterval`)
- [Streams API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)
  - `ReadableStream`
  - `WritableStream`
  - `TransformStream`
- [URLPattern API](https://developer.mozilla.org/zh-CN/docs/Web/API/URLPattern)
- [Import Maps](https://docs.denohub.com/runtime/manual/basics/import_maps/)
  - 注意：`import maps` 目前仅通过
    [deployctl](https://github.com/denoland/deployctl) 或
    [deployctl GitHub Action](https://github.com/denoland/deployctl/blob/main/action/README.md)
    工作流可用。

### Deno API

> 注意：在 Deploy 中仅提供 Deno 的稳定 API。

- [`Deno.env`](https://docs.denohub.com/api/deno/~/Deno.env) -
  与环境变量（密钥）交互。
  - `get(key: string): string | undefined` - 获取环境变量的值。
  - `toObject(): { [key: string]: string }` - 将所有环境变量作为对象获取。
- [`Deno.connect`](https://docs.denohub.com/api/deno/~/Deno.connect) - 连接到
  TCP 套接字。
- [`Deno.connectTls`](https://docs.denohub.com/api/deno/~/Deno.connectTls) -
  使用 TLS 连接到 TCP 套接字。
- [`Deno.startTls`](https://docs.denohub.com/api/deno/~/Deno.startTls) -
  从现有的 TCP 连接启动 TLS 握手。
- [`Deno.resolveDns`](https://docs.denohub.com/api/deno/~/Deno.resolveDns) -
  进行 DNS 查询
- 文件系统 API
  - [`Deno.cwd`](https://docs.denohub.com/api/deno/~/Deno.cwd) -
    获取当前工作目录
  - [`Deno.readDir`](https://docs.denohub.com/api/deno/~/Deno.readDir) -
    获取目录列表
  - [`Deno.readFile`](https://docs.denohub.com/api/deno/~/Deno.readFile) -
    将文件读入内存
  - [`Deno.readTextFile`](https://docs.denohub.com/api/deno/~/Deno.readTextFile) -
    将文本文件读入内存
  - [`Deno.open`](https://docs.denohub.com/api/deno/~/Deno.open) -
    打开文件以进行流式读取
  - [`Deno.stat`](https://docs.denohub.com/api/deno/~/Deno.stat) -
    获取文件系统条目信息
  - [`Deno.lstat`](https://docs.denohub.com/api/deno/~/Deno.lstat) -
    获取文件系统条目信息而不跟随符号链接
  - [`Deno.realPath`](https://docs.denohub.com/api/deno/~/Deno.realPath) -
    解析符号链接后获取文件的真实路径
  - [`Deno.readLink`](https://docs.denohub.com/api/deno/~/Deno.readLink) -
    获取给定符号链接的目标路径

## 未来支持

未来将添加以下 API：

- [Cache API](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)
- UDP API：
  - `Deno.connectDatagram` 用于出站 UDP 套接字
- 使用 `Deno.createHttpClient` 自定义 `fetch` 选项

## 限制

与 Deno CLI 一样，我们没有实现 ECMA Script 附录 B 中指定的 `__proto__`
对象字段。
