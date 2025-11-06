"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronRight, Circle, X, Loader2 } from "lucide-react"

type Stage = "all" | "awareness" | "search" | "app" | "engagement" | "branding"
type Platform = "Google" | "Meta" | "TikTok" | "Apple" | "LinkedIn" | "Twitter"
type Product = "Global Card" | "Local Card" | "USDT Payments" | "Currency Exchange" | "PIX Payments"
type ActivityFilter = "all" | "active" | "inactive"

interface Campaign {
  campaign_name: string
  country: string
  platform: string
  product: string
  stage: Exclude<Stage, "all">
  cost: number
  installs: number
  ftt: number
  accountsCreated: number
  date: string
  isActive: boolean
  datesWithCost: string[] // Fechas en las que tuvo costo
}

const platformColors: Record<string, string> = {
  Google: "#34A853",
  Meta: "#1877F2",
  TikTok: "#000000",
  Apple: "#A3AAAE",
  LinkedIn: "#0077B5",
  Twitter: "#1DA1F2",
}

const STAGE_LABELS: Record<Exclude<Stage, "all">, string> = {
  awareness: "Awareness",
  search: "Search",
  app: "App",
  engagement: "Engagement",
  branding: "Branding",
}

// Función para detectar plataforma desde campaign_name
function detectPlatform(campaignName: string): string {
  const name = campaignName.toUpperCase()
  if (name.includes('GG_') || name.includes('GOOGLE')) return 'Google'
  if (name.includes('FB_') || name.includes('FACEBOOK') || name.includes('META')) return 'Meta'
  if (name.includes('TK_') || name.includes('TIKTOK')) return 'TikTok'
  if (name.includes('LI_') || name.includes('LINKEDIN')) return 'LinkedIn'
  if (name.includes('AP_') || name.includes('APPLE') || name.includes('APL'))return 'Apple'
  if (name.includes('X_') || name.includes('TWITTER')) return 'Twitter'
  return 'Unknown'
}

// Función para detectar producto desde campaign_name
function detectProduct(campaignName: string): string {
  if (!campaignName) return 'Unknown'
  const name = campaignName.toUpperCase().trim()
  // Detectar PIX - debe estar primero para tener prioridad
  if (name.includes('PIX')) return 'PIX Payments'
  if (name.includes('CURRENCYEX') || name.includes('CURRENCY_EXCHANGE')) return 'Currency Exchange'
  if (name.includes('GLOBALCARD') || name.includes('GLOBAL_CARD') || name.includes('GLOBAL-CARD')) return 'Global Card'
  if (name.includes('LOCALCARD') || name.includes('LOCAL_CARD')) return 'Local Card'
  if (name.includes('USDT')) return 'USDT Payments'
  return 'Unknown'
}

// Función para detectar etapa desde campaign_name
function detectStage(campaignName: string): Exclude<Stage, "all"> {
  const name = campaignName.toUpperCase()
  // Verificar si termina en BRAND, CATEGORY o COMPETITION
  if (name.endsWith('BRAND') || name.endsWith('CATEGORY') || name.endsWith('COMPETITION')) {
    return 'branding'
  }
  if (name.includes('AWA') || name.includes('AWARENESS') || name.includes('REACH') || name.includes('VIEWS')) return 'awareness'
  if (name.includes('ENG') || name.includes('ENGAGEMENT')) return 'engagement'
  if (name.includes('SRC') || name.includes('BRAND') || name.includes('CATEGORY')) return 'search'
  return 'app' // Por defecto, si no coincide, es APP
}

// Función para verificar si una campaña está activa (costo > 0 en últimos 15 días)
function isCampaignActive(datesWithCost: string[]): boolean {
  const now = new Date()
  const fifteenDaysAgo = new Date(now)
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)
  
  return datesWithCost.some(dateStr => {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return false
    return date >= fifteenDaysAgo && date <= now
  })
}

