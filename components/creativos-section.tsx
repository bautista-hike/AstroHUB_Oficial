"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ChevronDown, ChevronRight, Loader2, TrendingUp, DollarSign, Users, MousePointerClick } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FunnelStage = "all" | "awareness" | "app" | "engagement" | "search"
type Country = "all" | "argentina" | "brasil"
type Product = "all" | "global-card" | "local-card" | "usdt" | "currency-exchange"
type Platform = "all" | "meta" | "google" | "tiktok" | "apple"
type Status = "all" | "active" | "renovar"

interface CampaignWithCreatives {
  campaign_name: string
  campaign_id: string
  platform: string
  product: string
  stage: string
  country: string
  metrics: {
    cost: number
    impressions: number
    clicks: number
    installs: number
    accountsCreated: number
    ftt: number
    cpi: number
    cac: number
    ctr: number
    conversion: number
  }
  creatives: Creative[]
}

interface Creative {
  creative_id: string
  creative_name: string
  image_url: string
  campaign_name: string
  campaign_id: string
  platform: string
  product: string
  country: string
  stage: string
  status: string
  date_created: string
  notes: string
  metrics?: any
}

const platformColors: Record<string, string> = {
  Google: "#34A853",
  Meta: "#1877F2",
  TikTok: "#000000",
  Apple: "#A3AAAE",
  LinkedIn: "#0077B5",
  Twitter: "#1DA1F2",
}

const platformIcons: Record<string, string> = {
  Google: "🔍",
  Meta: "📘",
  TikTok: "🎵",
  Apple: "🍎",
  LinkedIn: "💼",
  Twitter: "🐦",
}

