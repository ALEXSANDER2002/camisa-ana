import SetupDatabase from "@/scripts/setup-database"

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="gradient-header py-6 px-4 mb-8 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">Configuração do Sistema</h1>
        </div>
      </div>
      <div className="container mx-auto py-10 px-4 animate-fade-in">
        <SetupDatabase />
      </div>
    </main>
  )
}

