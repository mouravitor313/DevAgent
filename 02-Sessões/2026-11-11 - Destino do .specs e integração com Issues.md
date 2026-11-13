---
tipo: sessão
status: consolidado
tags: [devagent, sessão, sdd, github, issues, xend-onchain]
criado: 2026-11-11
atualizado: 2026-11-11
participantes: [Vítor]
ferramenta: Claude Code CLI (Opus 5.5)
---
# 2026-11-11 - Destino do .specs e integração com Issues

## Objetivo da sessão
Entender o `.specs/` do `xend-onchain` e decidir o destino das duas regras de `.specs/` no `AGENTS.md`, à luz das tasks em GitHub Issues e da [[Filosofia do setup de agentes]] (item "PRÓXIMO PASSO" do [[Roadmap]]).

## O que foi feito
- Diagnóstico do `.specs/`: 147 arquivos e cerca de 43 mil linhas. O `STATE.md` tem 949 linhas e funciona como diário (status, decisões, bloqueios, branches, lições). Os `tasks.md` têm de 700 a 1.500 linhas.
- Drift comprovado: 4 worktrees com cópias do `.specs/` que divergem do principal em 16, 24, 7 e 24 arquivos (`binance-venue`, `book-onchain`, `brz-exit`, `exit-agnostic`).
- Outros resquícios do ciclo antigo: o `HARNESS.md` (versionado) ainda descreve o pipeline `tlc-spec-driven`; o `.harness/rules/sdd-lifecycle.md` do hedglobal repete as mesmas regras.
- Pesquisa sobre Spec Kit, Kiro, cc-sdd, OpenSpec, Tessl, BMAD, Agent OS, Task Master e agentes a partir de issue → [[SDD para agentes e integração com GitHub Issues]].

## Decisões
- DEC-2026-11-11-07 a 10 → [[ADR-0007 - Spec versionada e estado no GitHub]]: a spec sai do `.gitignore`; `specs/<feature>.md` (um arquivo, só para trabalho grande, via PR antes das issues); `.specs/` atual congelado; milestones e sub-issues nativas.

## Aprendizados
- Nenhuma ferramenta de SDD sincroniza o estado de volta a partir do GitHub (o `taskstoissues` do Spec Kit é de mão única). Arquivo de estado local gera drift.
- Os agentes de nuvem convergem para 1 issue = 1 agente = 1 branch = 1 PR; a issue precisa ser autossuficiente.
- Um `.gitignore` em memória de projeto + worktrees produz cópias divergentes: o paralelismo quebra o modelo antes mesmo das Issues.

## Execução (mesmo dia)
- PR #133 no `xend-onchain` (branch `chore/specs-adr-0007`, worktree `xend-onchain-specs-adr7`, base `origin/main`): `AGENTS.md` com a regra nova (estado no GitHub; `specs/<feature>.md` para trabalho grande; issue única para trabalho pequeno; `.specs/` congelado) e sem o gate `/sdd-phase`; `HARNESS.md` com o contrato de artefatos do ADR-0007 e aviso de revisão pendente. As alterações locais da P1 (`aws-xend` no `AGENTS.md`, `CLAUDE.md` de 1 linha) ficaram fora.
- O Vítor revisou e mesclou o #133 (`bb05800`). Checkout principal ressincronizado: saiu de `docs/indexd-onboarding` (0 commits à frente, 45 atrás), foi para `main` em `origin/main`, e as alterações da P1 foram reaplicadas por cima. Worktree e branch do PR removidos.
- Achado: o `CLAUDE.md` versionado do onchain ainda repete as regras antigas (`.specs/`, `/sdd-phase`); a alteração local da P1 (`@AGENTS.md`) corrige isso, mas falta abrir o PR.

## Próximos passos
Lista para a próxima sessão no [[Roadmap]] ("PRÓXIMA SESSÃO, continuação do ADR-0007 no onchain"): PR das alterações locais da P1 (o `CLAUDE.md` versionado ainda tem as regras antigas); **revisão completa do `HARNESS.md`** (pedido do Vítor); lições do `STATE.md` → `apps/mm/AGENTS.md`; milestones F0–F6 e épico da F0 do MM BRL; cópias de `.specs/` nos worktrees; `sdd-lifecycle` do hedglobal.

## Arquivos criados/alterados
- `01-Projeto/Decisões/ADR-0007 - Spec versionada e estado no GitHub.md` (novo)
- `01-Projeto/Decisões/Registro de decisões.md` (DEC-2026-11-11-07 a 10)
- `03-Pesquisa/Referências/SDD para agentes e integração com GitHub Issues.md` (novo)
- `xend-onchain`: `AGENTS.md`, `HARNESS.md` (PR #133)
- `01-Projeto/Roadmap.md`, `00 - Index.md`, `04-Conhecimento/Modelo de issue para agentes.md`
