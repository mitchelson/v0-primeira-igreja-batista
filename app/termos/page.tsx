import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Termos de Uso | PIB Roraima",
  description:
    "Termos de uso do site, sistema e aplicativo mobile da Primeira Igreja Batista de Roraima.",
};

const UPDATED_AT = "30 de junho de 2026";

export default function TermosPage() {
  return (
    <LegalPageShell
      title="Termos de Uso"
      subtitle="Condições para uso do site, sistema e app PIB Roraima"
      updatedAt={UPDATED_AT}
    >
      <p>
        Ao acessar o site, o sistema interno ou o aplicativo{" "}
        <strong>PIB Roraima</strong>, você concorda com estes Termos de Uso.
        Se não concordar, não utilize nossos serviços digitais.
      </p>

      <h2>1. Sobre o serviço</h2>
      <p>
        Os serviços digitais da <strong>Primeira Igreja Batista de Roraima</strong>{" "}
        existem para apoiar a vida comunitária da igreja: comunicação, escalas
        de ministérios, eventos, cadastro de visitantes, feed interno e
        ferramentas administrativas para liderança autorizada.
      </p>
      <p>
        O aplicativo mobile complementa a participação na igreja; não substitui
        a comunhão presencial nos cultos e atividades.
      </p>

      <h2>2. Elegibilidade e conta</h2>
      <ul>
        <li>
          O acesso é destinado principalmente à comunidade da PIB Roraima e
          pessoas vinculadas à igreja.
        </li>
        <li>
          O login é feito com conta Google ou Apple (Sign in with Apple no
          iOS). Você é responsável pela segurança da sua conta no provedor
          escolhido.
        </li>
        <li>
          Novos usuários podem entrar como <strong>visitante</strong>, com
          funcionalidades limitadas, até que a liderança atualize o perfil.
        </li>
        <li>
          Perfis como membro, líder, supervisor e administrador são atribuídos
          pela liderança conforme critérios internos da igreja.
        </li>
      </ul>

      <h2>3. Uso permitido</h2>
      <p>Você concorda em utilizar os serviços de forma lícita, respeitosa e alinhada aos valores cristãos da comunidade, incluindo:</p>
      <ul>
        <li>Fornecer informações verdadeiras no cadastro e no perfil;</li>
        <li>Confirmar ou recusar escalas de forma responsável;</li>
        <li>Publicar conteúdo edificante e adequado no feed;</li>
        <li>Respeitar a privacidade de outros membros e visitantes;</li>
        <li>Utilizar ferramentas administrativas apenas se autorizado.</li>
      </ul>

      <h2>4. Uso proibido</h2>
      <p>É vedado:</p>
      <ul>
        <li>Usar o sistema para fins ilegais, ofensivos, discriminatórios ou abusivos;</li>
        <li>Tentar acessar áreas ou dados sem permissão;</li>
        <li>Compartilhar credenciais ou se passar por outra pessoa;</li>
        <li>Interferir na operação, segurança ou integridade da plataforma;</li>
        <li>Extrair dados em massa ou usar automação não autorizada;</li>
        <li>Publicar conteúdo que viole direitos de terceiros ou leis aplicáveis.</li>
      </ul>

      <h2>5. Conteúdo do usuário</h2>
      <p>
        Você mantém a titularidade do conteúdo que publica (textos, fotos,
        etc.), mas concede à PIB Roraima licença não exclusiva para
        hospedar, exibir e processar esse conteúdo dentro do sistema, exclusivamente
        para operar o serviço.
      </p>
      <p>
        A liderança pode remover conteúdo ou restringir contas que violem estes
        termos ou normas internas da igreja.
      </p>

      <h2>6. Propriedade intelectual</h2>
      <p>
        Marcas, logotipos, layout, software e materiais institucionais da PIB
        Roraima são protegidos por direitos autorais e demais leis aplicáveis.
        É proibida a reprodução não autorizada.
      </p>

      <h2>7. Disponibilidade e alterações</h2>
      <p>
        Buscamos manter os serviços disponíveis, mas não garantimos
        funcionamento ininterrupto. Podemos alterar, suspender ou descontinuar
        funcionalidades, realizar manutenções ou atualizações (incluindo via OTA
        no app) a qualquer momento.
      </p>

      <h2>8. Isenção de garantias</h2>
      <p>
        Os serviços são fornecidos “como estão”, dentro das possibilidades
        técnicas e organizacionais da igreja. Não garantimos que atenderão a
        todas as expectativas individuais ou que estarão livres de erros.
      </p>

      <h2>9. Limitação de responsabilidade</h2>
      <p>
        Na medida permitida pela lei, a PIB Roraima não se responsabiliza por
        danos indiretos, lucros cessantes ou perdas decorrentes do uso ou
        impossibilidade de uso dos serviços, exceto quando houver dolo ou culpa
        grave comprovada.
      </p>

      <h2>10. Privacidade</h2>
      <p>
        O tratamento de dados pessoais é regido pela nossa{" "}
        <Link href="/privacidade">Política de Privacidade</Link>, parte
        integrante destes termos.
      </p>

      <h2>11. Encerramento de conta</h2>
      <p>
        Você pode solicitar encerramento ou correção de dados conforme a
        Política de Privacidade. A liderança pode suspender ou encerrar acessos
        que violem estes termos ou políticas internas.
      </p>

      <h2>12. Legislação aplicável</h2>
      <p>
        Estes termos são regidos pelas leis da República Federativa do Brasil.
        Fica eleito o foro da comarca de Boa Vista/RR para dirimir controvérsias,
        salvo disposição legal em contrário aplicável ao consumidor.
      </p>

      <h2>13. Alterações dos termos</h2>
      <p>
        Podemos revisar estes termos periodicamente. O uso continuado após a
        publicação de alterações constitui aceitação, salvo quando a lei exigir
        consentimento específico.
      </p>

      <h2>14. Contato</h2>
      <p>
        E-mail: <a href="mailto:contato@pibr.org.br">contato@pibr.org.br</a>
        <br />
        Suporte: <Link href="/suporte">/suporte</Link>
        <br />
        Contato geral: <Link href="/contato">/contato</Link>
      </p>
    </LegalPageShell>
  );
}
