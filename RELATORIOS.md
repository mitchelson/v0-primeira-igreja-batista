# Teste de Dons Espirituais — Especificação para Implementação

## Visão Geral

Formulário de 76 perguntas que avalia 19 dons espirituais. Baseado na lógica de Christian Schwarz com abordagem adventista (NUMCI/UNASP).

- **Total de perguntas:** 76
- **Total de dons:** 19 (4 perguntas por dom)
- **Escala:** 0 a 3 (Likert de 4 pontos)
- **Score máximo por dom:** 12 pontos
- **Resultado:** Ranking dos 19 dons, destacando os top 3-5

---

## Lógica de Apresentação das Perguntas (Round-Robin)

⚠️ As perguntas NÃO são agrupadas sequencialmente por dom. São intercaladas (round-robin):

```
Fórmula:
  dom_index    = question_index % 19
  pergunta_num = floor(question_index / 19)
```

Exemplo prático:
| Questão | Dom (index) | Pergunta do dom |
|---------|-------------|-----------------|
| Q0 | Liberalidade (0) | 1ª pergunta |
| Q1 | Profecia (1) | 1ª pergunta |
| Q2 | Liderança (2) | 1ª pergunta |
| ... | ... | ... |
| Q18 | Intercessão (18) | 1ª pergunta |
| Q19 | Liberalidade (0) | 2ª pergunta |
| Q20 | Profecia (1) | 2ª pergunta |
| ... | ... | ... |
| Q75 | Intercessão (18) | 4ª pergunta |

---

## Escala de Respostas

| Valor | Rótulo                                |
| ----- | ------------------------------------- |
| 0     | Não / Nunca / Discordo totalmente     |
| 1     | Pouco / Raramente / Discordo um pouco |
| 2     | Muito / Com frequência / Concordo     |
| 3     | Sim / Sempre / Concordo totalmente    |

---

## Cálculo do Resultado

```
Para cada dom:
  score = soma das 4 respostas correspondentes (máx 12)

Ranking: ordenar dons por score decrescente
Destacar: top 3 como dons principais
```

---

## Dons (Ordem de Índice 0-18)

| Index | Dom                    |
| ----- | ---------------------- |
| 0     | Liberalidade           |
| 1     | Profecia               |
| 2     | Liderança              |
| 3     | Hospitalidade          |
| 4     | Línguas                |
| 5     | Missionário            |
| 6     | Evangelismo            |
| 7     | Ensino                 |
| 8     | Cura                   |
| 9     | Pastoral               |
| 10    | Administração          |
| 11    | Discernimento          |
| 12    | Apostolado             |
| 13    | Exortação              |
| 14    | Fé                     |
| 15    | Socorro e Misericórdia |
| 16    | Conhecimento           |
| 17    | Sabedoria              |
| 18    | Intercessão            |

---

## Perguntas por Dom

### 0 — Liberalidade

1. Sempre tento ajudar pessoas em dificuldades, mesmo que minhas próprias necessidades sejam muitas.
2. Sou fiel e generoso nos dízimos e ofertas, pois conheço a generosidade de Deus. Sinto prazer em doar.
3. Os membros da minha congregação sabem que tenho prazer em ajudar aqueles que têm necessidades materiais e financeiras, que gosto de financiar projetos da igreja, mesmo que eu tenha pouco dinheiro.
4. Poucas coisas me trazem tanta alegria quanto dar parte do que tenho para pessoas que necessitam ou para a igreja e o avanço do evangelho.

### 1 — Profecia

1. Tenho sonhos e visões contendo mensagens em plena concordância com a Bíblia.
2. Quando falo em público, os ouvintes me consideram mais do que um professor ou do que um orador ou pregador. A igreja reconhece o dom de profecia em mim.
3. Recebo mensagens específicas de Deus com conteúdo para a igreja como um todo, bem como para indivíduos, conforme Deus me mostra. Estas mensagens nunca contradizem material já revelado por Deus.
4. Nunca pedi para ter o dom de profecia. Cumpro com o meu dever em humildade. Sirvo à igreja se ela quiser.

