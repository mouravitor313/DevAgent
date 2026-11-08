---
tipo: stack
status: em-construção
tags: [devagent, stack, typescript]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Stacks]]", "[[JavaScript]]", "[[Next.js]]", "[[Tarefas transversais]]"]
---
# TypeScript

Recorte desta nota: linguagem, `tsconfig`, typecheck, testes, lint e formatação. Runtime, gerenciadores de pacote e monorepo ficam em [[JavaScript]]; o que é específico de Next.js fica em [[Next.js]]. Regras comuns (Conventional Commits, nunca `eslint-disable`/`@ts-ignore`, prod somente leitura) ficam no `AGENTS.md` do portfólio.

## Contexto
- Comandos (use o script do `package.json` do repo, não o comando solto): build `tsc -p tsconfig.json` (libs e serviços Node) ou `next build` (apps Next) · typecheck `tsc --noEmit` (script `typecheck`; em alguns repos o nome é `check`) · teste `vitest run` · lint `eslint` (ou `bun x ultracite check` em repo com Biome) · formatação: não há padrão na maioria dos repos (ver Achados).
- `strict: true` em todo `tsconfig`. Não desligue flags nem afrouxe tipos para fazer o typecheck passar; corrija o tipo.
- Onde o `tsconfig` liga `noUncheckedIndexedAccess`, trate o `undefined` de acesso por índice em vez de usar `!`.
- Pacotes Node puros (sem framework) usam `module`/`moduleResolution` `NodeNext`; mantenha ao criar pacote novo no mesmo repo.
- Apps web usam alias `paths` `@/*` no `tsconfig`; siga o alias já existente.
- Dinheiro, preço e quantidade on-chain: `decimal.js` e `BigInt`, nunca `number`/float. Em JSON, valor monetário trafega como string.
- Rode o typecheck antes de dar uma tarefa por concluída. A CI dos repos TS roda typecheck e testes (e lint/build quando existem); reproduza a mesma sequência localmente antes do PR.
- Testes unitários: Vitest (`vitest run`; `vitest` para watch; `vitest run --coverage`). E2E: Playwright (`playwright test`). Um repo usa o runner do Bun (`bun test`); para JS puro e `node --test`, ver [[JavaScript]].
- Lint: ESLint 9 com flat config (`eslint.config.mjs`), com `eslint-config-next` nos apps Next. Se o repo tem `biome.jsonc`, ele usa Biome/Ultracite no lugar de ESLint e Prettier: não adicione o outro.
- Armadilha: alguns repos têm script `lint` sem configuração ou sem workspace que o implemente. Confirme que o lint existe e roda de verdade antes de afirmar que passou.

## Skills
| skill | origem | serve para | estado | testado em |
|---|---|---|---|---|
| `aws-sdk-js-v3-usage` | plugin AWS (instalado) | código com `@aws-sdk/*` | candidata | — |
| `type-fest` | skill instalada (também em `.agents/skills/` do xend-platform) | tipos utilitários TS | candidata | — |
| `trigger-setup` · `trigger-config` · `trigger-tasks` · `trigger-agents` · `trigger-realtime` | skills instaladas (também em `.agents/skills/` do xend-platform) | tasks em Trigger.dev (SDK TS) | candidata | — |

