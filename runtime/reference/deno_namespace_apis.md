---
title: "Deno 命名空间 API"
oldUrl:
- /runtime/manual/runtime/
- /runtime/manual/runtime/builtin_apis/
- /runtime/manual/runtime/permission_apis/
- /runtime/manual/runtime/import_meta_api/
- /runtime/manual/runtime/ffi_api/
- /runtime/manual/runtime/program_lifecycle/
---

全局 `Deno` 命名空间包含非 Web 标准的 API，包括用于读取文件、打开 TCP
套接字、提供 HTTP 服务以及执行子进程等的 API。

<a href="/api/deno/" class="docs-cta runtime-cta">探索所有 Deno API</a>

下面我们重点介绍一些最重要的 Deno API。

## 文件系统

Deno
运行时提供了[用于处理文件和目录的各种函数](/api/deno/file-system)。你需要使用
`--allow-read` 和 `--allow-write` 权限来访问文件系统。

请参考以下链接获取如何使用文件系统函数的代码示例。

- [以流的形式读取文件](/examples/file_server_tutorial/)
- [读取文本文件 (`Deno.readTextFile`)](/examples/reading_files/)
- [写入文本文件 (`Deno.writeTextFile`)](/examples/writing_files/)

## 网络

Deno 运行时提供了[用于处理网络端口连接的内置函数](/api/deno/network)。

请参考以下链接获取常见函数的代码示例。

- [连接到主机名和端口 (`Deno.connect`)](/api/deno/~/Deno.connect)
- [在本地传输地址上监听 (`Deno.listen`)](/api/deno/~/Deno.listen)

## 子进程

Deno 运行时提供了[用于启动子进程的内置函数](/api/deno/sub-process)。

请参考以下链接获取如何创建子进程的代码示例。

- [创建子进程 (`Deno.Command`)](/runtime/tutorials/subprocess/)

## 错误

Deno
运行时提供了[20 个错误类](/api/deno/errors)，这些错误类可以在多种条件下被抛出。

一些示例如下：

```sh
Deno.errors.NotFound;
Deno.errors.WriteZero;
```

它们可以如下使用：

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("文件未找到");
  } else {
    // 否则重新抛出
    throw error;
  }
}
```

## HTTP 服务器

Deno 有两个 HTTP 服务器 API：

- [`Deno.serve`](/api/deno/~/Deno.serve)：原生、_更高级_，支持 HTTP/1.1 和
  HTTP2，这是 Deno 中编写 HTTP 服务器的首选 API。
- [`Deno.serveHttp`](/api/deno/~/Deno.serveHttp)：原生、_低级_，支持 HTTP/1.1 和
  HTTP2。

要在给定端口上启动 HTTP 服务器，请使用 `Deno.serve`
函数。该函数接受一个处理函数，该函数将为每个传入的请求调用，并期望返回一个响应（或解析为响应的
Promise）。例如：

```ts
Deno.serve((_req) => {
  return new Response("Hello, World!");
});
```

默认情况下，`Deno.serve` 会监听端口
`8000`，但可以通过在选项对象中传递端口号作为第一个或第二个参数来更改。

你可以[阅读更多关于如何使用 HTTP 服务器 API 的信息](/runtime/fundamentals/http_server/)。

## 权限

权限在运行 `deno` 命令时通过 CLI
授予。用户代码通常会假设自己需要一组权限，但在执行过程中无法保证**授予**的权限集与此一致。

在某些情况下，确保程序的容错性需要一种在运行时与权限系统交互的方式。

### 权限描述符

在 CLI 中，对 `/foo/bar` 的读取权限表示为 `--allow-read=/foo/bar`。在运行时的 JS
中，它表示如下：

```ts
const desc = { name: "read", path: "/foo/bar" } as const;
```

其他示例：

```ts
// 全局写权限。
const desc1 = { name: "write" } as const;

// 对 `$PWD/foo/bar` 的写权限。
const desc2 = { name: "write", path: "foo/bar" } as const;

// 全局网络权限。
const desc3 = { name: "net" } as const;

// 对 127.0.0.1:8000 的网络权限。
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;

// 高精度时间权限。
const desc5 = { name: "hrtime" } as const;
```

有关更多详细信息，请参阅 API 参考中的
[`PermissionDescriptor`](/api/deno/~/Deno.PermissionDescriptor)。所有下面描述的
API 都有同步 API 对应项（例如 `Deno.permissions.querySync`）。

### 查询权限

通过描述符检查权限是否被授予。

```ts
// deno run --allow-read=/foo main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "granted", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

