 import { useEffect, useRef } from "react";
 import { useLocation } from "react-router-dom";
 import { getStoredUTM } from "./useUTM";
 
const VISITOR_ID_KEY = "okplast_visitor_id";
const SESSION_ID_KEY = "okplast_session_id";
const TRACKED_PAGES_KEY = "okplast_tracked_pages";
 
 function generateId(): string {
   return crypto.randomUUID ? crypto.randomUUID() : 
     `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
 }
 
 function getVisitorId(): string {
   let visitorId = localStorage.getItem(VISITOR_ID_KEY);
   if (!visitorId) {
     visitorId = generateId();
     localStorage.setItem(VISITOR_ID_KEY, visitorId);
   }
   return visitorId;
 }
 
 function getSessionId(): string {
   let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
   if (!sessionId) {
     sessionId = generateId();
     sessionStorage.setItem(SESSION_ID_KEY, sessionId);
   }
   return sessionId;
 }
 
 function getTrackedPages(): Set<string> {
   try {
     const stored = sessionStorage.getItem(TRACKED_PAGES_KEY);
     return stored ? new Set(JSON.parse(stored)) : new Set();
   } catch {
     return new Set();
   }
 }
 
 function markPageAsTracked(path: string): void {
   const tracked = getTrackedPages();
   tracked.add(path);
   sessionStorage.setItem(TRACKED_PAGES_KEY, JSON.stringify([...tracked]));
 }
 
 function isPageTracked(path: string): boolean {
   return getTrackedPages().has(path);
 }
 
 export function usePageVisit() {
   const location = useLocation();
   const isTracking = useRef(false);
 
   useEffect(() => {
     const currentPath = location.pathname;
 
     // Evita rastrear a mesma página mais de uma vez por sessão
     if (isPageTracked(currentPath) || isTracking.current) {
       return;
     }
 
     isTracking.current = true;
 
      const trackVisit = async () => {
       try {
         const visitorId = getVisitorId();
         const sessionId = getSessionId();
         const utmParams = getStoredUTM();
 
         const payload = {
           visitor_id: visitorId,
           session_id: sessionId,
           page_url: window.location.href,
           page_path: currentPath,
           referrer: document.referrer || null,
           utm_source: utmParams.utm_source,
           utm_medium: utmParams.utm_medium,
           utm_campaign: utmParams.utm_campaign,
           utm_term: utmParams.utm_term,
           utm_content: utmParams.utm_content,
           user_agent: navigator.userAgent,
         };
 
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const url = `${supabaseUrl}/functions/v1/track-visit`;
          const body = JSON.stringify(payload);

          // Nota: sendBeacon com Blob type=application/json é bloqueado pelo
          // CORS do navegador (não emite preflight). Usamos fetch keepalive,
          // que suporta Content-Type application/json e permanece ativo mesmo
          // se o usuário sair da página.
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          })
            .then(() => markPageAsTracked(currentPath))
            .catch((error) => console.error("[PageVisit] Erro ao rastrear visita:", error));
 
       } catch (error) {
         console.error("[PageVisit] Erro ao preparar rastreamento:", error);
       } finally {
         isTracking.current = false;
       }
     };
 
        // Adia o tracking para depois de load + 1.5s (tira da cadeia crítica sem perder visitas curtas).
       let handle: number | null = null;
       const kick = () => {
         const ric: any = (window as any).requestIdleCallback;
         handle = ric
            ? ric(() => trackVisit(), { timeout: 2000 })
            : window.setTimeout(() => trackVisit(), 800);
       };
       let loadTimer: number | null = null;
       if (document.readyState === "complete") {
          loadTimer = window.setTimeout(kick, 1500);
       } else {
          const onLoad = () => { loadTimer = window.setTimeout(kick, 1500); };
         window.addEventListener("load", onLoad, { once: true });
       }
       return () => {
         if (loadTimer != null) clearTimeout(loadTimer);
         if (handle != null) {
           const cic: any = (window as any).cancelIdleCallback;
           if (cic) cic(handle); else clearTimeout(handle);
         }
       };
   }, [location.pathname]);
 }