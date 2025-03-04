---
title: "在命令行中使用 deployctl"
---

`deployctl` 是一个命令行工具（CLI），它允许你在不离开终端的情况下操作 Deno
Deploy
平台。通过它，你可以部署代码、创建和管理项目及其部署，并监控它们的使用情况和日志。

## 依赖项

`deployctl` 的唯一依赖项是 Deno 运行时。你可以通过运行以下命令来安装它：

```sh
curl -fsSL https://deno.land/install.sh | sh
```

你不需要事先设置 Deno Deploy 账户。它会在你部署第一个项目时自动创建。

## 安装 `deployctl`

安装好 Deno 运行时后，你可以通过以下命令安装 `deployctl` 工具：

```sh
deno install -gArf jsr:@deno/deployctl
```

`deno install` 命令中的 `-A`
选项为安装的脚本授予所有权限。你可以选择不使用它，在这种情况下，工具执行时会提示你授予必要的权限。

## 部署

要执行代码的新部署，请导航到项目的根目录并执行：

```shell
deployctl deploy
```

### 项目和入口点

如果这是项目的第一次部署，`deployctl` 会根据 Git
仓库或所在目录猜测项目名称。同样，它会通过查找具有常见入口点名称的文件（如
main.ts、src/main.ts
等）来猜测入口点。第一次部署后，使用的设置将存储在配置文件中（默认为
deno.json）。

你可以分别使用 `--project` 和 `--entrypoint`
参数指定项目名称和/或入口点。如果项目不存在，它将自动创建。默认情况下，它会在用户的个人组织中创建，但也可以通过指定
`--org` 参数在自定义组织中创建。如果组织尚不存在，它也会自动创建。

```shell
deployctl deploy --project=helloworld --entrypoint=src/entrypoint.ts --org=my-team
```

### 包含和排除文件

默认情况下，`deployctl` 会部署当前目录中的所有文件（递归地，除了 `node_modules`
目录）。你可以使用 `--include` 和 `--exclude`
参数自定义此行为（在配置文件中也支持）。这些参数接受特定文件、整个目录和通配符。以下是一些示例：

- 仅包含源代码和静态文件：

  ```shell
  deployctl deploy --include=./src --include=./static
  ```

- 仅包含 TypeScript 文件：

  ```shell
  deployctl deploy --include=**/*.ts
  ```

- 排除本地工具和构建产物：

  ```shell
  deployctl deploy --exclude=./tools --exclude=./benches
  ```

一个常见的陷阱是没有包含需要运行的源代码模块（入口点和依赖项）。以下示例将失败，因为
`main.ts` 未被包含：

```shell
deployctl deploy --include=./static --entrypoint=./main.ts
```

