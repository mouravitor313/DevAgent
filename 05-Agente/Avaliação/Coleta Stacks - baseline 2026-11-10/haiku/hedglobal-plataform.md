# Dossiê de contexto — hedglobal-plataform (somente leitura)

Arquivos lidos: 12 (AGENTS.md, CLAUDE.md, package.json, turbo.json, .github/workflows/ci.yml, deploy.yml, imagem.yml, monitor.yml, apps/console/package.json, apps/console/tsconfig.json, apps/landing/package.json). Mais 1 manifest da lista não existe (`supabase/config.toml`) e `apps/api` não tem manifest. Listagens de diretório feitas só para localizar manifests.

## Stacks presentes
- **Node.js + npm workspaces**: `C:\Users\Pedro\Projetos\hedglobal-plataform\package.json:5` (`packageManager: npm@11.13.0`), `:7-10` (workspaces `apps/*`, `packages/*`); CI usa npm: `.github\workflows\ci.yml:66-69`.
- **TypeScript**: `apps\console\package.json:33` (typescript 7.0.2); `apps\console\tsconfig.json:9` (`allowJs: false`), `:12` (`noUncheckedIndexedAccess`).
- **JavaScript (ESM e scripts Node)**: `package.json:17-26` (scripts `.mjs`); `apps\landing\package.json:6` (`"type": "module"`), `:10` (`node --test`).
- **Next.js 16 + React 19**: `apps\console\package.json:21` (next ^16.3.8), `:23` (react ^19.2.4).
- **Clerk (auth)**: `apps\console\package.json:15`.
- **Sentry**: `apps\console\package.json:18`.
- **viem (Web3/EVM)**: `apps\console\package.json:25`.
- **PostgreSQL / SQL**: `apps\console\package.json:22` (pg), `:30` (@types/pg); `package.json:29` (embedded-postgres ^18.4.0-beta.17); `.github\workflows\ci.yml:39` (imagem `postgres:18`), `:54` (DATABASE_URL); `:76-82` (migrations); `apps\landing\package.json:16` (pg); `.github\workflows\imagem.yml:15` (`supabase/migrations/**`). Migrations em `supabase\migrations\` (só listadas).
- **Vitest**: `apps\console\package.json:34`, `:10`, `:12`.
- **Turborepo**: `turbo.json:1-52`; `package.json:31` (turbo ^2.11.5).
- **Resend / React Email**: `apps\landing\package.json:15` (resend ^4.0.0); `apps\console\package.json:16-17`.
- **Vercel**: `apps\landing\package.json:11` (`vercel dev`), sem Vercel CLI declarado em dependências.
- **Docker / GHCR / GitHub Actions**: `.github\workflows\imagem.yml:40-68` (buildx, build-push, SBOM, provenance); `deploy.yml:43-100` (deploy por SSH no environment `servidor`).
- **Python**: nenhum manifest dentro do escopo. Só indício em `ci.yml:109` ("supressão de linter embutida no código Python"). Ver Lacunas.
- **Go**: nenhum indício.

## Comandos (só o que está escrito)
Raiz, `package.json:11-26`:
- build `turbo run build` (:12); test `turbo run test` (:13); typecheck `turbo run typecheck` (:14); lint `turbo run lint` (:15); dev `turbo run dev` (:16)
- dev:local `node --env-file=.env apps/landing/scripts/dev-server.mjs` (:17); db:local `node scripts/pg-local.mjs` (:18)
- migrate `node --env-file-if-exists=.env scripts/migrate.mjs` (:20); migrate:dry `... --dry` (:21); migrate:down `... --down` (:25)
- db:seed `npm run migrate && npm run semear:demo` (:19); semear:demo `node ... scripts/semear-demo.mjs` (:26)
- harness:sync (:22), harness:check-noqa (:23), harness:setup-hooks (:24) — delegam a `@xend/ai-harness`

`apps\console\package.json:5-12`: dev `next dev -p 3100` (:6); build `next build` (:7); start `next start -p 3100` (:8); typecheck `tsc --noEmit` (:9); test `vitest run` (:10); auth:check `node scripts/auth-check.mjs` (:11); test:e2e `vitest run -c vitest.e2e.config.ts` (:12).

`apps\landing\package.json:8-12`: build:i18n `node build.mjs` (:8); site `node build.mjs --publish` (:9); test `node --test` (:10); dev `vercel dev` (:11); dev:local (:12).

CI `.github\workflows\ci.yml`:
- instalar `npm ci` (:69); auditoria `npm audit --omit=dev --audit-level=high` (:74)
- migrations `npm run migrate` (:77) e teste de idempotência `npm run migrate | ... grep -q 'já estava em dia'` (:82)
- testes e tipos `npx turbo run test typecheck --ui=stream` (:87); falha se houver teste pulado (:92-95)
- regra de linguagem client-facing (:100-107); supressão de linter `node packages/ai-harness/bin/harness.js check --all` (:113); gitleaks (:130-134)

Deploy: `deploy.yml` é `workflow_dispatch` (:24) e executa `implantar <imagem> <tag>` via SSH (:100), `versao` (:114), `logout` (:107). Imagem: `imagem.yml:50` (`ghcr.io/<owner>/hedglobal-console`).

## Regras/convenções declaradas
- Atualizar STATE.md, PROJECT.md, ROADMAP.md em `.specs/` após concluir feature — `AGENTS.md:1`, `CLAUDE.md:1`.
- Atualizar tasks.md e spec.md da feature — `AGENTS.md:3`, `CLAUDE.md:3`.
- `/compact` no meio da tarefa, `/clear` ao trocar de tarefa — `AGENTS.md:5`, `CLAUDE.md:5`.
- Conferir commits e PRs recentes quando perguntado sobre o que foi resolvido — `AGENTS.md:7`, `CLAUDE.md:7`.
- **NUNCA** escrever comentário/flag `# noqa` no código; conferir antes do commit — `AGENTS.md:9`, `CLAUDE.md:9`. Aplicado por CI em `ci.yml:109-113`.
- Bloco gerenciado pelo turbo (não editar à mão; opt-out via `agentGuidance`) — `AGENTS.md:11-20`.
- Termos de conduta regulada (câmbio, cambial, NDF) proibidos em material que o cliente vê (`apps/console/src`, `apps/console/public`, `apps/landing` exceto testes) — `ci.yml:97-106`.
- Vulnerabilidade alta/crítica em dependência de produção quebra o PR — `ci.yml:71-74`.
- Workflows só com permissão de leitura por padrão; checkout sem persistir credenciais — `ci.yml:21-26`, `:61`.
- Teste pulado em CI é falha — `ci.yml:88-95`.
- Migrations devem ser idempotentes — `ci.yml:79-82`; e só adicionam (app antigo roda com schema novo) — `deploy.yml:10-12`.
- Deploy só manual, environment `servidor` só aceita `main` — `deploy.yml:4-5`, `:43`; tag precisa ser SHA completo de commit em `main` — `deploy.yml:61-67`.
- Imagem tagueada por SHA; `latest` nunca é o que se implanta — `imagem.yml:4-6`.
- Build de imagem só de `main` (inclusive sob demanda) — `imagem.yml:32-34`.
- Imagem sem configuração embutida; chaves vêm do env do servidor — `imagem.yml:52-54`.
- Monitor não é de uptime (custo de minutos do Actions) — `monitor.yml:5-9`.

