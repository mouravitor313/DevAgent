---
tipo: referência
status: em-construção
tags: [devagent, referência, sdd, github, issues, agentes-paralelos]
criado: 2026-11-11
atualizado: 2026-11-11
fonte: pesquisa web (subagente), 11/11/2026
formato: artigo
---
# SDD para agentes e integração com GitHub Issues

## Resumo
Comparação de ferramentas de Spec-Driven Development (Spec Kit, Kiro, cc-sdd, OpenSpec, Tessl, BMAD, Agent OS, Task Master) e da execução de agentes a partir de issue (Copilot, Claude Action, Codex cloud), para decidir o destino do `.specs/` do `xend-onchain`.

## Por que guardei
Embasa a decisão do destino das regras de `.specs/` no `AGENTS.md` do onchain e do `sdd-lifecycle` do hedglobal ([[Roadmap]], [[Modelo de issue para agentes]], [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]).

## Por ferramenta
| Ferramenta | Artefatos e local | Vida útil | Estado | Issues/PR | Peso |
|---|---|---|---|---|---|
| Spec Kit | `specs/NNN/` (7 ou mais arquivos) e `memory/constitution.md`, commitados | por change (branch) | `[X]` em `tasks.md` | `taskstoissues` (mão única, via GitHub MCP ou `gh`) | alto |
| Kiro | `requirements`, `design` e `tasks` por spec, além de `.kiro/steering` | por feature | UI | label `kiro` ou `/kiro` gera PR (sem ligar à spec) | médio |
| cc-sdd | no estilo do Kiro, para 8 agentes | por feature | `tasks.md` | não | médio |
| OpenSpec | `openspec/specs/` vivas; `changes/<id>/` vai para `archive/` com deltas | a change é arquivada | checklist | não | baixo/médio |
| Tessl | spec-as-source e registry | durável | — | não | beta |
| BMAD | PRD, epics/stories e `sprint-status.yaml` | projeto | YAML | não | muito alto |
| Agent OS v3 | standards e `index.yml`; specs delegadas ao plan mode | durável | — | não | baixo |
| Task Master | PRD e JSON, via MCP | projeto | JSON | não documentado | 5–21k tokens (não auditado) |
| Copilot, Claude ou Codex via issue | a própria issue e o PR | fecha no merge | nativo do GitHub | nativo | só `AGENTS.md`/`CLAUDE.md` |

Fontes: [spec-driven.md](https://github.com/github/spec-kit/blob/main/spec-driven.md) · [taskstoissues (espelho)](https://gitcode.com/m0_59527332/spec-kit/blob/main/templates/commands/taskstoissues.md) · [Kiro specs](https://kiro.dev/docs/specs/) · [Kiro GitHub](https://kiro.dev/docs/autonomous-agent/github/) · [cc-sdd](https://github.com/gotalab/cc-sdd) · [OpenSpec](https://github.com/Fission-AI/OpenSpec) · [BMAD](https://docs.bmad-method.org/plan/break-work-into-stories-and-track-it/) · [Agent OS #310](https://github.com/buildermethods/agent-os/discussions/310) · [Task Master](https://github.com/eyaltoledano/claude-task-master) · [Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github) · [agentes de terceiros](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents) · [Claude Code Action](https://code.claude.com/docs/en/github-actions) · [Codex cloud](https://learn.chatgpt.com/docs/cloud)

## Críticas
- Böckeler/Fowler: um fluxo só não serve para todos os tamanhos de problema; markdown é mais difícil de revisar que código; o controle é ilusório ([link](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)).
- Marmelab, "Waterfall strikes back" ([link](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back)). Contraponto da Atomic Object: só vira waterfall se a spec for congelada ([link](https://spin.atomicobject.com/spec-driven-vs-waterfall/)).
- Thoughtworks Radar: SDD em "Assess" ([link](https://www.thoughtworks.com/en-in/radar/techniques/spec-driven-development)).
- Spec drift é o resultado padrão quando nada força a sincronização ([Augment](https://www.augmentcode.com/guides/living-specs-vs-static-specs), vendor).

## Padrões recorrentes
1. Separar a spec durável (commitada) da change descartável, que vai para o archive ou some no merge.
2. 1 issue = 1 agente = 1 branch = 1 PR. A issue precisa ser autossuficiente, porque o Copilot não lê comentários feitos depois da atribuição.
3. O estado vem do GitHub; `STATE.md`, YAML ou JSON duplicam esse estado e geram drift.
4. Constituição e steering curtos, com carga condicional.
5. A cerimônia acompanha o tamanho do problema; o drift se combate com teste ou CI, não com um comando de convergência.
