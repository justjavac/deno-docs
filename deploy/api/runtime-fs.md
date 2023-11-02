# 文件系统 API

Deno Deploy 支持 Deno 中可用的一组有限的文件系统 API。这些文件系统 API
可以访问部署中的静态文件。静态文件示例包括：

- 如果您通过 GitHub 集成进行部署，则是 GitHub 存储库中的文件。
- 如果在播放区部署，入口文件。

<!-- - 如果通过推送部署，那么是本地存储库中的文件。 -->

可用的 API 包括：

- [Deno.cwd](#denocwd)
- [Deno.readDir](#denoreaddir)
- [Deno.readFile](#denoreadfile)
- [Deno.readTextFile](#denoreadtextfile)
- [Deno.open](#denoopen)
- [Deno.stat](#denostat)
- [Deno.lstat](#denolstat)
- [Deno.realPath](#denorealpath)
- [Deno.readLink](#denoreadlink)

## `Deno.cwd`

`Deno.cwd()` 返回部署的当前工作目录。它位于部署的根目录。例如，如果通过 GitHub
集成进行部署，当前工作目录是 GitHub 存储库的根目录。

## `Deno.readDir`

`Deno.readDir()` 允许您列出目录的内容。

该函数与 [Deno](https://doc.deno.land/deno/stable/~/Deno.readDir) 完全兼容。

```ts
function Deno.readDir(path: string | URL): AsyncIterable<DirEntry>
```

路径可以是相对或绝对路径，也可以是 `file:` URL。

### 示例

此示例列出目录的内容并将此列表作为 JSON 对象返回响应体。

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(_req) {
  // 列出存储库根目录下 `blog` 目录中的文章。
  const posts = [];
  for await (const post of Deno.readDir(`./blog`)) {
    posts.push(post);
  }

  // 返回 JSON。
  return new Response(JSON.stringify(posts, null, 2), {
    headers: {
      "content-type": "application/json",
    },
  });
}

serve(handler);
```

## `Deno.readFile`

`Deno.readFile()` 允许您将文件完全读入内存。

函数定义类似于
[Deno](https://doc.deno.land/deno/stable/~/Deno.readFile)，但目前不支持
[`ReadFileOptions`](https://doc.deno.land/deno/stable/~/Deno.ReadFileOptions)。支持将在将来添加。

```ts
function Deno.readFile(path: string | URL): Promise<Uint8Array>
```

路径可以是相对或绝对路径，也可以是 `file:` URL。

### 示例

此示例将文件的内容读入内存作为字节数组，然后将其作为响应体返回。

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(_req) {
  // 读取存储库根目录下的 `README.md` 文件以探索可用方法。

  // 相对路径相对于存储库的根目录
  const readmeRelative = await Deno.readFile("./README.md");
  // 绝对路径。
  // 存储库的内容在 Deno.cwd()下可用。
  const readmeAbsolute = await Deno.readFile(`${Deno.cwd()}/README.md`);
  // 也支持文件 URL。
  const readmeFileUrl = await Deno.readFile(
    new URL(`file://${Deno.cwd()}/README.md`),
  );

  // 将 Uint8Array 解码为字符串。
  const readme = new TextDecoder().decode(readmeRelative);
  return new Response(readme);
}

serve(handler);
```

> 注意：要使用此功能，您必须将 GitHub 存储库链接到项目中。

Deno Deploy 支持 `Deno.readFile`
API，以从文件系统中读取静态资源。这对于提供静态资源如图像、样式表和 JavaScript
文件非常有用。本指南演示了如何使用此功能。

假设 GitHub 存储库的文件结构如下：

```
├── mod.ts
└── style.css
```

`mod.ts` 的内容：

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // 服务器的工作方式如下：
  // 1. 收到请求以获取特定资源。
  // 2. 从文件系统中读取资源。
  // 3. 将资源发送回客户端。

  // 检查请求是否是 style.css。
  if (pathname.startsWith("/style.css")) {
    // 从文件系统中读取 style.css 文件。
    const file = await Deno.readFile("./style.css");
    // 用 style.css 文件响应请求。
    return new Response(file, {
      headers: {
        "content-type": "text/css",
      },
    });
  }

  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <h1>示例</h1>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

serve(handleRequest);
```

提供给 [`Deno.readFile`](https://deno.land/api@v1.31.1?s=Deno.readFile) API
的路径是相对于存储库的根目录。如果在 `Deno.cwd` 内部，还可以指定绝对路径。

## `Deno.open`

`Deno.open（）`
允许您打开文件，返回文件句柄。此文件句柄然后可用于读取文件的内容。有关文件句柄上可用的方法的信息，请参阅
[`Deno.File`](#denofile)。

函数定义与 [Deno](https://doc.deno.land/deno/stable/~/Deno.open)
类似，但目前不支持
[`OpenOptions`](https://doc.deno.land/deno/stable/~/Deno.OpenOptions)。将来将添加支持。

```ts
function Deno.open(path: string | URL): Promise<Deno.File>
```

路径可以是相对路径或绝对路径。还可以是 `file:` URL。

### 示例

此示例打开文件，然后将内容作为响应正文流式传输。

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";
import { readableStreamFromReader } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";

async function handler(_req) {
  // 打开存储库根目录下的 README.md 文件。
  const file = await Deno.open("./README.md");

  // 将 `Deno.File` 转换为 `ReadableStream`。响应发送完成时，将自动关闭文件句柄。
  const body = readableStreamFromReader(file);

  return new Response(body);
}

serve(handler);
```

## `Deno.File`

`Deno.File` 是从 [`Deno.open（）`](#denoopen) 返回的文件句柄。它可用于使用
`read（）` 方法读取文件的块。文件句柄可以使用 `close（）` 方法关闭。

接口与 [Deno](https://doc.deno.land/deno/stable/~/Deno.File)
类似，但不支持向文件写入或寻找。将来将添加对后者的支持。

```ts
class File {
  readonly rid: number;

  close(): void;
  read(p: Uint8Array): Promise<number | null>;
}
```

路径可以是相对路径或绝对路径。还可以是 `file:` URL。

### `Deno.File#read()`

read
方法用于读取文件的块。应将缓冲区传递给其读取数据。如果已到达文件的末尾，则返回读取的字节数或
`null`。

```ts
function read(p: Uint8Array): Promise<number | null>;
```

### `Deno.File#close()`

close 方法用于关闭文件句柄。关闭句柄将中断所有正在进行的读取。

```ts
function close(): void;
```

## `Deno.stat`

`Deno.stat（）` 读取文件系统条目的元数据。它返回一个
[`Deno.FileInfo`](#fileinfo) 对象。符号链接将被跟随。

函数定义与 [Deno](https://doc.deno.land/deno/stable/~/Deno.stat)
相同。它不返回修改时间、访问时间或创建时间值。

```ts
function Deno.stat(path: string | URL): Promise<Deno.FileInfo>
```

路径可以是相对路径或绝对路径。还可以是 `file:` URL。

### 示例

此示例获取文件大小，并将结果作为响应正文返回。

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(_req) {
  // 获取存储库根目录下 README.md 的文件信息。
  const info = await Deno.stat("./README.md");

  // 获取文件大小（以字节为单位）。
  const size = info.size;

  return new Response(`README.md文件大小为${size}字节`);
}

serve(handler);
```

## `Deno.lstat`

`Deno.lstat（）` 与 `Deno.stat（）` 类似，但不跟随符号链接。

函数定义与 [Deno](https://doc.deno.land/deno/stable/~/Deno.lstat)
相同。它不返回修改时间、访问时间或创建时间值。

```ts
function Deno.lstat(path: string | URL): Promise<Deno.FileInfo>
```

路径可以是相对路径或绝对路径。还可以是 `file:` URL。

## `Deno.FileInfo`

`Deno.FileInfo` 接口用于表示文件系统条目的元数据。它由
[`Deno.stat（）`](#denostat) 和 [`Deno.lstat（）`](#denolstat)
函数返回。它可以表示文件、目录或符号链接。

在 Deno Deploy 中，仅可用文件类型和大小属性。大小属性的行为与 Linux 上相同。

```ts
interface FileInfo {
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  size: number;
}
```

## `Deno.realPath`

`Deno.realPath（）` 返回跟随符号链接后的文件的解析绝对路径。

函数定义与 [Deno](https://doc.deno.land/deno/stable/~/Deno.realPath) 相同。

```ts
function Deno.realPath(path: string | URL): Promise<string>
```

路径可以是相对路径或绝对路径。还可以是 `file:` URL。

### 示例

此示例调用 `Deno.realPath（）`
以获取存储库根目录中文件的绝对路径。结果将作为响应正文返回。

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(_req) {
  const path = await Deno.realPath("./README.md");

  return new Response(`./README.md的完全解析路径为${path}`);
}

serve(handler);
```

## `Deno.readLink`

`Deno.readLink（）` 返回符号链接的目标路径。

函数定义与 [Deno](https://doc.deno.land/deno/stable/~/Deno.readLink) 相同。

```ts
function Deno.readLink(path: string | URL): Promise<string>
```

路径可以是相对路径或绝对路径。还可以是 `file:` URL。

### 示例

此示例调用 `Deno.readLink（）`
以获取存储库根目录中文件的绝对路径。结果将作为响应正文返回。

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

async function handler(_req) {
  const path = await Deno.readLink("./my_symlink");

  return new Response(`./my_symlink的 目标路径为 ${path}`);
}

serve(handler);
```
