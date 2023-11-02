# 导入补全和智能注册

语言服务器支持 URL 的补全。

## 本地导入补全

当尝试导入一个相对模块标识符（以 `./` 或 `../` 开头的标识符）时，会为 Deno
认为可以运行的目录和文件（以扩展名 `.ts`、`.js`、`.tsx`、`.jsx` 或 `.mjs`
结尾）提供导入补全。

## 工作区导入补全

当尝试导入一个远程 URL
但未配置为注册表（见下文）时，扩展将提供已包含在工作区中的远程模块。

## 模块注册表补全

支持它的模块注册表可配置为自动完成。这为您提供了一种从您的 IDE
的“舒适区”探索模块注册表的便捷方式。

### 自动发现

Deno
语言服务器默认情况下将尝试确定服务器是否支持补全建议。如果主机/来源未明确配置，它将检查服务器，如果支持补全建议，您将被提示选择启用或不启用。

您应仅为信任的注册表启用此功能，因为远程服务器可能提供用于运行不受信任代码的模块的建议。

### 配置

用于配置自动完成的注册表的设置：

- `deno.suggest.imports.autoDiscover` -
  如果启用，当语言服务器发现未明确配置的新来源时，它将检查该来源是否支持导入补全，并提示您是否启用它。默认值为
  `true`。
- `deno.suggest.imports.hosts` - 这些是配置为提供导入补全的
  _来源_。目标主机需要支持 Deno
  导入补全（下文有详细说明）。该值是一个对象，其中键是主机，值是启用或禁用。例如：

  ```json
  {
    "deno.suggest.imports.hosts": {
      "https://deno.land": true
    }
  }
  ```

### 它是如何工作的？

在扩展和语言服务器启动时，Deno 将尝试从配置并启用的主机中获取
`/.well-known/deno-import-intellisense.json`。此文件提供了以高度可配置的方式形成模块标识符的自动完成所需的数据（这意味着您不必绑定到特定的模块注册表以获得丰富的编辑器体验）。

当您构建或编辑模块标识符时，Deno 将根据 JSON 配置文件中的内容从主机获取 URL
的附加部分。

当您完成模块标识符时，如果它尚未在本地缓存中，Deno
将尝试从注册表中获取已完成的模块标识符。

### 它适用于所有远程模块吗？

不是，因为扩展和 Deno 需要了解如何 _查找_
模块。配置文件提供了一种高度灵活的方式，使人们能够描述如何构建
URL，包括支持语义版本控制的模块注册表。

## 支持导入补全的注册表

为了支持 Deno 语言服务器可以发现的注册表，注册表需要提供一些内容：

- 一个模式定义文件。此文件需要位于
  `/.well-known/deno-import-intellisense.json`。此文件提供了允许 Deno 语言服务器
  _查询_ 注册表和构建导入标识符所需的配置。

- 一系列提供要提供给用户的导入标识符的值的 API 端点，以完成导入标识符。

### 配置模式

对于模式定义的 JSON 响应，需要具有两个必需属性：

- `"version"` - 一个数字，必须等于 `1` 或 `2`。

- `"registries"` - 一个定义了为此注册表构建模块标识符的注册表对象数组。

