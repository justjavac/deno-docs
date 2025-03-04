---
title: "Deno 与 Visual Studio Code"
oldUrl:
- /runtime/manual/vscode_deno/
- /runtime/manual/references/vscode_deno/
- /runtime/manual/references/vscode_deno/testing_api/
---

本页面介绍了如何使用 [Visual Studio Code](https://code.visualstudio.com/)
和官方的
[vscode_deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
扩展开发 Deno 应用程序。

## 安装

Deno VS Code 扩展通过 [语言服务器协议](/runtime/reference/lsp_integration/)
直接与 Deno CLI 集成。这有助于确保您获得的代码信息与使用 Deno CLI
运行代码时的行为一致。

Deno 扩展的安装方式与 VS Code 中的其他扩展相同。在 VS Code 的扩展选项卡中搜索
`Deno` 并点击 **安装** 按钮，或者点击
[此链接](vscode:extension/denoland.vscode-deno) 打开扩展页面进行安装。

首次安装扩展后，您应该会看到一个欢迎页面。（如果您错过了它，或者想再次查看，按
<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> 打开命令面板，然后运行 **Deno: Welcome**
命令。）

## 在 VS Code 工作区中启用 Deno

我们意识到并非您在 VS Code 中处理的每个项目都是 Deno 项目。默认情况下，VS Code
自带内置的 TypeScript/JavaScript 语言服务，用于编辑 TypeScript 或 JavaScript
文件。

为了支持 Deno API 以及像 Deno CLI 那样解析模块的能力，您需要为工作区启用
Deno。最直接的方法是使用 VS Code
[命令面板](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)
中的 **Deno: Initialize Workspace Configuration**。

![命令面板中 Deno: Initialize Workspace Configuration 的截图](./images/command_palette.png)

此命令会将 `"deno.enable": true` 添加到工作区配置中（您的工作区根目录
`.vscode/settings.json`）。命令完成后，您将收到 Deno 工作区已初始化的通知。

![通知 'Deno workspace initialized' 的截图](./images/vscode_workspace_initialized.png)

这些设置（以及其他设置）可以通过 VS Code
[设置](https://code.visualstudio.com/docs/getstarted/userinterface#_settings)
面板进行配置。在面板中，该设置名为 **Deno: Enable**。

:::note

VS Code 有用户设置和工作区设置。您可能不希望在所有工作区中启用 Deno，因此建议在
**工作区** 设置中启用，而不是在 **用户** 设置中启用。

:::

### 工作区文件夹设置

以下是可以为工作区文件夹设置的设置。其余设置目前仅适用于工作区：

- `deno.enable` - 控制是否启用 Deno 语言服务器。启用后，扩展将禁用 VS Code
  内置的 JavaScript 和 TypeScript 语言服务，并使用 Deno
  语言服务器代替。_布尔值，默认 `false`_
- `deno.enablePaths` - 控制是否仅为工作区文件夹的特定路径启用 Deno
  语言服务器。默认为空列表。
- `deno.codeLens.test` - 控制是否启用测试代码透镜。_布尔值，默认 `true`_
- `deno.codeLens.testArgs` - 激活测试代码透镜时传递给 `deno test`
  的参数列表。_字符串数组，默认 `["--allow-all"]`_

当项目启用后，扩展将直接从已安装的 Deno CLI 获取信息。扩展还将静音内置的
TypeScript/JavaScript 扩展。

## 在 VS Code 工作区中部分启用 Deno

在工作区（或工作区文件夹）中，可以为子路径启用
Deno，而路径外的代码将不会启用，VS Code 内置的 JavaScript/TypeScript
语言服务器将继续使用。使用 **Deno: Enable Paths** 设置（或手动编辑
`deno.enablePaths`）

例如，如果您有一个如下结构的项目：

```console
project
├── worker
└── front_end
```

如果您只想启用 `worker` 路径（及其子路径）为 Deno 启用，您需要在配置中将
`./worker` 添加到 **Deno: Enable Paths** 列表中。

## 混合 Deno 项目

通过此功能，您可以拥有一个混合 Deno 项目，其中一些工作区文件夹启用了
Deno，而另一些则没有。这在创建可能具有前端组件的项目时非常有用，您可能希望为该前端代码使用不同的配置。

为了支持这一点，您可以创建一个新的工作区（或将文件夹添加到现有工作区），并在设置中将其中一个文件夹的
`deno.enable` 设置为 `true`，另一个设置为 `false`。保存工作区配置后，您会注意到
Deno 语言服务器仅对启用的文件夹应用诊断，而其他文件夹将使用 VS Code 内置的
TypeScript 编译器为 TypeScript 和 JavaScript 文件提供诊断。

## 代码检查

使用 `deno lint` 时提供诊断的引擎也可以通过扩展使用。通过在设置面板中启用
**Deno: Lint** 设置（或在 JSON 中编辑
`deno.lint`），编辑器将开始在代码中显示代码检查“警告”。有关如何使用 Deno
代码检查器的更多信息，请参阅 [代码检查器](/runtime/reference/cli/linter/) 部分。

## 使用配置文件

Deno
项目不需要配置文件，但在某些情况下它可能很有用。如果您希望应用与在命令行中指定
`--config` 选项时相同的设置，可以使用 **Deno: Config** 选项（或手动编辑
`deno.config`）。

Deno 扩展还会自动识别并应用 `deno.jsonc` 或
`deno.json`，通过在工作区根目录中查找配置文件并应用它。手动指定 **Deno: Config**
选项将覆盖此自动行为。

## 格式化

Deno CLI 自带 [内置格式化器](/runtime/reference/cli/formatter/)，可以通过
`deno fmt` 访问，也可以配置为在 VS Code 中使用。`Deno` 应该出现在 **Editor:
Default formatter** 设置的下拉列表中（或者如果您手动编辑设置，则为
`"editor.defaultFormatter": "denoland.vscode-deno"`）。

## 设置 Deno CLI 路径

扩展会在主机的 `PATH` 中查找 Deno CLI 可执行文件，但有时这并不理想，可以通过设置
**Deno: Path**（或手动编辑 `deno.path`）来指向 Deno
可执行文件。如果提供的路径是相对路径，它将相对于工作区根目录解析。

## 导入建议

在尝试导入模块时，扩展将提供完成导入的建议。本地相对文件将包含在建议中，以及任何缓存的远程文件。

扩展支持注册表自动补全，远程注册表/网站可以选择提供允许客户端发现模块的元数据。默认情况下，扩展将检查主机/来源以查看它们是否支持建议，如果支持，扩展将提示您是否要启用它。此行为可以通过取消选中设置中的
**Deno > Suggest > Imports: Auto Discover** 来更改（或手动编辑
`deno.suggest.imports.autoDiscover`）。

可以通过编辑 **Deno > Suggest > Imports: Hosts** 设置 -
`deno.suggest.imports.hosts` 来启用或禁用单个主机/来源。

## 缓存远程模块

Deno 支持远程模块，并将获取远程模块并将其存储在本地缓存中。当您在命令行上执行
`deno run`、`deno test`、`deno info` 或 `deno install` 等操作时，Deno CLI
将尝试获取任何远程模块及其依赖项并填充缓存。

在编辑器中开发代码时，如果模块不在缓存中，您将收到类似
`Uncached or missing remote URL: "https://deno.land/example/mod.ts"`
的诊断信息。Deno
不会自动尝试缓存模块，除非它是来自注册表导入建议的补全（见上文）。

除了在命令行上运行命令外，扩展还提供了在编辑器中缓存依赖项的方法。缺失的依赖项将有一个
_快速修复_，即让 Deno 尝试缓存依赖项。可以通过按 <kbd>CTRL</kbd> <kbd>.</kbd> 或
<kbd>⌘</kbd> <kbd>.</kbd> 访问修复，或者将鼠标悬停在导入说明符上并选择 **Quick
Fix...**。

命令面板中还有 **Deno: Cache Dependencies**
命令，它将尝试缓存当前编辑器中活动模块的任何依赖项。

## 代码透镜

语言服务器目前支持多个代码透镜（代码中可操作的上下文信息），使您能够更深入地了解代码。大多数默认情况下是禁用的，但可以轻松启用：

### Deno > Code Lens: Implementations

`deno.codeLens.implementations` - 提供一个透镜，列出代码中其他位置的任何实现。

### Deno > Code Lens: References

`deno.codeLens.references` - 提供一个透镜，列出代码中其他位置的任何引用。

### Deno > Code Lens: References All Functions

`deno.codeLens.referencesAllFunctions` -
提供一个透镜，列出代码中所有函数的所有引用。所有函数都排除在上述 _References_
设置之外。

### 测试代码透镜

Deno CLI 包含一个
[内置测试 API](/runtime/reference/lsp_integration/#testing)，可通过 `Deno.test`
访问。扩展和语言服务器默认启用一个代码透镜，提供从编辑器中运行测试的能力。

当您有一段提供测试的代码时：

```ts
import { assert } from "jsr:@std/assert@1";

Deno.test({
  name: "a test case",
  fn() {
    let someCondition = true;
    assert(someCondition);
  },
});
```

您将在测试上方看到一个代码透镜：

```console
▶ Run Test
```

如果您点击代码透镜，扩展将启动 Deno CLI
为您运行测试并显示输出。根据您的其他设置，扩展将尝试使用相同的设置运行您的测试。如果您需要调整执行
`deno test` 时提供的参数，可以通过设置 `deno.codeLens.testArgs` 来实现。

扩展还将尝试跟踪在同一模块中是否解构了 `Deno.test`
函数或将其分配给变量。因此，您可以执行以下操作，代码透镜仍然有效：

```ts
const { test: denoTest } = Deno;

denoTest({
  name: "example test",
  fn() {},
});
```

如果您想禁用此功能，可以通过取消设置 **Deno > CodeLens: Test** 设置 -
`deno.codeLens.test` 来实现。

您可以从测试资源管理器视图、代码透镜装饰或通过命令面板运行测试。您还可以使用测试资源管理器视图中的过滤功能从测试运行中排除某些测试。

当测试失败时，失败消息（包括堆栈跟踪）将在 VS Code 中检查测试结果时可用。

### 测试配置

默认情况下，测试的执行方式类似于在命令行中使用
`deno test --allow-all`。这些默认参数可以通过在用户或工作区设置中设置 **Deno >
Testing: Args** 选项来更改（或手动配置 `deno.testing.args`）。在此处添加您将用于
`deno test` 子命令的各个参数。

根据您拥有的其他设置，这些选项将自动合并到运行测试时使用的“命令行”中，除非在
**Deno > Testing: Args** 设置中明确提供。

## 使用调试器

扩展提供了与内置 VS Code 调试器的集成。您可以通过以下方式生成配置：转到
`Run and Debug` 面板，点击 `create a launch.json file`
并从可用的调试器选项中选择 `Deno` 选项。

## 任务

虽然扩展直接与语言服务器通信，但有时您可能更喜欢通过 CLI 运行 Deno
命令。您可以在工作区根目录的 `deno.json` 文件中定义任务，位于
[`tasks` 字段](/runtime/fundamentals/configuration/#tasks) 中。

## 使用开发容器

使用 [开发容器](https://code.visualstudio.com/docs/remote/containers) 与 VS Code
是一种很好的方式，可以在无需在本地系统上安装 Deno CLI
的情况下拥有一个隔离的开发环境。Deno 支持开发容器，Deno 扩展将与它们一起工作。

如果您有一个现有的 Deno 项目并希望为其添加开发容器支持，请在命令面板中执行
**Remote-Containers: Add Development Container Configuration Files...**，选择
**Show All Definitions...**，然后搜索 `Deno` 定义。这将设置一个基础的
`.devcontainer` 配置，该配置将在容器中安装最新版本的 Deno CLI。

添加后，VS Code 将提示您是否要在开发容器中打开项目。如果您选择是，VS Code
将构建开发容器并使用开发容器重新打开工作区，其中将安装 Deno CLI 和 `vscode_deno`
扩展。

## 故障排除

以下部分涵盖了使用扩展时可能遇到的挑战，并尝试给出可能的原因。

### 错误/诊断

`An import path cannot end with a '.ts' extension.` 或
`Cannot find name 'Deno'.`

这通常是 Deno 项目未启用 Deno 的情况。如果您查看诊断的来源，您可能会看到
`ts(2691)`。`ts` 表示它来自 VS Code 内置的 TypeScript/JavaScript
引擎。您需要检查您的配置是否正确设置，并且 **Deno: Enable** 设置 - `deno.enable`
为 true。

您还可以通过使用命令面板中的 **Deno: Language Server Status** 来检查 Deno
语言服务器认为您当前的活跃配置是什么。这将显示来自语言服务器的文档，其中包含名为“Workspace
Configuration”的部分。这将为您提供 VS Code 报告给语言服务器的配置。

还要检查 VS Code 配置中名为 `enableProjectDiagnostics` 的设置，位于 **TypeScript
› Tsserver › Experimental: Enable Project Diagnostics** 是否
**禁用**。此设置允许 TypeScript 语言服务器在后台执行以一次性检查整个项目，Deno
无法禁用其行为，因此即使所有其他设置都正确设置，错误仍然会显示。

如果 `"enable"` 设置为 `true`，并且错误消息仍然存在，您可能希望尝试重新启动 VS
Code，因为扩展中“静音”内置 TypeScript
诊断文件的部分未按设计工作。如果重新启动后问题仍然存在，您可能遇到了我们未预料到的错误，下一步是在
https://github.com/denoland/vscode_deno 搜索问题并报告错误。
