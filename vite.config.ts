import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Transforma o <link rel="stylesheet" href="/assets/index-*.css"> gerado
 * pelo Vite em preload+swap non-blocking. O CSS crítico inline no <head>
 * garante a hero; o CSS externo aplica sem bloquear a LCP.
 */
function nonBlockingCssPlugin() {
  return {
    name: "non-blocking-css",
    apply: "build" as const,
    transformIndexHtml(html: string) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*)>/g,
        (_m, a, href, b) =>
          // Duas estratégias combinadas:
          //  1) preload+onload='swap' (rápido em Chromium moderno)
          //  2) media="print" onload="this.media='all'" (fallback universal
          //     mesmo quando o CDN reserializa o HTML e perde o preload)
          `<link rel="preload" as="style"${a}href="${href}"${b} onload="this.onload=null;this.rel='stylesheet'">` +
          `<link rel="stylesheet"${a}href="${href}"${b} media="print" onload="this.media='all'">` +
          `<noscript><link rel="stylesheet"${a}href="${href}"${b}></noscript>`,
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    nonBlockingCssPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