[有一个 JSON 模式文档可在 CLI 源代码的一部分找到，它定义了此模式。](https://deno.land/x/deno/cli/schemas/registry-completions.v2.json)

尽管 v2 支持比 v1 更多的功能，但它们以一种非破坏性的方式引入，语言服务器自动处理
v1 或 v2 版本，不管在 `"version"`
键中提供哪个版本，所以从技术上讲，注册表可以宣称自己是 v1，但使用所有 v2
的功能。但不建议这样做，因为虽然目前代码中没有特定的分支来支持 v2
功能，但这并不意味着未来不会出现这样的分支以支持 _v3_ 或其他版本。

### 注册表

在配置模式中，`"registries"` 属性是包含两个必需属性的注册表对象数组：

- `"schema"` - 一个字符串，它是类似 Express
  的路径匹配表达式，用于定义在注册表上构建 URL 的方式。语法直接基于
  [path-to-regexp](https://github.com/pillarjs/path-to-regexp)。例如，如果以下是注册表上的
  URL 的标识符：

  ```
  https://example.com/a_package@v1.0.0/mod.ts
  ```

  模式值可能如下所示：

  ```json
  {
    "version": 1,
    "registries": [
      {
        "schema": "/:package([a-z0-9_]*)@:version?/:path*"
      }
    ]
  }
  ```

- `"variables"` -
  对于在模式中定义的键，需要定义相应的变量，以通知语言服务器从模块标识符的那一部分获取补全。在上面的示例中，我们有
  3 个变

量，`package`、`version` 和 `path`，因此我们期望为每个变量定义。

### 变量

在配置模式中，`"variables"` 属性是变量定义数组，这些对象具有两个必需属性：

- `"key"` - 一个与模式属性中的变量键名匹配的字符串。

- `"documentation"` - 一个可选的
  URL，语言服务器可以从中获取单个变量条目的文档。变量可以被替换以构建最终的
  URL。具有单括号格式的变量，如
  `${variable}`，将被添加为字符串中的匹配部分，而具有双括号格式的变量，如
  `${{variable}}`，将被作为 URI 组件部分进行百分比编码。

- `"url"` - 语言服务器可以从中获取变量的补全的 URL。变量可以被替换以构建
  URL。具有单括号格式的变量，如
  `${variable}`，将被添加为字符串中的匹配部分，而具有双括号格式的变量，如
  `${{variable}}`，将被作为 URI 组件部分进行百分比编码。如果包含 `"key"`
  的值，则语言服务器将支持对部分模块的增量请求，允许服务器在用户输入变量值的一部分时提供补全。如果
  URL 不是完全合格的，将使用模式文件的 URL
  作为基础。在我们上面的示例中，我们有三个变量，所以我们的变量定义可能如下所示：

  ```json
  {
    "version": 1,
    "registries": [
      {
        "schema": "/:package([a-z0-9_]*)@:version?/:path*",
        "variables": [
          {
            "key": "package",
            "documentation": "https://api.example.com/docs/packages/${package}",
            "url": "https://api.example.com/packages/${package}"
          },
          {
            "key": "version",
            "url": "https://api.example.com/packages/${package}/versions"
          },
          {
            "key": "path",
            "documentation": "https://api.example.com/docs/packages/${package}/${{version}}/paths/${path}",
            "url": "https://api.example.com/packages/${package}/${{version}}/paths/${path}"
          }
        ]
      }
    ]
  }
  ```

#### URL 端点

每个 URL 端点的响应需要是一个字符串数组或一个 _补全列表_ 的 JSON 文档：

```typescript
interface CompletionList {
  /** 补全项列表（或部分列表）。 */
  items: string[];
  /** 如果列表是部分列表，并且对端点的进一步查询将更改项目，请将 `isIncomplete` 设置为 `true`。 */
  isIncomplete?: boolean;
  /** 如果列表中的某一项应预先选择（默认建议），则将 `preselect` 的值设置为该项的值。 */
  preselect?: string;
}
```

从上面的示例中，URL `https://api.example.com/packages`
预计将返回类似以下的内容：

```json
[
  "a_package",
  "another_package",
  "my_awesome_package"
]
```

或类似以下：

```json
{
  "items": [
    "a_package",
    "another_package",
    "my_awesome_package"
  ],
  "isIncomplete": false,
  "preselect": "a_package"
}
```

而对 `https://api.example.com/packages/a_package/versions`
的查询将返回类似以下的内容：

```json
[
  "v1.0.0",
  "v1.0.1",
  "v1.1.0",
  "v2.0.0"
]
```

或：

```json
{
  "items": [
    "v1.0.0",
    "v1.0.1",
    "v1.1.0",
    "v2.0.0"
  ],
  "preselect": "v2.0.0"
}
```

查询 `https://api.example.com/packages/a_package/versions/v1.0.0/paths`
将返回类似于：

```json
[
  "a.ts",
  "b/c.js",
  "d/e.ts"
]
```

或：

```json
{
  "items": [
    "a.ts",
    "b/c.js",
    "d/e.ts"
  ],
  "isIncomplete": true,
  "preselect": "a.ts"
}
```

#### 多部分变量和文件夹

对于用户来说，导航大型文件列表可能是一项挑战。通过 注册表
V2，语言服务器对返回的项目进行了特殊处理 以更容易完成子文件夹中的文件路径。

当返回以 `/` 结尾的项目时，语言服务器将其呈现给客户端
作为一个“文件夹”，将在客户端中表示。因此
希望提供子导航到像这样的文件夹结构的注册表：

```
examples/
└─┬─ first.ts
  └─ second.ts
sub-mod/
└─┬─ mod.ts
  └─ tests.ts
mod.ts
```

并且具有类似 `/:package([a-z0-9_]*)@:version?/:path*` 的架构和 API `path`
的端点如下 `https://api.example.com/packages/${package}/${{version}}/${path}`
将希望 以 `/packages/pkg/1.0.0/` 的路径响应：

```json
{
  "items": [
    "examples/",
    "sub-mod/",
    "mod.ts"
  ],
  "isIncomplete": true
}
```

以 `/packages/pkg/1.0.0/examples/` 的路径响应：

```json
{
  "items": [
    "examples/first.ts",
    "examples/second.ts"
  ],
  "isIncomplete": true
}
```

这将允许用户在获取文件结构之前选择 IDE 中的文件夹 `examples`，
从而更容易导航文件结构。

#### 文档端点

文档端点应返回与请求的实体相关的文档对象：

```typescript
interface Documentation {
  kind: "markdown" | "plaintext";
  value: string;
}
```

为了扩展上面的示例，查询到 `https://api.example.com/packages/a_package`
将返回类似于：

```json
{
  "kind": "markdown",
  "value": "一些 _markdown_ `documentation` 在这里..."
}
```

### 模式验证

当语言服务器启动时（或扩展的配置更改时），语言服务器将尝试获取并验证配置中域主机指定的架构配置。

验证试图确保所有定义的注册表都是有效的，那些架构中包含的变量在变量中指定，并且没有定义未包含在架构中的额外变量。
如果验证失败，注册表将不会启用，并且错误将记录到 vscode 中的 Deno Language
Server 输出中。

如果您是注册表维护者，并且需要帮助、建议或协助设置 为自动完成而打开一个
[问题](https://github.com/denoland/deno/issues/new?labels=lsp&title=lsp%3A%20registry%20configuration)
我们将尽力提供帮助。

## 已知的注册表

以下是已知支持该方案的注册表列表。您只需将域添加到 `deno.suggest.imports.hosts`
中，并将值设置为 `true`：

- `https://deno.land/` - 3rd party `/x/` 注册表和 `/std/` 库注册表都可用。
- `https://nest.land/` - 适用于 Deno 的模块注册表，基于 blockweave。
- `https://crux.land/` - 用于永久托管小型脚本的自由开源注册表。
