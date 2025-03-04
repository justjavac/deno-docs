---
title: "如何使用 Prisma 和 Oak 创建 RESTful API"
url: /examples/prisma_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/prisma/
  - /runtime/tutorials/how_to_with_npm/prisma/
---

[Prisma](https://prisma.io) 一直是我们最受欢迎的模块之一，用于在 Deno
中进行开发。这种需求是可以理解的，因为 Prisma
的开发体验非常出色，并且与许多持久化数据存储技术兼容。

我们很高兴向您展示如何在 Deno 中使用 Prisma。

在本指南中，我们将使用 Oak 和 Prisma 在 Deno 中设置一个简单的 RESTful API。

让我们开始吧。

[查看源代码](https://github.com/denoland/examples/tree/main/with-prisma) 或
[查看视频指南](https://youtu.be/P8VzA_XSF8w)。

## 设置应用程序

让我们创建文件夹 `rest-api-with-prisma-oak` 并进入该文件夹：

```shell
mkdir rest-api-with-prisma-oak
cd rest-api-with-prisma-oak
```

然后，让我们在 Deno 中运行 `prisma init`：

```shell
deno run --allow-read --allow-env --allow-write npm:prisma@latest init
```

这将生成
[`prisma/schema.prisma`](https://www.prisma.io/docs/concepts/components/prisma-schema)。让我们用以下内容更新它：

```ts
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["deno"]
  output = "../generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Dinosaur {
  id          Int     @id @default(autoincrement())
  name        String  @unique
  description String
}
```

Prisma 还会生成一个包含 `DATABASE_URL` 环境变量的 `.env` 文件。让我们将
`DATABASE_URL` 分配给一个 PostgreSQL 连接字符串。在本例中，我们将使用
[Supabase 提供的免费 PostgreSQL 数据库](https://supabase.com/database)。

接下来，让我们创建数据库模式：

```shell
deno run -A npm:prisma@latest db push
```

完成后，我们需要生成 Prisma Client：

```shell
deno run -A --unstable-detect-cjs npm:prisma@latest generate --no-engine
```

## 在 Prisma 数据平台中设置 Accelerate

要开始使用 Prisma 数据平台：

1. 注册一个免费的 [Prisma 数据平台账户](https://console.prisma.io)。
2. 创建一个项目。
3. 导航到您创建的项目。
4. 通过提供数据库的连接字符串来启用 Accelerate。
5. 生成一个 Accelerate 连接字符串并将其复制到剪贴板。

将 Accelerate 连接字符串（以 `prisma://` 开头）分配给 `.env` 文件中的
`DATABASE_URL`，替换现有的连接字符串。

接下来，让我们创建一个种子脚本来填充数据库。

## 填充数据库

创建 `./prisma/seed.ts`：

```shell
touch prisma/seed.ts
```

在 `./prisma/seed.ts` 中：

```ts
import { Prisma, PrismaClient } from "../generated/client/deno/edge.ts";

const prisma = new PrismaClient({
  datasourceUrl: envVars.DATABASE_URL,
});

const dinosaurData: Prisma.DinosaurCreateInput[] = [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    name: "Abelisaurus",
    description: "Abel's lizard has been reconstructed from a single skull.",
  },
  {
    name: "Acanthopholis",
    description: "No, it's not a city in Greece.",
  },
];

/**
 * 填充数据库。
 */

for (const u of dinosaurData) {
  const dinosaur = await prisma.dinosaur.create({
    data: u,
  });
  console.log(`Created dinosaur with id: ${dinosaur.id}`);
}
console.log(`Seeding finished.`);

await prisma.$disconnect();
```

我们现在可以运行 `seed.ts`：

```shell
deno run -A --env prisma/seed.ts
```

> [!TIP]
>
> `--env` 标志用于告诉 Deno 从 `.env` 文件加载环境变量。

完成后，您应该可以通过运行以下命令在 Prisma Studio 中看到您的数据：

```bash
deno run -A npm:prisma studio
```

您应该会看到类似于以下截图的内容：

![Prisma 仪表板中的新恐龙](./images/how-to/prisma/1-dinosaurs-in-prisma.png)

## 创建 API 路由

我们将使用 [`oak`](https://deno.land/x/oak) 来创建 API
路由。让我们暂时保持简单。

让我们创建一个 `main.ts` 文件：

```shell
touch main.ts
```

然后，在您的 `main.ts` 文件中：

```ts
import { PrismaClient } from "./generated/client/deno/edge.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

/**
 * 初始化。
 */

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVars.DATABASE_URL,
    },
  },
});
const app = new Application();
const router = new Router();

/**
 * 设置路由。
 */

router
  .get("/", (context) => {
    context.response.body = "Welcome to the Dinosaur API!";
  })
  .get("/dinosaur", async (context) => {
    // 获取所有恐龙。
    const dinosaurs = await prisma.dinosaur.findMany();
    context.response.body = dinosaurs;
  })
  .get("/dinosaur/:id", async (context) => {
    // 通过 id 获取一只恐龙。
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.findUnique({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  })
  .post("/dinosaur", async (context) => {
    // 创建一只新恐龙。
    const { name, description } = await context.request.body("json").value;
    const result = await prisma.dinosaur.create({
      data: {
        name,
        description,
      },
    });
    context.response.body = result;
  })
  .delete("/dinosaur/:id", async (context) => {
    // 通过 id 删除一只恐龙。
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.delete({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  });

/**
 * 设置中间件。
 */

app.use(router.routes());
app.use(router.allowedMethods());

/**
 * 启动服务器。
 */

await app.listen({ port: 8000 });
```

现在，让我们运行它：

```shell
deno run -A --env main.ts
```

让我们访问 `localhost:8000/dinosaurs`：

![从 REST API 获取的所有恐龙列表](./images/how-to/prisma/2-dinosaurs-from-api.png)

接下来，让我们使用以下 `curl` 命令 `POST` 一个新用户：

```shell
curl -X POST http://localhost:8000/dinosaur -H "Content-Type: application/json" -d '{"name": "Deno", "description":"The fastest, most secure, easiest to use Dinosaur ever to walk the Earth."}'
```

您现在应该在 Prisma Studio 中看到一个新行：

![Prisma 中的新恐龙 Deno](./images/how-to/prisma/3-new-dinosaur-in-prisma.png)

不错！

## 接下来是什么？

使用 Deno 和 Prisma
构建您的下一个应用程序将更加高效和有趣，因为这两种技术都提供了直观的开发体验，包括数据建模、类型安全和强大的
IDE 支持。

如果您有兴趣将 Prisma 连接到 Deno
Deploy，[请查看这个很棒的指南](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-deno-deploy)。
