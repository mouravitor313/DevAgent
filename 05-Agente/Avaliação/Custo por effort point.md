---
tipo: conceito
status: em-construção
tags: [devagent, avaliação, custo, métrica, effort-point]
criado: 2026-11-13
atualizado: 2026-11-13
relacionados: ["[[2026-11-12 - Radar Dev & IA]]", "[[Roadmap]]", "[[Kickoff]]", "[[Registro de decisões]]"]
---
# Custo por effort point

## Definição curta
**1 effort point = 1 PR mergeado de autoria do Vítor.** O custo por effort point é o custo equivalente de API do período dividido pelos PRs mergeados nesse mesmo período, contando só os repos que tiveram PR. O trabalho sem PR (pesquisa, `terminal`, `arb`, este vault) fica numa coluna separada e **não entra na média** (DEC-2026-11-13-01).

A ideia vem do incident.io, via The Pragmatic Engineer, em 12/11 (fonte secundária, **não auditado**; ver [[2026-11-12 - Radar Dev & IA]]). Lá o "effort point" é um PR médio, e times de infra gastam cerca de 5× mais por PR porque exploram sem gerar PR. Por isso o trabalho sem PR fica numa linha separada aqui.

## Por que importa para o Dev Agent
- Dá um número único para acompanhar se o setup fica mais barato **por entrega**, não só por mês. Serve para a meta de reduzir os ~R$ 2.000/mês (DEC-2026-11-08-23).
- É a linha de base para o piloto de custo da Fase 3: quando um modelo barato fizer o mesmo PR, a comparação é direta.

## Como medir
- Script: `05-Agente/Avaliação/scripts/effort-points.js`. Pede só `node` e `gh` autenticado.
  - `node "05-Agente/Avaliação/scripts/effort-points.js"`: últimos 7 dias, até ontem.
  - `--since AAAA-MM-DD --until AAAA-MM-DD`: período livre.
  - `--append`: grava a linha no histórico abaixo. Se a linha do período já existir, não grava de novo.
- **Custo:** soma do `usage` de cada resposta nos transcripts de `~/.claude/projects`, deduplicada por `message.id` + `requestId` e multiplicada pela tabela de preços da API, que está no topo do script. O cache write 5m e o 1h são separados.
- **PRs:** `gh pr list --state merged --search "merged:<período> author:@me"` em cada repo local com remote no GitHub.
- **Cadência:** uma linha por semana (DEC-2026-11-13-02). Roda sozinha pela tarefa agendada "DevAgent - effort points semanal" do Windows, toda segunda às 09:00, cobrindo a semana anterior de segunda a domingo. Se o PC estiver desligado no horário, roda quando ele ligar. Log: `%LOCALAPPDATA%\effort-points\effort-points.log` (DEC-2026-11-13-03).

## Armadilhas
- **É custo-sombra.** O Claude do time é plano de time, não API ([[Kickoff]]). O valor mostra quanto o uso custaria na API, não o que foi pago. Serve para comparar períodos e modelos, não para conferir a fatura.
- **Só cobre a máquina do Vítor.** Colegas, Cursor, OpenCode e agentes de nuvem ficam de fora. No `xend-onchain`, 25 dos 51 PRs mergeados em 30 dias são de outras pessoas e não entram na conta.
- **PR não tem tamanho fixo.** Um PR de uma linha e um épico valem 1 ponto cada. Leia a tendência de várias semanas, não uma semana isolada.
- **O custo é atribuído pela pasta da sessão.** Uma sessão aberta no vault que mexe num repo conta como "sem PR".
- **Os preços estão fixos no script.** Revise quando mudar a tabela da Anthropic. O cache read do Haiku 5.5 é estimado.

## Linha de base (30 dias, 14/10 a 13/11)
Custo equivalente total: **US$ 1.766**. Mix: Opus 5.5 45%, Sonnet 5.5 24%, Fable 5.1 23%, Fable 5 7%, Haiku 0%.

| repo | US$ | PRs meus | US$/PR |
|---|---|---|---|
| xend-baas-api | 940 | 47 | 20 |
| xend-onchain (+ apps, apps-mm) | 429 | 26 | 17 |
| sem PR (terminal, arb, vault, hedglobal) | 396 (22%) | — | — |

→ **US$ 19 por effort point** (US$ 1.369 / 73 PRs). O Fable (5 e 5.1) responde por 30% do custo, o que já sugere uma alavanca: usar Fable só para planejar, como no "conductor mode" do [[2026-11-12 - Radar Dev & IA]].

## Histórico semanal
| período | US$ total | PRs | US$/effort point | sem PR | US$/PR por repo | mix por modelo |
|---|---|---|---|---|---|---|
| 2026-11-06 a 2026-11-12 | 456 | 33 | **12** | 50 (11%) | xend-baas-api 21 · xend-onchain 5 | sonnet-5-5 49%, opus-5-5 44%, fable-5-1 8%, haiku-5-5 0% |
<!-- effort-points:fim-do-historico -->

## Fontes
- The Pragmatic Engineer, 12/11/2026, via [[2026-11-12 - Radar Dev & IA]] (secundária, não auditado).
- Preços: skill `claude-api` (tabela em cache de 06/10/2026).
