---
tags: [recommended]
---

禁止在 RegExp 构造函数中指定无效的正则表达式。

指定无效的正则表达式字面量会在编译时导致 SyntaxError，然而在 RegExp
构造函数中指定无效的正则表达式字符串只能在运行时发现。

**无效示例：**

```typescript
const invalidRegExp = new RegExp(")");
```

**有效示例：**

```typescript
const goodRegExp = new RegExp(".");
```
