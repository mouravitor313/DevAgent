---
tipo: sessão
status: consolidado
tags: [devagent, sessão, stacks]
criado: 2026-11-08
atualizado: 2026-11-08
participantes: [Vítor]
ferramenta: Claude Code
---
# 2026-11-08 - Stacks e perguntas do Kickoff

## Objetivo da sessão
Listar as perguntas em aberto do [[Kickoff]] e os próximos passos baratos do [[Roadmap]]; depois fechar as perguntas que o Vítor respondeu.

## O que foi feito
- Listadas as 4 perguntas do Kickoff e os próximos passos baratos.
- Vítor respondeu 3 delas e deu um valor provisório para o orçamento.
- Criada a seção [[Stacks]] em `05-Agente/Stacks/`: hub com formato e modelo, 6 notas de stack e [[Tarefas transversais]].
- Atualizados Kickoff, Roadmap e [[00 - Index]].

## Decisões
- Stack-alvo **agnóstica**; seção de stacks modular → [[ADR-0004 - Stacks agnósticas e seção de Stacks modular]] (DEC-2026-11-08-20/21).
- Tarefas iniciais: review, testes, specs, refactor, workflow e Git/GitHub (DEC-2026-11-08-22).
- Orçamento provisório de ~R$ 2.000 para a equipe, com meta de reduzir (DEC-2026-11-08-23, temporária).
- Roda local no Claude Code (plano de time) e no OpenCode, com modelos gratuitos para testes (DEC-2026-11-08-24).

## Aprendizados
- Skills e MCPs listados nas notas de stack vêm do que está instalado nesta máquina; nada foi testado ainda (estado `candidata`).

## Próximos passos
- [ ] Preencher **Contexto** de cada stack a partir dos `AGENTS.md` dos repos.
- [ ] Mapear `skills-avaliacao` por stack e por tarefa.
- [ ] Fechar o orçamento.
- [ ] Testar o harness no OpenCode com os modelos gratuitos.

## Arquivos criados/alterados
- Criados: `05-Agente/Stacks/` (Stacks, Python, Go, TypeScript, JavaScript, Next.js, SQL, Tarefas transversais), `ADR-0004`, esta nota.
- Alterados: `Registro de decisões`, `Kickoff`, `Roadmap`, `00 - Index`.
