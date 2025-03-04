---
tags: [recommended]
---

禁止重新分配异常参数。

通常没有充分的理由去重新分配异常参数。一旦重新分配，从该点开始的代码将不再引用错误。

**无效示例：**

```typescript
try {
  someFunc();
} catch (e) {
  e = true;
  // 无法再访问抛出的错误
}
```

**有效示例：**

```typescript
try {
  someFunc();
} catch (e) {
  const anotherVar = true;
}
```
