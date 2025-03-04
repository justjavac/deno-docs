---
title: "设置你的环境"
oldUrl: /runtime/manual/getting_started/setup_your_environment/
---

Deno 提供了许多开发应用程序时常用的工具，包括完整的
[语言服务器 (LSP)](/runtime/reference/cli/lsp/) ，以帮助你增强所选的
IDE。本页将帮助你设置环境，以便在开发过程中充分利用 Deno。

我们将涵盖以下内容：

- 如何在你喜欢的编辑器/IDE 中使用 Deno
- 如何生成 shell 自动补全

## 设置你的编辑器/IDE

### Visual Studio Code

如果你还没有安装 Visual Studio Code，请从
[官方网站](https://code.visualstudio.com/) 下载并安装。

在扩展选项卡中搜索 "Deno" 并安装
[Denoland 提供的扩展](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)。

接下来，按下 `Ctrl+Shift+P` 打开命令面板，输入
`Deno: Initialize Workspace Configuration`。选择此选项以配置你的工作区中的
Deno。

![VSCode 命令面板中选择了 Deno: Initialize Workspace Configuration 选项](./images/vscode-setup.png)

你的工作区中将创建一个名为 `.vscode/settings.json` 的文件，内容如下：

```json
{
  "deno.enable": true
}
```

就是这样！你已经成功使用 VSCode 设置了 Deno 的开发环境。你现在将获得 Deno LSP
的所有好处，包括 IntelliSense、代码格式化、linting 等。

### JetBrains IDEs

要安装 Deno 插件，请打开你的 IDE 并转到 **文件** > **设置**。导航到 **插件**
并搜索 `Deno`。安装官方的 Deno 插件。

![WebStorm 插件设置](./images/webstorm_setup.png)

要配置插件，请再次转到 **文件** > **设置**。导航到 **语言与框架** >
**Deno**。勾选 **为你的项目启用 Deno** 并指定 Deno
可执行文件的路径（如果未自动检测到）。

查看
[这篇博客文章](https://blog.jetbrains.com/webstorm/2020/06/deno-support-in-jetbrains-ides/)
以了解更多关于如何在 JetBrains IDE 中开始使用 Deno 的信息。

### 通过插件使用 Vim/Neovim

Deno 在 [Vim](https://www.vim.org/) 和 [Neovim](https://neovim.io/) 上通过
[coc.nvim](https://github.com/neoclide/coc.nvim)、[vim-easycomplete](https://github.com/jayli/vim-easycomplete)、[ALE](https://github.com/dense-analysis/ale)
和 [vim-lsp](https://github.com/prabirshrestha/vim-lsp)
得到了很好的支持。coc.nvim 提供了集成 Deno 语言服务器的插件，而 ALE 则
_开箱即用_ 支持它。

### 使用内置语言服务器的 Neovim 0.6+

要使用 Deno 语言服务器，请安装
[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/) 并按照说明启用
[提供的 Deno 配置](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#denols)。

请注意，如果你同时有 `ts_ls` 作为 LSP 客户端，你可能会遇到 `ts_ls` 和 `denols`
都附加到当前缓冲区的问题。要解决此问题，请确保为 `ts_ls` 和 `denols`
设置一些唯一的 `root_dir`。你可能还需要将 `ts_ls` 的 `single_file_support`
设置为 `false`，以防止它在 `单文件模式` 下运行。以下是一个示例配置：

```lua
local nvim_lsp = require('lspconfig')
nvim_lsp.denols.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("deno.json", "deno.jsonc"),
}

nvim_lsp.ts_ls.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("package.json"),
  single_file_support = false
}
```

对于 Deno，上面的示例假设项目根目录中存在 `deno.json` 或 `deno.jsonc` 文件。

##### Kickstart.nvim 和 Mason LSP

如果你正在使用
[kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim)，请在你的配置
`init.lua` 中的服务器表中添加上述配置，如下所示：

```lua
local servers = {
        -- ... 一些配置
        ts_ls = {
            root_dir = require("lspconfig").util.root_pattern({ "package.json", "tsconfig.json" }),
            single_file_support = false,
            settings = {},
        },
        denols = {
            root_dir = require("lspconfig").util.root_pattern({"deno.json", "deno.jsonc"}),
            single_file_support = false,
            settings = {},
        },
    }
```

#### coc.nvim

一旦你安装了
[coc.nvim](https://github.com/neoclide/coc.nvim/wiki/Install-coc.nvim)，你需要通过
`:CocInstall coc-deno` 安装所需的
[coc-deno](https://github.com/fannheyward/coc-deno)。

安装插件后，如果你想为工作区启用 Deno，请运行命令
`:CocCommand deno.initializeWorkspace`，你应该能够使用诸如 `gd`（转到定义）和
`gr`（查找引用）等命令。

#### ALE

ALE 通过 Deno 语言服务器开箱即用地支持
Deno，并且在许多情况下不需要额外的配置。一旦你安装了
[ALE](https://github.com/dense-analysis/ale#installation)，你可以执行命令
[`:help ale-typescript-deno`](https://github.com/dense-analysis/ale/blob/master/doc/ale-typescript.txt)
以获取有关可用配置选项的信息。

有关如何设置 ALE（如键绑定）的更多信息，请参阅
[官方文档](https://github.com/dense-analysis/ale#usage)。

#### Vim-EasyComplete

Vim-EasyComplete 无需任何其他配置即可支持 Deno。一旦你安装了
[vim-easycomplete](https://github.com/jayli/vim-easycomplete#installation)，如果你还没有安装
deno，你需要通过 `:InstallLspServer deno` 安装 deno。你可以从
[官方文档](https://github.com/jayli/vim-easycomplete) 获取更多信息。

#### Vim-Lsp

通过
[vim-plug](https://github.com/prabirshrestha/vim-lsp?tab=readme-ov-file#installing)
或 vim 包安装 Vim-Lsp 后，将以下代码添加到你的 `.vimrc` 配置中：

```vim
if executable('deno')
  let server_config = {
    \ 'name': 'deno',
    \ 'cmd': {server_info->['deno', 'lsp']},
    \ 'allowlist': ['typescript', 'javascript', 'javascriptreact', 'typescriptreact'],
    \ }

  if exists('$DENO_ENABLE') 
    let deno_enabled = $DENO_ENABLE == '1' 
    let server_config['workspace_config'] = { 'deno': { 'enable': deno_enabled ? v:true : v:false } } 
  endif

  au User lsp_setup call lsp#register_server(server_config)
endif
```

你将有两种方式启用 LSP 服务器。一种是在当前工作目录中有一个 `deno.json` 或
`deno.jsonc`，或者通过 `DENO_ENABLE=1`
强制启用。此外，如果你想在智能提示工具提示中突出显示语法，你也可以将此代码添加到你的
`.vimrc` 配置中：

```vim
let g:markdown_fenced_languages = ["ts=typescript"]
```

### Emacs

#### lsp-mode

Emacs 通过 [lsp-mode](https://emacs-lsp.github.io/lsp-mode/) 使用 Deno
语言服务器支持 Deno。一旦
[lsp-mode 安装完成](https://emacs-lsp.github.io/lsp-mode/page/installation/)，它应该支持
Deno，并且可以 [配置](https://emacs-lsp.github.io/lsp-mode/page/lsp-deno/)
以支持各种设置。

#### eglot

你也可以使用内置的 Deno 语言服务器，通过
[`eglot`](https://github.com/joaotavora/eglot) 实现。

一个通过 eglot 配置 Deno 的示例：

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

[Pulsar 编辑器，前身为 Atom](https://pulsar-edit.dev/) 支持通过
[atom-ide-deno](https://web.pulsar-edit.dev/packages/atom-ide-deno) 包与 Deno
语言服务器集成。`atom-ide-deno` 要求安装 Deno CLI 以及
[atom-ide-base](https://web.pulsar-edit.dev/packages/atom-ide-base) 包。

### Sublime Text

[Sublime Text](https://www.sublimetext.com/) 支持通过
[LSP 包](https://packagecontrol.io/packages/LSP) 连接到 Deno
语言服务器。你可能还想安装
[TypeScript 包](https://packagecontrol.io/packages/TypeScript)
以获得完整的语法高亮。

一旦你安装了 LSP 包，你需要在你的 `.sublime-project` 配置中添加如下配置：

```jsonc
{
  "settings": {
    "LSP": {
      "deno": {
        "command": ["deno", "lsp"],
        "initializationOptions": {
          // "config": "", // 设置项目中配置文件的路径
          "enable": true,
          // "importMap": "", // 设置项目中 import-map 的路径
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

[Nova 编辑器](https://nova.app) 可以通过
[Deno 扩展](https://extensions.panic.com/extensions/jaydenseric/jaydenseric.deno)
集成 Deno 语言服务器。

### GitHub Codespaces

[GitHub Codespaces](https://github.com/features/codespaces)
允许你在本地机器上完全在线或远程开发，而无需配置或安装
Deno。它目前处于早期访问阶段。

如果项目是 Deno 启用的项目，并且包含 `.devcontainer`
配置作为仓库的一部分，那么在 GitHub Codespaces
中打开项目应该可以直接“工作”。如果你正在启动一个新项目，或者你想为现有的代码空间添加
Deno 支持，可以通过从命令面板中选择
`Codespaces: Add Development Container Configuration Files...`，然后选择
`Show All Definitions...`，并搜索 `Deno` 定义来添加。

选择后，你需要重新构建容器，以便将 Deno CLI
添加到容器中。容器重新构建后，代码空间将支持 Deno。

### Kakoune

[Kakoune](https://kakoune.org/) 支持通过
[kak-lsp](https://github.com/kak-lsp/kak-lsp) 客户端连接到 Deno 语言服务器。一旦
[kak-lsp 安装完成](https://github.com/kak-lsp/kak-lsp#installation)，可以通过将以下内容添加到你的
`kak-lsp.toml` 中来配置它连接到 Deno 语言服务器：

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

### Helix

[Helix](https://helix-editor.com) 内置了语言服务器支持。启用与 Deno
语言服务器的连接需要在 `languages.toml` 配置文件中进行更改。

```toml
[[language]]
name = "typescript"
roots = ["deno.json", "deno.jsonc", "package.json"]
auto-format = true
language-servers = ["deno-lsp"]

[[language]]
name = "javascript"
roots = ["deno.json", "deno.jsonc", "package.json"]
auto-format = true
language-servers = ["deno-lsp"]

[language-server.deno-lsp]
command = "deno"
args = ["lsp"]
config.deno.enable = true
```

## Shell 自动补全

Deno CLI 内置了生成 shell 自动补全信息的功能。通过使用
`deno completions <shell>`，Deno CLI 将输出自动补全信息到标准输出。当前支持的
shell 包括：

- bash
- elvish
- fish
- powershell
- zsh

### bash 示例

输出自动补全并将其添加到环境中：

```shell
> deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
> source /usr/local/etc/bash_completion.d/deno.bash
```

### PowerShell 示例

输出自动补全：

```shell
> deno completions powershell >> $profile
> .$profile
```

这将在 `$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
处创建一个 PowerShell 配置文件，并且它将在你启动 PowerShell 时运行。

### zsh 示例

你应该有一个可以保存自动补全的目录：

```shell
> mkdir ~/.zsh
```

然后输出自动补全：

```shell
> deno completions zsh > ~/.zsh/_deno
```

并确保在你的 `~/.zshrc` 中加载自动补全：

```shell
fpath=(~/.zsh $fpath)
autoload -Uz compinit
compinit -u
```

如果在重新加载 shell 后自动补全仍未加载，你可能需要删除 `~/.zcompdump/`
以删除之前生成的自动补全，然后再次运行 `compinit` 以重新生成它们。

### 使用 ohmyzsh 和 antigen 的 zsh 示例

[ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) 是 zsh
的配置框架，可以更轻松地管理你的 shell
配置。[antigen](https://github.com/zsh-users/antigen) 是 zsh 的插件管理器。

创建目录以存储自动补全并输出自动补全：

```shell
> mkdir ~/.oh-my-zsh/custom/plugins/deno
> deno completions zsh > ~/.oh-my-zsh/custom/plugins/deno/_deno
```

然后你的 `.zshrc` 可能如下所示：

```shell
source /path-to-antigen/antigen.zsh

# 加载 oh-my-zsh 的库。
antigen use oh-my-zsh

antigen bundle deno
```

### fish 示例

将自动补全输出到 fish 配置文件夹中的 completions 目录下的 `deno.fish` 文件：

```shell
> deno completions fish > ~/.config/fish/completions/deno.fish
```

## 其他工具

如果你正在编写或支持使用 Deno 语言服务器的社区集成，请阅读更多关于
[与 Deno LSP 集成](/runtime/reference/lsp_integration/) 的信息，也欢迎加入我们的
[Discord 社区](https://discord.gg/deno) 中的 `#dev-lsp` 频道。
