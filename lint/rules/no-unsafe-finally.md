---
tags: [recommended]
---

禁止在 `finally` 块中使用控制流语句。

使用控制流语句（`return`、`throw`、`break` 和 `continue`）会覆盖可能在 `try` 或
`catch` 块中使用的任何控制流语句，这通常不是期望的行为。

**无效示例：**

```typescript
let foo = function () {
  try {
    return 1;
  } catch (err) {
    return 2;
  } finally {
    return 3;
  }
};
```

```typescript
let foo = function () {
  try {
    return 1;
  } catch (err) {
    return 2;
  } finally {
    throw new Error();
  }
};
```

**有效示例：**

```typescript
let foo = function () {
  try {
    return 1;
  } catch (err) {
    return 2;
  } finally {
    console.log("hola!");
  }
};
```
