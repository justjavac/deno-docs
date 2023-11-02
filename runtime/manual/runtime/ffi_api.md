# 外部函数接口（FFI）

从 Deno 1.13 开始，外部函数接口（Foreign Function Interface，FFI）API
允许用户调用使用 C ABI（C/C++、Rust、Zig、V 等）编写的本地语言库，使用
`Deno.dlopen`。

## 用法

以下是一个示例，展示了如何从 Deno 中调用 Rust 函数：

```rust
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

将其编译成 C 动态库（在 Linux 上为 `libadd.so`）：

```sh
rustc --crate-type cdylib add.rs
```

在 C 中，您可以编写如下：

```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

然后编译它：

```sh
// Unix
cc -c -o add.o add.c
cc -shared -W -o libadd.so add.o
// Windows
cl /LD add.c /link /EXPORT:add
```

从 Deno 调用库：

```typescript
// ffi.ts

// 根据您的操作系统确定库扩展名。
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

console.log(`从外部调用 35 和 34 的结果: ${result}`);
```

使用 `--allow-ffi` 和 `--unstable` 标志运行：

```sh
deno run --allow-ffi --unstable ffi.ts
```

## 非阻塞 FFI

有许多用例，用户可能希望在后台运行 CPU 绑定的 FFI
函数，而不会阻塞主线程上的其他任务。

截至 Deno 1.15，`Deno.dlopen` 中的符号可以标记为
`nonblocking`。这些函数调用将在专用的阻塞线程上运行，并将返回一个解析为所需
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

从 Deno 中调用它：

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

library.symbols.sleep(500).then(() => console.log("之后"));
console.log("之前");
```

结果：

```sh
$ deno run --allow-ffi --unstable unblocking_ffi.ts
之前
之后
```

## 回调

Deno FFI API 支持从 JavaScript 函数创建 C 回调，用于从动态库中调用
Deno。回调的创建和使用示例如下：

```typescript
// callback_ffi.ts
const library = Deno.dlopen(
  "./callback.so",
  {
    set_status_callback: {
      parameters: ["function"],
      result: "void",
    },
    start_long_operation: {
      parameters: [],
      result: "void",
    },
    check_status: {
      parameters: [],
      result: "void",
    },
  } as const,
);

const callback = new Deno.UnsafeCallback(
  {
    parameters: ["u8"],
    result: "void",
  } as const,
  (success: number) => {},
);

// 将回调指针传递给动态库
library.symbols.set_status_callback(callback.pointer);
// 启动不会阻塞线程的一些长时间运行的操作
library.symbols.start_long_operation();

// 后来，触发库来检查操作是否完成。
// 如果完成，此调用将触发回调。
library.symbols.check_status();
```

如果 `UnsafeCallback`
的回调函数引发错误，错误将传播到触发回调调用的函数（在上面，这将是
`check_status()`），并且可以在那里捕获。如果回调返回一个值引发异常，则 Deno
将返回 0（指针的空指针）作为结果。

默认情况下，`UnsafeCallback` 不会自动释放，因为它可能导致 use-after-free
错误。要正确释放 `UnsafeCallback`，必须调用其 `close()` 方法。

```typescript
const callback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" } as const,
  () => {},
);

// 在不再需要回调之后
callback.close();
// 不再安全地将回调作为参数传递。
```

对于本地库来说，也有可能设置中断处理程序并直接触发回调。然而，这不被推荐，并可能导致意外的副作用和未定义的行为。最好是中断处理程序仅设置一个标志，稍后可以类似于上面的
`check_status()` 一样进行轮询。

## 支持的类型

以下是目前由 Deno FFI API 支持的类型列表：

| FFI Type                | Deno                 | C                        | Rust                      |
| ----------------------- | -------------------- | ------------------------ | ------------------------- |
| `i8`                    | `number`             | `char` / `signed char`   | `i8`                      |
| `u8`                    | `number`             | `unsigned char`          | `u8`                      |
| `i16`                   | `number`             | `short int`              | `i16`                     |
| `u16`                   | `number`             | `unsigned short int`     | `u16`                     |
| `i32`                   | `number`             | `int` / `signed int`     | `i32`                     |
| `u32`                   | `number`             | `unsigned int`           | `u32`                     |
| `i64`                   | `number \| bigint`   | `long long int`          | `i64`                     |
| `u64`                   | `number \| bigint`   | `unsigned long long int` | `u64`                     |
| `usize`                 | `number \| bigint`   | `size_t`                 | `usize`                   |
| `isize`                 | `number \| bigint`   | `size_t`                 | `isize`                   |
| `f32`                   | `number \| bigint`   | `float`                  | `f32`                     |
| `f64`                   | `number \| bigint`   | `double`                 | `f64`                     |
| `void` [1]              | `undefined`          | `void`                   | `()`                      |
| `pointer`               | `{} \| null`         | `void *`                 | `*mut c_void`             |
| `buffer` [2]            | `TypedArray \| null` | `uint8_t *`              | `*mut u8`                 |
| `function` [3]          | `{} \| null`         | `void (*fun)()`          | `Option<extern "C" fn()>` |
| `{ struct: [...] }` [4] | `TypedArray`         | `struct MyStruct`        | `MyStruct`                |

截至 Deno 1.25 版本，`pointer` 类型已经被分成了 `pointer` 和 `buffer`
类型，以确保用户能够充分利用 Typed Arrays 的优化。截至 Deno 1.31 版本，`pointer`
的 JavaScript 表示已经变成了不透明指针对象或 `null` 用于空指针。

- [1] `void` 类型只能用作结果类型。
- [2] `buffer` 类型接受 TypedArrays
  作为参数，但当用作结果类型时，它总是返回一个指针对象或 `null`，就像 `pointer`
  类型一样。
- [3] `function` 类型在参数和结果类型上的行为与 `pointer` 类型完全相同。
- [4] `struct` 类型用于按值（拷贝）传递和返回 C 结构体。`struct`
  数组必须按顺序枚举每个结构体字段的类型。结构体会自动填充：通过使用适当数量的
  `u8` 字段来定义紧凑结构体，可以避免填充。只支持 TypedArrays
  作为结构体，并且结构体始终作为 `Uint8Array` 返回。

## deno_bindgen

[`deno_bindgen`](https://github.com/denoland/deno_bindgen)
是官方工具，用于简化用 Rust 编写的 Deno FFI 库的粘合代码生成。

它类似于 Rust WASM 生态系统中的
[`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen)。

以下是一个展示它的用法的示例：

```rust
// mul.rs
use deno_bindgen::deno_bindgen;

#[deno_bindgen]
struct Input {
  a: i32,
  b: i32,
}

#[deno_bindgen]
fn mul(input: Input) -> i32 {
  input.a * input.b
}
```

运行 `deno_bindgen` 以生成绑定。现在可以直接将它们导入 Deno：

```ts, ignore
// mul.ts
import { mul } from "./bindings/bindings.ts";
mul({ a: 10, b: 2 }); // 20
```

任何与 `deno_bindgen` 相关的问题应该报告到
https://github.com/denoland/deno_bindgen/issues。
