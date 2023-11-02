# CI 与 GitHub Actions

Deno Deploy 的 Git 集成功能可以部署推送到 GitHub
存储库的代码更改。在生产分支上的提交将被部署为生产部署，而在其他所有分支上的提交将被部署为预览部署。

Git 集成有两种操作模式：

1. 选择组织名称和存储库。_如果您的存储库或组织没有显示，请确保已安装
   [Deno Deploy GitHub 应用][ghapp]。_
2. 选择生产分支。从此分支部署的代码将被部署为生产部署而不是预览部署。
3. 选择 **自动** 或 **GitHub Actions** 部署模式。
   - **自动**：Deno Deploy
     将在每次推送时自动提取代码和资产并部署。此模式非常快，但不允许构建步骤。_这是大多数用户的推荐模式。_
   - **GitHub Actions**：在此模式中，您可以通过 GitHub Actions 工作流从 GitHub
     Actions 部署代码和资产。下面我们将更详细地介绍 **自动** 和**GitHub
     Actions**模式的不同配置。

## 自动

如果您选择上面的 **自动** 模式，随后您将需要选择 Github 存储库中的一个文件作为
"入口" 文件。入口文件只是 Deno 将运行的文件。

## GitHub Actions

**GitHub Actions** 模式允许您通过利用 `deployctl` [Github action][deploy-action]
向您的部署流程添加构建步骤：

1. 转到 `<project-name>` 项目页面，并在 **Git 集成** 卡下选择您的 Github
   存储库。

   ![vite-project](../docs-images/vite-project.png)

2. 为生产分支选择您的分支，在弹出的窗口中选择 **GitHub Actions**。

   ![vite-branch](../docs-images/vite-branch.png)

3. 单击 **确定**。

   ![vite-ok](../docs-images/vite-ok.png)

4. 单击 **链接**。

   ![vite-link](../docs-images/vite-link.png)

5. 这将带您到下一页，在那里您可以看到 `deploy.yml`
   文件的预览，您可以下载该文件并将其添加到您的 Github 项目下的
   `.github/workflows/deploy.yml`。

   ![vite-deploy-yaml](../docs-images/vite-deploy-yaml.png)

6. 根据您的构建步骤、Deno 项目名称和入口文件适当地修改 `deploy.yml` 文件：

   ```yml
   job:
   permissions:
       id-token: write # 这是允许 GitHub Actions 与 Deno Deploy 进行身份验证所需的
       contents: read
   steps:
       - name: 部署到 Deno Deploy
       uses: denoland/deployctl@v1
       with:
           project: my-project # Deno Deploy 上的项目名称
           entrypoint: main.ts # 要部署的入口点
   ```

   默认情况下，将部署整个存储库的内容。可以通过指定 `root` 选项来更改。

   ```yml
   - name: 部署到 Deno Deploy
   uses: denoland/deployctl@v1
   with:
       project: my-project
       entrypoint: index.js
       root: dist
   ```

   `entrypoint` 可以是相对路径、文件名或绝对 URL。如果它是相对路径，它将相对于
   `root` 来解析。支持绝对的 `file:///` 和 `https://` URL。

   要使用 [std/http/file_server.ts][fileserver] 模块部署 `./dist`
   目录，您可以使用以下配置：

   ```yml
   - name: 部署到 Deno Deploy
   uses: denoland/deployctl@v1
   with:
       project: my-project
       entrypoint: https://deno.land/std@$STD_VERSION/http/file_server.ts
       root: dist
   ```

   有关更多详细信息，请参阅
   [deployctl README](https://github.com/denoland/deployctl/blob/main/action/README.md)。

[fileserver]: https://deno.land/std/http/file_server.ts
[ghapp]: https://github.com/apps/deno-deploy
[deploy-action]: https://github.com/denoland/deployctl/blob/main/action/README.md
