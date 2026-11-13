# Dossiê — hedglobal-plataform

Lidos: 14 arquivos (~690 linhas via Read; ~45 linhas de saída de Grep de contagem não contam) · Checagens de existência: 9 (Glob) · Teto atingido: não
Arquivos lidos: AGENTS.md, CLAUDE.md, package.json, turbo.json, .github/workflows/ci.yml, .github/workflows/deploy.yml, .github/workflows/imagem.yml, .github/workflows/monitor.yml, .opencode/package.json, .ds-sync/package.json, apps/console/CLAUDE.md, apps/console/package.json, apps/console/tsconfig.json, apps/landing/package.json

## Stacks presentes
- **Node.js 24 + npm 11**: CI usa `node-version: 24` (`.github/workflows/ci.yml:65`), `cache: npm` (`ci.yml:66`), `npm ci` (`ci.yml:69`); `packageManager: npm@11.13.0` (`package.json:5`).
- **Turborepo**: `turbo ^2.11.5` (`package.json:31`); `ui: "tui"` (`turbo.json:3`); workspaces `apps/*`, `packages/*` (`package.json:7-10`).
- **Next.js 16 / React 19 (console)**: `next ^16.3.8` (`apps/console/package.json:21`); `react ^19.2.4` (`apps/console/package.json:23`); porta 3100 (`apps/console/package.json:6-8`); `src/proxy.ts` como middleware do Next 16 (`apps/console/CLAUDE.md:56`).
- **TypeScript 7.0.2**: `apps/console/package.json:33`; config `target ES2022`, `moduleResolution: bundler`, `noUncheckedIndexedAccess` (`apps/console/tsconfig.json:3,12,18`).
- **Vitest 3.2.7**: `apps/console/package.json:34`; `test` = `vitest run` (`apps/console/package.json:10`); e2e via `vitest.e2e.config.ts` (`apps/console/package.json:12`).
- **Landing (Vercel, serverless, sem Next/React)**: `apps/landing/package.json:11` (`vercel dev`), `:8-9` (`build.mjs`); envio de e-mail por Resend `^4.0.0` (`apps/landing/package.json:15`); `pg ^8.23.0` (`:16`).
- **PostgreSQL (SQL)**: CI com `postgres:18` (`ci.yml:39`); `DATABASE_URL` (`ci.yml:54`); `pg ^8.23.0` (`package.json:30`, `apps/console/package.json:22`); `embedded-postgres ^18.4.0-beta.17` (`package.json:29`); migrations em `supabase/migrations/` (0001-0029 na listagem, sem 0016; não lidas); `apps/console/CLAUDE.md:83` cita migration 0013.
- **Clerk (auth)**: `@clerk/nextjs ^7.9.5` (`apps/console/package.json:15`); papéis `mesa`/`cliente` via Organizations (`apps/console/CLAUDE.md:53-62`).
- **Dinheiro e blockchain**: `decimal.js 10.6.0` (`apps/console/package.json:20`), regra "Dinheiro é Decimal" (`apps/console/CLAUDE.md:20-25`); `viem ^2.56.9` (`apps/console/package.json:25`); MEXC como fonte de cotação (`apps/console/CLAUDE.md:30-34`).
- **Validação**: `zod 4.6.5` (`apps/console/package.json:26`).
- **Email**: `@react-email/components ^1.0.12` e `@react-email/render ^2.1.0` (`apps/console/package.json:16-17`).
- **Observabilidade**: `@sentry/nextjs ^10.75.3` (`apps/console/package.json:18`); healthz profundo monitorado (`.github/workflows/monitor.yml:35`).
- **Python**: há código Python no repo: CI recusa supressão de `# noqa` "embutida no código Python" (`ci.yml:109-113`, via `packages/ai-harness/bin/harness.js`, listagem).
- **Containers / deploy**: `apps/console/Dockerfile` (listagem; `imagem.yml:60`), imagem em GHCR com SBOM e proveniência (`imagem.yml:57-66`); deploy manual por SSH (`deploy.yml:94-107`).
- **Segurança em CI**: gitleaks em imagem fixada por digest (`ci.yml:130-134`); `npm audit --omit=dev --audit-level=high` (`ci.yml:74`).

