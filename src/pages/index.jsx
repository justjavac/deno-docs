import React from "react";
import Layout from "@theme/Layout";

function Card({ title, href, children }) {
  return (
    <div className="border-1 border-solid rounded-xl p-4 w-full md:w-auto flex flex-col">
      <h3 className="border-b border-t-0 border-l-0 border-r-0 border-solid pb-2">
        {title}
      </h3>
      <p className="grow">{children}</p>
      <a
        className="font-bold inline-block hover:opacity-80"
        href={href}
      >
        {title} 文档 &gt;
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <Layout
      title={"Deno：最简单、最安全的 JavaScript 运行时"}
      description="Deno 运行时和 Deno Deploy 的参考文档"
    >
      <div className="flex flex-col px-8 pt-6 md:mt-12 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-[1200px] mx-auto">
        <div className="pb-16 align-middle md:pb-0">
          <div className="mb-8 text-center">
            <img
              className="w-64 h-64 mb-[-40px] md:mt-[-40px]"
              alt="Deno logo"
              src="/deno-looking-up.svg"
            />
            <h1 className="text-4xl md:text-5xl">Deno 文档</h1>
          </div>
          <div className="flex flex-col items-start gap-8 md:grid md:grid-cols-3 md:grid-flow-col md:items-stretch">
            <Card title="Deno Runtime" href="/runtime/manual">
              用于 TypeScript 和 JavaScript
              的语言运行时，具有类似浏览器的编程环境。具备内置开发工具、强大的平台
              API 以及对 TypeScript 和 JSX 的原生支持。
            </Card>
            <Card title="Deno Deploy" href="/deploy/manual">
              Serverless JavaScript 平台。支持 Deno 平台 API 和 Node.js/npm
              模块。运行在快速的全球边缘网络上。
            </Card>
            <Card title="Deno KV" href="/kv/manual">
              Deno 运行时内置键值数据库。具有简单的 API，在 Deno Deploy
              上无需任何配置即可使用。
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
