import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

const LEGAL_LINKS = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos de Uso" },
  { href: "/suporte", label: "Suporte" },
  { href: "/contato", label: "Contato" },
];

interface LegalPageShellProps {
  title: string;
  subtitle?: string;
  updatedAt: string;
  children: ReactNode;
}

export function LegalPageShell({
  title,
  subtitle,
  updatedAt,
  children,
}: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/pib-logo-black.png"
              alt="PIB Roraima"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Voltar ao início
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7b3c]">
          Primeira Igreja Batista de Roraima
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-lg text-gray-600">{subtitle}</p>
        ) : null}
        <p className="mt-4 text-sm text-gray-500">
          Última atualização: {updatedAt}
        </p>

        <div className="prose prose-gray mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[#9a7b3c] prose-a:no-underline hover:prose-a:underline">
          {children}
        </div>
      </article>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} Primeira Igreja Batista de Roraima.
            Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
