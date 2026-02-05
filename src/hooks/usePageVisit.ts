 import { useEffect, useRef } from "react";
 import { useLocation } from "react-router-dom";
 import { getStoredUTM } from "./useUTM";
 
 const VISITOR_ID_KEY = "lab_acrilicos_visitor_id";
 const SESSION_ID_KEY = "lab_acrilicos_session_id";
 const TRACKED_PAGES_KEY = "lab_acrilicos_tracked_pages";
 
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
 
         // Chamada assíncrona sem await - não bloqueia a UI
         fetch(`${supabaseUrl}/functions/v1/track-visit`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(payload),
         }).then(() => {
           markPageAsTracked(currentPath);
         }).catch((error) => {
           console.error("[PageVisit] Erro ao rastrear visita:", error);
         });
 
       } catch (error) {
         console.error("[PageVisit] Erro ao preparar rastreamento:", error);
       } finally {
         isTracking.current = false;
       }
     };
 
     trackVisit();
   }, [location.pathname]);
 }