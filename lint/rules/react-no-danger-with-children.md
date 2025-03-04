---
tags: [react, fresh]
---

将 JSX 子元素与 `dangerouslySetInnerHTML` 一起使用是无效的，因为它们将被忽略。

**无效示例：**

```tsx
<div dangerouslySetInnerHTML={{ __html: "<h1>hello</h1>" }}>
  <h1>this will never be rendered</h1>
</div>;
```

**有效示例：**

```tsx
<div dangerouslySetInnerHTML={{ __html: "<h1>hello</h1>" }} />;
```
