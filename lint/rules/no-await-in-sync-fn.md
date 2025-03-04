---
tags: [recommended]
---

禁止在非异步函数中使用 `await` 关键字。

在非异步函数中使用 `await` 关键字会导致语法错误。为了能够在函数中使用
`await`，该函数需要通过 `async` 关键字标记为异步函数。

**无效示例：**

```javascript
function foo() {
  await bar();
}

const fooFn = function foo() {
  await bar();
};

const fooFn = () => {
  await bar();
};
```

**有效示例：**

```javascript
async function foo() {
  await bar();
}

const fooFn = async function foo() {
  await bar();
};

const fooFn = async () => {
  await bar();
};
```
