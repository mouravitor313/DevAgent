---
tipo: radar
status: consolidado
tags: [devagent, radar]
criado: 2026-11-10
atualizado: 2026-11-10
ciclo: 1 (16:45 UTC)
anterior: "[[2026-11-09 - Radar Dev & IA]]"
proximo: "[[2026-11-11 - Radar Dev & IA]]"
---
# Radar Dev & IA — 10/11/2026

> Números de fontes secundárias **não auditados**. Só o novo ou incremental; o resto está em [[2026-11-09 - Radar Dev & IA]] e nos três ciclos de 08/11 (ver [[2026-11-08 - Radar Dev & IA (Ciclo 3)]]).

## 🏆 Melhores achados
1. **Claude Fable 5.2 (e Mythos 5.2) lançado em 09/11** — fonte primária: [Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2). Preço de lista **US$ 8 / US$ 40 por 1M tokens (in/out)** (mais barato que o 5.1); saída **até 30% mais rápida**; "modo rápido" opcional (até 2,5× mais veloz) por US$ 16 / US$ 80, disponível no Claude Code. Em esforço *Medium* (padrão no Claude Code) gasta menos tokens que o 5.1; o post diz que Fable 5.2 em *High* fica no nível do Opus 5.5 em *Max* por ~metade do custo por tarefa (resultado interno da Anthropic, não auditado). Fable 5.2 pode atuar como **Advisor** (modelos menores o consultam) ou **Orchestrator** (delega a modelos menores). → **Importa para nós:** é exatamente o padrão "forte aconselha, barato executa" do nosso teste em [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]]; o preço mais baixo muda a conta do rodízio de licenças. Ver doc do [Advisor](https://code.claude.com/docs/en/advisor).
2. **OpenRouter lança Auto Router e Auto Code (06/11)** — fonte primária: [blog OpenRouter](https://openrouter.ai/blog/announcements/auto-and-auto-code-routers/). Roteador comercial novo, com versão para harness de código (`openrouter/auto-code`). Decide **modelo + esforço de raciocínio** por requisição usando 11 fatores, preço ao vivo, saúde do provedor e cache; respeita ZDR, lista de modelos permitidos e BYOK. Reportam **~Opus 5.5 em qualidade com 74% menos custo por tarefa** (benchmarks próprios, não auditado). Detalhe útil: é **conservador para trocar de modelo** (protege o cache; ficou no mesmo modelo em ~9 de cada 10 turnos no beta). O próprio post admite: nenhum roteador bate o melhor modelo único em todo ponto de custo × qualidade. → Candidato direto de baseline para [[Roteamento de LLMs]] e para o OpenCode (Fase 3); combina com o alerta do [[LLMRouterBench (paper)]] (roteadores nem sempre batem baseline simples).
3. **Agent-as-a-Router (arXiv 2606.22902)** — roteamento como laço Contexto→Ação→Feedback, com memória e verificador; +15,3% relativo só por dar estatísticas de desempenho ao roteador; código e benchmark abertos. → Nota criada: [[Agent-as-a-Router (paper)]] (só abstract lido).
4. **LongCat-2.5 (Meituan) com pesos abertos, licença MIT** (10/11; via AI/TLDR, secundária): MoE de 1,6T parâmetros (~48B ativos), modo pensar/não pensar, experts em W4A4; notas **autodeclaradas**. → Mais um candidato à camada barata auto-hospedada, mas o tamanho exige hardware pesado; ver "A confirmar".
5. **Meta Muse Ember** (09/11; via AI/TLDR e TLDR AI, secundárias): modelo pequeno para subtarefas de agente (chamada de ferramenta, código, roteamento, extração), 1M de contexto, **US$ 0,10 / US$ 0,50 por 1M tokens**; Meta diz que iguala o Haiku 5.5 no raciocínio máximo a ~1/3 do custo (autodeclarado). → Referência de preço para a camada "executor barato".

## 1 · Engenharia de software com IA
- **Claude Code**: [releases no GitHub](https://github.com/anthropics/claude-code/releases) ainda mostra **v2.1.319 (06/11)** como a mais recente → **sem versão nova** desde o radar anterior. Novidade vem do modelo: Fable 5.2 e modo rápido no Claude Code (achado 1).
- **OpenCode** ([releases](https://github.com/anomalyco/opencode/releases)): snapshot mostra **v2.2.0 (27/10)** e **v1.19.4 (22/10) como "Latest" da linha 1.x** → sem mudança desde o radar anterior; a decisão 1.x vs 2.x segue em aberto.
- **Codex CLI e Gemini CLI**: os snapshots que consegui abrir estão **defasados** (Codex 0.161.0 de 07/10; Gemini CLI v0.55.1 de 11/08) — **não usar como versão atual**. Ver "A confirmar".
- **OpenAI Control Room** (09/11; via AI/TLDR): serviço que autoriza cada requisição de inferência de trabalhos de pesquisa e os para em segundos (a newsletter cita 35 s). Padrão interessante de **kill switch na camada de inferência** (fail-closed). Referência para nossos hooks de segurança; sem ação imediata.
- **GitHub ACE** (TLDR AI, 09/11): ferramenta para times construírem software com agentes **localmente**; o texto avisa que agentes rodam com os privilégios do usuário e podem alterar arquivos fora do projeto. Link: [ace.githubnext.com](https://ace.githubnext.com/). Pouca informação; só vale monitorar.

## 2 · Novos conceitos e papers
- **Roteamento por aprendizado de execução** (achado 3): complementa [[TwinRouterBench (paper)]] e o *Agentic Routing* de [[2026-11-09 - Radar Dev & IA]]. Tese que se repete: o roteador melhora quando recebe **resultado verificado por tarefa**.
- **Memória de agentes em camadas ("dreaming")** — o post da Anthropic ([components of agent memory](https://www.anthropic.com/research/components-of-agent-memory)) agora tem **link primário** (via TLDR AI de 09/11); resolve a pendência "ler o post original" do radar anterior. Ainda não li o texto completo.
- **AlphaProof Code (DeepMind, 10/11; via AI/TLDR)**: agentes + Lean provam que código real (protocolo Signal) cumpre a especificação; relatam 4 semanas e revisão humana de ~1% do código. Fora do nosso escopo, mas mostra o padrão **especificação revisada por humanos + verificação automática** (alinha com Spec-Driven Development).
- **Dado de custo/mercado (secundário)**: AI/TLDR e TLDR AI mostram a Apple vendendo "pacotes de uso de IA" de US$ 49,99 no Logic Pro — mais um sinal de **tetos de uso** (ver Big Tech limitando gasto no radar anterior).

## 3 · Ferramentas e repos
- **Fireworks AI — vazamento de outubro maior que o divulgado** (09/11; AI/TLDR e [boletim oficial](https://fireworks.ai/security/bulletins/october-2026-security-incident-update)): segundo a newsletter, atingiu dados de cobrança e, para algumas contas, segredos, datasets e pesos de fine-tuning incompletos; grupo ligado a "LLMjacking" (revenda de acesso a modelos). → Se formos usar provedores de inferência barata, **tratar chave de API como segredo de alto risco** (rotação, limite de gasto). Não li o boletim na íntegra.
- **Microsoft AI Frontiers/Autogen**: já coberto no radar anterior; TLDR AI traz o texto de Langford ("The end of AI Frontiers") — sem fato novo.
- **GitHub Trending**: sem lista confiável de novembro (mesma limitação do radar anterior).

## 4 · Newsletters (Gmail — `vitormouranewsletterreceiving@gmail.com`)
- **Lidas em detalhe:** AI/TLDR #197 (10/11) e TLDR AI de 09/11 e 10/11 → conteúdo nos achados e seções acima.
- **Só assunto/trecho (sem leitura completa):**
  - **ByteByteGo** — "How GitHub Used AI to Port Copilot From TypeScript to Rust in Record Time" (10/11) e "How LinkedIn Uses AI to Review 40,000 Pull Requests a Week" (09/11). **Primeiras edições técnicas reais**; relevantes para o tema *review e refactor com agentes* ([[Tarefas transversais]]). Vale leitura dedicada.
  - **The Pragmatic Engineer** — "Software correctness & supply chain security, with Sean Allen" (10/11), conversa sobre os fundamentos do desenvolvimento com IA.
  - **The Code** — 09/11 "Claude Code's new security flaw" (mesmo tema do vazamento de segredos já coberto) e 10/11 "Google strikes Nvidia at its worst" (hardware).
  - **The Rundown / Superhuman / The AI Report / Mindstream**: foco em Fable 5.2, Nvidia e compras de infraestrutura da Anthropic (US$ 3,4 bi em turbinas, segundo TLDR AI e TechCrunch); sem sinal técnico novo para o projeto.
- **Pulados:** 8020AI, MoneyDrops, TechDrops, AiDrops (iscas/generalistas), Superhuman Academy (aula), notificação do Substack.
- **Ainda sem edição real:** Kent Beck, The Engineering Manager, Latent Space.
- **Temas recorrentes:** (1) **modelo forte + modelo barato** (Fable 5.2 como advisor, Ember, roteadores); (2) **segurança/segredos** de agentes e provedores; (3) **teto/custo de uso de IA**.

## 5 · O que acompanhar
- **Inkling 2 Small**: pesos Apache 2.0 prometidos para "semana que vem" (anúncio de 05/11); **ainda não confirmei publicação**. Cuidado: existe um **Inkling-Small anterior (30/07)**, aberto, que não é o mesmo modelo.
- **Testar o Fable 5.2 como Advisor** com executor Haiku/Sonnet e medir custo por tarefa (Fase 3/4).
- **Comparar** `openrouter/auto-code` com cascata manual no OpenCode (custo e taxa de sucesso).
- **ByteByteGo** (Copilot→Rust; LinkedIn 40 mil PRs/semana): ler e extrair padrões de review com IA.
- Secret scrubbing do Claude Code (pendência do radar anterior): sem novidade.

## A confirmar
- **Versões atuais do Codex CLI e Gemini CLI**: conferir `codex --version` / `gemini --version` e os changelogs oficiais (os snapshots do GitHub estavam defasados).
- **Inkling 2 Small**: se os pesos já foram publicados no Hugging Face.
- **LongCat-2.5**: licença MIT e notas na [página do modelo](https://huggingface.co/meituan-longcat/LongCat-2.5); requisitos reais de hardware.
- **Muse Ember**: preço e comparativo com Haiku 5.5 na fonte oficial ([Meta](https://research.meta.ai/blog/muse-ember)).
- **Auto Code do OpenRouter**: ver a página de [benchmarks de roteadores](https://openrouter.ai/benchmarks/routers) antes de usar os números.
- Conteúdo completo do post de memória da Anthropic e do boletim da Fireworks.

## Fontes
- Primárias: [Anthropic — Fable 5.2 e Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2) · [OpenRouter — Auto e Auto Code](https://openrouter.ai/blog/announcements/auto-and-auto-code-routers/) · [anthropics/claude-code releases](https://github.com/anthropics/claude-code/releases) · [anomalyco/opencode releases](https://github.com/anomalyco/opencode/releases) · [openai/codex releases](https://github.com/openai/codex/releases) (snapshot defasado) · [google-gemini/gemini-cli releases](https://github.com/google-gemini/gemini-cli/releases) (snapshot defasado) · [arXiv 2606.22902](https://arxiv.org/abs/2606.22902)
- Newsletters (Gmail, 09–10/11): AI/TLDR #197 ([ai-tldr.dev](https://ai-tldr.dev)) · TLDR AI 09/11 e 10/11 ([tldr.tech/ai](https://tldr.tech/ai)) · ByteByteGo · The Pragmatic Engineer · The Code (só assuntos)
- Secundárias: [AI/TLDR — LongCat-2.5](https://ai-tldr.dev/releases/meituan-longcat-2-5/) · [AI/TLDR — Muse Ember](https://ai-tldr.dev/releases/meta-muse-ember/) · [AI/TLDR — Control Room](https://ai-tldr.dev/releases/openai-control-room/) · [TechCrunch — turbinas da Anthropic](https://techcrunch.com/2026/11/09/anthropic-joins-ais-natural-gas-frenzy-buys-3-4b-worth-of-turbines/) · [Fireworks — boletim](https://fireworks.ai/security/bulletins/october-2026-security-incident-update)
- Busca: Inkling 2 Small (letsdatascience.com, pasqualepillitteri.it, llm-stats.com — secundárias, ver "O que acompanhar")
- Radars anteriores: [[2026-11-09 - Radar Dev & IA]]
