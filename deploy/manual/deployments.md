---
title: "部署"
---

部署是运行应用程序所需的代码和环境变量的快照。可以通过
[`deployctl`](./deployctl.md#deploy) 创建新的部署，或者如果配置了 Deploy 的
Github 集成，也可以自动创建。

部署在创建后是不可变的。要为应用程序部署新版本的代码，必须创建新的部署。一旦创建，部署将保持可访问状态。

所有可用的部署都列在项目页面的 `Deployments`
选项卡下，如下图所示。旧的部署可以通过 [`deployctl`](./deployctl.md#delete) 和
[API](https://apidocs.deno.com/#delete-/deployments/-deploymentId-) 删除。

![显示项目仪表板中的部署选项卡](./images/project_deployments.png)

## 自定义域名

还可以有其他指向部署的 URL，例如 [自定义域名](custom-domains)。

## 分支域名

`<projectname--branchname>.deno.dev` 也受支持。

## 生产与预览部署

所有部署都有一个预览 URL，可用于查看此特定部署。预览 URL 的格式为
`{project_name}-{deployment_id}.deno.dev`。

![图片](../docs-images/preview_deployment.png)

部署可以是生产部署或预览部署。这些部署在运行时功能上没有区别。唯一的区别是项目的生产部署将从项目
URL（例如 `myproject.deno.dev`）和自定义域名接收流量，此外还会接收部署的预览 URL
的流量。

## 通过 Deno Deploy UI 将预览部署提升为生产部署

可以通过 Deno Deploy UI 将预览部署“提升”为生产部署：

1. 导航到项目页面。
2. 点击 **Deployments** 选项卡。
3. 点击要提升为生产的部署旁边的三个点，然后选择 **Promote to Production**
   ![提升为生产](../docs-images/promote_to_production.png)

将部署提升为生产仅限于已经使用生产 KV
数据库的部署。这对于使用不同数据库进行预览和生产部署的 GitHub
部署尤其重要。部署（即使是使用预览 KV 数据库的部署）始终可以使用
[`deployctl deployments redeploy` 命令](./deployctl.md#production-domains)
重新部署到生产环境。

## 通过 `deployctl` 创建生产部署

如果你使用 `deployctl` 部署 Deno 代码，可以使用 `--prod`
标志直接部署到生产环境：

```sh
deployctl deploy --prod --project=helloworld main.ts
```
