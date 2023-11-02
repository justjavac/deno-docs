# 简单的 HTTP Web 服务器

## 概念

- 使用 Deno 集成的 HTTP 服务器运行自己的 Web 服务器。

## 概述

只需几行代码，您就可以运行自己的 HTTP Web 服务器，控制响应状态、请求标头等。

```ts title="server.ts"
const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  return new Response(body, { status: 200 });
};

console.log(`HTTP 服务器正在运行。访问地址：http://localhost:8080/`);
Deno.serve({ port }, handler);
```

然后运行以下命令：

```shell
deno run --allow-net server.ts
```
