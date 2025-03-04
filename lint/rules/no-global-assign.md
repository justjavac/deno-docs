---
tags: [recommended]
---

禁止对原生 JavaScript 对象进行赋值。

在 JavaScript 中，例如 `String` 和 `Object`
是原生对象。与任何对象一样，它们可以被重新赋值，但这样做几乎总是不明智的，因为这可能导致意想不到的结果和难以追踪的错误。

**无效示例：**

```typescript
Object = null;
undefined = true;
window = {};
```
