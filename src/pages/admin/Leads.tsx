import { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getLeads } from "@/lib/get-leads.functions";
import { AdminLayout } from "./AdminLayout";
import { LeadDetailsModal } from "./components/LeadDetailsModal";
import { LeadEditModal } from "./components/LeadEditModal";
import { LeadDeleteDialog } from "./components/LeadDeleteDialog";
import { BulkDeleteDialog } from "./components/BulkDeleteDialog";
import { ColumnFilter, ActiveFilters } from "./components/LeadsTableFilters";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Lead {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telefone: string;
  produto_interesse: string;
  mensagem?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  cidade?: string | null;
  estado?: string | null;
  pais?: string | null;
  ip_address?: string | null;
  total_registrations: number;
}

type FilterColumn = 'utm_campaign' | 'utm_source' | 'utm_medium' | 'utm_content' | 'utm_term';

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<FilterColumn, string[]>>({
    utm_campaign: [],
    utm_source: [],
    utm_medium: [],
    utm_content: [],
    utm_term: [],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads();
      setLeads((data.leads || []) as unknown as Lead[]);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Get unique values for each filter column
  const filterOptions = useMemo(() => {
    const getUniqueValues = (key: keyof Lead) => {
      const values = leads.map(lead => lead[key] as string || '-');
      return [...new Set(values)].sort();
    };

    return {
      utm_campaign: getUniqueValues('utm_campaign'),
      utm_source: getUniqueValues('utm_source'),
      utm_medium: getUniqueValues('utm_medium'),
      utm_content: getUniqueValues('utm_content'),
      utm_term: getUniqueValues('utm_term'),
    };
  }, [leads]);

  // Filter leads based on active filters
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      return Object.entries(filters).every(([column, values]) => {
        if (values.length === 0) return true;
        const leadValue = lead[column as keyof Lead] as string || '-';
        return values.includes(leadValue);
      });
    });
  }, [leads, filters]);

  const handleFilterChange = (column: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [column]: values }));
  };

  const handleClearFilter = (column: string) => {
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      utm_campaign: [],
      utm_source: [],
      utm_medium: [],
      utm_content: [],
      utm_term: [],
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, leadId]);
    } else {
      setSelectedIds(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  const allSelected = filteredLeads.length > 0 && selectedIds.length === filteredLeads.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredLeads.length;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-muted-foreground">Gerencie os leads capturados pelo site</p>
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button 
                onClick={() => setBulkDeleteDialogOpen(true)} 
                variant="destructive" 
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir {selectedIds.length} selecionado(s)
              </Button>
            )}
            <Button onClick={fetchLeads} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        <ActiveFilters 
          filters={filters} 
          onClearFilter={handleClearFilter} 
          onClearAll={handleClearAllFilters} 
        />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                    className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                  />
                </TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Campaign
                    <ColumnFilter
                      column="utm_campaign"
                      options={filterOptions.utm_campaign}
                      selectedValues={filters.utm_campaign}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Source
                    <ColumnFilter
                      column="utm_source"
                      options={filterOptions.utm_source}
                      selectedValues={filters.utm_source}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Medium
                    <ColumnFilter
                      column="utm_medium"
                      options={filterOptions.utm_medium}
                      selectedValues={filters.utm_medium}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Content
                    <ColumnFilter
                      column="utm_content"
                      options={filterOptions.utm_content}
                      selectedValues={filters.utm_content}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Term
                    <ColumnFilter
                      column="utm_term"
                      options={filterOptions.utm_term}
                      selectedValues={filters.utm_term}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    {leads.length === 0 ? 'Nenhum lead encontrado' : 'Nenhum lead corresponde aos filtros'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} data-state={selectedIds.includes(lead.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(lead.id)}
                        onCheckedChange={(checked) => handleSelectLead(lead.id, !!checked)}
                        aria-label={`Selecionar ${lead.nome}`}
                      />
                    </TableCell>
                    <TableCell>{formatDate(lead.created_at)}</TableCell>
                    <TableCell>{formatTime(lead.created_at)}</TableCell>
                    <TableCell className="font-medium">{lead.nome}</TableCell>
                    <TableCell className="text-sm">{lead.utm_campaign || '-'}</TableCell>
                    <TableCell className="text-sm">{lead.utm_source || '-'}</TableCell>
                    <TableCell className="text-sm">{lead.utm_medium || '-'}</TableCell>
                    <TableCell className="text-sm">{lead.utm_content || '-'}</TableCell>
                    <TableCell className="text-sm">{lead.utm_term || '-'}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewLead(lead)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalhes</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditLead(lead)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteLead(lead)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <LeadDetailsModal
        lead={selectedLead}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      <LeadEditModal
        lead={selectedLead}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={fetchLeads}
      />

      <LeadDeleteDialog
        lead={selectedLead}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchLeads}
      />

      <BulkDeleteDialog
        selectedIds={selectedIds}
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onSuccess={fetchLeads}
      />
    </AdminLayout>
  );
};

export default Leads;
