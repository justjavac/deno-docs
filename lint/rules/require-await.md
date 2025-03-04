---
tags: [recommended]
---

禁止没有 await 表达式或 await using 声明的异步函数。

一般来说，使用异步函数的主要原因是为了在内部使用 await 表达式或 await using
声明。如果一个异步函数两者都没有，那很可能是无意的错误。

**无效：**

```typescript
async function f1() {
  doSomething();
}

const f2 = async () => {
  doSomething();
};

const f3 = async () => doSomething();

const obj = {
  async method() {
    doSomething();
  },
};

class MyClass {
  async method() {
    doSomething();
  }
}
```

**有效：**

```typescript
await asyncFunction();

function normalFunction() {
  doSomething();
}

async function f1() {
  await asyncFunction();
}

const f2 = async () => {
  await asyncFunction();
};

const f3 = async () => await asyncFunction();

async function f4() {
  for await (const num of asyncIterable) {
    console.log(num);
  }
}

async function f5() {
  using = createResource();
}

// 空函数是有效的
async function emptyFunction() {}
const emptyArrowFunction = async () => {};

// 生成器也是有效的
async function* gen() {
  console.log(42);
}
```
