---
tags: [recommended]
---

禁止将否定运算符 `!` 作为关系运算符的左操作数使用。

在以下运算符的左操作数中出现 `!`
运算符时，由于运算符优先级的原因，有时会导致意外行为：

- `in` 运算符
- `instanceof` 运算符

例如，当开发者编写类似 `!key in someObject` 的代码时，他们很可能希望它的行为与
`!(key in someObject)` 相同，但实际上它的行为类似于 `(!key) in someObject`。此
lint 规则会警告此类 `!` 运算符的使用，以减少混淆。

**无效示例：**

<!-- deno-fmt-ignore -->

```typescript
if (!key in object) {}
if (!foo instanceof Foo) {}
```

**有效示例：**

```typescript
if (!(key in object)) {}
if (!(foo instanceof Foo)) {}
if ((!key) in object) {}
if ((!foo) instanceof Foo) {}
```
