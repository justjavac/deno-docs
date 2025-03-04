---
title: "使用 DynamoDB 的 API 服务器"
oldUrl:
  - /deploy/docs/tutorial-dynamodb/
---

在本教程中，我们将学习如何使用它来构建一个小型 API，该 API
具有插入和检索信息的端点，并由 DynamoDB 提供支持。

本教程假设您拥有 AWS 和 Deno Deploy 账户。

- [概述](#overview)
- [设置 DynamoDB](#setup-dynamodb)
- [在 Deno Deploy 中创建项目](#create-a-project-in-deno-deploy)
- [编写应用程序](#write-the-application)
- [部署应用程序](#deploy-the-application)

## 概述

我们将构建一个具有单个端点的 API，该端点接受 GET/POST 请求并返回相应的信息。

```sh
# 对端点的 GET 请求应根据歌曲标题返回歌曲的详细信息。
GET /songs?title=Song%20Title # '%20' == 空格
# 响应
{
  title: "Song Title"
  artist: "Someone"
  album: "Something",
  released: "1970",
  genres: "country rap",
}

# 对端点的 POST 请求应插入歌曲详细信息。
POST /songs
# POST 请求体
{
  title: "A New Title"
  artist: "Someone New"
  album: "Something New",
  released: "2020",
  genres: "country rap",
}
```

## 设置 DynamoDB

我们在此过程中的第一步是生成 AWS 凭证，以便以编程方式访问 DynamoDB。

生成凭证：

1. 访问 https://console.aws.amazon.com/iam/ 并进入 "Users" 部分。
2. 点击 **Create user** 按钮，填写 **User name** 字段（可以使用 `denamo`）并选择
   **Programmatic access** 类型。
3. 点击 **Next**
4. 选择 **Attach policies directly** 并搜索
   `AmazonDynamoDBFullAccess`。在结果中勾选此策略旁边的复选框。
5. 点击 **Next** 和 **Create user**
6. 在生成的 **Users** 页面上，点击进入您刚刚创建的用户
7. 点击 **Create access key**
8. 选择 **Application running outside AWS**
9. 点击 ***Create**
10. 点击 **Download .csv file** 以下载您刚刚创建的凭证。

创建数据库表：

1. 访问 https://console.aws.amazon.com/dynamodb 并点击 **Create table** 按钮。
2. 填写 **Table name** 字段为 `songs`，**Partition key** 为 `title`。
3. 向下滚动并点击 **Create table**。
4. 表创建完成后，点击表名并找到其 **General information**
5. 在 **Amazon Resource Name (ARN)** 下，记下新表的区域（例如 us-east-1）。

## 编写应用程序

创建一个名为 `index.js` 的文件并插入以下内容：

```js
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
// AWS 有一个适用于浏览器的官方 SDK。由于大多数 Deno Deploy 的 API 与浏览器的 API 相似，因此相同的 SDK 也适用于 Deno Deploy。
// 因此我们导入 SDK 以及一些插入和检索数据所需的类。
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb";

// 通过提供您的区域信息创建客户端实例。
// 凭证是从环境变量中获取的，我们在 Deno Deploy 上的项目创建步骤中设置了这些变量。
const client = new DynamoDBClient({
  region: Deno.env.get("AWS_TABLE_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  },
});

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // 该端点允许 GET 和 POST 请求。GET 请求需要名为 "title" 的参数。POST 请求需要包含以下字段的请求体。
  // validateRequest 确保请求满足提供的条件。
  const { error, body } = await validateRequest(request, {
    GET: {
      params: ["title"],
    },
    POST: {
      body: ["title", "artist", "album", "released", "genres"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // 处理 POST 请求。
  if (request.method === "POST") {
    try {
      // 当我们想要与 DynamoDB 交互时，我们使用客户端实例发送命令。这里我们发送 PutItemCommand 以插入请求中的数据。
      const {
        $metadata: { httpStatusCode },
      } = await client.send(
        new PutItemCommand({
          TableName: "songs",
          Item: {
            // 这里 'S' 表示值为字符串类型，'N' 表示数字类型。
            title: { S: body.title },
            artist: { S: body.artist },
            album: { S: body.album },
            released: { N: body.released },
            genres: { S: body.genres },
          },
        }),
      );

      // 在成功的 put item 请求中，dynamo 返回 200 状态码（奇怪）。因此我们测试状态码以验证数据是否已插入，并返回请求提供的数据作为确认。
      if (httpStatusCode === 200) {
        return json({ ...body }, { status: 201 });
      }
    } catch (error) {
      // 如果在请求过程中出现问题，我们记录错误以供参考。
      console.log(error);
    }

    // 如果执行到这里，意味着插入未成功。
    return json({ error: "couldn't insert data" }, { status: 500 });
  }

  // 处理 GET 请求。
  try {
    // 我们从请求中获取标题并发送 GetItemCommand 以检索歌曲的信息。
    const { searchParams } = new URL(request.url);
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: "songs",
        Key: {
          title: { S: searchParams.get("title") },
        },
      }),
    );

    // Item 属性包含所有数据，因此如果它不为 undefined，我们继续返回标题的信息。
    if (Item) {
      return json({
        title: Item.title.S,
        artist: Item.artist.S,
        album: Item.album.S,
        released: Item.released.S,
        genres: Item.genres.S,
      });
    }
  } catch (error) {
    console.log(error);
  }

  // 如果在数据库请求期间抛出错误或数据库中未找到 Item，我们可能会到达这里。
  // 我们用一条通用消息反映这两种情况。
  return json(
    {
      message: "couldn't find the title",
    },
    { status: 404 },
  );
}
```

在您的新项目中初始化 git
并[将其推送到 GitHub](https://docs.github.com/en/get-started/start-your-journey/hello-world#step-1-create-a-repository)。

## 部署应用程序

现在我们已经准备好了一切，让我们部署您的新应用程序吧！

1. 在浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并链接您的
   GitHub 账户。
2. 选择包含您新应用程序的仓库。
3. 您可以为您的项目命名或允许 Deno 为您生成一个名称。
4. 在 Entrypoint 下拉菜单中选择 `index.js`
5. 点击 **Deploy Project**

为了使您的应用程序正常工作，我们需要配置其环境变量。

在项目的成功页面或项目仪表板上，点击 **Add environmental variables**。在
Environment Variables 下，点击 **+ Add Variable**。创建以下变量：

1. `AWS_ACCESS_KEY_ID` - 使用您下载的 CSV 文件中的值。
2. `AWS_SECRET_ACCESS_KEY` - 使用您下载的 CSV 文件中的值。
3. `AWS_TABLE_REGION` - 使用您的表所在的区域。

点击保存变量。

让我们测试一下 API。

POST 一些数据。

```sh
curl --request POST --data \
'{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}' \
--dump-header - https://<project_name>.deno.dev/songs
```

获取标题的信息。

```sh
curl https://<project_name>.deno.dev/songs?title=Old%20Town%20Road
```

恭喜您学会了如何在 Deno Deploy 中使用 DynamoDB！
