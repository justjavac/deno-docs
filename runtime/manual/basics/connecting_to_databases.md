# 连接到数据库

Deno 社区已经发布了许多第三方模块，使连接到流行的数据库如 MySQL、Postgres 和
MongoDB 变得容易。

它们托管在 Deno 的第三方模块网站 [deno.land/x](https://deno.land/x)。

## MySQL

[deno_mysql](https://deno.land/x/mysql) 是一个用于 Deno 的 MySQL 和 MariaDB
数据库驱动程序。

### 使用 deno_mysql 连接到 MySQL

```ts, ignore
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  password: "password",
});
```

## Postgres

[postgresjs](https://deno.land/x/postgresjs) 是一个完整的 Node.js 和 Deno 的
Postgres 客户端。

### 使用 postgresjs 连接到 Postgres

```js, ignore
import postgres from "https://deno.land/x/postgresjs/mod.js";

const sql = postgres("postgres://username:password@host:port/database");
```

## MongoDB

我们建议使用 [npm specifiers](../node/npm_specifiers.md) 与官方的
[MongoDB npm 驱动程序](https://www.npmjs.com/package/mongodb) 一起工作。您可以在
[官方文档](https://www.mongodb.com/docs/drivers/node/current/)
中详细了解如何使用该驱动程序。在 Deno 环境中使用此模块的唯一区别是使用 `npm:`
specifier 导入模块。

```ts title="使用 npm specifiers 导入 MongoDB 驱动程序"
// 导入 MongoDB 驱动程序的最新主要版本
import { MongoClient } from "npm:mongodb@6";

// 配置 MongoDB 客户端
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "myProject";

// 连接到 MongoDB 实例
await client.connect();
console.log("成功连接到服务器");

// 获取对集合的引用
const db = client.db(dbName);
const collection = db.collection("documents");

// 执行插入操作
const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }]);
console.log("插入的文档 =>", insertResult);

// 关闭连接
client.close();
```

## SQLite

在 Deno 中连接到 SQLite 有两种主要解决方案：

### 使用 FFI 模块连接到 SQLite

[sqlite3](https://deno.land/x/sqlite3) 提供了与 SQLite3 C API 的 JavaScript
绑定，使用了 [Deno FFI](../runtime/ffi_api.md)。

```ts, ignore
import { Database } from "https://deno.land/x/sqlite3@LATEST_VERSION/mod.ts";

const db = new Database("test.db");

db.close();
```

### 使用 WASM 优化模块连接到 SQLite

[sqlite](https://deno.land/x/sqlite) 是 JavaScript 和 TypeScript 的 SQLite
模块，专门为 Deno 制作，使用了编译为 WebAssembly（WASM）的 SQLite3 版本。

```ts, ignore
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("test.db");

db.close();
```

## Firebase

要在 Deno 中连接到 Firebase，使用
[firestore npm 模块](https://firebase.google.com/docs/firestore/quickstart)，并使用
[skypak CDN](https://www.skypack.dev/) 导入它。要了解如何在 Deno 中使用 CDN 与
npm 包，请参阅 [使用 CDN 的 npm 包](../node/cdns.md)。

### 使用 firestore npm 模块连接到 Firebase

```js, ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.comfirebasejs/9.8.1/firebase-auth.js";

const app = initializeApp({
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  storageBucket: Deno.env.get("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("FIREBASE_MESSING_SENDER_ID"),
  appId: Deno.env.get("FIREBASE_APP_ID"),
  measurementId: Deno.env.get("FIREBASE_MEASUREMENT_ID"),
});
const db = getFirestore(app);
const auth = getAuth(app);
```

## Supabase

要在 Deno 中连接到 Supabase，使用
[supabase-js npm 模块](https://supabase.com/docs/reference/javascript)，并使用
[esm.sh CDN](https://esm.sh/) 导入它。要了解如何在 Deno 中使用 CDN 与 npm
包，请参阅 [使用 CDN 的 npm 包](../node/cdns.md)。

### 使用 supabase-js npm 模块连接到 Supabase

```js, ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "my-app-name" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "public-anon-key",
  options,
);
```

## ORM

对象关系映射（ORM）将您的数据模型定义为可以持久保存到数据库的类。您可以通过这些类的实例在数据库中读取和写入数据。

Deno 支持多个 ORM，包括 Prisma 和 DenoDB。

### DenoDB

[DenoDB](https://deno.land/x/denodb) 是一个特定于 Deno 的 ORM。

#### 连接到 DenoDB

```ts, ignore
import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
} from "https://deno.land/x/denodb/mod.ts";

const connection = new PostgresConnector({
  host: "...",
  username: "user",
  password: "password",
  database: "airlines",
});

const db = new Database(connection);
```

## GraphQL

GraphQL 是一个 API 查询语言，通常用于组合不同的数据源以创建面向客户端的
API。要设置一个 GraphQL API，您首先应该设置一个 GraphQL
服务器。该服务器将您的数据公开为 GraphQL API，供客户端应用程序查询数据。

### 

服务器

您可以使用 [gql](https://deno.land/x/gql)，这是一个通用的 Deno GraphQL HTTP
中间件，用于在 Deno 中运行 GraphQL API 服务器。

#### 使用 gql 运行 GraphQL API 服务器

```ts, ignore
import { Server } from "https://deno.land/std@$STD_VERSION/http/server.ts";
import { GraphQLHTTP } from "https://deno.land/x/gql/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
        schema,
        graphiql: true,
      })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

s.listenAndServe();

console.log(`已启动，访问地址：http://localhost:3000`);
```

### 客户端

要在 Deno 中进行 GraphQL 客户端调用，使用
[graphql npm 模块](https://www.npmjs.com/package/graphql)，并使用
[esm CDN](https://esm.sh/) 导入它。要了解如何通过 CDN 在 Deno 中使用 npm
模块，请阅读 [这里](../node/cdns.md)。

#### 使用 graphql npm 模块进行 GraphQL 客户端调用

```js, ignore
import { buildSchema, graphql } from "https://esm.sh/graphql";

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const rootValue = {
  hello: () => {
    return "Hello world!";
  },
};

const response = await graphql({
  schema,
  source: "{ hello }",
  rootValue,
});

console.log(response);
```
