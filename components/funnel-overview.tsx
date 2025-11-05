import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Target, Users } from "lucide-react"

const funnelStages = [
  {
    stage: "Awareness",
    icon: Eye,
    color: "#3D9BE9",
    platforms: [
      {
        name: "Google",
        products: ["Global Card", "Local Card", "USDT"],
      },
      {
        name: "Meta",
        products: ["Global Card", "Local Card", "USDT"],
      },
      {
        name: "TikTok",
        products: ["Global Card", "Local Card", "USDT"],
      },
    ],
  },
  {
    stage: "Performance",
    icon: Target,
    color: "#00DBBF",
    platforms: [
      {
        name: "Google",
        products: ["Global Card", "Local Card", "USDT"],
      },
      {
        name: "Meta",
        products: ["Global Card", "Local Card", "USDT"],
      },
      {
        name: "TikTok",
        products: ["Global Card", "Local Card", "USDT"],
      },
    ],
  },
  {
    stage: "Engagement",
    icon: Users,
    color: "#3FD861",
    platforms: [
      {
        name: "Google",
        products: ["Global Card", "Local Card", "USDT"],
      },
      {
        name: "Meta",
        products: ["Global Card", "Local Card", "USDT"],
      },
      {
        name: "TikTok",
        products: ["Global Card", "Local Card", "USDT"],
      },
    ],
  },
]

export function FunnelOverview() {
  return (
    <section id="funnel-overview" className="py-16 bg-[#F5F7F2]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#053634] mb-8">Funnel Overview</h2>

        <div className="space-y-6">
          {funnelStages.map((funnel) => (
            <Card key={funnel.stage} className="bg-white border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex items-center gap-4" style={{ backgroundColor: `${funnel.color}15` }}>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: funnel.color }}
                  >
                    <funnel.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#053634]">{funnel.stage}</h3>
                </div>

                <div className="p-6 space-y-6">
                  {funnel.platforms.map((platform) => (
                    <div key={platform.name} className="space-y-3">
                      <h4 className="text-lg font-semibold text-[#053634]">{platform.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {platform.products.map((product) => (
                          <Button
                            key={product}
                            variant="outline"
                            size="sm"
                            className="border-[#053634]/20 hover:bg-[#00DBBF]/10 hover:border-[#00DBBF] bg-transparent"
                          >
                            {product}
                            <span className="ml-2 text-xs text-[#00DBBF]">View Creatives →</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
