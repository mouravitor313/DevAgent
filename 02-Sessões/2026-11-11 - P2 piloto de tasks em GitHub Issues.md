---
tipo: sessão
status: consolidado
tags: [devagent, sessão, github, issues]
criado: 2026-11-11
atualizado: 2026-11-11
participantes: [Vítor]
ferramenta: Claude Code
---
# 2026-11-11 — P2: piloto de tasks em GitHub Issues

## Objetivo da sessão
Prioridade 2 do [[Roadmap]]: modelo de issue para agentes e piloto de migração das tasks markdown ([[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]).

## O que foi feito
- Levantamento: 7 repos com `tasks.md` (onchain 31, baas-api 49, xendmm 17, hedglobal 15…). Nenhum tem template de issue nem de PR.
- Vítor escolheu `xend-onchain` como piloto e "template + 2–3 issues reais".
- Feature piloto: `binance-venue` (tem `Depends on` e marcação `[P]` por task). Template em `xend-onchain/.github/ISSUE_TEMPLATE/agent-task.md` (mesclado via PR #132 em 11/11). Labels `agent-task` e `agent:claude`. Issues #129 (T08), #130 (T09), #131 (T10, bloqueada por #129).
- Nota do modelo: [[Modelo de issue para agentes]].

## Decisões
- DEC-2026-11-11-05: piloto no `xend-onchain`.
- DEC-2026-11-11-06: tasks da `binance-venue` e PoC fora do MM BRL pausados; as issues #129–#131 foram só teste do modelo.

## Aprendizados
- `.specs/` é ignorado pelo git no onchain: a issue deve ser autocontida.
- O corpo foi gerado por script a partir dos campos da task; funcionou sem edição manual, mas a "Dependências" precisa de mão (T07 ainda não é issue).

## Próximos passos
- [x] Vítor revisou #129–#131 e aprovou o modelo.
- [ ] ~~Testar um agente em #129/#130~~ adiado: PoC Binance pausado. Repetir o teste em tasks do MM BRL.
- [x] Commit/PR do template no onchain: PR #132 mesclado pelo Vítor em 11/11.
- [ ] **Próximo passo (nova sessão):** decidir o destino das regras de `.specs/` do `AGENTS.md` do onchain, à luz do piloto.
- [ ] Migrar mais tasks só do MM BRL, quando houver trabalho nele.
- [ ] Fechar ou deixar abertas as issues #129–#131 (decisão do Vítor).
