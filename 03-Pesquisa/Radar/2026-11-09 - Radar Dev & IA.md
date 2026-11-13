---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-09
atualizado: 2026-11-09
ciclo: 1 (UTC, manhã de 09/11)
anterior: "[[2026-11-08 - Radar Dev & IA (Ciclo 3)]]"
proximo: "[[2026-11-10 - Radar Dev & IA]]"
---
# Radar Dev & IA — 09/11/2026

> Números de fontes secundárias **não auditados**. Primeiro radar com **edições reais de newsletter** (AI/TLDR e The Code). Só o novo ou incremental; o resto está em [[2026-11-08 - Radar Dev & IA (Ciclo 1)]], [[2026-11-08 - Radar Dev & IA (Ciclo 2)]] e [[2026-11-08 - Radar Dev & IA (Ciclo 3)]].

## 🏆 Melhores achados
1. **Vazamento de senhas via "Yes, and don't ask again" do Claude Code** (Apiiro, 07/11; fonte: AI/TLDR, secundária). 1.122 arquivos públicos no GitHub com senhas dentro de `.claude/settings.local.json`: a opção salva o comando Bash *inteiro* (com senha digitada) como regra de permissão. Boris Cherny (Anthropic) disse que estudam *secret scrubbing*. → **Importa para nós:** nossos repos têm `settings.local.json` e há pendência de limpeza (ECC versionado, `autoMode`). Ação: conferir `.gitignore` de `settings.local.json` em todos os repos e nunca digitar segredo inline em comandos aprovados.
2. **Guia prático de custo de tokens no Claude Code** (The Code, 08/11). Três defaults que gastam limite: (a) **subagentes herdam o esforço da sessão principal** → colocar `effort: medium` nos arquivos de `.claude/agents/`; (b) mesmo modelo caro para tudo → **modelo forte planeja, barato executa** (subagente `executor` com `model: haiku`); relato do fundador do Warp: custo por PR de **US$ 80 → US$ 20** (não auditado); (c) **filtrar dados antes de o modelo ler** (regex/dedupe, depois modelo barato). Comando `/usage` mostra o que drena o limite. → Casa com o **rodízio de licenças** e com o teste da Advisor Strategy ([[2026-11-08 - Advisor Strategy no preenchimento das Stacks]]): é o mesmo padrão "planner + executor", agora com receita pronta.
3. **Big Tech limitando gasto de IA por engenheiro** (The Code, 08/11): Apple, Uber e Meta com tetos de uso de agentes de código após um ano de "tokenmaxxing". Reforça o achado de custos do [[2026-11-08 - Radar Dev & IA (Ciclo 1)]] e nosso orçamento provisório (~R$ 2.000/mês) → Roadmap, Fase 0.
4. **Anthropic: "Components of agent memory"** (post de engenharia, 06/11; via AI/TLDR). Memória em 4 camadas; processo offline de "dreaming" reescreve notas erradas, junta duplicadas e enxuga o que carrega por sessão. Relato: Claude Opus 5.5 foi de 0,655 para 0,838 no CL-Bench com memória (não auditado). Regras: manter a camada sempre carregada **pequena**; combinar wiki + busca. → Direto para o desenho do **vault como memória** ([[ADR-0001 - Vault como memória do projeto]]) e para AGENTS.md curto. Ler o post original (A confirmar).
5. **Inkling 2 Small (Thinking Machines)** — MoE de 594B (17B ativos), 1M de contexto; pesos hoje fechados, **Apache 2.0 prometido "na próxima semana"** (plano declarado, não confirmado). → Candidato à camada barata/aberta se os pesos saírem; acompanhar.

