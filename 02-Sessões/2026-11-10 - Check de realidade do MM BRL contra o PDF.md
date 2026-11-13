---
tipo: sessão
status: consolidado
tags: [devagent, sessão, xend-onchain, market-making, indexd]
criado: 2026-11-10
atualizado: 2026-11-11
participantes: [Vítor]
ferramenta: Claude Code CLI (aberto no `xend-onchain`)
---
# 2026-11-10 - Check de realidade do MM BRL contra o PDF

> Nota **retroativa**, escrita em 11/11 a partir do transcript da sessão (`~\.claude\projects\C--Users-Pedro-Projetos-xend-onchain\4094a3b8-….jsonl`). A sessão foi aberta no repo e registrou as decisões no vault, mas não criou esta nota.

## Objetivo da sessão
Fazer um check de realidade do `indexd` (`xend-onchain/apps/mm`, Go) e do roadmap do repo contra o PDF "Market Making e Formação de Mercado", p.8–9 ("Arquitetura dos bots"), e fazer clarify e brainstorm antes dos próximos passos.

## O que foi feito
- Mapa de cada caixa do PDF contra o código e o roadmap. Checkout usado: `docs/indexd-onboarding`, que está atrás do `main` em `apps/mm` (sem Massive WS nem `fxWarnMs`).

| Caixa do PDF | Realidade em 10/11 | No roadmap? |
|---|---|---|
| Venues (Binance, OKX, MB·Foxbit, B3/MT5, CME, Hyperliquid) | Só a OKX está ligada. A Foxbit existe só no `apps/arb`, em Python. MB, B3, CME e Hyperliquid não aparecem. Há FX (Massive, Twelve Data, WDO manual) que o PDF não mostra | A Binance está especificada, mas com majors em USDT |
| Coletores (1 por exchange, book normalizado) | Parcial: o coletor OKX tem WS com seqId e resync, mas roda num processo único, com uma goroutine por feed | `binance-venue` |
| Bus ZMQ | Não existe. A distribuição é feita por WS `/ws` (250 ms), REST `/history` e Mongo. O bus do PR #114 foi descartado nesse dia | Não |
| Bot de sinais | Só o preço de referência (VWAP 10k/100k/1M, all-in com fees, composite). Sem skew, vol nem lead-lag | Não |
| Bot de ordens (passivo, em lote, só o diff) | Não existe. As únicas ordens do repo são agressivas e em Python | Não |
| Bot de hedge | Não existe | Não |
| Redis Streams | Não existe. Só aparece no AD-10 (`recorder` adiado) | Adiado |
| Post-trade | Só grava market data no Mongo. Sem fills, sem reconciliação, sem backfill | `trade_ticks` (Binance) |
| Supervisor de risco | Só a saúde dos dados (staleness 3s, `/healthz`, latência p95, watchdog). Sem heartbeats, limites, kill switch nem pause/cancel. Os alarmes estão bloqueados pela SCP (T40) | Não |

- Tensões levantadas: o roadmap seguia o programa CEX→on-chain (majors), que não constrói o diagrama; o ZMQ foi descartado embora o PDF o use; o indexd é monolítico, mas o PDF pede um processo por função com canal de comando; as ordens existentes estão em Python, não em Go; faltam as venues BRL e as de hedge.
- Proposta de fases F0–F6, aprovada com ajustes. Ela está no [[ADR-0005 - Arquitetura-alvo do Market Making BRL]] (seção "Plano em fases").
- A sessão escreveu o plano no `.specs/project/ROADMAP.md` e no `STATE.md` do repo, sem commit. Em 11/11, o `.specs/` foi congelado (DEC-2026-11-11-09), por isso o plano foi copiado para o ADR-0005.
- A memória do Claude no repo foi atualizada: `zmq-bus-discarded` (antes dizia "não ressuscitar o bus") e `mm-brl-target-architecture` (nova).

## Decisões
- DEC-2026-11-10-15 a 21 → [[ADR-0005 - Arquitetura-alvo do Market Making BRL]]: o PDF é a arquitetura-alvo; o caminho MM BRL é a prioridade; um processo por função, com canal de comando; Go definitivo; indexd é PoC; o ZMQ volta, construído do zero; a próxima venue é a Foxbit.
- DEC-2026-11-10-32 a 37: bot de ordens ao vivo só com B3/CME prontas; instrumentos Foxbit (USD stables e BRL, fiat e stables); multi-região como requisito aberto da pesquisa do ZMQ; CEX→on-chain é PoC isolada; indexd segue no ar servindo o `/mm/feed`; cliente Foxbit em Python só como fonte.
- Colisão de IDs: outra sessão gravou os IDs 22 a 31 ao mesmo tempo. Esta sessão renumerou só as próprias linhas para 32–37.

## Aprendizados
- Duas sessões gravando no Registro ao mesmo tempo podem colidir nos IDs. Conferir o último ID imediatamente antes de gravar.
- Uma sessão aberta no repo registra as decisões no vault (via `additionalDirectories`), mas não cobra a nota de sessão: o hook `Stop` só existe no DevAgent. Foi assim que esta nota ficou faltando.
- Plano escrito em arquivo local não versionado (`.specs/`) se perde. Isso motivou, em parte, o [[ADR-0007 - Spec versionada e estado no GitHub]].

## Próximos passos
- [ ] MM BRL: criar milestones F0–F6 e o épico da F0, com a primeira spec em `specs/` (item do [[Roadmap]], seguindo o ADR-0007)
- [ ] Na F0, abrir um worktree novo a partir do `main` atualizado (não usar a branch `docs/indexd-onboarding`)
- [ ] Versionar o PDF `docs/Market Making e Formação de Mercado.pdf` (hoje untracked no repo), ou decidir onde ele fica
- [ ] Atualizar `apps/mm/CLAUDE.md:90` e `docs/02-arquitetura-e-risco.md`, que ainda descrevem o ZMQ antigo

## Arquivos criados/alterados
- Vault: [[Registro de decisões]] (DEC-2026-11-10-15..21, 32..37), [[ADR-0005 - Arquitetura-alvo do Market Making BRL]]
- Repo (local, não versionado): `.specs/project/ROADMAP.md`, `.specs/project/STATE.md`
- Memória do Claude (projeto `xend-onchain`): `mm-brl-target-architecture.md`, `zmq-bus-discarded.md`
