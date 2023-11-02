// Include main doc categories on most pages
const mainMenu = [
  {
    type: "html",
    value: "<div>Deno Deploy</div>",
    className: "product-header",
  },
  // https://docusaurus.io/docs/sidebar/items
  {
    type: "link",
    href: "/deploy/manual",
    label: "手册",
    className: "icon-menu-option icon-menu-user-guide",
  },
  {
    type: "link",
    label: "教程和示例",
    href: "/deploy/tutorials",
    className: "icon-menu-option icon-menu-tutorials",
  },
  {
    type: "link",
    label: "API 参考",
    href: "/deploy/api",
    className: "icon-menu-option icon-menu-api",
  },
];

const sidebars = {
  deploy: mainMenu,

  deployGuideHome: mainMenu.concat([
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
    {
      type: "category",
      label: "Deploy 基础",
      items: [
        "manual/use-cases",
        "manual/playgrounds",
        "manual/how-to-deploy",
        "manual/ci_github",
        "manual/deployctl",
        "manual/regions",
        "manual/pricing-and-limits",
      ],
    },
    {
      type: "category",
      label: "项目与组织",
      items: [
        "manual/deployments",
        "manual/custom-domains",
        "manual/environment-variables",
        "manual/organizations",
        "manual/logs",
      ],
    },
    {
      type: "category",
      label: "连接到数据库",
      items: [
        {
          type: "link",
          href: "/kv/manual/on_deploy",
          label: "Deno KV",
        },
        "manual/dynamodb",
        "manual/faunadb",
        "manual/firebase",
        "manual/postgres",
      ],
    },
    {
      type: "category",
      label: "政策与合理使用",
      items: [
        "manual/fair-use-policy",
        "manual/privacy-policy",
        "manual/security",
      ],
    },
    {
      type: "html",
      value: '<div style="height: 30px;"></div>',
    },
  ]),

  deployTutorialsHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>教程和示例</div>",
      className: "section-header",
    },
    {
      type: "autogenerated",
      dirName: "tutorials",
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

  deployAPIHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>API 参考</div>",
      className: "section-header",
    },
    "api/index",
    "api/runtime-fs",
    "api/runtime-node",
    "api/compression",
    "api/runtime-sockets",
    "api/runtime-broadcast-channel",
    "api/runtime-fetch",
    "api/runtime-request",
    "api/runtime-response",
    "api/runtime-headers",
    {
      type: "html",
      value: '<div style="height: 30px;"></div>',
    },
  ]),
};

module.exports = sidebars;
