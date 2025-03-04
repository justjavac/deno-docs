---
title: "使用 create-vite 构建 React 应用"
url: /examples/create_react_tutorial/
oldUrl:
- /runtime/tutorials/how_to_with_npm/create-react/
---

[React](https://reactjs.org) 是最广泛使用的 JavaScript 前端库。

在本教程中，我们将使用 Deno 构建一个简单的 React
应用。该应用将显示一个恐龙列表。当你点击其中一个时，它将带你到一个包含更多详细信息的恐龙页面。你可以在
[GitHub 上查看完成的应用仓库](https://github.com/denoland/tutorial-with-react)

![应用演示](./images/how-to/react/react-dinosaur-app-demo.gif)

## 使用 Vite 和 Deno 创建 React 应用

本教程将使用 [create-vite](https://vitejs.dev/) 快速搭建一个 Deno 和 React
应用。Vite 是一个现代 Web 项目的构建工具和开发服务器。它与 React 和 Deno
配合良好，利用 ES 模块并允许你直接导入 React 组件。

在终端中运行以下命令，使用 TypeScript 模板创建一个新的 React 应用：

```sh
deno run -A npm:create-vite@latest --template react-ts
```

当提示时，为你的应用命名，并 `cd`
进入新创建的项目目录。然后运行以下命令安装依赖项：

```sh
deno install
```

现在你可以通过运行以下命令来启动你的新 React 应用：

```sh
deno task dev
```

这将启动 Vite 服务器，点击输出的 localhost
链接以在浏览器中查看你的应用。如果你安装了
[VSCode 的 Deno 扩展](/runtime/getting_started/setup_your_environment/#visual-studio-code)，你可能会注意到编辑器在代码中突出显示了一些错误。这是因为
Vite 创建的应用是为 Node 设计的，因此使用了一些 Deno
不支持的约定（例如“松散导入”——导入模块时不带文件扩展名）。禁用此项目的 Deno
扩展以避免这些错误，或者尝试
[使用 deno.json 文件构建 React 应用的教程](/runtime/tutorials/how_to_with_npm/react/)。

## 添加后端

下一步是添加一个后端 API。我们将创建一个非常简单的 API，返回有关恐龙的信息。

在你的新项目的根目录中，创建一个 `api` 文件夹。在该文件夹中，创建一个 `main.ts`
文件，它将运行服务器，以及一个 `data.json` 文件，它将包含硬编码的恐龙数据。

将
[这个 json 文件](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json)
复制并粘贴到 `api/data.json` 文件中。

我们将构建一个简单的 API 服务器，其中包含返回恐龙信息的路由。我们将使用
[`oak` 中间件框架](https://jsr.io/@oak/oak) 和
[`cors` 中间件](https://jsr.io/@tajpouria/cors) 来启用
[CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)。

使用 `deno add` 命令将所需的依赖项添加到你的项目中：

```shell
deno add jsr:@oak/oak jsr:@tajpouria/cors
```

接下来，更新 `api/main.ts` 以导入所需的模块并创建一个新的 `Router`
实例来定义一些路由：

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };

const router = new Router();
```

之后，在同一个文件中，我们将定义两个路由。一个在 `/api/dinosaurs`
返回所有恐龙，另一个在 `/api/dinosaurs/:dinosaur` 根据 URL
中的名称返回特定的恐龙：

```ts title="main.ts"
router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "No dinosaur name provided.";
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
  );

  context.response.body = dinosaur ?? "No dinosaur found.";
});
```

最后，在同一个文件的底部，创建一个新的 `Application` 实例，并使用
`app.use(router.routes())`
将我们刚刚定义的路由附加到应用程序，并启动服务器监听端口 8000：

```ts title="main.ts"
const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

你可以使用 `deno run --allow-env --allow-net api/main.ts` 运行 API
服务器。我们将创建一个任务在后台运行此命令，并更新 dev 任务以同时运行 React
应用和 API 服务器。

在你的 `package.json` 文件中，更新 `scripts` 字段以包含以下内容：

```jsonc
{
  "scripts": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    // ...
}
```

如果你现在运行 `deno task dev` 并访问
`localhost:8000/api/dinosaurs`，你应该在浏览器中看到所有恐龙的 JSON 响应。

## 更新入口点

React 应用的入口点在 `src/main.tsx` 文件中。我们的将非常简单：

```tsx title="main.tsx"
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
```

## 添加路由

该应用将有两个路由：`/` 和 `/:dinosaur`。

我们将使用 [`react-router-dom`](https://reactrouter.com/en/main)
构建一些路由逻辑，因此我们需要将 `react-router-dom`
依赖项添加到你的项目中。在项目根目录运行：

```shell
deno add npm:react-router-dom
```

更新 `/src/App.tsx` 文件以导入并使用 `react-router-dom` 中的
[`BrowserRouter`](https://reactrouter.com/en/main/router-components/browser-router)
组件，并定义两个路由：

```tsx title="App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index";
import Dinosaur from "./pages/Dinosaur";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:selectedDinosaur" element={<Dinosaur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 代理以转发 API 请求

Vite 将在端口 `5173` 上为应用提供服务，而我们的 API 在端口 `8000`
上运行。因此，我们需要设置一个代理，以允许 `api/` 路径能够被路由器访问。覆盖
`vite.config.ts` 以配置代理：

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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

## 创建页面

我们将创建两个页面：`Index` 和 `Dinosaur`。`Index`
页面将列出所有恐龙，`Dinosaur` 页面将显示特定恐龙的详细信息。

在 `src` 目录中创建一个 `pages` 文件夹，并在其中创建两个文件：`index.tsx` 和
`Dinosaur.tsx`。

### 类型

两个页面都将使用 `Dino` 类型来描述它们从 API 中期望的数据结构，因此让我们在
`src` 目录中创建一个 `types.ts` 文件：

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### index.tsx

该页面将从 API 获取恐龙列表并将其渲染为链接：

```tsx title="index.tsx"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/dinosaurs/`);
      const allDinosaurs = await response.json() as Dino[];
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main>
      <h1>Welcome to the Dinosaur app</h1>
      <p>Click on a dinosaur below to learn more.</p>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <Link
            to={`/${dinosaur.name.toLowerCase()}`}
            key={dinosaur.name}
            className="dinosaur"
          >
            {dinosaur.name}
          </Link>
        );
      })}
    </main>
  );
}
```

### Dinosaur.tsx

该页面将从 API 获取特定恐龙的详细信息并将其渲染在段落中：

```tsx title="Dinosaur.tsx"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Dino } from "../types";

export default function Dinosaur() {
  const { selectedDinosaur } = useParams();
  const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/dinosaurs/${selectedDinosaur}`);
      const dino = await resp.json() as Dino;
      setDino(dino);
    })();
  }, [selectedDinosaur]);

  return (
    <div>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
      <Link to="/">🠠 Back to all dinosaurs</Link>
    </div>
  );
}
```

### 格式化恐龙列表

由于我们在主页上显示恐龙列表，让我们做一些基本的格式化。将以下内容添加到
`src/App.css` 的底部，以有序地显示我们的恐龙列表：

```css title="src/App.css"
.dinosaur {
  display: block;
}
```

## 运行应用

要运行应用，请使用你之前设置的任务：

```sh
deno task dev
```

在浏览器中导航到本地 Vite
服务器（`localhost:5173`），你应该会看到显示的恐龙列表，你可以点击查看每个恐龙的详细信息。

![应用演示](./images/how-to/react/react-dinosaur-app-demo.gif)

## 构建和部署

此时，应用由 Vite 开发服务器提供服务。要在生产环境中提供服务，你可以使用 Vite
构建应用，然后使用 Deno 提供构建的文件。为此，我们需要更新 API
服务器以提供构建的文件。我们将编写一些中间件来实现这一点。在你的 `api`
目录中创建一个新文件夹 `util` 和一个名为 `routeStaticFilesFrom.ts`
的新文件，并添加以下代码：

```ts title="routeStaticFilesFrom.ts"
import { Next } from "jsr:@oak/oak/middleware";
import { Context } from "jsr:@oak/oak/context";