export function CampanasActivasSection() {
  const [stageFilter, setStageFilter] = useState<Stage>("all")
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(["awareness", "search", "app", "engagement", "branding"]),
  )
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set())
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set())
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos de Google Sheets
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/campaigns')
        const result = await response.json()
        
        if (result.success && result.rawData) {
          // Procesar datos y agregar información de plataforma, producto y etapa
          const processedData = result.rawData
            .filter((row: any) => {
              const campaignName = row.campaign_name;
              // Filtrar campañas vacías, con solo espacios, o que contengan palabras separadas por espacios
              if (!campaignName || campaignName.trim() === '') return false;
              // Excluir campañas que contengan espacios (palabras separadas)
              if (campaignName.includes(' ')) return false;
              return true;
            })
            .map((row: any) => ({
              ...row,
              platform: detectPlatform(row.campaign_name),
              product: detectProduct(row.campaign_name),
              stage: detectStage(row.campaign_name),
              accountsCreated: row.registration_complete || 0,
            }))
          
          // Agrupar por campaign_name para evitar duplicados
          const uniqueCampaigns = new Map<string, any>()
          processedData.forEach((row: any) => {
            const key = row.campaign_name
            if (!uniqueCampaigns.has(key)) {
              uniqueCampaigns.set(key, { 
                ...row, 
                cost: 0, 
                installs: 0, 
                ftt: 0, 
                accountsCreated: 0,
                datesWithCost: [] as string[]
              })
            }
            const campaign = uniqueCampaigns.get(key)!
            campaign.cost += row.cost || 0
            campaign.installs += row.installs || 0
            campaign.ftt += row.ftt || 0
            campaign.accountsCreated += row.accountsCreated || 0
            
            // Agregar fecha si tuvo costo
            if (row.cost > 0 && row.date) {
              let dateStr = ''
              if (typeof row.date === 'string') {
                // Si es string, puede ser formato ISO o fecha simple
                dateStr = row.date.split('T')[0].split(' ')[0]
              } else if (row.date instanceof Date) {
                dateStr = row.date.toISOString().split('T')[0]
              } else {
                // Intentar convertir a Date
                const date = new Date(row.date)
                if (!isNaN(date.getTime())) {
                  dateStr = date.toISOString().split('T')[0]
                }
              }
              if (dateStr && !campaign.datesWithCost.includes(dateStr)) {
                campaign.datesWithCost.push(dateStr)
              }
            }
          })
          
          // Calcular isActive para cada campaña
          const campaignsWithActivity = Array.from(uniqueCampaigns.values()).map((campaign: any) => ({
            ...campaign,
            isActive: isCampaignActive(campaign.datesWithCost)
          }))
          
          setRawData(campaignsWithActivity as any[])
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const toggleStage = (stage: string) => {
    const newSet = new Set(expandedStages)
    if (newSet.has(stage)) {
      newSet.delete(stage)
    } else {
      newSet.add(stage)
    }
    setExpandedStages(newSet)
  }

  const toggleCountry = (key: string) => {
    const newSet = new Set(expandedCountries)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedCountries(newSet)
  }

  const togglePlatform = (key: string) => {
    const newSet = new Set(expandedPlatforms)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedPlatforms(newSet)
  }

  const toggleProduct = (key: string) => {
    const newSet = new Set(expandedProducts)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedProducts(newSet)
  }

  const filtered = useMemo(() => {
    return rawData.filter((c: any) => {
      // Filtrar campañas con costo mayor a cero
      const hasCost = c.cost > 0
      const matchStage = stageFilter === "all" ? true : c.stage === stageFilter
      const matchActivity = activityFilter === "all" 
        ? true 
        : activityFilter === "active" 
          ? c.isActive 
          : !c.isActive
      const matchSearch =
        c.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase())
      return hasCost && matchStage && matchActivity && matchSearch
    })
  }, [stageFilter, activityFilter, searchQuery, rawData])

  // Crear jerarquía: Stage -> Country -> Platform -> Product -> Campaigns
  const hierarchy = useMemo(() => {
    const stages: Record<string, Record<string, Record<string, Record<string, any[]>>>> = {}

    filtered.forEach((campaign: any) => {
      if (!stages[campaign.stage]) stages[campaign.stage] = {}
      if (!stages[campaign.stage][campaign.country]) stages[campaign.stage][campaign.country] = {}
      if (!stages[campaign.stage][campaign.country][campaign.platform]) {
        stages[campaign.stage][campaign.country][campaign.platform] = {}
      }
      if (!stages[campaign.stage][campaign.country][campaign.platform][campaign.product]) {
        stages[campaign.stage][campaign.country][campaign.platform][campaign.product] = []
      }
      stages[campaign.stage][campaign.country][campaign.platform][campaign.product].push(campaign)
    })

    return stages
  }, [filtered])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  // Función auxiliar para contar campañas activas
  const countActiveCampaigns = (campaigns: any[]): number => {
    return campaigns.filter((c: any) => c.isActive).length
  }

  // Función recursiva para contar todas las campañas activas en una estructura jerárquica
  const countActiveInHierarchy = (obj: any): number => {
    if (Array.isArray(obj)) {
      return countActiveCampaigns(obj)
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).reduce((sum: number, val: any) => sum + countActiveInHierarchy(val), 0)
    }
    return 0
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-[#F5F7F2] via-white to-[#E8FFFA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#00DBBF] animate-spin mx-auto mb-4" />
          <p className="text-[#053634]">Cargando campañas activas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#F5F7F2] via-white to-[#E8FFFA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Campañas Activas</h1>
          <p className="text-[#053634]/70">Estructura jerárquica de campañas por etapa, país, plataforma y producto</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white border border-[#E6EFE8] rounded-full px-4 py-2 shadow-sm max-w-lg">
          <Search className="w-5 h-5 text-[#00DBBF]" />
          <input
            type="text"
            placeholder="Buscar por nombre, producto, plataforma o país..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 ml-2 outline-none text-sm text-[#053634] bg-transparent"
          />
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-3">
          {(["all", "awareness", "search", "app", "engagement", "branding"] as Stage[]).map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className={`px-4 py-2 rounded-full border transition-all ${
                stageFilter === s
                  ? "bg-[#00DBBF] text-white border-transparent shadow-md"
                  : "bg-white text-[#053634] border-[#E6EFE8] hover:bg-[#F5F7F2]"
              }`}
            >
              {s === "all" ? "Todas" : STAGE_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Activity Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-sm text-[#053634]/70 flex items-center">Estado:</span>
          {(["all", "active", "inactive"] as ActivityFilter[]).map((a) => (
            <button
              key={a}
              onClick={() => setActivityFilter(a)}
              className={`px-4 py-2 rounded-full border transition-all ${
                activityFilter === a
                  ? "bg-[#00DBBF] text-white border-transparent shadow-md"
                  : "bg-white text-[#053634] border-[#E6EFE8] hover:bg-[#F5F7F2]"
              }`}
            >
              {a === "all" ? "Todas" : a === "active" ? "Activas" : "Inactivas"}
            </button>
          ))}
        </div>

        {/* Hierarchical Structure */}
        <div className="space-y-4">
          {Object.entries(hierarchy).map(([stage, countries]) => (
            <Card key={stage} className="overflow-hidden rounded-2xl bg-white border border-[#E6EFE8] shadow-sm">
              {/* Stage Header */}
              <button
                onClick={() => toggleStage(stage)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F5F7F2]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedStages.has(stage) ? (
                    <ChevronDown className="w-5 h-5 text-[#00DBBF]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#00DBBF]" />
                  )}
                  <h2 className="text-2xl font-bold text-[#053634]">{STAGE_LABELS[stage as Exclude<Stage, "all">]}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#00DBBF]/10 text-[#053634] border-[#00DBBF]/30">
                    {countActiveInHierarchy(countries)}{" "}
                    activa{countActiveInHierarchy(countries) !== 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="outline" className="text-[#053634]">
                    {Object.values(countries).reduce(
                      (acc, platforms) =>
                        acc + Object.values(platforms).reduce(
                          (sum, products) => sum + Object.values(products).reduce((total, campaigns) => total + campaigns.length, 0),
                          0
                        ),
                      0,
                    )}{" "}
                    total
                  </Badge>
                </div>
              </button>

              {/* Countries */}
              <AnimatePresence>
                {expandedStages.has(stage) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#E6EFE8]"
                  >
                    {Object.entries(countries).map(([country, platforms]) => {
                      const countryKey = `${stage}-${country}`
                      return (
                        <div key={countryKey} className="border-b border-[#E6EFE8] last:border-b-0">
                          {/* Country Header */}
                          <button
                            onClick={() => toggleCountry(countryKey)}
                            className="w-full flex items-center justify-between p-5 pl-12 hover:bg-[#F5F7F2]/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {expandedCountries.has(countryKey) ? (
                                <ChevronDown className="w-4 h-4 text-[#053634]" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-[#053634]" />
                              )}
                              <span className="text-xl font-semibold text-[#053634]">
                                {country === "Argentina" ? "🇦🇷" : country === "Brasil" ? "🇧🇷" : ""} {country}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#00DBBF]/10 text-[#053634] border-[#00DBBF]/30">
                                {countActiveInHierarchy(platforms)}{" "}
                                activa{countActiveInHierarchy(platforms) !== 1 ? 's' : ''}
                              </Badge>
                              <Badge variant="outline" className="text-[#053634]">
                                {Object.values(platforms).reduce(
                                  (sum, products) => sum + Object.values(products).reduce((total, campaigns) => total + campaigns.length, 0),
                                  0
                                )}{" "}
                                total
                              </Badge>
                            </div>
                          </button>

                          {/* Platforms */}
                          <AnimatePresence>
                            {expandedCountries.has(countryKey) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-[#F5F7F2]/30"
                              >
                                {Object.entries(platforms).map(([platform, products]) => {
                                  const platformKey = `${countryKey}-${platform}`
                                  return (
                                    <div key={platformKey} className="border-t border-[#E6EFE8]">
                                      {/* Platform Header */}
                                      <button
                                        onClick={() => togglePlatform(platformKey)}
                                        className="w-full flex items-center justify-between p-4 pl-20 hover:bg-white/50 transition-colors"
                                        style={{ borderLeft: `4px solid ${platformColors[platform] || '#E6EFE8'}` }}
                                      >
                                        <div className="flex items-center gap-3">
                                          {expandedPlatforms.has(platformKey) ? (
                                            <ChevronDown
                                              className="w-4 h-4"
                                              style={{ color: platformColors[platform] || '#053634' }}
                                            />
                                          ) : (
                                            <ChevronRight
                                              className="w-4 h-4"
                                              style={{ color: platformColors[platform] || '#053634' }}
                                            />
                                          )}
                                          <span className="font-semibold text-[#053634]">{platform}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge className="bg-[#00DBBF]/10 text-[#053634] border-[#00DBBF]/30">
                                            {countActiveInHierarchy(products)}{" "}
                                            activa{countActiveInHierarchy(products) !== 1 ? 's' : ''}
                                          </Badge>
                                          <Badge variant="secondary" className="bg-white">
                                            {Object.values(products).reduce((sum, campaigns) => sum + campaigns.length, 0)}{" "}
                                            total
                                          </Badge>
                                        </div>
                                      </button>

                                      {/* Products */}
                                      <AnimatePresence>
                                        {expandedPlatforms.has(platformKey) && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="bg-white"
                                          >
                                            {Object.entries(products).map(([product, campaigns]) => {
                                              const productKey = `${platformKey}-${product}`
                                              return (
                                                <div key={productKey} className="border-t border-[#E6EFE8]">
                                                  {/* Product Header */}
                                                  <button
                                                    onClick={() => toggleProduct(productKey)}
                                                    className="w-full flex items-center justify-between p-3 pl-28 hover:bg-[#F5F7F2]/50 transition-colors"
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      {expandedProducts.has(productKey) ? (
                                                        <ChevronDown className="w-4 h-4 text-[#053634]" />
                                                      ) : (
                                                        <ChevronRight className="w-4 h-4 text-[#053634]" />
                                                      )}
                                                      <span className="font-medium text-[#053634]">{product}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <Badge className="bg-[#00DBBF]/10 text-[#053634] border-[#00DBBF]/30">
                                                        {countActiveCampaigns(campaigns)}{" "}
                                                        activa{countActiveCampaigns(campaigns) !== 1 ? 's' : ''}
                                                      </Badge>
                                                      <Badge variant="outline" className="bg-white">
                                                        {campaigns.length}{" "}
                                                        total
                                                      </Badge>
                                                    </div>
                                                  </button>

                                                  {/* Campaigns */}
                                                  <AnimatePresence>
                                                    {expandedProducts.has(productKey) && (
                                                      <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="bg-[#F5F7F2]/30"
                                                      >
                                                        <div className="p-3 pl-32 space-y-2">
                                                          {campaigns.map((campaign: any, index: number) => (
                                                            <motion.div
                                                              key={index}
                                                              whileHover={{ x: 4 }}
                                                              className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-[#F5F7F2] transition-colors cursor-pointer"
                                                              onClick={() => setSelectedCampaign(campaign)}
                                                            >
                                                              <div className="flex items-center gap-3 flex-1">
                                                                <div title={campaign.isActive ? 'Activa' : 'Inactiva'}>
                                                                  <Circle 
                                                                    className={`w-3 h-3 ${campaign.isActive ? 'text-[#00DBBF] fill-[#00DBBF]' : 'text-gray-400 fill-gray-400'}`}
                                                                  />
                                                                </div>
                                                                <span className="font-medium text-[#053634]">{campaign.campaign_name}</span>
                                                                {!campaign.isActive && (
                                                                  <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                                                                    Inactiva
                                                                  </Badge>
                                                                )}
                                                              </div>
                                                              <div className="flex items-center gap-4 text-sm">
                                                                <div className="text-right">
                                                                  <p className="text-xs text-gray-500">Cost</p>
                                                                  <p className="font-semibold text-[#053634]">{formatCurrency(campaign.cost)}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                  <p className="text-xs text-gray-500">Installs</p>
                                                                  <p className="font-semibold text-[#053634]">{formatNumber(campaign.installs)}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                  <p className="text-xs text-gray-500">Accounts</p>
                                                                  <p className="font-semibold text-[#00DBBF]">{formatNumber(campaign.accountsCreated)}</p>
                                                                </div>
                                                              </div>
                                                            </motion.div>
                                                          ))}
                                                        </div>
                                                      </motion.div>
                                                    )}
                                                  </AnimatePresence>
                                                </div>
                                              )
                                            })}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-[#053634]/60 mt-10">No se encontraron campañas.</p>}
      </motion.div>

      {/* Campaign Detail Drawer */}
      <AnimatePresence>
        {selectedCampaign && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedCampaign(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-[#053634]">{selectedCampaign.campaign_name}</h3>
                      <Badge className={selectedCampaign.isActive ? "bg-[#00DBBF]/10 text-[#00DBBF] border-[#00DBBF]/30" : "bg-gray-100 text-gray-600 border-gray-300"}>
                        {selectedCampaign.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{selectedCampaign.product}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">País</p>
                    <p className="font-semibold text-[#053634]">
                      {selectedCampaign.country === "Argentina" ? "🇦🇷" : selectedCampaign.country === "Brasil" ? "🇧🇷" : ""} {selectedCampaign.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plataforma</p>
                    <p className="font-semibold" style={{ color: platformColors[selectedCampaign.platform] || '#053634' }}>
                      {selectedCampaign.platform}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Producto</p>
                    <p className="font-semibold text-[#053634]">{selectedCampaign.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Etapa</p>
                    <p className="font-semibold text-[#053634]">{STAGE_LABELS[selectedCampaign.stage as Exclude<Stage, "all">]}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-[#053634] mb-3">KPIs</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#F5F7F2] rounded-lg">
                      <p className="text-xs text-gray-600">Costo Total</p>
                      <p className="font-bold text-[#053634]">{formatCurrency(selectedCampaign.cost)}</p>
                    </div>
                    <div className="text-center p-3 bg-[#F5F7F2] rounded-lg">
                      <p className="text-xs text-gray-600">Installs</p>
                      <p className="font-bold text-[#00DBBF]">{formatNumber(selectedCampaign.installs)}</p>
                    </div>
                    <div className="text-center p-3 bg-[#F5F7F2] rounded-lg">
                      <p className="text-xs text-gray-600">Accounts Created</p>
                      <p className="font-bold text-[#053634]">{formatNumber(selectedCampaign.accountsCreated)}</p>
                    </div>
                    <div className="text-center p-3 bg-[#F5F7F2] rounded-lg">
                      <p className="text-xs text-gray-600">FTT</p>
                      <p className="font-bold text-[#00DBBF]">{formatNumber(selectedCampaign.ftt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
