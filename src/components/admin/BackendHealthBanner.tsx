import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getQueuedLeadCount } from "@/lib/leadCapture";

interface HealthStatus {
  healthy: boolean;
  last_visit_minutes: number | null;
  last_lead_minutes: number | null;
}

function formatAge(minutes: number | null) {
  if (minutes === null) return "nunca";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)} dia(s)`;
}

export function BackendHealthBanner() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [unreachable, setUnreachable] = useState(false);
  const queued = getQueuedLeadCount();

  const check = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("health-monitor");
      if (error) throw error;
      setStatus(data as HealthStatus);
      setUnreachable(false);
    } catch {
      setStatus(null);
      setUnreachable(true);
    }
  };

  useEffect(() => {
    check();
    const id = window.setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const problem = unreachable || (status && !status.healthy) || queued > 0;
  if (!problem) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 space-y-1">
        <p className="font-semibold">
          {unreachable
            ? "Backend inacessível — leads e visitas não estão sendo gravados"
            : "Captação de dados possivelmente interrompida"}
        </p>
        {status && (
          <p className="opacity-90">
            Última visita registrada: {formatAge(status.last_visit_minutes)} atrás · Último lead:{" "}
            {formatAge(status.last_lead_minutes)} atrás
          </p>
        )}
        {queued > 0 && (
          <p className="opacity-90">{queued} lead(s) aguardando reenvio neste navegador.</p>
        )}
      </div>
      <button
        onClick={check}
        className="flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs hover:bg-destructive/20"
      >
        <RefreshCw className="h-3 w-3" /> Verificar
      </button>
    </div>
  );
}