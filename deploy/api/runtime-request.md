---
title: "HTTP 请求"
oldUrl:
  - /deploy/docs/runtime-request/
---

[Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 接口是 Fetch
API 的一部分，表示 fetch() 的请求。

- [构造函数](#constructor)
  - [参数](#parameters)
- [属性](#properties)
- [方法](#methods)
- [示例](#example)

## 构造函数

Request() 构造函数创建一个新的 Request 实例。

```ts
let request = new Request(resource, init);
```

#### 参数

| 名称     | 类型                          | 可选    | 描述                                      |
| -------- | ----------------------------- | ------- | ----------------------------------------- |
| resource | `Request` 或 `USVString`      | `false` | 资源可以是一个请求对象或一个 URL 字符串。 |
| init     | [`RequestInit`](#requestinit) | `true`  | init 对象允许你设置应用于请求的可选参数。 |

返回类型是一个 `Request` 实例。

##### `RequestInit`

| 名称                         | 类型                                                                                    | 默认值         | 描述                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------- |
| [`method`][method]           | `string`                                                                                | `GET`          | 请求的方法。                                         |
| [`headers`][headers]         | `Headers` 或 `{ [key: string]: string }`                                                | 无             | 请求的 Headers。                                     |
| [`body`][body]               | `Blob`, `BufferSource`, `FormData`, `URLSearchParams`, `USVString`, 或 `ReadableStream` | 无             | 请求的 body。                                        |
| [`cache`][cache]             | `string`                                                                                | 无             | 请求的缓存模式。                                     |
| [`credentials`][credentials] | `string`                                                                                | `same-origin`  | 请求的凭证模式。                                     |
| [`integrity`][integrity]     | `string`                                                                                | 无             | 请求 body 的加密哈希值。                             |
| [`mode`][mode]               | `string`                                                                                | `cors`         | 你想要使用的请求模式。                               |
| [`redirect`][redirect]       | `string`                                                                                | `follow`       | 重定向的处理模式。                                   |
| [`referrer`][referrer]       | `string`                                                                                | `about:client` | 指定 `no-referrer`, `client` 或 URL 的 `USVString`。 |

## 属性

| 名称                               | 类型                                       | 描述                                                                                  |
| ---------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [`cache`][cache]                   | `string`                                   | 缓存模式指示浏览器应如何缓存请求 (`default`, `no-cache`, 等)。                        |
| [`credentials`][credentials]       | `string`                                   | 凭证 (`omit`, `same-origin`, 等) 指示用户代理是否应在 CORs 请求的情况下发送 cookies。 |
| [`destination`][destination]       | [`RequestDestination`][requestdestination] | 字符串指示请求的内容类型。                                                            |
| [`body`][body]                     | [`ReadableStream`][readablestream]         | getter 暴露 body 内容的 `ReadableStream`。                                            |
| [`bodyUsed`][bodyused]             | `boolean`                                  | 指示 body 内容是否已读取。                                                            |
| [`url`][url]                       | `USVString`                                | 请求的 URL。                                                                          |
| [`headers`][headers]               | [`Headers`](runtime-headers)               | 与请求关联的 headers。                                                                |
| [`integrity`][integrity]           | `string`                                   | 请求 body 的加密哈希值。                                                              |
| [`method`][method]                 | `string`                                   | 请求的方法 (`POST`, `GET`, 等)。                                                      |
| [`mode`][mode]                     | `string`                                   | 指示请求的模式 (例如 `cors` )。                                                       |
| [`redirect`][redirect]             | `string`                                   | 重定向的处理模式。                                                                    |
| [`referrer`][referrer]             | `string`                                   | 请求的 referrer。                                                                     |
| [`referrerPolicy`][referrerpolicy] | `string`                                   | 请求的 referrer 策略                                                                  |

以上所有属性均为只读。

## 方法

| 名称                           | 描述                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| [`arrayBuffer()`][arraybuffer] | 读取 body 流至完成并返回一个 `ArrayBuffer` 对象。                |
| [`blob()`][blob]               | 读取 body 流至完成并返回一个 `Blob` 对象。                       |
| [`formData()`][formdata]       | 读取 body 流至完成并返回一个 `FormData` 对象。                   |
| [`json()`][json]               | 读取 body 流至完成，将其解析为 JSON 并返回一个 JavaScript 对象。 |
| [`text()`][text]               | 读取 body 流至完成并返回一个 USVString 对象 (文本)。             |
| [`clone()`][clone]             | 克隆 Request 对象。                                              |

## 示例

```ts
function handler(_req) {
  // 创建一个 post 请求
  const request = new Request("https://post.deno.dev", {
    method: "POST",
    body: JSON.stringify({
      message: "Hello world!",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  console.log(request.method); // POST
  console.log(request.headers.get("content-type")); // application/json

  return fetch(request);
}

Deno.serve(handler);
```

[cache]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/cache
[credentials]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/credentials
[destination]: https://developer.mozilla.org/en-us/docs/web/api/request/destination
[requestdestination]: https://developer.mozilla.org/zh-CN/docs/Web/API/RequestDestination
[body]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/body
[bodyused]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/bodyUsed
[url]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/url
[headers]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/headers
[method]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/method
[integrity]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/integrity
[mode]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/mode
[redirect]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/redirect
[referrer]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/referrer
[referrerpolicy]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/referrerpolicy
[readablestream]: https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream
[arraybuffer]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/arrayBuffer
[blob]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/blob
[json]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/json
[text]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/text
[formdata]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/formdata
[clone]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/clone
