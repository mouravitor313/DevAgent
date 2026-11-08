---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-08
atualizado: 2026-11-08
ciclo: 2 (10:42 UTC)
anterior: "[[2026-11-08 - Radar Dev & IA (Ciclo 1)]]"
proximo: "[[2026-11-08 - Radar Dev & IA (Ciclo 3)]]"
---
# Radar Dev & IA — 08/11/2026 (Ciclo 2, 10:42 UTC)

Segundo ciclo do dia da rotina **Research e descobrimento**. Complementa o radar da manhã (05:07 UTC) — aqui só o que é **novo ou incremental** desde então.

> Números de versões, estrelas e datas vêm de fontes secundárias (digests/blogs) e **não foram auditados**. Confirmar na fonte oficial antes de decisões críticas.

## 🏆 Melhores achados novos de hoje

1. **Claude Code 2.1.317–2.1.319** (até 06/11). Destaque: `permissions.denyInsteadOfPrompting` — nega chamadas que esperariam aprovação e segue o turno (feito para runs sem supervisão: terminal, subagentes, teammates). Também: **tarefas de MCP em segundo plano no terminal**; vars `CLAUDE_CODE_DISABLE_FEATURE_FLAGS` e `CLAUDE_CODE_AUTO_MODE_SERVER`; correções de segurança (bypass via `sed`, bash com aspas, `/rewind` via symlink); 2.1.317 pergunta antes de um comando enviar o e-mail da conta pela rede; 2.1.318 expõe `loginExpiresAt`. → Casa direto com **nossas rotinas agendadas/headless**.
2. **vLLM Semantic Router** (github.com/vllm-project/semantic-router, arXiv 2603.04444). Roteador semântico open-source, pronto para Kubernetes. Mesmo papel do nosso [[LLMRouter (paper)|LLMRouter]], com backing de projeto grande. → Candidato a base/benchmark do **roteamento de modelos** (comparar com RouteLLM, CARROT, LLMRouter).
3. **Cadeia para rodar modelos abertos baratos ficou prática.** FreeToken (Berkeley; MoE 290B+ em RTX de consumo; APIs compatíveis Anthropic/OpenAI; clientes Claude Code/Codex/OpenCode), Strata (125B entre GPU/RAM/CPU/SSD; APIs no localhost), DwarfStar (DeepSeek V4/GLM 5.x + agente de código), Colibrì/AirLLM/Edge0 (streaming de pesos do SSD), e **llmfit** (mede o que cabe no hardware). → Parte "camada barata auto-hospedada" da estratégia tipo-Revolut saindo do papel.
4. **Kimi K3.1 Pro com pesos abertos** (Moonshot) — abre rota self-hosted para usá-lo como motor de agentes de código. → Candidato forte para a camada barata do rodízio de licenças.
5. **Leituras do Latent Space (harness/arquitetura):** "How Anthropic ships Claude with Claude: Separating the Brain from the Hands" (27/10); "Claude Mods: Flipping the Harness Inside Out" (21/10); "Can a Cloud-Native Harness Make Agents Reliable Beyond the Desktop?" (07/10); "Dynamic Workflows Coordinate Claude Agents" (12/10); "...Open-Weights Driving Demand for Model Routing" (18/08).

## 1 · Releases da semana (04–06/11)
- **Claude Code**: ver achado nº 1.
- **OpenAI Codex (CLI v0.167.0)**: agent command center (`codex agents --no-daemon`), troca de backend no terminal, **Vertex AI como provedor nativo** (`model_provider = "gcp"`, vindo da v0.165), preview de imagens, proxy de sistema.
- **Gemini CLI (v0.67.0, 04/11)**: comando `models`; fix de timeout de hook do Claude (estava 1000x menor).
- **Mistral Studio** (05/11): preview com agentes gerenciados, apps e workflows. **Gemini Omni 1.2 Flash** e **Images 2.6** (04–05/11).

## 2 · Roteamento e modelos abertos
- **vLLM Semantic Router** — ver achado nº 2.
- **Streaming de MoE do SSD** (achado nº 3): FreeToken, Strata, DwarfStar, Colibrì, AirLLM, Edge0, llmfit. Fonte: ai-tldr.dev/tools (categoria Local Runtimes).
- **Ideia de piloto**: llmfit (dimensionar) + Strata/FreeToken (servir) um modelo aberto (Kimi K3.1 / GLM 5.x) para medir na prática a economia relatada pela Revolut.

## 3 · Ferramentas e repos em alta
- **patchy631/ai-engineering-hub** (~40k★): ~93 projetos prontos (RAG, RAG agêntico, multi-agente, MCP) + roadmap de AI Engineering. Trilha de aprendizado.
- **beenuar/AiSOC** (~6,3k★, MIT): SOC de IA com LLM local (Ollama), "Investigation Ledger" (registra todo prompt/tool-call) + aprovação humana, servidor MCP p/ Claude/Cursor/Continue. → Boa referência de **governança/auditoria** de agentes.
- **FlashML-org/FreeToken**: engine MoE edge (ver seção 2).
- A verificar no próximo ciclo (mencionados, não confirmados): framework de **skills do Google** (~22k★) e projeto de voz (~56k★).

## 4 · Newsletters (Gmail)
Caixa `vitormouranewsletterreceiving@gmail.com`: ainda **só boas-vindas/confirmação**, nenhuma edição real. Novas assinaturas **técnicas** adicionadas hoje → alimentam os próximos ciclos: **The Pragmatic Engineer**, **ByteByteGo**, **TLDR**, **AI/TLDR** (além das generalistas: Rundown, Mindstream, The AI Report, 8020AI, Superhuman). Pendência: confirmar inscrições que exigem clique (TLDR referral; AI/TLDR confirm). A partir do próximo ciclo: scraping real de conteúdo/links/anexos.

## Fontes
dev.to/aicoding-guide (semana 08/11), aicoding-guide.com · github.com/anthropics/claude-code (2.1.317–319) · github.com/openai/codex (v0.167.0) · Gemini CLI v0.67.0 · mistral.ai/news/build-with-studio · github.com/vllm-project/semantic-router (arXiv 2603.04444) · ai-tldr.dev/tools · coddykit.com (GitHub Trending nov/2026) · superpowerdaily.com & kimi.ai (Kimi K3.1 Pro) · latent.space/articles · github.com/{patchy631/ai-engineering-hub, beenuar/AiSOC, FlashML-org/FreeToken}
