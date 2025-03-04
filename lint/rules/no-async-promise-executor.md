---
tags: [recommended]
---

要求不使用异步的 Promise 执行器函数。

Promise 构造函数接受一个执行器函数作为参数，该函数带有 `resolve` 和 `reject`
参数，可用于控制创建的 Promise
的状态。虽然允许此函数是异步的，但通常不建议这样做，原因如下：

- 如果异步执行器函数抛出错误，该错误将会丢失，并且不会导致新创建的 Promise
  被拒绝。这可能会使调试和处理某些错误变得困难。
- 如果异步的 Promise 执行器函数使用了
  `await`，那么这通常表明实际上没有必要使用新的 Promise
  构造函数，代码可以重构以避免使用 Promise，或者可以减少新 Promise
  构造函数的作用范围，提取异步代码并将其改为同步。

**无效：**

```typescript
new Promise(async function (resolve, reject) {});
new Promise(async (resolve, reject) => {});
```

**有效：**

```typescript
new Promise(function (resolve, reject) {});
new Promise((resolve, reject) => {});
```
