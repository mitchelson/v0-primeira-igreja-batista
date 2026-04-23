import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"

export const dynamic = "force-dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music, ClipboardList } from "lucide-react"
import Header from "@/components/header"
import { EscalaActions } from "./escala-actions"

export default async function MinhaAreaPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = session.user.id

  const [escalas, ministerios] = await Promise.all([
    sql`
      SELECT e.id, e.funcao, e.status, ev.titulo, ev.data, ev.horario, m.nome as ministerio
      FROM escalas e
      JOIN eventos ev ON ev.id = e.evento_id
      JOIN ministerios m ON m.id = e.ministerio_id
      WHERE e.user_id = ${userId} AND ev.data >= CURRENT_DATE
      ORDER BY ev.data ASC
    `,
    sql`
      SELECT m.nome, m.icone, m.cor, mm.is_lider
      FROM ministerio_membros mm
      JOIN ministerios m ON m.id = mm.ministerio_id
      WHERE mm.user_id = ${userId} AND m.ativo = true
      ORDER BY m.nome
    `,
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Minha Área</h1>
        <p className="text-muted-foreground">Olá, {session.user.name}!</p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Próximas Escalas</CardTitle>
            <CardDescription>Suas participações agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            {escalas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma escala futura.</p>
            ) : (
              <div className="space-y-3">
                {escalas.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm">{e.titulo}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(e.data).toLocaleDateString("pt-BR")}</span>
                        {e.horario && <span>· {e.horario}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.ministerio}{e.funcao ? ` · ${e.funcao}` : ""}</p>
                    </div>
                    <EscalaActions id={e.id} status={e.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Music className="h-5 w-5" />Meus Ministérios</CardTitle>
          </CardHeader>
          <CardContent>
            {ministerios.length === 0 ? (
              <p className="text-sm text-muted-foreground">Você não está vinculado a nenhum ministério.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ministerios.map((m: any) => (
                  <Badge key={m.nome} variant="outline" className="text-sm py-1 px-3" style={{ borderColor: m.cor }}>
                    {m.icone} {m.nome}{m.is_lider ? " ★" : ""}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
