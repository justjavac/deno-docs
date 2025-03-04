---
tags: [recommended]
---

禁止覆盖/重新分配现有函数。

Javascript
允许重新分配函数定义。这通常是开发人员的错误，或者是糟糕的编码实践，因为代码的可读性和可维护性会受到影响。

**无效示例：**

```typescript
function foo() {}
foo = bar;

const a = function baz() {
  baz = "now I'm a string";
};

myFunc = existingFunc;
function myFunc() {}
```

**有效示例：**

```typescript
function foo() {}
const someVar = foo;

const a = function baz() {
  const someStr = "now I'm a string";
};

const anotherFuncRef = existingFunc;

let myFuncVar = function () {};
myFuncVar = bar; // 变量重新分配，不是函数重新声明
```
