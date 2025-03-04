---
title: "贡献与支持"
oldUrl:
  - /runtime/manual/contributing/
  - /runtime/manual/contributing/contribute
  - /runtime/manual/references/contributing/
  - /runtime/contributing/contribute/
---

我们欢迎并感谢所有对 Deno 的贡献。

本页面旨在帮助您开始贡献。

## 项目

在 [`denoland`](https://github.com/denoland) 组织中有许多属于 Deno
生态系统的仓库。

这些仓库有不同的范围，使用不同的编程语言，并且在贡献难度上也有所不同。

为了帮助您决定从哪个仓库开始贡献（以及/或符合您的兴趣），这里有一个简短的比较（**代码库主要由以下粗体语言组成**）：

### [deno](https://github.com/denoland/deno)

这是提供 `deno` CLI 的主要仓库。

如果您想修复错误或为 `deno` 添加新功能，这是您要贡献的仓库。

一些系统，包括 Node.js 兼容层的大部分，是用 JavaScript 和 TypeScript
模块实现的。如果您想做出第一次贡献，这些模块是一个很好的起点。

在迭代这些模块时，建议在您的 `cargo` 标志中包含
`--features hmr`。这是一种特殊的开发模式，其中 JS/TS
源代码不会包含在二进制文件中，而是在运行时读取，这意味着如果它们被更改，二进制文件不需要重新构建。

要使用以下命令，您需要首先按照[此处](building_from_source)的描述在系统上安装必要的工具。

```sh
# cargo build
cargo build --features hmr

# cargo run -- run hello.ts
cargo run --features hmr -- run hello.ts

# cargo test integration::node_unit_tests::os_test
cargo test --features hmr integration::node_unit_tests::os_test
```

还请记住在您的编辑器设置中引用此功能标志。对于 VSCode
用户，请将以下内容合并到您的工作区文件中：

```jsonc
{
  "settings": {
    "rust-analyzer.cargo.features": ["hmr"],
    // 添加对解析内部 `ext:*` 模块的支持
    "deno.importMap": "tools/core_import_map.json"
  }
}
```

要在 VSCode 中使用开发版本的 LSP：

1. 安装并启用
   [Deno VSCode 扩展](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
2. 更新您的 VSCode 设置并将 `deno.path` 指向您的开发二进制文件：

```jsonc
// .vscode/settings.json
{
  "deno.path": "/path/to/your/deno/target/debug/deno"
}
```

语言：**Rust**，**JavaScript**，**TypeScript**

### [deno_std](https://github.com/denoland/deno_std)

Deno 的标准库。

语言：**TypeScript**，WebAssembly

### [fresh](https://github.com/denoland/fresh)

下一代 Web 框架。

语言：**TypeScript**，TSX

### [deno_lint](https://github.com/denoland/deno_lint)

为 `deno lint` 子命令提供支持的 linter。

语言：**Rust**

### [deno_doc](https://github.com/denoland/deno_doc)

为 `deno doc` 子命令提供支持的文档生成器，以及 https://docs.denohub.com/api 和
https://jsr.io 上的参考文档。

语言：**Rust**

### [rusty_v8](https://github.com/denoland/rusty_v8)

V8 JavaScript 引擎的 Rust 绑定。非常技术性和底层。

语言：**Rust**

### [serde_v8](https://github.com/denoland/deno_core/tree/main/serde_v8)

提供 V8 和 Rust 对象之间双向映射的库。基于
[`serde`](https://crates.io/crates/serde) 库。非常技术性和底层。

语言：**Rust**

### [deno_docker](https://github.com/denoland/deno_docker)

Deno 的官方 Docker 镜像。

## 一般说明

- 阅读[风格指南](/runtime/contributing/style_guide)。

- 请不要让[基准测试](https://deno.land/benchmarks)变得更糟。

- 在[社区聊天室](https://discord.gg/deno)中寻求帮助。

- 如果您要处理某个问题，请在开始处理之前在问题的评论中提及。

- 如果您要开发新功能，请先创建一个问题并与其它贡献者讨论；我们感谢所有贡献，但并非所有提议的功能都会被接受。我们不希望您花费数小时编写可能不会被接受的代码。

- 请在论坛中保持专业。我们遵循
  [Rust 的行为准则](https://www.rust-lang.org/policies/code-of-conduct)
  (CoC)。有问题吗？请发送邮件至 [ry@tinyclouds.org](mailto:ry@tinyclouds.org)。

## 提交拉取请求

在向任何仓库提交 PR 之前，请确保完成以下步骤：

1. 为 PR 提供一个描述性标题。

好的 PR 标题示例：

- fix(std/http): 修复服务器中的竞争条件
- docs(console): 更新文档字符串
- feat(doc): 处理嵌套的重新导出

不好的 PR 标题示例：

- fix #7123
- update docs
- fix bugs

2. 确保有一个相关的问题，并在 PR 文本中引用它。
3. 确保有测试覆盖更改。

## 向 [`deno`](https://github.com/denoland/deno) 提交 PR

除了上述内容外，请确保：

> 要使用以下命令，您需要首先按照[此处](building_from_source)的描述在系统上安装必要的工具。

1. `cargo test` 通过 - 这将运行 `deno` 的完整测试套件，包括单元测试、集成测试和
   Web 平台测试

1. 运行 `./tools/format.js` - 这将格式化所有代码以符合仓库中的一致风格

1. 运行 `./tools/lint.js` - 这将使用 `clippy`（用于 Rust）和 `dlint`（用于
   JavaScript）检查 Rust 和 JavaScript 代码中的常见错误和问题

## 向 [`deno_std`](https://github.com/denoland/deno_std) 提交 PR

除了上述内容外，请确保：

1. 您编写的所有代码都是 `TypeScript`（即不要使用 `JavaScript`）

1. `deno test --unstable --allow-all` 通过 - 这将运行标准库的完整测试套件

1. 在仓库根目录运行 `deno fmt` - 这将格式化所有代码以符合仓库中的一致风格

1. 运行 `deno lint` - 这将检查 TypeScript 代码中的常见错误和问题

## 向 [`fresh`](https://github.com/denoland/fresh) 提交 PR

首先，请确保[安装 Puppeteer](https://github.com/lucacasonato/deno-puppeteer#installation)。然后，请确保运行
`deno task ok` 并成功通过。

## 记录 API

记录所有公共 API
非常重要，我们希望与代码内联完成。这有助于确保代码和文档紧密耦合。

### JavaScript 和 TypeScript

所有通过 `deno` 模块以及全局/`window` 命名空间公开的 API 和类型都应具有 JSDoc
文档。此文档被解析并可供 TypeScript 编译器使用，因此易于进一步提供下游。JSDoc
块位于它们适用的语句之前，并以 `/**` 开头，以 `*/` 结尾。例如：

```ts
/** 一个简单的 JSDoc 注释 */
export const FOO = "foo";
```

更多信息请访问：https://jsdoc.app/

### Rust

使用[此指南](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html)编写
Rust 代码中的文档注释。
