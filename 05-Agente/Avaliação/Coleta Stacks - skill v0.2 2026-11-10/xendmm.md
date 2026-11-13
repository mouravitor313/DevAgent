# Dossiê — xendmm

Lidos: 11 arquivos (~182 linhas via Read) · Checagens de existência: 9 (Glob; 1 expirou por timeout e foi refeita com padrão restrito) · Teto atingido: não
Arquivos lidos: AGENTS.md, CLAUDE.md, api/pyproject.toml, api/docker-compose.yml, backtester/pyproject.toml, backtester/requirements-dev.txt, dashboard/pyproject.toml, fee_decompositor/pyproject.toml, fee_decompositor/requirements.txt, indexer/requirements.txt, .opencode/package.json

## Stacks presentes
- **Python >= 3.11**: `requires-python = ">=3.11"` nos quatro pyprojects (`api/pyproject.toml:10`, `backtester/pyproject.toml:10`, `dashboard/pyproject.toml:9`, `fee_decompositor/pyproject.toml:10`). Build com setuptools (`api/pyproject.toml:2-3`, `backtester/pyproject.toml:2-3`, `dashboard/pyproject.toml:2-3`, `fee_decompositor/pyproject.toml:2-3`).
- **FastAPI / Uvicorn / Pydantic (api)**: `api/pyproject.toml:14-17`; descrição "Live strategy evaluation API" (`api/pyproject.toml:8`).
- **Web3 / EVM (api, indexer)**: `web3>=6.15,<7` (`api/pyproject.toml:18`); `web3>=7.0.0` (`indexer/requirements.txt:1`). Divergência, ver abaixo.
- **Dash / Plotly (dashboard, backtester)**: `dash>=2.17` (`dashboard/pyproject.toml:11`); `plotly>=5.18` (`dashboard/pyproject.toml:12`, `backtester/pyproject.toml:21`); `kaleido>=0.2.1,<1.0.0` para exportar imagem do plotly (`backtester/pyproject.toml:22`).
- **SSH (dashboard)**: `paramiko>=3.4` (`dashboard/pyproject.toml:13`).
- **PostgreSQL**: `psycopg2-binary` em api, backtester, fee_decompositor e indexer (`api/pyproject.toml:20`, `backtester/pyproject.toml:19`, `fee_decompositor/pyproject.toml:14`, `indexer/requirements.txt:2`); imagem `postgres:16-alpine` (`api/docker-compose.yml:3`), banco `xendmm` (`api/docker-compose.yml:11`).
- **Ethereum utilitários (backtester)**: `eth-hash[pycryptodome]>=0.7.0`, `eth-utils>=4.0` (`backtester/pyproject.toml:17-18`).
- **Uniswap V3 (domínio)**: "LP position backtester over pre-computed Uniswap V3 fee legs" (`backtester/pyproject.toml:8`); "Tick-level Uniswap V3 swap fee decomposition pipeline" (`fee_decompositor/pyproject.toml:8`).
- **Testes**: pytest em todos os pacotes (`api/pyproject.toml:27-29`, `backtester/pyproject.toml:29-32`, `dashboard/pyproject.toml:19-20`, `fee_decompositor/pyproject.toml:20-21`); `[tool.pytest.ini_options] testpaths = ["tests"]` (`dashboard/pyproject.toml:26-27`).
- **Node (apenas ferramenta)**: `.opencode/package.json` com `@opencode-ai/plugin` (`:3`) e `shadcn` (`:6`). Não há app Node do produto.

## Comandos
- nenhum declarado nos manifests lidos para o produto (sem scripts em pyproject; não há Makefile, justfile nem scripts na raiz — listagem).
- instalação: nota de ordem de instalação "sibling editable installs" (`api/pyproject.toml:21-22`; `backtester/pyproject.toml:23-24`), com remissão ao README (não lido).
- testes: `pytest` (dev extras em `api/pyproject.toml:26-30`, `backtester/pyproject.toml:28-33`, `dashboard/pyproject.toml:18-21`, `fee_decompositor/pyproject.toml:19-22`); `dashboard/pyproject.toml:26-27` define `testpaths`.
- ambiente local de banco: `docker-compose` com serviço `postgres` (`api/docker-compose.yml:1-18`); healthcheck `pg_isready -U xend -d xendmm` (`api/docker-compose.yml:15`).
- pacotes: `[tool.setuptools.packages.find]` em `api/pyproject.toml:32-35`, `backtester/pyproject.toml:35-38`, `fee_decompositor/pyproject.toml:24-27`, `dashboard/pyproject.toml:23-24` (`where = ["src"]`).

