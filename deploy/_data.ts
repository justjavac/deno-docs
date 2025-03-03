import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "入门指南",
    items: [
      {
        title: "快速开始",
        href: "/deploy/manual/",
      },
      {
        title: "部署基础",
        items: [
          { title: "使用案例", href: "/deploy/manual/use-cases/" },
          { title: "演练场", href: "/deploy/manual/playgrounds/" },
          { title: "如何部署", href: "/deploy/manual/how-to-deploy/" },
          { title: "GitHub CI", href: "/deploy/manual/ci_github/" },
          { title: "deployctl", href: "/deploy/manual/deployctl/" },
          { title: "区域", href: "/deploy/manual/regions/" },
          {
            title: "定价与限制",
            href: "/deploy/manual/pricing-and-limits/",
          },
        ],
      },
    ],
  },
  {
    title: "部署平台",
    items: [
      {
        title: "部署",
        href: "/deploy/manual/deployments/",
      },
      {
        title: "自定义域名",
        href: "/deploy/manual/custom-domains/",
      },
      {
        title: "环境变量",
        href: "/deploy/manual/environment-variables/",
      },
      {
        title: "组织",
        href: "/deploy/manual/organizations/",
      },
      {
        title: "日志",
        href: "/deploy/manual/logs/",
      },
      {
        title: "KV",
        items: [
          { title: "概览", href: "/deploy/kv/manual/" },
          { title: "键空间", href: "/deploy/kv/manual/key_space/" },
          { title: "操作", href: "/deploy/kv/manual/operations/" },
          {
            title: "键过期",
            href: "/deploy/kv/manual/key_expiration/",
          },
          {
            title: "二级索引",
            href: "/deploy/kv/manual/secondary_indexes/",
          },
          { title: "事务", href: "/deploy/kv/manual/transactions/" },
          { title: "节点", href: "/deploy/kv/manual/node/" },
          {
            title: "数据建模",
            href: "/deploy/kv/manual/data_modeling_typescript/",
          },
          { title: "备份", href: "/deploy/kv/manual/backup/" },
        ],
      },
      {
        title: "队列",
        href: "/deploy/kv/manual/queue_overview/",
      },
      {
        title: "Cron",
        href: "/deploy/kv/manual/cron/",
      },
      {
        title: "边缘缓存",
        href: "/deploy/manual/edge-cache/",
      },
    ],
  },
  {
    title: "连接数据库",
    items: [
      {
        title: "Deno KV",
        href: "/deploy/kv/manual/on_deploy/",
      },
      {
        title: "第三方数据库",
        items: [
          { title: "DynamoDB", href: "/deploy/manual/dynamodb/" },
          { title: "FaunaDB", href: "/deploy/manual/faunadb/" },
          { title: "Firebase", href: "/deploy/manual/firebase/" },
          { title: "Postgres", href: "/deploy/manual/postgres/" },
          { title: "Neon Postgres", href: "/deploy/manual/neon-postgres/" },
        ],
      },
    ],
  },
  {
    title: "政策与限制",
    items: [
      {
        title: "可接受使用政策",
        href: "/deploy/manual/acceptable-use-policy/",
      },
      {
        title: "履行政策",
        href: "/deploy/manual/fulfillment-policy/",
      },
      { title: "隐私政策", href: "/deploy/manual/privacy-policy/" },
      { title: "安全", href: "/deploy/manual/security/" },
      {
        title: "条款与条件",
        href: "/deploy/manual/terms-and-conditions/",
      },
    ],
  },
  {
    title: "教程与示例",
    items: [
      {
        title: "部署教程",
        items: [
          { title: "概览", href: "/deploy/tutorials/" },
          {
            title: "Discord 斜杠命令",
            href: "/deploy/tutorials/discord-slash/",
          },
          { title: "Fresh 框架", href: "/deploy/tutorials/fresh/" },
          { title: "简单 API", href: "/deploy/tutorials/simple-api/" },
          { title: "静态站点", href: "/deploy/tutorials/static-site/" },
          {
            title: "使用 Fresh 构建博客",
            href: "/deploy/tutorials/tutorial-blog-fresh/",
          },
          {
            title: "DynamoDB 集成",
            href: "/deploy/tutorials/tutorial-dynamodb/",
          },
          {
            title: "FaunaDB 集成",
            href: "/deploy/tutorials/tutorial-faunadb/",
          },
          {
            title: "Firebase 集成",
            href: "/deploy/tutorials/tutorial-firebase/",
          },
          {
            title: "HTTP 服务器",
            href: "/deploy/tutorials/tutorial-http-server/",
          },
          { title: "Hugo 博客", href: "/deploy/tutorials/tutorial-hugo-blog/" },
          {
            title: "Postgres 集成",
            href: "/deploy/tutorials/tutorial-postgres/",
          },
          {
            title: "WordPress 前端",
            href: "/deploy/tutorials/tutorial-wordpress-frontend/",
          },
          { title: "Vite", href: "/deploy/tutorials/vite/" },
          {
            title: "定时通知",
            href: "/deploy/kv/tutorials/schedule_notification/",
          },
          {
            title: "Webhook 处理器",
            href: "/deploy/kv/tutorials/webhook_processor/",
          },
        ],
      },
      {
        title: "KV 教程",
        href: "/deploy/kv/tutorials/",
      },
      {
        title: "更多 Deno 示例",
        href: "/examples/",
      },
    ],
  },
  {
    title: "参考",
    items: [
      { title: "运行时 API", href: "/deploy/api" },
      { title: "运行时文件系统", href: "/deploy/api/runtime-fs/" },
      { title: "运行时 Node", href: "/deploy/api/runtime-node/" },
      { title: "压缩", href: "/deploy/api/compression/" },
      { title: "运行时套接字", href: "/deploy/api/runtime-sockets/" },
      {
        title: "运行时广播通道",
        href: "/deploy/api/runtime-broadcast-channel/",
      },
      { title: "运行时 Fetch", href: "/deploy/api/runtime-fetch/" },
      { title: "运行时请求", href: "/deploy/api/runtime-request/" },
      { title: "运行时响应", href: "/deploy/api/runtime-response/" },
      { title: "运行时头信息", href: "/deploy/api/runtime-headers/" },
      { title: "动态导入", href: "/deploy/api/dynamic-import/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "部署";
export const sectionHref = "/deploy/manual/";
