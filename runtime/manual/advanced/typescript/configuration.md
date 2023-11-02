# 在 Deno 中配置 TypeScript

TypeScript 提供了许多不同的配置选项，但 Deno 旨在使 TypeScript 与 Deno
一起使用变得简单。各种不同的选项可能会让人感到困惑。为了使事情变得更容易，Deno
配置了 TypeScript 以 "即插即用"，不需要额外的配置。

话虽如此，Deno 确实支持使用 TypeScript 配置文件。要在 Deno 中使用 TypeScript
配置文件，可以在命令行上提供路径，或者使用默认设置。例如：

```
> deno run --config ./deno.json main.ts
```

> ⚠️ 请注意，如果您正在创建需要配置文件的库，那么如果将您的模块分发为
> TypeScript，那么您模块的所有使用者也将需要该配置文件。此外，配置文件中可能有一些设置，会使其他
> TypeScript 模块不兼容。老实说，最好使用 Deno
> 的默认设置，并仔细考虑是否使用配置文件。

> ⚠️ Deno v1.14 开始支持更通用的配置文件，不再仅限于指定 TypeScript
> 编译器设置。使用 `tsconfig.json` 作为文件名仍然有效，但我们建议使用
> `deno.json` 或 `deno.jsonc`，因为计划在即将发布的版本中自动查找此文件。

## Deno 如何使用配置文件

Deno 不像 `tsc` 那样处理 TypeScript 配置文件，因为 TypeScript
配置文件的许多部分在 Deno 上下文中没有意义，或者如果应用了这些部分会导致 Deno
无法正常工作。

Deno 只关注配置文件的 `compilerOptions`
部分，即使在这个部分，它只考虑某些编译器选项，其余的选项会被忽略。

下面是可以更改的编译器选项的表格，它们在 Deno
中的默认值以及有关该选项的其他注释：

| 选项                             | 默认值                  | 注释                                                                                         |
| -------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `allowJs`                        | `true`                  | 这几乎不需要更改                                                                             |
| `allowUnreachableCode`           | `false`                 |                                                                                              |
| `allowUnusedLabels`              | `false`                 |                                                                                              |
| `checkJs`                        | `false`                 | 如果设置为 `true`，会导致 TypeScript 对 JavaScript 进行类型检查                              |
| `jsx`                            | `"react"`               |                                                                                              |
| `jsxFactory`                     | `"React.createElement"` |                                                                                              |
| `jsxFragmentFactory`             | `"React.Fragment"`      |                                                                                              |
| `keyofStringsOnly`               | `false`                 |                                                                                              |
| `lib`                            | `[ "deno.window" ]`     | 默认值因 Deno 中其他设置而变化。如果提供它，它会覆盖默认值。有关更多信息，请参见下面的内容。 |
| `noErrorTruncation`              | `false`                 |                                                                                              |
| `noFallthroughCasesInSwitch`     | `false`                 |                                                                                              |
| `noImplicitAny`                  | `true`                  |                                                                                              |
| `noImplicitReturns`              | `false`                 |                                                                                              |
| `noImplicitThis`                 | `true`                  |                                                                                              |
| `noImplicitUseStrict`            | `true`                  |                                                                                              |
| `noStrictGenericChecks`          | `false`                 |                                                                                              |
| `noUnusedLocals`                 | `false`                 |                                                                                              |
| `noUnusedParameters`             | `false`                 |                                                                                              |
| `noUncheckedIndexedAccess`       | `false`                 |                                                                                              |
| `reactNamespace`                 | `React`                 |                                                                                              |
| `strict`                         | `true`                  |                                                                                              |
| `strictBindCallApply`            | `true`                  |                                                                                              |
| `strictFunctionTypes`            | `true`                  |                                                                                              |
| `strictPropertyInitialization`   | `true`                  |                                                                                              |
| `strictNullChecks`               | `true`                  |                                                                                              |
| `suppressExcessPropertyErrors`   | `false`                 |                                                                                              |
| `suppressImplicitAnyIndexErrors` | `false`                 |                                                                                              |
| `useUnknownInCatchVariables`     | `false`                 |                                                                                              |

