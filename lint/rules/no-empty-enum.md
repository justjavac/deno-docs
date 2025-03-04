---
tags: [recommended]
---

禁止声明空枚举。

没有成员的枚举没有任何意义。此规则将捕获这些情况，认为它们是不必要的代码或错误的空实现。

**无效示例:**

```typescript
enum Foo {}
```

**有效示例:**

```typescript
enum Foo {
  ONE = "ONE",
}
```
