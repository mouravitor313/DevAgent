---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-13
atualizado: 2026-11-13
ciclo: 1 (12:50 UTC)
anterior: "[[2026-11-12 - Radar Dev & IA]]"
---
# Radar Dev & IA — 13/11/2026

> Números de fontes secundárias **não auditados**. Só o novo ou incremental; o resto está em [[2026-11-12 - Radar Dev & IA]] e [[2026-11-11 - Radar Dev & IA]]. **Dia calmo**: poucas novidades técnicas; as newsletters de hoje giram em torno da saída do CEO da Nvidia (fora do foco).

## 🏆 Melhores achados
1. **Codex CLI 0.167.2 (11/11) confirmado no changelog oficial** ([OpenAI](https://developers.openai.com/codex/changelog)). Só traz uma mudança: no Google Cloud Vertex AI, as atualizações de ferramentas passam a ser enviadas de forma incremental por padrão (opt-out: `incremental_tools_legacy_gcp = false` em `[features]`). Corrige o radar anterior, que dizia 0.167.1 como atual.
   - → **Por que importa para nós:** nada muda no nosso uso (não usamos Vertex), mas a versão de referência para o harness passa a ser **0.167.2**.
2. **Gemini CLI v0.68.0 (10/11) — publicada no GitHub** (fonte secundária: [labmemo](https://labmemo.com/gemini-cli-v0680-extensions-validate-model-fixes-2026-11/); a v0.67.0 de 04/11 tem a mesma origem). Destaque: `gemini extensions validate` agora checa a configuração de servidores MCP antes da instalação. A página oficial de changelog ([geminicli.com](https://geminicli.com/docs/changelogs/)) continua mostrando só a v0.64.0 (13/10) — está defasada, não é a versão atual. Isso **explica a divergência** da pendência dos radares anteriores.
   - → **Por que importa para nós:** validar config de MCP *antes* de instalar é o tipo de checagem que queremos nos nossos plugins/skills; só monitorar.
3. **Claude Code: o changelog oficial ainda para em v2.1.311** (li a página [code.claude.com](https://code.claude.com/docs/en/changelog) hoje; os números maiores que aparecem em agregadores — v2.1.319 — não estão nela). Bate com a nota do radar anterior de que a tag `stable` aponta para 2.1.311. Conclusão: **a "versão atual" depende do canal**; usar `claude --version` na máquina como verdade.
   - → **Por que importa para nós:** ao escrever docs/ADRs, citar "canal stable" × "latest" em vez de um número só.
4. **Custo de IA por engenheiro: o teto virou prática de mercado** (todas secundárias, **não auditado**): Gartner (jun/2026) — ~1/4 dos líderes de tecnologia gasta entre US$ 200 e US$ 500 por dev/mês em tokens, ~6% passa de US$ 2.000; Uber teria colocado teto de US$ 1.500/mês por pessoa e por ferramenta depois de esgotar o orçamento do ano ([noqta](https://noqta.tn/en/blog/uber-ai-coding-budget-crisis-enterprise-governance-2026), [hyrax.dev](https://hyrax.dev/blog/ai-coding-budget-caps-uber-enterprise-rate-limiting)); Jellyfish diz que o gasto por usuário ativo semanal **triplicou de março a agosto** ([Jellyfish](https://jellyfish.co/library/ai-coding-tool-cost-per-developer/)). Combina com o caso incident.io de [[2026-11-12 - Radar Dev & IA]].
   - → **Por que importa para nós:** nosso orçamento (~R$ 2.000/mês, [[Kickoff]]) está na faixa baixa desses números; vale desenhar **teto por ferramenta + alerta** desde o início, não só rodízio de licenças.
5. **Catálogo de modelos abertos de código — mais nomes, nenhum confirmado em fonte primária** (secundárias): **Poolside Laguna S 2.1** (118B, aberto, para código agêntico; [The Next Web](https://thenextweb.com/news/poolside-laguna-s-2-1-open-weight-coding-model)), **Mistral Large 4** (pesos publicados no fim de outubro; 1T MoE, segundo agregador) e **Kimi K3.1 Pro** (pesos abertos segundo o [ThursdAI](https://thursdai.news/releases/2026-11); só uma fonte).
   - → **Por que importa para nós:** lista de candidatos para o piloto da camada barata; **nada de decisão sem benchmark verificado** (ver "A confirmar").

## 1 · Engenharia de software com IA
- **Claude Code**: ver achado 3. Sem novidade do modelo desde o [[2026-11-10 - Radar Dev & IA]]. Lembrete: **modo rápido do Opus 4.8 sai em 30/11**.
- **Codex CLI**: 0.167.2 (achado 1). O 0.167.0 (06/11) trouxe o *agent command center* (`codex agents --no-daemon`), troca de backend no seletor de sessão e anexo de imagens (secundária: [Daniel Vaughan](https://codex.danielvaughan.com/2026/11/06/codex-v0167-stable-agent-command-center-multi-backend-image-attachments-gcp-vertex/)).
- **Gemini CLI**: v0.68.0 (achado 2).
- **OpenCode**: nada acima da **v2.2.7** achado (ACP: clientes podem redirecionar um turno em andamento — "steering"; v2.2.6 isolou falhas de plugins; v2.2.3 exigiu OpenTUI 0.8 em plugins de TUI) — fontes: [changelog](https://opencode.ai/changelog.md) e [newreleases.io](https://newreleases.io/project/github/anomalyco/opencode/release/v2.2.7). **Sem v2.3 confirmada.** O que importa: o "steering" via ACP é útil para orquestração (redirecionar um agente sem reiniciar).
- **Cursor**: **nada confirmado em novembro** (a última entrada oficial que achei é de 19/08/2026). Não usar número de agregador.

## 2 · Novos conceitos e papers
- **Sem paper novo de roteamento.** A busca de hoje só devolveu os já registrados: [[Agent-as-a-Router (paper)]], [[SWE-Router (paper)]], [[TwinRouterBench (paper)]], Triage (2604.07494) e Routesplain (2511.09373, 2025; roteador específico para perguntas de software — **não tinha anotado antes**, ver "A confirmar"). Nenhuma nota de paper criada.
- **"Orçamento por pessoa e por ferramenta" como padrão de governança** (achado 4): conceito de gestão, não paper; complementa o "effort point" do incident.io.

## 3 · Ferramentas e repos
- **GitHub Trending**: sem lista confiável de novembro (limitação recorrente). Nomes de harness que aparecem em buscas, **todos de ago–set e secundários**: **DeepSeek Harness (dsh)** — recorde de estrelas segundo [Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/11573/deepseek-harness-fastest-github-stars-record); **ECC** (affaan-m) — otimização de desempenho de harness para Claude Code/Codex/OpenCode/Cursor ([aitoolly](https://aitoolly.com/ai-news/article/2026-09-22-ecc-unveils-agent-harness-performance-optimization-system-for-claude-code-codex-opencode-and-cursor)); **Goose** (aaif-goose/goose, sob a fundação). Estrelas não verificadas; só monitorar.
- **Grok Bot 1.0 (SpaceXAI, 12/11)**: agente "colega" proativo com memória compartilhada, Slack/Teams (via Superhuman/TLDR AI — secundária). Fora do foco do harness de código.

## 4 · Newsletters (Gmail — `vitormouranewsletterreceiving@gmail.com`)
- **Novas desde o último radar (12/11 19:15 UTC):** The AI Report (3 edições; "Nvidia: Jensen Huang renuncia", primeira semana, CEO da Fortis), The Rundown ("Nvidia sem Jensen Huang"; tutorial de tracker no Claude Sheets), Mindstream, TechDrops. **Todas só assunto/trecho** — sem sinal técnico para o projeto.
- **Lida em detalhe agora:** Superhuman (12/11) — sem novidade técnica (Grok Bot 1.0; golpes com IA; ChatGPT Finanças). Já refletido em [[2026-11-12 - Radar Dev & IA]]: Pragmatic Engineer (incident.io), AI/TLDR #199, The Code.
- **Sem edição nova de 13/11 até 12:50 UTC:** TLDR AI, AI/TLDR, The Code, ByteByteGo, Pragmatic Engineer.
- **Ainda sem edição real:** Kent Beck, The Engineering Manager, Latent Space.
- **Pulados:** 8020AI, MoneyDrops, TechDrops, AiDrops, Superhuman Academy.
- **Tema recorrente:** custo/teto de IA por pessoa (achado 4).

## 5 · O que acompanhar
- **Teto por ferramenta + alerta de gasto** no desenho do rodízio de licenças (achado 4); conferir se as ferramentas que usamos permitem limite por usuário.
- **Padronizar "canal" ao citar versões** (stable × latest) nas notas do vault.
- **OpenCode "steering" via ACP**: avaliar para orquestração (Fase 3).
- **25/11**: fim da prévia do Qwen4-Max; **30/11**: fim do modo rápido do Opus 4.8.
- Itens abertos: secret scrubbing do Claude Code; decisão OpenCode 1.x × 2.x; poda do AGENTS.md; piloto de "custo por PR médio".

## A confirmar
- **Gemini CLI v0.68.0**: ver o release no GitHub (`google-gemini/gemini-cli`) ou `gemini --version` — hoje só fonte secundária.
- **Claude Code**: por que o changelog oficial para em 2.1.311 e agregadores citam 2.1.319 (canal `latest`?).
- **Laguna S 2.1, Mistral Large 4, Kimi K3.1 Pro**: pesos, licença e benchmarks na fonte oficial.
- **Routesplain (2511.09373)**: ler o abstract e decidir se vale nota de paper.
- **Cifras do Gartner/Uber/Jellyfish**: vêm de blogs de consultorias; localizar o primário antes de citar em decisão.

## Fontes
- Primárias: [Codex changelog](https://developers.openai.com/codex/changelog) · [Claude Code changelog](https://code.claude.com/docs/en/changelog) · [OpenCode changelog](https://opencode.ai/changelog.md) · [Gemini CLI changelog (defasado)](https://geminicli.com/docs/changelogs/)
- Newsletters (Gmail, 12–13/11): Superhuman (lida) · AI Report, The Rundown, Mindstream, TechDrops (só assuntos)
- Secundárias: [labmemo — Gemini CLI v0.68.0](https://labmemo.com/gemini-cli-v0680-extensions-validate-model-fixes-2026-11/) · [Daniel Vaughan — Codex 0.167.0](https://codex.danielvaughan.com/2026/11/06/codex-v0167-stable-agent-command-center-multi-backend-image-attachments-gcp-vertex/) · [newreleases.io — OpenCode v2.2.7](https://newreleases.io/project/github/anomalyco/opencode/release/v2.2.7) · [Jellyfish](https://jellyfish.co/library/ai-coding-tool-cost-per-developer/) · [noqta — Uber](https://noqta.tn/en/blog/uber-ai-coding-budget-crisis-enterprise-governance-2026) · [hyrax.dev — tetos](https://hyrax.dev/blog/ai-coding-budget-caps-uber-enterprise-rate-limiting) · [The Next Web — Laguna S 2.1](https://thenextweb.com/news/poolside-laguna-s-2-1-open-weight-coding-model) · [ThursdAI — nov/2026](https://thursdai.news/releases/2026-11) · [Pasquale Pillitteri — DeepSeek Harness](https://pasqualepillitteri.it/en/news/11573/deepseek-harness-fastest-github-stars-record) · [aitoolly — ECC](https://aitoolly.com/ai-news/article/2026-09-22-ecc-unveils-agent-harness-performance-optimization-system-for-claude-code-codex-opencode-and-cursor)
- Radars anteriores: [[2026-11-12 - Radar Dev & IA]] · [[2026-11-11 - Radar Dev & IA]]
