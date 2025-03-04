---
title: "事务"
oldUrl:
  - /runtime/manual/runtime/kv/transactions/
  - /kv/manual/transactions/
---

<deno-admonition></deno-admonition>

Deno KV 存储使用 _乐观并发控制事务_ 而不是像 PostgreSQL 或 MySQL 等许多 SQL
系统中的
_交互式事务_。这种方法使用版本戳（versionstamps）来管理对共享资源的并发访问，而无需使用锁。版本戳表示给定键的当前值版本。当发生读取操作时，系统会返回与键关联的值以及版本戳。

要执行事务，可以执行一个由多个变更操作（如设置或删除）组成的原子操作。除了这些操作外，还需要提供键+版本戳对作为事务成功的条件。只有当指定的版本戳与数据库中相应键的当前版本匹配时，乐观并发控制事务才会提交。这种事务模型确保了数据的一致性和完整性，同时允许在
Deno KV 存储中进行并发交互。

由于 OCC
事务是乐观的，它们可能会在提交时失败，因为原子操作中指定的版本约束被违反了。这种情况发生在某个代理在读取和提交之间更新了事务中使用的键时。当这种情况发生时，执行事务的代理必须重试事务。

为了说明如何在 Deno KV 中使用 OCC 事务，以下示例展示了如何为账户分类账实现一个
`transferFunds(from: string, to: string, amount: number)`
函数。账户分类账将每个账户的余额存储在键值存储中。键以 `"account"`
为前缀，后跟账户标识符：`["account", "alice"]`。每个键存储的值是一个表示账户余额的数字。

以下是实现 `transferFunds` 函数的逐步示例：

```ts
async function transferFunds(sender: string, receiver: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");

  // 构造发送方和接收方账户的 KV 键。
  const senderKey = ["account", sender];
  const receiverKey = ["account", receiver];

  // 重试事务直到成功。
  let res = { ok: false };
  while (!res.ok) {
    // 读取两个账户的当前余额。
    const [senderRes, receiverRes] = await kv.getMany([senderKey, receiverKey]);
    if (senderRes.value === null) {
      throw new Error(`Account ${sender} not found`);
    }
    if (receiverRes.value === null) {
      throw new Error(`Account ${receiver} not found`);
    }

    const senderBalance = senderRes.value;
    const receiverBalance = receiverRes.value;

    // 确保发送方有足够的余额完成转账。
    if (senderBalance < amount) {
      throw new Error(
        `Insufficient funds to transfer ${amount} from ${sender}`,
      );
    }

    // 执行转账。
    const newSenderBalance = senderBalance - amount;
    const newReceiverBalance = receiverBalance + amount;

    // 尝试提交事务。如果事务由于检查失败（即键的版本戳已更改）而未能提交，`res` 将返回一个 `ok: false` 的对象。
    res = await kv.atomic()
      .check(senderRes) // 确保发送方的余额未更改。
      .check(receiverRes) // 确保接收方的余额未更改。
      .set(senderKey, newSenderBalance) // 更新发送方的余额。
      .set(receiverKey, newReceiverBalance) // 更新接收方的余额。
      .commit();
  }
}
```

在此示例中，`transferFunds`
函数读取两个账户的余额和版本戳，计算转账后的新余额，并检查账户 A
是否有足够的资金。然后，它执行一个原子操作，在版本戳约束下设置新余额。如果事务成功，循环退出。如果版本约束被违反，事务失败，循环将重试事务直到成功。

## 限制

除了最大键大小为 2 KiB 和最大值大小为 64 KiB 之外，Deno KV 事务 API
还有一些限制：

- **`kv.getMany()` 的最大键数**：10
- **`kv.list()` 的最大批量大小**：1000
- **原子操作中的最大检查数**：100
- **原子操作中的最大变更数**：1000
- **原子操作的最大总大小**：800
  KiB。这包括检查和变更中的所有键和值，编码开销也计入此限制。
- **键的最大总大小**：90 KiB。这包括检查和变更中的所有键，编码开销也计入此限制。
- **`kv.watch()` 的最大监视键数**：10
