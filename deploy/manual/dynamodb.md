---
title: "连接到 DynamoDB"
---

Amazon DynamoDB 是一个完全托管的 NoSQL 数据库。要将数据持久化到
DynamoDB，请按照以下步骤操作：

本教程假设您已经拥有 AWS 和 Deno Deploy 账户。

您可以在此处找到一个更全面的教程，该教程在 DynamoDB 之上构建了一个示例应用程序
[这里](../tutorials/tutorial-dynamodb)。

## 从 DynamoDB 获取凭证

该过程的第一步是生成 AWS 凭证，以便以编程方式访问 DynamoDB。

生成凭证：

1. 访问 https://console.aws.amazon.com/iam/ 并进入 "Users" 部分。
2. 点击 **Add user** 按钮，填写 **User name** 字段（可以使用 `denamo`），并选择
   **Programmatic access** 类型。
3. 点击 **Next: Permissions**，然后点击 **Attach existing policies
   directly**，搜索 `AmazonDynamoDBFullAccess` 并选择它。
4. 点击 **Next: Tags**，然后点击 **Next: Review**，最后点击 **Create user**。
5. 点击 **Download .csv** 按钮以下载凭证。

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目，并设置必要的环境变量：

1. 访问
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后在 **Deploy from the command line** 下点击 **+ Empty
   Project**。
2. 现在点击项目页面上的 **Settings** 按钮。
3. 导航到 **Environment Variables** 部分并添加以下密钥。

- `AWS_ACCESS_KEY_ID` - 使用下载的 CSV 文件中 **Access key ID** 列下的值。
- `AWS_SECRET_ACCESS_KEY` - 使用下载的 CSV 文件中 **Secret access key**
  列下的值。

## 编写连接到 DynamoDB 的代码

AWS 提供了一个
[官方 SDK](https://www.npmjs.com/package/@aws-sdk/client-dynamodb)，该 SDK
适用于浏览器。由于大多数 Deno Deploy 的 API 与浏览器的 API 相似，因此相同的 SDK
也适用于 Deno Deploy。要在 Deno 中使用该 SDK，请从 CDN 导入并创建一个客户端：

```js
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb?dts";

// 通过提供您的区域信息创建一个客户端实例。
// 凭证会自动从我们在 Deno Deploy 项目创建步骤中设置的环境变量中获取，因此我们无需在此手动传递它们。
const client = new ApiFactory().makeNew(DynamoDB);

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // async/await.
  try {
    const data = await client.send(command);
    // 处理数据。
  } catch (error) {
    // 错误处理。
  } finally {
    // 最终处理。
  }
}
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
[这里](how-to-deploy)。
