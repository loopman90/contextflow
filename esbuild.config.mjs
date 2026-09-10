import esbuild from "esbuild";
import { readFileSync } from "node:fs";

const production = process.env.NODE_ENV === "production";
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  platform: "node",
  target: "es2018",
  sourcemap: production ? false : "inline",
  minify: production,
  outfile: "main.js",
  define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development") }
});

if (production) {
  await context.rebuild();
  await context.dispose();
} else {
  await context.watch();
  console.log(`Watching ContextFlow ${manifest.version}...`);
}
