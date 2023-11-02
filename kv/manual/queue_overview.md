import Admonition from "./_admonition.mdx";

# 使用队列

<Admonition />

Deno 运行时包括一个支持异步处理的排队
API，确保排队消息至少被传递一次。队列可用于在 Web
应用程序中卸载任务，或者计划将工作单元推迟到将来的某个时间。

与队列一起使用的主要 API 位于 `Deno.Kv` 命名空间中，如
[`enqueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.enqueue)
和
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)。

## 排队消息

要排队处理消息，请使用
[`Deno.Kv`](https://deno.land/api?unstable=true&s=Deno.Kv) 实例上的 `enqueue`
方法。在下面的示例中，我们展示了排队传递通知的可能外观。

```ts title="queue_example.ts"
// 描述消息对象的形状（可选）
interface Notification {
  forUser: string;
  body: string;
}

// 获取对KV实例的引用
const kv = await Deno.openKv();

// 创建通知对象
const message: Notification = {
  forUser: "alovelace",
  body: "You've got mail!",
};

// 为立即传递排队消息
await kv.enqueue(message);
```

通过指定以毫秒为单位的 `delay` 选项，您还可以为将来的传递排队消息。

```ts
// 将消息排队以在 3 天后传递
const delay = 1000 * 60 * 60 * 24 * 3;
await kv.enqueue(message, { delay });
```

如果由于任何原因未传递消息，还可以指定 Deno KV 中的键，其中将存储消息值。

```ts
// 配置一个失败消息将被发送的键
const backupKey = ["failed_notifications", "alovelace", Date.now()];
await kv.enqueue(message, { keysIfUndelivered: [backupKey] });

// ... 发生灾难 ...

// 获取未发送的消息
const r = await kv.get<Notification>(backupKey);
// 这是未发送的消息：
console.log("Found failed notification for:", r.value?.forUser);
```

## 监听消息

您可以配置一个 JavaScript 函数，该函数将处理添加到队列中的项目，使用
[`Deno.Kv`](https://deno.land/api?unstable=true&s=Deno.Kv) 实例上的
`listenQueue` 方法。

```ts title="listen_example.ts"
// 定义我们期望作为队列消息的对象的形状
interface Notification {
  forUser: string;
  body: string;
}

// 创建一个类型保护，以检查传入消息的类型
function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.forUser !== undefined &&
      typeof (o as Notification).forUser === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}

// 获取对KV数据库的引用
const kv = await Deno.openKv();

// 注册一个处理程序函数以监听值 - 本例显示了如何发送通知
kv.listenQueue((msg: unknown) => {
  // 使用类型保护 - 然后TypeScript编译器知道msg是Notification
  if (isNotification(msg)) {
    console.log("Sending notification to user:", msg.forUser);
    // ... 做些实际发送通知的事情！
  } else {
    // 如果消息是未知类型，可能是错误
    console.error("Unknown message received:", msg);
  }
});
```

## KV 原子事务与队列 API

您可以将队列 API 与 [KV 原子事务](./transactions.mdx)
结合使用，以原子方式排队消息并修改相同事务中的键。

```ts title="kv_transaction_example.ts"
const kv = await Deno.openKv();

kv.listenQueue(async (msg: unknown) => {
  const nonce = await kv.get(["nonces", msg.nonce]);
  if (nonce.value === null) {
    // 这个消息已经处理过了
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
    .check(bob, liz) // 余额没有改变
    .set(["balance", "bob"], bob.value - change)
    .set(["balance", "liz"], liz.value + change)
    .commit();
});

// 在同一KV事务中修改键并排队消息！
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

### 消息传递保证

运行时保证至少一次传递。这意味着对于大多数排队消息，将为每条消息调用一次
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
处理程序。在某些故障情况下，将为同一消息多次调用处理程序，以确保传递。设计应用程序以正确处理重复消息非常重要。

您可以将队列与 [KV 原子事务](https://docs.deno.com/kv/manual/transactions)
原语结合使用，以确保队列处理程序 KV 更新对每条消息仅执行一次。参见
[带有 KV 原子事务的队列 API](#queue-api-with-kv-atomic-transactions)。

### 自动重试

当排队消息准备传递时，将调用
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
处理程序以处理您的排队消息。如果处理程序引发异常，运行时将自动重试调用处理程序，直到成功或达到最

大重试尝试次数为止。只有在
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
处理程序调用成功完成后，消息才被视为已成功处理。如果处理程序在重试过程中一直失败，消息将被丢弃。

### 消息传递顺序

运行时尽力按照排队的顺序传递消息。但是，没有严格的顺序保证。偶尔，为了确保最大吞吐量，消息可能会无序传递。

## Deno Deploy 上的队列

Deno Deploy 提供了全球、无服务器、分布式实现的排队
API，专为高可用性和吞吐量而设计。您可以使用它来构建可以处理大型工作负载的应用程序。

### 即时隔离启动

在 Deno Deploy 中使用队列时，隔离会在消息变为可处理时自动启动，以调用您的
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
处理程序。定义
[`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
处理程序是启用 Deno Deploy 应用程序中的队列处理的唯一要求，不需要其他配置。

### 队列大小限制

未传递队列消息的最大数量限制为
100,000。如果队列已满，[`enqueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.enqueue)
方法将失败并显示错误。

### 定价详细信息和限制

- [`enqueue`](https://deno.land/api?unstable=true&s=dDeno.Kv&p=prototype.enqueue)
  与其他 [`Deno.Kv`](https://deno.land/api?unstable=true&s=Deno.Kv)
  写入操作一样处理。通过排队消息消耗 KV 存储和写入单元。
- 通过
  [`listenQueue`](https://deno.land/api?unstable=true&s=Deno.Kv&p=prototype.listenQueue)
  传递的消息消耗请求和 KV 写入单元。
- 有关更多信息，请参见 [定价详细信息](https://deno.com/deploy/docs/pricing)。

## 用例

队列可以在许多不同的场景中很有用，但在构建 Web
应用程序时可能会看到一些常见用例。

### 卸载异步进程

有时，由客户端启动的任务（如发送通知或 API
请求）可能需要花费足够长的时间，以至于在返回响应之前不希望等待任务完成。其他情况下，客户端实际上根本不需要响应，例如当客户端发送应用程序的
[webhook 请求](https://en.wikipedia.org/wiki/Webhook)
时，没有必要等待底层任务完成，然后返回响应。

在这些情况下，您可以将工作卸载到队列中，以保持 Web
应用程序的响应性，并立即向客户端发送反馈。要查看此用例在操作中的示例，请查看我们的
[webhook 处理示例](../tutorials/webhook_processor.md)。

### 计划将来的工作

队列的另一个有用应用（以及像这样的队列
API），是在将来的适当时间计划工作。也许您希望在新客户下订单后的一天后发送满意度调查通知。您可以安排将来的消息在未来的
24 小时内传递，并设置一个监听器，在那时发送通知。

要查看将来安排通知的示例，请查看我们的
[通知示例](../tutorials/schedule_notification.md)。
