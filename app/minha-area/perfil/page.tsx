"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Camera, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function PerfilPage() {
  const router = useRouter()
  const { data: perfil, mutate } = useSWR("/api/users/me", fetcher)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Inicializa form quando perfil carrega
  const f = form ?? perfil ?? {}

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm({ ...f, foto_url: url })
    } else {
      toast({ title: "Erro no upload", variant: "destructive" })
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: f.nome,
        bio: f.bio,
        nascimento: f.nascimento || null,
        data_batismo: f.data_batismo || null,
        foto_url: f.foto_url,
      }),
    })
    if (res.ok) {
      mutate()
      toast({ title: "Perfil atualizado!" })
    } else {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    }
    setSaving(false)
  }

  if (!perfil) return <div className="p-6 text-center">Carregando...</div>

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/minha-area")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Meu Perfil</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={f.foto_url} />
              <AvatarFallback className="text-2xl">{f.nome?.[0]}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1.5"
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <p className="text-sm text-gray-500">Clique no ícone para alterar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={f.nome || ""} onChange={(e) => setForm({ ...f, nome: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Biografia</Label>
            <Textarea
              value={f.bio || ""}
              onChange={(e) => setForm({ ...f, bio: e.target.value })}
              placeholder="Conte um pouco sobre você..."
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Data de Nascimento</Label>
            <Input type="date" value={f.nascimento?.split("T")[0] || ""} onChange={(e) => setForm({ ...f, nascimento: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Data de Batismo</Label>
            <Input type="date" value={f.data_batismo?.split("T")[0] || ""} onChange={(e) => setForm({ ...f, data_batismo: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Salvando...</> : "Salvar Alterações"}
      </Button>
    </div>
  )
}
