import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Configuración compartida de Vite (como los alias)
const sharedConfig = {
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
};

export default defineConfig({
  ...sharedConfig,
  test: {
    // La forma moderna y oficial de separar entornos en Vitest
    projects: [
      {
        ...sharedConfig,
        test: {
          name: "node-tests",
          environment: "node",
          include: ["tests/**/*.test.{ts,tsx}"],
          exclude: ["tests/ui/**"], // Node ignora la carpeta de UI
        },
      },
      {
        ...sharedConfig,
        test: {
          name: "ui-tests",
          environment: "jsdom",
          include: ["tests/ui/**/*.test.{ts,tsx}"], // JSDOM solo ejecuta la UI
        },
      },
    ],
  },
});
