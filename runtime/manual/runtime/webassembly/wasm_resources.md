# 有用资源

此页面包含一些在使用和/或开发 WebAssembly 模块时有用的进一步信息。

## WebAssembly API

有关 WebAssembly API 的所有部分的进一步信息可以在
[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly) 上找到。

## 处理非数字类型

本章中的代码示例仅使用了 WebAssembly
模块中的数值类型。要运行具有更复杂类型（字符串、类）的
WebAssembly，您将需要使用工具来生成 JavaScript 和用于编译为 WebAssembly
的语言之间的类型绑定。

有关如何在 JavaScript 和 Rust 之间创建类型绑定的示例，将其编译成二进制文件，并从
JavaScript 程序中调用它的示例可以在
[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm)
上找到。

如果您计划在 Rust+WebAssembly 中大量使用 Web API，您可能会发现
[Rust crates](https://rustwasm.github.io/wasm-bindgen/web-sys/index.html) 中的
`web_sys` 包含了大多数 Den o 中可用的 Web API 的绑定，而 `js_sys` 提供了
JavaScript 标准内置对象的绑定。

## 优化

对于生产构建，对 WebAssembly
二进制文件进行优化可能是个好主意。如果您主要通过网络提供二进制文件，那么优化大小可能会产生实质性的差异，而如果您主要在服务器上执行
WebAssembly 以执行计算密集型任务，则优化速度可能会很有益处。您可以在
[此处](https://rustwasm.github.io/docs/book/reference/code-size.html)
找到有关优化（生产）构建的良好指南。此外，[rust-wasm group](https://rustwasm.github.io/docs/book/reference/tools.html)
列出了可以用于优化和操作 WebAssembly 二进制文件的工具。
