# 从源代码构建 `deno`

以下是有关如何从源代码构建 Deno 的说明。如果您只想使用
Deno，可以下载预编译的可执行文件（更多信息请参阅
[入门指南](../../getting_started/installation.md#download-and-install) 章节）。

## 克隆存储库

> Deno 使用子模块，因此您必须记住使用 `--recurse-submodules` 选项来克隆。

**Linux**/**Mac**：

```shell
git clone --recurse-submodules https://github.com/denoland/deno.git
```

**Windows**：

1. [启用 "开发人员模式"](https://www.google.com/search?q=windows+enable+developer+mode)
   （否则符号链接将需要管理员权限）。
2. 确保您使用的是 git 版本 2.19.2.windows.1 或更新版本。
3. 在检出之前设置 `core.symlinks=true`：
   ```shell
   git config --global core.symlinks true
   git clone --recurse-submodules https://github.com/denoland/deno.git
   ```

## 先决条件

### Rust

> Deno 需要特定版本的 Rust。Deno 可能不支持其他版本或 Rust Nightly
> 版本。特定版本的 Rust 在 `rust-toolchain.toml` 文件中指定。

[更新或安装 Rust](https://www.rust-lang.org/tools/install)。检查 Rust
是否安装/更新正确：

```
rustc -V
cargo -V
```

### 本地编译器和链接器

> Deno 的许多组件需要本地编译器来构建优化的本地函数。

**Linux**：

```sh
apt install --install-recommends -y clang-16 lld-16 cmake libglib2.0-dev
```

**Mac**：

Mac 用户必须安装 _XCode 命令行工具_。
（[XCode](https://developer.apple.com/xcode/) 已包括 _XCode 命令行工具_。运行
`xcode-select --install` 来安装它，无需安装 XCode。）

[CMake](https://cmake.org/) 也是必需的，但不随 _命令行工具_ 一起提供。

```
brew install cmake
```

**Mac M1/M2**：

对于 Apple aarch64 用户，必须安装 `lld`。

```
brew install llvm
# 将 /opt/homebrew/opt/llvm/bin/ 添加到 $PATH
```

**Windows**：

1. 获取带有 "C++ 桌面开发" 工具包的
   [VS Community 2019](https://www.visualstudio.com/downloads/)，并确保选择下面列出的必需工具以及所有
   C++ 工具。

   - CMake 的 Visual C++ 工具
   - Windows 10 SDK（10.0.17763.0）
   - 测试工具核心功能 - 构建工具
   - Visual C++ ATL for x86 和 x64
   - Visual C++ MFC for x86 和 x64
   - C++/CLI 支持
   - 桌面用 VC++ 2015.3 v14.00（v140）工具集

2. 启用 "Windows 的调试工具"。
   - 转到 "控制面板" → "程序" → "程序和功能"
   - 选择 "Windows 软件开发工具包 - Windows 10"
   - → "更改" → "更改" → 选中 "Windows 的调试工具" → "更改" → "完成"。
   - 或使用：
     [Windows 调试工具](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/)
     （注意：它会下载文件，您应手动安装 `X64 Debuggers And Tools-x64_en-us.msi`
     文件）。

### Protocol Buffers 编译器

> 构建 Deno 需要
> [Protocol Buffers 编译器](https://grpc.io/docs/protoc-installation/)。

**Linux**：

```sh
apt install -y protobuf-compiler
protoc --version  # 确保编译器版本为 3+
```

**Mac**：

```sh
brew install protobuf
protoc --version  # 确保编译器版本为 3+
```

**Windows**

Windows 用户可以从
[GitHub](https://github.com/protocolbuffers/protobuf/releases/latest)
下载最新的二进制发行版。

## Python 3

> Deno 需要 [Python 3](https://www.python.org/downloads) 用于运行 WPT
> 测试。确保您的 `PATH` 中存在一个没有后缀的 `python`/`python.exe` 并且它指向
> Python 3。

## 构建 Deno

构建 Deno 最简单的方法是使用预编译版本的 V8：

```
cargo build -vv
```

然而，如果您进行较低级别的 V8 开发，或者使用没有预编译版本的 V8
的平台，您也可以构建 Deno 和 V8 的源代码：

```
V8_FROM_SOURCE=1 cargo build -vv
```

在从源代码构建 V8 时，可能会有更多的依赖项。有关 V8 构建的更多详细信息，请参阅
[rusty_v8 的 README](https://github.com/denoland/rusty_v8)。
