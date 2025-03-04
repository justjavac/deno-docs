---
tags: [recommended]
---

禁止将变量赋值为 `this`。

在大多数情况下，通过正确使用箭头函数可以避免将 `this`
的引用存储在变量中，因为箭头函数会根据定义它的作用域来绑定 `this`。

让我们来看一个具体的例子：

```typescript
const obj = {
  count: 0,
  doSomethingLater() {
    setTimeout(function () { // 此函数在全局作用域中执行；`this` 被解析为 `globalThis`
      this.count++;
      console.log(this.count);
    }, 300);
  },
};

obj.doSomethingLater();
// 打印 `NaN`，因为属性 `count` 不在全局作用域中。
```

在上面的例子中，传递给 `setTimeout` 的函数中的 `this` 被解析为
`globalThis`，导致预期的值 `1` 没有被打印出来。

如果你想在不使用箭头函数的情况下解决这个问题，可以将 `this`
的引用存储在另一个变量中：

```typescript
const obj = {
  count: 0,
  doSomethingLater() {
    const self = this; // 将 `this` 的引用存储在 `self` 中
    setTimeout(function () {
      // 使用 `self` 而不是 `this`
      self.count++;
      console.log(self.count);
    }, 300);
  },
};

obj.doSomethingLater();
// 如期打印 `1`
```

但在这种情况下，箭头函数就派上用场了。使用箭头函数，代码变得更加清晰易懂：

```typescript
const obj = {
  count: 0,
  doSomethingLater() {
    setTimeout(() => { // 传递一个箭头函数
      // `this` 在这里被解析为 `obj`
      this.count++;
      console.log(this.count);
    }, 300);
  },
};

obj.doSomethingLater();
// 如期打印 `1`
```

此示例取自
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。

**无效：**

```typescript
const self = this;

function foo() {
  const self = this;
}

const bar = () => {
  const self = this;
};
```

**有效：**

```typescript
const self = "this";

const [foo] = this;
```
