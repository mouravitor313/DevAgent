---
tipo: decisão
status: aceita
tags: [devagent, adr, claude-code, organização]
criado: 2026-11-08
atualizado: 2026-11-08
decisores: [Vítor]
substitui:
---
# ADR-0003 — Organização da instalação Claude na máquina

> status: `aceita` em 08/11/2026. Decisões D1–D6 respondem ao §4 do [[Inventário - Instalação Claude na máquina]].

## Contexto
O scan de 08/11 ([[2026-11-08 - Inventário da instalação Claude]]) mostrou o seguinte:
- 65 pastas em `Projetos`, mas só 17 repos; o resto são worktrees acumulados.
- Um kit de terceiros (Everything Claude Code) colado como `.claude\` em 8 repos, com hooks, plugins, commands e transcrições de outra máquina.
- Plugins e skills pessoais (trading) ativos no escopo global.

Esta é a base da centralização do Dev Agent.

## Opções consideradas
Para cada ponto: manter, remover ou mover de escopo (ver §4 do inventário).

## Decisão
| ID | Decisão |
|---|---|
| D1 | Os repos continuam em **`C:\Users\Pedro\Projetos`**. O plano é corrigido; nada é renomeado. |
| D2 | **Remover os worktrees com PR mergeado** e sem commits que existam só localmente. |
| D3 | **Remover o kit ECC e também os commands próprios** (`/sdd-phase`, `/parallel` etc.), deixando o workflow limpo. **As skills são só guardadas** em `C:\Users\Pedro\.agents\skills-avaliacao\` para avaliarmos quais entram no Dev Agent. |
| D4 | Repos parados **continuam em `Projetos`**, sem pasta de arquivo. |
| D5 | **Skills AWS e `aws-mcp` ficam.** |
| D6 | **Plugins de trading** (`quandora`, `trading-ideas`) **e skills financeiras passam para o escopo do projeto `arb`.** Provavelmente vão virar o escopo de outro agente no futuro. |
| R1 | **Restrição temporária:** não tocar em nada do `xend-baas-api` (repo, worktrees, `.claude`, config) enquanto houver sessões ativas nele. A limpeza dele fica para um segundo momento. |
| P1 | **Princípio:** toda decisão tomada precisa ser registrada, para ser lembrada **quando necessário**. Implementado pela skill [[Registro de decisões (skill)]] e pelo [[Registro de decisões]]. |

## Consequências
- Positivas:
  - Os repos ficam sem hooks e plugins não auditados.
  - Some o ruído de dezenas de skills por sessão.
  - Sai do caminho de trabalho o histórico de terceiros.
  - Temos um catálogo único de skills para avaliar.
  - O escopo global fica livre de coisas pessoais.
- Negativas / riscos:
  - Os `CLAUDE.md`/`AGENTS.md` versionados perderam a regra `/sdd-phase`. A mudança está local e precisa de commit (ou de alinhamento com o time).
  - O `XEND-RFQ-PORTAL` e o `dashboard_xend` tinham o kit versionado, então a remoção aparece como deleção no git e pede commit/PR.
  - O fluxo SDD (`.specs/`) continua nas regras, mas sem o command que o orquestrava.
  - Os backups ficam em `C:\Users\Pedro\arquivo-claude\2026-11-08\` até decidirmos apagá-los.

## Fontes / sessões relacionadas
- [[2026-11-08 - Inventário da instalação Claude]]
- [[Inventário - Instalação Claude na máquina]]
- [[Plano - Migração para agentes no terminal]]
