import OpenApiEndpoint from "@site/src/components/OpenApiEndpoint";

# 部署

部署是一个容器，用于存储与部署的无服务器应用程序相关的资产、环境变量、编译器选项等数据。

## 创建部署

<!-- deno-fmt-ignore-start -->

<OpenApiEndpoint path="/projects/{projectId}/deployments" method="post"
  customDocs={{ 
    compilerOptions: "查看下面的 **编译器选项**。", 
    assets: "查看下面的 **部署资产**。", 
  }}
>
  <p>
    启动新部署的构建过程。请注意，此过程是异步的 - 对此端点 API 的成功请求并不表示部署已准备就绪。
  </p>
  <p>
    目前，您可以通过轮询部署的构建日志或部署详细信息的 API 端点来跟踪构建的进度，分别是&nbsp;
    <a href="#get-deployment-build-logs">部署构建日志</a> 或&nbsp;
    <a href="#get-deployment-details">部署详细信息</a>。
  </p>
</OpenApiEndpoint>

<!-- deno-fmt-ignore-end -->

### 编译器选项

通过与部署创建请求一起发送的 `POST` 主体的 `compilerOptions` 键可以覆盖通常在
[这里的 deno.json](/runtime/manual/getting_started/configuration_file#compileroptions)
中配置的选项。 编译器选项将决定应用程序的 TypeScript 代码将如何被处理。

如果提供了 `null`，Deploy 将尝试在部署的资产中查找 `deno.json` 或
`deno.jsonc`。如果提供了一个空对象 `{}`，Deploy 将使用默认的 TypeScript 配置。

### 部署资产

与部署相关的资产是驱动部署行为并处理传入请求的代码和静态文件。在发送到此端点的
`POST` 请求的 JSON 主体中， 您将包含一个包含表示特定资产的文件路径的键的
`assets` 属性。

因此，例如 - 存储在部署目录下的文件 `server/main.ts` 将使用该路径作为资产的键。

资产有一个与之关联的 `kind` 属性，可以是以下之一：

- `file` - 与部署相关的实际文件
- `symlink` -
  到部署中另一个文件的[符号链接](https://en.wikipedia.org/wiki/Symbolic_link)

文件资产还具有一个 `content` 属性，正如您可能想象的那样，这是文件的实际内容。
这些资产还有一个 `encoding` 属性，指示内容是以 `utf-8`（纯文本）还是以
[base64 编码内容](https://developer.mozilla.org/en-US/docs/Glossary/Base64)编码的。

为了避免重新上传很少更改的文件，您还可以指定一个 `gitSha1`
属性，它是指先前为指定资产上传的内容的 `SHA-1` 哈希。

以下是可用于设置部署的 `assets` 的示例。

```json
{
  "assets": {
    "main.ts": {
      "kind": "file",
      "content": "Deno.serve((req: Request) => new Response(\"Hello World\"));",
      "encoding": "utf-8"
    },
    "images/cat1.png": {
      "kind": "file",
      "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk",
      "encoding": "base64"
    },
    "images/cat2.png": {
      "kind": "file",
      "gitSha1": "5c4f8729e5c30a91a890e24d7285e89f418c637b"
    },
    "symlink.png": {
      "kind": "symlink",
      "target": "images/cat1.png"
    }
  }
}
```

## 获取部署详细信息

<OpenApiEndpoint path="/deployments/{deploymentId}" method="get">
  获取具有给定 ID 的部署的详细信息。可以轮询此端点以跟踪无服务器应用程序部署的结果。
</OpenApiEndpoint>

## 获取部署构建日志

<OpenApiEndpoint path="/deployments/{deploymentId}/build_logs" method="get">
  获取由 ID 指定的部署的构建日志。您可以使用此信息来检查构建的当前状态，或在失败的情况下找出发生了什么。
  <br/><br/>
  可以通过 <code>Accept</code> 头来控制响应格式。如果指定了&nbsp;
  <code>application/x-ndjson</code>，响应将是一个换行符分隔的 JSON 对象流。
  否则，它将是对象的 JSON 数组。
</OpenApiEndpoint>

## 获取部署应用程序日志

<OpenApiEndpoint path="/deployments/{deploymentId}/app_logs" method="get">
  获取部署的执行日志。此 API 可以返回过去的日志或实时日志，具体取决于 <code>since</code> 和&nbsp;
  <code>until</code> 查询参数的存在。如果提供了其中至少一个，将返回过去的日志。否则将返回实时日志。
  <br/><br/>
  此外，可以通过 <code>Accept</code> 头来控制响应格式。如果指定了 <code>application/x-ndjson</code>，
  响应将是一个换行符分隔的 JSON 对象流。否则，它将是对象的 JSON 数组。
</OpenApiEndpoint>
