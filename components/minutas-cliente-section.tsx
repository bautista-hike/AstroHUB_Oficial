"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"

export function MinutasClienteSection() {
  const minutas = [
    {
      fecha: "20/10/2025",
      tema: "Revisión de Performance Q3",
      responsable: "ABN Team",
      proximosPasos: "Ajustar presupuesto para Q4, optimizar creativos de Brasil",
      estado: "completado",
    },
    {
      fecha: "15/10/2025",
      tema: "Lanzamiento Campaña USDT",
      responsable: "AstroPay Marketing",
      proximosPasos: "Aprobar creativos finales, definir targeting",
      estado: "en-curso",
    },
    {
      fecha: "08/10/2025",
      tema: "Análisis de Nuevos Mercados",
      responsable: "ABN Strategy",
      proximosPasos: "Investigar oportunidades en México y Colombia",
      estado: "pendiente",
    },
    {
      fecha: "01/10/2025",
      tema: "Optimización de Landing Pages",
      responsable: "AstroPay Dev Team",
      proximosPasos: "Implementar cambios sugeridos, A/B testing",
      estado: "en-curso",
    },
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "bg-green-100 text-green-700"
      case "en-curso":
        return "bg-blue-100 text-blue-700"
      case "pendiente":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "completado":
        return "Completado"
      case "en-curso":
        return "En Curso"
      case "pendiente":
        return "Pendiente"
      default:
        return estado
    }
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#053634] mb-2">Minutas Cliente</h1>
            <p className="text-gray-600">Seguimiento de reuniones y próximos pasos</p>
          </div>
          <Button className="bg-[#00DBBF] hover:bg-[#00DBBF]/90 text-white rounded-xl">
            <Upload className="w-4 h-4 mr-2" />
            Subir Minuta
          </Button>
        </div>

        <div className="space-y-4">
          {minutas.map((minuta, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 rounded-2xl bg-white hover:shadow-lg transition-all">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-[#00DBBF]/10 rounded-xl">
                    <FileText className="w-6 h-6 text-[#00DBBF]" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha</p>
                      <p className="font-semibold text-[#053634]">{minuta.fecha}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tema</p>
                      <p className="font-semibold text-[#053634]">{minuta.tema}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Responsable</p>
                      <p className="font-medium text-gray-700">{minuta.responsable}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Próximos Pasos</p>
                      <p className="text-sm text-gray-700">{minuta.proximosPasos}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estado</p>
                      <Badge className={getEstadoColor(minuta.estado)}>{getEstadoLabel(minuta.estado)}</Badge>
                    </div>
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
