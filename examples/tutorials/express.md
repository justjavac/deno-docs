---
title: "如何使用 Express 与 Deno"
url: /examples/express_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/express/
  - /runtime/manual/node/how_to_with_npm/express/
  - /runtime/tutorials/how_to_with_npm/express/
---

[Express](https://expressjs.com/) 是一个流行的 Web
框架，以其简单、灵活和庞大的中间件生态系统而闻名。

本指南将向您展示如何使用 Express 和 Deno 创建一个简单的 API。

[查看源代码。](https://github.com/denoland/examples/tree/main/with-express)

## 创建 `main.ts`

让我们创建 `main.ts`：

```console
touch main.ts
```

在 `main.ts` 中，让我们创建一个简单的服务器：

```ts
// @ts-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.listen(8000);
```

让我们运行这个服务器：

```console
deno run -A main.ts
```

然后在浏览器中访问 `localhost:8000`。您应该会看到：

**Welcome to the Dinosaur API!**

## 添加数据和路由

下一步是添加一些数据。我们将使用从[这篇文章](https://www.thoughtco.com/dinosaurs-a-to-z-1093748)中找到的恐龙数据。您可以[从这里复制](https://github.com/denoland/examples/blob/main/with-express/data.json)。

让我们创建 `data.json`：

```console
touch data.json
```

并将恐龙数据粘贴进去。

接下来，让我们将这些数据导入到 `main.ts` 中。在文件顶部添加这行代码：

```ts
import data from "./data.json" assert { type: "json" };
```

然后，我们可以创建访问这些数据的路由。为了简单起见，我们只定义 `/api/` 和
`/api/:dinosaur` 的 `GET` 处理程序。在 `const app = express();`
行之后添加以下代码：

```ts
app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.get("/api", (req, res) => {
  res.send(data);
});

app.get("/api/:dinosaur", (req, res) => {
  if (req?.params?.dinosaur) {
    const found = data.find((item) =>
      item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
    );
    if (found) {
      res.send(found);
    } else {
      res.send("No dinosaurs found.");
    }
  }
});

app.listen(8000);
```

让我们用 `deno run -A main.ts` 运行服务器，并访问
`localhost:8000/api`。您应该会看到一个恐龙列表：

```json
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
```

当我们访问 `localhost:8000/api/aardonyx` 时：

```json
{
  "name": "Aardonyx",
  "description": "An early stage in the evolution of sauropods."
}
```

太棒了！
