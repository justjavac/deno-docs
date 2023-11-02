# 使用 WordPress 作为无头 CMS

WordPress 是世界上最流行的 CMS，但在 "无头" 形式下使用起来很困难，即自定义前端。

在本教程中，我们将展示如何使用 Fresh，一个基于 Deno 构建的现代 Web 框架，为
WordPress 的无头版本创建前端。

## **步骤 1：** 克隆 Fresh WordPress 主题

Fresh 提供两个现成的主题，一个用于博客，一个用于商店前台。

**博客**

```
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/blog
deno task docker
```

**商店**

```sh
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/corporate
deno task docker
```

请注意，博客和商店主题在 WordPress
服务器方面使用不同的设置。确保在正确的目录中运行 `deno task docker` 命令。

## **步骤 2：** 在同一目录中打开另一个终端并运行：

```sh
deno task start
```

## **步骤 3：** 访问 http://localhost: 8000/

您可以通过 WordPress 仪表板管理站点内容，地址为
http://localhost/wp-admin（用户名：`user`，密码：`password`）。

## WordPress 托管选项

有很多在互联网上托管 WordPress 的选项。许多云提供商
[提供](https://aws.amazon.com/getting-sstarted/hands-on/launch-a-wordpress-website/)
[专门的](https://cloud.google.com/wordpress)
[指南](https://learn.microsoft.com/en-us/azure/app-service/quickstart-wordpress)
以及
[模板](https://console.cloud.google.com/marketplace/product/click-to-deploy-images/wordpress)
专门为 WordPress 设计。还有一些专门为 WordPress 提供托管服务的公司，如
[Bluehost](https://www.bluehost.com/)、
[DreamHost](https://www.dreamhost.com/)、
[SiteGround](https://www.siteground.com/)
等。您可以从这些选项中选择最适合您需求的。

互联网上还有很多关于如何扩展您的 WordPress 实例的资源。
