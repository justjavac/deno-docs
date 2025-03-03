export const css = "@import './_components/ThemeToggle.css';";

export default function () {
  return (
    <button
      type="button"
      aria-label="切换主题"
      className="theme-toggle"
      id="theme-toggle"
    >
      切换主题
    </button>
  );
}

export const js = `
import "/js/darkmode.client.js";
import "/js/darkmode-toggle.client.js";
`;
