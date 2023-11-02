# 如何在 Digital Ocean 上部署 Deno

Digital Ocean
是一家流行的云基础设施提供商，提供各种托管服务，从网络、计算到存储不等。

以下是一步一步的指南，使用 Docker 和 GitHub Actions 部署 Deno 应用到 Digital
Ocean。

首先需要满足以下前提条件：

- [`docker` 命令行工具](https://docs.docker.com/engine/reference/commandline/cli/)
- 一个 [GitHub 账户](https://github.com)
- 一个 [Digital Ocean 账户](https://digitalocean.com)
- [`doctl` 命令行工具](https://docs.digitalocean.com/reference/doctl/how-to/install/)

## 创建 Dockerfile 和 docker-compose.yml 文件

为了专注于部署，我们的应用将仅包含一个 `main.ts` 文件，返回一个字符串作为 HTTP
响应：

```ts, ignore
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello from Deno and Digital Ocean!";
});

await app.listen({ port: 8000 });
```

然后，我们将创建两个文件 — `Dockerfile` 和 `docker-compose.yml`，用于构建 Docker
镜像。

在我们的 `Dockerfile` 中，添加以下内容：

```Dockerfile, ignore
FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]
```

接着，在我们的 `docker-compose.yml` 文件中：

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

可以通过运行以下命令在本地测试：`docker compose -f docker-compose.yml build`，然后
`docker compose up`，并访问 `localhost:8000`。

![Hello from localhost](../../images/how-to/digital-ocean/hello-world-from-localhost.png)

它运行正常！

## 构建、标记和推送 Docker 镜像到 Digital Ocean 容器注册表

Digital Ocean 有自己的私有容器注册表，我们可以使用它来推送和拉取 Docker
镜像。为了使用该注册表，让我们首先[在命令行上安装和认证 `doctl`](https://docs.digitalocean.com/reference/doctl/how-to/install/)。

之后，我们将创建一个名为 `deno-on-digital-ocean` 的新私有注册表：

```shell, ignore
doctl registry create deno-on-digital-ocean
```

使用我们的 Dockerfile 和
docker-compose.yml，我们将构建一个新的镜像，标记它，然后将其推送到注册表。注意，`docker-compose.yml`
将本地构建的镜像命名为 `deno-image`。

```shell, ignore
docker compose -f docker-compose.yml build
```

让我们[使用标签（tag）](https://docs.docker.com/engine/reference/commandline/tag/)将其标记为
`new`：

```shell, ignore
docker tag deno-image registry.digitalocean.com/deno-on-digital-ocean/deno-image:new
```

现在我们可以将其推送到注册表：

```shell, ignore
docker push registry.digitalocean.com/deno-on-digital-ocean/deno-image:new
```

您应该在[Digital Ocean 容器注册表](https://cloud.digitalocean.com/registry)中看到带有
`new` 标签的新 `deno-image`。

![New deno image on Digital Ocean container registry](../../images/how-to/digital-ocean/new-deno-image-on-digital-ocean-container-registry.png)

完美！

## 通过 SSH 部署到 Digital Ocean

一旦我们的 `deno-image` 存储在注册表中，我们可以在任何地方使用 `docker run`
来运行它。在这种情况下，我们将在[Digital Ocean Droplet](https://www.digitalocean.com/products/droplets)上运行它，这是他们托管的虚拟机。

在[您的 Droplet 页面](https://cloud.digitalocean.com/droplets)上，点击您的
Droplet，然后点击 `console` 以 SSH
进入虚拟机。您也可以[直接从命令行中使用 SSH 连接](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/)。

为了下载 `deno-image` 镜像并运行它，运行以下命令：

```shell, ignore
docker run -d --restart always -it -p 8000:8000 --name deno-image registry.digitalocean.com/deno-on-digital-ocean/deno-image:new
```

使用浏览器访问 Digital Ocean 地址，现在您会看到：

![Hello from Deno and Digital Ocean](../../images/how-to/digital-ocean/hello-from-deno-and-digital-ocean.png)

成功！

## 通过 GitHub Actions 自动化部署

让我们使用 GitHub Actions 自动化整个流程。

首先，让我们获取登录 `doctl` 和 SSH 到 Droplet 所需的所有环境变量：

- [DIGITALOCEAN_ACCESS_TOKEN](https://docs.digitalocean.com/reference/api/create-personal-access-token/)
- DIGITALOCEAN_HOST（您的 Droplet 的 IP 地址）
- DIGITALOCEAN_USERNAME（默认是 `root`）
- DIGITALOCEAN_SSHKEY（后面会详细说明）

### 生成 `DIGITALOCEAN_SSHKEY`

`DIGITALOCEAN_SSHKEY` 是一个私钥，其公共部分存在于虚拟机的
`~/.ssh/authorized_keys` 文件中。

首先，在本地机器上运行 `ssh-keygen` 命令：

```shell, ignore
ssh-keygen
```

在提示输入电子邮件时，**确保使用您的 GitHub 电子邮件**，以便 GitHub Actions
正确进行身份验证。最后的输出应如下所示：

```
Output
Your identification has been saved in /your_home/.ssh/id_rsa
Your public key has been saved in /your_home/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:/hk7MJ5n5aiqdfTV

UZr+2Qt+qCiS7BIm5Iv0dxrc3ks user@host
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

接下来，我们需要将新生成的公钥上传到您的 Droplet。您可以使用
[`ssh-copy-id`](https://www.ssh.com/academy/ssh/copy-id) 或手动复制，然后 SSH 到
Droplet，并将其粘贴到 `~/.ssh/authorized_keys`。

使用 `ssh-copy-id`：

```shell, ignore
ssh-copy-id {{ username }}@{{ host }}
```

该命令将提示您输入密码。请注意，这将自动从本地机器复制 `id_rsa.pub`
密钥，并将其粘贴到您的 Droplet 的 `~/.ssh/authorized_keys`
文件中。如果您的密钥名称不是 `id_rsa`，您可以使用 `-i` 标志将其传递给命令：

```shell, ignore
ssh-copy-id -i ~/.ssh/mykey {{ username }}@{{ host }}
```

要测试是否成功：

```shell, ignore
ssh -i ~/.ssh/mykey {{ username }}@{{ host }}
```

太棒了！

### 定义 yml 文件

最后一步是将所有这些放在一起。基本上，我们正在将手动部署的每个步骤添加到 GitHub
Actions 工作流的 yml 文件中：

```yml, ignore
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
          # 登录到 Digital Ocean Container Registry
          docker login -u ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} -p ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} registry.digitalocean.com
          # 停止并删除正在运行的镜像。
          docker stop ${{ env.IMAGE_NAME }}
          docker rm ${{ env.IMAGE_NAME }}
          # 从新镜像运行新容器
          docker run -d --restart always -it -p 8000:8000 --name ${{ env.IMAGE_NAME }} ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.TAG }}
```

当您推送到 GitHub 时，将自动检测到此 yml 文件，并触发部署操作。
