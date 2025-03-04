---
title: "使用 Deno 构建 Qwik"
url: /examples/qwik_tutorial/
---

[Qwik](https://qwik.dev/) 是一个 JavaScript
框架，通过利用可恢复性而非水合作用，提供即时加载的 Web
应用程序。在本教程中，我们将构建一个简单的 Qwik 应用程序并使用 Deno
运行它。该应用程序将显示一个恐龙列表。当你点击其中一个时，它将带你到一个包含更多详细信息的恐龙页面。

我们将介绍如何使用 Deno 构建一个简单的 Qwik 应用程序：

- [搭建 Qwik 应用程序](#scaffold-a-qwik-app)
- [设置数据和类型定义](#setup-data-and-type-definitions)
- [构建前端](#build-the-frontend)
- [下一步](#next-steps)

你可以直接跳转到
[源代码](https://github.com/denoland/examples/tree/main/with-qwik)
或继续阅读以下内容！

## 搭建 Qwik 应用程序

我们可以使用 deno 创建一个新的 Qwik 项目，如下所示：

```bash
deno init --npm qwik@latest
```

这将引导你完成 Qwik 和 Qwik City
的设置过程。在这里，我们选择了最简单的“空应用程序”部署，并使用 npm 依赖项。

完成后，你将拥有一个如下所示的项目结构：

```
.
├── node_modules/
├── public/
└── src/
    ├── components/
    │   └── router-head/
    │       └── router-head.tsx
    └── routes/
        ├── index.tsx
        ├── layout.tsx
        ├── service-worker.ts
        ├── entry.dev.tsx
        ├── entry.preview.tsx
        ├── entry.ssr.tsx
        ├── global.css
        └── root.tsx
├── .eslintignore
├── .eslintrc.cjs
├── .gitignore
├── .prettierignore
├── package-lock.json
├── package.json
├── qwik.env.d.ts
├── README.md
├── tsconfig.json
└── vite.config.ts
```

其中大部分是样板配置，我们不会修改。以下是 Qwik 工作原理中一些重要的文件：

- `src/components/router-head/router-head.tsx`：管理 Qwik 应用程序中不同路由的
  HTML head 元素（如标题、meta 标签等）。
- `src/routes/index.tsx`：应用程序的主入口和主页，用户访问根 URL 时看到的页面。
- `src/routes/layout.tsx`：定义包裹页面的通用布局结构，允许你保持一致的 UI
  元素，如页眉和页脚。
- `src/routes/service-worker.ts`：处理渐进式 Web
  应用程序（PWA）功能、离线缓存和应用程序的后台任务。
- `src/routes/entry.ssr.tsx`：控制应用程序的服务器端渲染，管理初始 HTML
  生成和水合过程。
- `src/routes/root.tsx`：作为应用程序外壳的根组件，包含全局提供者和主要路由结构。

现在，我们可以在应用程序中构建自己的路由和文件。

## 设置数据和类型定义

我们首先将
[恐龙数据](https://github.com/denoland/examples/blob/main/with-qwik/src/data/dinosaurs.json)
添加到新的 `./src/data` 目录中，文件名为 `dinosaurs.json`：

```jsonc
// ./src/data/dinosaurs.json

{
  "dinosaurs": [
    {
      "name": "Tyrannosaurus Rex",
      "description": "一种具有强大下颚和小手臂的大型食肉恐龙。"
    },
    {
      "name": "Brachiosaurus",
      "description": "一种脖子非常长的巨型食草恐龙。"
    },
    {
      "name": "Velociraptor",
      "description": "一种体型小但凶猛，成群捕猎的掠食者。"
    }
    // ...
  ]
}
```

我们的数据将从此处提取。在完整的应用程序中，这些数据将来自数据库。

> ⚠️️ 在本教程中，我们硬编码了数据。但你可以连接到
> [各种数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
> 并使用
> [像 Prisma 这样的 ORM](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
> 与 Deno 一起使用。

接下来，让我们为恐龙数据添加类型定义。我们将它放在 `./src/` 中的 `types.ts`
文件中：

```tsx
// ./src/types.ts

export type Dino = {
  name: string;
  description: string;
};
```

接下来，让我们添加 API 路由来提供这些数据。

## 添加 API 路由

首先，让我们创建加载所有恐龙数据的路由，用于索引页面。此 API 端点使用 Qwik City
的 [`RequestHandler`](https://qwik.dev/docs/advanced/request-handling/) 创建一个
`GET` 端点，加载并返回我们的恐龙数据，使用 json
助手进行正确的响应格式化。我们将以下内容添加到
`./src/routes/api/dinosaurs/index.ts` 的新文件中：

```tsx
// ./src/routes/api/dinosaurs/index.ts

import { RequestHandler } from "@builder.io/qwik-city";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const onGet: RequestHandler = async ({ json }) => {
  const dinosaurs = data;
  json(200, dinosaurs);
};
```

接下来，让我们创建获取单个恐龙信息的 API 路由。它从 URL
中获取参数并使用它来搜索我们的恐龙数据。我们将以下代码添加到
`./src/routes/api/dinosaurs/[name]/index.ts`：

```tsx
// ./src/routes/api/dinosaurs/[name]/index.ts

import { RequestHandler } from "@builder.io/qwik-city";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const onGet: RequestHandler = async ({ params, json }) => {
  const { name } = params;
  const dinosaurs = data;

  if (!name) {
    json(400, { error: "未提供恐龙名称。" });
    return;
  }

  const dinosaur = dinosaurs.find(
    (dino) => dino.name.toLowerCase() === name.toLowerCase(),
  );

  if (!dinosaur) {
    json(404, { error: "未找到恐龙。" });
    return;
  }

  json(200, dinosaur);
};
```

现在 API
路由已连接并正在提供数据，让我们创建两个前端页面：索引页面和单个恐龙详细信息页面。

## 构建前端

我们将通过更新 `./src/routes/index.tsx` 文件来创建主页，使用 Qwik 的
[`routeLoader$`](https://qwik.dev/docs/route-loader/) 进行服务器端数据获取。此
`component$` 通过 `useDinosaurs()` 在 SSR 期间加载并渲染恐龙数据：

```tsx
// ./src/routes/index.tsx

import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Dino } from "~/types";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const useDinosaurs = routeLoader$(() => {
  return data;
});

export default component$(() => {
  const dinosaursSignal = useDinosaurs();

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">欢迎来到恐龙应用程序</h1>
      <p class="mb-4">点击下面的恐龙以了解更多信息。</p>
      <ul class="space-y-2">
        {dinosaursSignal.value.dinosaurs.map((dinosaur: Dino) => (
          <li key={dinosaur.name}>
            <Link
              href={`/${dinosaur.name.toLowerCase()}`}
              class="text-blue-600 hover:underline"
            >
              {dinosaur.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});
```

现在我们有了主索引页面，让我们为单个恐龙信息添加一个页面。我们将使用 Qwik 的
[动态路由](https://qwik.dev/docs/routing/)，以 `[name]`
作为每个恐龙的键。此页面利用 `routeLoader$` 根据 URL
参数获取单个恐龙的详细信息，如果未找到恐龙，则内置错误处理。

该组件使用与索引页面相同的 SSR
模式，但基于参数的数据加载和更简单的显示布局，用于单个恐龙的详细信息：

```tsx
// ./src/routes/[name]/index.tsx

import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Dino } from "~/types";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const useDinosaurDetails = routeLoader$(({ params }): Dino => {
  const { dinosaurs } = data;
  const dinosaur = dinosaurs.find(
    (dino: Dino) => dino.name.toLowerCase() === params.name.toLowerCase(),
  );

  if (!dinosaur) {
    throw new Error("未找到恐龙");
  }

  return dinosaur;
});

export default component$(() => {
  const dinosaurSignal = useDinosaurDetails();

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">{dinosaurSignal.value.name}</h1>
      <p class="mb-4">{dinosaurSignal.value.description}</p>
      <Link href="/" class="text-blue-600 hover:underline">
        返回所有恐龙
      </Link>
    </div>
  );
});
```

现在我们已经构建了路由和前端组件，我们可以运行我们的应用程序：

```bash
deno task dev
```

这将启动应用程序，地址为 `localhost:5173`：

<figure>

<video class="w-full" alt="使用 Deno 构建 Qwik 应用程序。" autoplay muted loop playsinline src="./images/how-to/qwik/demo.mp4"></video>

</figure>

搞定！

## 下一步

🦕 现在你可以使用 Deno 构建并运行 Qwik
应用程序了！以下是一些可以增强你的恐龙应用程序的方法：

Qwik 应用程序的下一步可能是使用 Qwik
的懒加载功能来加载恐龙图像和其他组件，或为复杂功能添加客户端状态管理。

- 添加持久数据存储
  [使用像 Postgres 或 MongoDB 这样的数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
  和像 [Drizzle](https://docs.denohub.com/examples/drizzle_tutorial/) 或
  [Prisma](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
  这样的 ORM
- 使用 Qwik 的懒加载功能加载恐龙图像和组件
- 添加客户端状态管理
- 将你的应用程序自托管到
  [AWS](https://docs.denohub.com/runtime/tutorials/aws_lightsail/)、[Digital Ocean](https://docs.denohub.com/runtime/tutorials/digital_ocean/)
  和
  [Google Cloud Run](https://docs.denohub.com/runtime/tutorials/google_cloud_run/)
