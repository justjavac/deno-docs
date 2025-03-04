---
title: "键值过期 (TTL for keys)"
oldUrl:
  - /kv/manual/key_expiration/
---

<deno-admonition></deno-admonition>

自 1.36.2 版本起，Deno KV 支持键值过期，允许开发者控制键值在 KV
数据库中的存活时间
(TTL)。这可以将一个过期时间戳与键值关联，之后该键值将自动从数据库中删除：

```ts
const kv = await Deno.openKv();

// `expireIn` 是键值过期前的毫秒数。
function addSession(session: Session, expireIn: number) {
  await kv.set(["sessions", session.id], session, { expireIn });
}
```

键值过期在 Deno CLI 和 Deno Deploy 中均受支持。

## 多个键值的原子过期

如果在同一个原子操作中设置了多个键值，并且它们具有相同的 `expireIn`
值，那么这些键值的过期将是原子的。例如：

```ts
const kv = await Deno.openKv();

function addUnverifiedUser(
  user: User,
  verificationToken: string,
  expireIn: number,
) {
  await kv.atomic()
    .set(["users", user.id], user, { expireIn })
    .set(["verificationTokens", verificationToken], user.id, { expireIn })
    .commit();
}
```

## 注意事项

过期时间戳指定了键值可以从数据库中删除的 _最早_
时间。实现允许在指定时间戳之后的任何时间删除键值，但不能在此之前。如果需要严格强制执行过期时间（例如出于安全目的），请将其作为值的一个字段，并在从数据库中检索值后进行检查。
