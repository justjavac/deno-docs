---
title: "连接到 FaunaDB"
---

FaunaDB 自称是“现代应用程序的数据 API”。它是一个带有 GraphQL
接口的数据库，使您能够使用 GraphQL 与其进行交互。由于您通过 HTTP
请求与其通信，因此不需要管理连接，这对于无服务器应用程序非常适用。

本教程介绍了如何从部署在 Deno Deploy 上的应用程序连接到 Fauna 数据库。

您可以在此处找到更全面的教程，该教程在 Fauna 之上构建了一个示例应用程序
[here](../tutorials/tutorial-faunadb)。

## 从 Fauna 获取凭证

我们假设您已经在 https://dashboard.fauna.com 创建了一个 Fauna 实例。

要以编程方式访问您的 Fauna 数据库，您需要生成一个凭证：

1. 在您的特定数据库中点击 **Security** 部分，然后点击 **New
   Key**。![fauna1](../docs-images/fauna1.png)

2. 选择 **Server** 角色并点击 **Save**。复制密钥。您将在下一步中需要它。

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目，并设置所需的环境变量：

1. 前往
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后在 **Deploy from the command line** 下点击 **+ Empty
   Project**。
2. 现在点击项目页面上的 **Settings** 按钮。
3. 导航到 **Environment Variables** 部分并添加以下密钥。

- `FAUNA_SECRET` -
  值应该是我们在上一步中创建的密钥。![fauna2](../docs-images/fauna2.png)

## 编写连接到 Fauna 的代码

虽然 Node 有一个 Fauna JavaScript 驱动程序，但在 Deno 中，您应该使用 graphql
端点。

Fauna 为其数据库提供了一个 graphql
端点，并为模式中定义的数据类型生成必要的突变，如
`create`、`update`、`delete`。例如，Fauna 将为数据类型 `Quote` 生成一个名为
`createQuote` 的突变，以在数据库中创建新的引用。

要与 Fauna 交互，我们需要向其 graphql 端点发出 POST
请求，并附带适当的查询和参数以获取返回的数据。因此，让我们构建一个通用函数来处理这些事情。

```javascript
import query from "https://esm.sh/faunadb@4.7.1";
import Client from "https://esm.sh/faunadb@4.7.1";

// 从环境中获取密钥。
const token = Deno.env.get("FAUNA_SECRET");
if (!token) {
  throw new Error("environment variable FAUNA_SECRET not set");
}

var client = new Client.Client({
  secret: token,
  // 如果您使用区域组，请调整端点
  endpoint: "https://db.fauna.com/",
});
// HEAD
client.query(query.ToDate("2018-06-06"));
//
client
  .query(query.ToDate("2018-06-06"))
  //1e2f378 (添加更多页面)
  .then(function (res) {
    console.log("Result:", res);
  })
  .catch(function (err) {
    console.log("Error:", err);
  });
```

## 将应用程序部署到 Deno Deploy

完成应用程序编写后，您可以将其部署到 Deno Deploy。

为此，请返回您的项目页面 `https://dash.deno.com/projects/<project-name>`。

您应该会看到几个部署选项：

- [Github 集成](ci_github)
- [`deployctl`](./deployctl.md)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您想添加构建步骤，否则我们建议您选择 Github 集成。

有关在 Deno Deploy 上部署的不同方式及不同配置选项的更多详细信息，请阅读
[here](how-to-deploy)。
