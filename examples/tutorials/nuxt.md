---
title: "使用 Deno 构建 Nuxt 应用"
url: /examples/nuxt_tutorial/
---

[Nuxt](https://nuxt.com/) 是一个基于 [Vue](https://vuejs.org/)
的框架，提供了一种直观的方式来创建全栈应用。它提供了基于文件的路由、多种渲染选项以及开箱即用的自动代码分割功能。凭借其模块化架构，Nuxt
通过提供结构化的方法来简化 Vue 应用的开发过程。

在本教程中，我们将使用 Deno 构建一个简单的 Nuxt
应用，该应用将显示恐龙列表，并允许你在点击名称时了解更多关于每种恐龙的信息：

- [搭建 Nuxt 应用](#scaffold-a-nuxt-app-with-deno)
- [设置服务器 API 路由](#setup-server-api-routes)
- [设置 Vue 前端](#setup-vue-frontend)
- [添加 Tailwind](#add-tailwind)
- [下一步](#next-steps)

你可以在 [repo](https://github.com/denoland/examples/tree/main/with-nuxt)
中找到本项目的代码。

## 使用 Deno 搭建 Nuxt 应用

我们可以使用 deno 创建一个新的 Nuxt 项目，如下所示：

```bash
deno -A npm:nuxi@latest init
```

我们将使用 Deno 来管理我们的包依赖，并从 npm 获取 Nuxt
包。这将创建一个具有以下项目结构的 nuxt-app：

```
NUXT-APP/
├── .nuxt/                   # Nuxt 构建目录
├── node_modules/           # Node.js 依赖
├── public/                 # 静态文件
│   ├── favicon.ico        
│   └── robots.txt         
├── server/                # 服务器端代码
│   └── tsconfig.json     
├── .gitignore            
├── app.vue               # 根 Vue 组件
├── nuxt.config.ts        # Nuxt 配置
├── package-lock.json     # NPM 锁定文件
├── package.json          # 项目清单
├── README.md            
└── tsconfig.json        # TypeScript 配置
```

## 设置服务器 API 路由

首先，我们创建提供恐龙数据的 API 路由。

我们的
[恐龙数据](https://github.com/denoland/examples/blob/main/with-nuxt/server/api/data.json)
将存放在服务器目录下的 `server/api/data.json` 中：

```json
// server/api/data.json

[
  {
    "name": "Aardonyx",
    "description": "An early stage in the evolution of sauropods."
  },
  {
    "name": "Abelisaurus",
    "description": "\"Abel's lizard\" has been reconstructed from a single skull."
  },
  {
    "name": "Abrictosaurus",
    "description": "An early relative of Heterodontosaurus."
  },
  ...
]
```

我们的数据将从此处提取。在完整的应用中，这些数据将来自数据库。

> ⚠️️ 在本教程中，我们硬编码了数据。但你可以连接到
> [多种数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
> 并
> [甚至使用像 Prisma 这样的 ORM](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
> 与 Deno 一起使用。

接下来，让我们为恐龙数据添加类型定义。我们将把它放在一个新的文件夹 `types` 中：

```tsx
// types/index.ts

export interface Dino {
  name: string;
  description: string;
}
```

我们将创建两个 API 路由来提供以下内容：

- 用于索引页面的完整恐龙列表
- 用于单个恐龙页面的单个恐龙信息

两者都将是 `*.get.ts` 文件，Nuxt 会自动将其转换为 API 端点以响应 GET
请求。[文件名约定决定了 HTTP 方法和路由路径](https://nuxt.com/docs/guide/directory-structure/server#matching-http-method)。

最初的 `dinosaurs.get.ts` 非常简单，并使用
[`defineCachedEventHandler`](https://nitro.build/guide/cache)
创建一个缓存端点以提高性能。该处理程序只需返回我们的完整恐龙数据数组，无需任何过滤：

```tsx
// server/api/dinosaurs.get.ts

import data from "./data.json" with { type: "json" };

export default defineCachedEventHandler(() => {
  return data;
});
```

单个恐龙的 `GET`
路由逻辑稍多。它从事件上下文中提取名称参数，执行不区分大小写的匹配以找到请求的恐龙，并包括对缺失或无效恐龙名称的适当错误处理。为了传递名称参数，我们将此路由命名为
`[name].get.ts`：

```tsx
// server/api/dinosaurs/[name].get.ts

import data from "../data.json";

export default defineCachedEventHandler((event) => {
  const name = getRouterParam(event, "name");

  if (!name) {
    throw createError({
      statusCode: 400,
      message: "No dinosaur name provided",
    });
  }

  const dinosaur = data.find(
    (dino) => dino.name.toLowerCase() === name.toLowerCase(),
  );

  if (!dinosaur) {
    throw createError({
      statusCode: 404,
      message: "Dinosaur not found",
    });
  }

  return dinosaur;
});
```

太棒了。当我们使用 `deno task dev` 运行服务器并将浏览器指向
`localhost:3000/api/dinosaurs` 时，我们可以看到显示所有恐龙的原始 JSON 响应：

![设置 API](./images/how-to/nuxt/nuxt-1.webp)

你也可以通过访问 `localhost:3000/api/dinosaurs/aardonyx` 来获取单个恐龙的数据。

![设置 API](./images/how-to/nuxt/nuxt-2.webp)

接下来，让我们使用 Vue 设置前端以显示索引页面和每个单独的恐龙页面。

## 设置 Vue 前端

我们希望在应用中设置两个页面：

- 一个索引页面，列出所有恐龙
- 一个单独的恐龙页面，显示我们选择的恐龙的更多信息。

首先创建索引页面。由于 Nuxt 使用
[文件系统路由](https://nuxt.com/docs/getting-started/routing)，让我们创建一个
`pages` 目录，并在其中创建我们的索引页面
`pages/index.vue`。为了获取数据，我们将使用 `useFetch` 组合式 API
来访问我们在上一节中创建的 API 端点：

```tsx
// pages/index.vue

<script setup lang="ts">
const { data: dinosaurs } = await useFetch("/api/dinosaurs");
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold mb-4">Welcome to the Dinosaur app</h1>
    <p class="mb-4">Click on a dinosaur below to learn more.</p>
    <ul class="space-y-2">
      <li v-for="dinosaur in dinosaurs" :key="dinosaur.name">
        <NuxtLink
          :to="'/' + dinosaur.name.toLowerCase()"
          class="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {{ dinosaur.name }}
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
```

对于显示每个恐龙信息的页面，让我们创建一个动态页面：`pages/[name].vue`。该页面使用
Nuxt 的
[动态路由参数](https://nuxt.com/docs/getting-started/routing#route-parameters)，其中文件名中的
`[name]` 可以在 JavaScript 中作为 `route.params.name` 访问。我们将使用
`useRoute` 组合式 API 来访问路由参数，并使用 `useFetch`
根据名称参数获取特定恐龙的数据：

```tsx
// pages/[name].vue

<script setup lang="ts">
const route = useRoute();
const { data: dinosaur } = await useFetch(
  `/api/dinosaurs/${route.params.name}`
);
</script>

<template>
  <main v-if="dinosaur">
    <h1 class="text-2xl font-bold mb-4">{{ dinosaur.name }}</h1>
    <p class="mb-4">{{ dinosaur.description }}</p>
    <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 hover:underline">
      Back to all dinosaurs
    </NuxtLink>
  </main>
</template>
```

接下来，我们必须将这些 Vue
组件连接起来，以便在访问域名的根目录时正确渲染它们。让我们更新目录根目录下的
`app.vue` 以提供应用的根组件。我们将使用
[`NuxtLayout`](https://nuxt.com/docs/api/components/nuxt-layout)
来保持一致的页面结构，并使用
[`NuxtPage`](https://nuxt.com/docs/api/components/nuxt-page) 进行动态页面渲染：

```tsx
// app.vue

<template>
  <NuxtLayout>
    <div>
      <nav class="p-4 bg-gray-100">
        <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">
          Dinosaur Encyclopedia
        </NuxtLink>
      </nav>

      <div class="container mx-auto p-4">
        <NuxtPage />
      </div>
    </div>
  </NuxtLayout>
</template>;
```

让我们使用 `deno task dev` 运行服务器，并查看 `localhost:3000` 上的效果：

<figure>

<video class="w-full" alt="Build a Nuxt app with Deno." autoplay muted loop playsinline src="./images/how-to/nuxt/nuxt-3.mp4"></video>

</figure>

看起来很棒！

## 添加 Tailwind

正如我们所说，我们将为这个应用添加一些样式。首先，我们将设置一个布局，该布局将使用
Nuxt 的布局系统通过 [插槽](https://vuejs.org/guide/components/slots)
提供一致的页面结构：

```tsx
// layouts/default.vue

<template>
  <div>
    <slot />
  </div>
</template>;
```

在这个项目中，我们还将使用 [tailwind](https://tailwindcss.com/)
进行一些基本设计，因此我们需要安装这些依赖项：

```bash
deno install -D npm:tailwindcss npm:postcss npm:autoprefixer
```

然后初始化 Tailwind：

```bash
deno -A npm:tailwindcss init
```

这将在我们目录的根目录下创建一个 `tailwind.config.js` 文件。让我们打开它并更新
`content` 部分以包含我们项目中的关键文件：

```tsx
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

接下来，让我们将 tailwind 工具添加到新的 css 文件 `assets/css/main.css` 中：

```tsx
// assets/css/main.css

base;
components;
utilities;
```

我们唯一需要做的另一件事是更新我们的 `nuxt.config.ts` 文件，以配置我们的 Nuxt
应用以兼容 Deno，启用开发工具，并设置 Tailwind CSS。

```tsx
// nuxt.config.ts

import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    preset: "deno",
  },

  app: {
    head: {
      title: "Dinosaur Encyclopedia",
    },
  },

  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2024-11-06",
});
```

## 运行我们的应用

然后我们可以使用以下命令运行我们的应用：

```bash
deno task dev
```

这将在 localhost:3000 启动应用：

<figure>

<video class="w-full" alt="Build a Nuxt app with Deno." autoplay muted loop playsinline src="./images/how-to/nuxt/nuxt-4.mp4"></video>

</figure>

我们完成了！

## 下一步

Nuxt 应用的下一步可能是使用 [Nuxt Auth](https://auth.nuxtjs.org/)
模块添加身份验证，使用 [Pinia](https://pinia.vuejs.org/) 实现状态管理，使用
[Prisma](https://docs.denohub.com/examples/prisma_tutorial/) 或
[MongoDB](https://docs.denohub.com/examples/mongoose_tutorial/)
添加服务器端数据持久化，并使用 Vitest
设置自动化测试。这些功能将使它在大型应用中具备生产就绪性。
