---
tipo: referência
status: em-construção
tags: [devagent, referência, skills, stacks, avaliação]
criado: 2026-11-10
atualizado: 2026-11-10
fonte: C:\Users\Pedro\.agents\skills-avaliacao\_catalogo.json
formato: repo
relacionados: ["[[Stacks]]", "[[Tarefas transversais]]", "[[ADR-0003 - Organização da instalação Claude na máquina]]", "[[Roadmap]]"]
---
# Avaliação do catálogo skills-avaliacao

## Resumo
Triagem das **117 skills únicas** (138 variantes) guardadas em `~\.agents\skills-avaliacao\` pela ADR-0003 D3 (DEC-2026-11-08-03). A pergunta era quais entram no Dev Agent, que é agnóstico de stack e cobre as tarefas de [[Tarefas transversais]] nas stacks de [[Stacks]].

**Resultado:** 20 candidatas de dev vão para as notas de stack, com estado `candidata`. Outras 10 de Python/dados já estavam listadas em [[Python]]. As 87 restantes não entram: são duplicatas (41), específicas de projeto (11), fora do escopo (28), quebradas (4), descartadas (2) ou servem só de referência (1). **Nenhuma skill do catálogo cobre Git/GitHub.**

Método: li a descrição de todas as 117 no `_catalogo.json` e o cabeçalho do `SKILL.md` das candidatas de dev. Cruzei com o que já está instalado: `~\.claude\skills\synced\` (as `anthropic-skills:*`), o plugin Vercel 0.44.0, `~\.claude\skills\` e `~\.claude\plugins\installed_plugins.json`. Nada foi testado. O passo seguinte é testar as candidatas da prioridade 1.

## Por que guardei
O catálogo é a única cópia global dessas skills fora dos repos. Os repos continuam com as cópias deles em `.agents\skills\` e `.claude\skills\`: o `hedglobal-plataform` e os worktrees do `xend-baas-api` têm quase todas, e o `arb` tem as de Python/dados. Esta nota diz o que cada uma vira no Dev Agent, para o catálogo poder ser enxugado depois.

## Revisão de 10/11 (decisões do Vítor)
- `tlc-spec-driven` descartada (DEC-2026-11-10-08).
- Vercel: seguem só as skills; o plugin Vercel (`vercel:*`) foi desconsiderado (DEC-2026-11-10-09). Por isso `ai-sdk` sai das duplicatas e volta como candidata, e o A/B foi cancelado.
- Testar `supabase-postgres-best-practices` e `agent-browser` (DEC-2026-11-10-10).
- Contagem após a revisão: 20 candidatas (−`tlc-spec-driven`, +`ai-sdk`) e 40 duplicatas; a tabela abaixo é a da triagem original.

## Contagem por veredito
| veredito | qtd | destino |
|---|---|---|
| Candidata ao Dev Agent | 20 | notas de stack e [[Tarefas transversais]] |
| Python/dados (já em [[Python]]) | 10 | sem mudança; `usfiscaldata` só no `arb` |
| Duplicata de skill já instalada | 41 | usar a instalada |
| Específica de projeto | 11 | fica no repo de origem |
| Fora do escopo (design/UI/visual) | 28 | não entra; reavaliar se surgir um agente de design |
| Quebrada / sem conteúdo | 4 | apagar do catálogo (pedir aprovação) |
| Descartada | 2 | não entra |
| Só referência | 1 | não instalar |
| **Total** | **117** | |

## 1 · Candidatas ao Dev Agent (20)
Prioridade: **P1** = testar primeiro · **P2** = condicional ao repo usar a tecnologia · **P3** = provável descarte, só testar se P1/P2 deixarem lacuna.

| skill | stack / tarefa | origem (autor) | P | observação |
|---|---|---|---|---|
| `tlc-spec-driven` | transversal: specs | Felipe Rodrigues, v2.0.0, CC-BY-4.0 | ~~P1~~ **descartada** (DEC-2026-11-10-08) | dimensiona a profundidade pelo tamanho da tarefa (Small/Medium/Large/Complex) e faz commits atômicos. Concorre com `product-management:write-spec`. Já usada como referência na coleta de contexto |
| `supabase-postgres-best-practices` | [[SQL]] | Supabase | P1 | já listada; 36 arquivos de regras, `SKILL.md` curto (64 linhas): bom para modelo barato |
| `agent-browser` | [[Next.js]]: testes de UI/e2e | Vercel Labs | P1 | já listada. A variante `@xend-arb` não tem `templates/`: usar a principal |
| `vercel-react-best-practices` | [[Next.js]]: review | Vercel, v1.0.0 | P1 | já listada. O A/B com `vercel:react-best-practices` foi cancelado: o plugin Vercel foi desconsiderado (DEC-2026-11-10-09) |
| `next-best-practices` | [[Next.js]] | Vercel Labs | P2 | já listada; plugin Vercel desconsiderado, então não há concorrente |
| `vercel-composition-patterns` | [[Next.js]]: refactor | Vercel, v1.0.0 | P2 | refactor de componentes com proliferação de props booleanas |
| `turborepo` | [[JavaScript]] | Vercel | P2 | já listada; 914 linhas + 26 arquivos: pesada para modelo barato |
| `type-fest` | [[TypeScript]] | — | P2 | já listada; nicho |
| `trigger-setup` · `trigger-config` · `trigger-tasks` · `trigger-agents` · `trigger-realtime` | [[TypeScript]] | Trigger.dev | P2 | já listadas; só para repos com Trigger.dev |
| `supabase` | [[SQL]] / TS | Supabase, v0.1.2 | P2 | é o `supabase/agent-skills` que a nota [[SQL]] mandava instalar via `npx`: a cópia já está no catálogo |
| `resend` · `react-email` · `email-best-practices` | [[TypeScript]] | Resend (v2.3.0 / v1.1.0) | P2 | só para repos que enviam e-mail (origens: hedglobal, onchain, RFQ, dash) |
| `nextjs-app-router-patterns` | [[Next.js]] | — | P3 | genérica (Next 14+, 543 linhas); sobrepõe `next-best-practices` |
| `before-and-after` | [[Next.js]] / PR | Vercel | P3 | screenshots antes/depois para PR; depende de `npx @vercel/before-and-after` e de upload |
| `avoid-feature-creep` | transversal: specs/escopo | — | P3 | é de produto, não de código; pode virar uma linha no Contexto em vez de skill |

## 2 · Python/dados — já em [[Python]] (10)
`aeon`, `dask`, `polars`, `pymc`, `scikit-learn`, `shap`, `statsmodels`, `statistical-analysis`, `timesfm-forecasting` (em `arb\.agents\skills\`) e `usfiscaldata` (dados do Tesouro dos EUA, só serve ao `arb`). Seguem a DEC-2026-11-08-06: ficam no escopo do `arb`. A nota [[Python]] já as lista como candidatas; nada muda.

## 3 · Duplicatas (41)
- **39 idênticas pelo nome às `anthropic-skills:*`** já sincronizadas em `~\.claude\skills\synced\`: `ab-test-analysis`, `analysis-assumptions-log`, `analysis-documentation`, `analysis-planning`, `analysis-qa-checklist`, `analysis-retrospective`, `analytics-tracking`, `brain`, `business-metrics-calculator`, `cohort-analysis`, `context-packager`, `copy-editing`, `copywriting`, `customer-research`, `dashboard-specification`, `data-catalog-entry`, `data-narrative-builder`, `data-quality-audit`, `executive-summary-generator`, `funnel-analysis`, `impact-quantification`, `insight-synthesis`, `methodology-explainer`, `metric-reconciliation`, `peer-review-template`, `programmatic-eda`, `prospect-research-integration`, `query-validation`, `root-cause-investigation`, `schema-mapper`, `segmentation-analysis`, `semantic-model-builder`, `sql-to-business-logic`, `stakeholder-requirements-gathering`, `technical-to-business-translator`, `time-management`, `time-series-analysis`, `visualization-builder`, `written-communication`. Comparei só os nomes, não o conteúdo. São de análise de dados e vendas; para o Dev Agent, só `query-validation` e `schema-mapper` interessam ([[SQL]]), e já estão disponíveis.
- `research-en`: é o pacote `research`, `research-add-fields`, `research-add-items`, `research-deep` e `research-report`, já instalado em `~\.claude\skills\`.
- ~~`ai-sdk`: coberta por `vercel:ai-sdk` do plugin, que é mais completa (387 × 77 linhas).~~ **Revisto em 10/11:** com o plugin Vercel desconsiderado (DEC-2026-11-10-09), `ai-sdk` volta a ser candidata P2 em [[TypeScript]].

## 4 · Específicas de projeto (11) — ficam no repo
| skill | repo | motivo |
|---|---|---|
| `ops` · `quote` | xend (mesa OTC) | agente de operações e cotação OTC |
| `otc-dashboard-dev` · `otc-middle-office` · `otc-qa-tester` · `otc-sheets-engineer` | `dashboard_xend` | regras de negócio do OTC; `otc-dashboard` e `otc-sheets` também existem como `anthropic-skills:*` |
| `fyhub-api` | `xend-onchain` | referência da integração PIX FyHub |
| `clerk-auth` | `hedglobal-plataform` | Clerk em `apps/console` |
| `planner` · `architect` · `build-error-resolver` | monorepo com "Constitution" (Trigger.dev, Zod, Supabase, bun/ultracite) | amarradas a `.specify/memory/constitution.md` e aos comandos `bunx`/`ultracite`. Servem de **modelo** de skill por papel (planejar, desenhar, destravar build) se o Dev Agent quiser versões agnósticas |

## 5 · Fora do escopo — design/UI/visual (28)
`aesthetic-application`, `aesthetic-literacy`, `app-store-screenshots`, `banner-design`, `brand`, `brandkit`, `design`, `design-ingest`, `design-taste-frontend`, `design-taste-frontend-v1`, `design-tokenize`, `emil-design-eng`, `gpt-taste`, `high-end-visual-design`, `image-to-code`, `imagegen-frontend-mobile`, `imagegen-frontend-web`, `impeccable`, `industrial-brutalist-ui`, `minimalist-ui`, `redesign-existing-projects`, `slides`, `stitch-design-taste`, `svg-logo-designer`, `ui-design-review`, `ui-styling`, `ui-ux-pro-max`, `web-design-builder`.
A maioria veio do `xend-platform` (família "taste") ou do claudekit (`design`, `ui-styling`, `brand`). `ui-styling` (shadcn + Tailwind) sobrepõe `vercel:shadcn`. Se o Dev Agent precisar de revisão de UI, a candidata seria `ui-design-review` (acessibilidade), mas isso exige uma decisão de escopo.

## 6 · Quebradas (4) e descartadas (2)
- **Quebradas:** `learned`, `upstash-ratelimit-js` e `upstash-redis-js` são pastas vazias. `rest-api-security.skills` tem um `.md` de 710 bytes, sem frontmatter, com um checklist genérico ("use HTTPS", "valide entradas"). Ela não dispara como skill. Para segurança, `security-review` já está instalada.
- **Descartadas:** `everything-claude-code` (kit ECC, removido pela DEC-2026-11-08-03). `full-output-enforcement` proíbe saída resumida e manda escrever tudo, o que vai contra o orçamento de tokens e o foco em modelos baratos (DEC-2026-11-08-26).

## 7 · Só referência (1)
`codebase-to-course-main`: transforma um repo em curso HTML. Não entra no agente. O padrão de "brief com trechos citados por caminho/linha" já foi aproveitado em [[Skills de coleta de contexto e Haiku como executor]].

## Lacunas
- **Git/GitHub:** nenhuma skill no catálogo. Pistas: o plugin `github-dev` (marketplace `claude-settings`, ainda no cache em `~\.claude\plugins\cache\claude-settings\github-dev\2.4.0\`), desinstalado na limpeza de 10/11; e os `source-command-*` do `hedglobal-plataform\.agents\skills\` (fora do catálogo, não lidos).
- **Go:** nada no catálogo. O plugin `golang-skills` 1.8.0 (20 skills `go-*`) **está instalado** no escopo de projeto do `xend-onchain` (`installed_plugins.json`), o que confirma o que a nota [[Go]] dava como não verificado.
- **Testes:** nada genérico no catálogo. `otc-qa-tester` é pytest do OTC. Seguem as candidatas da nota de transversais e o plugin `fullstack-dev-skills` (`test-master`, `playwright-expert`, `code-reviewer`), instalado no escopo do `xend-onchain` e ainda não avaliado.

## Próximos passos
- [x] Testar `supabase-postgres-best-practices` e `agent-browser` (DEC-2026-11-10-10), no Claude Code → [[Teste de skills - supabase-postgres e agent-browser 2026-11-10]]. Falta o OpenCode. `tlc-spec-driven` foi descartada (DEC-2026-11-10-08); o A/B Vercel foi cancelado (DEC-2026-11-10-09).
- [ ] Avaliar o plugin `fullstack-dev-skills` (66 skills, escopo `xend-onchain`), que ficou fora deste catálogo.
- [ ] Achar uma skill de Git/GitHub (começar pelo `github-dev` em cache).
- [x] Enxugar o catálogo (DEC-2026-11-10-12): apagadas em 10/11 as 4 quebradas e as 40 duplicatas (`ai-sdk` ficou), 45 pastas no total. `_catalogo.json` passou de 138 para 93 entradas, ou 73 skills. Backup do JSON antigo só no scratchpad da sessão.
- [ ] Excluir a `tlc-spec-driven` do catálogo (DEC-2026-11-10-14).
- Os testes extras (escrita de migration, OpenCode) e os achados do RFQ ficam fora do objetivo (DEC-2026-11-10-13).
