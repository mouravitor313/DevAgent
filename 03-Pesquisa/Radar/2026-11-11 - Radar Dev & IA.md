---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-11
atualizado: 2026-11-11
ciclo: 1 (10:07 UTC)
anterior: "[[2026-11-10 - Radar Dev & IA]]"
proximo: "[[2026-11-12 - Radar Dev & IA]]"
---
# Radar Dev & IA — 11/11/2026

> Números de fontes secundárias **não auditados**. Só o novo ou incremental; o resto está em [[2026-11-10 - Radar Dev & IA]] e [[2026-11-09 - Radar Dev & IA]]. **Dia calmo**: nenhuma newsletter nova desde o radar anterior (o último e-mail é de 10/11 16:30 UTC).

## 🏆 Melhores achados
1. **SWE-Router (arXiv 2607.00053, 30/06/2026)** — roteia **no meio da tarefa**: um modelo barato roda poucos turnos exploratórios; o roteador lê a trajetória parcial e decide **continuar barato ou escalar** para o caro. Prova (teorema) que ler a trajetória nunca piora o roteamento e é melhor quando a exploração informa. Resultado: grande ganho de custo mantendo "a maior parte" do desempenho do modelo forte (sem números no abstract); libera dataset de trajetórias multi-LLM. Fonte: [arXiv](https://arxiv.org/abs/2607.00053). → **Importa para nós:** é a **cascata com escalonamento** que queremos como baseline em [[Roteamento de LLMs]] (Fase 3), com base teórica — melhor que rotear só pelo texto do prompt. Nota criada: [[SWE-Router (paper)]] (só abstract lido). Complementa [[Agent-as-a-Router (paper)]] e [[TwinRouterBench (paper)]].
2. **GitHub portou o runtime do Copilot de TypeScript para Rust usando o próprio Copilot** — fonte primária: [GitHub Blog](https://github.blog/2026/09/16/migrating-the-github-copilot-runtime-to-rust-using-copilot) (set/2026; chegou hoje via ByteByteGo, que li inteiro). Padrões úteis, todos de **refactor/migração com agentes**: (a) **troca incremental no lugar**, um componente por PR, com ponte fina e o código antigo apagado no mesmo PR; (b) **testes end-to-end como única referência de comportamento** — e proteger os testes para o agente não enfraquecê-los; (c) **frota de agentes**: um agente coordenador lê/planeja por ~1h e distribui o trabalho (ex.: um arquivo de ~30 mil linhas em 15 sessões-filhas, cada uma com **branch e cópia própria**); (d) **review por vários modelos diferentes** comparando linha a linha antigo × novo, em ciclo até ficar limpo, com humanos só em arquitetura e contratos; (e) **traduzir primeiro, redesenhar depois**. Limite prático: 15 sessões construindo/testando ao mesmo tempo travaram o notebook → só o pai roda build, uma por vez. Números (ByteByteGo/secundárias, **não auditado**): ~US$ 120 mil e ~136 bi de tokens (maioria em cache); startup de 5,25 s → 292 ms. → **Importa para nós:** modelo concreto para as **tasks paralelas** do [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]] e para [[Tarefas transversais]] (review/refactor).
3. **Codex CLI: versão atual confirmada na fonte oficial** — o [changelog oficial](https://developers.openai.com/codex/changelog) lista **0.167.0 (06/11)** e **0.167.1 (10/11)**. Isso **resolve a pendência** "versão do Codex" dos dois radars anteriores (os snapshots do GitHub estavam defasados; "0.161.0" era errado como atual). Conteúdo do 0.167.0 inclui saída limitada no *Code Mode* e menções a plugins na TUI (vi só títulos de PR).
4. **Agent Skills agora é padrão sob a fundação (22/10/2026)** — a Anthropic doou o padrão à Agentic AI Foundation, que também hospeda MCP, AGENTS.md, A2A (fonte secundária: [LetsDataScience](https://letsdatascience.com/news/anthropic-donates-agent-skills-standard-to-agentic-ai-founda-f70093cd); confirmar na fonte primária). Em 06/08, um grupo de empresas publicou um formato único de **plugin = skills + servidores MCP** (secundária: [dsebastien.net](https://www.dsebastien.net/agent-plugins-one-package-format-for-skills-and-mcp-servers/)). → Reforça a aposta em **padrões abertos** do [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]] (skills portáveis entre Claude Code, Codex, OpenCode).
5. **Camada barata (API) — candidatos citados em benchmark de terceiros** (Requesty, nov/2026; **secundária, não auditado**): **DeepSeek V4.1 Flash** resolveu 77% de 129 tarefas de backend a **US$ 0,41 por tarefa resolvida**; **Kimi K3.1 Pro** teve a maior taxa (81%). → Candidatos para o piloto de custo da Fase 3 (foco atual = API barata, não local, conforme [[Roadmap]]). Ver "A confirmar".

## 1 · Engenharia de software com IA
- **Claude Code**: o [changelog oficial](https://code.claude.com/docs/en/changelog) e o [GitHub](https://github.com/anthropics/claude-code/releases) continuam com **v2.1.319** no topo → **sem versão nova**. Detalhe útil (secundário, do v2.1.316): o modo rápido do **Opus 4.8** foi descontinuado em 30/10 e **será removido em 30/11** (vira erro, sem fallback) — checar se algum fluxo nosso depende dele. O v2.1.317 trouxe relatório de custo para admins de gateway e hooks do Agent SDK que podem bloquear em falha (secundária).
- **Gemini CLI**: **v0.67.0 (04/11)** — comando para listar modelos e suporte do IDE companion em sandbox de container (fontes secundárias: [Havoptic](https://www.havoptic.com/releases/gemini-cli/2026/11), [labmemo](https://labmemo.com/?p=62719)). Ainda não vi o changelog oficial → A confirmar.
- **OpenCode**: sem mudança confirmada (v2.2.0 de 27/10; linha 1.x em v1.19.4), ver [[2026-11-10 - Radar Dev & IA]].
- **Cursor**: **nada confirmado em novembro**; as fontes só chegam a set/out. Não usar versão de agregador.

## 2 · Novos conceitos e papers
- **Roteamento por trajetória** (achado 1): mais um paper na mesma tese — o roteador melhora com **sinal observado durante a execução**. Outros do mesmo tema vistos na busca: **Triage** (arXiv 2604.07494, abr/2026 — roteia por sinais de qualidade de código) e um paper de "harness router" (set/2026, só via digest; não localizei o link) → A confirmar.
- Post de prática (não-paper): um texto de [Unblocked](https://getunblocked.com/blog/model-routing-coding-agents) diz que roteamento corta 30–40% da conta, mas **retrabalho por erro de rota pode apagar a economia** (anedótico, não auditado). Casa com o alerta do [[LLMRouterBench (paper)]].

## 3 · Ferramentas e repos
- **Cognition SWE-2 Flash** (04/11): lançado, pesos ainda **não** liberados; empresa promete detalhes "em algumas semanas" (secundária: [LetsDataScience](https://letsdatascience.com/blog/cognition-swe-2-flash-built-on-open-weights-wont-share-own)). Só monitorar.
- **Ripple-65B Preview (Ricursive Intelligence, 04/11)**: denso 65B, Apache 2.0 (secundária, [tech-insider](https://tech-insider.org/what-ricursive-intelligence-released-on-november-4/)). Fora do foco (modelo local/auto-hospedado é "futuro distante").
- **GitHub Trending**: sem lista confiável de novembro (mesma limitação).

## 4 · Newsletters (Gmail — `vitormouranewsletterreceiving@gmail.com`)
- **Nada novo desde o radar anterior**: os 6 e-mails de 10/11 (AI/TLDR, TLDR AI, The Rundown, Mindstream, Pragmatic Engineer, ByteByteGo) já estavam cobertos; nenhum de 11/11 até 10:07 UTC.
- **Lida agora em detalhe:** ByteByteGo — *How GitHub Used AI to Port Copilot From TypeScript to Rust* (achado 2). Ignorados os patrocinados.
- **Ainda sem edição real:** Kent Beck, The Engineering Manager, Latent Space.

## 5 · O que acompanhar
- **Testar o padrão SWE-Router/cascata** no OpenCode: modelo barato explora N turnos → escala se não convergir (Fase 3/4); medir custo, sucesso e retrabalho.
- **Aplicar a receita Copilot→Rust** num refactor real pequeno: coordenador + sessões-filhas em branches separadas, review por 2 modelos.
- **30/11**: fim do modo rápido do Opus 4.8 no Claude Code.
- **Inkling 2 Small** (pesos Apache 2.0 prometidos): ainda sem confirmação de publicação; a busca só achou o **Inkling-Small de 30/07** (outro modelo; muitos re-uploads de terceiros no Hugging Face — não baixar sem checar o repositório oficial).
- Itens abertos anteriores: secret scrubbing do Claude Code; decisão OpenCode 1.x × 2.x; Fable 5.2 como Advisor.

## A confirmar
- **Gemini CLI v0.67.0**: changelog oficial ([geminicli.com](https://geminicli.com/docs/changelogs/)).
- **DeepSeek V4.1 Flash / Kimi K3.1 Pro**: preço e números do Requesty; licença e pesos na fonte oficial.
- **Agent Skills → AAIF (22/10)** e **formato de plugin (06/08)**: fonte primária.
- **SWE-Router**: ler o PDF completo (números de custo × desempenho); localizar o paper "harness router".
- Valores do Copilot→Rust (US$ 120 mil, 136 bi de tokens, 800 mil linhas) conferir no post do GitHub.

## Fontes
- Primárias: [arXiv 2607.00053 — SWE-Router](https://arxiv.org/abs/2607.00053) · [Codex changelog](https://developers.openai.com/codex/changelog) · [Claude Code changelog](https://code.claude.com/docs/en/changelog) · [anthropics/claude-code releases](https://github.com/anthropics/claude-code/releases) · [GitHub Blog — Copilot runtime em Rust](https://github.blog/2026/09/16/migrating-the-github-copilot-runtime-to-rust-using-copilot)
- Newsletter (Gmail, 10/11): ByteByteGo — [versão web](https://blog.bytebytego.com/p/how-github-used-ai-to-port-copilot)
- Secundárias: [Havoptic — Gemini CLI](https://www.havoptic.com/releases/gemini-cli/2026/11) · [labmemo — Gemini CLI v0.67.0](https://labmemo.com/?p=62719) · [LetsDataScience — Agent Skills/AAIF](https://letsdatascience.com/news/anthropic-donates-agent-skills-standard-to-agentic-ai-founda-f70093cd) · [dsebastien — Agent Plugins](https://www.dsebastien.net/agent-plugins-one-package-format-for-skills-and-mcp-servers/) · [Requesty — modelos abertos para agentes](https://www.requesty.ai/blog/best-open-weight-models-for-agents) · [Unblocked — roteamento](https://getunblocked.com/blog/model-routing-coding-agents) · [LetsDataScience — SWE-2 Flash](https://letsdatascience.com/blog/cognition-swe-2-flash-built-on-open-weights-wont-share-own) · [tech-insider — Ripple-65B](https://tech-insider.org/what-ricursive-intelligence-released-on-november-4/)
- Radars anteriores: [[2026-11-10 - Radar Dev & IA]]
