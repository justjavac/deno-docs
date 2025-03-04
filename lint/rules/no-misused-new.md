---
tags: [recommended]
---

禁止在接口中定义 `constructor` 或在类中定义 `new` 方法

在接口中指定 `constructor` 或在类中定义 `new` 方法是错误的，应避免这样做。

**无效示例：**

```typescript
class C {
  new(): C;
}

interface I {
  constructor(): void;
}
```

**有效示例：**

```typescript
class C {
  constructor() {}
}

interface I {
  new (): C;
}
```
