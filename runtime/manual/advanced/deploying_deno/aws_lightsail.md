# 部署 Deno 到 Amazon Lightsail

[Amazon Lightsail](https://aws.amazon.com/lightsail/) 是使用 Amazon Web Services
开始的最简单和最便宜的方式。它允许您托管虚拟机，甚至整个容器服务。

这个操作指南将向您展示如何使用 Docker、Docker Hub 和 GitHub Actions 将 Deno
应用程序部署到 Amazon Lightsail。

在继续之前，请确保您具备以下条件：

- [`docker` CLI](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker Hub 帐户](https://hub.docker.com)
- [GitHub 帐户](https://github.com)
- [AWS 帐户](https://aws.amazon.com/)

## 创建 Dockerfile 和 docker-compose.yml

为了便于部署，我们的应用将只是一个返回字符串作为 HTTP 响应的 `main.ts` 文件：

```ts, ignore
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello from Deno and AWS Lightsail!";
});

await app.listen({ port: 8000 });
```

接下来，我们将创建两个文件 - `Dockerfile` 和 `docker-compose.yml` - 以构建
Docker 镜像。

在我们的 `Dockerfile` 中，让我们添加：

```Dockerfile, ignore
FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]
```

然后，在我们的 `docker-compose.yml` 中：

```yml, ignore
version: '3'

services:
  web:
    build: .
    container_name: deno-container
    image: deno-image
    ports:
      - "8000:8000"
```

让我们在本地测试它，运行 `docker compose -f docker-compose.yml build`，然后运行
`docker compose up`，并访问 `localhost:8000`。

![来自本地的世界你好](../../images/how-to/aws-lightsail/hello-world-from-localhost.png)

它有效！

## 构建、标记和推送到 Docker Hub

首先，让我们登录到 [Docker Hub](https://hub.docker.com/repositories)
并创建一个存储库。让我们将其命名为 `deno-on-aws-lightsail`。

然后，让我们标记并推送我们的新镜像，将 `username` 替换为您自己的用户名：

然后，让我们在本地构建镜像。请注意，我们的 `docker-compose.yml` 文件将构建命名为
`deno-image`。

```shell, ignore
docker compose -f docker-compose.yml build
```

让我们使用 `{{ username }}/deno-on-aws-lightsail` 标记本地镜像：

```shell, ignore
docker tag deno-image {{ username }}/deno-on-aws-lightsail
```

现在，我们可以将镜像推送到 Docker Hub：

```shell, ignore
docker push {{ username }}/deno-on-aws-lightsail
```

成功后，您应该能够在 Docker Hub 存储库上看到新镜像：

![Docker Hub 上的新镜像](../../images/how-to/aws-lightsail/new-image-on-docker-hub.png)

## 创建并部署到 Lightsail 容器

让我们转到
[Amazon Lightsail 控制台](https://lightsail.aws.amazon.com/ls/webapp/home/container-services)。

然后点击 "容器"，选择 "创建容器服务"。在页面中部，点击
"设置您的第一个部署"，然后选择 "指定自定义部署"。

您可以为容器命名任何容器名称。

在 "镜像" 中，请确保使用您在 Docker Hub 中设置的
`{{ username }}/{{ image }}`。对于本示例，它是
`lambtron/deno-on-aws-lightsail`。

让我们点击 "添加开放端口"，并添加 `8000`。

最后，在 "PUBLIC ENDPOINT" 下，选择您刚刚创建的容器名称。

完整表单应如下所示：

![在 AWS 上创建容器服务界面](../../images/how-to/aws-lightsail/create-container-service-on-aws.png)

当您准备好后，请点击 "创建容器服务"。

几分钟后，您的新容器应该已部署。单击公共地址，您应该看到您的 Deno 应用程序：

![来自 Deno 和 AWS Lightsail 的世界你好](../../images/how-to/aws-lightsail/hello-world-from-deno-and-aws-lightsail.png)

## 使用 GitHub Actions 自动化

为了自动化这个过程，我们将使用带有
[`lightsail` 子命令](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lightsail/push-container-image.html)
的 `aws` CLI。

我们的 GitHub Actions 工作流中的步骤将是：

1. 检出仓库
2. 本地构建我们的应用作为 Docker 镜像
3. 安装并验证 AWS CLI
4. 通过 CLI 推送本地 Docker 镜像到 AWS Lightsail 容器服务

此 GitHub Action 工作流能够工作需要的前提条件：

- 创建了 AWS Lightsail 容器实例（请参见上面的部分）
- 创建了 IAM 用户并设置了相关权限。
  （[请参见此处以了解有关为 IAM 用户管理对 Amazon Lightsail 的访问权限的更多信息。](https://github.com/awsdocs/amazon-lightsail-developer-manual/blob/master/doc_source/amazon-lightsail-managing-access-for-an-iam-user.md)）
- 为您的有权限用户获取 `AWS_ACCESS_KEY_ID` 和 `AWS_SUCCESS_ACCESS_KEY`。 （遵循
  [此 AWS 指南](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/lightsail-how-to-set-up-access-keys-to-use-sdk-api-cli)
  生成 `AWS_ACCESS_KEY_ID` 和 `AWS_SUCCESS_ACCESS_KEY`。）

让我们创建一个名为 `container.template.json`
的新文件，其中包含如何进行服务容器部署的配置。注意这些选项值与我们之前手动输入的值之间的相似之处。

```json, ignore
{
  "containers": {
    "app": {
      "image": "",
      "environment": {
        "APP_ENV": "release"
      },
      "ports": {
        "8000": "HTTP"
      }
    }
  },
  "publicEndpoint": {
    "containerName": "app",
    "containerPort": 8000,
    "healthCheck": {
      "healthyThreshold": 2,
      "unhealthyThreshold": 2,
      "timeoutSeconds": 5,
      "intervalSeconds": 10,
      "path": "/",
      "successCodes": "200-499"
    }
  }
}
```

让我们将下面的内容添加到您的 `.github/workflows/deploy.yml` 文件中：

```yml, ignore
name: 构建并部署到 AWS Lightsail

on:
  push:
    branches:
      - main

env:
  AWS_REGION: us-west-2
  AWS_LIGHTSAIL_SERVICE_NAME: container-service-2
jobs:
  build_and_deploy:
    name: 构建并部署
    runs-on: ubuntu-latest
    steps:
      - name: 检出 main
        uses: actions/checkout@v2

      - name: 安装工具
        run: |
          sudo apt-get update
          sudo apt-get install -y jq unzip
      - name: 安装 AWS 客户端
        run: |
          curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
          unzip awscliv2.zip
          sudo ./aws/install || true
          aws --version
          curl "https://s3.us-west-2.amazonaws.com/lightsailctl/latest/linux-amd64/lightsailctl" -o "lightsailctl"
          sudo mv "lightsailctl" "/usr/local/bin/lightsailctl"
          sudo chmod +x /usr/local/bin/lightsailctl
      - name: 配置 AWS 凭据
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-region: ${{ env.AWS_REGION }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - name: 构建 Docker 镜像
        run: docker build -t ${{ env.AWS_LIGHTSAIL_SERVICE_NAME }}:release .
      - name: 推送并部署
        run: |
          service_name=${{ env.AWS_LIGHTSAIL_SERVICE_NAME }}
          aws lightsail push-container-image \
            --region ${{ env.AWS_REGION }} \
            --service-name ${service_name} \
            --label ${service_name} \
            --image ${service_name}:release
          aws lightsail get-container-images --service-name ${service_name} | jq --raw-output ".containerImages[0].image" > image.txt
          jq --arg image $(cat image.txt) '.containers.app.image = $image' container.template.json > container.json
          aws lightsail create-container-service-deployment --service-name ${service_name} --cli-input-json file://$(pwd)/container.json
```

哇，这里有很多内容！最后两个步骤最重要：`构建 Docker 镜像` 和 `推送并部署`。

```shell, ignore
docker build -t ${{ env.AWS_LIGHTSAIL_SERVICE_NAME }}:release .
```

此命令使用名称为 `container-service-2` 的 Docker 镜像构建，并标记为 `release`。

```shell, ignore
aws lightsail push-container-image ...
```

此命令将本地镜像推送到 Lightsail 容器。

```shell, ignore
aws lightsail get-container-images --service-name ${service_name} | jq --raw-output ".containerImages[0].image" > image.txt
```

此命令检索镜像信息，并使用 [`jq`](https://stedolan.github.io/jq/)
解析它，将镜像名称保存在本地文件 `image.txt` 中。

```shell, ignore
jq --arg image $(cat image.txt) '.containers.app.image = $image' container.template.json > container.json
```

此命令使用保存在 `image.txt` 中的镜像名称和
`container.template.json`，创建一个名为 `container.json`
的新选项文件。此选项文件将在下一步中传递给 `aws lightsail` 进行最终部署。

```shell, ignore
aws lightsail create-container-service-deployment --service-name ${service_name} --cli-input-json file://$(pwd)/container.json
```

最后，此命令使用 `service_name`，以及 `container.json`
中的配置设置，创建新的部署。

当您推送到 GitHub 并且操作成功时，您将能够在 AWS 上看到您的新 Deno 应用程序：

![AWS 上的 Deno](../../images/how-to/aws-lightsail/hello-world-from-deno-and-aws-lightsail.png)
