import { Card, CardContent } from "@/components/ui/card"

const nomenclatureExamples = [
  {
    example: "GG_AR_AON_APP_ACE_ANDROID_GLOBALCARD",
    meaning: "Google / Argentina / Always On / App Campaign / Android / Product GlobalCard",
  },
  {
    example: "META_BR_PERF_USDT_V1",
    meaning: "Meta / Brazil / Performance / Product USDT / Version 1",
  },
  {
    example: "TT_AR_ENG_LOCALCARD_V2",
    meaning: "TikTok / Argentina / Engagement / Product LocalCard / Version 2",
  },
  {
    example: "GG_BR_AWR_SEARCH_GLOBALCARD",
    meaning: "Google / Brazil / Awareness / Search Campaign / Product GlobalCard",
  },
]

export function NomenclatureSection() {
  return (
    <section id="nomenclature" className="py-16 bg-[#F5F7F2]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#053634] mb-8">Nomenclature</h2>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-6">
            <p className="text-[#053634]/70 mb-6">
              Campaign naming system for consistent tracking and organization across platforms.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#053634]/10">
                    <th className="text-left py-3 px-4 font-semibold text-[#053634]">Example</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#053634]">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {nomenclatureExamples.map((item, index) => (
                    <tr key={index} className="border-b border-[#053634]/5 hover:bg-[#F5F7F2] transition-colors">
                      <td className="py-4 px-4">
                        <code className="text-sm font-mono bg-[#053634]/5 px-2 py-1 rounded text-[#053634]">
                          {item.example}
                        </code>
                      </td>
                      <td className="py-4 px-4 text-[#053634]/70">{item.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
