---
title: "部署快速入门"
oldUrl:
  - /deploy/
  - /deploy/docs/
  - /deploy/manual/hello-world/
---

Deno Deploy 是一个全球分布式的无服务器 JavaScript 应用程序平台。您的
JavaScript、TypeScript 和 WebAssembly
代码在靠近用户的地理位置上运行，从而实现低延迟和更快的响应时间。部署的应用程序运行在快速、轻量级的
[V8 隔离环境](https://deno.com/blog/anatomy-isolate-cloud) 中，而不是虚拟机，由
[Deno 运行时](/runtime/manual) 提供支持。

让我们部署您的第一个应用程序——只需几分钟。

## 安装 Deno 和 `deployctl`

如果尚未安装，您可以使用以下命令之一
[安装 Deno 运行时](/runtime/getting_started/installation)：

<deno-tabs group-id="operating-systems">
<deno-tab mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

安装 Deno 后，安装 [`deployctl`](./deployctl.md) 工具：

```
deno install -A jsr:@deno/deployctl --global
```

您可以通过运行以下命令确认 `deployctl` 已正确安装：

```console
deployctl --help
```

现在，您已准备好从命令行部署 Deno 脚本了！

## 编写并测试 Deno 程序

首先，为项目创建一个目录，并在其中创建一个名为 `main.ts`
的文件，内容如下所示的“Hello World” Web 服务器：

```ts title="main.ts"
Deno.serve(() => new Response("Hello, world!"));
```

您可以通过运行以下命令测试它是否正常工作：

```
deno run --allow-net main.ts
```

您的服务器应该在 [localhost:8000](http://localhost:8000) 上可见。现在让我们在
Deno Deploy 的边缘运行此代码！

## 部署您的项目

从您刚刚创建的 `main.ts` 文件所在的目录中，运行以下命令：

```sh
deployctl deploy
```

系统会要求您授权 Deno Deploy 在 GitHub 中注册 Deno Deploy 和/或为 `deployctl`
提供访问令牌。片刻之后，您的 Hello World 服务器将在 Deno Deploy
的基础设施中部署到全球各地，准备处理您预期的所有流量。

## 下一步

现在您已经创建了第一个部署，您可以
[了解可以在 Deno Deploy 上运行的应用程序类型](./use-cases.md)，查看
[还可以使用 deployctl 做些什么](./deployctl.md)，或者继续阅读以了解将代码部署到
Deno Deploy 的其他选项。我们非常期待看到您将使用 Deno Deploy 发布什么！

### 部署现有项目

导入项目并在 Deno Deploy 的边缘运行它。

1. 从 [Deno Deploy 仪表板](https://dash.deno.com) 点击“新建项目”按钮。
2. 连接到您的 GitHub 帐户并选择要部署的仓库。
3. 按照屏幕上的说明部署您的现有应用程序。

   如果您的项目需要构建步骤，请使用项目配置表单创建 GitHub Action
   来部署您的项目。为您的项目命名并从可选的框架预设中选择。如果您没有使用框架，可以使用表单设置构建配置。

4. 确认您的构建选项正确，然后点击“部署项目”按钮以启动新的 GitHub Action
   并部署您的项目。

片刻之后，您的项目将部署到全球约 12 个数据中心，准备处理大量流量。

部署成功后，您可以在成功页面上提供的 URL 访问新部署的项目，或在仪表板中管理它。

### 从 Playground 开始

[Playground](./playgrounds.md) 是一个基于浏览器的编辑器，使您可以立即编写和运行
JavaScript 或 TypeScript 代码。这是试用 Deno 和 Deno Deploy 的绝佳选择！

从 [Deno Deploy 仪表板](https://dash.deno.com)，点击“新建
Playground”按钮以创建一个 Playground。我们还提供了各种现成的教程，供您试用 Deno
Deploy，点击“学习 Playground”或访问以下链接试用：\
[简单 HTTP 服务器 Playground](https://dash.deno.com/tutorial/tutorial-http)\
[使用 Deno KV 数据库 Playground](https://dash.deno.com/tutorial/tutorial-http-kv)\
[RESTful API 服务器 Playground](https://dash.deno.com/tutorial/tutorial-restful)\
[使用 WebSockets 的实时应用程序 Playground](https://dash.deno.com/tutorial/tutorial-websocket)\
[使用 Deno.cron 的定期任务 Playground](https://dash.deno.com/tutorial/tutorial-cron)
