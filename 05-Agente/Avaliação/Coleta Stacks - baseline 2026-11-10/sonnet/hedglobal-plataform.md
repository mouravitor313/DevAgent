# Dossiê: hedglobal-plataform (C:\Users\Pedro\Projetos\hedglobal-plataform)

## Stacks presentes
- **TypeScript**: apps/console com `typescript 7.0.2` (apps/console/package.json:33), `strict: true` + `noUncheckedIndexedAccess` (apps/console/tsconfig.json:11-12). Não há tsconfig na raiz nem em apps/landing (listagem).
- **Next.js**: console usa `next ^16.3.8` (apps/console/package.json:21), `react ^19.2.4` (:23), scripts `next dev/build/start` (:6-8); `plugins: next` (apps/console/tsconfig.json:23-26); apps/console/CLAUDE.md:56 "middleware do Next 16" (`src/proxy.ts`).
- **JavaScript**: apps/landing é ESM puro (`"type": "module"`, apps/landing/package.json:6), build `node build.mjs` (:8), testes `node --test` (:10); scripts raiz em `.mjs` (package.json:17-26).
- **SQL / PostgreSQL**: `pg ^8.23.0` (package.json:30; apps/console/package.json:22; apps/landing/package.json:16); `embedded-postgres ^18.4.0-beta.17` (package.json:29); migrations por `scripts/migrate.mjs` (package.json:20); CI sobe `postgres:18` (.github/workflows/ci.yml:39); `supabase/` contém só `migrations` (listagem; sem config.toml).
- **Python**: nenhum manifest nos arquivos permitidos, mas ci.yml:109-113 refere "código Python" (check de `# noqa`) e AGENTS.md:9 proíbe `# noqa` — sem Python confirmado. **Go**: sem `go.mod`.
- Gerenciador/monorepo: npm (`"packageManager": "npm@11.13.0"` package.json:5), workspaces `apps/*`, `packages/*` (package.json:7-10); Turborepo `^2.11.5` (package.json:31; turbo.json:1-52). CI usa Node 24 (ci.yml:65).
- Auth: Clerk (`@clerk/nextjs ^7.9.5` apps/console/package.json:15; apps/console/CLAUDE.md:55); Sentry (:18); `decimal.js 10.6.0` (:20); `viem ^2.56.9` (:25); `zod 4.6.5` (:26); Vitest 3.2.7 (:34); `@react-email/*` (:16-17); `resend ^4.0.0` na landing (apps/landing/package.json:15).
- Apps: `apps/api` existe mas sem manifest nem arquivos (apenas `.turbo`, listagem); `apps/landing` tem `api/` (funções serverless) e `vercel.json` (listagem; apps/landing/package.json:5 "contact-form serverless API").
- Deploy: imagem Docker `apps/console/Dockerfile` publicada no GHCR (.github/workflows/imagem.yml:60-66), deploy por SSH (deploy.yml:94-100).

