---
title: "初始化项目"
url: /examples/initialize_project_tutorial/
oldUrl:
---

虽然可以直接使用 `deno run`
运行脚本，但对于较大的项目，建议创建一个合理的目录结构。这样你可以更轻松地组织代码、管理依赖、执行脚本任务和运行测试。

通过运行以下命令初始化一个新项目：

```sh
deno init my_project
```

其中 `my_project`
是你的项目名称。你可以[阅读更多关于项目结构的内容](/runtime/getting_started/first_project/)。

### 运行你的项目

导航到项目目录：

```sh
cd my_project
```

然后你可以使用 `deno task` 命令直接运行项目：

```sh
deno run dev
```

查看新项目中的 `deno.json` 文件。你应该会在 "tasks" 字段中看到一个 `dev` 任务。

```json title="deno.json"
"tasks": {
  "dev": "deno run --watch main.ts"
},
```

`dev` 任务是一个常见的任务，用于在开发模式下运行项目。如你所见，它使用 `--watch`
标志运行 `main.ts` 文件，当文件发生更改时，脚本会自动重新加载。如果你打开
`main.ts` 文件并进行更改，就可以看到这一效果。

### 运行测试

在项目目录中运行：

```sh
deno test
```

这将执行项目中的所有测试。你可以阅读更多关于[在 Deno 中进行测试的内容](/runtime/fundamentals/testing/)，我们将在后续教程中更深入地介绍测试。目前你有一个测试文件
`main_test.ts`，它测试了 `main.ts` 中的 `add` 函数。

### 向项目中添加内容

`main.ts`
文件是你的应用程序的入口点。你将在这里编写主程序逻辑。在开发项目时，你可以从移除默认的加法程序开始，并用你自己的代码替换它。例如，如果你正在构建一个
Web 服务器，你将在这里设置路由并处理请求。

除了初始文件外，你可能会创建额外的模块（文件）来组织代码。考虑将相关功能分组到单独的文件中。记住，Deno
[支持 ES 模块](/runtime/fundamentals/modules/)，因此你可以使用 `import` 和
`export` 语句来构建代码。

一个 Deno 项目的示例文件夹结构：

```sh
my_project/
├── deno.json
├── main.ts
├── main_test.ts
├── routes/
│   ├── home.ts
│   ├── about.ts
├── services/
│   ├── user.ts
│   ├── post.ts
└──utils/
    ├── logger.ts
    ├── logger_test.ts
    ├── validator_test.ts
    └── validator.ts
```

这种结构使你的项目保持整洁，并更容易查找和管理文件。

🦕 恭喜！现在你知道如何使用 `deno init` 创建一个全新的项目。记住，Deno
鼓励简单性，避免复杂的构建工具。保持项目的模块化、可测试性和组织性。随着项目的增长，调整结构以适应你的需求。最重要的是，享受探索
Deno 功能的乐趣！
