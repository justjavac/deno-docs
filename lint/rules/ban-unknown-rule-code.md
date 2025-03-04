---
tags: [recommended]
---

警告在忽略指令中使用未知规则代码的情况。

有时我们出于某些原因需要抑制并忽略 lint 错误。我们可以使用
[忽略指令](/go/lint-ignore/) 并指定要忽略的规则名称来实现，如下所示：

```typescript
// deno-lint-ignore no-explicit-any no-unused-vars
const foo: any = 42;
```

此规则检查指定的规则名称是否有效（即 `deno_lint` 是否提供了该规则）。

**无效示例：**

```typescript
// 拼写错误
// deno-lint-ignore eq-eq-e
console.assert(x == 42);

// 未知规则名称
// deno-lint-ignore UNKNOWN_RULE_NAME
const b = "b";
```

**有效示例：**

```typescript
// deno-lint-ignore eq-eq-eq
console.assert(x == 42);

// deno-lint-ignore no-unused-vars
const b = "b";
```
