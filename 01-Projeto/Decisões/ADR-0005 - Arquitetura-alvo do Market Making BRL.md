---
tipo: decisão
status: aceita
tags: [devagent, adr, xend-onchain, market-making]
criado: 2026-11-10
atualizado: 2026-11-11
decisores: [Vítor]
substitui:
---
# ADR-0005 - Arquitetura-alvo do Market Making BRL

> status: `aceita`

## Contexto
Check de realidade (2026-11-10) do `indexd` (`xend-onchain/apps/mm`, Go) e do roadmap contra o PDF "Market Making e Formação de Mercado", p.8–9 ("Arquitetura dos bots"). Achados:
- O indexd cobre só Venues (OKX) → Coletor → preço de referência (VWAP/composite). Não existem bus, bot de sinais (skew, vol, lead-lag), bot de ordens, bot de hedge, Redis Streams, post-trade de fills nem supervisor de risco (só saúde de dados).
- O roadmap seguia o programa CEX→on-chain (majors: `binance-venue` → `pool-index` → …), que não leva ao diagrama.
- O bus ZMQ (PR #114) foi descartado no mesmo dia, de propósito, para fazer esse check antes de concluí-lo.

## Opções consideradas
1. Manter o roadmap atual (majors/CEX→on-chain) e tratar o PDF como material de apresentação.
2. Adotar o PDF como arquitetura-alvo e planejar o caminho MM BRL.

## Decisão
Opção 2. Nas palavras do Vítor:
- O PDF (p.8–9) **é a arquitetura-alvo** dos bots de market making.
- **Um processo por função** (coletores, sinais, ordens, hedge, post-trade, supervisor de risco); o **canal de comando é essencial**.
- **Go é a linguagem definitiva** do market making. Não considerar integração com o Python (`apps/arb`) por ora; no futuro, boa parte da infra será Go.
- O **indexd é PoC / primeira task** de estudo e coleta de dados; sua engine e conexões serão reaproveitadas para montar os bots separados.
- **ZMQ volta**, construído do zero, seguindo o PDF; pesquisa feita na hora da execução desse passo.
- Próxima venue: **Foxbit**. As venues de hedge (B3/MT5, CME, Hyperliquid) são reais e vêm em uma segunda fase.
- Prioridade: **planejar o caminho MM BRL**.

## Consequências
- Positivas: roadmap passa a perseguir uma arquitetura explícita; um processo por função permite pausar/cancelar por bot (regras da p.9).
- Negativas / riscos: reescrever em Go o que já existe em Python (Foxbit em `apps/arb`); o programa CEX→on-chain vira PoC temporária isolada (DEC-2026-11-10-35); bot de ordens só vai ao vivo com B3/CME prontas (DEC-2026-11-10-32), o que alonga o caminho até produção; refatorar o indexd monolítico em processos.

## Plano em fases (acrescentado em 2026-11-11)
> Copiado do `.specs/project/ROADMAP.md` do repo, escrito na sessão de 10/11 e aprovado com as DEC-32..37. O `.specs/` foi congelado (DEC-2026-11-11-09) e não é versionado, então o plano passa a ter cópia aqui. Pelo [[ADR-0007 - Spec versionada e estado no GitHub]], cada fase vira uma **milestone** no GitHub, com épico e sub-issues; o estado de execução fica lá, não aqui.

| Fase | Entrega | Caixas do PDF |
|---|---|---|
| F0 · Fundação | Extrair do indexd o que é reaproveitável (book, pricing, conexão OKX, FX) para pacotes Go compartilhados; contratos de mensagem (book normalizado, sinal, comando, fill, heartbeat) com correlation ID | — |
| F1 · Coletores como processos | `collector-okx` (sai do indexd), `collector-foxbit` (novo, Go), `collector-fx`; o indexd vira consumidor (índice, API, viewer) | Venues, Coletores |
| F2 · Bus + comando + supervisor v0 | Bus ZMQ refeito do zero (pesquisa na execução); Redis Streams para comandos e heartbeats; supervisor v0 (watchdogs de staleness, latência e heartbeat; pausa) | Bus ZMQ, Redis Streams, Supervisor |
| F3 · Bot de sinais | Preço de referência (reusa o pricing), skew de inventário, volatilidade, lead-lag (OKX × Foxbit × FX); não envia ordens | Bot de sinais |
| F4 · Post-trade + Foxbit privada | Auth, ordens e fills via WS da Foxbit; gravação de fills; reconciliação por correlation ID; backfill REST | Post-trade |
| F5 · Bot de ordens (Foxbit) | Cotação passiva em lote, só o diff; cancela tudo ao pausar ou se o heartbeat de sinais atrasar; **só shadow/paper** até as venues de hedge estarem prontas (DEC-32) | Bot de ordens |
| F6 · Bot de hedge + supervisor v1 | Escuta fills e faz hedge na melhor venue; pausar o hedge pausa as ordens; limites de posição e PnL | Bot de hedge, Supervisor |
| Fase 2 · venues | B3 (MT5), CME, Hyperliquid (hedge, reais); MB, Binance | Venues |

Ordem: canal de comando e supervisor vêm **antes** do bot de ordens, para que as regras da p.9 ("pausar o hedge pausa as ordens"; "heartbeat de sinais atrasado cancela tudo") sejam viáveis desde o início.

Restrições e pontos abertos:
- O roadmap só fecha 100% com todas as venues, APIs e conexões (DEC-32).
- Instrumentos Foxbit: USD stables e BRL, fiat e stables (DEC-33).
- **Aberto (requisito da pesquisa da F2):** topologia multi-região. Coletores perto das venues (Foxbit/B3 no Brasil, OKX em Tóquio) e bus cruzando regiões. `sa-east-1` não está no `RegionFloor` da SCP, e só o Vítor pode editar isso (DEC-34).
- O indexd segue no ar em Tóquio servindo o `/mm/feed`; ele vira consumidor do bus só quando o bus estiver estável (DEC-36).
- O cliente Foxbit em Python (`apps/arb/src/foxbit/`) é fonte de referência ao lado da doc oficial, nunca integrado (DEC-37).
- O trabalho anterior do bus ZMQ (PR #114) não é reaproveitado (DEC-20).

## Fontes / sessões relacionadas
- `xend-onchain/docs/Market Making e Formação de Mercado.pdf` p.8–9
- DEC-2026-11-10-15 a DEC-2026-11-10-21 e DEC-2026-11-10-32 a DEC-2026-11-10-37
- Sessão: [[2026-11-10 - Check de realidade do MM BRL contra o PDF]]
- Execução (estado): milestones F0–F6 no GitHub do `xend-onchain` (criadas em 11/11/2026, #1–#7), conforme o [[ADR-0007 - Spec versionada e estado no GitHub]]. F0: spec `specs/f0-fundacao.md` (PR #134), épico #135 com sub-issues #136–#141
