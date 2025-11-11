"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  CreditCard,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
  Legend,
  ComposedChart,
  CartesianGrid,
} from "recharts"
import { useState, useEffect } from "react"

interface MetricsData {
  totalCost: number
  totalInstalls: number
  cpi: number
  fttAcc: number
  accountsCreated: number
  cac: number
  accInstalls: number
  currencyExchange: number
  globalCardPayment: number
  localCardPayment: number
  usdtPayment: number
  totalFTT: number
  cpaGlobal: number
  cpaLocal: number
  cpaUSDT: number
  cpaFTT: number
}

export function DashboardAnalytics() {
  const [filters, setFilters] = useState({
    pais: "todos",
    plataforma: "todas",
    periodoDesde: "",
    periodoHasta: "",
    productos: [] as string[],
    filtroIn: "",
    filtroOut: "",
  })

  const [metricsData, setMetricsData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRecords, setTotalRecords] = useState(0)
  const [activeFilters, setActiveFilters] = useState<any>(null)
  const [availablePaises, setAvailablePaises] = useState<string[]>([])
  const [availablePlataformas, setAvailablePlataformas] = useState<string[]>([])
  const [rawData, setRawData] = useState<any[]>([])
  const [dailyData, setDailyData] = useState<any[]>([])
  const [barMetric, setBarMetric] = useState<string>("accountsCreated")
  const [lineMetric, setLineMetric] = useState<string>("cac")
  const [pieMetric, setPieMetric] = useState<string>("cost")

  useEffect(() => {
    fetchData()
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/sheets/filters')
      const data = await response.json()
      
      if (data.success) {
        setAvailablePaises(data.paises)
        setAvailablePlataformas(data.plataformas)
      }
    } catch (err) {
      console.error('Error fetching filter options:', err)
    }
  }

  const fetchData = async (appliedFilters?: any) => {
    try {
      setLoading(true)
      
      // Construir query params con los filtros
      const filtersToUse = appliedFilters || filters
      const params = new URLSearchParams()
      
      if (filtersToUse.pais !== 'todos') params.append('pais', filtersToUse.pais)
      if (filtersToUse.plataforma !== 'todas') params.append('plataforma', filtersToUse.plataforma)
      if (filtersToUse.periodoDesde) params.append('periodoDesde', filtersToUse.periodoDesde)
      if (filtersToUse.periodoHasta) params.append('periodoHasta', filtersToUse.periodoHasta)
      if (filtersToUse.productos.length > 0) params.append('productos', filtersToUse.productos.join(','))
      if (filtersToUse.filtroIn) params.append('filtroIn', filtersToUse.filtroIn)
      if (filtersToUse.filtroOut) params.append('filtroOut', filtersToUse.filtroOut)
      
      const url = `/api/sheets${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setMetricsData(data.metrics)
        setTotalRecords(data.rawData?.length || 0)
        setActiveFilters(data.filters)
        setRawData(data.rawData || [])
        setDailyData(buildDailySeries(data.rawData || []))
        setError(null)
      } else {
        setError(data.error || 'Error al cargar los datos')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Error al conectar con Google Sheets')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    fetchData(filters)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value))
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const metricOptions: { key: string; label: string; type: 'number' | 'currency' }[] = [
    { key: 'accountsCreated', label: 'Accounts Created', type: 'number' },
    { key: 'installs', label: 'Installs', type: 'number' },
    { key: 'cost', label: 'Cost', type: 'currency' },
    { key: 'cac', label: 'CAC', type: 'currency' },
    { key: 'cpi', label: 'CPI', type: 'currency' },
    { key: 'ftt', label: 'FTT', type: 'number' },
    { key: 'globalCard', label: 'Global Card Payment', type: 'number' },
    { key: 'localCard', label: 'Local Card Payment', type: 'number' },
    { key: 'usdt', label: 'USDT Payment', type: 'number' },
    { key: 'currencyExchange', label: 'Currency Exchange', type: 'number' },
  ]

  function buildDailySeries(rows: any[]) {
    const byDate: Record<string, any> = {}
    for (const r of rows) {
      const d = new Date(r.date)
      const key = isNaN(d.getTime()) ? String(r.date) : d.toISOString().slice(0, 10)
      if (!byDate[key]) {
        byDate[key] = {
          date: key,
          cost: 0,
          installs: 0,
          accountsCreated: 0,
          ftt: 0,
          globalCard: 0,
          localCard: 0,
          usdt: 0,
          currencyExchange: 0,
        }
      }
      byDate[key].cost += r.cost || 0
      byDate[key].installs += r.installs || 0
      byDate[key].accountsCreated += r.registration_complete || 0
      byDate[key].ftt += r.ftt || 0
      byDate[key].globalCard += r.global_card_payment_completed || 0
      byDate[key].localCard += r.local_card_payment_completed || 0
      byDate[key].usdt += r.usd_savings_onboarding_completed || 0
      byDate[key].currencyExchange += r.currency_exchange_completed || 0
    }

    const series = Object.values(byDate)
      .sort((a: any, b: any) => (a.date < b.date ? -1 : 1))
      .map((d: any) => ({
        ...d,
        cpi: d.installs > 0 ? d.cost / d.installs : 0,
        cac: d.accountsCreated > 0 ? d.cost / d.accountsCreated : 0,
      }))
    return series
  }

  const metrics = metricsData ? [
    { 
      label: "Total Cost", 
      value: formatCurrency(metricsData.totalCost), 
      change: "+12.5%", 
      trend: "up", 
      icon: DollarSign, 
      color: "text-[#00DBBF]" 
    },
    { 
      label: "Installs", 
      value: formatNumber(metricsData.totalInstalls), 
      change: "+18.3%", 
      trend: "up", 
      icon: Users, 
      color: "text-blue-600" 
    },
    { 
      label: "CPI", 
      value: formatCurrency(metricsData.cpi), 
      change: "-8.2%", 
      trend: "down", 
      icon: Target, 
      color: "text-green-600" 
    },
    {
      label: "FTT/Acc",
      value: formatPercent(metricsData.fttAcc),
      change: "+15.7%",
      trend: "up",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    { 
      label: "Accounts Created", 
      value: formatNumber(metricsData.accountsCreated), 
      change: "+22.1%", 
      trend: "up", 
      icon: Users, 
      color: "text-indigo-600" 
    },
    { 
      label: "CAC", 
      value: formatCurrency(metricsData.cac), 
      change: "-5.4%", 
      trend: "down", 
      icon: DollarSign, 
      color: "text-orange-600" 
    },
    {
      label: "Acc/Installs",
      value: formatPercent(metricsData.accInstalls),
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-teal-600",
    },
    {
      label: "Currency Exchange",
      value: formatNumber(metricsData.currencyExchange),
      change: "+19.8%",
      trend: "up",
      icon: CreditCard,
      color: "text-pink-600",
    },
  ] : [
    { label: "Total Cost", value: "$0", change: "N/A", trend: "up", icon: DollarSign, color: "text-[#00DBBF]" },
    { label: "Installs", value: "0", change: "N/A", trend: "up", icon: Users, color: "text-blue-600" },
    { label: "CPI", value: "$0", change: "N/A", trend: "down", icon: Target, color: "text-green-600" },
    { label: "FTT/Acc", value: "0%", change: "N/A", trend: "up", icon: CheckCircle, color: "text-purple-600" },
    { label: "Accounts Created", value: "0", change: "N/A", trend: "up", icon: Users, color: "text-indigo-600" },
    { label: "CAC", value: "$0", change: "N/A", trend: "down", icon: DollarSign, color: "text-orange-600" },
    { label: "Acc/Installs", value: "0%", change: "N/A", trend: "up", icon: TrendingUp, color: "text-teal-600" },
    { label: "Currency Exchange", value: "0", change: "N/A", trend: "up", icon: CreditCard, color: "text-pink-600" },
  ]

  // Métricas adicionales para mostrar en una segunda fila
  const additionalMetrics = metricsData ? [
    {
      label: "Global Card Payment",
      value: formatNumber(metricsData.globalCardPayment),
      icon: CreditCard,
      color: "text-blue-600"
    },
    {
      label: "Local Card Payment",
      value: formatNumber(metricsData.localCardPayment),
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      label: "USDT Payment",
      value: formatNumber(metricsData.usdtPayment),
      icon: CreditCard,
      color: "text-yellow-600"
    },
    {
      label: "FTT",
      value: formatNumber(metricsData.totalFTT),
      icon: CheckCircle,
      color: "text-purple-600"
    },
  ] : []

  const cpaMetrics = metricsData ? [
    {
      label: "CPA Global",
      value: formatCurrency(metricsData.cpaGlobal),
      icon: Target,
      color: "text-blue-600"
    },
    {
      label: "CPA Local",
      value: formatCurrency(metricsData.cpaLocal),
      icon: Target,
      color: "text-green-600"
    },
    {
      label: "CPA USDT",
      value: formatCurrency(metricsData.cpaUSDT),
      icon: Target,
      color: "text-yellow-600"
    },
    {
      label: "CPA (FTT)",
      value: formatCurrency(metricsData.cpaFTT),
      icon: Target,
      color: "text-purple-600"
    },
  ] : []

  const evolutionData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    cpi: 4.5 + Math.random() * 2,
    cpa: 12 + Math.random() * 5,
  }))


  // Función para calcular datos de plataforma desde rawData filtrados
  function buildPlatformData(rawRows: any[], selectedMetric: string) {
    const byPlatform: Record<string, any> = {}
    
    for (const row of rawRows) {
      const platform = row.platform || 'Other'
      if (!byPlatform[platform]) {
        byPlatform[platform] = {
          platform,
          cost: 0,
          installs: 0,
          accountsCreated: 0,
          ftt: 0,
          globalCard: 0,
          localCard: 0,
          usdt: 0,
          currencyExchange: 0,
        }
      }
      
      byPlatform[platform].cost += row.cost || 0
      byPlatform[platform].installs += row.installs || 0
      byPlatform[platform].accountsCreated += row.registration_complete || 0
      byPlatform[platform].ftt += row.ftt || 0
      byPlatform[platform].globalCard += row.global_card_payment_completed || 0
      byPlatform[platform].localCard += row.local_card_payment_completed || 0
      byPlatform[platform].usdt += row.usd_savings_onboarding_completed || 0
      byPlatform[platform].currencyExchange += row.currency_exchange_completed || 0
    }
    
    return Object.values(byPlatform).map((p: any) => ({
      name: p.platform,
      value: p[selectedMetric] || 0,
      cost: p.cost,
      accountsCreated: p.accountsCreated,
      installs: p.installs,
      ftt: p.ftt,
      globalCard: p.globalCard,
      localCard: p.localCard,
      usdt: p.usdt,
      currencyExchange: p.currencyExchange,
    })).filter(item => item.value > 0)
  }
  
  const pieDataByPlatform = buildPlatformData(rawData, pieMetric)
  
  const COLORS = ['#00DBBF', '#053634', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  
  // Función para calcular top performers por campaña basado en installs
  function buildTopPerformers(rawRows: any[]) {
    const byCampaign: Record<string, any> = {}
    
    for (const row of rawRows) {
      const campaignKey = `${row.campaign_name}_${row.campaign_id}`
      if (!byCampaign[campaignKey]) {
        byCampaign[campaignKey] = {
          campaign_name: row.campaign_name,
          campaign_id: row.campaign_id,
          country: row.country,
          platform: row.platform,
          cost: 0,
          installs: 0,
          accountsCreated: 0,
          ftt: 0,
          globalCard: 0,
          localCard: 0,
          usdt: 0,
        }
      }
      
      byCampaign[campaignKey].cost += row.cost || 0
      byCampaign[campaignKey].installs += row.installs || 0
      byCampaign[campaignKey].accountsCreated += row.registration_complete || 0
      byCampaign[campaignKey].ftt += row.ftt || 0
      byCampaign[campaignKey].globalCard += row.global_card_payment_completed || 0
      byCampaign[campaignKey].localCard += row.local_card_payment_completed || 0
      byCampaign[campaignKey].usdt += row.usd_savings_onboarding_completed || 0
    }
    
    return Object.values(byCampaign)
      .map((campaign: any) => ({
        ...campaign,
        cpi: campaign.installs > 0 ? campaign.cost / campaign.installs : 0,
        cac: campaign.accountsCreated > 0 ? campaign.cost / campaign.accountsCreated : 0,
        fttRate: campaign.accountsCreated > 0 ? (campaign.ftt / campaign.accountsCreated) * 100 : 0,
        convRate: campaign.installs > 0 ? (campaign.accountsCreated / campaign.installs) * 100 : 0,
      }))
      .sort((a: any, b: any) => b.installs - a.installs)
      .slice(0, 10) // Top 10
  }
  
  const topPerformersData = buildTopPerformers(rawData)

  // Calcular datos del funnel de conversión
  const funnelData = (() => {
    const totals = rawData.reduce((acc, row) => ({
      impressions: acc.impressions + (row.impressions || 0),
      clicks: acc.clicks + (row.clicks || 0),
      installs: acc.installs + (row.installs || 0),
      accounts: acc.accounts + (row.registration_complete || 0),
      ftt: acc.ftt + (row.ftt || 0),
    }), {
      impressions: 0,
      clicks: 0,
      installs: 0,
      accounts: 0,
      ftt: 0,
    })

    const steps = [
      {
        name: 'Impressions',
        value: totals.impressions,
        percentage: 100, // Siempre 100% para el primero
      },
      {
        name: 'Clicks',
        value: totals.clicks,
        percentage: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      },
      {
        name: 'Installs',
        value: totals.installs,
        percentage: totals.clicks > 0 ? (totals.installs / totals.clicks) * 100 : 0,
      },
      {
        name: 'Accounts',
        value: totals.accounts,
        percentage: totals.installs > 0 ? (totals.accounts / totals.installs) * 100 : 0,
      },
      {
        name: 'FTT',
        value: totals.ftt,
        percentage: totals.accounts > 0 ? (totals.ftt / totals.accounts) * 100 : 0,
      },
    ]

    return steps
  })()




  const handleResetFilters = () => {
    setFilters({
      pais: "todos",
      plataforma: "todas",
      periodoDesde: "",
      periodoHasta: "",
      productos: [],
      filtroIn: "",
      filtroOut: "",
    })
  }

  const toggleProducto = (producto: string) => {
    setFilters((prev) => ({
      ...prev,
      productos: prev.productos.includes(producto)
        ? prev.productos.filter((p) => p !== producto)
        : [...prev.productos, producto],
    }))
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#053634]/5 via-transparent to-[#00DBBF]/5" />
        <div
          className="absolute top-0 left-0 right-0 h-[500px] bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/CARDSFOTO.png)" }}
        />
      </div>

      <div className="relative p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#053634] mb-2">Analytics Avanzado</h1>
              <p className="text-gray-600">Análisis profundo de rendimiento y tendencias</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-[#053634] text-[#053634] hover:bg-[#053634] hover:text-white bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button className="bg-[#00DBBF] hover:bg-[#00DBBF]/90 text-white rounded-xl">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir en Looker Studio
              </Button>
            </div>
          </div>

          <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg">
            <h3 className="text-lg font-bold text-[#053634] mb-4">Filtros Avanzados</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">País</label>
                  <select
                    value={filters.pais}
                    onChange={(e) => setFilters({ ...filters, pais: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
                  >
                    <option value="todos">Todos</option>
                    {availablePaises.map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Plataforma</label>
                  <select
                    value={filters.plataforma}
                    onChange={(e) => setFilters({ ...filters, plataforma: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
                  >
                    <option value="todas">Todas</option>
                    {availablePlataformas.map((plataforma) => (
                      <option key={plataforma} value={plataforma}>
                        {plataforma}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Desde</label>
                  <input
                    type="date"
                    value={filters.periodoDesde}
                    onChange={(e) => setFilters({ ...filters, periodoDesde: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Hasta</label>
                  <input
                    type="date"
                    value={filters.periodoHasta}
                    onChange={(e) => setFilters({ ...filters, periodoHasta: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Producto</label>
                <div className="flex flex-wrap gap-2">
                  {["Local Card", "Global Card", "USDT", "Currency Exchange"].map((producto) => (
                    <button
                      key={producto}
                      onClick={() => toggleProducto(producto)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.productos.includes(producto)
                          ? "bg-[#00DBBF] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {producto}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Incluir (F. In)</label>
                  <input
                    type="text"
                    value={filters.filtroIn}
                    onChange={(e) => setFilters({ ...filters, filtroIn: e.target.value })}
                    placeholder="Ej: awareness, performance (separado por comas)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Excluir (F. Out)</label>
                  <input
                    type="text"
                    value={filters.filtroOut}
                    onChange={(e) => setFilters({ ...filters, filtroOut: e.target.value })}
                    placeholder="Ej: paused, test (separado por comas)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleResetFilters()
                    fetchData({
                      pais: "todos",
                      plataforma: "todas",
                      periodoDesde: "",
                      periodoHasta: "",
                      productos: [],
                      filtroIn: "",
                      filtroOut: "",
                    })
                  }} 
                  className="rounded-xl bg-transparent"
                >
                  Resetear
                </Button>
                <Button 
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="flex-1 bg-[#00DBBF] hover:bg-[#00DBBF]/90 text-white rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : 'Aplicar Filtros'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Indicador de filtros activos */}
          {!loading && activeFilters && totalRecords > 0 && (
            <Card className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Mostrando {totalRecords.toLocaleString()} registro{totalRecords !== 1 ? 's' : ''}
                    </p>
                    {(activeFilters.pais !== 'todos' || activeFilters.plataforma !== 'todas' || activeFilters.periodoDesde || activeFilters.periodoHasta) && (
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {activeFilters.pais !== 'todos' && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            País: {activeFilters.pais}
                          </Badge>
                        )}
                        {activeFilters.plataforma !== 'todas' && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            Plataforma: {activeFilters.plataforma}
                          </Badge>
                        )}
                        {activeFilters.periodoDesde && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            Desde: {activeFilters.periodoDesde}
                          </Badge>
                        )}
                        {activeFilters.periodoHasta && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            Hasta: {activeFilters.periodoHasta}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-4 border-[#00DBBF] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600">Cargando datos de Google Sheets...</p>
              </div>
            </Card>
          )}

          {error && (
            <Card className="p-6 rounded-2xl bg-red-50 border-2 border-red-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="font-bold text-red-900">Error al cargar datos</h4>
                  <p className="text-sm text-red-700">{error}</p>
                  <p className="text-xs text-red-600 mt-2">
                    Verifica que hayas configurado correctamente las credenciales en .env.local
                  </p>
                </div>
              </div>
            </Card>
          )}

          {!loading && !error && (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gray-50 ${metric.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                          {metric.change !== "N/A" && (
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          metric.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <TrendIcon className="w-4 h-4" />
                        {metric.change}
                      </div>
                          )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                      <p className="text-3xl font-bold text-[#053634]">{metric.value}</p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

              {/* Métricas de Pagos */}
              {metricsData && (
                <div>
                  <h3 className="text-2xl font-bold text-[#053634] mb-4">Métricas de Productos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {additionalMetrics.map((metric, index) => {
                      const Icon = metric.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                        >
                          <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`p-3 rounded-xl bg-gray-50 ${metric.color}`}>
                                <Icon className="w-6 h-6" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                              <p className="text-3xl font-bold text-[#053634]">{metric.value}</p>
                            </div>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Métricas de CPA */}
              {metricsData && (
                <div>
                  <h3 className="text-2xl font-bold text-[#053634] mb-4">Cost Per Action (CPA)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cpaMetrics.map((metric, index) => {
                      const Icon = metric.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                        >
                          <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`p-3 rounded-xl bg-gray-50 ${metric.color}`}>
                                <Icon className="w-6 h-6" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                              <p className="text-3xl font-bold text-[#053634]">{metric.value}</p>
                            </div>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
              )}

          {/* Funnel de Conversión */}
          {!loading && !error && metricsData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="p-4 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg">
                <h3 className="text-lg font-bold text-[#053634] mb-4">Funnel de Conversión</h3>
                <div className="space-y-3">
                  {funnelData.map((step, index) => {
                    const maxValue = funnelData[0]?.value || 0
                    const widthPercentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0
                    const barColor = 'bg-[#00DBBF]'

                    return (
                      <div key={step.name} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#053634] w-20">{step.name}</span>
                            <span className="text-xs text-gray-600">{formatNumber(step.value)}</span>
                          </div>
                          {index > 0 && (
                            <span className="text-xs font-medium text-[#00DBBF]">
                              {formatPercent(step.percentage)}
                            </span>
                          )}
                        </div>
                        <div className="relative w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`h-full ${barColor} rounded-lg`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                    {funnelData.map((step, index) => (
                      <div key={step.name}>
                        <p className="text-xs text-gray-600 mb-1">{step.name}</p>
                        <p className="text-sm font-bold text-[#053634]">{formatNumber(step.value)}</p>
                        {index > 0 && (
                          <p className="text-xs text-[#00DBBF] mt-0.5">{formatPercent(step.percentage)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Evolution */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#053634]">Daily evolution</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={barMetric}
                      onChange={(e) => setBarMetric(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    >
                      {metricOptions.map((m) => (
                        <option key={m.key} value={m.key}>Bar: {m.label}</option>
                      ))}
                    </select>
                    <span className="text-gray-500 text-sm">vs</span>
                    <select
                      value={lineMetric}
                      onChange={(e) => setLineMetric(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    >
                      {metricOptions.map((m) => (
                        <option key={m.key} value={m.key}>Line: {m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={dailyData}>
                    <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey={barMetric} name={metricOptions.find(m=>m.key===barMetric)?.label || barMetric} fill="#9CA3AF" radius={[8,8,0,0]} />
                    <Line type="monotone" dataKey={lineMetric} name={metricOptions.find(m=>m.key===lineMetric)?.label || lineMetric} stroke="#00DBBF" strokeWidth={3} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>


            {/* Platform Distribution */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#053634]">Distribución por Plataforma</h3>
                  <select
                    value={pieMetric}
                    onChange={(e) => setPieMetric(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    {metricOptions.filter(m => ['cost', 'accountsCreated', 'installs', 'ftt', 'globalCard', 'localCard', 'usdt', 'currencyExchange'].includes(m.key)).map((m) => (
                      <option key={m.key} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                </div>
                {pieDataByPlatform.length > 0 ? (
                  <div className="flex flex-col items-center gap-4">
                    <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                          data={pieDataByPlatform}
                      cx="50%"
                      cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                      dataKey="value"
                    >
                          {pieDataByPlatform.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 w-full mt-4">
                      {pieDataByPlatform.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-sm text-gray-600">{item.name}</span>
                          <span className="text-sm font-semibold text-[#053634] ml-auto">{formatNumber(item.value)}</span>
                    </div>
                  ))}
                </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    No hay datos para mostrar
                  </div>
                )}
              </Card>
            </motion.div>

          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg">
              <h3 className="text-xl font-bold text-[#053634] mb-6">Top Performers (por Installs)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Campaña</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Plataforma</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">País</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Cost</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Installs</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Accounts Created</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">FTT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <tr key={index} className="border-b border-gray-100 animate-pulse">
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-8" />
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-32" />
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-16" />
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-20" />
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-16" />
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-16" />
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-16" />
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded w-12" />
                            </td>
                          </tr>
                        ))
                      : topPerformersData.map((campaign, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="w-8 h-8 rounded-full bg-[#00DBBF] text-white flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-[#053634] max-w-xs truncate" title={campaign.campaign_name}>
                              {campaign.campaign_name}
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline">{campaign.platform}</Badge>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{campaign.country}</td>
                            <td className="py-4 px-4 font-semibold text-[#00DBBF]">{formatCurrency(campaign.cost)}</td>
                            <td className="py-4 px-4 text-gray-600 font-semibold">{formatNumber(campaign.installs)}</td>
                            <td className="py-4 px-4 text-gray-600">{formatNumber(campaign.accountsCreated)}</td>
                            <td className="py-4 px-4 text-gray-600">{formatNumber(campaign.ftt)}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
              {topPerformersData.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-400">
                  No hay datos de campañas para mostrar
                </div>
              )}
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
