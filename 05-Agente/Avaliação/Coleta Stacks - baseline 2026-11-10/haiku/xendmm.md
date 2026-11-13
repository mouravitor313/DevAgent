# Dossiê de contexto — xendmm (somente leitura)

Arquivos lidos: 10 (AGENTS.md, CLAUDE.md, api/pyproject.toml, api/docker-compose.yml, backtester/pyproject.toml, backtester/requirements-dev.txt, dashboard/pyproject.toml, fee_decompositor/pyproject.toml, fee_decompositor/requirements.txt, indexer/requirements.txt). Não há `apps/` no repo; os apps foram os subdiretórios de primeiro nível com manifest: `api`, `backtester`, `dashboard`, `fee_decompositor`, `indexer`. Raiz não tem manifest Python/JS.

## Stacks presentes
- **Python >= 3.11**: `C:\Users\Pedro\Projetos\xendmm\api\pyproject.toml:10`; `backtester\pyproject.toml:10`; `dashboard\pyproject.toml:9`; `fee_decompositor\pyproject.toml:10`.
- **FastAPI / Uvicorn / Pydantic**: `api\pyproject.toml:14-17`.
- **web3.py**: `api\pyproject.toml:18` (`web3>=6.15,<7`); `indexer\requirements.txt:1` (`web3>=7.0.0`).
- **PostgreSQL via psycopg2**: `api\pyproject.toml:20`; `backtester\pyproject.toml:19`; `fee_decompositor\pyproject.toml:14`; `indexer\requirements.txt:2`. Servidor: `api\docker-compose.yml:3` (`postgres:16-alpine`).
- **Dash / Plotly / kaleido**: `dashboard\pyproject.toml:11-12`; `backtester\pyproject.toml:21-22`.
- **Paramiko (SSH)**: `dashboard\pyproject.toml:13`.
- **Requests / pyyaml / eth-utils (backtester)**: `backtester\pyproject.toml:14-18`.
- **Pytest**: `api\pyproject.toml:26-30`; `backtester\pyproject.toml:28-33`; `backtester\requirements-dev.txt:1-4`; `dashboard\pyproject.toml:18-27`; `fee_decompositor\pyproject.toml:19-22`; `fee_decompositor\requirements.txt:3-4`.
- **Build com setuptools**: `[build-system]` em `api\pyproject.toml:1-3`, `backtester\pyproject.toml:1-3`, `dashboard\pyproject.toml:1-3`, `fee_decompositor\pyproject.toml:1-3`.
- **Docker Compose**: `api\docker-compose.yml:1`.
- **SQL**: não lido (ver Lacunas); só via PostgreSQL acima.
- **JavaScript / TypeScript / Next.js / Go**: nenhum manifest no escopo permitido.

## Comandos (só o que está escrito)
- Healthcheck do banco: `pg_isready -U xend -d xendmm` (`api\docker-compose.yml:15`).
- Pytest: `testpaths = ["tests"]` (`dashboard\pyproject.toml:26-27`); demais `pytest` só como dependência de dev.
- Não há comandos de build, lint, typecheck, formatação ou migração escritos nos manifests lidos.
- Dependências de dev instaláveis via extras: `pip install -e .[dev]` não está escrito; apenas existem `[project.optional-dependencies] dev` em `api\pyproject.toml:25-30`, `backtester\pyproject.toml:27-33`, `dashboard\pyproject.toml:17-21`, `fee_decompositor\pyproject.toml:18-22`.
- Ordem de instalação (sibling editable installs) é referenciada como "ver README" (`api\pyproject.toml:21-22`; `backtester\pyproject.toml:23-24`) — o README não foi lido.

## Regras/convenções declaradas
- Atualizar STATE.md, PROJECT.md, ROADMAP.md em `.specs/` após concluir feature, **mas NUNCA commitar** — `AGENTS.md:1`, `CLAUDE.md:1`.
- Atualizar tasks.md e spec.md da feature — `AGENTS.md:2`, `CLAUDE.md:2`.
- `/compact` no meio da tarefa, `/clear` ao trocar de tarefa — `AGENTS.md:3`, `CLAUDE.md:3`.
- **NUNCA** commitar nem remover do `.gitignore` os arquivos de `.specs/` — `AGENTS.md:4`, `CLAUDE.md:4` (comentário de origem em :5).
- Conferir commits e PRs recentes quando perguntado sobre o que foi resolvido — `AGENTS.md:6`, `CLAUDE.md:6`.
- **NUNCA** escrever `# noqa` em código; conferir antes do commit — `AGENTS.md:8`, `CLAUDE.md:8`.
- Dependências entre projetos são instalações editáveis irmãs, não declaradas no manifesto — `api\pyproject.toml:21-22`; `backtester\pyproject.toml:23-24`.

