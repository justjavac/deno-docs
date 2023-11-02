# 快速入门

这个指南将带领您从设置 Deno Deploy 帐户到部署您的第一个项目。

## **步骤 1：** 注册 Deno Deploy 帐户

如果您没有 Deno Deploy 帐户，[注册](https://deno.com/deploy) 后继续。

## **步骤 2：** 部署项目

登录到您的帐户后，您应该会看到一个列出您的项目的页面（因为这是一个新帐户，您不会有任何项目）。

点击 **+新建项目** 按钮

在 Deno Deploy 中有三种部署新项目的方式：

- [使用 GitHub 集成部署](./manual/ci_github.md)
- [使用 `deployctl` 部署](./manual/deployctl.md)
- [使用 Deno Deploy Playground 部署](./manual/playgrounds.md)

根据您的项目类型选择其中一种方法。

### 我们的建议

一般情况下，我们建议使用 GitHub 集成部署，因为它是最快的方式。如果您需要首先运行
CI 构建流程（例如生成静态资源），我们建议使用 GitHub 集成部署，并选择
[GitHub Action](./manual/ci_github.md#github-action)

## **步骤 3：** 如有必要，调整项目设置

一旦项目创建完成，您可以在 **设置**
选项卡上调整许多项目设置。有关更多详细信息，请参阅以下链接。

- [自定义域名](./manual/custom-domains.md)
- [环境变量](./manual/environment-variables.md)

## **步骤 4：** 查找项目 URL

生产 URL 是您的生产部署可以访问的 URL。

项目名称将确定项目的生产 URL。

它的形式为 `$PROJECT_ID.deno.dev`（例如 https://dead-clam-55.deno.dev）。
