export const layout = "doc.tsx";

const generateConfigFileForTag = (tag: string) => {
  return `{
  "lint": {
    "rules": {
      "tags": ["${tag}"]
    }
  }
}`;
};

const generateConfigFileForTags = (tags: string[]) => {
  return `{
  "lint": {
    "rules": {
      "tags": ["${tags[0]}"] // ...or ${
    tags.slice(1).map((tag) => `"${tag}"`).join(", ")
  }
    }
  }
}`;
};

const generateCliForTag = (tag: string) => {
  return `deno lint --rules-tags=${tag}`;
};

const generateCliForTags = (tags: string[]) => {
  return tags.map(generateCliForTag).join("\n# or ...\n");
};

function LintRuleTags(props: { tags: string[] }) {
  const tags = props.tags;
  if (tags.length === 0) {
    return null;
  }

  return (
    <div class="rounded-md p-4 bg-background-secondary text-sm mb-8 flex flex-col gap-1">
      {tags.length === 1
        ? (
          <>
            <div class="mb-4">
              <b>注意：</b> 此规则是 <code>{tags[0]}</code> 规则集的一部分。
            </div>
            <div>
              在 <code>deno.json</code> 中启用完整规则集：
            </div>
            <pre>{generateConfigFileForTag(tags[0])}</pre>
            <div>使用 Deno CLI 启用完整规则集：</div>
            <pre class="!mb-0">{generateCliForTag(tags[0])}</pre>
          </>
        )
        : (
          <>
            <div class="mb-4">
              <span class="flex flex-wrap items-center gap-2">
                <b>注意：</b> 此规则包含在以下规则集中：
                {tags.map((tag) => <code key={tag}>{tag}</code>)}
              </span>
            </div>
            <div>
              在 <code>deno.json</code> 中启用完整集合：
            </div>
            <pre>{generateConfigFileForTags(tags)}</pre>
            <div>使用 Deno CLI 启用完整集合：</div>
            <pre class="!mb-0">{generateCliForTags(tags)}</pre>
          </>
        )}
    </div>
  );
}

export default function LintRule(props: Lume.Data, _helpers: Lume.Helpers) {
  const tags = props.data.tags;

  return (
    <>
      <LintRuleTags tags={tags} />
      {props.children}
    </>
  );
}
