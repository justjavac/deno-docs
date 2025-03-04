---
tags: [recommended]
---

禁止使用原始包装对象（例如 `String` 对象是 `string`
原始类型的包装器），以及非显式的 `Function` 类型和被误解的 `Object` 类型。

很少有情况下需要使用原始包装对象，更多时候是原始类型的误用。你也不能将原始包装对象赋值给原始类型，这会导致后续的类型问题。作为参考，[TypeScript 手册]
也指出我们不应该使用这些包装对象。

[TypeScript 手册]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#number-string-boolean-symbol-and-object

对于 `Function`，最好显式定义整个函数签名，而不是使用非特定的 `Function`
类型，后者无法提供函数类型的安全性。

最后，`Object` 和 `{}` 表示“任何非空值”，而不是“任何对象类型”。`object`
是表示“任何对象类型”的良好选择。

**无效：**

```typescript
let a: Boolean;
let b: String;
let c: Number;
let d: Symbol;
let e: Function;
let f: Object;
let g: {};
```

**有效：**

```typescript
let a: boolean;
let b: string;
let c: number;
let d: symbol;
let e: () => number;
let f: object;
let g: Record<string, never>;
```
