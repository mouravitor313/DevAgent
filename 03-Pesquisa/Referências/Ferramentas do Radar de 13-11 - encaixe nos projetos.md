---
tipo: referência
status: em-construção
tags: [devagent, referência, ferramentas, roteamento, mcp, skills, aws, web, ui-agentica]
criado: 2026-11-13
atualizado: 2026-11-13
fonte: digest semanal do Radar Dev & IA (13/11/2026), seção de ferramentas
formato: artigo | repo
---
# Ferramentas do Radar de 13/11: encaixe nos projetos

Avaliação de cinco ferramentas que o Vítor destacou na seção de ferramentas do digest semanal do [[2026-11-13 - Radar Dev & IA]]. A pergunta é como cada uma pode complementar o **DevAgent**, o **`terminal`**, o **`xend-onchain`** e o dia a dia do fundo. As fontes foram lidas em 13/11. Os números vêm dos próprios fornecedores e estão marcados como **não auditados**.

## Resumo e prioridade

| # | Ferramenta | O que é | Onde encaixa | Prioridade | Custo do primeiro teste |
|---|---|---|---|---|---|
| 1 | Artigo OpenRouter "MCP vs CLI vs Skills" | Medição do custo de contexto de cada abordagem | `intelligence-mcp` (onchain), ferramentas `ui_*` do `terminal`, [[Filosofia do setup de agentes]] | **Agora** | Zero: auditoria de código |
| 2 | Modern Web Guidance (Google Chrome) | Skills e CLI offline com boas práticas da web moderna | `terminal` (Electron), `apps/dashboard` (Next 16), notas de [[Stacks]] | **Agora** | Baixo: `legacy-scan` só leitura |
| 3 | Gemini Decisions API | Classificador de escolha fechada, barato e rápido (≠ LLM gerador) | [[Roteamento de LLMs]], chat do `terminal`, triagem de notícias e alertas | **Experimento** | Baixo: reaproveita o dataset de ativação de skills |
| 4 | A2UI | Protocolo aberto de UI gerada por agente (JSON declarativo) | Chat do `terminal`; aprovações humanas em operações do fundo | **Depois** (spike) | Médio |
| 5 | AWS Emulator | Emulador local oficial das APIs AWS | `xend-onchain` na F2, se a topologia usar serviços AWS | **Monitorar** | Médio (Docker no Windows) |

---

## 1. OpenRouter: "MCP vs CLI vs Skills: What Each Costs in Context"
Fonte: https://openrouter.ai/blog/insights/mcp-vs-cli-vs-skills/ (11/11/2026)

**O que mediram.** Uma tarefa no GitHub (release mais recente e 3 issues `bug` do `cli/cli`), em 4 modelos (Haiku 5.5, Sonnet 5.5, GPT-6 Luna, Gemini 3.8 Flash), resolvida de três formas: CLI (`gh` via shell), Skill (CLI + SKILL.md de 1.492 caracteres) e MCP oficial do GitHub com 2, 46 ou 91 tools. Os autores mediram tokens de entrada e acerto, mas **não mediram latência**. A ressalva é dos próprios autores: "one server on one task".

**Números principais (Sonnet 5.5, tokens de entrada na tarefa inteira; não auditados).** Todas as execuções da tabela acertaram a resposta.

| Abordagem | Tokens | Custo/tarefa |
|---|---|---|
| CLI | 1.421 | $0,0075 |
| Skill | 3.315 | $0,0118 |
| MCP com 2 tools | 23.228 | $0,0552 |
| MCP com 46 tools (padrão) | 59.417 | $0,1274 |
| MCP com 91 tools | 101.351 | $0,2113 |
| MCP com 2 tools e resultado cortado em 4.000 caracteres | 5.357 | $0,0191 |

- Só as definições das 46 tools custam **+19.436 tokens por requisição** no Haiku.
- **O resultado da tool pesa mais que as definições.** Uma única chamada, `get_latest_release`, devolveu 42 mil caracteres (≈20 mil tokens), 87% deles sobre os arquivos de download. Com o argumento `fields`, a resposta de `list_issues` caiu de 8.336 para 714 caracteres.
- O Tool Search (beta, `defer_loading`) ajuda no Sonnet e no GPT, mas no Haiku **piorou**: o modelo errou argumentos e entrou em retentativas.
- Recomendação do artigo: usar a CLI quando ela existe; CLI + skill quando a CLI é própria ou o modelo a usa mal; MCP restrito e com resultados enxutos quando não há shell ou quando é preciso a autenticação do servidor.