## Comandos (só o que está escrito)
- Build: `turbo run build` (package.json:12); console `next build` (apps/console/package.json:7); landing `node build.mjs` / `node build.mjs --publish` (apps/landing/package.json:8-9).
- Dev: `turbo run dev` (package.json:16); `dev:local` = `node --env-file=.env apps/landing/scripts/dev-server.mjs` (package.json:17); console `next dev -p 3100` (apps/console/package.json:6); landing `vercel dev` (apps/landing/package.json:11).
- Teste: `turbo run test` (package.json:13); console `vitest run` (apps/console/package.json:10), e2e `vitest run -c vitest.e2e.config.ts` (:12); landing `node --test` (apps/landing/package.json:10).
- Typecheck: `turbo run typecheck` (package.json:14); console `tsc --noEmit` (apps/console/package.json:9).
- Lint: `turbo run lint` (package.json:15); nenhum app define script `lint` (apps/console/package.json:5-13; apps/landing/package.json:7-13).
- Formatação: nenhum comando declarado.
- Migração/banco: `npm run migrate` (`node --env-file-if-exists=.env scripts/migrate.mjs`, package.json:20), `migrate:dry` (:21), `migrate:down` (:25), `db:local` (:18), `db:seed` = `npm run migrate && npm run semear:demo` (:19), `semear:demo` (:26).
- Harness: `harness:sync`, `harness:check-noqa`, `harness:setup-hooks` (package.json:22-24); CI chama `node packages/ai-harness/bin/harness.js check --all` (ci.yml:113).
- Outros: `auth:check` (apps/console/package.json:11). Checagem client-facing: `grep -rEni '[Cc]âmbi\w*|[Cc]ambial\w*|\bNDF\b' src public` (apps/console/CLAUDE.md:15).
- CI (ci.yml): `npm ci` (:69), `npm audit --omit=dev --audit-level=high` (:74), `npm run migrate` duas vezes para provar idempotência (:77, :82), `npx turbo run test typecheck --ui=stream` com falha se houver teste pulado (:87-95), gitleaks (:130-134). Outros workflows: imagem.yml (build/push GHCR em push na main, paths :12-18), deploy.yml (workflow_dispatch, :24), monitor.yml (cron `23 */6 * * *`, :17).

## Regras/convenções declaradas
AGENTS.md / CLAUDE.md da raiz (conteúdo idêntico nas linhas 1-9; o AGENTS.md ainda tem bloco Turborepo em :11-20):
- Atualizar STATE.md, PROJECT.md e ROADMAP.md em `.specs/` após concluir feature (AGENTS.md:1; CLAUDE.md:1).
- Atualizar tasks.md e spec.md da feature ao concluir tarefas (AGENTS.md:3; CLAUDE.md:3).
- `/compact` no meio da tarefa, `/clear` ao trocar de tarefa (AGENTS.md:5; CLAUDE.md:5).
- Checar commits e PRs recentes quando pedirem para rastrear o que foi resolvido (AGENTS.md:7; CLAUDE.md:7).
- NUNCA escrever `# noqa` (AGENTS.md:9; CLAUDE.md:9).
- Turborepo "NOT the Turborepo you know": ler `docs/README.md` do pacote `turbo` instalado antes de mudar config/comandos (AGENTS.md:13-17); bloco gerenciado pelo turbo, `agentGuidance: false` no turbo.json para opt-out (AGENTS.md:19).

apps/console/CLAUDE.md:
- Linguagem client-facing: proibido "câmbio", "cambial" e "NDF" em telas, boletas, e-mails, formulário e landing; CI roda a mesma busca (apps/console/CLAUDE.md:7-18).
- Dinheiro é Decimal: `decimal.js`, JSON monetário como string, `parseFloat`/`Number()` proibido, usar `dec()` de `src/lib/money.ts`; adapters MEXC convertem com `asDec()` (apps/console/CLAUDE.md:22-28).
- USD/BRL = fair price do perpétuo BRL_USDT da MEXC invertido; recusar cotação acima de `HED_REFERENCIA_MAX_IDADE_S` (60 s) (apps/console/CLAUDE.md:32-39).
- Modelo v4 em dois lugares (`src/lib/pricing.ts` e `public/solicitacao.html`); mudou aqui, muda lá; testes `tests/boletas.test.ts` e `tests/pricing.test.ts` travam valores (apps/console/CLAUDE.md:43-51).
- Clerk Organizations; gate em funções puras (`src/lib/auth/acesso.ts`) aplicadas em `src/proxy.ts` e na página/rota; papel mesa via `HED_ORGS_MESA`; sem organização, falha fechada (apps/console/CLAUDE.md:55-62).
- Autorização na camada de dados com `Escopo`; contrato fora de escopo e inexistente devolvem o mesmo 404 (apps/console/CLAUDE.md:64-70).
- Tela do cliente lê o banco (`src/lib/db/contratos.ts`, `propostas.ts`), não fixtures (apps/console/CLAUDE.md:74-80); proposta só aparece após liberação (`released_at`, migration 0013) (:82-85).
- `HED_AUTH_MODE=local` ignorado com NODE_ENV=production; `next start` não aceita modo local (apps/console/CLAUDE.md:89-92).
- `/interno` só mesa; rotas operacionais exigem `org:admin` e JSON de mesma origem (apps/console/CLAUDE.md:96-99).
- Soma-se ao `~/.claude/CLAUDE.md` e ao CLAUDE.md da raiz (apps/console/CLAUDE.md:3).

