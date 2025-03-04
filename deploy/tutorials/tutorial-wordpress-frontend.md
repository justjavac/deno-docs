---
title: "将 WordPress 用作无头 CMS"
oldUrl:
  - /deploy/docs/tutorial-wordpress-frontend/
---

WordPress 是世界上最流行的 CMS，但很难以“无头”形式使用，即与自定义前端结合使用。

在本教程中，我们将展示如何使用 Fresh（一个基于 Deno 构建的现代 Web 框架）为无头
WordPress 创建前端。

## 第一步：克隆 Fresh WordPress 主题

Fresh 提供了两个现成的主题，一个用于博客，一个用于商店。

### 博客

```bash
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/blog
deno task docker
```

### 商店

```bash
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/corporate
deno task docker
```

请注意，博客和商店主题使用不同的 WordPress 服务器设置。确保在正确的目录中运行
`deno task docker` 命令。

## 第二步：在同一目录中打开另一个终端并运行：

```sh
deno task start
```

## 第三步：访问 http://localhost:8000/

您可以通过 WordPress 仪表板在 http://localhost/wp-admin
管理网站内容（用户名：`user`，密码：`password`）。

## WordPress 托管选项

互联网上有许多托管 WordPress 的选项。许多云提供商
[提供](https://aws.amazon.com/getting-started/hands-on/launch-a-wordpress-website/)
[专门](https://cloud.google.com/wordpress)
[的指南](https://learn.microsoft.com/en-us/azure/app-service/quickstart-wordpress)
和
[模板](https://console.cloud.google.com/marketplace/product/click-to-deploy-images/wordpress)
用于 WordPress。还有一些专门为 WordPress 提供的托管服务，例如
[Bluehost](https://www.bluehost.com/)、
[DreamHost](https://www.dreamhost.com/)、
[SiteGround](https://www.siteground.com/)
等。您可以从这些选项中选择最适合您需求的方案。

互联网上还有许多关于如何扩展 WordPress 实例的资源。
