# 连接到 Postgres

本教程涵盖了如何从部署在 Deno Deploy 上的应用程序连接到 Postgres 数据库。

您可以找到一个更全面的教程，它构建在 Postgres 之上的示例应用程序
[在这里](../tutorials/tutorial-postgres)。

## 设置 Postgres

> 本教程将完全专注于未加密的 Postgres 连接。如果您想使用自定义 CA
> 证书进行加密，请使用
> [这里的文档](https://deno-postgres.com/#/?id=ssltls-connection)。

要开始，我们需要创建一个新的 Postgres
实例，以便我们连接到它。在本教程中，我们将使用
[Supabase](https://supabase.com)，因为他们提供免费的托管 Postgres
实例。如果您喜欢将您的数据库托管在其他地方，您也可以这样做。

1. 访问 https://app.supabase.io/并单击 **新建项目**。
2. 选择名称，密码和数据库的区域。确保保存密码，因为以后会需要它。
3. 单击 **创建新项目**。创建项目可能需要一些时间，所以请耐心等待。

## 从 Postgres 中获取凭据

设置好 Postgres 数据库后，从 Postgres 实例中获取您的连接信息。

### Supabase

对于上面的 Supabase 实例，获取您的连接信息：

1. 转到左侧的 **数据库** 选项卡。
2. 转到 **项目设置** >> **数据库** 并从 **连接字符串** >> **URI**
   字段复制连接字符串。这是您将用于连接到数据库的连接字符串。将您之前保存的密码插入到此字符串中，然后将字符串保存在某个地方 -
   您以后会需要它。

### psql

如果您使用 psql，通常可以通过运行以下命令来查找您的连接信息：

```psql
test=# \conninfo
```

您的 Postgres 连接字符串将采用以下形式：

```sh
postgres://user:password@127.0.0.1:5432/deploy?sslmode=disable
```

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目，并使用所需的环境变量设置它：

1. 转到
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果您尚未登录，请使用
   GitHub 登录）并单击 **+空项目** 下的 **从命令行部署**。
2. 现在单击项目页面上可用的 **设置** 按钮。
3. 转到 **环境变量** 部分，并添加以下机密信息。

- `DATABASE_URL` - 值应该是您在上一步中检索到的连接字符串。

![postgres_env_variable](../docs-images/postgres_env_variable.png)

## 编写连接到 Postgres 的代码

要读取/写入 Postgres，导入 Postgres
模块，从环境变量中读取连接字符串，并创建一个连接池。

```ts
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// 从环境变量 "DATABASE_URL" 获取连接字符串
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// 使用懒惰建立的三个连接创建数据库连接池
const pool = new Pool(databaseUrl, 3, true);

// 连接到数据库
const connection = await pool.connect();

try {
  // 创建表
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} finally {
  // 将连接释放回连接池
  connection.release();
}
```

## 部署应用程序到 Deno Deploy

完成编写应用程序后，您可以在 Deno Deploy 上部署它。

要做到这一点，请返回到您的项目页面，网址为
`https://dash.deno.com/projects/<project-name>`。

您应该看到一些部署选项：

- [GitHub 集成](ci_github)
- [`deployctl`](deployctl)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您想要添加构建步骤，否则我们建议您选择 GitHub 集成。

有关在 Deno Deploy 上部署的不同方法以及不同的配置选项的详细信息，请阅读
[这里](how-to-deploy)。
