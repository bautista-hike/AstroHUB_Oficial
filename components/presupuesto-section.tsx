"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, Link2 } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts"
import type { TooltipProps } from "recharts"

type BudgetEntry = {
  mes: string
  producto: string
  plataforma: string
  pais: string
  os: string
  presupuesto: number
  gastado: number
  porcentaje: number
}

type BaseEntry = Omit<BudgetEntry, "mes">

const baseEntries: BaseEntry[] = [
  { producto: "Global Card", plataforma: "Meta", pais: "Argentina", os: "Android", presupuesto: 15000, gastado: 12500, porcentaje: 83 },
  { producto: "Global Card", plataforma: "Google", pais: "Argentina", os: "iOS", presupuesto: 12000, gastado: 9800, porcentaje: 82 },
  { producto: "Local Card", plataforma: "Meta", pais: "Brasil", os: "Android", presupuesto: 18000, gastado: 15200, porcentaje: 84 },
  { producto: "USDT", plataforma: "TikTok", pais: "Argentina", os: "Android", presupuesto: 8000, gastado: 6400, porcentaje: 80 },
  { producto: "Currency Exchange", plataforma: "Google", pais: "Brasil", os: "iOS", presupuesto: 10000, gastado: 7500, porcentaje: 75 },
  { producto: "Global Card", plataforma: "Meta", pais: "Brasil", os: "Android", presupuesto: 20000, gastado: 18500, porcentaje: 93 },
]

const monthMultipliers: Record<string, number> = {
  "oct-2025": 1,
  "sep-2025": 0.92,
  "ago-2025": 0.88,
}

const budgetData: BudgetEntry[] = Object.entries(monthMultipliers).flatMap(([mes, factor]) =>
  baseEntries.map((entry) => ({
    ...entry,
    mes,
    presupuesto: Math.round(entry.presupuesto * factor),
    gastado: Math.round(entry.gastado * factor),
    porcentaje: entry.porcentaje,
  })),
)

const PRODUCT_OPTIONS = ["Global Card", "Local Card", "USDT", "Currency Exchange"]
const PLATFORM_OPTIONS = ["Meta", "Google", "TikTok"]
const COUNTRY_OPTIONS = ["Argentina", "Brasil"]
const OS_OPTIONS = ["Android", "iOS"]

const PLATFORM_COLORS: Record<string, string> = {
  Google: "#34A853",
  Meta: "#1877F2",
  TikTok: "#000000",
}

const FALLBACK_COLORS = ["#00DBBF", "#053634", "#FFB347", "#6366F1"]