## Regras/convenções declaradas
- ALWAYS atualizar STATE.md, PROJECT.md e ROADMAP.md em `.specs/` após concluir feature, mas NUNCA commitar (`AGENTS.md:1`; idêntico em `CLAUDE.md:1`)
- ALWAYS atualizar tasks.md e spec.md da pasta da feature (`AGENTS.md:2`)
- ALWAYS /compact no meio da tarefa e /clear ao trocar de tarefa (`AGENTS.md:3`)
- NEVER commitar nem remover do `.gitignore` os arquivos de `.specs/` (`AGENTS.md:4`)
- ALWAYS checar commits e PRs recentes quando pedirem o que foi resolvido (`AGENTS.md:6`)
- NEVER escrever `# noqa` em código; ALWAYS checar o código escrito antes de commit (`AGENTS.md:8`)
- Os comentários `# Issue found ...` (`AGENTS.md:5`, `:7`, `:9`) registram a origem de cada regra (datas 05/14 e 05/18/2026).
- `AGENTS.md` e `CLAUDE.md` têm o mesmo texto nas 9 linhas (verificado por leitura integral dos dois).

## Divergências e inconsistências
1. **web3 em major diferente**: `api/pyproject.toml:18` pina `web3>=6.15,<7` × `indexer/requirements.txt:1` pede `web3>=7.0.0`. Mesma dependência, majors incompatíveis entre serviços do mesmo repo; uso compartilhado não verificado (código não lido).
2. **Caminho do `.specs/` diverge**: `AGENTS.md:1` e `CLAUDE.md:1` mandam atualizar "STATE.md, PROJECT.md and ROADMAP.md in .specs/ folder", mas a listagem acha esses arquivos em `.specs/project/` (PROJECT.md, ROADMAP.md, STATE.md). Não há `.specs/*.md` na raiz.
3. **pytest-mock com mínimos diferentes**: `api/pyproject.toml:28` e `backtester/pyproject.toml:30` pedem `>=3.12`; `fee_decompositor/pyproject.toml:21` e `fee_decompositor/requirements.txt:4` pedem `>=3.0`. Menor.
4. **Dependências duplicadas em dois formatos**: `fee_decompositor/pyproject.toml:13-22` × `fee_decompositor/requirements.txt:1-4` (consistentes hoje); `backtester/pyproject.toml:28-33` × `backtester/requirements-dev.txt:1-4` (consistentes hoje). Risco de deriva.
5. **Pins mistos em `.opencode/package.json`**: `:3` pina `1.3.15` exato, `:6` usa `^4.1.2`. Menor; é pasta de ferramenta.
6. **`indexer` sem manifest de projeto**: só `indexer/requirements.txt` (`:1-3`); não há `indexer/pyproject.toml` (listagem). Observação.
7. **Referências ao README para instalação**: `api/pyproject.toml:9` (`readme = "README.md"`) e `:21-22` / `backtester/pyproject.toml:23-24` remetem ao README. Os READMEs existem (`api/README.md`, `backtester/README.md`, `fee_decompositor/README.md`, `dashboard/README.md`, `indexer/README.md`, listagem), mas não foram lidos. Não confirmado o conteúdo da ordem de instalação.

## Lacunas
- `api/README.md`, `backtester/README.md`, `fee_decompositor/README.md`, `dashboard/README.md`, `indexer/README.md` — existem (listagem); não lidos (regra: README nunca é lido). Root `README.md` não existe (listagem).
- `.gitignore` — existe (listagem); não lido (fora da lista). Não confirmado se `.specs/` está ignorado, como exige `AGENTS.md:4`.
- `.specs/` (`features/`, `project/`, `prompts/`) — existe (listagem); não lido (specs/docs fora do escopo).
- Código Python (`api/`, `backtester/`, `dashboard/src/dashboard/**`, `fee_decompositor/`, `indexer/*.py`) — fora do escopo de leitura; `api/tests/conftest.py` e `dashboard/tests/test_format.py` existem (listagem), não lidos.
- Ausentes (listagem, checado): CI (`.github/workflows/`), `Dockerfile` em qualquer nível, `ruff.toml`, `Makefile`, `justfile`, `pytest.ini`, `setup.cfg`, `.python-version`, `.nvmrc`, `.tool-versions`, `.pre-commit-config.yaml`, configs de biome/eslint/prettier. Sem fonte de versão de Python além de `requires-python`; sem CI para cruzar.
- Versão do PostgreSQL: só `postgres:16-alpine` em `api/docker-compose.yml:3`; sem outra referência no repo lido para comparar.
- Fora do escopo: `.cursor/skills/tlc-spec-driven/`, `.windsurf/skills/tlc-spec-driven/` (skills de ferramenta, existem); `.opencode/node_modules/`; ambientes `venv/`, `backtester/venv/`, `dashboard/.venv/`, `fee_decompositor/venv/`, `indexer/venv/` (ignorados).
- Stack de frontend: `dashboard` é Dash (Python), não há app Node/React do produto.
