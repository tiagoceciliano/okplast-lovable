import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Divide o vendor em chunks menores para a hidratação inicial baixar/parsear
    // menos JS de uma vez, melhorando o TTI.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@supabase/supabase-js")) return "supabase-vendor";
          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform/resolvers") ||
            id.includes("/zod/")
          ) return "form-vendor";
          if (id.includes("@tanstack/react-query")) return "query-vendor";
          if (id.includes("@radix-ui/")) return "radix-vendor";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("react-router")
          ) return "react-vendor";
        },
      },
    },
  },
}));
