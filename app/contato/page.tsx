"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });

  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: "",
    });
    setEnviando(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const informacoes = [
    {
      titulo: "Endereço",
      conteudo: "Av. Principal, 1234\nCentro, Boa Vista/RR\nCEP: 69301-000",
      icon: "📍",
    },
    {
      titulo: "Telefone",
      conteudo: "(95) 99999-9999\n(95) 3333-3333",
      icon: "📞",
    },
    {
      titulo: "Email",
      conteudo: "contato@pibr.org.br\nmidia@pibr.org.br",
      icon: "✉️",
    },
    {
      titulo: "Horários de Culto",
      conteudo:
        "Domingo: 19:00\nQuarta: 20:00 (Oração)\nSábado: 18:00 (Jovens)",
      icon: "🕐",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop"
            alt="Contato"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-[#D4C5B0] font-semibold">
            FALE CONOSCO
          </p>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4">
            Contato
          </h1>
          <p className="text-lg md:text-xl">
            Estamos aqui para você. Entre em contato!
          </p>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-16 px-4 bg-[#F5F1E8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {informacoes.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-xl font-bold text-black mb-3 font-montserrat">
                  {info.titulo}
                </h3>
                <p className="text-gray-700 whitespace-pre-line text-sm">
                  {info.conteudo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário e Mapa */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulário */}
          <div>
            <h2 className="text-3xl font-bold text-black mb-6 font-montserrat">
              Envie uma Mensagem
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4C5B0]"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4C5B0]"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4C5B0]"
                  placeholder="(95) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Assunto *
                </label>
                <select
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4C5B0]"
                >
                  <option value="">Selecione...</option>
                  <option value="visitante">Primeira Visita</option>
                  <option value="ministerio">Participar de Ministério</option>
                  <option value="oracao">Pedido de Oração</option>
                  <option value="evento">Informações sobre Eventos</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mensagem *
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4C5B0]"
                  placeholder="Escreva sua mensagem aqui..."
                />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#D4C5B0] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          {/* Mapa e Informações Adicionais */}
          <div>
            <h2 className="text-3xl font-bold text-black mb-6 font-montserrat">
              Localização
            </h2>
            <div
              className="bg-gray-200 rounded-lg overflow-hidden mb-6"
              style={{ height: "300px" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.3083649999997!2d-60.67638908523426!3d2.8198899577214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNDknMTEuNiJOIDYwwrA0MCczMy4wIlc!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="bg-[#F5F1E8] p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-black mb-4 font-montserrat">
                Como Chegar
              </h3>
              <p className="text-gray-700 mb-4">
                Estamos localizados no coração de Boa Vista, de fácil acesso por
                transporte público e com estacionamento disponível.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">🚌</span>
                  <span>Ônibus: Linhas 101, 202, 303</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🚗</span>
                  <span>Estacionamento próprio disponível</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">♿</span>
                  <span>Acessibilidade para pessoas com deficiência</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-[#D4C5B0] to-[#C4B5A0] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4 font-montserrat">
                Redes Sociais
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  📷
                </a>
                <a
                  href="#"
                  className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  👍
                </a>
                <a
                  href="#"
                  className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  🎥
                </a>
                <a
                  href="https://wa.me/5595999999999"
                  className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all"
                  aria-label="WhatsApp"
                >
                  💬
                </a>
              </div>
            </div>
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
