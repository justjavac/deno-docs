# 在未来的某个日期安排通知

[队列](../manual/queue_overview.md)
的一个常见用例是在将来的某个时间点安排工作完成。为了演示这是如何工作的，我们提供了一个示例应用程序（如下所述），用于安排通过
[Courier API](https://www.courier.com/) 发送的通知消息。该应用程序在
[Deno Deploy](https://www.deno.com/deploy) 上运行，使用内置的 KV 和队列 API
实现，无需任何配置。

## 下载和配置示例

⬇️
[**在此处下载或克隆完整的示例应用程序**](https://github.com/kwhinnery/deno_courier_example)。

您可以按照 GitHub 仓库的
[`README` 文件](https://github.com/kwhinnery/deno_courier_example)
中的说明，自己运行和部署此示例应用程序。

要运行上述示例应用程序，还需要
[注册 Courier](https://app.courier.com/signup)。当然，您将在应用程序中看到的技术同样适用于任何通知服务，从
[Amazon SNS](https://aws.amazon.com/sns/) 到
[Twilio](https://www.twilio.com)，但 Courier 提供了一个易于使用的通知
API，您可以在个人的 GMail 帐户上进行测试（除了它可以执行的其他一切好玩的事情）。

## 主要功能

设置和运行项目后，我们希望引导您关注实现调度机制的代码的一些关键部分。

### 连接到 KV 并在应用程序启动时添加监听器

大多数示例应用程序的功能位于顶层目录中的
[server.tsx](https://github.com/kwhinnery/deno_courier_example/blob/main/server.tsx)
中。当 Deno 应用程序进程启动时，它将创建一个与 Deno KV
实例的连接，并附加一个事件处理程序，用于处理从队列接收的消息。

```ts title="server.tsx"
// 创建一个 Deno KV 数据库引用
const kv = await Deno.openKv();

// 创建一个队列监听器，将处理入队的消息
kv.listenQueue(async (message) => {
  /* ... 在此处实现监听器 ... */
});
```

### 创建和安排通知

在通过此演示应用程序的表单提交新订单后，将以延迟 5 秒的方式调用 `enqueue`
函数，然后发送通知电子邮件。

```ts title="server.tsx"
app.post("/order", async (c) => {
  const { email, order } = await c.req.parseBody();
  const n: Notification = {
    email: email as string,
    body: `Order received for: "${order as string}"`,
  };

  // 选择将来的时间 - 现在，只需等待 5 秒
  const delay = 1000 * 5;

  // 将消息入队进行处理！
  kv.enqueue(n, { delay });

  // 返回主页并显示成功消息！
  setCookie(c, "flash_message", "订单已创建！");
  return c.redirect("/");
});
```

### 在 TypeScript 中定义通知数据类型

通常，当将数据推送到队列中或从队列中取出数据时，希望使用强类型化的对象。尽管队列消息最初是
[`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
类型的，但我们可以使用
[类型守卫](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
来告诉编译器我们期望的数据形状。

以下是
[通知模块](https://github.com/kwhinnery/deno_courier_example/blob/main/notification.ts)
的源代码，用于描述系统中通知的属性。

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
  // 使用类型守卫，如果消息类型不正确，就提前终止
  if (!isNotification(message)) return;

  // 从消息中提取相关数据，此时 TypeScript 已经知道是通知接口
  const { email, body } = message;

  // 使用 Courier 创建电子邮件通知
  // ...
});
```

### 发送 Courier API 请求

要按计划发送电子邮件，我们使用 Courier REST API。有关 Courier REST API
的更多信息，请参阅
[它们的参考文档](https://www.courier.com/docs/reference/send/message/)。

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
        title: "New order placed by Deno!",
        body: "notification body goes here",
      },
    },
  }),
});
```
