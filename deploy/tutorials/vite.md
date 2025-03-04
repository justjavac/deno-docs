---
title: "使用 Vite 部署 React 应用"
oldUrl:
  - /deploy/docs/vite/
  - /deploy/manual/vite
---

本教程介绍如何在 Deno Deploy 上部署一个使用 Vite 构建的 Deno 和 React 应用。

## 第一步：创建 Vite 应用

让我们使用 [Vite](https://vitejs.dev/) 快速搭建一个 Deno 和 React 应用：

```sh
deno run -RWE npm:create-vite-extra@latest
```

我们将项目命名为 `vite-project`。在项目配置中，请确保选择 `deno-react`。

然后，使用 `cd` 进入新创建的项目文件夹。

## 第二步：在本地运行项目

要查看和编辑你的新项目，可以在本地运行：

```sh
deno task dev
```

## 第三步：使用 Deno Deploy 部署你的项目

现在一切就绪，让我们部署你的新项目！

1. 在浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并链接你的
   GitHub 账户。
2. 选择包含你新 Vite 项目的仓库。
3. 你可以为项目命名，或者让 Deno 自动生成一个名称。
4. 在 **Framework Preset** 下拉菜单中选择 **Vite**。这将自动填充 **Entrypoint**
   表单字段。
5. 将 **Install step** 留空。
6. 将 **Build step** 设置为 `deno task build`。
7. 将 **Root directory** 设置为 `dist`。
8. 点击 **Deploy Project**。

> 注意：设置的入口点将是 `jsr:@std/http/file-server`。请注意，这并不是 Vite
> 仓库中存在的文件，而是一个外部程序。运行时，该程序会将当前仓库（`vite-project/dist`）中的所有静态资源文件上传到
> Deno Deploy。然后，当你访问部署 URL 时，它会提供本地目录中的内容。

### `deployctl`

或者，你可以直接使用 `deployctl` 将 `vite-project` 部署到 Deno Deploy。

```console
cd /dist
deployctl deploy --project=<project-name> --entrypoint=jsr:@std/http/file-server
```
