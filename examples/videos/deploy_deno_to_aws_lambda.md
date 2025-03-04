---
title: "将 Deno 部署到 AWS Lambda"
url: /examples/deploy_deno_to_aws_lambda/
videoUrl: https://www.youtube.com/watch?v=_xLOrT3cWK4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=17
layout: video.tsx
---

## 视频描述

展示如何将 Deno 应用程序部署到 AWS Lambda（使用 Lambda 的社区运行时）。

## 文字稿和代码

### 在 AWS Lambda 上运行 Deno

在 AWS Lambda 上运行 Deno？当然可以。使用 AWS Lambda，无服务器定价可能比 VPS
更便宜，并且由于它可以自动扩展，因此更容易维护。

<!-- 我们这里有一个树形应用，我们想把它托管在 AWS 上。 -->

为了实现这一点，我们将使用 aws-lambda-adapter 项目来确保我们的 `Deno.serve`
函数按预期运行。这是部署到 AWS Lambda
的流行方法，因为它提供了控制、灵活性和一致性。

如果你想了解更多关于这些考虑因素的内容，博客上有一篇不错的文章。

让我们看一下可以用来实现这一点的 Dockerfile：

```dockerfile
# 设置基础镜像
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 AS aws-lambda-adapter
FROM denoland/deno:bin-2.0.2 AS deno_bin
FROM debian:bookworm-20230703-slim AS deno_runtime
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=deno_bin /deno /usr/local/bin/deno
ENV PORT=8000
EXPOSE 8000
RUN mkdir /var/deno_dir
ENV DENO_DIR=/var/deno_dir

# 复制函数代码
WORKDIR "/var/task"
COPY . /var/task

# 预热缓存
RUN timeout 10s deno -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["deno", "-A", "main.ts"]
```

然后我们将构建 Docker 镜像。

```shell
docker build -t my-deno-project .
```

现在我们需要开始与 AWS 交互。如果这是你第一次使用 AWS，你可以创建一个账户：
[https://aws.amazon.com](https://aws.amazon.com)

如果你还没有安装 AWS CLI，你也可以安装它。你可以通过在终端或命令提示符中输入
`aws` 来检查是否已安装。如果返回错误，你可以使用 homebrew
安装或按照网站上的说明进行操作：
[https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```
brew install awscli
```

然后你需要确保使用 `aws configure` 进行设置。它所需的所有内容都在
[AWS 控制台的安全凭证部分](https://us-east-1.console.aws.amazon.com/ecr/private-registry/repositories)。

### 使用 CLI 创建 ECR

ECR 是一个我们可以推送 Docker 容器的注册表服务

```
aws ecr create-repository --repository-name my-deno-project --region us-east-1 | grep repositoryUri
```

这将输出仓库的 URI：\`"repositoryUri":
"\<\<myuserid\>\>[.dkr.ecr.us-west-1.amazonaws.com/my-deno-project](http://.dkr.ecr.us-west-1.amazonaws.com/my-deno-project)",\`

然后使用返回的 URI 登录

```shell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <username>.dkr.ecr.us-east-1.amazonaws.com/my-deno-project
```

标记镜像

```shell
docker tag my-deno-project:latest <myProject>.dkr.ecr.us-east-1.amazonaws.com/my-deno-project:latest
```

然后将镜像推送到 ECR

```shell
docker push <myproject>.dkr.ecr.us-west-1.amazonaws.com/my-deno-project:latest
```

现在我们需要创建一个函数来托管我们的应用：

- [https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1\#/begin](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/begin)
- 将函数视为应用运行的地方
- 选择创建函数
- 选择容器镜像单选按钮
- 将函数命名为 `tree-app`
- 从浏览容器按钮中选择应用
- 在页面中间选择“配置”
- 选择 `Function URL`
- 创建一个 URL
- 选择 None 以使端点公开
- 选择保存
- 在浏览器中检查应用

使用 Lambda 函数时需要注意的一点是冷启动性能。当 AWS
需要初始化你的函数时，会发生冷启动，这可能会导致轻微的延迟。这里有一篇很酷的
[博客文章，比较了 Deno 与其他工具](https://deno.com/blog/aws-lambda-coldstart-benchmarks)。

将 Deno 与 AWS Lambda 函数结合使用是在熟悉的环境中快速启动应用的好方法。
