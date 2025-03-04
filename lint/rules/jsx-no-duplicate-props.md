---
tags: [recommended, react, jsx]
---

禁止重复的 JSX 属性。后面的属性总是会覆盖前面的属性，通常会导致意外的结果。

**无效示例：**

```tsx
<div id="1" id="2" />;
<App a a />;
<App a {...b} a />;
```

**有效示例：**

```tsx
<div id="1" />
<App a />
<App a {...b} />
<App {...b} b />
```
