---
tipo: decisão
status: proposta
tags: [devagent, adr, claude-code]
criado: 2026-11-08
atualizado: 2026-11-08
decisores: [Vítor]
substitui:
---
# ADR-0002 — Claude Code (CLI) como ambiente principal do projeto

> status: `proposta` — direção acordada em 08/11/2026, a executar **posteriormente**.

## Contexto
O vault `DevAgent/` é a memória do projeto ([[ADR-0001 - Vault como memória do projeto]]), mas hoje nenhum ambiente o usa de forma automática:
- **Projeto no claude.ai:** só vê os arquivos anexados ao projeto; não acessa o vault local nem grava nele.
- **Cowork (app desktop):** só acessa o vault se a pasta for conectada na conversa, e não há garantia de que leia o `CLAUDE.md` sozinho.
- **Claude Code (CLI):** carrega o `CLAUDE.md` da pasta onde é iniciado e trabalha direto nos arquivos → é o único que usa o vault como contexto sem passos manuais.

## Opções consideradas
1. Continuar no claude.ai/Cowork com instruções coladas ou uma skill "devagent-vault".
2. Migrar o trabalho do projeto para o **Claude Code via CLI**.

## Decisão
Opção 2: concentrar as conversas e a construção do Dev Agent no **Claude Code CLI**, iniciado dentro de `vitorvalt/DevAgent/` para que o `CLAUDE.md` (que importa o `AGENTS.md`) seja carregado automaticamente.

## Consequências
- Positivas: o vault vira contexto de verdade em toda sessão; leitura e escrita sem fricção; o harness (hooks, skills, AGENTS.md) que vamos construir para o agente é testado no próprio dia a dia; coerente com o foco do projeto em harness engineering.
- Negativas / riscos: perde-se a interface do app (artefatos, conectores como o Gmail); rotinas agendadas hoje rodam no Cowork (ex.: `radar-dev-ia`) e precisariam migrar (ex.: Claude Code headless + agendador do Windows) ou continuar no app.

## Como executar (quando formos fazer)
- [ ] Instalar/atualizar o Claude Code e abrir em `C:\Users\Pedro\Documents\vitorvalt\DevAgent`.
- [ ] Revisar o `CLAUDE.md` para o fluxo CLI (ler Index + Roadmap ao iniciar; registrar sessão ao final).
- [ ] Configurar hooks: lembrete de nota de sessão ao encerrar; bloqueio de escrita fora de `DevAgent/`.
- [ ] Decidir se a rotina do Radar migra para o CLI (modo headless) ou fica no Cowork.
- [ ] Avaliar Git no vault (histórico das alterações feitas pelo agente).

## Fontes / sessões relacionadas
- [[2026-11-08 - Kickoff do vault DevAgent]]
- Execução detalhada (acrescentado em 08/11): [[Plano - Migração para agentes no terminal]]
