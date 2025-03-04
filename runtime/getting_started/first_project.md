---
title: 创建一个 Deno 项目
oldUrl: /runtime/manual/getting_started/first_steps/
---

Deno 提供了许多 [内置工具](/runtime/reference/cli/)
来使你的开发体验尽可能顺畅。其中一个工具是
[项目初始化器](/runtime/reference/cli/init)，它可以创建一个具有基本文件结构和配置的新
Deno 项目。

虽然你可以使用 JavaScript，但 Deno 也内置了对
[TypeScript](https://www.typescriptlang.org/) 的支持，因此在本指南中我们将使用
TypeScript。如果你更倾向于使用 JavaScript，可以将文件重命名为 `.js`
并移除类型注解。

## 初始化一个新项目

要初始化一个新的 Deno 项目，请在终端中运行以下命令：

```bash
deno init my_project
```

这将创建一个名为 `my_project` 的新目录，其结构如下：

```plaintext
my_project
├── deno.json
├── main_test.ts
└── main.ts
```

`deno.json` 文件用于
[配置你的项目](/runtime/fundamentals/configuration/)，并创建了两个 TypeScript
文件：`main.ts` 和 `main_test.ts`。`main.ts`
文件是你编写应用程序代码的地方，初始创建时它将包含一个简单的程序，用于将两个数字相加。`main_test.ts`
文件是你编写测试的地方，初始时它将包含一个针对加法程序的测试。

## 运行你的项目

你可以使用以下命令运行这个程序：

```bash
$ deno main.ts
Add 2 + 3 = 5
```

## 运行你的测试

Deno 有一个
[内置的测试运行器](/runtime/fundamentals/testing/)。你可以为你的代码编写测试并使用
`deno test` 命令运行它们。在你的新项目中运行测试：

```bash
$ deno test
running 1 test from ./main_test.ts     
addTest ... ok (1ms)

ok | 1 passed | 0 failed (3ms)
```

现在你已经设置了一个基本的项目，可以开始构建你的应用程序了。查看我们的
[示例和教程](/examples/) 以获取更多关于使用 Deno 构建项目的想法。

你可以
[在这里了解更多关于在 Deno 中使用 TypeScript 的信息](/runtime/fundamentals/typescript)。
