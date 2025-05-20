import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Bem-vindo à Primeira Igreja Batista de Roraima</h1>
      <p className="text-lg mb-8 max-w-2xl">Sistema de gerenciamento de visitantes e acompanhamento</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/cadastro">
          <Button size="lg">Cadastro de Visitantes</Button>
        </Link>
        <Link href="/admin">
          <Button size="lg" variant="outline">
            Área Administrativa
          </Button>
        </Link>
      </div>
    </div>
  )
}
