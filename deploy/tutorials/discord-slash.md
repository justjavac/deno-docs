---
title: "Discord 斜杠命令"
oldUrl:
  - /deploy/docs/discord-slash/
---

Discord 有一个新功能叫做 **斜杠命令**。它们允许你输入 `/`
后跟一个命令名称来执行某些操作。例如，你可以输入
`/giphy cats`（一个内置命令）来获取一些猫咪 gif。

Discord 斜杠命令的工作原理是，每当有人发出命令时，它会向一个 URL
发出请求。你不需要让你的应用程序一直运行才能使斜杠命令工作，这使得 Deno Deploy
成为构建此类命令的完美解决方案。

在这篇文章中，让我们看看如何使用 Deno Deploy 构建一个 hello world 斜杠命令。

## **步骤 1:** 在 Discord 开发者门户上创建一个应用程序

1. 访问
   [https://discord.com/developers/applications](https://discord.com/developers/applications)（如果需要，请使用你的
   Discord 账户登录）。
2. 点击位于你个人资料图片左侧的 **New Application** 按钮。
3. 为你的应用程序命名并点击 **Create**。
4. 进入 **Bot** 部分，点击 **Add Bot**，最后点击 **Yes, do it!** 进行确认。

就这样，一个新的应用程序被创建，它将承载我们的斜杠命令。不要关闭这个标签页，因为我们在开发过程中需要从这个应用程序页面获取信息。

## **步骤 2:** 向 Discord 应用程序注册斜杠命令

在我们编写代码之前，我们需要 curl 一个 Discord
端点来在我们的应用程序中注册一个斜杠命令。

将 `BOT_TOKEN` 替换为 **Bot** 部分中的令牌，将 `CLIENT_ID` 替换为页面 **General
Information** 部分中的 ID，然后在你的终端上运行以下命令。

```sh
BOT_TOKEN='replace_me_with_bot_token'
CLIENT_ID='replace_me_with_client_id'
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"hello","description":"Greet a person","options":[{"name":"name","description":"The name of the person","type":3,"required":true}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/commands"
```

这将注册一个名为 `hello` 的斜杠命令，它接受一个名为 `name` 的字符串类型参数。

## **步骤 3:** 在 Deno Deploy 上创建并部署 hello world 斜杠命令

接下来，我们需要创建一个服务器来在 Discord 发出带有某人斜杠命令的 POST
请求时进行响应。

1. 访问 https://dash.deno.com/new 并点击 **Playground** 卡片下的 **Play**。
2. 在下一页的编辑器中，点击顶部菜单中的 **Settings**
   图标。在弹出的模态框中，选择 **+ Add Variable**。
3. 输入 `DISCORD_PUBLIC_KEY` 作为 KEY。VALUE 应该是 Discord 应用程序页面
   **General Information** 部分中的公钥。
4. 将以下代码复制并粘贴到编辑器中：

   ```ts
   // Sift 是一个小型路由库，它抽象了诸如在端口上启动监听器之类的细节，并提供了一个简单的函数（serve），该函数具有为特定路径调用函数的 API。
   import {
     json,
     serve,
     validateRequest,
   } from "https://deno.land/x/sift@0.6.0/mod.ts";
   // TweetNaCl 是一个加密库，我们用它来验证来自 Discord 的请求。
   import nacl from "https://esm.sh/tweetnacl@v1.0.3?dts";

   // 对于所有到 "/" 端点的请求，我们希望调用 home() 处理程序。
   serve({
     "/": home,
   });

   // Discord 斜杠命令的主要逻辑定义在此函数中。
   async function home(request: Request) {
     // validateRequest() 确保请求是 POST 方法并具有以下标头。
     const { error } = await validateRequest(request, {
       POST: {
         headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
       },
     });
     if (error) {
       return json({ error: error.message }, { status: error.status });
     }

     // verifySignature() 验证请求是否来自 Discord。
     // 当请求的签名无效时，我们返回 401，这很重要，因为 Discord 会发送无效请求来测试我们的验证。
     const { valid, body } = await verifySignature(request);
     if (!valid) {
       return json(
         { error: "Invalid request" },
         {
           status: 401,
         },
       );
     }

     const { type = 0, data = { options: [] } } = JSON.parse(body);
     // Discord 执行 Ping 交互来测试我们的应用程序。
     // 请求中的类型 1 表示 Ping 交互。
     if (type === 1) {
       return json({
         type: 1, // 响应中的类型 1 是 Pong 交互响应类型。
       });
     }

     // 请求中的类型 2 是 ApplicationCommand 交互。
     // 它表示用户已发出命令。
     if (type === 2) {
       const { value } = data.options.find((option) => option.name === "name");
       return json({
         // 类型 4 用以下消息响应，保留用户的输入在顶部。
         type: 4,
         data: {
           content: `Hello, ${value}!`,
         },
       });
     }

     // 我们将返回一个错误请求错误，因为有效的 Discord 请求不应该到达这里。
     return json({ error: "bad request" }, { status: 400 });
   }

   /** 验证请求是否来自 Discord。 */
   async function verifySignature(
     request: Request,
   ): Promise<{ valid: boolean; body: string }> {
     const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
     // Discord 在每个请求中发送这些标头。
     const signature = request.headers.get("X-Signature-Ed25519")!;
     const timestamp = request.headers.get("X-Signature-Timestamp")!;
     const body = await request.text();
     const valid = nacl.sign.detached.verify(
       new TextEncoder().encode(timestamp + body),
       hexToUint8Array(signature),
       hexToUint8Array(PUBLIC_KEY),
     );

     return { valid, body };
   }

   /** 将十六进制字符串转换为 Uint8Array。 */
   function hexToUint8Array(hex: string) {
     return new Uint8Array(
       hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)),
     );
   }
   ```

5. 点击 **Save & Deploy** 以部署服务器。
6. 文件部署后，记下项目 URL。它将在编辑器的右上角，以 `.deno.dev` 结尾。

## **步骤 3:** 配置 Discord 应用程序以使用我们的 URL 作为交互端点 URL

1. 返回 Discord 开发者门户上的应用程序（Greeter）页面。
2. 将 **INTERACTIONS ENDPOINT URL** 字段填写为上面的 Deno Deploy 项目
   URL，然后点击 **Save Changes**。

应用程序现在已准备就绪。让我们继续下一部分来安装它。

## **步骤 4:** 在你的 Discord 服务器上安装斜杠命令

要使用 `hello` 斜杠命令，我们需要在我们的 Discord 服务器上安装我们的 Greeter
应用程序。以下是步骤：

1. 进入 Discord 开发者门户上 Discord 应用程序页面的 **OAuth2** 部分。
2. 选择 `applications.commands` 范围，然后点击下面的 **Copy** 按钮。
3. 现在粘贴并访问浏览器中的 URL。选择你的服务器并点击 **Authorize**。

打开 Discord，输入 `/hello Deno Deploy` 并按下 **Enter**。输出将如下所示。

![Hello, Deno Deploy!](../docs-images/discord-slash-command.png)

恭喜你完成了本教程！继续构建一些很棒的 Discord 斜杠命令吧！并在
[Deno Discord 服务器](https://discord.gg/deno) 的 **deploy** 频道中与我们分享。