入口点也可以是远程脚本。一个常见的用例是使用 `std/http/file_server.ts`
部署静态站点（更多细节请参见[静态站点教程](https://docs.denohub.com/deploy/tutorials/static-site)）：

```shell
deployctl deploy --include=dist --entrypoint=jsr:@std/http/file-server
```

### 环境变量

你可以使用 `--env` 设置环境变量（设置单个环境变量）或
`--env-file`（加载一个或多个环境文件）。这些选项可以组合并多次使用：

```shell
deployctl deploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

部署将能够通过 `Deno.env.get()` 访问这些变量。请注意，使用 `--env` 和
`--env-file`
设置的环境变量仅适用于正在创建的部署，不会添加到项目的[环境变量配置](./environment-variables.md)中。

### 生产部署

你创建的每个部署都有一个唯一的 URL。此外，项目有一个“生产
URL”和自定义域名，将流量路由到其“生产”部署。部署可以随时提升为生产环境，或直接使用
`--prod` 标志创建为生产环境：

```shell
deployctl deploy --prod
```

有关生产部署的更多信息，请参阅[部署](./deployments)文档。

## 部署

`deployments` 子命令分组了所有与部署相关的操作。

### 列出

你可以列出项目的部署：

```shell
deployctl deployments list
```

输出：

```
✔ 项目 'my-project' 的部署列表第 1 页已准备好
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  部署  │               日期               │   状态   │  数据库  │                       域名                       │ 入口点 │  分支  │  提交  │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ kcbxc4xwe4mc │ 12/3/2024 13:21:40 CET (2 天前)  │ 预览    │ 预览    │ https://my-project-kcbxc4xwe4mc.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ c0ph5xa9exb3 │ 12/3/2024 13:21:25 CET (2 天前)  │ 生产    │ 生产    │ https://my-project-c0ph5xa9exb3.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ kwkbev9er4h2 │ 12/3/2024 13:21:12 CET (2 天前)  │ 预览    │ 预览    │ https://my-project-kwkbev9er4h2.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ dxseq0jc8402 │ 6/3/2024 23:16:51 CET (8 天前)   │ 预览    │ 生产    │ https://my-project-dxseq0jc8402.deno.dev │ main.ts    │ main     │ 099359b  │
│ 7xr5thz8yjbz │ 6/3/2024 22:58:32 CET (8 天前)   │ 预览    │ 预览    │ https://my-project-7xr5thz8yjbz.deno.dev │ main.ts    │ another  │ a4d2953  │
│ 4qr4h5ac3rfn │ 6/3/2024 22:57:05 CET (8 天前)   │ 失败    │ 预览    │ n/a                                                │ main.ts    │ another  │ 56d2c88  │
│ 25wryhcqmb9q │ 6/3/2024 22:56:41 CET (8 天前)   │ 预览    │ 预览    │ https://my-project-25wryhcqmb9q.deno.dev │ main.ts    │ another  │ 4b6c506  │
│ 64tbrn8jre9n │ 6/3/2024 8:21:33 CET (8 天前)    │ 预览    │ 生产    │ https://my-project-64tbrn8jre9n.deno.dev │ main.ts    │ main     │ 4b6c506  │
│ hgqgccnmzg04 │ 6/3/2024 8:17:40 CET (8 天前)    │ 失败    │ 生产    │ n/a                                                │ main.ts    │ main     │ 8071902  │
│ rxkh1w3g74e8 │ 6/3/2024 8:17:28 CET (8 天前)    │ 失败    │ 生产    │ n/a                                                │ main.ts    │ main     │ b142a59  │
│ wx6cw9aya64c │ 6/3/2024 8:02:29 CET (8 天前)    │ 预览    │ 生产    │ https://my-project-wx6cw9aya64c.deno.dev │ main.ts    │ main     │ b803784  │
│ a1qh5fmew2yf │ 5/3/2024 16:25:29 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-a1qh5fmew2yf.deno.dev │ main.ts    │ main     │ 4bb1f0f  │
│ w6pf4r0rrdkb │ 5/3/2024 16:07:35 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-w6pf4r0rrdkb.deno.dev │ main.ts    │ main     │ 6e487fc  │
│ nn700gexgdzq │ 5/3/2024 13:37:11 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-nn700gexgdzq.deno.dev │ main.ts    │ main     │ c5b1d1f  │
│ 98crfqxa6vvf │ 5/3/2024 13:33:52 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-98crfqxa6vvf.deno.dev │ main.ts    │ main     │ 090146e  │
│ xcdcs014yc5p │ 5/3/2024 13:30:58 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-xcdcs014yc5p.deno.dev │ main.ts    │ main     │ 5b78c0f  │
│ btw43kx89ws1 │ 5/3/2024 13:27:31 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-btw43kx89ws1.deno.dev │ main.ts    │ main     │ 663452a  │
│ 62tg1ketkjx7 │ 5/3/2024 13:27:03 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-62tg1ketkjx7.deno.dev │ main.ts    │ main     │ 24d1618  │
│ 07ag6pt6kjex │ 5/3/2024 13:19:11 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-07ag6pt6kjex.deno.dev │ main.ts    │ main     │ 4944545  │
│ 4msyne1rvwj1 │ 5/3/2024 13:17:16 CET (9 天前)   │ 预览    │ 生产    │ https://my-project-4msyne1rvwj1.deno.dev │ main.ts    │ main     │ dda85e1  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
按回车键获取下一页 [Enter]
```

此命令默认输出 20 个部署的页面。你可以使用回车键翻页，并使用 `--page` 和
`--limit` 选项查询特定页面和页面大小。

与其他命令一样，你可以使用 `--project`
选项指定要列出部署的项目，如果你不在项目目录中或想列出其他项目的部署。

### 显示

使用以下命令获取特定部署的所有详细信息：

```shell
deployctl deployments show
```

输出：

```
✔ 项目 'my-project' 的生产部署是 'c0ph5xa9exb3'
✔ 部署 'c0ph5xa9exb3' 的详细信息已准备好：

c0ph5xa9exb3
------------
状态:       生产
日期:        2 天 12 小时 29 分钟 46 秒前 (12/3/2024 13:21:25 CET)
项目:       my-project (e54f23b5-828d-4b7f-af12-706d4591062b)
组织:       my-team (d97822ac-ee20-4ce9-b942-5389330b57ee)
域名(s):    https://my-project.deno.dev
              https://my-project-c0ph5xa9exb3.deno.dev
数据库:     生产 (0efa985f-3793-48bc-8c05-f740ffab4ca0)
入口点:     main.ts
环境变量:   HOME
Git
  引用:       main [4b6c506]
  消息:       更改名称
  作者:       John Doe @johndoe [mailto:johndoe@deno.com]
  URL:        https://github.com/arnauorriols/my-project/commit/4b6c50629ceeeb86601347732d01dc7ed63bf34f
Crons:       另一个 cron [*/10 * * * *] 在 15/3/2024 1:50:00 CET 成功，耗时 2 秒（下次在 15/3/2024 2:00:00 CET）
              最新的 cron [*/10 * * * *] n/a
              又一个 cron [*/10 * * * *] 在 15/3/2024 1:40:00 CET 失败，耗时 2 秒（下次在 15/3/2024 1:51:54 CET）
```

如果未指定部署，该命令将显示项目当前生产部署的详细信息。要查看最后一次部署的详细信息，请使用
`--last`，要查看特定部署的详细信息，请使用 `--id`（或位置参数）。你还可以使用
`--next` 或 `--prev` 按时间顺序浏览部署。

例如，要查看倒数第二次部署的详细信息，可以执行：

```shell
deployctl deployments show --last --prev
```

要查看特定部署之后的 2 个部署的详细信息：

```shell
deployctl deployments show 64tbrn8jre9n --next=2
```

### 重新部署

`redeploy`
命令创建一个新的部署，重用现有部署的构建，目的是更改与其关联的资源。这包括生产域名、环境变量和
KV 数据库。

:::info

选择要重新部署的部署的语义与[显示子命令](#show)相同，包括
`--last`、`--id`、`--next` 和 `--prev`。

:::

#### 生产域名

如果你想将项目的生产域名路由更改为特定部署，可以使用 `--prod` 选项重新部署它：

```shell
deployctl deployments redeploy --prod 64tbrn8jre9n
```

这将创建一个新的部署，其代码和环境变量与指定部署相同，但项目的生产域名将指向它。对于具有预览/生产数据库的项目（即链接到
GitHub 的项目），这还将为新部署设置生产数据库。

:::note

此功能类似于 Deno Deploy
网络应用程序中的“提升为生产”按钮，区别在于“提升为生产”按钮不会创建新的部署。相反，“提升为生产”按钮会就地更改域名路由，但它仅限于已经使用生产数据库的部署。

:::

#### KV 数据库

如果这是 GitHub
部署，它将有两个数据库，一个用于生产部署，一个用于预览部署。你可以通过使用
`--db` 选项重新部署来更改部署的数据库：

```shell
deployctl deployments redeploy --db=prod --id=64tbrn8jre9n
```

:::note

当将部署重新部署为生产环境时，默认情况下它会自动配置为使用生产数据库。你可以结合使用
`--prod` 和 `--db`
选项来退出此行为。例如，以下命令将重新部署当前的生产部署（由于缺少位置参数、`--id`
或 `--last`）。新部署将成为新的生产部署，但它将使用预览数据库而不是生产数据库：

```shell
deployctl deployments redeploy --prod --db=preview
```

:::

如果你的组织有自定义数据库，你也可以通过 UUID 设置它们：

```shell
deployctl deployments redeploy --last --db=5261e096-f9aa-4b72-8440-1c2b5b553def
```

#### 环境变量

创建部署时，它会继承项目的环境变量。由于部署是不可变的，它们的环境变量永远无法更改。要在部署中设置新的环境变量，你需要使用
`--env`（设置单个变量）和 `--env-file`（加载一个或多个环境文件）重新部署它。

以下命令重新部署当前的生产部署，使用 `.env` 和 `.other-env`
文件中定义的环境变量，以及设置为当前时间戳的 `DEPLOYMENT_TS`
变量。生成的部署将是预览部署（即生产域名不会将流量路由到它，因为缺少
`--prod`）。

```shell
deployctl deployments redeploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

:::note

请注意，更改环境变量时，只有重新部署命令中设置的环境变量才会被新部署使用。项目环境变量和正在重新部署的部署的环境变量将被忽略。如果这不符合你的需求，请在
https://github.com/denoland/deploy_feedback/issues/ 提交反馈。

:::

:::note

当你在 Deno Deploy
网络应用程序中更改项目环境变量时，当前的生产部署会使用新的环境变量重新部署，新部署将成为新的生产部署。

:::

### 删除

你可以使用 `delete` 子命令删除部署：

```shell
deployctl deployments delete 64tbrn8jre9n
```

与 `show` 和 `redeploy` 一样，`delete` 也可以使用 `--last`、`--next` 和 `--prev`
来选择要删除的部署。以下是一个删除项目所有部署（除了最后一个）的示例命令（请谨慎使用！）：

```shell
while deployctl deployments delete --project=my-project --last --prev; do :; done
```

## 项目

`projects` 子命令分组了所有针对项目的操作。这包括
`list`、`show`、`rename`、`create` 和 `delete`。

### 列出

`deployctl projects list` 输出你的用户有权访问的所有项目，按组织分组：

```
个人组织:
    blog
    url-shortener

'my-team' 组织:
    admin-site
    main-site
    analytics
```

你可以使用 `--
