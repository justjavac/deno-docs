---
tags: [recommended]
---

警告未使用的忽略指令。

有时我们出于某些原因需要抑制并忽略 lint 错误，我们可以使用
[忽略指令](/go/lint-ignore/) 来实现。

然而，在某些情况下，比如重构之后，我们可能会留下不再必要的忽略指令。这些多余的忽略指令可能会让未来的代码阅读者感到困惑，更糟糕的是，可能会无意中隐藏未来的
lint 错误。为了防止这种情况，此规则会检测未使用的、多余的忽略指令。

**无效示例：**

```typescript
// 实际上这行代码是有效的，因为 `export` 意味着“已使用”，
// 所以这个指令是多余的
// deno-lint-ignore no-unused-vars
export const foo = 42;
```

**有效示例：**

```typescript
export const foo = 42;
```
