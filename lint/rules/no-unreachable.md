---
tags: [recommended]
---

禁止在控制流语句后出现无法到达的代码。

由于控制流语句（`return`、`throw`、`break` 和
`continue`）会无条件退出代码块，因此它们之后的任何语句都无法执行。

**无效示例：**

```typescript
function foo() {
  return true;
  console.log("done");
}
```

```typescript
function bar() {
  throw new Error("Oops!");
  console.log("done");
}
```

```typescript
while (value) {
  break;
  console.log("done");
}
```

```typescript
throw new Error("Oops!");
console.log("done");
```

```typescript
function baz() {
  if (Math.random() < 0.5) {
    return;
  } else {
    throw new Error();
  }
  console.log("done");
}
```

```typescript
for (;;) {}
console.log("done");
```

**有效示例：**

```typescript
function foo() {
  return bar();
  function bar() {
    return 1;
  }
}
```
