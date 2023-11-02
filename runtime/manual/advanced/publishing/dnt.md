# 使用 dnt 发布跨运行时模块

库作者可能希望将其 Deno 模块提供给 Node.js 用户。 通过使用
[dnt](https://github.com/denoland/dnt) 构建工具，这是可能的。

dnt 允许您开发 Deno 模块，几乎不需要更改，并使用单个 Deno
脚本来构建、类型检查和测试一个 npm 包，将其放在一个输出目录中。
一旦构建完成，您只需要将输出目录进行 `npm publish`，即可将其分发给 Node.js
用户。

有关更多详细信息，请参见 https://github.com/denoland/dnt
