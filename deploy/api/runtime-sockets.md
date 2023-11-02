# TCP sockets 和 TLS

Deno Deploy 支持出站 TCP 和 TLS 连接。这些 API 允许您在 Deploy 中使用诸如
PostgreSQL、SQLite、MongoDB 等数据库。

## `Deno.connect`

进行出站 TCP 连接。

该函数的定义与 [Deno](https://doc.deno.land/deno/stable/~/Deno.connect)
相同，限制是 `transport` 选项只能为 `tcp`，`hostname` 不能为 localhost 或为空。

```ts
function Deno.connect(options: ConnectOptions): Promise<Conn>
```

### 示例

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(_req) {
  // 进行到 example.com 的 TCP 连接
  const connection = await Deno.connect({
    port: 80,
    hostname: "example.com",
  });

  // 发送原始 HTTP GET 请求。
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // 从连接中读取 15 字节。
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // 将字节作为纯文本返回。
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

serve(handler);
```

## `Deno.connectTls`

进行出站 TLS 连接。

该函数的定义与 [Deno](https://doc.deno.land/deno/stable/~/Deno.connectTls)
相同，限制是 `hostname` 不能为 localhost 或为空。

```ts
function Deno.connectTls(options: ConnectTlsOptions): Promise<Conn>
```

### 示例

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(_req) {
  // 进行到 example.com 的 TLS 连接
  const connection = await Deno.connectTls({
    port: 443,
    hostname: "example.com",
  });

  // 发送原始 HTTP GET 请求。
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // 从连接中读取 15 字节。
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // 将字节作为纯文本返回。
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

serve(handler);
```
