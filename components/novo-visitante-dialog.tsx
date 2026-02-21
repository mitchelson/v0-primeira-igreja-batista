"use client"

import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { formatarTelefone } from "@/lib/utils"
import type { Visitante, VisitanteInsert } from "@/types/supabase"
import {
  SexoEnum,
  CivilStatusEnum,
  FaixaEtariaEnum,
  CidadeEnum,
} from "@/types/supabase"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select"

const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no maximo 100 caracteres" }),
  celular: z
    .string()
    .min(14, { message: "Celular invalido" })
    .max(15, { message: "Celular invalido" }),
  sexo: z.enum(["Masculino", "Feminino"], {
    required_error: "Por favor selecione uma opcao",
  }),
  cidade: z.string().optional(),
  cidade_outra: z.string().max(50).optional(),
  bairro: z.string().max(50).optional(),
  faixa_etaria: z.string().optional(),
  civil_status: z.string().optional(),
  telefone: z.string().max(15).optional(),
  membro_igreja: z.boolean().default(false),
  quer_visita: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface NovoVisitanteDialogProps {
  readonly onClose: () => void
  readonly onSave: (visitante: Visitante) => void
  readonly visitanteParaEdicao?: Visitante & {
    responsavel_nome?: string | null
  }
}

export default function NovoVisitanteDialog({
  onClose,
  onSave,
  visitanteParaEdicao,
}: NovoVisitanteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!visitanteParaEdicao

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: visitanteParaEdicao?.nome ?? "",
      celular: visitanteParaEdicao?.celular ?? "",
      sexo:
        (visitanteParaEdicao?.sexo as "Masculino" | "Feminino") ??
        "Masculino",
      cidade: visitanteParaEdicao?.cidade ?? "",
      cidade_outra: visitanteParaEdicao?.cidade_outra ?? "",
      bairro: visitanteParaEdicao?.bairro ?? "",
      faixa_etaria: visitanteParaEdicao?.faixa_etaria ?? "",
      civil_status: visitanteParaEdicao?.civil_status ?? "",
      telefone: visitanteParaEdicao?.telefone ?? "",
      membro_igreja: visitanteParaEdicao?.membro_igreja ?? false,
      quer_visita: visitanteParaEdicao?.quer_visita ?? false,
    },
  })

  const cidadeValue = form.watch("cidade")

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const payload: VisitanteInsert & { id?: string } = {
        nome: values.nome,
        celular: values.celular,
        sexo: values.sexo,
        cidade: values.cidade || null,
        cidade_outra:
          values.cidade === CidadeEnum.OUTRA
            ? values.cidade_outra || null
            : null,
        bairro: values.bairro || null,
        faixa_etaria: values.faixa_etaria || null,
        civil_status: values.civil_status || null,
        telefone: values.telefone || null,
        membro_igreja: values.membro_igreja,
        quer_visita: values.quer_visita,
        sem_whatsapp: visitanteParaEdicao?.sem_whatsapp ?? false,
        responsavel_id: visitanteParaEdicao?.responsavel_id ?? null,
      }

      let res: Response
      if (isEditing && visitanteParaEdicao) {
        res = await fetch(`/api/visitantes/${visitanteParaEdicao.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch("/api/visitantes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error("Erro ao salvar visitante")

      const data = await res.json()
      onSave(data as Visitante)
      toast({
        title: isEditing ? "Visitante atualizado" : "Visitante cadastrado",
        description: `O visitante foi ${isEditing ? "atualizado" : "cadastrado"} com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast({
        variant: "destructive",
        title: `Erro ao ${isEditing ? "atualizar" : "cadastrar"}`,
        description: "Ocorreu um erro ao salvar o visitante.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange =
    (fieldName: "celular" | "telefone") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatarTelefone(e.target.value)
      form.setValue(fieldName, formattedValue)
    }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[100vh] md:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Visitante" : "Novo Visitante"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informacoes do visitante."
              : "Cadastre um novo visitante manualmente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sexo */}
            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sexo*</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={SexoEnum.FEMININO} />
                        </FormControl>
                        <FormLabel className="font-normal">F</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={SexoEnum.MASCULINO} />
                        </FormControl>
                        <FormLabel className="font-normal">M</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={CidadeEnum.BV} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            BV - moro
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={CidadeEnum.OUTRA} />
                          </FormControl>
                          <FormLabel className="font-normal">Outra</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {cidadeValue === CidadeEnum.OUTRA && (
                <FormField
                  control={form.control}
                  name="cidade_outra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual cidade?</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Bairro */}
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Faixa Etaria */}
            <FormField
              control={form.control}
              name="faixa_etaria"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Faixa Etaria</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      {Object.values(FaixaEtariaEnum).map((faixa) => (
                        <FormItem
                          key={faixa}
                          className="flex items-center gap-2 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={faixa} />
                          </FormControl>
                          <FormLabel className="font-normal">{faixa}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado Civil */}
            <FormField
              control={form.control}
              name="civil_status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Estado Civil</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      {Object.values(CivilStatusEnum).map((status) => (
                        <FormItem
                          key={status}
                          className="flex items-center gap-2 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={status} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {status === "Viuvo" ? "Viuvo(a)" : `${status}(a)`}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Celular e Telefone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="celular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(99) 99999-9999"
                        {...field}
                        onChange={handlePhoneChange("celular")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(99) 9999-9999"
                        {...field}
                        onChange={handlePhoneChange("telefone")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Membro de igreja */}
            <FormField
              control={form.control}
              name="membro_igreja"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Frequenta ou e membro de alguma igreja?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(val) => field.onChange(val === "sim")}
                      value={field.value ? "sim" : "nao"}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sim" />
                        </FormControl>
                        <FormLabel className="font-normal">SIM</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="nao" />
                        </FormControl>
                        <FormLabel className="font-normal">NAO</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quer receber visita */}
            <FormField
              control={form.control}
              name="quer_visita"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Quer receber uma visita?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(val) => field.onChange(val === "sim")}
                      value={field.value ? "sim" : "nao"}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sim" />
                        </FormControl>
                        <FormLabel className="font-normal">SIM</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="nao" />
                        </FormControl>
                        <FormLabel className="font-normal">NAO</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Salvando..."
                  : isEditing
                    ? "Atualizar"
                    : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
