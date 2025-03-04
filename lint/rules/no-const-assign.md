---
tags: []
---

禁止修改声明为 `const` 的变量。

修改声明为 `const` 的变量将导致运行时错误。

**无效示例：**

```typescript
const a = 0;
a = 1;
a += 1;
a++;
++a;
```

**有效示例：**

```typescript
const a = 0;
const b = a + 1;

// `c` 在每次循环迭代时都超出作用域，允许重新赋值
for (const c in [1, 2, 3]) {}
```
