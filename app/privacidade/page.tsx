import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Política de Privacidade | PIB Roraima",
  description:
    "Como a Primeira Igreja Batista de Roraima coleta, usa e protege seus dados no site e no app mobile.",
};

const UPDATED_AT = "30 de junho de 2026";

export default function PrivacidadePage() {
  return (
    <LegalPageShell
      title="Política de Privacidade"
      subtitle="Site, sistema interno e aplicativo mobile PIB Roraima"
      updatedAt={UPDATED_AT}
    >
      <p>
        A <strong>Primeira Igreja Batista de Roraima</strong> (“PIB Roraima”,
        “nós”) respeita sua privacidade. Esta política descreve como tratamos
        dados pessoais quando você utiliza nosso site, o sistema de gestão da
        igreja e o aplicativo mobile <strong>PIB Roraima</strong> (iOS e
        Android).
      </p>

      <h2>1. Quem somos</h2>
      <p>
        <strong>Controlador dos dados:</strong> Primeira Igreja Batista de
        Roraima
        <br />
        <strong>Local:</strong> Boa Vista, Roraima, Brasil
        <br />
        <strong>Contato:</strong>{" "}
        <a href="mailto:contato@pibr.org.br">contato@pibr.org.br</a> ·{" "}
        <Link href="/suporte">Central de Suporte</Link>
      </p>

      <h2>2. Quais dados coletamos</h2>
      <p>Dependendo de como você usa nossos serviços, podemos tratar:</p>
      <ul>
        <li>
          <strong>Identificação e contato:</strong> nome, e-mail, telefone,
          foto de perfil, data de nascimento e data de batismo (quando
          informados).
        </li>
        <li>
          <strong>Autenticação:</strong> identificadores de conta Google ou
          Apple (Sign in with Apple / Google), necessários para login seguro.
        </li>
        <li>
          <strong>Dados de visitantes:</strong> informações de cadastro
          pastoral (endereço, bairro, faixa etária, preferências de visita,
          etc.), quando aplicável.
        </li>
        <li>
          <strong>Atividade na igreja:</strong> ministérios, escalas, funções,
          confirmações, indisponibilidades, dons espirituais (formulário),
          participação em eventos e interações no feed.
        </li>
        <li>
          <strong>Conteúdo enviado por você:</strong> textos, fotos e
          comentários publicados no feed ou no perfil.
        </li>
        <li>
          <strong>Notificações push:</strong> token do dispositivo (Expo Push)
          para avisos sobre escalas e comunicados.
        </li>
        <li>
          <strong>Dados técnicos:</strong> logs de acesso, endereço IP,
          identificadores de sessão e informações do dispositivo/navegador
          necessários à segurança e operação do serviço.
        </li>
      </ul>

      <h2>3. Para que usamos seus dados</h2>
      <ul>
        <li>Autenticar e manter sua conta no site e no app;</li>
        <li>Gerenciar escalas, ministérios, eventos e comunicação interna;</li>
        <li>Enviar notificações relevantes (escalas, trocas, avisos);</li>
        <li>Permitir interação no feed e no perfil da comunidade;</li>
        <li>Acompanhar visitantes e mensagens de boas-vindas (equipe autorizada);</li>
        <li>Garantir segurança, prevenir fraudes e cumprir obrigações legais;</li>
        <li>Melhorar a experiência de uso dos nossos sistemas.</li>
      </ul>

      <h2>4. Bases legais (LGPD)</h2>
      <p>Tratamos dados com base, conforme o caso, em:</p>
      <ul>
        <li>
          <strong>Execução de contrato ou procedimentos preliminares</strong>{" "}
          — uso do sistema por membros e voluntários;
        </li>
        <li>
          <strong>Consentimento</strong> — quando você autoriza cadastros,
          publicações ou notificações;
        </li>
        <li>
          <strong>Legítimo interesse</strong> — segurança, melhoria do serviço
          e comunicação pastoral, respeitando seus direitos;
        </li>
        <li>
          <strong>Obrigação legal</strong> — quando exigido por lei ou
          autoridade competente.
        </li>
      </ul>

      <h2>5. Compartilhamento de dados</h2>
      <p>
        Não vendemos seus dados. Podemos compartilhá-los apenas quando
        necessário com:
      </p>
      <ul>
        <li>
          <strong>Provedores de tecnologia</strong> que operam nossa
          infraestrutura (hospedagem, banco de dados, autenticação), como
          Vercel e Neon;
        </li>
        <li>
          <strong>Google e Apple</strong> — somente no fluxo de login que você
          escolhe;
        </li>
        <li>
          <strong>Expo (EAS)</strong> — distribuição e atualizações do
          aplicativo mobile;
        </li>
        <li>
          <strong>Liderança e equipes autorizadas</strong> da igreja, conforme
          seu perfil de acesso (membro, líder, supervisor, admin).
        </li>
      </ul>
      <p>
        Esses parceiros são contratualmente obrigados a proteger os dados e
        usá-los somente para prestar o serviço contratado.
      </p>

      <h2>6. Retenção</h2>
      <p>
        Mantemos os dados enquanto sua conta estiver ativa ou enquanto forem
        necessários para as finalidades descritas, respeitando prazos legais e
        pastoral. Você pode solicitar exclusão ou atualização conforme a seção
        8.
      </p>

      <h2>7. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais razoáveis, como conexões
        criptografadas (HTTPS), autenticação segura, controle de acesso por
        perfil e armazenamento protegido. Nenhum sistema é 100% isento de
        riscos; em caso de incidente relevante, comunicaremos conforme a lei.
      </p>

      <h2>8. Seus direitos (titular de dados)</h2>
      <p>
        Nos termos da Lei nº 13.709/2018 (LGPD), você pode solicitar:
      </p>
      <ul>
        <li>Confirmação e acesso aos dados;</li>
        <li>Correção de dados incompletos ou desatualizados;</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Portabilidade, quando aplicável;</li>
        <li>Revogação de consentimento;</li>
        <li>Informação sobre compartilhamentos.</li>
      </ul>
      <p>
        Para exercer seus direitos, envie e-mail para{" "}
        <a href="mailto:contato@pibr.org.br">contato@pibr.org.br</a>, acesse{" "}
        <Link href="/excluir-conta">a página de exclusão de conta</Link> ou{" "}
        <Link href="/suporte">/suporte</Link>. Responderemos em prazo razoável.
      </p>

      <h2>9. Crianças e adolescentes</h2>
      <p>
        Nossos serviços são destinados principalmente à comunidade da igreja. O
        cadastro de menores deve ser feito com conhecimento e responsabilidade
        dos pais ou responsáveis legais, quando aplicável.
      </p>

      <h2>10. Cookies e tecnologias similares</h2>
      <p>
        O site pode usar cookies e armazenamento local para manter sua sessão
        de login e preferências. Você pode gerenciar cookies no navegador; a
        desativação pode limitar funcionalidades.
      </p>

      <h2>11. Aplicativo mobile</h2>
      <p>
        O app PIB Roraima pode solicitar permissões do dispositivo:
      </p>
      <ul>
        <li>
          <strong>Câmera e galeria</strong> — foto de perfil e publicações no
          feed;
        </li>
        <li>
          <strong>Calendário</strong> — adicionar eventos da igreja;
        </li>
        <li>
          <strong>Notificações</strong> — avisos de escalas e comunicados.
        </li>
      </ul>
      <p>
        Você pode revogar permissões nas configurações do sistema operacional a
        qualquer momento.
      </p>

      <h2>12. Alterações desta política</h2>
      <p>
        Podemos atualizar esta política periodicamente. A data da última
        revisão será indicada no topo da página. Alterações relevantes poderão
        ser comunicadas no app ou no site.
      </p>

      <h2>13. Contato</h2>
      <p>
        Dúvidas sobre privacidade:{" "}
        <a href="mailto:contato@pibr.org.br">contato@pibr.org.br</a>
        <br />
        Suporte técnico: <Link href="/suporte">página de suporte</Link>
      </p>
    </LegalPageShell>
  );
}
