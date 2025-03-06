```json
{
  "title": "模块与依赖",
  "oldUrl": [
    "/runtime/manual/basics/modules/",
    "/runtime/manual/basics/modules/integrity_checking/",
    "/runtime/manual/basics/modules/module_metadata/",
    "/runtime/manual/basics/modules/publishing_modules/",
    "/runtime/manual/basics/modules/reloading_modules/",
    "/runtime/manual/basics/vendoring/",
    "/runtime/manual/advanced/http_imports/",
    "/runtime/manual/advanced/publishing/dnt/",
    "/runtime/manual/advanced/publishing/",
    "/runtime/manual/examples/manage_dependencies",
    "/runtime/manual/node/cdns.md",
    "/runtime/manual/linking_to_external_code",
    "/runtime/manual/linking_to_external_code/reloading_modules",
    "/runtime/fundamentals/esm.sh",
    "/runtime/manual/basics/import_maps/",
    "/runtime/manual/advanced/private_repositories/",
    "/runtime/reference/private_repositories/"
  ]
}
```

Deno 使用
[ECMAScript 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
作为其默认模块系统，以与现代 JavaScript
标准保持一致，并促进更高效和一致的开发体验。它是 JavaScript
模块的官方标准，允许更好的树摇优化、改进的工具集成以及跨不同环境的原生支持。

通过采用 ECMAScript 模块，Deno 确保了与不断发展的 JavaScript
生态系统的兼容性。对于开发者来说，这意味着一个简化且可预测的模块系统，避免了与
CommonJS 等传统模块格式相关的复杂性。

## 导入模块

在这个例子中，`add` 函数从本地的 `calc.ts` 模块中导入。

```ts title="calc.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

```ts title="main.ts"
// 从当前文件旁边的 `calc.ts` 模块导入
import { add } from "./calc.ts";

console.log(add(1, 2)); // 3
```

你可以在包含 `main.ts` 和 `calc.ts` 的目录中通过调用 `deno run main.ts`
来运行这个例子。

使用 ECMAScript 模块时，本地导入说明符必须始终包含完整的文件扩展名，不能省略。

```ts title="example.ts"
// 错误：缺少文件扩展名
import { add } from "./calc";

// 正确：包含文件扩展名
import { add } from "./calc.ts";
```

## 导入第三方模块和库

在 Deno 中使用第三方模块时，使用与本地代码相同的 `import`
语法。第三方模块通常从远程注册表导入，并以 `jsr:`、`npm:` 或 `https://` 开头。

```ts title="main.ts"
import { camelCase } from "jsr:@luca/cases@1.0.0";
import { say } from "npm:cowsay@1.6.0";
import { pascalCase } from "https://deno.land/x/case/mod.ts";
```

Deno 推荐使用 [JSR](https://jsr.io)，这是一个现代的 JavaScript
注册表，用于第三方模块。在那里，你可以找到许多为你的项目准备的、文档齐全的 ES
模块，包括 [Deno 标准库](/runtime/fundamentals/standard_library/)。

你可以
[在这里阅读更多关于 Deno 对 npm 包的支持](/runtime/fundamentals/node/#using-npm-modules)。

## 管理第三方模块和库

在多个文件中导入模块时，完整版本说明符的输入可能会变得繁琐。你可以通过在
`deno.json` 文件中的 `imports` 字段集中管理远程模块。我们称这个 `imports` 字段为
**导入映射**，它基于 [导入映射标准]。

[导入映射标准]: https://github.com/WICG/import-maps

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0",
    "cowsay": "npm:cowsay@^1.6.0",
    "cases": "https://deno.land/x/case/mod.ts"
  }
}
```

使用重新映射的说明符后，代码看起来更简洁：

```ts title="main.ts"
import { camelCase } from "@luca/cases";
import { say } from "cowsay";
import { pascalCase } from "cases";
```

重新映射的名称可以是任何有效的说明符。这是 Deno
中一个非常强大的功能，可以重新映射任何内容。了解更多关于导入映射的功能
[在这里](/runtime/fundamentals/configuration/#dependencies)。

## 区分 `deno.json` 中的 `imports` 或 `importMap` 与 `--import-map` 选项

[导入映射标准] 要求每个模块有两个条目：一个用于模块说明符，另一个用于带有尾部
`/` 的说明符。这是因为该标准只允许每个模块说明符有一个条目，而尾部 `/`
表示该说明符引用的是一个目录。例如，当使用 `--import-map import_map.json`
选项时，`import_map.json` 文件必须包含每个模块的两个条目（注意使用
`jsr:/@std/async` 而不是 `jsr:@std/async`）：

```json title="import_map.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0",
    "@std/async/": "jsr:/@std/async@^1.0.0/"
  }
}
```

在 `deno.json` 中通过 `importMap` 字段引用的 `import_map.json` 文件的行为与使用
`--import-map` 选项完全相同，并且需要包含每个模块的两个条目，如上所示。

相比之下，`deno.json` 扩展了导入映射标准。当你在 `deno.json` 中使用 `imports`
字段时，你只需要指定模块说明符，而不需要尾部 `/`：

```json title="deno.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0"
  }
}
```

## 使用 `deno add` 添加依赖项

通过 `deno add`
子命令，安装过程变得非常简单。它会自动将你请求的包的最新版本添加到 `deno.json`
的 `imports` 部分。

```sh
# 将模块的最新版本添加到 deno.json
$ deno add jsr:@luca/cases
Add @luca/cases - jsr:@luca/cases@1.0.0
```

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0"
  }
}
```

