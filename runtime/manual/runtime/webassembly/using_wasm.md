# 在 Deno 中使用 WebAssembly

要在 Deno 中运行 WebAssembly，您只需要一个二进制文件来运行。WebAssembly
是一种二进制数据格式。这意味着 `.wasm`
文件不是直接可读的，也不打算手工编写。相反，像 Rust、C++ 或 Go
这样的编程语言的编译器会生成 `.wasm` 文件。

以下二进制文件导出一个 `main` 函数，在调用时返回 `42`：

<!-- deno-fmt-ignore -->
```ts
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

如上面的代码所示，在 JavaScript 程序中加载 WebAssembly 需要执行以下步骤：

1. 获取二进制文件（通常以 `.wasm`
   文件的形式，尽管现在我们正在使用简单的字节数组）
2. 将二进制文件编译为 `WebAssembly.Module` 对象
3. 实例化 WebAssembly 模块

对于更复杂的情况，您可能希望使用编译成 WebAssembly
的编程语言，而不是手工编写指令。有许多可以实现这一点的编程语言，比如
[Rust](https://www.rust-lang.org/)、[Go](https://golang.org/) 或
[AssemblyScript](https://www.assemblyscript.org/)。例如，编译成上述字节的 Rust
程序可能如下所示：

```rust
pub fn main() -> u32 {  // u32 代表使用 32 位内存的无符号整数。
  42
}
```

除了前面示例中显示的方法，还可以使用 WebAssembly API 的流式方法，如下一页所示。
