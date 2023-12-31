const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const findReplace = require("./src/remark/find_replace");
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Deno 文档",
  tagline: "Deno 是 JavaScript 和 TypeScript 的下一代运行时。",
  favicon: "img/favicon.ico",
  url: "https://docs.denohub.com",
  baseUrl: "/deno/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          id: "runtime",
          path: "runtime",
          editUrl: "https://github.com/justjavac/deno-docs/tree/main",
          routeBasePath: "runtime",
          sidebarPath: require.resolve("./sidebars/runtime.js"),
          remarkPlugins: [findReplace],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  plugins: [
    /*
    // Eventually, we want to move standard library docs here as well rather
    // than another external link
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "stdlib",
        path: "stdlib",
        routeBasePath: "stdlib",
        sidebarPath: require.resolve("./sidebars/runtime.js"),
      },
    ],
    */
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "deploy",
        path: "deploy",
        editUrl: "https://github.com/justjavac/deno-docs/tree/main",
        routeBasePath: "/deploy",
        sidebarPath: require.resolve("./sidebars/deploy.js"),
        remarkPlugins: [findReplace],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "kv",
        path: "kv",
        editUrl: "https://github.com/justjavac/deno-docs/tree/main",
        routeBasePath: "/kv",
        sidebarPath: require.resolve("./sidebars/kv.js"),
        remarkPlugins: [findReplace],
      },
    ],
    [
      "docusaurus-plugin-baidu-tongji",
      {
        token: "16248dc9a2bd8b508c0a43526dd547e9",
      },
    ],
    // Enables our custom pages in "src" to use Tailwind classes
    async function tailwindPlugin(_context, _options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    // Set up a node.js polyfill for webpack builds
    function nodePolyfill(_context, _options) {
      return {
        name: "node-polyfill",
        configureWebpack(_config, _isServer) {
          return {
            plugins: [new NodePolyfillPlugin()],
          };
        },
      };
    },
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
        indexBlog: false,
        language: ["en", "zh"],
        docsRouteBasePath: ["/runtime", "/deploy", "/kv"],
        docsDir: ["runtime", "deploy", "kv"],
        searchContextByPaths: ["/runtime", "/deploy", "/kv"],
        docsPluginIdForPreferredVersion: "runtime",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    // Social card
    image: "img/social.png",
    colorMode: {
      defaultMode: "light",
    },
    navbar: {
      title: "Deno 文档",
      logo: {
        alt: "Deno",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
        href: "/",
      },
      items: [
        {
          to: "/runtime/manual",
          position: "left",
          label: "运行时",
          activeBaseRegex: `^/runtime`,
        },
        {
          to: "/deploy/manual",
          position: "left",
          label: "Deploy",
          activeBaseRegex: `^/deploy`,
        },
        {
          to: "/kv/manual",
          position: "left",
          label: "KV",
          activeBaseRegex: `^/kv`,
        },
        {
          href: "https://www.deno.land/std",
          label: "Std. Library",
        },
        /*
          {
            to: '/stdlib',
            position: 'left',
            label: 'Standard Library',
            activeBaseRegex: `^/stdlib`,
          },
          */
        {
          href: "https://deno.js.cn",
          label: "中文社区",
          position: "right",
        },
      ],
    },
    sidebar: {
      hideable: true,
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: true,
      },
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Deno 文档",
          items: [
            {
              label: "Deno 运行时",
              to: "/runtime/manual",
            },
            /*
              {
                label: 'Standard Library',
                to: '/stdlib',
              },
              */
            {
              label: "Deno Deploy",
              to: "/deploy/manual",
            },
            {
              label: "Deno KV",
              to: "/kv/manual",
            },
            {
              label: "标准库",
              href: "https://deno.land/std",
            },
            {
              label: "示例",
              href: "https://examples.deno.land",
            },
          ],
        },
        {
          title: "社区",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/deno",
            },
            {
              label: "GitHub",
              href: "https://github.com/denoland",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/deno_land",
            },
            {
              label: "YouTube",
              href: "https://youtube.com/@deno_land",
            },
            {
              label: "Newsletter",
              href: "https://deno.news/",
            },
          ],
        },
        {
          title: "帮助和反馈",
          items: [
            {
              label: "社区支持",
              href: "https://discord.gg/deno",
            },
            {
              label: "Deploy System Status",
              href: "https://www.denostatus.com",
            },
            {
              label: "Deploy 反馈",
              href: "https://github.com/denoland/deploy_feedback",
            },
            {
              label: "报告错误",
              href: "mailto:support@deno.com",
            },
          ],
        },
        {
          title: "公司",
          items: [
            {
              label: "博客",
              href: "https://www.deno.com/blog",
            },
            {
              label: "职业",
              href: "https://deno.com/jobs",
            },
            {
              label: "商品",
              href: "https://merch.deno.com/",
            },
            {
              label: "隐私条款",
              href: "/deploy/manual/privacy-policy",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} the Deno authors.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
