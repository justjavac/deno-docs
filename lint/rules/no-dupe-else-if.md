---
tags: [recommended]
---

禁止在 `if`/`else if` 语句中重复使用相同的条件。

当你在 `if`/`else if`
语句中重复使用一个条件时，重复的条件将永远不会被触发（除非有异常的副作用），这意味着这几乎总是一个错误。

**无效示例：**

```typescript
if (a) {}
else if (b) {}
else if (a) {} // 重复了上面的条件

if (a === 5) {}
else if (a === 6) {}
else if (a === 5) {} // 重复了上面的条件
```

**有效示例：**

```typescript
if (a) {}
else if (b) {}
else if (c) {}

if (a === 5) {}
else if (a === 6) {}
else if (a === 7) {}
```
