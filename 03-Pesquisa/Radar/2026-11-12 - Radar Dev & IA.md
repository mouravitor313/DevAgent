---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-12
atualizado: 2026-11-12
ciclo: 1 (19:15 UTC)
anterior: "[[2026-11-11 - Radar Dev & IA]]"
proximo: "[[2026-11-13 - Radar Dev & IA]]"
---
# Radar Dev & IA — 12/11/2026

> Números de fontes secundárias **não auditados**. Só o novo ou incremental; o resto está em [[2026-11-11 - Radar Dev & IA]] e [[2026-11-10 - Radar Dev & IA]].

## 🏆 Melhores achados
1. **incident.io cortou o gasto com IA de ~US$ 4.500 para ~US$ 1.600 por engenheiro/mês** (The Pragmatic Engineer, 12/11; dados cedidos pela empresa; o autor é investidor — **secundária, não auditado**). Pontos úteis:
   - O corte veio principalmente da **troca de Opus 5 para Opus 5.5** (mesma qualidade, bem mais barato). Hoje ~80% do gasto é Claude e ~20% Cursor.
   - Métrica própria: **"effort point"** = um PR médio. Permite comparar custo por PR ao longo do tempo. Times de infra gastam **~5× mais por PR médio**, porque exploram produção e rodam benchmarks sem gerar PR → **um alvo único de custo por PR não serve para todo tipo de trabalho**.
   - Produtividade: mediana de PRs por engenheiro subiu só ~10%; média ~30%; engenheiros antigos ~70%. **Novatos ficam 1 mês sem usar IA** (quem usou muito logo após entrar rendeu pior depois).
   - Qualidade: ~80% dos PRs têm código de agente; PRs sem revisor humano passaram de 12% para 43%; incidentes por 1.000 PRs caíram 60%, mas o total de incidentes subiu. Agora a causa é **falta de informação sobre produção**, não código errado.
   - → **Importa para nós:** dá uma métrica concreta ("custo por PR médio") para o piloto de custo da Fase 3 e para o orçamento de ~R$ 2.000/mês do [[Kickoff]]. Reforça: medir por tipo de tarefa e escolher o modelo antes de pensar em rotear.
2. **Guia oficial de prompting do Fable 5.2** (fonte primária: [Anthropic docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2); li inteiro). Resolve a pendência "Fable 5.2 como Advisor/Orchestrator" em parte. Itens para o harness:
   - **Esforço:** padrão `high` na API; `low`/`medium` bastam para subagentes e trabalho bem especificado; `xhigh`/`max` só se medir ganho. Em esforço baixo o modelo **para cedo** → a doc traz um texto de "terminar o trabalho todo" para o system prompt.
   - **Subagentes podem ser boa parte do custo da sessão**; o modelo delega mais quando o harness convida. Checar qual modelo os subagentes usam por padrão e remover linhas "delegue" de skills/agents que já não precisamos.
   - **"Quem é dono do código":** dizer "você é o dono/mantenedor" faz o modelo consolidar código duplicado (de <10% para ~75% das execuções) mas gasta ~70–80% mais tokens e faz mudanças não pedidas. Em repo de terceiros, não usar. (números da própria Anthropic, não auditado)
   - **Cautela que se acumula:** memória/notas com "nunca…" são seguidas ao pé da letra e travam o agente → **revisar o AGENTS.md e as notas periodicamente** e trocar "nunca X" por "peça aprovação antes de X".
   - Harness que edita turnos antigos invalida o *preserved thinking* (erro 400); manter histórico só de acrescentar.
   - → **Importa para nós:** casa com o "ratchet" do [[AGENTS.md]] (regras vindas de falhas) e alerta que o ratchet também precisa de **poda**. Ver [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]].
