"use client"

import { useParams } from "next/navigation"
import useSWR from "swr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Sparkles } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { data: profile } = useSWR(`/api/users/${id}/profile`, fetcher)

  if (!profile) return <div className="p-6 text-center text-gray-400">Carregando...</div>
  if (profile.error) return <div className="p-6 text-center text-gray-500">Perfil não encontrado</div>

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto">
      <div className="border-b px-4 py-3 flex items-center gap-3">
        <Link href="/feed" className="text-sm text-gray-500">← Feed</Link>
        <h1 className="font-semibold text-lg flex-1">{profile.nome?.split(" ")[0]}</h1>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Avatar + stats */}
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.foto_url} />
            <AvatarFallback className="text-2xl">{profile.nome?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex gap-6 text-center">
            <div>
              <p className="font-bold text-lg">{profile.ministerios?.length || 0}</p>
              <p className="text-xs text-gray-500">Ministérios</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profile.dons ? 3 : 0}</p>
              <p className="text-xs text-gray-500">Dons</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profile.proximas_escalas?.length || 0}</p>
              <p className="text-xs text-gray-500">Escalas</p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm">{profile.nome}</p>
          {profile.bio && <p className="text-sm text-gray-700 mt-1">{profile.bio}</p>}
        </div>

        {profile.ministerios?.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ministérios</h3>
            <div className="flex flex-wrap gap-2">
              {profile.ministerios.map((m: any) => (
                <span key={m.nome} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm">
                  <span>{m.icone || "⛪"}</span>
                  <span>{m.nome}</span>
                  {m.is_lider && <span className="text-amber-500 text-xs">★</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {profile.dons && (
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              <Sparkles className="h-3 w-3 inline mr-1" />Dons Espirituais
            </h3>
            <div className="space-y-1.5">
              {(profile.dons as any[]).filter((r: any) => r.rank <= 3).map((r: any) => (
                <div key={r.gift} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                  <span className="text-xs font-bold text-green-700">{r.rank}°</span>
                  <span className="text-sm flex-1">{r.gift}</span>
                  <span className="text-xs text-green-600 font-semibold">{r.score}/12</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.proximas_escalas?.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              <Calendar className="h-3 w-3 inline mr-1" />Próximas Escalas
            </h3>
            <div className="space-y-2">
              {profile.proximas_escalas.map((e: any, i: number) => (
                <div key={i} className="flex items-center gap-3 border rounded-lg p-3">
                  <span className="text-lg">{e.icone || "📋"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.titulo}</p>
                    <p className="text-xs text-gray-500">{e.ministerio}{e.funcao ? ` · ${e.funcao}` : ""}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(e.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
