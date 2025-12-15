import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function EventosPage() {
  const eventosProximos = [
    {
      id: 1,
      titulo: "Culto de Celebração",
      descricao: "Junte-se a nós para um tempo poderoso de adoração e palavra.",
      data: "Todo Domingo",
      horario: "19:00",
      local: "Templo Principal",
      imagem:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop",
      categoria: "Culto Regular",
    },
    {
      id: 2,
      titulo: "Encontro de Jovens",
      descricao: "Conexão, diversão e crescimento espiritual para a juventude.",
      data: "Todo Sábado",
      horario: "18:00",
      local: "Salão de Eventos",
      imagem:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop",
      categoria: "Jovens",
    },
    {
      id: 3,
      titulo: "Culto de Oração",
      descricao: "Momentos de intercessão e comunhão com Deus.",
      data: "Toda Quarta-feira",
      horario: "20:00",
      local: "Templo Principal",
      imagem:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop",
      categoria: "Oração",
    },
    {
      id: 4,
      titulo: "Conferência de Avivamento 2025",
      descricao:
        "Três dias de adoração intensa e ministração da Palavra com pregadores convidados.",
      data: "15-17 de Janeiro",
      horario: "19:00 - 22:00",
      local: "Templo Principal",
      imagem:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
      categoria: "Conferência",
    },
    {
      id: 5,
      titulo: "Ação Social - Distribuição de Alimentos",
      descricao:
        "Projeto que leva amor e esperança à nossa comunidade através da distribuição de cestas básicas.",
      data: "20 de Janeiro",
      horario: "09:00 - 12:00",
      local: "Praça Central",
      imagem:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
      categoria: "Ação Social",
    },
    {
      id: 6,
      titulo: "Retiro de Famílias",
      descricao:
        "Fim de semana de fortalecimento dos laços familiares em Cristo.",
      data: "25-27 de Janeiro",
      horario: "Dia inteiro",
      local: "Chácara Paz no Campo",
      imagem:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=500&fit=crop",
      categoria: "Retiro",
    },
  ];

  const categorias = [
    "Todos",
    "Culto Regular",
    "Jovens",
    "Oração",
    "Conferência",
    "Ação Social",
    "Retiro",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&h=1080&fit=crop"
            alt="Eventos"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">
            CALENDÁRIO
          </p>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">
            Eventos & Cultos
          </h1>
          <p className="text-lg md:text-xl">
            Participe dos momentos que Deus tem preparado para você
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-[#F5F1E8] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat}
                className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-black hover:text-white transition-all border border-gray-300"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Eventos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-montserrat">
            Próximos Eventos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosProximos.map((evento) => (
              <div
                key={evento.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={evento.imagem}
                    alt={evento.titulo}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-[#D4C5B0] text-black px-3 py-1 rounded-full text-xs font-semibold">
                    {evento.categoria}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-black font-montserrat">
                    {evento.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {evento.descricao}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">📅</span>
                      <span className="font-semibold">{evento.data}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">🕐</span>
                      <span>{evento.horario}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">📍</span>
                      <span>{evento.local}</span>
                    </div>
                  </div>
                  <Link
                    href="/cadastro"
                    className="mt-4 block text-center bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all"
                  >
                    Confirmar Presença
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">
            Não perca nenhum evento!
          </h2>
          <p className="text-lg text-gray-800 mb-8">
            Cadastre-se para receber lembretes e atualizações sobre nossos
            eventos
          </p>
          <Link
            href="/cadastro"
            className="inline-block bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all shadow-lg"
          >
            Cadastrar-se Agora
          </Link>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="bg-white py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <Link
            href="/"
            className="inline-block text-black font-semibold hover:text-[#D4C5B0] transition-all"
          >
            ← Voltar para Home
          </Link>
        </div>
      </section>
    </main>
  );
}
