---
title: "在 Node.js 中使用 KV"
oldUrl:
  - /kv/manual/node/
---

通过我们的 [npm 上的官方客户端库](https://www.npmjs.com/package/@deno/kv)
，可以在 Node.js 中连接到 Deno KV 数据库。你可以在下面找到此选项的使用说明。

## 安装和使用

使用你喜欢的 npm 客户端通过以下命令之一安装 Node.js 的客户端库。

<deno-tabs group-id="npm-client">
<deno-tab value="npm" label="npm" default>

```sh
npm install @deno/kv
```

</deno-tab>
<deno-tab value="pnpm" label="pnpm">

```sh
pnpm add @deno/kv
```

</deno-tab>
<deno-tab value="yarn" label="yarn">

```sh
yarn add @deno/kv
```

</deno-tab>
</deno-tabs>

将包添加到你的 Node 项目后，你可以导入 `openKv` 函数（支持 ESM `import` 和 CJS
`require` 两种用法）：

```js
import { openKv } from "@deno/kv";

// 连接到 KV 实例
const kv = await openKv("<KV Connect URL>");

// 写入一些数据
await kv.set(["users", "alice"], { name: "Alice" });

// 读取数据
const result = await kv.get(["users", "alice"]);
console.log(result.value); // { name: "Alice" }
```

默认情况下，用于身份验证的访问令牌来自 `DENO_KV_ACCESS_TOKEN`
环境变量。你也可以显式传递它：

```js
import { openKv } from "@deno/kv";

const kv = await openKv("<KV Connect URL>", { accessToken: myToken });
```

一旦你的 Deno KV 客户端初始化完成，Deno 中可用的相同 API 也可以在 Node 中使用。

## KV Connect URLs

在 Deno 之外连接到 KV 数据库需要一个
[KV Connect](https://github.com/denoland/denokv/blob/main/proto/kv-connect.md)
URL。托管在 Deno Deploy 上的数据库的 KV Connect URL
格式如下：`https://api.deno.com/databases/<database-id>/connect`。

你可以在 [Deno Deploy 仪表板](https://dash.deno.com/projects) 中的项目 "KV"
选项卡下找到你的项目的 `database-id`。

![Deploy 中的连接字符串位置](./images/kv-connect.png)

## 更多信息

有关如何在 Node 中使用 Deno KV 模块的更多信息，请参阅项目的
[README 页面](https://www.npmjs.com/package/@deno/kv)。
