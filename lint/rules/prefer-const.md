---
tags: [recommended]
---

推荐使用 [`const`] 而不是 [`let`] 来声明变量。

自 ES2015 以来，JavaScript 支持使用 [`let`] 和 [`const`] 来声明变量。如果使用
[`let`]
声明变量，那么它们将是可变的；我们可以在之后为它们设置其他值。同时，如果使用
[`const`] 声明，它们将是不可变的；我们无法对它们进行重新赋值。

一般来说，为了使代码库更加健壮、可维护和可读，强烈建议尽可能使用 [`const`]
而不是 [`let`]。可变变量越少，阅读代码时跟踪变量状态就越容易，因此编写有 bug
的代码的可能性就越小。因此，此 lint 规则会检查是否存在可以改用 [`const`] 声明的
[`let`] 变量。

请注意，此规则不检查 [`var`] 变量。相反，[`no-var` 规则](/lint/rules/no-var)
负责检测并警告 [`var`] 变量。

[`let`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let
[`const`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const
[`var`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var

**无效：**

```typescript
let a = 0;

let b = 0;
someOperation(b);

// 可以改用 `const`
for (let c in someObject) {}

// 可以改用 `const`
for (let d of someArray) {}

// 不允许先未初始化然后在同一作用域内赋值的变量
// 因为我们可以直接写成 `const e = 2;`
let e;
e = 2;
```

**有效：**

```typescript
// 允许未初始化的变量
let a;

let b = 0;
b += 1;

let c = 0;
c = 1;

// 允许先未初始化然后在同一作用域内赋值两次或更多次的变量
// 因为我们无法用 `const` 表示它
let d;
d = 2;
d = 3;

const e = 0;

// `f` 通过 `f++` 进行修改
for (let f = 0; f < someArray.length; f++) {}

// 允许在另一个作用域内初始化（或赋值）的变量
let g;
function func1() {
  g = 42;
}

// 允许有条件初始化的变量
let h;
if (trueOrFalse) {
  h = 0;
}
```
