---
title: "使用 Deno 构建单词查找器应用"
url: /examples/word_finder_tutorial/
oldUrl:
  - /runtime/manual/examples/word_finder/
  - /runtime/tutorials/word_finder/
---

## 入门指南

在本教程中，我们将使用 Deno 创建一个简单的单词查找器 Web 应用程序。无需具备 Deno
的先前知识。

## 介绍

我们的单词查找器应用程序将接收用户提供的模式字符串，并返回英语词典中与该模式匹配的所有单词。模式可以包括字母字符以及
`_` 和 `?`。`?` 可以代表模式中未出现的任何字母。`_` 可以代表任何字母。

例如，模式 `c?t` 匹配 "cat" 和 "cut"。模式 `go?d` 匹配单词 "goad" 和
"gold"（但不匹配 "good"）。

![单词查找器 UI](./images/word_finder.png)

## 构建视图

下面的函数渲染了创建上述简单 UI 的 HTML。您可以指定模式和单词列表来自定义 HTML
内容。如果指定了模式，它将显示在搜索文本框中。如果指定了单词列表，则将渲染一个带项目符号的单词列表。

```jsx title="render.js"
export function renderHtml(pattern, words) {
  let searchResultsContent = "";
  if (words.length > 0) {
    let wordList = "";
    for (const word of words) {
      wordList += `<li>${word}</li>`;
    }
    searchResultsContent = `
        <p id="search-result-count" data-count="${words.length}">找到的单词数：${words.length}</p>
        <ul id="search-result" name="search-results"> 
          ${wordList}
        </ul>
      `;
  }

  return `<html>
    <head>
        <title>Deno 单词查找器</title>
        <meta name="version" content="1.0" />
    </head>
    <body>
        <h1>Deno 单词查找器</h1>
  
        <form id="perform-search" name="perform-search" method="get" action="/api/search">
            <label for="search-text">搜索文本：</label>
            <input id="search-text" name="search-text" type="text" value="${pattern}" />
            <input type="submit" />
        </form>
  
        ${searchResultsContent}
  
        <h2>说明</h2>
  
        <p>
            使用 _ 和 ? 输入一个单词以表示未知字符。使用 ? 表示包含尚未使用的字母（您可以将其视为“幸运之轮”占位符）。使用 _ 将查找包含任何字符的单词（无论它当前是否“显示”）。
            <br />
            <br />
            例如，d__d 将返回：
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
            而 go?d 将返回：
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

## 搜索词典

我们还需要一个简单的搜索函数，该函数扫描词典并返回与指定模式匹配的所有单词。下面的函数接收一个模式和词典，然后返回所有匹配的单词。

```jsx title="search.js"
export function search(pattern, dictionary) {
  // 创建排除单词中已存在字符的正则表达式
  let excludeRegex = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c != "?" && c != "_") {
      excludeRegex += "^" + c;
    }
  }
  excludeRegex = "[" + excludeRegex + "]";

  // 让问号仅匹配单词中未出现的字符
  let searchPattern = pattern.replace(/\?/g, excludeRegex);

  // 让下划线匹配任何字符
  searchPattern = "^" + searchPattern.replace(/\_/g, "[a-z]") + "$";

  // 查找词典中与模式匹配的所有单词
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

[Oak](https://deno.land/x/oak@v11.1.0) 是一个框架，可让您轻松地在 Deno
中设置服务器（类似于 JavaScript 的
Express），我们将使用它来托管我们的应用程序。我们的服务器将使用搜索函数来填充
HTML 模板，然后将自定义的 HTML 返回给查看者。我们可以方便地依赖
`/usr/share/dict/words` 文件作为我们的词典，这是大多数类 Unix
操作系统上存在的标准文件。

```jsx title="server.js"
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

console.log("正在监听 http://localhost:" + port);
await app.listen({ port });
```

我们可以使用以下命令启动服务器。请注意，我们需要显式授予对文件系统和网络的访问权限，因为
Deno 默认是安全的。

```bash
deno run --allow-read --allow-net server.js
```

现在，如果您访问
[http://localhost:8080](http://localhost:8080/)，您应该能够查看单词查找器应用程序。

## 示例代码

您可以在[这里](https://github.com/awelm/deno-word-finder)找到完整的示例代码。
