---
tipo: stack
status: a-ler
tags: [devagent, stacks, tarefas, git]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Stacks]]", "[[Kickoff]]", "[[Roadmap]]"]
---
# Tarefas transversais

Tarefas iniciais do agente (DEC-2026-11-08-22), independentes de stack. Mesmo formato das notas de stack, com uma subseção por tarefa em **Skills**. A parte específica de cada stack fica na nota da stack.

## Contexto
- Git/GitHub: a CLI é `gh`. Regras comuns de git, commits e prod ficam em `Projetos\AGENTS.md`.
- Nada vai a produção, nem é mesclado, sem aprovação do Vítor.

## Skills
| tarefa | skill | origem | estado | testado em |
|---|---|---|---|---|
| review | `code-review` · `engineering:code-review` | instaladas | candidata | — |
| review (segurança) | `security-review` | instalada | candidata | — |
| testes | `engineering:testing-strategy` | plugin engineering | candidata | — |
| specs | `product-management:write-spec` | plugin product-management | candidata | — |
| refactor | `simplify` · `engineering:tech-debt` | instaladas | candidata | — |
| workflow | `engineering:standup` · `loop` | instaladas | candidata | — |
| Git/GitHub | *(sem skill; avaliar `_catalogo.json` em `~\.agents\skills-avaliacao\`)* | — | — | — |

## Documentação
- [GitHub CLI](https://cli.github.com/manual/)
- [Claude Code](https://docs.claude.com/en/docs/claude-code) · [OpenCode](https://opencode.ai/docs/)

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|
| `gh` (CLI) | local | PRs, issues, checks | candidata | — | preferir à API via MCP |

## Achados
| data | achado | fonte |
|---|---|---|
