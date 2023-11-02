# 发布计划

每个月的第三个星期四，都会发布一个新的 `deno` 命令行工具的小版本。

查看 [Deno 的 GitHub 里程碑](https://github.com/denoland/deno/milestones)
获取即将发布的版本信息。

通常，在小版本发布后，会有两到三个每周发布的补丁版本；之后会开启新功能的合并窗口，为即将发布的小版本做准备。

稳定版本可以在 [GitHub 发布页面](https://github.com/denoland/deno/releases)
找到。

## Canary 渠道

除了上面描述的稳定渠道之外，每天都会发布多个 canary
版本（针对主分支的每次提交）。你可以通过运行以下命令升级到最新的 canary 版本：

```
deno upgrade --canary
```

要升级到特定的 canary 版本，请在 `--version` 选项中传递提交哈希值：

```
deno upgrade --canary --version=973af61d8bb03c1709f61e456581d58386ed4952
```

要切换回稳定渠道，请运行 `deno upgrade`。

Canary 版本可以从 https://dl.deno.land 下载。
