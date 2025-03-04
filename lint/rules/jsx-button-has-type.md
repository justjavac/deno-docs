---
tags: [recommended, react, jsx, fresh]
---

强制 `<button>` 元素具有 `type` 属性。如果 `<button>` 被放置在 `<form>`
元素内，默认情况下它将作为提交按钮，这可能是意料之外的。

**无效示例：**

```tsx
const btn = <button>click me</button>;
const btn = <button type="2">click me</button>;
```

**有效示例：**

```tsx
const btn = <button type="button">click me</button>;
const btn = <button type="submit">click me</button>;
const btn = <button type={btnType}>click me</button>;
const btn = <button type={condition ? "button" : "submit"}>click me</button>;
```
