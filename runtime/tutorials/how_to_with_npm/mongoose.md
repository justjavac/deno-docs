# 如何在 Deno 中使用 Mongoose

[Mongoose](https://mongoosejs.com/) 是一种流行的基于模式的库，用于模型化
[MongoDB](https://www.mongodb.com/) 数据。它简化了编写 MongoDB
验证、类型转换以及其他相关业务逻辑的过程。

本教程将向您展示如何在您的 Deno 项目中设置 Mongoose 和 MongoDB。

[查看源代码](https://github.com/denoland/examples/tree/main/with-mongoose) 或
[查看视频指南](https://youtu.be/dmZ9Ih0CR9g)。

## 创建 Mongoose 模型

让我们创建一个简单的应用程序，连接到 MongoDB，创建一个 `Dinosaur`
模型，并向数据库添加和更新一个恐龙。

首先，我们将创建必要的文件和目录：

```
$ touch main.ts && mkdir model && touch model/Dinosaur.ts
```

在 `/model/Dinosaur.ts` 中，我们将导入 `npm:mongoose`，定义 [模式]，并导出它：

```ts, ignore
import { model, Schema } from "npm:mongoose@^6.7";

// 定义模式。
const dinosaurSchema = new Schema({
  name: { type: String, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 验证
dinosaurSchema.path("name").required(true, "Dinosaur name cannot be blank.");
dinosaurSchema.path("description").required(
  true,
  "Dinosaur description cannot be blank.",
);

// 导出模型。
export default model("Dinosaur", dinosaurSchema);
```

## 连接到 MongoDB

现在，在我们的 `main.ts` 文件中，我们将导入 mongoose 和 `Dinosaur`
模式，并连接到 MongoDB：

```ts, ignore
import mongoose from "npm:mongoose@^6.7";
import Dinosaur from "./model/Dinosaur.ts";

await mongoose.connect("mongodb://localhost:27017");

// 检查连接状态。
console.log(mongoose.connection.readyState);
```

由于 Deno 支持顶层 `await`，我们可以简单地 `await mongoose.connect()`。

运行此代码，我们应该期望得到一个日志输出为 `1`：

```shell, ignore
$ deno run --allow-read --allow-sys --allow-env --allow-net main.ts
1
```

它有效了！

## 操纵数据

让我们在 `/model/Dinosaur.ts` 中为我们的 `Dinosaur` 模式添加一个实例
[方法](https://mongoosejs.com/docs/guide.html#methods)：

```ts, ignore
// ./model/Dinosaur.ts

// 方法。
dinosaurSchema.methods = {
  // 更新描述。
  updateDescription: async function (description: string) {
    this.description = description;
    return await this.save();
  },
};

// ...
```

这个实例方法 `updateDescription` 允许您更新记录的描述。

回到 `main.ts`，让我们开始在 MongoDB 中添加和操作数据。

```ts, ignore
// main.ts

// 创建一个新的 Dinosaur。
const deno = new Dinosaur({
  name: "Deno",
  description: "The fastest dinosaur ever lived.",
});

// // 插入 deno。
await deno.save();

// 通过名称查找 Deno。
const denoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `在 MongoDB 中查找 Deno -- \n  ${denoFromMongoDb.name}: ${denoFromMongoDb.description}`,
);

// 更新 Deno 的描述并保存。
await denoFromMongoDb.updateDescription(
  "The fastest and most secure dinosaur ever lived.",
);

// 检查 MongoDB 以查看 Deno 的更新描述。
const newDenoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `再次查找 Deno -- \n  ${newDenoFromMongoDb.name}: ${newDenoFromMongoDb.description}`,
);
```

运行代码，我们得到：

```
在 MongoDB 中查找 Deno --
  Deno: The fastest dinosaur ever lived.
再次查找 Deno --
  Deno: The fastest and most secure dinosaur ever lived.
```

成功！

有关使用 Mongoose 的更多信息，请参考
[它们的文档](https://mongoosejs.com/docs/guide.html)。
