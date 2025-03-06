---
title: "deno.json 和 package.json"
oldUrl:
- /runtime/manual/getting_started/configuration_file/
- /runtime/manual/basics/modules/import_maps/
- /runtime/basics/import_maps/
- /runtime/manual/linking_to_external_code/import_maps
- /manual/linking_to_external_code/proxies
---

你可以使用 `deno.json` 文件来配置 Deno。该文件可用于配置 TypeScript
编译器、代码检查工具、格式化工具以及其他 Deno 工具。

配置文件支持 `.json` 和
[`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
扩展名。

如果 `deno.json` 或 `deno.jsonc` 配置文件位于当前工作目录或其父目录中，Deno
会自动检测到它。你可以使用 `--config` 标志来指定不同的配置文件。

## package.json 支持

Deno 也支持 `package.json` 文件，以便与 Node.js 项目兼容。如果你有一个 Node.js
项目，则无需创建 `deno.json` 文件。Deno 会使用 `package.json` 文件来配置项目。

如果同一目录中同时存在 `deno.json` 和 `package.json` 文件，Deno 会理解
`deno.json` 和 `package.json` 中指定的依赖项，并使用 `deno.json` 文件进行 Deno
特定的配置。了解更多关于
[Deno 中的 Node 兼容性](/runtime/fundamentals/node/#node-compatibility)。

## 依赖项

`deno.json` 中的 `"imports"`
字段允许你指定项目中使用的依赖项。你可以使用它将裸说明符映射到 URL
或文件路径，从而更轻松地管理依赖项和模块解析。

例如，如果你想在项目中使用标准库中的 `assert` 模块，可以使用以下导入映射：

```json title="deno.json"
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0",
    "chalk": "npm:chalk@5"
  }
}
```

然后你的脚本可以使用裸说明符 `std/assert`：

```js title="script.ts"
import { assertEquals } from "@std/assert";
import chalk from "chalk";

assertEquals(1, 2);
console.log(chalk.yellow("Hello world"));
```

你也可以在 `package.json` 中使用 `"dependencies"` 字段：

```json title="package.json"
{
  "dependencies": {
    "express": "express@^1.0.0"
  }
}
```

```js title="script.ts"
import express from "express";

const app = express();
```

请注意，这将需要你运行 `deno install`。

了解更多关于 [模块导入和依赖项](/runtime/fundamentals/modules/)。

### 自定义路径映射

`deno.json`
中的导入映射可以用于更通用的说明符路径映射。你可以将确切的说明符映射到第三方模块或文件，或者将导入说明符的一部分映射到目录。

```jsonc title="deno.jsonc"
{
  "imports": {
    // 映射到确切文件
    "foo": "./some/long/path/foo.ts",
    // 映射到目录，用法: "bar/file.ts"
    "bar/": "./some/folder/bar/"
  }
}
```

用法：

```ts
import * as foo from "foo";
import * as bar from "bar/file.ts";
```

导入说明符的路径映射通常用于较大的代码库中以简化代码。

要使用项目根目录进行绝对导入：

```json title="deno.json"
{
  "imports": {
    "/": "./",
    "./": "./"
  }
}
```

```ts title="main.ts"
import { MyUtil } from "/util.ts";
```

这将使以 `/` 开头的导入说明符相对于导入映射的 URL 或文件路径进行解析。

## 任务

`deno.json` 文件中的 `tasks` 字段用于定义可以通过 `deno task`
命令执行的自定义命令，并允许你根据项目的特定需求定制命令和权限。

它类似于 `package.json` 文件中的 `scripts` 字段，后者也受支持。

```json title="deno.json"
{
  "tasks": {
    "start": "deno run --allow-net --watch=static/,routes/,data/ dev.ts",
    "test": "deno test --allow-net",
    "lint": "deno lint"
  }
}
```

```json title="package.json"
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

要执行任务，请使用 `deno task` 命令后跟任务名称。例如：

```sh
deno task start
deno task test
deno task lint
deno task dev
deno task build
```

