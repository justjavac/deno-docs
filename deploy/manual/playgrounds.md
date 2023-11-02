# Playgrounds

**Playground** 是一个轻松的方式来体验 Deno Deploy，并创建小型项目。使用
Playground，您可以编写代码、运行它，并在浏览器内完全查看输出。

Playground 具有与正常项目相同的全部 Deno Deploy
功能：它们支持环境变量、自定义域和日志等所有相同的功能。

Playground 的性能也与 Deno Deploy
上的所有其他项目一样出色：它们充分利用我们的全球网络，尽可能地运行您的代码靠近用户。

- [创建 Playground](#creating-a-playground)
- [使用 Playground 编辑器](#using-the-playground-editor)
- [使 Playground 公开](#making-a-playground-public)
- [将 Playground 导出到 GitHub](#exporting-a-playground-to-GitHub)

## 创建 Playground

要创建一个新的 Playground，请按照 [项目概述页面](https://dash.deno.com/projects)
右上角的 **新建 Playground** 按钮。

这将创建一个具有随机生成名称的新 Playground。您可以稍后在项目设置中更改此名称。

## 使用 Playground 编辑器

当您创建一个新的 Playground 时，Playground
编辑器会自动打开。您还可以通过导航到您项目的概述页面并单击 **编辑**
按钮来打开它。

编辑器分为两个主要区域：左侧是编辑器，右侧是预览面板。编辑器是您编写代码的地方，预览面板是您通过浏览器窗口查看代码输出的地方。

左侧的编辑器面板下方还有一个日志面板。该面板显示您代码的控制台输出，用于调试您的代码。

编辑代码后，您需要保存并部署，以便右侧的预览更新。您可以通过单击编辑器右上角的
**保存和部署** 按钮，按 <kbd>Ctrl</kbd> + <kbd>S</kbd>，或使用 <kbd>F1</kbd>
打开命令面板并选择 **Deploy: 保存并部署** 来执行此操作。

在编辑器右上角的工具栏中，您可以查看项目的当前部署状态，当保存时会自动刷新右侧的预览面板。

编辑器右上角的语言下拉菜单允许您在 JavaScript、JSX、TypeScript 和 TSX
之间切换。默认选择的语言是 TSX，适用于大多数情况。

## 使 Playground 公开

可以通过将 Playground 设为公开与其他用户共享。这意味着任何人都可以查看
Playground 及其预览。公共 Playground
无法由任何人编辑，仍然只能由您编辑。日志也仅对您显示。用户可以选择复制公共
Playground 以创建可编辑的私人副本。

要使 Playground 公开，请在编辑器的顶部工具栏中单击 **分享** 按钮。Playground 的
URL 将自动复制到剪贴板。

您还可以在 Deno Deploy 仪表板中的 Playground 设置页面上更改 Playground
的可见性。这可用于将 Playground 的可见性从公开更改为私有。

## 将 Playground 导出到 GitHub

可以将 Playground 导出到 GitHub。如果您的项目开始超出 Playground
编辑器的单个文件限制，这将非常有用。

这将创建一个包含 Playground 代码的新 GitHub 存储库。此项目将自动转为链接到这个新
GitHub 存储库的 git 项目。环境变量和域将被保留。

新 GitHub 存储库将在您的个人帐户中创建，并将设置为私有。您可以稍后在 GitHub
存储库设置中更改这些设置。

导出 Playground 后，您将无法再使用 Deno Deploy Playground
编辑器进行此项目。这是一项单向操作。

要导出 Playground，请访问 Deno Deploy 仪表板中的 Playground
设置页面，或在编辑器中按 <kbd> F1 </kbd> 选择 **Deploy: 导出到 GitHub**。

在此处，您可以为新的 GitHub 存储库输入一个名称。此名称将用于在 GitHub
上创建存储库。存储库不得已存在。

按 **导出** 以将 Playground 导出到 GitHub。
