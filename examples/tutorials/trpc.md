---
title: "使用 tRPC 和 Deno 构建类型安全的 API"
url: /examples/trpc_tutorial/
oldUrl:
  - /runtime/tutorials/trpc/
---

Deno 是一个
[一体化、零配置的工具链](https://docs.denohub.com/runtime/manual/tools)，用于编写
JavaScript 和
[TypeScript](https://docs.denohub.com/runtime/fundamentals/typescript/)，并且
[原生支持 Web 平台 API](https://docs.denohub.com/runtime/reference/web_platform_apis/)，使其成为快速构建后端和
API 的理想选择。为了使我们的 API 更易于维护，我们可以使用
[tRPC](https://trpc.io/)，这是一个 TypeScript
RPC（[远程过程调用](https://en.wikipedia.org/wiki/Remote_procedure_call)）框架，它使您能够构建完全类型安全的
API，而无需模式声明或代码生成。

在本教程中，我们将使用 tRPC 和 Deno 构建一个简单的类型安全
API，返回有关恐龙的信息：

- [设置 tPRC](#设置-trpc)
- [设置服务器](#设置-trpc-服务器)
- [设置客户端](#设置-trpc-客户端)
- [下一步是什么？](#下一步是什么)

您可以在
[这个 GitHub 仓库](https://github.com/denoland/examples/tree/main/with-trpc)
中找到本教程的所有代码。

## 设置 tRPC

要在 Deno 中开始使用 tRPC，我们需要安装所需的依赖项。得益于 Deno 的 npm
兼容性，我们可以使用 tRPC 包的 npm 版本以及 Zod 进行输入验证：

```bash
deno install npm:@trpc/server@next npm:@trpc/client@next npm:zod jsr:@std/path
```

这将安装最新的 tRPC 服务器和客户端包、[Zod](https://zod.dev/)
用于运行时类型验证，以及 [Deno 标准库的 `path`](https://jsr.io/@std/path)
工具。这些包将使我们能够在客户端和服务器代码之间构建一个类型安全的 API 层。

这将在项目根目录中创建一个 `deno.json` 文件来管理 npm 和 [jsr](https://jsr.io/)
依赖项：

```tsx
{
  "imports": {
    "@std/path": "jsr:@std/path@^1.0.6",
    "@trpc/client": "npm:@trpc/client@^11.0.0-rc.593",
    "@trpc/server": "npm:@trpc/server@^11.0.0-rc.593",
    "zod": "npm:zod@^3.23.8"
  }
}
```

## 设置 tRPC 服务器

构建 tRPC 应用程序的第一步是设置服务器。我们将从初始化 tRPC
并创建我们的基础路由器和过程构建器开始。这些将是我们定义 API 端点的基础。

创建一个 `server/trpc.ts` 文件：

```tsx
// server/trpc.ts

import { initTRPC } from "@trpc/server";

/**
 * 初始化 tRPC 后端
 * 每个后端只需执行一次！
 */

const t = initTRPC.create();

/**
 * 导出可重用的路由器和过程助手
 * 可以在整个路由器中使用
 */

export const router = t.router;
export const publicProcedure = t.procedure;
```

这将初始化 tRPC 并导出我们将用于定义 API
端点的路由器和过程构建器。`publicProcedure` 允许我们创建不需要身份验证的端点。

接下来，我们将创建一个简单的数据层来管理我们的恐龙数据。创建一个 `server/db.ts`
文件，内容如下：

```tsx
// server/db.ts
import { join } from "@std/path";

type Dino = { name: string; description: string };

const dataPath = join("data", "data.json");

async function readData(): Promise<Dino[]> {
  const data = await Deno.readTextFile(dataPath);
  return JSON.parse(data);
}

async function writeData(dinos: Dino[]): Promise<void> {
  await Deno.writeTextFile(dataPath, JSON.stringify(dinos, null, 2));
}

export const db = {
  dino: {
    findMany: () => readData(),
    findByName: async (name: string) => {
      const dinos = await readData();
      return dinos.find((dino) => dino.name === name);
    },
    create: async (data: { name: string; description: string }) => {
      const dinos = await readData();
      const newDino = { ...data };
      dinos.push(newDino);
      await writeData(dinos);
      return newDino;
    },
  },
};
```

这将创建一个简单的基于文件的数据库，将恐龙数据读取和写入 JSON
文件。在生产环境中，您通常会使用适当的数据库，但这对于我们的演示来说已经足够。

> ⚠️️ 在本教程中，我们硬编码数据并使用基于文件的数据库。但是，您可以
> [连接到各种数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
> 并使用 ORM，如 [Drizzle](https://docs.denohub.com/examples/drizzle) 或
> [Prisma](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)。

最后，我们需要提供实际的数据。让我们创建一个 `./data.json`
文件，其中包含一些示例恐龙数据：

```tsx
// data/data.json
[
  {
    "name": "Aardonyx",
    "description": "An early stage in the evolution of sauropods."
  },
  {
    "name": "Abelisaurus",
    "description": "\"Abel's lizard\" has been reconstructed from a single skull."
  },
  {
    "name": "Abrictosaurus",
    "description": "An early relative of Heterodontosaurus."
  },
  {
    "name": "Abrosaurus",
    "description": "A close Asian relative of Camarasaurus."
  },
  ...
 ]
```

现在，我们可以创建我们的主服务器文件，定义我们的 tRPC 路由器和过程。创建一个
`server/index.ts` 文件：

```tsx
// server/index.ts

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { db } from "./db.ts";
import { publicProcedure, router } from "./trpc.ts";

const appRouter = router({
  dino: {
    list: publicProcedure.query(async () => {
      const dinos = await db.dino.findMany();
      return dinos;
    }),
    byName: publicProcedure.input(z.string()).query(async (opts) => {
      const { input } = opts;
      const dino = await db.dino.findByName(input);
      return dino;
    }),
    create: publicProcedure
      .input(z.object({ name: z.string(), description: z.string() }))
      .mutation(async (opts) => {
        const { input } = opts;
        const dino = await db.dino.create(input);
        return dino;
      }),
  },
  examples: {
    iterable: publicProcedure.query(async function* () {
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
  },
});

// 导出路由器类型签名，客户端将使用此类型。
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
```

这将设置三个主要端点：

- `dino.list`：返回所有恐龙
- `dino.byName`：按名称返回特定恐龙
- `dino.create`：创建新恐龙
- `examples.iterable`：展示 tRPC 对异步可迭代对象的支持

服务器配置为监听端口 3000，并将处理所有 tRPC 请求。

虽然您现在可以运行服务器，但您将无法访问任何路由并返回数据。让我们来解决这个问题！

## 设置 tRPC 客户端

我们的服务器准备好了，我们可以创建一个客户端，以完全类型安全的方式使用我们的
API。创建一个 `client/index.ts` 文件：

```tsx
// client/index.ts
/**
 * 这是使用服务器推断类型的客户端代码
 */
import {
  createTRPCClient,
  splitLink,
  unstable_httpBatchStreamLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
/**
 * 我们只从服务器导入 `AppRouter` 类型 - 这在运行时不可用
 */
import type { AppRouter } from "../server/index.ts";

// 初始化 tRPC 客户端
const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: unstable_httpSubscriptionLink({
        url: "http://localhost:3000",
      }),
      false: unstable_httpBatchStreamLink({
        url: "http://localhost:3000",
      }),
    }),
  ],
});

const dinos = await trpc.dino.list.query();
console.log("Dinos:", dinos);

const createdDino = await trpc.dino.create.mutate({
  name: "Denosaur",
  description:
    "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast.",
});
console.log("Created dino:", createdDino);

const dino = await trpc.dino.byName.query("Denosaur");
console.log("Denosaur:", dino);

const iterable = await trpc.examples.iterable.query();

for await (const i of iterable) {
  console.log("Iterable:", i);
}
```

此客户端代码展示了 tRPC 的几个关键特性：

1. **从服务器路由器推断类型**。客户端通过 `AppRouter`
   类型导入自动继承服务器中的所有类型定义。这意味着您将获得完整的类型支持和编译时类型检查。如果您在服务器上修改了一个过程，TypeScript
   将立即标记任何不兼容的客户端使用。
2. **进行查询和突变**。示例展示了两种类型的 API
   调用：用于获取数据且无副作用的查询（`list` 和
   `byName`），以及用于修改服务器端状态的突变（`create`）。客户端自动知道每个过程的输入和输出类型，在整个请求周期中提供类型安全。
3. **使用异步可迭代对象**。`examples.iterable` 展示了 tRPC
   使用异步可迭代对象流式传输数据的支持。此功能对于实时更新或分块处理大型数据集特别有用。

现在，让我们启动服务器以查看其运行情况。在我们的 `deno.json`
配置文件中，让我们创建一个新的 `tasks` 属性，包含以下命令：

```json
{
  "tasks": {
    "start": "deno -A server/index.ts",
    "client": "deno -A client/index.ts"
  }
  // deno.json 中的其他属性保持不变。
}
```

我们可以使用 `deno task` 列出可用的任务：

```bash
deno task
Available tasks:
- start
    deno -A server/index.ts
- client
    deno -A client/index.ts
```

现在，我们可以使用 `deno task start` 启动服务器。运行后，我们可以使用
`deno task client` 运行客户端。您应该会看到如下输出：

```bash
deno task client
Dinos: [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods."
  },
  {
    name: "Abelisaurus",
    description: "Abel's lizard has been reconstructed from a single skull."
  },
  {
    name: "Abrictosaurus",
    description: "An early relative of Heterodontosaurus."
  },
  ...
]
Created dino: {
  name: "Denosaur",
  description: "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast."
}
Denosaur: {
  name: "Denosaur",
  description: "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast."
}
Iterable: 0
Iterable: 1
Iterable: 2
```

成功！运行 `./client/index.ts` 展示了如何创建 tRPC 客户端并使用其 JavaScript API
与数据库交互。但是我们如何检查 tRPC
客户端是否从数据库推断出正确的类型呢？让我们修改 `./client/index.ts`
中的代码片段，将 `description` 传递为 `number` 而不是 `string`：

```diff
// ...
const createdDino = await trpc.dino.create.mutate({
  name: "Denosaur",
  description:
-   "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast.",
+   100,
});
console.log("Created dino:", createdDino);
// ...
```

当我们重新运行客户端时：

```bash
deno task client
...
error: Uncaught (in promise) TRPCClientError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [
      "description"
    ],
    "message": "Expected string, received number"
  }
]
    at Function.from (file:///Users/andyjiang/Library/Caches/deno/npm/registry.npmjs.org/@trpc/client/11.0.0-rc.608/dist/TRPCClientError.mjs:35:20)
    at file:///Users/andyjiang/Library/Caches/deno/npm/registry.npmjs.org/@trpc/client/11.0.0-rc.608/dist/links/httpBatchStreamLink.mjs:118:56
    at eventLoopTick (ext:core/01_core.js:175:7)
```

tRPC 成功抛出了一个 `invalid_type` 错误，因为它期望的是 `string` 而不是
`number`。

## 下一步是什么？

现在您已经基本了解了如何在 Deno 中使用 tRPC，您可以：

1. 使用 [Next.js](https://trpc.io/docs/client/nextjs) 或
   [React](https://trpc.io/docs/client/react) 构建一个实际的前端
2. [使用 tRPC 中间件为您的 API 添加身份验证](https://trpc.io/docs/server/middlewares#authorization)
3. 实现实时功能 [使用 tRPC 订阅](https://trpc.io/docs/server/subscriptions)
4. 添加 [输入验证](https://trpc.io/docs/server/validators)
   以处理更复杂的数据结构
5. 集成适当的数据库，如
   [PostgreSQL](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/#postgres)，或使用
   ORM，如 [Drizzle](https://docs.denohub.com/examples/drizzle) 或
   [Prisma](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
6. 将您的应用程序部署到 [Deno Deploy](https://deno.com/deploy) 或
   [通过 Docker 部署到任何公共云](https://docs.denohub.com/runtime/tutorials/#deploying-deno-projects)

🦕 祝您在 Deno 和 tRPC 中享受类型安全编码的乐趣！
