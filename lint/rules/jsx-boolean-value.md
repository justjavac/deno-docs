---
tags: [recommended, react, jsx]
---

强制一致的 JSX 布尔值风格。使用简写语法时，可以省略传递 `true` 作为布尔值。

**无效：**

```tsx
const foo = <Foo isFoo={true} />;
const foo = <Foo isFoo={false} />;
```

**有效：**

```tsx
const foo = <Foo isFoo />;
const foo = <Foo isFoo={false} />;
```
