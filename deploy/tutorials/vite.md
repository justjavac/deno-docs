# 使用 Vite 部署 React 应用

本教程介绍了如何在 Deno Deploy 上部署 Vite Deno 和 React 应用。

## **第 1 步：** 创建 Vite 应用

让我们使用 [Vite](https://vitejs.dev/) 快速搭建一个 Deno 和 React 应用：

```sh
deno run --allow-read --allow-write --allow-env npm:create-vite-extra@latest
```

我们将项目命名为 `vite-project`。确保在项目配置中选择 `deno-react`。

然后，进入新创建的项目文件夹。

## **第 2 步：** 构建存储库

```sh
deno task build
```

## **第 3 步：** 创建新的 Deno 项目

前往 https://dash.deno.com/new 并单击 **+空白项目** 按钮，在 **从命令行部署**
下方。

在下一页上，获取项目名称，在这种情况下为 `late-goose-47`。

## **第 4 步：** 部署静态站点到 Deno Deploy

有几种方法可以将 Vite 站点部署到 Deno Deploy。

### GitHub 集成

第一种方法是通过 GitHub 集成。

请记住，GitHub 集成有两种模式：

- **自动**: Deno Deploy
  将在每次推送和部署时自动从您的存储库源中提取代码和资源。此模式非常快速，但不允许进行构建步骤。
- **GitHub Actions**: 在此模式下，您可以从 GitHub Actions
  工作流中将代码和资源推送到 Deno Deploy。这使您能够在部署之前执行构建步骤。

由于这里有一个构建步骤，您需要使用 GitHub Actions 模式。

1. 转到 `<项目名称>` 项目页面，然后在 **Git 集成** 卡下选择 `vite-project`。

   ![vite-project](../docs-images/vite-project.png)

2. 选择生产分支，并在弹出窗口中选择 **GitHub 操作**。

   ![vite-branch](../docs-images/vite-branch.png)

3. 单击 **确定**。

   ![vite-ok](../docs-images/vite-ok.png)

4. 单击 **链接**。

   ![vite-link](../docs-images/vite-link.png)

5. 这将带您到下一页，在该页面上，您将看到一个 `deploy.yml`
   文件的预览，您可以下载该文件并将其添加到您的 `vite-project` 中的
   `.github/workflows/deploy.yml`。

   ![vite-deploy-yaml](../docs-images/vite-deploy-yaml.png)

6. 修改 `deploy.yml` 文件，使其如下所示：

   ```
   name: 部署
   on: [push]

   jobs:
   deploy:
       name: 部署
       runs-on: ubuntu-latest
       permissions:
       id-token: write # 用于与 Deno Deploy 进行身份验证
       contents: read # 用于克隆存储库

       steps:
       - name: 克隆存储库
           uses: actions/checkout@v3

       - name: 安装 Deno
           uses: denoland/setup-deno@v1

       - name: 构建
           run: deno task build

       - name: 部署到 Deno Deploy
           uses: denoland/deployctl@v1
           with:
           project: "<项目名称>"
           entrypoint: https://deno.land/std@$STD_VERSION/http/file_server.ts
           root: dist
   ```

   在此示例中有两个构建步骤：

   - 设置 Deno
   - 运行 `deno task build`

   您还必须将 entrypoint 文件设置为
   `https://deno.land/std@$STD_VERSION/http/file_server.ts`，将 root 设置为
   `/dist`。

   请注意，这不是 Vite
   存储库本身中存在的文件。相反，它是一个外部程序。运行时，此程序会将当前存储库中的所有静态资产文件
   (`vite-project/dist`) 上传到 Deno Deploy。然后，当您访问部署 URL
   时，它将提供本地目录。

一旦 `deploy.yml` 文件被推送到您的 Github 存储库，每当代码被推送到 Github
存储库时，它也将被推送到 Deno Deploy，先运行构建步骤。

### `deployctl`

或者，您可以直接使用 `deployctl` 部署 `vite-project` 到 Deno Deploy。

```
cd /dist
deployctl deploy --project=<项目名称> https://deno.land/std@$STD_VERSION/http/file_server.ts
```
