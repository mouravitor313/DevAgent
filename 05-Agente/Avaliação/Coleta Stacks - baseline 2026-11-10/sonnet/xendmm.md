# Dossiê: xendmm (C:\Users\Pedro\Projetos\xendmm)

Layout: não há `apps/`; os subdiretórios de primeiro nível com manifest são `api`, `backtester`, `dashboard`, `fee_decompositor`, `indexer` (listagem). Sem manifest na raiz (apenas AGENTS.md e CLAUDE.md).

## Stacks presentes
- **Python** (única stack com manifest): `requires-python = ">=3.11"` em api/pyproject.toml:10, backtester/pyproject.toml:10, dashboard/pyproject.toml:9, fee_decompositor/pyproject.toml:10. Build com setuptools>=68 (api/pyproject.toml:2; backtester/pyproject.toml:2; dashboard/pyproject.toml:2; fee_decompositor/pyproject.toml:2). `indexer` só tem requirements.txt (indexer/requirements.txt:1-3).
- **api**: FastAPI `>=0.110`, uvicorn, pydantic>=2, pydantic-settings, `web3>=6.15,<7`, psycopg2-binary (api/pyproject.toml:14-20); extras dev pytest, pytest-mock, httpx (api/pyproject.toml:26-29); descrição "Live strategy evaluation API" (:8).
- **backtester**: pydantic, pyyaml, requests, eth-hash, eth-utils, psycopg2-binary, plotly, kaleido (backtester/pyproject.toml:14-22); dev pytest, pytest-mock, pytest-cov, responses (:28-33).
- **dashboard**: Dash `>=2.17`, plotly, paramiko, python-dotenv (dashboard/pyproject.toml:11-14); pytest `testpaths = ["tests"]` (:26-27).
- **fee_decompositor**: psycopg2-binary, python-dotenv (fee_decompositor/pyproject.toml:14-15).
- **indexer**: `web3>=7.0.0`, psycopg2-binary, python-dotenv (indexer/requirements.txt:1-3).
- **SQL / PostgreSQL**: `postgres:16-alpine` em api/docker-compose.yml:3 (DB `xendmm`, user `xend`, porta 5432, :6-11); driver psycopg2-binary em api, backtester, fee_decompositor, indexer (api/pyproject.toml:20; backtester/pyproject.toml:19; fee_decompositor/pyproject.toml:14; indexer/requirements.txt:2). Sem arquivos .sql lidos (fora do limite).
- **Go, TypeScript, JavaScript, Next.js**: nenhum manifest (`package.json`, `go.mod`, `tsconfig`) nos arquivos permitidos.
- Domínio: Uniswap V3 / LP (backtester/pyproject.toml:8; fee_decompositor/pyproject.toml:8).

## Comandos (só o que está escrito)
- Build/instalação: via setuptools (`[build-system]`, ver acima); `dashboard/setup.sh` existe (listagem), conteúdo não lido.
- Teste: pytest em todos os pacotes (extras dev: api/pyproject.toml:27; backtester/pyproject.toml:29; dashboard/pyproject.toml:19; fee_decompositor/pyproject.toml:20); dashboard `testpaths = ["tests"]` (dashboard/pyproject.toml:26-27). Nenhum comando de execução escrito em AGENTS.md/CLAUDE.md.
- Banco local: `api/docker-compose.yml` (postgres:16-alpine; healthcheck `pg_isready -U xend -d xendmm`, :14-18).
- Lint, typecheck, formatação, migração: **nenhum comando declarado** nos arquivos permitidos (ruff/mypy não aparecem em nenhum pyproject; ver Divergências).

## Regras/convenções declaradas
AGENTS.md e CLAUDE.md são idênticos (9 linhas cada):
- Atualizar STATE.md, PROJECT.md e ROADMAP.md em `.specs/` ao concluir feature, mas NUNCA commitá-los (AGENTS.md:1; CLAUDE.md:1).
- Atualizar tasks.md e spec.md da feature ao concluir tarefas (AGENTS.md:2; CLAUDE.md:2).
- `/compact` no meio da tarefa, `/clear` ao trocar de tarefa (AGENTS.md:3; CLAUDE.md:3).
- Nunca commitar nem remover do .gitignore arquivos de `.specs/` (AGENTS.md:4; CLAUDE.md:4); origem: modelo commitou pasta `./specs` em 05/18/2026 (AGENTS.md:5).
- Checar commits e PRs recentes quando pedirem para rastrear o que foi resolvido (AGENTS.md:6); origem 05/14/2026 (AGENTS.md:7).
- Nunca escrever `# noqa` no código; checar antes de commitar (AGENTS.md:8); origem 05/18/2026 (AGENTS.md:9).

