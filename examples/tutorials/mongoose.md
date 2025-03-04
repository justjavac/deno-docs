---
title: "如何在 Deno 中使用 Mongoose"
url: /examples/mongoose_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/mongoose/
  - /runtime/tutorials/how_to_with_npm/mongoose/
---

[Mongoose](https://mongoosejs.com/) 是一个流行的、基于模式的库，用于为
[MongoDB](https://www.mongodb.com/) 建模数据。它简化了编写 MongoDB
验证、转换和其他相关业务逻辑的过程。

本教程将向您展示如何在 Deno 项目中设置 Mongoose 和 MongoDB。

[查看源代码](https://github.com/denoland/examples/tree/main/with-mongoose) 或
[查看视频指南](https://youtu.be/dmZ9Ih0CR9g)。

## 创建 Mongoose 模型

让我们创建一个简单的应用程序，连接到 MongoDB，创建一个 `Dinosaur`
模型，并将恐龙添加到数据库中并进行更新。

首先，我们将创建必要的文件和目录：

```console
touch main.ts && mkdir model && touch model/Dinosaur.ts
```

在 `/model/Dinosaur.ts` 中，我们将导入 `npm:mongoose`，定义
[schema]，并将其导出：

```ts
import { model, Schema } from "npm:mongoose@^6.7";

// 定义 schema。
const dinosaurSchema = new Schema({
  name: { type: String, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 验证
dinosaurSchema.path("name").required(true, "恐龙名称不能为空。");
dinosaurSchema.path("description").required(
  true,
  "恐龙描述不能为空。",
);

// 导出模型。
export default model("Dinosaur", dinosaurSchema);
```

## 连接到 MongoDB

现在，在我们的 `main.ts` 文件中，我们将导入 mongoose 和 `Dinosaur`
schema，并连接到 MongoDB：

```ts
import mongoose from "npm:mongoose@^6.7";
import Dinosaur from "./model/Dinosaur.ts";

await mongoose.connect("mongodb://localhost:27017");

// 检查连接状态。
console.log(mongoose.connection.readyState);
```

由于 Deno 支持顶级 `await`，我们可以直接使用 `await mongoose.connect()`。

运行此代码，我们应该会看到日志输出 `1`：

```shell
$ deno run --allow-read --allow-sys --allow-env --allow-net main.ts
1
```

成功了！

## 操作数据

让我们在 `/model/Dinosaur.ts` 中为 `Dinosaur` schema 添加一个实例
[方法](https://mongoosejs.com/docs/guide.html#methods)：

```ts
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

这个实例方法 `updateDescription` 将允许您更新记录的描述。

回到 `main.ts`，让我们开始在 MongoDB 中添加和操作数据。

```ts
// main.ts

// 创建一个新的恐龙。
const deno = new Dinosaur({
  name: "Deno",
  description: "有史以来最快的恐龙。",
});

// 插入 deno。
await deno.save();

// 按名称查找 Deno。
const denoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `在 MongoDB 中查找 Deno -- \n  ${denoFromMongoDb.name}: ${denoFromMongoDb.description}`,
);

// 更新 Deno 的描述并保存。
await denoFromMongoDb.updateDescription(
  "有史以来最快且最安全的恐龙。",
);

// 检查 MongoDB 中 Deno 的更新描述。
const newDenoFromMongoDb = await Dinosaur.findOne({ name: "Deno" });
console.log(
  `再次查找 Deno -- \n  ${newDenoFromMongoDb.name}: ${newDenoFromMongoDb.description}`,
);
```

运行代码，我们得到：

```console
在 MongoDB 中查找 Deno --
  Deno: 有史以来最快的恐龙。
再次查找 Deno --
  Deno: 有史以来最快且最安全的恐龙。
```

太棒了！

有关使用 Mongoose 的更多信息，请参阅
[他们的文档](https://mongoosejs.com/docs/guide.html)。
