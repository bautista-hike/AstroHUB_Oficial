"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, Target, Zap } from "lucide-react"

type Report = {
  id: string
  title: string
  date: string
  tag: string
  summary: string
  insights: string[]
  resourceUrl: string
}

const reports: Report[] = [
  {
    id: "report-optimizations-oct-2025",
    title: "Optimizaciones de campañas – Octubre 2025",
    tag: "Optimizaciones",
    date: "31/10/2025",
    summary:
      "Resumen de las optimizaciones aplicadas en audiencias y estructura de Search para las campañas de APP y Engagement durante octubre, con foco en mejorar eficiencia y control del presupuesto.",
    insights: [
      "Revisión de audiencias: se consolidaron segmentos con mejor desempeño y se pausaron audiencias de bajo rendimiento.",
      "Ajustes en campañas de Search: reorganización por intención (marca, genéricas, competidores) para mejorar calidad de tráfico.",
      "Se definió un esquema de seguimiento periódico para iterar sobre audiencias y términos de búsqueda según resultados.",
    ],
    resourceUrl: "/files/optimizaciones-octubre-2025.pdf",
  },
  {
    id: "report-creatives-oct-2025",
    title: "Revisión de Creativos – Octubre 2025",
    tag: "Creativos",
    date: "31/10/2025",
    summary:
      "Se identificaron creativos desactualizados en tasas y fees y falta de variedad en formatos de video por producto y país. Se definieron acciones de renovación para APP y Engagement en Argentina y Brasil.",
    insights: [
      "Renovar creativos que muestran tasas o fees desactualizados (travelers, USDT y Currency Exchange).",
      "Incrementar el volumen y la variedad de videos por producto (Global Card, Local Card, USDT y Currency Exchange) en Meta, Google y TikTok.",
      "Planificar creatividades específicas para Black Friday, Aguinaldo, Navidad y Verano–PIX con foco en Global Card y Local Card.",
    ],
    resourceUrl: "https://revision-de-creativos-ca-n8t88dw.gamma.site/",
  },
  {
    id: "report-audiencias-app-performance",
    title: "Análisis de Audiencias – APP Performance",
    tag: "Audiencias",
    date: "Octubre 2025",
    summary:
      "Comparación entre campañas con audiencias definidas y campañas sin segmentación específica para APP Performance. Las campañas con audiencias muestran mejor rendimiento general.",
    insights: [
      "Las campañas con audiencias (first-party, intereses y similares) obtuvieron mejores resultados en ROAS y CPA que las campañas sin segmentación.",
      "Las audiencias basadas en usuarios de la app y compradores recientes fueron las más consistentes en performance.",
      "Se recomienda priorizar campañas con audiencias estructuradas y usar campañas broad como test o complemento.",
    ],
    resourceUrl:
      "https://www.notion.so/abndigital/An-lisis-Audiencias-APP-Performance-280432d521828072a16be801af2c06bb",
  },
]

export function ReportesSection() {
  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Reportes e Insights</h1>
          <p className="text-gray-600">Análisis estratégico de performance y creatividades</p>
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
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#053634]">{report.title}</h3>
                      <Badge className="bg-[#00DBBF]/10 text-[#00DBBF]">{report.tag}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                  <Button
                    asChild
                    className="rounded-xl bg-[#00DBBF] hover:bg-[#00DBBF]/90 text-white flex-shrink-0"
                  >
                    <a href={report.resourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      Abrir recurso
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-[#00DBBF]/10 to-[#053634]/5 rounded-xl mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <TrendingUp className="w-5 h-5 text-[#00DBBF]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Resumen</p>
                      <p className="font-semibold text-[#053634] leading-relaxed">{report.summary}</p>
                    </div>
                  </div>
                </div>

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
                        transition={{ delay: 0.05 * idx }}
                        className="flex items-start gap-3 p-3 bg-[#F5F7F2] rounded-lg hover:bg-[#00DBBF]/5 transition-colors"
                      >
                        <Target className="w-4 h-4 text-[#00DBBF] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#053634] leading-snug">{insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
