# Dossiê — xend-platform

Lidos: 9 arquivos (~715 linhas, incluindo buscas por `Grep`) · Checagens de existência: ~45 · Teto atingido: **sim (checagens: 45 de 25)**. Nota: o inventário (listagens de nível 0, nível 1 e `ls -A`) e a batelada de existência de caminhos somaram ~45 entradas. Os resultados de existência abaixo são de listagem real, mas o teto de 25 foi ultrapassado nesta coleta.
Arquivos lidos: `AGENTS.md` (inteiro, 1-289), `CLAUDE.md`, `package.json`, `turbo.json`, `tsconfig.json`, `.github/workflows/release-trigger-prod.yml`, `apps/web/package.json`, `apps/email/package.json`, `supabase/config.toml` (parcial, por `Grep`).

## Stacks presentes
- **Bun 1.3.5** como gerenciador e runtime de scripts: `package.json:87` (`packageManager`); `AGENTS.md:49` ("Bun as package manager. Never use npm or yarn").
- **Monorepo Turborepo + workspaces Bun** (`apps/*`, `packages/*`, `tooling/*`): `package.json:89-93`; `turbo.json:1-4`.
- **Next.js 16**: `package.json:66` (`"next": "^16"` no catálogo); `apps/web/package.json:38` (`"next": "catalog:"`); `AGENTS.md:7`, `AGENTS.md:115`.
- **React 19**: `package.json:69` (`"react": "^19"`).
- **TypeScript 5.9**: `package.json:39` e `:82` (`"^5.9.3"`); `tsconfig.json:17` (`"strict": true`).
- **Supabase (PostgreSQL 17)**: `supabase/config.toml:34` (`major_version = 17`); `supabase/config.toml:5` (`project_id = "xend"`).
- **Trigger.dev**: `apps/web/package.json:27` (`"@trigger.dev/sdk": "4.4.1"`); `package.json:45` (catálogo `"^3.3.12"`), ver divergência 2.
- **Zod 4**: `package.json:85` (`"^4.1.12"`); `CLAUDE.md:13` (Zod em todas as fronteiras).
- **Tailwind CSS 4**: `package.json:79` (`"^4.1.17"`).
- **shadcn/ui + Radix**: `AGENTS.md:118` (`packages/ui`); `apps/web/package.json:19-20` (`@radix-ui/*`).
- **Biome 2.x** (lint/format) + **ultracite 7.2.3**: `package.json:32` (`"@biomejs/biome": "2.4.0"`), `:40` (`"ultracite": "7.2.3"`); `AGENTS.md:48`.
- **Playwright** (E2E): `apps/web/package.json:10` (`test:e2e`), `:58` (`"^1.50.0"`).
- **Resend + React Email**: `apps/email/package.json:14-18` (`@react-email/components` 1.0.1, `react-email` 5.0.5, `@repo/mailer`); `CLAUDE.md:11`.
- **Vercel AI SDK**: `package.json:56` (`"ai": "^6"`); `package.json:46` (`"@ai-sdk/openai": "^1"`), ver divergência 3.
- **BigDataCorp SDK** (KYC): `apps/web/package.json:16` (`"@greensgroup/bigdatacorp-sdk": "^0.1.1"`); `AGENTS.md:7`.

## Comandos
- Dev (todos os apps, via Turbo): `bun run dev` (`package.json:6`; `AGENTS.md:13`).
- Build: `bun run build` (`package.json:5`); `apps/web`: `next build` (`apps/web/package.json:8`).
- Start: `next start` (`apps/web/package.json:9`); `turbo start` (`package.json:12`).
- Dev web (porta 5500): `next dev --port 5500` (`apps/web/package.json:6`).
- Dev email (porta 3025): `email dev --port 3025` (`apps/email/package.json:7`).
- Dev Trigger.dev: `bun x --bun trigger.dev@latest dev` (`apps/web/package.json:7`).
- Lint: `bun x ultracite check` (`package.json:7`); `AGENTS.md:17` descreve como "Biome check (no writes)".
- Format: `bun x ultracite fix` (`package.json:8`); `format:unsafe` = `biome check --write --unsafe .` (`package.json:15`).
- Typecheck: `turbo run typecheck` (`package.json:9`); web: `tsc --noEmit --emitDeclarationOnly false` (`apps/web/package.json:12`); email: mesmo padrão (`apps/email/package.json:11`).
- Testes unitários: `bun test` (`package.json:13`; `AGENTS.md:22`).
- Testes E2E: `playwright test` (`apps/web/package.json:10`).
- Banco: `db:start` (`package.json:21`), `db:stop` (`:20`), `db:status` (`:23`), `db:reset` = `supabase db reset --debug && bun run db:typegen` (`:24`), `db:typegen` (`:25`), `db:seed` = `bun ./supabase/scripts/seed.ts` (`:26`).
- Export de templates de e-mail: `mailer:export-templates` (`package.json:27`).
- Deploy em CI: `bunx trigger.dev@latest deploy packages/jobs` (`.github/workflows/release-trigger-prod.yml:23`). Único workflow declarado; dispara no push em `main` (`:4-6`).

