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

function getStartOfDaySaoPaulo(date: Date): Date {
  const spDate = getSaoPauloDate(date)
  spDate.setHours(0, 0, 0, 0)
  const utc = spDate.getTime() - SAO_PAULO_OFFSET
  return new Date(utc)
}

function getEndOfDaySaoPaulo(date: Date): Date {
  const spDate = getSaoPauloDate(date)
  spDate.setHours(23, 59, 59, 999)
  const utc = spDate.getTime() - SAO_PAULO_OFFSET
  return new Date(utc)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const url = new URL(req.url)
    const period = url.searchParams.get('period') || 'all'
    const customStartDate = url.searchParams.get('customStartDate')
    const customEndDate = url.searchParams.get('customEndDate')

    const now = new Date()
    const todayStart = getStartOfDaySaoPaulo(now)
    const todayEnd = getEndOfDaySaoPaulo(now)
    
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const yesterdayStart = getStartOfDaySaoPaulo(yesterday)
    const yesterdayEnd = getEndOfDaySaoPaulo(yesterday)
    
    const last7DaysStart = getStartOfDaySaoPaulo(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))

    // Determine filter range for general metrics
    let filterStart: Date
    let filterEnd: Date = todayEnd

    if (period === '7d') {
      filterStart = last7DaysStart
    } else if (period === '30d') {
      filterStart = getStartOfDaySaoPaulo(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000))
    } else {
      filterStart = new Date('2024-01-01T00:00:00Z')
    }

    // Custom date range for leadsByPeriod.custom
    let customStart: Date
    let customEnd: Date
    if (customStartDate && customEndDate) {
      customStart = getStartOfDaySaoPaulo(new Date(customStartDate))
      customEnd = getEndOfDaySaoPaulo(new Date(customEndDate))
    } else {
      customStart = filterStart
      customEnd = filterEnd
    }

    // Run all RPC calls in parallel
    const [
      todayVisits, yesterdayVisits, last7dVisits,
      todayLeads, yesterdayLeads, last7dLeads, customLeads,
      generalMetrics,
      topPages,
      trafficSources,
      leadsByProduct,
      leadsByLocation,
      campaignStats,
      termStats,
      dailyVisits
    ] = await Promise.all([
      // Period stats - visits by category
      supabase.rpc('get_visits_count_by_period', { p_start: todayStart.toISOString(), p_end: todayEnd.toISOString() }),
      supabase.rpc('get_visits_count_by_period', { p_start: yesterdayStart.toISOString(), p_end: yesterdayEnd.toISOString() }),
      supabase.rpc('get_visits_count_by_period', { p_start: last7DaysStart.toISOString(), p_end: todayEnd.toISOString() }),
      // Leads by period
      supabase.rpc('get_leads_count_by_period', { p_start: todayStart.toISOString(), p_end: todayEnd.toISOString() }),
      supabase.rpc('get_leads_count_by_period', { p_start: yesterdayStart.toISOString(), p_end: yesterdayEnd.toISOString() }),
      supabase.rpc('get_leads_count_by_period', { p_start: last7DaysStart.toISOString(), p_end: todayEnd.toISOString() }),
      supabase.rpc('get_leads_count_by_period', { p_start: customStart.toISOString(), p_end: customEnd.toISOString() }),
      // General metrics
      supabase.rpc('get_general_metrics', { p_start: filterStart.toISOString(), p_end: filterEnd.toISOString() }),
      // Top pages
      supabase.rpc('get_top_pages', { p_start: filterStart.toISOString(), p_end: filterEnd.toISOString(), p_limit: 5 }),
      // Traffic sources
      supabase.rpc('get_traffic_sources', { p_start: filterStart.toISOString(), p_end: filterEnd.toISOString() }),
      // Leads by product
      supabase.rpc('get_leads_by_product', { p_start: filterStart.toISOString(), p_end: filterEnd.toISOString() }),
      // Leads by location
      supabase.rpc('get_leads_by_location', { p_start: filterStart.toISOString(), p_end: filterEnd.toISOString(), p_limit: 5 }),
      // Campaign stats
      supabase.rpc('get_campaign_stats', { p_start: filterStart.toISOString(), p_end: filterEnd.toISOString() }),
      // Term stats
      supabase.rpc('get_term_stats', { p_start: filterStart.toISOString(), p_end: filterEnd.toISOString() }),
      // Daily visits for chart (last 7 days)
      supabase.rpc('get_daily_visits', { p_start: last7DaysStart.toISOString(), p_end: todayEnd.toISOString() }),
    ])

    // Helper to extract single row from RPC result
    const row = (res: any) => Array.isArray(res.data) ? res.data[0] : res.data
    const rows = (res: any) => res.data || []

    // Build period stats
    const buildPeriodMetrics = (visitsRes: any) => {
      const v = row(visitsRes) || { produtos_visits: 0, chapas_visits: 0, produtos_leads: 0, chapas_leads: 0 }
      const pv = Number(v.produtos_visits) || 0
      const cv = Number(v.chapas_visits) || 0
      const pl = Number(v.produtos_leads) || 0
      const cl = Number(v.chapas_leads) || 0
      return {
        produtos: {
          visits: pv,
          leads: pl,
          conversionRate: pv > 0 ? ((pl / pv) * 100).toFixed(2) : '0.00'
        },
        chapas: {
          visits: cv,
          leads: cl,
          conversionRate: cv > 0 ? ((cl / cv) * 100).toFixed(2) : '0.00'
        }
      }
    }

    const periodStats = {
      today: buildPeriodMetrics(todayVisits),
      yesterday: buildPeriodMetrics(yesterdayVisits),
      last7days: buildPeriodMetrics(last7dVisits)
    }

    const buildLeadsPeriod = (res: any) => {
      const r = row(res) || { produtos: 0, chapas: 0, total: 0 }
      return { produtos: Number(r.produtos) || 0, chapas: Number(r.chapas) || 0, total: Number(r.total) || 0 }
    }

    const leadsByPeriod = {
      today: buildLeadsPeriod(todayLeads),
      yesterday: buildLeadsPeriod(yesterdayLeads),
      last7days: buildLeadsPeriod(last7dLeads),
      custom: buildLeadsPeriod(customLeads)
    }

    // General metrics
    const gm = row(generalMetrics) || { total_visits: 0, total_leads: 0, unique_visitors: 0, unique_sessions: 0 }
    const totalVisits = Number(gm.total_visits) || 0
    const totalLeads = Number(gm.total_leads) || 0
    const uniqueVisitors = Number(gm.unique_visitors) || 0
    const uniqueSessions = Number(gm.unique_sessions) || 0
    const conversionRate = uniqueVisitors > 0 ? ((totalLeads / uniqueVisitors) * 100).toFixed(2) : '0.00'

    // Top pages
    const topPagesData = rows(topPages).map((p: any) => ({ path: p.page_path, count: Number(p.visit_count) }))

    // Traffic sources
    const trafficSourcesData = rows(trafficSources).map((s: any) => ({ source: s.source, count: Number(s.lead_count) }))

    // Leads by product
    const leadsByProductData = rows(leadsByProduct).map((p: any) => ({ product: p.product, count: Number(p.lead_count) }))

    // Leads by location
    const leadsByLocationData = rows(leadsByLocation).map((l: any) => ({ location: l.location, count: Number(l.lead_count) }))

    // Campaign stats
    const campaignStatsData = rows(campaignStats).map((c: any) => ({
      campaign: c.campaign,
      visits: Number(c.visits),
      leads: Number(c.leads),
      conversionRate: String(c.conversion_rate)
    }))

    // Term stats
    const termStatsData = rows(termStats).map((t: any) => ({
      term: t.term,
      campaign: t.campaign,
      visits: Number(t.visits),
      leads: Number(t.leads),
      conversionRate: String(t.conversion_rate)
    }))

    // Chart data - fill in missing days
    const nowSP = getSaoPauloDate()
    const chartMap: Record<string, number> = {}
    const last7Days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(nowSP.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = d.toISOString().split('T')[0]
      last7Days.push(dateStr)
      chartMap[dateStr] = 0
    }
    rows(dailyVisits).forEach((dv: any) => {
      const dateStr = String(dv.visit_date)
      if (chartMap[dateStr] !== undefined) {
        chartMap[dateStr] = Number(dv.visit_count)
      }
    })
    const chartData = last7Days.map(date => ({ date, visits: chartMap[date] }))

    return new Response(
      JSON.stringify({
        periodStats,
        leadsByPeriod,
        totalVisits,
        totalLeads,
        uniqueVisitors,
        uniqueSessions,
        conversionRate,
        topPages: topPagesData,
        trafficSources: trafficSourcesData,
        leadsByProduct: leadsByProductData,
        leadsByLocation: leadsByLocationData,
        chartData,
        campaignStats: campaignStatsData,
        termStats: termStatsData
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
