---
title: Subhosting 快速入门
oldUrl:
- /deploy/manual/subhosting/projects_and_deployments/
---

在寻找如何将代码部署到 Deno
的隔离云的最小示例吗？我们已经在下面为您准备好了，或者您可以跳转到
[更详细的入门指南](#getting-started-with-subhosting)。

```ts
// 1.) 准备好 API 访问信息
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

// 2.) 创建一个新项目
const pr = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: null, // 随机生成项目名称
  }),
});

const project = await pr.json();

// 3.) 将“hello world”服务器部署到新项目
const dr = await fetch(`${API}/projects/${project.id}/deployments`, {
  method: "POST",
  headers,
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

const deployment = await dr.json();

console.log(dr.status);
console.log(
  "访问您的站点：",
  `https://${project.name}-${deployment.id}.deno.dev`,
);
```

## 开始使用 Subhosting

要开始使用 Subhosting，您需要在
[Deno Deploy 仪表板](https://dash.deno.com/orgs/new)
中创建一个组织。按照屏幕上的说明创建一个新的 Subhosting 组织。

在完成入门流程时，您可能还会生成一个 **访问令牌**，您将使用它来访问
[REST API](../api/index.md)。如果您没有这样做（或者您的令牌已过期），您可以
[在这里生成一个新的令牌](https://dash.deno.com/account#access-tokens)。

:::caution 将您的令牌保存在安全的地方

一旦您生成了访问令牌，**它将不会再次显示在 Deploy 仪表板 UI
中**。请确保将此令牌保存在安全的地方。

:::

## 设置测试环境

在接下来的教程页面中，我们将假设您通过 Deno 脚本（TypeScript 代码）与 Deploy
REST API 进行交互，并将展示以这种方式与 API
交互的示例。然而，这里展示的技术也适用于任何能够执行 HTTP 请求的其他环境。

这里以及未来章节中展示的示例代码假设您已经安装了
[Deno 1.38 或更高版本](/runtime/getting_started/installation)。

在使用 REST API 时，将身份验证凭据存储在
[系统环境](/runtime/reference/env_variables)
中非常有用，以防止您意外地将它们提交到源代码控制中。

在本教程中，我们将使用
[Deno 1.38 中引入的](https://deno.com/blog/v1.38#deno-run---env) 新 `--env`
标志来管理环境变量。在您的本地计算机上，创建一个新目录来存储我们的管理脚本，并创建三个文件：

- `.env` - 用于保存我们的 API 访问信息
- `.gitignore` - 用于忽略我们的 `.env`
  文件，以免我们错误地将其提交到源代码控制中
- `create_project.ts` - 我们稍后将使用该文件向 REST API 发出第一个请求

### 配置 `.env` 文件和 `.gitignore` 文件

首先，将您的 [访问令牌](https://dash.deno.com/account#access-tokens) 和组织 ID
存储在您之前创建的 `.env` 文件中。

```bash title=".env"
DEPLOY_ACCESS_TOKEN=your_token_here
DEPLOY_ORG_ID=your_org_id_here
```

将文件中的值替换为您自己的 Deploy 帐户中的值。

接下来，创建一个 `.gitignore` 文件，以确保我们不会意外地将 `.env`
文件提交到源代码控制中：

```bash title=".gitignore"
# 在 git 中忽略此文件
.env

# 可选：忽略在 Mac OS 上经常生成的垃圾文件
.DS_Store
```

现在我们已经设置好了凭据，让我们编写一些代码来访问 REST API。

## 创建我们的第一个项目

为了在 Subhosting 或 REST API 中做任何有趣的事情，我们需要
[创建一个项目](https://apidocs.deno.com/#get-/projects/-projectId-/deployments)。将下面的代码复制到与您的
`.env` 和 `.gitignore` 文件相同的目录中，文件名为 `create_project.ts`。

```ts title="create_project.ts"
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";

// 创建一个新项目
const res = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: null, // 随机生成项目名称
  }),
});

const project = await res.json();
console.log(project);
```

在终端中使用以下命令执行此代码：

```bash
deno run -A --env create_project.ts
```

如果一切顺利，您应该会看到类似以下的输出：

```console
{
  id: "f084712a-b23b-4aba-accc-3c2de0bfa26a",
  name: "strong-fox-44",
  createdAt: "2023-11-07T01:01:14.078730Z",
  updatedAt: "2023-11-07T01:01:14.078730Z"
}
```

请注意返回的响应中的 `id` - 这是我们将在下一步中使用的项目 ID。

现在我们已经配置好了 REST API 访问并设置了一个项目，我们可以继续
[创建我们的第一个部署](./planning_your_implementation)。