### 2 — Liderança

1. Gosto de liderar e servir. Se a igreja precisa de alguém para dirigir atividades, motivar pessoas, me encontro entre os primeiros com quem se pode contar.
2. Quando tenho ideias que creio serem vindas de Deus, aconselho-me com irmãos, avalio as consequências, tomo a decisão e creio na decisão tomada como se fosse de Deus, mesmo que ela seja impopular.
3. Tem havido espírito de unidade, entusiasmo e progresso do reino de Deus quando ocupo um cargo de liderança. Gosto de liderar servindo e coordenando outros.
4. Sei que as críticas fazem parte da liderança e tenho aprendido com elas em humildade. Tenho me esforçado pelo melhor e procuro entender e ser sensível às ideias de outros.

### 3 — Hospitalidade

1. Sinto satisfação em ajudar as pessoas, proporcionando-lhes moradia e alimento.
2. Se alguém confiável (talvez um conhecido) bater a minha porta, precisando de lugar para pernoitar, convido-o para entrar, ainda que para acomodá-lo fosse necessário ceder minha cama e eu dormir no chão.
3. Quando eu tenho um hóspede me dedico a seu bem estar e a sua salvação de todo coração.
4. Gosto de convidar pessoas e dar o que tenho de melhor em minha casa, comida, pouso ou o que for necessário.

### 4 — Línguas

1. Tenho facilidades para aprender línguas de outros países e povos.
2. Entendo o sentido do que as pessoas estão falando, mesmo que eu não saiba falar a sua língua.
3. Interesso-me muito por outras línguas e não me custa memorizar palavras.
4. Gosto de estar no meio de pessoas de outros países; quando tenho que me comunicar com eles, faço o melhor que consigo, mesmo sem saber a língua.

### 5 — Missionário

1. Sinto grande responsabilidade em levar o Evangelho a pessoas não alcançadas.
2. Fico inquieto quando vejo quantas pessoas ainda não conhecem Jesus e vivo com ideias para alcançar pessoas ao meu redor. Gosto de dar estudos bíblicos para descrentes, creio que a Palavra transforma suas vidas.
3. Gosto de estar com pessoas e aceito o jeito diferente de cada um ser. Procuro entendê-las para ajudá-las melhor. Nunca julgo ou condeno alguém, mesmo pelo pior pecado. Busco instruir com paciência e persistência.
4. Consigo aceitar e amar descrentes como estão e com facilidade ajudá-los a conhecer Jesus.

### 6 — Evangelismo

1. Tenho facilidade em persuadir alguém a tomar uma decisão ao lado de Cristo.
2. Facilmente sei transformar uma conversa normal numa conversa espiritual conduzindo a pessoa a Cristo.
3. Se eu tenho um tempo extra, meu primeiro pensamento é dedicar-me ao trabalho do Evangelho. Sinto desejo de compartilhar aquilo que me fez tão bem: Jesus!
4. Regularmente levo pessoas a Cristo, acompanhando-as ao batismo e confirmando-as na fé e na doutrina bíblica.

### 7 — Ensino

1. Gosto de ensinar e muitos me procuram para estudar a Bíblia comigo, pois entendem bem quando eu explico.
2. Consigo explicar diversos temas de tal maneira que as pessoas incorporam os ensinos em suas vidas.
3. Quando ensino, percebo que as pessoas ficam envolvidas por inteiro, elas não entendem apenas com a cabeça, mas com o coração, aplicando o tema às suas vidas.
4. Empolgo-me em ler livros e me desenvolver em didática e psicologia do ensino.

### 8 — Cura

1. Gosto de estudar o corpo humano, conheço os órgãos e funções e fico me aperfeiçoando na compreensão do corpo.
2. Deus quer que tenhamos saúde, pois um intelecto vigoroso e uma vida espiritual abundante apenas ocorrem num corpo saudável. Conheço a lógica de nosso corpo e recomendo a prevenção da saúde.
3. Muitas vezes quando oro pela saúde de alguém, ela melhora. Creio na cura por vias naturais e sobrenaturais.
4. Conheço tratamentos simples, sem contra-indicação para muitas doenças e males.