## Regras/convenções declaradas
- Componentes React Server por padrão; `"use client"` só quando necessário (`AGENTS.md:47`).
- Biome substitui ESLint e Prettier; não adicionar configs de eslint/prettier; config em `biome.jsonc` (`AGENTS.md:48`).
- Bun como gerenciador; nunca `npm` ou `yarn` (`AGENTS.md:49`).
- Zod em todas as fronteiras: API routes, Server Actions, resolvers de form (`AGENTS.md:50`; `CLAUDE.md:13`; `CLAUDE.md:55`).
- `server-only` nos arquivos que nunca podem rodar no cliente (`AGENTS.md:51`).
- Nomes: arquivos e pastas em kebab-case; componentes em PascalCase; hooks com `use`; handlers com prefixo `handle`; tabelas do banco em snake_case (`AGENTS.md:57-61`).
- Exports nomeados em vez de default; evitar barrel files `index.ts` (`AGENTS.md:76-77`; `CLAUDE.md:53`).
- Segurança: nunca expor segredos no código cliente; validar env com `@t3-oss/env-nextjs`; `rel="noopener"` em `target="_blank"` (`AGENTS.md:100-103`).
- **Nunca adicionar número de versão direto em pacote de workspace**; usar `"catalog:"` (`AGENTS.md:142-144`).
- `apps/web/src/workflows/` é LEGACY e deve migrar para `src/trigger` com o serviço Trigger.dev (`AGENTS.md:136`).
- Tarefas async que mudam estado usam Trigger.dev (`CLAUDE.md:56`, "Constitution IV"); auditoria completa das decisões KYC (`CLAUDE.md:57`).
- Ultracite: remover `console.log`, `debugger` e `alert` do código de produção (`AGENTS.md:226`); usar `ref` como prop, não `forwardRef`, no React 19+ (`AGENTS.md:262`).
- Testes: `it()`/`test()` com asserções dentro; sem `.only`/`.skip` em código commitado (`AGENTS.md:271-273`).
- Ciclo de status KYC: `not_started` → `in_progress` → `needs_review` → `approved` / `rejected` (`AGENTS.md:148`).
- Migrations: `supabase migration up` (`AGENTS.md:43`). Estrutura: `supabase/migrations/` (`CLAUDE.md:32`; `AGENTS.md:124`).

