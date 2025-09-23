"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import type { VisitanteInsert } from "@/types/supabase";

// Definindo o schema sem transformações complexas
const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  celular: z.string().min(14, { message: "Celular inválido" }).max(15),
  cidade: z.string().optional(),
  bairro: z.string().optional(),
  idade: z.string().optional(),
  pedidos_oracao: z.string().optional(),
  intencao: z.enum(
    [
      "Sou membro de outra igreja",
      "Gostaria de conhecer melhor",
      "Quero ser membro",
    ],
    {
      required_error: "Por favor selecione uma opção",
    }
  ),
  sexo: z.enum(["Masculino", "Feminino"], {
    required_error: "Por favor selecione uma opção",
  }),
});

// Tipo inferido do schema
type FormValues = z.infer<typeof formSchema>;

export default function CadastroPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      // Preparar dados para inserção
      const visitanteData: VisitanteInsert = {
        nome: values.nome,
        celular: values.celular,
        cidade: values.cidade ?? null,
        bairro: values.bairro ?? null,
        idade: values.idade ? Number(values.idade) : null,
        pedidos_oracao: values.pedidos_oracao ?? null,
        intencao: values.intencao,
        mensagem_enviada: false,
        sexo: values.sexo,
      };

      // Inserir no Supabase
      const { error } = await supabase.from("visitantes").insert(visitanteData);

      if (error) throw error;

      setSuccess(true);
      form.reset();
      toast({
        title: "Cadastro realizado com sucesso!",
        description:
          "Agradecemos seu interesse. Em breve entraremos em contato.",
      });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description:
          "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatarTelefone(e.target.value);
    form.setValue("celular", formattedValue);
  };

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
            Em breve, um de nossos responsáveis entrará em contato com você.
          </p>
          <Button onClick={() => setSuccess(false)}>Novo Cadastro</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Visitante</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para se cadastrar como visitante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo*</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormDescription>Formato: (99) 99999-9999</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormDescription>Formato: (99) 99999-9999</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua cidade" {...field} />
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
                      <Input placeholder="Seu bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua idade" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pedidos_oracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pedidos de oração</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Compartilhe seus pedidos de oração"
                      className="min-h-[100px]"
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar cadastro"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
