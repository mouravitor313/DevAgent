---
tipo: conceito
status: em-construção
tags: [devagent, github, issues, agentes-paralelos]
criado: 2026-11-11
atualizado: 2026-11-11
relacionados: ["[[Filosofia do setup de agentes]]", "[[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]", "[[Roadmap]]"]
---
# Modelo de issue para agentes

## Definição curta
Uma issue é uma fatia executável, **autocontida**, com um PR pequeno. Spec e ADR continuam em markdown; a execução vive na issue (DEC-2026-11-11-02, ajuste 4). Os 9 campos vêm da [[Filosofia do setup de agentes]].

## Por que importa para o Dev Agent
Permite agentes em paralelo (local ou nuvem) sem um depender do resultado do outro (DEC-2026-11-10-24).

## Como aplicar
- Template do piloto: `xend-onchain/.github/ISSUE_TEMPLATE/agent-task.md` (mesclado no PR #132). Campos: Objetivo, Contexto, Escopo (+ fora de escopo), Critérios de aceite, Como validar, Restrições, Dependências e colisão, Tamanho e risco, Executor (label `agent:*`).
- Labels criadas no repo: `agent-task`, `agent:claude`.
- Conversão de uma task markdown (formato `What/Where/Depends on/Done when/Verify/Commit`): What → Objetivo; Where → Escopo; Done when → Critérios; Verify → Como validar; Conventions da `tasks.md` → Restrições; Depends on → Bloqueada por.
- Piloto (11/11): `binance-venue` T08, T09, T10 → https://github.com/Xend-Exchange/xend-onchain/issues/129, /130, /131. T10 aponta #129 como bloqueio.
- Status: o piloto validou o modelo; as tasks Binance foram pausadas (DEC-2026-11-11-06) e as issues #129–#131 ficam como exemplo.
- Paralelo só entre tasks disjuntas (T08/T09 sim; T10 espera T08).

## Armadilhas
- **`.specs/` está no `.gitignore` do `xend-onchain`**: agente de nuvem não vê a spec. A issue precisa trazer o texto da task, não só o link.
- Uma regra do `AGENTS.md` do onchain manda atualizar `tasks.md`/`spec.md` ao concluir tasks; com issues, o estado passa a ser a própria issue. Decidido em 11/11: estado no GitHub (milestones + sub-issues), spec versionada em `specs/<feature>.md` só para trabalho grande, `.specs/` congelado → [[ADR-0007 - Spec versionada e estado no GitHub]].
- Ainda sem dono do bloqueio: T07 (gate) não virou issue, então "bloqueada por T07" é texto, não link. T02–T06 estão em andamento no worktree `xend-onchain-binance-venue`.
- O `onchain` tem ~800 itens abertos em `tasks.md` (muitos são checklists de aceite, não tasks); migrar em massa seria ruído.

## Fontes
- [[Filosofia do setup de agentes]] · [[Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos]]
