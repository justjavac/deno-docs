# HTTP 头部

[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 接口是 Fetch
API 的一部分。它允许您创建和操作 fetch() 请求和响应资源的 HTTP 头部。

## 构造函数

Header() 构造函数创建一个新的 `Header` 实例。

```ts
let headers = new Headers(init);
```

#### 参数

| 名称 | 类型                                    | 可选   | 描述                                                              |
| ---- | --------------------------------------- | ------ | ----------------------------------------------------------------- |
| init | `Headers` / `{ [key: string]: string }` | `true` | 初始选项允许您使用现有的 `Headers` 或对象字面量来初始化头部对象。 |

构造函数的返回类型是一个 `Headers` 实例。

## 方法

| 名称                                  | 描述                                          |
| ------------------------------------- | --------------------------------------------- |
| `append(name: string, value: string)` | 将头部附加到 Headers 对象（覆盖现有的头部）。 |
| `delete(name: string)`                | 从 Headers 对象中删除头部。                   |
| `set(name: string, value: string)`    | 在 Headers 对象中创建一个新的头部。           |
| `get(name: string)`                   | 获取 Headers 对象中头部的值。                 |
| `has(name: string)`                   | 检查 Headers 对象中是否存在头部。             |
| `entries()`                           | 以键值对的方式获取头部。结果可迭代。          |
| `keys()`                              | 获取 Headers 对象的所有键。结果可迭代。       |

## 示例

```ts
// 从对象字面量创建一个新的头部对象。
const myHeaders = new Headers({
  accept: "application/json",
});

// 将一个头部附加到头部对象。
myHeaders.append("user-agent", "Deno Deploy");

// 打印头部对象的头部。
for (const [key, value] of myHeaders.entries()) {
  console.log(key, value);
}

// 您可以将头部实例传递给 Response 或 Request 构造函数。
const request = new Request("https://api.github.com/users/denoland", {
  method: "POST",
  headers: myHeaders,
});
```
