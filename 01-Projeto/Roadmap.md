---
tipo: projeto
status: em-construção
tags: [devagent, roadmap]
criado: 2026-11-08
atualizado: 2026-11-12
relacionados: ["[[Kickoff]]"]
---
# Roadmap — Dev Agent

> Proposta inicial. Fases sem datas até fecharmos as perguntas do [[Kickoff]].

## Fase 0 — Fundação (atual)
- [x] Estrutura do vault `DevAgent/` + AGENTS.md/CLAUDE.md + templates
- [x] Importar radars de 08/11 e notas existentes
- [ ] Fechar perguntas em aberto do Kickoff — 3 de 4 respondidas em 08/11; falta fechar o orçamento (provisório ~R$ 2.000/mês, equipe toda; meta: reduzir)
- [ ] Migrar o trabalho do projeto para o Claude Code CLI → [[ADR-0002 - Claude Code CLI como ambiente principal]] · checklist em [[Plano - Migração para agentes no terminal]]
- [x] Conectar a rotina do Radar para gravar direto em `03-Pesquisa/Radar/` (tarefa agendada `radar-dev-ia`, diária 07:00)

## Fase 1 — Pesquisa e definição
- [ ] Notas de conceito em `04-Conhecimento/`: Harness Engineering, Context Engineering, Agent Skills, SDD, MCP, AGENTS.md
- [x] Ler [[LLMRouterBench (paper)]] e completar [[LLMRouter (paper)]] — ambos conferidos no HTML do arXiv em 08/11 e `consolidado` (o +14,6% do LLMRouter não é reproduzível pelo texto; o +4% / 31,7% do LLMRouterBench está detalhado)
- [x] Comparar ferramentas de organização/SDD → [[Ferramentas de organização e templates - ranking]] (OpenSpec ainda não avaliado)
- [ ] Spec v0 do agente em `05-Agente/Specs/`
- [x] Estrutura da seção de stacks em `05-Agente/Stacks/` → [[Stacks]] · [[ADR-0004 - Stacks agnósticas e seção de Stacks modular]]
- [x] Preencher **Contexto** de cada stack a partir dos `AGENTS.md` dos repos (Python, Go, TS, JS, Next, SQL)
- [x] Mapear as 117 skills de `skills-avaliacao` por stack e por tarefa (review, testes, specs, refactor, workflow, Git/GitHub) → [[Avaliação do catálogo skills-avaliacao]] (10/11: 20 candidatas de dev nas notas de stack; nada para Git/GitHub)

## Fase 2 — MVP do harness
- [ ] Arquitetura em `05-Agente/Arquitetura/`
- [ ] AGENTS.md do repositório-alvo + 2–3 skills internas
- [ ] Hooks: lint/testes pós-edição, bloqueio de comandos perigosos, aprovação antes de PR
- [ ] Acesso do agente ao vault (leitura/escrita via MCP ou arquivos)

## Fase 3 — Roteamento de modelos
- [ ] Escolher pool de 3–5 modelos (premium + baratos)
- [ ] Roteador simples (heurística/cascata) como baseline
- [ ] Levantar modelos de **API baratos/gratuitos** (provedores, preços, limites, tool calling) e escolher a camada barata do pool (DEC-2026-11-08-26)
- [ ] **Usar e verificar os modelos free do OpenCode** (DEC-2026-11-08-27): listar o que está disponível na instalação, limites, tool calling e qualidade nas tarefas de [[Tarefas transversais]]
- [ ] **Pendência — API gratuita do Groq** (DEC-2026-11-08-28): adicioná-la ao OpenCode e ao Warp Terminal e aprender a configurá-la no environment (chave, base URL, provider) como opção de roteamento
- [ ] Piloto de custo real com modelos de API baratos/gratuitos — medir custo/tarefa
- [ ] Referência de preço da camada barata: [[LLMRouter (paper)]] (qwen3-coder-next US$ 0,50/1,20 e deepseek-v3.1 US$ 0,60/1,70 por 1M tokens, Together) e [[LLMRouterBench (paper)]] (Qwen3-235B, Kimi-K2, DeepSeek-V3.1)
- *(adiado — modelos locais, ver "Futuro distante")*

