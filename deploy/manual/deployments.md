# 部署

部署是运行应用程序所需的所有代码和环境变量的快照。创建后，部署是不可变的。要部署应用程序的新代码版本，必须创建新的部署。

## 自定义域名

还可以有其他 URL 指向部署，例如 [自定义域名](custom-domains)。

## 分支域名

`<projectname--branchname>.deno.dev` 也受支持。

## 生产与预览部署

所有部署都有一个预览 URL，可用于查看此特定部署。预览 URL 的格式为
`{project_name}-{deployment_id}.deno.dev`。

![图片](../docs-images/preview_deployment.png)

部署可以是生产部署或预览部署。这些部署在运行时功能上没有任何区别。唯一的区别是项目的生产部署将接收来自项目
URL（例如 `myproject.deno.dev`）以及部署的预览 URL
的流量，还包括来自自定义域名的流量。

## 通过 Deno Deploy UI 将预览部署升级为生产部署

可以通过 Deno Deploy UI 将预览部署“升级”为生产部署：

1. 转到项目页面。
2. 单击 **部署** 选项卡。
3. 单击要升级为生产部署的部署旁边的三个点，然后选择 **升级为生产部署**
   ![升级为生产部署](../docs-images/promote_to_production.png)

## 通过 `deployctl` 创建生产部署

如果您正在使用 `deployctl` 部署您的 Deno 代码，可以使用 `--prod`
标志进行生产部署：

```sh
deployctl deploy --prod --project=helloworld main.ts
```
