# 持续集成

Deno 内置的工具使为您的项目设置持续集成（CI）管道变得很容易。可以使用相应的命令
`deno test`，`deno lint` 和 `deno fmt`
进行代码测试、代码检查和格式化。此外，您可以在管道中从测试结果生成代码覆盖率报告，使用
`deno coverage`。

在本页面上，我们将讨论：

- [设置基本管道](#setting-up-a-basic-pipeline)
- [跨平台工作流程](#cross-platform-workflows)
- [加速 Deno 管道](#speeding-up-deno-pipelines)
  - [减少重复](#reducing-repetition)
  - [缓存依赖](#caching-dependencies)

## 设置基本管道

本页面将向您展示如何在 GitHub Actions 中为 Deno
项目设置基本管道。本页面上解释的概念基本适用于其他 CI 提供程序，如 Azure
Pipelines、CircleCI 或 GitLab。

通常，为 Deno 构建管道的第一步是检出存储库并安装 Deno：

```yaml
name: Build

on: push

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x # 使用最新稳定的Deno版本。
```

要扩展工作流，只需添加您可能需要的 `deno` 子命令之一：

```yaml
      # 检查代码是否符合Deno的默认格式规范。
      - run: deno fmt --check

      # 扫描代码以查找语法错误和样式问题。如果您想使用自定义的linter配置，可以使用--config <myconfig>添加配置文件。
      - run: deno lint

      # 运行存储库中的所有测试文件并收集代码覆盖率。示例中以所有权限运行，但建议根据您的程序所需的最低权限运行（例如--allow-read）。
      - run: deno test --allow-all --coverage=cov/

      # 这会从`deno test --coverage`中收集的覆盖率生成报告。它以.lcov文件的形式存储，可与诸如Codecov、Coveralls和Travis CI等服务很好地集成。
      - run: deno coverage --lcov cov/ > cov.lcov
```

## 跨平台工作流程

作为 Deno
模块维护者，您可能希望确保您的代码在今天使用的所有主要操作系统上运行正常：Linux、MacOS
和
Windows。可以通过在不同操作系统上运行并行作业的矩阵来实现跨平台工作流程，每个作业在不同的操作系统上运行构建：

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-22.04, macos-12, windows-2022]
    steps:
      - run: deno test --allow-all --coverage cov/
```

> 注意：GitHub Actions 存在已知的
> [问题](https://github.com/actions/checkout/issues/135)，在处理 Windows
> 样式的行尾（CRLF）时可能会出现问题。这可能会在运行 `windows` 上的作业中运行
> `deno fmt` 时导致问题。为了防止这种情况，可以在运行 `actions/checkout@v3`
> 步骤之前配置 Actions 运行程序使用 Linux 样式的行尾：
>
> ```
> git config --system core.autocrlf false
> git config --system core.eol lf
> ```

如果您使用实验性或不稳定的 Deno API，可以包括一个运行 Deno 的 canary
版本的矩阵作业。这可以帮助及早发现破坏性更改：

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.canary }} # 如果canary运行失败，继续运行
    strategy:
      matrix:
        os: [ubuntu-22.04, macos-12, windows-2022]
        deno-version: [v1.x]
        canary: [false]
        include: 
          - deno-version: canary
            os: ubuntu-22.04
            canary: true
```

## 加速 Deno 管道

### 减少重复

在跨平台运行中，管道的某些步骤不一定需要为每个操作系统运行。例如，在
Linux、MacOS 和 Windows
上生成相同的测试覆盖率报告有点多余。在这些情况下，您可以使用 GitHub Actions 的
`if` 条件关键字。下面的示例显示了如何仅在
`ubuntu`（Linux）运行程序上运行代码覆盖率生成和上传步骤：

```yaml
- name: 生成覆盖率报告
  if: matrix.os == 'ubuntu-22.04'
  run: deno coverage --lcov cov > cov.lcov

- name: 将覆盖率上传至Coveralls.io
  if: matrix.os == 'ubuntu-22.04'
  # 可以使用任何代码覆盖率服务，此处仅以Coveralls.io为示例。
  uses: coverallsapp/github-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }} # 由GitHub生成。
    path-to-lcov: cov.lcov
```

### 缓存依赖

随着项目规模的增长，通常会包含越来越多的依赖项。Deno
会在测试过程中下载这些依赖项，如果每天运行多次工作流程，这可能会变得很耗时。加速速度的常见解决方案是缓存依赖项，以便不需要重新下载它们。

[Deno 在本地存储依赖项](https://deno.land/manual/linking_to_external_code)。在管道中，可以通过设置`DENO_DIR

`环境变量并在工作流程中添加缓存步骤来在工作流程之间保留缓存：

```yaml
# 将DENO_DIR设置为运行程序上的绝对或相对路径。
env:
  DENO_DIR: my_cache_directory

steps:
  - name: 缓存Deno依赖项 
    uses: actions/cache@v2
    with:
      path: ${{ env.DENO_DIR }}
      key: my_cache_key
```

首次运行此工作流程时，缓存仍然为空，命令如 `deno test`
仍然需要下载依赖项，但是当作业成功时，`DENO_DIR`
的内容将被保存，并且在随后的运行中可以从缓存中还原，而无需重新下载。

在上面的工作流程中仍然存在一个问题：当前缓存键的名称硬编码为
`my_cache_key`，这将导致每次都还原相同的缓存，即使更新了某些依赖项。这可能会导致在管道中使用旧版本，即使您已更新某些依赖项。解决方案是通过使用锁定文件并使用
GitHub Actions 提供的 `hashFiles` 函数来生成每次需要更新缓存时的不同键：

```yaml
key: ${{ hashFiles('deno.lock') }}
```

为使其起作用，您还需要在 Deno
项目中有一个锁定文件，可以在此处详细讨论。现在，如果更改了 `deno.lock`
的内容，将会创建新的缓存，并在随后的管道运行中使用它。

为了演示，假设您有一个项目，该项目使用 `deno.land/std` 的日志记录器：

```ts
import * as log from "https://deno.land/std@$STD_VERSION/log/mod.ts";
```

为了增加此版本，您可以更新 `import` 语句，然后重新加载缓存并在本地更新锁定文件：

```
deno cache --reload --lock=deno.lock --lock-write deps.ts
```

运行此命令后，应该会在锁定文件的内容中看到更改。当提交并通过管道运行时，您应该会看到
`hashFiles` 函数保存新的缓存，并在随后的运行中使用它。

#### 清除缓存

偶尔，您可能会遇到已损坏或格式不正确的缓存，这可能会因各种原因发生。可以在
GitHub Actions UI
中清除缓存，或者可以简单地更改缓存键的名称。一种在不必强制更改锁定文件的情况下执行此操作的实际方法是向缓存键名称添加一个变量，该变量可以作为
GitHub 秘密存储，并在需要新缓存时进行更改：

```yaml
key: ${{ secrets.CACHE_VERSION }}-${{ hashFiles('deno.lock') }}
```
