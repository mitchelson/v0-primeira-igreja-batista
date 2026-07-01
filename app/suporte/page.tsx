import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Suporte | PIB Roraima",
  description:
    "Central de suporte do site e aplicativo mobile PIB Roraima — ajuda, contato e perguntas frequentes.",
};

const UPDATED_AT = "30 de junho de 2026";

const FAQ = [
  {
    pergunta: "Não consigo entrar no app. O que fazer?",
    resposta:
      "Use o mesmo e-mail da sua conta Google ou Apple. Se você é novo, entrará como visitante. Membros e voluntários precisam ter o perfil liberado pela liderança. Verifique também sua conexão com a internet.",
  },
  {
    pergunta: "Entrei como visitante. Como obtenho acesso completo?",
    resposta:
      "Complete seu perfil e procure a liderança da igreja ou o responsável pelo seu ministério para atualizar seu papel no sistema (membro, líder, etc.).",
  },
  {
    pergunta: "Não vejo minhas escalas no app",
    resposta:
      "Confirme se você está escalado em um evento futuro e se seu perfil não é visitante. Puxe a lista para baixo para atualizar. Se o problema persistir, fale com o líder do seu ministério.",
  },
  {
    pergunta: "Como confirmo ou recuso uma escala?",
    resposta:
      "Na aba Serviço, toque no evento ou use os botões Confirmar / Recusar no card da escala pendente.",
  },
  {
    pergunta: "Como atualizo minha foto ou bio?",
    resposta:
      "Abra a aba Perfil e toque no ícone de editar (lápis) para alterar nome, bio, foto e datas.",
  },
  {
    pergunta: "O app pediu acesso à câmera, calendário ou notificações. Por quê?",
    resposta:
      "Câmera/galeria: foto de perfil e feed. Calendário: adicionar eventos. Notificações: avisos de escalas e comunicados. Você pode revogar nas configurações do celular.",
  },
  {
    pergunta: "Como solicito exclusão dos meus dados?",
    resposta:
      "Envie e-mail para contato@pibr.org.br informando seu nome e e-mail cadastrado. Consulte também nossa Política de Privacidade.",
  },
];

export default function SuportePage() {
  return (
    <LegalPageShell
      title="Central de Suporte"
      subtitle="Ajuda com o site e o aplicativo PIB Roraima"
      updatedAt={UPDATED_AT}
    >
      <p>
        Estamos aqui para ajudar membros, voluntários e visitantes da{" "}
        <strong>Primeira Igreja Batista de Roraima</strong> com dúvidas sobre o
        site, o sistema interno e o app mobile.
      </p>

      <h2>Contato direto</h2>
      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            E-mail
          </p>
          <a
            href="mailto:contato@pibr.org.br"
            className="mt-2 block text-base font-medium text-gray-900 hover:text-[#9a7b3c]"
          >
            contato@pibr.org.br
          </a>
          <p className="mt-2 text-sm text-gray-600">
            Privacidade, conta, acesso e suporte geral
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Mídia / comunicação
          </p>
          <a
            href="mailto:midia@pibr.org.br"
            className="mt-2 block text-base font-medium text-gray-900 hover:text-[#9a7b3c]"
          >
            midia@pibr.org.br
          </a>
          <p className="mt-2 text-sm text-gray-600">
            Feed, avisos e comunicação institucional
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            WhatsApp
          </p>
          <a
            href="https://wa.me/5595999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-base font-medium text-gray-900 hover:text-[#9a7b3c]"
          >
            (95) 99999-9999
          </a>
          <p className="mt-2 text-sm text-gray-600">
            Horário comercial — substitua pelo número oficial da igreja
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Redes sociais
          </p>
          <a
            href="https://www.instagram.com/pibroraimaoficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-base font-medium text-gray-900 hover:text-[#9a7b3c]"
          >
            @pibroraimaoficial
          </a>
          <p className="mt-2 text-sm text-gray-600">Instagram oficial</p>
        </div>
      </div>

      <h2>Outros canais</h2>
      <ul>
        <li>
          <Link href="/contato">Formulário e informações de contato</Link>
        </li>
        <li>
          <Link href="/cadastro">Cadastro de visitantes</Link>
        </li>
        <li>
          Presencial: secretaria da igreja nos horários de culto e atividades
        </li>
      </ul>

      <h2>Perguntas frequentes — App</h2>
      <div className="not-prose space-y-4">
        {FAQ.map((item) => (
          <details
            key={item.pergunta}
            className="group rounded-xl border border-gray-200 bg-white"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-medium text-gray-900 marker:content-none [&::-webkit-details-marker]:hidden">
              {item.pergunta}
            </summary>
            <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600">
              {item.resposta}
            </div>
          </details>
        ))}
      </div>

      <h2>Informações úteis para suporte técnico</h2>
      <p>Ao reportar um problema no app, informe:</p>
      <ul>
        <li>Seu nome e e-mail de login;</li>
        <li>Modelo do celular e versão do iOS ou Android;</li>
        <li>Versão do app (em Perfil ou configurações);</li>
        <li>Descrição do erro e, se possível, captura de tela.</li>
      </ul>

      <h2>Documentos legais</h2>
      <ul>
        <li>
          <Link href="/privacidade">Política de Privacidade</Link>
        </li>
        <li>
          <Link href="/termos">Termos de Uso</Link>
        </li>
      </ul>

      <h2>Tempo de resposta</h2>
      <p>
        Nossa equipe é voluntária e pastoral. Buscamos responder em até{" "}
        <strong>5 dias úteis</strong>. Casos urgentes relacionados a escalas do
        fim de semana devem ser tratados diretamente com o líder do ministério.
      </p>
    </LegalPageShell>
  );
}
