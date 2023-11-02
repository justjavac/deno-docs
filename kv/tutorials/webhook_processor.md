# 将 Webhook 处理转移到队列

在 Web
应用程序中，通常希望将异步任务的处理转移到队列中，这些任务对于客户端来说不需要立即响应。这样可以保持您的
Web 应用程序的速度和响应性，而不是等待长时间运行的进程完成，占用宝贵的资源。

一个可能需要使用这种技术的情况是在处理 Webhook
时，特别是在从不需要响应的非人类客户端接收 Webhook
请求时，您可以将工作转移到队列中，以便更高效地处理它。

在本教程中，我们将向您展示如何在处理 GitHub 存储库的 Webhook 请求时执行此技巧。

## 在 playground 中尝试

✏️
[**查看这个 playground ，它实现了 GitHub 存储库 Webhook 处理程序**](https://dash.deno.com/playground/github-webhook-example)。

使用 Deno Deploy 的 playground ，您可以立即部署自己的 GitHub Webhook
处理程序，该处理程序同时使用队列和 Deno KV。稍后我们将详细介绍此代码的功能。

## 为存储库配置 GitHub Webhook

要在 playground 中尝试刚刚启动的 Webhook，请为您控制的 GitHub 存储库设置新的
Webhook 配置。您可以在存储库的“设置”下找到 Webhook 配置。

![配置 GitHub Webhook](./images/github_webhook.png)

## 代码演练

我们的 Webhook 处理程序函数相对简单 - 不包括注释，总共只有 23 行代码。它连接到
Deno KV 数据库，设置了一个队列监听器来处理传入的消息，并使用
[`Deno.serve`](https://deno.land/api?s=Deno.serve)
设置了一个简单的服务器，以响应传入的 Webhook 请求。

请阅读下面的注释，以了解每个步骤发生了什么。

```ts title="server.ts"
// 获取 Deno KV 数据库实例的句柄。KV 内置于 Deno 运行时中，可以在本地和 Deno Deploy 上零配置使用
const kv = await Deno.openKv();

// 设置一个监听器，用于处理从我们的服务器转移的工作。在这种情况下，它将传入的 Webhook 负载添加到 KV 数据库中，附带时间戳。
kv.listenQueue(async (message) => {
  await kv.set(["github", Date.now()], message);
});

// 这是一个简单的 HTTP 服务器，用于处理来自 GitHub Webhook 的传入 POST 请求。
Deno.serve(async (req: Request) => {
  if (req.method === "POST") {
    // GitHub 将 Webhook 请求作为 POST 请求发送到您的服务器。您可以配置 GitHub 以在 POST 主体中发送 JSON，然后可以从请求对象中解析出来。
    const payload = await req.json();
    await kv.enqueue(payload);
    return new Response("", { status: 200 });
  } else {
    // 如果服务器正在处理 GET 请求，那么它将列出在我们的 KV 数据库中记录的所有 Webhook 事件。
    const iter = kv.list<string>({ prefix: ["github"] });
    const github = [];
    for await (const res of iter) {
      github.push({
        timestamp: res.key[1],
        payload: res.value,
      });
    }
    return new Response(JSON.stringify(github, null, 2));
  }
});
```
