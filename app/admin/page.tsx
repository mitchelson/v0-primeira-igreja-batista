import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Music, ClipboardList } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const session = await auth()

  const [visitantesCount, eventosProximos, escalasUsuario, ministeriosCount] = await Promise.all([
    sql`SELECT count(*)::int as total FROM visitantes WHERE data_cadastro >= now() - interval '30 days'`,
    sql`SELECT id, titulo, data, horario, tipo FROM eventos WHERE data >= CURRENT_DATE ORDER BY data ASC LIMIT 5`,
    session?.user?.id
      ? sql`
          SELECT e.id, e.funcao, e.status, ev.titulo, ev.data, ev.horario, m.nome as ministerio
          FROM escalas e
          JOIN eventos ev ON ev.id = e.evento_id
          JOIN ministerios m ON m.id = e.ministerio_id
          WHERE e.user_id = ${session.user.id} AND ev.data >= CURRENT_DATE
          ORDER BY ev.data ASC LIMIT 5
        `
      : Promise.resolve([]),
    sql`SELECT count(*)::int as total FROM ministerios WHERE ativo = true`,
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/visitantes">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Visitantes (30d)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitantesCount[0].total}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/ministerios">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ministérios</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ministeriosCount[0].total}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/eventos">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventosProximos.length}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/escalas">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Minhas Escalas</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{escalasUsuario.length}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Eventos agendados</CardDescription>
          </CardHeader>
          <CardContent>
            {eventosProximos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum evento agendado.</p>
            ) : (
              <div className="space-y-3">
                {eventosProximos.map((ev: any) => (
                  <div key={ev.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{ev.titulo}</p>
                      <p className="text-xs text-muted-foreground">{ev.tipo}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p>{new Date(ev.data).toLocaleDateString("pt-BR")}</p>
                      {ev.horario && <p className="text-xs text-muted-foreground">{ev.horario}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Escalas</CardTitle>
            <CardDescription>Suas próximas participações</CardDescription>
          </CardHeader>
          <CardContent>
            {escalasUsuario.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma escala futura.</p>
            ) : (
              <div className="space-y-3">
                {escalasUsuario.map((esc: any) => (
                  <div key={esc.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{esc.titulo}</p>
                      <p className="text-xs text-muted-foreground">{esc.ministerio}{esc.funcao ? ` · ${esc.funcao}` : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(esc.data).toLocaleDateString("pt-BR")}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${esc.status === "confirmado" ? "bg-green-100 text-green-700" : esc.status === "recusado" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {esc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
