# 常见问题

## 出现类型错误，如找不到 `document` 或 `HTMLElement`

您正在使用的库依赖于
DOM。这在设计为在浏览器和服务器端运行的包中很常见。默认情况下，Deno
仅包括直接支持的库。假设包能正确识别运行时的环境，那么使用 DOM
库来进行类型检查是 "安全" 的。有关更多信息，请查看手册中的
[针对 Deno 和浏览器的目标](../advanced/typescript/configuration.md#targeting-deno-and-the-browser)
部分。