### 9 — Pastoral

1. Gosto de visitar os membros da Igreja regularmente, em suas casas, participando de suas vidas e fases.
2. Gosto de dar estudos bíblicos para ajudar os membros da igreja a crescer em sua fé.
3. Gosto de elaborar sermões, de pregá-los e observar o efeito na vida das pessoas.
4. Eu gosto de aconselhar pessoas nas diferentes fases de suas vidas. Elas também apreciam e tiram proveito para sua experiência espiritual e de vida.

### 10 — Administração

1. Diante de problemas complexos sou capaz de identificar os fatores que os influenciam, achando soluções práticas.
2. Tenho facilidade para descobrir recursos e pessoas para realizar certa atividade.
3. Eu resolvo os problemas de pessoas e da igreja de tal forma que elas se sintam satisfeitas e a igreja encontre caminhos para funcionar melhor.
4. Gosto de administrar as coisas da igreja: prédios, finanças, pessoas. Penso que quando eu me envolvo nesta área a igreja fica mais organizada e um lugar melhor para adorar. Os membros vêem esta qualidade em mim.

### 11 — Discernimento

1. Eu posso facilmente dizer se um profeta fala inspirado pelo Espírito Santo ou não.
2. Sei quando uma pessoa está sofrendo, mesmo que esteja sorrindo.
3. Posso dizer se determinadas decisões estão ou não de acordo com os princípios bíblicos.
4. Muitas vezes posso discernir os motivos das pessoas para ajudá-las, sem julgá-las por isso.

### 12 — Apostolado

1. Tenho sido chamado por Deus para iniciar trabalhos para Jesus onde outros hesitariam em ir.
2. Sou facilmente impressionável pelo Espírito Santo e sigo as Suas instruções sem temer distância, dificuldade, obstáculos e desvantagens pessoais. Quando Ele chama não temo o que terei que sacrificar.
3. Já fundei ou tenho muita vontade de fundar uma congregação em um lugar onde antes nada existia.
4. Sinto-me desassossegado quando fico muito tempo em um mesmo lugar.

### 13 — Exortação

1. Quando alguém está sofrendo, sou capaz de identificar o que necessita e lhe dizer algo que o ajudará.
2. Posso ajudar a um causador de problemas a voltar a cooperar com o grupo sob minha liderança.
3. Frequentemente tenho sido solicitado para ajudar aqueles que estão em problemas para resolvê-los.
4. Acho fácil aplicar os princípios bíblicos aos problemas das pessoas de tal forma que possa ajudá-las.

### 14 — Fé

1. Tenho coragem de ousar coisas grandes para Deus, de andar numa direção desconhecida e iniciar projetos, pois eu conheço a direção de Deus e confio que Ele está me guiando.
2. Sei que ao confiar em Deus Ele me guiará inclusive através de problemas. Tenho convicção de que inclusive as perdas e lutas vão colaborar para o meu bem.
3. Aceito as promessas de Deus como válidas e creio nelas, ainda que o seu cumprimento pareça impossível.
4. Deus responde minhas orações, principalmente quando eu avanço pela fé com confiança inabalável nEle.

### 15 — Socorro e Misericórdia

1. Eu gosto de ajudar rejeitados da sociedade, por exemplo: bêbados, viciados em drogas e outros.
2. Quando me pedem ajuda, mesmo ocupado, tento ajudar. Sinto que Deus espera de mim e gosto de ajudar.
3. Sou extremamente sensível às necessidades dos menos favorecidos, sinto satisfação em falar com eles, oferecendo-lhes minha ajuda. Sou cuidadoso para ajudar com sabedoria.
4. Os membros da igreja sabem que sinto prazer em visitar os doentes e necessitados, ajudando-os.

### 16 — Conhecimento

