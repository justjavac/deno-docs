import { ExampleIcon } from "../examples/_components/ExampleIcon.tsx";
import { LearningList } from "../examples/_components/LearningList.tsx";
import { TutorialIcon } from "../examples/_components/TutorialIcon.tsx";
import { VideoIcon } from "../examples/_components/VideoIcon.tsx";
import { sidebar } from "../examples/_data.ts";

export default function LandingPage() {
  const componentsPerSidebarItem = sidebar.map(
    (item: { title: string; items: any[] }) => {
      return (
        <LearningList
          title={item.title}
          items={item.items}
        />
      );
    },
  );

  return (
    <>
      <main
        id="content"
        className="flex flex-col px-8 xl:px-0 pt-6 md:pt-12 mt-4 md:items-center md:justify-center max-w-[1200px] mx-auto mb-12"
      >
        <div className="flex flex-col md:flex-row w-full mb-8 max-w-screen-xl justify-between">
          <div className="max-w-prose mb-8">
            <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl mb-3">
              示例
            </h1>
            <p>
              一系列详细的教程、示例、视频和指南，帮助你了解 Deno
              运行时以及如何将其与你最喜欢的工具结合使用。
            </p>
          </div>
          <img
            className="w-full max-w-32 mx-auto h-auto mb-4 hidden md:block"
            alt="Deno 示例"
            src="/examples.png"
          />
        </div>
        <div className="flex flex-col gap-4 w-full mb-4 p-4 border border-blue-100 dark:border-background-tertiary bg-blue-50 dark:bg-background-secondary rounded md:flex-wrap md:justify-start md:items-center md:flex-row">
          <h2 className="font-semibold">
            按类型筛选：
          </h2>
          <label for="example" className="flex gap-2 items-center mr-4">
            <ExampleIcon />
            <span>示例:</span>
            <span className="switch">
              <input
                type="checkbox"
                id="example"
                value="Examples"
                className="filter mr-2"
                checked
              />
              <span className="slider"></span>
            </span>
          </label>

          <label for="tutorial" className="flex gap-2 items-center mr-4">
            <TutorialIcon />
            <span>教程:</span>
            <span className="switch">
              <input
                type="checkbox"
                id="tutorial"
                value="Tutorials"
                className="filter mr-2"
                checked
              />
              <span className="slider"></span>
            </span>
          </label>

          <label for="video" className="flex gap-2 items-center mr-4">
            <VideoIcon />
            <span>视频:</span>
            <span className="switch">
              <input
                type="checkbox"
                id="video"
                value="Videos"
                className="filter mr-2"
                checked
              />
              <span className="slider"></span>
            </span>
          </label>
        </div>

        <div className="unfiltered columns-1 sm:columns-2 lg:columns-3 gap-8 mb-8 w-[100%]">
          {componentsPerSidebarItem}
        </div>
        <div className="fully-filtered">
          <h2 class="text-2xl font-semibold sm:text-3xl md:text-4xl">
            哎呀！你把所有内容都过滤掉了
          </h2>
          <p class="md:text-lg mt-4">
            或许移除一个过滤器来查看一些示例？
          </p>
          <img
            src="/examples/tutorials/images/deno-educator.png"
            alt="戴着毕业帽的悲伤 Deno"
          />
        </div>
      </main>
      <aside class="px-8 xl:px-0 max-w-[1200px] mx-auto mb-24 space-y-4 border-t pt-8">
        <h2 class="text-2xl md:text-3xl font-bold">
          我们欢迎贡献！
        </h2>
        <p class="text-balance pt-4 mt-3">
          找不到你想要的示例？或者想添加一个你自己的示例？请查看我们的{" "}
          <a
            href="https://github.com/denoland/deno-docs?tab=readme-ov-file#examples"
            class="text-primary hover:underline focus:underline"
          >
            GitHub 仓库
          </a>。
        </p>
        <p>
          <a
            href="/runtime/contributing/examples/"
            class="text-primary hover:underline focus:underline text-center mt-4 font-bold"
          >
            提交一个示例，我们会送你贴纸！
          </a>
        </p>
      </aside>
    </>
  );
}
