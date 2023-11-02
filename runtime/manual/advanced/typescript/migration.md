# 迁移至 JavaScript 和从 JavaScript 迁移

Deno 的一个优点是它对待 TypeScript 和 JavaScript 几乎一视同仁。这意味着从
JavaScript 迁移到 TypeScript 或甚至从 TypeScript 迁移到 JavaScript
都是您想要实现的事情。Deno 具有多个功能可助您实现这一目标。

## 类型检查 JavaScript

您可能希望确保某些 JavaScript
代码更具类型安全性，但又不想在代码的各处添加类型注释。Deno 支持使用 TypeScript
类型检查器来检查 JavaScript 代码的类型。您可以通过向文件添加检查 JavaScript
声明来标记任何个别文件：

```js
// @ts-check
```

这将导致类型检查器推断 JavaScript 代码的类型信息并生成任何问题作为诊断问题。

您可以通过提供启用了 check JS 选项的配置文件来为程序中的所有 JavaScript
文件打开此功能：

```json
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

并在命令行上设置 `--config` 选项。

## 在 JavaScript 中使用 JSDoc

如果您要对 JavaScript 进行类型检查，甚至将 JavaScript 导入 TypeScript，您可以在
JavaScript 中使用 JSDoc 来表达比代码本身可以推断的更多类型信息。Deno
支持此功能，无需任何额外配置，您只需按照支持的
[TypeScript JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
中的规范来注释代码。例如，要设置数组的类型：

```js
/** @type {string []} */
const a = [];
```

## 跳过类型检查

您可能正在尝试某些 TypeScript
代码，其中语法有效但并非完全类型安全。您始终可以通过传递 `--no-check`
来绕过整个程序的类型检查。

您还可以通过使用 no-check 声明来跳过整个文件的类型检查，包括启用了 check JS 的
JavaScript 文件：

```js
// @ts-nocheck
```

## 仅将 JS 文件重命名为 TS 文件

尽管在某些情况下这可能有效，但在 Deno
中具有一些严格的限制。这是因为默认情况下，Deno
在所谓的“严格模式”下运行类型检查。这意味着在非严格模式下未能捕获的许多不清楚或模棱两可的情况将导致生成诊断，并且在类型方面，JavaScript
无一例外都具有不清楚和模棱两可的特性。
