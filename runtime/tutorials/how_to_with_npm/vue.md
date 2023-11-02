# 如何在 Deno 中使用 Vue

[Vue](https://vuejs.org/) 是一款渐进式前端 JavaScript
框架，专为性能和多功能性而构建。

本教程将向您展示如何使用 Deno、Vite 和 Vue 创建一个简单的应用程序。

[查看源码](https://github.com/denoland/examples/tree/main/with-vue) 或
[查看视频教程](https://www.youtube.com/watch?v=MDPauM8fZDE)。

## 运行 `npm:create-vite-extra`

我们将使用 Vite 来创建我们的 Vue 应用程序。首先，运行：

```shell, ignore
deno run --allow-read --allow-write --allow-env npm:create-vite-extra@latest
```

为您的项目命名，然后选择 "deno-vue"。

然后，进入您的新项目并运行：

```shell, ignore
deno task dev
```

现在，您应该能够在浏览器中查看您的默认 Deno 和 Vue 应用程序：

![默认 Vue 应用程序](../../manual/images/how-to/vue/default-vue-app.png)

## 添加后端

下一步是添加后端 API。我们将创建一个非常简单的 API，用于返回有关恐龙的信息。

在目录中，让我们创建一个 `api` 文件夹。在该文件夹中，我们将创建一个 `main.ts`
文件，用于运行服务器，以及一个 `data.json` 文件，其中包含硬编码的数据。

```shell, ignore
mkdir api && touch api/data.json && touch api/main.ts
```

将
[此 JSON 文件](https://github.com/denoland/deno-vue-example/blob/main/api/data.json)
复制并粘贴到您的 `api/data.json` 中。

然后，让我们更新 `api/main.ts`：

```ts, ignore
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import data from "./data.json" assert { type: "json" };

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "欢迎访问恐龙API！";
  })
  .get("/api", (context) => {
    context.response.body = data;
  })
  .get("/api/:dinosaur", (context) => {
    if (context?.params?.dinosaur) {
      const found = data.find((item) =>
        item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
      );
      if (found) {
        context.response.body = found;
      } else {
        context.response.body = "没有找到恐龙。";
      }
    }
  });

const app = new Application();
app.use(oakCors()); // 为所有路由启用CORS
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

这是一个使用 [`oak`](https://deno.land/x/oak) 的非常简单的 API
服务器，根据路由返回恐龙信息。让我们启动 API 服务器：

```shell, ignore
deno run --allow-env --allow-net api/main.ts
```

如果我们访问 `localhost:8000/api`，我们会看到：

![恐龙的 JSON 响应](../../manual/images/how-to/vue/api-response.png)

到目前为止看起来很不错。

## 添加 Vue 组件

让我们更新 `src/components`。我们将添加以下文件：

- `HomePage.vue`，首页的组件
- `Dinosaurs.vue`，列出所有恐龙名称的组件，作为锚链接
- `Dinosaur.vue`，显示单个恐龙的名称和描述的组件

```shell, ignore
touch src/components/HomePage.vue src/components/Dinosaurs.vue src/components/Dinosaur.vue
```

在创建这些组件之前，让我们添加一些状态管理。

## 使用 `store` 维护状态

为了在 `<Dinosaur>` 和 `<Dinosaurs>` 组件之间保持状态，我们将使用
[Vue store](https://vuejs.org/manual/scaling-up/state-management.html)。对于更复杂的状态管理，可以查看
Vue 认可的 [Pinia](https://pinia.vuejs.org/) 库。

创建一个 `src/store.js` 文件：

```shell, ignore
touch src/store.js
```

并在其中添加以下内容：

```js, ignore
import { reactive } from "vue";

export const store = reactive({
  dinosaur: {},
  setDinosaur(name, description) {
    this.dinosaur.name = name;
    this.dinosaur.description = description;
  },
});
```

我们将在 `Dinosaurs.vue` 和 `Dinosaur.vue` 中导入
`store`，以设置和检索恐龙的名称和描述。

## 更新 Vue 组件

在 `Dinosaurs.vue` 中，我们将执行三个操作：

- 发送 `GET` 请求到我们的 API，并将其返回为 `dinosaurs`
- 遍历 `dinosaurs` 并在 `<router-link>` 中呈现每个 `dinosaur`，该链接指向
  `<Dinosaur>` 组件
- 在每个 `dinosaur` 的 `@click` 事件上添加 `store.setDinosaur()`，这将设置
  `store`

以下是完整的代码：

```tsx, ignore
<script>
import { ref } from 'vue'
import { store } from '../store.js'
export default ({
  async setup() {
    const res = await fetch("http://localhost:8000/api")
    const dinosaurs = await res.json();
    return {
      dinosaurs
    }
  },
  data() {
    return {
      store
    }
  }
})
</script>

<template>
  <div class="container">
    <div v-for="dinosaur in dinosaurs" class="dinosaur-wrapper">
      <span class="dinosaur">
        <router-link :to="{ name: 'Dinosaur', params: { dinosaur: `${dinosaur.name.toLowerCase()}` }}">
          <span @click="store.setDinosaur(dinosaur.name, dinosaur.description)">
            {{dinosaur.name}}
          </span>
        </router-link>
      </span>
    </div>
  </div>
</template>

<style scoped>
.dinosaur {
}
.dinosaur-wrapper {
  display: inline-block;
  margin: 0.15rem 1rem;
  padding: 0.15rem 1rem;
}
.container {
  text-align: left;
}
</style>
```

在 `Dinosaur.vue` 中，我们将添加：

- 导入 `store`
- 在 HTML 中呈现 `store.dinosaur`

```tsx, ignore
<script>
import { store

 from '../store.js';
export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>
  Name: {{ store.dinosaur.name }}
  <br />
  Description: {{ store.dinosaur.description }}
</template>
```

接下来，我们将更新 `HomePage.vue`。由于 `Dinosaurs` 组件需要从 API
中获取数据，我们将使用
[`<Suspense>`](https://vuejs.org/manual/built-ins/suspense.html)，它管理组件树中的异步依赖关系。

```tsx, ignore
<script>
import { ref } from 'vue'
import Dinosaurs from './Dinosaurs.vue'
export default {
  components: {
    Dinosaurs
  }
}
</script>

<template>
  <Suspense>
    <template #default>
      <Dinosaurs />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>

  <p>
    查看
    <a href="https://vuejs.org/manual/quick-start.html#local" target="_blank"
      >create-vue</a
    >，官方的Vue + Vite入门
  </p>
  <p class="read-the-docs">了解如何使用Deno和Vite。</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
```

将所有内容联系起来，让我们更新 `src/App.vue`：

```tsx, ignore
<template>
  <router-view />
</template>;
```

## 添加路由

您会注意到我们已经使用了 `<router-link>` 和 `<router-view>`。这些组件属于
[`vue-router` 库](https://router.vuejs.org/)，我们需要在另一个文件中设置和配置它。

首先，让我们在 `vite.config.mjs` 文件中导入 `vue-router`：

```ts, ignore
import { defineConfig } from "npm:vite@^3.1.3";
import vue from "npm:@vitejs/plugin-vue@^3.2.39";

import "npm:vue@^3.2.39";
import "npm:vue-router@4";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});
```

接下来，让我们创建一个名为 `router` 的文件夹。在其中，我们将创建 `index.ts`
文件：

```
mkdir router && touch router/index.ts
```

在 `router/index.ts` 中，我们将创建
`router`，其中包含每个路由及其组件的信息，并将其导出。有关使用 `vue-router`
的更多信息，请查看他们的 [指南](https://router.vuejs.org/guide)。

```ts, ignore
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import Dinosaur from "../components/Dinosaur.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/:dinosaur",
    name: "Dinosaur",
    component: Dinosaur,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
```

接下来，在我们的 `src/main.ts`
文件中，该文件包含前端应用程序的所有逻辑，我们需要导入并使用 `router`：

```ts, ignore
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.ts";

const app = createApp(App);
app.use(router);
app.mount("#app");
```

让我们运行它，看看我们到目前为止得到了什么：

![单击恐龙以进入单个恐龙页面](../../manual/images/how-to/vue/vue-demo.gif)

太棒了！
