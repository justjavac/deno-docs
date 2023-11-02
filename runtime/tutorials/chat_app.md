# WebSocket 聊天应用

在本教程中，我们将使用 Deno
创建一个简单的聊天应用。我们的聊天应用将允许多个聊天客户端连接到同一后端，通过
WebSocket
发送群组消息。客户端选择用户名后，他们可以开始向其他在线客户端发送群组消息。每个客户端还会显示当前活动用户列表。

![未命名](../manual/images/chat_app_render.png)

## 构建视图

我们可以使用以下内容构建上面显示的简单用户界面，将以下内容作为我们的
`index.html`。请注意，`app.js` 脚本是我们的聊天客户端（稍后将详细讨论）。

```html
<!-- index.html -->

<html>
  <head>
    <title>聊天应用</title>
    <script src="/public/app.js"></script>
  </head>
  <body>
    <div style="text-align: center">
      <div>
        <b>用户</b>
        <hr />
        <div id="users"></div>
        <hr class="visible-xs visible-sm" />
      </div>
      <div>
        <input id="data" placeholder="发送消息" />
        <hr />
        <div id="conversation"></div>
      </div>
    </div>
  </body>
</html>
```

## **WebSocket** 入门

在构建客户端和服务器时，我们将依赖于 Deno 对 WebSocket 的本地支持。WebSocket
是一种双向通信通道，允许客户端和服务器随时相互发送消息。WebSocket
在需要低延迟的实时应用中经常使用。我们的每个客户端将保持与服务器的 WebSocket
连接，以便它们可以接收最新的消息和用户登录信息，而无需不断轮询。

## 聊天客户端

聊天客户端 `app.js` 在浏览器中运行，监听来自服务器的更新，然后操作
DOM。具体来说，我们的客户端会监听新消息和当前活动用户列表。我们需要向客户端的
WebSocket 添加事件处理程序，以指定客户端接收新消息或事件时会发生什么。

```jsx
// app.js

const myUsername = prompt("请输入您的用户名") || "匿名";
const socket = new WebSocket(
  `ws://localhost:8080/start_web_socket?username=${myUsername}`,
);

socket.onmessage = (m) => {
  const data = JSON.parse(m.data);

  switch (data.event) {
    case "update-users":
      // 刷新显示的用户列表
      let userListHtml = "";
      for (const username of data.usernames) {
        userListHtml += `<div> ${username} </div>`;
      }
      document.getElementById("users").innerHTML = userListHtml;
      break;

    case "send-message":
      // 显示新的聊天消息
      addMessage(data.username, data.message);
      break;
  }
};

function addMessage(username, message) {
  // 显示新消息
  document.getElementById(
    "conversation",
  ).innerHTML += `<b> ${username} </b>: ${message} <br/>`;
}

// 页面加载时
window.onload = () => {
  // 当客户端按下回车键时
  document.getElementById("data").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const inputElement = document.getElementById("data");
      var message = inputElement.value;
      inputElement.value = "";
      socket.send(
        JSON.stringify({
          event: "send-message",
          message: message,
        }),
      );
    }
  });
};
```

## 聊天服务器

[oak](https://deno.land/x/oak@v11.1.0) 是我们将用来设置服务器的 Deno
中间件框架。当用户首次访问站点时，我们的服务器将返回先前显示的纯 `index.html`
文件。我们的服务器还公开了 `ws_endpoint/` 端点，聊天客户端将使用该端点创建他们的
WebSocket 连接。请注意，服务器通过 HTTP 的
[协议升级机制](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism)
将客户端的初始 HTTP 连接转换为 WebSocket
连接。我们的服务器将维护与每个活动客户端的 WebSocket
连接，并告知他们当前活动的用户。我们的服务器还会在有新消息时向所有活动客户端广播消息，以便每个客户端可以显示它。

```jsx
// server.js

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const connectedClients = new Map();

const app = new Application();
const port = 8080;
const router = new Router();

// 向所有连接的客户端发送消息
function broadcast(message) {
  for (const client of connectedClients.values()) {
    client.send(message);
  }
}

// 向所有连接的客户端发送更新后的用户列表
function broadcast_usernames() {
  const usernames = [...connectedClients.keys()];
  console.log(
    "向所有客户端发送更新后的用户名列表：" +
      JSON.stringify(usernames),
  );
  broadcast(
    JSON.stringify({
      event: "update-users",
      usernames: usernames,
    }),
  );
}

router.get("/start_web_socket", async (ctx) => {
  const socket = await ctx.upgrade();
  const username = ctx.request.url.searchParams.get("username");
  if (connectedClients.has(username)) {
    socket.close(1008, `用户名 ${username} 已经被占用`);
    return;
  }
  socket.username = username;
  connectedClients.set(username, socket);
  console.log(`新客户端已连接：${username}`);

  // 当新用户登录时，广播活动用户列表
  socket.onopen = () => {
    broadcast_usernames();
  };

  // 当客户端断开连接时，从连接的客户端列表中删除他们，并广播活动用户列表
  socket.onclose = () => {
    console.log(`客户端 ${socket.username} 断开连接`);
    connectedClients.delete(socket.username);
    broadcast_usernames();
  };

  // 如果有人发送新消息，则广播新消息
  socket.onmessage = (m) => {
    const data = JSON.parse(m.data);
    switch (data.event) {
      case "send-message":
        broadcast(
          JSON.stringify({
            event: "send-message",
            username: socket.username,
            message: data.message,
          }),
        );
        break;
    }
  };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/`,
    index: "public/index.html",
  });
});

console.log("在 http://localhost:" + port + " 上监听");
await app.listen({ port });
```

我们可以使用以下命令启动服务器。请注意，由于 Deno
默认是安全的，因此我们需要明确授予文件系统和网络访问权限。

```sh
deno run --allow-read --allow-net server.js
```

现在，如果访问
[http://localhost: 8080](http://localhost:8080/)，您将能够开始聊天会话。您可以同时打开
2 个窗口，尝试与自己聊天。

## 示例代码

您可以在 [此处](https://github.com/awelm/deno-chat-app) 找到完整的示例代码。
