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

try {
  for await (const { path } of fileWantedToTranslate) {
    const content = await Deno.readTextFile(path);
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(content),
    );
    const hash = encodeHex(digest);

    const zhPath = relative(EN_CONTENT_DIR, path);
    if (translation[zhPath] === hash) {
      continue;
    }

    // console.log(`Translating ${zhPath}`);
    // console.log(hash);

    const { text } = await generateText({
      model,
      prompt:
        `Translate the following text to chinese. my input is mdx format. The requirements are as follows:
    
    - Add spaces between Chinese and English
    - Only reply with the translation, no other words
    - Check if the content meets the requirements before outputting the results
    
    My content is:
    
    ${content}
    `,
    });

    await Deno.writeTextFile(zhPath, text);
    translation[zhPath] = hash;

    console.log(`Translated ${zhPath}`);
  }
} catch (error) {
  console.error(error);
} finally {
  await Deno.writeTextFile(
    TRANSLATION_FILE,
    JSON.stringify(translation, null, 2) + "\n",
  );
}
