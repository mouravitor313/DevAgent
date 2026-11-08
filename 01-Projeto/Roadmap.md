---
tipo: projeto
status: em-construção
tags: [devagent, roadmap]
criado: 2026-11-08
atualizado: 2026-11-08
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
- [ ] Ler [[LLMRouterBench (paper)]] e completar [[LLMRouter (paper)]]
- [x] Comparar ferramentas de organização/SDD → [[Ferramentas de organização e templates - ranking]] (OpenSpec ainda não avaliado)
- [ ] Spec v0 do agente em `05-Agente/Specs/`
- [x] Estrutura da seção de stacks em `05-Agente/Stacks/` → [[Stacks]] · [[ADR-0004 - Stacks agnósticas e seção de Stacks modular]]
- [ ] Preencher **Contexto** de cada stack a partir dos `AGENTS.md` dos repos (Python, Go, TS, JS, Next, SQL)
- [ ] Mapear as 117 skills de `skills-avaliacao` por stack e por tarefa (review, testes, specs, refactor, workflow, Git/GitHub)

## Fase 2 — MVP do harness
- [ ] Arquitetura em `05-Agente/Arquitetura/`
- [ ] AGENTS.md do repositório-alvo + 2–3 skills internas
- [ ] Hooks: lint/testes pós-edição, bloqueio de comandos perigosos, aprovação antes de PR
- [ ] Acesso do agente ao vault (leitura/escrita via MCP ou arquivos)

## Fase 3 — Roteamento de modelos
- [ ] Escolher pool de 3–5 modelos (premium + baratos)
- [ ] Roteador simples (heurística/cascata) como baseline
- [ ] Piloto de modelo aberto (llmfit + Strata/FreeToken) — medir custo real

## Fase 4 — Avaliação e operação
- [ ] Benchmark interno com tarefas reais em `05-Agente/Avaliação/`
- [ ] Métricas: custo/tarefa, taxa de sucesso, retrabalho
- [ ] Rotinas agendadas alimentando o vault

## Próximos passos (curto prazo)
- [ ] Ler PDFs do projeto Claude (um deles: *Large Language Model Routing with Benchmark Datasets*) e criar notas em `Papers/`
- [ ] Confirmar inscrições de newsletters pendentes (TLDR, AI/TLDR, Latent Space, Pragmatic Engineer)
- [ ] Confirmar Qwen3-Coder-Next como candidato à camada barata
- [ ] Apagar as pastas vazias `Desenvolvimento/` e `LLM/` na raiz do vault
- [x] Decidir os 6 pontos do [[Inventário - Instalação Claude na máquina]] (§4) e executar a limpeza → [[ADR-0003 - Organização da instalação Claude na máquina]]
- [ ] **Limpeza do `xend-baas-api`** quando não houver sessões ativas (DEC-2026-11-08-07): 27 worktrees mergeados, kit ECC versionado (899 arquivos, incluindo transcrições de terceiros), regra `/sdd-phase`, blocos do baas-api no `autoMode` do settings global
- [ ] Commitar/abrir PR das remoções locais: ECC versionado em `XEND-RFQ-PORTAL` e `dashboard_xend`; regra `/sdd-phase` removida dos `CLAUDE.md`/`AGENTS.md` (onchain, hedglobal, RFQ, xendmm, dash-mm, dashboard_xend)
- [ ] Remover o kit ECC do worktree `xend-onchain-binance-venue` (job interrompido por memória baixa em 08/11; `.claude` intacto)
- [ ] Revisitar o MCP do Clerk (escopo local do `xend-baas-api`, DEC-2026-11-08-14): remover com `claude mcp remove clerk -s local` quando não for mais necessário, ou reavaliar após atualizar a CLI (3.3.0 → 4.1.0)
- [ ] Avaliar as 117 skills de `~\.agents\skills-avaliacao\` (`_catalogo.json`) → quais entram no Dev Agent (ver também a Fase 1: mapear por stack)
- [ ] Testar o harness no OpenCode com os modelos gratuitos, começando pelas tarefas de [[Tarefas transversais]] (DEC-2026-11-08-24; o teste do repo com 2º agente segue adiado pela DEC-2026-11-08-18, a menos que o Vítor retome)
- [ ] Apagar os backups em `C:\Users\Pedro\arquivo-claude\2026-11-08\` depois de algumas semanas sem precisar deles
- [ ] Avaliar o teste da Advisor Strategy nas Stacks e decidir se vira padrão (DEC-2026-11-08-25) → [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]]
- [ ] Tratar nos repos os achados das Stacks: `--no-verify` no README do xend-platform; allowlist do MCP Supabase com `apply_migration`/`execute_sql` no XEND-RFQ-PORTAL; deploy de `packages/jobs` inexistente na CI do xend-platform
- [ ] Limpar os registros de plugins de projeto órfãos (`hedglobal-plataform`: claude-mem e suíte claude-settings) e o cache do `claude-mem` (521 MB)
