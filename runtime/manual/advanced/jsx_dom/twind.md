# 使用 Twind 与 Deno

[Twind](https://twind.style/) 是一种在 [Tailwind](https://tailwindcss.com/)
中使用的 _tailwind-in-js_ 解决方案。Twind 在 Deno
的服务器环境中特别有用，可以轻松进行服务器端渲染，生成动态、高性能和高效的
CSS，同时具有使用 Tailwind 进行样式设计的便利性。

## 基本示例

在以下示例中，我们将使用 twind 来进行服务器端渲染一个 HTML
页面，并将其记录到控制台。它演示了如何使用分组的 tailwind
类，并仅使用文档中指定的样式进行渲染，无需客户端 JavaScript 来实现
_tailwind-in-js_:

```ts
import { extract, install } from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";

install({
  presets: [
    presetTailwind(),
    {
      theme: {
        fontFamily: {
          sans: ["Helvetica", "sans-serif"],
          serif: ["Times", "serif"],
        },
      },
    },
  ],
});

function renderBody() {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Hello from Deno</title>
      </head>
      <body class="font-sans">
        <h1 class="text(3xl blue-500)">Hello from Deno</h1>
        <form>
          <input name="user">
          <button class="text(2xl red-500)">
            Submit
          </button>
        </form>
      </body>
    </html>
  `;
}

function ssr() {
  const body = renderBody();
  const { html, css } = extract(body);
  return html.replace("</head>", `<style data-twind>${css}</style></head>`);
}

console.log(ssr());
```

https://twind.style/packages/@twind/core#extract
