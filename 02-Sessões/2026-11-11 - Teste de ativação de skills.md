---
tipo: sessão
status: consolidado
tags: [devagent, sessão, skills, avaliação, ativação]
criado: 2026-11-11
atualizado: 2026-11-11
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# 2026-11-11 — Teste de ativação de skills

## Objetivo da sessão
Executar o teste desenhado em [[2026-11-10 - Pesquisa P0 - filosofia do setup]] (ajuste 1 do [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]): as nossas skills são carregadas sozinhas quando o prompt pede algo que elas cobrem?

## O que foi feito
- 40 prompts em português, congelados antes da execução: 20 por skill (`registro-de-decisoes`, `coleta-contexto-repo`), em 6 explícitos, 8 implícitos e 6 negativos.
- Runner `run.mjs`: uma execução limpa de `claude -p` por prompt (stream-json), com Sonnet 5.5. Registra só se houve a chamada `Skill`. Escrita bloqueada (`Write`, `Edit`, `Bash` negados), então nada foi gravado no Registro.
- Config isolada (`CLAUDE_CONFIG_DIR` temporário) sem o `CLAUDE.md` global, que cita a skill e enviesaria o resultado. Só as skills de `~/.claude/skills`, sem as de plugins (~280).
- Três braços, 40 prompts cada.

## Resultados
| braço | registro (explícito / implícito) | coleta (explícito / implícito) | positivos | falso positivo |
|---|---|---|---|---|
| baseline | 6/6 · 2/8 | 6/6 · 2/8 | 16/28 (57%) | 0/12 |
| V1: `description` no padrão "Use quando…" | 6/6 · 3/8 | 6/6 · 3/8 | 18/28 (64%) | 0/12 |
| V2: linha-índice no `AGENTS.md` (via `CLAUDE.md` com `@AGENTS.md`) | 6/6 · 7/8 | 6/6 · 6/8 | **25/28 (89%)** | 0/12 |

- Explícitos ativam sempre. O problema está nos implícitos ("pode remover X", "o que decidimos sobre Y?", "tem restrição antes de mover?", respostas "D2, opção B").
- Reescrever a `description` quase não ajuda (+1 por skill, dentro do ruído).
- O índice no `AGENTS.md` leva a ativação perto do critério. Sobraram R14, C08 e C12 (V2).
- Custo total ≈ US$ 15,8 (baseline 5,29 + V1 5,41 + V2 5,06).

## Decisões
- **DEC-2026-11-11-03** (Vítor): toda skill que o agente deve usar sem ser chamada ganha uma linha-índice no `AGENTS.md`; `description` reescrita sozinha não basta. Detalha o ajuste 1 do [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]].

## Limitações
- Critério era ≥90% nos positivos. A V2 fez 89% (registro 13/14 = 93%, coleta 12/14 = 86%). Com N=28 a diferença para o limite não é significativa.
- Só Claude Code com Sonnet. OpenCode e modelo barato não testados.
- A V2 usou `CLAUDE.md` com `@AGENTS.md`. Não está confirmado se o Claude Code lê `AGENTS.md` sozinho.
- Uma execução por prompt, sem repetição. Sem as skills de plugins no índice, a ativação real tende a ser menor.
- Nos implícitos que falharam, o agente às vezes consultou o Registro com `Grep` sem carregar a skill (R08, R11, R13): consultou, mas sem a regra de gravação nem o formato.

## Próximos passos
- [ ] Repetir a V2 no OpenCode com modelo barato.
- [ ] Repetir a V2 com o índice completo de skills (plugins ligados) e algumas repetições por prompt.
- [ ] Confirmar na doc se o Claude Code lê `AGENTS.md` sem `CLAUDE.md`.
- [ ] Avaliar hook para o caso de decisões implícitas (R14), se a linha-índice não bastar.

## Arquivos criados/alterados
- `05-Agente/Avaliação/Ativação de skills 2026-11-11/` (novo): `prompts.tsv`, `run.mjs`, `resultados-*.json`, `*.log`.
