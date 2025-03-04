---
title: "HTTP 头信息"
oldUrl:
  - /deploy/docs/runtime-headers/
---

[Headers](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers) 接口是 Fetch
API 的一部分。它允许你创建和操作 `fetch()` 请求和响应资源的 HTTP 头信息。

- [构造函数](#constructor)
  - [参数](#parameters)
- [方法](#methods)
- [示例](#example)

## 构造函数

`Header()` 构造函数创建一个新的 `Header` 实例。

```ts
let headers = new Headers(init);
```

#### 参数

| 名称 | 类型                                    | 可选   | 描述                                                                   |
| ---- | --------------------------------------- | ------ | ---------------------------------------------------------------------- |
| init | `Headers` / `{ [key: string]: string }` | `true` | `init` 选项允许你使用现有的 `Headers` 或对象字面量来初始化头信息对象。 |

构造函数的返回类型是一个 `Headers` 实例。

## 方法

| 名称                                  | 描述                                              |
| ------------------------------------- | ------------------------------------------------- |
| `append(name: string, value: string)` | 向 `Headers` 对象追加一个头信息（覆盖已存在的）。 |
| `delete(name: string)`                | 从 `Headers` 对象中删除一个头信息。               |
| `set(name: string, value: string)`    | 在 `Headers` 对象中创建一个新的头信息。           |
| `get(name: string)`                   | 获取 `Headers` 对象中头信息的值。                 |
| `has(name: string)`                   | 检查 `Headers` 对象中是否存在某个头信息。         |
| `entries()`                           | 以键值对的形式获取头信息。结果是可迭代的。        |
| `keys()`                              | 获取 `Headers` 对象中的所有键。结果是可迭代的。   |

## 示例

```ts
// 从对象字面量创建一个新的头信息对象。
const myHeaders = new Headers({
  accept: "application/json",
});

// 向头信息对象追加一个头信息。
myHeaders.append("user-agent", "Deno Deploy");

// 打印头信息对象的头信息。
for (const [key, value] of myHeaders.entries()) {
  console.log(key, value);
}

// 你可以将头信息实例传递给 `Response` 或 `Request` 构造函数。
const request = new Request("https://api.github.com/users/denoland", {
  method: "POST",
  headers: myHeaders,
});
```
