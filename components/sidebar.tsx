"use client"

import {
  BarChart3,
  DollarSign,
  Rocket,
  TrendingUp,
  GraduationCap,
  FileText,
  ImageIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import NextImage from "next/image"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  scrolled: boolean
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ activeSection, onSectionChange, scrolled, collapsed, onToggleCollapse }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "presupuesto", label: "Presupuesto", icon: DollarSign },
    { id: "campanas", label: "Campañas activas", icon: Rocket },
    { id: "reportes", label: "Reportes", icon: TrendingUp },
    { id: "trainings", label: "Trainings / Glosario", icon: GraduationCap },
    { id: "minutas", label: "Minutas", icon: FileText },
    { id: "creativos", label: "Creativos", icon: ImageIcon },
    { id: "creative-sheet", label: "Creative Sheet", icon: Layers },
    { id: "eventos", label: "Eventos", icon: Calendar },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-[#053634] to-[#002E27] text-white flex flex-col shadow-2xl z-50"
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NextImage
                src={scrolled ? "/logoblanco.png" : "/logoblanco.png"}
                alt="AstroPay"
                width={160}
                height={45}
                className="transition-all duration-300"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-8 bg-[#00DBBF] text-white rounded-full p-1.5 hover:bg-[#00DBBF]/90 transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive ? "bg-[#00DBBF] text-white shadow-lg" : "text-white/80 hover:bg-[#00DBBF]/20 hover:text-white"
              }`}
              whileHover={{ x: collapsed ? 0 : 4, scale: collapsed ? 1.05 : 1 }}
              whileTap={{ scale: 0.98 }}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium text-sm whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/60 text-center">AstroPay x ABN</p>
        </div>
      )}
    </motion.aside>
  )
}
