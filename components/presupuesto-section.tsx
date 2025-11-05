"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"
import { useState } from "react"

export function PresupuestoSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducto, setSelectedProducto] = useState("all")
  const [selectedPlataforma, setSelectedPlataforma] = useState("all")
  const [selectedPais, setSelectedPais] = useState("all")
  const [aiResponse, setAiResponse] = useState("")

  const budgetData = [
    {
      producto: "Global Card",
      plataforma: "Meta",
      pais: "Argentina",
      os: "Android",
      presupuesto: 15000,
      gastado: 12500,
      porcentaje: 83,
    },
    {
      producto: "Global Card",
      plataforma: "Google",
      pais: "Argentina",
      os: "iOS",
      presupuesto: 12000,
      gastado: 9800,
      porcentaje: 82,
    },
    {
      producto: "Local Card",
      plataforma: "Meta",
      pais: "Brasil",
      os: "Android",
      presupuesto: 18000,
      gastado: 15200,
      porcentaje: 84,
    },
    {
      producto: "USDT",
      plataforma: "TikTok",
      pais: "Argentina",
      os: "Android",
      presupuesto: 8000,
      gastado: 6400,
      porcentaje: 80,
    },
    {
      producto: "Currency Exchange",
      plataforma: "Google",
      pais: "Brasil",
      os: "iOS",
      presupuesto: 10000,
      gastado: 7500,
      porcentaje: 75,
    },
    {
      producto: "Global Card",
      plataforma: "Meta",
      pais: "Brasil",
      os: "Android",
      presupuesto: 20000,
      gastado: 18500,
      porcentaje: 93,
    },
  ]

  const filteredData = budgetData.filter((item) => {
    const matchesSearch =
      item.producto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plataforma.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pais.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProducto = selectedProducto === "all" || item.producto === selectedProducto
    const matchesPlataforma = selectedPlataforma === "all" || item.plataforma === selectedPlataforma
    const matchesPais = selectedPais === "all" || item.pais === selectedPais

    return matchesSearch && matchesProducto && matchesPlataforma && matchesPais
  })

  const handleAiQuery = () => {
    setAiResponse(
      `Tu presupuesto en ${selectedPlataforma !== "all" ? selectedPlataforma : "todas las plataformas"} para ${selectedPais !== "all" ? selectedPais : "todos los países"} es de $${filteredData.reduce((sum, item) => sum + item.presupuesto, 0).toLocaleString()}`,
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
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Centro de Presupuestos</h1>
          <p className="text-gray-600">
            Gestiona y analiza la distribución de presupuesto por producto, plataforma y país
          </p>
        </div>

        {/* AI Assistant Card */}
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-[#00DBBF]/10 to-[#053634]/5 border-[#00DBBF]/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#00DBBF]/20">
              <Sparkles className="w-6 h-6 text-[#00DBBF]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#053634] mb-2">Asistente AI</h3>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Pregunta sobre presupuestos..."
                  className="flex-1 rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && handleAiQuery()}
                />
                <Button onClick={handleAiQuery} className="bg-[#00DBBF] hover:bg-[#00DBBF]/90 text-white rounded-xl">
                  Consultar
                </Button>
              </div>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white rounded-xl border border-[#00DBBF]/30"
                >
                  <p className="text-[#053634]">{aiResponse}</p>
                </motion.div>
              )}
            </div>
          </div>
        </Card>

        {/* Search and Filters */}
        <Card className="p-6 rounded-2xl bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por producto, plataforma, OS o país..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <select
              value={selectedProducto}
              onChange={(e) => setSelectedProducto(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
            >
              <option value="all">Todos los productos</option>
              <option value="Global Card">Global Card</option>
              <option value="Local Card">Local Card</option>
              <option value="USDT">USDT</option>
              <option value="Currency Exchange">Currency Exchange</option>
            </select>
            <select
              value={selectedPlataforma}
              onChange={(e) => setSelectedPlataforma(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
            >
              <option value="all">Todas las plataformas</option>
              <option value="Meta">Meta</option>
              <option value="Google">Google</option>
              <option value="TikTok">TikTok</option>
            </select>
            <select
              value={selectedPais}
              onChange={(e) => setSelectedPais(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
            >
              <option value="all">Todos los países</option>
              <option value="Argentina">Argentina</option>
              <option value="Brasil">Brasil</option>
            </select>
          </div>
        </Card>

        {/* Budget Table */}
        <Card className="p-6 rounded-2xl bg-white">
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
