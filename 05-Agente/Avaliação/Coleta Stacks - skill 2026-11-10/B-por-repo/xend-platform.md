# Dossiê — xend-platform

Lidos: 7 arquivos (~506 linhas, + ~60 de saída de Grep) · Checagens de existência: 25 · Teto atingido: sim (checagens de existência, 25/25; leitura dentro do teto)
Arquivos lidos: `AGENTS.md` (linhas 1–40, 43–110, 111–166, 269–289), `CLAUDE.md`, `package.json`, `turbo.json`, `tsconfig.json`, `apps/web/package.json`, `apps/email/package.json`

Níveis inventariados (listagem): raiz; apps `apps/email`, `apps/web`; pacotes `packages/kyc`, `packages/mailer`, `packages/supabase`, `packages/ui`; `tooling/` existe (workspace `tooling/*`, conteúdo não listado).

## Stacks presentes
- **TypeScript 5.9**: `typescript` ^5.9.3 no catálogo (`package.json:82`); `strict` e `module: NodeNext` (`tsconfig.json:12`, `:17`).
- **JavaScript / runtime Bun**: `packageManager` bun@1.3.5 (`package.json:87`); workspaces `apps/*`, `packages/*`, `tooling/*` (`package.json:89-93`); Bun obrigatório como gerenciador (`AGENTS.md:49`). Tipos Node `@types/node` ^24.10.1 (`package.json:52`).
- **Next.js 16 / React 19**: `next` ^16 (`package.json:66`), `react` ^19 (`package.json:69`); dev do web na porta 5500 (`apps/web/package.json:6`); `AGENTS.md:7`.
- **SQL / Supabase (Postgres)**: pasta `supabase/` existe (listagem); migrations em `supabase/migrations/` (`AGENTS.md:32`, não confirmado no disco); buckets `documents` e `images` (`CLAUDE.md:8`); scripts de banco em `package.json:20-26`.
- **Outros (declarados)**: Trigger.dev 4.4.1 no web (`apps/web/package.json:27`); Resend + React Email (`apps/email/package.json:14-18`; `CLAUDE.md:11`); Vercel AI SDK v6 (`package.json:56`; `CLAUDE.md:10`); Zod ^4.1.12 (`package.json:85`); Tailwind 4 (`package.json:79`); Playwright ^1.50.0 (`apps/web/package.json:58`); Biome 2.x + ultracite (`package.json:32`, `:40`).
- **Python**: nenhum manifest no nível 0 (sem `pyproject.toml`, `requirements*.txt`, `setup.cfg`, listagem da raiz). Manifests dentro de `packages/*` não foram checados (teto de checagens).
- **Go**: nenhum `go.mod` / `go.work` no nível 0 (listagem da raiz).

## Comandos
- Dev (todos os apps): `bun run dev` → `turbo run dev` (`package.json:6`)
- Build (todos): `bun run build` → `turbo run build` (`package.json:5`)
- Build web: `bun --cwd apps/web build` → `next build` (`apps/web/package.json:8`)
- Build email: `email build --dir ../../packages/mailer/templates` (`apps/email/package.json:6`)
- Lint: `bun run lint` → `bun x ultracite check` (`package.json:7`)
- Format: `bun run format` → `bun x ultracite fix` (`package.json:8`); format sem segurança: `biome check --write --unsafe .` (`package.json:15`)
- Typecheck: `turbo run typecheck` (`package.json:9`); web `tsc --noEmit --emitDeclarationOnly false` (`apps/web/package.json:12`); email (`apps/email/package.json:11`)
- Testes: `bun test` (`package.json:13`); e2e web: `playwright test` (`apps/web/package.json:10`)
- Banco: `db:start` (`package.json:21`), `db:stop` (`:20`), `db:restart` (`:22`), `db:status` (`:23`), `db:reset` (`:24`, com `db:typegen`), `db:typegen` (`:25`), `db:seed` (`:26`)
- Templates de e-mail: `mailer:export-templates` → `apps/email` `export:supabase` (`package.json:27`; `apps/email/package.json:9`)
- Trigger.dev: `dev:trigger` (`apps/web/package.json:7`)
- Limpeza: `clean` (`package.json:10`); `clean:prune` (`package.json:14`)
- Não declarado: nenhum comando de deploy nos arquivos lidos (CI não lido).

