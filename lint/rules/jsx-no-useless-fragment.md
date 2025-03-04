---
tags: [recommended, react, jsx, fresh]
---

Fragments 仅在 JSX "块" 的顶部且存在多个子元素时才需要。在其他场景中不需要使用
Fragments。

**无效：**

```tsx
<></>
<><div /></>
<><App /></>
<p>foo <>bar</></p>
```

**有效：**

```tsx
<>{foo}</>
<><div /><div /></>
<>foo <div /></>
<p>foo bar</p>
```
