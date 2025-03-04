---
tags: []
---

要求所有函数都具有显式的返回类型。

显式返回类型有许多优点，包括更易于理解的代码和更好的类型安全性。从签名中可以清楚地看出函数的返回类型（如果有的话）。

**无效：**

```typescript
function someCalc() {
  return 2 * 2;
}
function anotherCalc() {
  return;
}
```

**有效：**

```typescript
function someCalc(): number {
  return 2 * 2;
}
function anotherCalc(): void {
  return;
}
```
