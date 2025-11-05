import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const events = [
  { name: "FTT", description: "First Time Transaction", color: "#00DBBF" },
  { name: "Account Creation", description: "User Registration", color: "#3FD861" },
  { name: "Checkout", description: "Payment Initiated", color: "#3D9BE9" },
  { name: "Install", description: "App Installation", color: "#CD83FF" },
]

const funnelSteps = ["Impression", "Click", "Install", "Register", "FTT"]

export function EventsReportsSection() {
  return (
    <section id="events" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#053634] mb-8">Events & Reports</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#F5F7F2] border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-[#053634] mb-6">Key Tracked Events</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.name} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                    <div>
                      <p className="font-semibold text-[#053634]">{event.name}</p>
                      <p className="text-sm text-[#053634]/60">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#F5F7F2] border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-[#053634] mb-6">Conversion Funnel</h3>
              <div className="flex items-center justify-between">
                {funnelSteps.map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#053634] to-[#00DBBF] flex items-center justify-center mb-2">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-xs text-[#053634] text-center">{step}</span>
                    </div>
                    {index < funnelSteps.length - 1 && <ArrowRight className="w-4 h-4 text-[#053634]/30 mx-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-[#053634] to-[#053634]/90 border-0 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Performance Dashboard</h3>
            <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center backdrop-blur">
              <p className="text-white/60">Looker Studio Embed Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
