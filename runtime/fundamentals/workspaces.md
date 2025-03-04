---
title: "工作区与单体仓库"
oldUrl: /runtime/manual/basics/workspaces
---

Deno 支持工作区，也称为“单体仓库”，它允许你同时管理多个相关且相互依赖的包。

“工作区”是包含 `deno.json` 或 `package.json` 配置文件的文件夹集合。根目录的
`deno.json` 文件定义了工作区：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"]
}
```

这将配置一个包含 `add` 和 `subtract` 成员的工作区，这些成员是预期包含
`deno.json(c)` 和/或 `package.json` 文件的目录。

:::info 命名

Deno 使用 `workspace` 而不是 npm 的 `workspaces`
来表示具有多个成员的单一工作区。

:::

## 示例

让我们扩展 `deno.json` 工作区示例并查看其功能。文件层次结构如下：

```sh
/
├── deno.json
├── main.ts
├── add/
│     ├── deno.json
│     └── mod.ts
└── subtract/
      ├── deno.json
      └── mod.ts
```

有两个工作区成员（add 和 subtract），每个成员都有 `mod.ts`
文件。还有一个根目录的 `deno.json` 和 `main.ts`。

顶层的 `deno.json` 配置文件定义了工作区，并应用于所有成员的顶层导入映射：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5"
  }
}
```

根目录的 `main.ts` 文件使用导入映射中的 `chalk` 裸说明符，并从工作区成员导入
`add` 和 `subtract` 函数。请注意，它使用 `@scope/add` 和 `@scope/subtract`
导入它们，尽管这些不是正确的 URL 并且不在导入映射中。它们是如何解析的？

```ts title="main.ts"
import chalk from "chalk";
import { add } from "@scope/add";
import { subtract } from "@scope/subtract";

console.log("1 + 2 =", chalk.green(add(1, 2)));
console.log("2 - 4 =", chalk.red(subtract(2, 4)));
```

在 `add/` 子目录中，我们定义了一个带有 `"name"` 字段的
`deno.json`，这对于引用工作区成员很重要。`deno.json`
文件还包含示例配置，例如在使用 `deno fmt` 时关闭分号。

```json title="add/deno.json"
{
  "name": "@scope/add",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "fmt": {
    "semiColons": false
  }
}
```

```ts title="add/mod.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

`subtract/` 子目录类似，但没有相同的 `deno fmt` 配置。

```json title="subtract/deno.json"
{
  "name": "@scope/subtract",
  "version": "0.3.0",
  "exports": "./mod.ts"
}
```

```ts title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

让我们运行它：

```sh
> deno run main.ts
1 + 2 = 3
2 - 4 = -2
```

这里有很多内容，展示了 Deno 工作区的一些功能：

1. 这个单体仓库由两个包组成，分别放在 `./add` 和 `./subtract` 目录中。

1. 通过在成员的 `deno.json` 文件中使用 `name` 和 `version`
   选项，可以在整个工作区中使用“裸说明符”引用它们。在这种情况下，包被命名为
   `@scope/add` 和 `@scope/subtract`，其中 `scope`
   是你可以选择的“作用域”名称。有了这两个选项，就不需要在导入语句中使用长且相对的文件路径。

1. `npm:chalk@5` 包是整个工作区的共享依赖项。工作区成员“继承”工作区根目录的
   `imports`，允许在整个代码库中轻松管理单一版本的依赖项。

1. `add` 子目录在其 `deno.json` 中指定 `deno fmt`
   不应在格式化代码时应用分号。这使得现有项目的过渡更加顺畅，无需一次性更改数十或数百个文件。

---

Deno 工作区非常灵活，可以与 Node 包一起使用。为了使现有 Node.js
项目的迁移更容易，你可以在单个工作区中同时拥有 Deno-first 和 Node-first 的包。

## Deno 如何解析工作区依赖项

当在工作区中运行一个项目并从另一个工作区成员导入时，Deno
会按照以下步骤解析依赖项：

1. Deno 从执行项目的目录开始（例如，项目 A）
2. 它在父目录中查找根目录的 `deno.json` 文件
3. 如果找到，它会检查该文件中的 `workspace` 属性
4. 对于项目 A 中的每个导入语句，Deno 检查导入是否与任何工作区成员的 `deno.json`
   中定义的包名称匹配
5. 如果找到匹配的包名称，Deno 会验证包含的目录是否列在根工作区配置中
6. 然后使用工作区成员的 `deno.json` 中的 `exports` 字段将导入解析为正确的文件

例如，给定以下结构：

