---
tags: [recommended, react, jsx, fresh]
---

将子元素作为 JSX 子元素传递，而不是作为属性。

**无效：**

```tsx
<div children="foo" />
<div children={[<Foo />, <Bar />]} />
```

**有效：**

```tsx
<div>foo</div>
<div><Foo /><Bar /></div>
```
