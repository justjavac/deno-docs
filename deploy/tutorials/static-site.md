---
title: "部署静态网站"
oldUrl:
  - /deploy/docs/static-site/
---

本教程将介绍如何在 Deno Deploy 上部署一个静态网站（无 JavaScript）。

## 第一步：创建静态网站

```sh
mkdir static-site
cd static-site
touch index.html
```

在你的 `index.html` 中，粘贴以下 HTML 代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello</h1>
    <img src="image.png" alt="image" />
  </body>
</html>
```

确保在 `static-site` 目录中有一个 `image.png` 文件。

现在你有了一个显示 "Hello" 并带有 logo 的 HTML 页面。

## 第二步：使用 `deployctl` 部署静态网站

要在 Deno Deploy 上部署这个仓库，从 `static-site` 仓库中运行以下命令：

```console
deployctl deploy --project=<your-preferred-project-name> --entrypoint=jsr:@std/http/file-server
```

对这些命令稍作解释：因为这是一个静态网站，没有 JavaScript 需要执行。你不需要给
Deno Deploy 一个特定的 JavaScript 或 TypeScript
文件作为入口文件，而是给它这个外部的 `file_server.ts` 程序，它只是将
`static-site` 仓库中的所有静态文件（包括图片和 HTML 页面）上传到 Deno
Deploy。然后这些静态资源会被提供出来。

## 第三步：完成！

你的静态网站现在应该已经上线了！它的 URL 会在终端中输出，或者你可以在
[Deno 仪表板](https://dash.deno.com/projects/)
中管理你的新静态网站项目。如果你点击进入你的新项目，你将能够查看网站、配置其名称、环境变量、自定义域名等。
