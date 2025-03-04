---
tags: [recommended]
---

强制所有变量至少被使用一次。

如果有变量被声明但未在任何地方使用，很可能是因为重构不完整。此 lint
规则会检测并警告此类未使用的变量。

如果满足以下任一条件，则变量 `a` 被视为“已使用”：

- 其值被读取，例如 `console.log(a)` 或 `let otherVariable = a;`
- 它被调用或构造，例如 `a()` 或 `new a()`
- 它被导出，例如 `export const a = 42;`

如果变量仅被赋值但从未被读取，则被视为“未使用”。

```typescript
let a;
a = 42;

// `a` 从未被读取
```

如果你想有意声明未使用的变量，请在它们前面加上下划线字符 `_`，例如
`_a`。此规则会忽略以 `_` 为前缀的变量。

**无效：**

```typescript
const a = 0;

const b = 0; // 这个 `b` 从未被使用
function foo() {
  const b = 1; // 这个 `b` 被使用了
  console.log(b);
}
foo();

let c = 2;
c = 3;

// 递归函数调用不被视为已使用，因为只有当 `d` 从函数体外被调用时，我们才能说 `d` 实际上被调用了。
function d() {
  d();
}

// `x` 从未被使用
export function e(x: number): number {
  return 42;
}

const f = "unused variable";
```

**有效：**

```typescript
const a = 0;
console.log(a);

const b = 0;
function foo() {
  const b = 1;
  console.log(b);
}
foo();
console.log(b);

let c = 2;
c = 3;
console.log(c);

function d() {
  d();
}
d();

export function e(x: number): number {
  return x + 42;
}

export const f = "exported variable";
```
