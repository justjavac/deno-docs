# 代码格式化

Deno 集成了一个内置的代码格式化工具，可以自动格式化以下文件：

| 文件类型   | 扩展名             |
| ---------- | ------------------ |
| JavaScript | `.js`              |
| TypeScript | `.ts`              |
| JSX        | `.jsx`             |
| TSX        | `.tsx`             |
| Markdown   | `.md`, `.markdown` |
| JSON       | `.json`            |
| JSONC      | `.jsonc`           |

此外，`deno fmt` 可以格式化 Markdown
文件中的代码片段。代码片段必须用三个反引号括起，并带有语言属性。

```shell
# 格式化当前目录和子目录中的所有支持的文件
deno fmt
# 格式化特定文件
deno fmt myfile1.ts myfile2.ts
# 格式化指定目录和子目录中的所有支持的文件
deno fmt src/
# 检查当前目录和子目录中的所有支持的文件是否已格式化
deno fmt --check
# 格式化标准输入并写入标准输出
cat file.ts | deno fmt -
```

## 忽略代码

在 TS/JS/JSONC 中，通过在代码之前添加 `// deno-fmt-ignore`
注释来忽略格式化代码：

```ts
// deno-fmt-ignore
export const identity = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];
```

或者通过在文件顶部添加 `// deno-fmt-ignore-file` 注释来忽略整个文件。

在 Markdown 中，您可以使用 `<!-- deno-fmt-ignore -->`
注释来忽略整个文件，或者使用 `<!-- deno-fmt-ignore-file -->`
注释来忽略整个文件。要忽略 Markdown 的某个部分，可以使用
`<!-- deno-fmt-ignore-start -->` 和 `<!-- deno-fmt-ignore-end -->`
注释来围绕代码。

## 配置

> ℹ️ 建议使用默认选项。

从 Deno v1.14 开始，可以使用配置文件或遵循 CLI 标志自定义格式化器：

- `--use-tabs` - 是否使用制表符。默认为 false（使用空格）。

- `--line-width` -
  打印机将尝试保持在其下的行宽度。请注意，在某些情况下，打印机可能会超过此宽度。默认为
  80。

- `--indent-width` - 缩进的字符数。默认为 2。

- `--no-semicolons` - 除了必要的情况外，不使用分号。

- `--single-quote` - 是否使用单引号。默认为 false（使用双引号）。

- `--prose-wrap={always,never,preserve}` - 定义在 Markdown
  文件中如何包装文本。默认为 "always"。

注意：在 Deno 版本 < 1.31 中，您将不得不在这些标志前加上 `options-` 前缀（例如
`--options-use-tabs`）。
