# 如何在 Deno 中使用 Apollo

[Apollo Server](https://www.apollographql.com/) 是一个 GraphQL
服务器，您可以在几分钟内设置并与现有数据源（或 REST
API）一起使用。然后，您可以连接任何 GraphQL 客户端以接收数据并利用 GraphQL
的优势，例如类型检查和高效的数据获取。

我们将创建一个简单的 Apollo
服务器，用于查询一些本地数据。对此，我们只需要三个文件：

1. `schema.ts` 用于设置我们的数据模型
2. `resolvers.ts` 用于设置如何填充我们模式中的数据字段
3. 我们的 `main.ts`，其中服务器将启动

我们将从创建它们开始：

```shell, ignore
touch schema.ts resolvers.ts main.ts
```

让我们来详细了解每个设置。

[在此处查看源码。](https://github.com/denoland/examples/tree/main/with-apollo)

## schema.ts

我们的 `schema.ts`
文件描述了我们的数据。在这种情况下，我们的数据是恐龙列表。我们希望用户能够获取每只恐龙的名称和简短描述。在
GraphQL 语言中，这意味着 `Dinosaur` 是我们的 **类型**，`name` 和 `description`
是我们的
**字段**。我们还可以为每个字段定义数据类型。在这种情况下，两者都是字符串。

这也是我们描述允许数据的查询的地方，使用 GraphQL 中的特殊 **Query**
类型。我们有两个查询：

- `dinosaurs` 获取所有恐龙的列表
- `dinosaur` 以一种恐龙的名称作为参数，并返回有关该恐龙类型的信息。

我们将在我们的 `typeDefs` 类型定义中导出所有这些，如下：

```tsx, ignore
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

如果我们想要写数据，这也是我们将描述如何执行 **Mutation** 的地方。Mutation
是您使用 GraphQL
写数据的方式。因为我们在这里使用的是一个静态数据集，所以我们不会写任何东西。

## resolvers.ts

解析器负责为每个查询填充数据。在这里，我们有我们的恐龙列表，解析器要做的就是要么将整个列表传递给客户端，如果用户请求
`dinosaurs` 查询，要么如果用户请求 `dinosaur` 查询，则只传递一条数据。

```tsx, ignore
const dinosaurs = [
  {
    name: "Aardonyx",
    description: "蜥脚类恐龙演化的早期阶段。",
  },
  {
    name: "Abelisaurus",
    description: "“Abel's lizard” 是根据单个头骨重建的。",
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

在后一种情况下，我们将从客户端传递的参数传递到函数中，以将名称与我们的数据集中的名称进行匹配。

## main.ts

在我们的 `main.ts` 中，我们将导入 `ApolloServer` 以及 `graphql` 和来自模式的
`typeDefs` 以及我们的解析器：

```tsx, ignore
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

console.log(`服务器运行在: ${url}`);
```

我们将我们的 `typeDefs` 和 `resolvers` 传递给 `ApolloServer`
以快速启动新的服务器。最后，`startStandaloneServer`
是一个帮助函数，用于快速启动服务器。

## 运行服务器

现在只剩下运行服务器了：

```shell, ignore
deno run --allow-net --allow-read --allow-env main.ts
```

您应该在终端中看到 `服务器运行在: 127.0.0.1:8000`。如果您访问该地址，您将看到
Apollo 沙盒，您可以在其中输入我们的 `dinosaurs` 查询：

```graphql, ignore
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
        "description": "蜥脚类恐龙演化的早期阶段。"
      },
      {
        "name": "Abelisaurus",
        "description": "“Abel's lizard” 是根据单个头骨重建的。"
      }
    ]
  }
}
```

或者，如果我们只想要一个 `dinosaur`：

```graphql, ignore
query {
  dinosaur(name:"Aardonyx") {
    name
    description
  }
}
```

它将返回：

```graphql, ignore
{
  "data": {
    "dinosaur": {
      "name": "Aardonyx",
      "description": "蜥脚类恐龙演化的早期阶段。"
    }
  }
}
```

太棒了！

[在他们的教程中了解更多关于如何使用 Apollo 和 GraphQL。](https://www.apollographql.com/tutorials/)
