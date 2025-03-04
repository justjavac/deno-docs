---
tags: [recommended, react, jsx]
---

确保在 JSX 表达式中一致地使用花括号。

**无效示例：**

```tsx
const foo = <Foo foo=<div /> />;
const foo = <Foo str={"foo"} />;
const foo = <div>{"foo"}</div>;
```

**有效示例：**

```tsx
const foo = <Foo foo={<div />} />;
const foo = <Foo str="foo" />;
const foo = <div>foo</div>;
```
