# 文档生成器

`deno doc` 后跟一个或多个源文件列表将打印出每个模块的 JSDoc 文档，其中包括
**导出的** 成员。

例如，给定一个名为 `add.ts` 的文件，其内容如下：

```ts
/**
 * 添加 x 和 y。
 * @param {number} x
 * @param {number} y
 * @returns {number} x 与 y 的和
 */
export function add(x: number, y: number): number {
  return x + y;
}
```

运行 Deno 的 `doc` 命令，将函数的 JSDoc 注释打印到 `stdout`：

```shell
deno doc add.ts
function add(x: number, y: number): number
  添加 x 和 y。 @param {number} x @param {number} y @returns {number} x 和 y 的和
```

使用 `--json` 标志以 JSON 格式输出文档。这种 JSON 格式可被
[deno doc 网站](https://github.com/denoland/docland) 使用，并用于生成模块文档。
