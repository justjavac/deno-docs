---
tags: [recommended]
---

限制 `typeof` 操作符的使用，使其仅能与一组特定的字符串字面量进行比较。

当 `typeof` 操作符与一个值一起使用时，它会返回以下字符串之一：

- `"undefined"`
- `"object"`
- `"boolean"`
- `"number"`
- `"string"`
- `"function"`
- `"symbol"`
- `"bigint"`

该规则禁止在使用 `typeof`
操作符时与这些字符串字面量之外的任何内容进行比较，因为这可能表示字符串中的拼写错误。该规则还禁止将
`typeof` 操作的结果与任何非字符串字面量值进行比较，例如
`undefined`，这可能表示无意中使用了关键字而不是字符串。这包括与字符串变量进行比较，即使它们包含上述值之一，因为这无法得到保证。唯一的例外是比较两个
`typeof` 操作的结果，因为它们都保证会返回上述字符串之一。

**无效：**

```typescript
// 拼写错误
typeof foo === "strnig";
typeof foo == "undefimed";
typeof bar != "nunber";
typeof bar !== "fucntion";

// 与非字符串字面量进行比较
typeof foo === undefined;
typeof bar == Object;
typeof baz === anotherVariable;
typeof foo == 5;
```

**有效：**

```typescript
typeof foo === "undefined";
typeof bar == "object";
typeof baz === "string";
typeof bar === typeof qux;
```
