---
tags: [react, fresh]
---

防止使用 `dangerouslySetInnerHTML`，如果使用不当可能导致 XSS 漏洞。

**无效示例：**

```tsx
const hello = <div dangerouslySetInnerHTML={{ __html: "Hello World!" }} />;
```

**有效示例：**

```tsx
const hello = <div>Hello World!</div>;
```
