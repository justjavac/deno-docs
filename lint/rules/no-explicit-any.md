---
tags: [recommended]
---

禁止使用 `any` 类型。

使用 `any` 类型会禁用该变量周围的类型检查系统，违背了 TypeScript
提供类型安全代码的初衷。此外，使用 `any`
会降低代码的可读性，因为无法立即清楚引用的值是什么类型。最好明确所有类型。如果无法选择更具体的类型，可以使用
`unknown` 作为 `any` 的更类型安全的替代方案。

**无效示例：**

```typescript
const someNumber: any = "two";
function foo(): any {
  return undefined;
}
```

**有效示例：**

```typescript
const someNumber: string = "two";
function foo(): undefined {
  return undefined;
}
```
