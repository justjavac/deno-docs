---
title: "从源码构建 Deno"
oldUrl:
 - /runtime/references/contributing/building_from_source/
 - /runtime/manual/references/contributing/building_from_source/
---

以下是关于如何从源码构建 Deno 的说明。如果你只是想使用
Deno，可以下载预构建的可执行文件（更多信息请参阅
[`Getting Started`](/runtime/getting_started/installation/) 章节）。

## 克隆仓库

:::note

Deno 使用了子模块，因此你必须记得使用 `--recurse-submodules` 进行克隆。

:::

**Linux(Debian)**/**Mac**/**WSL**:

```shell
git clone --recurse-submodules https://github.com/denoland/deno.git
```

**Windows**:

1. [启用“开发者模式”](https://www.google.com/search?q=windows+enable+developer+mode)（否则符号链接需要管理员权限）。
2. 确保你使用的是 git 2.19.2.windows.1 或更新版本。
3. 在检出之前设置 `core.symlinks=true`：

   ```shell
   git config --global core.symlinks true
   git clone --recurse-submodules https://github.com/denoland/deno.git
   ```

## 先决条件

### Rust

:::note

Deno 需要特定版本的 Rust。Deno 可能不支持在其他版本或 Rust Nightly
版本上构建。特定版本所需的 Rust 版本在 `rust-toolchain.toml` 文件中指定。

:::

[更新或安装 Rust](https://www.rust-lang.org/tools/install)。检查 Rust
是否已正确安装/更新：

```console
rustc -V
cargo -V
```

### 本地编译器和链接器

Deno 的许多组件需要本地编译器来构建优化的本地函数。

#### Linux(Debian)/WSL

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
./llvm.sh 17
apt install --install-recommends -y cmake libglib2.0-dev
```

#### Mac

Mac 用户必须安装 _XCode
命令行工具_。（[XCode](https://developer.apple.com/xcode/) 已经包含了 _XCode
命令行工具_。运行 `xcode-select --install` 可以在不安装 XCode 的情况下安装它。）

[CMake](https://cmake.org/) 也是必需的，但它不随 _命令行工具_ 一起提供。

```console
brew install cmake
```

#### Mac M1/M2

对于 Apple aarch64 用户，必须安装 `lld`。

```console
brew install llvm lld
# 将 /opt/homebrew/opt/llvm/bin/ 添加到 $PATH
```

#### Windows

1. 获取 [VS Community 2019](https://www.visualstudio.com/downloads/) 并选择“使用
   C++ 的桌面开发”工具包，确保选择以下列出的必需工具以及所有 C++ 工具。

   - Visual C++ tools for CMake
   - Windows 10 SDK (10.0.17763.0)
   - Testing tools core features - Build Tools
   - Visual C++ ATL for x86 and x64
   - Visual C++ MFC for x86 and x64
   - C++/CLI support
   - VC++ 2015.3 v14.00 (v140) toolset for desktop

2. 启用“Windows 调试工具”。
   - 转到“控制面板” → “程序” → “程序和功能”
   - 选择“Windows 软件开发工具包 - Windows 10”
   - → “更改” → “更改” → 勾选“Windows 调试工具” → “更改” → “完成”。
   - 或者使用：[Windows 调试工具](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/)（注意：它会下载文件，你需要手动安装
     `X64 Debuggers And Tools-x64_en-us.msi` 文件。）

### Protobuf 编译器

构建 Deno 需要
[Protocol Buffers 编译器](https://grpc.io/docs/protoc-installation/)。

#### Linux(Debian)/WSL

```sh
apt install -y protobuf-compiler
protoc --version  # 确保编译器版本为 3+
```

#### Mac

```sh
brew install protobuf
protoc --version  # 确保编译器版本为 3+
```

#### Windows

Windows 用户可以从
[GitHub](https://github.com/protocolbuffers/protobuf/releases/latest)
下载最新的二进制版本。

## Python 3

:::note

Deno 需要 [Python 3](https://www.python.org/downloads) 来运行 WPT 测试。确保你的
`PATH` 中存在无后缀的 `python`/`python.exe`，并且它指向 Python 3。

:::

## 构建 Deno

构建 Deno 最简单的方法是使用预编译的 V8 版本。

_对于 WSL，请确保在 `.wslconfig` 中分配了足够的内存。建议至少分配 16GB。_

```console
cargo build -vv
```

然而，如果你正在进行低级别的 V8 开发，或者使用的平台没有预编译的 V8
版本，你可能希望从源码构建 Deno 和 V8：

```console
V8_FROM_SOURCE=1 cargo build -vv
```

从源码构建 V8 时，可能会有更多的依赖项。有关 V8 构建的更多详细信息，请参阅
[rusty_v8 的 README](https://github.com/denoland/rusty_v8)。

## 构建

使用 Cargo 构建：

```shell
# 构建：
cargo build -vv

# 构建错误？确保你有最新的 main 并尝试再次构建，如果仍然不行，请尝试：
cargo clean && cargo build -vv

# 运行：
./target/debug/deno run tests/testdata/run/002_hello.ts
```

## 运行测试

Deno 有一个全面的测试套件，用 Rust 和 TypeScript 编写。Rust
测试可以在构建过程中使用以下命令运行：

```shell
cargo test -vv
```

TypeScript 测试可以使用以下命令运行：

```shell
# 运行所有单元/测试：
target/debug/deno test -A --unstable --lock=tools/deno.lock.json --config tests/config/deno.json tests/unit

# 运行特定测试：
target/debug/deno test -A --unstable --lock=tools/deno.lock.json --config tests/config/deno.json tests/unit/os_test.ts
```

## 处理多个 Crate

如果变更集涉及多个 Deno crate，你可能希望一起构建多个 crate。建议你将所有需要的
crate 检出到相邻的位置。例如：

```shell
- denoland/
  - deno/
  - deno_core/
  - deno_ast/
  - ...
```

然后你可以使用
[Cargo 的 patch 功能](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html)
来覆盖默认的依赖路径：

```shell
cargo build --config 'patch.crates-io.deno_ast.path="../deno_ast"'
```

如果你正在处理一个持续几天的变更集，你可能更愿意将 patch 添加到你的 `Cargo.toml`
文件中（只需确保在提交更改之前删除它）：

```sh
[patch.crates-io]
deno_ast = { path = "../deno_ast" }
```

这将从本地路径构建 `deno_ast` crate，并链接到该版本，而不是从 `crates.io` 获取。

**注意**：`Cargo.toml` 中的依赖版本必须与磁盘上的依赖版本匹配。

使用 `cargo search <dependency_name>` 来检查版本。
