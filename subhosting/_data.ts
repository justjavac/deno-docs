import { Sidebar } from "../types.ts";
export const sidebar = [
  {
    title: "入门指南",
    items: [
      {
        title: "关于 Subhosting",
        href: "/subhosting/manual/",
      },
      {
        title: "快速开始",
        href: "/subhosting/manual/quick_start/",
      },
      {
        title: "规划你的实现",
        href: "/subhosting/manual/planning_your_implementation/",
      },
      {
        title: "定价与限制",
        href: "/subhosting/manual/pricing_and_limits/",
      },
    ],
  },
  {
    title: "REST API",
    items: [
      {
        title: "资源",
        href: "/subhosting/api/",
      },
      {
        title: "认证",
        href: "/subhosting/api/authentication/",
      },
      {
        title: "事件",
        href: "/subhosting/manual/events/",
      },
      {
        title: "API 参考文档",
        href: "https://apidocs.deno.com",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "托管";
export const sectionHref = "/subhosting/manual/";
