"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Instagram, Menu, Phone, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LEGAL_NAV,
  PUBLIC_CTA,
  PUBLIC_NAV,
  PUBLIC_SECONDARY,
} from "@/lib/nav-config"
import { CHURCH_INFO } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useState } from "react"

type SiteShellProps = {
  children: React.ReactNode
  /** Dark chrome for home hero pages */
  variant?: "light" | "dark"
  /** Hide footer (rare) */
  hideFooter?: boolean
}

export function SiteShell({
  children,
  variant = "light",
  hideFooter = false,
}: SiteShellProps) {
  const pathname = usePathname()
  const dark = variant === "dark"
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        dark ? "bg-[#0a0a0a] text-white" : "bg-background text-foreground"
      )}
    >
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-md",
          dark
            ? "bg-[#0a0a0a]/80 border-white/5"
            : "bg-background/90 border-border"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
            <Image
              src={dark ? "/pib-logo-white.png" : "/pib-logo-black.png"}
              alt={CHURCH_INFO.SHORT_NAME}
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {PUBLIC_NAV.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors",
                    dark
                      ? active
                        ? "text-primary"
                        : "text-gray-300 hover:text-white"
                      : active
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href={PUBLIC_SECONDARY.href}
              className={cn(
                "text-sm",
                dark ? "text-gray-300 hover:text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {PUBLIC_SECONDARY.label}
            </Link>
            <Button asChild size="sm" className="rounded-full font-semibold">
              <Link href={PUBLIC_CTA.href}>{PUBLIC_CTA.label}</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <Button asChild size="sm" className="rounded-full h-8 px-3 text-xs font-semibold">
              <Link href={PUBLIC_CTA.href}>{PUBLIC_CTA.label}</Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={dark ? "text-white hover:bg-white/10" : undefined}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="mt-8 flex flex-col gap-1">
                  {PUBLIC_NAV.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={PUBLIC_SECONDARY.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent"
                  >
                    {PUBLIC_SECONDARY.label}
                  </Link>
                  <Button asChild className="mt-4 rounded-full font-semibold">
                    <Link href={PUBLIC_CTA.href} onClick={() => setOpen(false)}>
                      {PUBLIC_CTA.label}
                    </Link>
                  </Button>
                  <Link
                    href="/minha-area"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent"
                  >
                    Área do membro
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      {!hideFooter && (
        <footer
          className={cn(
            "border-t pt-14 pb-10 px-4",
            dark ? "bg-[#050505] border-white/5" : "bg-muted/40 border-border"
          )}
        >
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
            <div>
              <Image
                src={dark ? "/pib-logo-white.png" : "/pib-logo-black.png"}
                alt={CHURCH_INFO.SHORT_NAME}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  dark ? "text-gray-500" : "text-muted-foreground"
                )}
              >
                Uma comunidade apaixonada por Jesus, dedicada à transformação de vidas.
              </p>
            </div>
            <div>
              <h4
                className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-wider",
                  dark ? "text-gray-400" : "text-muted-foreground"
                )}
              >
                Navegação
              </h4>
              <ul className="space-y-2">
                {PUBLIC_NAV.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "text-sm transition-colors hover:text-primary",
                        dark ? "text-gray-500" : "text-muted-foreground"
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-wider",
                  dark ? "text-gray-400" : "text-muted-foreground"
                )}
              >
                Legal
              </h4>
              <ul className="space-y-2">
                {LEGAL_NAV.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "text-sm transition-colors hover:text-primary",
                        dark ? "text-gray-500" : "text-muted-foreground"
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-wider",
                  dark ? "text-gray-400" : "text-muted-foreground"
                )}
              >
                Contato
              </h4>
              <p className={cn("text-sm mb-3", dark ? "text-gray-500" : "text-muted-foreground")}>
                {CHURCH_INFO.CITY}
                <br />
                {CHURCH_INFO.EMAIL}
              </p>
              <div className="flex gap-2">
                <a
                  href={CHURCH_INFO.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary",
                    dark ? "border-white/10" : "border-border"
                  )}
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={CHURCH_INFO.YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary",
                    dark ? "border-white/10" : "border-border"
                  )}
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/${CHURCH_INFO.WHATSAPP_E164}`}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary",
                    dark ? "border-white/10" : "border-border"
                  )}
                  aria-label="WhatsApp"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <p
            className={cn(
              "mx-auto mt-10 max-w-6xl border-t pt-6 text-center text-xs",
              dark ? "border-white/5 text-gray-600" : "border-border text-muted-foreground"
            )}
          >
            © {new Date().getFullYear()} {CHURCH_INFO.NAME}. Todos os direitos reservados.
          </p>
        </footer>
      )}
    </div>
  )
}
