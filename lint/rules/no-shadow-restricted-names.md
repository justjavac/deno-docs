---
tags: [recommended]
---

禁止对受限名称进行遮蔽。

以下 (a) 全局对象的属性，或 (b) 标识符是 JavaScript 中的“受限”名称：

- [`NaN`]
- [`Infinity`]
- [`undefined`]
- [`eval`]
- [`arguments`]

这些名称在 JavaScript 中 _不是_
保留的，这意味着没有什么可以阻止你将其他值赋给它们（即遮蔽）。换句话说，你可以使用
`undefined` 作为标识符或变量名。（更多详情请参见 [MDN]）

[`NaN`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN
[`Infinity`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity
[`undefined`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined
[`eval`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
[`arguments`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments
[MDN]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined#description

```typescript
function foo() {
  const undefined = "bar";
  console.log(undefined); // 输出: "bar"
}
```

当然，像这样的遮蔽很可能会让其他开发者感到困惑，应该避免。此 lint
规则会检测并警告它们。

**无效：**

```typescript
const undefined = 42;

function NaN() {}

function foo(Infinity) {}

const arguments = () => {};

try {
} catch (eval) {}
```

**有效：**

```typescript
// 如果没有赋值，`undefined` 可能会被遮蔽
const undefined;

const Object = 42;

function foo(a: number, b: string) {}

try {
} catch (e) {}
```
