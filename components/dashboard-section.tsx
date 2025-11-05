import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, MousePointerClick, Target } from "lucide-react"

const chartData = [
  { platform: "Google", spend: 45000, conversions: 1250 },
  { platform: "Meta", spend: 38000, conversions: 980 },
  { platform: "TikTok", spend: 22000, conversions: 650 },
]

const kpis = [
  { label: "Total Spend", value: "$105,000", icon: DollarSign, change: "+12%" },
  { label: "Conversions", value: "2,880", icon: Target, change: "+8%" },
  { label: "CTR", value: "3.2%", icon: MousePointerClick, change: "+0.4%" },
  { label: "CPA", value: "$36.46", icon: TrendingUp, change: "-5%" },
]

export function DashboardSection() {
  return (
    <section id="dashboard" className="py-16 bg-gradient-to-br from-[#053634] to-[#053634]/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/abstract-tech-pattern.png')] opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-balance">
            Your campaigns, metrics, and creatives – all in one place.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="bg-white/95 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <kpi.icon className="w-5 h-5 text-[#00DBBF]" />
                  <span className="text-xs font-medium text-[#3FD861]">{kpi.change}</span>
                </div>
                <p className="text-sm text-[#053634]/60 mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-[#053634]">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/95 backdrop-blur border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-[#053634] mb-6">Platform Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#053634" opacity={0.1} />
                <XAxis dataKey="platform" stroke="#053634" />
                <YAxis stroke="#053634" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #053634",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="spend" fill="#00DBBF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conversions" fill="#3FD861" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Button size="lg" className="bg-[#00DBBF] hover:bg-[#00DBBF]/90 text-[#053634] font-semibold shadow-lg">
          View by Funnel Stage
        </Button>
      </div>
    </section>
  )
}
