---
tipo: stack
status: em-construção
tags: [devagent, stack, javascript]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Stacks]]", "[[TypeScript]]", "[[Tarefas transversais]]"]
---
# JavaScript

Recorte desta nota: runtime (Node/Bun), ESM, gerenciadores de pacote e lockfiles, monorepo (workspaces, Turborepo) e scripts. Linguagem, `tsconfig`, typecheck, testes Vitest/Playwright e lint ficam em [[TypeScript]]; o que é específico de Next.js fica em [[Next.js]].

## Contexto
- Comandos: instalar `npm ci` · `pnpm install --frozen-lockfile` · `bun install` (um dos três, conforme o lockfile do repo) · build/teste/lint pelo script do `package.json` · teste de JS puro `node --test` (ou `bun test` no repo Bun). Em monorepo, a raiz delega: `turbo run build|test|typecheck|lint`.
- Gerenciador: use o que o repo declara (`packageManager` ou lockfile: `package-lock.json` = npm, `pnpm-lock.yaml` = pnpm, `bun.lock` = Bun). Não misture nem gere lockfile de outro gerenciador. Um repo proíbe explicitamente `npm` e `yarn`.
- Monorepo: workspaces nativos (`apps/*`, `packages/*`) com Turborepo na raiz. Filtre por pacote (`pnpm --filter <pkg>`, `npm run <script> --workspace <pkg>`, `turbo run <task> --filter=<pkg>`) em vez de rodar tudo.
- Repos sem `package.json` na raiz (um por subprojeto): rode instalação e scripts dentro de cada subpasta, nunca na raiz.
- Pacotes Node são ESM (`"type": "module"`): `import`, scripts `.mjs`, sem `require`.
- Para rodar TypeScript em scripts e servidores de dev use `tsx` (`tsx watch src/index.ts`, `tsx src/x.ts`); `tsc` fica para build e typecheck.
- Versão de Node: confira `engines` e o workflow de CI antes de usar flags recentes (`--env-file`, `--env-file-if-exists`, `--experimental-strip-types`, `node --test`). A maioria dos repos não declara `engines`.
- Variáveis de ambiente em scripts Node: `node --env-file=.env <script>` (nativo) ou `dotenv`, conforme o repo. Cada app tem o seu `.env`; não leia nem versione `.env*`.
- Antes de afirmar que o ambiente está pronto, rode o que a CI roda (`npm ci`/`--frozen-lockfile`, typecheck, testes, build). Instalação limpa exige o lockfile existente.

## Skills
| skill | origem | serve para | estado | testado em |
|---|---|---|---|---|
| `turborepo` | skill instalada (também em `.agents/skills/` do xend-platform) | `turbo.json`, pipelines, cache, `--filter`/`--affected` | candidata | — |

