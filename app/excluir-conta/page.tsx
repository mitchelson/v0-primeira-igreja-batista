import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Excluir conta e dados | PIB Roraima",
  description:
    "Solicite a exclusão da sua conta e dos dados associados no aplicativo PIB Roraima.",
};

const UPDATED_AT = "30 de junho de 2026";
const EMAIL = "contato@pibr.org.br";

const MAILTO_SUBJECT = encodeURIComponent(
  "Solicitação de exclusão de conta — App PIB Roraima",
);
const MAILTO_BODY = encodeURIComponent(
  `Olá,

Solicito a exclusão da minha conta e dos dados associados no aplicativo PIB Roraima.

Nome completo:
E-mail usado no login (Google / Apple / e-mail):
Telefone (opcional):

Confirmo que entendo que esta ação é irreversível.

Atenciosamente,`,
);

export default function ExcluirContaPage() {
  return (
    <LegalPageShell
      title="Exclusão de conta e dados"
      subtitle="Aplicativo PIB Roraima (Android e iOS)"
      updatedAt={UPDATED_AT}
    >
      <p>
        Você pode solicitar a <strong>exclusão permanente da sua conta</strong> e
        dos dados pessoais associados ao aplicativo{" "}
        <strong>PIB Roraima</strong>, desenvolvido para a Primeira Igreja
        Batista de Roraima.
      </p>

      <div className="not-prose my-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-900">
          Solicitar exclusão por e-mail
        </p>
        <p className="mt-2 text-sm text-amber-800">
          Envie sua solicitação para{" "}
          <a
            href={`mailto:${EMAIL}?subject=${MAILTO_SUBJECT}&body=${MAILTO_BODY}`}
            className="font-medium underline"
          >
            {EMAIL}
          </a>{" "}
          com o assunto &quot;Solicitação de exclusão de conta — App PIB
          Roraima&quot;.
        </p>
        <a
          href={`mailto:${EMAIL}?subject=${MAILTO_SUBJECT}&body=${MAILTO_BODY}`}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#9a7b3c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#826832]"
        >
          Abrir e-mail de solicitação
        </a>
      </div>

      <h2>Como solicitar</h2>
      <ol>
        <li>
          Envie um e-mail para{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> a partir do endereço
          cadastrado na sua conta (quando possível).
        </li>
        <li>
          Informe seu <strong>nome completo</strong> e o{" "}
          <strong>e-mail usado para entrar no app</strong> (Google, Apple ou
          e-mail/senha).
        </li>
        <li>
          Escreva explicitamente que deseja a{" "}
          <strong>exclusão da conta e dos dados</strong> do aplicativo PIB
          Roraima.
        </li>
        <li>
          Nossa equipe confirmará o recebimento e processará o pedido em até{" "}
          <strong>15 dias úteis</strong>.
        </li>
      </ol>
      <p>
        Se você não tiver mais acesso ao e-mail da conta, inclua no pedido seu
        nome completo e telefone para que possamos verificar sua identidade com
        a liderança da igreja.
      </p>

      <h2>O que será excluído</h2>
      <p>Após a confirmação e verificação, removemos ou anonimizamos:</p>
      <ul>
        <li>Conta de usuário (login Google, Apple ou Firebase/e-mail);</li>
        <li>Perfil: nome, foto, bio, datas e telefone;</li>
        <li>Tokens de notificação push do dispositivo;</li>
        <li>Indisponibilidades e preferências do perfil;</li>
        <li>Resultados do teste de dons espirituais;</li>
        <li>Curtidas e comentários no feed associados à sua conta;</li>
        <li>Vínculos com ministérios e solicitações pendentes;</li>
        <li>Escalas futuras em seu nome (removidas ou transferidas conforme orientação pastoral).</li>
      </ul>

      <h2>O que pode ser mantido</h2>
      <p>
        Por obrigação legal, segurança ou registro pastoral interno, alguns
        dados podem ser <strong>retidos de forma limitada</strong>:
      </p>
      <ul>
        <li>
          Registros de escalas e eventos já realizados podem ser{" "}
          <strong>anonimizados</strong> (sem identificação pessoal) para histórico
          da igreja;
        </li>
        <li>
          Logs técnicos de acesso podem ser mantidos por até{" "}
          <strong>90 dias</strong> para segurança e prevenção de fraudes;
        </li>
        <li>
          Dados exigidos por lei ou ordem judicial, quando aplicável.
        </li>
      </ul>
      <p>
        Não vendemos seus dados. Consulte a{" "}
        <Link href="/privacidade">Política de Privacidade</Link> para mais
        detalhes.
      </p>

      <h2>Antes de excluir</h2>
      <ul>
        <li>
          A exclusão é <strong>irreversível</strong>. Será necessário criar uma
          nova conta para usar o app novamente.
        </li>
        <li>
          Se você é membro ativo com escalas futuras, avise seu líder de
          ministério antes de solicitar a exclusão.
        </li>
        <li>
          Você pode revogar permissões do app (câmera, notificações, etc.) nas
          configurações do celular sem excluir a conta.
        </li>
      </ul>

      <h2>Outras opções</h2>
      <ul>
        <li>
          <strong>Atualizar dados</strong> — em Perfil no app, sem excluir a
          conta;
        </li>
        <li>
          <strong>Sair do app</strong> — use Sair em Perfil; seus dados
          permanecem até você solicitar exclusão;
        </li>
        <li>
          <Link href="/suporte">Central de Suporte</Link> — dúvidas gerais sobre
          o aplicativo.
        </li>
      </ul>

      <h2>Contato</h2>
      <p>
        <strong>E-mail:</strong>{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <br />
        <strong>Igreja:</strong> Primeira Igreja Batista de Roraima — Boa Vista,
        RR, Brasil
        <br />
        <strong>App:</strong> PIB Roraima · pacote Android{" "}
        <code>com.zenvixlabs.pibrr</code>
      </p>
    </LegalPageShell>
  );
}
