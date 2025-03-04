export const layout = "raw.tsx";
export const url = "/";

export default function () {
  return (
    <main
      id="content"
      class="flex flex-col px-8 pt-6 md:pt-12 mt-4 md:items-center md:justify-center max-w-[1200px] mx-auto mb-48"
    >
      <div class="flex flex-col gap-4 md:gap-8 pb-16 align-middle md:pb-0">
        {/* Hero section */}
        <div class="grid grid-cols-1 md:grid-cols-3 mb-6 gap-4">
          <div class="md:col-span-2">
            <h1 class="text-4xl md:text-5xl mb-2 md:mb-6 font-bold">
              Deno 文档
            </h1>
            <p class="text-md max-w-[600px] md:text-lg">
              Deno，一个用于 TypeScript 和J avaScript 的开源运行时。
              内置开发工具、强大的平台 API，并原生支持 TypeScript 和 JSX。
            </p>
            {/* CTA Group */}

            <div class="flex flex-row flex-wrap gap-4 mt-8">
              <DocsCTA
                text="开始使用"
                href="/runtime/"
                product="runtime"
              />
              <DocsCTA
                text="尝试 Deno Deploy"
                href="/deploy/manual"
                product="deploy"
              />
            </div>
          </div>
          <div class="hidden md:block md:col-span-1">
            <img
              class="w-full h-full"
              src="/deno-looking-up.svg"
              alt="Deno logo"
            />
          </div>
        </div>

        {/* Main content  */}
        <div class="flex flex-col gap-8 md:gap-16">
          {/* Temporary banner  */}
          <div class="flex flex-col gap-4 p-4 bg-runtime-background dark:bg-background-secondary border-l-4 text-runtime-foreground border-runtime-500">
            <p class="text-lg">
              <strong>Deno 2</strong> 现已发布！了解更多{"  "}
              <a
                href="/runtime/reference/migration_guide"
                class="runtime-link underline underline-offset-4"
              >
                发生了什么变化
              </a>{" "}
              在此次发布中。
            </p>
          </div>
          {/* Runtime content */}
          <div class="flex flex-col gap-8">
            {/* Section Header */}
            <div>
              <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-6">
                Deno 运行时
              </h2>
              <p class="max-w-[75ch]">
                Deno（发音为 /ˈdiːnoʊ/，读作 dee-no）是一个开源的
                JavaScript、TypeScript 和 WebAssembly
                运行时，具有安全默认值和卓越的开发者体验。它基于 V8、 Rust 和
                Tokio 构建。
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
              <ContentItem
                title="Deno 基础"
                description="刚接触 Deno？从这里开始。"
                linktext="开始使用"
                link="/runtime/"
                product="runtime"
              />

              <ContentItem
                title="配置"
                description="自定义 Deno 内置的 TypeScript 编译器、格式化器和 linter。"
                linktext="Deno 配置"
                link="/runtime/fundamentals/configuration"
                product="runtime"
              />

              <ContentItem
                title="Deno 中的测试"
                description="关于 Deno 内置的 JavaScript 或 TypeScript 代码测试运行器的全部内容。"
                linktext="了解更多关于测试"
                link="/runtime/fundamentals/testing"
                product="runtime"
              />
            </div>
            {/* Examples Section */}
            <div class="flex flex-col">
              <div class="mb-8">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-4">
                  示例
                </h3>
                <p class="max-w-[75ch]">
                  一系列带注释的 Deno 示例，可用作使用 Deno
                  构建的参考，或作为学习 Deno 许多功能的指南。在{" "}
                  <a
                    href="/examples/"
                    class="runtime-link underline underline-offset-4"
                  >
                    示例
                  </a>{" "}
                  部分中查看更多示例。
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                <LinkList
                  title="基础"
                  product="runtime"
                  links={[
                    {
                      text: "从 npm 导入模块",
                      href: "/examples/npm",
                    },
                    {
                      text: "Hello World",
                      href: "/examples/hello_world",
                    },
                    {
                      text: "使用 Node.js 内置模块",
                      href: "/examples/node_built_in",
                    },
                    {
                      text: "操作和解析 URL",
                      href: "/examples/url_parsing",
                    },
                  ]}
                />
                <LinkList
                  title="网络"
                  product="runtime"
                  links={[
                    {
                      text: "HTTP 服务器：Hello World",
                      href: "/examples/http_server",
                    },
                    {
                      text: "HTTP 服务器：WebSockets",
                      href: "/examples/http_server_websocket",
                    },
                    {
                      text: "HTTP 服务器：流式传输",
                      href: "/examples/http_server_streaming",
                    },
                    {
                      text: "TCP 连接器：Ping",
                      href: "/examples/tcp_connector",
                    },
                  ]}
                />
                <LinkList
                  title="系统和 CLI"
                  product="runtime"
                  links={[
                    {
                      text: "命令行参数",
                      href: "/examples/command_line_arguments",
                    },
                    {
                      text: "环境变量",
                      href: "/examples/environment_variables",
                    },
                    {
                      text: "读取文件",
                      href: "/examples/reading_files",
                    },
                    {
                      text: "遍历目录",
                      href: "/examples/walking_directories",
                    },
                  ]}
                />
                <LinkList
                  title="Deno 云原语"
                  product="runtime"
                  links={[
                    {
                      text: "KV",
                      href: "/examples/kv",
                    },
                    {
                      text: "队列",
                      href: "/examples/queues",
                    },
                    {
                      text: "Cron",
                      href: "/examples/cron",
                    },
                    {
                      text: "KV Watch",
                      href: "/examples/kv_watch",
                    },
                  ]}
                />
              </div>
            </div>

            {/* Reference Section */}
            <div class="flex flex-col">
              <div class="mb-8">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-runtime-500 mb-4">
                  API 参考
                </h3>
                <p class="max-w-[75ch]">
                  Deno、Web 和 Node API 参考文档，专为 Deno 体验打造。探索 Deno
                  中可用的 API，请访问{" "}
                  <a
                    href="/api/deno"
                    class="runtime-link underline underline-offset-4"
                  >
                    API 参考
                  </a>{" "}
                  部分。
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                <LinkList
                  title="Deno API"
                  product="runtime"
                  links={[
                    {
                      text: "云",
                      href: "/api/deno/cloud",
                    },
                    {
                      text: "FFI",
                      href: "/api/deno/ffi",
                    },
                    {
                      text: "网络",
                      href: "/api/deno/network",
                    },
                    {
                      text: "权限",
                      href: "/api/deno/permissions",
                    },
                    {
                      text: "WebSockets",
                      href: "/api/deno/web-sockets",
                    },
                    {
                      text: "查看所有 Deno API",
                      href: "/api/deno",
                    },
                  ]}
                />
                <LinkList
                  title="Web API"
                  product="runtime"
                  links={[
                    {
                      text: "缓存",
                      href: "/api/web/cache",
                    },
                    {
                      text: "Canvas",
                      href: "/api/web/canvas",
                    },
                    {
                      text: "Fetch",
                      href: "/api/web/fetch",
                    },
                    {
                      text: "流",
                      href: "/api/web/streams",
                    },
                    {
                      text: "URL",
                      href: "/api/web/url",
                    },
                    {
                      text: "查看所有 Web API",
                      href: "/api/web",
                    },
                  ]}
                />
                <LinkList
                  title="Node API"
                  product="runtime"
                  links={[
                    {
                      text: "assert",
                      href: "/api/node/assert",
                    },
                    {
                      text: "buffer",
                      href: "/api/node/buffer",
                    },
                    {
                      text: "fs",
                      href: "/api/node/fs",
                    },
                    {
                      text: "path",
                      href: "/api/node/path",
                    },
                    {
                      text: "process",
                      href: "/api/node/process",
                    },
                    {
                      text: "查看所有 Node API",
                      href: "/api/node",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4 p-4 bg-deploy-50 dark:bg-background-secondary border-l-4 text-deploy-foreground border-deploy-500">
            <p class="text-lg">
              使用我们在 AWS、GCP 或 Azure
              上运行的自托管解决方案，在您自己的基础设施上运行 Deno Deploy。
              {"  "}
              <a
                href="https://unf275cfh14.typeform.com/to/dIicJYSQ"
                class="deploy-link underline underline-offset-4 external"
              >
                了解更多{" "}
                <span aria-hidden="true" class="whitespace-pre">
                  -&gt;
                </span>
              </a>
            </p>
          </div>
          {/* Deploy 内容 */}
          <div class="flex flex-col gap-8">
            {/* 部分标题 */}
            <div>
              <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-deploy-500 mb-8">
                Deno Deploy
              </h2>
              <p class="max-w-[75ch]">
                用于将 JavaScript 代码部署到快速全球边缘网络的无服务器平台。支持
                Deno API 和 Node.js / npm 模块。
              </p>
            </div>
            {/* Deploy features */}
            <div class="grid grid-cols-1 mb-4 md:grid-cols-3 gap-8 md:gap-24">
              <ContentItem
                title="KV"
                description="内置于 Deno 运行时的键值数据库。简单 API，无需配置即可在 Deno Deploy 上运行。"
                linktext="KV 文档"
                link="/deploy/kv/manual/"
                product="deploy"
              />

              <ContentItem
                title="Cron"
                description="可在任何时区的边缘按可配置的计划执行代码。"
                linktext="Cron 文档"
                link="/deploy/kv/manual/cron"
                product="deploy"
              />

              <ContentItem
                title="队列"
                description="Deno 的队列 API，用于卸载较大的工作负载或安排具有保证交付的任务。"
                linktext="队列文档"
                link="/deploy/kv/manual/queue_overview/"
                product="deploy"
              />
            </div>

            {/* Subhosting content */}
            <div class="flex flex-col">
              <div class="mb-8">
                <h3 class="text-xl md:text-2xl font-semibold underline underline-offset-8 decoration-deploy-500 mb-4">
                  子托管
                </h3>
                <p class="max-w-[66ch]">
                  Deno
                  子托管是一个强大的平台，旨在允许软件即服务（SaaS）提供商安全地运行其客户编写的代码。
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
                <ContentItem
                  title="快速开始"
                  description="配置您的子托管账户，几分钟内即可托管客户代码。"
                  linktext="快速开始"
                  link="/subhosting/manual/quick_start/"
                  product="deploy"
                />

                <ContentItem
                  title="子托管架构"
                  description="管理系统中的关键资源——处理数据、管理部署及其分析。同时确保稳定性和效率。"
                  linktext="了解子托管"
                  link="/subhosting/api/"
                  product="deploy"
                />

                <ContentItem
                  title="REST API"
                  description="通过我们的 REST API 快速配置新项目并进行部署。"
                  linktext="REST API"
                  link="/subhosting/manual/#rest-api-参考和-openapi-规范"
                  product="deploy"
                />
              </div>
            </div>
          </div>

          {/* Help content */}

          <div class="flex flex-col gap-8">
            <div>
              <h2 class="text-3xl md:text-4xl font-semibold underline underline-offset-8 decoration-purple-600 dark:decoration-purple-300 mb-8">
                帮助
              </h2>
              <p class="max-w-[75ch]">
                从 Deno 团队获得帮助或与我们的社区联系。
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24">
              <ContentItem
                title="与我们的社区联系"
                description="从 Deno 社区获得帮助"
                linktext="了解更多"
                link="/runtime/help"
                product="help"
              />
              <ContentItem
                title="企业支持"
                description="探索 Deno 的企业支持选项"
                linktext="了解更多"
                link="https://deno.com/enterprise"
                product="help"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DocsCTA(props: {
  text: string;
  href: string;
  product: "deploy" | "runtime";
}) {
  const productClass = props.product === "deploy"
    ? "deploy-cta"
    : "runtime-cta";
  return (
    <a href={props.href} className={`docs-cta ${productClass}`}>
      {props.text}{" "}
      <span aria-hidden="true" class="whitespace-pre">
        -&gt;
      </span>
    </a>
  );
}

function ContentItem(props: {
  title: string;
  description: string;
  linktext: string;
  link: string;
  product: string;
}) {
  const productClass = props.product === "deploy"
    ? "deploy-link"
    : props.product === "runtime"
    ? "runtime-link"
    : "help-link"; // Default to "help-link" if product is "help"

  return (
    <div>
      <h4 className="text-lg font-semibold mb-1">{props.title}</h4>
      <p className="mb-3">{props.description}</p>
      <a className={`homepage-link ${productClass}`} href={props.link}>
        {props.linktext}{" "}
        <span aria-hidden="true" class="whitespace-pre">
          -&gt;
        </span>
      </a>
    </div>
  );
}

function LinkList(props: {
  title: string;
  product: string;
  links: { text: string; href: string }[];
}) {
  const productClass = props.product === "deploy"
    ? "deploy-link"
    : props.product === "runtime"
    ? "runtime-link"
    : "help-link";
  return (
    <div>
      <h4 className="text-lg font-semibold mb-1">{props.title}</h4>
      {props.links.map((link, index) => (
        <a
          key={index}
          className={`homepage-link mb-1 ${productClass}`}
          href={link.href}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}