**O que isso muda para nós**
- **Confirma a [[Filosofia do setup de agentes]]**: CLI primeiro, skills com divulgação progressiva e MCP só quando agrega. Também valida a escolha do `gh` na skill `executar-issue` e a exceção do MCP do Clerk (DEC-2026-11-10-01), que se encaixa no caso "a CLI não funciona".
- **`xend-onchain/apps/intelligence-mcp`** (usado pela equipe via claude.ai/Desktop) tem ~14 tools e um escape `run_sql`. O ponto de atenção é o tamanho dos resultados: as tools de `arb` aceitam até 500–1000 linhas e têm **default de 500** (`src/tools/arb.ts:41,61`). Pelo artigo, é aí que o contexto estoura. Ações candidatas:
  1. defaults pequenos (ex.: 20–50 linhas);
  2. parâmetro `fields`;
  3. resumo agregado antes da linha a linha;
  4. medir as definições com o `mcp_cost.py` do artigo.
- **`terminal`**: o chat usa Claude com ferramentas `ui_*` (6 encontradas: `ui_set_chart`, `ui_add_widget`, `ui_compare`…) e o catálogo de skills fica no próprio app. Vale medir o custo fixo das definições por mensagem, porque o app roda o dia inteiro na mão de 3–5 analistas.
- **Durável**: a regra "resultados de tool enxutos importam mais que o número de tools" merece entrar na [[Filosofia do setup de agentes]] depois da auditoria (proposta, não aplicada).

## 2. Modern Web Guidance (GoogleChrome/modern-web-guidance)
Fonte: https://github.com/GoogleChrome/modern-web-guidance

**O que é.** Skills mais uma CLI local (`modern-web-guidance`) com boas práticas e dados de compatibilidade de **~250 recursos da web moderna**: CSS/layout, HTML/DOM, JS/APIs, performance (INP, `scheduler.yield`), acessibilidade, formulários (Popover, Anchor Positioning), View Transitions e Built-in AI. Mantida por **Chrome, Edge, Firefox e MDN**. Licença Apache-2.0 (guias CC-BY 4.0).
- A busca roda offline (embeddings + BM25, sem chave de API) e o índice é pequeno (~205 tokens). Isso combina com o nosso padrão de contexto mínimo.
- Há plugins para Claude Code, Codex, Cursor, Gemini e outros, e o pacote pode ser instalado via `npx skills add` (coerente com [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]).
- Evals do próprio repo: Claude Code com Opus 5.5 passa de 57% para 88% (+31pp) nas tarefas deles. **Não auditado.**
- A telemetria é anônima e ligada por padrão; para desligar, `DISABLE_TELEMETRY=1`.

**Onde encaixa**
- **`terminal`**: é o melhor encaixe. O app é Electron, então roda num Chromium conhecido e pode usar os recursos novos sem a preocupação de compatibilidade entre navegadores.
- **`xend-onchain/apps/dashboard`** (Next 16.2, React 19.2) e, em seguida, `xend-website` e `XEND-RFQ-PORTAL`.
- **[[Stacks]]**: é candidata a skill nas notas de [[JavaScript]] e [[Next.js]] (DEC-2026-11-08-21) e conversa com a conversão do "Contexto" das Stacks em skills (DEC-2026-11-10-29).

**Primeiro teste (só leitura).** Rodar `npx modern-web-guidance@latest legacy-scan .` no `terminal` e no `apps/dashboard`, com `DISABLE_TELEMETRY=1`, e ver se os achados são úteis ou ruído. Se forem úteis, instalar como skill e avaliar com o mesmo método de [[Teste de skills - supabase-postgres e agent-browser 2026-11-10]].
- Lembrete do nosso teste de ativação: sem a **linha-índice no `AGENTS.md`**, a skill quase não dispara sozinha (25% → 86–88% com o índice).

## 3. Gemini Decisions API
Fonte: https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/ (11/11/2026) · docs: https://aistudio.google.com/docs/decisions-api

