---
tags: []
---

禁止在可选链表达式后使用非空断言。

`?.` 可选链表达式在对象为 `null` 或 `undefined` 时返回 `undefined`。使用 `!`
非空断言来断言 `?.` 可选链表达式的结果为非空值很可能是错误的。

**无效示例：**

```typescript
foo?.bar!;
foo?.bar()!;
```

**有效示例：**

```typescript
foo?.bar;
foo?.bar();
```
