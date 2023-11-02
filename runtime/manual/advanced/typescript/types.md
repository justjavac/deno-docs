# 类型和类型声明

Deno 的一个设计原则之一是不使用非标准的模块解析。当 TypeScript
检查文件类型时，它只关心文件的类型以及 `tsc`
编译器具有许多逻辑来尝试解析这些类型。默认情况下，它期望带有扩展名的_模糊_模块规范，并将尝试查找
`.ts` 规范下的文件，然后 `.d.ts`，最后 `.js`（当模块解析设置为 `"node"`
时还有一整套逻辑）。Deno 处理显式规范。

然而，这可能会引发一些问题。例如，假设我想使用已经被转译为 JavaScript 的
TypeScript 文件以及一个类型定义文件。所以我有 `mod.js` 和
`mod.d.ts`。如果我尝试将 `mod.js` 导入到
Deno，它只会执行我要求它执行的操作，并导入 `mod.js`，但这意味着我的代码不会像
TypeScript 将 `mod.d.ts` 文件视为 `mod.js`
文件的替代品时一样经过良好的类型检查。

为了在 Deno 中支持这一点，Deno
提供了两种解决方案，其中有一种增强支持的变体。您可能遇到的两种主要情况分别是：

- 作为 JavaScript 模块的导入方，我知道应用于该模块的类型。
- 作为 JavaScript 模块的提供方，我知道应用于该模块的类型。

后一种情况是更好的情况，这意味着您作为模块的提供者或主机，每个人都可以使用它，而不必找出如何解析
JavaScript
模块的类型，但在使用您可能无法直接控制的模块时，也需要能够执行前一种情况。

## 导入时提供类型

如果您正在使用 JavaScript 模块，并且已经创建了类型（一个 `.d.ts`
文件）或以其他方式获得了您想要使用的类型，您可以使用 `@deno-types`
编译器提示指示 Deno 在类型检查时使用该文件，而不是 JavaScript
文件。`@deno-types`
必须是一个单行双斜杠注释，使用它会影响下一个导入或重新导出语句。

例如，如果我有一个 JavaScript 模块 `coolLib.js`，并且我有一个单独的
`coolLib.d.ts` 文件，我想要使用它，我可以这样导入它：

```ts, ignore
// @deno-types="./coolLib.d.ts"
import * as coolLib from "./coolLib.js";
```

在对 `coolLib` 进行类型检查以及在文件中使用它时，将使用 `coolLib.d.ts`
中的类型，而不是查看 JavaScript 文件。

编译器提示的模式匹配有些宽容，它将接受带引号和非问号值的规范符，以及在等号前后接受空白。

## 主机时提供类型

如果您控制模块的源代码，或者控制文件在 Web
服务器上的托管方式，有两种方法可以通知 Deno
关于给定模块的类型，而不需要导入者采取特殊操作。

### 使用三斜线引用指令

Deno 支持使用三斜线引用 `types` 指令，它采用 TypeScript
文件中用于_包含_其他文件的引用注释，并仅将其应用于 JavaScript 文件。

例如，如果我创建了 `coolLib.js`，并在其旁边创建了我的库的类型定义文件
`coolLib.d.ts`，那么在 `coolLib.js` 文件中，我可以这样做：

```js, ignore
/// <reference types="./coolLib.d.ts" />

// ... 其余的 JavaScript 代码 ...
```

当 Deno 遇到此指令时，它将解析 `./coolLib.d.ts` 文件，并在 TypeScript
检查文件类型时使用该文件，但在运行程序时仍然加载 JavaScript 文件。

> ℹ️ _注意_，这是 TypeScript 的一种重新配置指令，只适用于 JavaScript 文件。在
> Deno 下，也可以在 TypeScript 文件中使用三斜线引用指令，但其行为基本与 `path`
> 指令相同。

### 使用 X-TypeScript-Types 标头

与三斜线指令类似，Deno 支持远程模块的标头，该标头指示 Deno
在给定模块的类型何处定位。例如，`https://example.com/coolLib.js`
的响应可能如下所示：

```
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./coolLib.d.ts
```

当看到此标头时，Deno 将尝试检索 `https://example.com/coolLib.d.ts`
并在类型检查原始模块时使用它。

## 使用环境或全局类型

总的来说，最好在 Deno 中使用模块/UMD
类型定义，其中模块明确导入它所依赖的类型。模块化类型定义可以通过类型定义中的
`declare global` 来表达
[全局范围的增强](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)。例如：

```ts
declare global {
  var AGlobalString: string;
}
```

当导入类型定义时，将在全局命名空间中提供 `AGlobalString`。

但在某些情况下，当利用其他现有类型库时，可能无法利用模块化类型定义。因此，在类型检查程序时，有一些方法可以包含任意类型定义。

### 使用三斜线指令

此选项将类型定义与代码本身耦合。通过在模

块类型的附近添加三斜线 `types` 指令，类型检查文件将包括类型定义。例如：

```ts, ignore
/// <reference types="./types.d.ts" />
```

提供的规范符像 Deno
中的其他规范符一样被解析，这意味着它需要一个扩展名，并且是相对于引用它的模块的路径的。

### 使用配置文件

另一个选项是使用配置文件，配置文件配置为包括类型定义，通过向 `"compilerOptions"`
提供 `"types"` 值。例如：

```json
{
  "compilerOptions": {
    "types": [
      "./types.d.ts",
      "https://deno.land/x/pkg@1.0.0/types.d.ts",
      "/Users/me/pkg/types.d.ts"
    ]
  }
}
```

