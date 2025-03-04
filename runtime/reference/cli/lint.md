---
title: "`deno lint`, linter"
oldUrl:
 - /runtime/tools/linter/
 - /runtime/fundamentals/linting_and_formatting/lint-cli-ref
 - /runtime/manual/tools/linter/
 - /runtime/reference/cli/linter/
command: lint
---

## 可用规则

有关支持的完整规则列表，请访问 [规则列表](/lint/) 文档页面。

## 忽略指令

### 文件级别

要忽略整个文件，请在文件顶部使用 `// deno-lint-ignore-file`：

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

您还可以指定忽略文件的原因：

```ts
// deno-lint-ignore-file -- 忽略原因

function foo(): any {
  // ...
}
```

忽略指令必须放在第一个语句或声明之前：

```ts
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

/**
 * 一些 JS 文档
 */

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```

您还可以忽略整个文件中的某些诊断：

```ts
// deno-lint-ignore-file no-explicit-any no-empty

function foo(): any {
  // ...
}
```

如果有多个 `// deno-lint-ignore-file` 指令，除第一个外，其他均无效：

```ts
// 这个有效
// deno-lint-ignore-file no-explicit-any no-empty

// 但这个无效
// deno-lint-ignore-file no-debugger

function foo(): any {
  debugger; // 未被忽略！
}
```

### 行级别

要忽略特定诊断，请在问题行的前一行使用 `// deno-lint-ignore <codes...>`。

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

您必须指定要忽略的规则名称。

您还可以指定忽略诊断的原因：

```ts
// deno-lint-ignore no-explicit-any -- 忽略原因
function foo(): any {
  // ...
}
```

## 忽略 `ban-unused-ignore` 本身

`deno lint` 提供了
[`ban-unused-ignore` 规则](/lint/rules/ban-unused-ignore/)，它将检测那些从未抑制某些诊断的忽略指令。这在您希望发现重构代码后不再需要的忽略指令时非常有用。

然而，在某些情况下，您可能希望忽略 `ban-unused-ignore`
规则本身。一个典型的例子是处理自动生成的文件时；为某些规则添加文件级别的忽略指令是有意义的，在这种情况下，几乎不需要通过
`ban-unused-ignore` 检测未使用的指令。

如果您想在整个文件中抑制该规则，可以像往常一样使用
`// deno-lint-ignore-file ban-unused-ignore`：

```ts
// deno-lint-ignore-file ban-unused-ignore no-explicit-any

// `no-explicit-any` 未被使用，但由于忽略了 `ban-unused-ignore`，您不会收到任何诊断信息
console.log(42);
```

请注意，忽略 `ban-unused-ignore`
本身仅通过文件级别的忽略指令有效。这意味着每行指令，如
`// deno-lint-ignore ban-unused-ignore`，根本不起作用。如果您因某些特殊原因想要忽略
`ban-unused-ignore`，请确保将其添加为文件级别的忽略指令。