## Divergências e inconsistências
1. **web3 com faixas incompatíveis**: `api\pyproject.toml:18` exige `web3>=6.15,<7`; `indexer\requirements.txt:1` exige `web3>=7.0.0`. Não há versão que satisfaça os dois; os projetos não podem compartilhar o mesmo ambiente.
2. **Pytest em arquivo de runtime**: `fee_decompositor\requirements.txt:3-4` mistura `pytest` e `pytest-mock` (dev) com dependências de runtime; `fee_decompositor\pyproject.toml:19-22` separa os extras `dev`. Convenção diferente entre os dois arquivos do mesmo projeto.
3. **Duplicação de dev deps**: `backtester\pyproject.toml:28-33` e `backtester\requirements-dev.txt:1-4` listam as mesmas dependências (contém `pytest-cov` e `responses`). Risco de drift.
4. **Descoberta de pacotes possivelmente vazia (a confirmar)**: `api\pyproject.toml:32-35` (`include = ["api*"]`, `where = ["."]`), `backtester\pyproject.toml:35-38` (`include = ["backtester*"]`) e `fee_decompositor\pyproject.toml:24-27` (`include = ["fee_decompositor*"]`). Na raiz de cada projeto a listagem não mostra subpacote com esse nome (há `src/`, `tests/`, `configs/` etc.); o próprio diretório é o pacote. Pode resultar em build sem pacotes. Layout de `src/` não lido.
5. **Versão mínima de psycopg2 diferente**: `api\pyproject.toml:20` e `backtester\pyproject.toml:19` e `fee_decompositor\pyproject.toml:14` usam `>=2.9`; `indexer\requirements.txt:2` usa `>=2.9.9`. Menor, mas não uniforme.
6. **Indexer sem manifest de projeto**: `indexer\` só tem `requirements.txt` (`indexer\requirements.txt:1-3`); os demais apps têm `pyproject.toml`. Convenções diferentes.
7. **Ferramentas de lint presentes sem config lida**: a raiz tem `.ruff_cache` e `.mypy_cache` (listagem), mas nenhum `ruff`/`mypy` aparece nos manifests lidos.
8. **Credenciais fixas em compose local**: `api\docker-compose.yml:9-10` (`xend`/`xend`) e porta 5432 exposta (`:7`). Aceitável para dev; registrado como observação.
9. **Versão do Postgres local**: `api\docker-compose.yml:3` usa `postgres:16-alpine`; nenhuma outra referência no escopo lido.

## Lacunas (não confirmado dentro do limite de leitura)
- Fora da lista e não lidos: `backtester\pytest.ini` e `fee_decompositor\pytest.ini` (listados na pasta, mas não são manifest permitido); `dashboard\setup.sh`, `dashboard\conftest.py`; `api\configs\`, `backtester\configs\`.
- Código-fonte e testes: `api\src`, `api\tests`, `api\scripts`, `backtester\src`, `backtester\tests`, `dashboard\src`, `dashboard\tests`, `fee_decompositor\src`, `fee_decompositor\tests`, `fee_decompositor\integration_tests`, `indexer\src`, `indexer\tests`.
- READMEs (`api\README.md`, `backtester\README.md`, `fee_decompositor\README.md`, `indexer\README.md`) — proibidos pela regra; onde está a ordem de instalação e comandos reais.
- SQL: não há migrations/schemas listados nas pastas permitidas; nada de SQL pôde ser confirmado.
- Raiz do repo: não há `pyproject.toml`, `requirements*.txt`, `docker-compose*.yml`, `.github/workflows`, `Makefile` na listagem; nenhuma configuração de CI encontrada.
- `.specs\` (citado em `AGENTS.md:1`) — não lido.
- Ambientes `venv\`, `backtester\venv\`, `fee_decompositor\venv\` — excluídos por regra.
- JavaScript/TypeScript/Next.js/Go: nenhum manifest no escopo; `sdd-workflow-scripts\convert-agents.mjs` é `.mjs`, mas não é app com manifest e não foi lido.
