---
title: "一体化工具"
url: /examples/all-in-one_tooling/
videoUrl: https://www.youtube.com/watch?v=-4e9DkUrCr4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=5
layout: video.tsx
---

## 视频描述

在 Node.js
中，我们开始项目之前，必须经过配置步骤，例如代码检查、格式化和测试。Deno
通过原生集成这些工具，为我们节省了大量时间。让我们来看看这些内置的 CLI
工具都包含哪些功能。

## 文字稿和代码

这里我们有一个名为 `sing` 的函数：

```javascript
function sing(phrase: string, times: number): string {
  return Array(times).fill(phrase).join(" ");
}
```

现在让我们运行格式化工具：

```shell
deno fmt
```

格式化工具会自动将你的代码格式化为符合 Deno
的规则和约定。让我们运行它来清理任何格式化问题。

Deno 甚至还会格式化 markdown
文件中的代码片段。因此，任何用三个反引号包裹的内容在运行此命令时也会被格式化。

`deno lint` 命令用于分析你的代码，找出潜在问题。它类似于 ESLint，但内置在 Deno
中。

```shell
deno lint --help
```

这将检查当前目录及子目录中的所有 JavaScript 和 TypeScript 文件。

你也可以通过传递文件名来检查特定文件：

```shell
# 检查特定文件
deno lint myfile1.ts myfile2.ts
```

你可以对特定目录运行它：

```shell
deno lint src/
```

如果你想要跳过某些文件的检查，可以在文件顶部添加注释，Deno 会知道跳过这个文件。

```javascript
// deno-lint-ignore-file
// deno-lint-ignore-file -- 忽略的原因
```

Deno 还有一些用于测试的 CLI
命令。在我们的目录中，我们有一个测试文件。它使用了函数名和测试。

```javascript title="sing_test.ts"
import { sing } from "./sing.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("sing repeats a phrase", () => {
  const result = sing("La", 3);
  assertEquals(result, "La La La");
});
```

现在，我们将使用 `deno test` 命令运行我们的测试。Deno 会自动发现并运行测试文件。

```shell
deno test
```

Deno 决定哪些文件应被视为测试文件的方式是遵循以下命名规则：

`_test.ts`, `_test.js`, `_test.tsx`, `_test.jsx`, `.test.js`, `.test.ts`,
`.test.tsx`, `.test.jsx`

`deno test encourage.test.js`

或者你可以传递一个特定的目录路径，Deno 会在其中搜索测试文件。

```sh
./tests/
```

你甚至可以检查代码覆盖率。默认情况下，当你运行 `deno test --coverage`
时，会在当前工作目录的 `/coverage` 目录中生成一个覆盖率配置文件。

```shell
deno test --coverage
```

然后你可以运行 `deno coverage` 将覆盖率报告打印到标准输出。

```shell
deno coverage
```

如你所见，Deno
的内置工具非常酷。我们不必花一整天时间配置这些设置，就可以开始我们的项目。而且我们可以在不需要第三方依赖的情况下格式化、检查和测试代码。
