# 基准测试工具

Deno 内置了一个基准测试运行器，您可以用它来检查 JavaScript 或 TypeScript
代码的性能。

## 快速入门

首先，让我们创建一个文件 `url_bench.ts`，并使用 `Deno.bench()`
函数注册一个基准测试。

```ts
// url_bench.ts
Deno.bench("URL解析", () => {
  new URL("https://deno.land");
});
```

其次，使用 `deno bench` 子命令运行基准测试。

```sh
deno bench url_bench.ts
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/url_bench.ts
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
URL解析   17.29 µs/iter  (16.67 µs … 153.62 µs)  17.25 µs  18.92 µs  22.25 µs
```

## 编写基准测试

要定义一个基准测试，您需要使用 `Deno.bench` API 注册它。此 API
有多个重载，以允许在不同形式之间轻松切换（例如，当您需要快速调试单个基准测试时，可以使用
`only: true` 选项）：

```ts
// 简洁形式：名称和函数
Deno.bench("你好，世界 #1", () => {
  new URL("https://deno.land");
});

// 简洁形式：命名函数。
Deno.bench(function 你好世界3() {
  new URL("https://deno.land");
});

// 较长形式：基准测试定义。
Deno.bench({
  name: "你好，世界 #2",
  fn: () => {
    new URL("https://deno.land");
  },
});

// 类似于简洁形式，第二个参数作为附加配置。
Deno.bench("你好，世界 #4", { permissions: { read: true } }, () => {
  new URL("https://deno.land");
});

// 类似于较长形式，将基准测试函数作为第二个参数。
Deno.bench(
  { name: "你好，世界 #5", permissions: { read: true } },
  () => {
    new URL("https://deno.land");
  },
);

// 类似于较长形式，将命名的基准测试函数作为第二个参数。
Deno.bench({ permissions: { read: true } }, function 你好世界6() {
  new URL("https://deno.land");
});
```

### 异步函数

您还可以通过传递返回 Promise
的基准测试函数来测试异步代码。为此，您可以在定义函数时使用 `async` 关键字：

```ts
Deno.bench("异步你好，世界", async () => {
  await 1;
});
```

### 临界区

有时，基准测试需要包括会影响基准测试结果的设置和拆卸代码。例如，如果要测量读取小文件所需的时间，您需要打开文件、读取文件，然后关闭文件。如果文件足够小，那么打开和关闭文件所需的时间可能超过了读取文件本身所需的时间。

为了帮助处理这种情况，您可以使用 `Deno.BenchContext.start` 和
`Deno.BenchContext.end`
告诉基准测试工具要测量的关键部分。这两个调用之外的所有内容都将被排除在测量之外。

```ts, ignore
import { readAll } from "https://deno.land/std@$STD_VERSION/streams/mod.ts";

Deno.bench("foo", async (b) => {
  // 打开要操作的文件。
  const file = await Deno.open("a_big_data_file.txt");

  // 告诉基准测试工具这是唯一要测量的部分。
  b.start();

  // 现在让我们测量从文件中读取所有数据所需的时间。
  await readAll(file);

  // 在此结束测量。
  b.end();

  // 现在我们可以执行一些可能耗时的拆卸操作，不会影响基准测试结果。
  file.close();
});
```

## 分组和基线

在注册基准测试用例时，可以使用 `Deno.BenchDefinition.group`
选项将其分配到一个组中：

```ts, ignore
// url_bench.ts
Deno.bench("URL解析", { group: "url" }, () => {
  new URL("https://deno.land");
});
```

将多个用例分配到一个组中，然后比较它们的性能与“基线”用例相比如何表现是有用的，可以使用
`Deno.BenchDefinition.baseline` 选项将第一个用例标记为“基线”：

```ts, ignore
// time_bench.ts
Deno.bench("Date.now()", { group: "timing", baseline: true }, () => {
  Date.now();
});

Deno.bench("performance.now()", { group: "timing" }, () => {
  performance.now();
});
```

```shellsesssion
$ deno bench time_bench.ts
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/time_bench.ts
benchmark              time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------- -----------------------------
Date.now()         125.24 ns/iter (118.98 ns … 559.95 ns) 123.62 ns 150.69 ns 156.63 ns
performance.now()    2.67 µs/iter     (2.64 µs … 2.82 µs)   2.67 µs   2.82 µs   2.82 µs

摘要
  Date.now()
   比performance.now()快21.29倍
```

