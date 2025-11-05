"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, Target, Zap } from "lucide-react"
import { useState } from "react"

export function ReportesSection() {
  const [viewMode, setViewMode] = useState<"insights" | "files">("insights")

  const reports = [
    {
      id: 1,
      name: "Reporte Mensual - Octubre 2025",
      date: "31/10/2025",
      summary: "Incremento del 23% en conversiones respecto al mes anterior",
      insights: [
        "Meta superó a Google en ROAS por primera vez (5.2x vs 4.1x)",
        "Las campañas de Global Card en Brasil tuvieron el mejor rendimiento",
        "Se recomienda aumentar presupuesto en TikTok para Q4",
      ],
      type: "monthly",
    },
    {
      id: 2,
      name: "Análisis de Creativos - Q3 2025",
      date: "30/09/2025",
      summary: "Los creativos con enfoque en seguridad tuvieron 40% más engagement",
      insights: [
        "Formato video superó a imagen estática en 2.3x",
        "Mensajes sobre 'sin fronteras' resonaron mejor en Argentina",
        "Creativos con testimoniales aumentaron conversiones en 18%",
      ],
      type: "creative",
    },
    {
      id: 3,
      name: "Performance por Producto - Septiembre",
      date: "30/09/2025",
      summary: "USDT mostró el mayor crecimiento con +45% en nuevos usuarios",
      insights: [
        "Global Card mantiene liderazgo en volumen total",
        "Currency Exchange tiene el CPA más bajo ($8.50)",
        "Local Card necesita optimización en Brasil",
      ],
      type: "product",
    },
  ]

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#053634] mb-2">Reportes e Insights</h1>
            <p className="text-gray-600">Análisis y conclusiones clave de performance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "insights" ? "default" : "outline"}
              onClick={() => setViewMode("insights")}
              className={viewMode === "insights" ? "bg-[#00DBBF] hover:bg-[#00DBBF]/90" : ""}
            >
              Ver Insights
            </Button>
            <Button
              variant={viewMode === "files" ? "default" : "outline"}
              onClick={() => setViewMode("files")}
              className={viewMode === "files" ? "bg-[#00DBBF] hover:bg-[#00DBBF]/90" : ""}
            >
              Ver Archivos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 rounded-2xl bg-white hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#053634]">{report.name}</h3>
                      <Badge className="bg-[#00DBBF]/10 text-[#00DBBF]">
                        {report.type === "monthly" ? "Mensual" : report.type === "creative" ? "Creativos" : "Producto"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                  <Button variant="outline" className="rounded-xl bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-[#00DBBF]/10 to-[#053634]/5 rounded-xl mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <TrendingUp className="w-5 h-5 text-[#00DBBF]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Resumen</p>
                      <p className="font-semibold text-[#053634]">{report.summary}</p>
                    </div>
                  </div>
                </div>

                {viewMode === "insights" && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#053634] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#00DBBF]" />
                      Insights Destacados
                    </h4>
                    <div className="space-y-2">
                      {report.insights.map((insight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-start gap-3 p-3 bg-[#F5F7F2] rounded-lg hover:bg-[#00DBBF]/5 transition-colors"
                        >
                          <Target className="w-4 h-4 text-[#00DBBF] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#053634]">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