## Comandos
- dev (raiz): `npm run dev` → `turbo run dev` (`package.json:16`); dev local landing: `node --env-file=.env apps/landing/scripts/dev-server.mjs` (`package.json:17`)
- build (raiz): `turbo run build` (`package.json:12`); console: `next build` (`apps/console/package.json:7`)
- teste (raiz): `turbo run test` (`package.json:13`); console: `vitest run` (`apps/console/package.json:10`); e2e console: `vitest run -c vitest.e2e.config.ts` (`apps/console/package.json:12`); landing: `node --test` (`apps/landing/package.json:10`)
- typecheck (raiz): `turbo run typecheck` (`package.json:14`); console: `tsc --noEmit` (`apps/console/package.json:9`)
- lint (raiz): `turbo run lint` (`package.json:15`); nenhum app lido declara `lint` (ver Divergências)
- migrações: `npm run migrate` → `node --env-file-if-exists=.env scripts/migrate.mjs` (`package.json:20`); `migrate:dry` (`package.json:21`); `migrate:down` (`package.json:25`)
- banco local e seed: `db:local` → `scripts/pg-local.mjs` (`package.json:18`); `db:seed` = `migrate` + `semear:demo` (`package.json:19`, `:26`)
- harness: `harness:sync`, `harness:check-noqa`, `harness:setup-hooks` via workspace `@xend/ai-harness` (`package.json:22-24`)
- auth check: `node scripts/auth-check.mjs` (`apps/console/package.json:11`)
- landing i18n/site: `node build.mjs` (`apps/landing/package.json:8`), `node build.mjs --publish` (`:9`), `vercel dev` (`:11`)
- CI (`ci.yml`): `npm ci` (`:69`); `npm audit --omit=dev --audit-level=high` (`:74`); `npm run migrate` (`:77`) e segunda execução para idempotência (`:82`); `npx turbo run test typecheck --ui=stream` (`:87`); verificação de linguagem regulada (`:102-103`); `node packages/ai-harness/bin/harness.js check --all` (`:113`)
- deploy (manual, `deploy.yml`): `implantar <imagem> <tag>` no servidor via SSH (`:100`), `versao` (`:114`), `logout` (`:107`), healthz externo (`:124`)

## Regras/convenções declaradas
- ALWAYS atualizar STATE.md, PROJECT.md e ROADMAP.md em `.specs/` após concluir feature (`AGENTS.md:1`; idêntico em `CLAUDE.md:1`)
- ALWAYS atualizar tasks.md e spec.md da pasta da feature (`AGENTS.md:3`)
- ALWAYS /compact no meio da tarefa e /clear ao trocar de tarefa (`AGENTS.md:5`)
- ALWAYS checar commits e PRs recentes quando pedirem o que foi resolvido (`AGENTS.md:7`)
- NEVER escrever `# noqa` em código; ALWAYS checar o código escrito antes de commit (`AGENTS.md:9`; CI aplica em `ci.yml:109-113`)
- Linguagem client-facing: NUNCA "câmbio", "cambial" ou "NDF" em telas, boletas, e-mails, formulário público ou landing (`apps/console/CLAUDE.md:7-9`; CI falha em `ci.yml:100-107`)
- Dinheiro é Decimal: `parseFloat`/`Number()` sobre valor financeiro é proibido; usar `dec()` de `src/lib/money.ts` (`apps/console/CLAUDE.md:24-25`); valor monetário em JSON viaja como string (`:22-23`)
- Fonte de USD/BRL: fair price do perpétuo BRL_USDT da MEXC invertido; não trocar sem alinhar com a perna de hedge (`apps/console/CLAUDE.md:32-36`); cotação recusada após `HED_REFERENCIA_MAX_IDADE_S` (60 s) (`:38-39`)
- Modelo v4 de precificação duplicado em 3 lugares: "Mudou aqui, muda lá" (`apps/console/CLAUDE.md:43-48`)
- Gate de auth aplicado duas vezes (proxy e página/rota) (`apps/console/CLAUDE.md:55-58`); autorização na camada de dados via `Escopo`, não na UI (`:64-67`); contrato fora do escopo e inexistente devolvem o mesmo 404 (`:69-70`)
- Tela do cliente lê do banco, nunca de `tests/fixtures/` (`apps/console/CLAUDE.md:74-80`)
- `HED_AUTH_MODE=local` é ignorado com `NODE_ENV=production` (`apps/console/CLAUDE.md:89-92`)
- `/interno` só para mesa; ações que operam exigem `org:admin` (`apps/console/CLAUDE.md:96-99`)
- Deploy só a partir de `main` (environment `servidor` "só aceita `main`", `deploy.yml:5`, `:43`); a tag tem de ser SHA completo de commit que esteja em `main` (`deploy.yml:53`, `:62-67`)
- Imagem: tag é o SHA do commit; nunca implantar `latest` (`imagem.yml:4-6`)
- CI só leitura: `permissions: contents: read` (`ci.yml:25-26`); teste pulado no CI é falha (`ci.yml:88-95`)
- `DATABASE_URL` precisa estar em `env` do turbo para os testes de banco não pularem (`turbo.json:32-34`; `ci.yml:88-91`)

