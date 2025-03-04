---
title: "与 Node.js 的互操作性"
url: /examples/interoperability_with_nodejs/
videoUrl: https://www.youtube.com/watch?v=mgX1ymfqPSQ&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=2
layout: video.tsx
---

## 视频描述

Deno 在其 2.0 版本中获得了许多互操作性能力。在本视频中，我们将探讨如何使用
Node.js 内置 API、NPM 模块和 JSR 包。

## 文字记录和示例

[Deno 2.0](https://deno.com/blog/v2) 已经发布，它非常出色。Deno
最令人惊叹的功能之一是其与其他平台（包括
Node）的互操作性。例如，我们可以使用核心的 Node.js 内置
API。我们只需在此处添加这个 Node 标识符。

```ts
import { fs } from "node:fs/priomses";
```

Deno 还支持使用 NPM 模块。你只需在导入时添加 NPM 标识符即可。

```ts
import { * } as Sentry from "npm:@sentry/node";
```

我们还可以利用 [JSR](https://jsr.io)，这是一个为 TypeScript 和 JavaScript
提供的开源包注册表。

```ts
import OpenAI from "jsr:@openai/openai";
```

JSR 当然可以与 Deno 一起使用，也可以与 Node.js、bun 和 CloudFlare workers
一起使用。你甚至可以将 JSR 包安装到 Vite 和 Next.js 应用程序中。

Deno 还为我们提供了
[导入映射](https://docs.denohub.com/runtime/fundamentals/modules/#differentiating-between-imports-or-importmap-in-deno.json-and---import-map-option)，帮助我们管理依赖项。你可以从
JSR 安装一个包。导入将被添加到 `deno.json`
中，你甚至可以使用简写来描述这一点，以进一步清理你的代码。Deno 2.0
专注于提供非常稳定的开发者体验。使用 Deno，新项目和迁移感觉更加轻松。
