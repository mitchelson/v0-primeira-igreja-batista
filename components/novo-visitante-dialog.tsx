"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { formatarTelefone } from "@/lib/utils";
import type {
  Visitante,
  VisitanteInsert,
  IntencaoType,
  SexoType,
} from "@/types/supabase";
import { IntencaoEnum, SexoEnum } from "@/types/supabase";

// Constantes para validação e reutilização
const INTENCAO_OPTIONS = Object.values(IntencaoEnum) as [
  IntencaoType,
  ...IntencaoType[]
];
const SEXO_OPTIONS = Object.values(SexoEnum) as [SexoType, ...SexoType[]];

// Schema melhorado com validações mais específicas
const formSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "Nome deve conter apenas letras e espaços",
    }),
  celular: z
    .string()
    .min(14, { message: "Celular inválido" })
    .max(15, { message: "Celular inválido" })
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
      message: "Formato de celular inválido",
    }),
  cidade: z
    .string()
    .max(50, { message: "Cidade deve ter no máximo 50 caracteres" })
    .optional(),
  bairro: z
    .string()
    .max(50, { message: "Bairro deve ter no máximo 50 caracteres" })
    .optional(),
  idade: z
    .string()
    .optional()
    .refine((val) => !val || (parseInt(val) >= 0 && parseInt(val) <= 120), {
      message: "Idade deve estar entre 0 e 120 anos",
    }),
  pedidos_oracao: z
    .string()
    .max(500, {
      message: "Pedidos de oração devem ter no máximo 500 caracteres",
    })
    .optional(),
  intencao: z.enum(INTENCAO_OPTIONS, {
    required_error: "Por favor selecione uma opção",
  }),
  sexo: z.enum(SEXO_OPTIONS, {
    required_error: "Por favor selecione uma opção",
  }),
});

// Tipo inferido do schema
type FormValues = z.infer<typeof formSchema>;

// Props do componente com tipagem mais específica
interface NovoVisitanteDialogProps {
  readonly onClose: () => void;
  readonly onSave: (visitante: Visitante) => void;
  readonly visitanteParaEdicao?: Visitante & {
    responsavel_nome?: string | null;
  };
}

export default function NovoVisitanteDialog({
  onClose,
  onSave,
  visitanteParaEdicao,
}: NovoVisitanteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!visitanteParaEdicao;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: visitanteParaEdicao?.nome ?? "",
      celular: visitanteParaEdicao?.celular ?? "",
      cidade: visitanteParaEdicao?.cidade ?? "",
      bairro: visitanteParaEdicao?.bairro ?? "",
      idade: visitanteParaEdicao?.idade
        ? String(visitanteParaEdicao.idade)
        : "",
      pedidos_oracao: visitanteParaEdicao?.pedidos_oracao ?? "",
      intencao:
        (visitanteParaEdicao?.intencao as IntencaoType) ??
        IntencaoEnum.CONHECER_MELHOR,
      sexo: (visitanteParaEdicao?.sexo as SexoType) ?? SexoEnum.MASCULINO,
    },
  });

  // Funções auxiliares para reduzir complexidade
  const prepareVisitanteData = (values: FormValues): VisitanteInsert => ({
    nome: values.nome,
    celular: values.celular,
    cidade: values.cidade ?? null,
    bairro: values.bairro ?? null,
    idade: values.idade ? Number(values.idade) : null,
    pedidos_oracao: values.pedidos_oracao ?? null,
    intencao: values.intencao,
    mensagem_enviada: false,
    sexo: values.sexo,
  });

  const prepareUpdateData = (values: FormValues) => ({
    nome: values.nome,
    celular: values.celular,
    cidade: values.cidade ?? null,
    bairro: values.bairro ?? null,
    idade: values.idade ? Number(values.idade) : null,
    pedidos_oracao: values.pedidos_oracao ?? null,
    intencao: values.intencao,
    sexo: values.sexo,
  });

  const handleSuccess = (data: Visitante[], isEditing: boolean) => {
    const visitante = data?.[0];
    if (visitante) {
      onSave(visitante);
      toast({
        title: isEditing ? "Visitante atualizado" : "Visitante cadastrado",
        description: `O visitante foi ${
          isEditing ? "atualizado" : "cadastrado"
        } com sucesso.`,
      });
    }
  };

  const handleError = (error: unknown, isEditing: boolean) => {
    console.error(`Erro ao ${isEditing ? "atualizar" : "cadastrar"}:`, error);
    toast({
      variant: "destructive",
      title: `Erro ao ${isEditing ? "atualizar" : "cadastrar"}`,
      description: "Ocorreu um erro ao salvar o visitante.",
    });
  };

  async function updateVisitante(values: FormValues) {
    if (!visitanteParaEdicao) return;

    const { data, error } = await supabase
      .from("visitantes")
      .update(prepareUpdateData(values))
      .eq("id", visitanteParaEdicao.id)
      .select();

    if (error) throw error;
    return data;
  }

  async function createVisitante(values: FormValues) {
    const visitanteData = prepareVisitanteData(values);

    const { data, error } = await supabase
      .from("visitantes")
      .insert(visitanteData)
      .select();

    if (error) throw error;
    return data;
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const data = isEditing
        ? await updateVisitante(values)
        : await createVisitante(values);

      if (data) {
        handleSuccess(data, isEditing);
      }
    } catch (error) {
      handleError(error, isEditing);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatarTelefone(e.target.value);
    form.setValue("celular", formattedValue);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Visitante" : "Novo Visitante"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do visitante."
              : "Cadastre um novo visitante manualmente."}
          </DialogDescription>
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
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Masculino" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Masculino
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Feminino" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Feminino
                          </FormLabel>
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
                    <Textarea
                      placeholder="Pedidos de oração"
                      className="min-h-[80px]"
                      {...field}
                    />
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
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Sou membro de outra igreja" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Sou membro de outra igreja
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Gostaria de conhecer melhor" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Gostaria de conhecer melhor
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Quero ser membro" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Quero ser membro
                        </FormLabel>
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
                {(() => {
                  if (isSubmitting) return "Salvando...";
                  if (isEditing) return "Atualizar";
                  return "Salvar";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
