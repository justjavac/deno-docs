# 如何在 Deno 中使用 React

[React](https://reactjs.org) 是最广泛使用的 JavaScript
前端框架。它提倡了一种声明性的方法来设计用户界面，具有响应式数据模型。由于其流行，当涉及使用
Deno 构建 Web 应用程序时，它是最受请求的框架，这一点也不奇怪。

这是一个教程，指导您在不到五分钟内使用 Deno 构建一个简单的 React
应用程序。该应用程序将显示一个恐龙列表。当您单击其中一个时，它将带您进入一个包含更多详细信息的恐龙页面。

![应用程序演示](../../images/how-to/react/react-dinosaur-app-demo.gif)

[查看源代码](https://github.com/denoland/examples/tree/main/with-react) 或
[按照视频指南](https://www.youtube.com/watch?v=eStwt_2THd8)。

## 创建 Vite 扩展

本教程将使用 [Vite](https://vitejs.dev/) 来快速构建一个 Deno 和 React
应用程序。让我们运行：

```shell, ignore
deno run --allow-env --allow-read --allow-write npm:create-vite-extra
```

我们将命名我们的项目为 "dinosaur-react-app"。然后，`cd` 到新创建的项目文件夹。

## 添加后端

下一步是添加后端 API。我们将创建一个非常简单的 API，用于返回有关恐龙的信息。

在目录中，让我们创建一个 "api" 文件夹。在该文件夹中，我们将创建一个 "main.ts"
文件，用于运行服务器，以及一个 "data.json" 文件，其中包含硬编码的数据。

```shell, ignore
mkdir api && touch api/data.json && touch api/main.ts
```

复制并粘贴
[此 JSON 文件](https://github.com/denoland/deno-vue-example/blob/main/api/data.json)
到您的 "api/data.json" 中。

然后，让我们更新 "api/main.ts"：

```ts, ignore
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import data from "./data.json" assert { type: "json" };

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "欢迎来到恐龙 API！";
  })
  .get("/api", (context) => {
    context.response.body = data;
  })
  .get("/api/:dinosaur", (context) => {
    if (context?.params?.dinosaur) {
      const found = data.find((item) =>
        item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
      );
      if (found) {
        context.response.body = found;
      } else {
        context.response.body = "未找到恐龙。";
      }
    }
  });

const app = new Application();
app.use(oakCors()); // 为所有路由启用 CORS
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

这是一个使用 [`oak`](https://deno.land/x/oak) 的非常简单的 API
服务器，根据路由返回恐龙信息。让我们启动 API 服务器：

```shell, ignore
deno run --allow-env --allow-net api/main.ts
```

如果我们访问 `localhost:8000/api`，将会看到：

![恐龙的 JSON 响应](../../images/how-to/react/dinosaur-api.png)

到目前为止，一切看起来都不错。

## 添加路由器

我们的应用程序将有两个路由：`/` 和 `/:dinosaur`。

我们将使用 [`react-router-dom`](https://reactrouter.com/en/main)
来处理我们的路由逻辑。让我们在 `vite.config.mjs` 中将其添加到我们的依赖项中：

```mjs, ignore
import { defineConfig } from "npm:vite@^3.1.3";
import react from "npm:@vitejs/plugin-react@^2.1";

import "npm:react@^18.2";
import "npm:react-dom@^18.2/client";
import "npm:react-router-dom@^6.4"; // 添加此行

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

一旦我们在那里添加了依赖项，我们可以在我们的 React 应用程序中无需 `npm:`
标识符导入它们。

接下来，让我们转到 `src/App.jsx` 并添加我们的路由逻辑：

```jsx, ignore
import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Index from "./pages/Index.jsx";
import Dinosaur from "./pages/Dinosaur.jsx";

export default function App(props) {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/:dinosaur" element={<Dinosaur />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
```

接下来，让我们添加 `<Index>` 和 `<Dinosaur>` 页面。

## 添加页面

这个应用程序将有两个页面：

- `src/pages/Index.jsx`：我们的索引页面，列出了所有的恐龙
- `src/pages/Dinosaur.jsx`：我们的恐龙页面，显示了恐龙的详细信息

我们将创建一个 `src/pages` 文件夹并创建 `.jsx` 文件：

```shell, ignore
mkdir src/pages && touch src/pages/Index.jsx src/pages/Dinosaur.jsx
```

让我们从 `<Index>` 开始。这个页面将在 `localhost:8000/api` 上进行
`fetch`，并通过 JSX 渲染它。

```jsx, ignore
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Index = () => {
  const [dinos, setDinos] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8000/api/`)
      .then(async (res) => await res.json())
      .then((json) => setDinos(json));
  }, []);

  return (
    <div>
      <h1>欢迎来到恐龙应用</h1>
      <p>
        单击下面的恐龙以了解更多信息。
      </p>
      <div>
        {dinos.map((dino) => {
          return (
            <div>
              <Link to={`/${dino.name.toLowerCase()}`}>{dino.name}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
```

接下来，在 `<Dinosaur>` 中，我们将做同样的事情，只不过是在
`localhost:8000/api/${dinosaur}` 上：

```jsx, ignore
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Dinosaur = () => {
  const { dinosaur } = useParams();
  const [dino, setDino] = useState({});
  useEffect(() => {
    fetch(`http://localhost:8000/api/${dinosaur}`)
      .then(async (res) => await res.json())
      .then((json) => setDino(json));
  }, []);

  return (
    <div>
      <h1>{dino.name}</h1>
      <p>
        {dino.description}
      </p>
      <Link to="/">查看全部</Link>
    </div>
  );
};

export default Dinosaur;
```

让我们启动 React 应用程序：

```
deno task start
```

然后浏览应用程序：

![应用程序演示](../../images/how-to/react/react-dinosaur-app-demo.gif)

太棒了！
