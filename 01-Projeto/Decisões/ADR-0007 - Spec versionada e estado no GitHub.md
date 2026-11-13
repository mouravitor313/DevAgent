---
tipo: decisão
status: aceita
tags: [devagent, adr, sdd, github, issues, xend-onchain]
criado: 2026-11-11
atualizado: 2026-11-11
decisores: [Vítor]
substitui:
relacionados: ["[[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]", "[[Modelo de issue para agentes]]", "[[SDD para agentes e integração com GitHub Issues]]", "[[Registro de decisões]]"]
---
# ADR-0007 — Spec versionada e estado no GitHub

> status: `aceita` em 11/11/2026 (DEC-2026-11-11-07 a 10). Escopo: `xend-onchain`. Aplica o ajuste 4 do [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]] (modelo híbrido).

## Contexto
O `xend-onchain` usava uma pasta `.specs/` herdada do ciclo SDD da `tlc-spec-driven`, que foi descartada. A pasta está no `.gitignore` e tem 147 arquivos e cerca de 43 mil linhas: `project/{PROJECT,ROADMAP,STATE,DATABASE}.md` e cerca de 40 features com `spec`, `design` e `tasks`. Duas regras do `AGENTS.md` mandavam atualizar `STATE`, `PROJECT` e `ROADMAP` ao concluir uma feature, e `tasks.md`/`spec.md` ao concluir tasks.

Problemas levantados em 11/11:
- **Estado e informação se perdem.** Fora do git, colegas (o repo é privado, com 5 colaboradores) e agentes de nuvem não enxergam nada. Cada worktree tem uma cópia que já divergiu: 7 a 24 arquivos diferentes em 4 worktrees, e o `STATE.md` do `binance-venue` parou em 30/10.
- **O `STATE.md` (949 linhas) é um diário que mistura** status, decisões, bloqueios, branches e lições. É um arquivo mutável único, o que vai contra o paralelismo da DEC-2026-11-10-24 e o contexto mínimo.
- **A pesquisa aponta para outro desenho** ([[SDD para agentes e integração com GitHub Issues]]): o estado deve ser derivado do GitHub; vale 1 issue = 1 agente = 1 PR; a spec durável fica separada da execução; e a cerimônia deve acompanhar o tamanho do problema.

## Opções consideradas
1. Manter o `.specs/` local e só trocar o `tasks.md` por issues: os agentes de nuvem continuam sem ver a spec e o drift entre worktrees continua.
2. **Spec versionada num arquivo `specs/<feature>.md`, com o estado no GitHub** (escolhida).
3. Formato OpenSpec, com `specs/` e `changes/` → archive: tem mais estrutura do que o necessário para 1 dev, e o histórico de mudanças já fica no PR.
4. Spec Kit completo, com 7 ou mais artefatos por feature: pesado; a crítica de "instruction bloat" se aplica.

## Decisão
1. **A spec sai do `.gitignore`** e é versionada (DEC-2026-11-11-07).
2. **`specs/<feature>.md`**: um arquivo com spec e design, **só para trabalho grande**, mesclado por PR **antes** das issues. Não existe mais `tasks.md`; as tasks viram sub-issues (DEC-2026-11-11-08). Trabalho pequeno vai direto para uma issue.
3. **O `.specs/` atual fica congelado**: local, só leitura, sem migração (DEC-2026-11-11-09).
4. **O acompanhamento é feito com milestones e sub-issues nativas.** Uma issue-épico por feature, com sub-issues autocontidas ([[Modelo de issue para agentes]]). Fases de roadmap, como F0–F6 do MM BRL, viram milestones. Não há `STATE.md` nem `ROADMAP.md` de estado (DEC-2026-11-11-10).

## Consequências
- Positivas: uma fonte da verdade visível para colegas, worktrees e agentes de nuvem; o estado é consultado (`gh issue list`, `gh pr list`) em vez de mantido à mão; menos contexto fixo.
- Negativas / riscos: specs versionadas **não podem conter** ARNs, IPs, IDs de conta nem segredos (o `.specs/` atual contém); revisar markdown custa caro, então a spec deve ser curta.
- A fazer: reescrever as duas regras de `.specs/` no `AGENTS.md` do onchain; aplicar o mesmo ao `sdd-lifecycle` do hedglobal e ao `HARNESS.md` do onchain, que descreve o pipeline antigo; levar as lições duráveis do `STATE.md` para o `apps/mm/AGENTS.md` ou para skills; transformar o plano MM BRL (F0–F6) em milestones e épicos.

## Fontes / sessões relacionadas
- [[2026-11-11 - Destino do .specs e integração com Issues]]
- [[SDD para agentes e integração com GitHub Issues]]
