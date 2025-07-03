export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      visitantes: {
        Row: {
          id: string
          nome: string
          celular: string
          cidade: string | null
          bairro: string | null
          idade: number | null
          pedidos_oracao: string | null
          intencao: string
          data_cadastro: string
          mensagem_enviada: boolean
          responsavel_id: string | null
          sexo: string | null
          sem_whatsapp: boolean
        }
        Insert: {
          id?: string
          nome: string
          celular: string
          cidade?: string | null
          bairro?: string | null
          idade?: number | null
          pedidos_oracao?: string | null
          intencao: string
          data_cadastro?: string
          mensagem_enviada?: boolean
          responsavel_id?: string | null
          sexo?: string | null
          sem_whatsapp?: boolean
        }
        Update: {
          id?: string
          nome?: string
          celular?: string
          cidade?: string | null
          bairro?: string | null
          idade?: number | null
          pedidos_oracao?: string | null
          intencao?: string
          data_cadastro?: string
          mensagem_enviada?: boolean
          responsavel_id?: string | null
          sexo?: string | null
          sem_whatsapp?: boolean
        }
      }
      responsaveis: {
        Row: {
          id: string
          nome: string
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          criado_em?: string
        }
      }
    }
  }
}

export type Visitante = Database["public"]["Tables"]["visitantes"]["Row"]
export type VisitanteInsert = Database["public"]["Tables"]["visitantes"]["Insert"]
export type VisitanteUpdate = Database["public"]["Tables"]["visitantes"]["Update"]

export type Responsavel = Database["public"]["Tables"]["responsaveis"]["Row"]
export type ResponsavelInsert = Database["public"]["Tables"]["responsaveis"]["Insert"]
export type ResponsavelUpdate = Database["public"]["Tables"]["responsaveis"]["Update"]

// Tipos derivados mais específicos
export type VisitanteComResponsavel = Visitante & {
  responsavel_nome?: string | null
}

// Enum para campos específicos
export const IntencaoEnum = {
  MEMBRO_OUTRA_IGREJA: "Sou membro de outra igreja",
  CONHECER_MELHOR: "Gostaria de conhecer melhor",
  QUERO_SER_MEMBRO: "Quero ser membro"
} as const

export type IntencaoType = typeof IntencaoEnum[keyof typeof IntencaoEnum]

export const SexoEnum = {
  MASCULINO: "Masculino",
  FEMININO: "Feminino"
} as const

export type SexoType = typeof SexoEnum[keyof typeof SexoEnum]

// Hook personalizado para validação de tipos
export function isValidIntencao(intencao: string): intencao is IntencaoType {
  return Object.values(IntencaoEnum).includes(intencao as IntencaoType)
}

export function isValidSexo(sexo: string): sexo is SexoType {
  return Object.values(SexoEnum).includes(sexo as SexoType)
}
