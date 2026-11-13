---
tipo: sessão
status: consolidado
tags: [devagent, sessão, stacks, advisor-strategy, subagentes, custo]
criado: 2026-11-10
atualizado: 2026-11-10
participantes: [Vítor]
ferramenta: Claude Code
---
# 2026-11-10 - Teste Haiku x Sonnet na coleta das Stacks

## Objetivo da sessão
Executar a DEC-2026-11-10-02: Advisor Strategy "sim, com ajustes", em teste, e medir se a menor capacidade do Haiku o deixa mais caro (por se confundir ou fazer demais) contra a eficiência do Sonnet no mesmo trabalho de coleta. Continua [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]].

## Desenho do teste
- Mesmo prompt, mesma tarefa, em paralelo: Haiku × Sonnet, ambos subagentes `general-purpose` com `effort: medium`.
- Ajuste de leitura: só `AGENTS.md`/`CLAUDE.md` e manifests da raiz e de `apps/*` (ou dos subdiretórios de 1º nível com manifest, se não houver `apps/`). Sem README, código, `packages/*`, lockfiles.
- Repos: `xend-platform` (Bun, `apps/`), `hedglobal-plataform` (npm, `apps/`), `xendmm` (Python, sem `apps/`).
- Saída: um dossiê por repo. Prompt e dossiês preservados como baseline em `05-Agente/Avaliação/Coleta Stacks - baseline 2026-11-10/`.

## Resultado
| Métrica | Haiku | Sonnet |
|---|---|---|
| Tokens do subagente | **143.486** | **107.170** |
| Chamadas de ferramenta | 13 | 18 |
| Duração | 3 min 32 s | 2 min 40 s |
| Arquivos lidos (autodeclarado) | 33 | 43 |
| Saiu do limite de leitura? | Não. Foi estrito **demais**: não leu `apps/console/CLAUDE.md`, que o prompt permitia | Pouco: `ls` em `packages/`/`scripts/`, `wc -l` em `apps/console/*` e um `cat` de `vercel.json`. Declarou tudo |
| Citações conferidas (amostra xend-platform) | 10/10 corretas | 9/10 exatas, 1 com a linha errada por um |
| Divergências achadas (platform / hedglobal / xendmm) | 16 / 11 / 9 | 11 / 12 / ~3 |
| Achado-chave `packages/jobs` | Viu o deploy e o alias, mas deixou "não confirmado" (não listou `packages/`) | Confirmou que não existe (listou `packages/`) |

## Leitura dos números
- **Haiku gastou 34% mais tokens e 32% mais tempo** com **menos** chamadas. Ou seja, leu arquivos inteiros em blocos grandes: o custo extra vem de volume de leitura, não de se perder.
- **Não houve confusão no conteúdo:** citações do Haiku 100% corretas e mais divergências listadas (inclusive menores, como typo `TWILLIO`, IP de LAN fixo, seed inexistente).
- **A confusão do Haiku foi na regra:** leu "AGENTS/CLAUDE só da raiz" e pulou o `CLAUDE.md` do app, justamente o arquivo com as regras de falha real do hedglobal (fixtures × banco, autorização na camada de dados). Erro de interpretação, custo de qualidade, não de tokens.
- **Sonnet foi mais eficiente e mais certeiro no julgamento:** menos tokens, mais rápido, leu o arquivo certo e confirmou existência de caminhos com `ls` (fora da letra da regra, mas declarado e útil).
- **Custo real:** no plano de time (DEC-2026-11-08-24), o que pesa é a cota, e o token do Haiku consome menos cota que o do Sonnet. Com +34% de tokens, o Haiku só sai mais caro se o seu token custar mais de ~75% do token do Sonnet. Os preços de lista do Haiku 5.5 e do Sonnet 5.5 **ainda não foram conferidos** em fonte primária: falta fechar a conta.

## Decisões
- DEC-2026-11-10-02: Advisor Strategy "sim, com ajustes", em teste (substitui a DEC-2026-11-08-25).
- DEC-2026-11-10-03: criar uma skill de coleta para o Haiku que compense os pontos fracos do teste; desenho e pesquisa em sessão nova.

## Aprendizados
- O Haiku é fiel ao arquivo, mas literal com regras de escopo; o prompt precisa nomear explicitamente cada arquivo permitido por nível (ex.: "`CLAUDE.md` de cada app também").
- Coleta com limite de leitura caiu de 175–250 mil tokens por lote de 4 repos (08/11) para 107–143 mil por 3 repos: o ajuste de leitura funcionou para os dois modelos.
- Permitir `ls` de diretórios citados nos manifests evita lacunas "não confirmado" baratas de resolver.

## Próximos passos
- [ ] Conferir os preços de lista do Haiku 5.5 e do Sonnet 5.5 e fechar o custo por execução
- [ ] Vítor: decidir o coletor padrão (Haiku com prompt corrigido, ou Sonnet) e encerrar a DEC-2026-11-10-02
- [ ] Sessão nova: pesquisar conteúdos/skills parecidos, criar a skill de coleta para o Haiku e rodar contra este baseline (DEC-2026-11-10-03)
- [ ] Opcional: repetir o Haiku com o prompt corrigido (CLAUDE.md por app + `ls` liberado) para isolar o efeito do prompt

## Arquivos criados/alterados
- `01-Projeto/Decisões/Registro de decisões.md` (DEC-2026-11-10-02; DEC-2026-11-08-25 marcada como substituída)
- [[Roadmap]] (próximos passos)
- `05-Agente/Avaliação/Coleta Stacks - baseline 2026-11-10/` (prompt + 6 dossiês)
