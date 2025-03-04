---
title: "Jupyter Kernel for Deno"
oldUrl: /runtime/manual/tools/jupyter/
---

Deno 内置了一个 Jupyter 内核，允许你编写 JavaScript 和 TypeScript；使用 Web 和
Deno API，并直接在交互式笔记本中导入 `npm` 包。

:::caution `deno jupyter` 始终以 `--allow-all` 运行

目前，所有在 Jupyter 内核中执行的代码都以 `--allow-all`
标志运行。这是一个临时限制，未来将会解决。

:::

## 快速开始

运行 `deno jupyter --unstable` 并按照说明操作。

你可以运行 `deno jupyter --unstable --install` 来强制安装内核。Deno 假设
`jupyter` 命令在你的 `PATH` 中可用。

完成安装过程后，Deno 内核将在 JupyterLab 和经典笔记本的笔记本创建对话框中可用：

![Jupyter 笔记本内核选择](../images/jupyter_notebook.png)

你可以在任何支持 Jupyter 笔记本的编辑器中使用 Deno Jupyter 内核。

### VS Code

- 安装
  [VSCode Jupyter 扩展](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
- 通过打开命令面板（Ctrl+Shift+P）并选择“创建：新建 Jupyter
  笔记本”来打开或创建一个笔记本文件。也可以通过手动创建一个带有“.ipynb”文件扩展名的文件来完成。
- 在新建或现有的笔记本上，点击创建新的 Jupyter 笔记本，选择“Jupyter
  内核”，然后选择 Deno

![在 VS Code 中选择 Deno](https://github.com/denoland/deno-docs/assets/836375/32f0ccc3-35f7-47e5-84f4-17c20a5b5732)

### JetBrains IDEs

Jupyter Notebooks 开箱即用。

## 富内容输出

`Deno.jupyter` 命名空间提供了辅助函数，用于在笔记本中显示富内容
[使用 Jupyter 支持的 MIME 类型](https://docs.jupyter.org/en/latest/reference/mimetype.html)。

---

提供富内容输出的最简单方法是返回一个具有 `[Symbol.for("Jupyter.display")]`
方法的对象。

该方法应返回一个映射 MIME 类型到要显示的值的字典。

```ts
{
  [Symbol.for("Jupyter.display")]() {
    return {
      // 纯文本内容
      "text/plain": "Hello world!",

      // HTML 输出
      "text/html": "<h1>Hello world!</h1>",
    }
  }
}
```

_返回纯文本和 HTML 输出的对象示例。_

:::info

你也可以使用 `Deno.jupyter.$display` 来代替 `Symbol.for("Jupyter.display")`

:::

这是一个常规函数，因此你可以使用任何你想要的库来格式化输出 - 例如，使用
`@std/fmt/colors` 来提供彩色输出：

```ts
import * as colors from "jsr:@std/fmt/colors";

{
  [Deno.jupyter.$display]() {
    return {
      "text/plain": colors.green("Hello world"),
    }
  }
}
```

你也可以使用 `Deno.jupyter.display` 函数直接显示 MIME 包：

```js
await Deno.jupyter.display({
  "text/plain": "Hello, world!",
  "text/html": "<h1>Hello, world!</h1>",
  "text/markdown": "# Hello, world!",
}, { raw: true });
```

![`Deno.jupyter.display` API 示例](../images/jupyter-display.png)

你的笔记本前端将根据其功能自动选择“最丰富”的 MIME 类型来显示。

---

`Deno.jupyter` 提供了几种用于常见媒体类型富内容输出的辅助方法。

`Deno.jupyter.html` 是一个标记模板，它将在笔记本中将提供的字符串渲染为 HTML。

```js
Deno.jupyter.html`<h1>Hello, world!</h1>
<h2>From Deno kernel</h2>
<p>Lorem ipsum <i>dolor</i> <b>sit</b> <u>amet</u></p>`;
```

![`Deno.jupyter.html` API 示例](../images/jupyter-html.png)

`Deno.jupyter.md` 是一个标记模板，它将在笔记本中将提供的字符串渲染为 Markdown
文档。

```js
Deno.jupyter
  .md`# Notebooks in TypeScript via Deno ![Deno logo](https://github.com/denoland.png?size=32)

**Interactive compute with Jupyter _built into Deno_!**`;
```

![`Deno.jupyter.md` API 示例](../images/jupyter-md.png)

`Deno.jupyter.svg` 是一个标记模板，它将在笔记本中将提供的字符串渲染为 SVG 图形。

```js
Deno.jupyter.svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>`;
```

![`Deno.jupyter.svg` API 示例](../images/jupyter-svg.png)

`Deno.jupyter.image` 是一个函数，它将渲染 JPG 或 PNG
图像。你可以传递文件路径，或已经读取的字节：

```js
Deno.jupyter.image("./cat.jpg");

const data = Deno.readFileSync("./dog.png");
Deno.jupyter.image(data);
```

## prompt 和 confirm API

你可以使用 `prompt` 和 `confirm` Web API 在笔记本中等待用户输入。

<figure>

<video class="w-full" alt="`confirm` 和 `prompt` API 示例" autoplay muted loop playsinline controls src="../images/jupyter-confirm-prompt.mp4"></video>

<figcaption><span style="font-family: monospace;">confirm</span> 和 <span style="font-family: monospace;">prompt</span> API 示例</figcaption>

</figure>

## IO pub 通道广播

`Deno.jupyter.broadcast` 允许向 IO pub
通道发布消息，以便在单元格评估时提供实时更新。

考虑这个示例，它在开始计算之前打印一条消息，并在计算完成后打印另一条消息：

```js
await Deno.jupyter.broadcast("display_data", {
  data: { "text/html": "<b>Processing...</b>" },
  metadata: {},
  transient: { display_id: "progress" },
});

// 假装我们正在进行昂贵的计算
await new Promise((resolve) => setTimeout(resolve, 1500));

await Deno.jupyter.broadcast("update_display_data", {
  data: { "text/html": "<b>Done</b>" },
  metadata: {},
  transient: { display_id: "progress" },
});
```

<figure>

<video class="w-full" alt="`Deno.jupyter.broadcast` API 示例" autoplay muted loop playsinline controls src="../images/jupyter-broadcast.mp4"></video>

<figcaption><span style="font-family: monospace;">Deno.jupyter.broadcast</span> API 示例</figcaption>

</figure>

## 示例

这里有一个使用 `@observablehq/plot` 生成图表的示例：

```ts
import { document, penguins } from "jsr:@ry/jupyter-helper";
import * as Plot from "npm:@observablehq/plot";

let p = await penguins();

Plot.plot({
  marks: [
    Plot.dot(p.toRecords(), {
      x: "culmen_depth_mm",
      y: "culmen_length_mm",
      fill: "species",
    }),
  ],
  document,
});
```

![使用 `@observablehq/plot` 库生成的示例图表](../images/jupyter-plot.png)

有关更多高级示例，请参阅 https://github.com/rgbkrk/denotebooks，这些示例利用了
Polars、Observable 和 d3 等数据分析和可视化库。

## `jupyter console` 集成

你也可以在 `jupyter console` REPL 中使用 Deno Jupyter 内核。为此，你应该使用
`jupyter console --kernel deno` 启动你的控制台。

![在 CLI 中使用 Deno 内核](../images/jupyter-cli.gif)
