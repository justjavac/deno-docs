---
tags: [recommended]
---

禁止在正则表达式中使用 ASCII 控制字符。

控制字符是 ASCII 范围 0-31
中的不可见字符。在正则表达式中使用这些字符并不常见，更多时候是正则表达式中的错误。

**无效示例：**

```typescript
// 使用 ASCII (31) 回车符 (十六进制 x0d) 的示例
const pattern1 = /\x0d/;
const pattern2 = /\u000d/;
const pattern3 = new RegExp("\\x0d");
const pattern4 = new RegExp("\\u000d");
```

**有效示例：**

```typescript
// 使用 ASCII (32) 空格符 (十六进制 x20) 的示例
const pattern1 = /\x20/;
const pattern2 = /\u0020/;
const pattern3 = new RegExp("\\x20");
const pattern4 = new RegExp("\\u0020");
```