export function CreativosSection() {
  const [funnelStage, setFunnelStage] = useState<FunnelStage>("all")
  const [selectedCountries, setSelectedCountries] = useState<Country[]>(["all"])
  const [selectedProduct, setSelectedProduct] = useState<Product>("all")
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["all"])
  const [statusFilter, setStatusFilter] = useState<Status>("all")
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [campaignsData, setCampaignsData] = useState<CampaignWithCreatives[]>([])

  const funnelStages = [
    { id: "all" as FunnelStage, label: "Todas" },
    { id: "awareness" as FunnelStage, label: "Awareness" },
    { id: "app" as FunnelStage, label: "App" },
    { id: "engagement" as FunnelStage, label: "Engagement" },
    { id: "search" as FunnelStage, label: "Search" },
  ]

  const countries = [
    { id: "all" as Country, label: "Todos" },
    { id: "argentina" as Country, label: "Argentina" },
    { id: "brasil" as Country, label: "Brasil" },
  ]

  const products = [
    { id: "all" as Product, label: "Todos", color: "bg-gray-500", icon: "📦" },
    { id: "global-card" as Product, label: "Global Card", color: "bg-[#00DBBF]", icon: "💳" },
    { id: "local-card" as Product, label: "Local Card", color: "bg-[#053634]", icon: "🏦" },
    { id: "usdt" as Product, label: "USDT", color: "bg-[#3B82F6]", icon: "₿" },
    { id: "currency-exchange" as Product, label: "Currency Exchange", color: "bg-[#10B981]", icon: "💱" },
  ]

  const platforms = [
    { id: "all" as Platform, label: "Todas" },
    { id: "google" as Platform, label: "Google" },
    { id: "meta" as Platform, label: "Meta" },
    { id: "tiktok" as Platform, label: "TikTok" },
    { id: "apple" as Platform, label: "Apple" },
  ]

  // Cargar datos de creativos
  useEffect(() => {
    async function fetchCreatives() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        if (funnelStage !== "all") params.append('stage', funnelStage)
        if (!selectedCountries.includes("all")) {
          selectedCountries.forEach((country) => params.append('country', country))
        }
        if (selectedProduct !== "all") {
          const productMap: Record<string, string> = {
            "global-card": "Global Card",
            "local-card": "Local Card",
            "usdt": "USDT Payments",
            "currency-exchange": "Currency Exchange",
          }
          params.append('product', productMap[selectedProduct])
        }
        if (!selectedPlatforms.includes("all")) {
          selectedPlatforms.forEach((platform) => params.append('platform', platform))
        }
        if (statusFilter !== "all") params.append('status', statusFilter)

        const response = await fetch(`/api/creatives?${params.toString()}`)
        const result = await response.json()
        
        if (result.success) {
          setCampaignsData(result.creatives || [])
          // Expandir todas las campañas por defecto
          const allCampaignNames = new Set(result.creatives.map((c: CampaignWithCreatives) => c.campaign_name))
          setExpandedCampaigns(allCampaignNames)
        }
      } catch (error) {
        console.error('Error cargando creativos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreatives()
  }, [funnelStage, selectedCountries, selectedProduct, selectedPlatforms, statusFilter])

  const toggleCountry = (value: Country) => {
    setSelectedCountries((prev) => {
      if (value === "all") return ["all"]
      const withoutAll = prev.filter((item) => item !== "all")
      if (withoutAll.includes(value)) {
        const next = withoutAll.filter((item) => item !== value)
        return next.length ? next : ["all"]
      }
      return [...withoutAll, value]
    })
  }

  const togglePlatform = (value: Platform) => {
    setSelectedPlatforms((prev) => {
      if (value === "all") return ["all"]
      const withoutAll = prev.filter((item) => item !== "all")
      if (withoutAll.includes(value)) {
        const next = withoutAll.filter((item) => item !== value)
        return next.length ? next : ["all"]
      }
      return [...withoutAll, value]
    })
  }

  const getSelectedLabel = <T extends string>(
    selected: T[],
    options: { id: T; label: string }[],
    placeholder: string,
    allValue: T,
  ) => {
    if (selected.includes(allValue) || selected.length === 0) return placeholder
    if (selected.length === 1) {
      const match = options.find((opt) => opt.id === selected[0])
      return match?.label ?? placeholder
    }
    return `${selected.length} seleccionados`
  }

  const toggleCampaign = (campaignName: string) => {
    const newSet = new Set(expandedCampaigns)
    if (newSet.has(campaignName)) {
      newSet.delete(campaignName)
    } else {
      newSet.add(campaignName)
    }
    setExpandedCampaigns(newSet)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value))
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-[#F5F7F2] via-white to-[#E8FFFA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#00DBBF] animate-spin mx-auto mb-4" />
          <p className="text-[#053634]">Cargando creativos...</p>
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
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Creativos</h1>
          <p className="text-[#053634]/70">Gestión de creativos publicitarios agrupados por campaña</p>
        </div>

        {/* Funnel Stage Tabs */}
        <div className="flex gap-3 p-1 bg-white rounded-full border border-[#E6EFE8] shadow-sm">
          {funnelStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setFunnelStage(stage.id)}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                funnelStage === stage.id 
                  ? "bg-[#00DBBF] text-white shadow-md" 
                  : "text-[#053634] hover:bg-[#F5F7F2]"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Country Filter */}
          <Card className="p-4 rounded-2xl bg-white border border-[#E6EFE8] shadow-sm">
            <p className="text-xs font-semibold text-[#053634]/70 mb-2">Países</p>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-xl border border-[#E6EFE8] px-4 py-2 text-left text-sm hover:border-[#00DBBF]"
                >
                  <span className="text-[#053634]">
                    {getSelectedLabel(selectedCountries, countries, "Todos los países", "all")}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#053634]/60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  {countries.map((c) => (
                    <label key={c.id} className="flex items-center gap-3 text-sm text-[#053634]">
                      <Checkbox
                        checked={c.id === "all" ? selectedCountries.includes("all") : selectedCountries.includes(c.id)}
                        onCheckedChange={() => toggleCountry(c.id)}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </Card>

          {/* Platform Filter */}
          <Card className="p-4 rounded-2xl bg-white border border-[#E6EFE8] shadow-sm">
            <p className="text-xs font-semibold text-[#053634]/70 mb-2">Medios / Plataformas</p>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-xl border border-[#E6EFE8] px-4 py-2 text-left text-sm hover:border-[#00DBBF]"
                >
                  <span className="text-[#053634]">
                    {getSelectedLabel(selectedPlatforms, platforms, "Todas las plataformas", "all")}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#053634]/60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  {platforms.map((p) => (
                    <label key={p.id} className="flex items-center gap-3 text-sm text-[#053634]">
                      <Checkbox
                        checked={
                          p.id === "all"
                            ? selectedPlatforms.includes("all")
                            : selectedPlatforms.includes(p.id)
                        }
                        onCheckedChange={() => togglePlatform(p.id)}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </Card>

          {/* Product Filter */}
          <div className="flex gap-2 flex-wrap">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`px-3 py-2 rounded-full font-semibold transition-all border text-xs ${
                  selectedProduct === product.id
                    ? "bg-white shadow-lg ring-2 ring-[#00DBBF] border-[#00DBBF]"
                    : "bg-white shadow-sm hover:shadow-md border-[#E6EFE8]"
                }`}
              >
                <span className="mr-1">{product.icon}</span>
                {product.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <Card className="p-3 rounded-2xl bg-white border border-[#E6EFE8] shadow-sm">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-[#00DBBF] text-white hover:bg-[#00DBBF]/90" : "border-[#E6EFE8] text-[#053634] hover:bg-[#F5F7F2]"}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
                className={statusFilter === "active" ? "bg-[#10B981] text-white hover:bg-[#10B981]/90" : "border-[#E6EFE8] text-[#053634] hover:bg-[#F5F7F2]"}
              >
                🟢 Activo
              </Button>
              <Button
                variant={statusFilter === "renovar" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("renovar")}
                className={statusFilter === "renovar" ? "bg-[#EF4444] text-white hover:bg-[#EF4444]/90" : "border-[#E6EFE8] text-[#053634] hover:bg-[#F5F7F2]"}
              >
                🔴 Renovar
              </Button>
            </div>
          </Card>
        </div>

        {/* Campaigns with Creatives */}
        <div className="space-y-4">
          {campaignsData.length === 0 ? (
            <Card className="p-8 rounded-2xl bg-white border border-[#E6EFE8] text-center">
              <p className="text-[#053634]/60">No se encontraron creativos con los filtros seleccionados.</p>
              <p className="text-sm text-[#053634]/40 mt-2">
                Asegúrate de tener una hoja "CREATIVES" en tu Google Sheets con los datos de creativos.
              </p>
            </Card>
          ) : (
            campaignsData.map((campaign) => (
              <Card key={campaign.campaign_name} className="overflow-hidden rounded-2xl bg-white border border-[#E6EFE8] shadow-sm">
                {/* Campaign Header */}
                <button
                  onClick={() => toggleCampaign(campaign.campaign_name)}
                  className="w-full flex items-center justify-between p-6 hover:bg-[#F5F7F2]/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {expandedCampaigns.has(campaign.campaign_name) ? (
                      <ChevronDown className="w-5 h-5 text-[#00DBBF]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#00DBBF]" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#053634]">{campaign.campaign_name}</h3>
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: platformColors[campaign.platform] || '#E6EFE8',
                            color: 'white'
                          }}
                        >
                          {platformIcons[campaign.platform] || '📱'} {campaign.platform}
                        </Badge>
                        <Badge variant="outline" className="bg-[#00DBBF]/10 text-[#053634] border-[#00DBBF]/30">
                          {campaign.product}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 text-[#053634]">
                          {campaign.stage}
                        </Badge>
                        {campaign.country && (
                          <Badge variant="outline" className="bg-gray-100 text-[#053634]">
                            {campaign.country}
                          </Badge>
                        )}
                      </div>
                      {/* Metrics Preview */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-[#053634]">
                          <DollarSign className="w-4 h-4 text-[#00DBBF]" />
                          <span className="font-semibold">{formatCurrency(campaign.metrics.cost)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#053634]">
                          <Users className="w-4 h-4 text-[#00DBBF]" />
                          <span className="font-semibold">{formatNumber(campaign.metrics.accountsCreated)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#053634]">
                          <MousePointerClick className="w-4 h-4 text-[#00DBBF]" />
                          <span className="font-semibold">{formatPercent(campaign.metrics.ctr)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#053634]">
                          <TrendingUp className="w-4 h-4 text-[#00DBBF]" />
                          <span className="font-semibold">{formatPercent(campaign.metrics.conversion)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-[#00DBBF]/10 text-[#053634] border-[#00DBBF]/30">
                    {campaign.creatives.length} creativo{campaign.creatives.length !== 1 ? 's' : ''}
                  </Badge>
                </button>

                {/* Creatives Grid */}
                <AnimatePresence>
                  {expandedCampaigns.has(campaign.campaign_name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#E6EFE8]"
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {campaign.creatives.map((creative) => (
                            <motion.div
                              key={creative.creative_id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              whileHover={{ y: -4 }}
                              className="relative"
                            >
                              <Card className="overflow-hidden rounded-2xl bg-white border border-[#E6EFE8] shadow-sm hover:shadow-xl transition-all group">
                                {/* Creative Image */}
                                <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                                  <Image
                                    src={creative.image_url || "/placeholder.svg"}
                                    alt={creative.creative_name || creative.creative_id}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                                    onError={(e) => {
                                      console.error("Error cargando imagen:", creative.image_url)
                                    }}
                                  />
                                  {/* Status Badge */}
                                  <div className="absolute top-3 right-3">
                                    <Badge
                                      className={`${
                                        creative.status === "active"
                                          ? "bg-[#10B981] hover:bg-[#10B981]/90"
                                          : "bg-[#EF4444] hover:bg-[#EF4444]/90"
                                      } text-white font-semibold shadow-md`}
                                    >
                                      {creative.status === "active" ? "🟢 Activo" : "🔴 Renovar"}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Creative Info */}
                                <div className="p-4">
                                  <h4 className="font-semibold text-[#053634] mb-2 truncate">
                                    {creative.creative_name || creative.creative_id}
                                  </h4>
                                  {creative.notes && (
                                    <p className="text-xs text-[#053634]/60 mb-2 line-clamp-2">{creative.notes}</p>
                                  )}
                                  {creative.date_created && (
                                    <p className="text-xs text-[#053634]/40">
                                      Creado: {new Date(creative.date_created).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
