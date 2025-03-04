---
tags: [recommended]
---

禁止不必要非空断言。

非空断言使用 `!` 来告诉编译器你知道这个值不是
null。在一行中多次使用此操作符，或与可选链操作符（`?`）结合使用，会让人感到困惑且没有必要。

**无效示例：**

```typescript
const foo: { str: string } | null = null;
const bar = foo!!.str;

function myFunc(bar: undefined | string) {
  return bar!!;
}
function anotherFunc(bar?: { str: string }) {
  return bar!?.str;
}
```

**有效示例：**

```typescript
const foo: { str: string } | null = null;
const bar = foo!.str;

function myFunc(bar: undefined | string) {
  return bar!;
}
function anotherFunc(bar?: { str: string }) {
  return bar?.str;
}
```
