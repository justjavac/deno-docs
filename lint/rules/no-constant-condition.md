---
tags: [recommended]
---

禁止在条件测试中使用常量表达式。

在条件测试中使用常量表达式通常是一个错误，或者是开发过程中引入的临时情况，不适合用于生产环境。

**无效示例：**

```typescript
if (true) {}
if (2) {}
do {} while (x = 2); // 无限循环
```

**有效示例：**

```typescript
if (x) {}
if (x === 0) {}
do {} while (x === 2);
```
