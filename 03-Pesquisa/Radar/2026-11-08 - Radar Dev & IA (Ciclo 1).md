---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-08
atualizado: 2026-11-08
ciclo: 1 (05:07 UTC)
proximo: "[[2026-11-08 - Radar Dev & IA (Ciclo 2)]]"
---
# Radar Dev & IA — 08/11/2026

Resumo diário da rotina "Research e descobrimento" do projeto **Estudos Dev Agent**. Linguagem simples, por tópicos, com valor para o nosso setup (migração Vercel + Supabase, rodízio/otimização de licenças de IA, padrões abertos de agentes, roteamento de modelos).

> Observação: números de fornecedores e datas vindas de fontes secundárias **não são auditados**. Confirmar na fonte oficial antes de decisões críticas.

## 🏆 Melhores achados do dia

1. **Caso Revolut (roteador + modelo aberto).** ~2.000 engenheiros migraram de ferramentas pagas (Claude Code, Codex) para **GLM-5.3 auto-hospedado** (56 GPUs B200) com um **roteador** que manda imagem/design ao Gemini. Resultado relatado pela empresa: **~90% menos custo** e ~60% mais rápido. → É a prova em produção da estratégia do Rafael (reservar premium para arquitetura, rotear rotina para modelos baratos) e do nosso tema de [[Roteamento de LLMs|LLM Routing]].
2. **Harness Engineering ("Agente = Modelo + Harness").** O que separa um agente que funciona não é só o modelo, mas tudo ao redor (AGENTS.md/CLAUDE.md, ferramentas, MCP, skills, sandboxes, hooks, loops de verificação). Práticas: AGENTS.md curto, hooks (lint/testes após edição, bloquear `rm -rf`/force-push, aprovar antes de PR), sandboxes, e "ratchet" (todo erro vira regra). → Próximo nível da engenharia agêntica (guia do Scott Spence).
3. **MCP vira "stateless" (spec 2026-07-28).** Remove sessões → HTTP sem estado, escalando atrás de load balancer simples; deprecia HTTP+SSE antigo; introduz "extensões" (Tasks, MCP Apps). → Casa com a migração **serverless (Vercel/Supabase)** e com a aposta em padrões abertos de agentes. (Fontes secundárias — checar blog oficial do MCP.)
4. **Mistral Large 4 (pesos abertos) + onda de modelos baratos** (Kimi K3.1 Pro, GLM 5.3). → Candidatos para a camada "barata" do rodízio de licenças / roteador.

## 1 · Engenharia de software com IA
- **OpenCode** — agente open-source no terminal (concorrente do Claude Code/Gemini CLI, ~140k estrelas relatadas). Aberto e independente de fornecedor.
- **OpenAI Codex** virou agente de desktop completo (computer use, memória, background agents, paralelo, plugins) sobre GPT-5.x/6.x-Codex.
- **Claude Code 2026**: `/loop`, voice mode, worktrees, novos hooks, app desktop, simple mode. Hooks e worktrees ajudam a paralelizar (Vítor + Edu) e impor padrões.
- **Benchmarks**: SWE-bench (Pro) e Terminal-Bench. Trocar só o harness fez um agente saltar de ~30º para ~5º — avaliar modelos via benchmark de agente, não só o modelo isolado.

## 2 · Novos conceitos
- **Agent Skills** — "SOP do agente" (SKILL.md + scripts), carregadas sob demanda. Padronizar como pacotes versionados (ferramenta de skills da Vercel usa symlinks p/ versionamento).
- **Context Engineering** — controlar o que o modelo sabe: compactação, offload de saída para arquivo, reset com hand-off estruturado. Combate o "IA perde o fio em chats longos".
- **LLM Router** — RouteLLM (LMSYS), CARROT (arXiv 2502.03261), nosso [[LLMRouter (paper)|LLMRouter]] (roteadores aprendidos +14,6% vs. melhor modelo fixo). Coração do projeto.
- **Spec-Driven Development (SDD)** — spec como fonte da verdade. Ferramentas: GitHub **Spec Kit** (MIT, `/specify→/plan→/tasks→/implement`), AWS Kiro, OpenSpec, BMAD-METHOD, **Task Master AI** (PRD→tarefas), Tessl, SpecStory. Conecta com adoção de GitHub Issues.
- **AGENTS.md** — padrão aberto e portável (rumo à Linux Foundation). Manter curto, cada linha ligada a uma falha.
- **RAG agêntico** — agente decide quando/o que buscar e verifica evidências. Útil para a plataforma white-label (caixas de integração + MCP).

## 3 · Ferramentas e repositórios
- **Skills/Agents**: anthropics/skills (docx/pdf/pptx/xlsx + MCP builder); GetBindu/awesome-claude-code-and-skills; hesreallyhim/awesome-claude-code; wshobson/agents; VoltAgent/awesome-agent-skills (1000+); huggingface/skills; microsoft/skills.
- **Organização / Second Brain**: github/spec-kit; eyaltoledano/claude-task-master; OthmanAdi/planning-with-files; muratcankoylan/Agent-Skills-for-Context-Engineering; yamadashy/repomix.
- **Starter kits**: leonvanzyl/agentic-coding-starter-kit; AlexPEClub/ai-coding-starter-kit (Next.js — casa com Vercel). **Go**: sem skill madura → oportunidade de skill interna. **Dados**: skill xlsx + repomix.

## 4 · Notícias da semana (01–07/11/2026)
- **Meta comprou a Conductor** (roda vários agentes em paralelo); encerra em 20/11. **OpenAI compra Pierre Computer** (Code Storage p/ Codex). **Copilot no Xcode** (preview); **Cursor Apps**; **Mistral Studio**.
- **Custos**: Apple cortou orçamento de tokens (US$300→200, talvez 100); Uber US$1.500/mês; Accenture ~US$29/mês Claude; Tesla US$200/semana; Revolut (achado nº 1). → Grandes empresas fazem o que debatemos; nossa estratégia está no caminho certo.
- **Modelos**: Mistral Large 4 (aberto), Kimi K3.1 Pro, DeepSeek V4 Flash, GLM 5.3, GPT-6.1 Terra, Gemini 4 Carbon.

## 5 · Newsletters (Gmail)
A caixa `vitormouranewsletterreceiving@gmail.com` foi assinada hoje (08/11) → só e-mails de boas-vindas (The Rundown AI, Mindstream, The AI Report, 8020AI, AI for Non-Techies). São generalistas; sugiro assinar fontes técnicas (TLDR AI/Dev, Pragmatic Engineer, Latent Space, Bytes, GitHub Changelog). A partir do próximo ciclo farei o scraping real das edições.

## Fontes principais
LLMRouter (arXiv 2608.06867); Shnitzer et al. · addyosmani.com/blog/agent-harness-engineering, faros.ai, endorlabs.com · dev.to (MCP 2026-07-28), developersdigest.tech · ssojet.com (SDD), github.github.com/spec-kit · implicator.ai (LLM Meter 05/11), campusxblogs.substack.com (#36), llmgateway.io · RouteLLM (lmsys.org), CARROT (arXiv 2502.03261), mastra.ai (context engineering), tessl.io (AGENTS.md) · github.com/{GetBindu/awesome-claude-code-and-skills, hesreallyhim/awesome-claude-code, anthropics/skills}
