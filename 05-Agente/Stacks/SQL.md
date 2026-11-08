---
tipo: stack
status: em-construção
tags: [devagent, stack, sql]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Stacks]]", "[[Tarefas transversais]]"]
---
# SQL

## Contexto
- Dialeto: PostgreSQL (próprio ou via Supabase). SQLite só para dados locais de ferramentas e pesquisa. A major do Postgres varia por repo: confirme a do repo antes de usar recurso novo.
- Acesso: siga o driver ou ORM que o repo já usa (`pg` puro, SQLAlchemy async com asyncpg, psycopg2, better-sqlite3). Não troque nem some outro.
- Comandos de migração, um dos padrões, conforme o repo: `npm run migrate` (aplica o que falta; `migrate:dry` simula; `migrate:down` reverte e exige confirmação) · Supabase CLI (`supabase migration up`, `bun run db:reset`) · `python -m src migrate`. Alembic: nenhum comando documentado nos repos, não presuma (ver Achados).
- Comandos de teste com banco, conforme o repo: `DATABASE_URL=<url-local> npm test` · `pytest` (integração: `pytest -m integration`, exige PostgreSQL). Lint de SQL: nenhum configurado nos repos.
- Todo schema muda por migração versionada no repo (`supabase/migrations/`, `alembic/versions`, pasta própria), nunca por DDL manual. Supabase: arquivo `AAAAMMDDHHMMSS_descricao.sql`.
- Valor monetário e quantidade são `NUMERIC` no banco e `Decimal` na aplicação, nunca float; em JSON vai como string. Com psycopg2, garanta que `NUMERIC` volte como `Decimal`.
- Banco de desenvolvimento e de teste é local: Docker com a imagem `postgres` ou Supabase CLI local. Credenciais de dev ficam só no compose/`.env`. Banco com `prod`/`production`/`live` no nome é somente leitura (ver AGENTS.md do portfólio).
- Testes que exigem banco ficam marcados `integration` (pytest) e separados dos unitários.
- Chaves privilegiadas do banco (service-role e semelhantes) só no servidor ou em secrets de Edge Function, nunca no cliente.
- Arquivos SQLite (`*.db`, `*.sqlite*`) ficam no `.gitignore`; dado local é gerado, não versionado. Dumps: ver AGENTS.md do portfólio.

