---
title: "使用 JSR 发布模块"
url: /examples/publishing_modules_with_jsr/
videoUrl: https://www.youtube.com/watch?v=7uiL4WYvZVs&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=8
layout: video.tsx
---

## 文字稿和示例

[JSR](https://jsr.io) 是一个专门为现代 JavaScript 项目设计的注册表。JSR -
JavaScript 注册表 - 有一堆很酷的功能。但如果你之前用过
npm，你可能会想，“为什么我需要这个，为什么我需要再学一个这样的东西？”

- 首先，它是为 TypeScript 优化的。
- JSR 只支持 ES 模块。
- 最后，npm 是 Node 项目的集中式注册表，但还有其他运行时。显然有
  Deno，但你也可以在 Bun、Cloudflare workers 等中使用这些包。

可以把它想象成一个超集。JSR 并没有取代 npm，而是在它的基础上构建的。

所以在这里
[jsr.io](https://jsr.io)，你可以搜索任何你想要的东西。我正在寻找一个叫做 Oak
的库，它是一个用于处理 HTTP 请求的中间件框架。我会在这里搜索它，这将带我进入
[文档页面](https://jsr.io/@oak/oak)。

如果你想安装一个包，你只需要添加它：

```sh
deno add jsr:@oak/oak
```

然后我们可以在我们的文件中这样使用它。

```javascript
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const router = new Router();
router.get("/", (context) => {
  context.response.body = "HEY!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
```

很酷吧！但是发布我们自己的 JSR 包是什么感觉呢？实际上很棒。

JSR 包可以依赖于其他 JSR 包，也可以依赖于任何 npm 包。

让我们构建一个小库并将其发布到 JSR。还记得
[我们之前的 `sing` 函数](/examples/all-in-one_tooling/)，让我们把它变成一个可以被
JavaScript 社区其他人使用的函数。大家不客气。

```typescript
export function sing(
  phrase: string,
  times: number,
): string {
  return Array(times).fill(phrase).join(" ");
}

sing("la", 3);
```

现在如果我们
[前往 jsr.io，我们可以发布它](https://jsr.io/new)。我第一次尝试发布包时，JSR
会问我想要发布到哪个范围。我可以在这里创建它。

然后我会创建包名并按照说明操作。

让我们尝试在一个使用 Vite 的项目中使用我们的新包。以下命令将引导我们设置一个新的
Vite 项目。

```shell
deno run --allow-read --allow-write --allow-env npm:create-vite-extra@latest
```

现在我们可以通过将其添加到我们的项目中来导入我们的新包：

```shell
deno add jsr:@eveporcello/sing
```

然后在需要时导入它

```typescript
import { sing } from "@eveporcello/sing";
```

所以如果我要给自己打分，我甚至不需要给自己打分。[JSR 会给我打 29% 的分数](https://jsr.io/@eveporcello/sing/score)，我不知道。可能不太好。但这有一整列我可以做的改进。

我需要为我的包添加一个
readme。我需要添加示例。所有这些不同的东西。所以我可以在自己的时间里开发这个，以确保我在这里有
100 分，这样我的代码就得到了很好的文档记录，并且非常容易被其他开发者使用。
