---
title: "BroadcastChannel"
oldUrl:
  - /deploy/docs/runtime-broadcast-channel/
  - /deploy/manual/runtime-broadcast-channel
---

在 Deno Deploy
中，代码会在全球不同的数据中心运行，以便通过就近服务客户端请求来减少延迟。在浏览器中，[`BroadcastChannel`](https://developer.mozilla.org/zh-CN/docs/Web/API/Broadcast_Channel_API)
API 允许具有相同源的不同标签页之间交换消息。在 Deno Deploy 中，BroadcastChannel
API 提供了不同实例之间的通信机制；这是一个简单的消息总线，连接了全球各地的
Deploy 实例。

## 构造函数

`BroadcastChannel()` 构造函数创建一个新的 `BroadcastChannel`
实例，并连接到（或创建）提供的频道。

```ts
let channel = new BroadcastChannel(channelName);
```

#### 参数

| 名称        | 类型     | 描述                     |
| ----------- | -------- | ------------------------ |
| channelName | `string` | 底层广播频道连接的名称。 |

构造函数的返回类型是一个 `BroadcastChannel` 实例。

## 属性

| 名称             | 类型                   | 描述                                                               |
| ---------------- | ---------------------- | ------------------------------------------------------------------ |
| `name`           | `string`               | 底层广播频道的名称。                                               |
| `onmessage`      | `function` (或 `null`) | 当频道接收到新消息时执行的函数（[`MessageEvent`][messageevent]）。 |
| `onmessageerror` | `function` (或 `null`) | 当到达的消息无法反序列化为 JavaScript 数据结构时执行的函数。       |

## 方法

| 名称                   | 描述                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `close()`              | 关闭与底层频道的连接。关闭后，您将无法再向频道发布消息。                                |
| `postMessage(message)` | 向底层频道发布消息。消息可以是字符串、对象字面量、数字或任何类型的 [`Object`][object]。 |

`BroadcastChannel` 继承自 [`EventTarget`][eventtarget]，这允许您在
`BroadcastChannel` 实例上使用 `EventTarget` 的方法，如 `addEventListener` 和
`removeEventListener`。

## 示例：跨实例更新内存缓存

`BroadcastChannel`
启用的消息总线的一个用例是在网络中不同数据中心运行的隔离实例之间更新内存中的数据缓存。在下面的示例中，我们展示了如何配置一个简单的服务器，使用
`BroadcastChannel` 来同步所有运行实例的状态。

```ts
import { Hono } from "https://deno.land/x/hono/mod.ts";

// 内存中的消息缓存
const messages = [];

// 所有隔离实例使用的 BroadcastChannel
const channel = new BroadcastChannel("all_messages");

// 当从其他实例接收到新消息时，将其添加到缓存中
channel.onmessage = (event: MessageEvent) => {
  messages.push(event.data);
};

// 创建一个服务器来添加和检索消息
const app = new Hono();

// 向列表中添加消息
app.get("/send", (c) => {
  // 可以通过包含 "message" 查询参数来添加新消息
  const message = c.req.query("message");
  if (message) {
    messages.push(message);
    channel.postMessage(message);
  }
  return c.redirect("/");
});

// 获取消息列表
app.get("/", (c) => {
  // 返回当前的消息列表
  return c.json(messages);
});

Deno.serve(app.fetch);
```

您可以在 Deno Deploy
上使用[此 playground](https://dash.deno.com/playground/broadcast-channel-example)
自行测试此示例。

[eventtarget]: https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget
[messageevent]: https://developer.mozilla.org/zh-CN/docs/Web/API/MessageEvent
[object]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object
