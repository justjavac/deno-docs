---
title: "如何将 Deno 部署到 Digital Ocean"
url: /examples/digital_ocean_tutorial/
oldUrl:
- /runtime/manual/advanced/deploying_deno/digital_ocean/
- /runtime/tutorials/digital_ocean/
---

Digital Ocean
是一家流行的云基础设施提供商，提供从网络、计算到存储的各种托管服务。

以下是将 Deno 应用程序部署到 Digital Ocean 的分步指南，使用 Docker 和 GitHub
Actions。

此操作的前提条件是：

- [`docker` CLI](https://docs.docker.com/engine/reference/commandline/cli/)
- [GitHub 账户](https://github.com)
- [Digital Ocean 账户](https://digitalocean.com)
- [`doctl` CLI](https://docs.digitalocean.com/reference/doctl/how-to/install/)

## 创建 Dockerfile 和 docker-compose.yml

为了专注于部署，我们的应用程序将只是一个返回 HTTP 响应的 `main.ts` 文件：

```ts title="main.ts"
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello from Deno and Digital Ocean!";
});

await app.listen({ port: 8000 });
```

然后，我们将创建两个文件 —— `Dockerfile` 和 `docker-compose.yml` —— 以构建
Docker 镜像。

在我们的 `Dockerfile` 中，添加以下内容：

```Dockerfile title="Dockerfile"
FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno install --entrypoint main.ts

CMD ["run", "--allow-net", "main.ts"]
```

然后，在我们的 `docker-compose.yml` 中：

```yml
version: "3"

services:
  web:
    build: .
    container_name: deno-container
    image: deno-image
    ports:
      - "8000:8000"
```

让我们通过运行 `docker compose -f docker-compose.yml build`，然后
`docker compose up`，并访问 `localhost:8000` 来在本地测试。

![Hello from localhost](./images/how-to/digital-ocean/hello-world-from-localhost.png)

它工作了！

## 构建、标记并将 Docker 镜像推送到 Digital Ocean 容器注册表

Digital Ocean 有自己的私有容器注册表，我们可以推送和拉取 Docker
镜像。为了使用此注册表，让我们[在命令行上安装并验证 `doctl`](https://docs.digitalocean.com/reference/doctl/how-to/install/)。

之后，我们将创建一个名为 `deno-on-digital-ocean` 的新私有注册表：

```shell
doctl registry create deno-on-digital-ocean
```

使用我们的 Dockerfile 和
docker-compose.yml，我们将构建一个新镜像，标记它，并将其推送到注册表。请注意，`docker-compose.yml`
将在本地将构建命名为 `deno-image`。

```shell
docker compose -f docker-compose.yml build
```

让我们用 `new` 标记它：

```shell
docker tag deno-image registry.digitalocean.com/deno-on-digital-ocean/deno-image:new
```

现在我们可以将其推送到注册表。

```shell
docker push registry.digitalocean.com/deno-on-digital-ocean/deno-image:new
```

您应该会在 [Digital Ocean 容器注册表](https://cloud.digitalocean.com/registry)
中看到带有 `new` 标签的新 `deno-image`：

![New deno image on Digital Ocean container registry](./images/how-to/digital-ocean/new-deno-image-on-digital-ocean-container-registry.png)

完美！

## 通过 SSH 部署到 Digital Ocean

一旦我们的 `deno-image` 在注册表中，我们就可以在任何地方使用 `docker run`
运行它。在这种情况下，我们将在
[Digital Ocean Droplet](https://www.digitalocean.com/products/droplets)
中运行它，这是他们托管的虚拟机。

在您的 [Droplet 页面](https://cloud.digitalocean.com/droplets) 上，点击您的
Droplet，然后点击 `console` 以 SSH 进入虚拟机。（或者您可以直接从命令行
[ssh](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/)。）

要拉取 `deno-image` 镜像并运行它，让我们运行：

```shell
docker run -d --restart always -it -p 8000:8000 --name deno-image registry.digitalocean.com/deno-on-digital-ocean/deno-image:new
```

使用浏览器访问 Digital Ocean 地址，我们现在看到：

![Hello from Deno and Digital Ocean](./images/how-to/digital-ocean/hello-from-deno-and-digital-ocean.png)

成功了！

## 通过 GitHub Actions 自动化部署

让我们使用 GitHub Actions 自动化整个流程。

首先，让我们获取登录 `doctl` 和 SSH 进入 Droplet 所需的所有环境变量：

- [DIGITALOCEAN_ACCESS_TOKEN](https://docs.digitalocean.com/reference/api/create-personal-access-token/)
- DIGITALOCEAN_HOST（您的 Droplet 的 IP 地址）
- DIGITALOCEAN_USERNAME（默认为 `root`）
- DIGITALOCEAN_SSHKEY（更多信息见下文）

### 生成 `DIGITALOCEAN_SSHKEY`

`DIGITALOCEAN_SSHKEY` 是一个私钥，其公钥对应物存在于虚拟机的
`~/.ssh/authorized_keys` 文件中。

为此，首先让我们在本地机器上运行 `ssh-keygen`：

```shell
ssh-keygen
```

当提示输入电子邮件时，**请务必使用您的 GitHub 电子邮件**，以便 GitHub Action
正确验证。您的最终输出应如下所示：

```console
Output
Your identification has been saved in /your_home/.ssh/id_rsa
Your public key has been saved in /your_home/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:/hk7MJ5n5aiqdfTVUZr+2Qt+qCiS7BIm5Iv0dxrc3ks user@host
The key's randomart image is:
+---[RSA 3072]----+
|                .|
|               + |
|              +  |
| .           o . |
|o       S   . o  |
| + o. .oo. ..  .o|
|o = oooooEo+ ...o|
|.. o *o+=.*+o....|
|    =+=ooB=o.... |
+----[SHA256]-----+
```

接下来，我们必须将新生成的公钥上传到您的 Droplet。您可以使用
[`ssh-copy-id`](https://www.ssh.com/academy/ssh/copy-id) 或手动复制它，SSH
进入您的 Droplet，并将其粘贴到 `~/.ssh/authorized_keys` 中。

使用 `ssh-copy-id`：

```shell
ssh-copy-id {{ username }}@{{ host }}
```

此命令将提示您输入密码。请注意，这将自动从本地机器复制 `id_rsa.pub`
密钥并将其粘贴到您的 Droplet 的 `~/.ssh/authorized_keys`
文件中。如果您将密钥命名为 `id_rsa` 以外的名称，可以使用 `-i` 标志传递给命令：

```shell
ssh-copy-id -i ~/.ssh/mykey {{ username }}@{{ host }}
```

要测试是否成功完成：

```shell
ssh -i ~/.ssh/mykey {{ username }}@{{ host }}
```

太棒了！

### 定义 yml 文件

最后一步是将所有这些整合在一起。我们基本上是将手动部署期间的每个步骤添加到
GitHub Actions 工作流 yml 文件中：

```yml
name: Deploy to Digital Ocean

on:
  push:
    branches:
      - main

env:
  REGISTRY: "registry.digitalocean.com/deno-on-digital-ocean"
  IMAGE_NAME: "deno-image"

jobs:
  build_and_push:
    name: Build, Push, and Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout main
        uses: actions/checkout@v2

      - name: Set $TAG from shortened sha
        run: echo "TAG=`echo ${GITHUB_SHA} | cut -c1-8`" >> $GITHUB_ENV

      - name: Build container image
        run: docker compose -f docker-compose.yml build

      - name: Tag container image
        run: docker tag ${{ env.IMAGE_NAME }} ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.TAG }}

      - name: Install `doctl`
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to Digital Ocean Container Registry
        run: doctl registry login --expiry-seconds 600

      - name: Push image to Digital Ocean Container Registry
        run: docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.TAG }}

      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DIGITALOCEAN_HOST }}
          username: ${{ secrets.DIGITALOCEAN_USERNAME }}
          key: ${{ secrets.DIGITALOCEAN_SSHKEY }}
          script: |
            # Login to Digital Ocean Container Registry
            docker login -u ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} -p ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} registry.digitalocean.com
            # Stop and remove a running image.
            docker stop ${{ env.IMAGE_NAME }}
            docker rm ${{ env.IMAGE_NAME }}
            # Run a new container from a new image
            docker run -d --restart always -it -p 8000:8000 --name ${{ env.IMAGE_NAME }} ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.TAG }}
```

当您推送到 GitHub 时，此 yml 文件会自动检测，触发部署操作。
