# 从 Node.js 迁移到 Deno

将现有的 Node.js 程序迁移到 Deno 时，需要考虑 Node 和 Deno
运行时之间的许多差异。本指南将尝试指出其中的一些差异，并描述如何开始将你的
Node.js 项目迁移到 Deno 上运行。

::: info 关于 Node.js 兼容性

Node.js 兼容性是 Deno 中的一个持续项目 - 你可能会遇到一些在 npm
上不按照你期望的方式工作的模块或包。如果你在 Node.js 兼容性方面遇到问题，请通过
[GitHub 上开一个问题](https://github.com/denoland/deno/issues) 告诉我们。

:::

## 模块导入和导出

Deno 仅支持 [ECMAScript 模块](../basics/modules/index.md)，而不支持 Node
中发现的 ESM 和 [CommonJS](https://nodejs.org/api/modules.html) 的组合。如果你的
Node.js 代码使用 `require`，你应该将其更新为使用 `import`
语句。如果你的内部代码使用 CommonJS 风格的导出，那些也需要更改。

考虑一个位于同一目录中的 Node.js 程序中的以下两个文件：

```js title="index.js"
const addNumbers = require("./add_numbers");
console.log(addNumbers(2, 2));
```

```js title="add_numbers.js"
module.exports = function addNumbers(num1, num2) {
  return num1 + num2;
};
```

使用上述文件在 Node.js 20 及更早版本中运行 `node index.js`
是没有问题的。然而，如果你尝试使用 `deno run index.js`
运行此代码，它将无法正常运行。你需要同时更改消耗模块的代码以及从 `add_numbers`
模块导出功能的方式。

### 用 `import` 替换 `require`

用 `import` 语句替换 `require` 语句，如下所示：

```js
import addNumbers from "./add_numbers.js";
```

这个语句使用了 ES6
模块标准，但基本上做了相同的事情。此外，请注意，我们在导入模块时
**包括完整的文件扩展名**，就像在浏览器中一样。没有特殊处理命名为 `index.js`
的文件。

### 用 `export default` 替换 `module.exports`

在导出该函数的 `add_numbers.js` 文件中，我们应该使用 ES6 模块的默认导出，而不是
CommonJS 提供的 `module.exports`。

```js title="add_numbers.js"
export default function addNumbers(num1, num2) {
  return num1 + num2;
}
```

在进行这两个更改后，此代码将能够成功运行 `deno run index.js`。了解更多关于
[Deno 中的 ES 模块](../basics/modules/index.md)。

## Node.js 内置模块

在 Node.js 20 及更早版本中，Node.js 标准库中的内置模块可以使用 "bare specifiers"
导入。考虑下面具有 `.mjs` 扩展的 Node 程序：

```js title="index.mjs"
import * as os from "os";
console.log(os.cpus());
```

[`os` 模块](https://nodejs.org/api/os.html#oscpus) 内置在 Node.js
运行时中，可以像上面那样使用裸规范导入。

::: info 在 Deno 中不需要 `.mjs` 扩展

在 Deno 中支持 `.mjs` 文件扩展名，但不是必需的。因为 Node 默认不支持
ESM，它要求你为使用 ESM 的任何文件命名为 `.mjs` 文件扩展名。

:::

Deno 提供了一个兼容层，允许在 Deno 程序中使用 Node.js 内置
API。但是，为了使用它们，你需要在使用它们的导入语句中添加
[`node:` specifier](./node_specifiers.md)。

例如 - 如果你将上面的代码更新为以下内容：

```js
import * as os from "node:os";
console.log(os.cpus());
```

并使用 `deno run index.mjs` 运行它 - 你将注意到得到与在 Node.js
中运行程序相同的输出。将应用程序中的任何导入更改为使用 `node:` specifier
应该使使用 Node 内置功能的任何代码能够像在 Node.js 中一样运行。

## Deno 中的运行时权限

Deno 默认提供
[默认情况下的运行时安全性](../basics/permissions.md)，这意味着作为开发人员，你必须选择允许你的代码访问文件系统、网络、系统环境等。这样做可以防止供应链攻击和代码中的其他潜在漏洞。相比之下，Node.js
没有运行时安全性的概念，所有代码都以运行代码的用户拥有的权限级别执行。

### 仅使用必要的标志运行你的代码

当你首次将 Node.js 项目迁移到 Deno
运行时时，运行时可能会要求你授予执行代码所需的权限。考虑下面这个简单的
[express](https://expressjs.com/) 服务器：

```js
import express from "npm:express@4";

const app = express();

app.get("/", function (_req, res) {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Express listening on :3000");
});
```

如果你使用 `deno run server.js`
运行它，它将提示你授予执行代码及其依赖项所需的权限。这些提示可以显示需要传递的运行时权限标志，以授予所需的访问权限。以提供必要权限运行上述代码将如下所示：

```shell
deno run --allow-net --allow

-read --allow-env server.js
```

### 使用 `deno task` 重用运行时标志配置

配置一组运行时标志的常见模式是设置要使用 [`deno task`](../tools/task_runner.md)
运行的脚本。下面的 `deno.json` 文件有一个名为 `dev`
的任务，它将使用所有必要的标志运行上面的 express 服务器。

```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --allow-env server.js"
  }
}
```

然后你可以使用 `deno task dev` 运行该任务。

### 启用所有权限运行

在生产环境或敏感环境中不建议，但是可以在你的程序中启用所有运行时权限。这将是
Node 默认行为，它没有权限系统。要以启用所有权限运行程序，你可以使用以下命令：

```shell
deno run -A server.js
```

## 从 `package.json` 运行脚本

许多 Node.js 项目使用
[npm 脚本](https://docs.npmjs.com/cli/v9/using-npm/scripts) 来驱动本地开发。在
Deno 中，你可以继续使用现有的 npm 脚本，同时逐渐迁移到
[`deno task`](../tools/task_runner.md)。

### 在 Deno 中运行 npm 脚本

[Deno 支持现有的 `package.json` 文件](./package_json.md)
中配置的脚本的一种方式是使用 `deno task` 执行其中配置的任何脚本。考虑下面的
Node.js 项目，其中有一个包含在其中的 package.json 文件和一个配置了脚本的文件。

```js title="bin/my_task.mjs"
console.log("running my task...");
```

```json title="package.json"
{
  "name": "test",
  "scripts": {
    "start": "node bin/my_task.mjs"
  }
}
```

你可以使用 `deno task start` 运行这个脚本。

## 使用和管理 npm 依赖

Deno 支持通过 `package.json` 文件来
[管理 npm 依赖](./package_json.md)。请注意，与在命令行使用 npm
不同，你可以简单地使用 `deno run` 运行你的项目，而在首次运行你的脚本时，Deno
将缓存应用程序所需的所有依赖关系。

未来，我们建议你通过 [`deno.json`](../getting_started/configuration_file.md)
来管理依赖项，它还支持其他类型的导入。

在导入 npm 包时，你将使用 `npm:` specifier，就像你对任何内置 Node 模块使用
`node:` specifier 一样。

```js
import express from "npm:express@4";

const app = express();

app.get("/", function (_req, res) {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Express listening on :3000");
});
```

## Node.js 全局对象

在 Node.js 中，有许多 [全局对象](https://nodejs.org/api/globals.html)
可以在所有程序的范围内使用，比如 `process` 对象、`__dirname` 和 `__filename`。

Deno 不会将额外的对象和变量添加到全局作用域中，除了
[`Deno` 命名空间](../runtime/builtin_apis.md)。每个 Node.js 内置全局对象的等效
Deno 表达式都会有所不同，但应该可以使用 Deno 中的稍微不同的方法来完成在 Node
中可以完成的任何事情。例如，Node.js 中的
[process.cwd()](https://nodejs.org/api/process.html#processcwd) 函数在 Deno
中存在为 [Deno.cwd()](https://www.deno.com/api?s=Deno.cwd)。
