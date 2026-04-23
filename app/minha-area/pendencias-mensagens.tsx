"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, ExternalLink, ChevronRight } from "lucide-react"
import { processarTemplateMensagem, gerarLinkWhatsApp } from "@/lib/utils"
import type { MensagemCategoria } from "@/types/supabase"

interface Pendencia {
  id: string
  nome: string
  celular: string
  data_cadastro: string
  enviadas: number
  total_categorias: number
  pendentes: number
}

export function PendenciasMensagens() {
  const [pendencias, setPendencias] = useState<Pendencia[]>([])
  const [categorias, setCategorias] = useState<MensagemCategoria[]>([])
  const [loading, setLoading] = useState(true)

  // Drawer state
  const [visitanteSel, setVisitanteSel] = useState<Pendencia | null>(null)
  const [enviadas, setEnviadas] = useState<Set<string>>(new Set())
  const [catSel, setCatSel] = useState<MensagemCategoria | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/users/me/pendencias"),
        fetch("/api/mensagens/categorias"),
      ])
      if (pRes.ok) setPendencias(await pRes.json())
      if (cRes.ok) {
        const data = await cRes.json()
        setCategorias(data.filter((c: MensagemCategoria) => c.ativa))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openVisitante = async (v: Pendencia) => {
    setVisitanteSel(v)
    const res = await fetch(`/api/mensagens/enviadas?visitante_id=${v.id}`)
    if (res.ok) {
      const data = await res.json()
      setEnviadas(new Set(data.map((e: any) => e.categoria_id)))
    }
  }

  const handleEnviar = (cat: MensagemCategoria, modelo: any) => {
    if (!visitanteSel) return
    const msg = processarTemplateMensagem(modelo.corpo, visitanteSel as any)
    window.open(gerarLinkWhatsApp(visitanteSel.celular, msg), "_blank")
    setCatSel(null)
  }

  const handleMarcar = async (categoriaId: string) => {
    if (!visitanteSel) return
    await fetch("/api/mensagens/enviadas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitante_id: visitanteSel.id, categoria_id: categoriaId }),
    })
    setEnviadas(prev => new Set([...prev, categoriaId]))
    // Atualiza pendências
    setPendencias(prev => {
      const updated = prev.map(p =>
        p.id === visitanteSel.id ? { ...p, enviadas: p.enviadas + 1, pendentes: p.pendentes - 1 } : p
      )
      return updated.filter(p => p.pendentes > 0)
    })
  }

  if (loading || pendencias.length === 0) return null

  return (
    <>
      <Card className="shadow-sm border-orange-200 bg-orange-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            Mensagens Pendentes
            <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700">
              {pendencias.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendencias.map(v => (
            <button
              key={v.id}
              onClick={() => openVisitante(v)}
              className="w-full flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-accent transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{v.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {v.pendentes} mensagem{v.pendentes > 1 ? "s" : ""} pendente{v.pendentes > 1 ? "s" : ""}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Drawer: categorias do visitante */}
      <Drawer open={!!visitanteSel && !catSel} onOpenChange={v => { if (!v) setVisitanteSel(null) }}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{visitanteSel?.nome}</DrawerTitle>
            <DrawerDescription>Envie as mensagens pendentes</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 space-y-2">
            {categorias.map(cat => {
              const sent = enviadas.has(cat.id)
              return (
                <div key={cat.id} className={`flex items-center gap-3 rounded-lg border p-3 ${sent ? "opacity-50" : ""}`}>
                  <Checkbox
                    checked={sent}
                    onCheckedChange={checked => { if (checked && !sent) handleMarcar(cat.id) }}
                    disabled={sent}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cat.nome}</p>
                    {cat.descricao && <p className="text-xs text-muted-foreground line-clamp-1">{cat.descricao}</p>}
                  </div>
                  {!sent && cat.modelos.length > 0 && (
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1 shrink-0" onClick={() => setCatSel(cat)}>
                      <MessageSquare className="h-3.5 w-3.5" />Enviar
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer: modelos da categoria */}
      <Drawer open={!!catSel} onOpenChange={v => { if (!v) setCatSel(null) }}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{catSel?.nome}</DrawerTitle>
            <DrawerDescription>Escolha um modelo para enviar via WhatsApp</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {catSel?.modelos.map(modelo => {
              const preview = visitanteSel
                ? processarTemplateMensagem(modelo.corpo, visitanteSel as any)
                : modelo.corpo
              return (
                <button
                  key={modelo.id}
                  onClick={() => handleEnviar(catSel, modelo)}
                  className="w-full text-left rounded-lg border bg-card p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{modelo.titulo}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-6">{preview}</p>
                </button>
              )
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
