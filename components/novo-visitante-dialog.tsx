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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { formatarTelefone } from "@/lib/utils"
import type { Visitante, VisitanteInsert } from "@/types/supabase"

// Definindo o schema sem transformações complexas
const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  celular: z.string().min(14, { message: "Celular inválido" }).max(15),
  cidade: z.string().optional(),
  bairro: z.string().optional(),
  idade: z.string().optional(),
  pedidos_oracao: z.string().optional(),
  intencao: z.enum(["Sou membro de outra igreja", "Gostaria de conhecer melhor", "Quero ser membro"], {
    required_error: "Por favor selecione uma opção",
  }),
  sexo: z.enum(["Masculino", "Feminino"], {
    required_error: "Por favor selecione uma opção",
  }),
})

// Tipo inferido do schema
type FormValues = z.infer<typeof formSchema>

interface NovoVisitanteDialogProps {
  onClose: () => void
  onSave: (visitante: Visitante) => void
}

export default function NovoVisitanteDialog({ onClose, onSave }: NovoVisitanteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      celular: "",
      cidade: "",
      bairro: "",
      idade: "",
      pedidos_oracao: "",
      intencao: "Gostaria de conhecer melhor",
      sexo: "Masculino",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      // Preparar dados para inserção
      const visitanteData: VisitanteInsert = {
        nome: values.nome,
        celular: values.celular,
        cidade: values.cidade || null,
        bairro: values.bairro || null,
        idade: values.idade ? Number(values.idade) : null,
        pedidos_oracao: values.pedidos_oracao || null,
        intencao: values.intencao,
        mensagem_enviada: false,
        sexo: values.sexo,
      }

      // Inserir no Supabase
      const { data, error } = await supabase.from("visitantes").insert(visitanteData).select()

      if (error) throw error

      if (data && data[0]) {
        onSave(data[0])
        toast({
          title: "Visitante cadastrado",
          description: "O visitante foi cadastrado com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao salvar o visitante.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatarTelefone(e.target.value)
    form.setValue("celular", formattedValue)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Visitante</DialogTitle>
          <DialogDescription>Cadastre um novo visitante manualmente.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo*</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sexo*</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Masculino" />
                        </FormControl>
                        <FormLabel className="font-normal">Masculino</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Feminino" />
                        </FormControl>
                        <FormLabel className="font-normal">Feminino</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="idade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input placeholder="Idade" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular*</FormLabel>
                  <FormControl>
                    <Input placeholder="(99) 99999-9999" {...field} onChange={handlePhoneChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <FormField
              control={form.control}
              name="pedidos_oracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pedidos de oração</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Pedidos de oração" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intencao"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Intenção*</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Sou membro de outra igreja" />
                        </FormControl>
                        <FormLabel className="font-normal">Sou membro de outra igreja</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Gostaria de conhecer melhor" />
                        </FormControl>
                        <FormLabel className="font-normal">Gostaria de conhecer melhor</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Quero ser membro" />
                        </FormControl>
                        <FormLabel className="font-normal">Quero ser membro</FormLabel>
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
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