## 1 · Engenharia de software com IA
- **Claude Code**: a fonte primária ([GitHub releases](https://github.com/anthropics/claude-code/releases)) mostra **v2.1.319 (06/11)** como a mais recente → **sem versão nova** desde o Ciclo 2/3. Novo no tema: `/usage` e esforço de subagentes (achado 2).
- **OpenCode** ([releases](https://github.com/anomalyco/opencode/releases)): **v2.2.0 (27/10)** — plugins de Desktop (experimental), TTL de cache de prompt configurável por provedor/modelo, GPT-6.1 Terra via "Sign in with ChatGPT", **remoção da GitHub Action**. **v1.19.x** continua na linha 1.x; subir para 2.x é escolha explícita (`opencode upgrade --major`); o instalador recusa 2.x. Sessão compartilhada foi descontinuada (v1.19.1). → Relevante para o teste do harness no OpenCode (Fase 3): decidir 1.x vs 2.x antes de configurar o Groq/modelos free.
- **Codex CLI**: o snapshot que consegui abrir de [github.com/openai/codex/releases](https://github.com/openai/codex/releases) mostra **0.161.0 (07/10)** como "Latest", com **GPT-6.1 Sol** como modelo padrão — **conflita** com o "v0.167.0" citado no Ciclo 2. Ver "A confirmar".
- **Gemini CLI / Cursor**: nada confirmado em fonte primária nesta semana.
- **OpenAI GPT-6 Cyber** (05/11; AI/TLDR): modelo de segurança, US$ 20/100 por 1M tokens (in/out), acesso restrito. Pouco relevante para o projeto.

## 2 · Novos conceitos e papers
- **Roteamento agêntico** (busca arXiv; não são de novembro, mas **novos para o vault**): *Agentic Routing: The Harness-Native Data Flywheel* (arXiv 2607.11399, jul/2026 — roteamento **por passo**, usando o estado do harness; modelo único ou ensemble) e **TwinRouterBench** (arXiv 2605.18859, mai/2026 — benchmark estático + dinâmico em SWE-bench Verified; um roteador logístico treinado nos rótulos estáticos teve o melhor custo-sucesso). **BoundaryRouter** (workshop ICLR 2026): decide entre inferência direta e agente completo (−60,6% de tempo, relato do paper). → Complementam [[LLMRouterBench (paper)]] e [[LLMRouter (paper)]]: roteamento *dentro do harness*, não só por prompt. Nota de paper criada: [[TwinRouterBench (paper)]].
- **Memória de agentes em camadas + "dreaming"** (achado 4) como padrão de engenharia de contexto.
- **Tese de custo:** "planner forte + executor barato" virou prática documentada (achado 2) — nosso [[Roteamento de LLMs]] pode começar por esse baseline (cascata), antes de roteador aprendido.

## 3 · Ferramentas e repos
- **Microsoft Research encerra o grupo AI Frontiers** (criador do **Autogen** e do Fara), após reorganização em Microsoft AI (06/11; AI/TLDR; a justificativa "escala vs pesquisa" é opinião de John Langford). → Risco de manutenção do Autogen; **evitar como base** do harness.
- **Meta Active Memory / Active Focus** (06/11): memória e recuperação de falhas treinadas nos modelos do app Muse; sem relevância direta.
- **Qwen3-Coder-Next**: já avaliado — ver [[Qwen3-Coder-Next]] (fonte primária verificada em 08/11).
- **GitHub Trending de novembro**: não encontrei lista confiável de novembro (agregadores só até out/2026). Ver "A confirmar".

## 4 · Newsletters (Gmail — `vitormouranewsletterreceiving@gmail.com`)
- **Primeiras edições reais** lidas: **AI/TLDR #195 (08/11)** e **The Code — Sunday Special (08/11)** (conteúdo nos achados 1, 2, 3, 4 e 5).
- **Não lidas em detalhe (sem sinal técnico claro pelo assunto/trecho):** TechDrops (09/11, "Nvidia…", PT-BR, geral), Superhuman (08/11), Mindstream (08/11, IA em saúde), The AI Report (08/11 "empresas à frente usam Claude" e 09/11 "perk" = promoção).
- **Pulados:** boas-vindas, confirmações, códigos de acesso, alertas do Google, iscas (8020AI, MoneyDrops, AiDrops, AI for Non-Techies).
- **Ainda sem edição real:** The Pragmatic Engineer, ByteByteGo, Kent Beck, The Engineering Manager (só boas-vindas), Latent Space (só aviso de login).
- **Temas recorrentes:** (1) **custo/teto de tokens** e roteamento planner→executor (The Code, AI/TLDR, The AI Report); (2) **segurança de agentes** (vazamento de segredos); (3) **memória de agentes**.

## 5 · O que acompanhar
- **Inkling 2 Small**: pesos Apache 2.0 saem "semana que vem"? Se sim, avaliar para a camada barata (provedores/preço).
- **Anthropic secret scrubbing** no Claude Code: correção do vazamento.
- **Testar** `effort` em subagentes + `/usage` + padrão `executor` (haiku) no nosso fluxo e medir custo por tarefa (Fase 3/4).
- **OpenCode 2.x vs 1.x**: decidir versão antes do teste com modelos free e Groq.
- **Primeiras edições** de Pragmatic Engineer, ByteByteGo, Kent Beck, Latent Space.

## A confirmar
- **Versão atual do Codex CLI** (0.161.0 em 07/10 no snapshot vs "0.167.0" do radar anterior): conferir `codex --version` / [changelog oficial](https://developers.openai.com/codex/changelog).
- Detalhes do vazamento da Apiiro e do post "Components of agent memory" na fonte primária (hoje só via AI/TLDR).
- Data real dos pesos do Inkling 2 Small.
- Lançamentos de modelos e novidades de Gemini CLI/Cursor desta semana (buscas não retornaram fonte datada).

## Fontes
- Newsletters (Gmail, 08–09/11): AI/TLDR #195 ([ai-tldr.dev](https://ai-tldr.dev)) · The Code ([post online](https://codenewsletter.ai/p/how-devs-are-cutting-ai-coding-token-costs); [guia oficial de custos](https://code.claude.com/docs/en/costs)) · [Apiiro/Claude Code (ai-tldr.dev)](https://ai-tldr.dev/releases/apiiro-claude-code-dont-ask-again-secrets/) · [Anthropic — Components of agent memory (via ai-tldr.dev)](https://ai-tldr.dev/releases/anthropic-components-of-agent-memory/) · [Inkling 2 Small (via ai-tldr.dev)](https://ai-tldr.dev/releases/thinking-machines-inkling-2-small/) · [Microsoft AI Frontiers (via ai-tldr.dev)](https://ai-tldr.dev/releases/microsoft-research-ai-frontiers-ends/)
- Primárias: [anthropics/claude-code releases](https://github.com/anthropics/claude-code/releases) · [anomalyco/opencode releases](https://github.com/anomalyco/opencode/releases) · [openai/codex releases](https://github.com/openai/codex/releases)
- Papers: [TwinRouterBench arXiv 2605.18859](https://arxiv.org/abs/2605.18859) · Agentic Routing arXiv 2607.11399 (via [chatpaper](https://chatpaper.com/de/chatpaper/paper/309615), secundária)
- Radars anteriores: [[2026-11-08 - Radar Dev & IA (Ciclo 3)]]
