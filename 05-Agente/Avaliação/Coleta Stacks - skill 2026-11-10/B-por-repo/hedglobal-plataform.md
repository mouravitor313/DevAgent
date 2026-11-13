# Dossiê — hedglobal-plataform

Lidos: 12 arquivos (~683 linhas, somando os trechos lidos) · Checagens de existência: ~28 (contagem aproximada) · Teto atingido: sim (checagens: passou de 25 em ~3 por causa de globs recursivas; leitura dentro do teto)
Arquivos lidos: `AGENTS.md`, `CLAUDE.md` (raiz), `apps/console/CLAUDE.md`, `package.json` (raiz), `turbo.json`, `apps/console/package.json`, `apps/console/tsconfig.json`, `apps/landing/package.json`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/workflows/imagem.yml`, `.github/workflows/monitor.yml`

Estrutura observada (listagem): `apps/` = `api`, `console`, `landing`; `packages/` = `ai-harness`, `ui`; `supabase/migrations/` = 29 arquivos; `scripts/` = 5 `.mjs`; `.specs/` (STATE, PROJECT, ROADMAP, HANDOFF, features…).

## Stacks presentes
- **TypeScript**: `typescript` 7.0.2 em devDeps (`apps/console/package.json:33`); `tsconfig` estrito com `noUncheckedIndexedAccess` (`apps/console/tsconfig.json:12`). Contagem de rastreados: 296 `.ts` + 101 `.tsx` (`git ls-files`, só listagem).
- **Next.js 16 + React 19** (console): `"next": "^16.3.8"` (`apps/console/package.json:21`); `react`/`react-dom` `^19.2.4` (`apps/console/package.json:23-24`); "Next 16" citado em `apps/console/CLAUDE.md:56`. Scripts `next dev -p 3100` / `next start -p 3100` (`apps/console/package.json:6,8`).
- **Clerk** (auth, Organizations): `@clerk/nextjs` `^7.9.5` (`apps/console/package.json:15`); gate em `apps/console/CLAUDE.md:55-58`.
- **PostgreSQL 18**: serviço `postgres:18` no CI (`.github/workflows/ci.yml:39`); driver `pg` (`apps/console/package.json:22`, `package.json:30`); `embedded-postgres` `^18.4.0-beta.17` em devDeps (`package.json:29`) para banco local.
- **SQL**: 57 arquivos `.sql` rastreados (listagem); 29 migrations em `supabase/migrations/` (listagem), ex. `0013_proposal_release.sql` (listagem); migrations aplicadas por `scripts/migrate.mjs` (`package.json:20`).
- **Node.js 24** (CI): `node-version: 24` (`.github/workflows/ci.yml:65`).
- **npm** como gerenciador: `"packageManager": "npm@11.13.0"` (`package.json:5`); `npm ci` no CI (`ci.yml:69`).
- **Turborepo**: `turbo` `^2.11.5` (`package.json:31`); pipeline em `turbo.json`.
- **JavaScript (scripts ESM)**: `.mjs` em `scripts/` (`package.json:17-26`); landing é `"type": "module"` (`apps/landing/package.json:6`).
- **Landing (site estático + API serverless)**: `resend` `^4.0.0` (`apps/landing/package.json:15`); `pg` (`apps/landing/package.json:16`); `vercel dev` (`apps/landing/package.json:11`); `apps/landing/vercel.json` existe (listagem).
- **Vitest**: console `vitest` 3.2.7 (`apps/console/package.json:34`), `test: vitest run` (`:10`), e2e via `vitest.e2e.config.ts` (`:12`).
- **Financeiro**: `decimal.js` 10.6.0 (`apps/console/package.json:20`), `viem` `^2.56.9` (`:25`).
- **Docker / GHCR**: `apps/console/Dockerfile` (listagem; referenciado em `.github/workflows/imagem.yml:60`); imagem `ghcr.io/<owner>/hedglobal-console` (`imagem.yml:50`, `deploy.yml:69`).
- **Python**: 0 arquivos `.py` rastreados (`git ls-files`). Vínculo único: passo de CI que checa supressão de linter "no código Python" (`ci.yml:109-113`). Ver divergência 5.
- **Go**: 0 arquivos `.go` rastreados (`git ls-files`). Sem vínculo no que foi lido.

## Comandos
- Raiz, build/test/typecheck/lint/dev: `turbo run build|test|typecheck|lint|dev` (`package.json:12-16`).
- Raiz, banco: `npm run db:local` → `node scripts/pg-local.mjs` (`package.json:18`); `db:seed` = migrate + semear (`package.json:19`); `migrate` → `node --env-file-if-exists=.env scripts/migrate.mjs` (`package.json:20`); `migrate:dry` (`:21`); `migrate:down` (`:25`); `semear:demo` (`:26`).
- Raiz, harness: `harness:sync` (`:22`), `harness:check-noqa` (`:23`), `harness:setup-hooks` (`:24`).
- Raiz, dev local: `dev:local` → `node --env-file=.env apps/landing/scripts/dev-server.mjs` (`package.json:17`).
- Console: `dev`, `build` (`next build`), `start`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `auth:check` (`node scripts/auth-check.mjs`), `test:e2e` (`vitest run -c vitest.e2e.config.ts`) — `apps/console/package.json:6-12`.
- Landing: `build:i18n` (`node build.mjs`), `site` (`node build.mjs --publish`), `test` (`node --test`), `dev` (`vercel dev`), `dev:local` — `apps/landing/package.json:8-12`.
- CI: `npm audit --omit=dev --audit-level=high` (`ci.yml:74`); `npm run migrate` duas vezes, a segunda deve dizer "já estava em dia" (`ci.yml:77,82`); `npx turbo run test typecheck --ui=stream` com falha se houver teste pulado (`ci.yml:87-95`); `node packages/ai-harness/bin/harness.js check --all` (`ci.yml:113`); gitleaks via Docker (`ci.yml:132-134`).
- Deploy: `ssh … "implantar $IMAGEM $TAG"` via porteiro (`deploy.yml:100`); porteiro em `apps/console/deploy/porta-do-ci.sh` (existe, listagem; referido em `deploy.yml:2`).
- Lint/format: nenhum script `lint` nos manifests lidos (console, landing). Nenhuma config de lint/format na raiz nem em `apps/console` (listagem).

## Regras/convenções declaradas
- Atualizar `STATE.md`, `PROJECT.md` e `ROADMAP.md` em `.specs/` ao concluir feature (`AGENTS.md:1`; idem `CLAUDE.md:1`).
- Atualizar `tasks.md` e `spec.md` da feature ao concluir tarefas (`AGENTS.md:3`).
- `/compact` no meio da tarefa, `/clear` ao trocar de tarefa (`AGENTS.md:5`).
- Ao rastrear o que foi resolvido, checar commits e PRs recentes (`AGENTS.md:7`).
- **NUNCA** escrever comentário/flag `# noqa` no código; checar antes do commit (`AGENTS.md:9`).
- Console, linguagem client-facing: proibido "câmbio", "cambial" e "NDF" em telas, boletas, e-mails, formulário e landing; verificação por grep, que a CI também roda (`apps/console/CLAUDE.md:5-18`; `ci.yml:97-107`).
- Console, dinheiro é `Decimal`: valor monetário viaja como string em JSON; `parseFloat`/`Number()` proibido; usar `dec()` de `src/lib/money.ts` (`apps/console/CLAUDE.md:20-25`). Adapters convertem com `asDec()` (`:27-28`).
- Console, fonte da cotação USD/BRL: fair price do perpétuo BRL_USDT da MEXC, invertido; não trocar sem alinhar com a perna de hedge; recusada após `HED_REFERENCIA_MAX_IDADE_S` (60 s) (`apps/console/CLAUDE.md:30-39`).
- Console, modelo v4 de precificação em dois lugares (`src/lib/pricing.ts` e JS de `public/solicitacao.html`); mudou em um, muda no outro (`apps/console/CLAUDE.md:41-46`). Testes de boleta travam números (`:48-51`).
- Console, autorização: gate em funções puras aplicado duas vezes (`src/proxy.ts` e dentro da rota/página) (`apps/console/CLAUDE.md:55-58`); autorização na camada de dados via `Escopo` (`:64-67`); contrato fora do escopo e inexistente devolvem o mesmo 404 (`:69-70`).
- Console, modo local `HED_AUTH_MODE=local` é ignorado com `NODE_ENV=production` (`apps/console/CLAUDE.md:89-92`).
- Console, painel `/interno` só para mesa; rotas que operam exigem `org:admin` e aceitam só JSON da mesma origem (`apps/console/CLAUDE.md:96-99`).
- CI, permissões mínimas: `contents: read` por padrão e `persist-credentials: false` (`ci.yml:21-26,61`).
- CI, gitleaks sobre o histórico inteiro; exceções só em `.github/gitleaks.toml` (`ci.yml:115-117`; arquivo existe, listagem).
- Deploy: manual, só de `main` e de SHA de 40 hex já em `main`; ambiente `servidor` (`deploy.yml:4-5,58-67`); migrations antes de subir o app (`deploy.yml:10-12`).

