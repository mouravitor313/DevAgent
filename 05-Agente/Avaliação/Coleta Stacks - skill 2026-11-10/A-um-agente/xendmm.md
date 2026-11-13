# Dossiê — xendmm

Lidos: 10 arquivos (~185 linhas) · Checagens de existência: ~22 · Teto atingido: não.
Observação de escopo: o repo não tem `apps/` nem `packages/`. Os "apps" aqui são os subdiretórios de primeiro nível com manifest Python: `api/`, `backtester/`, `dashboard/`, `fee_decompositor/`, `indexer/`. Não há `.github/` (listagem), logo não há CI.
Arquivos lidos: `AGENTS.md` (inteiro), `CLAUDE.md` (inteiro), `api/pyproject.toml`, `api/docker-compose.yml`, `backtester/pyproject.toml`, `backtester/requirements-dev.txt`, `dashboard/pyproject.toml`, `fee_decompositor/pyproject.toml`, `fee_decompositor/requirements.txt`, `indexer/requirements.txt`.

## Stacks presentes
- **Python >= 3.11** nos quatro manifests com `requires-python`: `api/pyproject.toml:10`, `backtester/pyproject.toml:10`, `dashboard/pyproject.toml:9`, `fee_decompositor/pyproject.toml:10`.
- **setuptools** como build backend: `api/pyproject.toml:2-3`, `backtester/pyproject.toml:2-3`, `dashboard/pyproject.toml:2-3`, `fee_decompositor/pyproject.toml:2-3`.
- **FastAPI + Uvicorn + Pydantic v2** (API): `api/pyproject.toml:14-16` (`fastapi>=0.110`, `uvicorn[standard]>=0.27`, `pydantic>=2.0`), `:17` (`pydantic-settings`).
- **web3** (on-chain): `api/pyproject.toml:18` (`web3>=6.15,<7`); divergência 1.
- **Uniswap V3** como domínio: `backtester/pyproject.toml:8` ("pre-computed Uniswap V3 fee legs"); `fee_decompositor/pyproject.toml:8` ("Uniswap V3 swap fee decomposition"); `api/pyproject.toml:8` ("Reads on-chain state").
- **Plotly + Kaleido** (gráficos estáticos): `backtester/pyproject.toml:21-22` (`kaleido>=0.2.1,<1.0.0`, com comentário sobre Chromium em `:22`).
- **Dash** (dashboard web): `dashboard/pyproject.toml:11` (`dash>=2.17`), `:12` (`plotly>=5.18`).
- **paramiko** (SSH, dashboard): `dashboard/pyproject.toml:13`.
- **PostgreSQL via psycopg2-binary** em api, backtester, fee_decompositor e indexer: `api/pyproject.toml:20`, `backtester/pyproject.toml:19`, `fee_decompositor/pyproject.toml:14`, `indexer/requirements.txt:2`.
- **Postgres 16 (dev, Docker)**: `api/docker-compose.yml:3` (`postgres:16-alpine`).
- **pytest** (testes) em todos: `api/pyproject.toml:27` (`pytest>=8.0`), `backtester/pyproject.toml:29`, `dashboard/pyproject.toml:19`, `fee_decompositor/pyproject.toml:20`, `backtester/requirements-dev.txt:1`, `fee_decompositor/requirements.txt:3`. Plugins: `pytest-mock`, `pytest-cov` (`backtester/pyproject.toml:31`), `responses` (`backtester/pyproject.toml:32`), `httpx` (`api/pyproject.toml:29`).
- **Ethereum util libs**: `backtester/pyproject.toml:17-18` (`eth-hash[pycryptodome]`, `eth-utils`).
- **requests, pyyaml** (backtester): `backtester/pyproject.toml:14-15`.
- **Ferramentas de lint/tipo (indício, sem config lida)**: `.ruff_cache`, `.mypy_cache` na raiz (listagem); nenhum `[tool.ruff]` ou `[tool.mypy]` nos manifests lidos.
- **Go, JS, TS, Next.js, SQL (além de DDL de Postgres implícita)**: nenhum indício nos arquivos lidos. `sdd-workflow-scripts/convert-agents.mjs` (listagem) é JavaScript, sem manifest.

## Comandos
- Nenhum comando declarado nos arquivos lidos: os `pyproject.toml` não têm seção `[project.scripts]` e não há Makefile ou justfile na listagem da raiz. Declarado: `api/docker-compose.yml:14-18` faz healthcheck com `pg_isready -U xend -d xendmm`.
- Testes configurados: `dashboard/pyproject.toml:26-27` (`testpaths = ["tests"]`); instalação em ordem citada no README (`api/pyproject.toml:21-22`, `backtester/pyproject.toml:23-24`), README não lido.
- Scripts existentes, não lidos (listagem): `api/scripts/`, `dashboard/setup.sh`, `backtester/pytest.ini`, `fee_decompositor/pytest.ini`.

