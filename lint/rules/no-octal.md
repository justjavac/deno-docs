---
tags: [recommended]
---

禁止通过以 `0` 开头的数字字面量表示八进制数。

八进制数可以通过以 `0` 开头的数字字面量表示，例如
`042`，但这种表示方式常常让程序员感到困惑。这就是为什么 ECMAScript
的严格模式会对此类表达式抛出 `SyntaxError`。

自 ES2015 起，引入了另一种前缀 `0o`
作为替代方案。在当今的代码中，始终鼓励使用这种新的表示方式。

**无效：**

```typescript
const a = 042;
const b = 7 + 042;
```

**有效：**

```typescript
const a = 0o42;
const b = 7 + 0o42;
const c = "042";
```