export function PresupuestoSection() {
  const [selectedMes, setSelectedMes] = useState("oct-2025")
  const [selectedProducto, setSelectedProducto] = useState("all")
  const [selectedPlataforma, setSelectedPlataforma] = useState("all")
  const [selectedPais, setSelectedPais] = useState("all")
  const [pieFilters, setPieFilters] = useState({
    producto: "all",
    plataforma: "all",
    pais: "all",
    os: "all",
  })

  const resumenMensual: Record<
    string,
    { etiqueta: string; total: number; cards: number; anterior?: string }
  > = {
    "oct-2025": { etiqueta: "Octubre 2025", total: 78200, cards: 53000, anterior: "sep-2025" },
    "sep-2025": { etiqueta: "Septiembre 2025", total: 72400, cards: 49800, anterior: "ago-2025" },
    "ago-2025": { etiqueta: "Agosto 2025", total: 70150, cards: 47500 },
  }

  const filteredData = useMemo(() => {
    return budgetData.filter((item) => {
      const matchesMes = item.mes === selectedMes
      const matchesProducto = selectedProducto === "all" || item.producto === selectedProducto
      const matchesPlataforma = selectedPlataforma === "all" || item.plataforma === selectedPlataforma
      const matchesPais = selectedPais === "all" || item.pais === selectedPais

      return matchesMes && matchesProducto && matchesPlataforma && matchesPais
    })
  }, [selectedMes, selectedPais, selectedPlataforma, selectedProducto])

  const totals = useMemo(
    () =>
      filteredData.reduce(
        (acc, item) => {
          acc.presupuesto += item.presupuesto
          acc.gastado += item.gastado
          return acc
        },
        { presupuesto: 0, gastado: 0 },
      ),
    [filteredData],
  )

  const mesSeleccionado = resumenMensual[selectedMes] ?? resumenMensual["oct-2025"]
  const mesAnterior = mesSeleccionado?.anterior ? resumenMensual[mesSeleccionado.anterior] : undefined
  const variacion =
    mesSeleccionado && mesAnterior
      ? ((mesSeleccionado.total - mesAnterior.total) / mesAnterior.total) * 100
      : undefined

  const cardsVariation =
    mesSeleccionado && mesAnterior
      ? ((mesSeleccionado.cards - mesAnterior.cards) / mesAnterior.cards) * 100
      : undefined

  const pieData = useMemo(() => {
    const dataset = budgetData.filter((item) => {
      const matchesMes = item.mes === selectedMes
      const matchesProducto = pieFilters.producto === "all" || item.producto === pieFilters.producto
      const matchesPlataforma = pieFilters.plataforma === "all" || item.plataforma === pieFilters.plataforma
      const matchesPais = pieFilters.pais === "all" || item.pais === pieFilters.pais
      const matchesOs = pieFilters.os === "all" || item.os === pieFilters.os
      return matchesMes && matchesProducto && matchesPlataforma && matchesPais && matchesOs
    })

    const grouped = dataset.reduce<Record<string, number>>((acc, item) => {
      acc[item.plataforma] = (acc[item.plataforma] || 0) + item.gastado
      return acc
    }, {})

    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0)

    return Object.entries(grouped).map(([label, value], index) => ({
      label,
      value,
      percentage: total ? (value / total) * 100 : 0,
      color: PLATFORM_COLORS[label] || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }))
  }, [pieFilters, selectedMes])

  const pieTotal = pieData.reduce((sum, segment) => sum + segment.value, 0)

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }),
    [],
  )

  const handlePieFilterChange = (key: keyof typeof pieFilters, value: string) => {
    setPieFilters((prev) => ({ ...prev, [key]: value }))
  }

  const DonutTooltip = (props: TooltipProps<number, string> & { payload?: any[] }) => {
    const { active, payload } = props
    if (!active || !payload?.length) return null
    const item = payload[0]
    const label = item?.name
    const value = item?.value ?? 0
    return (
      <div className="rounded-lg border border-gray-200 bg-white/90 px-3 py-2 shadow-md text-sm text-[#053634]">
        <p className="font-semibold">{label}</p>
        <p className="text-[#00DBBF]">{currencyFormatter.format(value)}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Presupuesto</h1>
          <p className="text-gray-600">Conecta tu Google Sheet para ver la ejecución consolidada por mercado.</p>
        </div>

        <Card className="p-4 rounded-2xl border border-dashed border-[#00DBBF]/40 bg-white/70">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#053634]">Integración pendiente</p>
              <p className="text-sm text-gray-600">Conectar al agente de Astro para mostrar datos en vivo desde tu sheet.</p>
            </div>
            <Button variant="outline" className="rounded-xl border-[#00DBBF] text-[#00DBBF] hover:bg-[#00DBBF]/10">
              <Link2 className="w-4 h-4 mr-2" />
              Iniciar conexión
            </Button>
          </div>
        </Card>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <span className="text-sm text-gray-700">Mes</span>
          <Select value={selectedMes} onValueChange={setSelectedMes}>
            <SelectTrigger className="w-full rounded-xl bg-white md:w-64">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(resumenMensual).map(([value, meta]) => (
                <SelectItem key={value} value={value}>
                  {meta.etiqueta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-[#00DBBF]/10 to-[#053634]/10 border-2 border-[#00DBBF]/30">
            <p className="text-sm text-gray-700 mb-2">Costo total del mes</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#053634]">${mesSeleccionado.total.toLocaleString()}</h2>
            {variacion !== undefined && mesAnterior && (
              <p className="mt-4 flex items-center gap-2 text-sm">
                {variacion >= 0 ? <ArrowUpRight className="w-4 h-4 text-[#10B981]" /> : <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />}
                <span className="font-semibold text-[#053634]">
                  {variacion >= 0 ? "+" : ""}
                  {variacion.toFixed(1)}%
                </span>
                <span className="text-gray-600">vs {mesAnterior.etiqueta}</span>
              </p>
            )}
          </Card>
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-[#F5F7F2] to-white border-2 border-[#00DBBF]/20">
            <p className="text-sm text-gray-700 mb-2">Costo total del mes en Cards</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#053634]">${mesSeleccionado.cards.toLocaleString()}</h2>
            {cardsVariation !== undefined && mesAnterior && (
              <p className="mt-4 flex items-center gap-2 text-sm">
                {cardsVariation >= 0 ? <ArrowUpRight className="w-4 h-4 text-[#10B981]" /> : <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />}
                <span className="font-semibold text-[#053634]">
                  {cardsVariation >= 0 ? "+" : ""}
                  {cardsVariation.toFixed(1)}%
                </span>
                <span className="text-gray-600">vs {mesAnterior.etiqueta}</span>
              </p>
            )}
          </Card>
        </div>

        {/* Distribution Chart */}
        <Card className="p-6 rounded-2xl bg-white border border-[#E6EFE8] shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#053634]">Distribución por Plataforma</p>
              <p className="text-xs text-gray-500">Basado en {resumenMensual[selectedMes].etiqueta}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end text-xs">
              <select
                className="w-28 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[#053634]"
                value={pieFilters.producto}
                onChange={(e) => handlePieFilterChange("producto", e.target.value)}
              >
                <option value="all">Producto</option>
                {PRODUCT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[#053634]"
                value={pieFilters.plataforma}
                onChange={(e) => handlePieFilterChange("plataforma", e.target.value)}
              >
                <option value="all">Plataforma</option>
                {PLATFORM_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[#053634]"
                value={pieFilters.pais}
                onChange={(e) => handlePieFilterChange("pais", e.target.value)}
              >
                <option value="all">País</option>
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                className="w-28 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[#053634]"
                value={pieFilters.os}
                onChange={(e) => handlePieFilterChange("os", e.target.value)}
              >
                <option value="all">Sistema</option>
                {OS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {pieData.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500 min-h-[220px] text-center">
              No hay datos con los filtros seleccionados.
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="relative mx-auto aspect-square w-full max-w-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius="60%"
                      outerRadius="90%"
                      paddingAngle={2}
                      strokeWidth={2}
                    >
                      {pieData.map((segment) => (
                        <Cell key={segment.label} fill={segment.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-semibold text-[#053634]">{currencyFormatter.format(pieTotal)}</p>
                </div>
              </div>
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                {pieData.map((segment) => (
                  <div key={segment.label} className="flex items-center justify-between rounded-xl border border-[#E6EFE8] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm font-medium text-[#053634]">{segment.label}</span>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-[#053634]">{currencyFormatter.format(segment.value)}</p>
                      <p className="text-xs text-gray-500">{segment.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 rounded-2xl bg-white">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Producto</p>
              <select
                value={selectedProducto}
                onChange={(e) => setSelectedProducto(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
              >
                <option value="all">Todos los productos</option>
                <option value="Global Card">Global Card</option>
                <option value="Local Card">Local Card</option>
                <option value="USDT">USDT</option>
                <option value="Currency Exchange">Currency Exchange</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Plataforma</p>
              <select
                value={selectedPlataforma}
                onChange={(e) => setSelectedPlataforma(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
              >
                <option value="all">Todas las plataformas</option>
                <option value="Meta">Meta</option>
                <option value="Google">Google</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">País</p>
              <select
                value={selectedPais}
                onChange={(e) => setSelectedPais(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
              >
                <option value="all">Todos los países</option>
                <option value="Argentina">Argentina</option>
                <option value="Brasil">Brasil</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Budget Table */}
        <Card className="p-6 rounded-2xl bg-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Costo total con filtros aplicados</p>
              <p className="text-2xl font-bold text-[#053634]">${totals.gastado.toLocaleString()}</p>
            </div>
            <div className="text-sm text-gray-600">
              Planificado: <span className="font-semibold text-[#053634]">${totals.presupuesto.toLocaleString()}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Producto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Plataforma</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">País</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">OS</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Presupuesto</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Gastado</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">%</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-[#00DBBF]/5 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-[#053634]">{item.producto}</td>
                    <td className="py-4 px-4 text-gray-600">{item.plataforma}</td>
                    <td className="py-4 px-4 text-gray-600">{item.pais}</td>
                    <td className="py-4 px-4 text-gray-600">{item.os}</td>
                    <td className="py-4 px-4 text-right font-semibold text-[#053634]">
                      ${item.presupuesto.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">${item.gastado.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00DBBF] rounded-full" style={{ width: `${item.porcentaje}%` }} />
                        </div>
                        <span className="text-sm font-medium text-[#053634]">{item.porcentaje}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
