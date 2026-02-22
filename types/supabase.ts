// Tipos do banco de dados (Neon PostgreSQL)

export interface Visitante {
  id: string
  nome: string
  celular: string
  sexo: string | null
  cidade: string | null
  cidade_outra: string | null
  bairro: string | null
  faixa_etaria: string | null
  civil_status: string | null
  membro_igreja: boolean
  quer_visita: boolean
  data_cadastro: string
  msg_segunda: boolean
  msg_sabado: boolean
  sem_whatsapp: boolean
  responsavel_id: string | null
}

export interface VisitanteInsert {
  nome: string
  celular: string
  sexo?: string | null
  cidade?: string | null
  cidade_outra?: string | null
  bairro?: string | null
  faixa_etaria?: string | null
  civil_status?: string | null
  membro_igreja?: boolean
  quer_visita?: boolean
  sem_whatsapp?: boolean
  responsavel_id?: string | null
}

export interface VisitanteUpdate {
  nome?: string
  celular?: string
  sexo?: string | null
  cidade?: string | null
  cidade_outra?: string | null
  bairro?: string | null
  faixa_etaria?: string | null
  civil_status?: string | null
  membro_igreja?: boolean
  quer_visita?: boolean
  msg_segunda?: boolean
  msg_sabado?: boolean
  sem_whatsapp?: boolean
  responsavel_id?: string | null
}

export interface Responsavel {
  id: string
  nome: string
  criado_em: string
}

export type VisitanteComResponsavel = Visitante & {
  responsavel_nome?: string | null
}

// Enums para campos do formulario

export const FaixaEtariaEnum = {
  ADOLESCENTE: "Adolescente",
  JOVEM: "Jovem",
  ADULTO: "Adulto",
  IDOSO: "Idoso",
} as const

export type FaixaEtariaType = (typeof FaixaEtariaEnum)[keyof typeof FaixaEtariaEnum]

export const SexoEnum = {
  MASCULINO: "Masculino",
  FEMININO: "Feminino",
} as const

export type SexoType = (typeof SexoEnum)[keyof typeof SexoEnum]

export const CivilStatusEnum = {
  SOLTEIRO: "Solteiro",
  CASADO: "Casado",
  DIVORCIADO: "Divorciado",
  VIUVO: "Viuvo",
} as const

export type CivilStatusType = (typeof CivilStatusEnum)[keyof typeof CivilStatusEnum]

export const CidadeEnum = {
  BV: "BV - moro",
  OUTRA: "Outra",
} as const

export type CidadeType = (typeof CidadeEnum)[keyof typeof CidadeEnum]

export function isValidSexo(sexo: string): sexo is SexoType {
  return Object.values(SexoEnum).includes(sexo as SexoType)
}

export function isValidFaixaEtaria(faixa: string): faixa is FaixaEtariaType {
  return Object.values(FaixaEtariaEnum).includes(faixa as FaixaEtariaType)
}

export function isValidCivilStatus(status: string): status is CivilStatusType {
  return Object.values(CivilStatusEnum).includes(status as CivilStatusType)
}
