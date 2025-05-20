import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Verificação para garantir que as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente do Supabase não estão configuradas")
}

// Criação do cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
