---
title: "Deno KV 教程与示例"
oldUrl:
  - /kv/tutorials/
---

查看这些展示 Deno KV 实际应用的示例。

## 使用队列处理传入的 Webhook

按照 [本教程](./webhook_processor.md)
学习如何使用队列将任务卸载到后台进程，以便您的 Web
应用保持响应。此示例展示了如何将处理来自 [GitHub](https://www.github.com) 的传入
Webhook 请求的任务加入队列。

## 使用队列安排未来通知

按照 [本教程](./schedule_notification.md)
学习如何使用队列安排代码在未来某个时间执行。此示例展示了如何使用
[Courier](https://www.courier.com/) 安排通知。

## Deno KV 中的 CRUD - TODO 列表

- Zod 模式验证
- 使用 Fresh 构建
- 使用 BroadcastChannel 进行实时协作
- [源代码](https://github.com/denoland/showcase_todo)
- [在线预览](https://showcase-todo.deno.dev/)

## Deno SaaSKit

- 基于 Fresh 构建的现代 SaaS 模板。
- 类似 [Product Hunt](https://www.producthunt.com/) 的模板，完全基于 KV 构建。
- 使用 Deno KV OAuth 进行 GitHub OAuth 2.0 认证
- 用于更快地启动您的下一个应用项目
- [源代码](https://github.com/denoland/saaskit)
- [在线预览](https://hunt.deno.land/)

## 多人井字棋

- GitHub 认证
- 保存的用户状态
- 使用 BroadcastChannel 进行实时同步
- [源代码](https://github.com/denoland/tic-tac-toe)
- [在线预览](https://tic-tac-toe-game.deno.dev/)

## 多人像素画绘制

- 持久化的画布状态
- 多人协作
- 使用 BroadcastChannel 进行实时同步
- [源代码](https://github.com/denoland/pixelpage)
- [在线预览](https://pixelpage.deno.dev/)

## GitHub 认证与 KV

- 将绘图存储在 KV 中
- GitHub 认证
- [源代码](https://github.com/hashrock/kv-sketchbook)
- [在线预览](https://hashrock-kv-sketchbook.deno.dev/)

## Deno KV OAuth 2

- 由 Deno KV 提供支持的高级 OAuth 2.0
- [源代码](https://github.com/denoland/deno_kv_oauth)
- [在线预览](https://kv-oauth.deno.dev/)