## Regras/convenções declaradas
- Server Components por padrão; `"use client"` só quando necessário (`AGENTS.md:47`).
- Biome substitui ESLint e Prettier; não adicionar configs de eslint/prettier; config em `biome.jsonc` na raiz (`AGENTS.md:48`).
- Bun como gerenciador; nunca `npm` ou `yarn` (`AGENTS.md:49`).
- Zod em todas as fronteiras (rotas, Server Actions, resolvers de form) (`AGENTS.md:50`; `CLAUDE.md:13`).
- `server-only` em arquivos que nunca devem rodar no cliente (`AGENTS.md:51`, `:101`).
- Named exports; evitar barrel files (`AGENTS.md:76-77`).
- Nunca expor segredos/chaves no cliente; validar env com `@t3-oss/env-nextjs` (`AGENTS.md:100-102`).
- `target="_blank"` com `rel="noopener"` (`AGENTS.md:103`).
- Versões centralizadas no `catalog` da raiz; workspaces usam `"catalog:"`; "Never add direct version numbers in workspace packages" (`AGENTS.md:142-144`).
- Trigger.dev para todas as operações assíncronas que mudam estado (`CLAUDE.md` não traz; regra de "Constitution IV" citada em `AGENTS.md:56`, o arquivo de constituição não foi lido).
- Pasta `src/workflows/` marcada como LEGACY; migrar para `src/trigger` (`AGENTS.md:136`).
- Testes: asserções dentro de `it()`/`test()`; sem `.only` ou `.skip` em código commitado (`AGENTS.md:271-273`).
- Antes de commitar: `bun x ultracite fix` (`AGENTS.md:46`, `:289`).
- Status KYC: `not_started` → `in_progress` → `needs_review` → `approved` / `rejected` (`AGENTS.md:148`).