如果使用 `--deny-read` 标志来限制某些文件路径，结果将包含
`partial: true`，表示并非所有子路径都被授予权限：

```ts
// deno run --allow-read=/foo --deny-read=/foo/bar main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: true }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "denied", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

### 权限状态

权限状态可以是 "granted"、"prompt" 或 "denied"。从 CLI 授予的权限将查询为
`{ state: "granted" }`。未授予的权限默认查询为 `{ state: "prompt" }`，而
`{ state: "denied" }` 保留给明确拒绝的权限。这将在[请求权限](#请求权限)中出现。

### 权限强度

对[查询权限](#查询权限)中第二个查询结果的直观理解是，读取权限被授予了 `/foo`，而
`/foo/bar` 在 `/foo` 内，因此 `/foo/bar` 允许被读取。这成立，除非 CLI
授予的权限相对于查询的权限是_部分_的（作为使用 `--deny-*` 标志的结果）。

我们还可以说 `desc1` 比 `desc2` 更强。这意味着对于任何 CLI 授予的权限集：

1. 如果 `desc1` 查询为 `{ state: "granted", partial: false }`，那么 `desc2`
   也必须如此。
2. 如果 `desc2` 查询为 `{ state: "denied", partial: false }`，那么 `desc1`
   也必须如此。

更多示例：

```ts
const desc1 = { name: "write" } as const;
// 比
const desc2 = { name: "write", path: "/foo" } as const;

const desc3 = { name: "net", host: "127.0.0.1" } as const;
// 比
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;
```

### 请求权限

通过 CLI 提示向用户请求未授予的权限。

```ts
// deno run main.ts

const desc1 = { name: "read", path: "/foo" } as const;
const status1 = await Deno.permissions.request(desc1);
// ⚠️ Deno 请求读取 "/foo" 的权限。授予？[y/n (y = 是允许, n = 否拒绝)] y
console.log(status1);
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/bar" } as const;
const status2 = await Deno.permissions.request(desc2);
// ⚠️ Deno 请求读取 "/bar" 的权限。授予？[y/n (y = 是允许, n = 否拒绝)] n
console.log(status2);
// PermissionStatus { state: "denied", partial: false }
```

如果当前权限状态为
"prompt"，则会在用户终端上显示提示，询问他们是否愿意授予请求。`desc1`
的请求被授予，因此其新状态返回，并且执行将继续，就像在 CLI 上指定了
`--allow-read=/foo` 一样。`desc2` 的请求被拒绝，因此其权限状态从 "prompt" 降级为
"denied"。

如果当前权限状态已经是 "granted" 或
"denied"，请求将像查询一样行为，并仅返回当前状态。这可以防止对已经授予的权限和之前拒绝的请求显示提示。

### 撤销权限

将权限从 "granted" 降级为 "prompt"。

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
```

当你尝试撤销相对于 CLI 授予的权限是_部分_的权限时会发生什么？

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
const cliDesc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(cliDesc));
// PermissionStatus { state: "prompt", partial: false }
```

CLI 授予的权限，隐含了被撤销的权限，也被撤销了。

为了理解这种行为，想象一下 Deno 存储了一组_明确授予的权限描述符_。在 CLI 上指定
`--allow-read=/foo,/bar` 会将该集合初始化为：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
];
```

授予运行时请求 `{ name: "write", path: "/foo" }` 会将该集合更新为：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
  { name: "write", path: "/foo" },
];
```

Deno 的权限撤销算法通过从该集合中删除比参数权限描述符_更强_的每个元素来工作。

Deno
不允许“碎片化”的权限状态，其中某些强权限被授予，但排除了由其隐含的弱权限。随着你考虑更广泛的使用案例和
`"denied"`
状态，这样的系统将变得越来越复杂和不可预测。这是为了安全性而牺牲了细粒度的一个权衡。

## import.meta

Deno 支持
[`import.meta`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta)
API 上的许多属性和方法。它可以用于获取有关模块的信息，例如模块的 URL。

### import.meta.url

返回当前模块的 URL。

```ts title="main.ts"
console.log(import.meta.url);
```

```sh
$ deno run main.ts
file:///dev/main.ts

$ deno run https:/example.com/main.ts
https://example.com/main.ts
```

### import.meta.main

返回当前模块是否是你程序的入口点。

```ts title="main.ts"
import "./other.ts";

console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```ts title="other.ts"
console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```sh
$ deno run main.ts
Is file:///dev/other.ts the main module? false
Is file:///dev/main.ts the main module? true
```

### import.meta.filename

_此属性仅适用于本地模块（具有 `file:///...` 标识符的模块），对于远程模块返回
`undefined`。_

