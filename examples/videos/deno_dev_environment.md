---
title: "您的 Deno 开发环境"
url: /examples/deno_dev_environment/
videoUrl: https://www.youtube.com/watch?v=BFfrGrLm2tw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=3
layout: video.tsx
---

## 视频描述

如何为 Deno 设置您的开发环境

## 文字稿和代码

要安装 Deno，我们将运行 curl。所以我们将从文档中获取这个 curl 命令。

```shell
curl -fsSL https://deno.land/install.sh | sh
```

我们将打开终端，粘贴该命令，按下回车，这将在后台安装最新版本的
Deno。当我执行此操作时，它会询问我是否要将 Deno
添加到路径中。我们将选择是，您可以在此处添加这些设置补全。

现在我们已经将其安装到路径中。如果您使用的是
Windows，文档中提供了适用于您的安装说明。

要从头生成一个 Deno 项目，让我们继续输入
`deno init MyDenoProject`。这将为我创建该文件夹。然后我可以 cd
进入该文件夹。现在如果我们在 VSCode 中打开它，这将创建一个 `deno.json`
文件、一个 `main_test.ts` 文件和一个 `main.ts`
文件。所以这是一个快速入门的方法。

如果您使用的是
VSCode，有一些配置选项您需要设置。所以我们将在这里转到代码和设置。我们将选择扩展。所以在您的扩展中，您将搜索
Deno，然后我们将选择由 Denoland 创建的那个。

```javascript
{
  "deno.enable": true,
}
```

我们将运行安装，这将安装我们的 Deno land 扩展。接下来我们将输入
`command shift P`。这将打开我们的命令面板，我们可以输入
`deno initialize workspace configuration`。我们将继续点击它。这将生成这个带有设置的
VSCode 文件夹。这将在此代码编辑器中启用提示和自动补全等功能。所以如果我开始输入
`deno serve`，例如，这将让我查看该函数的预期参数。这非常有帮助。

这还将为我们提供导入时的提示。所以我们将说从 JSR 导入星号作为路径。

```javascript
import * as path from "jsr:@std/path";
```

所以它们都列在那里。非常酷。然后如果我们想为远程模块做一些事情，比如从
[https://deno.land/x/openai@v4.67.1/mod.ts](https://deno.land/x/openai@v4.67.1/mod.ts)
导入 OpenAI（或者现在更好的是从 [JSR](https://jsr.io/@openai/openai) 导入）

```javascript
import OpenAI from "jsr:@openai/openai";
```

这将为我们提供标准库以及 X 的所有第三方 API。所以您实际上可以从此处深入查看
OpenAI。您只需要选择版本，所以我们将说 OpenAI at
v461。然后您甚至可以深入查看该单个文件。

如果您查看这里的文档，这将指导您完成设置您自己独特环境的过程。有您可以添加的
shell 补全，所以根据您使用的 CLI 工具，您可以在此处设置它，无论是 Bash 还是
PowerShell 或 ZShell 或其他任何工具。
