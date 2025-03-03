import { Sidebar } from "../types.ts";
import { walk } from "jsr:@std/fs";
import { parse as yamlParse } from "jsr:@std/yaml";

export const sidebar = [
  {
    title: "入门",
    href: "/runtime/",
    items: [
      {
        title: "安装",
        href: "/runtime/getting_started/installation/",
      },
      {
        title: "第一个项目",
        href: "/runtime/getting_started/first_project/",
      },
      {
        title: "设置环境",
        href: "/runtime/getting_started/setup_your_environment/",
      },
      {
        title: "命令行界面",
        href: "/runtime/getting_started/command_line_interface/",
      },
    ],
  },
  {
    title: "基础知识",
    href: "/runtime/fundamentals/",
    items: [
      {
        title: "TypeScript",
        href: "/runtime/fundamentals/typescript/",
      },
      {
        title: "Node",
        href: "/runtime/fundamentals/node/",
      },
      {
        title: "安全性",
        href: "/runtime/fundamentals/security/",
      },
      {
        title: "模块和依赖",
        href: "/runtime/fundamentals/modules/",
      },
      {
        title: "配置",
        href: "/runtime/fundamentals/configuration/",
      },
      {
        title: "标准库",
        href: "/runtime/fundamentals/standard_library/",
      },
      {
        title: "Web 开发",
        href: "/runtime/fundamentals/web_dev/",
      },
      {
        title: "测试",
        href: "/runtime/fundamentals/testing/",
      },
      {
        title: "调试",
        href: "/runtime/fundamentals/debugging/",
      },
      {
        title: "工作区",
        href: "/runtime/fundamentals/workspaces/",
      },
      {
        title: "代码检查和格式化",
        href: "/runtime/fundamentals/linting_and_formatting/",
      },
      {
        title: "HTTP 服务器",
        href: "/runtime/fundamentals/http_server/",
      },
      {
        title: "OpenTelemetry",
        href: "/runtime/fundamentals/open_telemetry/",
      },
      {
        title: "稳定性和发布",
        href: "/runtime/fundamentals/stability_and_releases/",
      },
    ],
  },
  {
    title: "参考指南",
    href: "/runtime/reference/",
    items: [
      {
        title: "CLI",
        href: "/runtime/reference/cli/",
        items: [
          {
            title: "deno add",
            href: "/runtime/reference/cli/add/",
          },
          {
            title: "deno bench",
            href: "/runtime/reference/cli/bench/",
          },
          {
            title: "deno check",
            href: "/runtime/reference/cli/check/",
          },
          {
            title: "deno clean",
            href: "/runtime/reference/cli/clean/",
          },
          {
            title: "deno compile",
            href: "/runtime/reference/cli/compile/",
          },
          {
            title: "deno completions",
            href: "/runtime/reference/cli/completions/",
          },
          {
            title: "deno coverage",
            href: "/runtime/reference/cli/coverage/",
          },
          {
            title: "deno doc",
            href: "/runtime/reference/cli/doc/",
          },
          {
            title: "deno eval",
            href: "/runtime/reference/cli/eval/",
          },
          {
            title: "deno fmt",
            href: "/runtime/reference/cli/fmt/",
          },
          {
            title: "deno info",
            href: "/runtime/reference/cli/info/",
          },
          {
            title: "deno init",
            href: "/runtime/reference/cli/init/",
          },
          {
            title: "deno install",
            href: "/runtime/reference/cli/install/",
          },
          {
            title: "deno jupyter",
            href: "/runtime/reference/cli/jupyter/",
          },
          {
            title: "deno lint",
            href: "/runtime/reference/cli/lint/",
          },
          {
            title: "deno outdated",
            href: "/runtime/reference/cli/outdated/",
          },
          {
            title: "deno publish",
            href: "/runtime/reference/cli/publish/",
          },
          {
            title: "deno lsp",
            href: "/runtime/reference/cli/lsp/",
          },
          {
            title: "deno remove",
            href: "/runtime/reference/cli/remove/",
          },
          {
            title: "deno repl",
            href: "/runtime/reference/cli/repl/",
          },
          {
            title: "deno run",
            href: "/runtime/reference/cli/run/",
          },
          {
            title: "deno serve",
            href: "/runtime/reference/cli/serve/",
          },
          {
            title: "deno task",
            href: "/runtime/reference/cli/task/",
          },
          {
            title: "deno test",
            href: "/runtime/reference/cli/test/",
          },
          {
            title: "deno types",
            href: "/runtime/reference/cli/types/",
          },
          {
            title: "deno uninstall",
            href: "/runtime/reference/cli/uninstall/",
          },
          {
            title: "deno upgrade",
            href: "/runtime/reference/cli/upgrade/",
          },
          {
            title: "deno unstable flags",
            href: "/runtime/reference/cli/unstable_flags/",
          },
        ],
      },
      {
        title: "Deno API",
        href: "/runtime/reference/deno_namespace_apis/",
      },
      {
        title: "Web API",
        href: "/runtime/reference/web_platform_apis/",
      },
      {
        title: "Node API",
        href: "/runtime/reference/node_apis/",
      },
      {
        title: "TS 配置迁移",
        href: "/runtime/reference/ts_config_migration/",
      },
      {
        title: "持续集成",
        href: "/runtime/reference/continuous_integration/",
      },
      {
        title: "环境变量",
        href: "/runtime/reference/env_variables/",
      },
      {
        title: "Deno 和 VS Code",
        href: "/runtime/reference/vscode/",
      },
      {
        title: "使用 JSX 和 React",
        href: "/runtime/reference/jsx/",
      },
      {
        title: "文档中的测试代码",
        href: "/runtime/reference/documentation/",
      },
      {
        title: "代码检查插件",
        href: "/runtime/reference/lint_plugins/",
      },
      {
        title: "WebAssembly",
        href: "/runtime/reference/wasm/",
      },
      {
        title: "迁移指南",
        href: "/runtime/reference/migration_guide/",
      },
      {
        title: "LSP 集成",
        href: "/runtime/reference/lsp_integration/",
      },
      {
        title: "Docker",
        href: "/runtime/reference/docker/",
      },
    ],
  },
  {
    title: "贡献和支持",
    href: "/runtime/contributing/",
    items: [
      {
        title: "贡献给 Deno",
        items: [
          {
            title: "架构",
            href: "/runtime/contributing/architecture/",
          },
          {
            title: "从源码构建",
            href: "/runtime/contributing/building_from_source/",
          },
          {
            title: "性能分析",
            href: "/runtime/contributing/profiling/",
          },
          {
            title: "发布计划",
            href: "/runtime/contributing/release_schedule/",
          },
          {
            title: "风格指南",
            href: "/runtime/contributing/style_guide/",
          },
          {
            title: "Web 平台测试",
            href: "/runtime/contributing/web_platform_tests/",
          },
          {
            title: "文档",
            href: "/runtime/contributing/docs/",
          },
          {
            title: "示例",
            href: "/runtime/contributing/examples/",
          },
        ],
      },
      {
        title: "帮助",
        href: "/runtime/help/",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "运行时";
export const sectionHref = "/runtime/";

export interface Description {
  kind: "note" | "tip" | "info" | "caution";
  description: string;
}
function handleDescription(description: Description | string): Description {
  if (typeof description === "string") {
    return {
      kind: "caution",
      description,
    };
  } else {
    return description;
  }
}

export type Descriptions = Record<string, DescriptionItem>;

type DescriptionItem = {
  status: "good" | "partial" | "stubs" | "unsupported";
  description?: Description;
  symbols?: Record<string, Description>;
};

export async function generateDescriptions(): Promise<Descriptions> {
  const descriptions: Descriptions = {};
  for await (
    const dirEntry of walk(
      new URL(import.meta.resolve("../reference_gen/node_descriptions")),
      { exts: ["yaml"] },
    )
  ) {
    const file = await Deno.readTextFile(dirEntry.path);
    const parsed = yamlParse(file);
    if (!parsed) {
      throw `无效或空文件: ${dirEntry.path}`;
    }
    if (parsed.description) {
      parsed.description = handleDescription(parsed.description);
    }

    if (parsed.symbols) {
      parsed.symbols = Object.fromEntries(
        Object.entries(parsed.symbols).map((
          [key, value],
        ) => [key, handleDescription(value)]),
      );
    }

    if (
      !(parsed.status === "good" || parsed.status === "partial" ||
        parsed.status === "stubs" || parsed.status === "unsupported")
    ) {
      throw `Invalid status provided in '${dirEntry.name}': ${parsed.status}`;
    }

    descriptions[dirEntry.name.slice(0, -5)] = parsed;
  }

  return descriptions;
}

/*
generates the node compat list for the Node Support page.
This the data is read from the files in the reference_gen/node_description directory.
This function is called in node.md through the templating engine Vento,
after which the normal markdown rendered is called.
 */
export async function generateNodeCompatability() {
  const descriptions = await generateDescriptions();
  const sorted = Object.entries(descriptions).toSorted(([keyA], [keyB]) =>
    keyA.localeCompare(keyB)
  );
  const grouped: Record<
    string,
    { label: string; icon: string; items: Array<[string, DescriptionItem]> }
  > = {
    good: {
      label: "完全支持的模块",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#22c55e"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      items: [],
    },
    partial: {
      label: "部分支持的模块",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#6366f1"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
      items: [],
    },
    unsupported: {
      label: "不支持的模块",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#ef4444"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      items: [],
    },
  };
  for (const item of sorted) {
    grouped[item[1].status].items.push(item);
  }

  return Object.entries(grouped).map(([_status, entries]) => {
    let content =
      `<div class="module-info">\n\n## ${entries.icon} ${entries.label} (${entries.items.length}/${
        Object.keys(descriptions).length
      })\n\n`;

    content += entries.items.map(([key, content]) => {
      let out = `\n\n### <a href="/api/node/${key}">node:${
        key.replaceAll("--", "/")
      }</a>\n\n<div class="item-content">\n\n`;

      if (content) {
        if (content.description) {
          out += `${content.description.description}\n\n`;
        }
        if (content.symbols) {
          for (const [symbol, description] of Object.entries(content.symbols)) {
            out += `**${
              symbol === "*" ? "All symbols" : symbol
            }**: ${description.description}\n\n`;
          }
        }
      }

      return out + "</div>";
    }).join("\n\n");

    return content;
  }).join("\n\n");
}
