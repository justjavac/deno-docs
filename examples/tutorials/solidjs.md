---
title: "使用 Deno 构建 SolidJS 应用"
url: /examples/solidjs_tutorial/
---

[SolidJS](https://www.solidjs.com/) 是一个声明式的 JavaScript
库，用于创建用户界面，强调细粒度的响应性和最小的开销。当与 Deno
的现代运行时环境结合时，你将获得一个强大且高性能的堆栈，用于构建 Web
应用程序。在本教程中，我们将构建一个简单的恐龙目录应用，展示这两种技术的关键特性。

我们将介绍如何使用 Deno 构建一个简单的 SolidJS 应用：

- [使用 Vite 搭建 SolidJS 应用](#scaffold-a-solidjs-app-with-vite)
- [设置 Hono 后端](#set-up-our-hono-backend)
- [创建 SolidJS 前端](#create-our-solidjs-frontend)
- [下一步](#next-steps)

你可以直接跳转到
[源代码](https://github.com/denoland/examples/tree/main/with-solidjs)
或继续阅读以下内容！

## 使用 Vite 搭建 SolidJS 应用

让我们使用 [Vite](https://vite.dev/) 设置我们的 SolidJS 应用，Vite
是一个现代构建工具，提供了出色的开发体验，支持热模块替换和优化构建等功能。

```bash
deno init --npm vite@latest solid-deno --template solid-ts
```

我们的后端将由 [Hono](https://hono.dev/) 提供支持，我们可以通过
[JSR](https://jsr.io) 安装它。我们还将添加 `solidjs/router`
用于客户端路由和在恐龙目录页面之间的导航。

<figure>

```bash
deno add jsr:@hono/hono npm:@solidjs/router
```

<figcaption>
<a href="https://docs.denohub.com/runtime/reference/cli/add/">
了解更多关于 <code>deno add</code> 和使用 Deno 作为包管理器的信息。
</a>
</figcaption>
</figure>

我们还需要更新 `deno.json` 以包含一些任务和 `compilerOptions` 来运行我们的应用：

<figure>

```json
{
  "tasks": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net --allow-read api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    "build": "deno run -A npm:vite build",
    "serve": {
      "command": "deno task dev:api",
      "description": "Run the build, and then start the API server",
      "dependencies": ["deno task build"]
    }
  },
  "imports": {
    "@hono/hono": "jsr:@hono/hono@^4.6.12",
    "@solidjs/router": "npm:@solidjs/router@^0.14.10"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "solid-js",
    "lib": ["DOM", "DOM.Iterable", "ESNext"]
  }
}
```

<figcaption>
<a href="https://docs.denohub.com/runtime/reference/cli/task/">你可以将 <code>tasks</code> 写成对象</a>。这里我们的 <code>serve</code> 命令包含了一个 <code>description</code> 和 <code>dependencies</code>。
</figcaption>
</figure>

很好！接下来，让我们设置我们的 API 后端。

## 设置我们的 Hono 后端

在我们的主目录中，我们将设置一个 `api/`
目录并创建两个文件。首先，我们的恐龙数据文件
[`api/data.json`](https://github.com/denoland/examples/blob/main/with-solidjs/api/data.json)：

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

这是我们将从中提取数据的地方。在一个完整的应用程序中，这些数据将来自数据库。

> ⚠️️ 在本教程中，我们硬编码了数据。但你可以连接到
> [各种数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
> 并且
> [甚至可以使用像 Prisma 这样的 ORM](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
> 与 Deno 一起使用。

其次，我们需要我们的 Hono 服务器 `api/main.ts`：

```tsx
// api/main.ts

import { Hono } from "@hono/hono";
import data from "./data.json" with { type: "json" };

const app = new Hono();

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

  console.log(dinosaur);

  if (dinosaur) {
    return c.json(dinosaur);
  } else {
    return c.notFound();
  }
});

Deno.serve(app.fetch);
```

这个 Hono 服务器提供了两个 API 端点：

- `GET /api/dinosaurs` 用于获取所有恐龙，以及
- `GET /api/dinosaurs/:dinosaur` 用于按名称获取特定恐龙

当我们运行 `deno task dev` 时，这个服务器将在 `localhost:8000` 上启动。

最后，在我们开始构建前端之前，让我们更新 `vite.config.ts` 文件，特别是
`server.proxy`，它告诉我们的 SolidJS 前端在哪里找到 API 端点。

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

## 创建我们的 SolidJS 前端

在我们开始构建前端组件之前，让我们快速定义 `src/types.ts` 中的 `Dino` 类型：

```tsx
// src/types.ts
export type Dino = {
  name: string;
  description: string;
};
```

`Dino`
类型接口确保了整个应用程序中的类型安全，定义了我们的恐龙数据的形状，并启用了
TypeScript 的静态类型检查。

接下来，让我们设置我们的前端以接收该数据。我们将有两个页面：

- `Index.tsx`
- `Dinosaur.tsx`

以下是 `src/pages/Index.tsx` 页面的代码：

```tsx
// src/pages/Index.tsx

import { createSignal, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import type { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = createSignal<Dino[]>([]);

  onMount(async () => {
    try {
      const response = await fetch("/api/dinosaurs");
      const allDinosaurs = (await response.json()) as Dino[];
      setDinosaurs(allDinosaurs);
      console.log("Fetched dinosaurs:", allDinosaurs);
    } catch (error) {
      console.error("Failed to fetch dinosaurs:", error);
    }
  });

  return (
    <main>
      <h1>Welcome to the Dinosaur app</h1>
      <p>Click on a dinosaur below to learn more.</p>
      <For each={dinosaurs()}>
        {(dinosaur) => (
          <A href={`/${dinosaur.name.toLowerCase()}`} class="dinosaur">
            {dinosaur.name}
          </A>
        )}
      </For>
    </main>
  );
}
```

在使用 SolidJS 时，有几个与 React 不同的关键点需要注意：

1. 我们使用 SolidJS 特定的原语：
   - `createSignal` 代替 `useState`
   - `createEffect` 代替 `useEffect`
   - `For` 组件代替 `map`
   - `A` 组件代替 `Link`
2. SolidJS 组件使用细粒度的响应性，因此我们将信号作为函数调用，例如 `dinosaur()`
   而不是仅仅 `dinosaur`
3. 路由由 `@solidjs/router` 处理，而不是 `react-router-dom`
4. 组件导入使用 Solid 的
   [`lazy`](https://docs.solidjs.com/reference/component-apis/lazy) 进行代码分割

`Index` 页面使用 SolidJS 的 `createSignal` 来管理恐龙列表，并使用 `onMount`
在组件加载时获取数据。我们使用 `For` 组件，这是 SolidJS
高效渲染列表的方式，而不是使用 JavaScript 的 map 函数。`@solidjs/router` 中的
`A` 组件创建了到单个恐龙页面的客户端导航链接，避免了整个页面的重新加载。

现在，单个恐龙数据页面位于 `src/pages/Dinosaur.tsx`：

```tsx
// src/pages/Dinosaur.tsx

import { createSignal, onMount } from "solid-js";
import { A, useParams } from "@solidjs/router";
import type { Dino } from "../types.ts";

export default function Dinosaur() {
  const params = useParams();
  const [dinosaur, setDinosaur] = createSignal<Dino>({
    name: "",
    description: "",
  });

  onMount(async () => {
    const resp = await fetch(`/api/dinosaurs/${params.selectedDinosaur}`);
    const dino = (await resp.json()) as Dino;
    setDinosaur(dino);
    console.log("Dinosaur", dino);
  });

  return (
    <div>
      <h1>{dinosaur().name}</h1>
      <p>{dinosaur().description}</p>
      <A href="/">Back to all dinosaurs</A>
    </div>
  );
}
```

`Dinosaur` 页面展示了 SolidJS 处理动态路由的方法，使用 `useParams` 访问 URL
参数。它遵循与 `Index` 页面类似的模式，使用 `createSignal` 进行状态管理，使用
`onMount` 进行数据获取，但专注于单个恐龙的详细信息。这个 `Dinosaur`
组件还展示了如何通过将信号值作为函数调用（例如
`dinosaur().name`）来访问模板中的信号值，这是与 React 状态管理的一个关键区别。

最后，为了将所有内容整合在一起，我们将更新 `App.tsx` 文件，该文件将 `Index` 和
`Dinosaur` 页面作为组件提供服务。`App` 组件使用 `@solidjs/router`
设置我们的路由配置，定义了两个主要路由：用于恐龙列表的索引路由和用于单个恐龙页面的动态路由。路由路径中的
`:selectedDinosaur` 参数创建了一个动态段，匹配 URL 中的任何恐龙名称。

```tsx
// src/App.tsx

import { Route, Router } from "@solidjs/router";
import Index from "./pages/Index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/:selectedDinosaur" component={Dinosaur} />
    </Router>
  );
};

export default App;
```

最后，这个 `App` 组件将从我们的主索引中调用：

```tsx
// src/index.tsx

import { render } from "solid-js/web";
import App from "./App.tsx";
import "./index.css";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

render(() => <App />, wrapper);
```

我们应用程序的入口点使用 SolidJS 的 `render` 函数将 App 组件挂载到 DOM
中。它包括一个安全检查，以确保在尝试渲染之前根元素存在，从而在初始化期间提供更好的错误处理。

现在，让我们运行 `deno task dev` 来同时启动前端和后端：

<figure>

<video class="w-full" alt="Build an http server tutorial in Deno Deploy." autoplay muted loop playsinline src="./images/how-to/solidjs/demo.mp4"></video>

</figure>

## 下一步

🦕 现在你可以使用 Deno 构建并运行一个 SolidJS
应用了！以下是一些可以增强你的恐龙应用程序的方法：

- 添加持久化数据存储
  [使用像 Postgres 或 MongoDB 这样的数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
  和像 [Drizzle](https://deno.com/blog/build-database-app-drizzle) 或
  [Prisma](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
  这样的 ORM
- 使用 SolidJS 的
  [`createContext`](https://docs.solidjs.com/reference/component-apis/create-context)
  实现全局状态，以便在组件之间共享数据
- 使用
  [`createResource`](https://docs.solidjs.com/reference/basic-reactivity/create-resource)
  的加载属性添加加载状态
- 使用 [`lazy`](https://docs.solidjs.com/reference/component-apis/lazy)
  导入实现基于路由的代码分割
- 使用 `Index` 组件进行更高效的列表渲染
- 将你的应用部署到
  [AWS](https://docs.denohub.com/runtime/tutorials/aws_lightsail/)、[Digital Ocean](https://docs.denohub.com/runtime/tutorials/digital_ocean/)
  或
  [Google Cloud Run](https://docs.denohub.com/runtime/tutorials/google_cloud_run/)

SolidJS 独特的响应性原语、真正的 DOM 协调以及 Deno 的现代运行时相结合，为 Web
开发提供了一个极其高效的基础。没有虚拟 DOM
的开销，只在需要的地方进行细粒度的更新，你的应用程序可以在保持代码清晰可读的同时实现最佳性能。
