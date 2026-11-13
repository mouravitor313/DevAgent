---
tipo: sessão
status: consolidado
tags: [devagent, sessão, contexto, skills, github]
criado: 2026-11-10
atualizado: 2026-11-10
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# 2026-11-10 — Nova direção: contexto mínimo e tasks paralelas

## Objetivo da sessão
Registrar as dicas de um CTO sobre o setup de IA e a nova direção do Vítor a partir delas.

## O que foi feito
- Dicas do CTO resumidas no [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]] (proposta).
- Decisões DEC-2026-11-10-22 a 26 no [[Registro de decisões]].
- Prioridades novas no [[Roadmap]] → "Próximos passos".
- Levantamento: a `tlc-spec-driven` tem cópias em ~45 repos/worktrees, não só no catálogo.

## Decisões
- Contexto principal mínimo; o resto em skills (DEC-22).
- Skills e `AGENTS.md` acima de plugins e recursos exclusivos (DEC-23).
- Tasks em GitHub Issues, agentes em paralelo (DEC-24).
- Skills centralizadas; só as específicas ficam no projeto (DEC-27). Remoção da `tlc-spec-driven` + `sdd-phase`, exceto no baas-api (DEC-28). Contexto de stack vira skill (DEC-29). Subagentes revistos depois (DEC-30).
- Ordem: contexto → GitHub → `tlc-spec-driven`; filosofia depois de pesquisa (DEC-25). TDD adiado (DEC-26).

## Próximos passos
- [ ] Pesquisa e estudo → nota de filosofia → aceitar ADR-0006
- [x] Escopo confirmado (DEC-27/28) e remoção feita fora do baas-api; backup em `C:\Users\Pedro\arquivo-claude\2026-11-10-tlc\`
- [ ] Revisar subagentes `executor-*` (DEC-30) e a regra `.harness/rules/sdd-lifecycle.md` do hedglobal
- [ ] Stacks: contexto → skills (DEC-29)
- [ ] Confirmar numa sessão real do Codex que ele lê o ponteiro global; levar as regras pessoais do `~\.claude\CLAUDE.md` (português, vault) para Codex/OpenCode

## Arquivos criados/alterados
- `Projetos\AGENTS.md` (seção "Setup de agentes"), `~\.codex\AGENTS.md` (novo), `~\.config\opencode\opencode.json` (`instructions`), skill `registro-de-decisoes` (consulta inclui `global`) — DEC-31
- `01-Projeto/Decisões/ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas.md` (novo)
- `01-Projeto/Decisões/Registro de decisões.md`, `01-Projeto/Roadmap.md`
