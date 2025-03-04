---
tags: []
---

禁止使用 `!` 后缀运算符进行非空断言。

TypeScript 的 `!` 非空断言运算符向类型系统断言某个表达式是非空的，即不是 `null`
或
`undefined`。使用断言来向类型系统传递新信息通常表明代码并不完全类型安全。通常更好的做法是构建程序逻辑，使
TypeScript 能够理解值何时可能为空。

**无效示例：**

```typescript
interface Example {
  property?: string;
}
declare const example: Example;

const includes = example.property!.includes("foo");
```

**有效示例：**

```typescript
interface Example {
  property?: string;
}
declare const example: Example;

const includes = example.property?.includes("foo") ?? false;
```
