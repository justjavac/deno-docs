---
title: "在 TypeScript 中进行数据建模"
oldUrl:
  - /kv/manual/data_modeling_typescript/
---

<deno-admonition></deno-admonition>

在 TypeScript
应用程序中，通常希望创建强类型且文档完善的对象来包含应用程序操作的数据。通过使用
[接口](https://www.typescriptlang.org/docs/handbook/2/objects.html) 或
[类](https://www.typescriptlang.org/docs/handbook/2/classes.html)，你可以描述程序中对象的形状和行为。

然而，如果你使用的是 Deno
KV，那么在持久化和检索强类型对象时，需要做一些额外的工作。在本指南中，我们将介绍如何在
Deno KV 中处理强类型对象的策略。

## 使用接口和类型断言

在 Deno KV 中存储和检索应用程序数据时，你可能希望首先使用 TypeScript
接口描述数据的形状。以下是一个对象模型，描述了一个博客系统的关键组件：

```ts title="model.ts"
export interface Author {
  username: string;
  fullName: string;
}

export interface Post {
  slug: string;
  title: string;
  body: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
}
```

这个对象模型描述了一篇博客文章及其关联的作者。

在 Deno KV 中，你可以将这些 TypeScript 接口用作
[数据传输对象 (DTOs)](https://martinfowler.com/bliki/LocalDTO.html) ——
一个强类型的包装器，用于包装你可能发送到或从 Deno KV 接收的无类型对象。

无需任何额外工作，你可以轻松地将这些 DTO 的内容存储在 Deno KV 中。

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const a: Author = {
  username: "acdoyle",
  fullName: "Arthur Conan Doyle",
};

await kv.set(["authors", a.username], a);
```

然而，当从 Deno KV
中检索相同的对象时，默认情况下它不会带有类型信息。如果你知道存储在该键下的对象的形状，你可以使用
[类型断言](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
来告知 TypeScript 编译器对象的形状。

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get(["authors", "acdoyle"]);
const ac = r.value as Author;

console.log(ac.fullName);
```

你还可以为 `get` 指定一个可选的
[类型参数](https://docs.denohub.com/api/deno/~/Deno.Kv.prototype.get)：

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get<Author>(["authors", "acdoyle"]);

console.log(r.value.fullName);
```

对于简单的数据结构，这种技术可能已经足够。但通常，你会在创建或访问领域对象时希望或需要应用一些业务逻辑。当这种需求出现时，你可以开发一组纯函数来操作你的
DTOs。

## 使用服务层封装业务逻辑

当应用程序的持久化需求变得更加复杂时 —— 例如当你需要创建
[二级索引](./secondary_indexes) 以通过不同的键查询数据，或维护对象之间的关系时
—— 你将希望创建一组函数来位于 DTOs
之上，以确保传递的数据是有效的（而不仅仅是类型正确）。

从我们上面的业务对象来看，`Post`
对象足够复杂，可能需要一小层代码来保存和检索该对象的实例。以下是两个函数的示例，它们包装了底层的
Deno KV API，并返回 `Post` 接口的强类型对象实例。

值得注意的是，我们需要存储 `Author` 对象的标识符，以便稍后可以从 KV
中检索作者信息。

```ts
import { Author, Post } from "./model.ts";

const kv = await Deno.openKv();

interface RawPost extends Post {
  authorUsername: string;
}

export async function savePost(p: Post): Promise<Post> {
  const postData: RawPost = Object.assign({}, p, {
    authorUsername: p.author.username,
  });

  await kv.set(["posts", p.slug], postData);
  return p;
}

export async function getPost(slug: string): Promise<Post> {
  const postResponse = await kv.get(["posts", slug]);
  const rawPost = postResponse.value as RawPost;
  const authorResponse = await kv.get(["authors", rawPost.authorUsername]);

  const author = authorResponse.value as Author;
  const post = Object.assign({}, postResponse.value, {
    author,
  }) as Post;

  return post;
}
```

这个薄层使用了一个 `RawPost` 接口，它扩展了实际的 `Post`
接口，以包含一些用于引用另一个索引（关联的 `Author` 对象）的附加数据。

`savePost` 和 `getPost` 函数取代了直接的 Deno KV `get` 或 `set`
操作，以便它们可以正确地序列化和“水合”模型对象，使其具有适当的类型和关联。
