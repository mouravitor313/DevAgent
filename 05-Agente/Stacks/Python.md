---
tipo: stack
status: em-construção
tags: [devagent, stack, python]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Stacks]]", "[[Tarefas transversais]]"]
---
# Python

## Contexto
- Ambiente (um dos dois, conforme o repo): `python -m venv .venv` + `pip install -r requirements.txt` ou `pip install -e ".[dev]"`; ou `uv sync` (com o extra `dev` do repo) e `uv run <comando>`. Use a versão de `requires-python` / `.python-version` do repo, não a do sistema.
- Teste: `pytest` (ou `uv run pytest`). Testes que exigem banco ou rede levam o marker `integration`; por padrão rode sem eles: `pytest -m "not integration"`.
- Lint: `ruff check .` (ou `ruff check src tests`). Tipos: `mypy src`. Formatação: `ruff format` só onde o repo documenta; vários repos não documentam lint/tipos/formatação, então confira o `pyproject.toml` antes de assumir.
- Ruff e mypy são configurados no `pyproject.toml` do repo (`line-length = 100` é o padrão dos repos que configuram). Corrija o código; não afrouxe regras nem acrescente `ignore` para passar (ver AGENTS.md do portfólio sobre `# noqa`).
- Dinheiro e quantidades: `Decimal` ou string decimal, nunca `float`; `NUMERIC` do Postgres deve chegar ao Python como `Decimal`.
- Configuração e segredos por variáveis de ambiente (`os.getenv`, `python-dotenv`, `pydantic-settings`); nunca ler nem commitar `.env` ou arquivos de credenciais.
- Config tipada com `pydantic` / `pydantic-settings`; parâmetros de estratégia em YAML, não no código.
- Logging estruturado com `structlog` (ou `loguru` nos dashboards); evite `print()`.
- Apps Streamlit: `streamlit run <app>.py`.

## Skills
| skill | origem | serve para | estado | testado em |
|---|---|---|---|---|
| `aws-sdk-python-usage` | plugin AWS (instalado) | código com boto3/botocore | candidata | — |
| `polars` | `arb/.claude/skills` (symlink de `.agents/skills`) | dataframes rápidos | candidata | — |
| `dask` | `arb/.claude/skills` (symlink de `.agents/skills`) | dados maiores que a memória | candidata | — |
| `pymc` | `arb/.claude/skills` (symlink de `.agents/skills`) | modelagem bayesiana | candidata | — |
| `scikit-learn` | `arb/.claude/skills` (symlink de `.agents/skills`) | ML clássico | candidata | — |
| `shap` | `arb/.claude/skills` (symlink de `.agents/skills`) | explicabilidade de modelos | candidata | — |
| `statsmodels` | `arb/.claude/skills` (symlink de `.agents/skills`) | econometria e séries | candidata | — |
| `statistical-analysis` | `arb/.claude/skills` (symlink de `.agents/skills`) | testes e análise estatística | candidata | — |
| `aeon` | `arb/skills-lock.json:2-5` (K-Dense-AI/scientific-agent-skills) | séries temporais | candidata | — |
| `timesfm-forecasting` | `arb/.claude/skills` (symlink de `.agents/skills`) | previsão de séries | candidata | — |
| `backtesting-trading-strategies` | `arb/.claude/skills` | backtest de estratégias | candidata | — |
| `python-reviewer` (agente, não skill) | `xendmm/.opencode/agents` (conteúdo não lido) | revisão de código Python | candidata | — |

