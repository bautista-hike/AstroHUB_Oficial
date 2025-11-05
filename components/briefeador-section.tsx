"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useState } from "react"

export function BriefeadorSection() {
  const [formData, setFormData] = useState({
    producto: "",
    pais: "",
    objetivo: "",
    kpis: "",
    fechaEntrega: "",
  })
  const [generatedBrief, setGeneratedBrief] = useState("")

  const handleGenerate = () => {
    const brief = `
BRIEF DE CAMPAÑA - ${formData.producto.toUpperCase()}

País: ${formData.pais}
Objetivo: ${formData.objetivo}
KPIs Esperados: ${formData.kpis}
Fecha de Entrega: ${formData.fechaEntrega}

ESTRATEGIA RECOMENDADA:
- Enfoque en awareness y consideración para ${formData.producto}
- Segmentación por intereses financieros y tecnológicos
- Creativos con mensajes de seguridad y facilidad de uso
- Testing A/B de formatos (video vs imagen)

PLATAFORMAS SUGERIDAS:
- Meta: Alcance masivo y segmentación detallada
- Google: Intención de búsqueda alta
- TikTok: Engagement con audiencia joven

PRÓXIMOS PASOS:
1. Aprobar brief con cliente
2. Desarrollar creativos
3. Configurar campañas
4. Lanzamiento y monitoreo
    `
    setGeneratedBrief(brief)
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Briefeador para Fichi</h1>
          <p className="text-gray-600">Generador inteligente de briefs de campaña</p>
        </div>

        <Card className="p-8 rounded-2xl bg-white">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#053634] mb-2">Producto</label>
                <select
                  value={formData.producto}
                  onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
                >
                  <option value="">Seleccionar producto</option>
                  <option value="Global Card">Global Card</option>
                  <option value="Local Card">Local Card</option>
                  <option value="USDT">USDT</option>
                  <option value="Currency Exchange">Currency Exchange</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#053634] mb-2">País</label>
                <select
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-[#053634] focus:outline-none focus:ring-2 focus:ring-[#00DBBF]"
                >
                  <option value="">Seleccionar país</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Brasil">Brasil</option>
                  <option value="México">México</option>
                  <option value="Colombia">Colombia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#053634] mb-2">Objetivo de la Campaña</label>
              <Input
                placeholder="Ej: Aumentar awareness de Global Card en Brasil"
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#053634] mb-2">KPIs Esperados</label>
              <Input
                placeholder="Ej: 100k impresiones, CTR 3%, CPA $15"
                value={formData.kpis}
                onChange={(e) => setFormData({ ...formData, kpis: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#053634] mb-2">Fecha de Entrega</label>
              <Input
                type="date"
                value={formData.fechaEntrega}
                onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full bg-[#00DBBF] hover:bg-[#00DBBF]/90 text-white rounded-xl py-6 text-lg font-semibold"
              disabled={!formData.producto || !formData.pais || !formData.objetivo}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generar Brief
            </Button>
          </div>
        </Card>

        {generatedBrief && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 rounded-2xl bg-gradient-to-br from-[#053634] to-[#002E27] text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#00DBBF]" />
                Brief Generado
              </h3>
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/90">
                {generatedBrief}
              </pre>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
