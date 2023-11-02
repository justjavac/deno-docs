# Deno KV 教程与示例

查看这些示例，展示了 Deno KV 的实际用法。

## 使用队列处理传入的 Webhooks

跟随
[此教程](./webhook_processor.md)，了解如何使用队列将任务卸载到后台进程，以使您的
Web 应用保持响应。此示例显示如何排队处理来自 [GitHub](https://www.github.com)
的传入 Webhook 请求。

## 使用队列安排将来的通知

跟随
[此教程](./schedule_notification.md)，了解如何使用队列在将来的某个时间执行代码。此示例显示如何使用
[Courier](https://www.courier.com/) 安排通知。

## Deno KV 中的 CRUD - 待办事项列表

- Zod 模式验证
- 使用 Fresh 构建
- 使用 BroadcastChannel 进行实时协作
- [源代码](https://github.com/denoland/showcase_todo)
- [实时预览](https://showcase-todo.deno.dev/)

## Deno SaaSKit

- 基于 Fresh 构建的现代 SaaS 模板。
- [Product Hunt](https://www.producthunt.com/) 风格的模板，完全基于 KV 构建。
- 使用 Deno KV OAuth 进行 GitHub OAuth 2.0 认证
- 用于更快地启动下一个应用项目
- [源代码](https://github.com/denoland/saaskit)
- [实时预览](https://hunt.deno.land/)

## 多人井字棋

- GitHub 认证
- 保存用户状态
- 使用 BroadcastChannel 进行实时同步
- [源代码](https://github.com/denoland/tic-tac-toe)
- [实时预览](https://tic-tac-toe-game.deno.dev/)

## 多用户像素艺术绘制

- 持久画布状态
- 多用户协作
- 使用 BroadcastChannel 进行实时同步
- [源代码](https://github.com/denoland/pixelpage)
- [实时预览](https://pixelpage.deno.dev/)

## GitHub 认证和 KV

- 在 KV 中存储绘画
- GitHub 认证
- [源代码](https://github.com/hashrock/kv-sketchbook)
- [实时预览](https://hashrock-kv-sketchbook.deno.dev/)

## Deno KV OAuth 2

- 由 Deno KV 提供动力的高级 OAuth 2.0
- [源代码](https://github.com/denoland/deno_kv_oauth)
- [实时预览](https://kv-oauth.deno.dev/)
