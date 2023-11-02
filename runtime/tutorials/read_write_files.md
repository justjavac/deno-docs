# 读写文件

## 概念

- Deno 的运行时 API 提供了
  [Deno.readTextFile](https://deno.land/api?s=Deno.readTextFile) 和
  [Deno.writeTextFile](https://deno.land/api?s=Deno.writeTextFile) 异步
  函数，用于读取和写入整个文本文件。
- 与许多 Deno 的 API 一样，也提供了同步的替代方法。参见
  [Deno.readTextFileSync](https://deno.land/api?s=Deno.readTextFileSync) 和
  [Deno.writeTextFileSync](https://deno.land/api?s=Deno.writeTextFileSync)。
- 使用 `--allow-read` 和 `--allow-write` 权限来访问文件系统。

## 概览

与文件系统交互以读取和写入文件是一个常见的需求。 Deno 通过
[标准库](https://deno.land/std) 和 [Deno 运行时 API](https://deno.land/api)
提供了多种方式来实现这一需求。

正如在 [获取数据示例](./fetch_data.md) 中所强调的，出于安全原因，Deno
默认情况下限制了对输入/输出的访问。因此，在与文件系统交互时，必须在 `deno run`
命令中使用 `--allow-read` 和 `--allow-write` 标志。

## 读取文本文件

Deno 运行时 API 允许通过 `Deno.readTextFile()`
方法读取文本文件，只需提供路径字符串或 URL 对象即可。该方法返回一个 promise，该
promise 提供对文件文本数据的访问。

**命令:** `deno run --allow-read read.ts`

```typescript
/**
 * read.ts
 */
const text = await Deno.readTextFile("./people.json");
console.log(text);

/**
 * 输出:
 *
 * [
 *   {"id": 1, "name": "John", "age": 23},
 *   {"id": 2, "name": "Sandra", "age": 51},
 *   {"id": 5, "name": "Devika", "age": 11}
 * ]
 */
```

## 写入文本文件

Deno 运行时 API 允许开发人员通过 `Deno.writeTextFile()`
方法将文本写入文件，只需提供文件路径和文本字符串即可。该方法返回一个
promise，当文件成功写入时解析该 promise。

要运行该命令，必须向 `deno run` 命令提供 `--allow-write` 标志。

**命令:** `deno run --allow-write write.ts`

```typescript
/**
 * write.ts
 */
await Deno.writeTextFile("./hello.txt", "Hello World!");
console.log("文件已写入 ./hello.txt");

/**
 * 输出: 文件已写入 ./hello.txt
 */
```

您可以像这样向文件追加文本：

```typescript
await Deno.writeTextFile("./hello.txt", "这个文本将被追加。", {
  append: true,
});
```

通过结合 `Deno.writeTextFile` 和 `JSON.stringify`，您可以轻松地将序列化的 JSON
对象写入文件。此示例使用同步的
`Deno.writeTextFileSync`，但也可以使用异步方式执行，使用
`await Deno.writeTextFile`。

要执行此代码，`deno run` 命令需要写入标志。

**命令:** `deno run --allow-write write.ts`

```typescript
/**
 * write.ts
 */
function writeJson(path: string, data: object): string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));

    return "已写入 " + path;
  } catch (e) {
    return e.message;
  }
}

console.log(writeJson("./data.json", { hello: "World" }));

/**
 * 输出: 已写入 ./data.json
 */
```