## Fase 4 — Avaliação e operação
- [ ] Benchmark interno com tarefas reais em `05-Agente/Avaliação/`
- [ ] Métricas: custo/tarefa, taxa de sucesso, retrabalho
- [ ] Rotinas agendadas alimentando o vault

## Futuro distante (fora do foco atual — DEC-2026-11-08-26)
Foco atual: modelos de API baratos/gratuitos. Modelos locais/auto-hospedados só quando o Vítor retomar.
- [ ] Piloto de modelo aberto local/auto-hospedado (llmfit para dimensionar + Strata/FreeToken para servir) — medir a economia relatada no caso Revolut
- [ ] Rodar o [[Qwen3-Coder-Next]] localmente (≥48 GB só de pesos no Q4; exige máquina com ≥64 GB ou multi-GPU)
- [ ] Camada auto-hospedada com Kimi K3.1 / GLM 5.x

## Próximos passos (curto prazo)
- [x] **Próxima sessão:** o Vítor traz novas direções para os projetos em que o Dev Agent vai trabalhar — trazidas em 10/11 → [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]
- [x] **Prioridade 0 — pesquisa e estudo** (DEC-2026-11-10-25): contexto mínimo / progressive disclosure, Skills × Plugins, agentes paralelos com GitHub Issues. Saída: nota de **filosofia** em `04-Conhecimento/` e ADR-0006 `aceita`. Em 10/11: pesquisa feita → [[Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos]]; rascunho v0 → [[Filosofia do setup de agentes]]; 4 ajustes propostos no ADR-0006. Concluída em 11/11: filosofia aprovada (DEC-2026-11-11-01) e ADR-0006 `aceita` com os 4 ajustes (DEC-2026-11-11-02)
- [x] **Prioridade 1 — nova direção de contexto** (DEC-2026-11-10-22/23): enxugar os `AGENTS.md`/`CLAUDE.md` (global, portfólio e repos) para o que todo agente precisa sempre; mover o resto para skills; revisar a seção [[Stacks]] à luz disso **Escopo (DEC-2026-11-11-04): só o `xend-onchain`** — o `xend-platform` está abandonado e será apagado pelo Vítor; os demais repos já estão enxutos (9–22 linhas). **Em 11/11:** `xend-onchain` feito (bloco AWS → skill `aws-xend`; CLAUDE.md 89 → 1 linha) → [[2026-11-11 - P1 enxugamento do contexto do xend-onchain]]; ativação testada: 14/14 positivos com o índice, 0/6 falsos positivos (baseline 13/14), com ressalvas: prompts fáceis e sem skills de plugins. **Concluída em 11/11** no escopo definido (DEC-2026-11-11-04); pendências derivadas: regras de `.specs/` do onchain (junto com a P2) e repetir o teste da `aws-xend` com plugins ligados (item de ativação de skills)
- [x] **Teste de ativação de skills** (ajuste 1 do ADR-0006): executado em 11/11 no Claude Code com Sonnet. Implícitos: 25% no baseline, 25–38% com `description` reescrita, 86–88% com linha-índice no `AGENTS.md` (positivos 89%, critério era 90%). Conclusão: índice no `AGENTS.md` é necessário antes de migrar conteúdo para skills → [[2026-11-11 - Teste de ativação de skills]]
- [ ] Ativação de skills: repetir no OpenCode com modelo barato e com o índice completo de skills (plugins ligados); confirmar se o Claude Code lê `AGENTS.md` sem `CLAUDE.md` → [[2026-11-11 - Teste de ativação de skills]]
- [ ] **Prioridade 2 — tasks no GitHub Issues** (DEC-2026-11-10-24): definir modelo de issue (escopo, critério de aceite, sem dependência implícita) e migrar as tasks em markdown dos repos. **Em 11/11:** modelo e piloto no `xend-onchain` (template mesclado, PR #132) (`binance-venue` T08–T10 → issues #129–#131); revisado e template mesclado; o PoC Binance foi pausado (DEC-2026-11-11-06), então as issues #129–#131 ficam só como teste do modelo; teste com agente em paralelo e migração das tasks do MM BRL ficam para depois → [[2026-11-11 - P2 piloto de tasks em GitHub Issues]] · [[Modelo de issue para agentes]]
- [x] **Prioridade 3 — remover a `tlc-spec-driven`** (DEC-2026-11-10-28): feito em 10/11 no catálogo (`_catalogo.json` 93 → 91), `hedglobal-plataform`, `xend-onchain` e `xend-onchain-binance-venue`. Skill e comando `sdd-phase` movidos para `C:\Users\Pedro\arquivo-claude\2026-11-10-tlc\`; nada versionado no git; não havia hooks
- [ ] Remover `tlc-spec-driven` e `sdd-phase` do `xend-baas-api` e dos worktrees dele (dz3, gas-worktree, ops-gate, sqla, `xend-baas-api-*`) quando liberado (DEC-2026-11-10-28 / DEC-2026-11-08-07). Ali são versionados (19 arquivos por cópia) → exige commit/PR
- [ ] **Execução paralela de issues no Claude Code** (análise de 12/11 → [[Subagents, agent teams e cross-session messaging]]): decidir (a) cross-session messaging como complemento das sessões por worktree, (b) piloto de despachante com subagents `isolation: worktree` + skill `executar-issue` em 2 issues da Onda 1 da F1, (c) não adotar agent teams para execução. **Em 12/11:** (a) adotado (DEC-2026-11-12-06); (b) piloto aprovado em #169 e #170 (DEC-2026-11-12-07), skill `executar-issue` + subagent `~\.claude\agents\executor-issue.md` criados; falta rodar e avaliar; (c) sem decisão. Piloto feito (PRs #180, #181); DEC-2026-11-12-08/09/10 aplicadas (PR #182). Falta: revisar/mergear e despachar a #173
- [ ] Revisar os subagentes de projeto (`executor-*`, planner, architect…) e decidir se cabem no workflow (DEC-2026-11-10-30). Hoje os `executor-*` do hedglobal e do onchain mandam invocar a `tlc-spec-driven`, que não existe mais
- [ ] `xend-onchain` F2: revisitar a DEC-2026-11-12-04 (coletores da F1 só local/dev) quando a pesquisa do bus definir topologia e hospedagem; levar a troca do indexd para consumidor (DEC-2026-11-12-02) para a spec da F2
- [ ] Decidir o destino da regra `.harness/rules/sdd-lifecycle.md` do `hedglobal-plataform` (pacote `ai-harness`, não versionado), que ainda impõe o ciclo SDD
- [x] **Destino das regras de `.specs/` do onchain — decidido em 11/11** (DEC-2026-11-11-07..10 → [[ADR-0007 - Spec versionada e estado no GitHub]] · [[2026-11-11 - Destino do .specs e integração com Issues]]). Item original: decidir o destino das duas regras de `.specs/` no `AGENTS.md` do `xend-onchain` (atualizar `STATE.md`/`PROJECT.md`/`ROADMAP.md` e `tasks.md`/`spec.md` após concluir feature/tasks): pressupõem o ciclo SDD e as tasks em markdown. Hipótese do Vítor (11/11): avaliar junto com a **P2** (tasks em GitHub Issues, modelo híbrido: spec/ADR em markdown, execução em issue) e com o destino do `sdd-lifecycle` do hedglobal → [[2026-11-11 - P1 enxugamento do contexto do xend-onchain]]
- [x] ADR-0007 aplicado no `xend-onchain` em 11/11: regra nova no `AGENTS.md` (substitui as duas de `.specs/` e o gate `/sdd-phase`) e contrato de artefatos do `HARNESS.md` → **PR #133** (https://github.com/Xend-Exchange/xend-onchain/pull/133), mesclado pelo Vítor em 11/11; checkout principal ressincronizado em `main` e worktree `xend-onchain-specs-adr7` removido
- [ ] **PRÓXIMA SESSÃO (definido em 11/11), continuação do ADR-0007 no onchain** → [[2026-11-11 - Destino do .specs e integração com Issues]]:
  - [ ] Abrir PR com as alterações locais da P1 no checkout principal (`main`): linha da `aws-xend` no `AGENTS.md` e `CLAUDE.md` → `@AGENTS.md`. Atenção: o `CLAUDE.md` **versionado** ainda tem as regras antigas de `.specs/` e do `/sdd-phase` (contradiz o PR #133) até esse PR entrar. Backup em `local-p1.patch` no scratchpad da sessão de 11/11
  - [ ] **Revisar o `HARNESS.md` por completo** (pedido do Vítor): no PR #133 só o contrato de artefatos foi atualizado; personas `architect`/`planner`/`engineer-*`/`executor`/`reviewer`, matriz de modelos (slugs OpenRouter antigos), gerador `scripts/sync-opencode.mjs` e passos de cópia são anteriores ao ADR-0006/0007. Avaliar junto com a revisão dos subagentes `executor-*` (DEC-2026-11-10-30)
  - [ ] Extrair as lições duráveis do `.specs/project/STATE.md` para o `apps/mm/AGENTS.md` ou skills (ex.: `go test -race` só no container `golang:1.27`; `autocrlf` quebra fixtures; shellcheck via Docker; worktrees isolados para executores paralelos)
  - [ ] MM BRL: criar milestones F0–F6 e o épico da F0, com a primeira spec em `specs/` (testa o fluxo do ADR-0007 de ponta a ponta) → fases e restrições em [[ADR-0005 - Arquitetura-alvo do Market Making BRL]] (seção "Plano em fases") · [[2026-11-10 - Check de realidade do MM BRL contra o PDF]]. Junto: versionar o PDF `docs/Market Making e Formação de Mercado.pdf` (untracked) e corrigir as menções ao ZMQ antigo em `apps/mm/CLAUDE.md` e `docs/02-arquitetura-e-risco.md`
  - [ ] Decidir o destino das cópias de `.specs/` nos worktrees (`binance-venue`, `book-onchain`, `brz-exit`, `exit-agnostic`)
  - [ ] Aplicar o ADR-0007 ao `.harness/rules/sdd-lifecycle.md` do hedglobal
- [ ] Converter o "Contexto" das notas de [[Stacks]] em skills (DEC-2026-11-10-29)
- [ ] *(adiado — DEC-2026-11-10-26)* Revisar a implementação de skills de TDD
- [ ] Excluir a skill `tlc-spec-driven` (descartada pela DEC-2026-11-10-08) do catálogo `~\.agents\skills-avaliacao\` (DEC-2026-11-10-14). Antes de mexer nas cópias dos repos, consultar o Registro.
- [x] Ler PDFs do projeto Claude (um deles: *Large Language Model Routing with Benchmark Datasets*) e criar notas em `Papers/` — as duas notas (LLMRouterBench e LLMRouter) foram concluídas em 08/11, lidas no arXiv em vez dos PDFs
- [x] Confirmar inscrições de newsletters pendentes (TLDR, AI/TLDR, Latent Space, Pragmatic Engineer) — confirmadas pelo Vítor em 08/11
- [ ] Avaliar Qwen3-Coder-Next como candidato à camada barata **via API de terceiros** (provedores e preços ainda a levantar); fonte primária verificada em 08/11 → [[Qwen3-Coder-Next]]. Rodá-lo localmente está em "Futuro distante" (DEC-2026-11-08-26)
- [x] Apagar as pastas vazias `Desenvolvimento/` e `LLM/` na raiz do vault — executado pelo Vítor em 10/11
- [x] Decidir os 6 pontos do [[Inventário - Instalação Claude na máquina]] (§4) e executar a limpeza → [[ADR-0003 - Organização da instalação Claude na máquina]]
- [ ] **Limpeza do `xend-baas-api`** quando não houver sessões ativas (DEC-2026-11-08-07): 27 worktrees mergeados, kit ECC versionado (899 arquivos, incluindo transcrições de terceiros), regra `/sdd-phase`, blocos do baas-api no `autoMode` do settings global
- [ ] Commitar/abrir PR das remoções locais: ECC versionado em `XEND-RFQ-PORTAL` e `dashboard_xend`; regra `/sdd-phase` removida dos `CLAUDE.md`/`AGENTS.md` (onchain, hedglobal, RFQ, xendmm, dash-mm, dashboard_xend)
- [ ] Remover o kit ECC do worktree `xend-onchain-binance-venue` (job interrompido por memória baixa em 08/11; `.claude` intacto)
- [ ] MCP do Clerk (escopo local do `xend-baas-api`, DEC-2026-11-08-14): **mantido em 10/11** (DEC-2026-11-10-01). Reavaliar só após atualizar a CLI (3.3.0 → 4.1.0) ou se o baas-api deixar de usar o Clerk; para remover: `claude mcp remove clerk -s local`
- [x] Avaliar as 117 skills de `~\.agents\skills-avaliacao\` (`_catalogo.json`) → [[Avaliação do catálogo skills-avaliacao]]. Triagem feita em 10/11: 20 candidatas (P1: `tlc-spec-driven`, `supabase-postgres-best-practices`, `agent-browser`, A/B `vercel-react-best-practices`), 41 duplicatas, 11 de projeto, 28 fora do escopo, 4 quebradas. Revisão (DEC-2026-11-10-08/09/10): `tlc-spec-driven` descartada, plugin Vercel desconsiderado. Testes A/B no Claude Code feitos → [[Teste de skills - supabase-postgres e agent-browser 2026-11-10]] (agent-browser com ganho claro; supabase-postgres com ganho modesto). Teste de escrita de migration, OpenCode e correção dos achados do RFQ ficam fora do objetivo (DEC-2026-11-10-13). Catálogo enxugado: 44 skills apagadas, restam 73 (DEC-2026-11-10-12). Pendências: avaliar `fullstack-dev-skills`; achar skill de Git/GitHub; enxugar o catálogo (com aprovação)
- [ ] Testar o harness no OpenCode com os modelos gratuitos (junto com a verificação da Fase 3), começando pelas tarefas de [[Tarefas transversais]] (DEC-2026-11-08-24; o teste do repo com 2º agente segue adiado pela DEC-2026-11-08-18, a menos que o Vítor retome)
- [ ] Apagar os backups em `C:\Users\Pedro\arquivo-claude\2026-11-08\` depois de algumas semanas sem precisar deles
- [ ] Avaliar o teste da Advisor Strategy nas Stacks e decidir se vira padrão (DEC-2026-11-08-25) → [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]]. Em 10/11: "sim, com ajustes", em teste (DEC-2026-11-10-02); A/B Haiku × Sonnet na coleta feito → [[2026-11-10 - Teste Haiku x Sonnet na coleta das Stacks]]. Preços conferidos e skill `coleta-contexto-repo` v0.1 criada e retestada → [[2026-11-10 - Skill de coleta para o Haiku]] (qualidade ok, custo piorou: 82 chamadas). Falta: skill v0.2 (menos chamadas, checagens em lote, `ls` no lugar de `Glob`), reteste com o subagente `coletor-contexto` e escolher o coletor padrão
- [ ] Tratar nos repos os achados das Stacks: `--no-verify` no README do xend-platform; allowlist do MCP Supabase com `apply_migration`/`execute_sql` no XEND-RFQ-PORTAL; deploy de `packages/jobs` inexistente na CI do xend-platform
- [x] Limpar os registros de plugins de projeto órfãos (`hedglobal-plataform`: claude-mem e suíte claude-settings) e o cache do `claude-mem` (521 MB) — feito em 10/11: 8 plugins desinstalados (inclui `reflexion`, `tdd` e `sadd` do context-engineering-kit), cache de 524 MB apagado, dados em `~\.claude-mem` preservados → [[2026-11-10 - Limpeza de plugins órfãos do hedglobal]]
- [ ] Apagar o repo `xend-platform` (abandonado, a cargo do Vítor; DEC-2026-11-11-04). Antes, tratar o item das Stacks que cita o xend-platform só se ainda fizer sentido
