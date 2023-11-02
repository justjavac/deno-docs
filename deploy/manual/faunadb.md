# 连接到 FaunaDB

FaunaDB 自称为“现代应用程序的数据 API”。它是一个具有 GraphQL
接口的数据库，允许您使用 GraphQL 与其交互。由于您可以使用 HTTP
请求与它通信，因此无需管理连接，这对无服务器应用程序非常有效。

本教程涵盖了如何从部署在 Deno Deploy 上的应用程序连接到 Fauna 数据库。

您可以在 [此处](../tutorials/tutorial-faunadb)
找到一个更全面的教程，该教程构建了一个基于 Fauna 的示例应用程序。

## 从 Fauna 获取凭据

我们假设您已经在 https://dashboard.fauna.com 上创建了一个 Fauna 实例。

要以编程方式访问您的 Fauna 数据库，您需要生成一个凭据：

1. 在特定数据库内的 **Security** 部分单击 **New Key**。
   ![fauna1](../docs-images/fauna1.png)

2. 选择 **Server** 角色并单击 **Save**。复制秘钥。您将在下一步中需要它。

## 在 Deno Deploy 上创建项目

接下来，让我们在 Deno Deploy 上创建一个项目，并使用所需的环境变量进行设置：

1. 转到
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后在 **Deploy from the command line** 下单击 **+ Empty
   Project**。
2. 现在单击项目页面上可用的 **Settings** 按钮。
3. 转到 **Environment Variables** 部分，添加以下机密信息。

- `FAUNA_SECRET` - 值应该是我们在上一步中创建的秘钥。
  ![fauna2](../docs-images/fauna2.png)

## 编写连接到 Fauna 的代码

虽然 Node 中有一个 Fauna JavaScript 驱动程序，但在 Deno 中，您应该使用 GraphQL
终端。

Fauna 为其数据库提供了一个 GraphQL 终端，它生成了像 `create`、`update`、`delete`
这样的关键变更操作，用于模式中定义的数据类型。例如，Fauna 将生成一个名为
`createQuote` 的变更操作，用于在数据库中创建数据类型 `Quote` 的新引用。

要与 Fauna 交互，我们需要发出 POST 请求到其 GraphQL
终端，使用适当的查询和参数来获取返回的数据。因此，让我们构建一个通用函数来处理这些操作。

```javascript
import query from "https://esm.sh/faunadb@4.7.1";
import Client from "https://esm.sh/faunadb@4.7.1";

// 从环境中获取秘钥。
const token = Deno.env.get("FAUNA_SECRET");
if (!token) {
  throw new Error("未设置环境变量 FAUNA_SECRET");
}

var client = new Client.Client({
  secret: token,
  // 如果使用 Region Groups，请调整终端地址
  endpoint: "https://db.fauna.com/",
});
// HEAD
client.query(query.ToDate("2018-06-06"));
//
client
  .query(query.ToDate("2018-06-06"))
  //1e2f378 (添加更多页面)
  .then(function (res) {
    console.log("结果:", res);
  })
  .catch(function (err) {
    console.log("错误:", err);
  });
```

## 将应用程序部署到 Deno Deploy

一旦您完成了应用程序的编写，您可以将其部署到 Deno Deploy。

要执行此操作，请返回到项目页面，位于
`https://dash.deno.com/projects/<project-name>`。

您应该看到一些部署选项：

- [GitHub 集成](ci_github)
- [`deployctl`](deployctl)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您想要添加构建步骤，我们建议您选择 GitHub 集成。

有关在 Deno Deploy 上部署的不同方式以及不同的配置选项的更多详细信息，请参阅
[此处](how-to-deploy)。
