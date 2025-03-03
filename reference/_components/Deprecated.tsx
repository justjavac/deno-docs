export default function ({ markdownContent }) {
  if (markdownContent === null) {
    return null;
  }

  return (
    <div class="deprecated">
      <div>
        <span>已弃用</span>
      </div>

      {/*markdown rendering*/}
      {markdownContent && (
        <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
      )}
    </div>
  );
}
