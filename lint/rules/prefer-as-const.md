---
tags: [recommended]
---

建议使用 const 断言（`as const`）而不是显式指定字面量类型或使用类型断言。

在声明一个原始字面量类型的新变量时，有三种方式：

1. 添加显式类型注解
2. 使用普通类型断言（如 `as "foo"` 或 `<"foo">`）
3. 使用 const 断言（`as const`）

此 lint 规则建议使用 const 断言，因为它通常会使代码更安全。有关 const
断言的更多详细信息，请参阅
[官方手册](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)。

**无效：**

```typescript
let a: 2 = 2; // 类型注解
let b = 2 as 2; // 类型断言
let c = <2> 2; // 类型断言
let d = { foo: 1 as 1 }; // 类型断言
```

**有效：**

```typescript
let a = 2 as const;
let b = 2 as const;
let c = 2 as const;
let d = { foo: 1 as const };

let x = 2;
let y: string = "hello";
let z: number = someVariable;
```
