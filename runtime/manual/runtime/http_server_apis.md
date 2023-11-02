# HTTP 服务器 API

Deno 目前有两个 HTTP 服务器 API：

- [`Deno.serve`](https://deno.land/api?s=Deno.serve)：本地，_高级_，支持
  HTTP/1.1 和 HTTP2，这是在 Deno 中编写 HTTP 服务器的首选 API。
- [`Deno.serveHttp`](https://deno.land/api?s=Deno.serveHttp)：本地，_低级_，支持
  HTTP/1.1 和 HTTP2。
- [一个 "Hello World" 服务器](#a-hello-world-server)
- [检查传入请求](#inspecting-the-incoming-request)
- [使用响应回复](#responding-with-a-response)
- [HTTPS 支持](#https-support)
- [HTTP/2 支持](#http2-support)
- [提供 WebSocket](#serving-websockets)

### 一个 "Hello World" 服务器

要在给定端口上启动一个 HTTP 服务器，您可以使用 `Deno.serve`
函数。该函数接受一个处理程序函数，该函数将在每个传入请求时调用，并预计返回一个响应（或解析为响应的
promise）。

这是一个示例，为每个请求返回一个 "Hello, World!" 响应：

```ts
Deno.serve((_req) => {
  return new Response("Hello, World!");
});
```

> ℹ️ 处理程序还可以返回 `Promise<Response>`，这意味着它可以是一个 `async` 函数。

默认情况下，`Deno.serve` 将监听端口
`8000`，但可以通过将端口号作为选项包的第一个或第二个参数传递来更改它：

```js
// 监听端口 4242。
Deno.serve({ port: 4242 }, handler);

// 监听端口 4500 并绑定到 0.0.0.0。
Deno.serve({ port: 4242, hostname: "0.0.0.0", handler });
```

### 检查传入请求

大多数服务器不会对每个请求都返回相同的响应。相反，它们会根据请求的各个方面进行响应的更改：HTTP
方法、标头、路径或正文内容。

请求作为处理程序函数的第一个参数传递。以下是一个示例，显示如何提取请求的各个部分：

```ts
Deno.serve(async (req) => {
  console.log("方法:", req.method);

  const url = new URL(req.url);
  console.log("路径:", url.pathname);
  console.log("查询参数:", url.searchParams);

  console例.log("标头:", req.headers);

  if (req.body) {
    const body = await req.text();
    console.log("正文:", body);
  }

  return new Response("Hello, World!");
});
```

> ⚠️ 请注意，如果用户在完全接收正文之前中断连接，`req.text()`
> 调用可能失败。确保处理此情况。请注意，这可能会在所有从请求正文读取的方法中发生，例如
> `req.json()`、`req.formData()`、`req.arrayBuffer()`、`req.body.getReader().read()`、`req.body.pipeTo()`
> 等。

### 使用响应回复

大多数服务器也不会对每个请求都返回 "Hello,
World!"。相反，它们可能会返回不同的标头、状态代码和正文内容（甚至正文流）。

以下是一个返回带有 404 状态代码、JSON 正文和自定义标头的响应的示例：

```ts
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

响应正文也可以是流。以下是一个返回每秒重复一次 "Hello, World!" 的流的示例：

```ts
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

> ℹ️ 请注意此处的 `cancel`
> 函数。当客户端中断连接时将调用此函数。这很重要，以确保处理此情况，否则服务器将无限排队消息，并最终耗尽内存。

> ⚠️ 请注意，当客户端中断连接时，响应正文流将被
> "取消"。请务必处理此情况。这可能会表现为附加到响应正文 `ReadableStream`
> 对象（例如通过 `TransformStream`）的 `WritableStream` 对象上的 `write()`
> 调用中的错误。

### HTTPS 支持

> ℹ️ 要使用 HTTPS，您需要为服务器拥有有效的 TLS 证书和私钥。

要使用 HTTPS，在选项包中传递两个额外的参数：`cert` 和
`key`。这些参数分别是证书和密钥文件的内容。

```js
Deno.serve({
  port: 443,
  cert: Deno.readTextFileSync("./cert.pem"),
  key: Deno.readTextFileSync("./key.pem"),
}, handler);
```

### HTTP/2 支持

在使用 Deno 的 HTTP 服务器 API 时，HTTP/2 支持是
"自动的"。您只需创建服务器，服务器将无缝处理 HTTP/1 或 HTTP/2 请求。

还支持通过明文进行的 HTTP/2，并且先前的知识。

### 自动正文压缩

HTTP 服务器内置了响应正文的自动压缩功能。当向客户端发送响应时，Deno
将确定是否可以安全地压缩响应正文。此压缩在 Deno 内部进行，因此速度快且高效。

目前，Deno 支持 gzip 和 brotli 压缩。如果满足以下条件，正文将自

动压缩：

- 请求具有
  [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
  标头，指示请求方支持 `br`（Brotli）或 `gzip`。Deno 将尊重标头中的
  [质量值](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values)
  首选项。
- 响应包括被视为可压缩的
  [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)。此列表来自
  [`jshttp/mime-db`](https://github.com/jshttp/mime-db/blob/master/db.json)，实际列表请参见代码。
- 响应正文大于 64 字节。

当响应正文被压缩时，Deno 将设置 Content-Encoding 标头以反映编码，以及确保 Vary
标头已调整或添加，以指示影响响应的请求标头。

何时跳过压缩？除了上述逻辑之外，还有一些其他原因会导致响应不会自动压缩：

- 响应包含 `Content-Encoding` 标头。这表明您的服务器已经进行了某种形式的编码。
- 响应包含
  [`Content-Range`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
  标头。这表明您的服务器正在响应范围请求，其中字节和范围是在 Deno
  内部之外协商的。
- 响应具有
  [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
  标头，其中包含
  [`no-transform`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other)
  值。这表明您的服务器不希望 Deno 或任何下游代理修改响应。

## `Deno.serveHttp`

我们通常建议使用上述描述的 `Deno.serve`
API，因为它处理单个连接上的并行请求、错误处理等所有复杂性。但是，如果您有兴趣在
Deno 中创建自己的强大和高性能 Web 服务器，Deno 1.9 及更高版本提供了更低级的
_本地_ HTTP 服务器 API。

> ⚠️ 您可能不应该使用此 API，因为它难以正确使用。请改用 `Deno.serve` API。

### 处理连接

一旦我们监听到一个连接，我们需要处理连接。`Deno.listen()` 或 `Deno.listenTls()`
的返回值是一个 `Deno.Listener`，它是一个异步可迭代对象，会产生 `Deno.Conn`
连接，同时提供了一些处理连接的方法。

要将其用作异步可迭代对象，我们可以这样做：

```ts
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  // ...处理连接...
}
```

每个建立的连接都会生成一个分配给 `conn` 的
`Deno.Conn`。然后可以对连接进行进一步处理。

监听器上还有 `.accept()` 方法，可以这样使用：

```ts
const server = Deno.listen({ port: 8080 });

while (true) {
  try {
    const conn = await server.accept();
    // ...处理连接...
  } catch (err) {
    // 监听器已关闭
    break;
  }
}
```

无论是使用异步迭代器还是 `.accept()`
方法，都可能会抛出异常，健壮的生产代码应使用 `try ... catch`
块处理这些异常。特别是在处理 TLS
连接时，可能会出现许多情况，例如无效或未知的证书，这些情况可能会在监听器上显现出来，需要在用户代码中处理。

监听器还有一个 `.close()` 方法，可以用来关闭监听器。

### 提供 HTTP 服务

一旦接受了连接，可以使用 `Deno.serveHttp()` 来处理连接上的 HTTP
请求和响应。`Deno.serveHttp()` 返回一个 `Deno.HttpConn`。`Deno.HttpConn` 类似于
`Deno.Listener`，客户端发送的请求会异步产生 `Deno.RequestEvent`。

要将 HTTP 请求处理为异步可迭代对象，可以这样做：

```ts
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      // ...处理 requestEvent...
    }
  })();
}
```

`Deno.HttpConn` 还有 `.nextRequest()` 方法，可用于等待下一个请求，如下所示：

```ts
const server = Deno.listen({ port: 8080 });

while (true) {
  try {
    const conn = await server.accept();
    (async () => {
      const httpConn = Deno.serveHttp(conn);
      while (true) {
        try {
          const requestEvent = await httpConn.nextRequest();
          // ...处理 requestEvent...
        } catch (err) {
          // 连接已完成
          break;
        }
      }
    })();
  } catch (err) {
    // 监听器已关闭
    break;
  }
}
```

请注意，在这两种情况下，我们使用了 IIFE
创建内部函数来处理每个连接。如果在接收连接的函数范围内等待 HTTP
请求，将会阻塞接受附加连接，使服务器看似
"冻结"。在实际应用中，可能更合理地单独使用一个函数：

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // ...处理 requestEvent...
  }
}

const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  handle(conn);
}
```

从这一点开始的示例将重点放在一个示例的 `handle()`
函数内发生的情况，而省略了监听和连接的 "样板代码"。

#### HTTP 请求和响应

Deno 中的 HTTP 请求和响应本质上是 Web 标准
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
的相反。Deno HTTP 服务器 API 和 Fetch API 利用
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 和
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
对象类。因此，如果您熟悉 Fetch
API，只需要在脑海中将它们颠倒过来，现在它就是一个服务器 API。

如上所述，`Deno.HttpConn` 异步生成 `Deno.RequestEvent`。这些请求事件包含
`.request` 属性和 `.respondWith()` 方法。

`.request` 属性是一个 `Request`
类的实例，包含有关请求的信息。例如，如果我们想知道被请求的 URL
路径，可以这样做：

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const url = new URL(requestEvent.request.url);
    console.log(`路径: ${url.pathname}`);
  }
}
```

`.respondWith()` 方法是如何完成一个请求的。该方法接受一个 `Response`
对象或一个解析为 `Response` 对象的 `Promise`。响应一个基本的 "hello world"
会如下所示：

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await requestEvent.respondWith(
      new Response("hello world", {
        status: 200,
      }),
    );
  }
}
```

请注意，我们等待了 `.respondWith()`
方法。虽然这不是必需的，但在实际应用中，处理响应中的任何错误将导致该方法返回的
`Promise`
被拒绝，例如如果客户端在所有响应发送完之前断开连接。虽然您的应用程序可能不需要执行任何操作，但不处理拒绝将导致发生
"未处理的拒绝"，并终止 Deno
进程，这对服务器来说并不好。此外，您可能希望等待返回的承诺以确定何时执行请求/响应循环的任何清理操作。

Web 标准的 `Response` 对象非常强大，允许轻松创建丰富复杂的响应给客户端，Deno
努力提供一个尽可能与 Web 标准匹配的 `Response` 对象，

因此，如果您想知道如何发送特定的响应，请查看 Web 标准
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) 的文档。

### HTTP/2 支持

Deno 中的 HTTP/2 支持在 Deno 运行时中实际上是透明的。通常情况下，HTTP/2 是在 TLS
连接设置期间在客户端和服务器之间通过
[ALPN](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)
进行协商的。为了启用这一功能，您需要在开始监听时提供希望支持的协议，使用
`alpnProtocols` 属性。这将在建立连接时启用协商。例如：

```ts
const server = Deno.listenTls({
  port: 8443,
  certFile: "localhost.crt",
  keyFile: "localhost.key",
  alpnProtocols: ["h2", "http/1.1"],
});
```

协议按首选顺序提供。在实践中，当前只支持两种协议，即 HTTP/2 和
HTTP/1.1，分别表示为 `h2` 和 `http/1.1`。

目前，Deno 不支持将明文 HTTP/1.1 连接升级为 HTTP/2 明文连接，因此只能通过
TLS/HTTPS 连接使用 HTTP/2 支持。

### 提供 WebSocket

Deno 可以将传入的 HTTP 请求升级为 WebSocket。这允许您在 HTTP 服务器上处理
WebSocket 端点。

要将传入的 `Request` 升级为 WebSocket，使用 `Deno.upgradeWebSocket`
函数。它返回一个包含 `Response` 和 Web 标准 `WebSocket`
对象的对象。应使用返回的响应来使用 `respondWith`
方法响应传入请求。只有在使用返回的响应调用 `respondWith` 后，WebSocket
才会被激活并可以使用。

由于 WebSocket 协议是对称的，`WebSocket`
对象与用于客户端通信的对象相同。有关此对象的文档可以在
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 上找到。

> 注意：我们意识到这个 API 可能难以使用，并计划在
> [`WebSocketStream`](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
> 稳定并准备好使用后切换到它。

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await requestEvent.respondWith(handleReq(requestEvent.request));
  }
}

function handleReq(req: Request): Response {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("请求没有尝试升级到WebSocket。");
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.onopen = () => console.log("套接字已打开");
  socket.onmessage = (e) => {
    console.log("套接字消息:", e.data);
    socket.send(new Date().toString());
  };
  socket.onerror = (e) => console.log("套接字错误:", e);
  socket.onclose = () => console.log("套接字已关闭");
  return response;
}
```

目前，WebSocket 仅支持 HTTP/1.1。一旦进行 WebSocket 升级，WebSocket
对象所在的连接不能再用于 HTTP 流量。
