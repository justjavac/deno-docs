---
tags: [recommended]
---

禁止在解构中使用空模式。

在解构中，可能会使用诸如 `{}` 或 `[]`
这样的空模式，这些模式没有任何效果，很可能不是作者的本意。

**无效示例：**

```typescript
// 在下面的示例中，{} 和 [] 不是对象字面量或空数组，
// 而是解构变量名的占位符
const {} = someObj;
const [] = someArray;
const {a: {}} = someObj;
const [a: []] = someArray;
function myFunc({}) {}
function myFunc([]) {}
```

**有效示例：**

```typescript
const { a } = someObj;
const [a] = someArray;

// 正确的方式是将解构变量默认设置为对象字面量
const { a = {} } = someObj;

// 正确的方式是将解构变量默认设置为空数组
const [a = []] = someArray;

function myFunc({ a }) {}
function myFunc({ a = {} }) {}
function myFunc([a]) {}
function myFunc([a = []]) {}
```
