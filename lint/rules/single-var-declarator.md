---
tags: []
---

禁止在同一声明语句中定义多个变量。

**无效示例：**

```typescript
const foo = 1, bar = "2";
```

**有效示例：**

```typescript
const foo = 1;
const bar = "2";
```
