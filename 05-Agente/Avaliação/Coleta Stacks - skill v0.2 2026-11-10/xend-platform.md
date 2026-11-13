# Dossiê — xend-platform

Lidos: 10 arquivos (~576 linhas via Read; ~85 linhas de saída de Grep de busca) · Checagens de existência: 13 (Glob) · Teto atingido: não (AGENTS.md lido por partes, ver Lacunas)
Arquivos lidos: AGENTS.md (1-40, 42-101, 110-166, 268-289), CLAUDE.md (1-65), package.json, turbo.json, .github/workflows/release-trigger-prod.yml, supabase/config.toml (1-40), apps/web/package.json, apps/email/package.json, apps/web/tsconfig.json, apps/email/tsconfig.json

## Stacks presentes
- **TypeScript 5 + Bun**: runtime/gerenciador `bun@1.3.5` (`package.json:87`); TypeScript `^5.9.3` via catalog (`package.json:82`); AGENTS diz "Bun as package manager. Never use npm or yarn" (`AGENTS.md:49`); CLAUDE diz "Bun workspaces" (`CLAUDE.md:7`).
- **Turborepo (monorepo)**: workspaces `apps/*`, `packages/*`, `tooling/*` (`package.json:89-93`); `turbo ^2.8.10` (`package.json:38`); tasks em `turbo.json:4-41`.
- **Next.js 16 / React 19**: `next` via catalog `^16` (`package.json:66`; `apps/web/package.json:38` `"next": "catalog:"`); `react ^19` (`package.json:69`); porta de dev 5500 (`apps/web/package.json:6`).
- **Supabase (PostgreSQL)**: `supabase/config.toml:4` (`project_id = "xend"`), `:33` (`major_version = 17`); migrations em `supabase/migrations/` (15 .sql, listagem, não lidas); CLAUDE cita buckets `documents`/`images` (`CLAUDE.md:8`, não verificado).
- **Trigger.dev (jobs)**: CLAUDE diz "Trigger.dev SDK v4" (`CLAUDE.md:9`); catalog `@trigger.dev/sdk ^3.3.12` (`package.json:45`); `apps/web` pina `4.4.1` (`apps/web/package.json:27`). Divergência, ver abaixo.
- **Vercel AI SDK v6 + OpenAI**: catalog `ai ^6` (`package.json:56`), `@ai-sdk/openai ^1` (`package.json:46`); OCR via GPT-4o Vision (`CLAUDE.md:10`, `:61`).
- **Email**: Resend + React Email: `apps/email/package.json:14-18` (`@react-email/components 1.0.1`, `react-email 5.0.5`); `packages/mailer` (`AGENTS.md:121`).
- **UI**: shadcn/ui + Radix + Tailwind 4: `AGENTS.md:118`; `tailwindcss ^4.1.17` via catalog (`package.json:79`).
- **Validação**: Zod `^4.1.12` via catalog (`package.json:85`); regra "Zod at every system boundary" (`AGENTS.md:50`; `CLAUDE.md:13`).
- **Lint/format**: Biome (`@biomejs/biome 2.4.0`, `package.json:32`) + Ultracite `7.2.3` (`package.json:40`); config `biome.jsonc` na raiz (listagem).
- **Testes**: `bun test` (`package.json:13`); Playwright E2E `@playwright/test ^1.50.0` (`apps/web/package.json:58`), script `test:e2e` (`apps/web/package.json:10`), `apps/web/playwright.config.ts` (listagem).
- **KYC/BigDataCorp**: SDK `@greensgroup/bigdatacorp-sdk ^0.1.1` (`apps/web/package.json:16`); `packages/kyc` (`AGENTS.md:119`).
- **Node (tipos)**: `@types/node` via catalog `^24.10.1` (`package.json:52`).
- **Python / outras linguagens**: nenhuma evidência nos arquivos lidos.

