---
tags: [recommended]
---

禁止使用 `with` 语句。

不推荐使用 `with` 语句，因为它可能是导致混淆的 bug
和兼容性问题的根源。更多详情，请参阅 [with - JavaScript | MDN]。

[with - JavaScript | MDN]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with

**无效示例：**

```typescript
with (someVar) {
  console.log("foo");
}
```
