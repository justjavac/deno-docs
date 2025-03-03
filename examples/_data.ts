export const sidebar = [
  {
    title: "基础",
    items: [
      {
        title: "什么是 Deno？",
        href: "/examples/what_is_deno/",
        externalURL:
          "https://www.youtube.com/watch?v=KPTOo4k8-GE&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe",
        type: "video",
      },
      {
        title: "运行脚本",
        href: "/examples/run_script_tutorial/",
        type: "tutorial",
      },
      {
        title: "Hello World",
        href: "/examples/hello_world/",
        type: "example",
      },
      {
        title: "内置 TypeScript 支持",
        href: "/examples/typescript_support/",
        type: "example",
      },
      {
        title: "你的 Deno 开发环境",
        href: "/examples/deno_dev_environment/",
        externalURL:
          "https://www.youtube.com/watch?v=BFfrGrLm2tw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=3",
        type: "video",
      },
      {
        title: "初始化项目",
        href: "/examples/initialize_project_tutorial/",
        type: "tutorial",
      },
      {
        title: "可执行脚本",
        href: "/examples/hashbang_tutorial/",
        type: "tutorial",
      },
      {
        title: "一体化工具",
        href: "/examples/all-in-one_tooling/",
        externalURL:
          "https://www.youtube.com/watch?v=-4e9DkUrCr4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=5",
        type: "video",
      },
      {
        title: "使用 deno.json 进行任务和配置",
        href: "/examples/configuration_with_deno_json/",
        externalURL:
          "https://www.youtube.com/watch?v=bTmO5Tfgke4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=10",
        type: "video",
      },
      {
        title: "顶层 await",
        href: "/examples/top_level_await/",
        type: "example",
      },
      {
        title: "从 CommonJS 更新到 ESM",
        href: "/examples/cjs_to_esm_tutorial/",
        type: "tutorial",
      },

      {
        title: "导入和导出函数",
        href: "/examples/import_export/",
        type: "example",
      },
      {
        title: "与 Node.js 的互操作性",
        href: "/examples/interoperability_with_nodejs/",
        externalURL:
          "https://www.youtube.com/watch?v=mgX1ymfqPSQ&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=2",
        type: "video",
      },
      {
        title: "Deno API 简介",
        href: "/examples/intro_to_deno_apis/",
        externalURL:
          "https://www.youtube.com/watch?v=p28ujFMrdA0&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=7",
        type: "video",
      },
      {
        title: "简单的文件服务器",
        href: "/examples/file_server_tutorial/",
        type: "tutorial",
      },
      {
        title: "使用 Deno coverage 进行更好的测试",
        href: "/examples/deno_coverage/",
        externalURL: "https://www.youtube.com/watch?v=P2BBYNPpgW8",
        type: "video",
      },
      {
        title: "使用 Deno fmt 进行格式化",
        href: "/examples/deno_fmt/",
        externalURL: "https://www.youtube.com/watch?v=Ouzso9gQqnc",
        type: "video",
      },
      {
        title: "使用 Deno bench 进行基准测试",
        href: "/examples/deno_bench/",
        externalURL: "https://www.youtube.com/watch?v=IVde_GTN6TM",
        type: "video",
      },
      {
        title: "开始使用 Deno test",
        href: "/examples/deno_test/",
        externalURL: "https://www.youtube.com/watch?v=gDtDVfsgHgs",
        type: "video",
      },
    ],
  },
  {
    title: "模块和包管理",
    items: [
      {
        title: "使用 Node.js 的内置模块",
        href: "/examples/node_built_in/",
        type: "example",
      },
      {
        title: "从 npm 导入模块",
        href: "/examples/npm/",
        type: "example",
      },
      {
        title: "与 Node & npm 的兼容性",
        href: "/examples/backward_compat_with_node_npm/",
        externalURL:
          "https://www.youtube.com/watch?v=QPLchkJ7eas&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=12",
        type: "video",
      },
      {
        title: "ECMAScript 模块",
        href: "/examples/esmodules/",
        externalURL:
          "https://www.youtube.com/watch?v=cTFBiwYY3vs&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=9",
        type: "video",
      },
      {
        title: "使用 JSR 发布模块",
        href: "/examples/publishing_modules_with_jsr/",
        externalURL:
          "https://www.youtube.com/watch?v=7uiL4WYvZVs&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=8",
        type: "video",
      },
    ],
  },

  {
    title: "Web 标准 API",
    items: [
      {
        title: "Deno 中的浏览器 API",
        href: "/examples/browser_apis_in_deno/",
        externalURL:
          "https://www.youtube.com/watch?v=oxVwTT-rZRo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=6",
        type: "video",
      },
      {
        title: "使用 console API 进行更好的调试",
        href: "/examples/debugging_with_console_tutorial/",
        type: "tutorial",
      },
      {
        title: "操作和解析 URL",
        href: "/examples/url_parsing/",
        type: "example",
      },
      {
        title: "获取和流式传输数据",
        href: "/examples/fetch_data_tutorial/",
        type: "tutorial",
      },
      {
        title: "设置超时和间隔",
        href: "/examples/timers/",
        type: "example",
      },
      {
        title: "带颜色的日志记录",
        href: "/examples/color_logging/",
        type: "example",
      },
      {
        title: "Web workers",
        href: "/examples/web_workers/",
        type: "example",
      },
      {
        title: "Web assembly",
        href: "/examples/webassembly/",
        type: "example",
      },
    ],
  },

  {
    title: "Web框架和库",
    items: [
      {
        title: "TypeScript和JSX",
        href: "/examples/ts_jsx/",
        externalURL:
          "https://www.youtube.com/watch?v=KoM8ahe8O74&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=11",
        type: "视频",
      },
      {
        title: "构建一个React应用",
        href: "/examples/react_tutorial/",
        type: "教程",
      },
      {
        title: "使用create-vite构建React应用",
        href: "/examples/create_react_tutorial/",
        type: "教程",
      },
      {
        title: "构建一个Next.js应用",
        href: "/examples/next_tutorial/",
        type: "教程",
      },
      {
        title: "构建一个Fresh应用",
        href: "https://fresh.deno.dev/docs/getting-started/create-a-project/",
        type: "教程",
      },
      {
        title: "构建一个Vue应用",
        href: "/examples/vue_tutorial/",
        type: "教程",
      },
      {
        title: "在Deno中使用Express",
        href: "/examples/express_tutorial/",
        type: "教程",
      },
      {
        title: "如何在Deno中使用Apollo",
        href: "/examples/apollo_tutorial/",
        type: "教程",
      },
      {
        title: "使用Deno构建一个Astro站点",
        href: "/examples/astro_tutorial/",
        type: "教程",
      },
      {
        title: "使用Deno构建一个Qwik应用",
        href: "/examples/qwik_tutorial/",
        type: "教程",
      },
      {
        title: "使用Deno构建一个Nuxt应用",
        href: "/examples/nuxt_tutorial/",
        type: "教程",
      },
      {
        title: "使用tRPC和Deno构建一个类型安全的API",
        href: "/examples/trpc_tutorial/",
        type: "教程",
      },
      {
        title: "使用TypeScript构建一个API服务器",
        href: "/examples/build_api_server_ts/",
        externalURL:
          "https://www.youtube.com/watch?v=J8kZ-s-5-ms&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=13",
        type: "视频",
      },
      {
        title: "构建一个Vue应用",
        href: "/examples/vue_app_video/",
        externalURL: "https://www.youtube.com/watch?v=MDPauM8fZDE",
        type: "视频",
      },
      {
        title: "构建一个SolidJS应用",
        href: "/examples/solidjs_tutorial/",
        type: "教程",
      },
      {
        title: "构建一个React应用",
        href: "/examples/react_app_video/",
        externalURL: "https://www.youtube.com/watch?v=eStwt_2THd8",
        type: "视频",
      },
      {
        title: "构建一个Tanstack应用",
        href: "/examples/tanstack_tutorial/",
        type: "教程",
      },
    ],
  },
  {
    title: "部署 Deno 项目",
    items: [
      {
        title: "AWS Lambda",
        href: "/examples/aws_lambda_tutorial/",
        type: "教程",
      },
      {
        title: "将 Deno 部署到 AWS Lambda",
        href: "/examples/deploy_deno_to_aws_lambda/",
        externalURL:
          "https://www.youtube.com/watch?v=_xLOrT3cWK4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=17",
        type: "视频",
      },
      {
        title: "AWS Lightsail",
        href: "/examples/aws_lightsail_tutorial/",
        type: "教程",
      },
      {
        title: "Cloudflare workers",
        href: "/examples/cloudflare_workers_tutorial/",
        type: "教程",
      },
      {
        title: "Digital Ocean",
        href: "/examples/digital_ocean_tutorial/",
        type: "教程",
      },
      {
        title: "Google Cloud Run",
        href: "/examples/google_cloud_run_tutorial/",
        type: "教程",
      },
      {
        title: "Kinsta",
        href: "/examples/kinsta_tutorial/",
        type: "教程",
      },
      {
        title: "使用 Docker 部署 Deno",
        href: "/examples/deploying_deno_with_docker/",
        externalURL:
          "https://www.youtube.com/watch?v=VRryNeYm6yw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=16",
        type: "视频",
      },
    ],
  },
  {
    title: "连接数据库",
    items: [
      {
        title: "连接数据库",
        href: "/examples/connecting_to_databases_tutorial/",
        type: "教程",
      },
      {
        title: "在 Deno 中使用 MySQL2",
        href: "/examples/mysql2_tutorial/",
        type: "教程",
      },
      {
        title: "在 Deno 中使用 PlanetScale",
        href: "/examples/planetscale_tutorial/",
        type: "教程",
      },
      {
        title: "在 Deno 中使用 Redis",
        href: "/examples/redis_tutorial/",
        type: "教程",
      },
      {
        title: "在 Deno 中使用 Prisma",
        href: "/examples/prisma_tutorial/",
        type: "教程",
      },
      {
        title: "在 Deno 中使用 Drizzle",
        href: "/examples/drizzle_tutorial/",
        type: "教程",
      },
      {
        title: "Mongoose 和 MongoDB",
        href: "/examples/mongoose_tutorial/",
        type: "教程",
      },
      {
        title: "连接到 Redis",
        href: "/examples/redis/",
        type: "示例",
      },
      {
        title: "连接到 Postgres",
        href: "/examples/postgres/",
        type: "示例",
      },
      {
        title: "连接到 Supabase",
        href: "/examples/supabase/",
        type: "示例",
      },
      {
        title: "连接到 MongoDB",
        href: "/examples/mongo/",
        type: "示例",
      },
      {
        title: "连接到 SQLite",
        href: "/examples/sqlite/",
        type: "示例",
      },
      {
        title: "连接到 Mongoose 和 MongoDB",
        href: "/examples/mongoose/",
        externalURL: "https://www.youtube.com/watch?v=dmZ9Ih0CR9g",
        type: "视频",
      },
      {
        title: "连接到 Prisma",
        href: "/examples/prisma/",
        externalURL: "https://www.youtube.com/watch?v=P8VzA_XSF8w",
        type: "视频",
      },
      {
        title: "连接到 DuckDB",
        href: "/examples/duckdb/",
        type: "示例",
      },
    ],
  },
  {
    title: "编码",
    items: [
      {
        title: "Hex 和 base64 编码",
        href: "/examples/hex_base64_encoding/",
        type: "example",
      },
      {
        title: "解析和序列化 TOML",
        href: "/examples/parsing_serializing_toml/",
        type: "example",
      },
      {
        title: "导入 JSON",
        href: "/examples/importing_json/",
        type: "example",
      },
      {
        title: "解析和序列化 CSV",
        href: "/examples/parsing_serializing_csv/",
        type: "example",
      },
      {
        title: "解析和序列化 JSON",
        href: "/examples/parsing_serializing_json/",
        type: "example",
      },
      {
        title: "解析和序列化 YAML",
        href: "/examples/parsing_serializing_yaml/",
        type: "example",
      },
      {
        title: "操作字节数组",
        href: "/examples/byte_manipulation/",
        type: "example",
      },
    ],
  },
  {
    title: "CLI",
    items: [
      {
        title: "构建命令行工具",
        href: "/examples/command_line_utility/",
        externalURL:
          "https://www.youtube.com/watch?v=TUxj2TS5pNo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=14",
        type: "video",
      },
      {
        title: "输入提示",
        href: "/examples/prompts/",
        type: "example",
      },
      {
        title: "权限管理",
        href: "/examples/permissions/",
        type: "example",
      },
      {
        title: "命令行参数",
        href: "/examples/command_line_arguments/",
        type: "example",
      },
      {
        title: "编写测试",
        href: "/examples/writing_tests/",
        type: "example",
      },
      {
        title: "获取 Deno 版本",
        href: "/examples/deno_version/",
        type: "example",
      },
    ],
  },
  {
    title: "网络",
    items: [
      {
        title: "HTTP 请求",
        href: "/examples/http_requests/",
        type: "example",
      },
      {
        title: "HTTP 服务器: Hello world",
        href: "/examples/http_server/",
        type: "example",
      },
      {
        title: "HTTP 服务器: 路由",
        href: "/examples/http_server_routing/",
        type: "example",
      },
      {
        title: "HTTP 服务器: 文件服务",
        href: "/examples/http_server_files/",
        type: "example",
      },
      {
        title: "HTTP 服务器: 流式传输",
        href: "/examples/http_server_streaming/",
        type: "example",
      },
      {
        title: "HTTP 服务器: 使用 SQLite3 进行 CRUD 操作",
        href: "/examples/http_server_oak_crud_middleware_with_sqlite3_db/",
        type: "example",
      },
      {
        title: "Hono HTTP 服务器",
        href: "/examples/hono/",
        type: "example",
      },
      {
        title: "HTTP 服务器: WebSockets",
        href: "/examples/http_server_websocket/",
        type: "example",
      },
      {
        title: "流式管道",
        href: "/examples/piping_streams/",
        type: "example",
      },
      {
        title: "出站 WebSockets",
        href: "/examples/websocket/",
        type: "example",
      },
      {
        title: "TCP 回显服务器",
        href: "/examples/tcp_echo_server/",
        type: "example",
      },
      {
        title: "TCP 连接器: Ping",
        href: "/examples/tcp_connector/",
        type: "example",
      },
      {
        title: "TCP 监听器: Ping",
        href: "/examples/tcp_listener/",
        type: "example",
      },
      {
        title: "TCP/TLS 连接器: Ping",
        href: "/examples/tls_connector/",
        type: "example",
      },
      {
        title: "TCP/TLS 监听器: Ping",
        href: "/examples/tls_listener/",
        type: "example",
      },
      {
        title: "运行 DNS 查询",
        href: "/examples/dns_queries/",
        type: "example",
      },
    ],
  },
  {
    title: "系统",
    items: [
      {
        title: "处理操作系统信号",
        href: "/examples/os_signals/",
        type: "example",
      },
      {
        title: "基准测试",
        href: "/examples/benchmarking/",
        type: "example",
      },
      {
        title: "创建子进程",
        href: "/examples/subprocess_tutorial/",
        type: "tutorial",
      },
      {
        title: "子进程生成",
        href: "/examples/subprocess_running_files/",
        type: "example",
      },
      {
        title: "收集子进程输出",
        href: "/examples/subprocesses_output/",
        type: "example",
      },
      {
        title: "读取系统指标",
        href: "/examples/reading_system_metrics/",
        type: "example",
      },
      {
        title: "进程信息",
        href: "/examples/pid/",
        type: "example",
      },
      {
        title: "环境变量",
        href: "/examples/environment_variables/",
        type: "example",
      },
      {
        title: "子进程：生成",
        href: "/examples/subprocesses_spawn/",
        type: "example",
      },
      {
        title: "处理操作系统信号",
        href: "/examples/os_signals_tutorial/",
        type: "tutorial",
      },
    ],
  },
  {
    title: "文件系统",
    items: [
      {
        title: "路径操作",
        href: "/examples/path_operations/",
        type: "example",
      },
      {
        title: "读取文件",
        href: "/examples/reading_files/",
        type: "example",
      },
      {
        title: "写入文件",
        href: "/examples/writing_files/",
        type: "example",
      },
      {
        title: "删除文件",
        href: "/examples/deleting_files/",
        type: "example",
      },
      {
        title: "检查文件是否存在",
        href: "/examples/checking_file_existence/",
        type: "example",
      },
      {
        title: "移动/重命名文件",
        href: "/examples/moving_renaming_files/",
        type: "example",
      },
      {
        title: "创建和删除目录",
        href: "/examples/create_remove_directories/",
        type: "example",
      },
      {
        title: "监视文件系统",
        href: "/examples/watching_files/",
        type: "example",
      },
      {
        title: "遍历目录",
        href: "/examples/walking_directories/",
        type: "example",
      },
      {
        title: "Unix cat",
        href: "/examples/unix_cat/",
        type: "example",
      },
      {
        title: "创建和解析符号链接",
        href: "/examples/symlinks/",
        type: "example",
      },
      {
        title: "临时文件和目录",
        href: "/examples/temporary_files/",
        type: "example",
      },
      {
        title: "流式文件操作",
        href: "/examples/streaming_files/",
        type: "example",
      },
      {
        title: "解压gzip文件",
        href: "/examples/unzip_gzipped_file/",
        type: "example",
      },
    ],
  },
  {
    title: "加密",
    items: [
      {
        title: "生成和验证UUID",
        href: "/examples/uuids/",
        type: "示例",
      },
      {
        title: "ULID",
        href: "/examples/ulid/",
        type: "示例",
      },
      {
        title: "哈希",
        href: "/examples/hashing/",
        type: "示例",
      },
      {
        title: "RSASSA-PKCS1-v1_5签名和验证",
        href: "/examples/rsa_signature/",
        type: "示例",
      },
      {
        title: "HMAC生成和验证",
        href: "/examples/hmac_generate_verify/",
        type: "示例",
      },
      {
        title: "AES加密和解密",
        href: "/examples/aes_encryption/",
        type: "示例",
      },
    ],
  },
  {
    title: "高级",
    items: [
      {
        title: "文件系统事件",
        href: "/examples/file_system_events_tutorial/",
        type: "教程",
      },
      {
        title: "模块元数据",
        href: "/examples/module_metadata_tutorial/",
        type: "教程",
      },
      {
        title: "基于文件的路由",
        href: "/examples/file_based_routing_tutorial/",
        type: "教程",
      },
      {
        title: "使用WebSockets构建聊天应用",
        href: "/examples/chat_app_tutorial/",
        type: "教程",
      },
      {
        title: "构建实时WebSocket应用",
        href: "/examples/realtime_websocket_app/",
        externalURL:
          "https://www.youtube.com/watch?v=FC4IrkHEg4A&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=15",
        type: "视频",
      },
      {
        title: "构建单词查找器应用",
        href: "/examples/word_finder_tutorial/",
        type: "教程",
      },
      {
        title: "连接到OpenAI - 聊天完成",
        href: "/examples/openai_chat_completion/",
        type: "示例",
      },
      {
        title: "使用Deno集合处理用户数据",
        href: "/examples/data_processing/",
        type: "示例",
      },
      {
        title: "指数退避",
        href: "/examples/exponential_backoff/",
        type: "示例",
      },
    ],
  },
  {
    title: "不稳定API",
    items: [
      {
        title: "Deno KV监听",
        href: "/examples/kv_watch/",
        type: "示例",
      },
      {
        title: "Deno Cron",
        href: "/examples/cron/",
        type: "示例",
      },
      {
        title: "Deno队列",
        href: "/examples/queues/",
        type: "示例",
      },
      {
        title: "Deno KV: 键/值数据库",
        href: "/examples/kv/",
        type: "示例",
      },
      {
        title: "UDP监听器: Ping",
        href: "/examples/udp_listener/",
        type: "示例",
      },
      {
        title: "UDP连接器: Ping",
        href: "/examples/udp_connector/",
        type: "示例",
      },
      {
        title: "Temporal API",
        href: "/examples/temporal/",
        type: "示例",
      },
    ],
  },
];

export const sectionTitle = "示例";
export const sectionHref = "/examples/";