了解更多关于 [`deno task`](/runtime/reference/cli/task_runner/)。

## 代码检查

`deno.json` 文件中的 `lint` 字段用于配置 Deno
内置代码检查工具的行为。这允许你指定要包含或排除的文件，以及自定义代码检查规则以满足项目的需求。

例如：

```json title="deno.json"
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

此配置将：

- 仅检查 `src/` 目录中的文件，
- 不检查 `src/testdata/` 目录中的文件或 `src/fixtures/` 目录中的任何 TypeScript
  文件，
- 指定应应用推荐的代码检查规则，
- 添加 `ban-untagged-todo` 规则，
- 排除 `no-unused-vars` 规则。

你可以在 [规则列表](/lint/) 文档页面中找到完整的可用代码检查规则列表。

了解更多关于 [使用 Deno 进行代码检查](/runtime/reference/cli/linter/)。

## 格式化

`deno.json` 文件中的 `fmt` 字段用于配置 Deno
内置代码格式化工具的行为。这允许你自定义代码的格式化方式，确保项目中的一致性，使其更易于阅读和协作。以下是你可以配置的关键选项：

```json title="deno.json"
{
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": true,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  }
}
```

此配置将：

- 使用制表符而不是空格进行缩进，
- 将行限制为 80 个字符，
- 使用 4 个空格的缩进宽度，
- 在语句末尾添加分号，
- 使用单引号表示字符串，
- 保留散文换行，
- 格式化 `src/` 目录中的文件，
- 排除 `src/testdata/` 目录中的文件或 `src/fixtures/` 目录中的任何 TypeScript
  文件。

了解更多关于
[使用 Deno 格式化代码](/runtime/fundamentals/linting_and_formatting/)。

## 锁文件

`deno.json` 文件中的 `lock` 字段用于指定 Deno 使用的锁文件的配置，以确保
[依赖项的完整性](/runtime/fundamentals/modules/#integrity-checking-and-lock-files)。锁文件记录了项目依赖模块的确切版本和完整性哈希，确保每次运行项目时都使用相同的版本，即使依赖项在远程更新或更改。

```json title="deno.json"
{
  "lock": {
    "path": "./deno.lock",
    "frozen": true
  }
}
```

此配置将：

- 指定锁文件位置为 `./deno.lock`（这是默认值，可以省略），
- 告诉 Deno 如果任何依赖项发生变化则报错

Deno 默认使用锁文件，你可以通过以下配置禁用它：

```json title="deno.json"
{
  "lock": false
}
```

## Node 模块目录

默认情况下，如果你的项目目录中有 `package.json` 文件，Deno 会使用本地的
`node_modules` 目录。

你可以使用 `deno.json` 文件中的 `nodeModulesDir` 字段来控制此行为。

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

你可以将此字段设置为以下值：

| 值         | 行为                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `"none"`   | 不使用本地的 `node_modules` 目录。而是使用 `$DENO_DIR` 中的全局缓存，该缓存由 Deno 自动保持最新。            |
| `"auto"`   | 使用本地的 `node_modules` 目录。该目录由 Deno 自动创建并保持最新。                                           |
| `"manual"` | 使用本地的 `node_modules` 目录。用户必须手动保持此目录的最新状态，例如使用 `deno install` 或 `npm install`。 |

无需指定此设置，默认情况下会应用以下值：

- 如果你的项目目录中没有 `package.json` 文件，则为 `"none"`
- 如果你的项目目录中有 `package.json` 文件，则为 `"manual"`

在使用工作区时，此设置只能在工作区根目录中使用。在任何成员中指定它都会导致警告。只有在工作区根目录中有
`package.json` 文件时，`"manual"` 设置才会自动应用。

## TypeScript 编译器选项

`deno.json` 文件中的 `compilerOptions` 字段用于为你的 Deno 项目配置
[TypeScript 编译器设置](https://www.typescriptlang.org/tsconfig)。这允许你自定义
TypeScript 代码的编译方式，确保其符合项目的要求和编码标准。

:::info

Deno 推荐使用默认的 TypeScript 配置。这将有助于共享代码。

:::

另请参阅 [在 Deno 中配置 TypeScript](/runtime/reference/ts_config_migration/)。

## 不稳定功能

`deno.json` 文件中的 `unstable` 字段用于为你的 Deno 项目启用特定的不稳定功能。

这些功能仍在开发中，尚未成为稳定 API 的一部分。通过在 `unstable`
数组中列出功能，你可以在它们正式发布之前进行实验和使用这些新功能。

```json title="deno.json"
{
  "unstable": ["cron", "kv", "webgpu"]
}
```

[了解更多](/runtime/reference/cli/unstable_flags/)。

## include 和 exclude

许多配置（例如 `lint`、`fmt`）都有 `include` 和 `exclude`
属性，用于指定要包含的文件。

### include

仅包含此处指定的路径或模式。

```jsonc
{
  "lint": {
    // 仅格式化 src/ 目录
    "include": ["src/"]
  }
}
```

### exclude

排除此处指定的路径或模式。

```jsonc
{
  "lint": {
    // 不检查 dist/ 文件夹
    "exclude": ["dist/"]
  }
}
```

这比 `include` 具有更高的优先级，如果路径同时匹配 `include` 和
`exclude`，`exclude` 将优先。

你可能希望排除一个目录，但包含其子目录。在 Deno 1.41.2+
中，你可以通过在更一般的排除下方指定一个否定的 glob 来取消排除更具体的路径：

```jsonc
{
  "fmt": {
    // 不格式化 "fixtures" 目录，
    // 但格式化 "fixtures/scripts"
    "exclude": [
      "fixtures",
      "!fixtures/scripts"
    ]
  }
}
```

### 顶级 exclude

如果有一个目录你永远不希望 Deno 进行格式化、代码检查、类型检查、LSP
分析等，请在顶级 exclude 数组中指定它：

```jsonc
{
  "exclude": [
    // 从所有子命令和 LSP 中排除 dist 文件夹
    "dist/"
  ]
}
```

有时你可能希望取消排除在顶级 exclude 中排除的路径或模式。在 Deno 1.41.2+
中，你可以通过在更具体的配置中指定一个否定的 glob 来取消排除路径：

```jsonc
{
  "fmt": {
    "exclude": [
      // 格式化 dist 文件夹，即使它在顶级被排除
      "!dist"
    ]
  },
  "exclude": [
    "dist/"
  ]
}
```

### 发布 - 覆盖 .gitignore

`.gitignore` 在 `deno publish` 命令中被考虑在内。在 Deno 1.41.2+
中，你可以通过使用否定的 exclude glob 来选择不排除 _.gitignore_ 中忽略的文件：

```title=".gitignore"
dist/
.env
```

```jsonc title="deno.json"
{
  "publish": {
    "exclude": [
      // 包含被 .gitignore 忽略的 dist 文件夹
      "!dist/"
    ]
  }
}
```

或者，显式地在 `"include"` 中指定被 gitignore 的路径也可以：

```json
{
  "publish": {
    "include": [
      "dist/",
      "README.md",
      "deno.json"
    ]
  }
}
```

## 完整示例

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": false,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "lock": false,
  "nodeModulesDir": "auto",
  "unstable": ["webgpu"],
  "test": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "tasks": {
    "start": "deno run --allow-read main.ts"
  },
  "imports": {
    "oak": "jsr:@oak/oak"
  },
  "exclude": [
    "dist/"
  ]
}
```

## JSON 模式

编辑器的自动补全功能可以使用 JSON 模式文件。该文件已版本化，可在以下位置获取：
https://deno.land/x/deno/cli/schemas/config-file.v1.json

## 代理

Deno 支持模块下载和 fetch API 的代理。代理配置从
[环境变量](https://docs.deno.com/runtime/reference/env_variables/#special-environment-variables)
中读取：HTTP_PROXY、HTTPS_PROXY 和 NO_PROXY。

如果你使用的是 Windows - 如果未找到环境变量，Deno 会回退到从注册表中读取代理。
