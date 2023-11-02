# 运行时

所有运行时函数（Web APIs + `Deno` 全局）的文档可以在
[`/api`](https://deno.land/api) 中找到，或者通过添加 _unstable_
APIs，这些可以通过 `--unstable` 标志启用，位于
[`/api?unstable`](https://deno.land/api?unstable=true)。

## Web 平台 APIs

对于已经存在 web 标准的 API，比如用于 HTTP 请求的 `fetch`，Deno 会使用这些标准
API，而不是发明一个新的专有 API。

更多细节，请查看 [Web 平台 APIs](./web_platform_apis.md) 章节。

## `Deno` 全局

所有不属于 web 标准的 API 都包含在全局 `Deno`
命名空间中。它包括了从文件读取、打开 TCP
套接字、[提供 HTTP 服务](./http_server_apis.md) 和执行子进程等 API。

更多细节，请查看 [内置 APIs](./builtin_apis.md) 章节。

Deno 命名空间的 TypeScript 定义可以在
[`lib.deno.ns.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/tsc/dts/lib.deno.ns.d.ts)
文件中找到。