## Divergências e inconsistências
- AGENTS.md:5 escreve "./specs", enquanto as regras anteriores e a listagem usam `.specs/` (AGENTS.md:1, :4) — grafia inconsistente na nota de origem.
- Regra proíbe `# noqa` (AGENTS.md:8), mas nenhum `pyproject.toml` configura ruff/flake8 (api/pyproject.toml, backtester/pyproject.toml, dashboard/pyproject.toml, fee_decompositor/pyproject.toml: sem `[tool.ruff]`); a listagem da raiz mostra `.ruff_cache` e `.mypy_cache`, indicando uso não declarado nos manifests.
- Versão de `web3`: `>=6.15,<7` em api/pyproject.toml:18 vs `>=7.0.0` em indexer/requirements.txt:1.
- `pytest-mock`: `>=3.12` (api/pyproject.toml:28; backtester/pyproject.toml:30; dashboard/pyproject.toml:20) vs `>=3.0` (fee_decompositor/pyproject.toml:21; fee_decompositor/requirements.txt:4).
- Fee_decompositor duplica deps entre pyproject e requirements.txt (fee_decompositor/requirements.txt:1-4 vs fee_decompositor/pyproject.toml:14-15, :20-22); backtester duplica extras dev em requirements-dev.txt (backtester/requirements-dev.txt:1-4 vs backtester/pyproject.toml:29-32).
- `readme = "README.md"` em api, backtester, fee_decompositor (api/pyproject.toml:9; backtester/pyproject.toml:9; fee_decompositor/pyproject.toml:9) e README.md existe nas listagens; dashboard não declara `readme`.
- `[tool.setuptools.packages.find] where = ["."]` com `include = ["api*"]` (api/pyproject.toml:33-34), `["backtester*"]` (backtester/pyproject.toml:36-37), `["fee_decompositor*"]` (fee_decompositor/pyproject.toml:25-26), mas as listagens mostram o código em `src/` (api/src, backtester/src, fee_decompositor/src); dashboard usa `where = ["src"]` (dashboard/pyproject.toml:24). Padrões de empacotamento diferentes entre pacotes (não verificado se há `__init__.py` na raiz que explique; existe `__init__.py` na listagem de api, backtester e fee_decompositor).
- Dependências cruzadas só por comentário: api depende de backtester e fee_decompositor como "sibling editable installs" (api/pyproject.toml:21-22); backtester de fee_decompositor (backtester/pyproject.toml:23-24); ordem de instalação remetida ao README (não lido).
- Postgres: `postgres:16-alpine` (api/docker-compose.yml:3) vs `postgres:18` no CI do hedglobal (hedglobal-plataform/.github/workflows/ci.yml:39).
- Credenciais de DB em claro no compose de dev (`POSTGRES_PASSWORD: xend`, api/docker-compose.yml:9-10).
- `kaleido>=0.2.1,<1.0.0` fixado por comentário "v0 bundles Chromium" (backtester/pyproject.toml:22).
- Backtester, api e fee_decompositor declaram `license = Proprietary` e autor "Xend Exchange" (api/pyproject.toml:11-12; backtester/pyproject.toml:11-12; fee_decompositor/pyproject.toml:11-12), dashboard não.
- `indexer` sem pyproject.toml (só requirements.txt: indexer/requirements.txt:1-3), logo não é pacote instalável como os demais.

## Lacunas
- Sem arquivos `.github/workflows` (a raiz não tem `.github`), `Makefile`, `pytest.ini` (existe em backtester e fee_decompositor, não lido pois fora do tipo permitido) nem `setup.sh` lidos.
- Nenhum comando de lint/format/typecheck/migração escrito; ferramentas (`ruff`, `mypy` — pastas de cache na raiz) não confirmadas por manifest.
- Versão exata do Python usada nos venvs não verificada; `venv/` não lido.
- Esquema/migrações SQL do banco, README de instalação, `HARNESS.md`, `MEMORY.md`, `RUNBOOK-*`, `.specs` e código-fonte não lidos.
- Go, TypeScript, JavaScript e Next.js: ausência só confirmada nos manifests permitidos; `dashboard` é Dash (Python), sem frontend JS declarado.