## Documentação
- [TypeScript — documentação](https://www.typescriptlang.org/docs/)
- [TSConfig reference](https://www.typescriptlang.org/tsconfig/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/docs/intro)
- [ESLint](https://eslint.org/docs/latest/) · [typescript-eslint](https://typescript-eslint.io/)
- [Biome](https://biomejs.dev/)
- [Zod](https://zod.dev/)
- [viem](https://viem.sh/)
- [decimal.js](https://mikemcl.github.io/decimal.js/)
- [type-fest](https://github.com/sindresorhus/type-fest)

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|
| MCP `context7` | dash-mm (`opencode.json`, via `@upstash/context7-mcp`); allowlist do XEND-RFQ-PORTAL | docs atualizadas de bibliotecas | candidata | — | OpenCode: bloco `mcp` do `opencode.json`; Claude Code: `.mcp.json` |
| MCP `trigger` | xend-platform (`.mcp.json` e `opencode.json`, `trigger.dev@latest mcp --dev-only`) | operar tasks Trigger.dev | candidata | — | já configurado nos dois agentes naquele repo |
| `intelligence-mcp` | xend-onchain (`apps/intelligence-mcp`) | servidor MCP somente leitura sobre o banco do indexer | candidata | — | app TS próprio (`@modelcontextprotocol/sdk`, Express); não é para instalar em outros repos |

## Achados
| data | achado | fonte |
|---|---|---|
| 2026-11-08 | TypeScript 7.0.2 em dois repos e ^5 nos demais; no hedglobal o `packages/ui` usa ^5.6.0 e o console 7.0.2 | hedglobal-plataform/apps/console/package.json:33; hedglobal-plataform/packages/ui/package.json:38; terminal/package.json:18; XEND-RFQ-PORTAL/package.json:41 |
| 2026-11-08 | Vitest em versões muito diferentes: 3.2.7, 4.1.8, 4.1.11 e 5.0.4 | hedglobal-plataform/apps/console/package.json:34; dash-mm/package.json:48; seleon-anchor/package.json:21; terminal/package.json:19 |
| 2026-11-08 | Só o xend-platform usa Biome/Ultracite e proíbe ESLint/Prettier; os demais repos Next usam ESLint 9 | xend-platform/AGENTS.md:48; xend-platform/biome.jsonc:79-83; XEND-RFQ-PORTAL/eslint.config.mjs:1-3 |
| 2026-11-08 | Biome 2.4.0 no `devDependencies` e 2.2.0 no `catalog` | xend-platform/package.json:32,48 |
| 2026-11-08 | Sem formatador (Prettier/Biome/Ultracite) em hedglobal, openterminal, seleon-anchor, terminal, util, xendsend, xend-website e XEND-RFQ-PORTAL; só o portal do baas-api tem Prettier e o xend-platform tem Ultracite | hedglobal-plataform (dossiê, Ferramentas); XEND-RFQ-PORTAL (dossiê, Lacunas); xend-baas-api/apps/portal/package.json (prettier ^3.6.2); xend-platform/package.json:8 |
| 2026-11-08 | Script `lint` sem implementação: a raiz roda `turbo run lint` mas nenhum workspace define `lint`; no openterminal `next lint` existe sem config ESLint encontrada | hedglobal-plataform/package.json:15; openterminal/package.json:13; openterminal/web/package.json:9 |
| 2026-11-08 | Sem script `test` em util e xendsend (sem teste automatizado); xend-website não tem lint, teste nem typecheck | util/server/package.json:6-25; xendsend/bot/package.json:8-11; xend-website/package.json:9-12 |
| 2026-11-08 | Typecheck com nome `check` no xendsend (`bot` e `sdk`) e `typecheck` nos demais | xendsend/bot/package.json:11; xendsend/sdk/package.json:9; terminal/package.json:9 |
| 2026-11-08 | dash-mm L-001: o glob padrão do Vitest varria testes de plugins em `.claude/` (73 arquivos falhando); mitigado em `vitest.config.ts`, mas o STATE.md ainda lista o item como pendente | dash-mm/.specs/project/STATE.md:372-376,386; dash-mm/vitest.config.ts:10 |
| 2026-11-08 | dash-mm L-002: Vitest 4.x suprime a cobertura quando algum teste falha | dash-mm/.specs/project/STATE.md:378-382 |
| 2026-11-08 | Testes SQL do hedglobal rodam um arquivo por vez (estado global do Postgres); "teste pulado é falha" (sem `DATABASE_URL` os testes se pulam) | hedglobal-plataform/apps/console/vitest.config.ts:9,16; hedglobal-plataform/README.md:115; hedglobal-plataform/.github/workflows/ci.yml:90-95 |
| 2026-11-08 | `playwright.config.ts` aponta `testDir: "./e2e"` mas `apps/web/e2e/` não existe; `AGENTS.md` cita `test:e2e` | xend-platform/apps/web/playwright.config.ts:4; xend-platform/AGENTS.md:29 |
| 2026-11-08 | Alias de `tsconfig` mapeia `@repo/jobs` para pasta inexistente | xend-platform/apps/web/tsconfig.json:7 |
| 2026-11-08 | Boa candidata a regra: `tsconfig.base` com `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns` e `verbatimModuleSyntax` além de `strict` | seleon-anchor/tsconfig.base.json:9-15 |
| 2026-11-08 | Boa candidata a regra para libs que rodam no browser: `types: []` (sem `@types/node`) e teste que lê o fonte e falha se reaparecerem `Buffer`/`process`/`require` | seleon-anchor/packages/canonical/tsconfig.json:6-7; seleon-anchor/packages/canonical/README.md:124-128 |
| 2026-11-08 | Typecheck do app exclui `supabase/functions` (Deno) e o ESLint também as ignora ("lint separado") | XEND-RFQ-PORTAL/tsconfig.json:34; XEND-RFQ-PORTAL/eslint.config.mjs:16-22 |
| 2026-11-08 | Candidatas a regra (declaradas só no xend-platform): Zod em todas as fronteiras, `import type`, exports nomeados sem barrel files. O próprio `biome.jsonc` desliga `noBarrelFile` | xend-platform/AGENTS.md:50,76-77,89; xend-platform/biome.jsonc:36 |
| 2026-11-08 | Zod 4 na maioria dos repos, mas 3.x em `design-ingest` e no server do openterminal | xend-onchain/packages/design-ingest/package.json:31; openterminal/server/package.json:18; xend-onchain/apps/dashboard/package.json:47 |
| 2026-11-08 | Regras do ESLint rebaixadas para `warn` ("Deferred… Revisit as a dedicated cleanup"), em tensão com a proibição de supressão do portfólio | xend-onchain/apps/dashboard/eslint.config.mjs:8-16 |
