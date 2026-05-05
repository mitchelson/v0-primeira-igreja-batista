"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Music, Pencil, Plus } from "lucide-react"
import { RepertoireForm } from "./repertoire-form"
import { RepertoireList } from "./repertoire-list"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function RepertoireSection({ eventoId }: { eventoId: string }) {
  const { data, mutate } = useSWR(`/api/repertorio?evento_id=${eventoId}`, fetcher)
  const [editing, setEditing] = useState(false)

  if (!data) return null

  const { items, canEdit } = data
  const hasItems = items?.length > 0

  if (editing) {
    return (
      <div className="border-t pt-4 mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          {hasItems ? "Editar Repertório" : "Novo Repertório"}
        </p>
        <RepertoireForm
          eventoId={eventoId}
          initialItems={hasItems ? items : undefined}
          onSaved={() => { setEditing(false); mutate() }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
          <Music className="h-3.5 w-3.5" /> Repertório
        </p>
        {canEdit && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditing(true)}>
            {hasItems ? <><Pencil className="h-3 w-3 mr-1" /> Editar</> : <><Plus className="h-3 w-3 mr-1" /> Adicionar</>}
          </Button>
        )}
      </div>
      {hasItems ? <RepertoireList items={items} /> : (
        <p className="text-[13px] text-gray-400 text-center py-3">Nenhum repertório definido.</p>
      )}
    </div>
  )
}
