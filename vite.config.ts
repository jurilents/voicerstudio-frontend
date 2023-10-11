import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import * as path from "path";
import * as fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactVirtualized()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

export function reactVirtualized() {
  return {
    name: "my:react-virtualized",
    configResolved() {
      const file = require
        .resolve("react-virtualized")
        .replace(
          path.join("dist", "commonjs", "index.js"),
          path.join("dist", "es", "WindowScroller", "utils", "onScroll.js"),
        );
      const code = fs.readFileSync(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      fs.writeFileSync(file, modified);
    },
  }
}
