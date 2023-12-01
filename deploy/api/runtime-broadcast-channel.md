# BroadcastChannel

在 Deno Deploy
中，代码在全球不同的数据中心运行，以减少延迟，通过在离客户端最近的数据中心处理请求。在浏览器中，[`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
API 允许具有相同来源的不同标签交换消息。在 Deno Deploy 中，BroadcastChannel API
提供了各个实例之间的通信机制；一个连接全球各地 Deploy 实例的简单消息总线。

## 构造函数

`BroadcastChannel()` 构造函数创建一个新的 `BroadcastChannel`
实例并连接到（或创建）提供的通道。

```ts
let channel = new BroadcastChannel(channelName);
```

#### 参数

| 名称        | 类型     | 描述                     |
| ----------- | -------- | ------------------------ |
| channelName | `string` | 底层广播通道连接的名称。 |

构造函数的返回类型是 `BroadcastChannel` 实例。

## 属性

| 名称             | 类型                    | 描述                                                               |
| ---------------- | ----------------------- | ------------------------------------------------------------------ |
| `name`           | `string`                | 底层广播通道的名称。                                               |
| `onmessage`      | `function`（或 `null`） | 当通道接收到新消息时执行的函数（[`MessageEvent`][messageevent]）。 |
| `onmessageerror` | `function`（或 `null`） | 当到达的消息无法反序列化为 JavaScript 数据结构时执行的函数。       |

## 方法

| 名称                   | 描述                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `close()`              | 关闭到底层通道的连接。关闭后，无法再向通道发布消息。                                  |
| `postMessage(message)` | 向底层通道发布消息。消息可以是字符串、对象文字、数字或任何类型的 [`Object`][object]。 |

`BroadcastChannel` 扩展了 [`EventTarget`][eventtarget]，允许您在
`BroadcastChannel` 的实例上使用 `addEventListener` 和 `removeEventListener` 等
`EventTarget` 的方法。

## 示例：跨实例更新内存缓存

`BroadcastChannel`
提供的消息总线是一种用于在运行在不同数据中心的孤立环境中更新内存数据缓存的实用工具之一。在下面的示例中，我们演示了如何配置一个简单的服务器，利用
`BroadcastChannel` 实现在服务器的所有运行实例之间同步状态。

```ts
import { Hono } from "https://deno.land/x/hono/mod.ts";

// 创建一个消息的内存缓存
const messages = [];

// 用于所有隔离体的广播通道
const channel = new BroadcastChannel("all_messages");

// 当来自其他实例的新消息到达时，将其添加到缓存中
channel.onmessage = (event: MessageEvent) => {
  messages.push(event.data);
};

// 创建一个服务器以添加和检索消息
const app = new Hono();

// 添加消息到列表
app.get("/send", (c) => {
  // 通过包含 "message" 查询参数可以添加新消息
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

你可以在 Deno Deploy
上使用[这个演示](https://dash.deno.com/playground/broadcast-channel-example)来测试这个示例。

[eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[messageevent]: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
