# 配置文件

Deno 支持配置文件，允许你自定义内置的 TypeScript
编译器、格式化程序和代码检查工具。

配置文件支持 `.json` 和 `.jsonc` 扩展名。
[自 v1.18 版](https://deno.com/blog/v1.18#auto-discovery-of-the-config-file)，如果配置文件位于当前工作目录或父目录中，Deno
将自动检测 `deno.json` 或 `deno.jsonc` 配置文件。可以使用 `--config`
标志来指定不同的配置文件。

:::info 版本说明

- 在 Deno v1.23 之前，你需要提供显式的 `--config` 标志。
- 从 Deno v1.34 开始，`include` 和 `exclude` 字段中支持通配符。你可以使用 `*`
  匹配任意字符，`?` 匹配单个字符，`**` 匹配任意数量的目录。

:::

## `imports` 和 `scopes`

自版本 1.30 起，`deno.json`
配置文件充当[导入映射](../basics/import_maps.md)以解析裸规范符号。

```jsonc
{
  "imports": {
    "std/": "https://deno.land/std@$STD_VERSION/"
  },
  "tasks": {
    "dev": "deno run --watch main.ts"
  }
}
```

查看[导入映射部分](../basics/import_maps.md)获取有关导入映射的更多信息。

然后你的脚本可以使用裸规范符号 `std`：

```js, ignore
import { assertEquals } from "std/assert/mod.ts";

assertEquals(1, 2);
```

顶层 `deno.json` 选项 `importMap` 以及 `--importmap`
标志可用于指定其他文件中的导入映射。

## `tasks`

类似于 `package.json` 的 `script` 字段。主要是命令行调用的快捷方式。

```json
{
  "tasks": {
    "start": "deno run -A --watch=static/,routes/,data/ dev.ts"
  }
}
```

使用 `deno task start`
将运行该命令。另请参阅[`deno task`](../tools/task_runner.md)。

## `lint`

配置[`deno lint`](../tools/linter.md)。

```json
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "data/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

## `fmt`

配置[`deno fmt`](../tools/formatter.md)

```json
{
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": true,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "data/fixtures/**/*.ts"]
  }
}
```

## `lock`

用于指定锁文件的不同文件名。默认情况下，Deno 将使用`deno.lock`
并将其放在配置文件旁边。

## `nodeModulesDir`

用于启用或禁用使用 npm 包时的 `node_modules` 目录。

## `npmRegistry`

用于指定自定义 npm 注册表的 npm 规范符号。

## `compilerOptions`

`deno.json` 还可以充当 TypeScript
配置文件，并支持[大多数 TS 编译器选项](https://www.typescriptlang.org/tsconfig)。

Deno 鼓励用户使用默认的 TypeScript 配置来帮助共享代码。

另请参阅[Deno中的TypeScript配置](../advanced/typescript/configuration.md)。

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
    "exclude": ["src/testdata/", "data/fixtures/**/*.ts"],
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
    "exclude": ["src/testdata/", "data/fixtures/**/*.ts"]
  },
  "lock": false,
  "nodeModulesDir": true,
  "npmRegistry": "https://mycompany.net/artifactory/api/npm/virtual-npm",
  "test": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "data/fixtures/**/*.ts"]
  },
  "tasks": {
    "start": "deno run --allow-read main.ts"
  },
  "imports": {
    "oak": "https://deno.land/x/oak@v12.4.0/mod.ts"
  }
}
```

## JSON 模式

编辑器可提供自动完成的 JSON 模式文件可用。该文件有版本，可在以下位置找到：
https://deno.land/x/deno/cli/schemas/config-file.v1.json
