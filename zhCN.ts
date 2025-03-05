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
    prompt:
      `Translate the following text to chinese. my input is mdx/json format. The requirements are as follows:
  
  - Add spaces between Chinese and English
  - Only reply with the translation, no other words
  - Check if the content meets the requirements before outputting the results
  - If the content is json, please translate values only, output MUST be welformated json format

  you MUST keep the format unchanged
  
  My content is:
  
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
