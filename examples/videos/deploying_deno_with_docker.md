---
title: "使用 Docker 部署 Deno"
url: /examples/deploying_deno_with_docker/
videoUrl: https://www.youtube.com/watch?v=VRryNeYm6yw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=16
layout: video.tsx
---

## 视频描述

了解如何使用 Docker 将 Deno 应用程序部署到兼容的云环境中。

## 资源

- https://github.com/denoland/deno_docker
- https://fly.io/

## 文字稿和代码

Deno 让很多事情变得简单：代码检查、格式化、与 Node
生态系统的互操作性、测试、TypeScript，但部署呢？让 Deno
在生产环境中运行有多容易？非常容易！

让我们从我们的应用程序开始。这是一个为我们提供一些关于树木信息的应用程序。在主页上，我们得到一些文本。在树木路由中，我们得到一些
JSON。在基于树木 id 的动态路由中，我们得到关于那棵树的详细信息。

```ts
import { Hono } from "jsr:@hono/hono";

const app = new Hono();

interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}

const oak: Tree = {
  id: "1",
  species: "oak",
  age: 3,
  location: "Jim's Park",
};

const maple: Tree = {
  id: "2",
  species: "maple",
  age: 5,
  location: "Betty's Garden",
};

const trees: Tree[] = [oak, maple];

app.get("/", (c) => {
  return c.text("🌲 🌳 The Trees Welcome You! 🌲 🌳");
});

app.get("/trees", (c) => {
  return c.json(trees);
});

app.get("/trees/:id", (c) => {
  const id = c.req.param("id");
  const tree = trees.find((tree) => tree.id === id);
  if (!tree) return c.json({ message: "That tree isn't here!" }, 404);
  return c.json(tree);
});

Deno.serve(app.fetch);
```

## 使用 Docker 本地运行

确保你的机器上安装了 Docker。在终端或命令提示符中，你可以运行
docker，如果你看到一大串命令，说明你已经安装了。如果没有，请前往
https://www.docker.com/ 根据你的操作系统下载。

### 测试运行 docker：

```shell
docker
```

然后运行以下命令，使用 Docker 在 `localhost:8000` 上运行

```shell
docker run -it -p 8000:8000 -v $PWD:/my-deno-project denoland/deno:2.0.2 run --allow-net /my-deno-project/main.ts
```

访问运行在 `localhost:8000` 的应用程序

也可以使用 docker 配置文件来运行。

```dockerfile
FROM denoland/deno:2.0.2

# 你的应用程序监听的端口。

EXPOSE 8000

WORKDIR /app

# 最好不要以 root 用户运行。
USER deno

# 这些步骤将在你的工作目录中的文件更改时重新运行：
COPY . .

# 编译主应用程序，这样每次启动/入口时不需要重新编译。
RUN deno cache main.ts

# 预热缓存
RUN timeout 10s deno -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["run", "--allow-net", "main.ts"]
```

然后构建它

```shell
docker build -t my-deno-project .
```

从这里，你可以将应用程序部署到你选择的托管提供商。我今天将使用 fly.io。

## 部署到 fly.io

如果你以前没有使用过
fly，它是一个允许你部署和运行全栈应用程序的云平台。它们在全世界多个地区运行，这使得它们成为一个非常不错的选择。https://fly.io/

### 安装 Fly

使用 curl 安装

```shell
curl -L https://fly.io/install.sh | sh
```

### 通过 CLI 登录 Fly

```shell
fly auth login
```

这将打开浏览器，让你登录到你的账户（如果还没有账户，可以创建一个）。然后我们将使用
fly 启动应用程序：

```shell
flyctl launch
```

这将为应用程序生成一个 fly.toml
文件，你可以选择不同的设置。更重要的是，它将启动应用程序！我们只需等待过程完成，就可以在该位置查看我们的应用程序运行情况。

因此，使用 Deno，我们可以使用 Docker 将应用程序容器化，并使用 Fly
在几分钟内将应用程序托管到生产环境中。
