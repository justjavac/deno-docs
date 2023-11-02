# 如何部署到 Google Cloud Run

[Google Cloud Run](https://cloud.google.com/run) 是一个托管的计算平台，允许您在
Google 的可伸缩基础设施上运行容器。

本操作指南将向您展示如何使用 Docker 将您的 Deno 应用程序部署到 Google Cloud
Run。

首先，我们将向您展示如何手动部署，然后我们将向您展示如何使用 GitHub Actions
自动化部署。

先决条件：

- [Google Cloud Platform 账户](https://cloud.google.com/gcp)
- 安装 [`docker` CLI](https://docs.docker.com/engine/reference/commandline/cli/)
- 安装 [`gcloud`](https://cloud.google.com/sdk/gcloud)

## 手动部署

### 创建 `Dockerfile` 和 `docker-compose.yml`

为了专注于部署，我们的应用程序将仅包含一个 `main.ts`
文件，该文件返回一个字符串作为 HTTP 响应：

```ts, ignore
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "来自Deno和Google Cloud Run的问候!";
});

await app.listen({ port: 8000 });
```

然后，我们将创建两个文件 -- `Dockerfile` 和 `docker-compose.yml` -- 用于构建
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

让我们通过运行 `docker compose -f docker-compose.yml build`，然后运行
`docker compose up` 来在本地测试它，然后访问 `localhost:8000`。

![来自本地的问候](../../images/how-to/google-cloud-run/hello-world-from-localhost.png)

它正常工作！

### 设置 Artifact Registry

Artifact Registry 是 GCP 的 Docker 镜像私有注册表。

在我们可以使用它之前，转到 GCP 的
[Artifact Registry](https://console.cloud.google.com/artifacts)，然后点击
"创建存储库"。您将被要求提供一个名称（`deno-repository`）和一个区域（`us-central1`）。然后点击
"创建"。

![Google Artifact Repository 中的新存储库](../../images/how-to/google-cloud-run/new-repository-in-google-artifact-repository.png)

### 构建、标记并推送到 Artifact Registry

一旦我们创建了一个存储库，我们就可以开始将镜像推送到其中。

首先，让我们将注册表的地址添加到 `gcloud` 中：

```shell, ignore
gcloud auth configure-docker us-central1-docker.pkg.dev
```

然后，让我们构建您的 Docker 镜像（请注意，镜像名称在我们的 `docker-compose.yml`
文件中定义）：

```shell, ignore
docker compose -f docker-compose.yml build
```

然后，使用新的 Google Artifact Registry 地址、存储库和名称来
[标记](https://docs.docker.com/engine/reference/commandline/tag/)
它。镜像名称应遵循此结构：`{{位置}}-docker.pkg.dev/{{google_cloudrun_project_name}}/{{repository}}/{{image}}`。

```shell, ignore
docker tag deno-image us-central1-docker.pkg.dev/deno-app-368305/deno-repository/deno-cloudrun-image
```

如果您不指定标签，它将默认使用 `:latest`。

接下来，推送镜像：

```shell, ignore
docker push us-central1-docker.pkg.dev/deno-app-368305/deno-repository/deno-cloudrun-image
```

_[有关如何将图像推送和拉取到 Google Artifact Registry 的更多信息](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling)。_

您的镜像现在应该出现在 Google Artifact Registry 中！

![Google Artifact Registry 中的镜像](../../images/how-to/google-cloud-run/image-in-google-artifact-registry.png)

### 创建 Google Cloud Run 服务

我们需要一个实例，我们可以在其中构建这些镜像，所以转到
[Google Cloud Run](https://console.cloud.google.com/run)，然后点击 "创建服务"。

让我们命名它为 "hello-from-deno"。

选择 "从现有容器镜像部署一个修订版本"。使用下拉菜单从 `deno-repository` Artifact
Registry 中选择镜像。

选择 "允许未经身份验证的请求"，然后点击 "创建服务"。确保端口是 `8000`。

当完成后，您的应用程序现在应该是在线的：

![Google Cloud Run 中的问候](../../images/how-to/google-cloud-run/hello-from-google-cloud-run.png)

太棒了！

### 使用 `gcloud` 进行部署

现在它已经创建，我们将能够使用 `gcloud` CLI
从该服务部署。命令遵循此结构：`gcloud run deploy {{service_name}} --image={{image}} --region={{region}} --allow-unauthenticated`。请注意，`image`
名称遵循上面的结构。

对于此示例，命令是：

```shell, ignore
gcloud run deploy hello-from-deno --image=us-central1-docker.pkg.dev/deno-app-368305/deno-repository/deno-cloudrun-image --region=us-central1 --allow-unauthenticated
```

![Google Cloud Run 中的问候](../../images/how-to/google-cloud-run/hello-from-google-cloud-run.png)

成功！

## 使用 GitHub Actions 自动化部署

为了使自动化工作，我们首先需要确保这两者都已经创建：

- Google Artifact Registry
- Google Cloud Run 服务实例

（如果您还没有这样做，请参阅前面的部分。）

现在我们已经完成了这一点，我们可以使用 GitHub 工作流来自动化它。以下是 yaml
文件：

```yml, ignore
name: 构建并部署到

Cloud Run

on:
  push:
    branches:
      - main

env:
  PROJECT_ID: {{PROJECT_ID}}
  GAR_LOCATION: {{GAR_LOCATION}}
  REPOSITORY: {{GAR_REPOSITORY}}
  SERVICE: {{SERVICE}}
  REGION: {{REGION}}

jobs:
  deploy:
    name: 部署
    permissions:
      contents: 'read'
      id-token: 'write'

    runs-on: ubuntu-latest
    steps:
    - name: 检出
      uses: actions/checkout@v3

    - name: Google身份验证
      id: auth
      uses: 'google-github-actions/auth@v0'
      with:
        credentials_json: '${{secrets.GCP_CREDENTIALS}}'

    - name: 登录到GAR
      uses: docker/login-action@v2.1.0
      with:
        registry: ${{env.GAR_LOCATION}}-docker.pkg.dev
        username: _json_key
        password: ${{secrets.GCP_CREDENTIALS}}

    - name: 构建和推送容器
      run: |-
        docker build -t "${{env.GAR_LOCATION}}-docker.pkg.dev/${{env.PROJECT_ID}}/${{env.REPOSITORY}}/${{env.SERVICE}}:${{github.sha}}" ./
        docker push "${{env.GAR_LOCATION}}-docker.pkg.dev/${{env.PROJECT_ID}}/${{env.REPOSITORY}}/${{env.SERVICE}}:${{github.sha}}"

    - name: 部署到Cloud Run
      id: deploy
      uses: google-github-actions/deploy-cloudrun@v0
      with:
        service: ${{env.SERVICE}}
        region: ${{env.REGION}}
        image: ${{env.GAR_LOCATION}}-docker.pkg.dev/${{env.PROJECT_ID}}/${{env.REPOSITORY}}/${{env.SERVICE}}:${{github.sha}}

    - name: 显示输出
      run: echo ${{steps.deploy.outputs.url}}
```

我们需要设置的环境变量是（括号中的示例是此存储库的示例）：

- `PROJECT_ID`：您的项目 ID（`deno-app-368305`）
- `GAR_LOCATION`：您的 Google Artifact Registry 设置的位置（`us-central1`）
- `GAR_REPOSITORY`：您给 Google Artifact Registry
  命名的名称（`deno-repository`）
- `SERVICE`：Google Cloud Run 服务的名称（`hello-from-deno`）
- `REGION`：您的 Google Cloud Run 服务的区域（`us-central1`）

我们需要设置的秘密变量是：

- `GCP_CREDENTIALS`：这是
  [服务账户](https://cloud.google.com/iam/docs/service-accounts) 的 JSON
  密钥。创建服务帐户时，请确保包括
  [所需的角色和权限](https://cloud.google.com/iam/docs/granting-changing-revoking-access#granting_access_to_a_user_for_a_service_account)
  以供 Artifact Registry 和 Google Cloud Run 使用。

[查看从 GitHub Actions 部署到 Cloud Run 的更多详细信息和示例。](https://github.com/google-github-actions/deploy-cloudrun)

供参考：
https://github.com/google-github-actions/example-workflows/blob/main/workflows/deploy-cloudrun/cloudrun-docker.yml