## Divergências e inconsistências
1. **Escopos de pacote misturados**: `package.json:22-24` usa `@xend/ai-harness` e `apps/console/package.json:19` usa `"@xend/ui": "*"`, enquanto `apps/console/package.json:2` usa `@hedglobal/console` e `apps/landing/package.json:2` usa `@hedglobal/landing`. Raiz: `hedglobal-platform` (`package.json:2`).
2. **Runtime do CI × tipos do Node**: CI roda Node 24 (`.github/workflows/ci.yml:65`); `apps/console/package.json:29` pina `@types/node 22.18.1`.
3. **Pins exatos misturados com ranges no mesmo arquivo**: `apps/console/package.json` pina `decimal.js 10.6.0` (`:20`), `zod 4.6.5` (`:26`), `@types/node 22.18.1` (`:29`), `@types/react 19.3.0` (`:31`), `@types/react-dom 19.3.0` (`:32`), `typescript 7.0.2` (`:33`), `vitest 3.2.7` (`:34`), e usa `^` em `:15-18`, `:21-25`, `:30`. Também `.opencode/package.json:3` pina `1.18.18` e `.ds-sync/package.json` usa `^`.
4. **Pré-release no devDeps da raiz**: `embedded-postgres ^18.4.0-beta.17` (`package.json:29`).
5. **Task de turbo sem uso**: `turbo.json:44-46` declara `check`; nenhum script lido da raiz (`package.json:11-27`) nem o CI (`ci.yml`) a chama.
6. **Task `lint` sem script nos apps lidos**: `package.json:15` e `turbo.json:19-23` (`^lint`); `apps/console/package.json:5-13` e `apps/landing/package.json:7-13` não declaram `lint`. Pacotes não lidos (ver Lacunas).
7. **Instruções duplicadas**: `CLAUDE.md:1-9` repete as mesmas 5 regras de `AGENTS.md:1-9` (texto idêntico hoje); `AGENTS.md:11-20` acrescenta bloco do Turborepo. Risco de divergência futura.
8. **Migrations com lacuna na numeração**: `supabase/migrations/` tem 0001-0015 e 0017-0029 (listagem; `0016*` não existe). Pode ser intencional; não verificado.
9. **Landing sem script `build`**: `turbo.json:5-18` (`build`) não tem alvo em `apps/landing/package.json` (só `build:i18n` e `site`, `:7-13`). Observação.
10. **Nome de pacote UI não confirmado**: `imagem.yml:14` observa `packages/ui/**`; a dependência é `@xend/ui` (`apps/console/package.json:19`). Não confirmado porque `packages/ui/package.json` não foi lido (regra de pacotes).

## Lacunas
- `packages/ai-harness/*` e `packages/ui/*` — manifests não lidos (pacotes fora da leitura). Impede confirmar scripts `lint`/`sync`/`check` do `@xend/ai-harness` e o nome do pacote `@xend/ui`.
- `apps/console/next.config.ts`, `apps/console/vitest.config.ts`, `apps/console/vitest.e2e.config.ts`, `apps/console/Dockerfile`, `apps/console/vercel.json`, `apps/landing/vercel.json` — existem (listagem); não lidos (motivo: fora do escopo; são configs).
- `scripts/migrate.mjs`, `scripts/pg-local.mjs`, `scripts/semear-demo.mjs`, `scripts/auth-check.mjs`, `apps/landing/scripts/dev-server.mjs`, `apps/landing/build.mjs`, `apps/console/deploy/porta-do-ci.sh` — existem (listagem); não lidos (fora do escopo; código).
- `apps/console/src/**` (proxy.ts, lib/auth/acesso.ts, lib/money.ts, lib/pricing.ts, lib/db/*.ts, public/solicitacao.html, tests/*.ts) — existem (listagem); não lidos (código-fonte).
- `.specs/features/*/` (`spec.md`, `tasks.md`) — existem (listagem); não lidos (specs/docs fora do escopo). `.specs/STATE.md`, `.specs/PROJECT.md`, `.specs/ROADMAP.md` — existem (listagem).
- `.github/gitleaks.toml`, `package-lock.json` — existem (listagem); não lidos (lockfile e config de scanner).
- `.env`/`.env*` — não lidos (nunca); não há `.env.example` checado na raiz.
- `.gitignore` — não lido (fora da lista).
- Ausentes (listagem): `biome.json*`, `eslint.config.*`, `.prettierrc*`, `Makefile`, `justfile`, `Dockerfile` na raiz, `.nvmrc`, `.tool-versions`, `vitest*.config.*` na raiz. Sem config de lint na raiz.
- Versão de Node declarada em `engines` de algum package.json: não verificada nos manifests lidos (nenhum `engines` nos arquivos lidos).
- Turbo: `docs/README.md` mencionado em `AGENTS.md:17` pertence ao pacote instalado do turbo, não ao repo; não lido.
