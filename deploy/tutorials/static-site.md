# 部署静态网站

本教程将介绍如何在 Deno Deploy 上部署静态网站（无 JavaScript）。

## **步骤 1：** 创建静态网站

```sh
mkdir static-site
cd static-site
touch index.html
```

在您的 `index.html` 中，粘贴以下 HTML：

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

确保 `static-site` 文件夹内有一个名为 `image.png` 的图片。

现在您有一个显示 "Hello" 并带有标志的 HTML 页面。

## **步骤 2：** 创建一个新的 Deno 项目

1. 转到 https://dash.deno.com/new 并单击 **+Empty Project** 按钮，位于
   **从命令行部署** 下方。
2. 在下一页上，获取项目名称，本例中为 `careful-goat-90`。

## **步骤 3：** 使用 `deployctl` 部署静态网站

要在 Deno Deploy 上部署此存储库，请在 `static-site` 存储库中运行：

```
deployctl deploy --project=careful-goat-90 https://deno.land/std@$STD_VERSION/http/file_server.ts
```

为了更详细地解释这些命令：因为这是一个静态网站，没有 JavaScript
可执行。而不是提供给 Deno Deploy 一个特定的 JavaScript 或 TypeScript
文件作为入口文件运行，您将提供外部的 `file_server.ts` 程序，该程序简单地上传
`static-site` 存储库中的所有静态文件，包括图像和 HTML 页面，到 Deno
Deploy。然后这些静态资源就会被提供。

## **步骤 4：** 大功告成！

如果您转到 `careful-goat-90` 项目页面的 **部署**
选项卡下，您将看到与此开发部署相关的链接。如果单击链接，您现在应该看到显示
"Hello" 和图像的 HTML 页面。
