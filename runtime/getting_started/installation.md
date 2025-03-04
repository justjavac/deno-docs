---
title: 安装
oldUrl:
  - /runtime/manual/fundamentals/installation
  - /runtime/manual/getting_started/installation
  - /runtime/fundamentals/installation
---

Deno 支持 macOS、Linux 和 Windows 系统。Deno
是一个单二进制可执行文件，没有外部依赖。在 macOS 上，提供了 M1（arm64）和
Intel（x64）两种架构的可执行文件。在 Linux 和 Windows 上，仅支持 x64 架构。

## 下载与安装

[deno_install](https://github.com/denoland/deno_install)
提供了便捷的脚本来下载和安装二进制文件。

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

使用 Shell：

```shell
curl -fsSL https://deno.land/install.sh | sh
```

使用 [npm](https://npmjs.com/package/deno)：

```shell
npm install -g deno
```

> <small>如果通过 npm 安装，Deno 命令的启动时间会受到影响。我们推荐使用 Shell
> 安装脚本来获得更好的性能。</small>

使用 [Homebrew](https://formulae.brew.sh/formula/deno)：

```shell
brew install deno
```

使用 [MacPorts](https://ports.macports.org/port/deno/)：

```shell
sudo port install deno
```

使用 [Nix](https://nixos.org/download.html)：

```shell
nix-shell -p deno
```

使用 [asdf](https://asdf-vm.com/)：

```shell
asdf plugin add deno https://github.com/asdf-community/asdf-deno.git

# 下载并安装最新版本的 Deno
asdf install deno latest

# 设置为全局默认的 Deno 版本
asdf set -u deno latest

# 设置为本地默认的 Deno 版本（仅当前项目）
asdf set deno latest
```

使用 [vfox](https://vfox.lhan.me/)：

```shell
vfox add deno

# 下载并安装最新版本的 Deno
vfox install deno@latest

# 设置全局的 Deno 版本
vfox use --global deno
```

</deno-tab>
<deno-tab value="windows" label="Windows">

使用 PowerShell（Windows）：

```powershell
irm https://deno.land/install.ps1 | iex
```

使用 [npm](https://npmjs.com/package/deno)：

```shell
npm install -g deno
```

> <small>如果通过 npm 安装，Deno 命令的启动时间会受到影响。我们推荐使用
> PowerShell 安装脚本来获得更好的性能。</small>

使用 [Scoop](https://scoop.sh/)：

```shell
scoop install deno
```

使用 [Chocolatey](https://chocolatey.org/packages/deno)：

```shell
choco install deno
```

使用 [Winget](https://github.com/microsoft/winget-cli)：

```shell
winget install DenoLand.Deno
```

使用 [vfox](https://vfox.lhan.me/)：

```shell
vfox add deno

# 下载并安装最新版本的 Deno
vfox install deno@latest

# 设置全局的 Deno 版本
vfox use --global deno
```

</deno-tab>
<deno-tab value="linux" label="Linux">

使用 Shell：

```shell
curl -fsSL https://deno.land/install.sh | sh
```

使用 [npm](https://npmjs.com/package/deno)：

```shell
npm install -g deno
```

> <small>如果通过 npm 安装，Deno 命令的启动时间会受到影响。我们推荐使用 Shell
> 安装脚本来获得更好的性能。</small>

使用 [Nix](https://nixos.org/download.html)：

```shell
nix-shell -p deno
```

使用 [asdf](https://asdf-vm.com/)：

```shell
asdf plugin add deno https://github.com/asdf-community/asdf-deno.git

# 下载并安装最新版本的 Deno
asdf install deno latest

# 设置为全局默认的 Deno 版本
asdf set -u deno latest

# 设置为本地默认的 Deno 版本（仅当前项目）
asdf set deno latest
```

使用 [vfox](https://vfox.lhan.me/)：

```shell
vfox add deno

# 下载并安装最新版本的 Deno
vfox install deno@latest

# 设置全局的 Deno 版本
vfox use --global deno
```

</deno-tab>
</deno-tabs>

你也可以使用 [Cargo](https://crates.io/crates/deno) 从源码构建并安装：

```shell
cargo install deno --locked
```

Deno 的二进制文件也可以手动安装，通过从
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases)
下载 zip 文件。这些包只包含一个可执行文件。在 macOS 和 Linux
上，你需要设置可执行权限。

## Docker

有关官方 Docker
镜像的更多信息和说明，请访问：[https://github.com/denoland/deno_docker](https://github.com/denoland/deno_docker)

## 测试安装

要测试安装是否成功，运行 `deno --version`。如果控制台输出了 Deno
的版本号，则安装成功。

使用 `deno help` 查看帮助文档，了解 Deno 的标志和用法。获取详细的 CLI
指南，请访问[这里](/runtime/getting_started/command_line_interface/)。

## 更新

要更新已安装的 Deno 版本，可以运行：

```shell
deno upgrade
```

或使用 [Winget](https://github.com/microsoft/winget-cli)（Windows）：

```shell
winget upgrade DenoLand.Deno
```

这将从
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases)
获取最新版本，解压并替换当前的可执行文件。

你也可以使用此工具安装特定版本的 Deno：

```shell
deno upgrade --version 1.0.1
```

## 从源码构建

有关如何从源码构建的信息，请参阅[`贡献`](/runtime/contributing/building_from_source/)章节。
