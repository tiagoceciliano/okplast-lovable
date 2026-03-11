import { useEffect, useState } from "react";

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const UTM_STORAGE_KEY = "okplast_utm";

// Captura UTMs imediatamente no carregamento do módulo (antes de qualquer redirect)
function captureUTMsFromUrl(): UTMParams {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_term: params.get("utm_term"),
      utm_content: params.get("utm_content"),
    };
  } catch {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
    };
  }
}

// Debug: Log URL no momento do carregamento
console.log("[UTM] Módulo carregado. URL:", window.location.href);
console.log("[UTM] Search params:", window.location.search);

// Captura imediata no carregamento do módulo
const initialUrlUtms = captureUTMsFromUrl();
console.log("[UTM] Resultado da captura:", initialUrlUtms);
const hasInitialUtms = Object.values(initialUrlUtms).some((v) => v !== null);

// Salva imediatamente se tiver UTMs na URL
if (hasInitialUtms && typeof localStorage !== "undefined") {
  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(initialUrlUtms));
    console.log("[UTM] Capturados da URL:", initialUrlUtms);
  } catch {
    // Ignora erro de localStorage
  }
}

export function useUTM() {
  const [utmParams, setUtmParams] = useState<UTMParams>(() => {
    // Prioriza UTMs da URL capturados no carregamento
    if (hasInitialUtms) {
      return initialUrlUtms;
    }
    // Fallback para localStorage
    return getStoredUTM();
  });

  useEffect(() => {
    // Se já capturamos da URL, não precisa fazer nada
    if (hasInitialUtms) {
      return;
    }

    // Tenta carregar do localStorage
    const stored = getStoredUTM();
    const hasStored = Object.values(stored).some((v) => v !== null);
    if (hasStored) {
      setUtmParams(stored);
    }
  }, []);

  return utmParams;
}

export function getStoredUTM(): UTMParams {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("[UTM] Lido do localStorage:", parsed);
      return parsed;
    }
  } catch {
    // Ignora erro
  }
  console.log("[UTM] Nenhum UTM encontrado no localStorage");
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  };
}
