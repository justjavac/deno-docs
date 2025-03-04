---
title: "连接到 Postgres"
---

本教程介绍了如何从部署在 Deno Deploy 上的应用程序连接到 Postgres 数据库。

你可以在[这里](../tutorials/tutorial-postgres)找到一个更全面的教程，该教程在
Postgres 之上构建了一个示例应用程序。

## 设置 Postgres

> 本教程将完全专注于连接到未加密的 Postgres。如果你想使用带有自定义 CA
> 证书的加密，请使用[这里](https://deno-postgres.com/#/?id=ssltls-connection)的文档。

首先，我们需要创建一个新的 Postgres 实例以便连接。在本教程中，我们将使用
[Supabase](https://supabase.com)，因为他们提供免费的托管 Postgres
实例。如果你想在其他地方托管数据库，也可以这样做。

1. 访问 https://app.supabase.io/ 并点击 **New project**。
2. 为你的数据库选择一个名称、密码和区域。确保保存密码，因为你稍后会需要它。
3. 点击 **Create new project**。创建项目可能需要一些时间，请耐心等待。

## 从 Postgres 获取凭据

设置好 Postgres 数据库后，从你的 Postgres 实例中获取连接信息。

### Supabase

对于上述的 Supabase 实例，获取连接信息的步骤如下：

1. 导航到左侧的 **Database** 选项卡。
2. 进入 **Project Settings** >> **Database**，并从 **Connection String** >>
   **URI**
   字段中复制连接字符串。这是你将用于连接数据库的连接字符串。将之前保存的密码插入此字符串，然后保存该字符串——你稍后会需要它。

### psql

如果你使用 psql，通常可以通过运行以下命令找到连接信息：

```psql
test=# \conninfo
```

你的 Postgres 连接字符串将采用以下形式：

```sh
postgres://user:password@127.0.0.1:5432/deploy?sslmode=disable
```

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目，并设置必要的环境变量：

1. 访问
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后在 **Deploy from the command line** 下点击 **+ Empty
   Project**。
2. 现在点击项目页面上的 **Settings** 按钮。
3. 导航到 **Environment Variables** 部分，并添加以下密钥。

- `DATABASE_URL` - 值应为你上一步中获取的连接字符串。

![postgres_env_variable](../docs-images/postgres_env_variable.png)

## 编写连接到 Postgres 的代码

要读取/写入 Postgres，请导入 Postgres
模块，从环境变量中读取连接字符串，并创建一个连接池。

```ts
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// 从环境变量 "DATABASE_URL" 中获取连接字符串
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// 创建一个包含三个连接的数据库池，这些连接是延迟建立的
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
  // 将连接释放回池中
  connection.release();
}
```

## 将应用程序部署到 Deno Deploy

编写完应用程序后，你可以将其部署到 Deno Deploy。

为此，请返回你的项目页面 `https://dash.deno.com/projects/<project-name>`。

你应该会看到几个部署选项：

- [Github 集成](ci_github)
- [`deployctl`](./deployctl.md)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非你想添加构建步骤，否则我们建议你选择 Github 集成。

有关在 Deno Deploy
上部署的不同方式及不同配置选项的更多详细信息，请阅读[这里](how-to-deploy)。
