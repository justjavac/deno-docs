# 如何在 Deno 中使用 MySQL2

[MySQL](https://www.mysql.com/) 是
[2022 Stack Overflow 开发者调查](https://survey.stackoverflow.co/2022/#most-popular-technologies-database)
中最受欢迎的数据库，拥有 Facebook、Twitter、YouTube 和 Netflix 等用户。

[查看源代码](https://github.com/denoland/examples/tree/main/with-mysql2)

您可以使用 `mysql2` 节点包和通过 `npm:mysql2` 导入来在 Deno 中操作和查询 MySQL
数据库。这使我们能够使用其 Promise 包装器并利用顶层等待。

```tsx, ignore
import mysql from "npm:mysql2@^2.3.3/promise";
```

## 连接到 MySQL

我们可以使用 `createConnection()` 方法连接到我们的 MySQL
服务器。您需要主机（如果进行测试，则为
`localhost`，或在生产环境中更可能是云数据库端点）、用户名和密码：

```tsx, ignore
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});
```

您还可以在连接创建期间可选地指定数据库。在这里，我们将使用 `mysql2`
动态创建数据库。

## 创建和填充数据库

现在您已经建立了连接，可以使用 SQL 命令使用 `connection.query()`
来创建数据库和表，以及插入初始数据。

首先，我们要生成并选择要使用的数据库：

```tsx, ignore
await connection.query("CREATE DATABASE denos");
await connection.query("use denos");
```

然后我们要创建表：

```tsx, ignore
await connection.query(
  "CREATE TABLE `dinosaurs` (   `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,   `name` varchar(255) NOT NULL,   `description` varchar(255) )",
);
```

创建表后，我们可以填充数据：

```tsx, ignore
await connection.query(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

现在我们已经准备好开始查询。

## 查询 MySQL

我们可以使用相同的 `connection.query()` 方法来编写我们的查询。首先，我们尝试获取
`dinosaurs` 表中的所有数据：

```tsx, ignore
const results = await connection.query("SELECT * FROM `dinosaurs`");
console.log(results);
```

此查询的结果是我们数据库中的所有数据：

```tsx, ignore
[
  [
    {
      id: 1,
      name: "Aardonyx",
      description: "An early stage in the evolution of sauropods."
    },
    {
      id: 2,
      name: "Abelisaurus",
      description: "Abel's lizard has been reconstructed from a single skull."
    },
    { id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }
  ],
```

如果我们只想从数据库中获取单个元素，可以更改我们的查询：

```tsx, ignore
const [results, fields] = await connection.query(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(results);
```

这为我们提供了单行结果：

```tsx, ignore
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

最后，我们可以关闭连接：

```tsx, ignore
await connection.end();
```

要了解更多关于 `mysql2` 的信息，请查看他们的文档
[这里](https://github.com/sidorares/node-mysql2)。