## Skills
| skill | origem | serve para | estado | testado em |
|---|---|---|---|---|
| `data:sql-queries` · `data:write-query` | plugin data (instalado) | escrever e otimizar consultas | candidata | — |
| `supabase/agent-skills` | [Supabase](https://supabase.com/docs/guides/getting-started/ai-skills.md) (`npx skills add`) | desenvolvimento e segurança com Supabase | candidata | — |
| `supabase-postgres-best-practices` | já presente em `.agents/skills/` do xend-platform; também instalada | schema, migrações, RLS, índices e consultas em Postgres | candidata | — |

## Documentação
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Supabase](https://supabase.com/docs)
- [Supabase: desenvolvimento local e migrações](https://supabase.com/docs/guides/local-development)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Alembic](https://alembic.sqlalchemy.org/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [asyncpg](https://magicstack.github.io/asyncpg/current/)
- [psycopg2](https://www.psycopg.org/docs/)
- [node-postgres (`pg`)](https://node-postgres.com/)
- [SQLite](https://www.sqlite.org/docs.html)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [Imagem Docker `postgres`](https://hub.docker.com/_/postgres)

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|
| MCP `Supabase` | conector claude.ai (configurado) | tabelas, migrações, logs, advisors | candidata | claude-code | escreve em banco remoto: cuidado com migrações. Há allowlist local liberando `apply_migration`/`execute_sql` (ver Achados): só com pedido explícito, nunca em projeto de prod |
| Supabase CLI (`supabase`) | local: dependência em xend-baas-api e XEND-RFQ-PORTAL; `bunx supabase` em xend-platform | stack local, migrações, geração de tipos | candidata | — | preferir banco local a remoto; ver Achados sobre permissões do MCP |

## Achados
| data | achado | fonte |
|---|---|---|
| 2026-11-08 | Major do Postgres diverge: 18 no hedglobal (README e CI), 17 no baas (compose) e no RFQ (config Supabase), 16 no xendmm (compose). | hedglobal-plataform/README.md:83; hedglobal-plataform/.github/workflows/ci.yml:39; xend-baas-api/docker-compose.yml:71; XEND-RFQ-PORTAL/supabase/config.toml:42; xendmm/api/docker-compose.yml:3 |
| 2026-11-08 | Migração com `down` por versão e trava: `--down` sem `--confirmo` é recusado; `--dry` simula. Boa candidata a regra para repos com script próprio. | hedglobal-plataform/scripts/migrate.mjs:11-22; hedglobal-plataform/README.md:190-191 |
| 2026-11-08 | No deploy a migração roda antes do app; a CI aplica as migrações e confere idempotência (saída "já estava em dia"). | hedglobal-plataform/README.md:133-135; hedglobal-plataform/.github/workflows/ci.yml:82 |
| 2026-11-08 | Testes de banco rodam um arquivo por vez (estado global do Postgres). Teste pulado é falha: sem `DATABASE_URL` os testes SQL se pulam. A CI diz que eles "pegaram os defeitos que chegaram à produção". | hedglobal-plataform/apps/console/vitest.config.ts:9,16; hedglobal-plataform/README.md:115; hedglobal-plataform/.github/workflows/ci.yml:3-7,90-95 |
| 2026-11-08 | Sem ORM (`pg` puro). Autorização na camada de dados, não na UI; sem org, falha fechada. | hedglobal-plataform/README.md:60-61; hedglobal-plataform/apps/console/CLAUDE.md:55-67 |
| 2026-11-08 | Falha real: a tela lia uma pasta de JSON enquanto o formulário gravava no banco, e a operação contratada ficava invisível ao cliente. Regra implícita: uma só fonte de verdade (o banco). | hedglobal-plataform/apps/console/CLAUDE.md:76-80 |
| 2026-11-08 | Alembic em `alembic/versions`, mas nenhum comando `alembic upgrade` documentado nos arquivos lidos. | xend-baas-api/alembic.ini:2; xend-baas-api/README.md:763 |
| 2026-11-08 | SQLAlchemy travado em `<2.1` porque a 2.1.0 "broke the quote-consumption atomicity guard". Candidata a regra: não subir SQLAlchemy sem rodar os testes de atomicidade. | xend-baas-api/pyproject.toml:12-15; xend-baas-api/requirements.txt:5 |
| 2026-11-08 | Busca por `idempotencyKey` de payout só cobre registros posteriores à migration `823565c91cc7`; não houve backfill. | xend-baas-api/README.md:412-413 |
| 2026-11-08 | Compose de dev avisa que usa credenciais delegadas de prod ("proposes to the REAL prod Safe") e desliga de propósito o `callbacks/drain`, que dispararia callbacks reais a partir do espelho local. Há um dump de prod em `.backups/` na pasta do repo (não lido; confirmar que está no `.gitignore`). | xend-baas-api/docker-compose.yml:49-54; xend-baas-api/.backups/prod-20260828.sql (listagem) |
| 2026-11-08 | `aiosqlite` nas deps de dev sugere testes em SQLite contra Postgres em produção: risco de divergência de dialeto. Inferência, a confirmar. | xend-baas-api/requirements-dev.txt:11-33 |
| 2026-11-08 | Nenhum comando documentado de migração, deploy de Edge Functions ou `supabase secrets set`; só há o CLI em dependências. `supabase/seed.sql` é referenciado e não existe. | XEND-RFQ-PORTAL/package.json:28; XEND-RFQ-PORTAL/supabase/config.toml:71; XEND-RFQ-PORTAL/.specs/project/STATE.md:92 |
| 2026-11-08 | A allowlist local permite `apply_migration` e `execute_sql` do MCP Supabase (inclusive em servidor com nome UUID). Pode conflitar com a regra de prod somente leitura do portfólio: revisar. | XEND-RFQ-PORTAL/.claude/settings.local.json:115-117,148-149,164-171 |
| 2026-11-08 | `auto_expose_new_tables` está marcado como obsoleto, com remoção em 2026-10-30 (data já passada); revisar a config. | XEND-RFQ-PORTAL/supabase/config.toml:23-24 |
| 2026-11-08 | Stack Supabase declara RLS (AGENTS.md:12-13), mas nenhum dossiê traz regra ou padrão de política RLS. Lacuna a documentar. | XEND-RFQ-PORTAL/AGENTS.md:12-13 |
| 2026-11-08 | Scripts `db:start/stop/reset/typegen/seed` via `bunx supabase`; `db:reset` encadeia a geração de tipos. O CLAUDE.md usa `supabase migration up` e `supabase gen types typescript`: dois padrões no mesmo repo. | xend-platform/package.json:20-26; xend-platform/CLAUDE.md:42-44 |
| 2026-11-08 | Convenção só deste repo: tabelas em snake_case. Candidata a regra. | xend-platform/AGENTS.md:61 |
| 2026-11-08 | Sem migrações versionadas: as tabelas nascem por `CREATE TABLE` em código e o banco do indexer é criado à mão (`createdb`). | xendmm/fee_decompositor/README.md:67; xendmm/indexer/README.md:134-139,142 |
| 2026-11-08 | `scripts/seed_db.py` trunca e recria a tabela a cada execução. Credenciais literais de dev estão no compose (valores omitidos aqui). | xendmm/api/README.md:161; xendmm/api/docker-compose.yml:9-10 |
| 2026-11-08 | xend-arb usa "o mesmo" PostgreSQL do xendmm e tem `migrate` próprio, que roda sozinho nos comandos de loop e no `index`: migração implícita em runtime, com dono do schema pouco claro entre os dois repos. | xend-arb/README.md:120,160,189-190 |
| 2026-11-08 | `*.db` está ignorado, mas `arb_tracker.db` (624 MB) está na raiz; coletores em background crescem o arquivo (~100 MB/dia no xvenue). O dashboard abre em modo leitura e o tracker é o único escritor. | arb/.gitignore:12; arb/PROJECT.md:219-221; arb/README.md:37-38 |
| 2026-11-08 | better-sqlite3 é módulo nativo com ABI do Electron: o server standalone só roda com `ELECTRON_RUN_AS_NODE=1`, "nunca com `node`/`tsx`"; os testes seguem a mesma regra; há script `rebuild:native`. | terminal/PROJECT.md:531-532; terminal/scripts/test.mjs:15; terminal/package.json:10 |
| 2026-11-08 | Tabela `xvenue_opps` (2,67 M linhas) só tem índice `(strategy, asset, size_usd)`; toda query precisa filtrar por eles antes de `ts`. | terminal/PROJECT.md:524-525 |
| 2026-11-08 | SQLite em `DATA_DIR` com volume Docker; `data/*.db*` ignorados no git; teste de banco em `server/src/db.test.ts`. | openterminal/docker-compose.yml:16,22; openterminal/.gitignore:11-13 |
| 2026-11-08 | Nenhum linter ou formatador de SQL (ex.: sqlfluff) aparece nos dossiês; "lint" de SQL não tem comando. | (ausência; dossiês de SQL) |
| 2026-11-08 | (advisor) dash-mm também é consumidor de Postgres: lê direto, via `pg`, o banco do indexer `uniswap_v3_indexer`, cujo schema é externo ao repo; não tem migração. Ficou fora do mapa inicial do plano. | dash-mm/package.json:22; dash-mm/README.md:38-39 |
