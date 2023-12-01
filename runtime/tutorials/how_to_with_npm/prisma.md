# 如何使用 Prisma 和 Oak 创建一个 RESTful API

[Prisma](https://prisma.io) 一直是我们在 Deno
中工作时最受欢迎的模块之一。这种需求是可以理解的，因为 Prisma
的开发者体验非常出色，而且与许多持久数据存储技术很好地协同工作。

我们很高兴向您展示如何在 Deno 中使用 Prisma。

在本教程中，我们将使用 Oak 和 Prisma 来设置一个简单的 RESTful API。

让我们开始吧。

[查看源代码](https://github.com/denoland/examples/tree/main/with-prisma) 或查看
[视频教程](https://youtu.be/P8VzA_XSF8w)。

## 设置应用程序

让我们创建名为 `rest-api-with-prisma-oak` 的文件夹并导航到那里：

```shell, ignore
mkdir rest-api-with-prisma-oak
cd rest-api-with-prisma-oak
```

然后，让我们使用 Deno 运行 `prisma init`：

```shell, ignore
deno run --allow-read --allow-env --allow-write npm:prisma@latest init
```

这将生成
[`prisma/schema.prisma`](https://www.prisma.io/docs/concepts/components/prisma-schema)。让我们用以下内容更新它：

```ts, ignore
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

Prisma还会生成一个包含`DATABASE_URL`环境变量的`.env`文件。让我们将`DATABASE_URL`赋值给一个PostgreSQL连接字符串。在这个例子中，我们将使用来自[Supabase的免费PostgreSQL数据库](https://supabase.com/database)。

接下来，让我们创建数据库模式：

```shell, ignore
deno run -A npm:prisma@latest db push
```

完成这一步后，我们需要生成 Prisma 客户端：

```shell, ignore
deno run -A --unstable npm:prisma@latest generate --no-engine
```

## 在 Prisma 数据平台中设置 Accelerate

要开始使用 Prisma 数据平台，请按以下步骤操作：

1. 注册一个免费的 [Prisma 数据平台账户](https://console.prisma.io)。
2. 创建一个项目。
3. 转到您创建的项目。
4. 通过提供数据库连接字符串启用 Accelerate。
5. 生成 Accelerate 连接字符串并将其复制到剪贴板。

将以 `prisma://` 开头的 Accelerate 连接字符串分配给您的 `.env` 文件中的
`DATABASE_URL`，替换您现有的连接字符串。

接下来，让我们创建一个种子脚本以向数据库添加种子数据。

## 向数据库添加种子数据

创建 `./prisma/seed.ts`：

```shell, ignore
touch prisma/seed.ts
```

然后在 `./prisma/seed.ts` 中：

```ts, ignore
import { Prisma, PrismaClient } from "../generated/client/deno/edge.ts";
import { load } from "https://deno.land/std@$STD_VERSION/dotenv/mod.ts";

const envVars = await load();

const prisma = new PrismaClient({
  datasourceUrl: envVars.DATABASE_URL,
});

const dinosaurData: Prisma.DinosaurCreateInput[] = [
  {
    name: "Aardonyx",
    description: "Sauropods 进化早期阶段。",
  },
  {
    name: "Abelisaurus",
    description: "Abel's 蜥蜴已从一个头骨重建出来。",
  },
  {
    name: "Acanthopholis",
    description: "不，这不是希腊的一个城市。",
  },
];

/**
 * 向数据库添加种子数据。
 */

for (const u of dinosaurData) {
  const dinosaur = await prisma.dinosaur.create({
    data: u,
  });
  console.log(`已创建具有 id 的恐龙: ${dinosaur.id}`);
}
console.log(`种子数据添加完成。`);

await prisma.$disconnect();
```

现在，我们可以使用以下命令运行 `seed.ts`：

```shell, ignore
deno run -A prisma/seed.ts
```

完成这一步之后，通过运行以下命令，你应该能够在 Prisma Studio 中看到你的数据：

```bash, ignore
deno run -A npm:prisma studio
```

你应该会看到类似以下截图的内容：

![Prisma 控制面板中的新恐龙](../../manual/images/how-to/prisma/1-dinosaurs-in-prisma.png)

## 创建您的 API 路由

我们将使用 [`oak`](https://deno.land/x/oak) 来创建 API
路由。现在，让我们保持它们简单。

让我们创建一个 `main.ts` 文件：

```shell, ignore
touch main.ts
```

然后，在您的 `main.ts` 文件中：

```ts, ignore
import { PrismaClient } from "./generated/client/deno/edge.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { load } from "https://deno.land/std@$STD_VERSION/dotenv/mod.ts";

const envVars = await load();

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
    context.response.body = "欢迎来到恐龙API！";
  })
  .get("/dinosaur", async (context) => {
    // 获取所有恐龙。
    const dinosaurs = await prisma.dinosaur.findMany();
    context.response.body = dinosaurs;
  })
  .get("/dinosaur/:id", async (context) => {
    // 通过ID获取一只恐龙。
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.findUnique({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  })
  .post("/dinosaur", async (context) => {
    // 创建一只新的恐龙。
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
    // 通过ID删除一只恐龙。
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

```shell, ignore
deno run -A main.ts
```

让我们访问 `localhost:8000/dinosaurs`：

![来自 REST API 的所有恐龙列表](../../manual/images/how-to/prisma/2-dinosaurs-from-api.png)

接下来，使用此 `curl` 命令 `POST` 一个新用户：

```shell, ignore
curl -X POST http://localhost:8000/dinosaur -H "Content-Type: application/json" -d '{"name": "Deno", "description":"地球上最快、最安全、最易使用的恐龙。"}'
```

现在您应该在 Prisma Studio 中看到一行新数据：

![Prisma 中的新恐龙 Deno](../../manual/images/how-to/prisma/3-new-dinosaur-in-prisma.png)

很好！

## 下一步是什么？

使用 Deno 和 Prisma
构建您的下一个应用将更高效和有趣，因为这两项技术提供了具有数据建模、类型安全性和强大
IDE 支持的直观开发者体验。

如果您有兴趣将 Prisma 连接到 Deno Deploy，
[请查看这个出色的指南](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-deno-deploy)。
