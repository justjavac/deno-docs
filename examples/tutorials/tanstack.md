---
title: "使用 Tanstack 和 Deno 构建应用"
url: /examples/tanstack_tutorial/
---

[Tanstack](https://tanstack.com/) 是一套与框架无关的数据管理工具。借助
Tanstack，开发者可以使用 [Query](https://tanstack.com/query/latest)
高效管理服务器状态，使用 [Table](https://tanstack.com/table/latest)
创建强大的表格，使用 [Router](https://tanstack.com/router/latest)
处理复杂路由，并使用 [Form](https://tanstack.com/form/latest)
构建类型安全的表单。这些工具在
[React](/examples/react_tutorial)、[Vue](/examples/vue_tutorial)、[Solid](/examples/solidjs_tutorial)
和其他框架中无缝协作，同时保持出色的 TypeScript 支持。

在本教程中，我们将使用 [Tanstack Query](https://tanstack.com/query/latest) 和
[Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/quick-start)
构建一个简单的应用。该应用将显示一个恐龙列表。当你点击其中一个时，它将带你到一个包含更多详细信息的恐龙页面。

- [从后端 API 开始](#start-with-the-backend-api)
- [创建 Tanstack 驱动的前端](#create-tanstack-driven-frontend)
- [下一步](#next-steps)

你可以直接跳转到
[源代码](https://github.com/denoland/examples/tree/main/with-tanstack)
或继续阅读以下内容！

## 从后端 API 开始

在我们的主目录中，让我们设置一个 `api/` 目录并创建我们的恐龙数据文件
`api/data.json`：

```jsonc
// api/data.json

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
  ...
]
```

这是我们将从中提取数据的地方。在完整的应用程序中，这些数据将来自数据库。

> ⚠️️ 在本教程中，我们硬编码了数据。但你可以连接到
> [多种数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
> 并
> [甚至使用像 Prisma 这样的 ORM](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
> 与 Deno 一起使用。

其次，让我们创建我们的 [Hono](https://hono.dev/) 服务器。我们首先通过 `deno add`
从 [JSR](https://jsr.io) 安装 Hono：

```shell
deno add jsr:@hono/hono
```

接下来，让我们创建一个 `api/main.ts` 文件并填充以下内容。请注意，我们需要导入
[`@hono/hono/cors`](https://hono.dev/docs/middleware/builtin/cors)
并定义关键属性以允许前端访问 API 路由。

```ts
// api/main.ts

import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import data from "./data.json" with { type: "json" };

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  }),
);

app.get("/", (c) => {
  return c.text("Welcome to the dinosaur API!");
});

app.get("/api/dinosaurs", (c) => {
  return c.json(data);
});

app.get("/api/dinosaurs/:dinosaur", (c) => {
  if (!c.req.param("dinosaur")) {
    return c.text("No dinosaur name provided.");
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === c.req.param("dinosaur").toLowerCase()
  );

  if (dinosaur) {
    return c.json(dinosaur);
  } else {
    return c.notFound();
  }
});

Deno.serve(app.fetch);
```

Hono 服务器提供了两个 API 端点：

- `GET /api/dinosaurs` 用于获取所有恐龙，以及
- `GET /api/dinosaurs/:dinosaur` 用于按名称获取特定恐龙

在我们开始处理前端之前，让我们更新 `deno.json` 文件中的
`deno tasks`。你的文件应该如下所示：

```jsonc
{
  "tasks": {
    "dev": "deno --allow-env --allow-net api/main.ts"
  }
  // ...
}
```

现在，当我们运行 `deno task dev` 时，后端服务器将在 `localhost:8000` 上启动。

## 创建 Tanstack 驱动的前端

让我们创建将使用这些数据的前端。首先，我们将使用 Vite
在当前目录中快速搭建一个新的 React 应用，使用 TypeScript 模板：

```shell
deno init --npm vite@latest --template react-ts ./
```

然后，我们将安装 Tanstack 特定的依赖项：

```shell
deno install npm:@tanstack/react-query npm:@tanstack/react-router
```

让我们更新 `deno.json` 中的 `deno tasks`，添加一个启动 Vite 服务器的命令：

```jsonc
// deno.json
{
  "tasks": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno --allow-env --allow-net api/main.ts",
    "dev:vite": "deno -A npm:vite"
  }
  // ...
}
```

我们可以继续构建我们的组件。我们的应用需要两个主要页面：

- `DinosaurList.tsx`：索引页面，将列出所有恐龙，以及
- `Dinosaur.tsx`：叶子页面，显示单个恐龙的信息

让我们创建一个新的 `./src/components` 目录，并在其中创建文件
`DinosaurList.tsx`：

```ts
// ./src/components/DinosaurList.tsx

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

async function fetchDinosaurs() {
  const response = await fetch("http://localhost:8000/api/dinosaurs/");
  if (!response.ok) {
    throw new Error("Failed to fetch dinosaurs");
  }
  return response.json();
}

export function DinosaurList() {
  const {
    data: dinosaurs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dinosaurs"],
    queryFn: fetchDinosaurs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dinosaur List</h2>
      <ul className="space-y-2">
        {dinosaurs?.map((dino: { name: string; description: string }) => (
          <li key={dino.name}>
            <Link
              to="/dinosaur/$name"
              params={{ name: dino.name }}
              className="text-blue-500 hover:underline"
            >
              {dino.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

这使用了 **Tanstack Query** 的
[`useQuery`](https://tanstack.com/query/v4/docs/framework/react/guides/queries)
来自动获取和缓存恐龙数据，并内置了加载和错误状态。然后它使用了 **Tanstack
Router** 的
[`Link`](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent)
来创建带有类型安全路由参数的客户端导航链接。

接下来，让我们在 `./src/components/` 文件夹中创建 `DinosaurDetail.tsx`
组件，它将显示单个恐龙的详细信息：

```ts
// ./src/components/DinosaurDetail.tsx

import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

async function fetchDinosaurDetail(name: string) {
  const response = await fetch(`http://localhost:8000/api/dinosaurs/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch dinosaur detail");
  }
  return response.json();
}

export function DinosaurDetail() {
  const { name } = useParams({ from: "/dinosaur/$name" });
  const {
    data: dinosaur,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dinosaur", name],
    queryFn: () => fetchDinosaurDetail(name),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{name}</h2>
      <p>{dinosaur?.description}</p>
    </div>
  );
}
```

同样，这使用了 **Tanstack Query** 的 `useQuery`
来获取和缓存单个恐龙的详细信息，并使用
[`queryKey`](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
包括恐龙名称以确保正确的缓存。此外，我们使用了 **Tanstack Router** 的
[`useParams`](https://tanstack.com/router/v1/docs/framework/react/api/router/useParamsHook)
来安全地提取和类型化我们在路由配置中定义的 URL 参数。

在我们运行之前，我们需要将这些组件封装到一个布局中。让我们在 `./src/components/`
文件夹中创建另一个文件 `Layout.tsx`：

```ts
// ./src/components/Layout.tsx

export function Layout() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dinosaur Encyclopedia</h1>
      <nav className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

你可能会注意到我们新创建的布局底部有一个
[`Outlet`](https://tanstack.com/router/v1/docs/framework/react/guide/outlets)
组件。这个组件来自 **Tanstack
Router**，用于渲染子路由的内容，允许嵌套路由同时保持一致的布局结构。

接下来，我们需要将这个布局与 `./src/main.tsx`
连接起来，这是一个重要的文件，用于设置 Tanstack Query
客户端以管理服务器状态，并设置 Tanstack Router 以处理导航：

```ts
// ./src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

你会注意到我们导入了
[`QueryClientProvider`](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider)，它包裹了整个应用程序以允许查询缓存和状态管理。我们还导入了
`RouterProvider`，它将我们定义的路由连接到 React 的渲染系统。

最后，我们需要在 `./src/` 目录中定义一个
[`routeTree.tsx`](https://tanstack.com/router/v1/docs/framework/react/guide/route-trees)
文件。该文件使用 Tanstack Router
的类型安全路由定义来定义我们应用程序的路由结构：

```ts
// ./src/routeTree.tsx

import { RootRoute, Route } from "@tanstack/react-router";
import { DinosaurList } from "./components/DinosaurList";
import { DinosaurDetail } from "./components/DinosaurDetail";
import { Layout } from "./components/Layout";

const rootRoute = new RootRoute({
  component: Layout,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DinosaurList,
});

const dinosaurRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dinosaur/$name",
  component: DinosaurDetail,
});

export const routeTree = rootRoute.addChildren([indexRoute, dinosaurRoute]);
```

在 `./src/routeTree.tsx` 中，我们创建了一个以 `Layout`
为根组件的路由层次结构。然后我们设置了两个子路由，它们的路径和组件——一个用于恐龙列表
`DinosaurList`，另一个用于带有动态参数的单个恐龙详细信息 `DinosaurDetail`。

完成所有这些后，我们可以运行这个项目：

```shell
deno task dev
```

<figure>

<video class="w-full" alt="Build an app with Deno and Tanstack." autoplay muted loop playsinline src="./images/how-to/tanstack/demo.mp4"></video>

</figure>

## 下一步

这只是使用 Deno 和 Tanstack 构建的开始。你可以添加持久数据存储，例如
[使用像 Postgres 或 MongoDB 这样的数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
和像 [Drizzle](https://deno.com/blog/build-database-app-drizzle) 或
[Prisma](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
这样的 ORM。或者将你的应用部署到
[AWS](https://docs.denohub.com/runtime/tutorials/aws_lightsail/)、[Digital Ocean](https://docs.denohub.com/runtime/tutorials/digital_ocean/)
或
[Google Cloud Run](https://docs.denohub.com/runtime/tutorials/google_cloud_run/)。

你还可以使用
[Tanstack Query 的重新获取功能](https://tanstack.com/query/latest/docs/framework/react/examples/auto-refetching)
添加实时更新，为大型恐龙列表
[实现无限滚动](https://tanstack.com/query/latest/docs/framework/react/examples/load-more-infinite-scroll)，或使用
**[Tanstack Table](https://tanstack.com/table/latest)**
[添加复杂的过滤和排序](https://tanstack.com/table/v8/docs/guide/column-filtering)。Deno
的内置 Web 标准、工具和原生 TypeScript 支持，以及 Tanstack
的强大数据管理，为构建健壮的 Web 应用程序提供了无数可能性。