```sh
/
├── deno.json         # workspace: ["./project-a", "./project-b"]
├── project-a/
│   ├── deno.json     # name: "@scope/project-a"
│   └── mod.ts        # imports from "@scope/project-b"
└── project-b/
    ├── deno.json     # name: "@scope/project-b"
    └── mod.ts
```

当 `project-a/mod.ts` 从 `"@scope/project-b"` 导入时，Deno：

1. 看到导入语句
2. 检查父目录的 `deno.json`
3. 在工作区数组中找到 `project-b`
4. 验证 `project-b/deno.json` 是否存在并具有匹配的包名称
5. 使用 `project-b` 的导出解析导入

### 容器化的重要注意事项

当容器化依赖于其他工作区成员的工作区成员时，你必须包括：

1. 根目录的 `deno.json` 文件
2. 所有依赖的工作区包
3. 与开发环境相同的目录结构

例如，如果对上面的 `project-a` 进行 Docker 化，你的 Dockerfile 应该：

```dockerfile
COPY deno.json /app/deno.json
COPY project-a/ /app/project-a/
COPY project-b/ /app/project-b/
```

这将保留 Deno 用于查找和导入工作区依赖项的工作区解析机制。

### 多个包入口

到目前为止，我们的包只有一个入口。这对于简单的包来说没问题，但通常你会希望有多个入口来分组包的相关方面。这可以通过将
`object` 而不是 `string` 传递给 `exports` 来实现：

```json title="my-package/deno.json"
{
  "name": "@scope/my-package",
  "version": "0.3.0",
  "exports": {
    ".": "./mod.ts",
    "./foo": "./foo.ts",
    "./other": "./dir/other.ts"
  }
}
```

`"."` 入口是导入 `@scope/my-package` 时选择的默认入口。因此，上面的 `deno.json`
示例提供了以下入口：

- `@scope/my-package`
- `@scope/my-package/foo`
- `@scope/my-package/other`

### 从 `npm` 工作区迁移

Deno 工作区支持从现有的 npm 包中使用 Deno-first
的包。在这个示例中，我们混合了一个名为 `@deno/hi` 的 Deno 库和一个名为
`@deno/log` 的 Node.js 库，这是我们几年前开发的。

我们需要在根目录中包含一个 `deno.json` 配置文件：

```json title="deno.json"
{
  "workspace": {
    "members": ["hi"]
  }
}
```

与我们现有的 package.json 工作区一起：

```json title="package.json"
{
  "workspaces": ["log"]
}
```

工作区目前有一个 log npm 包：

```json title="log/package.json"
{
  "name": "@deno/log",
  "version": "0.5.0",
  "type": "module",
  "main": "index.js"
}
```

```js title="log/index.js"
export function log(output) {
  console.log(output);
}
```

让我们创建一个导入 `@deno/log` 的 `@deno/hi` Deno-first 包：

```json title="hi/deno.json"
{
  "name": "@deno/hi",
  "version": "0.2.0",
  "exports": "./mod.ts",
  "imports": {
    "log": "npm:@deno/log@^0.5"
  }
}
```

```ts title="hi/mod.ts"
import { log } from "log";

export function sayHiTo(name: string) {
  log(`Hi, ${name}!`);
}
```

现在，我们可以编写一个导入并调用 `hi` 的 `main.ts` 文件：

```ts title="main.ts"
import { sayHiTo } from "@deno/hi";

sayHiTo("friend");
```

```sh
$ deno run main.ts
Hi, friend!
```

你甚至可以在现有的 Node.js 包中同时拥有 `deno.json` 和
`package.json`。此外，你可以删除根目录的 package.json 并在 deno.json
工作区成员中指定 npm 包。这允许你逐步迁移到 Deno，而无需投入大量前期工作。

例如，你可以添加 `log/deno.json` 来配置 Deno 的 linter 和 formatter：

```jsonc
{
  "fmt": {
    "semiColons": false
  },
  "lint": {
    "rules": {
      "exclude": ["no-unused-vars"]
    }
  }
}
```

在工作区中运行 `deno fmt` 将格式化 `log` 包，使其不包含任何分号，而 `deno lint`
不会抱怨你在源文件中留下未使用的变量。

## 配置内置的 Deno 工具

某些配置选项仅在工作区的根目录有意义，例如在其中一个成员中指定 `nodeModulesDir`
选项不可用，如果需要在工作区根目录应用某个选项，Deno 会发出警告。

以下是工作区根目录及其成员可用的各种 `deno.json` 选项的完整矩阵：

