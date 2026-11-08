---
tipo: sessão
status: consolidado
tags: [devagent, sessão, stacks, advisor-strategy, subagentes]
criado: 2026-11-08
atualizado: 2026-11-08
participantes: [Vítor]
ferramenta: Claude Code
---
# 2026-11-08 - Advisor Strategy no preenchimento das Stacks

## Objetivo da sessão
Testar a Advisor Strategy (DEC-2026-11-08-25) para preencher o Contexto das notas de [[Stacks]] a partir dos `AGENTS.md`/`CLAUDE.md` e manifests dos repos em `C:\Users\Pedro\Projetos`: Haiku busca, Sonnet consome e preenche, Opus aconselha e avalia.

## O que a documentação diz (e como adaptamos)
- O **advisor tool** da API (`advisor_20260301`, beta `advisor-tool-2026-03-01`) põe um executor barato (Haiku/Sonnet) para rodar a tarefa e consultar um advisor mais forte (Opus) **dentro da mesma request**. O advisor lê a transcrição inteira, devolve plano ou correção (tipicamente 400–700 tokens), não chama ferramentas. A doc recomenda consultar **cedo, depois da exploração**, e **no fim, depois de escrever**. Fontes: [advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool.md) · [blog](https://claude.com/blog/the-advisor-strategy) · [Managed Agents](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration.md).
- A doc **não** fala de Claude Code nem de subagentes. Um subagente tem contexto próprio e só devolve um relatório, sem consultar o pai no meio do trabalho. Por isso, no Claude Code, fizemos uma **emulação** com os dois pontos de consulta da doc:
  1. **Exploração:** 4 Haiku (16 repos, 4 por agente, só leitura) gravaram um dossiê por repo com `arquivo:linha`.
  2. **Conselho cedo:** o Opus conferiu 10 citações (10/10 corretas) e escreveu o plano com o mapa stack → repos e 12 regras de julgamento. A principal: Contexto genérico, e só entra o que aparece em ≥2 repos ou é falha registrada (ratchet).
  3. **Execução:** 4 Sonnet (Python+Go, TS+JS, Next.js, SQL) preencheram as notas. Na dúvida, escolheram a opção conservadora e listaram "Perguntas ao advisor".
  4. **Revisão final:** o Opus revisou os Contextos, verificou afirmações incomuns e links (65/66 ok) e aplicou correções.

## Avaliação dos subagentes
| Agente | Modelo | Nota | Comentário |
|---|---|---|---|
| Lotes 1–4 (coleta) | Haiku | **9/10** | Fiéis aos arquivos (10/10 citações conferidas); acharam divergências reais (Go 1.26×1.27, `web3 <7`×`>=7`, CI fazendo deploy de `packages/jobs` inexistente). Custo: ~4–7 min e 175–250k tokens por lote, acima do previsto. O lote 3 respeitou a restrição do `xend-baas-api` (só leitura). |
| Python + Go | Sonnet | **8,5/10** | Contexto enxuto e correto. Go honesto (2 bullets, resto em Achados). Excesso: 10 skills de data science do `arb` como candidatas. |
| TypeScript + JavaScript | Sonnet | **9/10** | Melhor divisão de escopo (linguagem × runtime/tooling), sem repetição. Teve uma falha de heredoc e se recuperou. Duplicou `chrome-devtools` com Next.js (corrigido). |
| Next.js | Sonnet | **8/10** | Bom conteúdo específico (proxy no 16, `agentRules`, docs em `node_modules`). Duas generalizações: dinheiro (duplicava TS) e "autorize no servidor" (1 repo). Ambas corrigidas. |
| SQL | Sonnet | **9/10** | Contexto sólido. Achou o risco do MCP Supabase com `apply_migration` na allowlist. Perguntas ao advisor bem formuladas. |
| Advisor (eu) | Opus | — | Erro no plano: o `dash-mm` (lê Postgres via `pg`) ficou fora do mapa de SQL. Acrescentado em Achados. |

**Conclusão:** o padrão funcionou. As "Perguntas ao advisor" substituíram bem a consulta no meio do trabalho: todas as dúvidas reais apareceram e foram resolvidas na revisão. O gargalo de custo foi a coleta (Haiku leu mais do que precisava). Na próxima, limitar a leitura a AGENTS/CLAUDE + manifests da raiz e de `apps/*`.

## Decisões
- DEC-2026-11-08-25: testar a Advisor Strategy (temporária, até a avaliação deste teste).

## Aprendizados
- A Advisor Strategy da API ≠ orquestração com subagentes. No Claude Code, a emulação razoável é: plano do advisor depois da exploração + perguntas registradas pelo executor + revisão final.
- Dossiês intermediários em arquivo (scratchpad) mantêm o contexto do orquestrador pequeno e deixam a coleta auditável.

## Próximos passos
- [ ] Vítor: avaliar o teste e decidir se a Advisor Strategy vira padrão (encerra a DEC-2026-11-08-25)
- [ ] Achados que pedem ação nos repos (sem mexer agora): `--no-verify` no README do xend-platform contradiz o AGENTS.md do portfólio; allowlist do XEND-RFQ-PORTAL libera `apply_migration`/`execute_sql` do MCP Supabase; CI do xend-platform faz deploy de `packages/jobs`, que não existe
- [ ] Revisar as skills candidatas listadas (Python tem 10 do `arb`, de data science)

## Arquivos criados/alterados
- `05-Agente/Stacks/`: Python, Go, TypeScript, JavaScript, Next.js, SQL (preenchidas) e [[Stacks]] (tabela)
- `01-Projeto/Decisões/Registro de decisões.md` (DEC-2026-11-08-25)
- [[Roadmap]] (próximos passos)