## Documentação
- [Python 3 — documentação](https://docs.python.org/3/)
- [PEP 8](https://peps.python.org/pep-0008/)
- [pytest](https://docs.pytest.org/)
- [Ruff](https://docs.astral.sh/ruff/) · [uv](https://docs.astral.sh/uv/)
- [mypy](https://mypy.readthedocs.io/)
- [FastAPI](https://fastapi.tiangolo.com/) · [Pydantic](https://docs.pydantic.dev/) · [SQLAlchemy](https://docs.sqlalchemy.org/) · [Alembic](https://alembic.sqlalchemy.org/)
- [structlog](https://www.structlog.org/) · [web3.py](https://web3py.readthedocs.io/) · [Streamlit](https://docs.streamlit.io/)

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|
| Context7 | plugin `everything-claude-code` (allowlist de `dashboard_xend/.claude/settings.local.json:15`) | documentação atual de bibliotecas | candidata | — | só um repo Python o lista; `xend-onchain/apps/mm/CLAUDE.md:124-125` o cita para Go |

## Achados
| data | achado | fonte |
|---|---|---|
| 2026-11-08 | Python do dashboard diverge: `.python-version` 3.14, `pyvenv.cfg` 3.11.9, devcontainer 3.11, README 3.10+ | dashboard_xend/.python-version:1; README.md:4; .devcontainer/devcontainer.json:4 |
| 2026-11-08 | Python 3.14 do sistema é novo demais para wheels do BRL4; usar 3.12 via uv. O `arb` registra 3.14 como ambiente | xend-onchain/README.md:178; arb/PROJECT.md:217 |
| 2026-11-08 | `web3` diverge entre subprojetos: `<7` na api, `>=7.0.0` no indexer | xendmm/api/pyproject.toml:18; xendmm/indexer/requirements.txt:1 |
| 2026-11-08 | SQLAlchemy travado em `<2.1` porque a 2.1.0 quebrou o guard de atomicidade de consumo de quote | xend-baas-api/pyproject.toml:12-15 |
| 2026-11-08 | Deps de runtime precisam estar no `pyproject.toml` (deploy Vercel instala por ele); a ausência derrubou todo boot de prod com `ModuleNotFoundError`. Candidata a regra | xend-baas-api/pyproject.toml:36-41 |
| 2026-11-08 | Dev deps pinadas no gate para uma release nova não deixá-lo vermelho; os demais repos usam só mínimos `>=`. Candidata a regra | xend-baas-api/requirements-dev.txt:3-6 |
| 2026-11-08 | mypy divergente: strict no xend-arb; frouxo com overrides `ignore_errors` no baas; strict mas não bloqueante na CI (42 erros) no BRL4 | xend-arb/pyproject.toml:40-42; xend-baas-api/pyproject.toml:111-112,143; xend-onchain/README.md:260-262 |
| 2026-11-08 | Conjuntos de regras do ruff divergem: xend-arb inclui `N,UP,B,A,SIM`; baas adia `B,UP,S,ASYNC`; cookbooks inclui `S` | xend-arb/pyproject.toml:35; xend-baas-api/pyproject.toml:85-86; arb/claude-cookbooks/pyproject.toml:54 |
| 2026-11-08 | Sem configuração de ruff/mypy, apesar de `.ruff_cache` (0.15.9) existir; sem Makefile, pre-commit nem CI | xendmm (raiz, `.ruff_cache/0.15.9`) |
| 2026-11-08 | `ruff`/`mypy` listados em requirements, sem config nem CI de lint/teste (só `deploy.yml`). O checklist pré-deploy (`pytest -v`, `mypy --strict ...`, `ruff check .`) não é executado automaticamente | dashboard_xend/requirements.txt:26-27; MIGRATION_GUIDE.md:200-202; .github/workflows/deploy.yml |
| 2026-11-08 | Deploy compila todos os `.py` rastreados com `py_compile` antes de reiniciar o serviço (evita crash-loop do launchd); não importa o app. Candidata a prática | dashboard_xend/.github/deploy.sh:9-12,43-48 |
| 2026-11-08 | Raiz do `arb` sem `pyproject.toml`, testes, lint nem formatação; só `requirements.txt` com mínimos | arb/requirements.txt:1-7 |
| 2026-11-08 | Comandos de lint/mypy/bandit e `alembic upgrade` não documentados; dois gerenciadores (`requirements.txt` no Dockerfile e `uv.lock` presente) | xend-baas-api/README.md:130-134; Dockerfile:24-25 |
| 2026-11-08 | xend-arb sem `[build-system]`, sem `ruff format` documentado e sem lockfile | xend-arb/pyproject.toml; README.md:122-127 |
| 2026-11-08 | Subprojetos irmãos instalados em modo editable fora do manifest; a ordem de instalação importa | xendmm/api/README.md:131-134; backtester/README.md:95-97 |
| 2026-11-08 | `.env.example` citado nos READMEs mas ausente em `api/` e `backtester/`; `python -m dashboard.app` não confere com o layout `src/` | xendmm/api/README.md:136; backtester/README.md:98; dashboard/pyproject.toml:24 |
| 2026-11-08 | README×código no `arb`: `.un_cycle_collector.ps1` e `.un_xvenue_collector.ps1` (typo; deveria ser `.\run_...`); allowlist com `--persist` não verificada | arb/README.md:89,95; .claude/settings.local.json:9 |
| 2026-11-08 | README×código no dashboard: cita `mesa_otc/`, `fechamento_otc.py`, `gerador_recibos.py` inexistentes; `credentials.json` do guia é `credenciais_google.json` | dashboard_xend/README.md:31-36; MIGRATION_GUIDE.md:8 |
| 2026-11-08 | Prática de um repo: pytest com `asyncio_mode = "auto"` e gate de cobertura `fail_under = 80`. Candidata a regra | xend-baas-api/pyproject.toml:70-72,164 |
| 2026-11-08 | Prática de um repo: `print()` proibido (usar logger); nunca criar dados fictícios (retornar `DataFrame` vazio ou `0.0`); buscar colunas por nome, não por índice | dashboard_xend/.cursorrules:7-18,93; README.md:104 |
| 2026-11-08 | Streamlit com CORS e XSRF desligados no servidor e no devcontainer | dashboard_xend/.streamlit/config.toml:3-4; .devcontainer/devcontainer.json:22 |
| 2026-11-08 | Aritmética inteira só com `//`, nunca `/`; psycopg2 deve devolver `Decimal` | xendmm/fee_decompositor/README.md:101-102 |
| 2026-11-08 | Pesquisa nunca assina nem envia tx (`arb`); a API nunca monta calldata nem assina (`xendmm`); `swap` é dry-run até `--yes` (`xend-arb`). Candidata a regra de Contexto (pergunta ao advisor) | arb/PROJECT.md:218; xendmm/api/README.md:13; xend-arb/README.md:201-204 |
| 2026-11-08 | `claude-cookbooks` (repo aninhado no `arb`) usa `uv add` e proíbe editar `pyproject.toml` à mão | arb/claude-cookbooks/CLAUDE.md:62 |
| 2026-11-08 | `cli-poc` sem pins, sem versão de Python e sem comando de teste (existe `lib/test_v3_math.py`) | util/cli-poc/requirements.txt:1-4 |
