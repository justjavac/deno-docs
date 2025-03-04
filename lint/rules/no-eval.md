---
tags: []
---

禁止使用 `eval`。

`eval`
是一个潜在危险的函数，可能会使你的代码面临多种安全漏洞。除了速度较慢之外，`eval`
通常也是不必要的，因为有更好的解决方案可用。

**无效示例：**

```typescript
const obj = { x: "foo" };
const key = "x",
const value = eval("obj." + key);
```

**有效示例：**

```typescript
const obj = { x: "foo" };
const value = obj[x];
```