你也可以指定一个确切的版本：

```sh
# 传递一个确切的版本
$ deno add jsr:@luca/cases@1.0.0
Add @luca/cases - jsr:@luca/cases@1.0.0
```

阅读更多在 [`deno add` 参考](/runtime/reference/cli/add/)。

你也可以使用 `deno remove` 移除依赖项：

```sh
$ deno remove @luca/cases
Remove @luca/cases
```

```json title="deno.json"
{
  "imports": {}
}
```

阅读更多在 [`deno remove` 参考](/runtime/reference/cli/remove/)。

## 包版本

你可以为你导入的包指定一个版本范围。这是通过 `@`
符号后跟一个版本范围说明符来完成的，并遵循 [semver](https://semver.org/)
版本控制方案。

例如：

```bash
@scopename/mypackage           # 最高版本
@scopename/mypackage@16.1.0    # 确切版本
@scopename/mypackage@16        # 最高 16.x 版本 >= 16.0.0
@scopename/mypackage@^16.1.0   # 最高 16.x 版本 >= 16.1.0
@scopename/mypackage@~16.1.0   # 最高 16.1.x 版本 >= 16.1.0
```

以下是所有可以指定版本或范围的方式的概述：

| 符号      | 描述                                                                                                          | 示例      |
| --------- | ------------------------------------------------------------------------------------------------------------- | --------- |
| `1.2.3`   | 一个确切的版本。只会使用这个特定的版本。                                                                      | `1.2.3`   |
| `^1.2.3`  | 与版本 1.2.3 兼容。允许不改变最左侧非零数字的更新。<br>例如，`1.2.4` 和 `1.3.0` 是允许的，但 `2.0.0` 不允许。 | `^1.2.3`  |
| `~1.2.3`  | 大约等同于版本 1.2.3。允许更新补丁版本。<br>例如，`1.2.4` 是允许的，但 `1.3.0` 不允许。                       | `~1.2.3`  |
| `>=1.2.3` | 大于或等于版本 1.2.3。允许任何 `1.2.3` 或更高的版本。                                                         | `>=1.2.3` |
| `<=1.2.3` | 小于或等于版本 1.2.3。允许任何 `1.2.3` 或更低的版本。                                                         | `<=1.2.3` |
| `>1.2.3`  | 大于版本 1.2.3。只允许高于 `1.2.3` 的版本。                                                                   | `>1.2.3`  |
| `<1.2.3`  | 小于版本 1.2.3。只允许低于 `1.2.3` 的版本。                                                                   | `<1.2.3`  |
| `1.2.x`   | 任何在次要版本 1.2 内的补丁版本。例如，`1.2.0`，`1.2.1` 等。                                                  | `1.2.x`   |
| `1.x`     | 任何在主版本 1 内的次要和补丁版本。例如，`1.0.0`，`1.1.0`，`1.2.0` 等。                                       | `1.x`     |
| `*`       | 允许任何版本。                                                                                                | `*`       |

## HTTPS 导入

Deno 还支持引用 HTTP/HTTPS URL 的导入语句，可以直接使用：

```js
import { Application } from "https://deno.land/x/oak/mod.ts";
```

或者作为 `deno.json` 导入映射的一部分：

```json
{
  "imports": {
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

支持 HTTPS 导入使我们能够支持以下 JavaScript CDN，因为它们提供了对 JavaScript
模块的 URL 访问：

- [deno.land/x](https://deno.land/x)
- [esm.sh](https://esm.sh)
- [unpkg.com](https://unpkg.com)

HTTPS 导入在你有小型、通常是单文件的 Deno
项目时非常有用，这些项目不需要任何其他配置。使用 HTTPS 导入，你可以完全避免使用
`deno.json`
文件。然而，不建议在大型应用程序中使用这种导入方式，因为你可能会遇到版本冲突（即不同文件使用不同的版本说明符）。

:::info

谨慎使用 HTTPS 导入，并且只 **从受信任的来源**
导入。如果服务器被攻破，它可能会向你的应用程序提供恶意代码。如果你在不同的文件中导入不同的版本，它们也可能导致版本问题。HTTPS
导入仍然受支持，**但我们建议使用包注册表以获得最佳体验。**

:::

## 覆盖依赖项

Deno
提供了覆盖依赖项的机制，使开发者能够在开发或测试期间使用自定义或本地版本的库。

注意：如果你需要缓存并在本地修改依赖项以在多个构建中使用，请考虑
[远程模块的本地化](#vendoring-remote-modules)。

### 覆盖本地 JSR 包

对于熟悉 Node.js 中 `npm link` 的开发者，Deno 通过 `deno.json` 中的 `patch`
字段为本地 JSR
包提供了类似的功能。这允许你在开发期间覆盖依赖项，而无需发布它们。

示例：

```json title="deno.json"
{
  "patch": [
    "../some-package-or-workspace"
  ]
}
```

关键点：

- `patch` 字段接受包含 JSR
  包或工作区的目录路径。如果你引用工作区中的单个包，整个工作区将被包含。
- 此功能仅在工作区根目录中有效。在其他地方使用 `patch` 会触发警告。
- 目前，`patch` 仅限于 JSR 包。尝试覆盖 `npm` 包将导致警告，但不会生效。

限制：

- 尚不支持 `npm` 包覆盖。这计划在未来的更新中实现。
- 基于 Git 的依赖项覆盖不可用。
- `patch` 字段需要在工作区根目录中正确配置。
- 此功能是实验性的，可能会根据用户反馈进行更改。

### 覆盖 NPM 包

我们计划支持上述的 `patch` 功能来覆盖 NPM 包，但在此之前，如果你有一个
`node_modules` 目录，可以使用 `npm link` 来实现相同的效果。这通常通过在
`deno.json` 文件中设置 `{ "nodeModulesDir": "manual" }` 来完成。另请参阅
[`node_modules` 文档](/runtime/fundamentals/node/#node_modules)。

### 覆盖 HTTPS 导入

Deno 还允许通过 `deno.json` 中的 `importMap` 字段覆盖 HTTPS
导入。此功能在调试或临时修复时特别有用，可以用本地修补版本替换远程依赖项。

示例：

```json title="deno.json"
{
  "imports": {
    "example/": "https://deno.land/x/example/"
  },
  "scopes": {
    "https://deno.land/x/example/": {
      "https://deno.land/x/my-library@1.0.0/mod.ts": "./patched/mod.ts"
    }
  }
}
```

关键点：

- 导入映射中的 `scopes` 字段允许你将特定导入重定向到替代路径。
- 这通常用于在测试或开发期间用本地文件覆盖远程依赖项。
- 导入映射仅适用于项目的根目录。依赖项中的嵌套导入映射将被忽略。

## 远程模块的本地化

如果你的项目有外部依赖项，你可能希望将它们存储在本地，以避免每次构建项目时都从互联网下载它们。这在
CI 服务器或 Docker
容器中构建项目时特别有用，或者在对远程依赖项进行修补或其他修改时。

Deno 通过 `deno.json` 文件中的设置提供了此功能：

```json
{
  "vendor": true
}
```

将上述代码片段添加到你的 `deno.json` 文件中，Deno
将在项目运行时将所有依赖项缓存在本地的 `vendor` 目录中，或者你可以选择运行
`deno install --entrypoint` 命令立即缓存依赖项：

```bash
deno install --entrypoint main.ts
```

然后你可以像往常一样使用 `deno run` 运行应用程序：

```bash
deno run main.ts
```

在本地化之后，你可以使用 `--cached-only` 标志在没有互联网访问的情况下运行
`main.ts`，这将强制 Deno 仅使用本地可用的模块。

有关更高级的覆盖，例如在开发期间替换依赖项，请参阅
[覆盖依赖项](#overriding-dependencies)。

## 发布模块

任何定义了导出的 Deno
程序都可以作为模块发布。这允许其他开发者导入并在他们自己的项目中使用你的代码。模块可以发布到：

- [JSR](https://jsr.io) - 推荐，原生支持 TypeScript 并自动生成文档
- [npm](https://www.npmjs.com/) - 使用 [dnt](https://github.com/denoland/dnt)
  创建 npm 包
- [deno.land/x](https://deno.com/add_module) - 对于 HTTPS 导入，如果可能，请使用
  JSR

## 重新加载模块

默认情况下，Deno
使用全局缓存目录（`DENO_DIR`）来存储下载的依赖项。此缓存在所有项目之间共享。

你可以使用 `--reload` 标志强制 Deno 重新获取并重新编译模块到缓存中。

```bash
# 重新加载所有内容
deno run --reload my_module.ts

# 重新加载特定模块
deno run --reload=jsr:@std/fs my_module.ts
```

## 仅使用缓存的模块

要强制 Deno 仅使用之前缓存的模块，请使用 `--cached-only` 标志：

```shell
deno run --cached-only mod.ts
```

如果 mod.ts 的依赖树中有任何尚未缓存的依赖项，这将失败。

## 完整性检查和锁定文件

想象一下，你的模块依赖于位于 https://some.url/a.ts
的远程模块。当你第一次编译你的模块时，`a.ts`
被获取、编译并缓存。此缓存版本将一直使用，直到你在不同的机器上运行你的模块（例如在生产环境中）或手动重新加载缓存（使用
`deno install --reload` 等命令）。

但如果 `https://some.url/a.ts`
的内容发生了变化怎么办？这可能导致你的生产模块运行与本地模块不同的依赖代码。为了检测这一点，Deno
使用完整性检查和锁定文件。

Deno 使用 `deno.lock` 文件来检查外部模块的完整性。要启用锁定文件，可以：

1. 在当前或祖先目录中创建一个 `deno.json` 文件，这将自动在 `deno.lock`
   创建一个附加的锁定文件。

   注意，这可以通过在 deno.json 中指定以下内容来禁用：

   ```json title="deno.json"
   {
     "lock": false
   }
   ```

2. 使用 `--lock` 标志启用并指定锁定文件检查。

### 冻结锁定文件

默认情况下，Deno
使用附加的锁定文件，其中新的依赖项会添加到锁定文件中，而不是报错。

在某些场景下（例如 CI 管道或生产环境），你可能希望 Deno
在遇到从未见过的依赖项时报错。要启用此功能
