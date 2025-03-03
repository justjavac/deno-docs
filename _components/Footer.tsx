export default function Footer_new() {
  return (
    <footer>
      <nav aria-labelledby="footer-navigation" className="footer-nav">
        {data.map((category) => (
          <section className="footer-section">
            <h3 class="footer-section-heading">{category.title}</h3>
            <ul class="footer-list">
              {category.items.map((item) => (
                <li>
                  <a
                    class="footer-link"
                    href={item.to ?? item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
      <p class="copyright">
        Copyright © {new Date().getFullYear()} the Deno authors.
      </p>
    </footer>
  );
}

export const css = "@import './_components/Footer.css';";

interface FooterCategory {
  title: string;
  items: FooterItem[];
}

type FooterItem = {
  label: string;
  to: string;
} | {
  label: string;
  href: string;
};
const data = [
  {
    title: "Deno 文档",
    items: [
      {
        label: "Deno 运行时",
        to: "/runtime/",
      },
      {
        label: "Deno 部署",
        to: "/deploy/manual/",
      },
      {
        label: "Deno 子托管",
        to: "/subhosting/manual/",
      },
      {
        label: "示例",
        href: "/examples/",
      },
      {
        label: "标准库",
        href: "https://jsr.io/@std",
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
        label: "新闻简报",
        href: "https://deno.news/",
      },
    ],
  },
  {
    title: "帮助与反馈",
    items: [
      {
        label: "社区支持",
        href: "https://discord.gg/deno",
      },
      {
        label: "部署系统状态",
        href: "https://denostatus.com",
      },
      {
        label: "部署反馈",
        href: "https://github.com/denoland/deploy_feedback",
      },
      {
        label: "报告问题",
        href: "mailto:support@deno.com",
      },
    ],
  },
  {
    title: "公司",
    items: [
      {
        label: "博客",
        href: "https://deno.com/blog",
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
        label: "隐私政策",
        href: "/deploy/manual/privacy-policy",
      },
    ],
  },
] satisfies FooterCategory[];
