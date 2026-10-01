import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Layout } from "@/components/layout/Layout";
import { WhatsAppModalProvider } from "@/contexts/WhatsAppModalContext";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";

import appCss from "../styles.css?url";

// ported from main.tsx — captura UTMs imediatamente, antes do React inicializar
import "@/hooks/useUTM";

// ported from main.tsx — cache-busting / stale-build recovery.
// Quando publicamos uma nova versão, navegadores podem ficar presos no HTML
// antigo (que referencia chunks JS que não existem mais). Detectamos esse
// cenário e forçamos um reload limpo, com cache-buster na URL.
if (typeof window !== "undefined") {
  const RELOAD_FLAG = "okp-stale-reload";
  const RELOAD_PARAM = "v";

  const forceFreshReload = () => {
    try {
      const last = Number(sessionStorage.getItem(RELOAD_FLAG) || "0");
      // Evita loop: só recarrega se não recarregamos nos últimos 30s
      if (Date.now() - last < 30_000) return;
      sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
    } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set(RELOAD_PARAM, String(Date.now()));
    window.location.replace(url.toString());
  };

  const isStaleChunkError = (msg: string | undefined) => {
    if (!msg) return false;
    return (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Importing a module script failed") ||
      msg.includes("error loading dynamically imported module") ||
      msg.includes("Unable to preload CSS")
    );
  };

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
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {}
    }, 5000);
  });

  // ported from main.tsx — reenvia leads que ficaram na fila por queda do backend
  import("@/lib/leadCapture").then(({ flushLeadQueue }) => {
    setTimeout(() => flushLeadQueue(), 2000);
  });
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "OK Plast | Distribuidora de Chapas Plásticas no RJ" },
      {
        name: "description",
        content:
          "Distribuidora de chapas plásticas no RJ: acrílico, policarbonato, PETG, PS, PVC e ACM. Corte sob medida e entrega rápida.",
      },
      { name: "theme-color", content: "#1a3a5c" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "OK Plast" },
      { property: "og:title", content: "OK Plast | Distribuidora de Chapas Plásticas no RJ" },
      {
        property: "og:description",
        content:
          "Distribuidora de chapas plásticas no RJ: acrílico, policarbonato, PETG, PS, PVC e ACM. Corte sob medida.",
      },
      { property: "og:url", content: "https://okplast.com.br/" },
      { property: "og:image", content: "https://okplast.com.br/og-image.jpg" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "OK Plast | Distribuidora de Chapas Plásticas no RJ" },
      {
        name: "twitter:description",
        content:
          "Distribuidora de chapas plásticas no RJ: acrílico, policarbonato, PETG, PS, PVC e ACM. Corte sob medida.",
      },
      { name: "twitter:image", content: "https://okplast.com.br/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "canonical", href: "https://okplast.com.br/" },
      { rel: "dns-prefetch", href: "https://osfxdoxfiyyqcpahuwci.supabase.co" },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/montserrat-latin.woff2",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      // Google tag (gtag.js) - Google Ads AW-875161011
      { src: "https://www.googletagmanager.com/gtag/js?id=AW-875161011", async: true },
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-875161011');`,
      },
      // Event snippet for Orçamento OKPLAST - Valendo conversion page
      {
        children: `function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      'send_to': 'AW-875161011/K1WFCJzgtdQcELPLp6ED',
      'transport_type': 'beacon',
      'event_callback': callback
    });
  } else {
    // Fallback: pixel síncrono caso gtag.js ainda não tenha carregado
    try {
      var img = new Image();
      img.src = 'https://www.googleadservices.com/pagead/conversion/875161011/?label=K1WFCJzgtdQcELPLp6ED&guid=ON&script=0';
    } catch (e) {}
  }
  return false;
}`,
      },
      // Canonical dinâmico por rota (portado do index.html)
      {
        children: `(function () {
  var allowed = [
    "/",
    "/chapas",
    "/chapas/acrilico",
    "/chapas/poliestireno",
    "/chapas/petg",
    "/chapas/policarbonato",
    "/chapas/policarbonato-alveolar",
    "/chapas/policarbonato-compacto",
    "/chapas/pvc-expandido",
    "/chapas/acm",
    "/home/sobre-nos",
    "/home/politica-de-venda",
    "/home/termo-de-uso",
    "/home/politica-de-privacidade"
  ];
  var path = window.location.pathname.replace(/\\/+$/, "") || "/";
  var canonicalPath = allowed.indexOf(path) >= 0 ? path : "/";
  var url = "https://okplast.com.br" + (canonicalPath === "/" ? "/" : canonicalPath);
  var canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", url);
  var ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", url);
})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function NotFoundComponent() {
  return (
    <WhatsAppModalProvider>
      <Layout>
        <NotFound />
      </Layout>
    </WhatsAppModalProvider>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  console.error(error);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-xs">
        <h1 className="mb-2 text-xl font-bold text-foreground">This page didn't load</h1>
        <p className="mb-6 text-muted-foreground">
          Something went wrong on our end. You can try again or head back home.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border bg-background px-4 py-2 text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