## Divergências e inconsistências
1. **`@trigger.dev/sdk` em duas versões**: o catálogo fixa `^3.3.12` (`package.json:45`), mas o web usa `4.4.1` com versão direta (`apps/web/package.json:27`); `CLAUDE.md:9` diz SDK v4. Viola `AGENTS.md:144` (regra do catálogo).
2. **Biome em duas versões no mesmo `package.json`**: `@biomejs/biome` 2.4.0 em devDependencies (`package.json:32`) e 2.2.0 no catálogo (`package.json:48`).
3. **Versões diretas em pacotes de workspace**, contrariando `AGENTS.md:144`: `apps/web/package.json` linhas 16 (`@greensgroup/bigdatacorp-sdk` ^0.1.1), 18 (`@next/bundle-analyzer` ^16.0.8), 27 (`@trigger.dev/sdk` 4.4.1), 37 (`nanoid` ^5.1.6, que também está no catálogo em `package.json:65`), 43 (`react-dropzone`), 46 (`react-webcam`), 58 (`@playwright/test`), 61 (`@trigger.dev/build` 4.4.1); `apps/email/package.json` linhas 14 (`@react-email/components` 1.0.1), 15 (`@react-email/preview-server` 5.0.5), 18 (`react-email` 5.0.5). No root, `typescript` ^5.9.3 aparece direto (`package.json:39`) e no catálogo (`:82`).
4. **Tarefas do Turbo sem definição**: o root chama `turbo start` (`package.json:12`), `turbo translate` (`:16`) e `turbo boundaries` (`:17`), mas `turbo.json` só define `build`, `lint`, `typecheck`, `clean`, `dev` (`turbo.json:5`, `:28`, `:31`, `:34`, `:37`). Nenhum `apps/web` ou `apps/email` tem script com esses nomes (`apps/web/package.json:5-13`; `apps/email/package.json:5-12`). Pacotes `packages/*` não foram lidos.
5. **Env do Turbo × env do AGENTS**: `turbo.json` declara `POSTGRES_*` e `SUPABASE_*` (`turbo.json:8-25`); `AGENTS.md` lista `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `AI_GATEWAY_API_KEY` (`AGENTS.md:155-161`), que não estão no `turbo.json`. Risco: variáveis fora da lista podem ficar fora do hash de cache do Turbo (comportamento do Turbo não verificado aqui).
6. **Pasta `docs/` inexistente**: `AGENTS.md:125` diz que `docs/` tem specs e docs da BigDataCorp; a listagem da raiz não tem `docs/`, e as specs estão em `specs/` (`AGENTS.md:33`; listagem).
7. **Versões de AI SDK possivelmente incompatíveis (a verificar)**: `@ai-sdk/openai` ^1 no catálogo (`package.json:46`) enquanto `ai` é ^6 (`package.json:56`) e `CLAUDE.md:10` diz "AI SDK v6 (`ai`, `@ai-sdk/openai`)". Não confirmado: o `bun.lock` não foi lido (lockfile fora do escopo).
8. **Pré-release no catálogo**: `@ai-sdk/react` ^3.0.0-beta.96 (`package.json:47`).
9. **Descrição de lint/format**: `AGENTS.md:17-18` diz "Biome check" direto, mas os scripts chamam `ultracite` (`package.json:7-8`).
10. **Referência cruzada a arquivo não confirmado**: `AGENTS.md:51` manda ver `.claude/CLAUDE.md` para "full code standards"; o `CLAUDE.md` da raiz é outro arquivo (auto-gerado, "Last updated: 2026-02-25", `CLAUDE.md:3`). Existência de `.claude/CLAUDE.md`: não confirmada (teto).
11. **Dependência circular no root**: `"dependencies": { "xend": "." }` (`package.json:94-95`), auto-referência sem uso evidente.

## Lacunas
- `.github/workflows/*.yml` (CI) — não listados nem lidos. Motivo: teto de checagens (25/25). Consequência: versões de Node/Bun/Python/Go no CI e jobs de deploy não confirmados.
- `.claude/CLAUDE.md` — existência não confirmada. Motivo: teto de checagens.
- `apps/web/tsconfig*.json` — existência não confirmada. Motivo: teto de checagens.
- `supabase/scripts/generate-types.ts`, `supabase/scripts/seed.ts` (referenciados em `package.json:25-26`), `apps/email/export-supabase-templates.ts` (`apps/email/package.json:9`), `packages/ui` (`package.json:18-19`), `supabase/migrations/` (`AGENTS.md:32`), `packages/supabase/src/env.ts` (`AGENTS.md:164`), `.env.example` (`AGENTS.md:152`), `apps/web/src/workflows/` (`AGENTS.md:136`) — caminhos citados, não checados. Motivo: teto de checagens.
- `packages/*/package.json` (kyc, mailer, supabase, ui) — existem (checagem de existência feita), conteúdo não lido. Motivo: fora do escopo (manifests de pacote não entram no passo 4).
- `packages/*` `AGENTS.md`/`CLAUDE.md` — checados, não existem.
- `AGENTS.md:167-268` (seção "Ultracite Code Standards", boilerplate da ferramenta) — só títulos via Grep. Motivo: fora do escopo.
- `AGENTS.md:41-42` — linhas em branco/fechamento de bloco; sem conteúdo relevante.
- `GEMINI.md`, `opencode.json`, `.mcp.json`, `README.md`, `.betterrc.json` — existência pela listagem da raiz; não lidos. Motivo: fora do escopo de leitura (`GEMINI.md` e `README.md` por regra da skill).
- `biome.jsonc`, `turbo.json` (lido), `.husky/`, `.github/` (dir), `.specify/`, `.agents/`, `.codex/`, `.gemini/`, `.impeccable/`, `.vscode/`, `scripts/`, `specs/`, `tooling/` — existência pela listagem; conteúdo não lido. Motivo: fora do escopo (configs de lint/format e pastas de processo).
- `bun.lock` — não lido. Motivo: lockfile, fora do escopo.
- Python e Go — nenhum manifest encontrado no nível 0 pela listagem. Os manifests dentro de `packages/*` não foram checados (teto de checagens).
