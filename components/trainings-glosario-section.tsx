"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, PlayCircle, BookOpen } from "lucide-react"
import { useState } from "react"

export function TrainingsGlosarioSection() {
  const [activeTab, setActiveTab] = useState<"trainings" | "glosario">("trainings")
  const [searchTerm, setSearchTerm] = useState("")

  const trainings = [
    {
      title: "Introducción a Meta Ads Manager",
      date: "15/10/2025",
      duration: "45 min",
      link: "#",
      type: "video",
    },
    {
      title: "Optimización de Campañas en Google Ads",
      date: "08/10/2025",
      duration: "1h 20min",
      link: "#",
      type: "video",
    },
    {
      title: "TikTok Ads: Mejores Prácticas 2025",
      date: "01/10/2025",
      duration: "35 min",
      link: "#",
      type: "video",
    },
    {
      title: "Análisis de Métricas y KPIs",
      date: "25/09/2025",
      duration: "50 min",
      link: "#",
      type: "documento",
    },
  ]

  const glosario = [
    { term: "CTR", definition: "Click-Through Rate - Porcentaje de clics sobre impresiones" },
    { term: "CPC", definition: "Cost Per Click - Costo promedio por cada clic en el anuncio" },
    { term: "CPA", definition: "Cost Per Acquisition - Costo promedio por cada conversión" },
    { term: "ROAS", definition: "Return On Ad Spend - Retorno de inversión publicitaria" },
    { term: "CPM", definition: "Cost Per Mille - Costo por cada mil impresiones" },
    { term: "CVR", definition: "Conversion Rate - Porcentaje de conversiones sobre clics" },
    { term: "Impresiones", definition: "Número de veces que se muestra un anuncio" },
    { term: "Alcance", definition: "Número de personas únicas que vieron el anuncio" },
    { term: "Frecuencia", definition: "Promedio de veces que una persona ve el anuncio" },
    { term: "Engagement", definition: "Interacciones totales con el contenido (likes, shares, comments)" },
  ]

  const filteredGlosario = glosario.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Trainings & Glosario</h1>
          <p className="text-gray-600">Materiales de capacitación y definiciones de métricas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("trainings")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "trainings" ? "bg-[#00DBBF] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Trainings
          </button>
          <button
            onClick={() => setActiveTab("glosario")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "glosario" ? "bg-[#00DBBF] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Glosario
          </button>
        </div>

        {activeTab === "trainings" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainings.map((training, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 rounded-2xl bg-white hover:shadow-lg transition-all group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#00DBBF]/10 rounded-xl group-hover:bg-[#00DBBF] transition-colors">
                      <PlayCircle className="w-8 h-8 text-[#00DBBF] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#053634] mb-2 group-hover:text-[#00DBBF] transition-colors">
                        {training.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span>{training.date}</span>
                        <span>•</span>
                        <span>{training.duration}</span>
                      </div>
                      <Badge className="bg-[#053634]/10 text-[#053634]">{training.type}</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-4 rounded-2xl bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar término o definición..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlosario.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-5 rounded-2xl bg-white hover:shadow-lg transition-all hover:border-[#00DBBF]/30">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00DBBF]/10 rounded-lg">
                        <BookOpen className="w-5 h-5 text-[#00DBBF]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#053634] mb-1">{item.term}</h4>
                        <p className="text-sm text-gray-600">{item.definition}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
