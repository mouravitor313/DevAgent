---
tipo: decisão
status: aceita
tags: [devagent, adr, stacks]
criado: 2026-11-08
atualizado: 2026-11-10
decisores: [Vítor]
substitui:
---
# ADR-0004 — Stacks agnósticas e seção de Stacks modular

> status: `aceita` · registro: DEC-2026-11-08-20 e DEC-2026-11-08-21 em [[Registro de decisões]]

## Contexto
Os projetos do time usam bastante Python, Go, TypeScript, JavaScript, Next.js e SQL, entre outras. A pergunta "qual a stack-alvo do agente?" do [[Kickoff]] estava em aberto. Um agente preso a uma stack não serve ao portfólio. As práticas de cada stack mudam rápido (skills, MCPs, plugins, convenções), então o conhecimento sobre elas precisa ser fácil de atualizar.

## Opções consideradas
1. Escolher uma stack principal e tratar as outras como exceção.
2. Agente agnóstico, com conhecimento por stack espalhado nos `AGENTS.md` de cada repo.
3. Agente agnóstico, com uma seção dedicada no second brain: um módulo por stack, formato único, consumido pelos repos e pelos agentes.

## Decisão
**Opção 3.** O agente é agnóstico de stack. O vault ganha `05-Agente/Stacks/`, com:
- um hub, [[Stacks]], que define o formato e lista as stacks;
- **uma nota por stack** (Python, Go, TypeScript, JavaScript, Next.js, SQL), todas com as mesmas cinco seções: **Contexto**, **Skills**, **Documentação**, **MCPs e plugins**, **Achados**;
- uma nota [[Tarefas transversais]] para o que vale em qualquer stack (review, testes, specs, refactor, workflow, Git/GitHub).

Regras de modularidade:
- Uma stack nova é uma nota nova copiada do modelo do hub. Nada mais precisa mudar.
- Cada seção tem o mesmo formato em todas as stacks, para um agente ler qualquer uma do mesmo jeito.
- A seção **Contexto** é escrita para ser colada (ou importada) no `AGENTS.md` do repo. O vault é a fonte, o repo é o consumidor.
- Itens de Skills e MCPs/plugins carregam estado (`candidata` → `em-teste` → `adotada` → `descartada`) e em qual agente foram testados (Claude Code, OpenCode).
- **Achados** é um log append-only (data, achado, fonte). Quando um achado vira regra, ele sobe para Contexto e a linha do log fica como histórico.

## Consequências
- Positivas: adicionar ou atualizar uma stack é barato; o mesmo conteúdo serve ao Claude Code e ao OpenCode; dá para medir o que está pronto por stack.
- Negativas / riscos: o conteúdo pode divergir do `AGENTS.md` dos repos se ninguém sincronizar; começar com seis notas quase vazias pode dar falsa sensação de cobertura (por isso o `status` de cada nota).

## Fontes / sessões relacionadas
- [[Kickoff]] · [[Roadmap]] · [[ADR-0002 - Claude Code CLI como ambiente principal]]
- [[2026-11-08 - Stacks e perguntas do Kickoff]]

## Adendo 2026-11-10
- O contexto de cada stack vira **skill** e sai do contexto principal (DEC-2026-11-10-29, [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]). Plugins só quando não houver skill equivalente (DEC-2026-11-10-23).
