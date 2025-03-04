---
title: "运行脚本"
url: /examples/run_script_tutorial/
oldUrl:
  - /runtime/manual/examples/hello_world/
  - /runtime/tutorials/init_project/
  - /runtime/tutorials/hello_world/
---

Deno 是一个安全的 JavaScript 和 TypeScript 运行时。

运行时是代码执行的环境。它提供了程序运行所需的基础设施，处理诸如内存管理、I/O
操作以及与外部资源的交互等事务。运行时负责将高级代码（JavaScript 或
TypeScript）转换为计算机可以理解的机器指令。

当你在 Web 浏览器（如 Chrome、Firefox 或 Edge）中运行 JavaScript
时，你使用的是浏览器运行时。

浏览器运行时与浏览器本身紧密耦合。它们提供了用于操作文档对象模型（DOM）、处理事件、发起网络请求等的
API。这些运行时是沙盒化的，它们在浏览器的安全模型内运行。它们无法访问浏览器外部的资源，例如文件系统或环境变量。

当你使用 Deno 运行代码时，你是在浏览器上下文之外直接在机器上执行 JavaScript 或
TypeScript 代码。因此，Deno
程序可以访问主机上的资源，例如文件系统、环境变量和网络套接字。

Deno 为运行 JavaScript 和 TypeScript 代码提供了无缝的体验。无论你更喜欢
JavaScript 的动态特性还是 TypeScript 的类型安全性，Deno 都能满足你的需求。

## 运行脚本

在本教程中，我们将使用 Deno 创建一个简单的 "Hello World" 示例，分别用 JavaScript
和 TypeScript 编写。

我们将定义一个 `capitalize` 函数，用于将单词的首字母大写。然后，我们定义一个
`hello` 函数，返回带有大写名称的问候消息。最后，我们使用不同的名称调用 `hello`
函数，并将输出打印到控制台。

### JavaScript

首先，创建一个 `hello-world.js` 文件并添加以下代码：

```js title="hello-world.js"
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name) {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));
```

使用 `deno run` 命令运行脚本：

```sh
$ deno run hello-world.js
Hello John
Hello Sarah
Hello Kai
```

### TypeScript

这个 TypeScript 示例与上面的 JavaScript 示例完全相同，只是代码中包含了
TypeScript 支持的额外类型信息。

创建一个 `hello-world.ts` 文件并添加以下代码：

```ts title="hello-world.ts"
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name: string): string {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));
```

使用 `deno run` 命令运行 TypeScript 脚本：

```sh
$ deno run hello-world.ts
Hello John
Hello Sarah
Hello Kai
```

🦕 恭喜！现在你知道了如何用 JS 和 TS 创建一个简单的脚本，以及如何使用 `deno run`
命令在 Deno 中运行它。继续探索教程和示例，了解更多关于 Deno 的知识！
