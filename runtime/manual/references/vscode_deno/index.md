# 使用 Visual Studio Code

在这一部分，我们将深入探讨如何使用
[Visual Studio Code](https://code.visualstudio.com/) 和官方
[vscode_deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
扩展来开发 Deno 应用程序。

## 安装

vscode 扩展会直接集成到 Deno CLI
中，使用语言服务器协议。这有助于确保您获取有关代码的信息与在 Deno CLI
下运行代码时的工作方式相一致。

Deno 扩展与 vscode 中的其他扩展一样安装，通过浏览 vscode 中的扩展并选择安装
_Deno_ 扩展。或者，如果您已经安装了 vscode，您可以通过
[此链接](vscode:extension/denoland.vscode-deno)
查看扩展并安装它，如果您还没有这样做的话。

安装扩展后，第一次应该会收到一个欢迎页面。如果您错过了它，或者想再次查看它，只需使用命令面板中的
_Deno: Welcome_ 命令。

## 配置扩展

以下部分将详细介绍如何配置扩展以使其最适合您的需求，并覆盖大部分可用设置。

### 启用工作区的 Deno

我们意识到，并非您在 vscode 中编辑的每个项目都是 Deno 项目。默认情况下，vscode
配备了内置的 TypeScript/JavaScript 语言服务，用于编辑 TypeScript 或 JavaScript
文件。

为了获得对 Deno API 的支持以及像 Deno CLI 一样解析模块的能力，您需要为工作区启用
Deno。最直接的方法是使用 vscode 的命令面板中的 _Deno: Initialize Workspace
Configuration_，这将激活一个助手，询问您是否还要启用项目的 linting 和 Deno
不稳定的 API。此命令将指示 vscode
将这些设置存储在工作区配置中（您的工作区根目录的
`.vscode/settings.json`）。一旦助手完成，您将收到通知，表示已为项目设置了 Deno。

这些设置（以及其他设置）可通过 vscode 的
[设置](https://code.visualstudio.com/docs/getstarted/userinterface#_settings)
面板访问。在面板中，设置为 _Deno: Enable_，当手动编辑 JSON 时，设置为
`deno.enable`。

> ⚠️ vscode 有用户和工作区设置。您可能不想在用户设置中启用
> Deno，否则默认情况下，每个工作区都将启用 Deno。

启用项目后，扩展将直接从已安装的 Deno CLI 获取信息。扩展还会禁用内置的
TypeScript/JavaScript 扩展。

### 部分启用工作区的 Deno

虽然 vscode 支持
[工作区文件夹](#workspace-folders)，但它们可能难以配置和使用。因此，引入了
_Deno: Enable Paths_ 选项（或手动编辑时的
`"deno.enablePaths"`）。在给定的工作区（或工作区文件夹）中，可以启用子路径以支持
Deno，而那些路径之外的代码将不会启用 Deno，并且将继续使用 vscode 内置的
JavaScript/TypeScript 语言服务器。

例如，如果您有一个像这样的项目：

```
project
├── worker
└── front_end
```

如果您只想启用 `worker` 路径（及其子路径）以支持 Deno，您需要将 `./worker`
添加到配置中的 _Deno: Enable Paths_ 列表中。

### 使用 linting

扩展可以使用与 `deno lint` 时提供诊断信息的相同引擎。通过在设置面板中启用 _Deno:
Lint_ 设置（或手动编辑设置中的 `deno.lint`），编辑器应该开始在您的代码中显示
lint "warnings"。有关如何使用 Deno linter 的更多信息，请参阅
[Linter](../../tools/linter.md) 部分。

### 使用导入映射

在编辑器中可以使用 [导入映射](../../basics/import_maps.md)。选项 _Deno: Import
Map_（或手动编辑时的
`deno.importMap`）应设置为导入映射文件的值。如果路径是相对路径，它将相对于工作区的根目录进行解析。

### 使用配置文件

通常，Deno
项目不需要配置文件。但有一些情况下，它可能会很有用，如果您希望与在命令行上指定
`--config` 选项时应用相同的设置，则可以使用 _Deno: Config_ 选项（或手动编辑时的
`deno.config`）。

Deno 扩展还会自动识别并应用 `deno.jsonc` 或
`deno.json`，通过查找工作区根目录中的配置文件并应用它。手动指定 _Deno: Config_
选项将覆盖此自动行为。

### 使用格式化

Deno CLI 自带一个内置格式化程序，可以使用 `deno fmt` 来访问，还可以配置为在
vscode 中使用。 _Deno_ 应该出现在 _Editor: Default formatter_
设置的下拉列表中（或者如果您手动编辑设置，它将是
`"editor.defaultFormatter": "denoland.vscode-deno"`）。

有关如何使用格式化程序的更多信息，请参阅
[Code formatter](../../tools/formatter.md)。

### 设置 Deno CLI 的路径

扩展会在主机的 `PATH` 中查找 Deno CLI 可执行文件，但有时这可能不可取，可以设置
_Deno: Path_（或手动编辑时的 `deno.path`）来指向 Deno
可执行文件。如果提供的路径是相对路径，它将相对于工作区的根目录进行解析。

## 导入建议

尝试导入模块时，扩展将提供建议以完成导入。本地相对文件将包括在建议中，还包括任何已缓存的远程文件。

扩展支持注册表自动完成，其中远程模块的远程注册表/网站可以选择提供允许客户端“发现”模块的元数据。默认情况下，扩展将检查主机/源以查看它们是否支持建议，如果支持，扩展将提示您是否要启用它。此行为可以通过取消设置
_Deno > Suggest > Imports: Auto Discover_（或手动编辑时的
`deno.suggest.imports.autoDiscover`）来更改。

可以通过编辑 _Deno > Suggest > Imports: Hosts_/`deno.suggest.imports.hosts`
设置来启用或禁用各个主机/源。

## 缓存远程模块

Deno
支持远程模块，并会在本地缓存中获取远程模块并存储它们。当您在编辑器中开发代码时，如果模块不在缓存中，您将会收到一条诊断消息，指示缺少远程模块或远程
URL:
"`https://deno.land/example/mod.ts`"。除非它是来自注册表导入建议的完成（请参见上文），否则
Deno 不会自动尝试缓存模块。

除了在命令行上运行命令时，扩展还提供了在编辑器中缓存依赖项的方法。缺少依赖项时，将提供一个
_quick fix_，它将尝试缓存依赖项。可以通过在导入符号位置按 <kbd> CTRL </kbd>
<kbd>.</kbd> 或 <kbd> ⌘ </kbd> <kbd>.</kbd>，或在悬停在符号上并选择 _Quick
Fix..._ 来访问修复选项。

还有一个命令面板中的 _Deno: Cache Dependencies_
命令，它将尝试缓存当前在编辑器中处于活动状态的模块的任何依赖项。

## 代码镜头

语言服务器当前支持几个代码镜头（代码中嵌入的可操作上下文信息），允许您更深入地了解代码。大多数默认情况下是禁用的，但可以轻松启用：

- _Deno > Code Lens: Implementations_/`deno.codeLens.implementations` -
  提供一个列出代码中其他位置的项的任何实现的代码镜头。
- _Deno > Code Lens: References_/`deno.codeLens.references` -
  提供一个列出代码中其他位置对项的引用的代码镜头。
- _Deno > Code Lens: References All
  Functions_/`deno.codeLens.referencesAllFunctions` -
  提供一个列出代码中所有函数的所有引用的代码镜头。所有函数都不包括在上面的
  _References_ 中提到的。

## 测试代码镜头

Deno CLI 包括一个 [内置的测试 API](../../basics/testing/index.md)，可以在
`Deno.test`
下使用。扩展和语言服务器默认启用了一个代码镜头，允许您从编辑器内运行测试。

当您有一个提供测试的代码块时，如：

```ts
import { assert } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

Deno.test({
  name: "a test case",
  fn() {
    let someCondition = true;
    assert(someCondition);
  },
});
```

您将看到一个如下所示的代码镜头，位于测试之上：

```
▶ Run Test
```

这是一个链接，如果单击它，扩展将启动 Deno CLI
来为您运行测试并显示输出。根据您的其他设置，扩展将尝试使用相同的设置运行测试。如果需要在执行
`deno test` 时提供的参数进行调整，可以通过设置 `deno.codeLens.testArgs`
设置来实现。

扩展还会尝试跟踪同一模块中是否解构了 `Deno.test`
函数或将其分配给变量。因此，您可以做类似这样的事情，并且仍然可以使用代码镜头：

```ts
const { test: denoTest } = Deno;

denoTest({
  name: "example test",
  fn() {},
});
```

如果要禁用此功能，可以通过取消设置 _Deno > CodeLens: Test_/`deno.codeLens.test`
设置来实现。

## 使用调试器

扩展提供与内置 VSCode 调试器的集成。您可以通过以下方式生成配置：转到
`运行和调试` 面板，单击 `创建launch.json文件`，然后从可用的调试选项中选择 `Deno`
选项。

默认情况下，如果配置的 Deno 版本大于 1.29，则配置将使用 `--inspect-wait`
标志，否则使用
`--inspect-brk`。这确保了调试器有机会连接到您的程序并注册代码中指定的所有断点。

## 任务

扩展程序直接与语言服务器通信，但对于某些开发任务，您可能希望直接执行
CLI。扩展程序提供了一个任务定义，允许您创建从编辑器内部执行 `deno` CLI 的任务。

### Deno CLI 任务

Deno CLI 任务的模板具有以下界面，可以在工作区的 `tasks.json` 中配置：

```ts
interface DenoTaskDefinition {
  type: "deno";
  // 要运行的 `deno` 命令（例如 `run`，`test`，`cache` 等）
  command: string;
  // 在命令行上传递的附加参数
  args?: string[];
  // 执行命令的当前工作目录
  cwd?: string;
  // 在执行时应设置的任何环境变量
  env?: Record<string, string>;
}
```

编辑器中有用的一些命令被配置为模板，并可以通过选择命令面板中的
`任务：配置任务`，然后搜索 `deno` 任务，将其添加到您的工作区中。

在 `tasks.json` 中，`deno run mod.ts` 的示例如下：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "deno",
      "command": "run",
      "args": [
        "mod.ts"
      ],
      "problemMatcher": [
        "$deno"
      ],
      "label": "deno: run"
    }
  ]
}
```

## 工作区文件夹

Deno 语言服务器和此扩展支持
[多根工作区](https://code.visualstudio.com/docs/editor/multi-root-workspaces)
配置，在其中，可以将某些设置应用于工作区内的工作区文件夹。

当将文件夹添加到工作区并打开设置时，您将可以访问每个文件夹的设置。如果查看文件夹中的
`.vscode/settings.json`，您将看到一个视觉指示，显示哪些设置适用于文件夹，哪些来自工作区配置：

![.vscode/setting.json 配置为工作区文件夹的屏幕截图](../../images/workspace_folder_config.png)

### 工作区文件夹设置

以下是可以在工作区文件夹上设置的设置。目前，其余的设置仅适用于工作区：

- `deno.enable` - 控制是否启用 Deno 语言服务器。启用时，扩展将禁用内置的 vscode
  JavaScript 和 TypeScript 语言服务，而将使用 Deno 语言服务器。_布尔值，默认为
  `false`_
- `deno.enablePaths` - 控制是否仅对工作区文件夹的特定路径启用 Deno
  语言服务器。默认为空列表。
- `deno.codeLens.test` - 控制是否启用测试代码镜头。_布尔值，默认为 `true`_
- `deno.codeLens.testArgs` - 激活测试代码镜头时传递给 `deno test`
  的参数列表。_字符串数组，默认为 `["--allow-all"]`_

### 混合 Deno 项目

尽管您可以使用此功能启用混合 Deno 项目，但您可能希望考虑
[部分启用 Deno 工作区](#部分启用Deno工作区)。但使用此功能，您可以拥有混合 Deno
项目，其中某些工作区文件夹已启用
Deno，而其他工作区文件夹未启用。这在创建可能包含前端组件的项目时非常有用，其中您希望为前端代码使用不同的配置。

为了支持这一点，您可以创建一个新的工作区（或将文件夹添加到现有工作区），并在设置中将一个文件夹的
`deno.enable` 设置为 `true`，将另一个文件夹的设置为
`false`。一旦保存了工作区配置，您会注意到 Deno
语言服务器仅对已启用的文件夹应用诊断，而其他文件夹将使用 vscode 的内置
TypeScript 编译器为 TypeScript 和 JavaScript 文件提供诊断。

## 使用开发容器

使用 [开发容器](https://code.visualstudio.com/docs/remote/containers) 与 vscode
一起使用是一种在无需在本地系统上安装 Deno CLI
的情况下拥有隔离开发环境的绝佳方式。

要使用开发容器，您需要安装一些
[先决条件](https://code.visualstudio.com/docs/remote/containers#_installation)：

- Docker Desktop
- Visual Studio Code 或 Visual Studio Code Insiders
- [远程开发扩展包](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

配置开发容器的方法是在工作区中包含一个 `.devcontainer`
文件夹，该文件夹包含文件夹中的配置信息。如果您正在打开一个已包含 Deno
的项目，系统将提示您构建开发容器并访问该项目。一切都应该“一切正常”。

如果您有一个现有的 Deno
项目，并希望为其添加开发容器支持，您将需要在命令面板中执行命令
"Remote-Containers: Add Development Container Configuration Files..."，然后选择
"Show All Definitions..."，然后搜索 "Deno" 定义。这将为您设置一个基线
`.devcontainer` 配置，该配置将在容器中安装 Deno CLI 的最新版本。

一旦添加，vscode 将提示您是否要在开发容器中打开项目。如果选择是，

vscode 将构建开发容器并重新打开工作区，使用开发容器，其中将安装 Deno CLI 和
`vscode_deno` 扩展。

## 故障排除

以下部分涵盖您在使用扩展时可能遇到的挑战，并尝试提供可能的原因。

### 类似于 `An import path cannot end with a '.ts' extension.` 或 `Cannot find name 'Deno'` 的错误/诊断

这通常是 Deno 未启用的情况。如果查看您可能会看到 `ts(2691)` 的诊断源。`ts`
表示它来自 vscode 内置的 TypeScript/JavaScript
引擎。您需要检查配置是否正确设置，并且 `Deno: Enable`/`deno.enable` 为 true。

您还可以使用命令面板中的 "Deno: Language Server Status" 检查 Deno
语言服务器认为的当前活动配置。这将显示来自语言服务器的文档，其中有一个名为
"Workspace Configuration" 的部分。这将向您提供 vscode 向语言服务器报告的配置。

还要检查名为 `enableProjectDiagnostics` 的 VSCode 配置，位于 **TypeScript ›
Tsserver › Experimental: Enable Project Diagnostics**，是否 **禁用**。此设置允许
TypeScript 语言服务器在后台执行以一次性检查整个项目，Deno
无法禁用其行为，因此即使所有其他设置正确设置，错误仍然会显示。

如果在其中将 "enable" 设置为 "true"，错误消息仍然存在，您可能需要尝试重新启动
vscode，因为扩展的一部分，用于为文件 "静音" 内置 TypeScript
诊断，未按设计工作。如果在重新启动后问题仍然存在，则可能遇到了我们没有预料到的错误，可以通过在
https://github.com/denoland/vscode_deno 上搜索问题并报告错误来继续下一步。
