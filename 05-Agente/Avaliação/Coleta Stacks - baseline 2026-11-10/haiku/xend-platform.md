# Dossiê de contexto — xend-platform (somente leitura)

Arquivos lidos: 11 (AGENTS.md, CLAUDE.md, package.json, turbo.json, tsconfig.json, supabase/config.toml, .github/workflows/release-trigger-prod.yml, apps/email/package.json, apps/email/tsconfig.json, apps/web/package.json, apps/web/tsconfig.json). Listagens de diretório feitas só para localizar manifests.

## Stacks presentes
- **TypeScript**: `C:\Users\Pedro\Projetos\xend-platform\package.json:39` (typescript ^5.9.3); `...\tsconfig.json:17` (`strict: true`); `apps\web\tsconfig.json:2` (extends `@repo/typescript-config/nextjs.json`).
- **Next.js 16 / React 19**: `package.json:66` (next ^16), `package.json:69` (react ^19); `apps\web\package.json:38` (next via catalog), `:42` (react-dom via catalog). Declarado em `AGENTS.md:7`.
- **JavaScript (runtime Bun/Node, scripts)**: `package.json:4-30` (scripts). Nenhum arquivo `.js` dentro do escopo permitido; ver Lacunas.
- **Bun (gerenciador)**: `package.json:87` (`packageManager: bun@1.3.5`); `AGENTS.md:49`.
- **Turborepo**: `turbo.json:1-41`; `package.json:38` (turbo ^2.8.10).
- **Supabase / PostgreSQL / SQL**: `supabase\config.toml:5` (project_id), `:34` (`major_version = 17`), `:63` (`sql_paths`). Pasta `supabase\migrations\` existe (só listada, não lida).
- **Trigger.dev v4**: `apps\web\package.json:27` (`@trigger.dev/sdk` 4.4.1), `:61` (`@trigger.dev/build` 4.4.1); `CLAUDE.md:9`.
- **Vercel AI SDK v6 / OpenAI**: `package.json:46-47,56` (catalog); `apps\web\package.json:15`; `CLAUDE.md:10`.
- **Zod 4**: `package.json:85` (zod ^4.1.12); `AGENTS.md:50`.
- **Biome / Ultracite**: `package.json:32` (@biomejs/biome 2.4.0), `:40` (ultracite 7.2.3), `:7` (lint). `AGENTS.md:48`.
- **Tailwind CSS 4**: `package.json:51` (catalog), `apps\web\package.json:60`.
- **Playwright (E2E)**: `apps\web\package.json:10` (test:e2e), `:58` (@playwright/test ^1.50.0).
- **React Email**: `apps\email\package.json:14-15`, `:18`.
- **Python / Go**: nenhum manifest dentro do escopo permitido.

## Comandos (só o que está escrito)
Raiz, `package.json`:
- build `turbo run build` (:5); dev `turbo run dev` (:6); typecheck `turbo run typecheck` (:9); test `bun test` (:13); start `turbo start` (:12); clean (:10); clean:prune (:14)
- lint `bun x ultracite check` (:7); check (:28); format `bun x ultracite fix` (:8); fix (:29); format:unsafe `biome check --write --unsafe .` (:15)
- Banco: db:start `bunx supabase start` (:21); db:stop (:20); db:restart (:22); db:status (:23); db:reset `bunx supabase db reset --debug && bun run db:typegen` (:24); db:typegen (:25, `./supabase/scripts/generate-types.ts`); db:seed `bun ./supabase/scripts/seed.ts` (:26)
- Outros: translate `turbo translate` (:16); boundaries `turbo boundaries` (:17); ui:bump (:18); ui:add (:19); mailer:export-templates (:27)

`apps\web\package.json`: dev `next dev --port 5500` (:6); dev:trigger `bun x --bun trigger.dev@latest dev` (:7); build `next build` (:8); start `next start` (:9); test:e2e `playwright test` (:10); typecheck `tsc --noEmit --emitDeclarationOnly false` (:12).

`apps\email\package.json`: build (:6), dev na porta 3025 (:7), export (:8), export:supabase `bun run export-supabase-templates.ts` (:9), typecheck (:11).

CI: `.github\workflows\release-trigger-prod.yml:23` — `bunx trigger.dev@latest deploy packages/jobs` (único passo além de install; sem lint/teste/typecheck).

Migração/tipos (declarado em CLAUDE.md): `supabase migration up` (CLAUDE.md:43); `supabase gen types typescript` (CLAUDE.md:44); `supabase start` (CLAUDE.md:42).

## Regras/convenções declaradas
- Componentes React Server por padrão; `"use client"` só quando necessário — `AGENTS.md:47`.
- Biome substitui ESLint e Prettier; não adicionar configs de eslint/prettier — `AGENTS.md:48`.
- Bun como gerenciador; nunca npm ou yarn — `AGENTS.md:49`.
- Zod em todas as fronteiras (API routes, Server Actions, form resolvers) — `AGENTS.md:50`; `CLAUDE.md:13`.
- `server-only` em arquivos que nunca podem rodar no cliente — `AGENTS.md:51`.
- Convenções de nomes: arquivos kebab-case, componentes PascalCase, hooks com `use`, handlers com prefixo `handle`, tabelas snake_case — `AGENTS.md:57-61`.
- Imports explícitos por subcaminho (`@repo/supabase/server`, `/client`, `/admin`, etc.) — `AGENTS.md:68-73`.
- Exports nomeados, sem barrel files (`index.ts`), ordem de imports externo → interno → relativo — `AGENTS.md:76-78`; `CLAUDE.md:53`.
- Biome com indentação de 2 espaços; rodar `bun run format` antes de commit — `AGENTS.md:82-83`.
- Nunca expor segredos no cliente; env validado com `@t3-oss/env-nextjs` — `AGENTS.md:100-102`.
- `target="_blank"` com `rel="noopener"` — `AGENTS.md:103`; `AGENTS.md:241`.
- `next/image` com dimensões explícitas; shadcn/ui vem de `packages/ui` — `AGENTS.md:107-108`.
- Versões centralizadas no `catalog` da raiz; pacotes usam `"catalog:"`; sem versão direta em pacotes workspace — `AGENTS.md:142-144`.
- `src/workflows/` é LEGADO e deve migrar para `src/trigger` (Trigger.dev) — `AGENTS.md:136`.
- Ações async que mudam estado usam Trigger.dev — `CLAUDE.md:56`.
- `"use server"` + `server-only` para operações privilegiadas — `CLAUDE.md:54`.
- Trilha de auditoria completa para toda decisão de KYC — `CLAUDE.md:57`.
- TypeScript strict; Biome é o único linter/formatter — `CLAUDE.md:51`.
- Não usar `console.log`/`debugger`/`alert` em produção; erros com `Error` — `AGENTS.md:226-227`.
- Testes: asserções dentro de `it()`/`test()`; sem `.only`/`.skip` em código commitado — `AGENTS.md:271-273`.
- Status do KYC: `not_started → in_progress → needs_review → approved/rejected` — `AGENTS.md:148`.

## Divergências e inconsistências
1. **Biome com duas versões**: `package.json:32` fixa `@biomejs/biome: 2.4.0` direto na raiz; `package.json:48` define `2.2.0` no catalog; `apps\web\package.json:57` usa `catalog:` (= 2.2.0). Contradiz `AGENTS.md:143` (versões centralizadas).
2. **Trigger.dev SDK com duas versões**: catalog da raiz `package.json:45` = `^3.3.12`; `apps\web\package.json:27` = `4.4.1` direto. `CLAUDE.md:9` declara v4. A entrada do catalog (v3) não é usada por apps/web.
3. **Versões diretas em pacotes workspace** (contra `AGENTS.md:144`): `apps\web\package.json:16` (`@greensgroup/bigdatacorp-sdk` ^0.1.1), `:18` (`@next/bundle-analyzer` ^16.0.8), `:19-20` (@radix-ui/*), `:27` (4.4.1), `:28` (@vis.gl/react-google-maps ^1.7.1), `:37` (nanoid ^5.1.6 — mesmo valor que `package.json:65` do catalog), `:43` (react-dropzone ^14.3.8), `:46` (react-webcam ^7.2.0), `:58` (@playwright/test ^1.50.0), `:61` (@trigger.dev/build 4.4.1). `apps\email\package.json:14` (@react-email/components 1.0.1), `:15` e `:18` (5.0.5).
4. **TypeScript duplicado**: `package.json:39` (direto) e `package.json:82` (catalog), ambos ^5.9.3.
5. **Script sem task/alvo declarado**: `package.json:16-17` (`translate`, `boundaries`) chamam `turbo translate` / `turbo boundaries`; `turbo.json:4-41` não define essas tasks, e `apps\web\package.json:5-13` e `apps\email\package.json:5-11` não têm esses scripts. Os `packages/*` não foram lidos (a confirmar).
6. **Caminho do job Trigger.dev**: `.github\workflows\release-trigger-prod.yml:23` faz deploy de `packages/jobs`; `apps\web\tsconfig.json:7` mapeia `@repo/jobs` para `../../jobs/src` (que resolve para `xend-platform\jobs`, não `packages\jobs`). Pasta `packages/jobs` não confirmada.
7. **Seed inexistente**: `supabase\config.toml:63` aponta `sql_paths = ["./seed.sql"]`, mas a listagem de `supabase\` mostra só `config.toml`, `migrations`, `scripts`, `templates`. O seed real é `supabase/scripts/seed.ts` (`package.json:26`).
8. **Arquivo de config com nome diferente**: `apps\web\tsconfig.json:18` inclui `next-config.ts`; o arquivo existente em `apps\web\` é `next.config.ts` (listagem).
9. **Pasta inexistente**: `AGENTS.md:125` cita `docs/` (feature specs); a raiz tem `specs/` e não tem `docs/` (listagem).
10. **Catalog no lugar possivelmente errado (a confirmar)**: `package.json:42` define `"catalog"` no topo do `package.json`, não em `workspaces`. Não há `pnpm-workspace.yaml`. Se o Bun não ler esse campo, as referências `"catalog:"` (ex.: `apps\web\package.json:38`) não resolvem. Confirmar na documentação do Bun.
11. **Possível incompatibilidade de major (a confirmar)**: `package.json:46` `@ai-sdk/openai ^1` junto com `package.json:56` `ai ^6`; `package.json:47` `@ai-sdk/react ^3.0.0-beta.96` (pré-release).
12. **Auto-dependência**: `package.json:94-95` `"dependencies": {"xend": "."}` na raiz.
13. **Sem CI de qualidade**: só existe `release-trigger-prod.yml`; não há workflow de lint, typecheck ou teste (observação, não erro de arquivo).
14. **Typo em variável de ambiente**: `supabase\config.toml:253` usa `SUPABASE_AUTH_TWILLIO_VERIFY_SERVICE_ID` (TWILLIO) — pode ser intencional se o segredo do ambiente tiver o mesmo nome.
15. **IP de LAN fixo em config local**: `supabase\config.toml:125` lista `192.168.3.12` em `additional_redirect_urls`.
16. **Buckets citados mas não declarados**: `CLAUDE.md:8` cita buckets `documents` e `images`; em `supabase\config.toml:113-117` a declaração está comentada. Pode estar nas migrations (não lidas).

## Lacunas (não confirmado dentro do limite de leitura)
- Fora da lista permitida e não lidos: `apps\web\next.config.ts`, `apps\web\playwright.config.ts`, `apps\web\trigger.config.ts`, `apps\web\postcss.config.mjs`, `apps\email\export-supabase-templates.ts`, `biome.jsonc`, `.claude\CLAUDE.md` (citado em `CLAUDE.md:51`), `.github` além do workflow listado.
- `packages\*` (inclui `packages\jobs`, `packages\supabase\src\env.ts` citado em `AGENTS.md:164`, `packages\ui`, `packages\kyc`, `packages\mailer\templates` citado em `apps\email\package.json:6`).
- `supabase\migrations\`, `supabase\scripts\`, `supabase\templates\` (só listados). SQL real não lido.
- `specs\`, `docs\` (inexistente), `.specify\`, `.agents\`, `.impeccable\`, `scripts\`, `tooling\typescript-config` (`@repo/typescript-config` não lido).
- `bun.lock` (lockfile, excluído).
- Não confirmado: existência de `packages/jobs`; a versão efetiva do `@repo/typescript-config`; se `storage buckets` existem nas migrations; se Biome usa indentação de 2 espaços (`biome.jsonc` não lido).
- Não há `docker-compose*.yml`, `pyproject.toml`, `requirements*.txt`, `go.mod` nem `pnpm-workspace.yaml` na raiz (confirmado por listagem).
