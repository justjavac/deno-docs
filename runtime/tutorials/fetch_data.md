# 获取数据(fetch)

## 概念

- 与浏览器一样，Deno 实现了诸如
  [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 等 Web
  标准 API。
- Deno 默认是安全的，这意味着必须明确授予访问网络的权限。
- 另请参阅：Deno 的 [权限](../manual/basics/permissions.md) 模型。

## 概述

在构建任何类型的 Web 应用程序时，开发人员通常需要从 Web 上的其他地方检索数据。在
Deno 中，与任何其他 JavaScript 应用程序一样，只需调用 `fetch()` 方法即可。有关
fetch 的更多信息，请阅读
[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。

Deno 的特殊之处在于运行一个通过网络进行调用的脚本时。Deno
默认是安全的，这意味着禁止访问 IO（输入/输出）。要在网络上进行调用，必须明确告知
Deno 可以这样做。这是通过将 `--allow-net` 标志添加到 `deno run` 命令来实现的。

## 示例

**命令：** `deno run --allow-net fetch.ts`

```js
/**
 * 输出：JSON 数据
 */
const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();
console.log(jsonData);

/**
 * 输出：HTML 数据
 */
const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();
console.log(textData);

/**
 * 输出：错误消息
 */
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
}
```

## 文件和流

与浏览器一样，通过
[Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
可以发送和接收大文件。[`Deno.FsFile`](https://deno.land/api?s=Deno.FsFile) API
提供了两个属性：[`readable`](https://deno.land/api?s=Deno.FsFile#prop_readable)
和 [`writable`](https://deno.land/api?s=Deno.FsFile#prop_writable)，可用于将
Deno 文件转换为可写或可读流。

**命令：** `deno run --allow-read --allow-write --allow-net fetch_file.ts`

```ts
/**
 * 接收文件
 */
const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
  const file = await Deno.open("./logo.svg", { write: true, create: true });
  await fileResponse.body.pipeTo(file.writable);
}

/**
 * 发送文件
 */
const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com/", {
  method: "POST",
  body: file.readable,
});
```
