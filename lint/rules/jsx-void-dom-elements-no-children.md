---
tags: [recommended, react, jsx, fresh]
---

确保 HTML 中的空元素没有任何子元素，因为这是无效的 HTML。有关更多信息，请参阅
MDN 上的
[`Void element` 文章](https://developer.mozilla.org/zh-CN/docs/Glossary/Void_element)。

**无效：**

```tsx
<br>foo</br>
<img src="a.jpg">foo</img>
```

**有效：**

```tsx
<br />
<img src="a.jpg" />
```
