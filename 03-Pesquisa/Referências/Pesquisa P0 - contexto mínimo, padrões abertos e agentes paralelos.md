---
tipo: referência
status: consolidado
tags: [devagent, referência, contexto, skills, agents-md, github, paralelismo]
criado: 2026-11-10
atualizado: 2026-11-10
fonte: várias (ver abaixo)
formato: artigo
---
# Pesquisa P0 — contexto mínimo, padrões abertos e agentes paralelos

## Resumo
Pesquisa da Prioridade 0 (DEC-2026-11-10-25), feita em 10/11/2026 por três subagentes em paralelo, com leitura de fontes primárias sempre que possível. Base da nota [[Filosofia do setup de agentes]] e do [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]].

Conclusão curta: as três teses do CTO se sustentam **com ressalvas medidas**:
1. *Menos contexto é melhor*: sustentada (o tamanho sozinho já piora o modelo). Ressalva: skills nem sempre são ativadas, então o que o agente precisa em quase toda tarefa deve ficar fixo, como índice compacto.
2. *Padrões abertos*: sustentada para `AGENTS.md`, Skills e MCP (os três estão na Agentic AI Foundation). Ressalva: hooks e subagents não têm padrão, e hooks são a única garantia determinística.
3. *Paralelo via Issues*: sustentada para tasks disjuntas. Ressalvas: a revisão humana vira o gargalo, e tasks acopladas rendem mais em sequência.

## Por que guardei
É a evidência que justifica (ou corrige) as DEC-2026-11-10-22/23/24. Toda regra da filosofia deve apontar para cá.

## 1. Contexto mínimo e progressive disclosure

### Degradação com contexto longo
- **Context Length Alone Hurts** (Du et al., out/2025, Findings EMNLP 2025). Queda de 13,9% a 85% com input maior, **mesmo com recuperação perfeita**, e mesmo quando o texto irrelevante vira espaço em branco ou é mascarado: o tamanho sozinho atrapalha. Fonte primária lida. https://arxiv.org/abs/2510.05381
- **NoLiMa** (fev/2025, ICML 2025). Em 32K tokens, 11 de 13 modelos caem abaixo de 50% do próprio desempenho em contexto curto (GPT-4o: 99,3% → 69,7%). https://arxiv.org/abs/2502.05167
- **RULER** (2024). Dos 17 modelos que anunciam janela de 32K ou mais, só metade se mantém bem em 32K. https://arxiv.org/abs/2404.06654
- **Lost in the Middle** (Liu et al., 2023). Informação no meio do contexto é a mais ignorada. https://arxiv.org/abs/2307.03172
- **Context rot** (Chroma, jul/2025, relatório de fornecedor). Os 18 modelos testados pioram com o input; prompt focado de ~300 tokens vence o completo de ~113k. https://www.trychroma.com/research/context-rot

### Arquivos de contexto (AGENTS.md / CLAUDE.md)
- **Evaluating AGENTS.md** (Gloaguen et al., ETH/LogicStar, fev/2026, ICLR 2026), lido no HTML: https://arxiv.org/html/2602.11988
  - Arquivo **gerado por LLM**: sucesso −0,5 a −2 pp (não significativo) e **custo +20–23%** (significativo), com mais passos por tarefa.
  - Arquivo **escrito por dev**: +2,4 pp (não significativo) e custo até +19%. Fica ~7 pp acima do gerado por LLM (p = 0,038). Tamanho médio: 641 palavras.
  - Os agentes **obedecem** ao arquivo (uma ferramenta citada é usada ~160× mais), mas a visão geral do repo não acelerou a busca de arquivos.
  - Recomendação dos autores: incluir só o que o código e o README não dizem. Limite: o estudo cobre só Python.

### Orientação oficial
- Anthropic, *Effective context engineering* (29/09/2025): contexto é um "attention budget"; buscar o "smallest possible set of high-signal tokens" e carregar *just in time*. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Claude Code, docs de memória: https://code.claude.com/docs/en/memory
  - Alvo: menos de 200 linhas por CLAUDE.md ("longer files … reduce adherence").
  - `@import` **não economiza contexto**.
  - Regra de uma área só vai para `.claude/rules/` com `paths:` ou para skill.
  - Instruções contraditórias: o modelo escolhe uma ao acaso.
- Claude Code, *best practices*: https://code.claude.com/docs/en/best-practices
  - Cada linha custa atenção em toda tarefa.
  - Regra ignorada não se resolve com IMPORTANT: o arquivo está longo demais ou a regra deve virar hook.
  - Não descrever arquitetura nem pastas.
