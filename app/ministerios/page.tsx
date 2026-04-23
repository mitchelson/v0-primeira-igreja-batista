import React from "react"
import Link from "next/link"
import Image from "next/image"
import { sql } from "@/lib/neon"

export const revalidate = 60
export const dynamic = "force-dynamic"

export default async function MinisteriosPage() {
  const ministerios = await sql`
    SELECT m.*, 
      (SELECT json_agg(json_build_object('nome', u.nome, 'is_lider', mm.is_lider))
       FROM ministerio_membros mm JOIN users u ON u.id = mm.user_id
       WHERE mm.ministerio_id = m.id AND mm.is_lider = true) as lideres
    FROM ministerios m
    WHERE m.ativo = true
    ORDER BY m.ordem ASC, m.nome ASC
  `

  // Fallback: se não há ministérios no banco ainda, mostra mensagem
  if (ministerios.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <HeroSection />
        <section className="py-16 px-4 text-center">
          <p className="text-lg text-gray-600">Os ministérios serão exibidos em breve.</p>
          <Link href="/" className="inline-block mt-4 text-black font-semibold hover:text-[#D4C5B0]">← Voltar para Home</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      <section className="bg-[#F5F1E8] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">Descubra seu propósito</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Acreditamos que cada pessoa foi criada com dons e talentos únicos para servir ao Reino de Deus.
            Nossos ministérios são oportunidades de usar seus dons, crescer espiritualmente e fazer diferença na vida de outras pessoas.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {ministerios.map((m: any, index: number) => {
            const liderNome = m.lideres?.[0]?.nome || "Coordenação"
            return (
              <div key={m.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}>
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative h-[300px] rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-8xl">{m.icone || "⛪"}</span>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-5xl">{m.icone || "⛪"}</span>
                    <h3 className="text-3xl font-bold text-black font-montserrat">{m.nome}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-lg">{m.descricao || "Ministério da nossa igreja."}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start">
                      <span className="text-[#D4C5B0] mr-2 font-bold">👤</span>
                      <span className="text-gray-700">{liderNome}</span>
                    </div>
                  </div>
                  <Link href="/cadastro" className="inline-block bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all">
                    Quero Participar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">Pronto para fazer a diferença?</h2>
          <p className="text-lg text-gray-800 mb-8">Entre em contato conosco e descubra como você pode servir</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro" className="bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all shadow-lg">Cadastrar-se</Link>
            <Link href="/contato" className="bg-white text-black font-semibold px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-all shadow-lg">Falar Conosco</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <Link href="/" className="inline-block text-black font-semibold hover:text-[#D4C5B0] transition-all">← Voltar para Home</Link>
        </div>
      </section>
    </main>
  )
}

function HeroSection() {
  return (
    <section className="relative w-full h-[50vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
      <div className="absolute inset-0 opacity-30">
        <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&h=1080&fit=crop" alt="Ministérios" fill className="object-cover" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">SERVINDO JUNTOS</p>
        <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">Ministérios</h1>
        <p className="text-lg md:text-xl">Há um lugar para você no que Deus está fazendo em nossa casa</p>
      </div>
    </section>
  )
}
