---
title: "如何在 Deno 中使用 MySQL2"
url: /examples/mysql2_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/mysql2/
  - /runtime/tutorials/how_to_with_npm/mysql2/
---

[MySQL](https://www.mysql.com/) 是
[2022 年 Stack Overflow 开发者调查](https://survey.stackoverflow.co/2022/#most-popular-technologies-database)
中最受欢迎的数据库，Facebook、Twitter、YouTube 和 Netflix 等公司都在使用它。

[查看源码。](https://github.com/denoland/examples/tree/main/with-mysql2)

你可以使用 `mysql2` node 包并通过 `npm:mysql2` 导入来在 Deno 中操作和查询 MySQL
数据库。这使我们能够使用其 Promise 包装器并利用顶级 await。

```tsx
import mysql from "npm:mysql2@^2.3.3/promise";
```

## 连接到 MySQL

我们可以使用 `createConnection()` 方法连接到 MySQL
服务器。你需要主机（如果是测试环境则为
`localhost`，生产环境中更可能是云数据库端点）以及用户名和密码：

```tsx
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});
```

你也可以在创建连接时选择性地指定一个数据库。这里我们将使用 `mysql2`
动态创建数据库。

## 创建并填充数据库

现在你已经建立了连接，可以使用 `connection.query()` 和 SQL
命令来创建数据库和表，并插入初始数据。

首先我们生成并选择要使用的数据库：

```tsx
await connection.query("CREATE DATABASE denos");
await connection.query("use denos");
```

然后我们创建表：

```tsx
await connection.query(
  "CREATE TABLE `dinosaurs` (   `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,   `name` varchar(255) NOT NULL,   `description` varchar(255) )",
);
```

表创建完成后，我们可以填充数据：

```tsx
await connection.query(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

现在我们已经准备好所有数据，可以开始查询了。

## 查询 MySQL

我们可以使用相同的 `connection.query()` 方法来编写查询。首先我们尝试获取
`dinosaurs` 表中的所有数据：

```tsx
const results = await connection.query("SELECT * FROM `dinosaurs`");
console.log(results);
```

此查询的结果是数据库中的所有数据：

```tsx
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
      description: `Abel's lizard" has been reconstructed from a single skull.`
    },
    { id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }
  ],
```

如果我们只想从数据库中获取单个元素，可以更改查询：

```tsx
const [results, fields] = await connection.query(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(results);
```

这将返回单行结果：

```tsx
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

最后，我们可以关闭连接：

```tsx
await connection.end();
```

有关 `mysql2`
的更多信息，请查看其[文档](https://github.com/sidorares/node-mysql2)。
