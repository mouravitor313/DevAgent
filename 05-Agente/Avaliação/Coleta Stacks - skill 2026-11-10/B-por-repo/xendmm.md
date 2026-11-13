# Dossiê — xendmm

Lidos: 12 arquivos (~180 linhas) · Checagens de existência: ~33 · Teto atingido: sim (checagens: ~33 contra teto de 25; o excesso foi meu, feito por listagens de diretório além do necessário)
Arquivos lidos: `AGENTS.md`, `CLAUDE.md`, `api/pyproject.toml`, `api/docker-compose.yml`, `backtester/pyproject.toml`, `backtester/pytest.ini`, `backtester/requirements-dev.txt`, `dashboard/pyproject.toml`, `fee_decompositor/pyproject.toml`, `fee_decompositor/requirements.txt`, `fee_decompositor/pytest.ini`, `indexer/requirements.txt`

Observação de processo: li 1 linha de `.gitignore` (via `grep specs`), fora da lista permitida. Está registrada aqui por transparência; não entrou em nenhuma conclusão além da divergência 4.

## Estrutura (listagem)
- Raiz sem manifest de projeto (sem `package.json`, `go.mod`, `pyproject.toml`), sem `packages/`, `libs/` ou `apps/`, sem `.github/`, sem `Makefile`/`justfile`/`Dockerfile` (listagem da raiz).
- Apps Python com manifest (nível 1): `api/`, `backtester/`, `dashboard/`, `fee_decompositor/`, `indexer/` (este só tem `requirements.txt`, sem `pyproject.toml`).
- `scripts/` está vazio. `sdd-workflow-scripts/` contém `convert-agents.mjs` e `hooks/`, fora do escopo de leitura.

## Stacks presentes
- **Python >= 3.11**: declarado em `api/pyproject.toml:10`, `backtester/pyproject.toml:10`, `dashboard/pyproject.toml:9`, `fee_decompositor/pyproject.toml:10`. `indexer/requirements.txt` não declara versão.
- **setuptools como build backend**: `api/pyproject.toml:2-3`, `backtester/pyproject.toml:2-3`, `dashboard/pyproject.toml:2-3`, `fee_decompositor/pyproject.toml:2-3`.
- **FastAPI + Uvicorn + Pydantic**: `api/pyproject.toml:14-17` (app `api`, "Live strategy evaluation API", `:8`).
- **web3 (6.x na API; 7.x no indexer)**: `api/pyproject.toml:18` (`web3>=6.15,<7`), `indexer/requirements.txt:1` (`web3>=7.0.0`).
- **PostgreSQL 16**: `api/docker-compose.yml:3` (`postgres:16-alpine`); psycopg2-binary em `api/pyproject.toml:20`, `backtester/pyproject.toml:19`, `fee_decompositor/pyproject.toml:14`, `indexer/requirements.txt:2`.
- **Dash + Plotly + Paramiko**: `dashboard/pyproject.toml:11-13`. Plotly também em `backtester/pyproject.toml:21`; kaleido (export estático de Plotly) em `backtester/pyproject.toml:22`.
- **Uniswap V3 / pools (domínio)**: descrito em `backtester/pyproject.toml:8` ("pre-computed Uniswap V3 fee legs") e `fee_decompositor/pyproject.toml:8` ("Tick-level Uniswap V3 swap fee decomposition pipeline").
- **pytest**: `backtester/pytest.ini:1-3`, `fee_decompositor/pytest.ini:1-3` (marker `integration`: "requiring a live PostgreSQL database"); `dashboard/pyproject.toml:26-27` (`testpaths = ["tests"]`).
- **JavaScript/TypeScript, Next.js, Go: não encontrados.** Sem `package.json`, `tsconfig.json`, `next.config.*`, `go.mod` na raiz; sem esses arquivos na listagem dos apps de nível 1 (listagem).
- **SQL: não confirmado.** Não há pasta `migrations/` na listagem de `api/src/`. Não busquei `*.sql` recursivamente (proibido pela skill). Há `api/scripts/seed_db.py` (Python, não lido) — ver Lacunas.

## Comandos
- Nenhum comando de build, dev, teste, lint ou deploy declarado nos manifests lidos (sem `[project.scripts]`, sem `scripts` em manifest JS, sem Makefile na raiz).
- Pytest está implícito pelos `pytest.ini` e `[tool.pytest.ini_options]` (`dashboard/pyproject.toml:26-27`); nenhum comando escrito.
- Serviço de banco local: `docker compose`/`docker-compose` com o serviço `postgres` (`api/docker-compose.yml:1-18`); porta 5432, healthcheck com `pg_isready` (`api/docker-compose.yml:14-15`). Nenhum comando de subida escrito em arquivo lido.
- CI: nenhum (`.github/` não existe; listagem da raiz).

## Regras/convenções declaradas
- `AGENTS.md` e `CLAUDE.md` são **idênticos** (9 linhas cada, lidos integralmente; mesmo conteúdo).
- ALWAYS atualizar estado do projeto em `STATE.md`, `PROJECT.md` e `ROADMAP.md` na pasta `.specs/` após concluir feature, mas NUNCA commitar esses arquivos (`AGENTS.md:1`; idêntico em `CLAUDE.md:1`).
- ALWAYS atualizar `tasks.md` e `spec.md` da pasta da feature após concluir tarefas (`AGENTS.md:2`).
- ALWAYS usar `/compact` no meio de tarefa e `/clear` ao trocar de tarefa (`AGENTS.md:3`).
- NEVER commitar nem remover do `.gitignore` os arquivos `.specs/` (`AGENTS.md:4`). Incidente registrado em `AGENTS.md:5`.
- ALWAYS checar commits recentes e PRs abertos/fechados quando o usuário pedir acompanhamento do que foi resolvido (`AGENTS.md:6`).
- NEVER escrever flag/comentário `# noqa` em nenhum lugar do código; ALWAYS checar o código escrito antes do commit (`AGENTS.md:8`). Incidente em `AGENTS.md:9`.

