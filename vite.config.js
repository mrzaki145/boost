import { defineConfig } from "vite";
import { resolve } from "path";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import postcssCustomMedia from "postcss-custom-media";

const root = resolve(__dirname, "src");

export default defineConfig({
  root,
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        // contact: resolve(root, "contact/index.html"),
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssCustomMedia(),
        postcssPresetEnv(),
        autoprefixer({ grid: "autoplace" }),
      ],
    },
  },
});
