import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Lead {
  id: string;
  nome: string;
  email: string;
}

interface LeadDeleteDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LeadDeleteDialog({ lead, open, onOpenChange, onSuccess }: LeadDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!lead) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('manage-lead', {
        body: {
          action: 'delete',
          leadId: lead.id,
        },
      });

      if (error) throw error;

      toast.success("Lead excluído com sucesso!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error("Erro ao excluir lead");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!lead) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Lead</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o lead <strong>{lead.nome}</strong> ({lead.email})?
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
