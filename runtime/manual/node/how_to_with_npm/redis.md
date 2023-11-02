# 如何在 Deno 中使用 Redis

[Redis](https://redis.io/)
是一种内存中的数据存储，您可以用它来进行缓存、作为消息代理，或用于流式数据。

[在此查看源代码。](https://github.com/denoland/examples/tree/main/with-redis)

在这里，我们将设置 Redis 以缓存来自 API
调用的数据，以加速对该数据的任何后续请求。我们将：

- 设置一个 Redis 客户端，将每个 API 调用的数据保存在内存中
- 设置一个 Deno 服务器，以便轻松请求特定数据
- 在服务器处理程序内调用 Github API，以在第一次请求时获取数据
- 在每个后续请求上从 Redis 提供数据

我们可以在一个单独的文件 `main.ts` 中完成这些操作。

## 连接到 Redis 客户端

我们需要两个模块。第一个是 Deno 服务器。我们将使用它来获取用户的信息以查询我们的
API。第二个是 Redis。我们可以使用 `npm:` 修饰符获取 Redis 的节点包：

```tsx, ignore
import { Server } from "https://deno.land/std@$STD_VERSION/http/server.ts";
import { createClient } from "npm:redis@^4.5";
```

我们使用 `createClient` 创建一个 Redis 客户端，并连接到本地的 Redis 服务器：

```tsx, ignore
// 与本地的 Redis 实例建立连接
const client = createClient({
  url: "redis://localhost:6379",
});

await client.connect();
```

您还可以在这个
[配置](https://github.com/redis/node-redis/blob/master/docs/client-configuration.md)
对象中单独设置主机、用户、密码和端口。

## 设置服务器

我们的服务器将作为 Github API 的包装器。客户端可以在 URL 路径名中使用 Github
用户名来调用我们的服务器，例如 `http://localhost:3000/{username}`。

在我们的服务器中，将在处理程序函数中解析出路径名并调用 Github
API。我们去掉前导斜杠，这样我们就得到一个变量，可以将其作为用户名传递给 Github
API。然后，我们将响应返回给用户。

```tsx, ignore
const server = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);
    // 去掉前导斜杠
    const username = pathname.substring(1);
    const resp = await fetch(`https://api.github.com/users/${username}`);
    const user = await resp.json();
    return new Response(JSON.stringify(user), {
        headers: {
          "content-type": "application/json",
        },
      });
    }
  },

  port: 3000,
});

server.listenAndServe();
```

我们可以使用以下命令运行它：

```tsx, ignore
deno run --allow-net main.ts
```

然后，如果我们在 Postman 中访问
[http://localhost: 3000/ry](http://localhost:3000/ry)，我们将获得 Github
的响应：

![uncached-redis-body.png](../../images/how-to/redis/uncached-redis-body.png)

让我们使用 Redis 缓存这个响应。

## 检查缓存

一旦我们从 Github API 获取到响应，我们可以使用 `client.set` 在 Redis
中进行缓存，以用户名作为键，用户对象作为值：

```tsx, ignore
await client.set(username, JSON.stringify(user));
```

下次请求相同的用户名时，我们可以使用 `client.get` 来获取缓存的用户：

```tsx, ignore
const cached_user = await client.get(username);
```

如果键不存在，它将返回
null。因此，我们可以在一些流控制中使用它。当我们获取用户名时，我们首先检查我们是否已经在缓存中有该用户。如果有，我们将提供缓存的结果。如果没有，我们将调用
Github API 获取用户，缓存它，然后提供 API
结果。在这两种情况下，我们将添加一个自定义标头以显示我们正在提供的版本：

```tsx, ignore
const server = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);
    // 去掉前导斜杠
    const username = pathname.substring(1);
    const cached_user = await client.get(username);
    if (cached_user) {
      return new Response(cached_user, {
        headers: {
          "content-type": "application/json",
          "is-cached": "true",
        },
      });
    } else {
      const resp = await fetch(`https://api.github.com/users/${username}`);
      const user = await resp.json();
      await client.set(username, JSON.stringify(user));
      return new Response(JSON.stringify(user), {
        headers: {
          "content-type": "application/json",
          "is-cached": "false",
        },
      });
    }
  },

  port: 3000,
});

server.listenAndServe();
```

第一次运行这个代码时，我们将得到与上面相同的响应，而且我们将看到 `is-cached`
标头被设置为 `false`：

![uncached-redis-header.png](../../images/how-to/redis/uncached-redis-header.png)

但再次使用相同的用户名调用时，我们将获得缓存的结果。正文是相同的：

![cached-redis-body.png](../../images/how-to/redis/cached-redis-body.png)

但标头显示我们有缓存：

![cached-redis-header.png](../../images/how-to/redis/cached-redis-header.png)

我们还可以看到响应时间快了约 200 毫秒！

您可以在 [此处](https://redis.io/docs/) 查看 Redis 文档和 Redis 节点包
[此处](https://github.com/redis/node-redis)。