## Documentação
- [MDN — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js — API](https://nodejs.org/docs/latest/api/)
- [Node.js — test runner (`node --test`)](https://nodejs.org/docs/latest/api/test.html)
- [Node.js — CLI (`--env-file`)](https://nodejs.org/docs/latest/api/cli.html)
- [npm — `npm ci`](https://docs.npmjs.com/cli/commands/npm-ci) · [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
- [pnpm](https://pnpm.io/) · [pnpm workspaces](https://pnpm.io/workspaces)
- [Bun](https://bun.sh/docs)
- [Turborepo](https://turborepo.com/docs)
- [tsx](https://tsx.is/)
- [Astro](https://docs.astro.build/)

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|

## Achados
| data | achado | fonte |
|---|---|---|
| 2026-11-08 | Gerenciador por repo: npm (XEND-RFQ-PORTAL, dash-mm, hedglobal, openterminal, seleon, util, xendsend, xend-website), pnpm (terminal, xend-onchain, xend-baas-api), Bun (xend-platform) | XEND-RFQ-PORTAL/package-lock.json; terminal/package.json:4; xend-onchain/package.json:6; xend-baas-api/package.json:7; xend-platform/package.json:87 |
| 2026-11-08 | `packageManager` declarado só em terminal, onchain, baas-api (pnpm@9.15.9), hedglobal (npm 11.13.0) e xend-platform (bun@1.3.5); ausente nos demais | terminal/package.json:4; hedglobal-plataform/package.json:5; xend-platform/package.json:87; openterminal/package.json:4-7 |
| 2026-11-08 | dash-mm tem `package-lock.json` e `pnpm-lock.yaml` na raiz, sem regra sobre qual usar | dash-mm/pnpm-lock.yaml:1 |
| 2026-11-08 | util tem lockfile na raiz, em `server/` e em `web/`; xendsend tem um por subprojeto e nenhum `package.json` na raiz | util/server/package-lock.json; xendsend/bot/package-lock.json; xendsend (dossiê, Lacunas) |
| 2026-11-08 | Node divergente dentro do mesmo repo: hedglobal 24 (README e CI) vs imagem Docker `node:26-alpine`; terminal pede 22+ e a CI usa 22, mas o ambiente local registrado é Node 24 | hedglobal-plataform/README.md:80; hedglobal-plataform/.github/workflows/ci.yml:65; hedglobal-plataform/apps/console/Dockerfile:16; terminal/.github/workflows/ci.yml:23; terminal/PROJECT.md:479 |
| 2026-11-08 | `engines` declarado só em seleon (>=22), xend-website (>=22.12), xend-onchain (>=20) e baas-console/pix-poc (>=18); ausente em dash-mm, openterminal, terminal, xend-platform, xendsend, util | seleon-anchor/package.json:10-12; xend-website/package.json:6; xend-onchain/package.json:7-9; xend-baas-api/baas-console/package.json |
| 2026-11-08 | XEND-RFQ-PORTAL roda testes TS direto no Node (`--experimental-strip-types`); a CI registra o motivo em comentário e usa Node 22 | XEND-RFQ-PORTAL/package.json:11; XEND-RFQ-PORTAL/.github/workflows/ci.yml:24-25 |
| 2026-11-08 | Regra do xend-platform: "Nunca usar `npm` ou `yarn`; Bun é o gerenciador" e versões só no `catalog` do `package.json` raiz (`catalog:`). Boa candidata a regra para repos com gerenciador fixo | xend-platform/AGENTS.md:49,142-144 |
| 2026-11-08 | Catalog desatualizado: `@trigger.dev/sdk ^3.3.12` no catalog vs 4.4.1 no app | xend-platform/package.json:45; xend-platform/apps/web/package.json:27 |
| 2026-11-08 | `ui:bump` chama `ui:shadcn:update` e `ui:shadcn:radix`, que não existem em `packages/ui` (há `ui:update` e `ui:radix`) | xend-platform/package.json:18; xend-platform/packages/ui/package.json:10-11 |
| 2026-11-08 | Hook husky roda `bun test` e `ultracite fix` antes de todo commit, mas o README ensina alias WIP com `--no-verify --no-gpg-sign` (contradiz a regra do portfólio de nunca usar `--no-verify`) | xend-platform/.husky/pre-commit:1,16; xend-platform/README.md:74-77 |
| 2026-11-08 | Windows: o shim `.cmd` do pnpm quebra no Git Bash, rodar o tooling pelo PowerShell | xend-onchain/README.md:177 |
| 2026-11-08 | Windows: teste de rota com acento via Git Bash + `curl` corrompe UTF-8; usar `node -e` com `fetch` | terminal/PROJECT.md:485-486 |
| 2026-11-08 | Terminal (Electron): `.npmrc` com `node-linker=hoisted` para electron-rebuild/builder; server standalone só com `ELECTRON_RUN_AS_NODE=1` (ABI do better-sqlite3), nunca `node`/`tsx`; não rebuildar `node-pty` | terminal/.npmrc:1-2; terminal/PROJECT.md:527-532; terminal/scripts/test.mjs:15 |
| 2026-11-08 | CI do hedglobal: `npm audit --omit=dev --audit-level=high`, gitleaks e actions fixadas por SHA; openterminal lista advisories de dependência sem correção (`fast-xml-parser`, `postcss` dentro do Next) | hedglobal-plataform/.github/workflows/ci.yml:74,130-134; hedglobal-plataform/README.md:132; openterminal/README.md:218 |
| 2026-11-08 | hedglobal: scripts Node com `--env-file-if-exists` e `--env-file` (migrate, seed, dev server local); `migrate --down` exige `--confirmo` | hedglobal-plataform/package.json:17-21,25-26; hedglobal-plataform/scripts/migrate.mjs:18 |
| 2026-11-08 | xend-website: `AGENTS.md` manda `astro dev --background` e `astro dev stop\|status\|logs`, mas o script `dev` é `astro dev` | xend-website/AGENTS.md:6,9; xend-website/package.json:9 |
| 2026-11-08 | xendsend/setup-roles tem `ts-node` em devDependencies, mas os scripts usam só `tsx` | xendsend/setup-roles/package.json:23-24,8-12 |
| 2026-11-08 | `package.json` da raiz do util tem só `supabase` e `viem`, sem uso nos comandos documentados | util/package.json:3-4 |
| 2026-11-08 | JS fora do workspace no xend-baas-api: `baas-console` (Express, `node --test tests/*.test.js`) e `pix-poc` (sem dependências); o workspace é só `apps/*` | xend-baas-api/pnpm-workspace.yaml:7-8; xend-baas-api/baas-console/package.json:10-11; xend-baas-api/pix-poc/package.json:1-9 |
| 2026-11-08 | Versões divergentes de Clerk entre workspaces do baas-api (`@clerk/nextjs ^6`, `@clerk/backend ^3`) | xend-baas-api/apps/portal/package.json:16; xend-baas-api/baas-console/package.json:14 |
