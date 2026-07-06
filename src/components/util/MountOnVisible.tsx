import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Distância antes do viewport para pré-montar (ex.: "600px"). */
  rootMargin?: string;
  /** Tempo máximo em ms para montar mesmo sem entrar em viewport (fallback SEO). */
  idleTimeoutMs?: number;
}

/**
 * Só monta os filhos quando o placeholder entra (perto do) viewport ou
 * após um timeout de idle. Serve para tirar seções abaixo da dobra da
 * cadeia crítica de carregamento (LCP/SI/TBT).
 */
export function MountOnVisible({
  children,
  fallback = null,
  rootMargin = "600px",
  idleTimeoutMs = 8000,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    let timer: number | null = null;

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setVisible(true);
            io.disconnect();
            if (timer) clearTimeout(timer);
          }
        },
        { rootMargin },
      );
      io.observe(el);
      timer = window.setTimeout(() => {
        setVisible(true);
        io.disconnect();
      }, idleTimeoutMs);
      return () => {
        io.disconnect();
        if (timer) clearTimeout(timer);
      };
    }

    // Sem IO: monta após timeout curto
    timer = window.setTimeout(() => setVisible(true), 1500);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, rootMargin, idleTimeoutMs]);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}