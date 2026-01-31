import { useEffect, useState } from "react";

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

const UTM_STORAGE_KEY = "lab_acrilicos_utm";

export function useUTM() {
  const [utmParams, setUtmParams] = useState<UTMParams>({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  });

  useEffect(() => {
    // Tenta carregar do localStorage primeiro
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      try {
        setUtmParams(JSON.parse(stored));
      } catch {
        // Ignora erro de parse
      }
    }

    // Captura UTMs da URL atual
    const params = new URLSearchParams(window.location.search);
    const newUtm: UTMParams = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_term: params.get("utm_term"),
      utm_content: params.get("utm_content"),
    };

    // Se tem algum UTM na URL, salva no localStorage
    const hasUtm = Object.values(newUtm).some((v) => v !== null);
    if (hasUtm) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newUtm));
      setUtmParams(newUtm);
    }
  }, []);

  return utmParams;
}

export function getStoredUTM(): UTMParams {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignora erro
  }
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  };
}
