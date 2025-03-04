---
title: "如何使用 Apollo 与 Deno"
url: /examples/apollo_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/apollo/
  - /runtime/manual/node/how_to_with_npm/apollo/
  - /runtime/tutorials/how_to_with_npm/apollo/
---

[Apollo Server](https://www.apollographql.com/) 是一个 GraphQL
服务器，您可以在几分钟内设置并使用现有的数据源（或 REST
API）。然后，您可以连接任何 GraphQL 客户端来接收数据，并利用 GraphQL
的优势，例如类型检查和高效的数据获取。

我们将启动并运行一个简单的 Apollo
服务器，以便查询一些本地数据。我们只需要三个文件：

1. `schema.ts` 用于设置我们的数据模型
2. `resolvers.ts` 用于设置如何填充我们模式中的数据字段
3. `main.ts` 用于启动服务器

我们将从创建这些文件开始：

```shell
touch schema.ts resolvers.ts main.ts
```

让我们逐步设置每个文件。

[查看源代码。](https://github.com/denoland/examples/tree/main/with-apollo)

## schema.ts

我们的 `schema.ts`
文件描述了我们的数据。在这种情况下，我们的数据是一个恐龙列表。我们希望用户能够获取每种恐龙的名字和简短描述。在
GraphQL 语言中，这意味着 `Dinosaur` 是我们的 **类型**，而 `name` 和
`description` 是我们的
**字段**。我们还可以为每个字段定义数据类型。在这种情况下，两者都是字符串。

这也是我们描述允许的数据查询的地方，使用 GraphQL 中的特殊 **Query**
类型。我们有两个查询：

- `dinosaurs` 获取所有恐龙的列表
- `dinosaur` 接受恐龙的 `name` 作为参数，并返回该种恐龙的信息。

我们将在 `typeDefs` 类型定义变量中导出所有这些内容：

```tsx
export const typeDefs = `
  type Dinosaur {
    name: String
    description: String
  }

  type Query {
    dinosaurs: [Dinosaur]
		dinosaur(name: String): Dinosaur
  }
`;
```

如果我们想写入数据，这也是我们描述 **Mutation** 的地方。Mutation 是您使用
GraphQL
写入数据的方式。因为我们在这里使用的是静态数据集，所以我们不会写入任何内容。

## resolvers.ts

解析器负责为每个查询填充数据。这里我们有我们的恐龙列表，解析器要做的就是：a)
如果用户请求 `dinosaurs` 查询，则将整个列表传递给客户端，或者 b) 如果用户请求
`dinosaur` 查询，则只传递一个恐龙。

```tsx
const dinosaurs = [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    name: "Abelisaurus",
    description: '"Abel\'s lizard" has been reconstructed from a single skull.',
  },
];

export const resolvers = {
  Query: {
    dinosaurs: () => dinosaurs,
    dinosaur: (_: any, args: any) => {
      return dinosaurs.find((dinosaur) => dinosaur.name === args.name);
    },
  },
};
```

对于后者，我们将客户端的参数传递给一个函数，以将名称与数据集中的名称匹配。

## main.ts

在我们的 `main.ts` 中，我们将导入 `ApolloServer` 以及 `graphql` 和来自模式的
`typeDefs` 以及我们的解析器：

```tsx
import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { graphql } from "npm:graphql@16.6";
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`Server running on: ${url}`);
```

我们将 `typeDefs` 和 `resolvers` 传递给 `ApolloServer`
以启动一个新服务器。最后，`startStandaloneServer`
是一个帮助函数，可以快速启动服务器。

## 运行服务器

现在剩下的就是运行服务器：

```shell
deno run --allow-net --allow-read --allow-env main.ts
```

您应该在终端中看到
`Server running on: 127.0.0.1:8000`。如果您访问该地址，您将看到 Apollo
沙盒，我们可以在其中输入 `dinosaurs` 查询：

```graphql
query {
  dinosaurs {
    name
    description
  }
}
```

这将返回我们的数据集：

```graphql
{
  "data": {
    "dinosaurs": [
      {
        "name": "Aardonyx",
        "description": "An early stage in the evolution of sauropods."
      },
      {
        "name": "Abelisaurus",
        "description": "\"Abel's lizard\" has been reconstructed from a single skull."
      }
    ]
  }
}
```

或者如果我们只想要一个 `dinosaur`：

```graphql
query {
  dinosaur(name:"Aardonyx") {
    name
    description
  }
}
```

这将返回：

```graphql
{
  "data": {
    "dinosaur": {
      "name": "Aardonyx",
      "description": "An early stage in the evolution of sauropods."
    }
  }
}
```

太棒了！

[在 Apollo 和 GraphQL 教程中了解更多信息。](https://www.apollographql.com/tutorials/)
