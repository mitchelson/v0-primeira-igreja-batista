// Constantes globais do projeto

// Configurações de validação
export const VALIDATION_CONFIG = {
  NOME_MIN_LENGTH: 3,
  NOME_MAX_LENGTH: 100,
  TELEFONE_MIN_LENGTH: 14,
  TELEFONE_MAX_LENGTH: 15,
  CIDADE_MAX_LENGTH: 50,
  BAIRRO_MAX_LENGTH: 50,
  IDADE_MIN: 0,
  IDADE_MAX: 120,
  ORACAO_MAX_LENGTH: 500,
} as const

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NOME_REQUIRED: "Nome é obrigatório",
  NOME_MIN_LENGTH: `Nome deve ter pelo menos ${VALIDATION_CONFIG.NOME_MIN_LENGTH} caracteres`,
  NOME_MAX_LENGTH: `Nome deve ter no máximo ${VALIDATION_CONFIG.NOME_MAX_LENGTH} caracteres`,
  NOME_INVALID_CHARS: "Nome deve conter apenas letras e espaços",
  TELEFONE_INVALID: "Formato de telefone inválido",
  TELEFONE_REQUIRED: "Telefone é obrigatório",
  IDADE_INVALID: `Idade deve estar entre ${VALIDATION_CONFIG.IDADE_MIN} e ${VALIDATION_CONFIG.IDADE_MAX} anos`,
  CIDADE_MAX_LENGTH: `Cidade deve ter no máximo ${VALIDATION_CONFIG.CIDADE_MAX_LENGTH} caracteres`,
  BAIRRO_MAX_LENGTH: `Bairro deve ter no máximo ${VALIDATION_CONFIG.BAIRRO_MAX_LENGTH} caracteres`,
  ORACAO_MAX_LENGTH: `Pedidos de oração devem ter no máximo ${VALIDATION_CONFIG.ORACAO_MAX_LENGTH} caracteres`,
  INTENCAO_REQUIRED: "Por favor selecione uma opção",
  SEXO_REQUIRED: "Por favor selecione uma opção",
} as const

// Configurações de UI
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  LOADING_DELAY: 500,
} as const

// Regex patterns
export const REGEX_PATTERNS = {
  NOME: /^[a-zA-ZÀ-ÿ\s]+$/,
  TELEFONE: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  APENAS_NUMEROS: /\D/g,
} as const

// Configurações do Supabase
export const SUPABASE_CONFIG = {
  TABLE_NAMES: {
    VISITANTES: 'visitantes',
    RESPONSAVEIS: 'responsaveis',
  } as const,
  SCHEMA: 'public',
} as const

// Configurações de autenticação
export const AUTH_CONFIG = {
  STORAGE_KEY: 'pib_auth',
  ADMIN_PASSWORD: 'igreja123', // Em produção, isso deveria vir de variáveis de ambiente
} as const

// URLs e contatos
export const CONTACT_INFO = {
  CAPELANIA_PHONE: '+55 95 9152-2392',
  CAPELANIA_CONTACT: 'Manuela',
  PASTOR: 'Pr. Marcelo',
} as const

export const CHURCH_INFO = {
  NAME: 'Primeira Igreja Batista de Roraima',
  SHORT_NAME: 'PIB',
} as const
