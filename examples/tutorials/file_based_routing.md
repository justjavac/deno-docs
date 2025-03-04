---
title: 基于文件的路由
url: /examples/file_based_routing_tutorial/
oldUrl:
- /examples/http-server-file-router/
- /runtime/tutorials/file_based_routing/
---

如果你使用过像 [Next.js](https://nextjs.org/)
这样的框架，你可能对基于文件的路由很熟悉——你在特定目录中添加一个文件，它就会自动成为一个路由。本教程演示了如何创建一个使用基于文件的路由的简单
HTTP 服务器。

## 路由请求

创建一个名为 `server.ts` 的新文件。该文件将用于路由请求。设置一个名为 `handler`
的异步函数，该函数接受一个请求对象作为参数：

```ts title="server.ts"
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  let module;

  try {
    module = await import(`.${path}.ts`);
  } catch (_error) {
    return new Response("Not found", { status: 404 });
  }

  if (module[method]) {
    return module[method](req);
  }

  return new Response("Method not implemented", { status: 501 });
}

Deno.serve(handler);
```

`handler` 函数设置了一个 `path` 变量，该变量包含从请求 URL
中提取的路径，以及一个 `method` 变量，该变量包含请求方法。

然后，它尝试根据路径导入一个模块。如果未找到该模块，则返回 404 响应。

如果找到了模块，它会检查该模块是否有处理请求方法的方法处理程序。如果找到了方法处理程序，则使用请求对象调用该方法处理程序。如果未找到方法处理程序，则返回
501 响应。

最后，它使用 `Deno.serve` 来服务 `handler` 函数。

> 路径可以是任何有效的 URL 路径，例如 `/users`、`/posts` 等。对于像 `/users`
> 这样的路径，将导入文件 `./users.ts`。然而，像 `/org/users`
> 这样的更深层次的路径将需要文件
> `./org/users.ts`。你可以通过创建嵌套目录和文件来创建嵌套路由。

## 处理请求

在与 `server.ts` 相同的目录中创建一个名为 `users.ts`
的新文件。该文件将用于处理对 `/users` 路径的请求。我们将以 `GET`
请求为例。你可以添加更多的 HTTP 方法，例如 `POST`、`PUT`、`DELETE` 等。

在 `users.ts` 中，设置一个名为 `GET`
的异步函数，该函数接受一个请求对象作为参数：

```ts title="users.ts"
export function GET(_req: Request): Response {
  return new Response("Hello from user.ts", { status: 200 });
}
```

## 启动服务器

要启动服务器，请运行以下命令：

```sh
deno run --allow-net --allow-read server.ts
```

这将在 `localhost:8080` 上启动服务器。你现在可以向 `localhost:8000/users` 发出
`GET` 请求，你应该会看到响应 `Hello from user.ts`。

此命令需要 `--allow-net` 和 `--allow-read`
[权限标志](/runtime/fundamentals/security/)
以允许访问网络来启动服务器并从文件系统中读取 `users.ts` 文件。

🦕
现在你可以根据文件结构在应用程序中设置路由。你可以根据需要扩展此示例以添加更多路由和方法。

<small>感谢 [@naishe](https://github.com/naishe) 贡献本教程。</small>
