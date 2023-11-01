const findReplace = require("./src/remark/find_replace");
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const config = {
  title: "Deno 文档",
  tagline: "Deno 是 JavaScript 和 TypeScript 的下一代运行时。",
  favicon: "img/favicon.ico",
  url: "https://docs.denohub.com",
  baseUrl: "/",
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
    // Enables our custom pages in "src" to use Tailwind classes
    // deno-lint-ignore no-unused-vars
    function tailwindPlugin(context, options) {
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
    algolia: {
      // The application ID provided by Algolia
      appId: "KAQ4QIALEB",

      // Public API key: it is safe to commit it
      apiKey: "0795dfc12048ff344a54bb4c04c9000b",

      indexName: "deno",

      insights: true,

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through
      // window.location instead on history.push. Useful when our Algolia
      // config crawls multiple documentation sites and we want to navigate
      // with window.location.href to them.
      // externalUrlRegex: "external\\.com|domain\\.com",

      // Optional: Replace parts of the item URLs from Algolia. Useful when
      // using the same search index for multiple deployments using a
      // different baseUrl. You can use regexp or string in the `from` param.
      // For example: localhost:3000 vs myCompany.com/docs
      /*
        replaceSearchResultPathname: {
          from: "/docs/", // or as RegExp: /\/docs\//
          to: "/",
        },
        */

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false`
      // to disable it)
      searchPagePath: "search",
    },
  },
};

module.exports = config;
