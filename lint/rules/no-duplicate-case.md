---
tags: [recommended]
---

禁止在 `switch` 语句中多次使用相同的 `case` 子句。

当你在 `switch` 语句中重复使用 `case` 测试表达式时，重复的 `case`
将永远不会被执行，这意味着这几乎总是一个错误。

**无效示例：**

```typescript
const someText = "a";
switch (someText) {
  case "a": // (1)
    break;
  case "b":
    break;
  case "a": // 重复了 (1)
    break;
  default:
    break;
}
```

**有效示例：**

```typescript
const someText = "a";
switch (someText) {
  case "a":
    break;
  case "b":
    break;
  case "c":
    break;
  default:
    break;
}
```
