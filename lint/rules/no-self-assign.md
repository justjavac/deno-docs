---
tags: [recommended]
---

禁止自我赋值。

像 `a = a;`
这样的自我赋值完全没有效果。如果代码中存在自我赋值，很可能意味着作者仍在重构过程中，还有剩余的工作需要完成。

**无效示例：**

```typescript
a = a;
[a] = [a];
[a, b] = [a, b];
[a, b] = [a, c];
[a, ...b] = [a, ...b];
a.b = a.b;
```

**有效示例：**

```typescript
let a = a;
a += a;
a = [a];
[a, b] = [b, a];
a.b = a.c;
```
