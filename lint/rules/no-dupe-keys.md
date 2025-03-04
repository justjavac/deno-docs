---
tags: [recommended]
---

禁止在对象字面量中使用重复的键。

在对象字面量中多次设置相同的键会覆盖对该键的其他赋值，并可能导致意外行为。

**无效示例：**

```typescript
const foo = {
  bar: "baz",
  bar: "qux",
};
```

```typescript
const foo = {
  "bar": "baz",
  bar: "qux",
};
```

```typescript
const foo = {
  0x1: "baz",
  1: "qux",
};
```

**有效示例：**

```typescript
const foo = {
  bar: "baz",
  quxx: "qux",
};
```
