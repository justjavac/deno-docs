---
title: "`deno fmt`, 代码格式化"
oldUrl:
 - /runtime/tools/formatter/
 - /runtime/manual/tools/formatter/
 - /runtime/manual/tools/fmt/
 - /runtime/reference/cli/formatter/
command: fmt
---

## 支持的文件类型

Deno 内置了一个代码格式化工具，可以自动格式化以下文件：

<!-- 此列表需要与 https://github.com/denoland/deno/blob/main/cli/tools/fmt.rs 同步更新 -->

| 文件类型             | 扩展名                                                 | 备注                                                                          |
| -------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| JavaScript           | `.js`, `.cjs`, `.mjs`                                  |                                                                               |
| TypeScript           | `.ts`, `.mts`, `.cts`                                  |                                                                               |
| JSX                  | `.jsx`                                                 |                                                                               |
| TSX                  | `.tsx`                                                 |                                                                               |
| Markdown             | `.md`, `.mkd`, `.mkdn`, `.mdwn`, `.mdown`, `.markdown` |                                                                               |
| JSON                 | `.json`                                                |                                                                               |
| JSONC                | `.jsonc`                                               |                                                                               |
| CSS                  | `.css`                                                 |                                                                               |
| HTML                 | `.html`                                                |                                                                               |
| [Nunjucks][Nunjucks] | `.njk`                                                 |                                                                               |
| [Vento][Vento]       | `.vto`                                                 |                                                                               |
| YAML                 | `.yml`, `.yaml`                                        |                                                                               |
| Sass                 | `.sass`                                                |                                                                               |
| SCSS                 | `.scss`                                                |                                                                               |
| LESS                 | `.less`                                                |                                                                               |
| Jupyter Notebook     | `.ipynb`                                               |                                                                               |
| Astro                | `.astro`                                               | 需要 `--unstable-component` 标志或 `"unstable": ["fmt-component"]` 配置选项。 |
| Svelte               | `.svelte`                                              | 需要 `--unstable-component` 标志或 `"unstable": ["fmt-component"]` 配置选项。 |
| Vue                  | `.vue`                                                 | 需要 `--unstable-component` 标志或 `"unstable": ["fmt-component"]` 配置选项。 |
| SQL                  | `.sql`                                                 | 需要 `--unstable-sql` 标志或 `"unstable": ["fmt-sql"]` 配置选项。             |

[Nunjucks]: https://mozilla.github.io/nunjucks/
[Vento]: https://github.com/ventojs/vento

:::note

**`deno fmt` 可以格式化 Markdown 文件中的代码片段。**
片段必须用三个反引号括起来，并带有语言属性。

:::

## 忽略代码

### JavaScript / TypeScript / JSONC

通过在代码前添加 `// deno-fmt-ignore` 注释来忽略格式化：

```ts
// deno-fmt-ignore
export const identity = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];
```

或者通过在文件顶部添加 `// deno-fmt-ignore-file` 注释来忽略整个文件。

### Markdown / HTML / CSS

通过在代码前添加 `<!--- deno-fmt-ignore -->` 注释来忽略格式化下一个项目：

```html
<html>
  <body>
    <p>
      Hello there
      <!-- deno-fmt-ignore -->
    </p>
  </body>
</html>
```

要忽略一段代码，请用 `<!-- deno-fmt-ignore-start -->` 和
`<!-- deno-fmt-ignore-end -->` 注释将代码括起来。

或者通过在文件顶部添加 `<!-- deno-fmt-ignore-file -->` 注释来忽略整个文件。

### YAML

通过在代码前添加 `# deno-fmt-ignore` 注释来忽略格式化下一个项目：

```html
# deno-fmt-ignore aaaaaa: bbbbbbb
```