**O que é.** Um endpoint da Gemini API, sobre o modelo `gemini-decision-1`, que **não gera texto**: ele pontua opções pré-definidas numa única passada e devolve probabilidades com confiança de 0 a 1.
- Tipos de pergunta: sim/não (o post escreve `noul`, provável erro de digitação; conferir na doc), `choice` (2–255 opções) e `score` (rubrica ordenada).
- Entrada multimodal de até 256K tokens; até 1.000 perguntas por requisição sobre a mesma entrada.
- Preço: **US$ 0,10 por 1M tokens de entrada e US$ 0 de saída**, com a entrada compartilhada cobrada uma vez por requisição.
- Latência de 150–250 ms ponta a ponta. **Não auditado.**
- O SDK usa `api_version: "v1beta"`, então trate como beta.
- Integrações anunciadas: OpenRouter, LiteLLM, Vercel, OpenCode e outras.
- **Não é um roteador por si só**: é um classificador que *serve* de roteador. O Google usa assim no Gemini Notebook, onde aponta até 40% menos latência.

**Onde encaixa**
- **[[Roteamento de LLMs]]**: corresponde à estratégia 3 da nota ("classificador preditivo"), pronta e barata. Pode ser o primeiro estágio de um roteador antes do OpenCode/OpenRouter: classificar a tarefa por nível (Haiku/barato, Sonnet, Opus) e por tipo de [[Tarefas transversais]]. Conversa com as pendências do Groq (DEC-2026-11-08-28) e dos modelos free do OpenCode (DEC-2026-11-08-27).
- **`terminal`**:
  - rotear as mensagens do chat entre resposta rápida (cotação, `@b3:PETR4`, troca de gráfico) e análise profunda (backtest, briefing);
  - dar uma nota de relevância (`score`) às notícias e alertas antes de chegarem ao painel ou ao briefing das 8h;
  - escolher a ferramenta `ui_*` antes de acionar o LLM.
- **Fundo**: triagem e etiquetagem em lote de notícias, e-mails e alertas (1.000 perguntas sobre o mesmo texto custam uma entrada só).
- **Limites**:
  - **nunca no caminho quente do market making.** Os bots são Go, determinísticos e com canal de comando (DEC-2026-11-10-17/18), e um classificador remoto não entra ali;
  - não enviar dado sensível do fundo (posições, saldos, clientes) para a API do Google sem decisão explícita;
  - dependência de fornecedor e status beta.

**Experimento proposto.** Reaproveitar o dataset do teste de ativação de skills (`05-Agente/Avaliação/Ativação de skills 2026-11-11/prompts.tsv`): passar cada prompt como pergunta `choice` sobre o índice de skills (mais a opção "nenhuma") e comparar acerto, custo e latência com o Sonnet (86–88% com o índice). Isso mede o encaixe como roteador sem tocar em repo. Exige uma chave do Google AI Studio (o nível gratuito serve para protótipo).

## 4. A2UI
Fonte: https://a2ui.org/ · repo: https://github.com/a2ui-project/a2ui

**O que é.** Um framework aberto (Apache 2.0, spec **v1.0**) de UI gerada por agente.
- O agente descreve a interface como um **fluxo de JSON declarativo** (`createSurface`, `updateComponents`, `updateDataModel`), e o cliente renderiza com **os próprios componentes nativos**.
- Um `catalog.json` define o que o agente pode usar. Daí a promessa: "Agents place only components you registered", sem código executável.
- Renderizadores: React, Lit, Angular, Flutter, SwiftUI e Compose.
- O transporte é livre (AG-UI, A2A, **MCP**, WebSocket).
- Adoção citada pelo próprio site: Atlassian (Jira), Gemini Notebook e Google Cloud.

