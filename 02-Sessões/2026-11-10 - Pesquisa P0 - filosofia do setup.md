---
tipo: sessão
status: consolidado
tags: [devagent, sessão, contexto, skills, github, pesquisa]
criado: 2026-11-10
atualizado: 2026-11-11
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# 2026-11-10 — Pesquisa P0: filosofia do setup

## Objetivo da sessão
Executar a Prioridade 0 (DEC-2026-11-10-25): pesquisa e estudo sobre contexto mínimo, Skills × Plugins e agentes paralelos com GitHub Issues, com saída numa nota de filosofia.

## O que foi feito
- Três subagentes de pesquisa em paralelo, um por tema, com fontes primárias sempre que possível.
- Medição local do contexto fixo:
  - O global e o portfólio estão enxutos.
  - `xend-platform/AGENTS.md` tem 289 linhas.
  - Há CLAUDE.md duplicados do AGENTS.md em 4 repos.
  - O índice de skills da sessão tem ~280 entradas, a maioria fora do escopo.
- Notas criadas:
  - [[Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos]] (evidência e links)
  - [[Filosofia do setup de agentes]] (rascunho v0: 20 princípios + modelo de issue)
- [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]: seção "Ajustes propostos pela pesquisa". Segue `proposta`.

## Principais achados
- O tamanho do contexto sozinho piora o modelo (Du et al. 2025, NoLiMa, RULER).
- Um AGENTS.md gerado por LLM custa ~20% a mais sem ganho; o escrito por dev ajuda pouco (ETH, ICLR 2026).
- Skills nem sempre são ativadas (Vercel: 56% de não invocação, não auditado). Por isso o essencial fica fixo, como índice compacto.
- AGENTS.md, MCP e Skills estão na Agentic AI Foundation. Plugins, hooks e subagents não têm padrão.
- PRs de agentes grandes são os rejeitados, e a revisão vira o gargalo. Paralelizar só tasks disjuntas.

## Decisões
- 11/11: filosofia aprovada (DEC-2026-11-11-01); ADR-0006 aceito com os 4 ajustes (DEC-2026-11-11-02). Encerra a DEC-2026-11-10-25.

## Próximos passos
- [x] Vítor revisou: filosofia `consolidado`, ADR-0006 `aceita` (11/11)
- [x] Teste de ativação das nossas skills executado em 11/11 no Claude Code → [[2026-11-11 - Teste de ativação de skills]] (OpenCode pendente)
- [ ] Testar junction `.agents/skills` → `.claude/skills` no Windows
- [ ] Conferir na doc se o Claude Code lê AGENTS.md nativamente sem CLAUDE.md
- [ ] P1: auditar o `xend-platform/AGENTS.md` e converter os CLAUDE.md duplicados em ponteiro (exige ok por repo)
- [ ] Investigar a origem das ~280 skills no índice (plugins/conectores do claude.ai) e o que dá para desligar

## Arquivos criados/alterados
- `03-Pesquisa/Referências/Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos.md` (novo)
- `04-Conhecimento/Filosofia do setup de agentes.md` (novo)
- `01-Projeto/Decisões/ADR-0006 - ….md`, `01-Projeto/Roadmap.md`, `00 - Index.md`

## Desenho do teste de ativação de skills (11/11, a executar numa sessão nova)
- **Pergunta:** quando o prompt pede algo que uma skill nossa cobre, o agente a carrega sozinho?
- **Skills:** `registro-de-decisoes` e `coleta-contexto-repo` (as duas nossas, com `description` própria).
- **Prompts:** ~20 por skill, em 3 grupos: explícitos ("registra essa decisão"), implícitos ("pode remover o X", "o que decidimos sobre o baas-api?") e negativos (não deveriam ativar). Escritos antes do teste, sem ajustar no meio.
- **Execução:** modo não interativo (`claude -p … --output-format stream-json`; `opencode run`), sessão limpa por prompt, num diretório de teste sem efeito colateral. Só observar se houve a chamada da skill, sem deixar gravar no Registro (cópia do vault ou permissões de escrita negadas).
- **Métricas:** ativação nos positivos, falso positivo nos negativos, por ferramenta e por modelo (Sonnet e um barato no OpenCode).
- **Variação:** rodar de novo com a `description` reescrita no padrão "Use quando…" e, se a ativação for baixa, com uma linha-índice no `AGENTS.md` ("decisões → skill registro-de-decisoes").
- **Critério:** ≥90% de ativação nos positivos → ok para mover conteúdo para skill. Abaixo disso → índice no `AGENTS.md` ou hook.
- **Custo estimado:** ~120–240 execuções curtas; script e planilha de resultados em `05-Agente/Avaliação/`.
