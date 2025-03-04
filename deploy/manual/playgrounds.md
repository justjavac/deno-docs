---
title: "Playgrounds"
---

**Playgrounds** 是一种简单的方式来体验 Deno Deploy，并创建小型项目。使用
playgrounds，你可以在浏览器中编写代码、运行代码并查看输出。

Playgrounds 拥有 Deno Deploy
的全部功能：它们支持与普通项目相同的所有特性，包括环境变量、自定义域名和日志。

Playgrounds 的性能与 Deno Deploy
上的所有其他项目一样出色：它们充分利用了我们的全球网络，使你的代码尽可能靠近用户运行。

- [创建 playground](#creating-a-playground)
- [使用 playground 编辑器](#using-the-playground-editor)
- [将 playground 公开](#making-a-playground-public)
- [将 playground 导出到 GitHub](#exporting-a-playground-to-github)

## 创建 playground

要创建一个新的 playground，请在 [项目概览页面](https://dash.deno.com/projects)
的右上角点击 **New Playground** 按钮。

这将创建一个具有随机生成名称的新 playground。你可以在项目设置中稍后更改此名称。

## 使用 playground 编辑器

当你创建一个新的 playground 时，playground
编辑器会自动打开。你也可以通过导航到项目的概览页面并点击 **Edit** 按钮来打开它。

编辑器由两个主要区域组成：左侧的编辑器和右侧的预览面板。编辑器是你编写代码的地方，而预览面板则是你通过浏览器窗口查看代码输出的地方。

在编辑器面板的左侧下方还有一个日志面板。此面板显示代码的控制台输出，对于调试代码非常有用。

编辑代码后，你需要保存并部署它，以便右侧的预览更新。你可以通过点击右上角的
**Save & Deploy** 按钮、按下 <kbd>Ctrl</kbd> + <kbd>S</kbd>，或通过按
<kbd>F1</kbd> 打开命令面板并选择 **Deploy: Save & Deploy** 来完成此操作。

在编辑器右上角的工具栏中，你可以在保存时查看项目的当前部署状态。

右侧的预览面板会在每次保存并部署代码后自动刷新。

编辑器右上角的语言下拉菜单允许你在 JavaScript、JSX、TypeScript 和 TSX
之间切换。默认选择的语言是 TSX，适用于大多数情况。

## 将 playground 公开

Playgrounds 可以通过公开的方式与其他用户共享。这意味着任何人都可以查看
playground 及其预览。公开的 playground
不能被任何人编辑：它们仍然只能由你编辑。日志也仅对你显示。用户可以选择 fork
一个公开的 playground，以创建一个他们可以编辑的私有副本。

要将 playground 公开，请点击编辑器中顶部工具栏的 **Share** 按钮。你的 playground
的 URL 将自动复制到剪贴板。

你也可以从 Deno Deploy 仪表板中的 playground 设置页面更改 playground
的可见性。这可以用于将 playground 的可见性从公开更改为私有。

## 将 playground 导出到 GitHub

Playgrounds 可以导出到 GitHub。这在你的项目开始超出 playground
编辑器的单文件限制时非常有用。

这样做将创建一个包含 playground 代码的新 GitHub
仓库。该项目将自动转换为一个链接到这个新 GitHub 仓库的 git
项目。环境变量和域名将被保留。

新的 GitHub 仓库将在你的个人账户中创建，并设置为私有。你可以在 GitHub
仓库设置中稍后更改这些设置。

导出 playground 后，你将无法再使用 Deno Deploy playground
编辑器来编辑此项目。这是一个单向操作。

要导出 playground，请访问 Deno Deploy 仪表板中的 playground
设置页面，或从命令面板中选择 **Deploy: Export to GitHub**（在编辑器中按
<kbd>F1</kbd>）。

在这里，你可以输入新 GitHub 仓库的名称。此名称将用于在 GitHub
上创建仓库。该仓库必须不存在。

点击 **Export** 将 playground 导出到 GitHub。