与上面的三斜线引用一样，`"types"` 数组中提供的规范符将像 Deno
中的其他规范符一样解析。对于相对规范符，它将相对于配置文件的路径解析。请确保通过指定
`--config=path/to/file` 标志来告诉 Deno 使用此文件。

## 检查 Web Workers 的类型

当 Deno 在 Web Worker 中加载 TypeScript
模块时，它将自动对模块及其依赖项进行类型检查，针对 Deno Web Worker
库。这可能在其他上下文中，比如 `deno cache`
或编辑器中，构成挑战。有一些方法可以指示 Deno 使用工作程序库而不是标准 Deno 库。

### 使用三斜线指令

此选项将库设置与代码本身耦合。通过在工作程序脚本的入口点文件的顶部附近添加以下三斜线指令，Deno
将现在将其作为 Deno 工作程序脚本进行类型检查，而不考虑模块的分析方式：

```ts, ignore
/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />
```

第一个指令确保不使用其他默认库。如果省略此指令，将会得到一些冲突的类型定义，因为
Deno 还会尝试应用标准 Deno 库。第二个指示 Deno 应用内置的 Deno
工作程序类型定义以及依赖库（如 `"esnext"`）。

当运行 `deno cache` 或 `deno bundle` 命令，或者使用使用 Deno 语言服务器的 IDE
时，Deno 应该会自动检测到这些指令并在类型检查时应用正确的库。

这种方法的一个缺点是，它使代码在其他非 Deno 平台上（如
`tsc`）的可移植性降低，因为只有 Deno 具有内置的 `"deno.worker"` 库。

### 使用配置文件

另一个选项是使用配置文件，该配置文件配置为应用库文件。一个可以工作的最小文件可能如下所示：

```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["deno.worker"]
  }
}
```

然后，在命令行上运行命令时，您需要传递 `--config path/to/file`
参数，或者如果您使用利用 Deno 语言服务器的 IDE，则设置 `deno.config` 设置。

如果还有非工作程序脚本，您将需要省略 `--config`
参数，或者配置一个以满足非工作程序脚本需求的配置。

## 重要要点

### 类型声明语义

类型声明文件（`.d.ts` 文件）遵循与 Deno
中的其他文件相同的语义。这意味着声明文件被视为模块声明（_UMD
声明_），而不是环境/全局声明。无法预测 Deno 如何处理环境/全局声明。

此外，如果类型声明导入其他内容，比如另一个 `.d.ts` 文件，它的解析会遵循 Deno
的常规导入规则。对于许多生成并在网络上提供的 `.d.ts` 文件，它们可能与 Deno
不兼容。

为了解决这个问题，一些解决方案提供商，比如
[Skypack CDN](https://www.skypack.dev/)，会自动捆绑类型声明，就像它们提供 ESM
JavaScript 捆绑一样。

### Deno 友好的 CDN

有一些 CDN 主机托管的 JavaScript 模块与 Deno 集成得很好。

- [esm.sh](https://esm.sh) 是一个 CDN，通过默认提供类型声明（通过
  `X-TypeScript-Types` 标头）。可以通过在导入 URL 后附加 `?no-dts` 来禁用它：

  ```ts
  import React from "https://esm.sh/react?no-dts";
  ```

- [Skypack.dev](https://docs.skypack.dev/skypack-cdn/code/deno) 是另一个
  CDN，也提供类型声明（通过 `X-TypeScript-Types` 标头），当您将 `?dts`
  作为查询字符串附加到远程模块导入语句时。以下是一个示例：

  ```ts
  import React from "https://cdn.skypack.dev/react?dts";
  ```

## 在进行类型检查时 JavaScript 的行为

如果您在 Deno 中将 JavaScript 导入 TypeScript，并且没有类型，即使您已将
`checkJs` 设置为 `false`（Deno 的默认设置），TypeScript 编译器仍将访问
JavaScript 模块，并尝试对其进行一些静态分析，至少尝试确定该模块的导出形状以验证
TypeScript 文件中的导入。

这通常在尝试导入“常规” ES
模块时永远不会出现问题，但在某些情况下，如果模块具有特殊的打包方式或者是全局
_UMD_ 模块，TypeScript
对模块的分析可能会失败并导致误导性错误。在这种情况下最好的做法是使用上述其中一种方法提供某种类型。

### 内部工作原理

虽然不必了解 Deno 在内部的工作方式就能够很好地利用 TypeScript 与
Deno，但了解它的工作方式可能会有所帮助。

在执行或编译任何代码之前，Deno
通过解析根模块，检测其所有依赖项，然后检索和解析这些模块，递归地进行填充模块图，直到检索到所有依赖项。

对于每个依赖项，都存在两种潜在的“槽位”。有代码槽位和类型槽位。随着模块图的填充，如果模块是可以转换为
JavaScript 的内容，它将填充代码槽位，而只有类型的依赖项，如 `.d.ts`
文件，填充类型槽位。

当构建模块图并需要对图进行类型检查时，Deno 启动 TypeScript
编译器并向其提供需要潜在地转换为 JavaScript 的模块的名称。在此过程中，TypeScript
编译器会请求额外的模块，Deno
会查看依赖项的槽位，如果在提供代码槽位之前已经填充了类型槽位，则会向其提供类型槽位。

这意味着当您导入一个 `.d.ts` 模块，或者使用上述解决方案之一来为 JavaScript
代码提供替代类型模块时，在解析模块时提供给 TypeScript 的内容就是这样的。
