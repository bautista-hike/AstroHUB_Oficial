export function Footer() {
  return (
    <footer className="bg-[#053634] py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white text-sm">AstroPay x ABN – Paid Media Hub © 2025</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
              Contact us
            </a>
            <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
              Feedback
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
