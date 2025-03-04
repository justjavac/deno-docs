---
title: "持续集成"
oldUrl: /runtime/manual/advanced/continuous_integration
---

Deno
的内置工具使得为你的项目设置持续集成（CI）管道变得非常容易。[测试](/runtime/fundamentals/testing)、[代码检查和格式化](/runtime/fundamentals/linting_and_formatting/)都可以通过相应的命令
`deno test`、`deno lint` 和 `deno fmt` 来完成。此外，你还可以通过
`deno coverage` 在管道中从测试结果生成代码覆盖率报告。

## 设置基本管道

你可以在 GitHub Actions 中为 Deno 项目设置基本管道。本页解释的概念同样适用于其他
CI 提供商，例如 Azure Pipelines、CircleCI 或 GitLab。

为 Deno 构建管道通常从检出仓库并安装 Deno 开始：

```yaml
name: Build

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x # 使用最新的稳定版 Deno 运行。
```

要扩展工作流，可以添加你需要的任何 `deno` 子命令：

```yaml
# 检查代码是否按照 Deno 的默认格式化约定进行格式化。
- run: deno fmt --check

# 扫描代码以查找语法错误和样式问题。如果你想使用自定义的检查器配置，可以通过 --config <myconfig> 添加配置文件。
- run: deno lint

# 运行仓库中的所有测试文件并收集代码覆盖率。示例中使用了所有权限运行，但建议使用程序所需的最小权限运行（例如 --allow-read）。
- run: deno test --allow-all --coverage=cov/

# 从 `deno test --coverage` 收集的覆盖率生成报告。它存储为 .lcov 文件，与 Codecov、Coveralls 和 Travis CI 等服务集成良好。
- run: deno coverage --lcov cov/ > cov.lcov
```

## 跨平台工作流

作为 Deno
模块维护者，你可能希望知道你的代码在当今使用的主要操作系统上都能正常工作：Linux、MacOS
和
Windows。可以通过运行并行作业矩阵来实现跨平台工作流，每个作业在不同的操作系统上运行构建：

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - run: deno test --allow-all --coverage cov/
```

:::caution

注意：GitHub Actions 在处理 Windows
风格的行尾（CRLF）时存在一个已知的[问题](https://github.com/actions/checkout/issues/135)。这可能会在运行
`windows` 上的作业时导致 `deno fmt` 出现问题。为了防止这种情况，可以在运行
`actions/checkout@v3` 步骤之前配置 Actions runner 使用 Linux 风格的行尾：

```sh
git config --system core.autocrlf false
git config --system core.eol lf
```

:::

如果你正在使用实验性或不稳定的 Deno API，可以包含一个运行 Deno canary
版本的矩阵作业。这有助于尽早发现破坏性更改：

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.canary }} # 如果 canary 运行不成功，继续执行
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        deno-version: [v1.x]
        canary: [false]
        include:
          - deno-version: canary
            os: ubuntu-latest
            canary: true
```

## 加速 Deno 管道

### 减少重复

在跨平台运行中，管道的某些步骤不一定需要为每个操作系统运行。例如，在
Linux、MacOS 和 Windows
上生成相同的测试覆盖率报告有点冗余。在这些情况下，你可以使用 GitHub Actions 的
`if` 条件关键字。下面的示例展示了如何在 `ubuntu`（Linux）runner
上仅运行代码覆盖率生成和上传步骤：

```yaml
- name: Generate coverage report
  if: matrix.os == 'ubuntu-latest'
  run: deno coverage --lcov cov > cov.lcov

- name: Upload coverage to Coveralls.io
  if: matrix.os == 'ubuntu-latest'
  # 可以使用任何代码覆盖率服务，这里以 Coveralls.io 为例。
  uses: coverallsapp/github-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }} # 由 GitHub 生成。
    path-to-lcov: cov.lcov
```

### 缓存依赖项

随着项目规模的增大，往往会包含越来越多的依赖项。Deno
会在测试期间下载这些依赖项，如果工作流每天运行多次，这可能会成为一个耗时的过程。常见的解决方案是缓存依赖项，这样就不需要重新下载它们。

Deno 将依赖项本地存储在缓存目录中。在管道中，可以通过设置 `DENO_DIR`
环境变量并向工作流添加缓存步骤来在多个工作流之间保留缓存：

```yaml
# 将 DENO_DIR 设置为 runner 上的绝对或相对路径。
env:
  DENO_DIR: my_cache_directory

steps:
  - name: Cache Deno dependencies
    uses: actions/cache@v4
    with:
      path: ${{ env.DENO_DIR }}
      key: my_cache_key
```

最初，当此工作流运行时，缓存仍然是空的，像 `deno test`
这样的命令仍然需要下载依赖项，但当作业成功时，`DENO_DIR`
的内容会被保存，任何后续运行都可以从缓存中恢复它们，而不是重新下载。

上面的工作流仍然存在一个问题：目前缓存键的名称硬编码为
`my_cache_key`，这将每次恢复相同的缓存，即使更新了一个或多个依赖项。这可能会导致在管道中使用旧版本，尽管你已经更新了一些依赖项。解决方案是每次需要更新缓存时生成一个不同的键，这可以通过使用
lockfile 和 GitHub Actions 提供的 `hashFiles` 函数来实现：

```yaml
key: ${{ hashFiles('deno.lock') }}
```

为了使此方法生效，你还需要在 Deno 项目中有一个
lockfile，这将在[这里](/runtime/fundamentals/modules/#integrity-checking-and-lock-files)详细讨论。现在，如果
`deno.lock` 的内容发生变化，将生成一个新的缓存，并在后续的管道运行中使用。

为了演示，假设你有一个使用 [`@std/log`](https://jsr.io/@std/log)
中的记录器的项目：

```ts
import * as log from "jsr:@std/log@0.224.5";
```

为了增加此版本，你可以更新 `import` 语句，然后在本地重新加载缓存并更新
lockfile：

```console
deno install --reload --lock=deno.lock --frozen=false --entrypoint deps.ts
```

运行此命令后，你应该会看到 lockfile
内容的变化。当提交并通过管道运行时，你应该会看到 `hashFiles`
函数保存一个新的缓存，并在任何后续运行中使用它。

#### 清除缓存

偶尔你可能会遇到缓存损坏或格式错误的情况，这可能是由于各种原因造成的。你可以从
GitHub Actions UI
清除缓存，或者简单地更改缓存键的名称。一种实用的方法是在缓存键名称中添加一个变量，该变量可以存储为
GitHub 密钥，并在需要新缓存时更改：

```yaml
key: ${{ secrets.CACHE_VERSION }}-${{ hashFiles('deno.lock') }}
```
