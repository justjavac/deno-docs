export const layout = "doc.tsx";

export default function Raw(data: Lume.Data) {
  return (
    <>
      <data.comp.VideoPlayer id={data.videoUrl} />

      {data.children}

      <div className="my-12">
        在<a href="/examples/">示例页面</a> 和我们的{"  "}
        <a href="https://www.youtube.com/@deno_land">
          YouTube 频道
        </a>上查看更多视频。
      </div>
    </>
  );
}
