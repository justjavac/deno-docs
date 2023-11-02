# Web Storage API

Deno 1.10 介绍了
[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)，它提供了一个存储字符串键和值的
API。持久化数据的工作方式类似于浏览器，并且有一个 10MB 的存储限制。全局
`sessionStorage` 对象仅在当前执行上下文中保留数据，而 `localStorage`
在执行之间保留数据。

在浏览器中，`localStorage`
会根据起源（实际上是协议加主机名加端口）来唯一保留数据。截至 Deno 1.16，Deno
具有一组规则来确定什么是唯一的存储位置：

- 当使用 `--location` 标志时，会使用位置的起源唯一存储数据。这意味着位置为
  `http://example.com/a.ts`、`http://example.com/b.ts` 和
  `http://example.com:80/` 的位置都将共享相同的存储，但 `https://example.com/`
  将是不同的。
- 如果没有位置指定符，但有指定 `--config`
  配置文件，则将使用该配置文件的绝对路径。这意味着
  `deno run --config deno.jsonc a.ts` 和 `deno run --config deno.jsonc b.ts`
  将共享相同的存储，但 `deno run --config tsconfig.json a.ts` 将是不同的。
- 如果没有配置或位置指定符，Deno 将使用主模块的绝对路径来确定共享哪个存储。Deno
  REPL 生成了一个基于启动 `deno`
  的当前工作目录的“合成”主模块。这意味着从相同路径多次调用 REPL 将共享已持久化的
  `localStorage` 数据。

这意味着，与 1.16 之前的版本不同，`localStorage` 现在始终在主进程中可用。

## 示例

以下代码片段访问了当前起源的本地存储桶，并使用 `setItem()` 添加了一个数据项。

```ts
localStorage.setItem("myDemo", "Deno App");
```

读取 localStorage 项的语法如下：

```ts
const cat = localStorage.getItem("myDemo");
```

删除 localStorage 项的语法如下：

```ts
localStorage.removeItem("myDemo");
```

删除所有 localStorage 项的语法如下：

```ts
localStorage.clear();
```