// 配置静态站点路由，以便我们可以提供 Vite 构建输出和公共文件夹
export default function routeStaticFilesFrom(staticPaths: string[]) {
  return async (context: Context<Record<string, object>>, next: Next) => {
    for (const path of staticPaths) {
      try {
        await context.send({ root: path, index: "index.html" });
        return;
      } catch {
        continue;
      }
    }

    await next();
  };
}
```

此中间件将尝试从 `staticPaths`
数组中提供的路径提供静态文件。如果未找到文件，它将调用链中的下一个中间件。我们现在可以更新
`api/main.ts` 文件以使用此中间件：

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";

const router = new Router();

router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "No dinosaur name provided.";
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
  );

  context.response.body = dinosaur ? dinosaur : "No dinosaur found.";
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

await app.listen({ port: 8000 });
```

在你的 `package.json` 文件中添加一个 `serve` 脚本，以使用 Vite
构建应用，然后运行 API 服务器：

```jsonc
{
  "scripts": {
    // ...
    "serve": "deno task build && deno task dev:api",
}
```

现在你可以通过运行以下命令来提供构建的应用：

```sh
deno task serve
```

如果你在浏览器中访问 `localhost:8000`，你应该会看到应用正在运行！

🦕 现在你可以使用 Vite 和 Deno 搭建和开发 React 应用了！你已准备好构建极速的 Web
应用程序。我们希望你喜欢探索这些尖端工具，我们迫不及待地想看到你构建的作品！
