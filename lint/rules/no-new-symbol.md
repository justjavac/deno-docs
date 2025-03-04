---
tags: [recommended]
---

禁止使用 `new` 操作符与内置的 `Symbol` 一起使用。

`Symbol` 是通过作为函数调用来创建的，但我们有时会错误地使用 `new`
操作符来调用它。此规则检测这种错误的 `new` 操作符用法。

**无效：**

```typescript
const foo = new Symbol("foo");
```

**有效：**

```typescript
const foo = Symbol("foo");

function func(Symbol: typeof SomeClass) {
  // 这里的 `Symbol` 不是内置的
  const bar = new Symbol();
}
```
