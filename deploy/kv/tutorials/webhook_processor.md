---
title: "将 webhook 处理卸载到队列"
oldUrl:
  - /kv/tutorials/webhook_processor/
---

在 web
应用程序中，通常希望将客户端不需要立即响应的异步任务处理卸载到队列中。这样做可以保持您的
web 应用程序快速响应，而不是占用宝贵的资源等待长时间运行的进程完成。

您可能希望部署此技术的一个实例是当[处理 webhook](https://en.wikipedia.org/wiki/Webhook)
时。在接收到不需要响应的非人类客户端的 webhook
请求后，您可以立即将该工作卸载到队列中，以便更高效地处理。

在本教程中，我们将向您展示如何在[处理 GitHub 仓库的 webhook 请求](https://docs.github.com/en/webhooks/about-webhooks-for-repositories)
时执行此技术。

## 在 playground 中尝试

✏️
[**查看此 playground，它实现了一个 GitHub 仓库 webhook 处理程序**](https://dash.deno.com/playground/github-webhook-example)。

使用 Deno Deploy 的
[playgrounds](/deploy/manual/playgrounds)，您可以立即部署自己的 GitHub webhook
处理程序，该程序同时使用队列和 Deno KV。我们稍后将逐步介绍此代码的功能。

## 为仓库配置 GitHub webhooks

要尝试在 playground 中启动的 webhook，请为您控制的 GitHub 仓库设置一个新的
webhook 配置。您可以在仓库的“设置”下找到 webhook 配置。

![配置 GitHub webhook](./images/github_webhook.png)

## 代码解析

我们的 webhook 处理函数相对简单——没有注释的情况下，总共只有 23 行代码。它连接到
Deno KV 数据库，设置一个队列监听器来处理传入的消息，并使用
[`Deno.serve`](https://docs.denohub.com/api/deno/~/Deno.serve)
设置一个简单的服务器来响应传入的 webhook 请求。

请阅读下面的注释，了解每一步发生了什么。

```ts title="server.ts"
// 获取 Deno KV 数据库实例的句柄。KV 内置于 Deno 运行时中，并且在本地和 Deno Deploy 上都可以零配置使用
const kv = await Deno.openKv();

// 设置一个监听器来处理从服务器卸载的工作。在这种情况下，它只是将传入的 webhook 有效负载添加到 KV 数据库中，并带有时间戳
kv.listenQueue(async (message) => {
  await kv.set(["github", Date.now()], message);
});

// 这是一个简单的 HTTP 服务器，将处理来自 GitHub webhooks 的传入 POST 请求
Deno.serve(async (req: Request) => {
  if (req.method === "POST") {
    // GitHub 将 webhook 请求作为 POST 请求发送到您的服务器。您可以配置 GitHub 在 POST 正文中发送 JSON，然后可以从请求对象中解析它
    const payload = await req.json();
    await kv.enqueue(payload);
    return new Response("", { status: 200 });
  } else {
    // 如果服务器处理的是 GET 请求，这将列出我们 KV 数据库中记录的所有 webhook 事件
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
