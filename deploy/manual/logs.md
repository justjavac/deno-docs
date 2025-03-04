---
title: "应用日志记录"
---

应用程序可以在运行时使用控制台 API 生成日志，例如使用
`console.log`、`console.error` 等方法。这些日志可以通过以下方式实时查看：

- 导航到项目或部署的 `Logs` 面板。
- 使用 [deployctl](https://docs.denohub.com/deploy/manual/deployctl) 中的 `logs`
  子命令。

日志将直接从应用程序流式传输到日志面板，或在 `deployctl logs` 中显示。

除了实时日志外，日志还会保留一定的时间，具体取决于您所订阅的计划。要查看持久化的日志，您可以：

- 如果您在浏览器中使用日志面板，请在搜索框旁边的下拉菜单中从 `Live` 切换到
  `Recent` 或 `Custom`。
- 如果您更喜欢命令行，请在 `deployctl logs` 命令中添加 `--since=<DATETIME>`
  和/或 `--until=<DATETIME>`。更多详细信息，请参考 `deployctl logs --help`。

超过保留期限的日志会自动从系统中删除。

## 限制

日志消息的大小和在一定时间内生成的日志量都有所限制。

日志消息的最大大小为 2KB。超过此限制的消息将被截断为 2KB。

每个部署每秒最多允许生成 1000 条日志条目。如果超过此限制，我们可能会终止该部署。
