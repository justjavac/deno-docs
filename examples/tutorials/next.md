---
title: "构建一个 Next.js 应用"
url: /examples/next_tutorial/
oldUrl:
  - /runtime/tutorials/how_to_with_npm/next/
---

[Next.js](https://nextjs.org/)
是一个流行的用于构建服务器端渲染应用的框架。它基于 React
构建，并提供了许多开箱即用的功能。

在本教程中，我们将构建一个简单的 Next.js 应用，并使用 Deno
运行它。该应用将显示一个恐龙列表。当你点击其中一个时，它会带你到一个包含更多详细信息的恐龙页面。

![应用演示](./images/how-to/next/dinoapp.gif)

首先，请确保你已安装最新版本的 Deno，至少需要 Deno 1.46.0：

```sh
deno --version
```

## 使用 Deno 创建 Next.js 应用

Next 提供了一个 CLI 工具来快速搭建一个新的 Next.js
应用。在终端中运行以下命令以使用 Deno 创建一个新的 Next.js 应用：

```sh
deno run -A npm:create-next-app@latest
```

当提示时，选择默认选项以创建一个带有 TypeScript 的新 Next.js 应用。

然后，`cd` 进入新创建的项目文件夹，并运行以下命令以安装依赖项：

```sh
deno install
```

Next.js 有一些依赖项仍然依赖于
`Object.prototype.__proto__`，因此你需要允许它。在一个新的 `deno.json`
文件中，添加以下行：

```json deno.json
{
  "unstable": ["unsafe-proto"]
}
```

现在你可以启动你的新 Next.js 应用：

```sh
deno task dev
```

这将启动 Next.js 服务器，点击输出的 localhost 链接以在浏览器中查看你的应用。

## 添加后端

下一步是添加一个后端 API。我们将创建一个非常简单的 API，返回有关恐龙的信息。

我们将使用 Next.js
的[内置 API 路由处理器](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)来设置我们的恐龙
API。Next.js 使用基于文件系统的路由器，其中文件夹结构直接定义了路由。

我们将定义三个路由，第一个路由在 `/api` 将返回字符串
`Welcome to the dinosaur API`，然后我们将设置 `/api/dinosaurs`
以返回所有恐龙，最后 `/api/dinosaur/[dinosaur]` 将根据 URL
中的名称返回特定的恐龙。

### /api/

在你的新项目的 `app` 文件夹中，创建一个 `api` 文件夹。在该文件夹中，创建一个
`route.ts` 文件，它将处理对 `/api/` 的请求。

将以下代码复制并粘贴到 `api/route.ts` 文件中：

```ts title="route.ts"
export async function GET() {
  return Response.json("welcome to the dinosaur API");
}
```

这段代码定义了一个简单的路由处理器，返回一个包含字符串
`welcome to the dinosaur API` 的 JSON 响应。

### /api/dinosaurs

在 `api` 文件夹中，创建一个名为 `dinosaurs` 的文件夹。在该文件夹中，创建一个
`data.json`
文件，其中将包含硬编码的恐龙数据。将[这个 json 文件](https://raw.githubusercontent.com/denoland/deno-vue-example/main/api/data.json)复制并粘贴到
`data.json` 文件中。

在 `dinosaurs` 目录中创建一个 `route.ts` 文件，它将处理对 `/api/dinosaurs`
的请求。在这个路由中，我们将读取 `data.json` 文件并返回恐龙数据作为 JSON：

```ts title="route.ts"
import data from "./data.json" with { type: "json" };

export async function GET() {
  return Response.json(data);
}
```

### /api/dinosaurs/[dinosaur]

对于最后一个路由 `/api/dinosaurs/[dinosaur]`，我们将在 `dinosaurs`
目录中创建一个名为 `[dinosaur]` 的文件夹。在其中创建一个 `route.ts`
文件。在这个文件中，我们将读取 `data.json` 文件，找到 URL
中名称对应的恐龙，并将其作为 JSON 返回：

```ts title="route.ts"
import { NextRequest } from "next/server";
import data from "../data.json" with { type: "json" };

type RouteParams = { params: Promise<{ dinosaur: string }> };

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const { dinosaur } = await params;

  if (!dinosaur) {
    return Response.json("No dinosaur name provided.");
  }

  const dinosaurData = data.find((item) =>
    item.name.toLowerCase() === dinosaur.toLowerCase()
  );

  return Response.json(dinosaurData ? dinosaurData : "No dinosaur found.");
};
```

现在，如果你使用 `deno task dev` 运行应用，并在浏览器中访问
`http://localhost:3000/api/dinosaurs/brachiosaurus`，你应该会看到腕龙的详细信息。

## 构建前端

现在我们已经设置好了后端 API，让我们构建前端以显示恐龙数据。

### 定义恐龙类型

首先，我们将设置一个新类型，以定义恐龙数据的形状。在 `app` 目录中，创建一个
`types.ts` 文件，并添加以下代码：

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### 更新主页

我们将更新 `app` 目录中的 `page.tsx` 文件，以从我们的 API
获取恐龙数据并将其显示为链接列表。

要在 Next.js 中执行客户端代码，我们需要在文件顶部使用 `use Client`
指令。然后我们将导入我们在此页面中需要的模块，并导出将渲染页面的默认函数：

```tsx title="page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "./types";
import Link from "next/link";

export default function Home() {
}
```

在 `Home` 函数的主体中，我们将定义一个状态变量来存储恐龙数据，并定义一个
`useEffect` 钩子以在组件挂载时从 API 获取数据：

```tsx title="page.tsx"
const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

useEffect(() => {
  (async () => {
    const response = await fetch(`/api/dinosaurs`);
    const allDinosaurs = await response.json() as Dino[];
    setDinosaurs(allDinosaurs);
  })();
}, []);
```

在这之后，仍然在 `Home`
函数的主体中，我们将返回一个链接列表，每个链接都指向恐龙的页面：

```tsx title="page.tsx"
return (
  <main>
    <h1>Welcome to the Dinosaur app</h1>
    <p>Click on a dinosaur below to learn more.</p>
    <ul>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <li key={dinosaur.name}>
            <Link href={`/${dinosaur.name.toLowerCase()}`}>
              {dinosaur.name}
            </Link>
          </li>
        );
      })}
    </ul>
  </main>
);
```

### 创建恐龙页面

在 `app` 目录中，创建一个名为 `[dinosaur]` 的新文件夹。在该文件夹中创建一个
`page.tsx` 文件。该文件将从 API 获取特定恐龙的详细信息并将其渲染到页面上。

与主页类似，我们需要客户端代码，我们将导入我们需要的模块并导出一个默认函数。我们将传入的参数传递给函数，并为此参数设置一个类型：

```tsx title="[dinosaur]/page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "../types";
import Link from "next/link";

type RouteParams = { params: Promise<{ dinosaur: string }> };

export default function Dinosaur({ params }: RouteParams) {
}
```

在 `Dinosaur`
函数的主体中，我们将从请求中获取选定的恐龙，设置一个状态变量来存储恐龙数据，并编写一个
`useEffect` 钩子以在组件挂载时从 API 获取数据：

```tsx title="[dinosaur]/page.tsx"
const selectedDinosaur = params.then((params) => params.dinosaur);
const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

useEffect(() => {
  (async () => {
    const resp = await fetch(`/api/dinosaurs/${await selectedDinosaur}`);
    const dino = await resp.json() as Dino;
    setDino(dino);
  })();
}, []);
```

最后，仍然在 `Dinosaur`
函数的主体中，我们将返回一个包含恐龙名称和描述的段落元素：

```tsx title="[dinosaur]/page.tsx"
return (
  <main>
    <h1>{dinosaur.name}</h1>
    <p>{dinosaur.description}</p>
    <Link href="/">🠠 Back to all dinosaurs</Link>
  </main>
);
```

## 运行应用

现在你可以使用 `deno task dev` 运行应用，并在浏览器中访问
`http://localhost:3000` 以查看恐龙列表。点击一个恐龙以查看更多详细信息！

![应用演示](./images/how-to/next/dinoapp.gif)

🦕 现在你可以使用 Deno 构建和运行一个 Next.js
应用！为了进一步扩展你的应用，你可以考虑[添加一个数据库](/runtime/tutorials/connecting_to_databases/)来替换你的
`data.json`
文件，或者考虑[编写一些测试](/runtime/fundamentals/testing/)以使你的应用可靠并准备好投入生产。
