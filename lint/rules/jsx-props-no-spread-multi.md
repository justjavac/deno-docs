---
tags: [recommended, react, jsx]
---

重复展开相同的表达式通常是一个错误，会导致不必要的计算。

**无效示例：**

```tsx
<div {...foo} {...foo} />
<div {...foo} a {...foo} />
<Foo {...foo.bar} {...foo.bar} />
```

**有效示例：**

```tsx
<div {...foo} />
<div {...foo.bar} a />
<Foo {...foo.bar} />
```
