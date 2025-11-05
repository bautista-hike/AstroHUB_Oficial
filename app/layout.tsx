import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Paid Media Hub – AstroPay x ABN",
  description: "Central hub for paid media performance and creatives between AstroPay and ABN",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
