---
tags: []
---

禁止将字面量作为异常抛出。

最佳实践是仅 `throw` `Error` 对象本身或以 `Error`
对象为基础对象的用户自定义异常对象。`Error`
对象的基本优势在于它们会自动跟踪其构建和起源的位置。

**无效示例：**

```typescript
throw "error";
throw 0;
throw undefined;
throw null;
```

**有效示例：**

```typescript
throw new Error("error");
```
