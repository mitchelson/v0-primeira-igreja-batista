import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Verificação para garantir que as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente do Supabase não estão configuradas")
}

// Criação do cliente Supabase com tipagem específica
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  }
})

// Tipos utilitários para operações do Supabase
export type SupabaseResponse<T> = {
  data: T | null
  error: Error | null
}

// Helper para operações de select com tipagem
export async function safeSelect<T>(
  query: Promise<{ data: T | null; error: Error | null }>,
  errorMessage: string = "Erro ao buscar dados"
): Promise<SupabaseResponse<T>> {
  try {
    const { data, error } = await query

    if (error) {
      console.error(errorMessage, error)
      return { data: null, error: new Error(error.message ?? errorMessage) }
    }

    return { data, error: null }
  } catch (error) {
    console.error(errorMessage, error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error(errorMessage)
    }
  }
}
