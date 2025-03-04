---
tags: [recommended]
---

要求在 `switch` 的 `case` 或 `default`
子句中的词法声明（`let`、`const`、`function` 和
`class`）必须用大括号限定作用域。

如果在 `case` 或 `default` 块中没有使用大括号，词法声明将对整个 `switch`
块可见，但只有在它们被赋值时才会初始化，而这仅在到达该 `case`/`default`
时才会发生。这可能导致意外的错误。解决方案是确保每个 `case` 或 `default`
块都用大括号包裹，以限定声明的作用域。

**无效示例：**

```typescript
switch (choice) {
  // 这里的 `let`、`const`、`function` 和 `class` 的作用域是整个 `switch` 语句
  case 1:
    let a = "choice 1";
    break;
  case 2:
    const b = "choice 2";
    break;
  case 3:
    function f() {
      return "choice 3";
    }
    break;
  default:
    class C {}
}
```

**有效示例：**

```typescript
switch (choice) {
  // 以下 `case` 和 `default` 子句使用大括号包裹成块
  case 1: {
    let a = "choice 1";
    break;
  }
  case 2: {
    const b = "choice 2";
    break;
  }
  case 3: {
    function f() {
      return "choice 3";
    }
    break;
  }
  default: {
    class C {}
  }
}
```
