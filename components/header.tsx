import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-[#F5F7F2] border-b border-[#053634]/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Image src="/astropay-logo.png" alt="AstroPay" width={180} height={40} className="h-10 w-auto" />
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm">
            <span className="text-sm font-medium text-[#053634]">ABN</span>
            <div className="w-8 h-8 bg-[#053634] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">ABN</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <h1 className="text-4xl font-bold text-[#053634] text-balance">Paid Media Hub</h1>
          <p className="text-lg text-[#053634]/70">Central hub for paid media performance and creatives.</p>
        </div>

        <nav className="flex flex-wrap gap-2">
          {["Dashboard", "Funnel Overview", "Creatives", "Nomenclature", "Events", "Reports"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="px-4 py-2 text-sm font-medium text-[#053634] hover:bg-white rounded-lg transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
