# API 服务与 Firestore（Firebase）

Firebase 是由 Google 开发的平台，用于创建移动和 Web 应用程序。您可以使用
Firestore 在平台上持久保存数据。在本教程中，让我们看看如何使用它来构建一个小型
API，该 API 具有用于插入和检索信息的端点。

- [概述](#overview)
- [概念](#concepts)
- [设置 Firebase](#setup-firebase)
- [编写应用程序](#write-the-application)
- [部署应用程序](#deploy-the-application)

## 概述

我们将构建一个具有单个端点的 API，该端点接受 `GET` 和 `POST` 请求，并返回信息的
JSON 有效负载：

```sh
不带任何子路径的端点的 GET 请求应返回商店中所有歌曲的详细信息：
GET /songs
# 响应
[
  {
    title: "歌曲标题",
    artist: "某人",
    album: "某物",
    released: "1970",
    genres: "乡村说唱",
  }
]

# 带有标题子路径的端点的 GET 请求应基于其标题返回歌曲的详细信息。
GET /songs/Song%20Title # '%20' == 空格
# 响应
{
  title: "歌曲标题"
  artist: "某人"
  album: "某物",
  released: "1970",
  genres: "乡村说唱",
}

# POST 请求应插入歌曲详细信息。
POST /songs
# POST 请求主体
{
  title: "新标题"
  artist: "新某人"
  album: "新某物",
  released: "2020",
  genres: "乡村说唱",
}
```

在本教程中，我们将执行以下操作：

- 创建并设置 [Firebase 项目](https://console.firebase.google.com/)。
- 使用文本编辑器创建我们的应用程序。
- 创建 [gist](https://gist.github.com/) 以 "托管" 我们的应用程序。
- 在 [Deno Deploy](https://dash.deno.com/) 上部署我们的应用程序。
- 使用 [cURL](https://curl.se/) 测试我们的应用程序。

## 概念

有一些概念有助于理解我们在本教程的其余部分采用的特定方法，也有助于扩展应用程序。如果您愿意，您可以直接跳到
[设置 Firebase](#setup-firebase)。

### 部署类似于浏览器

尽管部署在云中运行，但在许多方面，它提供的 API 是基于 Web 标准的。因此，在使用
Firebase 时，Firebase API 与 Web 更兼容，而不是针对服务器运行时设计的
API。这意味着在本教程中，我们将使用 Firebase Web 库。

### Firebase 使用 XHR

Firebase 使用 Closure 的
[WebChannel](https://google.github.io/closure-library/api/goog.net.WebChannel.html)
周围的包装器，WebChannel 最初是基于
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
构建的。虽然 WebChannel 支持更现代的 `fetch()` API，但当前版本的 Firebase for
Web 并不统一使用 `fetch()` 来实例化 WebChannel，而是使用 `XMLHttpRequest`。

虽然部署类似于浏览器，但它不支持 `XMLHttpRequest`。`XMLHttpRequest`
是一个具有多个限制和功能的 "传统" 浏览器
API，这些功能在部署中很难实现，这意味着部署不太可能实现该 API。

因此，在本教程中，我们将使用提供了足够 `XMLHttpRequest`
功能集的有限_填充_，以允许 Firebase/WebChannel 与服务器通信。

### Firebase 身份验证

Firebase 提供了相当多的
[身份验证选项](https://firebase.google.com/docs/auth)。在本教程中，我们将使用电子邮件和密码身份验证。

当用户登录时，Firebase 可以保持该身份验证。由于我们使用 Firebase 的 Web
库，因此在本地存储、会话存储或不存储的情况下，可以将身份验证保持下来。

在部署上下文中，情况有点不同。部署部署将保持
"活动状态"，这意味着在某些请求的内存状态从请求到请求将存在，但在各种条件下，可以启动或关闭新的部署。目前，部署不提供除内存分配以外的任何持久性。此外，它目前不提供全局的
`localStorage` 或 `sessionStorage`，这是 Firebase 用来存储身份验证信息的。

为了减少重新身份验证的需要，但又确保我们可以支持单个部署的多用户，我们将使用一个填充，允许我们提供
`localStorage` 接口以便 Firebase 可以将信息存储为客户端的 cookie。

## 设置 Firebase

[Firebase](https://firebase.google.com/) 是一个功能丰富的平台。Firebase
管理的所有细节都超出了本教程的范围。我们将涵盖本教程所需的内容。

1. 在 [Firebase 控制台](https://console.firebase.google.com/) 下创建一个新项目。
2. 将 Web 应用程序添加到您的项目中。记下在设置向导中提供的
   `firebaseConfig`。它应该类似于下面的内容。我们将在稍后使用它：

```js
var firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "example-12345.firebaseapp.com",
  projectId: "example-12345",
  storageBucket: "example-12345.appspot.com",
  messagingSenderId: "1234567890",
  appId: "APPID",
};
```

3. 在管理控制台中的 `身份验证` 下，您将希望启用 `电子邮件/密码` 登录方法。
4. 您将希望在 `身份验证` 下的 `用户`

部分添加用户和密码，记下以后要使用的值。 5. 在您的项目中添加
`Firestore数据库`。控制台将允许您设置_生产模式_或_测试模式_。您可以自行配置，但_生产模式_将要求您设置更多的安全规则。
6. 在数据库中添加一个名为 `songs`
的集合。这将要求您至少添加一个文档。只需将文档设置为_自动 ID_。

_注意_，根据您的 Google 帐户的状态，可能还需要执行其他设置和管理步骤。

```js
const users = new Map();
```

让我们创建我们的中间件路由器，并创建三个不同的中间件处理程序来支持 `/songs` 的
`GET` 和 `POST`，以及 `/songs/{title}` 上的 `GET`：

```js
const router = new Router();

// 返回集合中的所有歌曲
router.get("/songs", async (ctx) => {
  const querySnapshot = await db.collection("songs").get();
  ctx.response.body = querySnapshot.docs.map((doc) => doc.data());
  ctx.response.type = "json";
});

// 返回匹配标题的第一个文档
router.get("/songs/:title", async (ctx) => {
  const { title } = ctx.params;
  const querySnapshot = await db.collection("songs").where("title", "==", title)
    .get();
  const song = querySnapshot.docs.map((doc) => doc.data())[0];
  if (!song) {
    ctx.response.status = 404;
    ctx.response.body = `未找到标题为"${ctx.params.title}"的歌曲。`;
    ctx.response.type = "text";
  } else {
    ctx.response.body = querySnapshot.docs.map((doc) => doc.data())[0];
    ctx.response.type = "json";
  }
});

function isSong(value) {
  return typeof value === "object" && value !== null && "title" in value;
}

// 删除具有相同标题的歌曲并添加新歌曲
router.post("/songs", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.throw(Status.BadRequest, "必须是 JSON 文档");
  }
  const song = await body.value;
  if (!isSong(song)) {
    ctx.throw(Status.BadRequest, "负载格式不正确");
  }
  const querySnapshot = await db
    .collection("songs")
    .where("title", "==", song.title)
    .get();
  await Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete()));
  const songsRef = db.collection("songs");
  await songsRef.add(song);
  ctx.response.status = Status.NoContent;
});
```

好了，我们快要完成了。我们只需创建我们的中间件应用程序，并添加我们导入的
`localStorage` 中间件：

```js
const app = new Application();
app.use(virtualStorage());
```

然后我们需要添加中间件以验证用户。在本教程中，我们只是从我们将设置的环境变量中获取用户名和密码，但这可以很容易地适应将用户重定向到登录页面：

```js
app.use(async (ctx, next) => {
  const signedInUid = ctx.cookies.get("LOGGED_IN_UID");
  const signedInUser = signedInUid != null ? users.get(signedInUid) : undefined;
  if (!signedInUid || !signedInUser || !auth.currentUser) {
    const creds = await auth.signInWithEmailAndPassword(
      Deno.env.get("FIREBASE_USERNAME"),
      Deno.env.get("FIREBASE_PASSWORD"),
    );
    const { user } = creds;
    if (user) {
      users set(user.uid, user);
      ctx.cookies.set("LOGGED_IN_UID", user.uid);
    } else if (signedInUser && signedInUid.uid !== auth.currentUser?.uid) {
      await auth.updateCurrentUser(signedInUser);
    }
  }
  return next();
});
```

现在让我们将我们的路由器添加到中间件应用程序，并将应用程序设置为监听端口 8000：

```js
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
```

现在我们有一个应用程序，应该可以为我们提供 API。

在 Deno Deploy 中创建一个项目

1. 前往
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后在 **从命令行部署** 下选择 **+ 空项目**。
2. 单击项目页面上的 **设置** 按钮。
3. 转到 **环境变量** 部分，添加以下内容：

   <dl>
    <dt> <code> FIREBASE_USERNAME </code> </dt>
    <dd> 上面添加的 Firebase 用户（电子邮件地址）。</dd>
    <dt> <code> FIREBASE_PASSWORD </code> </dt>
    <dd> 上面添加的 Firebase 用户密码。</dd>
    <dt> <code> FIREBASE_CONFIG </code> </dt>
    <dd> Firebase 应用程序的配置，以 JSON 字符串的形式。</dd>
   </dl>

配置必须是一个有效的 JSON
字符串，以便应用程序能够读取。如果在设置时给出的代码片段如下所示：

```js
var firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "example-12345.firebaseapp.com",
  projectId: "example-12345",
  storageBucket: "example-12345.appspot.com",
  messagingSenderId: "1234567890",
  appId: "APPID",
};
```

那么你需要将字符串的值设置为以下内容（注意，不需要空格和新行）：

```json
{
  "apiKey": "APIKEY",
  "authDomain": "example-12345.firebaseapp.com",
  "projectId": "example-12345",
  "storageBucket": "example-12345.appspot.com",
  "messagingSenderId": "1234567890",
  "appId": "APPID"
}
```

部署应用程序

现在让我们部署应用程序：

1. 前往 https://gist.github.com/new，创建一个新的 gist，确保 gist 的文件名以
   `.js` 结尾。

> 为了方便起见，整个应用程序托管在
> https://deno.com/examples/firebase.js。如果您想尝试不进行任何修改的示例，可以跳过创建
> gist，或单击教程底部的链接。

2. 复制已保存的 gist 的 _Raw_ 链接。
3. 在 `dash.deno.com` 上的项目中，单击 **部署 URL** 按钮，并在 URL
   字段中输入原始 gist 的链接。
4. 单击 **部署** 按钮，并复制项目面板的 **域** 部分中显示的 URL 之一。

现在，让我们测试我们的 API。

我们可以创建一首新歌：

```sh
curl --request POST \
  --header "Content-Type: application/json" \
  --data '{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}'

 \
  --dump-header \
  - https://<project_name>.deno.dev/songs
```

然后，我们可以获取我们收藏中的所有歌曲：

```sh
curl https://<project_name>.deno.dev/songs
```

最后，我们可以获取我们创建的标题的具体信息：

```sh
curl https://<project_name>.deno.dev/songs/Old%20Town%20Road
```

---

[![部署 Firebase 示例](/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.com/examples/firebase.js&env=FIREBASE_USERNAME,FIREBASE_PASSWORD,FIREBASE_CONFIG)
