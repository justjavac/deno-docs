# 贡献

我们欢迎并感激对 Deno 的所有贡献。

本页面作为帮助你开始贡献的助手。

## 项目

[`denoland`](https://github.com/denoland) 组织中有许多仓库，它们都是 Deno
生态系统的一部分。

仓库具有不同的范围，使用不同的编程语言，对贡献来说难度各异。

为了帮助你决定哪个仓库可能是最适合开始贡献的（和/或与你的兴趣相关），这里有一个简短的比较（**代码库主要由以下粗体语言组成**）：

### [`deno`](https://github.com/denoland/deno)

这是提供 `deno` CLI 的主要仓库。

如果你想修复 `deno` 的错误或添加新功能，那么这个仓库就是你想要贡献的地方。

一些系统，包括大部分的 Node.js 兼容层，都是由 JavaScript 和 TypeScript
模块实现的。如果你想做出你的第一个贡献，那么这些模块是一个很好的开始。

在迭代这些模块时，建议在你的 `cargo` 标志中包括
`--features __runtime_js_sources`。这是一种特殊的开发模式，其中 JS/TS
源代码不包括在二进制文件中，而是在运行时读取，这意味着如果它们发生更改，二进制文件就不必重新构建。

```sh
cargo build
cargo build --features __runtime_js_sources

# cargo run -- run hello.ts
cargo run --features __runtime_js_sources -- run hello.ts

# cargo test integration:: node_unit_tests:: os_test
cargo test --features __runtime_js_sources integration::node_unit_tests::os_test
```

还要记得在你的编辑器设置中引用这个特性标志。对于 VSCode
用户，将以下内容合并到你的工作区文件中：

```json
{
  "settings": {
    "rust-analyzer.cargo.features": ["__runtime_js_sources"]
  }
}
```

语言：**Rust**，**JavaScript**，**TypeScript**

### [`deno_std`](https://github.com/denoland/deno_std)

Deno 的标准库。

语言：**TypeScript**，WebAssembly

### [`fresh`](https://github.com/denoland/fresh)

下一代 Web 框架。

语言：**TypeScript**，TSX

### [`deno_lint`](https://github.com/denoland/deno_lint)

用于支持 `deno lint` 子命令的代码检查工具。

语言：**Rust**

### [`deno_doc`](https://github.com/denoland/deno_doc)

用于支持 `deno doc` 子命令和 https://doc.deno.land 的文档生成器。

语言：**Rust**

### [`docland`](https://github.com/denoland/docland)

文档生成器的前端：https://doc.deno.land

语言：**TypeScript**，TSX，CSS

### [`rusty_v8`](https://github.com/denoland/rusty_v8)

V8 JavaScript 引擎的 Rust 绑定。非常技术性和低级。

语言：**Rust**

### [`serde_v8`](https://github.com/denoland/deno_core/tree/main/serde_v8)

提供 V8 和 Rust 对象之间的双射层的库，基于
[`serde`](https://crates.io/crates/serde) 库。非常技术性和低级。

语言：**Rust**

### [`deno_docker`](https://github.com/denoland/deno_docker)

Deno 的官方 Docker 镜像。

## 一般备注

- 阅读 [风格指南](./style_guide.md)。

- 请不要使 [基准测试](https://deno.land/benchmarks) 变差。

- 在 [社区聊天室](https://discord.gg/deno) 中寻求帮助。

- 如果你打算解决一个问题，请在问题的评论中提前说明你打算开始解决这个问题。

- 如果你打算开发一个新功能，请创建一个问题并在开始开发之前与其他贡献者讨论；我们欢迎所有的贡献，但并不是所有提议的功能都会被接受。我们不希望你花几个小时的时间开发可能不会被接受的代码。

- 请在论坛上保持专业。我们遵守
  [Rust 的行为准则](https://www.rust-lang.org/policies/code-of-conduct)（CoC）。有问题吗？请发送电子邮件至
  [ry@tinyclouds.org](mailto:ry@tinyclouds.org)。

## 提交拉取请求

在提交 PR 到任何仓库之前，请确保完成以下步骤：

1. 给 PR 一个描述性的标题。

良好的 PR 标题示例：

- 修复(std/http)：修复服务器中的竞争条件
- 文档(console)：更新文档字符串
- 特性(doc)：处理嵌套重新导出

不好的 PR 标题示例：

- 修复 #7123
- 更新文档
- 修复错误

2. 确保有相关的问题，并在 PR 文本中引用它。
3. 确保有覆盖更改的测试。

## 提交 PR 到 [`deno`](https://github.com/denoland/deno)

除了上述步骤之外，请确保：

1. `cargo test` 通过 - 这将运行 `deno` 的完整测试套件，包括单元测试，集成测试和
   Web 平台测试

1. 运行 `./tools/format.js` - 这将格式化所有代码以符合仓库中的一致风格

1. 运行 `./tools/lint.js` - 这将使用 `clippy`（用于 Rust

）和 `dlint`（用于 JavaScript）检查常见错误和错误的 Rust 和 JavaScript 代码

## 提交 PR 到 [`deno_std`](https://github.com/denoland/deno_std)

除了上述步骤之外，请确保：

1. 你编写的所有代码都是使用 `TypeScript` 编写的（即不要使用 `JavaScript`）

1. `deno test --unstable --allow-all` 通过 - 这将运行标准库的完整测试套件

1. 在仓库的根目录运行 `deno fmt` - 这将格式化所有代码以符合仓库中的一致风格。

1. 运行 `deno lint` - 这将检查 TypeScript 代码中的常见错误和问题。

## 提交 PR 到 [`fresh`](https://github.com/denoland/fresh)

首先，请确保
[安装 Puppeteer](https://github.com/lucacasonato/deno-puppeteer#installation)。然后，请确保
`deno task ok` 被运行并成功通过。

## 文档 API

重要的是要记录所有公共
API，并且我们希望与代码内联进行记录。这有助于确保代码和文档紧密耦合。

### JavaScript 和 TypeScript

通过 `deno` 模块以及全局/`window` 命名空间公开的所有 API 和类型都应该有 JSDoc
文档。这些文档会被解析并提供给 TypeScript 编译器，因此很容易进一步提供。JSDoc
块位于它们所适用的语句之前，并以 `/**` 开头，然后以 `*/` 结束。例如：

```ts
/** 一个简单的 JSDoc 注释 */
export const FOO = "foo";
```

了解更多信息：https://jsdoc.app/

### Rust

使用 [此指南](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html)
来编写 Rust 代码中的文档注释。