## Divergências e inconsistências
- `apps/api/` está vazio (sem manifest nem arquivos; só `.turbo`), apesar de ser app dentro do workspace `apps/*` (package.json:8).
- `typescript 7.0.2` (apps/console/package.json:33) é versão incomum frente à ^5.x do outro repo; `@types/react` e `@types/react-dom` fixados em `19.3.0` (:31-32) vs `react ^19.2.4` (:23) — verificar se as versões existem/alinham (não confirmável sem registry).
- `harness:check-noqa` (package.json:23) e o comentário do CI (ci.yml:109-113) falam em "código Python", mas não há manifest Python nos arquivos permitidos; a regra `# noqa` (AGENTS.md:9) parece herdada de outro repo (o xendmm tem texto quase idêntico em AGENTS.md:8).
- `apps/console/package.json:19` depende de `@xend/ui` (`*`), ao passo que o pacote raiz se chama `hedglobal-platform` e os apps `@hedglobal/*` (package.json:2; apps/console/package.json:2; apps/landing/package.json:2); `harness:*` usa workspace `@xend/ai-harness` (package.json:22-24). Mistura de escopos `@xend` e `@hedglobal`.
- `lint`: raiz roda `turbo run lint` (package.json:15) e turbo.json:19-23 define a task, mas nenhum workspace permitido tem script `lint`; não há linter/formatter declarado em nenhum manifest.
- turbo.json:3 `"ui": "tui"` é interativo; o CI contorna com `TURBO_UI: "false"` (ci.yml:55-56).
- `test` e `typecheck` no turbo.json dependem de `^build` (turbo.json:24-27, :36-39); apps/landing não tem `typecheck` (apps/landing/package.json:7-13).
- apps/landing/package.json:10 `node --test` sem script `build`; build/test do turbo (`build` em turbo.json:5) só cobre `build:i18n`/`site` por nome diferente — a task `build` não existe em apps/landing (apps/landing/package.json:7-13).
- Faixa de versões de Postgres: CI usa `postgres:18` (ci.yml:39), `embedded-postgres ^18.4.0-beta.17` (package.json:29); xendmm usa `postgres:16-alpine` (xendmm/api/docker-compose.yml:3).
- imagem.yml:15 observa `packages/ui/**` e `supabase/migrations/**` (:14-18); `packages/ui` existe (listagem). apps/console/CLAUDE.md:3 cita "regras globais em ~/.claude/CLAUDE.md" (referência externa ao repo).
- ci.yml:1-6 diz "21 dos testes do console são SQL"; contagem não verificável nos manifests.
- Contexto do console: apps/console/CLAUDE.md:76-79 refere `tests/fixtures/boletas/*.json`; a pasta `tests` existe (listagem), conteúdo não lido.

## Lacunas
- Nenhum README, código, `packages/*` (ai-harness, ui), `.specs`, `supabase/migrations`, `Dockerfile`, `next.config.ts`, `vitest.config.ts`, `vercel.json` (apps/console e apps/landing) lidos; versões reais de dependências transitivas e lockfile não conferidas.
- Não há linguagem Python ou Go confirmada; existência de Python no `packages/ai-harness` não verificada.
- Versão de Node: só CI (Node 24, ci.yml:65); sem `engines`/`.nvmrc` lidos.
- Detalhe de comandos do `ai-harness` (workspace `@xend/ai-harness`) não verificado.
- Linter/formatter (ESLint/Biome/Prettier): nenhum manifest declara; `.editorconfig` na raiz não lido.
- Conteúdo de `apps/landing/api/` (funções serverless) não lido.
