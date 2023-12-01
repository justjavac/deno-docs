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

## 代码检查

您可以使用 `--lint` 标志在生成文档的同时检查文档中的问题。`deno doc`
将指出三种问题：

1. 导出类型出现错误，根模块引用了一个未导出的类型。
   - 确保 API 使用者可以访问 API
     使用的所有类型。可以通过从根模块（命令行上指定给 `deno doc`
     的文件之一）导出类型或使用 `@internal` jsdoc 标签标记类型来抑制此错误。
1. **公共** 类型缺少返回类型或属性类型的错误。
   - 确保 `deno doc` 显示返回/属性类型并有助于提高类型检查性能。
1. **公共** 类型缺少 JS 文档注释的错误。
   - 确保代码已记录。可以通过添加 jsdoc 注释或通过 `@ignore` jsdoc
     标签将其从文档中排除来抑制此错误。或者，添加 `@internal`
     标签以保留在文档中，但表示它是内部的。

例如：

```ts title="/mod.ts"
interface Person {
  name: string;
  // ...
}

export function getName(person: Person) {
  return person.name;
}
```

```shell
$ deno doc --lint mod.ts
Type 'getName' references type 'Person' which is not exported from a root module.
Missing JS documentation comment.
Missing return type.
    at file:///mod.ts:6:1
```

这些代码检查旨在帮助您编写更好的文档并加快项目中的类型检查。如果发现任何问题，程序将以非零退出码退出，并将输出报告给标准错误。

## HTML 输出

使用 `--html` 标志生成带有文档的静态站点。

```
$ deno doc --html --name="My library" ./mod.ts

$ deno doc --html --name="My library" --output=./documentation/ ./mod.ts

$ deno doc --html --name="My library" ./sub1/mod.ts ./sub2/mod.ts
```

生成的文档是一个具有多个页面的静态站点，可以部署到任何静态站点托管服务。

生成站点中包含了客户端搜索，但如果用户的浏览器禁用了 JavaScript，则无法使用。

## JSON 输出

使用 `--json` 标志以 JSON 格式输出文档。此 JSON 格式由
[deno doc website](https://github.com/denoland/docland)
消费，并用于生成模块文档。