有关编译器选项的完整列表以及它们如何影响 TypeScript，请参考
[TypeScript 手册](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

## 隐含的 tsconfig.json 长什么样

让 `tsc` 表现得像 Deno 是不可能的。让 TypeScript 语言服务表现得像 Deno
也很困难。这就是为什么我们在 Deno
中直接构建了语言服务的原因。话虽如此，了解隐含的配置也是有用的。

如果你要为 Deno 编写一个 `tsconfig.json`，它会类似于这样：

```json
{
  "compilerOptions": {
    "allowJs": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "inlineSourceMap": true,
    "isolatedModules": true,
    "jsx": "react",
    "lib": ["deno.window"],
    "module": "esnext",
    "moduleDetection": "force",
    "strict": true,
    "target": "esnext",
    "useDefineForClassFields": true
  }
}
```

你不能简单复制粘贴这个到配置文件中并使其工作，具体原因是 Deno 为 TypeScript
编译器提供了自定义的类型库。这可以通过在命令行上运行 `deno types`
并将输出导出到文件中，然后将其包含在程序的文件中，移除 `"lib"` 选项并将
`"noLib"` 选项设置为 `true` 来模拟。

如果使用 `--unstable` 标志，Deno 将将 `"lib"` 选项更改为
`[ "deno.window", "deno.unstable" ]`。如果要加载一个 worker，将使用 `" den

o.worker "`进行类型检查，而不是`" deno.window "`。请查看
[Type Checking Web Workers](./types.md#type-checking-web-workers)
获取更多相关信息。

## 使用 "lib" 属性

Deno 内置了一些库，这些库在其他平台（如 `tsc`）中不存在。这就是使 Deno
能够正确检查为 Deno
编写的代码的原因。然而，在某些情况下，这种自动行为可能会带来挑战，例如编写旨在在浏览器中运行的代码。在这些情况下，`compilerOptions`
的 `"lib"` 属性可以用于修改 Deno 在类型检查代码时的行为。

对用户感兴趣的内置库有：

- `"deno.ns"` - 包括所有自定义的 `Deno` 全局命名空间 API，以及 `import.meta` 的
  Deno 扩展。这通常不会与其他库或全局类型冲突。
- `"deno.unstable"` - 包括不稳定的 `Deno` 全局命名空间 API。
- `"deno.window"` - 这是检查 Deno 主运行时脚本时使用的 "默认" 库。它包括
  `"deno.ns"` 以及内置到 Deno 的扩展的其他类型库。这个库会与标准 TypeScript
  类库，如 `"dom"` 和 `"dom.iterable"` 冲突。
- `"deno.worker"` - 这是在检查 Deno Web Worker 脚本时使用的库。有关 Web Worker
  的更多信息，请查看
  [Type Checking Web Workers](./types.md#type-checking-web-workers)。
- `"dom.asynciterable"` - TypeScript 目前不包括 Deno 实现的 DOM
  异步可迭代性，所以我们自己实现了它，直到它在 TypeScript 中可用。

这些是 Deno 不使用的常见库，但在编写旨在在其他运行时环境中运行的代码时非常有用：

- `"dom"` - 随 TypeScript 一起提供的主要浏览器全局库。类型定义在许多方面与
  `"deno.window"` 冲突，因此如果使用 `"dom"`，则考虑只使用 `"deno.ns"` 来公开
  Deno 特定的 API。
- `"dom.iterable"` - 浏览器全局库的可迭代扩展。
- `"scripthost"` - 用于 Microsoft Windows Script Host 的库。
- `"webworker"` - 浏览器中 Web Worker 的主要库。与 `"dom"` 类似，它将与
  `"deno.window"` 或 `"deno.worker"` 冲突，因此考虑只使用 `"deno.ns"` 来公开
  Deno 特定的 API。
- `"webworker.importscripts"` - 该库公开了 Web Worker 中的 `importScripts()`
  API。
- `"webworker.iterable"` - 该库为 Web Worker
  内的对象添加了可迭代性。现代浏览器支持此功能。

### 针对 Deno 和浏览器的目标

一个常见的用例是编写适用于 Deno 和浏览器的代码：在使用专门适用于其中一个的 API
之前，使用条件检查来确定代码正在执行的环境。如果是这种情况，`compilerOptions`
的常见配置如下：

```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

这应该允许 Deno 正确地类型检查大多数代码。

如果您期望在 Deno 中使用 `--unstable`
标志运行代码，那么您还需要将该库加入到混合中：

```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns",
      "deno.unstable"
    ]
  }
}
```

通常在 TypeScript 中使用 `"lib"` 选项时，需要同时包括一个 "es" 库。在
`"deno.ns"` 和 `"deno.unstable"` 的情况下，当引入它们时，它们会自动包括
`"esnext"`。

这样做的最大 "危险"
是，类型检查会变得相对松散，无法验证您在代码中执行的功能检测是否足够有效，这可能会导致本应为微不足道的错误变成运行时错误。

## 使用 "types" 属性

`compilerOptions` 中的 `"types"`
属性可用于在类型检查程序时指定任意类型定义。有关更多信息，请参见
[使用环境或全局类型](./types.md#using-ambient-or-global-types)。
