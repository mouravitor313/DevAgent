---
tipo: sessão
status: consolidado
tags: [devagent, sessão, claude-code, agentes-paralelos]
criado: 2026-11-12
atualizado: 2026-11-12
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# Subagents, agent teams e messaging para tasks paralelas

## Objetivo da sessão
Avaliar se subagents, agent teams ou cross-session messaging do Claude Code servem para executar as tasks (GitHub Issues) em paralelo, dentro da [[Filosofia do setup de agentes]].

## O que foi feito
- Lidas as três páginas da doc (12/11) e cruzadas com [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]], [[ADR-0007 - Spec versionada e estado no GitHub]], DEC-2026-11-12-01 e o épico F1 do `xend-onchain` (#168–#179).
- Análise e recomendação → [[Subagents, agent teams e cross-session messaging]].

## Decisões
- DEC-2026-11-12-06: cross-session messaging adotado como complemento (registro durável em comentário de issue/PR).
- DEC-2026-11-12-07: piloto do despachante com subagents em #169 e #170.
- DEC-2026-11-12-08/09/10: `.claude/worktrees/` aceito; limpeza pós-merge; fallback sem `make` documentado (PR #182).
- Agent teams: sem decisão explícita.

## Aprendizados
- Agent teams mantém task list própria e trabalha no mesmo diretório: duplica o estado do GitHub e quebra "uma issue = uma branch = um PR".
- Subagent com `isolation: worktree` + issue como fonte de estado é compatível com o ADR-0007, desde que o procedimento fique numa skill.
- Na F1, `internal/archtest` é tocado por 10 de 11 sub-issues: ponto certo de conflito de merge.

## Próximos passos
- [x] Skill `executar-issue` (fonte em `05-Agente/Skills/executar-issue/`, junções em `~\.claude\skills` e `~\.agents\skills`) e subagent `~\.claude\agents\executor-issue.md` criados.
- [x] Piloto rodado: PRs #180 e #181, relatório recebido por cross-session messaging; skill `executar-issue` v0.2 com os achados → [[Subagents, agent teams e cross-session messaging]]
- [x] Decidido: worktrees dos executores em `.claude/worktrees/` (DEC-2026-11-12-08), limpeza pós-merge (DEC-2026-11-12-09, seção 6 da skill e `ProjetosAGENTS.md`), fallback sem `make` no `apps/mm/CLAUDE.md` → PR #182 (DEC-2026-11-12-10)
- [ ] Revisar/mergear #180, #181 (rebase no `archtest`) e #182; limpar os worktrees do piloto; despachar a próxima leva (#173)

## Arquivos criados/alterados
- `03-Pesquisa/Referências/Subagents, agent teams e cross-session messaging.md`
- `02-Sessões/2026-11-12 - Subagents, agent teams e messaging para tasks paralelas.md`
- `01-Projeto/Roadmap.md` (próximos passos)
- `01-Projeto/Decisões/Registro de decisões.md` (DEC-2026-11-12-06/07)
- `05-Agente/Skills/executar-issue/SKILL.md` · `~\.claude\agents\executor-issue.md`