您可以在同一文件中指定多个组。

## 运行基准测试

要运行基准测试，请调用 `deno bench`
并提供包含您的基准测试函数的文件。您还可以省略文件名，此时将运行当前目录（递归）中与
glob `{*_,*.,}bench.{ts, tsx, mts, js, mjs, jsx}`
匹配的所有基准测试。如果传递一个目录，将运行该目录中与此 glob 匹配的所有文件。

此 glob 展开为：

- 命名为 `bench.{ts, tsx, mts, js, mjs, jsx}` 的文件，
- 或以 `.bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件，
- 或以 `_bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件。

```shell
运行当前目录和所有子目录中的所有基准测试
deno bench

# 运行 util 目录中的所有基准测试
deno bench util/

# 仅运行 my_bench.ts
deno bench my_bench.ts
```

> ⚠️ 如果要向基准测试文件传递额外的命令行参数，请使用 `--` 通知 Deno
> 剩余的参数是脚本参数。

```shell
向基准测试文件传递额外参数
deno bench my_bench.ts -- -e --foo --bar
```

`deno bench` 使用与 `deno run` 相同的权限模型，因此例如，需要 `--allow-write`
权限来在基准测试期间写入文件系统。

要查看所有与 `deno bench` 相关的运行时选项，您可以参考命令行帮助：

```shell
deno help bench
```

## 过滤

有多种选项可用于过滤您要运行的基准测试。

### 命令行过滤

使用命令行 `--filter` 选项，可以单独运行基准测试或以组的方式运行。

过滤标志接受字符串或模式作为值。

假设有以下基准测试：

```ts
Deno.bench({
  name: "my-bench",
  fn: () => {/* 基准测试函数零 */},
});
Deno.bench({
  name: "bench-1",
  fn: () => {/* 基准测试函数一 */},
});
Deno.bench({
  name: "bench2",
  fn: () => {/* 基准测试函数二 */},
});
```

以下命令将运行所有这些基准测试，因为它们都包含单词 "bench"。

```shell
deno bench --filter "bench" benchmarks/
```

另一方面，以下命令使用模式，并将运行第二个和第三个基准测试。

```shell
deno bench --filter "/bench-*\d/" benchmarks/
```

为了让 Deno 知道您要使用模式，请使用前斜杠包围您的过滤器，就像 JavaScript
正则表达式的语法糖一样。

### 基准测试定义过滤

在基准测试本身中，您有两种过滤选项。

#### 过滤掉（忽略这些基准测试）

有时，您希望基于某种条件来忽略基准测试（例如，只希望在 Windows
上运行基准测试）。为此，您可以在基准测试定义中使用 `ignore` 布尔值。如果设置为
true，基准测试将被跳过。

```ts
Deno.bench({
  name: "bench windows feature",
  ignore: Deno.build.os !== "windows",
  fn() {
    // 执行 Windows 特性
  },
});
```

#### 过滤入（仅运行这些基准测试）

有时，您可能在大型基准测试类中遇到性能问题，并希望仅关注其中的一个基准测试，暂时忽略其他的。为此，可以使用
`only` 选项，告诉基准测试框架仅运行设置为 true
的基准测试。可以为多个基准测试设置此选项。虽然基准测试运行将报告每个基准测试的成功或失败，但如果任何基准测试标记为
`only`，则整个基准测试运行将失败，因为这仅是一个临时措施，仅禁用几乎所有基准测试。

```ts
Deno.bench({
  name: "仅关注此基准测试",
  only: true,
  fn() {
    // 执行复杂的工作
  },
});
```

## JSON 输出

要以 JSON 格式检索输出，使用 `--json` 标志：

```
$ deno bench --json bench_me.js
{
  "runtime": "Deno/1.31.0 x86_64-apple-darwin",
  "cpu": "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
  "benches": [
    "origin": "file:///dev/bench_me.js",
    "group": null,
    "name": "Deno.UnsafePointerView#getUint32",
    "baseline": false,
    "result": {
      "ok": {
        "n": 49,
        "min": 1251.9348,
        "max": 1441.2696,
        "avg": 1308.7523755102038,
        "p75": 1324.1055,
        "p99": 1441.2696,
        "p995": 1441.2696,
        "p999": 1441.2696
      }
    }
  ]
}
```