## Regras/convenções declaradas
- **Estado do projeto**: sempre atualizar `STATE.md`, `PROJECT.md`, `ROADMAP.md` em `.specs/` após concluir feature, **mas nunca commitar** (`AGENTS.md:1`; `CLAUDE.md:1`).
- **`.specs/` nunca vai para commit nem sai do `.gitignore`** (`AGENTS.md:4`; `CLAUDE.md:4`). Motivo registrado no próprio arquivo: "Issue found when model commit ./specs folder files. 05/18/2026" (`AGENTS.md:5`).
- Atualizar `tasks.md` e `spec.md` da pasta da feature após concluir tarefas (`AGENTS.md:2`).
- `/compact` no meio da tarefa; `/clear` ao trocar de tarefa (`AGENTS.md:3`).
- Consultar commits e PRs recentes quando pedirem o que foi resolvido (`AGENTS.md:6`); motivo em `AGENTS.md:7` (05/14/2026).
- **Nunca escrever `# noqa`** em código, e checar o código antes do commit (`AGENTS.md:8`); motivo em `AGENTS.md:9` (05/18/2026).

## Divergências e inconsistências
1. **web3 com faixas incompatíveis entre apps**: `api/pyproject.toml:18` pede `web3>=6.15,<7`; `indexer/requirements.txt:1` pede `web3>=7.0.0`. Não existe versão que satisfaça os dois, então o `api` e o `indexer` não podem compartilhar o mesmo ambiente.
2. **Padrão de `include` de pacote sem diretório correspondente**: `api/pyproject.toml:33-34` usa `where = ["."]` e `include = ["api*"]`; a raiz de `api/` tem `src/` (listagem), e não existe `api/api/`. O mesmo ocorre em `backtester/pyproject.toml:36-37` (`include = ["backtester*"]`, sem `backtester/backtester/`) e `fee_decompositor/pyproject.toml:25-26` (`include = ["fee_decompositor*"]`, sem `fee_decompositor/fee_decompositor/`). Os pacotes reais estão em `src/` (listagem). Não testei o build (somente leitura); é ponto de verificação.
3. **Layouts de pacote mistos**: `dashboard/pyproject.toml:24` usa `where = ["src"]` (layout src), enquanto os outros três usam `where = ["."]` (layout flat). A diferença é intencional ou não? Não está declarada.
4. **Caminho de `.specs` citado não existe**: `AGENTS.md:1` manda atualizar `STATE.md`, `PROJECT.md` e `ROADMAP.md` em `.specs/`; a listagem de `.specs/` mostra só `features/`, `project/`, `prompts/` e `quick/`, sem esses três arquivos na raiz. Não verifiquei as subpastas (fora da checagem feita).
5. **Dependências entre apps fora do manifest**: `api/pyproject.toml:21-22` e `backtester/pyproject.toml:23-24` deixam `backtester` e `fee_decompositor` fora das dependências, com "see README" (README não lido). A instalação depende de ordem manual.
6. **pytest-mock em versões diferentes**: `api/pyproject.toml:28` e `backtester/pyproject.toml:30` pedem `>=3.12`; `fee_decompositor/pyproject.toml:21` e `fee_decompositor/requirements.txt:4` pedem `>=3.0`.
7. **Lista de dev duplicada em dois lugares**: `backtester/requirements-dev.txt:1-4` repete `[project.optional-dependencies].dev` de `backtester/pyproject.toml:29-32`; `fee_decompositor/requirements.txt:1-4` repete `fee_decompositor/pyproject.toml:14-21`. Hoje estão iguais, mas é duplicação que pode divergir.
8. **Caches de lint sem configuração visível**: `.ruff_cache` e `.mypy_cache` na raiz (listagem) indicam uso de ruff e mypy, mas os manifests lidos não têm `[tool.ruff]` nem `[tool.mypy]`. Pode estar em arquivos não lidos (`ruff.toml`, `mypy.ini`, que não aparecem na listagem da raiz).

## Lacunas
- `.gitignore` (raiz) existe (listagem); não lido — motivo: fora da lista. A regra `AGENTS.md:4` depende de `.specs/` estar nele, então não foi confirmado.
- `.env` e `.env.example` existem em `api/`, `backtester/`, `dashboard/`, `fee_decompositor/` e `indexer/` (listagem); não lidos — motivo: `.env*` é proibido.
- `README.md` em `api/`, `backtester/`, `dashboard/`, `fee_decompositor/`, `indexer/` (listagem) — não lidos — motivo: README é proibido.
- `indexer/DEEP-REVIEW-multipool.md` existe (listagem); não lido — motivo: doc fora da lista.
- Arquivos `.md` de processo na raiz: `HARNESS.md`, `MEMORY.md`, `RUNBOOK-BOT-API-MAINNET.md`, `PLANO-BOT-API-INTEGRACAO.md`, `BUG-protocol-fee-attribution.md`, `dt.md` — existem (listagem); só registrados — motivo: fora do escopo de leitura.
- `sdd-workflow-scripts/` (sem manifest; contém `convert-agents.mjs` e `hooks/`) — não lido — motivo: sem manifest, não é app.
- `backtester/configs/`, `api/configs/`, `api/scripts/`, `backtester/pytest.ini`, `fee_decompositor/pytest.ini`, `dashboard/setup.sh` — existem (listagem); não lidos — motivo: fora da lista.
- Pastas de ferramentas de agente (`.claude/`, `.cursor/`, `.windsurf/`, `.opencode/`, `.agents/`, `.specs/`) — existem (listagem); só registradas — motivo: fora do escopo.
- Não há `.github/` (listagem): sem CI declarado neste repo.
- Não há Dockerfile em nenhum app da listagem; só `api/docker-compose.yml`.
- Teto de checagens: não atingido (~22 de 25).
