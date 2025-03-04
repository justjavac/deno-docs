---
title: "使用 FaunaDB 的 API 服务器"
oldUrl:
  - /deploy/docs/tutorial-faunadb/
---

FaunaDB 自称是“现代应用程序的数据 API”。它是一个带有 GraphQL
接口的数据库，允许你使用 GraphQL 与其交互。由于我们通过 HTTP
请求与其通信，因此不需要管理连接，这非常适合无服务器应用程序。

本教程假设你已拥有 [FaunaDB](https://fauna.com) 和 Deno Deploy 账户，已安装 Deno
Deploy CLI，并且对 GraphQL 有一些基本了解。

- [概述](#overview)
- [构建 API 端点](#build-the-api-endpoints)
- [使用 FaunaDB 进行持久化](#use-faunadb-for-persistence)
- [部署 API](#deploy-the-api)

## 概述

在本教程中，我们将构建一个小的名言
API，包含插入和检索名言的端点。之后，我们将使用 FaunaDB 来持久化这些名言。

让我们从定义 API 端点开始。

```sh
# 向该端点发送 POST 请求应将名言插入到列表中。
POST /quotes/
# 请求体。
{
  "quote": "不要以收获的多少来判断每一天，而要以播种的多少来判断。",
  "author": "罗伯特·路易斯·史蒂文森"
}

# 向该端点发送 GET 请求应从数据库中返回所有名言。
GET /quotes/
# 请求的响应。
{
  "quotes": [
    {
      "quote": "不要以收获的多少来判断每一天，而要以播种的多少来判断。",
      "author": "罗伯特·路易斯·史蒂文森"
    }
  ]
}
```

现在我们了解了端点的行为方式，让我们继续构建它。

## 构建 API 端点

首先，创建一个名为 `quotes.ts` 的文件，并粘贴以下内容。

阅读代码中的注释以了解发生了什么。

```ts
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";

serve({
  "/quotes": handleQuotes,
});

// 为了开始，我们只使用一个全局的名言数组。
const quotes = [
  {
    quote: "那些能够想象任何事情的人，可以创造不可能。",
    author: "艾伦·图灵",
  },
  {
    quote: "任何足够先进的技术都与魔法无异。",
    author: "亚瑟·克拉克",
  },
];

async function handleQuotes(request: Request) {
  // 确保请求是 GET 请求。
  const { error } = await validateRequest(request, {
    GET: {},
  });
  // 如果请求不符合我们定义的模式，validateRequest 会填充错误。
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // 返回所有名言。
  return json({ quotes });
}
```

使用 [Deno CLI](https://deno.land) 运行上述程序。

```sh
deno run --allow-net=:8000 ./path/to/quotes.ts
# 监听 http://0.0.0.0:8000/
```

然后使用 curl 访问端点以查看一些名言。

```sh
curl http://127.0.0.1:8000/quotes
# {"quotes":[
# {"quote":"那些能够想象任何事情的人，可以创造不可能。", "author":"艾伦·图灵"},
# {"quote":"任何足够先进的技术都与魔法无异。","author":"亚瑟·克拉克"}
# ]}
```

让我们继续处理 POST 请求。

更新 `validateRequest` 函数，以确保 POST 请求遵循提供的请求体模式。

```diff
-  const { error } = await validateRequest(request, {
+  const { error, body } = await validateRequest(request, {
    GET: {},
+   POST: {
+      body: ["quote", "author"]
+   }
  });
```

通过更新 `handleQuotes` 函数来处理 POST 请求，代码如下。

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

+  // 处理 POST 请求。
+  if (request.method === "POST") {
+    const { quote, author } = body as { quote: string; author: string };
+    quotes.push({ quote, author });
+    return json({ quote, author }, { status: 201 });
+  }

  return json({ quotes });
}
```

让我们通过插入一些数据来测试它。

```sh
curl --dump-header - --request POST --data '{"quote": "未经测试的程序无法工作。", "author": "比雅尼·斯特劳斯特鲁普"}' http://127.0.0.1:8000/quotes
```

输出可能如下所示。

```console
HTTP/1.1 201 Created
transfer-encoding: chunked
content-type: application/json; charset=utf-8

{"quote":"未经测试的程序无法工作。","author":"比雅尼·斯特劳斯特鲁普"}
```

太棒了！我们构建了我们的 API
端点，并且它按预期工作。由于数据存储在内存中，重启后会丢失。让我们使用 FaunaDB
来持久化我们的名言。

## 使用 FaunaDB 进行持久化

让我们使用 GraphQL Schema 定义我们的数据库模式。

```gql
# 我们正在创建一个名为 `Quote` 的新类型来表示名言及其作者。
type Quote {
  quote: String!
  author: String!
}

type Query {
  # Query 操作中的一个新字段，用于检索所有名言。
  allQuotes: [Quote!]
}
```

Fauna 为其数据库提供了一个 graphql
端点，并为模式中定义的数据类型生成必要的突变，如创建、更新、删除。例如，fauna
将为数据类型 `Quote` 生成一个名为 `createQuote`
的突变，以在数据库中创建新名言。我们还定义了一个名为 `allQuotes`
的查询字段，它返回数据库中的所有名言。

让我们开始编写代码，从 Deno Deploy 应用程序与 fauna 交互。

要与 fauna 交互，我们需要向其 graphql 端点发送 POST
请求，并附带适当的查询和参数以获取返回的数据。因此，让我们构建一个通用函数来处理这些事情。

```typescript
async function queryFauna(
  query: string,
  variables: { [key: string]: unknown },
): Promise<{
  data?: any;
  error?: any;
}> {
  // 从环境中获取密钥。
  const token = Deno.env.get("FAUNA_SECRET");
  if (!token) {
    throw new Error("环境变量 FAUNA_SECRET 未设置");
  }

  try {
    // 向 fauna 的 graphql 端点发送 POST 请求，请求体为查询及其变量。
    const res = await fetch("https://graphql.fauna.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();
    if (errors) {
      // 如果有错误，返回第一个错误。
      return { data, error: errors[0] };
    }

    return { data };
  } catch (error) {
    return { error };
  }
}
```

将此代码添加到 `quotes.ts` 文件中。现在让我们继续更新端点以使用 fauna。

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
+    const { quote, author, error } = await createQuote(
+      body as { quote: string; author: string }
+    );
+    if (error) {
+      return json({ error: "无法创建名言" }, { status: 500 });
+    }

    return json({ quote, author }, { status: 201 });
  }

  return json({ quotes });
}

+async function createQuote({
+  quote,
+  author,
+}: {
+  quote: string;
+  author: string;
+}): Promise<{ quote?: string; author?: string; error?: string }> {
+  const query = `
+    mutation($quote: String!, $author: String!) {
+      createQuote(data: { quote: $quote, author: $author }) {
+        quote
+        author
+      }
+    }
+  `;
+
+  const { data, error } = await queryFauna(query, { quote, author });
+  if (error) {
+    return { error };
+  }
+
+  return data;
+}
```

现在我们已经更新了代码以插入新名言，让我们在继续测试代码之前设置一个 fauna
数据库。

创建一个新数据库：

1. 访问 https://dashboard.fauna.com （如果需要请登录）并点击 **New Database**
2. 填写 **Database Name** 字段并点击 **Save**。
3. 点击左侧边栏中可见的 **GraphQL** 部分。
4. 创建一个以 `.gql` 结尾的文件，内容为我们上面定义的模式。

生成访问数据库的密钥：

1. 点击 **Security** 部分并点击 **New Key**。
2. 选择 **Server** 角色并点击 **Save**。复制密钥。

现在让我们使用密钥运行应用程序。

```sh
FAUNA_SECRET=<你刚刚获得的密钥> deno run --allow-net=:8000 --watch quotes.ts
# 监听 http://0.0.0.0:8000
```

```sh
curl --dump-header - --request POST --data '{"quote": "未经测试的程序无法工作。", "author": "比雅尼·斯特劳斯特鲁普"}' http://127.0.0.1:8000/quotes
```

注意名言是如何添加到你的 FaunaDB 集合中的。

让我们编写一个新函数来获取所有名言。

```ts
async function getAllQuotes() {
  const query = `
    query {
      allQuotes {
        data {
          quote
          author
        }
      }
    }
  `;

  const {
    data: {
      allQuotes: { data: quotes },
    },
    error,
  } = await queryFauna(query, {});
  if (error) {
    return { error };
  }

  return { quotes };
}
```

并更新 `handleQuotes` 函数，代码如下。

```diff
-// 为了开始，我们只使用一个全局的名言数组。
-const quotes = [
-  {
-    quote: "那些能够想象任何事情的人，可以创造不可能。",
-    author: "艾伦·图灵",
-  },
-  {
-    quote: "任何足够先进的技术都与魔法无异。",
-    author: "亚瑟·克拉克",
-  },
-];

async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
    const { quote, author, error } = await createQuote(
      body as { quote: string; author: string },
    );
    if (error) {
      return json({ error: "无法创建名言" }, { status: 500 });
    }

    return json({ quote, author }, { status: 201 });
  }

+  // 假设请求方法是 "GET"。
+  {
+    const { quotes, error } = await getAllQuotes();
+    if (error) {
+      return json({ error: "无法获取名言" }, { status: 500 });
+    }
+
+    return json({ quotes });
+  }
}
```

```sh
curl http://127.0.0.1:8000/quotes
```

你应该会看到我们插入到数据库中的所有名言。API 的最终代码可在
https://deno.com/examples/fauna.ts 获取。

## 部署 API

现在一切就绪，让我们部署你的新 API！

1. 在浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并链接你的
   GitHub 账户。
2. 选择包含你新 API 的仓库。
3. 你可以为你的项目命名，或允许 Deno 为你生成一个名称。
4. 在 Entrypoint 下拉菜单中选择 `index.ts`。
5. 点击 **Deploy Project**

为了使你的应用程序正常工作，我们需要配置其环境变量。

在你的项目成功页面或项目仪表板中，点击 **Add environmental variables**。在
Environment Variables 下，点击 **+ Add Variable**。创建一个名为 `FAUNA_SECRET`
的新变量 - 值应为我们之前创建的密钥。

点击保存变量。

在你的项目概览中，点击 **View** 以在浏览器中查看项目，在 URL 末尾添加 `/quotes`
以查看你的 FaunaDB 内容。
