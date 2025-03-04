---
tags: [recommended]
---

禁止删除变量。

`delete` 用于从对象中移除属性。通过 `var`、`let` 和 `const`
声明的变量无法被删除（`delete` 会返回 `false`）。在启用 `strict`
模式时，尝试删除变量会引发语法错误。

**无效示例：**

```typescript
const a = 1;
let b = 2;
let c = 3;
delete a; // 会返回 false
delete b; // 会返回 false
delete c; // 会返回 false
```

**有效示例：**

```typescript
let obj = {
  a: 1,
};
delete obj.a; // 返回 true
```