1. Conheço a Bíblia e outros escritos proféticos em seu contexto histórico e cultural.
2. Memorizo textos bíblicos e textos relacionados facilmente e entendo o raciocínio dos autores inspirados.
3. A igreja me conhece pelo meu conhecimento bíblico e me consulta se necessário.
4. Conheço a história bíblica em seus detalhes e creio na ação de Deus em cada momento desta história. Conheço o plano profético e fico maravilhado com o plano da salvação em Jesus.

### 17 — Sabedoria

1. Quando enfrento os dilemas da vida consigo encontrar soluções práticas que ajudam sem complicar as coisas.
2. Quando aconselho pessoas em conflito ajudo-as a tirar o foco do problema e ganhar foco na solução.
3. Quando pessoas me procuram, penso nas diferentes opções que elas têm, mas deixo elas decidirem.
4. Princípios Bíblicos me vêm rápido á mente quando me deparo com problemas.

### 18 — Intercessão

1. Gasto muito do meu tempo de oração intercedendo pelas necessidades de outros diante de Deus.
2. Frequentemente, quando pessoas têm problemas, pedem para eu orar por elas.
3. Nomes, regularmente, vêm à minha mente quando estou em oração, aos quais dedico a Deus.
4. Minhas orações pelos outros, muitas vezes são respondidas e a igreja sabe disto e me procuram para orar.

---

## Descrições dos Dons (para exibir no resultado)

| Dom                    | Descrição                                                                                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Liberalidade           | O dom do Espírito para dar liberalmente, com alegria, e com regularidade às necessidades da Igreja e de indivíduos. Todos são chamados a dar, mas o dom capacita para mais.                                                 |
| Profecia               | É o dom através do qual o Espírito transmite conselhos e instruções para a igreja por meio de visões e sonhos. Deus manifesta a Sua vontade através deste dom (Amós 3:7) para um grupo menor ou para a igreja como um todo. |
| Liderança              | É o dom de envolver pessoas em uma visão, estabelecer objetivos, desenvolver estratégias para alcançá-los e vê-los realizados para a edificação da igreja; trazendo crescimento do reino de Deus.                           |
| Hospitalidade          | O dom do Espírito para acolher o abandonado e necessitado, fazendo com que cada pessoa sinta-se querida e confortável. Habilidade de amar e servir desinteressadamente.                                                     |
| Línguas                | Capacitação especial e sobrenatural para comunicar verbalmente o Evangelho em um idioma estrangeiro, até mesmo sem treinamento, quando há uma extrema necessidade de fazê-lo de maneira rápida e eficiente.                 |
| Missionário            | É o dom para compartilhar o Evangelho de maneira eficaz noutro país, adaptando-se com espontaneidade a diferentes culturas, climas e circunstâncias. Está associado ao dom de línguas.                                      |
| Evangelismo            | O dom do Espírito para compartilhar o Evangelho e ver os descrentes se encontrarem com Jesus, unindo-se à igreja como membros responsáveis.                                                                                 |
| Ensino                 | O dom para conceder instrução espiritual às pessoas de modo que o evangelho seja compreendido e seguido, promovendo crescimento espiritual e unidade na fé.                                                                 |
| Cura                   | É o dom de entender o funcionamento do corpo humano, discernir doenças, aplicar tratamentos e ajudar o doente a cuidar de seu corpo para que tenha saúde.                                                                   |
| Pastoral               | O dom do Espírito para ministrar, tanto direta como indiretamente, a todas as necessidades de cada membro da congregação e a pessoas que necessitem ser pastoreadas.                                                        |
| Administração          | O dom do Espírito que concebe e supervisiona planos para o trabalho de Deus, trazendo progresso à causa e condições para que sejam administrados.                                                                           |
| Discernimento          | É o dom de perceber o espírito que move as pessoas. Por intuição (Espírito Santo) percebe o estado espiritual de outros e ministra conforme a necessidade.                                                                  |
| Apostolado             | O dom do Espírito Santo para pioneiro, líder, que inicia igrejas ou as desenvolve, indo para lugares onde outros não iriam.                                                                                                 |
| Exortação              | O dom do Espírito que traz conforto, encorajamento e instrução àqueles que precisam de alguma ajuda, cura interior e nos relacionamentos.                                                                                   |
| Fé                     | O dom do Espírito para reclamar as promessas de Deus com inabalável confiança de que serão cumpridas. Está baseado num profundo conhecimento de Deus e de seu modo de agir.                                                 |
| Socorro e Misericórdia | O dom do Espírito para se ter sensibilidade aos sentimentos e necessidades dos outros, dando-lhes auxílio que traz conforto e cura.                                                                                         |
| Conhecimento           | O dom concedido pelo Espírito capacitando o crente a reter conhecimento. Geralmente está associado ao dom de ensino.                                                                                                        |
| Sabedoria              | Dom que habilita para o entendimento de pessoas e/ou a igreja em partes e como um todo em sua complexidade, trazendo solução para problemas, libertação, harmonia, progresso e crescimento.                                 |
| Intercessão            | Pessoas são chamadas para se importar e interceder em oração por outras, por atividades internas e externas à igreja. É o dom de apoio ao evangelismo e ao pastorado.                                                       |