## Divergências e inconsistências
1. **Versão major do web3 diverge entre apps**: `api/pyproject.toml:18` pina `web3>=6.15,<7`; `indexer/requirements.txt:1` pede `web3>=7.0.0`. Dois apps do mesmo repo não podem ser instalados no mesmo venv com ambas as restrições.
2. **Caminho dos arquivos de estado não bate com a instrução**: `AGENTS.md:1-2` manda atualizar `STATE.md`, `PROJECT.md`, `ROADMAP.md` "na pasta `.specs/`", mas a listagem mostra que eles estão em `.specs/project/` (com `features/`, `prompts/`, `quick/`); não existem em `.specs/` direto (listagem; `.specs/STATE.md`, `.specs/PROJECT.md`, `.specs/ROADMAP.md` não existem).
3. **Proteção de `.specs/` no `.gitignore` não confirmada**: `AGENTS.md:4` proíbe remover `.specs/` do `.gitignore`. O único padrão relacionado que vi é `specs/` (`.gitignore:23`). Pela semântica do gitignore, `specs/` casa com diretório chamado exatamente `specs`, não com `.specs`. Não confirmei o estado real (não li o arquivo inteiro); verificar com `git check-ignore -v .specs/project/STATE.md`.
4. **Dependências de instalação "por README" sem o README lido**: `api/pyproject.toml:21-22` e `backtester/pyproject.toml:23-24` dizem que `backtester` e `fee_decompositor` são instalações editáveis irmãs e remetem ao README. Não li `api/README.md` nem `backtester/README.md`.
5. **Versão de Python não declarada no indexer**: `api`, `backtester`, `dashboard` e `fee_decompositor` declaram `>=3.11`; `indexer/requirements.txt` não declara nada e não tem `pyproject.toml`.
6. **Pin de pytest-mock diferente entre apps**: `backtester/requirements-dev.txt:2` e `backtester/pyproject.toml:30` usam `>=3.12`; `fee_decompositor/pyproject.toml:21` e `fee_decompositor/requirements.txt:4` usam `>=3.0`. Baixa severidade.
7. **Configuração de pytest em dois formatos**: `pytest.ini` (`backtester`, `fee_decompositor`) e `[tool.pytest.ini_options]` em `pyproject.toml` (`dashboard/pyproject.toml:26-27`). Baixa severidade.

## Lacunas
- `api/README.md`, `backtester/README.md` e os demais READMEs — motivo: fora do escopo de leitura (README nunca lido).
- `api/.env`, `backtester/.env`, `fee_decompositor/.env`, `fee_decompositor/src/.env`, `indexer/.env`, `indexer/.env.example`, `dashboard/.env.example` — existência confirmada por listagem; não lidos — motivo: `.env` nunca é lido.
- `dashboard/setup.sh` (existe, listagem) — motivo: fora do escopo de leitura; pode conter comandos de setup.
- `dashboard/.claude/settings.local.json` (existe, listagem) — motivo: configuração do agente, fora da lista de leitura. `dashboard/.claude/CLAUDE.md` e `dashboard/.claude/AGENTS.md` não existem (checagem).
- `indexer/DEEP-REVIEW-multipool.md`, `BUG-protocol-fee-attribution.md`, `PLANO-BOT-API-INTEGRACAO.md`, `RUNBOOK-BOT-API-MAINNET.md`, `HARNESS.md`, `MEMORY.md`, `dt.md` (raiz) — motivo: `.md` de processo/análise fora do escopo de leitura. `RUNBOOK-BOT-API-MAINNET.md` pode trazer comandos de produção.
- `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.opencode/`, `.cursor/`, `.windsurf/`, `.agents/`, `.claude/` (raiz) — existência por listagem; não lidos — motivo: fora do escopo de leitura.
- `.coverage`, `.mypy_cache/`, `.ruff_cache/`, `.pytest_cache/` (raiz) — caches, ignorados por regra.
- `api/docker-compose.yml:10` contém credencial de desenvolvimento em texto plano (`POSTGRES_PASSWORD`); só registro a existência do fato, o valor não foi copiado.
- Lint/format configs (`ruff.toml`, `pyproject` de ruff, `.golangci.yml` etc.) — não há `ruff.toml` na listagem da raiz; configuração de ruff não confirmada em arquivo lido (`.ruff_cache/` existe, indicando uso). Motivo: teto de checagens.
- SQL e migrações: não confirmado — motivo: teto de checagens e busca recursiva proibida. `api/scripts/seed_db.py` (existe, não lido) pode conter SQL.
- `api/configs/strategies/` (existe, listagem) — conteúdo não lido — motivo: fora da lista.
- Código-fonte de `api/src/`, `backtester/src/`, `indexer/src/`, `fee_decompositor/src/`, `dashboard/src/` — não lido por regra (código-fonte nunca é lido).
- Lockfiles: nenhum encontrado na listagem de nível 1 (`uv.lock`, `poetry.lock`, `requirements.lock` não checados individualmente) — motivo: teto de checagens.
- CI: não existe nenhum workflow (`.github/` ausente) — confirmado pela listagem da raiz; não há o que ler.
