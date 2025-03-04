---
title: "为未来日期安排通知"
oldUrl:
  - /kv/tutorials/schedule_notification/
---

[队列](../manual/queue_overview.md)
的一个常见用例是安排在未来某个时间点完成的工作。为了帮助演示其工作原理，我们提供了一个示例应用程序（如下所述），该应用程序通过
[Courier API](https://www.courier.com/) 安排通知消息的发送。该应用程序运行在
[Deno Deploy](https://deno.com/deploy) 上，使用内置的 KV 和队列 API
实现，无需任何配置。

## 下载并配置示例

⬇️
[**在此处下载或克隆完整的示例应用程序**](https://github.com/kwhinnery/deno_courier_example)。

您可以使用 GitHub 仓库中的
[`README` 文件](https://github.com/kwhinnery/deno_courier_example)
中的说明来运行和部署此示例应用程序。

要运行上述示例应用程序，您还需要
[注册 Courier](https://app.courier.com/signup)。当然，您在应用程序中看到的技术同样适用于任何通知服务，从
[Amazon SNS](https://aws.amazon.com/sns/) 到
[Twilio](https://www.twilio.com)，但 Courier 提供了一个易于使用的通知
API，您可以使用个人 GMail 账户进行测试（除了它可以做的所有其他很酷的事情）。

## 关键功能

在设置并运行项目后，我们希望引导您注意代码中实现调度机制的几个关键部分。

### 在应用程序启动时连接到 KV 并添加监听器

示例应用程序的大部分功能位于顶级目录中的
[server.tsx](https://github.com/kwhinnery/deno_courier_example/blob/main/server.tsx)。当
Deno 应用程序进程启动时，它会创建一个到 Deno KV
实例的连接，并附加一个事件处理程序，该处理程序将在从队列接收到消息时处理这些消息。

```ts title="server.tsx"
// 创建一个 Deno KV 数据库引用
const kv = await Deno.openKv();

// 创建一个队列监听器来处理入队的消息
kv.listenQueue(async (message) => {
  /* ... 此处为监听器的实现 ... */
});
```

### 创建并安排通知

在此演示应用程序中，通过表单提交新订单后，将调用 `enqueue`
函数，并在发送通知电子邮件之前延迟五秒。

```ts title="server.tsx"
app.post("/order", async (c) => {
  const { email, order } = await c.req.parseBody();
  const n: Notification = {
    email: email as string,
    body: `订单已接收: "${order as string}"`,
  };

  // 选择一个未来的时间 - 现在，只需等待 5 秒
  const delay = 1000 * 5;

  // 将消息入队以进行处理！
  kv.enqueue(n, { delay });

  // 重定向回主页并显示成功消息！
  setCookie(c, "flash_message", "订单已创建！");
  return c.redirect("/");
});
```

### 在 TypeScript 中定义通知数据类型

通常，在将数据推入或推出队列时，使用强类型对象是可取的。虽然队列消息最初是
TypeScript 中的
[`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
类型，但我们可以使用
[类型守卫](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
来告诉编译器我们期望的数据形状。

以下是
[通知模块](https://github.com/kwhinnery/deno_courier_example/blob/main/notification.ts)
的源代码，我们使用它来描述系统中通知的属性。

```ts title="notification.ts"
// 通知对象的形状
export default interface Notification {
  email: string;
  body: string;
}

// 通知对象的类型守卫
export function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.email !== undefined &&
      typeof (o as Notification).email === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}
```

在 `server.tsx` 中，我们使用导出的类型守卫来确保我们正在响应正确的消息类型。

```ts title="server.tsx"
kv.listenQueue(async (message) => {
  // 使用类型守卫在消息类型错误时提前退出
  if (!isNotification(message)) return;

  // 从消息中获取相关数据，TypeScript 现在知道这是一个 Notification 接口
  const { email, body } = message;

  // 使用 Courier 创建电子邮件通知
  // ...
});
```

### 发送 Courier API 请求

为了按计划发送电子邮件，我们使用 Courier REST API。有关 Courier REST API
的更多信息，请参阅
[他们的参考文档](https://www.courier.com/docs/reference/send/message/)。

```ts title="server.tsx"
const response = await fetch("https://api.courier.com/send", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${COURIER_API_TOKEN}`,
  },
  body: JSON.stringify({
    message: {
      to: { email },
      content: {
        title: "Deno 已下新订单！",
        body: "通知内容在此处",
      },
    },
  }),
});
```
