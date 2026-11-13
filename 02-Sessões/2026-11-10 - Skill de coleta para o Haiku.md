---
tipo: sessão
status: consolidado
tags: [devagent, sessão, stacks, skills, haiku, advisor-strategy, custo]
criado: 2026-11-10
atualizado: 2026-11-10
participantes: [Vítor]
ferramenta: Claude Code
---
# 2026-11-10 - Skill de coleta para o Haiku

## Objetivo da sessão
Executar a DEC-2026-11-10-03: pesquisar skills e práticas parecidas, criar uma skill de coleta de contexto para o Haiku que compense os pontos fracos do [[2026-11-10 - Teste Haiku x Sonnet na coleta das Stacks|teste A/B]] e retestar contra o baseline. Orquestrador: Opus 5.5 (DEC-2026-11-09-01).

## O que foi feito
- **Pesquisa** → [[Skills de coleta de contexto e Haiku como executor]]. Não há skill pronta para isso. O custo do teste anterior ficou fechado: o token do Haiku 5.5 custa 5% do token do Sonnet 5.5 (prompt ≤100k) ou 25% (>100k). O Advisor já existe nativo no Claude Code.
- **Skill** `coleta-contexto-repo` v0.1 → [[Coleta de contexto de repo (skill)]]. Fonte no vault, com junções em `~\.claude\skills\` e `~\.agents\skills\`. Subagente `~\.claude\agents\coletor-contexto.md` (haiku, `effort: medium`, skill pré-carregada).
- **Reteste** (somente leitura). O subagente novo só carregou depois, então rodou como no baseline: `general-purpose` + Haiku + `effort: medium`, com a skill carregada pela ferramenta Skill. Dois formatos:
  - **A:** 1 agente com os 3 repos (comparável ao baseline);
  - **B:** 1 agente por repo, em paralelo.
- Prompts e dossiês em `05-Agente/Avaliação/Coleta Stacks - skill 2026-11-10/`.

## Resultado
| Métrica | Haiku baseline | Sonnet baseline | **Haiku + skill (A)** | **Haiku + skill (B, soma de 3)** |
|---|---|---|---|---|
| Tokens do subagente | 143.486 | 107.170 | **173.796** | 298.638 (86k / 101k / 111k) |
| Chamadas de ferramenta | 13 | 18 | **82** | 92 (34 / 28 / 30) |
| Duração | 3 min 32 s | 2 min 40 s | **5 min 33 s** | 2 min 28 s de relógio (6 min 29 s somados) |
| Citações conferidas | 10/10 (xend-platform) | 9/10 | **9/10** (xend-platform; 1 no arquivo errado: `AGENTS.md:43` em vez de `CLAUDE.md:43`) | 6/6 (hedglobal) |
| Divergências (platform / hedglobal / xendmm) | 16 / 11 / 9 | 11 / 12 / ~3 | 13 / 9 / 8 | 11 / 9 / 7 |
| `apps/console/CLAUDE.md` lido? | **não** | sim | **sim** | **sim** |
| `packages/jobs` | "não confirmado" | inexistente (confirmado) | **inexistente (confirmado)** | **perdido**: o teto de checagens acabou antes do CI |
| Respeitou o orçamento? | — | — | arquivos e linhas sim; checagens não (~45 no xend-platform) | arquivos e linhas sim; checagens não (~28–33 em 2 repos) |
| Saiu do escopo de leitura | não | pouco | 1 grep em `packages/ai-harness/package.json` (declarado) | 1 grep em `harness.js`, 1 linha do `.gitignore`, `git ls-files` (declarados) |

Achados novos (A): `supabase/seed.sql` citado no `config.toml` e inexistente; `.claude/CLAUDE.md` e `docs/` citados no AGENTS.md e inexistentes; `@ai-sdk/openai ^1` com `ai ^6`, contra o "v6" do CLAUDE.md; `include = ["api*"]` sem diretório correspondente no xendmm.

## Leitura dos números
- **Qualidade: a skill resolveu 2 dos 3 pontos fracos.** O Haiku leu o `CLAUDE.md` do app (literalismo corrigido) e confirmou caminhos com listagem (`packages/jobs`, `seed.sql`, `docs/`). Manteve as citações fiéis (9/10, erro de arquivo e não de invenção) e um volume de divergências próximo ao baseline.
- **Custo: piorou.** A gastou +21% de tokens, 6× mais chamadas e 57% mais tempo que o Haiku do baseline. A estratégia de "contar linhas → ler trecho → grep → ler seção" e as checagens uma a uma **multiplicaram as idas e voltas**. Cada chamada reenvia o contexto. Sobre a métrica: o número de tokens do harness não separa entrada, saída e cache; ainda assim, com 82 chamadas o custo real cresce com o número de chamadas.
- **O `Glob` foi o maior desperdício.** No Windows, `Glob "*"` na raiz devolveu listagens recursivas (até 54.975 entradas no hedglobal, com `.next` e `node_modules`), e `apps/*` relativo voltou vazio. Os 4 agentes recorreram a `ls`, que o subagente dedicado (sem `Bash`) não teria.
- **O teto de checagens estava mal desenhado.** Ele contava as listagens do inventário e cada caminho de um `ls` em lote. No B do xend-platform, isso fez o CI ficar de fora.
- **B (um agente por repo)** ficou mais rápido no relógio e manteve o prompt perto de 100k por agente, mas somou mais tokens que o A. Não compensa no formato atual.
- **Comparado ao Sonnet:** a qualidade do Haiku com a skill igualou a do Sonnet nos achados-chave. Mesmo com +62% de tokens sobre o Sonnet, o custo estimado fica em ~8–40% do Sonnet, pela proporção de preço.

## Decisões
- DEC-2026-11-10-05: instalar a skill e o subagente (temporária, até o reteste decidir a adoção).
- DEC-2026-11-10-06: rodar o reteste nos 3 repos do baseline.
- O Vítor aprovou "o reteste" sem escolher entre A e A+B. Rodei A+B, que era a recomendação.

## Aprendizados
- Para o Haiku, **"ler menos linhas" não é o mesmo que "gastar menos"**: o que pesa é o número de chamadas. Regras de economia têm de reduzir idas e voltas (ler arquivo pequeno inteiro, checagens em lote, inventário numa chamada só), e não só o volume por leitura.
- Regra com teto precisa dizer **o que conta** no teto. Sem isso, o Haiku conta tudo e corta o que importa.
- A instrução de ferramenta tem que ser testada na plataforma real: `Glob` no Windows não se comporta como o esperado para listar um nível.
- Subagente criado no meio da sessão não fica disponível até ela recarregar.

## Próximos passos
- [ ] **Skill v0.2** (proposta, depende do Vítor):
  - inventário com **uma** chamada `ls -1p` por nível (raiz, `apps/*`, `packages/*`, `.github/workflows`), fora do teto;
  - checagens de existência **em lote** (um `ls`/`test -e` com vários caminhos = 1 checagem);
  - ler inteiro todo arquivo ≤300 linhas, sem contar linhas antes;
  - proibir `Glob` sem caminho absoluto;
  - priorizar o CI antes das checagens;
  - liberar `Bash` só leitura no subagente.
- [ ] Rodar o reteste v0.2 com o subagente `coletor-contexto` (pré-carregamento via `skills:`), só no formato A
- [ ] Vítor: decidir o coletor padrão (encerra a DEC-2026-11-10-02)

## Arquivos criados/alterados
- [[Skills de coleta de contexto e Haiku como executor]] (novo, `03-Pesquisa/Referências/`)
- `05-Agente/Skills/coleta-contexto-repo/SKILL.md` e [[Coleta de contexto de repo (skill)]] (novos)
- `05-Agente/Avaliação/Coleta Stacks - skill 2026-11-10/` (prompts + 6 dossiês)
- `01-Projeto/Decisões/Registro de decisões.md` (DEC-2026-11-10-05 e -06), [[Roadmap]]
- Fora do vault: junções `~\.claude\skills\coleta-contexto-repo` e `~\.agents\skills\coleta-contexto-repo`; `~\.claude\agents\coletor-contexto.md`
