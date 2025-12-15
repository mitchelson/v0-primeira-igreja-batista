import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function MinisteriosPage() {
  const ministerios = [
    {
      id: 1,
      nome: "Louvor & Adoração",
      descricao:
        "Música e adoração que elevam corações a Deus em todos os nossos cultos.",
      descricaoCompleta:
        "Nosso ministério de louvor é dedicado a conduzir a igreja à presença de Deus através da música. Temos bandas, coral, orquestra e grupos de adoração que ministram em todos os cultos e eventos especiais. Buscamos excelência musical aliada à unção do Espírito Santo.",
      imagem:
        "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=500&fit=crop",
      lider: "Pastor de Louvor",
      horario: "Ensaios: Terças e Quintas, 19h",
      requisitos: [
        "Amor por adoração",
        "Disponibilidade para ensaios",
        "Instrumento ou voz",
      ],
      icon: "🎵",
    },
    {
      id: 2,
      nome: "Ministério Infantil",
      descricao:
        "Ensino bíblico criativo e recreação para formar a próxima geração.",
      descricaoCompleta:
        "Trabalhamos com crianças de 0 a 12 anos, ensinando princípios bíblicos de forma lúdica e criativa. Temos classes por faixa etária, atividades especiais, acampamentos e eventos temáticos que marcam a vida das crianças para sempre.",
      imagem:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=500&fit=crop",
      lider: "Coordenadora Infantil",
      horario: "Domingos durante o culto + Sábados 15h",
      requisitos: ["Amor por crianças", "Paciência", "Criatividade"],
      icon: "👶",
    },
    {
      id: 3,
      nome: "Ação Social",
      descricao: "Projetos de amor e apoio que transformam nossa comunidade.",
      descricaoCompleta:
        "Levamos o amor de Cristo através de ações práticas: distribuição de alimentos, roupas, atendimento médico, aulas de reforço escolar e capacitação profissional. Servimos a comunidade e mostramos o Reino de Deus em ação.",
      imagem:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=500&fit=crop",
      lider: "Coordenador de Ação Social",
      horario: "Projetos semanais e mensais",
      requisitos: [
        "Coração compassivo",
        "Disponibilidade",
        "Espírito de servo",
      ],
      icon: "🤝",
    },
    {
      id: 4,
      nome: "Jovens",
      descricao: "Conexão, diversão e crescimento espiritual para a juventude.",
      descricaoCompleta:
        "Ministério voltado para jovens de 13 a 30 anos. Realizamos cultos específicos, retiros, acampamentos, grupos de estudo bíblico e eventos sociais. Nosso objetivo é formar uma geração apaixonada por Jesus e comprometida com o Reino.",
      imagem:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop",
      lider: "Pastor de Jovens",
      horario: "Sábados, 18h",
      requisitos: ["Idade entre 13-30 anos", "Desejo de crescer em Deus"],
      icon: "🎸",
    },
    {
      id: 5,
      nome: "Intercessão",
      descricao: "Guerreiros de oração que sustentam a igreja e a nação.",
      descricaoCompleta:
        "Grupo dedicado à oração intensa e intercessão. Oramos pela igreja, líderes, nação, missões e pedidos específicos. Temos vigílias, madrugadas de oração e correntes de intercessão que movem o céu.",
      imagem:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop",
      lider: "Líder de Intercessão",
      horario: "Quartas, 20h + Vigílias mensais",
      requisitos: ["Vida de oração", "Compromisso", "Maturidade espiritual"],
      icon: "🙏",
    },
    {
      id: 6,
      nome: "Evangelismo",
      descricao: "Levando o evangelho às ruas e alcançando vidas.",
      descricaoCompleta:
        "Saímos às ruas, praças, hospitais e presídios levando a mensagem do evangelho. Realizamos evangelismos, distribuímos literatura cristã e testemunhamos o poder transformador de Jesus Cristo.",
      imagem:
        "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&h=500&fit=crop",
      lider: "Coordenador de Evangelismo",
      horario: "Sábados, 9h",
      requisitos: ["Paixão por almas", "Coragem", "Disposição"],
      icon: "📢",
    },
    {
      id: 7,
      nome: "Mídia & Comunicação",
      descricao: "Tecnologia e criatividade a serviço do Reino.",
      descricaoCompleta:
        "Cuidamos da transmissão online, redes sociais, design gráfico, fotografia e videomaking. Usamos a tecnologia para expandir o alcance do evangelho e fortalecer a comunicação da igreja.",
      imagem:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
      lider: "Coordenador de Mídia",
      horario: "Domingos + produção durante a semana",
      requisitos: ["Conhecimento técnico", "Criatividade", "Disponibilidade"],
      icon: "📹",
    },
    {
      id: 8,
      nome: "Casais",
      descricao: "Fortalecendo matrimônios segundo o coração de Deus.",
      descricaoCompleta:
        "Ministério dedicado a casais que desejam fortalecer seu relacionamento. Realizamos encontros, jantares, retiros e aconselhamento. Cremos que casamentos sólidos constroem famílias fortes.",
      imagem:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop",
      lider: "Casal Líder",
      horario: "Encontros mensais",
      requisitos: ["Ser casado", "Desejo de crescer no relacionamento"],
      icon: "💑",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&h=1080&fit=crop"
            alt="Ministérios"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">
            SERVINDO JUNTOS
          </p>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">
            Ministérios
          </h1>
          <p className="text-lg md:text-xl">
            Há um lugar para você no que Deus está fazendo em nossa casa
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-[#F5F1E8] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">
            Descubra seu propósito
          </h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Acreditamos que cada pessoa foi criada com dons e talentos únicos
            para servir ao Reino de Deus. Nossos ministérios são oportunidades
            de usar seus dons, crescer espiritualmente e fazer diferença na vida
            de outras pessoas. Explore as opções abaixo e encontre onde você se
            encaixa!
          </p>
        </div>
      </section>

      {/* Lista de Ministérios */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {ministerios.map((ministerio, index) => (
            <div
              key={ministerio.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative h-[300px] rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={ministerio.imagem}
                    alt={ministerio.nome}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{ministerio.icon}</span>
                  <h3 className="text-3xl font-bold text-black font-montserrat">
                    {ministerio.nome}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-lg">
                  {ministerio.descricaoCompleta}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-start">
                    <span className="text-[#D4C5B0] mr-2 font-bold">👤</span>
                    <span className="text-gray-700">{ministerio.lider}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#D4C5B0] mr-2 font-bold">🕐</span>
                    <span className="text-gray-700">{ministerio.horario}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#D4C5B0] mr-2 font-bold">✓</span>
                    <div>
                      <span className="text-gray-700 font-semibold">
                        Requisitos:{" "}
                      </span>
                      <span className="text-gray-600">
                        {ministerio.requisitos.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/cadastro"
                  className="inline-block bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all"
                >
                  Quero Participar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-lg text-gray-800 mb-8">
            Entre em contato conosco e descubra como você pode servir
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro"
              className="bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all shadow-lg"
            >
              Cadastrar-se
            </Link>
            <Link
              href="/contato"
              className="bg-white text-black font-semibold px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-all shadow-lg"
            >
              Falar Conosco
            </Link>
          </div>
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
