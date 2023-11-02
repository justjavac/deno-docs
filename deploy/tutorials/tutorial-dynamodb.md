# API 服务与 DynamoDB

在本教程中，让我们看看如何使用它来构建一个小型 API，该 API
具有用于插入和检索信息的端点，由 DynamoDB 支持。

本教程假定您已经拥有 AWS 和 Deno Deploy 帐户。

- [概览](#概览)
- [设置 DynamoDB](#设置-DynamoDB)
- [在 Deno Deploy 中创建项目](#在-Deno-Deploy中创建项目)
- [编写应用程序](#编写应用程序)
- [部署应用程序](#部署应用程序)

## 概览

我们将构建一个具有单个端点的 API，该端点接受 GET/POST 请求并返回相应的信息

```sh
对端点的 GET 请求应返回基于其标题的歌曲的详细信息。
GET /songs?title=歌曲标题 # '%20' == 空格
# 响应
{
  title: "歌曲标题"
  artist: "某人"
  album: "某物",
  released: "1970",
  genres: "乡村说唱",
}

# 对端点的 POST 请求应插入歌曲详细信息。
POST /songs
# POST 请求主体
{
  title: "新标题"
  artist: "某人新"
  album: "新东西",
  released: "2020",
  genres: "乡村说唱",
}
```

## 设置 DynamoDB

在此过程中的第一步是生成用于以编程方式访问 DynamoDB 的 AWS 凭据。

生成凭据：

1. 转到 https://console.aws.amazon.com/iam/，然后转到“用户”部分。
2. 单击 **添加用户** 按钮，填写 **用户名** 字段（可以使用 `denamo`），然后选择
   **程序化访问** 类型。
3. 单击 **下一步：权限**，然后单击 **直接附加现有策略**，搜索
   `AmazonDynamoDBFullAccess`，然后选择它。
4. 单击 **下一步：标签**，然后单击 **下一步：审核**，最后单击 **创建用户**。
5. 单击 **下载 .csv** 按钮以下载凭据。

创建数据库表：

1. 转到 https://console.aws.amazon.com/dynamodb，然后单击 **创建表** 按钮。
2. 在 **表名** 字段中填写 `Songs`，在 **主键** 字段中填写 `title`。
3. 向下滚动，然后单击 **创建**。就这样。

## 在 Deno Deploy 中创建项目

1. 转到
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后单击 **创建**。
2. 现在单击项目页面上可用的 **设置** 按钮。
3. 转到 **环境变量** 部分，然后添加以下机密信息。

- `AWS_ACCESS_KEY_ID` - 使用下载的 CSV 中 **访问密钥 ID** 列下的值。
- `AWS_SECRET_ACCESS_KEY` - 使用下载的 CSV 中 **秘密访问密钥** 列下的值。

现在单击项目名称以返回项目仪表板。保持此选项卡打开，因为稍后将在部署步骤中返回这里。

## 编写应用程序

```js
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
// AWS 拥有一个官方 SDK，可与浏览器一起使用。由于大多数 Deno Deploy 的 API 与浏览器的 API 相似，因此相同的 SDK 可与 Deno Deploy 一起使用。
// 因此，我们导入 SDK 以及用于插入和检索数据的一些所需类。
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://cdn.skypack.dev/@aws-sdk/client-dynamodb?dts";

// 通过提供区域信息创建客户端实例。
// 凭证是从我们在 Deno Deploy 上创建项目时设置的环境变量中获取的。
const client = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  },
});

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // 该端点允许 GET 和 POST 请求。GET 请求要求有名为 "title" 的参数才能处理。要处理 POST 请求，需要提供下面定义的字段的主体。
  // validateRequest 确保请求满足所提供的条件。
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
      // 当我们想要与 DynamoDB 互动时，我们使用客户端实例发送命令。在这里，我们发送了一个 PutItemCommand 以插入来自请求的数据。
      const {
        $metadata: { httpStatusCode },
      } = await client.send(
        new PutItemCommand({
          TableName: "Songs",
          Item: {
            // 这里的'S'表示值的类型为字符串，'N'表示数字。
            title: { S: body.title },
            artist: { S: body.artist },
            album: { S: body.album },
            released: { N: body.released },
            genres: { S: body.genres },
          },
        }),
      );

      // 在成功的插入项请求上，Dynamo 返回 200 状态代码（奇怪）。因此，我们测试状态代码以验证数据是否已插入，并以请求提供的数据作为确认进行响应。
      if (httpStatusCode === 200) {
        return json({ ...body }, { status: 201 });
      }
    } catch (error) {
      // 如果在进行请求时出现问题，我们

会记录错误以供参考。
      console.log(error);
    }

    // 如果执行到这里，意味着插入未成功。
    return json({ error: "无法插入数据" }, { status: 500 });
  }

  // 处理 GET 请求。
  try {
    // 我们从请求中获取标题，并发送 GetItemCommand 以检索有关歌曲的信息。
    const { searchParams } = new URL(request.url);
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: "Songs",
        Key: {
          title: { S: searchParams.get("title") },
        },
      }),
    );

    // 项目属性包含所有数据，因此如果它不是未定义的，我们将继续返回有关标题的信息。
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

  // 如果在请求数据库期间抛出错误或数据库中找不到项目，可能会到达这里。
  // 我们使用通用消息反映这两种情况。
  return json(
    {
      message: "找不到标题",
    },
    { status: 404 },
  );
}
```

## 部署应用程序

既然一切就绪，让我们开始部署应用程序。

步骤：

1. 转到 https://gist.github.com/new，然后使用上面的代码创建一个新的
   gist（确保文件以 `.js` 结尾）。
   > 为了方便起见，代码还托管在 https://deno.com/examples/dynamo.js
   > 上，因此如果您只想尝试上面的示例而不对其进行更改，可以跳过创建 gist。
2. 转到 Deno Deploy 中先前创建的项目仪表板。
3. 单击 **部署 URL**，然后粘贴 gist 的原始链接。
4. 单击 **部署**，并复制显示在 **域** 部分下的 URL。

让我们测试 API。

POST 一些数据。

```sh
curl --request POST --data \
'{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "乡村说唱, 流行"}' \
--dump-header - https://<project_name>.deno.dev/songs
```

获取有关标题的信息。

```sh
curl https://<project_name>.deno.dev/songs?title=Old%20Town%20Road
```

祝贺您学会了如何在 Deno Deploy 中使用 DynamoDB！

---

[![部署 DynamoDB 示例](/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.com/examples/dynamo.js&env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY)
