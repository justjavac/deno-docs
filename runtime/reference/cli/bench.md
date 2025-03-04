---
title: "`deno bench`，基准测试工具"
oldUrl:
 - /runtime/manual/tools/benchmarker/
 - /runtime/reference/cli/benchmarker/
command: bench
---

## 快速开始

首先，我们创建一个文件 `url_bench.ts`，并使用 `Deno.bench()`
函数注册一个基准测试。

```ts
// url_bench.ts
Deno.bench("URL 解析", () => {
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
URL 解析   17.29 µs/iter  (16.67 µs … 153.62 µs)  17.25 µs  18.92 µs  22.25 µs
```

## 编写基准测试

要定义一个基准测试，你需要通过调用 `Deno.bench` API 来注册它。该 API
有多个重载，以提供最大的灵活性，并允许在不同形式之间轻松切换（例如，当你需要快速专注于单个基准测试进行调试时，可以使用
`only: true` 选项）：

```ts
// 紧凑形式：名称和函数
Deno.bench("hello world #1", () => {
  new URL("https://deno.land");
});

// 紧凑形式：命名函数。
Deno.bench(function helloWorld3() {
  new URL("https://deno.land");
});

// 较长形式：基准测试定义。
Deno.bench({
  name: "hello world #2",
  fn: () => {
    new URL("https://deno.land");
  },
});

// 类似于紧凑形式，第二个参数为附加配置。
Deno.bench("hello world #4", { permissions: { read: true } }, () => {
  new URL("https://deno.land");
});

// 类似于较长形式，第二个参数为基准测试函数。
Deno.bench(
  { name: "hello world #5", permissions: { read: true } },
  () => {
    new URL("https://deno.land");
  },
);

// 类似于较长形式，第二个参数为命名的基准测试函数。
Deno.bench({ permissions: { read: true } }, function helloWorld6() {
  new URL("https://deno.land");
});
```

### 异步函数

你也可以通过传递一个返回 promise
的基准测试函数来测试异步代码。为此，你可以在定义函数时使用 `async` 关键字：

```ts
Deno.bench("async hello world", async () => {
  await 1;
});
```

### 关键部分

有时，基准测试用例需要包含设置和清理代码，这些代码可能会影响基准测试结果。例如，如果你想测量读取一个小文件所需的时间，你需要打开文件、读取它，然后关闭它。如果文件足够小，打开和关闭文件所需的时间可能会超过读取文件本身的时间。

为了帮助处理这种情况，你可以使用 `Deno.BenchContext.start` 和
`Deno.BenchContext.end`
来告诉基准测试工具你想要测量的关键部分。这两个调用之间的部分将被排除在测量之外。

```ts
Deno.bench("foo", async (b) => {
  // 打开一个我们将要操作的文件。
  using file = await Deno.open("a_big_data_file.txt");

  // 告诉基准测试工具这是你唯一想要测量的部分。
  b.start();

  // 现在让我们测量从文件中读取所有数据所需的时间。
  await new Response(file.readable).arrayBuffer();

  // 在此结束测量。
  b.end();
});
```

上述示例需要 `--allow-read`
标志来运行基准测试：`deno bench --allow-read file_reading.ts`。

## 分组和基线

在注册基准测试用例时，可以使用 `Deno.BenchDefinition.group`
选项将其分配到一个组中：

```ts
// url_bench.ts
Deno.bench("url 解析", { group: "url" }, () => {
  new URL("https://deno.land");
});
```

将多个用例分配到一个组中并比较它们与“基线”用例的性能是很有用的。

在这个例子中，我们将检查 `Date.now()` 与 `performance.now()`
的性能，为此我们将第一个用例标记为“基线”，使用 `Deno.BenchDefinition.baseline`
选项：

```ts
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

summary
  Date.now()
   21.29x times faster than performance.now()
```

你可以在同一个文件中指定多个组。

## 运行基准测试

要运行基准测试，请使用包含基准测试函数的文件调用
`deno bench`。你也可以省略文件名，在这种情况下，当前目录（递归）中匹配 glob
`{*_,*.,}bench.{ts, tsx, mts, js, mjs, jsx}`
的所有基准测试都将运行。如果你传递一个目录，该目录中匹配此 glob
的所有文件都将运行。

glob 扩展为：

- 名为 `bench.{ts, tsx, mts, js, mjs, jsx}` 的文件，
- 或以 `.bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件，
- 或以 `_bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件

```shell
# 运行当前目录和所有子目录中的所有基准测试
deno bench

# 运行 util 目录中的所有基准测试
deno bench util/

# 仅运行 my_bench.ts
deno bench my_bench.ts
```

> ⚠️ 如果你想将额外的 CLI 参数传递给基准测试文件，请使用 `--` 来告知 Deno
> 剩余的参数是脚本参数。

```shell
# 将额外参数传递给基准测试文件
deno bench my_bench.ts -- -e --foo --bar
```

`deno bench` 使用与 `deno run` 相同的权限模型，因此需要例如 `--allow-write`
来在基准测试期间写入文件系统。

要查看 `deno bench` 的所有运行时选项，你可以参考命令行帮助：

```shell
deno help bench
```

## 过滤

有许多选项可以过滤你正在运行的基准测试。

### 命令行过滤

可以使用命令行 `--filter` 选项单独或分组运行基准测试。

过滤标志接受字符串或模式作为值。

假设有以下基准测试：

```ts
Deno.bench({
  name: "my-bench",
  fn: () => {/* bench function zero */},
});
Deno.bench({
  name: "bench-1",
  fn: () => {/* bench function one */},
});
Deno.bench({
  name: "bench2",
  fn: () => {/* bench function two */},
});
```

此命令将运行所有这些基准测试，因为它们都包含“bench”一词。

```shell
deno bench --filter "bench" benchmarks/
```

另一方面，以下命令使用模式，将运行第二个和第三个基准测试。

```shell
deno bench --filter "/bench-*\d/" benchmarks/
```

_要让 Deno 知道你想使用模式，请用正斜杠包裹你的过滤器，就像 JavaScript
中正则表达式的语法糖。_

### 基准测试定义过滤

在基准测试本身中，你有两个过滤选项。

#### 过滤掉（忽略这些基准测试）

有时你想根据某种条件忽略基准测试（例如，你只希望在 Windows
上运行基准测试）。为此，你可以在基准测试定义中使用 `ignore` 布尔值。如果设置为
true，基准测试将被跳过。

```ts
Deno.bench({
  name: "bench windows feature",
  ignore: Deno.build.os !== "windows",
  fn() {
    // do windows feature
  },
});
```

#### 过滤进（仅运行这些基准测试）

有时你可能在一个大型基准测试类中遇到性能问题，并且你希望暂时只专注于该单个基准测试，而忽略其余部分。为此，你可以使用
`only` 选项来告诉基准测试工具仅运行将此选项设置为 true
的基准测试。多个基准测试可以设置此选项。虽然基准测试运行将报告每个基准测试的成功或失败，但如果任何基准测试被标记为
`only`，则整个基准测试运行将始终失败，因为这只是临时措施，禁用了几乎所有基准测试。

```ts
Deno.bench({
  name: "Focus on this bench only",
  only: true,
  fn() {
    // bench complicated stuff
  },
});
```

## JSON 输出

要获取 JSON 格式的输出，请使用 `--json` 标志：

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
