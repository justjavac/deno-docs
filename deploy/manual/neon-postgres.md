---
title: "连接到 Neon Postgres"
---

本教程介绍如何从部署在 Deno Deploy 上的应用程序连接到 Neon Postgres 数据库。

您可以在此处找到更全面的教程，该教程在 Postgres 之上构建了一个示例应用程序
[这里](../tutorials/tutorial-postgres)。

## 设置 Postgres

首先，我们需要创建一个新的 Postgres 实例以供连接。在本教程中，我们将使用
[Neon Postgres](https://neon.tech/)，因为他们提供免费的托管 Postgres
实例。如果您希望将数据库托管在其他地方，也可以这样做。

1. 访问 https://neon.tech/ 并点击 **Sign up** 使用电子邮件、Github、Google
   或合作伙伴账户注册。注册后，您将被引导至 Neon 控制台以创建您的第一个项目。
2. 输入项目名称，选择 Postgres
   版本，提供数据库名称，并选择一个区域。通常，您会选择离您的应用程序最近的区域。完成后，点击
   **Create project**。
3. 您将看到新项目的连接字符串，您可以使用它来连接数据库。保存连接字符串，它看起来像这样：

   ```sh
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   您将在下一步中需要此连接字符串。

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目并设置必要的环境变量：

1. 前往
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后点击 **Deploy your own code** 下的 **Create an empty
   project**。
2. 现在点击项目页面上的 **Settings** 按钮。
3. 导航到 **Environment Variables** 部分并添加以下密钥。

- `DATABASE_URL` - 值应设置为上一步中保存的连接字符串。

![postgres_env_variable](../docs-images/neon_postgres_env_variable.png)

## 编写连接到 Postgres 的代码

要使用 [Neon 无服务器驱动](https://deno.com/blog/neon-on-jsr) 读写
Postgres，首先使用 `deno add` 命令安装它：

```sh
deno add jsr:@neon/serverless
```

这将创建或更新您的 `deno.json` 文件，添加依赖项：

```json
{
  "imports": {
    "@neon/serverless": "jsr:@neon/serverless@^0.10.1"
  }
}
```

现在您可以在代码中使用该驱动：

```ts
import { neon } from "@neon/serverless";

// 从环境变量 "DATABASE_URL" 中获取连接字符串
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// 创建一个 SQL 查询执行器
const sql = neon(databaseUrl);

try {
  // 创建表
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} catch (error) {
  console.error(error);
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

除非您想添加构建步骤，否则我们建议您选择 GitHub 集成。

有关在 Deno Deploy 上部署的不同方式及不同配置选项的更多详细信息，请阅读
[这里](how-to-deploy)。