## Comandos
- dev (raiz): `bun run dev` (`AGENTS.md:12`) → `turbo run dev` (`package.json:6`)
- build (raiz): `bun run build` (`AGENTS.md:13`) → `turbo run build` (`package.json:5`)
- lint: `bun run lint` (`AGENTS.md:16`) → `bun x ultracite check` (`package.json:7`)
- format: `bun run format` (`AGENTS.md:17`) → `bun x ultracite fix` (`package.json:8`); `format:unsafe` (`AGENTS.md:18`; `package.json:15`)
- typecheck (raiz): `turbo run typecheck` (`package.json:9`)
- teste (raiz): `bun test` (`AGENTS.md:21`; `package.json:13`); `bun test packages/kyc` (`CLAUDE.md:45`)
- web dev: `next dev --port 5500` (`apps/web/package.json:6`); dev trigger `bun x --bun trigger.dev@latest dev` (`apps/web/package.json:7`)
- web build: `next build` (`apps/web/package.json:8`); e2e: `playwright test` (`apps/web/package.json:10`); typecheck: `tsc --noEmit --emitDeclarationOnly false` (`apps/web/package.json:12`)
- email: dev `email dev --port 3025 ...` (`apps/email/package.json:7`); export Supabase templates `bun run export-supabase-templates.ts` (`apps/email/package.json:9`); atalho raiz `mailer:export-templates` (`package.json:27`)
- banco (Supabase local): `db:start`, `db:stop`, `db:reset` (`AGENTS.md:35-37`; `package.json:20-24`); `db:typegen` (`package.json:25` → `supabase/scripts/generate-types.ts`); `db:seed` (`package.json:26` → `supabase/scripts/seed.ts`); migrations `supabase migration up` (`CLAUDE.md:43`)
- tipos do banco: `supabase gen types typescript` (`CLAUDE.md:44`)
- UI: `ui:bump`, `ui:add` (`package.json:18-19`)
- start (raiz): `turbo start` (`package.json:12`), `translate` (`package.json:16`), `boundaries` (`package.json:17`); ver divergência 7
- deploy (CI): `bunx trigger.dev@latest deploy packages/jobs` (`.github/workflows/release-trigger-prod.yml:23`), disparado em push para `main` (`release-trigger-prod.yml:4-6`)
- clean: `turbo run clean && git clean -xdf ...` (`package.json:10`)

## Regras/convenções declaradas
- Server Components por padrão; `"use client"` só com estado/efeitos/APIs de browser (`AGENTS.md:47`)
- Biome substitui ESLint e Prettier; não adicionar configs de eslint/prettier; config em `biome.jsonc` (`AGENTS.md:48`)
- Bun como gerenciador; nunca npm nem yarn (`AGENTS.md:49`)
- `server-only` em arquivos que nunca podem ir ao cliente (`AGENTS.md:51`); segredos nunca no código cliente (`AGENTS.md:100`)
- Sem barrel `index.ts` (`AGENTS.md:77`; `CLAUDE.md:53`)
- Constituição: `"use server"` + `server-only` em operações privilegiadas (`CLAUDE.md:54`); Trigger.dev para toda operação assíncrona que muda estado (`CLAUDE.md:56`); trilha de auditoria completa para decisões de KYC (`CLAUDE.md:57`)
- NUNCA versão direta de pacote em workspace; usar `"catalog:"` (`AGENTS.md:142-144`)
- `src/workflows/` é LEGADO, deve migrar para `src/trigger` (`AGENTS.md:136`)
- Testes: asserções dentro de `it()`/`test()`; não usar `.only` ou `.skip` em código commitado (`AGENTS.md:271-273`)
- Validação de env via `@t3-oss/env-nextjs` em `packages/supabase/src/env.ts` (`AGENTS.md:164`)
- Ultracite (guia genérico embutido): `const` por padrão, nunca `var`, hooks só no topo (`AGENTS.md:200`, `:212`, `:227` via Grep)
- Rodar `bun x ultracite fix` antes de commit (`CLAUDE.md:51`; `AGENTS.md:289`)

