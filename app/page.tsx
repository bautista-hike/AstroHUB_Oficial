"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardAnalytics } from "@/components/dashboard-analytics"
import { PresupuestoSection } from "@/components/presupuesto-section"
import { CampanasActivasSection } from "@/components/campanas-activas-section"
import { ReportesSection } from "@/components/reportes-section"
import { TrainingsGlosarioSection } from "@/components/trainings-glosario-section"
import { MinutasSection } from "@/components/minutas-section"
import { CreativosSection } from "@/components/creativos-section"
import { CreativeSheetSection } from "@/components/creative-sheet-section"
import { EventosSection } from "@/components/eventos-section"

export default function AstroPayHub() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [scrolled, setScrolled] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen bg-gradient-radial from-[#F5F7F2] via-[#F5F7F2] to-[#E8EBE6]">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        scrolled={scrolled}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
        {activeSection === "dashboard" && <DashboardAnalytics />}
        {activeSection === "presupuesto" && <PresupuestoSection />}
        {activeSection === "campanas" && <CampanasActivasSection />}
        {activeSection === "reportes" && <ReportesSection />}
        {activeSection === "trainings" && <TrainingsGlosarioSection />}
        {activeSection === "minutas" && <MinutasSection />}
        {activeSection === "creativos" && <CreativosSection />}
        {activeSection === "creative-sheet" && <CreativeSheetSection />}
        {activeSection === "eventos" && <EventosSection />}
      </main>
    </div>
  )
}
