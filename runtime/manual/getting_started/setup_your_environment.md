# 设置您的环境

Deno CLI
包含了开发应用程序常常需要的工具，包括完整的语言服务器，以帮助强化您选择的IDE。只需[安装](./installation.md)这些[工具](./command_line_interface.md)，即可使用。

在使用Deno与您喜欢的IDE之外，本节还记录了[shell完成](#shell-completions)和[环境变量](#environment-variables)。

## 使用编辑器/IDE

编辑器/IDE广泛支持Deno。以下部分提供了如何在编辑器中使用Deno的信息。大多数编辑器直接集成到Deno中，使用语言服务器协议和Deno
CLI中集成的语言服务器。

如果您尝试编写或支持Deno语言服务器的社区集成，Deno
CLI代码仓库中有一些[文档](https://github.com/denoland/deno/tree/main/cli/lsp#deno-language-server)，也可以加入[Discord社区](https://discord.gg/deno)的`#dev-lsp`频道。

### Visual Studio Code

有一个官方扩展 [Visual Studio Code](https://code.visualstudio.com/)叫做
[vscode_deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)。
安装后，它将连接到Deno CLI中内置的语言服务器。

由于大多数人在混合环境中工作，该扩展默认不会启用工作区作为“Deno启用”，需要设置`"deno.enable"`标志。您可以自己更改设置，或者可以选择从命令面板中选择`Deno: 初始化工作区配置`来启用您的项目。

更多信息可以在手册的[使用Visual Studio Code](../references/vscode_deno/index.md)部分找到。

### JetBrains IDE

您可以在WebStorm和其他[JetBrains IDEs](https://www.jetbrains.com/products/#type=ide)上获得对Deno的支持，包括PhpStorm、IntelliJ
IDEA Ultimate和PyCharm
Professional。为此，请安装[官方Deno插件](https://plugins.jetbrains.com/plugin/14382-deno)从“首选项/设置
| 插件 - 市场”中。

查看[此博客文章](https://blog.jetbrains.com/webstorm/2020/06/deno-support-in-jetbrains-ides/)以了解更多关于如何入门Deno的信息。

### 通过插件在Vim/Neovim中使用

Deno在[Vim](https://www.vim.org/)和[Neovim](https://neovim.io/)上都得到了良好的支持，通过[coc.nvim](https://github.com/neoclide/coc.nvim)、[vim-easycomplete](https://github.com/jayli/vim-easycomplete)和[ALE](https://github.com/dense-analysis/ale)可以实现集成。coc.nvim提供了用于集成Deno语言服务器的插件，而ALE则在“开箱即用”情况下支持它。

### 使用内置语言服务器的Neovim 0.6+

要使用Deno语言服务器，请安装[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/)并按照说明启用[提供的Deno配置](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#denols)。

请注意，如果您还将`tsserver`配置为LSP客户端，可能会遇到`tsserver`和`denols`都附加到当前缓冲区的问题。要解决这个问题，请确保为`tsserver`和`denols`分别设置唯一的`root_dir`。您可能还需要将`tsserver`的`single_file_support`设置为`false`，以防止它在“单文件模式”下运行。以下是这种配置的示例：

```lua
local nvim_lsp = require('lspconfig')
nvim_lsp.denols.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("deno.json", "deno.jsonc"),
}

nvim_lsp.tsserver.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("package.json"),
  single_file_support = false
}
```

对于Deno，上面的示例假定项目的根目录存在`deno.json`或`deno.jsonc`文件。

#### coc.nvim

一旦您安装了[coc.nvim](https://github.com/neoclide/coc.nvim/wiki/Install-coc.nvim)，您需要通过`:CocInstall coc-deno`安装所需的[coc-deno](https://github.com/fannheyward/coc-deno)。

安装插件后，如果要在工作区中启用Deno，请运行命令`:CocCommand deno.initializeWorkspace`，然后您应该能够使用命令如`gd`（跳转到定义）和`gr`（查找引用）。

#### ALE

ALE通过内置的Deno语言服务器支持Deno，不需要额外的配置。一旦您安装了[ALE](https://github.com/dense-analysis/ale#installation)，您可以执行命令[`:help ale-typescript-deno`](https://github.com/dense-analysis/ale/blob/master/doc/ale-typescript.txt)以获取有关可用配置选项的信息。

有关如何设置ALE（例如键绑定）的更多信息，请参阅[官方文档](https://github.com/dense-analysis/ale#usage)。

#### Vim-EasyComplete

Vim-EasyComplete支持Deno，无需其他配置。一旦您安装了[vim-easycomplete](https://github.com/jayli/vim-easycomplete#installation)，如果您尚未安装Deno，您需要通过`:InstallLspServer deno`安装Deno。您可以从[官方文档](https://github.com/jayli/vim-easycomplete)获取更多信息。

### Emacs

#### lsp-mode

Emacs通过[lsp-mode](https://emacs-lsp.github.io/lsp-mode/)支持Deno语言服务器。一旦安装了[lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/install

ation/)，它应该支持Deno，并且可以[配置](https://emacs-lsp.github.io/lsp-mode/page/lsp-deno/)以支持各种设置。

#### eglot

您还可以通过使用[`eglot`](https://github.com/joaotavora/eglot)来使用内置的Deno语言服务器。

通过eglot实现Deno的示例配置：

```elisp
(add-to-list 'eglot-server-programs '((js-mode typescript-mode) . (eglot-deno "deno" "lsp")))

  (defclass eglot-deno (eglot-lsp-server) ()
    :documentation "A custom class for deno lsp.")

  (cl-defmethod eglot-initialization-options ((server eglot-deno))
    "Passes through required deno initialization options"
    (list :enable t
    :lint t))
```

### Pulsar

[Pulsar编辑器，以前称为Atom](https://pulsar-edit.dev/)支持通过[atom-ide-deno](https://web.pulsar-edit.dev/packages/atom-ide-deno)包与Deno语言服务器集成。`atom-ide-deno`要求安装Deno
CLI以及安装[atom-ide-base](https://web.pulsar-edit.dev/packages/atom-ide-base)包。

### Sublime Text

[Sublime Text](https://www.sublimetext.com/)支持通过[LSP包](https://packagecontrol.io/packages/LSP)连接到Deno语言服务器。您可能还希望安装[TypeScript包](https://packagecontrol.io/packages/TypeScript)以获取完整的语法高亮。

一旦安装了LSP包，您需要将以下配置添加到您的`.sublime-project`配置中：

```jsonc
{
  "settings": {
    "LSP": {
      "deno": {
        "command": ["deno", "lsp"],
        "initializationOptions": {
          // "config": "", // 设置项目中配置文件的路径
          "enable": true,
          // "importMap": "", // 设置项目中导入映射的路径
          "lint": true,
          "unstable": false
        },
        "enabled": true,
        "languages": [
          {
            "languageId": "javascript",
            "scopes": ["source.js"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "javascriptreact",
            "scopes": ["source.jsx"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "typescript",
            "scopes": ["source.ts"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScript.tmLanguage",
              "Packages/TypeScript Syntax/TypeScript.tmLanguage"
            ]
          },
          {
            "languageId": "typescriptreact",
            "scopes": ["source.tsx"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScriptReact.tmLanguage",
              "Packages/TypeScript Syntax/TypeScriptReact.tmLanguage"
            ]
          }
        ]
      }
    }
  }
}
```

### Nova

[Nova编辑器](https://nova.app) 可以通过
[Deno扩展](https://extensions.panic.com/extensions/jaydenseric/jaydenseric.deno)
来集成 Deno 语言服务器。

### GitHub Codespaces

[GitHub Codespaces](https://github.com/features/codespaces)
允许您在本地计算机上完全在线或远程开发，无需配置或安装
Deno。目前它处于早期访问阶段。

如果一个项目是一个启用了 Deno 的项目，并包含仓库的 `.devcontainer` 配置，那么在
GitHub Codespaces 中打开该项目应该会正常工作。如果您要启动一个新项目，或者要将
Deno 支持添加到现有的代码空间，可以通过选择命令面板中的
`Codespaces: Add Development Container Configuration Files...`，然后选择
`Show All Definitions...`，再搜索 `Deno` 定义来添加它。

一旦选择了它，您需要重新构建容器，以便将 Deno CLI
添加到容器中。容器重建后，代码空间将支持 Deno。

### Kakoune

[Kakoune](http://kakoune.org/) 支持通过
[kak-lsp](https://github.com/kak-lsp/kak-lsp) 客户端连接到 Deno 语言服务器。一旦
[安装 kak-lsp](https://github.com/kak-lsp/kak-lsp#installation)，将以下内容添加到您的
`kak-lsp.toml` 配置文件中，以将其配置连接到 Deno 语言服务器：

```toml
[language.typescript]
filetypes = ["typescript", "javascript"]
roots = [".git"]
command = "deno"
args = ["lsp"]
[language.typescript.settings.deno]
enable = true
lint = true
```

## Shell 自动完成

Deno CLI 内置支持生成 CLI 自动完成信息。通过使用
`deno completions <shell>`，Deno CLI 将将 CLI
自动完成信息输出到标准输出。当前支持的 shell 包括：

- bash
- elvish
- fish
- powershell
- zsh

### bash 示例

输出自动完成信息并将其添加到环境中：

```shell
> deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
> source /usr/local/etc/bash_completion.d/deno.bash
```

### PowerShell 示例

输出自动完成信息：

```shell
> deno completions powershell >> $profile
> .$profile
```

这将创建一个 Powershell 配置文件在
`$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`，并且每当您启动
Powershell 时都会运行它。

### zsh 示例

您应该有一个目录，可以保存自动完成信息：

```shell
> mkdir ~/.zsh
```

然后输出自动完成信息：

```shell
> deno completions zsh > ~/.zsh/_deno
```

并确保在您的 `~/.zshrc` 中加载自动完成信息：

```shell
fpath=(~/.zsh $fpath)
autoload -Uz compinit
compinit -u
```

如果重新加载 shell 后自动完成信息仍未加载，您可能需要删除 `~/.zcompdump/`
以删除之前生成的自动完成信息，然后使用 `compinit` 重新生成它们。

### 使用 ohmyzsh 和 antigen 的 zsh 示例

[ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) 是 zsh
的配置框架，可以更轻松地管理您的 shell 配置。
[antigen](https://github.com/zsh-users/antigen) 是 zsh 的插件管理器。

创建一个目录来存储自动完成信息，并输出自动完成信息：

```shell
> mkdir ~/.oh-my-zsh/custom/plugins/deno
> deno completions zsh > ~/.oh-my-zsh/custom/plugins/deno/_deno
```

然后您的 `.zshrc` 可能如下所示：

```shell
source /path-to-antigen/antigen.zsh

# Load the oh-my-zsh's library.
antigen use oh-my-zsh

antigen bundle deno
```

### fish 示例

将自动完成信息输出到 `deno.fish` 文件中，保存到 fish
配置文件夹中的自动完成目录：

```shell
> deno completions fish > ~/.config/fish/completions/deno.fish
```

## 环境变量

有一些环境变量可以影响 Deno 的行为：

- `DENO_AUTH_TOKENS` - 用于允许 Deno 访问远程私有代码的授权令牌列表。请参阅
  [Private modules and repositories](../basics/modules/private.md)
  部分获取更多详情。
- `DENO_TLS_CA_STORE` - 在建立 TLS 连接时使用的证书存储列表。支持的存储包括
  `mozilla` 和
  `system`。您可以指定其中一个、两者或都不指定。证书链尝试以指定的顺序解析。默认值为
  `mozilla`。`mozilla` 存储将使用由
  [`webpki-roots`](https://crates.io/crates/webpki-roots) 提供的捆绑 Mozilla
  证书。`system`
  存储将使用您的平台的[本机证书存储](https://crates.io/crates/rustls-native-certs)。Mozilla
  证书的确切集合取决于您使用的 Deno
  版本。如果未指定证书存储，那么将不给予任何未指定 `DENO_CERT` 或 `--cert` 的
  TLS 连接信任，或未指定每个 TLS 连接的特定证书。
- `DENO_CERT` - 从 PEM
  编码文件中加载证书颁发机构。这将“覆盖”`--cert`选项。请参阅
  [Proxies](../basics/modules/proxies.md) 部分获取更多信息。
- `DENO_DIR` - 这将设置 CLI
  缓存信息的存储目录。这包括缓存的远程模块、已编译模块、语言服务器缓存信息以及本地存

储的持久数据等。默认情况下，它使用操作系统的默认缓存位置，然后是 `deno` 路径。

- `DENO_INSTALL_ROOT` - 在使用 `deno install` 时，存储已安装脚本的位置。默认值为
  `$HOME/.deno/bin`。
- `DENO_NO_PACKAGE_JSON` - 设置为禁用 package.json 文件的自动解析。
- `DENO_NO_PROMPT` - 设置为禁用权限提示（与在调用时传递 `--no-prompt` 相对应）。
- `DENO_NO_UPDATE_CHECK` - 设置为禁用检查是否有更新的 Deno 版本可用。
- `DENO_WEBGPU_TRACE` - 用于 WebGPU 跟踪的目录。
- `HTTP_PROXY` - 用于 HTTP 请求的代理地址。请参阅
  [Proxies](../basics/modules/proxies.md) 部分获取更多信息。
- `HTTPS_PROXY` - 用于 HTTPS 请求的代理地址。请参阅
  [Proxies](../basics/modules/proxies.md) 部分获取更多信息。
- `NO_COLOR` - 如果设置，将阻止 Deno CLI 在写入 stdout 和 stderr 时发送 ANSI
  颜色代码。请参阅网站<https://no-color.org/>获取有关这个事实上的标准的更多信息。可以在运行时通过检查
  `Deno.noColor` 的值来访问此标志，而无需读取环境变量的权限。
- `NO_PROXY` - 指示应绕过在其他环境变量中设置的代理的主机。请参阅
  [Proxies](../basics/modules/proxies.md) 部分获取更多信息。
- `NPM_CONFIG_REGISTRY` - 在通过 [npm specifiers](../node/npm_specifiers.md)
  加载模块时要使用的 npm 注册表。
