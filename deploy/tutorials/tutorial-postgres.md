# API 服务与 Postgres

Postgres 是 Web
应用程序中常用的数据库，因为它具有灵活性和易用性。本指南将向您展示如何在 Deno
Deploy 中使用 Postgres。

- [概述](#概述)
- [设置 Postgres](#设置-postgres)
- [编写和部署应用程序](#编写和部署应用程序)

## 概述

我们将构建一个简单的待办事项列表应用程序的 API。它将有两个端点：

`GET /todos` 将返回所有待办事项的列表，`POST /todos` 将创建一个新的待办事项。

```
GET /todos
# 返回所有待办事项的列表
[
  {
    "id": 1,
    "title": "买面包"
  },
  {
    "id": 2,
    "title": "买大米"
  },
  {
    "id": 3,
    "title": "买香料"
  }
]

POST /todos
# 创建一个新的待办事项
"买牛奶"
# 返回状态码201
```

在本教程中，我们将：

- 创建并设置一个 [Postgres](https://www.postgresql.org/) 实例，位于
  [Supabase](https://supabase.com) 上。
- 使用 [Deno Deploy](/deploy) Playground 来开发和部署应用程序。
- 使用 [cURL](https://curl.se/) 来测试我们的应用程序。

## 设置 Postgres

> 本教程将完全关注连接到未加密的 Postgres。如果您希望使用自定义 CA
> 证书进行加密，请使用
> [此处的文档](https://deno-postgres.com/#/?id=ssltls-connection)。

要开始，我们需要创建一个新的 Postgres
实例，以便我们可以连接到它。在本教程中，我们将使用
[Supabase](https://supabase.com)，因为他们提供免费的托管 Postgres
实例。如果您想在其他地方托管数据库，也可以这样做。

1. 访问 https://app.supabase.io/ 并点击 "New project"。
2. 为您的数据库选择一个名称、密码和地区。确保保存密码，因为您以后会需要它。
3. 点击 "Create new project"。创建项目可能需要一些时间，所以请耐心等待。
4. 一旦项目创建完成，导航到左侧的 "Database" 选项卡。
5. 转到 "Connection Pooling" 设置，并从 "Connection String"
   字段中复制连接字符串。这是您将用来连接到数据库的连接字符串。将之前保存的密码插入到这个字符串中，然后将字符串保存在某个地方，您以后会需要它。

## 编写和部署应用程序

现在我们可以开始编写我们的应用程序了。首先，我们将在控制面板中创建一个新的 Deno
Deploy Playground：在 https://dash.deno.com/projects 上点击 "New Playground"
按钮。

这将打开 Playground 编辑器。在我们实际开始编写代码之前，我们需要将我们的
Postgres
连接字符串放入环境变量中。为此，点击编辑器左上角的项目名称。这将打开项目设置。

从这里，您可以通过左侧导航菜单转到 "Settings" -> "Environment Variable"
选项卡。在 "Key" 字段中输入 "DATABASE_URL"，并将连接字符串粘贴到 "Value"
字段中。现在，点击 "Add"。您的环境变量现在已经设置。

让我们返回到编辑器：为此，通过左侧导航菜单转到 "Overview" 选项卡，然后点击 "Open
Playground"。让我们首先导入 `std/http` 模块，以便我们可以开始提供 HTTP 请求：

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serve(async (req) => {
  return new Response("Not Found", { status: 404 });
});
```

您现在可以保存此代码，使用 <kbd> Ctrl </kbd>+<kbd> S </kbd>（或 Mac 上的 <kbd>
Cmd </kbd>+<kbd> S </kbd>）。您应该会看到右侧的预览页面自动刷新：现在显示 "Not
Found"。

接下来，让我们导入 Postgres 模块，从环境变量中读取连接字符串，并创建一个连接池。

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

// 从环境变量 "DATABASE_URL" 获取连接字符串
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// 创建一个包含三个懒加载连接的数据库池
const pool = new postgres.Pool(databaseUrl, 3, true);
```

同样，您现在可以保存此代码，但这次您不应该看到任何更改。我们正在创建一个连接池，但我们实际上还没有执行任何针对数据库的查询。在执行查询之前，我们需要设置我们的表模式。

我们想要存储待办事项的列表。让我们创建一个名为 "todos"
的表，其中包含一个自动增量的 "id" 列和一个 "title" 列：

```ts
const pool = new postgres.Pool(databaseUrl, 3, true);

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

现在我们有一个表，我们可以添加 GET 和 POST 端点的 HTTP 处理程序。

```ts
serve(async (req) => {
  // 解析 URL 并检查请求的端点是否为/todos。如果不是，返回 404 响应。
  const url = new URL(req.url);
  if (url.pathname !== "/todos") {
    return new Response("Not Found", { status: 404 });
  }

  // 从数据库池中获取一个连接
  const connection = await pool.connect();

  try {
    switch (
      req.method
    ) {
      case "GET": { // 这是一个 GET 请求。返回所有待办事项的列表。
        // 运行查询
        const result = await connection.queryObject`
          SELECT * FROM todos
        `;

        // 将结果编码为 JSON
        const body = JSON.stringify(result.rows, null, 2);

        // 以 JSON 格式返回结果
        return new Response(body, {
          headers: { "content-type": "application/json" },
        });
      }
      case "POST": { // 这是一个 POST 请求。创建一个新的待办事项。
        // 将请求体解析为 JSON。如果请求体无法解析、不是字符串或长于 256 个字符，则返回 400 响应。
        const title = await req.json().catch(() => null);
        if (typeof title !== "string" || title.length > 256) {
          return new Response("Bad Request", { status: 400 });
        }

        // 将新的待办事项插入到数据库中
        await connection.queryObject`
          INSERT INTO todos (title) VALUES (${title})
        `;

        // 返回 201 Created 响应
        return new Response("", { status: 201 });
      }
      default: // 如果既不是 POST 也不是 GET，则返回 405 响应。
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (err) {
    console.error(err);
    // 如果出现错误，返回 500 响应
    return new Response(`Internal Server Error\n\n${err.message}`, {
      status: 500,
    });
  } finally {
    // 将连接释放回池中
    connection.release();
  }
});
```

至此，应用程序完成。通过保存编辑器，您现在可以将此代码部署。现在，您可以通过向/todos
端点发出 POST 请求来创建一个新的待办事项，也可以通过向/todos 发出 GET
请求来获取所有待办事项的列表：

```sh
$ curl -X GET https://tutorial-postgres.deno.dev/todos
[]⏎

$ curl -X POST -d '"买牛奶"' https://tutorial-postgres.deno.dev/todos

$ curl -X GET https://tutorial-postgres.deno.dev/todos
[
  {
    "id": 1,
    "title": "买牛奶"
  }
]⏎
```

一切正常🎉

教程的完整代码：

<iframe width="100%" height="600" src="https://embed.deno.com/playground/tutorial-postgres?layout=code-only&corp"> </iframe>

作为额外挑战，尝试添加一个 "DELETE /todos/: id"
端点来删除一个待办事项。[URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
API 可以帮助实现这一目标。
