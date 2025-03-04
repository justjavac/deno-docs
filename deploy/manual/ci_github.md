---
title: "CI 和 GitHub Actions"
oldUrl:
 - /deploy/docs/project/
---

Deno Deploy 的 Git 集成能够部署推送到 GitHub
仓库的代码更改。生产分支上的提交将作为生产部署发布，而其他分支上的提交将作为预览部署发布。

Git 集成有两种操作模式：

- **自动模式**：Deno Deploy
  会在每次推送时自动从你的仓库源拉取代码和资源并进行部署。此模式非常快速，但不允许构建步骤。_这是大多数用户的推荐模式。_
- **GitHub Actions 模式**：在此模式下，你可以通过 GitHub Actions
  工作流将代码和资源推送到 Deno Deploy。这允许你在部署之前执行构建步骤。

Deno Deploy 会根据你的自定义部署配置选择合适的模式。下面，我们将详细介绍
**自动模式** 和 **GitHub Actions 模式** 的不同配置。

## 自动模式

如果你的项目不需要任何额外的构建步骤，系统将选择 **自动模式**。入口文件就是 Deno
Deploy 将运行的文件。

## GitHub Actions

如果你在 **项目配置** 中的 **安装步骤** 和/或 **构建步骤** 中输入了命令，Deno
Deploy 将创建一个必要的 GitHub Actions
工作流文件并将其推送到你的仓库中。在此工作流文件中，我们利用 `deployctl`
[GitHub action][deploy-action] 来部署你的项目。你可以在部署到 Deno Deploy
之前执行任何需要的操作，例如运行构建命令。

要配置你想要运行的预处理命令，请点击选择 Git 仓库后出现的 **显示高级选项**
按钮，然后根据需要输入值。

:::tip

例如，如果你想为 Fresh 项目启用 [提前构建][ahead-of-time builds]，你将在
**构建步骤** 框中输入 `deno task build`。

另请参阅 [Fresh 文档][Deploy to production] 以了解如何将 Fresh 项目部署到 Deno
Deploy。

:::

Deno Deploy 生成并推送到你仓库的 GitHub Actions 工作流文件如下所示。

```yml title=".github/workflows/deploy.yml"
name: Deploy
on:
  push:
    branches: main
  pull_request:
    branches: main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    permissions:
      id-token: write # 需要与 Deno Deploy 进行身份验证
      contents: read # 需要克隆仓库

    steps:
      - name: 克隆仓库
        uses: actions/checkout@v4

      - name: 安装 Deno
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: 构建步骤
        run: "deno task build"

      - name: 上传到 Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: "<你的项目名称>"
          entrypoint: "main.ts"
          root: "."
```

更多详情请参阅
[deployctl README](https://github.com/denoland/deployctl/blob/main/action/README.md)。

[fileserver]: https://jsr.io/@std/http#file-server
[ghapp]: https://github.com/apps/deno-deploy
[deploy-action]: https://github.com/denoland/deployctl/blob/main/action/README.md
[ahead-of-time builds]: https://fresh.deno.dev/docs/concepts/ahead-of-time-builds
[Deploy to production]: https://fresh.deno.dev/docs/getting-started/deploy-to-production