---

## Modelo de Dados Sugerido

### Tabela: `spiritual_gifts` (seed data)

```sql
id SERIAL PRIMARY KEY,
index INT NOT NULL,          -- 0-18
name VARCHAR(50) NOT NULL,
description TEXT NOT NULL
```

### Tabela: `gift_questions` (seed data)

```sql
id SERIAL PRIMARY KEY,
gift_id INT REFERENCES spiritual_gifts(id),
question_order INT NOT NULL, -- 0-3 (posição dentro do dom)
text TEXT NOT NULL
```

### Tabela: `user_gift_responses` (respostas do usuário)

```sql
id SERIAL PRIMARY KEY,
user_id UUID REFERENCES users(id),
question_id INT REFERENCES gift_questions(id),
score INT NOT NULL CHECK (score BETWEEN 0 AND 3),
created_at TIMESTAMP DEFAULT NOW()
```

### Tabela: `user_gift_results` (resultado calculado)

```sql
id SERIAL PRIMARY KEY,
user_id UUID REFERENCES users(id),
gift_id INT REFERENCES spiritual_gifts(id),
total_score INT NOT NULL,   -- 0-12
rank INT NOT NULL,          -- posição no ranking
created_at TIMESTAMP DEFAULT NOW()
```

---

## Requisitos de Interface

1. **Stepper/Progresso**: Barra de progresso mostrando questão atual de 76
2. **Uma pergunta por vez**: Exibir uma questão com 4 opções de resposta
3. **Navegação**: Botões "Anterior" e "Próxima" (ou "Resultado" na última)
4. **Validação**: Não avançar sem responder
5. **Persistência parcial**: Salvar respostas conforme o usuário avança (permitir retomar)
6. **Resultado**: Tabela ranking com barra de proporção visual, destacando top 3 com descrição expandida

---

## Texto Introdutório (para exibir antes do teste)

> Qual é o meu chamado ministerial, o meu dom espiritual?

**Instruções:**

- Responda com calma, com paciência, em espírito de oração. (São 76 questões)
- Seja sincero. Não responda "como deveria ser"; responda "como é". Não existe resposta errada.
- Há diferentes maneiras para descobrir dons. Um teste auxilia, a opinião de irmãos e irmãs mais maduros na fé ajuda, mas é no exercício dos dons, ao se lançar pela fé ao serviço do Senhor, que vêm a convicção e o chamado.

---

## Texto do Resultado (para exibir após o teste)

> Os três primeiros tendem a ser os seus principais dons. Disponha-se a ajudar em diferentes frentes de trabalho dentro e fora da igreja, para servir os irmãos e pessoas que não conhecem a Deus. Ao trabalhar você perceberá uma satisfação enorme, uma convicção e uma paz não experimentada quando você exercer o seu(s) dom(ns).
