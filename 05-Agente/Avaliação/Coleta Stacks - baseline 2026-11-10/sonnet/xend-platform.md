# Dossiê: xend-platform (C:\Users\Pedro\Projetos\xend-platform)

## Stacks presentes
- **TypeScript**: `typescript ^5.9.3` (package.json:39; catalog package.json:82); `strict: true` (tsconfig.json:17); CLAUDE.md:7 "TypeScript 5"; CLAUDE.md:51 "TypeScript strict mode".
- **Next.js**: catalog `"next": "^16"` (package.json:66); apps/web usa `next dev/build/start` (apps/web/package.json:6-9); AGENTS.md:7 "Next.js 16 / React 19"; App Router (AGENTS.md:130-134). React `^19` (package.json:69).
- **JavaScript**: sem manifest JS puro; só via TS/Bun (scripts `bun run ./supabase/scripts/generate-types.ts`, package.json:25).
- **SQL / PostgreSQL (Supabase)**: supabase/config.toml:5 `project_id = "xend"`; `major_version = 17` (config.toml:34); migrations habilitadas (config.toml:51-53); seed `./seed.sql` (config.toml:58-63); CLAUDE.md:8 "Supabase (PostgreSQL)"; CLAUDE.md:32 "supabase/migrations/ SQL migrations".
- **Python**: nenhum manifest nos arquivos permitidos. **Go**: nenhum `go.mod` (raiz e apps/*).
- Runtime/gerenciador: Bun (`"packageManager": "bun@1.3.5"` package.json:87; workspaces package.json:89-93; AGENTS.md:7, :49).
- Monorepo Turborepo (`turbo ^2.8.10` package.json:38; turbo.json:1-42).
- Lint/format: Biome 2.4.0 (package.json:32) + Ultracite 7.2.3 (package.json:40); AGENTS.md:48, :167-177.
- Outros: Trigger.dev SDK v4 (apps/web/package.json:27 `4.4.1`; CLAUDE.md:9), Playwright (apps/web/package.json:58), Vercel AI SDK `ai ^6` (package.json:56; CLAUDE.md:10), Zod `^4.1.12` (package.json:85), Tailwind `^4.1.17` (package.json:79), React Email (apps/email/package.json:14-18), `@t3-oss/env-nextjs` (package.json:43).

## Comandos (só o que está escrito)
- Build: `bun run build` -> `turbo run build` (package.json:5; AGENTS.md:14); app: `next build` (apps/web/package.json:8).
- Dev: `bun run dev` -> `turbo run dev` (package.json:6); web `next dev --port 5500` (apps/web/package.json:6); Trigger worker `bun x --bun trigger.dev@latest dev` (apps/web/package.json:7; CLAUDE.md:41); email `email dev --port 3025 --dir ../../packages/mailer/templates` (apps/email/package.json:7).
- Teste: `bun test` (package.json:13; AGENTS.md:22); arquivo único `bun test packages/kyc/src/foo.test.ts` (AGENTS.md:24); `bun test packages/kyc` (CLAUDE.md:45); E2E `playwright test` via `test:e2e` (apps/web/package.json:10; AGENTS.md:29).
- Lint: `bun run lint` -> `bun x ultracite check` (package.json:7); `check`/`fix` (package.json:28-29).
- Formatação: `bun run format` -> `bun x ultracite fix` (package.json:8); `format:unsafe` -> `biome check --write --unsafe .` (package.json:15).
- Typecheck: `turbo run typecheck` (package.json:9); web/email: `tsc --noEmit --emitDeclarationOnly false` (apps/web/package.json:12; apps/email/package.json:11).
- Banco/migração: `db:start`, `db:stop`, `db:restart`, `db:status` (package.json:20-23); `db:reset` = `bunx supabase db reset --debug && bun run db:typegen` (package.json:24); `db:typegen` (package.json:25); `db:seed` (package.json:26); CLAUDE.md:42-44 `supabase start`, `supabase migration up`, `supabase gen types typescript`.
- Outros: `boundaries` (package.json:17), `translate` (package.json:16), `mailer:export-templates` (package.json:27), `prepare: husky` (package.json:11).
- CI: único workflow faz `bun install` e `bunx trigger.dev@latest deploy packages/jobs` em push na `main` (.github/workflows/release-trigger-prod.yml:4-7, :17, :23). Não há job de teste/lint/typecheck.

## Regras/convenções declaradas
AGENTS.md:
- React Server Components por padrão; `"use client"` só com estado/efeitos/APIs de browser (AGENTS.md:47).
- Biome substitui ESLint+Prettier; não adicionar configs eslint/prettier (AGENTS.md:48).
- Bun como gerenciador; nunca `npm` ou `yarn` (AGENTS.md:49).
- Zod em toda fronteira de sistema (AGENTS.md:50, :94).
- Importar `server-only` em arquivos que nunca rodam no cliente (AGENTS.md:51, :101).
- Nomes: arquivos kebab-case, componentes PascalCase, hooks `useX`, handlers `handleX`, tabelas snake_case (AGENTS.md:55-61).
- Imports explícitos de `@repo/supabase/*` (server/client/admin/middleware/queries/types) (AGENTS.md:65-74).
- Named exports sobre default; evitar barrel files; agrupar imports external->internal->relative (AGENTS.md:76-78; reforço :251).
- Biome indent 2 espaços; rodar `bun run format` antes de commitar; excluídos `packages/ui`, `node_modules`, `.next`, `dist` (AGENTS.md:82-84).
- `import type` para tipos (AGENTS.md:89).
- Segurança: não expor segredos no cliente; validar env com `@t3-oss/env-nextjs`; `target="_blank"` com `rel="noopener"` (AGENTS.md:100-103).
- UI: `next/image` com dimensões; shadcn/ui de `packages/ui`; acessibilidade (AGENTS.md:107-109).
- `src/workflows/` é LEGACY e deve migrar para `src/trigger` com Trigger.dev (AGENTS.md:136).
- Versões de dependência centralizadas no `catalog` do package.json raiz; workspaces usam `"catalog:"`; nunca versão direta em pacote de workspace (AGENTS.md:142-144).
- Ciclo de status KYC: `not_started` -> `in_progress` -> `needs_review` -> `approved`/`rejected` (AGENTS.md:148).
- Env vars validadas na subida em `packages/supabase/src/env.ts` (AGENTS.md:164).
- Ultracite: preferir `unknown` a `any` (AGENTS.md:187), `for...of` em vez de `.forEach` (AGENTS.md:196), sem `console.log`/`debugger`/`alert` em produção (AGENTS.md:226), sem `.only`/`.skip` commitados (AGENTS.md:273), ref como prop em React 19 em vez de `forwardRef` (AGENTS.md:262).
- Rodar `bun x ultracite fix` antes de commitar (AGENTS.md:289).

CLAUDE.md:
- Biome é o único linter/formatter; rodar `bun x ultracite fix` (CLAUDE.md:51).
- Sem barrel `index.ts` (Constitution I) (CLAUDE.md:53); `"use server"` + `server-only` para operações privilegiadas (II) (CLAUDE.md:54); Zod em toda fronteira (III) (CLAUDE.md:55); Trigger.dev para toda operação assíncrona que muda estado (IV) (CLAUDE.md:56); registros de auditoria completos para decisões KYC (V) (CLAUDE.md:57).

## Divergências e inconsistências
- Versão do Biome: `@biomejs/biome` 2.4.0 em devDependencies (package.json:32) vs 2.2.0 no catalog (package.json:48); apps/web usa `catalog:` (apps/web/package.json:57).
- Trigger.dev: catalog `@trigger.dev/sdk ^3.3.12` (package.json:45) vs `4.4.1` fixo em apps/web (apps/web/package.json:27) e CLAUDE.md:9 "SDK v4". apps/web também fixa versões diretas em vez de `catalog:`, contra AGENTS.md:144 (`@trigger.dev/build` 4.4.1 em :61; `@playwright/test ^1.50.0` em :58; `nanoid ^5.1.6` em :37, que já existe no catalog em package.json:65).
- Pacotes AI SDK: catalog `@ai-sdk/openai ^1` (package.json:46), `ai ^6` (package.json:56), `@ai-sdk/react ^3.0.0-beta.96` (package.json:47); CLAUDE.md:10 diz "AI SDK v6 (`ai`, `@ai-sdk/openai`)" — majors não alinhados no manifest.
- Workflow aponta para `packages/jobs` (release-trigger-prod.yml:23), mas `packages/` contém só kyc, mailer, supabase, ui (listagem; AGENTS.md:117-121 também não lista `jobs`). apps/web/tsconfig.json:7 mapeia `@repo/jobs` -> `../../jobs/src`, caminho que não existe (sem `jobs/` na raiz).
- AGENTS.md:125 lista `docs/` e CLAUDE.md:51 cita `.claude/CLAUDE.md`; nenhum dos dois existe (listagem da raiz / `.claude/`).
- Script `lint` raiz usa ultracite (package.json:7), mas turbo.json:28-30 define task `lint` com `dependsOn ^lint` e nenhum app tem script `lint` (apps/web/package.json:5-12; apps/email/package.json:5-12).
- `translate` e `boundaries` (package.json:16-17) chamam tarefas turbo ausentes de turbo.json:4-41 e dos scripts dos apps.
- `package.json:94-96` declara `"dependencies": {"xend": "."}` (auto-referência).
- apps/web/tsconfig.json:19 inclui `next-config.ts` (nome convencional é `next.config.ts`; indício de typo, não verificado).
- tsconfig raiz usa `module: NodeNext` (tsconfig.json:12-14) enquanto os apps estendem `@repo/typescript-config/nextjs.json` (apps/web/tsconfig.json:2; apps/email/tsconfig.json:2), cujo conteúdo não foi lido.
- CLAUDE.md:3 "Last updated: 2026-02-25"; CLAUDE.md:9 já cita `apps/web/src/trigger/` enquanto AGENTS.md:136 ainda trata `src/workflows` como a migrar.

## Lacunas
- `biome.jsonc` e `@repo/typescript-config/nextjs.json` não lidos (fora da lista).
- `packages/*`, `supabase/migrations`, `supabase/scripts`, `specs`, `.husky` não lidos; versão do Postgres apenas de supabase/config.toml:34.
- Se há Python/Go em outras pastas: não verificado além do primeiro nível (nenhum manifest encontrado).
- Runner de unit confirmado só como `bun test` (package.json:13); config do Playwright não lida.
- Hooks do husky não lidos; `.github/workflows` tem apenas release-trigger-prod.yml.
