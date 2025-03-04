---
tags: []
---

要求 `await` 不在 for 循环体中使用。

在 Javascript 中，`async` 和 `await` 用于提供并行执行。如果在 for
循环中对每个元素使用 `await`，那么这将抵消使用 `async/await`
的好处，因为在当前元素完成之前，循环中的其他元素无法继续处理。

常见的解决方案是重构代码，使循环体异步运行并捕获生成的
promises。循环结束后，您可以一次性等待所有 promises。

**无效示例：**

```javascript
async function doSomething(items) {
  const results = [];
  for (const item of items) {
    // 数组中的每个元素都会阻塞，直到前一个元素完成
    results.push(await someAsyncProcessing(item));
  }
  return processResults(results);
}
```

**有效示例：**

```javascript
async function doSomething(items) {
  const results = [];
  for (const item of items) {
    // 异步启动所有元素处理...
    results.push(someAsyncProcessing(item));
  }
  // ...然后在循环结束后等待它们完成
  return processResults(await Promise.all(results));
}
```
