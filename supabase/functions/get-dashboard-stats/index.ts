import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const startDateParam = url.searchParams.get('startDate')
    const endDateParam = url.searchParams.get('endDate')
    const compareStartParam = url.searchParams.get('compareStartDate')
    const compareEndParam = url.searchParams.get('compareEndDate')

    const now = new Date()
    const todayStart = getStartOfDaySaoPaulo(now)
    const todayEnd = getEndOfDaySaoPaulo(now)
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const yesterdayStart = getStartOfDaySaoPaulo(yesterday)
    const yesterdayEnd = getEndOfDaySaoPaulo(yesterday)

    const parseYmd = (s: string) => {
      const [y, m, d] = s.split('-').map(Number)
      return new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
    }

    // Primary range (defaults to today)
    const rangeStart = startDateParam
      ? getStartOfDaySaoPaulo(parseYmd(startDateParam))
      : todayStart
    const rangeEnd = endDateParam
      ? getEndOfDaySaoPaulo(parseYmd(endDateParam))
      : todayEnd

    const compareEnabled = !!(compareStartParam && compareEndParam)
    const compareStart = compareEnabled ? getStartOfDaySaoPaulo(parseYmd(compareStartParam!)) : null
    const compareEnd = compareEnabled ? getEndOfDaySaoPaulo(parseYmd(compareEndParam!)) : null

    // Counters -------------------------------------------------------------
    const countLeads = async (start: Date, end: Date, googleAds = false) => {
      let q = supabase.from('leads').select('*', { count: 'exact', head: true })
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
      if (googleAds) q = q.eq('utm_source', 'googleads')
      const { count } = await q
      return count || 0
    }

    const normalizeCategory = (raw: string | null | undefined): string => {
      if (!raw) return '(Sem categoria)'
      const s = raw.toLowerCase()
      if (s.includes('acm')) return 'ACM'
      if (s.includes('acril')) return 'Acrílico'
      if (s.includes('policarbonato')) {
        if (s.includes('alveolar')) return 'Policarbonato Alveolar'
        if (s.includes('compacto')) return 'Policarbonato Compacto'
        return 'Policarbonato'
      }
      if (s.includes('petg')) return 'PETG'
      if (s.includes('poliestireno') || s.includes('ps)')) return 'Poliestireno'
      if (s.includes('pvc')) return 'PVC Expandido'
      if (s === '/' || s.includes('home') || s.includes('produto personalizado') || s.includes('chapa inteira')) return 'Home / Personalizado'
      return raw
    }

    const categoryFromPath = (path: string | null | undefined): string => {
      if (!path) return 'Home / Personalizado'
      const p = path.toLowerCase().replace(/\/+$/, '')
      if (p === '' || p === '/') return 'Home / Personalizado'
      if (p.includes('/chapas/acm')) return 'ACM'
      if (p.includes('/chapas/acrilico')) return 'Acrílico'
      if (p.includes('/chapas/policarbonato')) return 'Policarbonato'
      if (p.includes('/chapas/petg')) return 'PETG'
      if (p.includes('/chapas/poliestireno')) return 'Poliestireno'
      if (p.includes('/chapas/pvc')) return 'PVC Expandido'
      return 'Outros'
    }

    const gadsPerformance = async (start: Date, end: Date) => {
      const [visitsRes, leadsRes] = await Promise.all([
        supabase
          .from('page_visits')
          .select('page_path, visitor_id')
          .eq('utm_source', 'googleads')
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString()),
        supabase
          .from('leads')
          .select('produto_interesse')
          .eq('utm_source', 'googleads')
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString()),
      ])

      const visitsByCat: Record<string, Set<string>> = {}
      ;(visitsRes.data || []).forEach((r: any) => {
        const cat = categoryFromPath(r.page_path)
        if (!visitsByCat[cat]) visitsByCat[cat] = new Set()
        visitsByCat[cat].add(r.visitor_id)
      })
      const leadsByCat: Record<string, number> = {}
      ;(leadsRes.data || []).forEach((r: any) => {
        const cat = normalizeCategory(r.produto_interesse)
        leadsByCat[cat] = (leadsByCat[cat] || 0) + 1
      })

      // Consolidate Policarbonato Alveolar/Compacto under a parent "Policarbonato" row,
      // since both share the same landing page and visits can't be split.
      const POLI_SUBS = ['Policarbonato Alveolar', 'Policarbonato Compacto']
      const poliChildren = POLI_SUBS
        .map(name => ({ category: name, leads: leadsByCat[name] || 0 }))
        .filter(c => c.leads > 0)
        .sort((a, b) => b.leads - a.leads)
      const poliLeadsTotal = poliChildren.reduce((s, c) => s + c.leads, 0)
        + (leadsByCat['Policarbonato'] || 0)
      const poliVisits = visitsByCat['Policarbonato']?.size || 0

      const cats = new Set<string>([...Object.keys(visitsByCat), ...Object.keys(leadsByCat)])
      POLI_SUBS.forEach(s => cats.delete(s))
      cats.delete('Policarbonato')

      const rows = Array.from(cats).map(category => {
        const visits = visitsByCat[category]?.size || 0
        const leads = leadsByCat[category] || 0
        const conversionRate = visits > 0 ? (leads / visits) * 100 : 0
        return { category, visits, leads, conversionRate: Number(conversionRate.toFixed(2)) } as any
      })

      if (poliVisits > 0 || poliLeadsTotal > 0) {
        const conversionRate = poliVisits > 0 ? (poliLeadsTotal / poliVisits) * 100 : 0
        rows.push({
          category: 'Policarbonato',
          visits: poliVisits,
          leads: poliLeadsTotal,
          conversionRate: Number(conversionRate.toFixed(2)),
          children: poliChildren,
        } as any)
      }

      return rows.sort((a, b) => b.leads - a.leads || b.visits - a.visits)
    }

    // Period-scoped aggregates via RPC
    const buildPeriodPayload = async (start: Date, end: Date) => {
      const [
        totalLeads,
        gadsLeads,
        gadsPerf,
        campaignRes,
        dailyRes,
      ] = await Promise.all([
        countLeads(start, end, false),
        countLeads(start, end, true),
        gadsPerformance(start, end),
        supabase.rpc('get_campaign_stats', { p_start: start.toISOString(), p_end: end.toISOString() }),
        supabase.rpc('get_daily_visits', { p_start: start.toISOString(), p_end: end.toISOString() }),
      ])

      const campaignStats = (campaignRes.data || []).map((c: any) => ({
        campaign: c.campaign,
        visits: Number(c.visits),
        leads: Number(c.leads),
        conversionRate: String(c.conversion_rate),
      }))

      // Build daily chart across the full range
      const chartMap: Record<string, number> = {}
      const startSP = getSaoPauloDate(start)
      startSP.setHours(0, 0, 0, 0)
      const endSP = getSaoPauloDate(end)
      endSP.setHours(0, 0, 0, 0)
      const days: string[] = []
      const cursor = new Date(startSP)
      // Cap chart to 90 days to avoid huge arrays
      let guard = 0
      while (cursor.getTime() <= endSP.getTime() && guard < 400) {
        const key = cursor.toISOString().split('T')[0]
        days.push(key)
        chartMap[key] = 0
        cursor.setDate(cursor.getDate() + 1)
        guard++
      }
      ;(dailyRes.data || []).forEach((dv: any) => {
        const k = String(dv.visit_date)
        if (chartMap[k] !== undefined) chartMap[k] = Number(dv.visit_count)
      })
      const chartData = days.map(date => ({ date, visits: chartMap[date] }))

      return { totalLeads, gadsLeads, gadsPerformance: gadsPerf, campaignStats, chartData }
    }

    const [current, previous, todayLeads, yesterdayLeads, todayGAds, yesterdayGAds] = await Promise.all([
      buildPeriodPayload(rangeStart, rangeEnd),
      compareEnabled ? buildPeriodPayload(compareStart!, compareEnd!) : Promise.resolve(null),
      countLeads(todayStart, todayEnd, false),
      countLeads(yesterdayStart, yesterdayEnd, false),
      countLeads(todayStart, todayEnd, true),
      countLeads(yesterdayStart, yesterdayEnd, true),
    ])

    return new Response(
      JSON.stringify({
        current,
        previous,
        anchors: {
          today: { leads: todayLeads, gadsLeads: todayGAds },
          yesterday: { leads: yesterdayLeads, gadsLeads: yesterdayGAds },
        },
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
