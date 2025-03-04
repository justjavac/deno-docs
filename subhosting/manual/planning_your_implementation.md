---
title: 规划你的实现
---

假设你正在构建一个类似 Salesforce 的 SaaS CRM 平台。你希望让客户能够编写
JavaScript 代码，并在每次捕获新线索时执行该代码。

如果你打算使用 Deno Deploy 实现此功能，以下是你可以考虑的构建方式：

- 创建一个 **项目**
  并将其与数据库中的客户账户关联。这将允许你跟踪每个客户的使用情况，并可能根据项目的分析信息向他们收费。
- 创建一个 **部署**，其中包含最终用户提供的代码，该代码应在创建新线索时运行。
- 在同一项目中使用多个部署，你可以实现事件处理逻辑的“测试”或“生产”版本。
- 你的 CRM 软件将通过向部署发送 HTTP 请求并等待响应来与最终用户的代码进行通信。
- 未来，如果你想支持为 CRM
  中的其他事件编写代码（例如创建新联系人或每晚发送自动报告），你可以为每个事件创建一个项目，并为每个项目使用上述流程。

让我们来看一个实现此功能所需的 API 端点示例。

## 为项目创建部署

在 [上一章](./quick_start.md) 中，你创建了一个新项目并记录了其 `id`
属性。在上一章的示例中，ID 为：

```console
f084712a-b23b-4aba-accc-3c2de0bfa26a
```

你可以使用项目标识符为该项目
[创建部署](https://apidocs.deno.com/#get-/projects/-projectId-/deployments)。创建一个名为
`create_deployment.ts` 的新文件，并包含以下代码以创建新的“Hello World”部署。

```ts title="create_deployment.ts"
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const API = "https://api.deno.com/v1";

// 替换为你所需的项目 ID
const projectId = "your-project-id-here";

// 创建新部署
const res = await fetch(`${API}/projects/${projectId}/deployments`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    entryPointUrl: "main.ts",
    assets: {
      "main.ts": {
        "kind": "file",
        "content":
          `export default { async fetch(req) { return new Response("Hello, World!"); } }`,
        "encoding": "utf-8",
      },
    },
    envVars: {},
  }),
});

const deployment = await res.json();

console.log(res.status);
console.log(
  "访问你的站点：",
  `https://${project.name}-${deployment.id}.deno.dev`,
);
```

如果你使用以下命令运行此脚本：

```bash
deno run -A --env create_deployment.ts
```

你应该很快就能在 Deno Deploy 仪表板上看到一个简单的“Hello World!”服务器在公共
URL 上运行。

## 部署的组成部分

上面的示例展示了一个非常简单的部署。更复杂的部署可能包含以下部分或全部组件，详细信息请参阅
[API 文档](https://apidocs.deno.com/#get-/projects/-projectId-/deployments)。

- **资源：** TypeScript 或 JavaScript 源文件、图像、JSON
  文档——使你的部署运行的代码和静态文件。这些文件可以使用
  `utf-8`（用于纯源文件）或
  `base64`（用于图像和其他文本文件）编码在上传到服务器的 JSON
  中。除了实际文件外，你还可以包含指向其他文件的符号链接。
- **入口点 URL：** 从上述集合中指向资源（TypeScript 或 JavaScript
  文件）的文件路径，该文件应被执行以启动部署中的服务器。
- **环境变量：** 你可以指定应存在于系统环境中的值，以便通过 `Deno.env.get`
  检索。
- **数据库 ID：** 应提供给此部署的 Deno KV 数据库的标识符。
- **编译器选项：** 用于解释 TypeScript 代码的一组选项。

## 自定义域名

创建部署后，会为其分配一个生成的
URL。对于某些场景来说，这可能已经足够，但通常你还会希望将自定义域名与你的部署关联。[查看域名的 API 参考](https://apidocs.deno.com/#get-/organizations/-organizationId-/domains)。
