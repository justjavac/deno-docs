export const layout = "raw.tsx";

export const toc = [];

export default function* (
  data: Lume.Data,
) {
  yield {
    url: `/examples/`,
    title: `Deno 示例和教程`,
    content: <data.comp.LandingPage />,
  };
}
