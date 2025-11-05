"use client"

import { motion } from "framer-motion"

export function CreativeSheetSection() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-[#053634] mb-4">Creative Sheet</h1>
        <p className="text-2xl text-gray-600">In Progress</p>
      </motion.div>
    </div>
  )
}
