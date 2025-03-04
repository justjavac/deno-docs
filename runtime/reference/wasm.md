---
title: "WebAssembly"
oldUrl:
  - /runtime/manual/getting_started/webassembly/
  - /runtime/manual/runtime/webassembly/
  - /runtime/manual/runtime/webassembly/using_wasm/
  - /runtime/manual/runtime/webassembly/using_streaming_wasm/
  - /runtime/manual/runtime/webassembly/wasm_resources/
---

[WebAssembly](https://webassembly.org/) (Wasm) 旨在与 JavaScript
一起使用，以加速关键应用程序组件，其执行速度比 JavaScript 更高且更稳定，类似于
C、C++ 或 Rust。Deno 可以通过与
[浏览器提供的相同接口](https://developer.mozilla.org/zh-CN/docs/WebAssembly)
执行 WebAssembly 模块，并将其作为模块导入。

## Wasm 模块

从 Deno 2.1 开始，可以导入 WebAssembly 模块，并且其使用会进行类型检查。

假设我们有一个
[WebAssembly 文本格式](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Understanding_the_text_format)
文件，它导出了一个 `add` 函数，该函数将两个数字相加并返回结果：

```wat title="add.wat"
(module
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
)
```

我们可以通过 [wat2wasm](https://github.com/webassembly/wabt) 将其编译为
`add.wasm`：

```sh
wat2wasm add.wat
```

然后通过导入语句使用这个 WebAssembly 模块：

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, 2));
```

```shellsession
> deno run main.ts
3
```

### 类型检查

Deno 理解 Wasm
模块的导出并对其使用进行类型检查。如果我们在前面的示例中错误地调用了 `add`
函数，我们会看到一个类型检查错误。

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, ""));
```

```shellsession
> deno check main.ts   
Check file:///.../main.ts
error: TS2345 [ERROR]: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(add(1, ""));
                   ~~
    at file:///.../main.ts:3:20
```

### 导入

与 JavaScript 类似，Wasm 模块也可以导入其他模块。

例如，我们可以创建一个 Wasm 模块，它导入 `"./values.js"` 说明符并调用 `getValue`
导出：

```wat title="toolkit.wat"
(module
  (import "./time.ts" "getTimeInSeconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="time.ts"
export function getTimeInSeconds() {
  return Date.now() / 1000;
}
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

现在运行：

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
1732147633
V:\scratch
> deno run main.ts
1732147637
```

#### 覆盖导入说明符

通常，Wasm 模块不使用相对说明符，以便于导入另一个 JavaScript
模块。假设我们有以下与之前类似的设置，但请注意，Wasm 模块是通过 "env"
说明符导入的。

```wat title="toolkit.wat"
(module
  (import "env" "get_time_in_seconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="env.ts"
function getTimeInSeconds() {
  return Date.now() / 1000;
}

export { getTimeInSeconds as get_time_in_seconds };
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
error: Relative import path "env" not prefixed with / or ./ or ../
    at file:///.../toolkit.wasm
```

这不太方便，因为我们希望它导入 `"./env.ts"`。

幸运的是，通过 [import map](https://github.com/WICG/import-maps) 在 _deno.json_
中映射说明符非常简单：

```json title="deno.json"
{
  "imports": {
    "env": "./env.ts"
  }
}
```

现在它可以工作了：

```shellsession
> deno run main.ts
1732148355
```

## 通过 WebAssembly API 使用 WebAssembly

要在 Deno 中运行 WebAssembly，你只需要一个 Wasm 模块来运行。以下模块导出了一个
`main` 函数，该函数在调用时返回 `42`：

```ts
// deno-fmt-ignore
const wasmCode = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127,
  3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0,
  5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145,
  128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97,
  105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0,
  65, 42, 11
]);

const wasmModule = new WebAssembly.Module(wasmCode);

const wasmInstance = new WebAssembly.Instance(wasmModule);

const main = wasmInstance.exports.main as CallableFunction;
console.log(main().toString());
```

为了通过 WebAssembly API 加载 WebAssembly，需要执行以下步骤：

1. 获取二进制文件（通常以 `.wasm`
   文件的形式，尽管我们现在使用一个简单的字节数组）
2. 将二进制文件编译为 `WebAssembly.Module` 对象
3. 实例化 WebAssembly 模块

WebAssembly 是一种二进制数据格式，不适合人类阅读，也不适合手动编写。你的 `.wasm`
文件应该由 [Rust](https://www.rust-lang.org/)、[Go](https://golang.org/) 或
[AssemblyScript](https://www.assemblyscript.org/) 等语言的编译器生成。

例如，编译为上述字节的 Rust 程序可能如下所示：

```rust
#[no_mangle]
pub fn main() -> u32 { // u32 表示使用 32 位内存的无符号整数。
  42
}
```

## 使用流式 WebAssembly API

[最有效的方式](/api/web/~/WebAssembly.instantiateStreaming) 来获取、编译和实例化
WebAssembly 模块是使用 WebAssembly API 的流式变体。例如，你可以使用
`instantiateStreaming` 结合 `fetch` 来一次性执行所有三个步骤：

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

请注意，`.wasm` 文件必须以 `application/wasm` MIME
类型提供。如果你想在实例化之前对模块进行额外的工作，可以使用
[`compileStreaming`](/api/web/~/WebAssembly.compileStreaming)：

```ts
const module = await WebAssembly.compileStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

/* 做一些更多的事情 */

const instance = await WebAssembly.instantiate(module);
instance.exports.increment as (input: number) => number;
```

如果由于某种原因你无法使用流式方法，你可以回退到效率较低的
[`compile`](/api/web/~/WebAssembly.compile) 和
[`instantiate`](/api/web/~/WebAssembly.instantiate) 方法。

要深入了解流式方法为何更高效，[请查看这篇文章](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/)。

## WebAssembly API

有关 WebAssembly API 所有部分的更多信息，可以在
[Deno 参考指南](/api/web/~/WebAssembly) 和
[MDN](https://developer.mozilla.org/zh-CN/docs/WebAssembly) 上找到。

## 处理非数字类型

本文档中的代码示例仅在 WebAssembly
模块中使用了数字类型。要使用更复杂的类型（如字符串或类）运行
WebAssembly，你需要使用生成 JavaScript 和编译为 WebAssembly
的语言之间的类型绑定的工具。

有关如何在 JavaScript 和 Rust 之间创建类型绑定、将其编译为二进制文件并从
JavaScript 程序调用的示例，可以在
[MDN](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Rust_to_wasm)
上找到。

如果你计划在 Rust+WebAssembly 中大量使用 Web API，你可能会发现
[web_sys](https://rustwasm.github.io/wasm-bindgen/web-sys/index.html) 和
[js_sys](https://rustwasm.github.io/wasm-bindgen/contributing/js-sys/index.html)
Rust crate 很有用。`web_sys` 包含对 Deno 中可用的大多数 Web API 的绑定，而
`js_sys` 提供了对 JavaScript 标准内置对象的绑定。

## 优化

对于生产构建，你可以对 WebAssembly
二进制文件进行优化。如果你通过网络提供二进制文件，那么优化大小可以带来真正的差异。如果你主要在服务器上执行
WebAssembly
以执行计算密集型任务，优化速度可能是有益的。你可以在这里找到一个关于优化（生产）构建的
[好指南](https://rustwasm.github.io/docs/book/reference/code-size.html)。此外，[rust-wasm 小组](https://rustwasm.github.io/docs/book/reference/tools.html)
提供了一个可以用于优化和操作 WebAssembly 二进制文件的工具列表。
