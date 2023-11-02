# BroadcastChannel

在 Deno Deploy
中，代码在全球不同的数据中心运行，以减少延迟，通过在离客户端最近的数据中心处理请求。在浏览器中，BroadcastChannel
API 允许具有相同来源的不同标签交换消息。在 Deno Deploy 中，BroadcastChannel API
提供了各个实例之间的通信机制；一个连接全球各地 Deploy 实例的简单消息总线。

- [构造函数](#constructor)
  - [参数](#parameters)
- [属性](#properties)
- [方法](#methods)
- [示例](#example)

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

## 示例

一个小示例，其中有一个端点用于向不同地区中所有其他活动实例发送新消息，另一个用于从一个实例中获取所有消息。

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

const messages = [];
// 创建一个名为 earth 的新广播频道。
const channel = new BroadcastChannel("earth");
// 设置 onmessage 事件处理程序。
channel.onmessage = (event: MessageEvent) => {
  // 当其他实例向我们发送新消息时，更新本地状态。
  messages.push(event.data);
};

function handler(req: Request): Response {
  const { pathname, searchParams } = new URL(req.url);

  // 处理 /send?message=<message> 端点。
  if (pathname.startsWith("/send")) {
    const message = searchParams.get("message");
    if (!message) {
      return new Response("?message not provided", { status: 400 });
    }

    // 更新本地状态。
    messages.push(message);
    // 通知部署的所有其他活动实例有新消息。
    channel.postMessage(message);
    return new Response("message sent");
  }

  // 处理 /messages 请求。
  if (pathname.startsWith("/messages")) {
    return new Response(JSON.stringify(messages), {
      "content-type": "application/json",
    });
  }

  return new Response("not found", { status: 404 });
}

serve(handler);
```

您可以通过向 `https://broadcast.deno.dev/send?message=Hello_from_<region>` 发出
HTTP 请求来测试此示例，然后通过使用 VPN 或其他方式从不同地区发出另一个请求到
`https://broadcast.deno.dev/messages`
来检查第一个请求的消息是否存在于第二个地区。

我们构建了一个小型聊天应用程序，您可以在
https://github.com/lucacasonato/deploy_chat 上使用，网址为
https://denochat.deno.dev/

[eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[messageevent]: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