- Anthropic, *Agent Skills* (16/10/2025): progressive disclosure em 3 níveis (metadados → SKILL.md → anexos), e a `description` decide a ativação. https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Codex: concatena os `AGENTS.md` da raiz até a pasta atual (limite de 32 KiB); o mais próximo vence; lint e formatação vão no CI, não em instrução. https://learn.chatgpt.com/docs/agent-configuration/agents-md

### Contra-argumentos
- **Vercel, *AGENTS.md outperforms skills*** (27/01/2026), fonte de fornecedor, não auditado. https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
  - A skill **não foi invocada em 56%** dos casos.
  - Acerto: 53% sem docs, 53% com skill, 79% com skill + instrução explícita, **100% com índice de docs de 8 KB no AGENTS.md**.
  - Escopo: APIs do Next.js 16, sem modelo nem amostra informados.
- Scott Spence (fev/2026, blog), não auditado: ativação de skills de 50–55% no Sonnet 4.5 sem hook e 100% com hook "forced-eval" (22 prompts). https://scottspence.com/posts/measuring-claude-code-skill-activation-with-sandboxed-evals
- **SkillsBench** (fev/2026): skills curadas sobem o acerto de 33,9% para 50,5%; skills focadas (≤3 módulos) vencem documentação exaustiva. Mede o valor da skill quando presente, não a ativação. https://arxiv.org/abs/2602.12670
- Prompt caching: contexto fixo e estável fica barato em tokens (leitura a 0,05–0,1× o input), mas **não em atenção**. https://platform.claude.com/docs/en/build-with-claude/prompt-caching

## 2. Padrões abertos × recursos exclusivos

### Governança
Os três padrões estão na **Agentic AI Foundation** (Linux Foundation):
- `AGENTS.md` (OpenAI, ago/2025) e MCP: membros fundadores em 09/12/2025. https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation
- Agent Skills: publicado como padrão aberto em dez/2025 e doado à AAIF em 22/10/2026, segundo fontes secundárias, não auditado. https://simonwillison.net/2026/Oct/22/donating-agent-skills/
- Spec das Skills: só `name` e `description` são obrigatórios. https://agentskills.io/specification.md

### Suporte por ferramenta
Docs oficiais lidas pelo subagente em 10/11; eu não conferi célula por célula.

| Ferramenta | Pasta de skills lida | AGENTS.md | Plugins | Hooks | Subagents |
|---|---|---|---|---|---|
| Claude Code | só `.claude/skills` | nativo *só se não houver CLAUDE.md* (a conferir); `@AGENTS.md` segue valendo | `.claude-plugin` | sim | `.claude/agents/*.md` |
| Codex | só `.agents/skills` | nativo | `plugin.json`; aceita manifesto `.claude-plugin` | sim, mesmos nomes de evento | TOML em `.codex/agents/` |
| OpenCode | `.opencode`, `.claude`, `.agents` | sim | módulos JS/TS | via plugins | `.opencode/agents` |
| Cursor | `.agents`, `.cursor`, `.claude`, `.codex` | sim | ? | sim; carrega hooks do Claude | Task tool |
| Gemini CLI | `.gemini`, `.agents` | só com `context.fileName` | extensions | sim | via extensions |
| VS Code/Copilot | `.github`, `.claude`, `.agents` | sim | preview | ? | `.agent.md` |