3. **Codex CLI: 0.167.1 (10/11) confirmado** no [changelog oficial](https://developers.openai.com/codex/changelog) (reconfirmado hoje; **nenhuma versão nova** desde o radar anterior). **Gemini CLI**: o changelog oficial ([geminicli.com](https://geminicli.com/docs/changelogs/)) lista **v0.64.0** como a mais recente na página que consegui abrir, enquanto fontes secundárias citam **v0.67.0 (04/11)** → provavelmente a página lista só o canal estável; a pendência segue aberta (ver "A confirmar").
4. **Candidatos novos à camada barata (todos via AI/TLDR #199, secundária, autodeclarado):**
   - **ERNIE 5.5 Flash Preview (Baidu, 11/11):** MoE 280B (14B ativos), 1M de contexto, foco em código agêntico; **grátis no OpenRouter**, pesos Apache 2.0 **prometidos** (não publicados). É checkpoint intermediário; a própria tabela da Baidu o mostra **bem atrás no Terminal-Bench 4.0**.
   - **Qwen4-Max-Preview (Alibaba, 11/11):** prévia por tempo limitado (**sai do ar após 25/11**); fala os formatos OpenAI Chat/Responses e **Anthropic Messages**, então roda atrás do Claude Code/Codex/Cline. Sem benchmark, tamanho ou licença.
   - → Úteis só como **teste barato** no OpenCode (Fase 3); nada de decisão sem número verificado.
5. **Segurança de cadeia de suprimentos continua quente:** TLDR/The Code (12/11, secundárias) citam **4.800+ contas do GitHub sequestradas** para roubar credenciais de CI/nuvem, e a Pragmatic Engineer cita o **postmortem do Railway** (atacante provavelmente usou modelos "abliterated", sem proteções) e o caso Binance (US$ 6,3 bi; devs enganados a baixar pacotes). → Reforça o achado do Fireworks de [[2026-11-10 - Radar Dev & IA]]: **chaves de API e tokens de CI são alvo**; rotação e limite de gasto.

## 1 · Engenharia de software com IA
- **Claude Code**: buscas só trazem roundups de terceiros ([claude-world](https://claude-world.com/articles/claude-code-november-2026-whats-new/), [Havoptic](https://www.havoptic.com/releases/claude-code/2026/11)) até **v2.1.319 (06/11)**; **sem versão nova** achada. Nota: um roundup diz que a tag npm `stable` ainda aponta para 2.1.311, `latest` para 2.1.319 (secundária; checar com `claude --version`). Lembrete: **modo rápido do Opus 4.8 é removido em 30/11** (vira erro).
- **Codex CLI**: 0.167.1 (ver achado 3).
- **OpenCode, Cursor**: nada novo confirmado hoje.
- **Google Agent Development Kit v2.14.0 (07/11)**: A2A e sandboxes de execução "graduam" (só agregador; não verificado).
- **AWS Emulator (11/11)**: emulador local gratuito (CC0, Rust) de 200+ serviços AWS, **construído por times de agentes sem revisão humana de código** (segundo a Amazon, via AI/TLDR e [The Code](https://github.com/aws/aws-emulator)). Não avalia IAM. → Ideia útil para **testes de agente sem credencial/custo de nuvem** (stack com AWS, se houver).
- **GitHub Ace** (GitHub Next, via The Code): colaboração de times e agentes no mesmo Mac, com acesso ao shell local via Tailscale — o aviso do radar anterior (agentes com privilégio do usuário) continua valendo. [ace.githubnext.com](https://ace.githubnext.com/).

## 2 · Novos conceitos e papers
- **Sem paper novo de roteamento** encontrado hoje (busca arXiv só devolveu os já registrados: [[Agent-as-a-Router (paper)]], [[SWE-Router (paper)]], Triage 2604.07494). Nenhuma nota de paper criada.
- **"Effort point" do incident.io** (achado 1) como unidade de custo — conceito prático, não paper.
- **Conductor mode** (The Code, 12/11, post de rede social, anedótico): Fable 5.2 **planeja** e Opus 5.5 **constrói**, em 4 passos no Claude Code — mesmo padrão planner+executor já visto em [[2026-11-09 - Radar Dev & IA]] e no teste de [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]].
- **A2UI 1.0 (Google, 11/11)**: protocolo aberto estável de UI gerada por agente (o agente descreve a tela; o cliente desenha com componentes próprios). Fora do foco do harness; só monitorar como padrão aberto.
- **Gemini Decision 1** (Google; via The Code/TLDR, secundária): modelo que pontua até 1.000 perguntas fechadas de uma vez, sem gerar texto (US$ 0,10/1M tokens de entrada). Pode servir como **classificador barato** (ex.: roteador/triagem) — ideia para testar, sem evidência ainda.

## 3 · Ferramentas e repos
- **T3 Code** (tutorial na The Code): "sala de controle" para rodar Claude Code, Codex e Grok num app só, com worktrees e skills. A Pragmatic Engineer cita que a **Meta comprou e fechou o Conductor** (concorrente do T3 Code) — sinal de consolidação do mercado de orquestradores (secundária).
- **CodeAF (AgentField, patrocinado — tratar como anúncio)**: afirma ficar em 1º entre 10 harnesses no DeepSWE com um modelo aberto, "gerentes" de agentes. Autodeclarado; só monitorar.
- **Meta Muse / Gemini 4 Carbon (Google, API aberta a pagantes em 11/11)**: lançamentos de modelo vistos só no assunto de newsletters (TLDR AI, 8020AI); sem fonte primária lida → A confirmar.
- **GitHub Trending**: sem lista confiável de novembro (mesma limitação).

## 4 · Newsletters (Gmail — `vitormouranewsletterreceiving@gmail.com`)
- **Lidas em detalhe:** The Pragmatic Engineer (12/11, incident.io), AI/TLDR #199 (12/11), The Code (12/11).
- **Só assunto/trecho:** TLDR AI 11/11 ("Gemini 4 Carbon", "Claude Sheets", "Antigravity Swarm") e 12/11 ("Grok Bot 1.0", "AlphaGenome 2"); AI/TLDR 11/11 (termos do IPO da Anthropic: US$ 70–78 por ação, US$ 26 bi de sete fornecedores — secundária); Mindstream (IPO da Anthropic "menor que o esperado"; OpenAI e viagens); The Code 11/11 ("11 erros de agentes de código", "melhores entrevistas de código"); The Code Cybersecurity 11/11 (credencial custou US$ 740 mil ao Railway); ByteByteGo 12/11 ("Hidden Coupling" — tema de arquitetura, não lido) e Roundup 11/11; The Rundown e The AI Report (Nvidia/CEO, ChatGPT para negócios, receita da OpenAI > US$ 10 bi/trimestre — não auditado). Sem sinal técnico novo para o projeto além do acima.
- **Pulados:** 8020AI, MoneyDrops, TechDrops, AiDrops, Superhuman Academy, anúncio de curso do ByteByteGo.
- **Ainda sem edição real:** Kent Beck, The Engineering Manager, Latent Space.
- **Temas recorrentes:** (1) **custo por engenheiro/PR** (incident.io, tetos das Big Techs); (2) **segurança de credenciais e cadeia de suprimentos**; (3) **planner forte + executor barato**.

## 5 · O que acompanhar
- **Medir "custo por PR médio" por tipo de tarefa** no piloto da Fase 3 (inspirado no incident.io); comparar Opus 5.5 × Fable 5.2 × modelo barato.
- **Podar o AGENTS.md/memórias**: procurar regras "nunca…" que travam agentes (guia do Fable 5.2).
- **Checar o modelo padrão dos subagentes** e `effort` nos `.claude/agents/` (já listado em [[2026-11-09 - Radar Dev & IA]]; agora com base na doc oficial).
- **25/11**: fim da prévia do Qwen4-Max; **30/11**: fim do modo rápido do Opus 4.8.
- **Inkling 2 Small**: busca de hoje diz que, em 09/11, o Hugging Face da empresa ainda **não** tinha os pesos (secundária: [LetsDataScience](https://letsdatascience.com/blog/inkling-2-small-30-cents-per-million-tokens-weights-still-locked)); o **Inkling-Small de 30/07 (276B, 12B ativos, Apache 2.0)** é outro modelo, e há muitos re-uploads de terceiros → só baixar do repositório oficial.
- Itens abertos: secret scrubbing do Claude Code; decisão OpenCode 1.x × 2.x.

## A confirmar
- **Gemini CLI**: v0.64.0 (changelog oficial, página aberta hoje) × v0.67.0 (secundárias) → rodar `gemini --version` e ver o changelog completo/preview.
- **ERNIE 5.5 Flash Preview** e **Qwen4-Max-Preview**: licença, pesos e benchmarks na fonte oficial.
- **Gemini 4 Carbon**, **Gemini Decision 1**, **Muse**: fonte primária.
- **incident.io**: números vêm de newsletter com dados cedidos pela empresa; conferir no artigo completo ([Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/the-pulse-details-of-incidentios)).
- **4.800 contas GitHub sequestradas** e **Railway**: ler fontes primárias (postmortem do Railway; aviso do GitHub).
- **Claude Code**: confirmar no changelog oficial se há versão acima da 2.1.319.

## Fontes
- Primárias: [Anthropic docs — Prompting Claude Fable 5.2](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2) · [Codex changelog](https://developers.openai.com/codex/changelog) · [Gemini CLI changelog](https://geminicli.com/docs/changelogs/) · [arXiv 2607.00053](https://arxiv.org/abs/2607.00053) · [arXiv 2606.22902](https://arxiv.org/abs/2606.22902) · [aws/aws-emulator](https://github.com/aws/aws-emulator)
- Newsletters (Gmail, 11–12/11): The Pragmatic Engineer — [versão web](https://newsletter.pragmaticengineer.com/p/the-pulse-details-of-incidentios) · AI/TLDR #199 ([ai-tldr.dev](https://ai-tldr.dev)) · [The Code](https://codenewsletter.ai/p/google-s-decision-model-scores-1-000-questions-at-once) (só assuntos das demais)
- Secundárias: [claude-world — Claude Code nov/2026](https://claude-world.com/articles/claude-code-november-2026-whats-new/) · [Havoptic — Claude Code](https://www.havoptic.com/releases/claude-code/2026/11) · [LetsDataScience — Inkling 2 Small](https://letsdatascience.com/blog/inkling-2-small-30-cents-per-million-tokens-weights-still-locked) · [Unblocked — roteamento](https://getunblocked.com/blog/model-routing-coding-agents) · [ace.githubnext.com](https://ace.githubnext.com/)
- Radars anteriores: [[2026-11-11 - Radar Dev & IA]] · [[2026-11-10 - Radar Dev & IA]]
