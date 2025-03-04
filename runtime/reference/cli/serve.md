---
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
---

## 示例

以下是一个示例，展示了如何使用声明式 fetch 创建一个简单的 HTTP 服务器：

```typescript title="server.ts"
export default {
  async fetch(_req) {
    return new Response("Hello world!");
  },
};
```

然后，你可以使用 `deno serve` 命令运行服务器：

```bash
deno serve server.ts
```

`fetch` 函数中的逻辑可以自定义，以处理不同类型的请求并相应地提供内容：

```typescript title="server.ts"
export default {
  async fetch(request) {
    if (request.url.startsWith("/json")) {
      return Response.json({ hello: "world" });
    }

    return new Response("Hello world!");
  },
};
```
