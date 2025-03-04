---
tags: [recommended]
---

禁止在正则表达式中使用空字符类。

正则表达式字符类是括号内的一系列字符，例如
`[abc]`。如果在括号内没有提供任何内容，它将不会匹配任何内容，这很可能是一个拼写错误或错误。

**无效示例：**

```typescript
/^abc[]/.test("abcdefg"); // false，因为 `d` 不匹配空字符类
"abcdefg".match(/^abc[]/); // null
```

**有效示例：**

```typescript
// 不使用字符类
/^abc/.test("abcdefg"); // true
"abcdefg".match(/^abc/); // ["abc"]

// 使用有效的字符类
/^abc[a-z]/.test("abcdefg"); // true
"abcdefg".match(/^abc[a-z]/); // ["abcd"]
```
