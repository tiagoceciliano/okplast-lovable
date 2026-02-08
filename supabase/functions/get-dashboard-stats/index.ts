import { createClient } from 'npm:@supabase/supabase-js@2'

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

function getStartOfDaySaoPaulo(date: Date): Date {
  const spDate = getSaoPauloDate(date)
  spDate.setHours(0, 0, 0, 0)
  // Convert back to UTC for database comparison
  const utc = spDate.getTime() - SAO_PAULO_OFFSET
  return new Date(utc)
}

function getEndOfDaySaoPaulo(date: Date): Date {
  const spDate = getSaoPauloDate(date)
  spDate.setHours(23, 59, 59, 999)
  // Convert back to UTC for database comparison
  const utc = spDate.getTime() - SAO_PAULO_OFFSET
  return new Date(utc)
}

interface CategoryMetrics {
  visits: number
  leads: number
  conversionRate: string
}

interface PeriodMetrics {
  produtos: CategoryMetrics
  chapas: CategoryMetrics
}

interface PeriodStats {
  today: PeriodMetrics
  yesterday: PeriodMetrics
  last7days: PeriodMetrics
}

function isChapasPage(pagePath: string): boolean {
  return pagePath.startsWith('/chapas')
}

function isChapasLead(produtoInteresse: string): boolean {
  return produtoInteresse === 'Chapa Inteira ou Cortada'
}

function calculateCategoryMetrics(
  visits: any[],
  leads: any[],
  startDate: Date,
  endDate: Date
): PeriodMetrics {
  const startISO = startDate.toISOString()
  const endISO = endDate.toISOString()

  // Filter visits and leads for the period
  const periodVisits = visits.filter(v => 
    v.created_at >= startISO && v.created_at <= endISO
  )
  const periodLeads = leads.filter(l => 
    l.created_at >= startISO && l.created_at <= endISO
  )

  // Separate by category
  const chapasVisits = periodVisits.filter(v => isChapasPage(v.page_path))
  const produtosVisits = periodVisits.filter(v => !isChapasPage(v.page_path) && !v.page_path.startsWith('/admin'))
  
  const chapasLeads = periodLeads.filter(l => isChapasLead(l.produto_interesse))
  const produtosLeads = periodLeads.filter(l => !isChapasLead(l.produto_interesse))

  // Count unique visitors for each category
  const chapasUniqueVisitors = new Set(chapasVisits.map(v => v.visitor_id)).size
  const produtosUniqueVisitors = new Set(produtosVisits.map(v => v.visitor_id)).size

  // Calculate conversion rates
  const chapasConversion = chapasUniqueVisitors > 0 
    ? ((chapasLeads.length / chapasUniqueVisitors) * 100).toFixed(2) 
    : '0.00'
  const produtosConversion = produtosUniqueVisitors > 0 
    ? ((produtosLeads.length / produtosUniqueVisitors) * 100).toFixed(2) 
    : '0.00'

  return {
    produtos: {
      visits: produtosUniqueVisitors,
      leads: produtosLeads.length,
      conversionRate: produtosConversion
    },
    chapas: {
      visits: chapasUniqueVisitors,
      leads: chapasLeads.length,
      conversionRate: chapasConversion
    }
  }
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

    // Fetch all page visits (we need all for periodStats calculation)
    const { data: visits, error: visitsError } = await supabase
      .from('page_visits')
      .select('*')

    if (visitsError) throw visitsError

    // Fetch all leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')

    if (leadsError) throw leadsError

    // Calculate period stats for the new table
    const now = new Date()
    const todayStart = getStartOfDaySaoPaulo(now)
    const todayEnd = getEndOfDaySaoPaulo(now)
    
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const yesterdayStart = getStartOfDaySaoPaulo(yesterday)
    const yesterdayEnd = getEndOfDaySaoPaulo(yesterday)
    
    const last7DaysStart = getStartOfDaySaoPaulo(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))

    const periodStats: PeriodStats = {
      today: calculateCategoryMetrics(visits || [], leads || [], todayStart, todayEnd),
      yesterday: calculateCategoryMetrics(visits || [], leads || [], yesterdayStart, yesterdayEnd),
      last7days: calculateCategoryMetrics(visits || [], leads || [], last7DaysStart, todayEnd)
    }

    // Filter data for other metrics based on period param
    const filteredVisits = dateFilter 
      ? visits?.filter(v => v.created_at >= dateFilter) || []
      : visits || []
    const filteredLeads = dateFilter
      ? leads?.filter(l => l.created_at >= dateFilter) || []
      : leads || []

    // Calculate general metrics
    const totalVisits = filteredVisits.length
    const totalLeads = filteredLeads.length
    const uniqueVisitors = new Set(filteredVisits.map(v => v.visitor_id)).size
    const uniqueSessions = new Set(filteredVisits.map(v => v.session_id)).size
    const conversionRate = uniqueVisitors > 0 ? ((totalLeads / uniqueVisitors) * 100).toFixed(2) : '0.00'

    // Top 5 pages by visits
    const pageVisitCounts: Record<string, number> = {}
    filteredVisits.forEach(v => {
      pageVisitCounts[v.page_path] = (pageVisitCounts[v.page_path] || 0) + 1
    })
    const topPages = Object.entries(pageVisitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }))

    // Traffic sources - baseado em leads ativos (não em visitas)
    const sourceLeadCounts: Record<string, number> = {}
    filteredLeads.forEach(l => {
      const source = l.utm_source || 'Direto'
      sourceLeadCounts[source] = (sourceLeadCounts[source] || 0) + 1
    })
    const trafficSources = Object.entries(sourceLeadCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([source, count]) => ({ source, count }))

    // Leads by product
    const productCounts: Record<string, number> = {}
    filteredLeads.forEach(l => {
      productCounts[l.produto_interesse] = (productCounts[l.produto_interesse] || 0) + 1
    })
    const leadsByProduct = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([product, count]) => ({ product, count }))

    // Leads by location
    const locationCounts: Record<string, number> = {}
    filteredLeads.forEach(l => {
      const location = l.cidade && l.estado ? `${l.cidade}, ${l.estado}` : (l.estado || 'Desconhecido')
      locationCounts[location] = (locationCounts[location] || 0) + 1
    })
    const leadsByLocation = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }))

    // Campaign Stats - baseado apenas em campanhas que têm leads
    const campaignLeadCounts: Record<string, number> = {}
    filteredLeads.forEach(l => {
      const campaign = l.utm_campaign || '(Direto)'
      campaignLeadCounts[campaign] = (campaignLeadCounts[campaign] || 0) + 1
    })

    const campaignVisitors: Record<string, Set<string>> = {}
    filteredVisits.forEach(v => {
      const campaign = v.utm_campaign || '(Direto)'
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
    filteredLeads.forEach(l => {
      const term = l.utm_term || '(Sem termo)'
      const campaign = l.utm_campaign || '(Direto)'
      const key = `${term}|${campaign}`
      
      if (!termLeadCounts[key]) {
        termLeadCounts[key] = { count: 0, campaign }
      }
      termLeadCounts[key].count++
    })

    const termVisitors: Record<string, { visitors: Set<string>; campaign: string }> = {}
    filteredVisits.forEach(v => {
      const term = v.utm_term || '(Sem termo)'
      const campaign = v.utm_campaign || '(Direto)'
      const key = `${term}|${campaign}`
      
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
    filteredVisits.forEach(v => {
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
        periodStats,
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
