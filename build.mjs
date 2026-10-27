// Builds dist/portfolio-standalone.html: one file with the CSS, JS and favicon inlined.
// Usage: node build.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => readFile(path.join(root, p), "utf8");

let html = await read("index.html");

html = await replaceAsync(html, /<link rel="stylesheet" href="(css\/[^"]+)" \/>/g, async (_, file) => {
  return `<style>\n${await read(file)}\n</style>`;
});

html = await replaceAsync(html, /<script src="(js\/[^"]+)"><\/script>/g, async (_, file) => {
  // Guard against a literal closing tag inside inlined scripts.
  const js = (await read(file)).replace(/<\/script/gi, "<\\/script");
  return `<script>\n${js}\n</script>`;
});

const favicon = await read("assets/favicon.svg");
html = html.replace(
  'href="assets/favicon.svg"',
  `href="data:image/svg+xml,${encodeURIComponent(favicon.trim())}"`
);

// Screenshots are referenced from both the HTML and projects.js, so swap every path for a data URI.
const shotPaths = [...new Set(html.match(/assets\/shots\/[\w.-]+\.jpg/g) || [])];
for (const shot of shotPaths) {
  const b64 = (await readFile(path.join(root, shot))).toString("base64");
  html = html.split(shot).join(`data:image/jpeg;base64,${b64}`);
}

await mkdir(path.join(root, "dist"), { recursive: true });
const out = path.join(root, "dist", "portfolio-standalone.html");
await writeFile(out, html);
console.log(`Wrote ${path.relative(root, out)} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);

async function replaceAsync(str, regex, fn) {
  const matches = [...str.matchAll(regex)];
  const replacements = await Promise.all(matches.map((m) => fn(...m)));
  let i = 0;
  return str.replace(regex, () => replacements[i++]);
}
