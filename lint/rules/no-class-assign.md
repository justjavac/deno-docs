---
tags: [recommended]
---

禁止修改类声明中的变量。

声明一个类，例如 `class A {}`，会创建一个变量
`A`。与任何变量一样，这可以被修改或重新赋值。在大多数情况下，这是一个错误，并非本意。

**无效示例：**

```typescript
class A {}
A = 0; // 重新赋值类变量本身
```

**有效示例：**

```typescript
class A {}
let c = new A();
c = 0; // 重新赋值变量 `c`
```
