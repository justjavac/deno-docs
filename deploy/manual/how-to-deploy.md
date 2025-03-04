---
title: "通过 GitHub 集成部署"
---

部署更复杂项目的最简单方法是通过我们的 Github 集成。 这允许你将 Deno Deploy
项目链接到 GitHub 仓库。每次你推送到仓库时，你的更改将自动部署。

通过 Github 集成，你可以添加一个 Github Action，在部署过程中定义构建步骤。

有关更多详细信息，请参阅 [Github 集成页面](ci_github)。

### 使用 [`deployctl`](./deployctl.md) 从命令行部署

`deployctl` 是一个命令行工具，用于将你的代码部署到 Deno Deploy。通过使用
`deployctl`，你可以比上述自动 GitHub 集成更详细地控制部署。

有关更多详细信息，请参阅 [`deployctl` 页面](./deployctl.md)。

### 通过 playground 部署

部署代码的最简单方法是通过 Deno Deploy playground。

有关更多详细信息，请参阅 [playground 页面](playgrounds)。
