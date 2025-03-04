---
title: Deno 和 Docker
---

## 使用 Deno 与 Docker

Deno 提供了 [官方 Docker 文件](https://github.com/denoland/deno_docker) 和
[镜像](https://hub.docker.com/r/denoland/deno)。

要使用官方镜像，请在项目目录中创建一个 `Dockerfile`：

```dockerfile
FROM denoland/deno:latest

# 创建工作目录
WORKDIR /app

# 复制源代码
COPY . .

# 编译主应用
RUN deno cache main.ts

# 运行应用
CMD ["deno", "run", "--allow-net", "main.ts"]
```

### 最佳实践

#### 使用多阶段构建

为了生成更小的生产镜像：

```dockerfile
# 构建阶段
FROM denoland/deno:latest as builder
WORKDIR /app
COPY . .
RUN deno cache main.ts

# 生产阶段
FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-net", "main.ts"]
```

#### 权限标志

明确指定所需的权限：

```dockerfile
CMD ["deno", "run", "--allow-net=api.example.com", "--allow-read=/data", "main.ts"]
```

#### 开发容器

用于支持热重载的开发环境：

```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY . .

CMD ["deno", "run", "--watch", "--allow-net", "main.ts"]
```

### 常见问题及解决方案

1. **权限被拒绝错误**
   - 正确使用 `--allow-*` 标志
   - 考虑使用 `deno.json` 权限

2. **镜像体积过大**
   - 使用多阶段构建
   - 仅包含必要的文件
   - 添加适当的 `.dockerignore`

3. **缓存失效**
   - 分离依赖缓存
   - 使用正确的层顺序

### 示例 .dockerignore

```text
.git
.gitignore
Dockerfile
README.md
*.log
_build/
node_modules/
```

### 可用的 Docker 标签

Deno 提供了多个官方标签：

- `denoland/deno:latest` - 最新的稳定版本
- `denoland/deno:alpine` - 基于 Alpine 的更小镜像
- `denoland/deno:distroless` - 基于 Google 的 distroless 镜像
- `denoland/deno:ubuntu` - 基于 Ubuntu 的镜像
- `denoland/deno:1.x` - 特定版本标签

### 环境变量

Deno 在 Docker 中常用的环境变量：

```dockerfile
ENV DENO_DIR=/deno-dir/
ENV DENO_INSTALL_ROOT=/usr/local
ENV PATH=${DENO_INSTALL_ROOT}/bin:${PATH}

# 可选环境变量
ENV DENO_NO_UPDATE_CHECK=1
ENV DENO_NO_PROMPT=1
```

### 在 Docker 中运行测试

```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY . .

# 运行测试
CMD ["deno", "test", "--allow-none"]
```

### 使用 Docker Compose

```yaml
// filepath: docker-compose.yml
version: "3.8"
services:
  deno-app:
    build: .
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DENO_ENV=development
    command: ["deno", "run", "--watch", "--allow-net", "main.ts"]
```

### 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD deno eval "try { await fetch('http://localhost:8000/health'); } catch { exit(1); }"
```

### 常见的开发工作流程

对于本地开发：

1. 构建镜像：`docker build -t my-deno-app .`
2. 使用卷挂载运行：

```bash
docker run -it --rm \
  -v ${PWD}:/app \
  -p 8000:8000 \
  my-deno-app
```

### 安全注意事项

- 以非 root 用户运行：

```dockerfile
# 创建 deno 用户
RUN addgroup --system deno && \
    adduser --system --ingroup deno deno

# 切换到 deno 用户
USER deno

# 继续 Dockerfile 的其余部分
```

- 使用最小权限：

```dockerfile
CMD ["deno", "run", "--allow-net=api.example.com", "--allow-read=/app", "main.ts"]
```

- 考虑使用 `--deny-*` 标志以增强安全性

## 在 Docker 中处理工作区

在 Docker 中使用 Deno 工作区（monorepo）时，有两种主要方法：

### 1. 完整工作区容器化

当需要所有依赖时，包含整个工作区：

```dockerfile
FROM denoland/deno:latest

WORKDIR /app

# 复制整个工作区
COPY deno.json .
COPY project-a/ ./project-a/
COPY project-b/ ./project-b/

WORKDIR /app/project-a
CMD ["deno", "run", "-A", "mod.ts"]
```

### 2. 最小化工作区容器化

为了生成更小的镜像，仅包含所需的工作区成员：

1. 创建构建上下文结构：

```sh
project-root/
├── docker/
│   └── project-a/
│       ├── Dockerfile
│       ├── .dockerignore
│       └── build-context.sh
├── deno.json
├── project-a/
└── project-b/
```

2. 创建 `.dockerignore`：

```text
// filepath: docker/project-a/.dockerignore
*
!deno.json
!project-a/**
!project-b/**  # 仅在需要时
```

3. 创建构建上下文脚本：

```bash
// filepath: docker/project-a/build-context.sh
#!/bin/bash

# 创建临时构建上下文
BUILD_DIR="./tmp-build-context"
mkdir -p $BUILD_DIR

# 复制工作区配置
cp ../../deno.json $BUILD_DIR/

# 复制主项目
cp -r ../../project-a $BUILD_DIR/

# 仅复制所需的依赖项
if grep -q "\"@scope/project-b\"" "../../project-a/mod.ts"; then
    cp -r ../../project-b $BUILD_DIR/
fi
```

4. 创建最小化的 Dockerfile：

```dockerfile
// filepath: docker/project-a/Dockerfile
FROM denoland/deno:latest

WORKDIR /app

# 仅复制必要的文件
COPY deno.json .
COPY project-a/ ./project-a/
# 仅在需要时复制依赖项
COPY project-b/ ./project-b/

WORKDIR /app/project-a

CMD ["deno", "run", "-A", "mod.ts"]
```

5. 构建容器：

```bash
cd docker/project-a
./build-context.sh
docker build -t project-a -f Dockerfile tmp-build-context
rm -rf tmp-build-context
```

### 最佳实践

- 始终包含根目录的 `deno.json` 文件
- 保持与开发相同的目录结构
- 清晰地记录工作区依赖关系
- 使用构建脚本来管理上下文
- 仅包含所需的工作区成员
- 当依赖关系发生变化时更新 `.dockerignore`
