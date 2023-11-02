# 如何在 Kinsta 上部署 Deno

[Kinsta 应用托管](https://kinsta.com/application-hosting)
是一个服务，允许您直接从 Git 存储库构建和部署您的 Web 应用程序。

## 准备您的应用程序

在 **Kinsta**，我们建议使用 [`deno-bin`](https://www.npmjs.com/package/deno-bin)
包来运行 Deno 应用程序。

为此，您的 `package.json` 应如下所示：

```json
{
  "name": "deno应用",
  "scripts": {
    "start": "deno run --allow-net index.js --port=${PORT}"
  },
  "devDependencies": {
    "deno-bin": "^1.28.2"
  }
}
```

## 示例应用程序

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";
import { parse } from "https://deno.land/std@$STD_VERSION/flags/mod.ts";

const { args } = Deno;
const argPort = parse(args).port ? Number(parse(args).port) : 8000;

serve((_req) => new Response("你好，世界"), { port: argPort });
```

应用程序本身很简单。重要的是不要硬编码 `PORT`，而是使用 **Kinsta**
提供的环境变量。

还有一个
[存储库](https://github.com/kinsta/hello-world-deno)，应该可以帮助您入门。

## 部署

1. 注册 [Kinsta 应用托管](https://kinsta.com/signup/?product_type=app-db)
   或直接登录 [我的 Kinsta](https://my.kinsta.com/) 管理面板。
2. 转到应用程序选项卡。
3. 连接您的 GitHub 存储库。
4. 单击 **添加服务 > 应用程序按钮**。
5. 按照向导步骤操作。
