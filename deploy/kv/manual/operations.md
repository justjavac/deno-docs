---
title: "操作"
oldUrl:
  - /runtime/manual/runtime/kv/operations/
  - /kv/manual/operations/
---

<deno-admonition></deno-admonition>

Deno KV API 提供了一组可以在键空间上执行的操作。

有两种操作可以从存储中读取数据，五种操作可以将数据写入存储。

读取操作可以在强一致性模式或最终一致性模式下执行。强一致性模式保证读取操作将返回最近写入的值。最终一致性模式可能返回过时的值，但速度更快。

写入操作始终在强一致性模式下执行。

## `get`

`get` 操作返回与给定键关联的值和版本戳。如果值不存在，`get` 返回 `null`
值和版本戳。

有两种 API 可以用于执行 `get`
操作。[`Deno.Kv.prototype.get(key, options?)`][get] API 可用于读取单个键，而
[`Deno.Kv.prototype.getMany(keys, options?)`][getMany] API
可用于同时读取多个键。

在所有一致性模式下，`get`
操作都作为“快照读取”执行。这意味着当同时检索多个键时，返回的值将彼此一致。

```ts
const res = await kv.get<string>(["config"]);
console.log(res); // { key: ["config"], value: "value", versionstamp: "000002fa526aaccb0000" }

const res = await kv.get<string>(["config"], { consistency: "eventual" });
console.log(res); // { key: ["config"], value: "value", versionstamp: "000002fa526aaccb0000" }

const [res1, res2, res3] = await kv.getMany<[string, string, string]>([
  ["users", "sam"],
  ["users", "taylor"],
  ["users", "alex"],
]);
console.log(res1); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
console.log(res2); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }
console.log(res3); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
```

## `list`

`list`
操作返回与给定选择器匹配的键列表。这些键的关联值和版本戳也会返回。有两种不同的选择器可用于过滤匹配的键。

`prefix`
选择器匹配所有以给定前缀键部分开头的键，但不包括与键完全匹配的情况。前缀选择器可以选择性地提供
`start` 或 `end` 键来限制返回的键范围。`start` 键是包含的，`end` 键是排除的。

`range` 选择器匹配所有在给定 `start` 和 `end` 键之间按字典顺序排列的键。`start`
键是包含的，`end` 键是排除的。

> 注意：对于前缀选择器，`prefix`
> 键必须仅由完整（而非部分）键部分组成。例如，如果键 `["foo", "bar"]`
> 存在于存储中，则前缀选择器 `["foo"]` 将匹配它，但前缀选择器 `["f"]` 不会。

`list` 操作可以选择性地提供 `limit` 来限制返回的键数量。

可以使用 [`Deno.Kv.prototype.list<string>(selector, options?)`][list] 方法执行
`list` 操作。此方法返回一个
`Deno.KvListIterator`，可用于迭代返回的键。这是一个异步迭代器，可以与
`for await` 循环一起使用。

```ts
// 返回所有用户
const iter = kv.list<string>({ prefix: ["users"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
console.log(users[2]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }

// 返回前 2 个用户
const iter = kv.list<string>({ prefix: ["users"] }, { limit: 2 });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }

// 返回按字典顺序在 "taylor" 之后的所有用户
const iter = kv.list<string>({ prefix: ["users"], start: ["users", "taylor"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }

// 返回按字典顺序在 "taylor" 之前的所有用户
const iter = kv.list<string>({ prefix: ["users"], end: ["users", "taylor"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }

// 返回所有以 "a" 到 "n" 之间字符开头的用户
const iter = kv.list<string>({ start: ["users", "a"], end: ["users", "n"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
```

`list` 操作从存储中批量读取数据。可以使用 `batchSize`
选项控制每批的大小。默认批量大小为 500
个键。批内的数据在单个快照读取中读取，因此值彼此一致。一致性模式适用于每批读取的数据。跨批次的数据不一致。批之间的边界在
API 中不可见，因为迭代器返回单个键。

可以通过将 `reverse` 选项设置为 `true` 来以相反的顺序执行 `list`
操作。这将按字典顺序降序返回键。`start` 和 `end`
键仍然是包含和排除的，并且仍然按字典顺序升序解释。

```ts
// 以相反顺序返回所有用户，以 "sam" 结尾
const iter = kv.list<string>({ prefix: ["users"], start: ["users", "sam"] }, {
  reverse: true,
});
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
```

