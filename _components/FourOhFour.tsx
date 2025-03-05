export default function () {
  return (
    <div className="fourohfour">
      <h1 class="text-2xl font-semibold sm:text-3xl md:text-4xl">
        <div class="text-[400%] font-semibold text-runtime-300 opacity-50 dark:opacity-15 relative -z-10">
          404
        </div>
        抱歉，找不到那个页面。
      </h1>
      <p class="md:text-lg mt-4 px-4">
        也许这些链接中有你要找的内容？
      </p>
    </div>
  );
}

export const css = "@import './_components/FourOhFour.css';";
