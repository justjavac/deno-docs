---
tags: [recommended]
---

禁止在函数签名中多次使用相同的参数名称。

如果你在函数中提供了多个相同名称的参数，最后一个实例将会覆盖前面的实例。这很可能是一个无意的拼写错误。

**无效示例：**

```typescript
function withDupes(a, b, a) {
  console.log("I'm the value of the second a:", a);
}
```

**有效示例：**

```typescript
function withoutDupes(a, b, c) {
  console.log("I'm the value of the first (and only) a:", a);
}
```
