import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Canal único de presença: quem está com o painel aberto aparece como online. */
let channel: ReturnType<typeof supabase.channel> | null = null;
let online = new Set<string>();
const listeners = new Set<(s: Set<string>) => void>();

function ensureChannel() {
  if (channel) return;
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session || channel) return;
    channel = supabase.channel("admin-online", { config: { presence: { key: session.user.id } } });
    channel
      .on("presence", { event: "sync" }, () => {
        online = new Set(Object.keys(channel!.presenceState()));
        listeners.forEach((l) => l(online));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") channel!.track({ at: new Date().toISOString() });
      });
  });
}

export function usePresence() {
  const [ids, setIds] = useState<Set<string>>(online);
  useEffect(() => {
    ensureChannel();
    listeners.add(setIds);
    return () => { listeners.delete(setIds); };
  }, []);
  return ids;
}
