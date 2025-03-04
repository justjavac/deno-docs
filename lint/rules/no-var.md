---
tags: [recommended]
---

强制使用块作用域变量，而不是更容易出错的功能作用域变量。块作用域变量使用 `const`
和 `let` 关键字定义。

`const` 和 `let`
关键字确保使用这些关键字定义的变量在其块作用域之外不可访问。另一方面，使用 `var`
关键字定义的变量仅受其功能作用域的限制。

**无效：**

```typescript
var foo = "bar";
```

**有效：**

```typescript
const foo = 1;
let bar = 2;
```
