import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Music, ClipboardList, MessageSquare, UserCog, Settings, Sparkles, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const session = await auth()
  const role = session?.user?.role
  const ministerioIds: string[] = (session?.user as any)?.ministerioIds || []

  const [visitantesCount, ministerios] = await Promise.all([
    sql`SELECT count(*)::int as total FROM visitantes WHERE data_cadastro >= now() - interval '30 days'`,
    sql`SELECT id, nome, icone, cor FROM ministerios WHERE ativo = true ORDER BY ordem ASC, nome ASC`,
  ])

  // Líderes/supervisores só veem seus ministérios
  const visibleMinisterios = role === "admin"
    ? ministerios
    : ministerios.filter((m: any) => ministerioIds.includes(m.id))

  const adminMenus = [
    { href: "/admin/visitantes", label: "Visitantes", icon: Users, desc: `${visitantesCount[0].total} nos últimos 30 dias` },
    { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare, desc: "Enviar e gerenciar" },
    { href: "/admin/membros", label: "Membros", icon: UserCog, desc: "Gerenciar usuários" },
    { href: "/admin/eventos", label: "Eventos", icon: Calendar, desc: "Criar e editar eventos" },
    { href: "/admin/escalas", label: "Escalas", icon: ClipboardList, desc: "Gerenciar escalas" },
    { href: "/admin/dons-espirituais", label: "Dons Espirituais", icon: Sparkles, desc: "Resultados" },
    { href: "/admin/form-ministerios", label: "Form. Ministérios", icon: BookOpen, desc: "Respostas" },
    { href: "/admin/configuracoes", label: "Configurações", icon: Settings, desc: "Sistema" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Administração</h1>

      {/* Ministérios */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Ministérios</h2>
        <div className="grid gap-2">
          {visibleMinisterios.map((m: any) => (
            <Link key={m.id} href={`/admin/ministerios/${m.id}`}>
              <div className="flex items-center gap-3 bg-white rounded-xl border p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <span className="text-xl">{m.icone || "⛪"}</span>
                <span className="flex-1 font-medium text-sm">{m.nome}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          ))}
          {role === "admin" && (
            <Link href="/admin/ministerios">
              <div className="flex items-center gap-3 bg-white rounded-xl border border-dashed p-3 hover:bg-gray-50 transition-colors">
                <Music className="h-5 w-5 text-gray-400" />
                <span className="flex-1 text-sm text-gray-500">Gerenciar ministérios</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Menu admin (só para admin) */}
      {role === "admin" && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Sistema</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {adminMenus.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 bg-white rounded-xl border p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                  <item.icon className="h-5 w-5 text-gray-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
