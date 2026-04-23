import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, MapPin, Clock, ChevronRight, Instagram, Youtube, Phone, Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/sobre", label: "Quem Somos" },
  { href: "/ministerios", label: "Ministérios" },
  { href: "/eventos", label: "Eventos" },
  { href: "/sermoes", label: "Pregações" },
  { href: "/contato", label: "Contato" },
];

export default function HomeLanding() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            PIB<span className="text-[#c9a84c]"> Roraima</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/cadastro" className="text-sm bg-[#c9a84c] text-black font-semibold px-5 py-2 rounded-full hover:bg-[#d4b85c] transition-colors">
              Sou Visitante
            </Link>
          </div>
          {/* Mobile: links via bottom nav */}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80"
          alt="Culto"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <p className="text-[#c9a84c] uppercase tracking-[0.35em] text-xs md:text-sm font-semibold mb-6">
            Primeira Igreja Batista de Roraima
          </p>
          <h1 className="text-5xl md:text-8xl font-extrabold leading-[0.95] mb-8 tracking-tight">
            VENHA VIVER
            <br />
            <span className="text-[#c9a84c]">O EXTRAORDINÁRIO</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Uma comunidade apaixonada por Jesus, onde vidas são transformadas e famílias restauradas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/eventos" className="bg-[#c9a84c] text-black font-bold px-8 py-4 rounded-full hover:bg-[#d4b85c] transition-all text-sm uppercase tracking-wider">
              Horários dos Cultos
            </Link>
            <Link href="/sermoes" className="border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <Play className="h-4 w-4" /> Assista ao Vivo
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#c9a84c] rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Cultos ao Vivo / Última Mensagem ── */}
      <section className="py-20 px-4 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Pregações</p>
            <h2 className="text-3xl md:text-5xl font-bold">Assista a Última Mensagem</h2>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/5 max-w-4xl mx-auto group">
            <Image
              src="https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80"
              alt="Última pregação"
              fill
              className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="/sermoes" className="bg-[#c9a84c] rounded-full p-5 hover:scale-110 transition-transform shadow-2xl">
                <Play className="h-8 w-8 text-black fill-black" />
              </Link>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80">
              <p className="text-sm text-[#c9a84c] font-semibold">Última Pregação</p>
              <p className="text-lg font-bold">Acesse nossas pregações e séries</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quem Somos ── */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Quem Somos</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Uma igreja que<br />
              <span className="text-[#c9a84c]">transforma vidas</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Somos uma comunidade de fé em Boa Vista, Roraima, comprometida com o evangelho de Jesus Cristo. 
              Acreditamos que todo crente foi criado para pertencer a uma família espiritual e caminhar junto 
              em propósito, amor e adoração.
            </p>
            <Link href="/sobre" className="inline-flex items-center gap-2 text-[#c9a84c] font-semibold hover:gap-3 transition-all">
              Conheça nossa história <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80"
              alt="Comunidade"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Ministérios ── */}
      <section className="py-20 px-4 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Ministérios</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Encontre o Seu Lugar</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Há um espaço para você servir e crescer no que Deus está fazendo em nossa casa.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Louvor & Adoração", desc: "Música que eleva corações e transforma atmosferas", img: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80", emoji: "🎵" },
              { title: "Ministério Infantil", desc: "Formando a próxima geração com criatividade e amor", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80", emoji: "👶" },
              { title: "Jovens", desc: "Conexão, propósito e crescimento para a juventude", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", emoji: "🔥" },
              { title: "Integração & Comunhão", desc: "Acolhimento e acompanhamento de novos visitantes", img: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80", emoji: "🤝" },
              { title: "Ação Social", desc: "Projetos de amor que transformam nossa comunidade", img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", emoji: "❤️" },
              { title: "Intercessão", desc: "Oração que move o coração de Deus pela nossa cidade", img: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600&q=80", emoji: "🙏" },
            ].map((m) => (
              <div key={m.title} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                <Image src={m.img} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <span className="text-2xl mb-2 block">{m.emoji}</span>
                  <h3 className="text-lg font-bold mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/ministerios" className="inline-flex items-center gap-2 text-[#c9a84c] font-semibold hover:gap-3 transition-all">
              Ver todos os ministérios <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Próximos Eventos ── */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Programação</p>
            <h2 className="text-3xl md:text-5xl font-bold">Próximos Eventos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { day: "DOM", title: "Culto de Celebração", time: "19h", desc: "Adoração, palavra e comunhão" },
              { day: "QUA", title: "Culto de Oração", time: "19h30", desc: "Busca pela presença de Deus" },
              { day: "SÁB", title: "Encontro de Jovens", time: "18h", desc: "Conexão e crescimento espiritual" },
            ].map((ev) => (
              <div key={ev.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#c9a84c]/30 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#c9a84c] text-black text-xs font-bold px-3 py-1 rounded-full">{ev.day}</span>
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="h-3.5 w-3.5" /> {ev.time}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#c9a84c] transition-colors">{ev.title}</h3>
                <p className="text-gray-400 text-sm">{ev.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/eventos" className="bg-[#c9a84c] text-black font-bold px-8 py-4 rounded-full hover:bg-[#d4b85c] transition-all text-sm uppercase tracking-wider inline-block">
              Confira a Programação Completa
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA: Encontre Jesus ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&q=80"
          alt="Encontre Jesus"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Deus Tem Algo <span className="text-[#c9a84c]">Extraordinário</span> Para Você
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Precisa de oração? Quer conhecer Jesus? Estamos aqui para caminhar com você.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Conhecer Jesus", "Pedido de Oração", "Aconselhamento", "Quero Ser Batizado"].map((label) => (
              <Link key={label} href="/contato" className="border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-[#c9a84c] hover:text-black hover:border-[#c9a84c] transition-all text-sm">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Localização ── */}
      <section className="py-20 px-4 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Localização</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Venha Nos Visitar</h2>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#c9a84c] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-semibold">Primeira Igreja Batista de Roraima</p>
                  <p>Boa Vista, RR</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#c9a84c] mt-0.5 shrink-0" />
                <div>
                  <p><span className="text-white">Domingo:</span> 19h</p>
                  <p><span className="text-white">Quarta:</span> 19h30</p>
                </div>
              </div>
            </div>
            <Link href="/contato" className="inline-flex items-center gap-2 text-[#c9a84c] font-semibold mt-6 hover:gap-3 transition-all">
              Como chegar <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0!2d-60.67!3d2.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNDknMTIuMCJOIDYwwrA0MCcxMi4wIlc!5e0!3m2!1spt-BR!2sbr!4v1"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              title="Localização PIB Roraima"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-24 md:pb-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              PIB<span className="text-[#c9a84c]"> Roraima</span>
            </Link>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Uma comunidade apaixonada por Jesus, dedicada à transformação de vidas através do evangelho.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Navegação</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-[#c9a84c] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><Link href="/sermoes" className="text-sm text-gray-500 hover:text-[#c9a84c] transition-colors">Pregações</Link></li>
              <li><Link href="/cadastro" className="text-sm text-gray-500 hover:text-[#c9a84c] transition-colors">Cadastro de Visitantes</Link></li>
              <li><Link href="/admin" className="text-sm text-gray-500 hover:text-[#c9a84c] transition-colors">Área Administrativa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Redes Sociais</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://wa.me/5595999999999" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors" aria-label="WhatsApp">
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">© 2025 Primeira Igreja Batista de Roraima. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* ── Bottom Nav Mobile ── */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 flex justify-around items-center py-2.5 z-50 md:hidden">
        {[
          { href: "/", icon: "🏠", label: "Início" },
          { href: "/eventos", icon: "📅", label: "Eventos" },
          { href: "/ministerios", icon: "👥", label: "Ministérios" },
          { href: "/contato", icon: "💬", label: "Contato" },
          { href: "/minha-area", icon: "👤", label: "Minha Área" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-[#c9a84c] transition-colors">
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
