---
title: "测试"
oldUrl:
  - /runtime/manual/advanced/language_server/testing_api/
  - /runtime/manual/basics/testing/
  - /runtime/manual/basics/testing/coverage/
  - /runtime/manual/basics/testing/assertions/
  - /runtime/manual/basics/testing/mocking/
  - /runtime/manual/basics/testing/behavior_driven_development
  - /runtime/manual/testing/documentation/
  - /runtime/manual/basics/testing/sanitizers/
  - /runtime/manual/basics/testing/snapshot_testing/
  - /runtime/manual/testing
  - /runtime/manual/basics/testing/documentation/
---

Deno 提供了一个内置的测试运行器，用于编写和运行 JavaScript 和 TypeScript
的测试。这使得确保代码可靠并按预期运行变得容易，而无需安装任何额外的依赖或工具。`deno test`
运行器允许你对每个测试的权限进行细粒度控制，确保代码不会执行任何意外操作。

除了内置的测试运行器，你还可以使用来自 JS 生态系统的其他测试运行器，例如
Jest、Mocha 或 AVA，与 Deno 一起使用。然而，本文档不会涵盖这些内容。

## 编写测试

要在 Deno 中定义一个测试，你可以使用 `Deno.test()` 函数。以下是一些示例：

```ts title="my_test.ts"
import { assertEquals } from "jsr:@std/assert";

Deno.test("简单测试", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

import { delay } from "jsr:@std/async";

Deno.test("异步测试", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

Deno.test({
  name: "读取文件测试",
  permissions: { read: true },
  fn: () => {
    const data = Deno.readTextFileSync("./somefile.txt");
    assertEquals(data, "预期内容");
  },
});
```

