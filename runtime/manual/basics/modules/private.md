# 私有模块和仓库

在某些情况下，您可能希望加载位于私有仓库中的远程模块，例如 GitHub 上的私有仓库。

Deno 支持在请求远程模块时发送令牌。Bearer 令牌是 OAuth 2.0
中广泛使用的访问令牌类型，并得到许多托管服务的广泛支持（例如
GitHub、GitLab、Bitbucket、Cloudsmith 等）。

## DENO_AUTH_TOKENS

Deno CLI 将查找名为 `DENO_AUTH_TOKENS`
的环境变量，以确定在请求远程模块时应考虑使用哪些认证令牌。环境变量的值采用以下格式，由分号
(`;`) 分隔的 _n_ 个令牌，其中每个令牌是以下之一：

- 格式为 `{token}@{hostname[:port]}` 的 Bearer 令牌

- 格式为 `{username}:{password}@{hostname[:port]}` 的基本认证数据

例如，对于 `deno.land` 的单个令牌如下所示：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land
```

或者：

```sh
DENO_AUTH_TOKENS=username:password@deno.land
```

多个令牌的示例如下：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land;f1e2d3c4b5a6@example.com:8080;username:password@deno.land
```

当 Deno 获取远程模块时，如果主机名与远程模块的主机名匹配，Deno 将将请求的
`Authorization` 标头设置为 `Bearer {token}` 或 `Basic {base64EncodedData}`
的值。这允许远程服务器识别该请求是经过授权的请求，与特定认证用户相关联，并提供对服务器上的适当资源和模块的访问。

## GitHub

要访问 GitHub 上的私有仓库，您需要颁发自己一个 _个人访问令牌_。您可以通过登录到
GitHub 并进入 _设置 -> 开发人员设置 -> 个人访问令牌_ 来执行此操作：

![GitHub 上的个人访问令牌设置](../../images/private-pat.png)

然后，您可以选择 _生成新令牌_ 并为您的令牌添加描述和适当的访问权限：

![在 GitHub 上创建新的个人访问令牌](../../images/private-github-new-token.png)

创建后，GitHub 将仅显示新令牌一次，您将希望将其用作环境变量中的值：

![在 GitHub 上显示新创建的令牌](../../images/private-github-token-display.png)

为了访问存储在 GitHub 上的私有仓库中的模块，您将希望在 `DENO_AUTH_TOKENS`
环境变量中使用生成的令牌，作用域限定为 `raw.githubusercontent.com`
主机名。例如：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@raw.githubusercontent.com
```

这应该允许 Deno 访问由颁发令牌的用户可以访问的任何模块。

当令牌不正确或用户无法访问模块时，GitHub 将发出 `404 未找到`
状态，而不是未经授权的状态。因此，如果在命令行上出现试图访问的模块未找到的错误，请检查环境变量设置和个人访问令牌设置。

此外，`deno run -L debug`
应该会打印关于从环境变量中解析出的令牌数量的调试消息。如果感到任何令牌格式错误，它将打印出错误消息。出于安全原因，它不会打印出有关令牌的任何详细信息。
