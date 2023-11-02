# Hello World

## 概念

- Deno 可以直接运行 JavaScript 或 TypeScript，无需额外的工具或配置。

## 概述

Deno 是 JavaScript 和 TypeScript 的安全运行时。如下的 "Hello World"
示例突出了相同的功能可以在 JavaScript 或 TypeScript 中创建，而 Deno 将执行它们。

## JavaScript

在这个 JavaScript 示例中，消息 `Hello [name]`
会被打印到控制台，而代码确保提供的名称被大写。

**命令：** `deno run hello-world.js`

```js
/**
 * hello-world.js
 */
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name) {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));

/**
 * 输出：
 *
 * Hello John
 * Hello Sarah
 * Hello Kai
 */
```

## TypeScript

这个 TypeScript 示例与上面的 JavaScript
示例完全相同，只是代码中有额外的类型信息，TypeScript 支持这些类型。

`deno run` 命令完全相同，只是引用了一个 `*.ts` 文件，而不是一个 `*.js` 文件。

**命令：** `deno run hello-world.ts`

```ts
/**
 * hello-world.ts
 */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name: string): string {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));

/**
 * 输出：
 *
 * Hello John
 * Hello Sarah
 * Hello Kai
 */
```
