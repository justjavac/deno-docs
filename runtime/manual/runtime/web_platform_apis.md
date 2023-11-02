# 使用 Web 平台 API

Deno 简化 Web 和云开发的一种方式是使用 Web 平台 API（比如 `fetch`）而不是专有的
API。这意味着如果你曾经为浏览器构建过应用，你很可能已经熟悉
Deno，而如果你正在学习 Deno，你也在增加对 Web 的知识投资。

## 支持的 API

以下是 Deno 中支持的部分 Web 平台 API 列表：

- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API)
- [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API)
- [Console](https://developer.mozilla.org/en-US/docs/Web/API/Console)
- [DOM APIs](https://deno.land/api@v1.26.0#DOM_APIs)
- [DOM `CustomEvent`, `EventTarget` and `EventListener`](#customevent-eventtarget-and-eventlistener)
- [Encoding API](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API)
- [Fetch API](#fetch-api)
- [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Location API](./location_api.md)
- [`navigator.language` API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [`setTimeout`, `setInterval`, `clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Web File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Web Storage API](./web_storage_api.md)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
- [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

你可以在 [这里](https://deno.land/api) 找到这些 API 的 Deno 参考。要检查 Web
平台 API 是否在 Deno 中可用，点击
[MDN 上的接口](https://developer.mozilla.org/en-US/docs/Web/API#interfaces)，并参考
[其浏览器兼容性表](https://developer.mozilla.org/en-US/docs/Web/API/AbortController#browser_compatibility)（作为示例链接）。

## `fetch` API

## 概述

`fetch` API 可用于发起 HTTP 请求。它的实现按照
[WHATWG `fetch` 规范](https://fetch.spec.whatwg.org/)。

您可以在 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
上找到有关此 API 的文档。

## 规范偏差

- Deno 用户代理没有 Cookie 存储。因此，响应上的 `set-cookie`
  标头不会被处理或从可见的响应标头中过滤。
- Deno 不遵循同源策略，因为 Deno 用户代理当前没有源的概念，也没有 Cookie
  存储。这意味着 Deno 不需要防止跨源泄露认证数据。因此，Deno 不实现 WHATWG
  `fetch` 规范的以下部分：
  - 第 3.1 节“'Origin'标头”。
  - 第 3.2 节 CORS 协议。
  - 第 3.5 节 CORB。
  - 第 3.6 节'Cross-Origin-Resource-Policy'标头。
  - 原子 HTTP 重定向处理。
  - 'opaqueredirect'响应类型。
- 具有“手动”重定向模式的 `fetch`
  将返回一个“basic”响应，而不是“opaqueredirect”响应。
- 规范对如何处理 [`file:` URL](https://fetch.spec.whatwg.org/#scheme-fetch)
  模糊不清。Firefox 是唯一支持获取 `file:` URL
  的主流浏览器，即使在默认情况下也无法正常工作。截至 Deno 1.16，Deno
  支持获取本地文件。有关详细信息，请参见下一节。
- 已实现 `request` 和 `response`
  标头保护，但与浏览器不同，没有对允许使用的标头名称进行任何约束。
- `referrer`、`referrerPolicy`、`mode`、`credentials`、`cache`、`integrity`、`keepalive`
  和 `window` 属性及其在 `RequestInit` 中的相关行为未实现。这些相关字段不在
  `Request` 对象上存在。
- 支持请求体上传流（在 HTTP/1.1 和 HTTP/2 上）。与当前的 fetch
  提案不同，该实现支持双向流。
- 当在 `headers` 迭代时，`set-cookie` 标头不会被连接。这种行为正在
  [被规范化过程中](https://github.com/whatwg/fetch/pull/1346)。

## 获取本地文件

截至 Deno 1.16，Deno 支持获取 `file:`
URL。这使得在服务器上和本地使用相同代码路径更容易，也更容易编写既适用于 Deno CLI
又适用于 Deno Deploy 的代码。

Deno 仅支持绝对文件 URL，这意味着 `fetch("./some.json")`
不起作用。但需要注意的是，如果指定了 [`--location`](./location_api.md)，相对 URL
将使用 `--location` 作为基础，但不能将 `file:` URL 传递为 `--location`。

为了能够获取相对于当前模块的某些资源，无论模块是本地还是远程，都应该使用
`import.meta.url` 作为基础。例如，像这样的内容：

```js
const response = await fetch(new URL("./config.json", import.meta.url));
const config = await response.json();
```

获取本地文件的注意事项：

- 适用于读取资源的权限，因此需要适当的 `--allow-read` 权限才能读取本地文件。
- 本地只支持 `GET` 方法，并会拒绝承诺与其他方法。
- 不存在的文件只会拒绝承诺并显示模糊的“TypeError”。这是为了避免指纹攻击的潜在风险。
- 不会在响应上设置标头。因此，消费者需要确定诸如内容类型或内容长度等信息。
- 响应正文从 Rust 侧以流的形式提供，因此大文件以块的形式提供，并且可以被取消。
