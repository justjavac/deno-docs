---
title: "使用 TypeScript 构建 API 服务器"
url: /examples/build_api_server_ts/
videoUrl: https://www.youtube.com/watch?v=J8kZ-s-5-ms&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=13
layout: video.tsx
---

## 视频描述

使用轻量级的 Hono 框架（Express 的精神继承者）构建一个支持 CRUD 操作的 RESTful
API 服务器，并与数据库交互。

## 文字稿和代码

如果你过去曾参与过 Node 项目，你可能使用过 Express 来设置 Web 服务器或托管
API。让我们看看如何使用 Hono 实现类似的功能，Hono
是一个小巧简单的框架，可以与任何运行时一起使用，但我们将它与 Deno
结合使用。基本的 Hono 设置

我们将通过 [JSR](https://jsr.io) 将 Hono 添加到项目中：

```shell
deno add jsr:@hono/hono
```

这将会被添加到 deno.json 文件中。

然后，在我们的主文件中，我们将创建基本的 Hono 设置。

```ts
import { Hono } from "@hono/hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from the Trees!");
});

Deno.serve(app.fetch);
```

让我们运行 `deno run --allow-net main.ts`，然后在浏览器中访问 `localhost:8000`。

## CRUD 操作

现在我们已经用 Hono 设置了简单的服务器，我们可以开始构建数据库。

我们将使用 localStorage，但请记住，你可以使用任何持久化数据存储与 Deno 结合使用
—— postgres、sql —— 无论你喜欢在哪里存储数据。

让我们从创建一个数据容器开始。我们将从一个描述树类型的接口开始：

```ts
interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}
```

然后我们创建一些数据：

```ts
const oak: Tree = {
  id: "3",
  species: "oak",
  age: 3,
  location: "Jim's Park",
};
```

然后我们将创建一些辅助函数，帮助我们与 localStorage 交互：

```ts
const setItem = (key: string, value: Tree) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string): Tree | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
```

现在让我们使用它们：

```ts
setItem(`trees_${oak.id}`, oak);
const newTree = getItem(`trees_${oak.id}`);
console.log(newTree);
```

```shell
deno --allow-net main.ts
```

- `setItem` 正在添加树
- 你也可以使用 `setItem` 更新记录 —— 如果键已经存在，值将被更新

```ts
const oak: Tree = {
  id: "3",
  species: "oak",
  age: 4,
  location: "Jim's Park",
};

localStorage.setItem(`trees_${oak.id}`, JSON.stringify(oak));
```

好的，现在让我们使用 Hono 的路由功能创建一些 REST API
路由，既然我们已经了解了如何使用这些数据库方法：

```ts
app.post("/trees", async (c) => {
  const { id, species, age, location } = await c.req.json();
  const tree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, tree);
  return c.json({
    message: `We just added a ${species} tree!`,
  });
});
```

为了测试这一点，我们将发送一个 curl 请求：

```shell
curl -X POST http://localhost:8000/trees \
  -H "Content-Type: application/json" \
  -d '{"id": "2", "species": "Willow", "age": 100, "location": "Juniper Park"}'
```

为了证明我们创建了那棵树，让我们通过其 ID 获取数据：

```ts
app.get("/trees/:id", async (c) => {
  const id = c.req.param("id");
  const tree = await kv.get(["trees", id]);
  if (!tree.value) {
    return c.json({ message: "Tree not found" }, 404);
  }
  return c.json(tree.value);
});
```

为了测试这一点，让我们运行一个 curl 请求来获取数据：

```shell
curl http://localhost:8000/trees/1
```

或者你可以在浏览器中访问：`http://localhost:8000/trees/1`

当然，我们可以更新一棵树。类似于之前的方式，但我们将为此创建一个路由：

```ts
app.put("/trees/:id", (c) => {
  const id = c.req.param("id");
  const { species, age, location } = c.req.json();
  const updatedTree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, updatedTree);
  return c.json({
    message: `Tree has relocated to ${location}!`,
  });
});
```

我们将更改位置，因为我们要将这棵树放到其他地方：

```shell
curl -X PUT http://localhost:8000/trees/1 \
  -H "Content-Type: application/json" \
  -d '{"species": "Oak", "age": 8, "location": "Theft Park"}'
```

最后，如果我们想删除一棵树，可以使用 Hono 的删除功能。

```ts
const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};

app.delete("/trees/:id", (c) => {
  const id = c.req.param("id");
  deleteItem(`trees_${id}`);
  return c.json({
    message: `Tree ${id} has been cut down!`,
  });
});
```

我们已经使用 Deno 和 Hono 结合构建了一个用于树数据的小型 REST
API。如果我们想部署它，我们可以零配置地部署到
[Deno deploy](https://deno.com/deploy)。

你可以将此部署到任何云 VPS，如 AWS、GCP、Digital Ocean，使用
[官方 Docker 镜像](https://github.com/denoland/deno_docker)

## 完整代码示例

```ts
import { Hono } from "@hono/hono";

const app = new Hono();

interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}

const setItem = (key: string, value: Tree) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string): Tree | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};

const oak: Tree = {
  id: "3",
  species: "oak",
  age: 3,
  location: "Jim's Park",
};

setItem(`trees_${oak.id}`, oak);
const newTree = getItem(`trees_${oak.id}`);
console.log(newTree);

app.get("/", (c) => {
  return c.text("Hello from the Trees!");
});

app.post("/trees", async (c) => {
  const { id, species, age, location } = await c.req.json();
  const tree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, tree);
  return c.json({
    message: `We just added a ${species} tree!`,
  });
});

app.get("/trees/:id", async (c) => {
  const id = await c.req.param("id");
  const tree = getItem(`trees_${id}`);
  if (!tree) {
    return c.json({ message: "Tree not found" }, 404);
  }
  return c.json(tree);
});

app.put("/trees/:id", async (c) => {
  const id = c.req.param("id");
  const { species, age, location } = await c.req.json();
  const updatedTree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, updatedTree);
  return c.json({
    message: `Tree has relocated to ${location}!`,
  });
});

app.delete("/trees/:id", (c) => {
  const id = c.req.param("id");
  deleteItem(`trees_${id}`);
  return c.json({
    message: `Tree ${id} has been cut down!`,
  });
});

Deno.serve(app.fetch);
```
