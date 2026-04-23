import React from "react"
import Link from "next/link"
import Image from "next/image"
import { sql } from "@/lib/neon"

export const revalidate = 60
export const dynamic = "force-dynamic"

export default async function EventosPage() {
  const eventos = await sql`
    SELECT * FROM eventos WHERE data >= CURRENT_DATE ORDER BY data ASC
  `

  const tiposUnicos = ["Todos", ...new Set(eventos.map((e: any) => e.tipo).filter(Boolean))]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative w-full h-[50vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <Image src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&h=1080&fit=crop" alt="Eventos" fill className="object-cover" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">CALENDÁRIO</p>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">Eventos & Cultos</h1>
          <p className="text-lg md:text-xl">Participe dos momentos que Deus tem preparado para você</p>
        </div>
      </section>

      {/* Filtros visuais (estáticos, mantém o visual) */}
      <section className="bg-[#F5F1E8] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {tiposUnicos.map((cat) => (
              <span key={cat as string} className="px-6 py-2 rounded-full bg-white text-black font-semibold border border-gray-300">{cat as string}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Lista */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-montserrat">Próximos Eventos</h2>
          {eventos.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Nenhum evento agendado no momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventos.map((evento: any) => (
                <div key={evento.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <span className="text-6xl text-white/30">📅</span>
                    <div className="absolute top-4 right-4 bg-[#D4C5B0] text-black px-3 py-1 rounded-full text-xs font-semibold">
                      {evento.tipo}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-black font-montserrat">{evento.titulo}</h3>
                    {evento.descricao && <p className="text-gray-600 mb-4 text-sm">{evento.descricao}</p>}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">📅</span>
                        <span className="font-semibold">{new Date(evento.data).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
                      </div>
                      {evento.horario && (
                        <div className="flex items-center text-gray-700">
                          <span className="mr-2">🕐</span>
                          <span>{evento.horario}</span>
                        </div>
                      )}
                    </div>
                    <Link href="/cadastro" className="mt-4 block text-center bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all">
                      Confirmar Presença
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">Não perca nenhum evento!</h2>
          <p className="text-lg text-gray-800 mb-8">Cadastre-se para receber lembretes e atualizações sobre nossos eventos</p>
          <Link href="/cadastro" className="inline-block bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all shadow-lg">Cadastrar-se Agora</Link>
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