**Onde encaixa**
- **`terminal`**: hoje o Claude mexe na UI por ferramentas `ui_*` imperativas. Com o A2UI, poderia **compor cartões ricos dentro do chat** (cotação com mini-gráfico, resultado de backtest, formulário para criar ou editar um bot/job, aprovação de rotina) usando um catálogo que é o design system do app. É mais seguro que HTML gerado e mais flexível que criar uma tool por widget. O renderizador React se encaixa no frontend Vite.
- **Fundo / onchain**: **aprovação humana** de operações manuais e comandos (canal de comando do MM, tabelas de `manual-operations` do `bff`) como cartões estruturados, em vez de texto livre. Também poderia ser uma saída rica do `intelligence-mcp`. Falta confirmar se o claude.ai renderiza A2UI ou só MCP Apps; não verificado.
- **DevAgent**: relevância baixa, porque o fluxo é terminal e vault.

**Próximo passo.** Um spike no `terminal` depois da release v0.1.0: um único cartão (ex.: "resultado de backtest") no catálogo, renderizado no chat. O custo é médio e não há urgência.

## 5. AWS Emulator (aws/aws-emulator)
Fonte: https://github.com/aws/aws-emulator

**O que é.** Um emulador local **oficial da AWS** das APIs AWS: escrito em Rust, gerado a partir dos modelos Smithy, licença CC0, sem custo e sem precisar de conta.
- Cobertura muito ampla: Lambda (com execução Python/Node), S3, DynamoDB, SQS, SNS, Secrets Manager, Step Functions, EventBridge, CloudFormation/CDK, ECS e muitos outros.
- No Windows roda **via Docker**; também tem um modo embutido para testes em Rust.
- Pode ser instalado como skill de agente: `aws agent-toolkit add-skill --skill-name aws-emulator`.
- Pontos de atenção:
  - várias releases por dia, publicadas por bot, com muitas operações ainda stub ou 501;
  - **não aceita PRs**;
  - **telemetria ligada por padrão** (desligar com `EMULATOR_TELEMETRY=off`);
  - "Don't use it … to test security", portanto **não valida IAM nem SCP**.

**Onde encaixa (e por que fica em monitoramento)**
- Hoje o `xend-onchain` quase não usa serviços gerenciados da AWS:
  - o `bff` e o `intelligence-mcp` fazem deploy por **systemd em VM**;
  - os coletores da F1 são **só local/dev, sem AWS** (DEC-2026-11-12-04).
  
  Por isso o ganho imediato é pequeno.
- Fica relevante na **F2**, se a pesquisa de topologia (DEC-2026-11-10-34) puser SQS/S3/Secrets Manager/ECS no caminho. Aí permite que agentes testem `cdk synth/deploy` e integrações **sem tocar na conta real**, o que reforça as travas da skill `aws-xend` (sem chaves IAM, sem mexer em SCP).
- Instalar a skill `aws-emulator` no nível do usuário mexe no conjunto de skills AWS (DEC-2026-11-08-05). Antes, consultar o Registro e decidir.

---

## Por que guardei
Das cinco, duas dão retorno imediato e barato: o artigo da OpenRouter, que aponta para a auditoria do `intelligence-mcp` e das tools do `terminal`, e o Modern Web Guidance, que vira skill de front para `terminal` e `dashboard`. A Decisions API é o candidato mais concreto até agora para o primeiro estágio do roteador. A2UI e AWS Emulator ficam para quando o `terminal` e a F2 do onchain chegarem lá.

## Pendências propostas (aguardam decisão do Vítor)
- [ ] Auditar o `intelligence-mcp`: tamanho dos resultados (defaults de 500 linhas), `fields`, custo das definições com o `mcp_cost.py`
- [ ] Medir o custo das definições das tools `ui_*` do `terminal` por mensagem
- [ ] `legacy-scan` do Modern Web Guidance no `terminal` e no `apps/dashboard` (só leitura)
- [ ] Experimento da Decisions API com o dataset de ativação de skills (exige chave do AI Studio)
- [ ] Spike de A2UI no `terminal` depois da v0.1.0
- [ ] Reavaliar o AWS Emulator quando a spec da F2 definir os serviços AWS

## Trechos / links úteis
- OpenRouter, custo de contexto: https://openrouter.ai/blog/insights/mcp-vs-cli-vs-skills/
- Gemini Decisions API: https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/ · https://aistudio.google.com/docs/decisions-api
- Modern Web Guidance: https://github.com/GoogleChrome/modern-web-guidance
- A2UI: https://a2ui.org/ · https://github.com/a2ui-project/a2ui
- AWS Emulator: https://github.com/aws/aws-emulator
