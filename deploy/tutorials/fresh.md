---
title: "基础 Fresh 站点"
oldUrl:
  - /deploy/docs/fresh/
---

本教程将介绍如何在 Deno Deploy 上部署一个 Fresh 应用程序。

Fresh 是一个为 Deno 构建的 Web 框架，类似于 Node 的 Express。

## **步骤 1:** 创建 Fresh 应用程序

```sh
deno run -A -r https://fresh.deno.dev fresh-site
```

要在本地运行此应用程序：

```sh
deno task start
```

你可以编辑 `routes/index.js` 来修改应用程序。

## **步骤 2:** 创建一个新的 Github 仓库并链接你的本地 Fresh 应用程序。

1. 创建一个新的 Github 仓库并记录 git 仓库的远程 URL。
2. 从本地的 `fresh-site` 目录中，初始化 git 并推送到新的远程仓库：

   ```sh
   git init
   git add .
   git commit -m "First commit"
   git remote add origin <remote-url>
   git push origin main
   ```

## **步骤 3:** 部署到 Deno Deploy

1. 导航到
   [https://dash.deno.com/new_project](https://dash.deno.com/new_project)。
2. 连接到你的 GitHub 账户并选择你的仓库。
3. 填写表单中的值：
   - 为你的项目命名
   - 从 "Framework Preset" 选项中选择 `Fresh`
   - 将生产分支设置为 `main`
   - 选择 `main.ts` 作为入口文件
4. 点击 "Deploy Project" 以启动 Deno Deploy。
5. 部署完成后，你可以在项目仪表板中提供的 URL 查看你的新项目。