## Divergências e inconsistências
1. **`lint` aponta para tasks que não existem nos apps lidos**: `package.json:15` roda `turbo run lint`; `turbo.json:19-23` define a task; `apps\console\package.json:5-12` e `apps\landing\package.json:7-13` não têm script `lint`. Resultado: nenhum lint efetivo nos apps lidos (packages não lidos).
2. **Task `check` sem script**: `turbo.json:44-46` define `check`; nenhum `check` no `package.json:11-26` nem nos apps lidos. O script de checagem real é `harness:check-noqa` (`package.json:23`).
3. **`apps/api` sem manifest**: `package.json:8` (workspace `apps/*`) casa com `apps/api/`, mas a pasta só contém `.turbo` (listagem). Sem `package.json`, o npm ignora o diretório; a existência dele como app não é confirmada.
4. **Versão de Node**: `.github\workflows\ci.yml:65` usa Node 24; `apps\console\package.json:29` fixa `@types/node 22.18.1`.
5. **Pins exatos misturados com ranges**: `apps\console\package.json:20` (decimal.js 10.6.0), `:26` (zod 4.6.5), `:29` (@types/node), `:31-32` (@types/react 19.3.0), `:34` (vitest 3.2.7); demais deps usam `^`.
6. **Pré-release em dependência de raiz**: `package.json:29` `embedded-postgres ^18.4.0-beta.17`; CI usa `postgres:18` (`ci.yml:39`). Alinhamento a confirmar.
7. **Dois caminhos para o mesmo harness**: `package.json:22-24` chama o workspace `@xend/ai-harness`; `ci.yml:113` chama `packages/ai-harness/bin/harness.js` diretamente. Não confirmado se são o mesmo arquivo (packages não lido).
8. **Duplicação de AGENTS.md e CLAUDE.md**: `AGENTS.md:1-9` é idêntico a `CLAUDE.md:1-9`; risco de divergência futura (observação).
9. **Referência a script de deploy que não foi lido**: `deploy.yml:2` cita `apps/console/deploy/porta-do-ci.sh`; a pasta `deploy/` existe (listagem), o arquivo não foi lido.
10. **Typescript 7.0.2 em app, enquanto o restante do ecossistema comum usa TS 5**: não é contradição interna; registrado só para checagem de compatibilidade do tooling (`apps\console\package.json:33`).
11. **Domínio padrão fixo**: `monitor.yml:29` usa `painel.hed.global` como fallback de `vars.HED_DOMINIO` (`deploy.yml:126`); documentado em `monitor.yml:11-12`.