返回当前模块的完全解析路径。该值包含操作系统特定的路径分隔符。

```ts title="main.ts"
console.log(import.meta.filename);
```

在 Unix 上：

```sh
$ deno run main.ts
/dev/main.ts

$ deno run https://example.com/main.ts
undefined
```

在 Windows 上：

```sh
$ deno run main.ts
C:\dev\main.ts

$ deno run https://example.com/main.ts
undefined
```

### import.meta.dirname

_此属性仅适用于本地模块（具有 `file:///...` 标识符的模块），对于远程模块返回
`undefined`。_

返回包含当前模块的目录的完全解析路径。该值包含操作系统特定的路径分隔符。

```ts title="main.ts"
console.log(import.meta.dirname);
```

在 Unix 上：

```sh
$ deno run main.ts
/dev/

$ deno run https://example.com/main.ts
undefined
```

在 Windows 上：

```sh
$ deno run main.ts
C:\dev\

$ deno run https://example.com/main.ts
undefined
```

### import.meta.resolve

相对于当前模块解析标识符。

```ts
const worker = new Worker(import.meta.resolve("./worker.ts"));
```

`import.meta.resolve` API 考虑了当前应用的导入映射，这使你也能够解析“裸”标识符。

加载了这样的导入映射...

```json
{
  "imports": {
    "fresh": "https://deno.land/x/fresh@1.0.1/dev.ts"
  }
}
```

...你现在可以解析：

```js title="resolve.js"
console.log(import.meta.resolve("fresh"));
```

```sh
$ deno run resolve.js
https://deno.land/x/fresh@1.0.1/dev.ts
```

## FFI

FFI（外部函数接口）API 允许用户使用 `Deno.dlopen` 调用支持 C
ABI（C/C++、Rust、Zig、V 等）的本地语言编写的库。

以下是一个展示如何从 Deno 调用 Rust 函数的示例：

```rust
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

将其编译为 C 动态库（在 Linux 上为 `libadd.so`）：

```sh
rustc --crate-type cdylib add.rs
```

在 C 中可以这样写：

```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

并编译它：

```sh
// unix
cc -c -o add.o add.c
cc -shared -W -o libadd.so add.o
// Windows
cl /LD add.c /link /EXPORT:add
```

从 Deno 调用该库：

```typescript
// ffi.ts

// 根据你的操作系统确定库扩展名。
let libSuffix = "";
switch (Deno.build.os) {
  case "windows":
    libSuffix = "dll";
    break;
  case "darwin":
    libSuffix = "dylib";
    break;
  default:
    libSuffix = "so";
    break;
}

const libName = `./libadd.${libSuffix}`;
// 打开库并定义导出的符号
const dylib = Deno.dlopen(
  libName,
  {
    "add": { parameters: ["isize", "isize"], result: "isize" },
  } as const,
);

// 调用符号 `add`
const result = dylib.symbols.add(35, 34); // 69

console.log(`外部加法 35 和 34 的结果：${result}`);
```

使用 `--allow-ffi` 和 `--unstable` 标志运行：

```sh
deno run --allow-ffi --unstable ffi.ts
```

### 非阻塞 FFI

有许多用例中，用户可能希望在后台运行 CPU 密集型的 FFI
函数，而不阻塞主线程上的其他任务。

从 Deno 1.15 开始，可以在 `Deno.dlopen` 中将符号标记为
`nonblocking`。这些函数调用将在专用的阻塞线程上运行，并返回一个解析为所需
`result` 的 `Promise`。

使用 Deno 执行昂贵的 FFI 调用的示例：

```c
// sleep.c
#ifdef _WIN32
#include <Windows.h>
#else
#include <time.h>
#endif

int sleep(unsigned int ms) {
  #ifdef _WIN32
  Sleep(ms);
  #else
  struct timespec ts;
  ts.tv_sec = ms / 1000;
  ts.tv_nsec = (ms % 1000) * 1000000;
  nanosleep(&ts, NULL);
  #endif
}
```

从 Deno 调用它：

```typescript
// nonblocking_ffi.ts
const library = Deno.dlopen(
  "./sleep.so",
  {
    sleep: {
      parameters: ["usize"],
      result: "void",
      nonblocking: true,
    },
  } as const,
);

library.symbols.sleep(500).then(() => console.log("After"));
console.log("Before");
```

结果：

```sh
$ deno run --allow-ffi --unstable unblocking_ffi.ts
Before
After
```

### 回调
