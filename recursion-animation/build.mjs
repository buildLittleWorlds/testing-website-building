import { build } from "esbuild";
import { fileURLToPath } from "node:url";

await build({
  entryPoints: [fileURLToPath(new URL("./src/player.tsx", import.meta.url))],
  outfile: fileURLToPath(
    new URL("../assets/recursion-player.js", import.meta.url),
  ),
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "external",
  logLevel: "info",
});
