---
tags: [recommended]
---

禁止使用没有 `yield` 的生成器函数。

JavaScript 提供了通过 `function*`
表示的生成器函数，我们可以在其中暂停并在稍后恢复函数的执行。在这些暂停点，我们使用
`yield` 关键字。换句话说，创建不包含 `yield`
关键字的生成器函数毫无意义，因为这样的函数可以写成普通函数。

**无效示例：**

```typescript
function* f1() {
  return "f1";
}
```

**有效示例：**

```typescript
function* f1() {
  yield "f1";
}

// 允许空的生成器函数
function* f2() {}

function f3() {
  return "f3";
}
```
