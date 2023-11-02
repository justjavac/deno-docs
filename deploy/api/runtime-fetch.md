# HTTP 请求(fetch)

[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 允许您在
Deno Deploy 中进行出站 HTTP 请求。它是一个 Web 标准，并具有以下接口：

- `fetch()` - 允许您进行出站 HTTP 请求的方法
- [`Request`](./runtime-request) - 表示 fetch() 的请求资源
- [`Response`](./runtime-response) - 表示 fetch() 的响应资源
- [`Headers`](./runtime-headers) - 表示请求和响应的 HTTP 标头。

此页面显示了 fetch() 方法的用法。您可以点击上面的其他接口以了解更多信息。

Fetch 还支持从文件 URL
获取静态文件。有关静态文件的更多信息，请参阅[文件系统 API 文档](./runtime-fs)。

## `fetch()`

`fetch()` 方法发起对提供的资源的网络请求，并返回一个在响应可用后解析的 Promise。

```ts
function fetch(
  resource: Request | string,
  init?: RequestInit,
): Promise<Response>;
```

#### 参数

| name     | type                                                          | optional | description                         |
| -------- | ------------------------------------------------------------- | -------- | ----------------------------------- |
| resource | [`Request`](./runtime-request) <br/> [`USVString`][usvstring] | `false`  | 资源可以是请求对象或 URL 字符串。   |
| init     | [`RequestInit`](./runtime-request#requestinit)                | `true`   | init 对象允许您对请求应用可选参数。 |

`fetch()` 的返回类型是一个解析为 [`Response`](./runtime-response) 的 Promise。

## 示例

以下是 Deno Deploy 脚本，它对每个传入请求发起了一个 `fetch()` 请求到 GitHub
API，然后从处理函数返回该响应。

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(req: Request): Promise<Response> {
  const resp = await fetch("https://api.github.com/users/denoland", {
    // 此处的 init 对象包含一个包含指示我们接受响应类型的标头的标头。
    // 我们没有指定方法字段，因为默认情况下 fetch 进行 GET 请求。
    headers: {
      accept: "application/json",
    },
  });
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "content-type": "application/json",
    },
  });
}

serve(handler);
```

[usvstring]: https://developer.mozilla.org/en-US/docs/Web/API/USVString
