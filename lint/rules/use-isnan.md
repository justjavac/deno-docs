---
tags: [recommended]
---

禁止与 `NaN` 进行比较。

由于 `NaN` 在 JavaScript 中是独一无二的，它不等于任何值，包括它自己，因此与
`NaN` 进行比较的结果会令人困惑：

- `NaN === NaN` 或 `NaN == NaN` 的值为 `false`
- `NaN !== NaN` 或 `NaN != NaN` 的值为 `true`

因此，该规则要求你使用 `isNaN()` 或 `Number.isNaN()` 来判断某个值是否为 `NaN`。

**无效示例：**

```typescript
if (foo == NaN) {
  // ...
}

if (foo != NaN) {
  // ...
}

switch (NaN) {
  case foo:
    // ...
}

switch (foo) {
  case NaN:
    // ...
}
```

**有效示例：**

```typescript
if (isNaN(foo)) {
  // ...
}

if (!isNaN(foo)) {
  // ...
}
```
