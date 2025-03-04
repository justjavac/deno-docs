---
title: "从 CommonJS 迁移到 ESM"
url: /examples/cjs_to_esm_tutorial/
oldUrl:
- /runtime/manual/node/cjs_to_esm
- /runtime/tutorials/cjs_to_esm/
---

如果你的 Node.js 项目使用 CommonJS 模块（例如使用
`require`），你需要将代码更新为使用
[ECMAScript 模块 (ESM)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
以在 Deno 中运行。本指南将帮助你更新代码以使用 ESM 语法。

## 模块导入与导出

Deno 仅支持 [ECMAScript 模块](/runtime/fundamentals/modules/)。如果你的 Node.js
代码使用
[`require`](https://nodejs.org/api/modules.html#modules-commonjs-modules)，你应该将其更新为使用
`import` 语句。如果你的内部代码使用 CommonJS 风格的导出，这些也需要更新。

一个典型的 CommonJS 风格项目可能如下所示：

```js title="add_numbers.js"
module.exports = function addNumbers(num1, num2) {
  return num1 + num2;
};
```

```js title="index.js"
const addNumbers = require("./add_numbers");
console.log(addNumbers(2, 2));
```

要将这些转换为
[ECMAScript 模块](/runtime/fundamentals/modules/)，我们需要做一些小的改动：

```js title="add_numbers.js"
export function addNumbers(num1, num2) {
  return num1 + num2;
}
```

```js title="index.js"
import { addNumbers } from "./add_numbers.js";
console.log(addNumbers(2, 2));
```

导出：

| CommonJS                             | ECMAScript 模块                    |
| ------------------------------------ | ---------------------------------- |
| `module.exports = function add() {}` | `export default function add() {}` |
| `exports.add = function add() {}`    | `export function add() {}`         |

导入：

| CommonJS                                   | ECMAScript 模块                          |
| ------------------------------------------ | ---------------------------------------- |
| `const add = require("./add_numbers");`    | `import add from "./add_numbers.js";`    |
| `const { add } = require("./add_numbers")` | `import { add } from "./add_numbers.js"` |

### 使用 VS Code 快速修复

如果你使用 VS Code，你可以使用其内置功能将 CommonJS 转换为 ES6 模块。右键点击
`require` 语句或灯泡图标，选择 `Quick Fix`，然后选择 `Convert to ES module`。

![Quick Fix](./images/quick-fix.png)

### CommonJS 与 ECMAScript 解析

两种模块系统之间的一个重要区别是，ECMAScript 解析需要完整的路径
**包括文件扩展名**。省略文件扩展名以及对 `index.js` 的特殊处理是 CommonJS
独有的特性。ECMAScript 解析的好处是它在浏览器、Deno 和其他运行时中的行为一致。

| CommonJS             | ECMAScript 模块               |
| -------------------- | ----------------------------- |
| `"./add_numbers"`    | `"./add_numbers.js"`          |
| `"./some/directory"` | `"./some/directory/index.js"` |

:::tip

Deno 可以通过运行 `deno lint --fix` 为你添加所有缺失的文件扩展名。Deno 的 linter
附带了一个 `no-sloppy-imports` 规则，当导入路径不包含文件扩展名时，会显示一个
linting 错误。

:::

🦕 现在你知道了如何从 CJS 迁移到 ESM，你可以利用 ESM
提供的现代特性，例如异步模块加载、与浏览器的互操作性、更好的可读性、标准化和未来兼容性。
