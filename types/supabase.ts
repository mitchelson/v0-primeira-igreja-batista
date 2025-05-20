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
