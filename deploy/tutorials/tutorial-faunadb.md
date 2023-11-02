# API 服务与 FaunaDB

FaunaDB 称其为“现代应用程序的数据 API”。它是一个带有 GraphQL
接口的数据库，使您能够使用 GraphQL 与其进行交互。由于我们使用 HTTP
请求与其通信，因此无需管理连接，非常适用于无服务器应用程序。

本教程假设您拥有 [FaunaDB](https://fauna.com) 和 Deno Deploy 帐户，已安装 Deno
Deploy CLI，并具有一些 GraphQL 的基本知识。

- [概述](#概述)
- [构建 API 端点](#构建-api-端点)
- [使用 FaunaDB 进行持久化](#使用-faunadb-进行持久化)
- [部署 API](#部署-api)

## 概述

在本教程中，让我们构建一个小型引用 API，具有用于插入和检索引用的端点。然后使用
FaunaDB 来存储引用。

让我们首先定义 API 端点。

```sh
向端点发送 POST 请求应将引用插入到列表中。
POST /quotes/
# 请求的正文。
{
  "quote": "不要以你获得的收获来判断每一天，而要以你播下的种子来判断。",
  "author": "罗伯特·路易斯·史蒂文森"
}

# 向端点发送 GET 请求应从数据库返回所有引用。
GET /quotes/
# 请求的响应。
{
  "quotes": [
    {
      "quote": "不要以你获得的收获来判断每一天，而要以你播下的种子来判断。",
      "author": "罗伯特·路易斯·史蒂文森"
    }
  ]
}
```

现在我们了解了端点应如何行为，让我们继续构建它。

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

// 为了开始，让我们只使用引用的全局数组。
const quotes = [
  {
    quote: "那些能够想象一切的人，能够创造不可能。",
    author: "艾伦·图灵",
  },
  {
    quote: "任何足够先进的技术都等同于魔法。",
    author: "亚瑟·C·克拉克",
  },
];

async function handleQuotes(request: Request) {
  // 确保请求是 GET 请求。
  const { error } = await validateRequest(request, {
    GET: {},
  });
  // 如果请求不符合我们定义的模式，validateRequest 将填充错误。
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // 返回所有引用。
  return json({ quotes });
}
```

使用 [Deno CLI](https://deno.land) 运行上面的程序。

```sh
deno run --allow-net=:8000 ./path/to/quotes.ts
# 在 http://0.0.0.0: 8000/ 上监听/
```

并使用 curl 命令访问端点以查看一些引用。

```sh
curl http://127.0.0.1:8000/quotes
# {"quotes":[
# {"quote": "那些能够想象一切的人，能够创造不可能。", "author": "艾伦·图灵"},
# {"quote": "任何足够先进的技术都等同于魔法。", "author": "亚瑟· C ·克拉克"}
# ]}
```

太棒了！我们构建了我们的 API
端点，它按预期工作。由于数据存储在内存中，重启后数据将丢失。让我们使用 FaunaDB
来存储我们的引用。

## 使用 FaunaDB 进行持久化

让我们使用 GraphQL 模式定义我们的数据库架构。

```gql
# 我们正在创建一个名为“Quote”的新类型，以表示引用及其作者。
type Quote {
  quote: String!
  author: String!
}

type Query {
  # 在 Query 操作中创建一个新字段以检索所有引用。
  allQuotes: [Quote!]
}
```

Fauna 为其数据库提供了 GraphQL
端点，并为模式中定义的数据类型生成了关键的变更操作，例如创建、更新、删除。例如，Fauna
将生成一个名为 `createQuote` 的变更操作，用于在数据类型 `Quote`
中为数据库创建新的引用。此外，我们还定义了一个查询字段，名为
`allQuotes`，它返回数据库中的所有引用。

现在，让我们编写与 Deno Deploy 应用程序中的 Fauna 交互的代码。

要与 Fauna 进行交互，我们需要使用适当的查询和参数向其 GraphQL 端点发出 POST
请求，以获取返回的数据。因此，让我们构建一个通用函数，用于处理这些任务。

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
    throw new错误("未设置环境变量 FAUNA_SECRET");
  }

  尝试 {
    // 通过 body 为查询和其变量的 POST 请求向 Fauna 的 GraphQL 端点发出请求。
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

    const

 { data, errors } = await res.json();
    if (errors) {
      // 如果存在错误，返回第一个错误。
      返回 { data, error: errors[0] };
    }

    返回 { data };
  } catch (error) {
    返回 { error };
  }
}
```

将此代码添加到 `quotes.ts` 文件中。现在让我们继续更新端点以使用 Fauna。

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
+      return json({ error: "couldn't create the quote" }, { status: 500 });
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

现在我们已经更新了代码以插入新的引用，让我们在测试代码之前设置一个 Fauna
数据库。

创建一个新的数据库：

1. 转到 https://dashboard.fauna.com（如果需要登录），然后点击 **新数据库**。
2. 填写 **数据库名称** 字段，然后点击 **保存**。
3. 点击左侧边栏上可见的 **GraphQL** 部分。
4. 创建一个以 `.gql` 扩展名结尾的文件，其内容为我们上面定义的模式。

生成一个访问数据库的密钥：

1. 点击 **安全** 部分，然后点击 **新密钥**。
2. 选择 **服务器** 角色，然后点击 **保存**。复制密钥。

现在让我们使用密钥运行应用程序。

```sh
FAUNA_SECRET=<刚刚获取的密钥> deno run --allow-net=:8000 --watch quotes.ts
# 在 http://0.0.0.0: 8000 上监听
```

```sh
curl --dump-header - --request POST --data '{"quote": "A program that has not been tested does not work.", "author": "Bjarne Stroustrup"}' http://127.0.0.1:8000/quotes
```

注意看看引用如何被添加到你的 FaunaDB 集合中。

让我们编写一个新的函数来获取所有的引用。

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

并使用以下代码更新 `handleQuotes` 函数。

```diff
-// 为了开始，让我们只使用一个全局引用数组。
-const quotes = [
-  {
-    quote: "Those who can imagine anything, can create the impossible.",
-    author: "Alan Turing",
-  },
-  {
-    quote: "Any sufficiently advanced technology is equivalent to magic.",
-    author: "Arthur C. Clarke",
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
      return json({ error: "couldn't create the quote" }, { status: 500 });
    }

    return json({ quote, author }, { status: 201 });
  }

+  // 假定请求方法为“GET”。
+  {
+    const { quotes, error } = await getAllQuotes();
+    if (error) {
+      return json({ error: "couldn't fetch the quotes" }, { status: 500 });
+    }
+
+    return json({ quotes });
+  }
}
```

```sh
curl http://127.0.0.1:8000/quotes
```

你应该看到我们已经插入到数据库中的所有引用。API 的最终代码位于
https://deno.com/examples/fauna.ts。

## 部署 API

部署 API 的过程涉及创建一个新的 Deno Deploy 项目和一个用于保存我们的 FaunaDB
密钥的秘密。

创建项目和秘密：

1. 转到
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后在 **从命令行部署** 下点击 **+空项目**。
2. 现在，在项目页面上点击 **设置** 按钮。
3. 转到 **环境变量** 部分，然后添加以下秘密。

- `FAUNA_SECRET` - 值应该是我们在前面步骤中创建的密钥或一个新的密钥。

不要关闭这个选项卡。

部署代码：

1. 在 https://gist.github.com/new 创建一个代码片段（确保文件的扩展名是
   `.ts`），并获取它的原始链接。
   > 为了方便，该代码也托管在 https://deno.com/examples/fauna.ts
   > 上，因此如果您只想尝试上面的示例而不对其进行更改，可以跳过创建代码片段。
2. 返回到 Deno Deploy **设置** 屏幕，我们在那里创建了我们的秘密。
3. 在 **设置** 页面上点击您的项目名称，返回到项目的仪表板。
4. 点击 **部署 URL**，粘贴原始链接，然后点击 **部署**。
5. 点击访问，以在 Deno Deploy 上看到您的项目（请记住将 `/quotes` 附加到部署 URL
   以查看 FaunaDB 的内容）。

就是这样。

祝贺您构建和部署 Quotes API！

---

[![部署 FaunaDB 示例](/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.com/examples/fauna.ts&env=FAUNA_SECRET)