## Divergências e inconsistências
1. **`apps/api` no workspace sem código**: `package.json:8` declara `apps/*` como workspace, mas `apps/api/` contém só `.turbo/` (listagem `ls -la`; sem `package.json`). Resíduo ou app não migrado.
2. **Node de runtime × tipos**: CI roda Node 24 (`.github/workflows/ci.yml:65`) e `@types/node` está fixado em `22.18.1` (`apps/console/package.json:29`). Possível descompasso de tipos; confirmar com o `.nvmrc`/`engines` (não lidos, ver Lacunas).
3. **Task `lint` sem script**: `turbo.json:19-23` e `package.json:15` (`turbo run lint`) existem, mas nenhum manifest lido (console, landing) tem script `lint`. Só o `packages/ui` ficou de fora da leitura.
4. **Task `check` no turbo sem script raiz**: `turbo.json:44-46` declara `check`; a raiz não tem `check` (só `harness:check-noqa`, `package.json:23`, que chama o workspace `@xend/ai-harness`).
5. **Verificação "Python" sem Python**: o passo de CI diz "código Python" (`ci.yml:109-113`), mas há 0 arquivos `.py` rastreados (`git ls-files`). O passo passa por construção; verificar se `harness.js check --all` também varre outros tipos.
6. **Instruções de agente duplicadas**: `CLAUDE.md` da raiz (9 linhas) repete as 5 primeiras regras de `AGENTS.md:1-9`; `AGENTS.md` acrescenta o bloco turborepo (`AGENTS.md:11-20`, gerado pela ferramenta). Os dois arquivos têm terminação CRLF. Regra nova precisa ir nos dois, ou a divergência começa.
7. **Pins mistos**: exatos em `apps/console/package.json:20,26,29,31,33,34` (`decimal.js` 10.6.0, `zod` 4.6.5, `@types/node` 22.18.1, `@types/react` 19.3.0, `typescript` 7.0.2, `vitest` 3.2.7) e ranges `^` no resto (ex.: `next` `^16.3.8`, `:21`). Mistura intencional? Não documentado.
8. **Pré-release em devDep de raiz**: `embedded-postgres` `^18.4.0-beta.17` (`package.json:29`). Versão beta no ambiente local; o CI usa `postgres:18` (`ci.yml:39`). Mesma major, mas beta.
9. **Versão de TypeScript**: `typescript` `7.0.2` (`apps/console/package.json:33`). Confirmar se é a versão estável esperada pelo time; não verificado externamente.

