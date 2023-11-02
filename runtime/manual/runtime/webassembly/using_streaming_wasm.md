# 使用流式 WebAssembly API

[最高效的](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming)
获取、编译和实例化 WebAssembly 模块的方式是使用 WebAssembly API
的流式变体。例如，您可以使用 `instantiateStreaming` 结合 `fetch`
一次完成所有三个步骤：

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

请注意，`.wasm` 文件必须以 `application/wasm` MIME
类型提供。如果您希望在实例化之前对模块进行额外的工作，可以使用
`compileStreaming`：

```ts
const module = await WebAssembly.compileStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

/* 做更多的工作 */

const instance = await WebAssembly.instantiate(module);
instance.exports.increment as (input: number) => number;
```

如果出于某种原因您无法使用流式方法，可以退回到不太高效的 `compile` 和
`instantiate` 方法。例如，查看
[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate)。要更深入地了解流式方法为何更高效，请参阅
[此文章](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/)。
