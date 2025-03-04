---
title: "使用队列"
oldUrl:
  - /kv/manual/queue_overview/
---

<deno-admonition></deno-admonition>

Deno 运行时包含一个队列
API，支持将较大的工作负载卸载为异步处理，并保证队列消息的至少一次交付。队列可用于卸载
Web 应用程序中的任务，或安排在未来的某个时间执行工作单元。

您将使用的主要 API 位于 `Deno.Kv` 命名空间中，包括
[`enqueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.enqueue) 和
[`listenQueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.listenQueue)。

## 入队消息

要入队消息进行处理，请在
[`Deno.Kv`](https://docs.denohub.com/api/deno/~/Deno.Kv) 实例上使用 `enqueue`
方法。在下面的示例中，我们展示了如何入队一个通知以进行交付。

```ts title="queue_example.ts"
// 描述消息对象的形状（可选）
interface Notification {
  forUser: string;
  body: string;
}

// 获取 KV 实例的引用
const kv = await Deno.openKv();

// 创建通知对象
const message: Notification = {
  forUser: "alovelace",
  body: "You've got mail!",
};

// 立即入队消息进行交付
await kv.enqueue(message);
```

您可以通过指定 `delay` 选项（以毫秒为单位）来安排消息在稍后交付。

```ts
// 安排消息在 3 天后交付
const delay = 1000 * 60 * 60 * 24 * 3;
await kv.enqueue(message, { delay });
```

您还可以在 Deno KV
中指定一个键，如果消息因任何原因未交付，消息值将存储在该键中。

```ts
// 配置一个键，用于存储未交付的消息
const backupKey = ["failed_notifications", "alovelace", Date.now()];
await kv.enqueue(message, { keysIfUndelivered: [backupKey] });

// ... 灾难发生 ...

// 获取未发送的消息
const r = await kv.get<Notification>(backupKey);
// 这是未发送的消息：
console.log("Found failed notification for:", r.value?.forUser);
```

## 监听消息

您可以通过在 [`Deno.Kv`](https://docs.denohub.com/api/deno/~/Deno.Kv) 实例上使用
`listenQueue` 方法来配置一个 JavaScript 函数，该函数将处理添加到队列中的项目。

```ts title="listen_example.ts"
// 定义我们期望作为队列中消息的对象的形状
interface Notification {
  forUser: string;
  body: string;
}

// 创建一个类型守卫来检查传入消息的类型
function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.forUser !== undefined &&
      typeof (o as Notification).forUser === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}

// 获取 KV 数据库的引用
const kv = await Deno.openKv();

// 注册一个处理函数来监听值 - 此示例展示了如何发送通知
kv.listenQueue((msg: unknown) => {
  // 使用类型守卫 - 然后 TypeScript 编译器知道 msg 是一个 Notification
  if (isNotification(msg)) {
    console.log("Sending notification to user:", msg.forUser);
    // ... 实际发送通知的操作！
  } else {
    // 如果消息类型未知，可能是错误
    console.error("Unknown message received:", msg);
  }
});
```

## 与 KV 原子事务结合的队列 API

您可以将队列 API 与 [KV 原子事务](./transactions)
结合使用，以在同一事务中原子地入队消息并修改键。

```ts title="kv_transaction_example.ts"
const kv = await Deno.openKv();

kv.listenQueue(async (msg: unknown) => {
  const nonce = await kv.get(["nonces", msg.nonce]);
  if (nonce.value === null) {
    // 此消息已处理
    return;
  }

  const change = msg.change;
  const bob = await kv.get(["balance", "bob"]);
  const liz = await kv.get(["balance", "liz"]);

  const success = await kv.atomic()
    // 确保此消息尚未处理
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .sum(["processed_count"], 1n)
    .check(bob, liz) // 余额未更改
    .set(["balance", "bob"], bob.value - change)
    .set(["balance", "liz"], liz.value + change)
    .commit();
});

// 在同一 KV 事务中修改键并入队消息！
const nonce = crypto.randomUUID();
await kv
  .atomic()
  .check({ key: ["nonces", nonce], versionstamp: null })
  .enqueue({ nonce: nonce, change: 10 })
  .set(["nonces", nonce], true)
  .sum(["enqueued_count"], 1n)
  .commit();
```

## 队列行为

### 消息交付保证

运行时保证至少一次交付。这意味着对于大多数入队的消息，[`listenQueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.listenQueue)
处理程序将为每条消息调用一次。在某些故障场景中，处理程序可能会为同一条消息多次调用以确保交付。设计应用程序时，确保正确处理重复消息非常重要。

您可以将队列与
[KV 原子事务](https://docs.denohub.com/deploy/kv/manual/transactions)
原语结合使用，以确保您的队列处理程序 KV 更新每条消息只执行一次。请参阅
[与 KV 原子事务结合的队列 API](#queue-api-with-kv-atomic-transactions)。

### 自动重试

当您的队列消息准备好交付时，[`listenQueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.listenQueue)
处理程序将被调用来处理它们。如果您的处理程序抛出异常，运行时将自动重试调用处理程序，直到成功或达到最大重试次数。一旦
[`listenQueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.listenQueue)
处理程序调用成功完成，消息即被视为成功处理。如果处理程序在重试中持续失败，消息将被丢弃。

### 消息交付顺序

运行时尽力按消息入队的顺序交付消息。然而，没有严格的顺序保证。偶尔，消息可能会乱序交付以确保最大吞吐量。

## Deno Deploy 上的队列

Deno Deploy 提供了全局、无服务器、分布式的队列 API
实现，专为高可用性和高吞吐量设计。您可以使用它来构建能够处理大工作负载的应用程序。

### 即时隔离启动

在 Deno Deploy 上使用队列时，隔离器会在消息可供处理时自动按需启动以调用您的
[`listenQueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.listenQueue)
处理程序。定义
[`listenQueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.listenQueue)
处理程序是启用 Deno Deploy 应用程序中队列处理的唯一要求，无需额外配置。

### 队列大小限制

未交付的队列消息的最大数量限制为
100,000。如果队列已满，[`enqueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.enqueue)
方法将失败并返回错误。

### 定价详情和限制

- [`enqueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.enqueue)
  被视为与其他 [`Deno.Kv`](https://docs.denohub.com/api/deno/~/Deno.Kv)
  写操作相同。入队的消息会消耗 KV 存储和写单元。
- 通过
  [`listenQueue`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.listenQueue)
  交付的消息会消耗请求和 KV 写单元。
- 有关更多信息，请参阅 [定价详情](https://deno.com/deploy/pricing)。

## 使用场景

队列在许多不同的场景中都很有用，但在构建 Web
应用程序时，您可能会看到一些常见的用例。

### 卸载异步进程

有时，由客户端启动的任务（如发送通知或 API
请求）可能需要足够长的时间，以至于您不希望让客户端等待该任务完成后再返回响应。其他时候，客户端实际上根本不需要响应，例如当客户端向您的应用程序发送
[webhook 请求](https://en.wikipedia.org/wiki/Webhook)
时，因此无需等待底层任务完成后再返回响应。

在这些情况下，您可以将工作卸载到队列中，以保持 Web
应用程序的响应性，并向客户端发送即时反馈。要查看此用例的实际示例，请查看我们的
[webhook 处理示例](../tutorials/webhook_processor.md)。

### 安排未来的工作

队列（以及像这样的队列
API）的另一个有用应用是安排在未来的适当时间执行工作。也许您想在客户下单一天后向他们发送满意度调查通知。您可以安排一个队列消息在
24 小时后交付，并设置一个监听器以在该时间发送通知。

要查看安排未来发送通知的示例，请查看我们的
[通知示例](../tutorials/schedule_notification.md)。
