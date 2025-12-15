import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomeLanding() {
  return (
    <main className="min-h-screen bg-white flex flex-col pb-20">
      {/* Hero Section - Inspirado em Bethel */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">
            Venha experimentar a presença de Deus
          </p>
          <h1 className="text-4xl md:text-7xl font-bold font-montserrat mb-6 leading-tight">
            NA TERRA COMO
            <br />
            NO CÉU
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            A Primeira Igreja Batista de Roraima é uma congregação enraizada no
            amor de Deus,
            <br className="hidden md:block" />
            dedicada à transformação mundial através do avivamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/cadastro"
              className="bg-white text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all shadow-lg"
            >
              Participe Presencialmente
            </Link>
            <Link
              href="/eventos"
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all"
            >
              Ver Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Citação/Missão */}
      <section className="bg-[#F5F1E8] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-montserrat">
            Todo crente foi criado para pertencer a uma comunidade
          </h2>
          <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
            Nunca foi o coração de Deus que caminhássemos sozinhos nesta vida.
            Somos uma congregação de adoradores de Jesus Cristo em Boa Vista,
            Roraima, que anseia ver corações inflamados até que o céu encontre a
            terra. Estamos à beira do maior avivamento de todos os tempos.
          </p>
        </div>
      </section>

      {/* Ministérios - Estilo Bethel */}
      <section id="ministerios" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4C5B0] font-semibold mb-2">
              MINISTÉRIOS
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-black font-montserrat mb-4">
              Há um lugar para você
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              no que Deus está fazendo em nossa casa
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="bg-[#F5F1E8] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-black h-48 relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&h=400&fit=crop"
                    alt="Louvor e Adoração"
                    fill
                    className="object-cover opacity-70 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-black font-montserrat">
                    Louvor & Adoração
                  </h3>
                  <p className="text-gray-800">
                    Música e adoração que elevam corações a Deus em todos os
                    nossos cultos.
                  </p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-[#F5F1E8] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-[#D4C5B0] h-48 relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop"
                    alt="Ministério Infantil"
                    fill
                    className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-black font-montserrat">
                    Ministério Infantil
                  </h3>
                  <p className="text-gray-800">
                    Ensino bíblico criativo e recreação para formar a próxima
                    geração.
                  </p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-[#F5F1E8] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-black h-48 relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop"
                    alt="Ação Social"
                    fill
                    className="object-cover opacity-70 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-black font-montserrat">
                    Ação Social
                  </h3>
                  <p className="text-gray-800">
                    Projetos de amor e apoio que transformam nossa comunidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/ministerios"
              className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all"
            >
              Conecte-se com um Ministério
            </Link>
          </div>
        </div>
      </section>

      {/* Encontre Jesus - CTA Section */}
      <section
        id="conecte"
        className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] py-20 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 font-montserrat">
            Encontre Jesus
          </h2>
          <p className="text-lg md:text-xl text-gray-800 mb-10 max-w-3xl mx-auto">
            Você conhece Jesus? Precisa de cura física ou ministração? Deus quer
            transformar sua vida com Seu amor e poder.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="/contato"
              className="bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-black hover:text-white transition-all shadow-md"
            >
              Conhecer Jesus
            </Link>
            <Link
              href="/contato"
              className="bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-black hover:text-white transition-all shadow-md"
            >
              Oração Profética
            </Link>
            <Link
              href="/contato"
              className="bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-black hover:text-white transition-all shadow-md"
            >
              Oração por Cura
            </Link>
            <Link
              href="/contato"
              className="bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-black hover:text-white transition-all shadow-md"
            >
              Aconselhamento
            </Link>
          </div>
        </div>
      </section>

      {/* Eventos */}
      <section id="eventos" className="py-20 px-4 bg-[#F5F1E8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4C5B0] font-semibold mb-2">
              EVENTOS
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-black font-montserrat">
              Próximos Eventos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="bg-black p-6 text-white">
                <p className="text-sm uppercase tracking-wider mb-2">Domingo</p>
                <h3 className="text-2xl font-bold font-montserrat">
                  Culto de Celebração
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-800 mb-4">
                  Junte-se a nós para um tempo poderoso de adoração e palavra.
                </p>
                <p className="text-sm text-[#D4C5B0] font-semibold">19:00</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="bg-[#D4C5B0] p-6 text-black">
                <p className="text-sm uppercase tracking-wider mb-2">Sábado</p>
                <h3 className="text-2xl font-bold font-montserrat">
                  Encontro de Jovens
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-800 mb-4">
                  Conexão, diversão e crescimento espiritual para a juventude.
                </p>
                <p className="text-sm text-[#D4C5B0] font-semibold">18:00</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="bg-black p-6 text-white">
                <p className="text-sm uppercase tracking-wider mb-2">
                  Em Breve
                </p>
                <h3 className="text-2xl font-bold font-montserrat">
                  Ação Social
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-800 mb-4">
                  Projetos que levam amor e esperança à nossa comunidade.
                </p>
                <p className="text-sm text-[#D4C5B0] font-semibold">
                  A confirmar
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/eventos"
              className="text-black font-semibold hover:text-[#D4C5B0] transition-all underline"
            >
              Ver Calendário Completo →
            </Link>
          </div>
        </div>
      </section>

      {/* Conecte-se / Newsletter */}
      <section className="bg-black py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat">
            Fique Conectado
          </h2>
          <p className="text-lg mb-8">
            Receba atualizações, encorajamento e novidades diretamente no seu
            e-mail
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto mb-8">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#D4C5B0]"
            />
            <button
              type="submit"
              className="bg-[#D4C5B0] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#C4B5A0] transition-all"
            >
              Inscrever-se
            </button>
          </form>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="hover:text-[#D4C5B0] transition-all text-2xl"
              aria-label="Instagram"
            >
              📷
            </a>
            <a
              href="#"
              className="hover:text-[#D4C5B0] transition-all text-2xl"
              aria-label="Facebook"
            >
              👍
            </a>
            <a
              href="#"
              className="hover:text-[#D4C5B0] transition-all text-2xl"
              aria-label="YouTube"
            >
              🎥
            </a>
            <a
              href="https://wa.me/5595999999999"
              className="hover:text-[#D4C5B0] transition-all text-2xl"
              aria-label="WhatsApp"
            >
              💬
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 font-montserrat">Sobre</h3>
            <p className="text-sm text-gray-300">
              Nossa missão é o avivamento - a expansão pessoal, regional e
              global do Reino de Deus através de Sua presença manifesta.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-montserrat">
              Conecte-se
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/eventos"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Cultos & Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/ministerios"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Ministérios
                </Link>
              </li>
              <li>
                <Link
                  href="/cadastro"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Cadastro de Visitantes
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-montserrat">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/sermoes"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Sermões
                </Link>
              </li>
              <li>
                <Link
                  href="/sermoes"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Podcasts
                </Link>
              </li>
              <li>
                <Link
                  href="/sermoes"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Música
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-gray-300 hover:text-[#D4C5B0] transition-all"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-montserrat">
              Localização
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Av. Principal, 1234
              <br />
              Centro, Boa Vista/RR
            </p>
            <p className="text-sm text-gray-300">Telefone: (95) 99999-9999</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            © 2025 Primeira Igreja Batista de Roraima. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>

      {/* Navegação Móvel Fixa */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around items-center py-3 z-50 md:hidden">
        <Link
          href="/"
          className="flex flex-col items-center text-black hover:text-[#D4C5B0] transition-all"
        >
          <span className="text-xl">🏠</span>
          <span className="text-xs font-semibold">Início</span>
        </Link>
        <Link
          href="/eventos"
          className="flex flex-col items-center text-black hover:text-[#D4C5B0] transition-all"
        >
          <span className="text-xl">📅</span>
          <span className="text-xs font-semibold">Eventos</span>
        </Link>
        <Link
          href="/ministerios"
          className="flex flex-col items-center text-black hover:text-[#D4C5B0] transition-all"
        >
          <span className="text-xl">👥</span>
          <span className="text-xs font-semibold">Ministérios</span>
        </Link>
        <Link
          href="/contato"
          className="flex flex-col items-center text-black hover:text-[#D4C5B0] transition-all"
        >
          <span className="text-xl">💬</span>
          <span className="text-xs font-semibold">Contato</span>
        </Link>
        <Link
          href="/admin"
          className="flex flex-col items-center text-black hover:text-[#D4C5B0] transition-all"
        >
          <span className="text-xl">👤</span>
          <span className="text-xs font-semibold">Admin</span>
        </Link>
      </nav>
    </main>
  );
}
