# 如何在 Deno 中使用 Planetscale

Planetscale 是一个与 MySQL
兼容的无服务器数据库，专为开发者工作流程设计，开发者可以使用命令行创建、分支和部署数据库。

[在此查看源代码。](https://github.com/denoland/examples/tree/main/with-planetscale)

我们将使用 Planetscale 无服务器驱动程序 `@planetscale/database` 与 Deno
进行操作。首先，我们要创建 `main.ts` 文件，并从该软件包中导入 `connect` 方法：

```tsx, ignore
import { connect } from "npm:@planetscale/database@^1.4";
```

## 配置我们的连接

连接需要三个凭据：主机、用户名和密码。这些凭据是特定于数据库的，因此我们首先需要在
Planetscale 中创建一个数据库。您可以按照初始说明
[此处](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide)
来创建数据库。不用担心添加模式，我们可以通过 `@planetscale/database` 进行操作。

创建数据库后，前往概述，单击 "连接"，然后选择 "使用 `@planetscale/database`
连接"
以获取主机和用户名。然后单击“密码”以创建数据库的新密码。一旦您拥有这三个凭据，您可以直接使用它们，或者更好地将它们存储为环境变量：

```bash
export HOST=<host>
export USERNAME=<username>
export PASSWORD=<password>
```

然后使用 `Deno.env` 调用它们：

```tsx, ignore
const config = {
  host: Deno.env.get("HOST"),
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
};

const conn = connect(config);
```

如果在仪表板中设置了环境变量，这也可以在 Deno Deploy 上工作。运行：

```shell, ignore
deno run --allow-net --allow-env main.ts
```

`conn` 对象现在是我们的 Planetscale 数据库的开放连接。

## 创建和填充我们的数据库表格

现在，您已经运行了连接，可以使用 SQL 命令进行 `conn.execute()`
操作以创建表格并插入初始数据：

```tsx, ignore
await conn.execute(
  "CREATE TABLE dinosaurs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255) NOT NULL, description varchar(255) NOT NULL);",
);
await conn.execute(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

## 查询 Planetscale

我们可以使用相同的 `conn.execute()` 来编写我们的查询。让我们获取所有恐龙的列表：

```tsx, ignore
const results = await conn.execute("SELECT * FROM `dinosaurs`");
console.log(results.rows);
```

结果：

```tsx, ignore
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

我们还可以通过指定恐龙名称来从数据库中获取单一行：

```tsx, ignore
const result = await conn.execute(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(result.rows);
```

这将给我们一个单一行的结果：

```tsx, ignore
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

您可以在他们的 [文档](https://planetscale.com/docs) 中找到更多关于使用
Planetscale 的信息。
