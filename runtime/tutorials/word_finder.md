# 使用 Deno 构建一个单词查找应用

## 入门

在本教程中，我们将使用 Deno 创建一个简单的单词查找网络应用程序。 不需要先前对
Deno 的了解。

## 介绍

我们的单词查找应用程序将接受用户提供的模式字符串，
并返回与该模式匹配的英语词典中的所有单词。 模式可以包括字母字符以及 `_` 和 `?`。
`?` 可以表示不在模式中的任何字母。`_` 可以表示任何字母。

例如，模式 `c?t` 匹配 "cat" 和 "cut"。 模式 `go?d` 匹配单词 "goad" 和
"gold"（但不匹配 "good"）。

![Untitled](../manual/images/word_finder.png)

## 构建视图

下面的函数渲染创建上面显示的简单用户界面的 HTML。
您可以指定模式和单词列表以自定义 HTML 内容。
如果指定了模式，它将显示在搜索文本框中。
如果指定了单词列表，将呈现单词的项目符号列表。

```jsx
// render.js

export function renderHtml(pattern, words) {
  let searchResultsContent = "";
  if (words.length > 0) {
    let wordList = "";
    for (const word of words) {
      wordList += `<li>${word}</li>`;
    }
    searchResultsContent = `
        <p id="search-result-count" data-count="${words.length}">Words found: ${words.length}</p>
        <ul id="search-result" name="search-results"> 
          ${wordList}
        </ul>
      `;
  }

  return `<html>
    <head>
        <title>Deno Word Finder</title>
        <meta name="version" content="1.0" />
    </head>
    <body>
        <h1>Deno Word Finder</h1>
  
        <form id="perform-search" name="perform-search" method="get" action="/api/search">
            <label for="search-text">Search text:</label>
            <input id="search-text" name="search-text" type="text" value="${pattern}" />
            <input type="submit" />
        </form>
  
        ${searchResultsContent}
  
        <h2>Instructions</h2>
  
        <p>
            使用 _ 和 ? 输入单词，以便用于未知字符。
            使用 ? 表示包含未在单词中出现的字母（可以将其视为“幸运大转盘”占位符）。
            使用 _ 将找到包含任何字符的单词（无论它是否已“揭示”）。
            <br />
            <br />
            例如，d__d 会返回：
            <ul>
                <li>dand</li>
                <li>daud</li>
                <li>dead</li>
                <li>deed</li>
                <li>dird</li>
                <li>dodd</li>
                <li>dowd</li>
                <li>duad</li>
                <li>dyad</li>
            </ul>
            <br />
            而 go?d 会返回：
            <ul>
                <li>goad</li>
                <li>gold</li>
            </ul>
        </p>
    </body>
  </html>
  `;
}
```

## 查找词典

我们还需要一个简单的搜索函数，它会扫描词典并返回与指定模式匹配的所有单词。
下面的函数接受模式和词典，然后返回所有匹配的单词。

```jsx
// search.js

export function search(pattern, dictionary) {
  // 创建正则表达式模式，排除已存在于单词中的字符
  let excludeRegex = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c != "?" && c != "_") {
      excludeRegex += "^" + c;
    }
  }
  excludeRegex = "[" + excludeRegex + "]";

  // 仅让问号匹配不在单词中已存在的字符
  let searchPattern = pattern.replace(/\?/g, excludeRegex);

  // 让下划线匹配任何字符
  searchPattern = "^" + searchPattern.replace(/\_/g, "[a-z]") + "$";

  // 查找与模式匹配的词典中的所有单词
  let matches = [];
  for (let i = 0; i < dictionary.length; i++) {
    const word = dictionary[i];
    if (word.match(new RegExp(searchPattern))) {
      matches.push(word);
    }
  }

  return matches;
}
```

## 运行 Deno 服务器

[Oak](https://deno.land/x/oak@v11.1.0) 是一个让您能够轻松设置 Deno
服务器的框架（类似于 JavaScript 的 Express），
我们将使用它来托管我们的应用程序。 我们的服务器将使用我们的搜索函数来填充我们的
HTML 模板，并将定制的 HTML 返回给查看者。 我们可以方便地依赖于
`/usr/share/dict/words` 文件作为我们的词典， 这是大多数类 Unix
操作系统上都存在的标准文件。

```jsx, ignore
// server.js

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { search } from "./search.js";
import { renderHtml } from "./render.js";

const dictionary = (await Deno.readTextFile("/usr/share/dict/words")).split(
  "\n",
);

const app = new Application();
const port = 8080;

const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.body = renderHtml("", []);
});

router.get("/api/search", async (ctx) => {
  const pattern = ctx.request.url.searchParams.get("search-text");
  ctx.response.body = renderHtml(pattern, search(pattern, dictionary));
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening at http://localhost:" + port);
await app.listen({ port });
```

我们可以使用以下命令启动服务器。请注意，由于 Deno 默认是安全的，
所以我们需要明确授予文件系统和网络访问权限。

```bash
deno run --allow-read --allow-net server.js
```

现在，如果您访问 [http://localhost: 8080](http://localhost:8080/)，
您应该能够查看单词查找应用程序。
