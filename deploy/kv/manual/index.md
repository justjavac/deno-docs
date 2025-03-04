---
title: "Deno KV 快速入门"
oldUrl:
  - /kv/
  - /kv/manual/
  - /runtime/manual/runtime/kv/
---

**Deno KV** 是一个直接内置在 Deno 运行时中的
[键值数据库](https://en.wikipedia.org/wiki/Key%E2%80%93value_database)，可通过
[`Deno.Kv` 命名空间](https://docs.denohub.com/api/deno/~/Deno.Kv)
使用。它适用于多种数据存储场景，尤其擅长存储简单数据结构，能够实现非常快速的读写操作。Deno
KV 可在 Deno CLI 和 [Deno Deploy](./on_deploy) 中使用。

<deno-admonition></deno-admonition>

让我们来了解 Deno KV 的关键特性。

## 打开数据库

在 Deno 程序中，您可以使用
[`Deno.openKv()`](https://docs.denohub.com/api/deno/~/Deno.openKv) 获取对 KV
数据库的引用。您可以传入一个可选的文件系统路径来指定数据库的存储位置，否则将根据脚本的当前工作目录创建一个数据库。

```ts
const kv = await Deno.openKv();
```

## 创建、更新和读取键值对

Deno KV 中的数据以键值对的形式存储，类似于 JavaScript 对象字面量或
[Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
的属性。[键](./key_space) 由 JavaScript 类型的数组表示，如
`string`、`number`、`bigint` 或 `boolean`。值可以是任意的 JavaScript
对象。在此示例中，我们创建了一个表示用户 UI 偏好的键值对，并使用
[`kv.set()`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.set) 保存它。

```ts
const kv = await Deno.openKv();

const prefs = {
  username: "ada",
  theme: "dark",
  language: "en-US",
};

const result = await kv.set(["preferences", "ada"], prefs);
```

一旦设置了键值对，您可以使用
[`kv.get()`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.get)
从数据库中读取它：

```ts
const entry = await kv.get(["preferences", "ada"]);
console.log(entry.key);
console.log(entry.value);
console.log(entry.versionstamp);
```

`get` 和 `list` [操作](./operations) 都会返回一个
[KvEntry](https://docs.denohub.com/api/deno/~/Deno.KvEntry)
对象，该对象具有以下属性：

- `key` - 用于设置值的数组键
- `value` - 为该键设置的 JavaScript 对象
- `versionstamp` - 用于确定键是否已更新的生成值。

`set` 操作也用于更新已存在的键的值。当键的值更新时，其 `versionstamp`
将更改为新的生成值。

## 列出多个键值对

要获取有限数量键的值，您可以使用
[`kv.getMany()`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.getMany)。传入多个键作为参数，您将收到每个键的值的数组。请注意，**如果给定键没有值，值和
versionstamp 可能为 `null`**。

```ts
const kv = await Deno.openKv();
const result = await kv.getMany([
  ["preferences", "ada"],
  ["preferences", "grace"],
]);
result[0].key; // ["preferences", "ada"]
result[0].value; // { ... }
result[0].versionstamp; // "00000000000000010000"
result[1].key; // ["preferences", "grace"]
result[1].value; // null
result[1].versionstamp; // null
```

通常，检索具有给定前缀的所有键的键值对列表非常有用。这种操作可以使用
[`kv.list()`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.list)
实现。在此示例中，我们获取了具有 `"preferences"` 前缀的键值对列表。

```ts
const kv = await Deno.openKv();
const entries = kv.list({ prefix: ["preferences"] });
for await (const entry of entries) {
  console.log(entry.key); // ["preferences", "ada"]
  console.log(entry.value); // { ... }
  console.log(entry.versionstamp); // "00000000000000010000"
}
```

返回的键按前缀后的键的下一个组件按字典顺序排序。因此，具有以下键的 KV 对：

- `["preferences", "ada"]`
- `["preferences", "bob"]`
- `["preferences", "cassie"]`

将按此顺序由 `kv.list()` 返回。

读取操作可以在 [**强一致性或最终一致性模式**](./operations)
下执行。强一致性模式保证读取操作将返回最近写入的值。最终一致性模式可能返回过时的值，但速度更快。相比之下，写入操作始终在强一致性模式下执行。

## 删除键值对

您可以使用
[`kv.delete()`](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.delete)
从数据库中删除键。如果未找到给定键的值，则不会执行任何操作。

```ts
const kv = await Deno.openKv();
await kv.delete(["preferences", "alan"]);
```

## 原子事务

Deno KV 能够执行
[原子事务](./transactions)，这使您能够有条件地一次性执行一个或多个数据操作。在以下示例中，我们仅在尚未创建的情况下创建新的偏好对象。

```ts
const kv = await Deno.openKv();

const key = ["preferences", "alan"];
const value = {
  username: "alan",
  theme: "light",
  language: "en-GB",
};

const res = await kv.atomic()
  .check({ key, versionstamp: null }) // `null` versionstamps 表示“没有值”
  .set(key, value)
  .commit();
if (res.ok) {
  console.log("Preferences did not yet exist. Inserted!");
} else {
  console.error("Preferences already exist.");
}
```

了解更多关于 Deno KV 中的事务 [请参阅此处](./transactions)。

## 使用二级索引优化查询

[二级索引](./secondary_indexes)
通过多个键存储相同的数据，从而简化所需数据的查询。假设我们需要能够通过用户名和电子邮件访问用户偏好。为了实现这一点，您可以提供一个函数来封装保存偏好的逻辑，以创建两个索引。

```ts
const kv = await Deno.openKv();

async function savePreferences(prefs) {
  const key = ["preferences", prefs.username];

  // 设置主键
  const r = await kv.set(key, prefs);

  // 将二级键的值设置为主键
  await kv.set(["preferencesByEmail", prefs.email], key);

  return r;
}

async function getByUsername(username) {
  // 像以前一样使用...
  const r = await kv.get(["preferences", username]);
  return r;
}

async function getByEmail(email) {
  // 通过电子邮件查找键，然后第二次查找实际数据
  const r1 = await kv.get(["preferencesByEmail", email]);
  const r2 = await kv.get(r1.value);
  return r2;
}
```

了解更多关于 [二级索引的手册内容请参阅此处](./secondary_indexes)。

## 监听 Deno KV 中的更新

您还可以使用 `kv.watch()` 监听 Deno KV
中的更新，它将发出您提供的键或键的新值。在下面的聊天示例中，我们监听键
`["last_message_id", roomId]` 的更新。我们检索 `messageId`，然后将其与
`kv.list()` 一起使用，以获取从 `seen` 到 `messageId` 的所有新消息。

```ts
let seen = "";
for await (const [messageId] of kv.watch([["last_message_id", roomId]])) {
  const newMessages = await Array.fromAsync(kv.list({
    start: ["messages", roomId, seen, ""],
    end: ["messages", roomId, messageId, ""],
  }));
  await websocket.write(JSON.stringify(newMessages));
  seen = messageId;
}
```

了解更多关于 [使用 Deno KV 监听功能请参阅此处](./operations#watch)。

## 生产环境使用

Deno KV 可在 [Deno Deploy](./on_deploy)
上的实时应用程序中使用。在生产环境中，Deno KV 由
[FoundationDB](https://www.foundationdb.org/) 支持，这是由 Apple
创建的开源键值存储。

**无需额外配置** 即可在 Deploy 上运行使用 KV 的 Deno 程序 -
当您的代码需要时，将为您配置一个新的 Deploy 数据库。了解更多关于 Deno KV 在 Deno
Deploy 上的使用 [请参阅此处](./on_deploy)。

## 测试

默认情况下，[`Deno.openKv()`](https://docs.denohub.com/api/deno/~/Deno.openKv)
创建或打开一个基于调用它的脚本路径的持久存储。这对于测试来说通常并不理想，因为测试需要在多次运行时产生相同的行为。

要测试使用 Deno KV 的代码，您可以使用特殊参数 `":memory:"` 创建一个临时的 Deno
KV 数据存储。

```ts
async function setDisplayName(
  kv: Deno.Kv,
  username: string,
  displayname: string,
) {
  await kv.set(["preferences", username, "displayname"], displayname);
}

async function getDisplayName(
  kv: Deno.Kv,
  username: string,
): Promise<string | null> {
  return (await kv.get(["preferences", username, "displayname"]))
    .value as string;
}

Deno.test("Preferences", async (t) => {
  const kv = await Deno.openKv(":memory:");

  await t.step("can set displayname", async () => {
    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, null);

    await setDisplayName(kv, "example", "Exemplary User");

    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, "Exemplary User");
  });
});
```

这是因为 Deno KV 在本地开发时由 SQLite 支持。就像内存中的 SQLite
数据库一样，多个临时的 Deno KV
存储可以同时存在而不会相互干扰。有关特殊数据库寻址模式的更多信息，请参阅
[SQLite 文档](https://www.sqlite.org/inmemorydb.html)。

## 下一步

至此，您刚刚开始了解 Deno KV 的皮毛。请务必查看我们的
[Deno KV 键空间指南](./key_space)，以及
[教程和示例应用程序](../tutorials/index.md) 的集合。
