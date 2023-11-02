# Fresh 站点

本教程将介绍如何在 Deno Deploy 上部署 Fresh 应用程序。

Fresh 是专为 Deno 构建的 Web 框架，类似于 Node 上的 Express。

## **步骤 1：** 创建 Fresh 应用程序

```sh
deno run -A -r https://fresh.deno.dev fresh-site
```

要在本地运行此应用程序：

```sh
deno task start
```

您可以编辑 `routes/index.js` 以修改应用程序。

## **步骤 2：** 创建一个新的 Github 存储库并将其链接到本地的 Fresh 应用程序。

1. 创建一个新的 Github 存储库并记录 Git 存储库的远程 URL
2. 从本地的 `fresh-site`，初始化 Git 并推送到新的远程存储库：

   ```sh
   git init
   git add .
   git commit -m "首次提交"
   git remote add <remote-url>
   git push origin main
   ```

## **步骤 3：** 部署到 Deno Deploy

1. 转到 https://dash.deno.com/new 并单击 **+新项目** 按钮。
2. 在下一页上，选择 **从 Github 存储库部署** 卡片。
3. 填写表单上的值，选择：
   - 刚刚创建的 `fresh-site` Github 存储库
     - 自动（最快）
   - `main` 分支
   - `main.ts` 作为入口文件。
