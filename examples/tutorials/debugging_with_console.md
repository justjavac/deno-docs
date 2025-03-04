---
title: "使用 console API 进行更好的调试"
url: /examples/debugging_with_console_tutorial/
---

对于 Web 开发者来说，console API 的一部分可能已经成为肌肉记忆，但除了
`console.log()` 之外，还有更多功能可供使用。Deno 对这个 API
提供了很好的支持，因此无论你是为浏览器还是服务器编写
JavaScript，都值得学习这些有用的工具。

让我们来看看这个 API 中一些最有用的方法。你的调试工作将会变得更加轻松！

## `console.log()`

你好，老朋友！你可能会使用它来将日志消息输出到控制台，以帮助你进行调试。

```js
console.log("Hello, world!"); // "Hello, world!"
```

你可以通过逗号分隔输出多个项目，如下所示：

```jsx
const person = {"name": "Jane", "city": "New York"}
console.log("Hello, " person.name, "from ", person.city); // "Hello, Jane from New York"
```

或者你可以使用字符串模板：

```jsx
const person = { "name": "Jane", "city": "New York" };
console.log(`Hello ${person.name} from ${person.city}`); // "Hello, Jane from New York"
```

你还可以使用 `%c` 指令[应用一些 CSS 样式](/examples/color_logging/)：

```jsx
console.log("Wild %cblue", "color: blue", "yonder"); // 将单词 "blue" 的文本颜色设置为蓝色
```

……但 console API 的功能远不止这些。

## `console.table()`

`table` 方法有助于输出结构化数据（如对象），以便更容易检查。

```jsx
const people = {
  "john": {
    "age": 30,
    "city": "New York",
  },
  "jane": {
    "age": 25,
    "city": "Los Angeles",
  },
};

console.table(people);

/*
┌───────┬─────┬───────────────┐
│ (idx) │ age │ city          │
├───────┼─────┼───────────────┤
│ john  │ 30  │ "New York"    │
│ jane  │ 25  │ "Los Angeles" │
└───────┴─────┴───────────────┘
*/
```

你还可以指定要在表格中包含的对象属性。这对于检查这些详细对象的摘要以查看你关心的部分非常有用。

```jsx
console.table(people, ["city"]);

/* 输出
┌───────┬───────────────┐
│ (idx) │ city          │
├───────┼───────────────┤
│ john  │ "New York"    │
│ jane  │ "Los Angeles" │
└───────┴───────────────┘
*/
```

## 计时器方法

了解应用程序的特定部分需要多长时间是消除性能瓶颈和昂贵操作的关键。如果你曾经使用
JavaScript
的日期方法为自己制作计时器，你会希望自己早就知道这个方法。它更方便，也更准确。

尝试使用
[`console.time()`](https://developer.mozilla.org/zh-CN/docs/Web/API/console/time_static)、[`console.timeLog()`](https://developer.mozilla.org/zh-CN/docs/Web/API/console/timeLog_static)
和
[`console.timeEnd()`](https://developer.mozilla.org/zh-CN/docs/Web/API/console/timeEnd_static)
来代替。

```jsx
console.time("My timer"); // 启动一个标签为 "My timer" 的计时器
// 做一些工作...
console.timeLog("My timer"); // 输出当前计时器的值，例如 "My timer: 9000ms"
// 做更多工作...
console.timeEnd("My timer"); // 停止 "My timer" 并报告其值，例如 "My timer: 97338ms"
```

你可以创建多个计时器，每个计时器都有自己的标签。非常方便！

## 使用 `console.count()` 计数

记录代码中特定操作执行的次数可能会很有帮助。与其手动操作，你可以使用
[`console.count()`](https://developer.mozilla.org/zh-CN/docs/Web/API/console/count_static)，它可以根据你提供的标签为你维护多个计数器。

```jsx
// 增加默认计数器
console.count();
console.count();
console.count();

/*
"default: 1"
"default: 2"
"default: 3"
*/
```

这在函数内部并传入标签时非常方便，如下所示：

```jsx
function pat(animal) {
  console.count(animal);
  return `Patting the ${animal}`;
}

pat("cat");
pat("cat");
pat("dog");
pat("cat");

/*
"cat: 1"
"cat: 2"
"dog: 1"
"cat: 3"
*/
```

## 使用 `console.trace()` 深入探索

为了详细了解应用程序中发生的情况，你可以使用
[`console.trace()`](https://developer.mozilla.org/zh-CN/docs/Web/API/console/trace_static)
将堆栈跟踪输出到控制台：

```jsx
// main.js
function foo() {
  function bar() {
    console.trace();
  }
  bar();
}

foo();

/*
Trace
    at bar (file:///PATH_TO/main.js:3:13)
    at foo (file:///PATH_TO/main.js:5:3)
    at file:///PATH_TO/main.js:8:1
*/
```

还有更多值得探索的内容，但这些方便的方法可以提升你的 JavaScript
调试能力，它们已经准备好并等待你在浏览器或 Deno 应用程序中使用。

查看 API 参考文档中的 [console 支持](/api/web/~/Console) 以了解更多。
