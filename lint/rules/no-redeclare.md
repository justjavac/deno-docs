---
tags: [recommended]
---

禁止使用相同名称重新声明变量、函数、参数。

JavaScript 允许我们使用 `var` 重新声明同名变量，但
不应使用重新声明，因为它会使变量难以追踪。

此外，此 lint 规则还禁止使用 `let` 或 `const` 进行重新声明， 尽管 ESLint
允许这样做。这很有用，因为我们可以在实际运行代码之前注意到语法错误。

对于函数和参数，JavaScript 只是将这些视为运行时错误， 在运行时抛出
`SyntaxError`。静态检测此类错误也很有益。

**无效示例：**

```typescript
var a = 3;
var a = 10;

let b = 3;
let b = 10;

const c = 3;
const c = 10;

function d() {}
function d() {}

function e(arg: number) {
  var arg: number;
}

function f(arg: number, arg: string) {}
```

**有效示例：**

```typescript
var a = 3;
function f() {
  var a = 10;
}

if (foo) {
  let b = 2;
} else {
  let b = 3;
}
```
