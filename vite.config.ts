import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib.ts"),
      formats: ["es"],
      fileName: "component",
    },
    outDir: "dist",
    emptyDirBeforeWrite: true,
    target: "es2022",
    minify: false,
    rollupOptions: {
      external: (id) => id.startsWith("wasi:"),
      output: {
        entryFileNames: "component.js",
      },
    },
  },
});
