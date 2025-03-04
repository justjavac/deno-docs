import "@std/dotenv/load";
import { walk } from "jsr:@std/fs";
import { crypto } from "jsr:@std/crypto";
import { encodeHex } from "jsr:@std/encoding/hex";
import { relative } from "jsr:@std/path/relative";
import { generateText } from "npm:ai";
import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";

const EN_CONTENT_DIR = "../en";
const TRANSLATION_FILE = "./translation.json";

const translation: Record<string, string> = JSON.parse(
  await Deno.readTextFile(TRANSLATION_FILE),
);

const fileWantedToTranslate = walk(EN_CONTENT_DIR, {
  exts: [".md", ".mdx"],
  skip: [/reference_gen/, /node_modules/, /_site/],
});

const ark = createOpenAICompatible({
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
  name: "ark",
  apiKey: Deno.env.get("ARK_API_KEY"),
});

const model = ark("deepseek-v3-241226");

/**
 * 使用 deepseek 翻译文档
 *
 * @param path 待翻译的文件路径
 * @param content 待翻译的内容
 * @returns  [string, string | undefined]
 */
async function translate(
  path: string,
  content: string,
): Promise<string | undefined> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content),
  );
  const hash = encodeHex(digest);

  if (translation[path] === hash) {
    return undefined;
  }

  const { text } = await generateText({
    model,
    maxTokens: 16384,
    prompt:
      `你是一个翻译助手，很擅长翻译 deno 的文章。我给你发一句英文，你帮我翻译。不需要任何额外的输出，只需要翻译就行。保留我的格式。如果是 json 文件，只需要翻译 value，不要翻译 key。务必保留我的格式。
  
  ${content}
  `,
  });

  translation[path] = hash;

  return text;
}

// 翻译文档
for await (const { path } of fileWantedToTranslate) {
  const content = await Deno.readTextFile(path);
  const zhPath = relative(EN_CONTENT_DIR, path);
  const text = await translate(zhPath, content);

  if (text === undefined) {
    continue;
  }

  await Deno.writeTextFile(zhPath, text);
  await Deno.writeTextFile(
    TRANSLATION_FILE,
    JSON.stringify(translation, null, 2) + "\n",
  );
  console.log(`Translated ${zhPath}`);
}

// 翻译 command cli
const content = await Deno.readTextFile(
  "../en/runtime/reference/cli/_commands_reference.json",
);
const commands = JSON.parse(content);
for (const key in commands.subcommands) {
  const command = commands.subcommands[key];
  const text = await translate(
    `runtime/reference/cli/${command.name}`,
    JSON.stringify(command, null, 2),
  );
  if (text === undefined) {
    continue;
  }
  commands.subcommands[key] = JSON.parse(text);
  await Deno.writeTextFile(
    "./runtime/reference/cli/_commands_reference.json",
    JSON.stringify(commands, null, 2) + "\n",
  );
  await Deno.writeTextFile(
    TRANSLATION_FILE,
    JSON.stringify(translation, null, 2) + "\n",
  );
  console.log(`Translated command ${command.name}`);
}
