"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sparkles, Calendar } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function UserProfileDialog({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [open, setOpen] = useState(false)
  const { data: profile } = useSWR(open ? `/api/users/${userId}/profile` : null, fetcher)

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogTitle className="sr-only">Perfil</DialogTitle>
          {!profile ? (
            <div className="p-8 text-center text-gray-400">Carregando...</div>
          ) : profile.error ? (
            <div className="p-8 text-center text-gray-400">Não encontrado</div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.foto_url} />
                  <AvatarFallback className="text-xl">{profile.nome?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{profile.nome}</p>
                  {profile.bio && <p className="text-sm text-gray-500 line-clamp-2">{profile.bio}</p>}
                </div>
              </div>

              {/* Ministérios */}
              {profile.ministerios?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.ministerios.map((m: any) => (
                    <span key={m.nome} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs">
                      {m.icone || "⛪"} {m.nome}
                      {m.is_lider && <span className="text-amber-500">★</span>}
                    </span>
                  ))}
                </div>
              )}

              {/* Dons */}
              {profile.dons && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5"><Sparkles className="h-3 w-3 inline mr-1" />Dons</p>
                  <div className="space-y-1">
                    {(profile.dons as any[]).filter((r: any) => r.rank <= 3).map((r: any) => (
                      <div key={r.gift} className="flex items-center gap-2 text-sm">
                        <span className="text-xs font-bold text-green-700">{r.rank}°</span>
                        <span className="flex-1">{r.gift}</span>
                        <span className="text-xs text-green-600">{r.score}/12</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Próxima escala */}
              {profile.proximas_escalas?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5"><Calendar className="h-3 w-3 inline mr-1" />Próxima escala</p>
                  <div className="flex items-center gap-2 text-sm border rounded-lg p-2">
                    <span>{profile.proximas_escalas[0].icone || "📋"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{profile.proximas_escalas[0].titulo}</p>
                      <p className="text-xs text-gray-500">{profile.proximas_escalas[0].ministerio}</p>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(profile.proximas_escalas[0].data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })}</p>
                  </div>
                </div>
              )}

              {/* Ver perfil completo */}
              <Link href={`/perfil/${userId}`} onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Ver perfil completo</Button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
