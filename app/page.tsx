import { Suspense } from "react"
import Link from "next/link"
import InventoryDashboard from "@/components/inventory-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Settings, Heart } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-6 px-4 mb-8 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center text-white mb-4 sm:mb-0 text-center sm:text-left">
            <Heart className="h-8 w-8 mr-3" />
            Boutique Ana
          </h1>
          <Link href="/setup">
            <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 animate-fade-in">
        <Suspense fallback={<LoadingSpinner />}>
          <InventoryDashboard />
        </Suspense>
      </div>
    </main>
  )
}

