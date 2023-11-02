# 连接到 Firebase

Firebase 是由 Google 开发的平台，用于创建移动和 Web
应用程序。其功能包括用于登录的身份验证原语和可以持久化数据的 NoSQL 数据存储
Firestore。

本教程涵盖了如何从部署在 Deno Deploy 上的应用程序连接到 Firebase。

您可以在 Firebase 上构建一个样本应用程序的更全面教程
[此处](../tutorials/tutorial-firebase)。

## 从 Firebase 获取凭据

> 本教程假设您已经在 Firebase 中创建了一个项目并向该项目添加了一个 Web
> 应用程序。

1. 转到 Firebase 中的项目，然后单击 **项目设置**。
2. 向下滚动，直到看到包含您的应用程序名称和一个包含 `firebaseConfig`
   对象的代码示例。它应该看起来类似于以下内容。请保存好这些信息，我们稍后会用到：

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

## 在 Deno Deploy 中创建项目

1. 转到
   [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请使用
   GitHub 登录），然后单击 **+ 空项目**，位于 **从命令行部署** 下。
2. 现在单击项目页面上可用的 **设置** 按钮。
3. 转到 **环境变量** 部分，然后添加以下内容：

   <dl>
    <dt> <code> FIREBASE_USERNAME </code> </dt>
    <dd> 在上面添加的 Firebase 用户（电子邮件地址）。</dd>
    <dt> <code> FIREBASE_PASSWORD </code> </dt>
    <dd> 在上面添加的 Firebase 用户密码。</dd>
    <dt> <code> FIREBASE_CONFIG </code> </dt>
    <dd> Firebase 应用程序配置，以 JSON 字符串形式提供。</dd>
   </dl>

   配置需要是有效的 JSON
   字符串，以便应用程序能够读取它。如果在设置时给出的代码片段如下所示：

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

   您需要将字符串值设置为以下内容（注意不需要空格和换行符）：

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

## 编写连接到 Firebase 的代码

我们首先需要导入 Firebase 需要在 Deploy 下工作的 `XMLHttpRequest` 模拟以及
`localStorage` 的模拟，以允许 Firebase 认证保持已登录用户：

```js
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
```

> ℹ️
> 我们在编写本教程时使用了包的当前版本。它们可能不是最新版本，您可能需要双重检查当前版本。

因为 Deploy 具有许多 Web 标准 API，所以最好在 Deploy 下使用 Firebase 的 Web
库。当前 Firebase 的 v9 仍处于 beta 阶段，因此我们将使用 v8：

```js
import firebase from "https://esm.sh/firebase@9.17.0/app";
import "https://esm.sh/firebase@9.17.0/auth";
import "https://esm.sh/firebase@9.17.0/firestore";
```

现在，我们需要设置我们的 Firebase
应用程序。我们将从之前设置的环境变量中获取配置，并获取我们将要使用的 Firebase
部分的引用：

```js
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

好了，我们差不多完成了。我们只需创建我们的中间件应用程序并添加我们导入的
`localStorage` 中间件：

```js
const app = new Application();
app.use(virtualStorage());
```

然后，我们需要添加用于验证用户的中间件。在本教程中，我们只是从我们将要设置的环境变量中获取用户名和密码，但这很容易适应为重定向用户到登录页面，如果他们未登录：

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
      users.set(user.uid, user);
      ctx.cookies.set("LOGGED_IN_UID", user.uid);
    } else if (signedInUser && signedInUid.uid !== auth.currentUser?.uid) {
      await auth.updateCurrentUser(signedInUser);
    }
  }
  return next();
});
```

## 将应用程序部署到 Deno Deploy

完成编写应用程序后，您可以将其部署到 Deno Deploy。

要执行此操作，请返回到项目页面，网址为
`https://dash.deno.com/projects/<project-name>`。

您应该看到一些部署选项：

- [GitHub 集成](ci_github)
- [`deployctl`](deployctl)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您想要添加构建步骤，我们

建议选择 GitHub 集成。

有关在 Deno Deploy 上部署的不同方式以及不同的配置选项的更多详细信息，请阅读
[此处](how-to-deploy)。