## Lacunas (não confirmado dentro do limite de leitura)
- `apps\console\CLAUDE.md` existe, mas está fora da lista permitida (a regra só libera `AGENTS.md`/`CLAUDE.md` da raiz). Não lido; pode conter regras do console.
- `apps\console\`: `Dockerfile`, `next.config.ts`, `vercel.json`, `vitest*.config.ts`, `scripts/`, `deploy/`, `src/`, `tests/`, `e2e/` — não lidos (fora da lista).
- `apps\landing\`: `vercel.json`, `build.mjs`, `api/`, `scripts/dev-server.mjs` — não lidos.
- `apps\api\`: sem manifest; nada extraído.
- `packages\*` (inclui `packages\ai-harness`, `packages\ui` com `@xend/ui`) — não lidos.
- `supabase\config.toml` **não existe** (listagem de `supabase\` mostra só `migrations`). Config do Supabase não confirmada.
- `supabase\migrations\` (SQL) — só listado, não lido.
- `scripts\migrate.mjs`, `scripts\pg-local.mjs`, `scripts\semear-demo.mjs` — citados em `package.json`, existência não verificada.
- `.github\gitleaks.toml` (citado em `ci.yml:117`), `.specs\` (citado em `AGENTS.md:1`) — não lidos.
- Python: não há `pyproject.toml`/`requirements*.txt` na raiz (listagem); a referência a "código Python" (`ci.yml:109`) não é confirmada por manifest.
- Não há `tsconfig.json` na raiz (listagem); cada app tem o seu.
- `.env` na raiz existe (listagem) — não lido por regra de segurança e fora da lista.
- Não confirmado: se `packages/ai-harness` expõe o script `check` e `sync` referenciados em `package.json:22-23`.
