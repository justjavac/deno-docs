---
tags: []
---

禁止使用顶层 await 表达式。

在通过 dnt 分发 CommonJS/UMD 时，不能使用顶层 await。

**无效：**

```typescript
await foo();
for await (item of items) {}
```

**有效：**

```typescript
async function foo() {
  await task();
}
async function foo() {
  for await (item of items) {}
}
```