## Lacunas
- `packages/ai-harness/package.json` e `packages/ui/package.json` — não lidos: motivo "pacote, manifest fora do nível permitido". Nome `@xend/ai-harness` só inferido de `package.json:22`. Scripts `sync`/`check`/`setup-hooks` não confirmados.
- `packages/ui/tsconfig.json` existe (listagem) — não lido: motivo "pacote".
- `apps/console/next.config.ts`, `apps/console/Dockerfile`, `apps/console/vercel.json`, `apps/console/vitest.config.ts`, `apps/console/vitest.e2e.config.ts`, `apps/landing/vercel.json` — existem (listagem); não lidos: "só existência" (regra). Consequência: a versão de Node do `Dockerfile` não foi comparada com o CI.
- `.nvmrc`, `.python-version`, `.tool-versions`, `engines`: não conferidos (não existem na listagem da raiz; `engines` não foi lido).
- `.env` (raiz) existe — não lido (segredo). `.env.example` existe — não lido.
- `.specs/` (`STATE.md`, `PROJECT.md`, `ROADMAP.md`) existe (listagem) — não lido: "fora do escopo" (doc de processo).
- `README.md`, `SECURITY.md`, `CHANGELOG.md`, `apps/console/README.md`, `apps/console/deploy/*.md` — fora do escopo (documentação).
- `.github/dependabot.yml`, `.github/CODEOWNERS`, `.github/gitleaks.toml` — existem; não lidos (só o gitleaks foi citado pelo CI).
- `apps/console/tests/pricing.test.ts` — não conferido. `apps/console/tests/boletas.test.ts` existe (listagem).
- `apps/landing/build.mjs`, `apps/landing/scripts/dev-server.mjs`, `scripts/pg-local.mjs`, `scripts/migrate.mjs`, `scripts/semear-demo.mjs` — existem (listagem); não lidos.
- `packages/ai-harness/bin/harness.js` — existe (listagem). Uma linha foi vista por Grep (`harness.js:32`: "check staged Python files for forbidden # noqa"), o que está fora da regra de leitura (código-fonte); usar só como indício.
- Lint/format: nenhuma config na raiz nem em `apps/console` (listagem). `landing`, `ui` e `ai-harness` não conferidos.
- Teto de checagens: ~28 contra 25. Excesso causado por globs recursivas (ver nota abaixo); não afetou leituras.

**Nota de processo (violações da própria skill):**
- `Glob "*"` na raiz e `Glob` com braces em `apps/console` retornaram listagens recursivas (54.975 e dezenas de entradas em `.next/` e `node_modules/`). Nenhum conteúdo foi lido; a regra de busca ampla foi violada.
- `git ls-files` foi usado só para contar extensões (metadados, sem conteúdo).
- Um `Grep` por `noqa` em `packages/ai-harness/bin/harness.js` saiu do escopo de leitura (ver Lacunas).
