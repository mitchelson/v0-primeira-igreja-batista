import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, Star, Flame, type LucideIcon } from "lucide-react";

export default function SobrePage() {
  const valores: { titulo: string; descricao: string; Icon: LucideIcon }[] = [
    {
      titulo: "Presença de Deus",
      descricao:
        "Buscamos e valorizamos a presença manifesta do Espírito Santo em tudo que fazemos.",
      Icon: Sparkles,
    },
    {
      titulo: "Família",
      descricao:
        "Somos uma família que se ama, se cuida e caminha junta rumo ao propósito de Deus.",
      Icon: Heart,
    },
    {
      titulo: "Excelência",
      descricao:
        "Fazemos tudo com excelência, como para o Senhor, honrando Seu nome.",
      Icon: Star,
    },
    {
      titulo: "Transformação",
      descricao:
        "Cremos no poder transformador do evangelho que muda vidas, famílias e comunidades.",
      Icon: Flame,
    },
  ];

  const lideranca = [
    {
      nome: "Pastor Titular",
      cargo: "Pastor Presidente",
      imagem:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      descricao:
        "Liderando com paixão por Cristo e amor pelas pessoas há mais de 20 anos.",
    },
    {
      nome: "Pastora",
      cargo: "Pastora Auxiliar",
      imagem:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      descricao: "Dedicada ao ministério de cuidado pastoral e aconselhamento.",
    },
    {
      nome: "Pastor de Jovens",
      cargo: "Ministério de Jovens",
      imagem:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      descricao: "Investindo na próxima geração com energia e unção.",
    },
    {
      nome: "Pastor de Louvor",
      cargo: "Ministério de Música",
      imagem:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      descricao: "Conduzindo a igreja à adoração verdadeira e profunda.",
    },
  ];

  const timeline = [
    { ano: "1985", evento: "Fundação da igreja com 30 membros" },
    { ano: "1995", evento: "Inauguração do templo atual" },
    { ano: "2005", evento: "Alcançamos 500 membros" },
    { ano: "2015", evento: "Expansão com plantação de 5 congregações" },
    { ano: "2020", evento: "Início das transmissões online" },
    { ano: "2025", evento: "Celebrando 40 anos de história" },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&h=1080&fit=crop"
            alt="Sobre Nós"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">
            NOSSA HISTÓRIA
          </p>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">
            Sobre Nós
          </h1>
          <p className="text-lg md:text-xl">
            40 anos transformando vidas através do amor de Cristo
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center font-montserrat">
            Nossa História
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              A Primeira Igreja Batista de Roraima nasceu em 1985, fruto de um
              sonho de Deus no coração de um pequeno grupo de irmãos que
              desejavam ver o Reino de Deus expandido em Boa Vista. Começamos
              com apenas 30 membros reunidos em uma casa simples, mas com uma
              visão grande: ver vidas transformadas pelo poder do evangelho.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ao longo de quatro décadas, testemunhamos milagres, curas,
              restaurações e milhares de vidas transformadas. Crescemos não
              apenas em número, mas em maturidade espiritual e impacto na
              comunidade. Hoje, somos uma igreja vibrante, multigeracional, que
              mantém a mesma paixão pelo avivamento que nos moveu desde o
              início.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nossa jornada é marcada pela presença de Deus, pelo amor às
              pessoas e pelo compromisso com a Grande Comissão. Continuamos
              crendo que os melhores dias ainda estão por vir!
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-[#F5F1E8]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-montserrat">
            Linha do Tempo
          </h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="bg-black text-white rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold font-montserrat">{item.ano}</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                  <p className="text-lg text-gray-800 font-semibold">
                    {item.evento}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 font-montserrat">
                Nossa Missão
              </h3>
              <p className="text-lg leading-relaxed">
                Conduzir pessoas a um relacionamento transformador com Jesus
                Cristo, equipá-las para uma vida de adoração e serviço, e
                expandir o Reino de Deus através do avivamento pessoal, regional
                e global.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#D4C5B0] to-[#C4B5A0] text-black p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 font-montserrat">
                Nossa Visão
              </h3>
              <p className="text-lg leading-relaxed">
                Ser uma igreja de presença, onde o céu toca a terra, formando
                adoradores maduros que transformam suas comunidades e nações
                através do poder do Espírito Santo.
              </p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-black mb-8 text-center font-montserrat">
            Nossos Valores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor, index) => {
              const ValorIcon = valor.Icon
              return (
              <div
                key={index}
                className="bg-[#F5F1E8] p-6 rounded-lg text-center"
              >
                <div className="mb-4 flex justify-center">
                  <ValorIcon className="h-12 w-12 text-[#c9a84c]" aria-hidden />
                </div>
                <h4 className="text-xl font-bold text-black mb-3 font-montserrat">
                  {valor.titulo}
                </h4>
                <p className="text-gray-700">{valor.descricao}</p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Liderança */}
      <section className="py-16 px-4 bg-[#F5F1E8]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-montserrat">
            Nossa Liderança
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lideranca.map((lider, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={lider.imagem}
                    alt={lider.nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-black mb-1 font-montserrat">
                    {lider.nome}
                  </h3>
                  <p className="text-[#D4C5B0] font-semibold mb-3">
                    {lider.cargo}
                  </p>
                  <p className="text-sm text-gray-600">{lider.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">
            Faça parte da nossa história
          </h2>
          <p className="text-lg text-gray-800 mb-8">
            Venha nos visitar e descubra como Deus pode transformar sua vida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro"
              className="bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all shadow-lg"
            >
              Agendar Visita
            </Link>
            <Link
              href="/eventos"
              className="bg-white text-black font-semibold px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-all shadow-lg"
            >
              Ver Eventos
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
