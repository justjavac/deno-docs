---
tags: [recommended]
---

禁止不必要的布尔类型转换。

在某些上下文中，例如 `if`、`while` 或 `for`
语句，表达式会自动转换为布尔值。因此，诸如双重否定（`!!foo`）或类型转换（`Boolean(foo)`）等技术是不必要的，并且与不使用否定或转换时产生的结果相同。

**无效示例：**

```typescript
if (!!foo) {}
if (Boolean(foo)) {}
while (!!foo) {}
for (; Boolean(foo);) {}
```

**有效示例：**

```typescript
if (foo) {}
while (foo) {}
for (; foo;) {}
```
