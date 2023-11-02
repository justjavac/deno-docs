# 连接到 DynamoDB

Amazon DynamoDB 是一个完全托管的 NoSQL 数据库。要将数据持久化到
DynamoDB，请按照以下步骤进行：

本教程假定您拥有 AWS 和 Deno Deploy 帐户。

您可以在 [这里](../tutorials/tutorial-dynamodb) 找到一个更详尽的教程，该教程在
DynamoDB 之上构建了一个示例应用程序。

## 从 DynamoDB 获取凭据

此过程的第一步是生成 AWS 凭据，以便以编程方式访问 DynamoDB。

生成凭据：

1. 转到 https://console.aws.amazon.com/iam/ 并转到 "用户" 部分。
2. 单击 **添加用户** 按钮，填写 **用户名** 字段（可以使用 `denamo`），并选择
   **编程访问** 类型。
3. 单击 **下一步：权限**，然后单击 **直接附加现有策略**，搜索
   `AmazonDynamoDBFullAccess` 并选择它。
4. 单击 **下一步：标签**，然后单击 **下一步：审核**，最后单击 **创建用户**。
5. 单击 **下载 .csv** 按钮以下载凭据。

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目，并设置所需的环境变量：

1. 转到
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果您尚未登录，请使用
   GitHub 登录）并单击 **+ 空项目**，位于 **从命令行部署** 下方。
2. 现在，单击项目页面上可用的 **设置** 按钮。
3. 转到 **环境变量** 部分，添加以下机密信息。

- `AWS_ACCESS_KEY_ID` - 使用下载的 CSV 中 **访问密钥 ID** 列下可用的值。
- `AWS_SECRET_ACCESS_KEY` - 使用下载的 CSV 中 **秘密访问密钥** 列下可用的值。

## 编写连接到 DynamoDB 的代码

AWS 提供了一个
[官方 SDK](https://www.npmjs.com/package/@aws-sdk/client-dynamodb)，适用于浏览器。由于大多数
Deno Deploy 的 API 与浏览器类似，因此相同的 SDK 也适用于 Deno Deploy。要在 Deno
中使用 SDK，请从 cdn 导入并创建客户端：

```js
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://cdn.skypack.dev/@aws-sdk/client-dynamodb?dts";

// 通过提供区域信息创建客户端实例。
// 凭据会自动从我们在 Deno Deploy 项目创建步骤中设置的环境变量中获取，因此我们不必在此手动传递它们。
const client = new ApiFactory().makeNew(DynamoDB);

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // 异步/等待。
  try {
    const data = await client.send(command);
    // 处理数据。
  } catch (error) {
    // 错误处理。
  } finally {
    // 最后。
  }
}
```

## 将应用程序部署到 Deno Deploy

完成编写应用程序后，您可以将其部署到 Deno Deploy。

要执行此操作，请返回到项目页面，地址为
`https://dash.deno.com/projects/<project-name>`。

您应该看到一些部署选项：

- [GitHub 集成](ci_github)
- [`deployctl`](deployctl)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您想要添加构建步骤，我们建议选择 GitHub 集成。

有关在 Deno Deploy 上不同部署方式和不同配置选项的详细信息，请阅读
[此处](how-to-deploy)。
