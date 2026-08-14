import { createRoot } from "react-dom/client";

// Captura UTMs imediatamente, antes do React inicializar
import "@/hooks/useUTM";

import App from "./App.tsx";
import "./index.css";

// ----- Cache-busting / stale-build recovery -----
// Quando publicamos uma nova versão, navegadores podem ficar presos no HTML
// antigo (que referencia chunks JS que não existem mais). Aqui detectamos
// esse cenário e forçamos um reload limpo, com cache-buster na URL.
const RELOAD_FLAG = "okp-stale-reload";
const RELOAD_PARAM = "v";

function forceFreshReload() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_FLAG) || "0");
    // Evita loop: só recarrega se não recarregamos nos últimos 30s
    if (Date.now() - last < 30_000) return;
    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
  } catch {}
  const url = new URL(window.location.href);
  url.searchParams.set(RELOAD_PARAM, String(Date.now()));
  window.location.replace(url.toString());
}

function isStaleChunkError(msg: string | undefined) {
  if (!msg) return false;
  return (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("Unable to preload CSS")
  );
}

window.addEventListener("error", (e) => {
  if (isStaleChunkError(e.message)) forceFreshReload();
});

window.addEventListener("unhandledrejection", (e) => {
  const msg = (e.reason && (e.reason.message || String(e.reason))) || "";
  if (isStaleChunkError(msg)) forceFreshReload();
});

// Limpa flag antiga após carga bem-sucedida
window.addEventListener("load", () => {
  setTimeout(() => {
    try { sessionStorage.removeItem(RELOAD_FLAG); } catch {}
  }, 5000);
});

createRoot(document.getElementById("root")!).render(<App />);

// Reenvia leads que ficaram na fila por queda do backend
import("@/lib/leadCapture").then(({ flushLeadQueue }) => {
  setTimeout(() => flushLeadQueue(), 2000);
});
