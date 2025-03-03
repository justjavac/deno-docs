export const TAGS = {
  cli: {
    title: "cli",
    description: "在 Deno CLI 中工作",
  },
  deploy: {
    title: "deploy",
    description: "在 Deno Deploy 中工作",
  },
  web: {
    title: "web",
    description: "在 Web 上工作",
  },
};

export const DIFFICULTIES = {
  beginner: {
    title: "初学者",
    description: "此示例不需要任何重要的先验知识。",
  },
  intermediate: {
    title: "中级",
    description: "此示例需要一些先验知识。",
  },
};

export type ExampleFromFileSystem = {
  name: string;
  content: string;
  label: string;
  parsed: Example;
  externalURL?: string;
};

export interface Example {
  id: string;
  title: string;
  description: string;
  difficulty: keyof typeof DIFFICULTIES;
  tags: (keyof typeof TAGS)[];
  additionalResources: [string, string][];
  run?: string;
  playground?: string;
  files: ExampleFile[];
  group: string;
  sortOrder: any;
}

export interface ExampleFile {
  name: string;
  snippets: ExampleSnippet[];
}

export interface ExampleSnippet {
  text: string;
  code: string;
}

export interface VideoReference {
  externalURL: string;
}
