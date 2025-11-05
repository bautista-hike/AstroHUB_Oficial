"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type BadgeType = "renovar" | "mejor"
type CreativeItem = { id: string; image: string; badge?: BadgeType }

// 🔧 Usa SIEMPRE rutas que abriste antes en el navegador (copy link del archivo en V0).
const AR_GOOGLE_LOCALCARD: CreativeItem[] = [
  { id: "GG_AR_LC_01", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_01_1.png" },
  { id: "GG_AR_LC_02", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_01_2.png", badge: "renovar" },
  { id: "GG_AR_LC_03", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_01_3.png" },
  { id: "GG_AR_LC_04", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_02.png" },
  { id: "GG_AR_LC_05", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_02_1.png" },
  { id: "GG_AR_LC_06", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_02_2.png", badge: "mejor" },
  { id: "GG_AR_LC_07", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_02_3.png" },
  { id: "GG_AR_LC_08", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_03.png" },
  { id: "GG_AR_LC_09", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_03_1.png" },
  { id: "GG_AR_LC_10", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_03_2.png" },
  { id: "GG_AR_LC_11", image: "/Creativos/ARG/LOCAL%20CARD/Local%20Card_ARG_03_3.png" },
]

// Estructura base (completá el resto cuando subas imágenes de esas carpetas)
const creatives = {
  argentina: {
    google: {
      "Global Card": [] as CreativeItem[],
      "Local Card": AR_GOOGLE_LOCALCARD,
      USDT: [] as CreativeItem[],
    },
    meta: { "Global Card": [] as CreativeItem[], "Local Card": [] as CreativeItem[], USDT: [] as CreativeItem[] },
    tiktok:{ "Global Card": [] as CreativeItem[], "Local Card": [] as CreativeItem[], USDT: [] as CreativeItem[] },
  },
  brazil: {
    google:{ "Global Card": [] as CreativeItem[], "Local Card": [] as CreativeItem[], USDT: [] as CreativeItem[] },
    meta:  { "Global Card": [] as CreativeItem[], "Local Card": [] as CreativeItem[], USDT: [] as CreativeItem[] },
    tiktok:{ "Global Card": [] as CreativeItem[], "Local Card": [] as CreativeItem[], USDT: [] as CreativeItem[] },
  },
}

function BadgePill({ type }: { type: BadgeType }) {
  const text = type === "renovar" ? "Renovar" : "Mejor rendimiento"
  const cls  = type === "renovar" ? "bg-red-600 text-white" : "bg-green-600 text-white"
  return <span className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{text}</span>
}

function CreativeTile({ item }: { item: CreativeItem }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
      <img
        src={item.image}
        alt={item.id}
        className="w-full h-auto object-contain bg-[#F5F7F2]"
        loading="lazy"
        onError={(e) => {
          console.error("No carga:", item.id, "→", item.image)
          ;(e.currentTarget as HTMLImageElement).style.border = "2px solid #f00"
        }}
      />
      {item.badge && <BadgePill type={item.badge} />}
    </div>
  )
}

export function CreativesSection() {
  const [country, setCountry] = useState<"argentina" | "brazil">("argentina")

  return (
    <section id="creatives" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-8"><h2 className="text-3xl font-bold text-[#053634]">Creativos</h2></div>

        <Tabs value={country} onValueChange={(v) => setCountry(v as "argentina" | "brazil")} className="space-y-6">
          <TabsList className="bg-[#F5F7F2] p-1">
            <TabsTrigger value="argentina" className="data-[state=active]:bg-white data-[state=active]:text-[#053634]">Argentina</TabsTrigger>
            <TabsTrigger value="brazil" className="data-[state=active]:bg-white data-[state=active]:text-[#053634]">Brasil</TabsTrigger>
          </TabsList>

          <TabsContent value={country} className="space-y-6">
            <Tabs defaultValue="google" className="space-y-6">
              <TabsList className="bg-[#F5F7F2] p-1">
                <TabsTrigger value="google" className="data-[state=active]:bg-white">Google</TabsTrigger>
                <TabsTrigger value="meta" className="data-[state=active]:bg-white">Meta</TabsTrigger>
                <TabsTrigger value="tiktok" className="data-[state=active]:bg-white">TikTok</TabsTrigger>
              </TabsList>

              {(["google","meta","tiktok"] as const).map((platform) => (
                <TabsContent key={platform} value={platform} className="space-y-10">
                  {Object.entries(creatives[country][platform]).map(([product, list]) => (
                    <section key={product} className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#053634]">{product}</h3>
                      {list.length === 0 ? (
                        <p className="text-[#053634]/60 text-sm">Sin creativos cargados aún.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {list.map((item) => <CreativeTile key={item.id} item={item} />)}
                        </div>
                      )}
                    </section>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
