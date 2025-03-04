---
title: "入门指南"
pagination_next: /runtime/getting_started/first_project/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /manual/introduction/
  - /runtime/manual/
  - /runtime/manual/getting_started/
---

[Deno](https://deno.com)
([/ˈdiːnoʊ/](https://ipa-reader.com/?text=%CB%88di%CB%90no%CA%8A), 发音为
`dee-no`) 是一个 [开源](https://github.com/denoland/deno/blob/main/LICENSE.md)
的 JavaScript、TypeScript 和 WebAssembly
运行时，具有安全的默认设置和出色的开发者体验。它基于
[V8](https://v8.dev/)、[Rust](https://www.rust-lang.org/) 和
[Tokio](https://tokio.rs/) 构建。

让我们在五分钟内创建并运行你的第一个 Deno 程序。

## 安装 Deno

使用以下终端命令之一在你的系统上安装 Deno 运行时。

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

[更多安装选项可以在这里找到](/runtime/getting_started/installation/)。安装完成后，你的系统路径中应该会有
`deno` 可执行文件。你可以通过运行以下命令来验证安装：

```sh
deno --version
```

## Hello World

Deno 可以直接运行 JavaScript 和
[TypeScript](https://www.typescriptlang.org/)，无需额外的工具或配置。让我们创建一个简单的
"hello world" 程序并用 Deno 运行它。

创建一个名为 `main` 的 TypeScript 或 JavaScript 文件，并包含以下代码：

<deno-tabs group-id="code">
<deno-tab value="TypeScript" label="TypeScript" default>

```ts title="main.ts"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

</deno-tab>
<deno-tab value="JavaScript" label="JavaScript">

```js title="main.js"
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

</deno-tab>
</deno-tabs>

保存文件并用 Deno 运行它：

<deno-tabs group-id="commands">
<deno-tab value="ts" label="main.ts" default>

```sh
$ deno main.ts
Hello, world!
```

</deno-tab>
<deno-tab value="js" label="main.js">

```sh
$ deno main.js
Hello, world!
```

</deno-tab >
</deno-tabs>

## 下一步

恭喜！你刚刚运行了你的第一个 Deno 程序。继续阅读以了解更多关于 Deno
运行时的内容。

- [创建一个 Deno 项目](/runtime/getting_started/first_project/)
- [设置你的环境](/runtime/getting_started/setup_your_environment/)
- [使用 CLI](/runtime/getting_started/command_line_interface)
