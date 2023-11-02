# 代码检查工具

Deno 集成了 JavaScript 和 TypeScript 的内置代码检查工具。

```shell
检查当前目录和子目录中的所有 JS/TS 文件
deno lint
# 检查特定文件
deno lint myfile1.ts myfile2.ts
# 检查指定目录和子目录中的所有 JS/TS 文件
deno lint src/
# 以 JSON 格式输出结果
deno lint --json
# 从标准输入读取
cat file.ts | deno lint -
```

有关更多详细信息，请运行 `deno lint --help`。

## 可用规则

要查看受支持规则的完整列表，请访问
[deno_lint 规则文档](https://lint.deno.land)。

## 忽略指令

### 文件

要忽略整个文件，应在文件顶部放置 `// deno-lint-ignore-file` 指令：

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

忽略指令必须放在第一个语句或声明之前：

```ts, ignore
// 版权所有 2020 年的 Deno 作者。保留所有权利。MIT 许可证。

/**
 * 一些 JS 文档
 */

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```

您还可以在整个文件中忽略某些诊断信息

```ts
// deno-lint-ignore-file no-explicit-any no-empty

function foo(): any {
  // ...
}
```

### 诊断信息

要忽略特定诊断信息，应在有问题的行之前放置 `// deno-lint-ignore <codes...>`
指令。必须指定要忽略的规则名称：

```ts
// deno-lint-ignore no-explicit-any
function foo(): any {
  // ...
}

// deno-lint-ignore no-explicit-any explicit-function-return-type
function bar(a: any) {
  // ...
}
```

## 配置

从 Deno v1.14 开始，代码检查工具可以使用
[配置文件](../getting_started/configuration_file.md) 或以下 CLI 标志进行自定义：

- `--rules-tags` - 将运行的标记名称列表。空列表会禁用所有标记，并仅使用
  `include` 中的规则。默认为 "recommended"。

- `--rules-exclude` - 从配置的标记集中排除的规则名称列表。即使相同的规则位于
  `include` 中，也会被排除在外；换句话说，`--rules-exclude` 优先级高于
  `--rules-include`。

- `--rules-include` - 将运行的规则名称列表。如果相同的规则位于 `exclude`
  中，它将被排除。
