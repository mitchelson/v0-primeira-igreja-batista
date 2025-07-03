# 📊 Sistema de Relatórios Mensais - PIB

Este documento descreve as novas funcionalidades do sistema de relatórios mensais implementadas no Sistema de Gestão de Visitantes da Primeira Igreja Batista de Roraima.

## 🎯 Funcionalidades Implementadas

### 1. **Geração de Relatórios em PDF**

- Relatórios mensais completos com dados dos visitantes
- Layout profissional com cabeçalho da igreja
- Estatísticas detalhadas e tabela de visitantes
- Download automático do arquivo PDF

### 2. **Interface Intuitiva**

- Botão "Relatório Mensal" na página de administração
- Modal para seleção de período (mês/ano)
- Prévia dos dados antes da geração do PDF
- Cards com estatísticas resumidas

### 3. **Estatísticas Avançadas**

- Total de visitantes no período
- Quantidade de mensagens enviadas
- Taxa de envio de mensagens
- Distribuição por intenção de visita
- Distribuição por sexo
- Principais cidades de origem

## 🛠️ Como Usar

### Gerando um Relatório

1. **Acesse a página de administração** (`/admin`)
2. **Clique no botão "Relatório Mensal"** (ao lado de "Novo Visitante")
3. **Selecione o período desejado**:
   - Mês: Janeiro a Dezembro
   - Ano: Últimos 5 anos + ano atual + próximo ano
4. **Clique em "Visualizar Dados do Período"** para ver a prévia
5. **Clique em "Gerar PDF"** para baixar o relatório

### Exemplo de Uso

```
Período: Janeiro de 2025
- 15 visitantes cadastrados
- 12 mensagens enviadas (80% de taxa)
- Distribuição: 8 querem ser membros, 4 querem conhecer melhor, 3 de outras igrejas
```

## 📋 Estrutura do Relatório PDF

### Cabeçalho

- Logo e nome da igreja
- Título "Relatório Mensal de Visitantes"
- Período selecionado

### Resumo Estatístico

- **Estatísticas Principais**: Total, mensagens enviadas, taxa de envio
- **Distribuição por Intenção**: Breakdown de intenções de visita
- **Distribuição por Sexo**: Contagem por gênero
- **Principais Cidades**: Top 3 cidades de origem

### Tabela de Visitantes

| Nome       | Data       | Telefone        | Cidade    | Intenção   | Msg Enviada |
| ---------- | ---------- | --------------- | --------- | ---------- | ----------- |
| João Silva | 15/01/2025 | (95) 99999-9999 | Boa Vista | Ser Membro | Sim         |

### Rodapé

- Data e hora de geração
- Assinatura do sistema

## 🔧 Tecnologias Utilizadas

### Bibliotecas Adicionadas

- **jsPDF**: Geração de documentos PDF
- **jsPDF-autoTable**: Criação de tabelas em PDF
- **date-fns**: Manipulação de datas (já existente)

### Arquivos Criados

```
types/relatorio.ts           # Tipos TypeScript para relatórios
hooks/use-relatorios.ts      # Hook para operações de relatório
lib/pdf-generator.ts         # Classe para geração de PDF
components/relatorio-mensal-dialog.tsx  # Modal de relatórios
```

### Arquivos Modificados

```
app/admin/page.tsx           # Adicionado botão de relatório
lib/constants.ts             # Constantes globais (criado anteriormente)
types/supabase.ts            # Tipos melhorados (modificado anteriormente)
```

## 📊 Estatísticas Disponíveis

### Métricas Principais

- **Total de Visitantes**: Quantidade total no período
- **Mensagens Enviadas**: Quantas mensagens foram enviadas
- **Taxa de Envio**: Percentual de mensagens enviadas

### Análises Demográficas

- **Por Intenção**:
  - "Quero ser membro"
  - "Gostaria de conhecer melhor"
  - "Sou membro de outra igreja"
- **Por Sexo**: Masculino/Feminino
- **Por Localização**: Top 5 cidades e bairros

## 🎨 Personalização

### Configurações do PDF

```typescript
interface ConfiguracoesPDF {
  incluirGraficos: boolean; // Futuro: gráficos visuais
  incluirDetalhesCompletos: boolean; // Detalhes completos ou resumo
  orientacao: "portrait" | "landscape"; // Orientação da página
  tamanhoFonte: number; // Tamanho da fonte
}
```

### Filtros Disponíveis

- **Período**: Qualquer mês/ano desde 2020
- **Validação**: Não permite períodos futuros inválidos

## 🚀 Funcionalidades Futuras

### Melhorias Planejadas

1. **Gráficos Visuais**: Charts e gráficos no PDF
2. **Relatórios Anuais**: Relatórios consolidados do ano
3. **Filtros Avançados**: Por responsável, cidade, intenção
4. **Agendamento**: Relatórios automáticos mensais
5. **Templates Customizáveis**: Diferentes layouts de relatório

### Possíveis Expansões

- Export para Excel/CSV
- Relatórios comparativos entre períodos
- Dashboard com métricas em tempo real
- Integração com Google Drive para backup automático

## 🔒 Segurança e Performance

### Controle de Acesso

- Apenas usuários autenticados podem gerar relatórios
- Validação de períodos para evitar consultas desnecessárias

### Otimização

- Cache de dados para evitar consultas repetidas
- Geração local do PDF (sem servidor externo)
- Filtros eficientes no banco de dados

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema de relatórios:

- Verifique a documentação técnica no código
- Consulte os tipos TypeScript para entender a estrutura
- Use o hook `useRelatorios` para operações customizadas

---

**Sistema desenvolvido para a Primeira Igreja Batista de Roraima**  
_Versão 2.0 - Funcionalidade de Relatórios Mensais_