> 注意：在上面的示例中，我们将 `start` 键设置为
> `["users", "sam"]`，即使返回的第一个键是 `["users", "taylor"]`。这是因为
> `start` 和 `end` 键始终按字典顺序升序评估，即使 `list`
> 操作以相反顺序执行（返回的键按字典顺序降序）。

## `set`

`set` 操作设置存储中键的值。如果键不存在，则创建它。如果键已存在，则覆盖其值。

可以使用 [`Deno.Kv.prototype.set(key, value)`][set] 方法执行 `set`
操作。此方法返回一个 `Promise`，解析为 `Deno.KvCommitResult`
对象，其中包含提交的 `versionstamp`。

`set` 操作始终在强一致性模式下执行。

```ts
const res = await kv.set(["users", "alex"], "alex");
console.log(res.versionstamp); // "00a44a3c3e53b9750000"
```

## `delete`

`delete` 操作从存储中删除一个键。如果键不存在，则操作无效。

可以使用 [`Deno.Kv.prototype.delete(key)`][delete] 方法执行 `delete` 操作。

`delete` 操作始终在强一致性模式下执行。

```ts
await kv.delete(["users", "alex"]);
```

## `sum`

`sum`
操作原子地将一个值添加到存储中的键。如果键不存在，则创建它并将值设置为和。如果键已存在，则将其值添加到和中。

`sum`
操作只能作为原子操作的一部分执行。[`Deno.AtomicOperation.prototype.mutate({ type: "sum", value })`][mutate]
方法可用于将和变异添加到原子操作中。

`sum` 操作只能对 `Deno.KvU64` 类型的值执行。操作数和存储中的值都必须为
`Deno.KvU64` 类型。

如果键的新值大于 `2^64 - 1` 或小于 `0`，则 `sum`
操作会回绕。例如，如果存储中的值为 `2^64 - 1` 且操作数为 `1`，则新值将为 `0`。

`sum` 操作始终在强一致性模式下执行。

```ts
await kv.atomic()
  .mutate({
    type: "sum",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `min`

`min`
操作原子地将键设置为其当前值和给定值的最小值。如果键不存在，则创建它并将值设置为给定值。如果键已存在，则将其值设置为其当前值和给定值的最小值。

`min`
操作只能作为原子操作的一部分执行。[`Deno.AtomicOperation.prototype.mutate({ type: "min", value })`][mutate]
方法可用于将最小变异添加到原子操作中。

`min` 操作只能对 `Deno.KvU64` 类型的值执行。操作数和存储中的值都必须为
`Deno.KvU64` 类型。

`min` 操作始终在强一致性模式下执行。

```ts
await kv.atomic()
  .mutate({
    type: "min",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `max`

`max`
操作原子地将键设置为其当前值和给定值的最大值。如果键不存在，则创建它并将值设置为给定值。如果键已存在，则将其值设置为其当前值和给定值的最大值。

`max`
操作只能作为原子操作的一部分执行。[`Deno.AtomicOperation.prototype.mutate({ type: "max", value })`][mutate]
方法可用于将最大变异添加到原子操作中。

`max` 操作只能对 `Deno.KvU64` 类型的值执行。操作数和存储中的值都必须为
`Deno.KvU64` 类型。

`max` 操作始终在强一致性模式下执行。

```ts
await kv.atomic()
  .mutate({
    type: "max",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `watch`

`watch` 操作接受一个键数组，并返回一个
[`ReadableStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)，每当任何被监视的键更改其
`versionstamp` 时，它都会发出一个新值。发出的值是一个
[Deno.KvEntryMaybe](https://docs.denohub.com/api/deno/~/Deno.KvEntryMaybe)
对象数组。

请注意，返回的流不会返回被监视键的每个中间状态，而是让您了解键的最新状态。这意味着如果键被多次快速修改，您可能不会收到每次更改的通知，但会收到键的最新状态。

```ts
const db = await Deno.openKv();

const stream = db.watch([["foo"], ["bar"]]);
for await (const entries of stream) {
  entries[0].key; // ["foo"]
  entries[0].value; // "bar"
  entries[0].versionstamp; // "00000000000000010000"
  entries[1].key; // ["bar"]
  entries[1].value; // null
  entries[1].versionstamp; // null
}
```

[get]: https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.get
[getMany]: https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.getMany
[list]: https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.list
[set]: https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.set
[delete]: https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.delete
[mutate]: https://docs.denohub.com/api/deno/~/Deno.AtomicOperation.prototype.mutate
