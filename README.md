# Deno 中文文档

[docs.denohub.com](https://docs.denohub.com) 的源码。Deno 中文文档站点是使用
[Docusaurus 2](https://docusaurus.io/)
构建的，这是一种专为文档网站优化的静态站点生成器。

## 本地开发

由于 Docusaurus 是使用 Node.js 构建和维护的，因此建议在本地开发时安装
[Node.js 和 npm](https://nodejs.org/en/download)。一旦安装了 Node 和
npm，可以使用以下命令安装 Docusaurus 的依赖项：

```
npm install
```

然后，可以使用以下命令启动本地开发服务器：

```
npm start
```

这将在浏览器窗口中打开
[localhost:3000](http://localhost:3000)，您将在此处看到您所做的任何文档内容更改实时更新。

要在生产配置下测试生成的静态站点，运行：

```
npm run build
```

这将在本地生成一个静态站点到 `build` 文件夹。要测试生产服务器，运行此命令：

```
npm run serve
```

这将在 [localhost:8000](http://localhost:8000)
上启动一个服务器，您可以在此处预览站点。

有时，在更改 Docusaurus 配置后，您可能会遇到错误，需要清理 Docusaurus
生成的资产。您可以通过运行以下命令来解决大多数在重构站点时遇到的错误：

```
npm run clear
```

这将解决大多数在重构站点时遇到的错误。静态资源将从头开始重新构建，下次运行
`npm run build` 或 `npm start` 时会重新构建。

## 编辑内容

文档站点的实际内容主要位于以下三个文件夹中：

- `runtime` - Deno CLI / runtime 的文档
- `deploy` - Deno Deploy 云服务的文档
- `kv` - Deno KV，Deno 集成数据库的文档

大多数文件都是 [markdown](https://docusaurus.io/docs/markdown-features)
格式，但即使是 markdown 文件也会使用 [MDX](https://mdxjs.com/)
进行处理，这使您可以在 markdown 文件中使用 JSX 语法。

不同文档部分的左侧导航在以下文件中配置：

- `sidebars/runtime.js` - Runtime 部分的侧边栏配置
- `sidebars/deploy.js` - Deno Deploy 部分的侧边栏配置
- `sidebars/kv.js` - KV 部分的侧边栏配置

静态文件（如截图）可以直接包含在 `runtime`、`deploy` 或 `kv` 文件夹中，并通过
markdown 中的相对 URL 引用。

Docusaurus 提供了一些很好的 markdown
扩展，例如标签页、警告和代码块。有关更多详细信息，请参考
[Docusaurus 文档](https://docusaurus.io/docs/markdown-features)。

## 在代码和内容中包含版本号

偶尔，可能需要在内容或代码示例中动态包含当前的 Deno CLI
或标准库版本。我们可以使用该存储库根目录下的 `replacements.json`
文件来实现这一点。

您想要更改一次，并在许多生成的文件中动态显示的任何值应包含在 `replacements.json`
中。

在代码示例中（用反引号括起来），您可以在代码示例中直接包含 `$`
字符，然后是替换变量名称。在转换 markdown 时，当前版本号将在其中替换。

```ts
import { copy } from "https://deno.land/std@$STD_VERSION/fs/copy.ts";
```

要在 markdown/MDX 内容中包含版本号，建议使用 `<Replacement />` 组件：

```mdx
import Replacement from "@site/src/components/Replacement";

当前 CLI 版本是 **<Replacement for="CLI_VERSION"/>**。
```

如果您正在编写内联 JSX，还可以直接使用替换对象，如下所示：

```mdx
import { replacements } from "@site/src/components/Replacement";

<p>
  当前的 CLI 版本是 <code>{ replacements.CLI_VERSION }</code>。
</p>
```

## 许可证

MIT
