"use client"

import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  SexoEnum,
  CivilStatusEnum,
  FaixaEtariaEnum,
  CidadeEnum,
} from "@/types/supabase"

const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  celular: z.string().min(14, { message: "Celular invalido" }).max(15),
  sexo: z.enum(["Masculino", "Feminino"], {
    required_error: "Por favor selecione uma opcao",
  }),
  cidade: z.string().optional(),
  cidade_outra: z.string().max(50).optional(),
  bairro: z.string().max(50).optional(),
  faixa_etaria: z.string().optional(),
  civil_status: z.string().optional(),
  membro_igreja: z.boolean().default(false),
  quer_visita: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      celular: "",
      sexo: "Masculino",
      cidade: "",
      cidade_outra: "",
      bairro: "",
      faixa_etaria: "",
      civil_status: "",
      membro_igreja: false,
      quer_visita: false,
    },
  })

  const cidadeValue = form.watch("cidade")

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/visitantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          membro_igreja: values.membro_igreja,
          quer_visita: values.quer_visita,
        }),
      })

      if (!res.ok) throw new Error("Erro ao cadastrar")

      setSuccess(true)
      form.reset()
      toast({
        title: "Cadastro realizado com sucesso!",
        description:
          "Agradecemos seu interesse. Em breve entraremos em contato.",
      })
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description:
          "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatarTelefone(e.target.value)
    form.setValue("celular", formattedValue)
  }

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Cadastro Realizado!</CardTitle>
          <CardDescription>
            Agradecemos seu interesse na Primeira Igreja Batista de Roraima.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Em breve, um de nossos responsaveis entrara em contato com voce.
          </p>
          <Button onClick={() => setSuccess(false)}>Novo Cadastro</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Visitante, seja bem vindo!</CardTitle>
        <CardDescription>
          Caso seja do seu interesse que entremos em contato, por favor, preencha
          abaixo:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            {/* Celular */}
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
                      onChange={handlePhoneChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <p className="text-center text-sm text-muted-foreground font-medium border-t pt-4">
              Esta tambem e sua casa pois antes de voce chegar nos ja oramos por
              voce
            </p>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar cadastro"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
