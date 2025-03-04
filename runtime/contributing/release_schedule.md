---
title: "发布计划"
oldUrl: /runtime/manual/references/contributing/release_schedule/
---

`deno` CLI 的新次要版本计划每 12 周发布一次。

有关即将发布的版本，请参阅
[Deno 的 GitHub 里程碑](https://github.com/denoland/deno/milestones)。

通常在次要版本发布后会有几个补丁版本（每周发布）；之后，新功能的合并窗口将打开，为即将到来的次要版本做准备。

稳定版本可以在 [GitHub 发布页面](https://github.com/denoland/deno/releases)
找到。

## Canary 频道

除了上述的稳定频道外，Canary
版本每天会发布多次（针对主分支的每次提交）。您可以通过运行以下命令升级到最新的
Canary 版本：

```console
deno upgrade --canary
```

要更新到特定的 Canary 版本，请在 `--version` 选项中传递提交哈希：

```console
deno upgrade --canary --version=973af61d8bb03c1709f61e456581d58386ed4952
```

要切换回稳定频道，请运行 `deno upgrade`。

Canary 版本可以从 https://dl.deno.land 下载。
