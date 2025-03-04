---
tags: [recommended]
---

禁止在条件语句中使用赋值运算符 `=`。

在条件语句中使用赋值运算符通常是误输入了相等运算符 `==`
的结果。如果确实需要在条件语句中进行赋值，可以通过将赋值操作放在括号中来允许此操作。

**无效示例：**

```typescript
let x;
if (x = 0) {
  let b = 1;
}
```

```typescript
function setHeight(someNode) {
  do {
    someNode.height = "100px";
  } while (someNode = someNode.parentNode);
}
```

**有效示例：**

```typescript
let x;
if (x === 0) {
  let b = 1;
}
```

```typescript
function setHeight(someNode) {
  do {
    someNode.height = "100px";
  } while ((someNode = someNode.parentNode));
}
```
