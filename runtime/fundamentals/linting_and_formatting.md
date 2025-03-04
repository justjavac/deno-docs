---
title: "代码检查和格式化"
---

在理想的世界中，你的代码总是干净、一致且没有烦人的错误。这就是 Deno
内置的代码检查和格式化工具的承诺。通过将这些功能直接集成到运行时中，Deno
消除了项目中对外部依赖和复杂配置的需求。这些内置工具快速且高效，不仅节省时间，还确保每一行代码都遵循最佳实践。

使用 `deno fmt` 和 `deno lint`，你可以专注于编写出色的代码，因为 Deno
会为你保驾护航。这就像拥有一个警惕的助手，时刻保持你的代码库处于最佳状态，让你能够专注于真正重要的事情：构建出色的应用程序。

## 代码检查

代码检查是分析代码以发现潜在错误、漏洞和风格问题的过程。Deno 内置的代码检查工具
[`deno lint`](/runtime/reference/cli/linter/) 支持来自
[ESLint](https://eslint.org/)
的推荐规则集，为你的代码提供全面的反馈。这包括识别语法错误、强制执行编码约定，并突出显示可能导致漏洞的潜在问题。

要运行代码检查工具，请在终端中使用以下命令：

```bash
deno lint
```

默认情况下，`deno lint` 会分析当前目录及其子目录中的所有 TypeScript 和
JavaScript
文件。如果你想检查特定文件或目录，可以将它们作为参数传递给命令。例如：

```bash
deno lint src/
```

此命令将检查 `src/` 目录中的所有文件。

代码检查工具可以在 [`deno.json`](/runtime/fundamentals/configuration/)
文件中进行配置。你可以指定自定义规则、插件和设置，以满足你的需求。

### 代码检查规则

你可以在 [规则列表](/lint/) 文档页面上查看和搜索可用规则及其用法。

## 格式化

格式化是自动调整代码布局以遵循一致风格的过程。Deno 内置的格式化工具 `deno fmt`
使用强大的 [dprint](https://dprint.dev/)
引擎，确保你的代码始终干净、可读且一致。

要格式化你的代码，只需在终端中执行以下命令：

```bash
deno fmt
```

默认情况下，`deno fmt` 会格式化当前目录及其子目录中的所有 TypeScript 和
JavaScript
文件。如果你想格式化特定文件或目录，可以将它们作为参数传递给命令。例如：

```bash
deno fmt src/
```

此命令将格式化 `src/` 目录中的所有文件。

### 检查格式化

`deno fmt --check` 命令用于验证你的代码是否按照 Deno
的默认格式化规则正确格式化。它不会修改文件，而是检查它们并报告任何格式化问题。这对于集成到持续集成（CI）管道或预提交钩子中特别有用，以确保项目中的代码一致性。

如果存在格式化问题，`deno fmt --check`
将列出需要格式化的文件。如果所有文件都正确格式化，它将直接退出而不输出任何内容。

### 在 CI 中集成

你可以将 `deno fmt --check` 添加到你的 CI 管道中，以自动检查格式化问题。例如，在
GitHub Actions 工作流中：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno fmt --check
```

这确保任何代码更改在合并之前都符合项目的格式化标准。

### 可用选项

| 规则               | 描述                                          | 默认值     | 可能值                  |
| ------------------ | --------------------------------------------- | ---------- | ----------------------- |
| indent-width       | 定义缩进宽度                                  | **2**      | 数字                    |
| line-width         | 定义最大行宽                                  | **80**     | 数字                    |
| no-semicolons      | 除非必要，否则不使用分号                      | **false**  | true, false             |
| prose-wrap         | 定义散文应如何换行                            | **always** | always, never, preserve |
| single-quote       | 使用单引号                                    | **false**  | true, false             |
| unstable-component | 启用格式化 Svelte、Vue、Astro 和 Angular 文件 |            |                         |
| unstable-sql       | 启用格式化 SQL 文件                           |            |                         |
| use-tabs           | 使用制表符而不是空格进行缩进                  | **false**  | true, false             |

格式化工具可以在 [`deno.json`](/runtime/fundamentals/configuration/#formatting)
文件中进行配置。你可以指定自定义设置，以满足你的需求。
