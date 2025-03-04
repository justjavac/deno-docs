---
tags: [recommended, react, jsx, fresh]
---

在 JSX 中，文本节点内的 JavaScript 注释会被渲染为纯文本。这通常是出乎意料的。

**无效：**

```tsx
<div>// comment</div>
<div>/* comment */</div>
```

**有效：**

```tsx
<div>{/* comment */}</div>;
```
