import { EmbedVideo } from "../_components/EmbedVideo.tsx";
import { VideoReference } from "../types.ts";

type Props = { video: VideoReference };

export default function VideoPage({ video }: Props) {
  return (
    <>
      <EmbedVideo id={video.externalURL} />
      <div className="my-12">
        在<a href="/examples/">示例页面</a> 和我们的{"  "}
        <a href="https://www.youtube.com/@deno_land">
          YouTube 频道
        </a>上找到更多视频。
      </div>
    </>
  );
}
