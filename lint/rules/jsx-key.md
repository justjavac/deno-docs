---
tags: [recommended, react, jsx]
---

在将可迭代对象传递到 JSX 时，确保 `key` 属性存在。它允许框架优化检查元素的顺序。

**无效示例：**

```tsx
const foo = [<div>foo</div>];
const foo = [<>foo</>];
[1, 2, 3].map(() => <div />);
Array.from([1, 2, 3], () => <div />);
```

**有效示例：**

```tsx
const foo = [<div key="a">foo</div>];
const foo = [<Fragment key="b">foo</Fragment>];
[1, 2, 3].map((x) => <div key={x} />);
Array.from([1, 2, 3], (x) => <div key={x} />);
```
