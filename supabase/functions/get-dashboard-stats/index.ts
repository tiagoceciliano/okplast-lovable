import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// São Paulo timezone offset (UTC-3)
const SAO_PAULO_OFFSET = -3 * 60 * 60 * 1000

function getSaoPauloDate(date: Date = new Date()): Date {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
  return new Date(utc + SAO_PAULO_OFFSET)
}

function formatDateSaoPaulo(date: Date): string {
  const spDate = getSaoPauloDate(date)
  return spDate.toISOString().split('T')[0]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse query params for date filtering
    const url = new URL(req.url)
    const period = url.searchParams.get('period') || 'all' // '7d', '30d', 'all'
    
    let dateFilter = null
    const nowSP = getSaoPauloDate()
    if (period === '7d') {
      dateFilter = new Date(nowSP.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    } else if (period === '30d') {
      dateFilter = new Date(nowSP.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    // Fetch all page visits
    let visitsQuery = supabase.from('page_visits').select('*')
    if (dateFilter) {
      visitsQuery = visitsQuery.gte('created_at', dateFilter)
    }
    const { data: visits, error: visitsError } = await visitsQuery

    if (visitsError) throw visitsError

    // Fetch all leads
    let leadsQuery = supabase.from('leads').select('*')
    if (dateFilter) {
      leadsQuery = leadsQuery.gte('created_at', dateFilter)
    }
    const { data: leads, error: leadsError } = await leadsQuery

    if (leadsError) throw leadsError

    // Calculate metrics
    const totalVisits = visits?.length || 0
    const totalLeads = leads?.length || 0
    const uniqueVisitors = new Set(visits?.map(v => v.visitor_id) || []).size
    const uniqueSessions = new Set(visits?.map(v => v.session_id) || []).size
    const conversionRate = uniqueVisitors > 0 ? ((totalLeads / uniqueVisitors) * 100).toFixed(2) : '0.00'

    // Top 5 pages by visits
    const pageVisitCounts: Record<string, number> = {}
    visits?.forEach(v => {
      pageVisitCounts[v.page_path] = (pageVisitCounts[v.page_path] || 0) + 1
    })
    const topPages = Object.entries(pageVisitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }))

    // Traffic sources - baseado em leads ativos (não em visitas)
    const sourceLeadCounts: Record<string, number> = {}
    leads?.forEach(l => {
      const source = l.utm_source || 'Direto'
      sourceLeadCounts[source] = (sourceLeadCounts[source] || 0) + 1
    })
    const trafficSources = Object.entries(sourceLeadCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([source, count]) => ({ source, count }))

    // Leads by product
    const productCounts: Record<string, number> = {}
    leads?.forEach(l => {
      productCounts[l.produto_interesse] = (productCounts[l.produto_interesse] || 0) + 1
    })
    const leadsByProduct = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([product, count]) => ({ product, count }))

    // Leads by location
    const locationCounts: Record<string, number> = {}
    leads?.forEach(l => {
      const location = l.cidade && l.estado ? `${l.cidade}, ${l.estado}` : (l.estado || 'Desconhecido')
      locationCounts[location] = (locationCounts[location] || 0) + 1
    })
    const leadsByLocation = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }))

    // Campaign Stats - baseado apenas em campanhas que têm leads
    // Primeiro, coletamos as campanhas que têm leads ativos
    const campaignLeadCounts: Record<string, number> = {}
    leads?.forEach(l => {
      const campaign = l.utm_campaign || '(Direto)'
      campaignLeadCounts[campaign] = (campaignLeadCounts[campaign] || 0) + 1
    })

    // Agora contamos visitantes únicos apenas para campanhas que têm leads
    const campaignVisitors: Record<string, Set<string>> = {}
    visits?.forEach(v => {
      const campaign = v.utm_campaign || '(Direto)'
      // Só contabiliza se essa campanha tem pelo menos 1 lead
      if (campaignLeadCounts[campaign] !== undefined) {
        if (!campaignVisitors[campaign]) {
          campaignVisitors[campaign] = new Set()
        }
        campaignVisitors[campaign].add(v.visitor_id)
      }
    })

    const campaignStats = Object.keys(campaignLeadCounts)
      .map(campaign => {
        const uniqueVisits = campaignVisitors[campaign]?.size || 0
        const leadCount = campaignLeadCounts[campaign] || 0
        const rate = uniqueVisits > 0 
          ? ((leadCount / uniqueVisits) * 100).toFixed(2) 
          : '0.00'
        return {
          campaign,
          visits: uniqueVisits,
          leads: leadCount,
          conversionRate: rate
        }
      })
      .sort((a, b) => b.leads - a.leads)

    // Term Stats - baseado apenas em termos que têm leads
    const termLeadCounts: Record<string, { count: number; campaign: string }> = {}
    leads?.forEach(l => {
      const term = l.utm_term || '(Sem termo)'
      const campaign = l.utm_campaign || '(Direto)'
      const key = `${term}|${campaign}`
      
      if (!termLeadCounts[key]) {
        termLeadCounts[key] = { count: 0, campaign }
      }
      termLeadCounts[key].count++
    })

    // Contamos visitantes apenas para termos que têm leads
    const termVisitors: Record<string, { visitors: Set<string>; campaign: string }> = {}
    visits?.forEach(v => {
      const term = v.utm_term || '(Sem termo)'
      const campaign = v.utm_campaign || '(Direto)'
      const key = `${term}|${campaign}`
      
      // Só contabiliza se esse termo tem pelo menos 1 lead
      if (termLeadCounts[key] !== undefined) {
        if (!termVisitors[key]) {
          termVisitors[key] = { visitors: new Set(), campaign }
        }
        termVisitors[key].visitors.add(v.visitor_id)
      }
    })

    const termStats = Object.entries(termLeadCounts)
      .map(([key, { count, campaign }]) => {
        const [term] = key.split('|')
        const uniqueVisits = termVisitors[key]?.visitors.size || 0
        const rate = uniqueVisits > 0 
          ? ((count / uniqueVisits) * 100).toFixed(2) 
          : '0.00'
        return {
          term,
          campaign,
          visits: uniqueVisits,
          leads: count,
          conversionRate: rate
        }
      })
      .sort((a, b) => b.leads - a.leads)

    // Visits over time (last 7 days for chart) - São Paulo timezone
    const visitsOverTime: Record<string, number> = {}
    const last7Days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(nowSP.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = formatDateSaoPaulo(date)
      last7Days.push(dateStr)
      visitsOverTime[dateStr] = 0
    }
    visits?.forEach(v => {
      // Convert visit timestamp to São Paulo timezone
      const visitDate = new Date(v.created_at)
      const dateStr = formatDateSaoPaulo(visitDate)
      if (visitsOverTime[dateStr] !== undefined) {
        visitsOverTime[dateStr]++
      }
    })
    const chartData = last7Days.map(date => ({
      date,
      visits: visitsOverTime[date]
    }))

    return new Response(
      JSON.stringify({
        totalVisits,
        totalLeads,
        uniqueVisitors,
        uniqueSessions,
        conversionRate,
        topPages,
        trafficSources,
        leadsByProduct,
        leadsByLocation,
        chartData,
        campaignStats,
        termStats
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Dashboard stats error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
