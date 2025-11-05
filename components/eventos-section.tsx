"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { useState } from "react"

export function EventosSection() {
  const [activeTab, setActiveTab] = useState<"google" | "meta" | "tiktok">("google")
  const [filters, setFilters] = useState({ producto: "todos", os: "todos" })

  const googleEvents = [
    {
      sugerido: true,
      nombreEvento: "first_open",
      eventoSingular: "First Open",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "session_start",
      eventoSingular: "Session Start",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "sign_up",
      eventoSingular: "Sign Up",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "purchase",
      eventoSingular: "Purchase",
      android: true,
      ios: true,
      includeValor: true,
    },
    {
      sugerido: false,
      nombreEvento: "add_payment_info",
      eventoSingular: "Add Payment Info",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "add_to_cart",
      eventoSingular: "Add to Cart",
      android: true,
      ios: false,
      includeValor: true,
    },
  ]

  const metaEvents = [
    {
      sugerido: true,
      nombreEvento: "fb_mobile_activate_app",
      eventoSingular: "App Activation",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "fb_mobile_complete_registration",
      eventoSingular: "Complete Registration",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "fb_mobile_purchase",
      eventoSingular: "Purchase",
      android: true,
      ios: true,
      includeValor: true,
    },
    {
      sugerido: false,
      nombreEvento: "fb_mobile_add_payment_info",
      eventoSingular: "Add Payment Info",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "fb_mobile_add_to_cart",
      eventoSingular: "Add to Cart",
      android: true,
      ios: true,
      includeValor: true,
    },
  ]

  const tiktokEvents = [
    {
      sugerido: true,
      nombreEvento: "LaunchAPP",
      eventoSingular: "Launch App",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "CompleteRegistration",
      eventoSingular: "Complete Registration",
      android: true,
      ios: true,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "Purchase",
      eventoSingular: "Purchase",
      android: true,
      ios: true,
      includeValor: true,
    },
    {
      sugerido: false,
      nombreEvento: "AddPaymentInfo",
      eventoSingular: "Add Payment Info",
      android: true,
      ios: false,
      includeValor: false,
    },
    {
      sugerido: true,
      nombreEvento: "AddToCart",
      eventoSingular: "Add to Cart",
      android: true,
      ios: true,
      includeValor: true,
    },
  ]

  const currentEvents = activeTab === "google" ? googleEvents : activeTab === "meta" ? metaEvents : tiktokEvents

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#053634] mb-2">Eventos</h1>
          <p className="text-gray-600">Matriz de eventos para campañas de App (tracking por plataforma)</p>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: "google", label: "Google Ads / Firebase" },
            { id: "meta", label: "Meta Ads" },
            { id: "tiktok", label: "TikTok Ads" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                activeTab === tab.id ? "bg-[#00DBBF] text-white" : "text-gray-600 hover:text-[#053634] hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="p-4 rounded-2xl bg-white">
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Producto</label>
              <select
                value={filters.producto}
                onChange={(e) => setFilters({ ...filters, producto: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="global-card">Global Card</option>
                <option value="local-card">Local Card</option>
                <option value="usdt">USDT</option>
                <option value="currency-exchange">Currency Exchange</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">OS</label>
              <select
                value={filters.os}
                onChange={(e) => setFilters({ ...filters, os: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00DBBF] focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
              </select>
            </div>
          </div>
        </Card>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 rounded-2xl bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Sugerido</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                      Nombre de evento/plataforma
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Evento singular</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">Android</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">iOS</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">Incluye valor</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEvents.map((event, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        {event.sugerido ? (
                          <Badge className="bg-green-100 text-green-700">Sí</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">No</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-[#053634]">{event.nombreEvento}</td>
                      <td className="py-4 px-4 font-medium text-gray-700">{event.eventoSingular}</td>
                      <td className="py-4 px-4 text-center">
                        {event.android ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {event.ios ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {event.includeValor ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Todos los eventos contienen trazabilidad (User ID) para seguimiento completo del
                usuario.
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
