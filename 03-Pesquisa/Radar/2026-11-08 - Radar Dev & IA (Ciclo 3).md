---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-08
atualizado: 2026-11-08
ciclo: 3 (11:20 UTC)
anterior: "[[2026-11-08 - Radar Dev & IA (Ciclo 2)]]"
---
# Radar Dev & IA — 08/11/2026 (Ciclo 3, 11:20 UTC)

**Ciclo tranquilo: quase nada novo nas ~40 min desde o Ciclo 2 (10:42 UTC), e ainda nenhuma edição real de newsletter.** Este radar traz só o incremental; o grosso do dia está nos Ciclos 1 (05:07) e 2 (10:42).

> Números de versões, estrelas e datas de fontes secundárias **não foram auditados**. Confirmar na fonte oficial antes de decisões críticas.

## 🏆 Melhores achados (incremental)

Num domingo e a poucos minutos do ciclo anterior, **não surgiu release ou notícia nova** de peso (Claude Code, Codex, Gemini CLI, modelos) além do já reportado hoje. Um único item **relevante e ainda não registrado** no nosso radar:

1. **[[LLMRouterBench (paper)|LLMRouterBench]] — benchmark unificado de roteamento de LLM** (arXiv 2601.07206). Benchmark grande + framework único de avaliação para roteadores: **~400 mil instâncias, 21 datasets, 33 modelos e 10 baselines** de roteamento, com métricas tanto de desempenho puro quanto de custo-desempenho. Achados do paper: sob avaliação unificada **muitos roteadores empatam**; **vários métodos recentes — inclusive roteadores comerciais — não batem de forma confiável uma baseline simples**; sobra uma **lacuna grande até o Oracle** (falhas de "recall" de modelo); o *embedding* de base importa pouco e **curadoria de modelos rende mais que aumentar o ensemble**. → Casa direto com o nosso tema de [[Roteamento de LLMs|LLM Routing]] e com o arquivo do projeto *"Large Language Model Routing with Benchmark Datasets.pdf"*; serve de régua para avaliar LLMRouter / RouteLLM / CARROT / vLLM Semantic Router. **Ressalva: é de 12/01/2026** (não é da semana) — entra como leitura de referência, não como novidade quente. Código/dados: github.com/ynulihao/LLMRouterBench.

## 1 · Engenharia de software com IA
- **Sem releases novos** desde o Ciclo 2. O mais recente continua sendo **Claude Code 2.1.317–2.1.319** (até 06/11), **Codex CLI v0.167.0** e **Gemini CLI v0.67.0** — todos já cobertos hoje. As buscas de hoje não confirmaram nenhuma versão acima de 2.1.319.

## 2 · Novos conceitos
- Nada novo a reportar além dos Ciclos 1 e 2 (Harness Engineering, Context Engineering, MCP stateless 2026-07-28, SDD, AGENTS.md, RAG agêntico). O LLMRouterBench (achado nº 1) é o incremento de conceito/benchmark do ciclo.

## 3 · Ferramentas e repos
- **A confirmar no próximo ciclo:** **Qwen3-Coder-Next** (modelo de código pequeno, ~3B, foco em rodar local) apareceu como candidato à **camada barata auto-hospedada** do rodízio de licenças. Data e specs ainda não confirmadas na fonte primária → verificar antes de entrar como achado.

## 4 · Newsletters (Gmail — `vitormouranewsletterreceiving@gmail.com`)
- Não existe o marcador **"Newsletters"** na conta; usei a lista de remetentes conhecidos (fallback do prompt).
- **Nada novo chegou desde o Ciclo 2**: o e-mail mais recente é de **05:30 UTC** (antes do Ciclo 2). **Zero edições reais** — tudo ainda é boas-vindas / confirmação / isca (lead magnet).
- **Incremental desde o Ciclo 2 (infra de assinaturas):** entraram agora fontes **técnicas** fortes — **The Pragmatic Engineer**, **ByteByteGo**, **Kent Beck (Tidy First?)**, **The Engineering Manager (James Stanier)** e **The Code / The Code Cybersecurity**. **Latent Space** com inscrição **pendente de confirmação**.
- **Pendências que exigem clique** (bloqueiam o conteúdo real): **TLDR** (referral), **AI/TLDR**, **Latent Space**, **The Pragmatic Engineer**.
- **Pulados neste ciclo:** ~15 e-mails de boas-vindas/confirmação/isca acumulados no dia (nenhum com sinal técnico real); nenhum novo desde 05:30 UTC.
- **Temas recorrentes entre newsletters:** ainda não dá para medir — sem edições de conteúdo, só boas-vindas.

## 5 · O que acompanhar (próximo ciclo)
- **Primeiras edições reais** das newsletters técnicas devem cair **a partir de segunda (09/11)** — aí começa o scraping de conteúdo/links/anexos de verdade.
- **Confirmar inscrições** pendentes (TLDR, AI/TLDR, Latent Space, Pragmatic Engineer) para destravar o conteúdo.
- **Ler** o LLMRouterBench e cruzar com o nosso LLMRouter.
- **Confirmar** Qwen3-Coder-Next como candidato à camada barata.

## Fontes
arXiv 2601.07206 (LLMRouterBench, 12/01/2026) · github.com/ynulihao/LLMRouterBench · newreleases.io/project/github/anthropics/claude-code · Gmail (caixa de newsletters, varredura após 07/11) · [[2026-11-08 - Radar Dev & IA (Ciclo 1)]] · [[2026-11-08 - Radar Dev & IA (Ciclo 2)]]
