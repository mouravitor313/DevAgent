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
- [x] Ler [[LLMRouterBench (paper)]] e completar [[LLMRouter (paper)]] — ambos conferidos no HTML do arXiv em 08/11 e `consolidado` (o +14,6% do LLMRouter não é reproduzível pelo texto; o +4% / 31,7% do LLMRouterBench está detalhado)
- [x] Comparar ferramentas de organização/SDD → [[Ferramentas de organização e templates - ranking]] (OpenSpec ainda não avaliado)
- [ ] Spec v0 do agente em `05-Agente/Specs/`
- [x] Estrutura da seção de stacks em `05-Agente/Stacks/` → [[Stacks]] · [[ADR-0004 - Stacks agnósticas e seção de Stacks modular]]
- [x] Preencher **Contexto** de cada stack a partir dos `AGENTS.md` dos repos (Python, Go, TS, JS, Next, SQL)
- [ ] Mapear as 117 skills de `skills-avaliacao` por stack e por tarefa (review, testes, specs, refactor, workflow, Git/GitHub)

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
- [x] Ler PDFs do projeto Claude (um deles: *Large Language Model Routing with Benchmark Datasets*) e criar notas em `Papers/` — as duas notas (LLMRouterBench e LLMRouter) foram concluídas em 08/11, lidas no arXiv em vez dos PDFs
- [x] Confirmar inscrições de newsletters pendentes (TLDR, AI/TLDR, Latent Space, Pragmatic Engineer) — confirmadas pelo Vítor em 08/11
- [ ] Avaliar Qwen3-Coder-Next como candidato à camada barata **via API de terceiros** (provedores e preços ainda a levantar); fonte primária verificada em 08/11 → [[Qwen3-Coder-Next]]. Rodá-lo localmente está em "Futuro distante" (DEC-2026-11-08-26)
- [ ] Apagar as pastas vazias `Desenvolvimento/` e `LLM/` na raiz do vault
- [x] Decidir os 6 pontos do [[Inventário - Instalação Claude na máquina]] (§4) e executar a limpeza → [[ADR-0003 - Organização da instalação Claude na máquina]]
- [ ] **Limpeza do `xend-baas-api`** quando não houver sessões ativas (DEC-2026-11-08-07): 27 worktrees mergeados, kit ECC versionado (899 arquivos, incluindo transcrições de terceiros), regra `/sdd-phase`, blocos do baas-api no `autoMode` do settings global
- [ ] Commitar/abrir PR das remoções locais: ECC versionado em `XEND-RFQ-PORTAL` e `dashboard_xend`; regra `/sdd-phase` removida dos `CLAUDE.md`/`AGENTS.md` (onchain, hedglobal, RFQ, xendmm, dash-mm, dashboard_xend)
- [ ] Remover o kit ECC do worktree `xend-onchain-binance-venue` (job interrompido por memória baixa em 08/11; `.claude` intacto)
- [ ] Revisitar o MCP do Clerk (escopo local do `xend-baas-api`, DEC-2026-11-08-14): remover com `claude mcp remove clerk -s local` quando não for mais necessário, ou reavaliar após atualizar a CLI (3.3.0 → 4.1.0)
- [ ] Avaliar as 117 skills de `~\.agents\skills-avaliacao\` (`_catalogo.json`) → quais entram no Dev Agent (ver também a Fase 1: mapear por stack)
- [ ] Testar o harness no OpenCode com os modelos gratuitos (junto com a verificação da Fase 3), começando pelas tarefas de [[Tarefas transversais]] (DEC-2026-11-08-24; o teste do repo com 2º agente segue adiado pela DEC-2026-11-08-18, a menos que o Vítor retome)
- [ ] Apagar os backups em `C:\Users\Pedro\arquivo-claude\2026-11-08\` depois de algumas semanas sem precisar deles
- [ ] Avaliar o teste da Advisor Strategy nas Stacks e decidir se vira padrão (DEC-2026-11-08-25) → [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]]
- [ ] Tratar nos repos os achados das Stacks: `--no-verify` no README do xend-platform; allowlist do MCP Supabase com `apply_migration`/`execute_sql` no XEND-RFQ-PORTAL; deploy de `packages/jobs` inexistente na CI do xend-platform
- [ ] Limpar os registros de plugins de projeto órfãos (`hedglobal-plataform`: claude-mem e suíte claude-settings) e o cache do `claude-mem` (521 MB)
