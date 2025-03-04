---
tags: [recommended]
---

禁止声明空接口。

没有成员的接口没有任何作用。此规则将捕获这些情况，要么是多余的代码，要么是错误地实现了空接口。

**无效示例：**

```typescript
interface Foo {}
```

**有效示例：**

```typescript
interface Foo {
  name: string;
}

interface Bar {
  age: number;
}

// 允许使用至少有一个扩展的空接口。

// 使用空接口将 Baz 的身份从类型更改为接口。
type Baz = { profession: string };
interface Foo extends Baz {}

// 使用空接口扩展已存在的 Foo 声明
// 并包含 Bar 接口的成员
interface Foo extends Bar {}

// 使用空接口作为联合类型
interface Baz extends Foo, Bar {}
```