| 选项               | 工作区 | 包 | 注释                                                                                                                                                                                                       |
| ------------------ | ------ | -- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| compilerOptions    | ✅     | ❌ | 目前我们只允许每个工作区使用一组 compilerOptions。这是因为需要对 deno_graph 和 TSC 集成进行多次更改才能允许多组。此外，我们还需要确定哪些 compilerOptions 适用于远程依赖项。我们可以在未来重新审视这一点。 |
| importMap          | ✅     | ❌ | 与每个配置文件中的 imports 和 scopes 互斥。此外，不支持在工作区配置中拥有 importMap，而在包配置中拥有 imports。                                                                                            |
| imports            | ✅     | ✅ | 与每个配置文件中的 importMap 互斥。                                                                                                                                                                        |
| scopes             | ✅     | ❌ | 与每个配置文件中的 importMap 互斥。                                                                                                                                                                        |
| exclude            | ✅     | ✅ |                                                                                                                                                                                                            |
| lint.include       | ✅     | ✅ |                                                                                                                                                                                                            |
| lint.exclude       | ✅     | ✅ |                                                                                                                                                                                                            |
| lint.files         | ⚠️     | ❌ | 已弃用                                                                                                                                                                                                     |
| lint.rules.tags    | ✅     | ✅ | 标签通过将包附加到工作区列表来合并。重复项被忽略。                                                                                                                                                         |
| lint.rules.include |        |    |                                                                                                                                                                                                            |
| lint.rules.exclude | ✅     | ✅ | 规则按包合并，包的优先级高于工作区（包的 include 比工作区的 exclude 更强）。                                                                                                                               |
| lint.report        | ✅     | ❌ | 一次只能激活一个报告器，因此允许每个工作区使用不同的报告器在跨多个包的文件 lint 时不起作用。                                                                                                               |
| fmt.include        | ✅     | ✅ |                                                                                                                                                                                                            |
| fmt.exclude        | ✅     | ✅ |                                                                                                                                                                                                            |
| fmt.files          | ⚠️     | ❌ | 已弃用                                                                                                                                                                                                     |
| fmt.useTabs        | ✅     | ✅ | 包的优先级高于工作区。                                                                                                                                                                                     |
| fmt.indentWidth    | ✅     | ✅ | 包的优先级高于工作区。                                                                                                                                                                                     |
| fmt.singleQuote    | ✅     | ✅ | 包的优先级高于工作区。                                                                                                                                                                                     |
| fmt.proseWrap      | ✅     | ✅ | 包的优先级高于工作区。                                                                                                                                                                                     |
| fmt.semiColons     | ✅     | ✅ | 包的优先级高于工作区。                                                                                                                                                                                     |
| fmt.options.\*     | ⚠️     | ❌ | 已弃用                                                                                                                                                                                                     |
| nodeModulesDir     | ✅     | ❌ | 整个工作区的解析行为必须相同。                                                                                                                                                                             |
| vendor             | ✅     | ❌ | 整个工作区的解析行为必须相同。                                                                                                                                                                             |
| tasks              | ✅     | ✅ | 包任务的优先级高于工作区。使用的 cwd 是任务所在配置文件的 cwd。                                                                                                                                            |
| test.include       | ✅     | ✅ |                                                                                                                                                                                                            |
| test.exclude       | ✅     | ✅ |                                                                                                                                                                                                            |
| test.files         | ⚠️     | ❌ | 已弃用                                                                                                                                                                                                     |
| publish.include    | ✅     | ✅ |                                                                                                                                                                                                            |
| publish.exclude    | ✅     | ✅ |                                                                                                                                                                                                            |
| bench.include      | ✅     | ✅ |                                                                                                                                                                                                            |
| bench.exclude      | ✅     | ✅ |                                                                                                                                                                                                            |
| bench.files        | ⚠️     | ❌ | 已弃用                                                                                                                                                                                                     |
| lock               | ✅     | ❌ | 每个解析器只能存在一个锁文件，每个工作区只能存在一个解析器，因此按包有条件地启用锁文件没有意义。                                                                                                           |
| unstable           | ✅     | ❌ | 为了简单起见，我们不允许不稳定标志，因为很多 CLI 假设不稳定标志是不可变的并且对整个进程是全局的。此外，与 DENO_UNSTABLE_\* 标志的奇怪交互。                                                                |
| name               | ❌     | ✅ |                                                                                                                                                                                                            |
| version            | ❌     | ✅ |                                                                                                                                                                                                            |
| exports            | ❌     | ✅ |                                                                                                                                                                                                            |
| workspace          | ✅     | ❌ | 不支持嵌套工作区。                                                                                                                                                                                         |
