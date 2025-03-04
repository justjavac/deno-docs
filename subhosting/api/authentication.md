---
title: 认证
---

开发者可以使用 Subhosting REST API 来配置项目、域、KV 数据库和其他资源。

## 端点和认证

Subhosting REST API v1 的基础 URL 如下。

```console
https://api.deno.com/v1/
```

v1 API 使用
[HTTP Bearer Token](https://swagger.io/docs/specification/authentication/bearer-authentication/)
进行认证。您可以在仪表板中创建一个访问令牌以使用
API，[点击此处](https://dash.deno.com/account#access-tokens)。大多数 API
请求还需要您的组织 ID。您可以从 Deno Deploy 仪表板中获取您的组织 ID。

![在此处查找您的组织 ID](./images/org-id.png)

使用您的组织 ID 和访问令牌，您可以通过列出与您的组织关联的所有项目来测试您的 API
访问权限。以下是一个可用于访问 API 的 Deno 脚本示例。

```typescript
// 替换为您自己的信息！
const organizationId = "a75a9caa-b8ac-47b3-a423-3f2077c58731";
const token = "ddo_u7mo08lBNHm8GMGLhtrEVfcgBsCuSp36dumX";

const res = await fetch(
  `https://api.deno.com/v1/organizations/${organizationId}/projects`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

const response = await res.json();
console.log(response);
```
