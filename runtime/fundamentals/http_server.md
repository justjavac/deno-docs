---
title: "编写 HTTP 服务器"
oldUrl:
- /runtime/manual/runtime/http_server_apis/
- /runtime/manual/examples/http_server/
- /runtime/tutorials/http_server/
---

HTTP 服务器是网络的支柱，允许你访问网站、下载文件并与 Web
服务进行交互。它们监听来自客户端（如 Web 浏览器）的传入请求并发送回响应。

当你构建自己的 HTTP
服务器时，你可以完全控制其行为，并根据特定需求进行定制。你可能将其用于本地开发、提供
HTML、CSS 和 JS 文件，或构建 REST API ——
拥有自己的服务器可以让你定义端点、处理请求并管理数据。

## Deno 内置的 HTTP 服务器

Deno 内置了一个 HTTP 服务器 API，允许你编写 HTTP
服务器。[`Deno.serve`](https://docs.denohub.com/api/deno/~/Deno.serve) API 支持
HTTP/1.1 和 HTTP/2。

### 一个 "Hello World" 服务器

`Deno.serve`
函数接受一个处理函数，该函数将为每个传入请求调用，并期望返回一个响应（或解析为响应的
Promise）。

以下是一个为每个请求返回 "Hello, World!" 响应的服务器示例：

```ts title="server.ts"
Deno.serve((_req) => {
  return new Response("Hello, World!");
});
```

处理函数也可以返回一个 `Promise<Response>`，这意味着它可以是一个 `async` 函数。

要运行此服务器，你可以使用 `deno run` 命令：

```sh
deno run --allow-net server.ts
```

### 监听特定端口

默认情况下，`Deno.serve` 会监听端口
`8000`，但可以通过在选项包中传递端口号作为第一个或第二个参数来更改：

```js title="server.ts"
// 监听端口 4242。
Deno.serve({ port: 4242 }, handler);

// 监听端口 4242 并绑定到 0.0.0.0。
Deno.serve({ port: 4242, hostname: "0.0.0.0" }, handler);
```

### 检查传入请求

大多数服务器不会对每个请求都返回相同的响应。相反，它们会根据请求的各个方面（如
HTTP 方法、标头、路径或正文内容）来更改其响应。

请求作为第一个参数传递给处理函数。以下是一个展示如何提取请求各个部分的示例：

```ts
Deno.serve(async (req) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);
  console.log("Path:", url.pathname);
  console.log("Query parameters:", url.searchParams);

  console.log("Headers:", req.headers);

  if (req.body) {
    const body = await req.text();
    console.log("Body:", body);
  }

  return new Response("Hello, World!");
});
```

:::caution

请注意，如果用户在正文完全接收之前挂断连接，`req.text()`
调用可能会失败。请确保处理这种情况。请注意，这种情况可能发生在所有从请求正文读取的方法中，例如
`req.json()`、`req.formData()`、`req.arrayBuffer()`、`req.body.getReader().read()`、`req.body.pipeTo()`
等。

:::

### 使用真实数据响应

大多数服务器不会对每个请求都返回 "Hello,
World!"。相反，它们可能会返回不同的标头、状态码和正文内容（甚至是正文流）。

以下是一个返回 404 状态码、JSON 正文和自定义标头的响应示例：

```ts title="server.ts"
Deno.serve((req) => {
  const body = JSON.stringify({ message: "NOT FOUND" });
  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
```

### 使用流响应

响应正文也可以是流。以下是一个返回每秒重复一次的 "Hello, World!" 流的响应示例：

```ts title="server.ts"
Deno.serve((req) => {
  let timer: number;
  const body = new ReadableStream({
    async start(controller) {
      timer = setInterval(() => {
        controller.enqueue("Hello, World!\n");
      }, 1000);
    },
    cancel() {
      clearInterval(timer);
    },
  });
  return new Response(body.pipeThrough(new TextEncoderStream()), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
```

:::note

请注意上面的 `cancel`
函数。当客户端挂断连接时，会调用此函数。确保处理这种情况非常重要，否则服务器将永远排队消息，最终耗尽内存。

:::

请注意，当客户端挂断连接时，响应正文流会被 "取消"。确保处理这种情况。这可能会在
`WritableStream` 对象的 `write()` 调用中表现为错误，该对象附加到响应正文
`ReadableStream` 对象（例如通过 `TransformStream`）。

### HTTPS 支持

要使用 HTTPS，请在选项中传递两个额外参数：`cert` 和
`key`。它们分别是证书和密钥文件的内容。

```js
Deno.serve({
  port: 443,
  cert: Deno.readTextFileSync("./cert.pem"),
  key: Deno.readTextFileSync("./key.pem"),
}, handler);
```

:::note

要使用 HTTPS，你需要为服务器提供有效的 TLS 证书和私钥。

:::

### HTTP/2 支持

使用 Deno 的 HTTP 服务器 API 时，HTTP/2 支持是 "自动"
的。你只需创建服务器，它将无缝处理 HTTP/1 或 HTTP/2 请求。

HTTP/2 也支持通过明文进行预先知识传输。

### 自动正文压缩

HTTP 服务器内置了响应正文的自动压缩功能。当响应发送到客户端时，Deno
会确定响应正文是否可以安全压缩。这种压缩发生在 Deno 内部，因此速度快且高效。

目前 Deno 支持 gzip 和 brotli 压缩。如果满足以下条件，正文将自动压缩：

- 请求具有
  [`Accept-Encoding`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Encoding)
  标头，指示请求者支持 `br`（Brotli）或 `gzip`。Deno 将尊重标头中的
  [质量值](https://developer.mozilla.org/zh-CN/docs/Glossary/Quality_values)
  偏好。
- 响应包括一个被认为是可压缩的
  [`Content-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type)。（该列表源自
  [`jshttp/mime-db`](https://github.com/jshttp/mime-db/blob/master/db.json)，实际列表在
  [代码中](https://github.com/denoland/deno/blob/v1.21.0/ext/http/compressible.rs)。）
- 响应正文大于 64 字节。

当响应正文被压缩时，Deno 会将 `Content-Encoding`
标头设置为反映编码，并确保调整或添加 `Vary` 标头以指示哪些请求标头影响了响应。

除了上述逻辑外，还有一些原因会导致响应 **不会** 自动压缩：

- 响应包含 `Content-Encoding` 标头。这表明你的服务器已经进行了某种形式的编码。
- 响应包含
  [`Content-Range`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Range)
  标头。这表明你的服务器正在响应范围请求，其中字节和范围在 Deno
  内部控制之外进行协商。
- 响应具有
  [`Cache-Control`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)
  标头，其中包含
  [`no-transform`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control#other)
  值。这表明你的服务器不希望 Deno 或任何下游代理修改响应。

### 提供 WebSocket 服务

Deno 可以将传入的 HTTP 请求升级为 WebSocket。这允许你在 HTTP 服务器上处理
WebSocket 端点。

要将传入的 `Request` 升级为 WebSocket，你可以使用 `Deno.upgradeWebSocket`
函数。这将返回一个由 `Response` 和 Web 标准 `WebSocket`
对象组成的对象。返回的响应应用于响应传入请求。

由于 WebSocket 协议是对称的，`WebSocket`
对象与可用于客户端通信的对象相同。其文档可以在
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 上找到。

```ts title="server.ts"
Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
  });

  return response;
});
```

执行 WebSocket 升级后，WebSocket 创建的连接不能用于 HTTP 流量。

:::note

请注意，目前 WebSocket 仅在 HTTP/1.1 上受支持。

:::

## 默认 fetch 导出

在 Deno 中创建 HTTP 服务器的另一种方法是导出一个默认的 `fetch`
函数。[fetch API](/api/web/~/fetch) 发起 HTTP 请求以从网络检索数据，并内置在
Deno 运行时中。

```ts title="server.ts"
export default {
  fetch(request) {
    const userAgent = request.headers.get("user-agent") || "Unknown";
    return new Response(`User Agent: ${userAgent}`);
  },
} satisfies Deno.ServeDefaultExport;
```

你可以使用 `deno serve` 命令运行此文件：

```sh
deno serve server.ts
```

服务器将启动并在控制台中显示消息。打开浏览器并导航到
[http://localhost:8000/](http://localhost:8000/) 以查看 user-agent 信息。

## 基于这些示例进行构建

你可能会希望扩展这些示例以创建更复杂的服务器。Deno 推荐使用
[Oak](https://jsr.io/@oak/oak) 来构建 Web 服务器。Oak 是 Deno HTTP
服务器的中间件框架，旨在表达性强且易于使用。它提供了一种简单的方法来创建具有中间件支持的
Web 服务器。查看 [Oak 文档](https://oakserver.github.io/oak/)
以了解如何定义路由的示例。
