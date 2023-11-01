# 安装

Deno 支持 macOS、Linux 和 Windows 操作系统。Deno
是一个单一的可执行二进制文件，它没有外部依赖。在 macOS 上，提供了 M1（arm64）和
Intel（x64）的可执行文件。在 Linux 和 Windows 上，仅支持x64。

## 下载和安装

[x.deno.js.cn](https://x.deno.js.cn)是国内的加速镜像，提供了方便的脚本来下载和安装二进制文件。

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
  <TabItem value="mac" label="macOS" default>

使用 Shell：

```shell
curl -fsSL https://x.deno.js.cn/install.sh | sh
```

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
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git
asdf install deno latest

# 全局安装
asdf global deno latest

# 本地安装（仅当前项目）
asdf local deno latest
```

</TabItem>
  <TabItem value="windows" label="Windows">

使用 PowerShell（Windows）：

```powershell
irm https://x.deno.js.cn/install.ps1 | iex
```

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
winget install deno
```

</TabItem>
  <TabItem value="linux" label="Linux">

使用 Shell：

```shell
curl -fsSL https://x.deno.js.cn/install.sh | sh
```

使用 [Nix](https://nixos.org/download.html)：

```shell
nix-shell -p deno
```

使用 [asdf](https://asdf-vm.com/)：

```shell
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git
asdf install deno latest

# 全局安装
asdf global deno latest

# 本地安装（仅当前项目）
asdf local deno latest
```

</TabItem>
</Tabs>

您还可以使用 [Cargo](https://crates.io/crates/deno)从源代码构建和安装：

```shell
cargo install deno --locked
```

Deno 二进制文件也可以手动安装，通过在
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases)
下载 zip 文件。这些包只包含一个可执行文件。您需要在 macOS 和 Linux
上设置可执行位。

## Docker

有关官方 Docker 镜像的更多信息和说明，请访问：
[https://github.com/denoland/deno_docker](https://github.com/denoland/deno_docker)

## 测试安装

要测试您的安装，请运行 `deno --version`。如果这会在控制台上打印出 Deno
的版本，则安装成功。

使用 `deno help` 来查看帮助文本，其中记录了 Deno
的标志和用法。在[此处](./command_line_interface.md)获取有关 CLI 的详细指南。

## 更新

要更新先前安装的 Deno 版本，可以运行：

```shell
deno upgrade
```

或者使用 [Winget](https://github.com/microsoft/winget-cli)（Windows）：

```shell
winget upgrade deno
```

这将从
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases)
获取最新版本，解压缩并替换您当前的可执行文件。

您还可以使用此实用程序安装特定版本的 Deno：

```shell
deno upgrade --version 1.0.1
```

## 从源代码构建

有关如何从源代码构建的信息，请参阅[贡献代码](../references/contributing/building_from_source.md)章节。
