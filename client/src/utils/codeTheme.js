const base = {
  color: "var(--color-fg)",
  background: "none",
  fontFamily: "var(--font-mono)",
  fontSize: "12.5px",
  lineHeight: "1.7",
  textAlign: "left",
  whiteSpace: "pre",
  wordSpacing: "normal",
  wordBreak: "normal",
  tabSize: 2,
  hyphens: "none",
};

const codeTheme = {
  'code[class*="language-"]': base,
  'pre[class*="language-"]': { ...base, overflow: "auto" },
  comment: { color: "var(--color-fg-subtle)", fontStyle: "italic" },
  prolog: { color: "var(--color-fg-subtle)" },
  punctuation: { color: "var(--color-fg-muted)" },
  operator: { color: "var(--color-fg-muted)" },
  keyword: { color: "var(--color-const)" },
  builtin: { color: "var(--color-const)" },
  "class-name": { color: "var(--color-fg)" },
  function: { color: "var(--color-fg)" },
  property: { color: "var(--color-fg)" },
  string: { color: "var(--color-accent)" },
  "template-string": { color: "var(--color-accent)" },
  number: { color: "var(--color-accent-hover)" },
  boolean: { color: "var(--color-const)" },
  regex: { color: "var(--color-accent)" },
};

export default codeTheme;