## Divergências e inconsistências
1. **Deploy de pacote inexistente**: o workflow implanta `packages/jobs` (`.github/workflows/release-trigger-prod.yml:23`), mas `packages/*` tem só `kyc`, `mailer`, `supabase`, `ui` (listagem; `packages/jobs/*` vazio). `apps/web/tsconfig.json:7` também mapeia `@repo/jobs` → `../../jobs/src`, caminho inexistente.
2. **Instrução aponta arquivo inexistente**: `CLAUDE.md:51` manda ver `.claude/CLAUDE.md` para "full code standards"; a listagem de `.claude/` só tem `settings.local.json`.
3. **Pasta de specs vs docs**: `CLAUDE.md:33` diz `specs/` (existe: `specs/001-ui-cleanup/`) × `AGENTS.md:125` diz `docs/` (não existe; checado com Glob em `docs/*.md` e `docs/*/*.md`).
4. **Trigger.dev em três versões**: `CLAUDE.md:9` ("SDK v4") × `package.json:45` (catalog `^3.3.12`) × `apps/web/package.json:27` (`4.4.1`, direto, fora do catalog). `apps/web/package.json:61` também pina `@trigger.dev/build 4.4.1`.
5. **Biome em duas versões**: `package.json:32` (`2.4.0`, devDeps raiz) × `package.json:48` (catalog `2.2.0`). `apps/web/package.json:57` usa `catalog:`, então resolve para 2.2.0 e não para 2.4.0 da raiz.
6. **Regra de catálogo descumprida**: `AGENTS.md:144` ("Never add direct version numbers in workspace packages") × versões diretas em `apps/web/package.json:16,18,19,20,27,28,37,43,46,58,61` e `apps/email/package.json:14,15,18`.
7. **Scripts do turbo sem task declarada**: `package.json:12` (`turbo start`), `:16` (`turbo translate`), `:17` (`turbo boundaries`) × `turbo.json:4-41` declara só `build`, `lint`, `typecheck`, `clean`, `dev`. Não executei; o turbo costuma recusar task não declarada, confirmar ao rodar.
8. **CLI do Trigger.dev sem pin**: `.github/workflows/release-trigger-prod.yml:23` e `apps/web/package.json:7` usam `trigger.dev@latest`, enquanto o SDK está pinado em `4.4.1` (`apps/web/package.json:27`). O deploy pode usar CLI de versão diferente do SDK.
9. **Descrição de lint diverge**: `AGENTS.md:16` diz "Biome check (no writes)"; `package.json:7` roda `ultracite check` (wrapper sobre Biome). Menor.
10. **Caminhos de rotas e auth em AGENTS**: `AGENTS.md:130-134` cita `app/(dashboard)/`, `app/auth/`, `app/api/` sem o `src/`; estão em `apps/web/src/app/` (listagem). `AGENTS.md:133` cita "callback pages": a listagem de `apps/web/src/app/auth/**` não achou callback. Achou `auth/(public)/sign-in`, `auth/(public)/sign-up`, `auth/error`, `auth/forgot-password`, `auth/sign-up-success`, `auth/update-password`.
11. **Pasta legada citada**: `AGENTS.md:136` cita `src/workflows/` (LEGACY); a listagem não encontrou `apps/web/src/workflows/*.ts`. Instrução possivelmente desatualizada.
12. **Pins exatos misturados com ranges**: `apps/web/package.json:27,61` (`4.4.1`) e `apps/email/package.json:14,15,18` (exatos) × ranges `^` no restante dos mesmos arquivos.

## Lacunas
- `AGENTS.md:167-268` (guia genérico do Ultracite) — não lido linha a linha; motivo: conteúdo de ferramenta, sem regra específica do repo. Só Grep de palavras-chave (linhas 200, 212, 227).
- `packages/*` (kyc, supabase, mailer, ui) e `tooling/typescript-config` — manifests não lidos (regra: pacotes não entram na leitura de manifest). Impede confirmar tasks `lint`, `translate`, `boundaries` e o nome real de `packages/ui` nos pacotes.
- `supabase/config.toml:41-365` — não lido; motivo: além das 40 linhas iniciais, só busca por padrão, que devolveu comentários.
- `supabase/migrations/*.sql` (15 arquivos) — listados, não lidos (migrations só listadas). Não verificado: buckets `documents`/`images` citados em `CLAUDE.md:8`.
- `apps/web/src/**` (código), `specs/001-ui-cleanup/*` — fora do escopo de leitura.
- Existem (listagem, não lidos): `apps/web/next.config.ts`, `apps/web/trigger.config.ts`, `apps/web/playwright.config.ts`, `apps/web/.env.example`, `apps/email/export-supabase-templates.ts`, `apps/email/tsconfig.json` (lido), `biome.jsonc`, `packages/supabase/src/env.ts`, `supabase/scripts/generate-types.ts`, `supabase/scripts/seed.ts`, `apps/web/src/trigger/kyc/*.ts` (5 tasks), `apps/web/src/actions/onboarding/*.ts`.
- Não existem (listagem): `apps/web/Dockerfile`, `apps/web/vercel.json`, `docker-compose*.yml`, `.github/workflows/` além de `release-trigger-prod.yml`, `packages/jobs/`, `.claude/CLAUDE.md`, `docs/`, `.env.example` na raiz.
- Fora do escopo: `.agents/skills/**` (skills de agente, não instrução do repo), `.claude/settings.local.json`.
- `.gitignore` e `.env*` — não lidos (`.env*` nunca; `.gitignore` fora da lista).
- Lint/format sem config além de `biome.jsonc`: não existe `eslint`/`prettier` (consistente com `AGENTS.md:48`).