如果你更喜欢类似 Jest 的 `expect` 风格的断言，Deno 标准库提供了一个
[`expect`](https://jsr.io/@std/expect) 函数，可以替代 `assertEquals`：

```ts title="my_test.ts"
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

Deno.test("add 函数正确相加两个数字", () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});
```

## 运行测试

要运行你的测试，请使用 [`deno test`](/runtime/reference/cli/test/) 子命令。

如果运行时不带文件名或目录名，此子命令将自动查找并执行当前目录（递归）中与 glob
`{*_,*.,}test.{ts, tsx, mts, js, mjs, jsx}` 匹配的所有测试。

```sh
# 运行当前目录及所有子目录中的所有测试
deno test

# 运行 util 目录中的所有测试
deno test util/

# 仅运行 my_test.ts
deno test my_test.ts

# 并行运行测试模块
deno test --parallel

# 将额外的参数传递给测试文件，这些参数在 `Deno.args` 中可见
deno test my_test.ts -- -e --foo --bar

# 为 deno 提供读取文件系统的权限，这对于上面的最后一个测试通过是必要的
deno test --allow-read my_test.ts
```

## 测试步骤

Deno
还支持测试步骤，允许你将测试分解为更小、更易管理的部分。这对于测试中的设置和清理操作非常有用：

```ts
Deno.test("数据库操作", async (t) => {
  using db = await openDatabase();
  await t.step("插入用户", async () => {
    // 插入用户逻辑
  });
  await t.step("插入书籍", async () => {
    // 插入书籍逻辑
  });
});
```

## 命令行过滤

Deno 允许你使用命令行上的 `--filter`
选项运行特定的测试或测试组。此选项接受字符串或模式来匹配测试名称。过滤不会影响步骤；如果测试名称匹配过滤器，则其所有步骤都将执行。

考虑以下测试：

```ts
Deno.test("my-test", () => {});
Deno.test("test-1", () => {});
Deno.test("test-2", () => {});
```

### 按字符串过滤

要运行名称中包含单词 "my" 的所有测试，请使用：

```sh
deno test --filter "my" tests/
```

此命令将执行 `my-test`，因为它包含单词 "my"。

### 按模式过滤

要运行匹配特定模式的测试，请使用：

```sh
deno test --filter "/test-*\d/" tests/
```

此命令将运行 `test-1` 和 `test-2`，因为它们匹配模式 `test-*` 后跟一个数字。

要指示你正在使用模式（正则表达式），请将过滤器值用正斜杠 `/` 包裹，就像
JavaScript 的正则表达式语法一样。

### 在配置文件中包含和排除测试文件

你还可以通过在 [Deno 配置文件](/runtime/fundamentals/configuration)
中指定路径来过滤测试。

例如，如果你只想测试 `src/fetch_test.ts` 和 `src/signal_test.ts` 并排除 `out/`
中的所有内容：

```json
{
  "test": {
    "include": [
      "src/fetch_test.ts",
      "src/signal_test.ts"
    ]
  }
}
```

或者更可能的情况：

```json
{
  "test": {
    "exclude": ["out/"]
  }
}
```

## 测试定义选择

Deno 提供了两个选项用于在测试定义本身中选择测试：忽略测试和专注于特定测试。

### 忽略/跳过测试

你可以使用测试定义中的 `ignore` 布尔值根据特定条件忽略某些测试。如果 `ignore`
设置为
`true`，则测试将被跳过。例如，如果你只想在特定操作系统上运行测试，这将非常有用。

```ts
Deno.test({
  name: "执行 macOS 功能",
  ignore: Deno.build.os !== "darwin", // 如果不在 macOS 上运行，此测试将被忽略
  fn() {
    // 在此执行 MacOS 功能
  },
});
```

如果你想在不传递任何条件的情况下忽略测试，可以使用 `Deno.test` 对象中的
`ignore()` 函数：

```ts
Deno.test.ignore("我的测试", () => {
  // 你的测试代码
});
```

### 仅运行特定测试

如果你想专注于特定测试并忽略其他测试，可以使用 `only`
选项。这告诉测试运行器仅运行 `only` 设置为 true
的测试。多个测试可以设置此选项。然而，如果任何测试被标记为
only，整个测试运行将始终失败，因为这旨在作为调试的临时措施。

```ts
Deno.test.only("我的测试", () => {
  // 一些测试代码
});
```

或

```ts
Deno.test({
  name: "仅专注于此测试",
  only: true, // 仅此测试将运行
  fn() {
    // 在此测试复杂的内容
  },
});
```

## 快速失败

如果你有一个长时间运行的测试套件，并希望它在第一次失败时停止，你可以在运行套件时指定
`--fail-fast` 标志。

```shell
deno test --fail-fast
```

这将导致测试运行器在第一次测试失败后停止执行。

## 报告器

Deno 包含三个内置的报告器来格式化测试输出：

- `pretty`（默认）：提供详细且可读的输出。
- `dot`：提供简洁的输出，便于快速查看测试结果。
- `junit`：生成 JUnit XML 格式的输出，便于与 CI/CD 工具集成。

你可以使用 --reporter 标志指定要使用的报告器：

```sh
# 使用默认的 pretty 报告器
deno test

# 使用 dot 报告器以获得简洁的输出
deno test --reporter=dot

# 使用 JUnit 报告器
deno test --reporter=junit
```

此外，你还可以通过使用 `--junit-path` 标志将 JUnit
报告写入文件，同时在终端中获得人类可读的输出：

```sh
deno test --junit-path=./report.xml
```

## 监视、模拟（测试替身）、存根和伪造时间

[Deno 标准库](/runtime/fundamentals/standard_library/)
提供了一组函数，帮助你编写涉及监视、模拟和存根的测试。查看
[JSR 上的 @std/testing 文档](https://jsr.io/@std/testing)
以获取有关这些实用程序的更多信息。

## 覆盖率

如果你在启动 `deno test` 时指定 `--coverage` 标志，Deno
将收集代码的测试覆盖率到一个目录中。此覆盖率信息直接从 V8 JavaScript
引擎获取，确保高准确性。

然后可以使用 [`deno coverage`](/runtime/reference/cli/coverage/)
工具将此内部格式进一步处理为众所周知的格式，如 `lcov`。

## 行为驱动开发

使用 [@std/testing/bdd](https://jsr.io/@std/testing/doc/bdd/~)
模块，你可以以熟悉的格式编写测试，用于分组测试和添加设置/清理钩子，这些钩子被其他
JavaScript 测试框架如 Jasmine、Jest 和 Mocha 使用。

`describe` 函数创建一个块，将几个相关的测试分组在一起。`it`
函数注册一个单独的测试用例。例如：

```ts
import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

describe("add 函数", () => {
  it("正确相加两个数字", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  it("处理负数", () => {
    const result = add(-2, -3);
    expect(result).toBe(-5);
  });
});
```

查看 [JSR 上的文档](https://jsr.io/@std/testing/doc/bdd/~)
以获取有关这些函数和钩子的更多信息。

## 文档测试

Deno 允许你评估写在 JSDoc 或 markdown
文件中的代码片段。这确保了你文档中的示例是最新且功能正常的。

### 示例代码块

````ts title="example.ts"
/**
 * # 示例
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(1, 2);
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
````

三重反引号标记代码块的开始和结束，语言由语言标识符属性确定，该属性可以是以下之一：

- `js`
- `javascript`
- `mjs`
- `cjs`
- `jsx`
- `ts`
- `typescript`
- `mts`
- `cts`
- `tsx`

如果未指定语言标识符，则语言将从提取代码块的源文档的媒体类型推断出来。

```sh
deno test --doc example.ts
```

上述命令将提取此示例，将其转换为如下所示的伪测试用例：

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add } from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(1, 2);
  assertEquals(sum, 3);
});
```

然后将其作为与正在记录的模块位于同一目录中的独立模块运行。

:::tip 只想进行类型检查？

如果你想在不实际运行代码片段的情况下对 JSDoc 和 markdown
文件中的代码片段进行类型检查，可以使用
[`deno check`](/runtime/reference/cli/check/) 命令，并带有 `--doc` 选项（用于
JSDoc）或 `--doc-only` 选项（用于 markdown）。

:::

### 导出的项目会自动导入

查看上面生成的测试代码，你会注意到它包含了 `import` 语句来导入 `add`
函数，即使原始代码块中没有它。在记录模块时，从模块导出的任何项目都会使用相同的名称自动包含在生成的测试代码中。

假设我们有以下模块：

````ts title="example.ts"
/**
 * # 示例
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(ONE, getTwo());
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}

export const ONE = 1;
export default function getTwo() {
  return 2;
}
````

这将转换为以下测试用例：

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add, ONE }, getTwo from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(ONE, getTwo());
  assertEquals(sum, 3);
});
```

### 跳过代码块

你可以通过添加 `ignore` 属性来跳过代码块的评估。

````ts
/**
 * 此代码块将不会运行。
 *
 * ```ts ignore
 * await sendEmail("deno@example.com");
 * ```
 */
export async function sendEmail(to: string) {
  // 向给定地址发送电子邮件...
}
````

## 清理器

测试运行器提供了几个清理器，以确保测试行为合理且符合预期。

### 资源清理器

资源清理器确保测试期间创建的所有 I/O 资源都已关闭，以防止泄漏。

I/O 资源包括 `Deno.FsFile` 句柄、网络连接、`fetch`
主体、计时器和其他不会自动垃圾回收的资源。

你应该在使用完资源后始终关闭它们。例如，关闭文件：

```ts
const file = await Deno.open("hello.txt");
// 对文件执行某些操作
file.close(); // <- 使用完文件后始终关闭它
```

关闭网络连接：

```ts
const conn = await Deno.connect({ hostname: "example.com", port: 80 });
// 对连接执行某些操作
conn.close(); // <- 使用完连接后始终关闭它
```

关闭 `fetch` 主体：

```ts
const response = await fetch("https://example.com");
// 对响应执行某些操作
await response.body?.cancel(); // <- 如果你没有以其他方式消费它，使用完主体后始终取消它
```

此清理器默认启用，但可以在测试中通过 `sanitizeResources: false` 禁用：

```ts
Deno.test({
  name: "泄漏资源测试",
  async fn() {
    await Deno.open("hello.txt");
  },
  sanitizeResources: false,
});
```

### 异步操作清理器

异步操作清理器确保测试中启动的所有异步操作在测试结束前完成。这很重要，因为如果异步操作未被等待，测试将在操作完成前结束，并且即使操作可能实际上失败了，测试也会被标记为成功。

你应该始终在测试中等待所有异步操作。例如：

```ts
Deno.test({
  name: "异步操作测试",
  async fn() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});
```

此清理器默认启用，但可以通过 `sanitizeOps: false` 禁用：

```ts
Deno.test({
  name: "泄漏操作测试",
  fn() {
    crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("a".repeat(100000000)),
    );
  },
  sanitizeOps: false,
});
```

### 退出清理器

退出清理器确保测试代码不会调用 `Deno.exit()`，这可能会发出错误的测试成功信号。

此清理器默认启用，但可以通过 `sanitizeExit: false` 禁用。

```ts
Deno.test({
  name: "错误成功",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// 此测试永远不会运行，因为进程在 "错误成功" 测试期间退出
Deno.test({
  name: "失败测试",
  fn() {
    throw new Error("此测试失败");
  },
});
```

## 快照测试

[Deno 标准库](/runtime/fundamentals/standard_library/) 包含一个
[快照模块](https://jsr.io/@std/testing/doc/snapshot/~)，允许开发者通过将值与参考快照进行比较来编写测试。这些快照是原始值的序列化表示，并与测试文件一起存储。

快照测试能够以非常少的代码捕获各种错误。在难以精确表达应该断言什么的情况下，或者测试所做的断言预计会经常变化的情况下，它特别有用。
