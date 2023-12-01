// Include main doc categories on most pages
const mainMenu = [
  // https://docusaurus.io/docs/sidebar/items
  {
    type: "html",
    value: "<div>Deno KV</div>",
    className: "product-header",
  },
  {
    type: "link",
    href: "/kv/manual",
    label: "手册",
    className: "icon-menu-option icon-menu-user-guide",
  },
  {
    type: "link",
    label: "教程和示例",
    href: "/kv/tutorials",
    className: "icon-menu-option icon-menu-tutorials",
  },
  {
    type: "link",
    label: "API 参考",
    href: "https://deno.land/api?unstable=true&s=Deno.Kv",
    className: "icon-menu-option icon-menu-api __no-external",
  },
];

const sidebars = {
  kv: mainMenu,

  kvGuideHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>手册</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "快速入门",
      id: "manual/index",
    },
    "manual/key_space",
    "manual/operations",
    "manual/key_expiration",
    "manual/secondary_indexes",
    "manual/transactions",
    "manual/queue_overview",
    "manual/cron",
    "manual/data_modeling_typescript",
    "manual/on_deploy",
    "manual/backup",
  ]),

  kvTutorialsHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>教程和示例</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "概述",
      id: "tutorials/index",
    },
    {
      type: "doc",
      id: "tutorials/schedule_notification",
      label: "在未来的某个日期安排通知",
    },
    {
      type: "doc",
      id: "tutorials/webhook_processor",
      label: "将 Webhook 处理转移到队列",
    },
    {
      type: "link",
      label: "TODO List",
      href: "https://github.com/denoland/showcase_todo",
    },
    {
      type: "link",
      label: "多人的 Tic-Tac-Toe",
      href: "https://github.com/denoland/tic-tac-toe",
    },
    {
      type: "link",
      label: "实时像素画布",
      href: "https://github.com/denoland/pixelpage",
    },
    {
      type: "link",
      label: "基于 KV 的 oAuth2",
      href: "https://github.com/denoland/deno_kv_oauth",
    },
    {
      type: "link",
      label: "SaaSKit",
      href: "https://github.com/denoland/saaskit",
    },
    {
      type: "link",
      label: "更多 Deno 示例",
      href: "https://examples.deno.land",
    },
    {
      type: "html",
      value: '<div style="height: 30px;"></div>',
    },
  ]),
};

module.exports = sidebars;
