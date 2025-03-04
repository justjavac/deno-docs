---
title: "使用 Firestore (Firebase) 的 API 服务器"
oldUrl:
  - /deploy/docs/tutorial-firebase/
---

Firebase 是 Google 开发的用于创建移动和 Web 应用程序的平台。您可以使用 Firestore
在平台上持久化数据。在本教程中，我们将了解如何使用它来构建一个具有插入和检索信息端点的小型
API。

- [概述](#overview)
- [概念](#concepts)
- [设置 Firebase](#setup-firebase)
- [编写应用程序](#write-the-application)
- [部署应用程序](#deploy-the-application)

## 概述

我们将构建一个具有单个端点的 API，该端点接受 `GET` 和 `POST` 请求并返回信息的
JSON 负载：

```sh
# 不带任何子路径的 GET 请求应返回商店中所有歌曲的详细信息：
GET /songs
# 响应
[
  {
    title: "Song Title",
    artist: "Someone",
    album: "Something",
    released: "1970",
    genres: "country rap",
  }
]

# 带有标题子路径的 GET 请求应返回基于标题的歌曲详细信息。
GET /songs/Song%20Title # '%20' == 空格
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

在本教程中，我们将：

- 创建并设置 [Firebase 项目](https://console.firebase.google.com/)。
- 使用文本编辑器创建我们的应用程序。
- 创建一个 [gist](https://gist.github.com/) 来“托管”我们的应用程序。
- 在 [Deno Deploy](https://dash.deno.com/) 上部署我们的应用程序。
- 使用 [cURL](https://curl.se/) 测试我们的应用程序。

## 概念

有几个概念有助于理解为什么我们在教程的其余部分采取特定方法，并且可以帮助扩展应用程序。如果您愿意，可以跳到
[设置 Firebase](#setup-firebase)。

### Deploy 类似于浏览器

尽管 Deploy 在云中运行，但在许多方面，它提供的 API 基于 Web 标准。因此，在使用
Firebase 时，Firebase API 与 Web 的兼容性比那些为服务器运行时设计的 API
更高。这意味着我们将在本教程中使用 Firebase Web 库。

### Firebase 使用 XHR

Firebase 使用 Closure 的
[WebChannel](https://google.github.io/closure-library/api/goog.net.WebChannel.html)
的包装器，而 WebChannel 最初是围绕
[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
构建的。虽然 WebChannel 支持更现代的 `fetch()` API，但当前版本的 Firebase Web
并未统一使用 `fetch()` 支持实例化 WebChannel，而是使用 `XMLHttpRequest`。

尽管 Deploy 类似于浏览器，但它不支持 `XMLHttpRequest`。`XMLHttpRequest`
是一个“传统”浏览器 API，具有一些限制和功能，这些功能在 Deploy
中难以实现，这意味着 Deploy 不太可能实现该 API。

因此，在本教程中，我们将使用一个有限的 _polyfill_，它提供了足够的
`XMLHttpRequest` 功能集，以允许 Firebase/WebChannel 与服务器通信。

### Firebase 身份验证

Firebase 提供了相当多的
[身份验证选项](https://firebase.google.com/docs/auth)。在本教程中，我们将使用电子邮件和密码身份验证。

当用户登录时，Firebase 可以持久化该身份验证。因为我们使用的是 Firebase 的 Web
库，持久化身份验证允许用户离开页面并在返回时无需重新登录。Firebase
允许身份验证持久化在本地存储、会话存储或不持久化。

在 Deploy 上下文中，情况略有不同。Deploy
部署将保持“活动”状态，这意味着某些请求之间的内存状态将在请求之间保持，但在各种条件下，可能会启动或关闭新的部署。目前，Deploy
不提供任何内存分配之外的持久化。此外，它目前不提供全局的 `localStorage` 或
`sessionStorage`，而 Firebase 使用这些来存储身份验证信息。

为了减少重新身份验证的需要，同时确保我们可以支持多用户使用单个部署，我们将使用一个
polyfill，它允许我们为 Firebase 提供 `localStorage` 接口，但将信息存储为客户端的
cookie。

## 设置 Firebase

[Firebase](https://firebase.google.com/) 是一个功能丰富的平台。Firebase
管理的所有细节超出了本教程的范围。我们将介绍本教程所需的内容。

1. 在 [Firebase 控制台](https://console.firebase.google.com/) 下创建一个新项目。
2. 向您的项目添加一个 Web 应用程序。记下设置向导中提供的
   `firebaseConfig`。它应该类似于以下内容。我们稍后将使用它：

   ```js title="firebase.js"
   var firebaseConfig = {
     apiKey: "APIKEY",
     authDomain: "example-12345.firebaseapp.com",
     projectId: "example-12345",
     storageBucket: "example-12345.appspot.com",
     messagingSenderId: "1234567890",
     appId: "APPID",
   };
   ```

3. 在管理控制台的 `Authentication` 下，您需要启用 `Email/Password` 登录方法。
4. 您需要在 `Authentication` 下的 `Users`
   部分添加一个用户和密码，并记下稍后使用的值。
5. 向您的项目添加 `Firestore Database`。控制台将允许您以 _生产模式_ 或
   _测试模式_ 进行设置。您可以自行配置，但 _生产模式_
   需要您设置进一步的安全规则。
6. 向数据库添加一个名为 `songs` 的集合。这将要求您至少添加一个文档。只需使用
   _自动 ID_ 设置文档。

_注意_ 根据您的 Google 帐户状态，可能需要进行其他设置和管理步骤。

## 编写应用程序

我们希望在最喜欢的编辑器中创建一个 JavaScript 文件作为我们的应用程序。

我们要做的第一件事是导入 Firebase 在 Deploy 下工作所需的 `XMLHttpRequest`
polyfill，以及一个用于 `localStorage` 的 polyfill，以允许 Firebase
身份验证持久化登录用户：

```js title="firebase.js"
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
```

> ℹ️
> 我们使用的是撰写本教程时的当前版本包。它们可能不是最新的，您可能需要仔细检查当前版本。

由于 Deploy 具有许多 Web 标准 API，最好在 Deploy 下使用 Firebase 的 Web 库。目前
Firebase 的 v9 仍处于测试阶段，因此我们将在本教程中使用 v8：

```js title="firebase.js"
import firebase from "https://esm.sh/firebase@8.7.0/app";
import "https://esm.sh/firebase@8.7.0/auth";
import "https://esm.sh/firebase@8.7.0/firestore";
```

我们还将使用 [oak](https://deno.land/x/oak) 作为创建 API 的中间件框架，包括将
`localStorage` 值设置为客户端 cookie 的中间件：

```js title="firebase.js"
import {
  Application,
  Router,
  Status,
} from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { virtualStorage } from "https://deno.land/x/virtualstorage@0.1.0/middleware.ts";
```

现在我们需要设置我们的 Firebase
应用程序。我们将从稍后设置的环境变量中获取配置，键为
`FIREBASE_CONFIG`，并获取我们将使用的 Firebase 部分的引用：

```js title="firebase.js"
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

我们还将设置应用程序以处理每个请求的登录用户。因此，我们将创建一个用户映射，其中包含我们在此部署中之前登录的用户。虽然在本教程中我们只会有一个登录用户，但代码可以轻松适应允许客户端单独登录：

```js title="firebase.js"
const users = new Map();
```

让我们创建我们的中间件路由器，并创建三个不同的中间件处理程序来支持 `/songs` 的
`GET` 和 `POST` 以及对 `/songs/{title}` 的特定歌曲的 `GET`：

```js title="firebase.js"
const router = new Router();

// 返回集合中的任何歌曲
router.get("/songs", async (ctx) => {
  const querySnapshot = await db.collection("songs").get();
  ctx.response.body = querySnapshot.docs.map((doc) => doc.data());
  ctx.response.type = "json";
});

// 返回与标题匹配的第一个文档
router.get("/songs/:title", async (ctx) => {
  const { title } = ctx.params;
  const querySnapshot = await db.collection("songs").where("title", "==", title)
    .get();
  const song = querySnapshot.docs.map((doc) => doc.data())[0];
  if (!song) {
    ctx.response.status = 404;
    ctx.response.body = `The song titled "${ctx.params.title}" was not found.`;
    ctx.response.type = "text";
  } else {
    ctx.response.body = querySnapshot.docs.map((doc) => doc.data())[0];
    ctx.response.type = "json";
  }
});

function isSong(value) {
  return typeof value === "object" && value !== null && "title" in value;
}

// 删除具有相同标题的任何歌曲并添加新歌曲
router.post("/songs", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.throw(Status.BadRequest, "Must be a JSON document");
  }
  const song = await body.value;
  if (!isSong(song)) {
    ctx.throw(Status.BadRequest, "Payload was not well formed");
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

好的，我们快完成了。我们只需要创建我们的中间件应用程序，并添加我们导入的
`localStorage` 中间件：

```js title="firebase.js"
const app = new Application();
app.use(virtualStorage());
```

然后我们需要添加中间件来验证用户。在本教程中，我们只是从我们将设置的环境变量中获取用户名和密码，但这可以轻松适应如果用户未登录则重定向到登录页面：

```js title="firebase.js"
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
      users.set(user.uid, user);
      ctx.cookies.set("LOGGED_IN_UID", user.uid);
    } else if (signedInUser && signedInUid.uid !== auth.currentUser?.uid) {
      await auth.updateCurrentUser(signedInUser);
    }
  }
  return next();
});
```

现在让我们将我们的路由器添加到中间件应用程序，并将应用程序设置为监听端口 8000：

```js title="firebase.js"
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
```

现在我们有了一个应该提供我们的 API 的应用程序。

## 部署应用程序

现在我们已经准备好了一切，让我们部署您的新应用程序！

1. 在浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并链接您的
   GitHub 帐户。
2. 选择包含您新应用程序的存储库。
3. 您可以为您的项目命名或允许 Deno 为您生成一个名称
4. 在 Entrypoint 下拉菜单中选择 `firebase.js`
5. 点击 **Deploy Project**

为了使您的应用程序正常工作，我们需要配置其环境变量。

在您的项目成功页面或项目仪表板上，点击 **添加环境变量**。在环境变量下，点击 **+
添加变量**。创建以下变量：

1. `FIREBASE_USERNAME` - 上面添加的 Firebase 用户（电子邮件地址）
2. `FIREBASE_PASSWORD` - 上面添加的 Firebase 用户密码
3. `FIREBASE_CONFIG` - Firebase 应用程序的配置作为 JSON 字符串

配置需要是一个有效的 JSON
字符串才能被应用程序读取。如果设置时给出的代码片段如下所示：

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

您需要将字符串的值设置为以下内容（注意不需要空格和换行）：

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

点击保存变量。

现在让我们试试我们的 API。

我们可以创建一首新歌：

```sh
curl --request POST \
  --header "Content-Type: application/json" \
  --data '{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}' \
  --dump-header \
  - https://<project_name>.deno.dev/songs
```

我们可以获取集合中的所有歌曲：

```sh
curl https://<project_name>.deno.dev/songs
```

我们可以获取我们创建的标题的特定信息：

```sh
curl https://<project_name>.deno.dev/songs/Old%20Town%20Road
```