## Divergências e inconsistências
1. **Deploy de CI aponta para pacote inexistente**: o workflow faz deploy de `packages/jobs` (`.github/workflows/release-trigger-prod.yml:23`), mas `packages/` só tem `kyc`, `mailer`, `supabase`, `ui` (listagem). As tasks do Trigger.dev ficam em `apps/web/src/trigger/` (`CLAUDE.md:9`; `AGENTS.md:136`).
2. **Versão do Trigger.dev em três lugares**: `CLAUDE.md:9` diz "SDK v4"; o catálogo fixa `"^3.3.12"` (`package.json:45`); o `apps/web` fixa `"4.4.1"` diretamente (`apps/web/package.json:27`), e também o `@trigger.dev/build` (`apps/web/package.json:61`).
3. **Pins diretos em workspace, contra a regra**: `AGENTS.md:144` proíbe versões numéricas em pacotes de workspace, mas `apps/web/package.json` tem `"@greensgroup/bigdatacorp-sdk": "^0.1.1"` (`:16`), `"@next/bundle-analyzer": "^16.0.8"` (`:18`), `"nanoid": "^5.1.6"` (`:37`), `"react-dropzone": "^14.3.8"` (`:43`), `"react-webcam": "^7.2.0"` (`:46`), `"@playwright/test": "^1.50.0"` (`:58`); e `apps/email/package.json` tem `"@react-email/components": "1.0.1"` (`:14`), `"@react-email/preview-server": "5.0.5"` (`:15`), `"react-email": "5.0.5"` (`:18`).
4. **AI SDK: texto × catálogo**: `CLAUDE.md:10` diz "Vercel AI SDK v6 (`ai`, `@ai-sdk/openai`)"; o catálogo fixa `"@ai-sdk/openai": "^1"` (`package.json:46`) ao lado de `"ai": "^6"` (`:56`). Versões de majors diferentes entre os dois pacotes.
5. **Pré-release no catálogo**: `"@ai-sdk/react": "^3.0.0-beta.96"` (`package.json:47`).
6. **Biome em duas versões**: `"@biomejs/biome": "2.4.0"` nas devDependencies da raiz (`package.json:32`) × `"@biomejs/biome": "2.2.0"` no catálogo (`package.json:48`).
7. **Lint: descrição × script**: `AGENTS.md:17` diz "Biome check (no writes)" para `bun run lint`; o script executa `bun x ultracite check` (`package.json:7`).
8. **Referência a `docs/` inexistente**: `AGENTS.md:125` cita `docs/` (feature specs, docs BigDataCorp); não existe na raiz (listagem). Os specs reais estão em `specs/` (listagem).
9. **`supabase/seed.sql` inexistente**: `supabase/config.toml:63` define `sql_paths = ["./seed.sql"]` com seed habilitado (`:60`); o arquivo não existe em `supabase/` (checagem). O `db:seed` usa `supabase/scripts/seed.ts` (`package.json:26`), que existe.
10. **Arquivo de instrução referenciado inexistente**: `AGENTS.md:51` manda ver `.claude/CLAUDE.md` para "padrões de código completos"; esse arquivo não existe (`.claude/` tem só `settings.local.json` e `skills`, listagem).
11. **Nomes de env var: AGENTS × turbo.json**: `AGENTS.md:155-161` lista `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `AI_GATEWAY_API_KEY`; `turbo.json:9-24` (env do task `build`) lista `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (sem prefixo `NEXT_PUBLIC_`), `POSTGRES_URL` e variantes, sem `DATABASE_URL` nem `AI_GATEWAY_API_KEY`.
12. **Duas validações de env**: `AGENTS.md:164` diz que env é validada em `packages/supabase/src/env.ts` (existe); também existe `apps/web/src/env.ts` (listagem). Não lido: não dá para dizer pelo nome qual é a fonte de verdade.
13. **CI sem versão fixa**: `bunx trigger.dev@latest` (`release-trigger-prod.yml:23`) e `bun x --bun trigger.dev@latest` (`apps/web/package.json:7`) usam `@latest`. Não é erro, mas a versão do CLI não é reproduzível.

## Lacunas
- `apps/web/.env.example` existe (listagem); não lido — motivo: `.env*` é proibido.
- `packages/supabase/src/env.ts` e `apps/web/src/env.ts` existem (listagem); não lidos — motivo: código-fonte fora da lista.
- `CLAUDE.md` (lido inteiro) não importa `AGENTS.md` com `@`; os dois são arquivos independentes. Não houve comparação de conteúdo duplicado.
- `supabase/config.toml` lido só por `Grep` (seções `[db]`, `[auth]`, `[storage]`...). Motivo: arquivo >150 linhas, regra de tamanho.
- `apps/web/next.config.ts`, `apps/web/trigger.config.ts`, `apps/web/playwright.config.ts`, `apps/web/tsconfig.json`, `biome.jsonc`, `tooling/typescript-config/` — existem (listagem); não lidos — motivo: configs fora da lista de leitura.
- `opencode.json`, `GEMINI.md`, `.mcp.json`, `.betterrc.json`, `.claude/settings.local.json`, `.specify/`, `skills-lock.json`, `.codex`, `.gemini` — existem (listagem); só registrados — motivo: fora do escopo de leitura.
- `README.md`, `bun.lock`, `specs/`, `supabase/migrations/`, `supabase/templates/`, `apps/web/src/` (estrutura de código), `packages/*/package.json` (pacotes, fora do passo de manifests) — não lidos — motivo: fora do escopo.
- `packages/ui/components.json` existe (listagem); não lido — motivo: fora do escopo.
- `AGENTS.md` tem mais de 150 linhas; leitura completa (1-289), sem `Grep` adicional.
- Teto de checagens de existência: **ultrapassado** (~45 de 25). Ver cabeçalho.
