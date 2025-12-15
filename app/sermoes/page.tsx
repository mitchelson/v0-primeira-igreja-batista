"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SermoesPage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todos");

  const sermoes = [
    {
      id: 1,
      titulo: "O Poder da Presença de Deus",
      pregador: "Pastor Titular",
      data: "10 de Dezembro, 2024",
      categoria: "Avivamento",
      serie: "Série: Na Terra Como no Céu",
      duracao: "45 min",
      imagem:
        "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=500&fit=crop",
      videoUrl: "#",
      audioUrl: "#",
    },
    {
      id: 2,
      titulo: "Fé que Move Montanhas",
      pregador: "Pastor Auxiliar",
      data: "03 de Dezembro, 2024",
      categoria: "Fé",
      serie: "Série: Heróis da Fé",
      duracao: "38 min",
      imagem:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop",
      videoUrl: "#",
      audioUrl: "#",
    },
    {
      id: 3,
      titulo: "Adoração que Transforma",
      pregador: "Pastor de Louvor",
      data: "26 de Novembro, 2024",
      categoria: "Adoração",
      serie: "Mensagem Especial",
      duracao: "42 min",
      imagem:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop",
      videoUrl: "#",
      audioUrl: "#",
    },
    {
      id: 4,
      titulo: "O Propósito de Deus para Sua Vida",
      pregador: "Pastor Titular",
      data: "19 de Novembro, 2024",
      categoria: "Propósito",
      serie: "Série: Identidade em Cristo",
      duracao: "50 min",
      imagem:
        "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=500&fit=crop",
      videoUrl: "#",
      audioUrl: "#",
    },
    {
      id: 5,
      titulo: "A Geração do Avivamento",
      pregador: "Pastor de Jovens",
      data: "12 de Novembro, 2024",
      categoria: "Jovens",
      serie: "Série: Nova Geração",
      duracao: "35 min",
      imagem:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop",
      videoUrl: "#",
      audioUrl: "#",
    },
    {
      id: 6,
      titulo: "Família Segundo o Coração de Deus",
      pregador: "Pastora",
      data: "05 de Novembro, 2024",
      categoria: "Família",
      serie: "Série: Relacionamentos Saudáveis",
      duracao: "40 min",
      imagem:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=500&fit=crop",
      videoUrl: "#",
      audioUrl: "#",
    },
  ];

  const categorias = [
    "todos",
    "Avivamento",
    "Fé",
    "Adoração",
    "Propósito",
    "Jovens",
    "Família",
  ];

  const sermoesFiltrados =
    categoriaSelecionada === "todos"
      ? sermoes
      : sermoes.filter((s) => s.categoria === categoriaSelecionada);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&h=1080&fit=crop"
            alt="Sermões"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">
            PALAVRA DE DEUS
          </p>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">
            Sermões
          </h1>
          <p className="text-lg md:text-xl">
            Mensagens que transformam vidas e edificam a fé
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
                onClick={() => setCategoriaSelecionada(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all border ${
                  categoriaSelecionada === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Sermões */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-black font-montserrat">
              {sermoesFiltrados.length} Sermões Disponíveis
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Grid
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">
                Lista
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermoesFiltrados.map((sermao) => (
              <div
                key={sermao.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={sermao.imagem}
                    alt={sermao.titulo}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white text-black rounded-full p-4 hover:scale-110 transition-transform">
                      ▶️
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 bg-[#D4C5B0] text-black px-3 py-1 rounded-full text-xs font-semibold">
                    {sermao.categoria}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-500 mb-2">{sermao.serie}</p>
                  <h3 className="font-bold text-xl mb-2 text-black font-montserrat">
                    {sermao.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {sermao.pregador} • {sermao.duracao}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{sermao.data}</p>
                  <div className="flex gap-2">
                    <a
                      href={sermao.videoUrl}
                      className="flex-1 text-center bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all text-sm"
                    >
                      🎥 Vídeo
                    </a>
                    <a
                      href={sermao.audioUrl}
                      className="flex-1 text-center bg-white border-2 border-black text-black font-semibold px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all text-sm"
                    >
                      🎧 Áudio
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              ← Anterior
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Próximo →
            </button>
          </div>
        </div>
      </section>

      {/* Séries em Destaque */}
      <section className="bg-[#F5F1E8] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-montserrat">
            Séries em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-40 bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white font-montserrat text-center px-4">
                  Na Terra Como no Céu
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Uma jornada profunda sobre como viver a realidade do Reino de
                  Deus aqui e agora.
                </p>
                <p className="text-sm text-[#D4C5B0] font-semibold mb-3">
                  8 mensagens
                </p>
                <Link
                  href="#"
                  className="block text-center bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all"
                >
                  Ver Série
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-40 bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] flex items-center justify-center">
                <h3 className="text-2xl font-bold text-black font-montserrat text-center px-4">
                  Heróis da Fé
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Lições poderosas dos grandes heróis bíblicos que
                  revolucionaram gerações.
                </p>
                <p className="text-sm text-[#D4C5B0] font-semibold mb-3">
                  6 mensagens
                </p>
                <Link
                  href="#"
                  className="block text-center bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all"
                >
                  Ver Série
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-40 bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white font-montserrat text-center px-4">
                  Identidade em Cristo
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Descubra quem você é em Cristo e viva o propósito para o qual
                  foi criado.
                </p>
                <p className="text-sm text-[#D4C5B0] font-semibold mb-3">
                  5 mensagens
                </p>
                <Link
                  href="#"
                  className="block text-center bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all"
                >
                  Ver Série
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Newsletter */}
      <section className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">
            Receba novos sermões no seu email
          </h2>
          <p className="text-lg text-gray-800 mb-8">
            Cadastre-se e seja notificado sempre que publicarmos uma nova
            mensagem
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-all"
            >
              Inscrever-se
            </button>
          </form>
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
