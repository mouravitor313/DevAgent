# Dossiê — hedglobal-plataform

Lidos: 11 arquivos (~640 linhas) · Checagens de existência: ~22 · Teto atingido: não.
Desvio de regra registrado: para confirmar o campo `name` de `packages/ai-harness/package.json` usei uma única busca (`Grep "name"`, 1 linha), o que a skill proíbe (pacotes não se leem). O valor encontrado foi `@xend/ai-harness`.
Arquivos lidos: `AGENTS.md` (inteiro), `CLAUDE.md` (inteiro), `package.json`, `turbo.json`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/workflows/imagem.yml`, `.github/workflows/monitor.yml`, `apps/console/CLAUDE.md`, `apps/console/package.json`, `apps/landing/package.json`.

## Stacks presentes
- **Node.js 24** no CI: `.github/workflows/ci.yml:65` (`node-version: 24`), cache npm em `:66`.
- **npm 11.13.0** como gerenciador: `package.json:5` (`packageManager`); `package-lock.json` (listagem). Workspaces `apps/*` e `packages/*`: `package.json:7-10`.
- **Turborepo ^2.11.5**: `package.json:31`; UI `tui` em `turbo.json:3`.
- **Next.js ^16.3.8** (console): `apps/console/package.json:21`; confirmado em `apps/console/CLAUDE.md:56` ("middleware do Next 16").
- **React ^19.2.4**: `apps/console/package.json:23-24`.
- **TypeScript 7.0.2** (console, versão exata): `apps/console/package.json:33`.
- **Vitest 3.2.7** (testes e E2E): `apps/console/package.json:34`; scripts em `:10` e `:12`.
- **Clerk ^7.9.5** (auth com Organizations): `apps/console/package.json:15`; `apps/console/CLAUDE.md:55`.
- **Sentry ^10.75.3**: `apps/console/package.json:18`.
- **decimal.js 10.6.0** (dinheiro): `apps/console/package.json:20`; `apps/console/CLAUDE.md:22`.
- **viem ^2.56.9**: `apps/console/package.json:25`.
- **Zod 4.6.5** (versão exata): `apps/console/package.json:26`.
- **PostgreSQL 18**: serviço do CI `postgres:18` (`ci.yml:39`); comentário em `ci.yml:35-37` ("mesma família de versão do servidor e do banco gerenciado").
- **pg ^8.23.0**: `package.json:30` (raiz), `apps/console/package.json:22`, `apps/landing/package.json:16`.
- **embedded-postgres ^18.4.0-beta.17** (pré-release, raiz): `package.json:29`.
- **Resend ^4.0.0** (e-mail, landing): `apps/landing/package.json:15`.
- **@react-email/components ^1.0.12**: `apps/console/package.json:16`.
- **Vercel** (landing): `apps/landing/package.json:11` (`vercel dev`); `apps/landing/vercel.json` (listagem).
- **Docker + GHCR**, com SBOM e proveniência SLSA: `.github/workflows/imagem.yml:57-63`; `apps/console/Dockerfile` (listagem).
- **Gitleaks v8.30.1** via imagem Docker fixada por digest: `.github/workflows/ci.yml:130-134`.
- **JavaScript (ESM)**: `apps/landing/package.json:6` (`"type": "module"`); scripts `.mjs` da raiz `package.json:17-26`.
- **SQL**: migrations em `supabase/migrations/` (listagem; `0013_proposal_release.sql` existe), citadas em `apps/console/CLAUDE.md:83`; `migrate` idempotente testado em `ci.yml:79-82`.
- **Python** (indício, não confirmado por manifesto): `ci.yml:109-113` fala em "código Python" e chama `packages/ai-harness/bin/harness.js`; o pacote não foi lido por regra.
- **Go**: nenhum indício no escopo lido.

## Comandos
- Dev, todos os workspaces: `npm run dev` → `turbo run dev` (`package.json:16`).
- Build: `npm run build` → `turbo run build` (`package.json:12`).
- Testes: `npm run test` → `turbo run test` (`package.json:13`); console: `vitest run` (`apps/console/package.json:10`); E2E: `vitest run -c vitest.e2e.config.ts` (`:12`).
- Typecheck: `npm run typecheck` (`package.json:14`); console: `tsc --noEmit` (`apps/console/package.json:9`).
- Lint: `npm run lint` → `turbo run lint` (`package.json:15`). Nenhum workspace lido declara `lint` (ver divergência 3).
- Dev local (landing + banco): `dev:local` (`package.json:17`); `db:local` (`:18`).
- Migrações: `migrate` (`package.json:20`), `migrate:dry` (`:21`), `migrate:down` (`:25`); `db:seed` = `migrate` + `semear:demo` (`:19`).
- Harness: `harness:sync` (`:22`), `harness:check-noqa` (`:23`), `harness:setup-hooks` (`:24`).
- Console: `next dev -p 3100` (`apps/console/package.json:6`); `next start -p 3100` (`:8`); `auth:check` (`:11`).
- Landing: `build:i18n` (`apps/landing/package.json:8`); `site` (`:9`); `test` = `node --test` (`:10`).
- CI: `npm ci` (`ci.yml:69`); `npm audit --omit=dev --audit-level=high` (`:74`); `npm run migrate` (`:77`); `npx turbo run test typecheck --ui=stream` (`:87`); `node packages/ai-harness/bin/harness.js check --all` (`:113`).
- Deploy manual: `workflow_dispatch` com SHA em `deploy.yml:24-29`; ssh para `implantar`, `versao`, `logout` (`:94-124`).

## Regras/convenções declaradas
- **Não escrever `# noqa`** em lugar nenhum e checar o código antes do commit (`AGENTS.md:9`; `CLAUDE.md:9`).
- **Atualizar estado do projeto** após concluir feature: `STATE.md`, `PROJECT.md`, `ROADMAP.md` em `.specs/`; e `tasks.md` e `spec.md` da pasta da feature (`AGENTS.md:1, 3`; `CLAUDE.md:1, 3`).
- `/compact` no meio da tarefa; `/clear` ao trocar de tarefa (`AGENTS.md:5`).
- **Linguagem client-facing**: proibido "câmbio", "cambial" e "NDF" em telas, boletas, e-mails, formulário público e landing (`CLAUDE.md:7-9`; `CLAUDE.md:11-12`). A CI aplica a regra (`ci.yml:97-107`).
- **Dinheiro é Decimal (LEI 2)**: `decimal.js` em todo valor financeiro; em JSON viaja como string; `parseFloat`/`Number()` proibidos; usar `dec()` de `src/lib/money.ts` (`CLAUDE.md:20-25`).
- **Fonte da cotação**: USD/BRL vem de `1 / fairPrice` do perpétuo BRL_USDT da MEXC; não trocar sem alinhar com a perna de hedge; cotação recusada após `HED_REFERENCIA_MAX_IDADE_S` (60 s) (`CLAUDE.md:30-39`).
- **Modelo v4 em dois lugares**: `src/lib/pricing.ts` e JS de `public/solicitacao.html`; mudou aqui, muda lá; testes `tests/boletas.test.ts` e `tests/pricing.test.ts` travam os números das boletas emitidas (`CLAUDE.md:41-51`).
- **Autorização em duas camadas**: gate em `src/lib/auth/acesso.ts`, aplicado em `src/proxy.ts` e dentro da página/rota (`CLAUDE.md:55-58`). Papel mesa via `HED_ORGS_MESA`; demais orgs são cliente; sem org não há escopo (`CLAUDE.md:60-62`).
- **Autorização na camada de dados**: leituras de contrato e proposta exigem `Escopo` (`CLAUDE.md:64-67`). Contrato fora do escopo e inexistente devolvem o mesmo 404 (`CLAUDE.md:69-70`).
- **Tela do cliente lê o banco** (`src/lib/db/contratos.ts`, `propostas.ts`); fixtures de `tests/fixtures/boletas/*.json` não podem ser religadas à tela (`CLAUDE.md:72-80`).
- **Proposta só aparece após liberação** (`released_at`, migration 0013) (`CLAUDE.md:82-85`).
- **Modo local** (`HED_AUTH_MODE=local`) é ignorado quando `NODE_ENV=production` (`CLAUDE.md:87-92`).
- **Painel da mesa** `/interno`: gate em `src/proxy.ts` e `exigirMesa()`; rotas que operam exigem `org:admin` e aceitam só JSON da mesma origem (`CLAUDE.md:94-99`).
- **Migrations só adicionam** (`.github/workflows/deploy.yml:10-12`); `implantar` só aceita SHA de commit em `main` (`deploy.yml:51-53`).
- **Imagem não leva configuração**: chaves e CSP vêm do env do servidor em runtime (`imagem.yml:52-56`).
- **CI sem sslmode** e sem TLS para o banco local (`ci.yml:52-54`).
- **Workflows só leitura**: `permissions: contents: read` (`ci.yml:25-26`).

## Divergências e inconsistências
1. **AGENTS.md e CLAUDE.md duplicados**: as linhas 1-9 de `AGENTS.md` são idênticas às de `CLAUDE.md:1-9` (mesmos cinco itens). `AGENTS.md:11-20` tem um bloco gerenciado pelo turbo que não existe em `CLAUDE.md`. Quem editar um arquivo deixa o outro para trás.
2. **Tarefa `check` órfã no turbo**: `turbo.json:44-46` define `check` (`cache: false`), mas nenhum manifesto lido declara script `check` (`package.json:11-27`; `apps/console/package.json:5-13`; `apps/landing/package.json:7-13`).
3. **`lint` sem script**: `package.json:15` (`turbo run lint`) e `turbo.json:19-23` (`lint` com `dependsOn: ^lint`), mas `apps/console/package.json` e `apps/landing/package.json` não têm script `lint`. Só `packages/ui` faltaria confirmar, e ele não foi lido por regra.
4. **Node do CI × tipos do Node**: CI roda Node 24 (`ci.yml:65`); `apps/console/package.json:29` fixa `@types/node` em `22.18.1`.
5. **Escopos de pacote misturados**: raiz `hedglobal-platform` (`package.json:2`); workspaces `@xend/ui` (`apps/console/package.json:19`) e `@xend/ai-harness` (`package.json:22-24` faz `--workspace @xend/ai-harness`); `@hedglobal/console` (`apps/console/package.json:2`) e `@hedglobal/landing` (`apps/landing/package.json:2`). Dois escopos (`@xend` e `@hedglobal`) no mesmo repo.
6. **Pins exatos e ranges misturados no mesmo app**: `apps/console/package.json:20` (`decimal.js` 10.6.0), `:26` (`zod` 4.6.5), `:31-32` (`@types/react` 19.3.0), `:33` (`typescript` 7.0.2), `:34` (`vitest` 3.2.7) × `:15-25` (ranges `^`).
7. **Pré-release na raiz**: `package.json:29` (`embedded-postgres` `^18.4.0-beta.17`).
8. **Diretório `apps/api/` sem manifesto**: a listagem mostra só `.turbo`. O workspace `apps/*` (`package.json:8`) cobre o diretório. Não confirmado se o npm o ignora ou se quebra; registrado como ponto de atenção.
9. **Bloco do turbo com opção não definida**: `AGENTS.md:19` diz que o bloco é reinserido pelo turbo a menos que `"agentGuidance": false` esteja no `turbo.json`; `turbo.json:1-3` não define essa opção.

## Pontos verificados sem divergência
- Regra de linguagem regulada: `CLAUDE.md:15` (grep) cobre o que `ci.yml:102-103` cobre (`apps/console/src`, `apps/console/public`, `apps/landing` sem `test`).
- Versão do Postgres: CI usa 18 (`ci.yml:39`), o mesmo major do `embedded-postgres` da raiz (`package.json:29`).
- Caminhos citados existem (checagem de existência): `apps/landing/scripts/dev-server.mjs`, `apps/console/src/proxy.ts`, `src/lib/money.ts`, `src/lib/pricing.ts`, `src/lib/auth/acesso.ts`, `src/lib/db/contratos.ts`, `src/lib/db/propostas.ts`, `tests/boletas.test.ts`, `tests/pricing.test.ts`, `public/solicitacao.html` (em `apps/console/public/`), `apps/console/deploy/porta-do-ci.sh`, `packages/ai-harness/bin/harness.js`, `.specs/STATE.md`, `.specs/PROJECT.md`, `.specs/ROADMAP.md`, `apps/console/tests/fixtures/boletas`, `supabase/migrations/0013_proposal_release.sql`.

## Lacunas
- `apps/console/scripts/auth-check.mjs` (`apps/console/package.json:11`) — não confirmado por checagem; motivo: teto de checagens não foi tocado, a checagem ficou fora do lote.
- `.env` e `.env.example` existem na raiz (listagem); não lidos — motivo: `.env*` é proibido.
- `packages/ai-harness/package.json` e `packages/ui/*` — não lidos (manifest de pacote); o `name` do ai-harness saiu de uma busca de 1 linha, ver cabeçalho.
- `apps/api/` — só `.turbo` na listagem; sem manifesto para ler.
- `apps/console/src/` (restante), `apps/console/tests/` (restante), `apps/console/vitest*.config.ts`, `apps/console/next.config.ts`, `apps/console/Dockerfile`, `apps/landing/vercel.json` — existem (listagem) ou são citados; não lidos — motivo: código-fonte e configs fora da lista.
- `.specs/HANDOFF.md`, `.specs/AUDITORIA-LGPD-LANDING.md`, `.specs/features/` — existem (listagem); não lidos — motivo: fora do escopo.
- `README.md`, `CHANGELOG.md`, `SECURITY.md`, `DESIGN-IS-2026-10-07/`, `design-system/`, `ds-bundle/` — existem (listagem); não lidos — motivo: README proibido e fora do escopo.
- `.github/gitleaks.toml`, `.github/CODEOWNERS`, `.github/dependabot.yml` — existem (listagem); não lidos — motivo: fora do escopo.
- `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.harness/`, `.design-sync/`, `.ds-sync/`, `.agents/` — existem (listagem); só registrados — motivo: fora do escopo de leitura.
- `package-lock.json` — lockfile, não lido; `node_modules/` ignorado.
- `supabase/migrations/*` — só o nome `0013_proposal_release.sql` foi confirmado; o conteúdo não foi lido.
