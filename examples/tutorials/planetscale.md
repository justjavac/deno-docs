---
title: "如何在 Deno 中使用 Planetscale"
url: /examples/planetscale_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/planetscale/
  - /runtime/tutorials/how_to_with_npm/planetscale/
---

Planetscale 是一个与 MySQL
兼容的无服务器数据库，专为开发者工作流设计，开发者可以从命令行创建、分支和部署数据库。

[查看源代码。](https://github.com/denoland/examples/tree/main/with-planetscale)

我们将使用 Planetscale 的无服务器驱动 `@planetscale/database` 来与 Deno
一起工作。首先，我们需要创建 `main.ts` 并从该包中导入 `connect` 方法：

```tsx
import { connect } from "npm:@planetscale/database@^1.4";
```

## 配置连接

连接需要三个凭证：主机、用户名和密码。这些是数据库特定的，因此我们首先需要在
Planetscale
中创建一个数据库。你可以按照[这里](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide)的初始说明进行操作。不用担心添加模式——我们可以通过
`@planetscale/database` 来完成。

创建数据库后，前往 Overview，点击 "Connect"，然后选择 "Connect with
`@planetscale/database`" 以获取主机和用户名。接着点击 Passwords
为你的数据库创建一个新密码。一旦你拥有了这三个凭证，你可以直接使用它们，或者更好的是，将它们存储为环境变量：

```bash
export HOST=<host>
export USERNAME=<username>
export PASSWORD=<password>
```

然后使用 `Deno.env` 调用它们：

```tsx
const config = {
  host: Deno.env.get("HOST"),
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
};

const conn = connect(config);
```

如果你在 Deno Deploy 的控制面板中设置了环境变量，这也将有效。运行：

```shell
deno run --allow-net --allow-env main.ts
```

现在，`conn` 对象是一个与我们的 Planetscale 数据库的开放连接。

## 创建并填充数据库表

现在你已经建立了连接，可以使用 `conn.execute()` 执行 SQL
命令来创建表并插入初始数据：

```tsx
await conn.execute(
  "CREATE TABLE dinosaurs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255) NOT NULL, description varchar(255) NOT NULL);",
);
await conn.execute(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

## 查询 Planetscale

我们可以使用相同的 `conn.execute()` 来编写查询。让我们获取所有恐龙的列表：

```tsx
const results = await conn.execute("SELECT * FROM `dinosaurs`");
console.log(results.rows);
```

结果：

```tsx
[
  {
    id: 1,
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    id: 2,
    name: "Abelisaurus",
    description: "Abels lizard has been reconstructed from a single skull.",
  },
  { id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." },
];
```

我们还可以通过指定恐龙名称来获取单行数据：

```tsx
const result = await conn.execute(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(result.rows);
```

这将返回单行结果：

```tsx
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

你可以在他们的[文档](https://planetscale.com/docs)中了解更多关于使用 Planetscale
的信息。