Docs: [Claude skills](https://code.claude.com/docs/en/skills) · [Codex skills](https://learn.chatgpt.com/docs/build-skills) · [OpenCode](https://opencode.ai/docs/skills/) · [Cursor](https://cursor.com/docs/context/skills) · [Gemini](https://geminicli.com/docs/cli/skills/) · [VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

### Achados
- **Plugins não têm padrão neutro.** Há convergência de fato (o Codex lê manifestos do Claude), mas o conteúdo portátil dentro de um plugin são as skills e o `.mcp.json`. Plugin é formato de **distribuição**, não de autoria.
- **Hooks** não têm padrão, mas convergiram nos nomes dos eventos (`PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`). A doc do Claude diz que CLAUDE.md e skills são contexto, "not enforced configuration". Para bloquear algo, só hook.
- **MCP × CLI**: as definições de ferramentas custam caro. A Anthropic relata queda de 150k para 2k tokens apresentando MCP como código ([04/11/2025](https://www.anthropic.com/engineering/code-execution-with-mcp)); o MCP do GitHub custa 17,8k–55k tokens ([Checkly](https://www.checklyhq.com/blog/mcp-vs-cli-token-efficiency/), não auditado). O *tool search* (ligado por padrão no Claude Code) reduz isso. MCP continua melhor quando há auth, OAuth ou escopo restrito, ou quando não existe CLI.

## 3. Agentes paralelos com GitHub Issues

### Quem pega issue e abre PR
- **Copilot coding agent**: atribuir a issue ao Copilot. Lê `AGENTS.md`/`CLAUDE.md`; 1 premium request por sessão. [best practices](https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results)
- **Claude Code GitHub Actions**: `@claude` ou `prompt` em qualquer evento; recomenda issue templates, `--max-turns` e concorrência. [doc](https://code.claude.com/docs/en/github-actions)
- **Codex cloud**: `@codex`. [doc](https://learn.chatgpt.com/docs/cloud)
- **OpenCode**: `/oc`, com qualquer modelo/API (importa para a camada barata da Fase 3). [doc](https://opencode.ai/docs/github/)
- **Jules** (label) e **Cursor Cloud Agents**: limites e preços não auditados.
- Local: `claude --worktree` + `.worktreeinclude` ([doc](https://code.claude.com/docs/en/worktrees.md)). O worktree isola arquivos, **não** portas, banco, migrations nem caches.

### Evidência sobre PRs de agentes
- Ehsani et al., MSR 2026 (33 mil PRs): os não mesclados são maiores, tocam mais arquivos e falham mais no CI. Docs, CI e build mesclam mais; bug fix e performance, menos. https://arxiv.org/abs/2601.15195
- Minh et al., MSR 2026 (33.707 PRs): 28,3% mesclam direto; o ciclo de review iterativo é caro; tamanho e tipo de arquivo preveem o custo de revisão (AUC 0,96). https://arxiv.org/abs/2601.00753v2
- AIDev (456 mil PRs): agentes são mais rápidos e menos aceitos que humanos. Números por agente não auditados. https://arxiv.org/abs/2507.15003
- Faros: +98% de PRs e +91% de tempo de review, com DORA estável. Não auditado.
- Cognition, *Don't Build Multi-Agents*: escritores paralelos tomam decisões implícitas conflitantes. Paralelo vale para ler, pesquisar e revisar; escrita acoplada vai em sequência. https://cognition.ai/blog/dont-build-multi-agents
- GitHub: tratar a issue como prompt. Evitar delegar refactors amplos, tasks ambíguas e trabalho de segurança, PII, auth ou incidente.

### Markdown × Issues
O **híbrido** é o que a evidência sustenta: spec/ADR em markdown versionado e cada fatia executável como issue linkando a spec. Issues são o gatilho nativo de todas as ferramentas de nuvem; markdown versiona junto ao código e funciona offline.

## Lacunas de evidência
- Não há estudo independente que compare, ponta a ponta, "arquivo enxuto + skills" com "arquivo grande" em agente de código. O limite de 200 linhas é recomendação, não curva medida.
- Ativação de skills: só medições pequenas ou de fornecedor (Vercel, blogs).
- Os estudos de AGENTS.md e de PRs são de OSS e/ou Python. Nada para fintech, Go ou repos privados.
- Não há número publicado de capacidade de revisão por pessoa.
- Não está documentado se o Claude Code segue junction/symlink em `.claude/skills` no Windows (precisa de teste local).
- A doação das Skills à AAIF e a leitura nativa de AGENTS.md pelo Claude Code vêm de fonte secundária ou não foram conferidas por mim.

## Trechos / links úteis
- Medição local (10/11), contexto fixo atual:
  - `~\.claude\CLAUDE.md`: 16 linhas; `Projetos\AGENTS.md`: 27 linhas.
  - `xend-platform/AGENTS.md`: **289 linhas** (~11 KB).
  - `xend-onchain/CLAUDE.md`: 89 linhas, com cópias de 91 linhas em cada worktree `iat-*`.
  - `xendmm`, `dash-mm`, `dashboard_xend` e `XEND-RFQ-PORTAL` têm `CLAUDE.md` idêntico ao `AGENTS.md`, em vez de ponteiro.
  - O índice de skills de uma sessão do Claude Code lista **~280 skills**, a maioria fora do escopo (sales, marketing, finance, AWS), vindas dos plugins/conectores do claude.ai.
