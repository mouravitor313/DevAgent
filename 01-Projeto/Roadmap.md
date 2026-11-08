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
- [ ] Fechar perguntas em aberto do Kickoff
- [ ] Migrar o trabalho do projeto para o Claude Code CLI → [[ADR-0002 - Claude Code CLI como ambiente principal]] · checklist em [[Plano - Migração para agentes no terminal]]
- [x] Conectar a rotina do Radar para gravar direto em `03-Pesquisa/Radar/` (tarefa agendada `radar-dev-ia`, diária 07:00)

## Fase 1 — Pesquisa e definição
- [ ] Notas de conceito em `04-Conhecimento/`: Harness Engineering, Context Engineering, Agent Skills, SDD, MCP, AGENTS.md
- [ ] Ler [[LLMRouterBench (paper)]] e completar [[LLMRouter (paper)]]
- [x] Comparar ferramentas de organização/SDD → [[Ferramentas de organização e templates - ranking]] (OpenSpec ainda não avaliado)
- [ ] Spec v0 do agente em `05-Agente/Specs/`

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
