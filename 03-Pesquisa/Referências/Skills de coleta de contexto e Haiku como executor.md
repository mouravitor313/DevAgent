---
tipo: referência
status: consolidado
tags: [devagent, referência, skills, subagentes, haiku, advisor-strategy, custo]
criado: 2026-11-10
atualizado: 2026-11-10
fonte: várias (abaixo)
formato: artigo | repo
---
# Skills de coleta de contexto e Haiku como executor

Pesquisa para a DEC-2026-11-10-03: criar uma skill que o Haiku carregue ao coletar contexto de repos para as [[Stacks]], compensando os pontos fracos do [[2026-11-10 - Teste Haiku x Sonnet na coleta das Stacks|teste A/B de 10/11]]. Fluxo de origem: [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]].

## Resumo
- **Não há skill pronta** que faça "coleta econômica de contexto de stack para modelo pequeno". Nem no catálogo local (117 skills), nem no `anthropics/skills`, nem nas listas da comunidade. O mais próximo é o `gsd-codebase-mapper` (GSD) e o modo "map codebase" da `tlc-spec-driven`. **Ninguém define teto numérico de leitura nem exige `arquivo:linha`**: isso fica por nossa conta.
- **Custo fechado:** o token do Haiku 5.5 custa **5% do token do Sonnet 5.5** (prompt ≤100k) ou **25%** (prompt >100k). Com +34% de tokens, o Haiku custou entre **~7% e ~34%** do Sonnet no teste. Bem abaixo do limiar de ~75%. Mas o Haiku **quintuplica o preço acima de 100k tokens de prompt**: o teto de leitura vale dinheiro.
- **Advisor nativo no Claude Code** já existe (experimental): `/advisor opus`. Pode substituir a emulação de 08/11.
- **Subagente com `skills:`** injeta a skill inteira no início. Com `model: haiku` + `effort: medium`, garante que o Haiku use a skill sem depender de ele decidir chamá-la.

## Por que guardei
Base para desenhar a skill `coleta-contexto-repo` e o subagente que a consome (ver [[Coleta de contexto de repo (skill)]]).

## 1 · Skills e agentes parecidos
| Item | Fonte | O que faz | O que aproveitamos |
|---|---|---|---|
| `tlc-spec-driven` (modo map codebase) | local: `~\.agents\skills-avaliacao\tlc-spec-driven\` | gera STACK/ARCHITECTURE/CONVENTIONS/TESTING/CONCERNS | orçamento por amostra ("Sample 5-10 representative files per category", `references\brownfield-mapping.md:22`); teto de tokens por saída (`references\context-limits.md:5-18`); "Extract actual examples, not assumptions" (`:24`) |
| `codebase-to-course-main` | local: `~\.agents\skills-avaliacao\codebase-to-course-main\` | repo → curso HTML | o "brief" com trechos já citados por caminho/linha poupa releitura de quem vem depois (`SKILL.md:120,125`) |
| `gsd-codebase-mapper` | [GSD](https://raw.githubusercontent.com/gsd-build/get-shit-done/main/agents/gsd-codebase-mapper.md) | 7 docs de mapa do repo | "Every finding needs a file path in backticks. No exceptions."; proíbe ler `.env*`/chaves (só registrar existência); retorno curto ao orquestrador (~10 linhas) |
| `codebase-onboarding` | [everything-claude-code](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/codebase-onboarding/SKILL.md) | reconhecimento em 6 checagens → CLAUDE.md inicial | lista explícita de manifests por ecossistema; "Use Glob and Grep, not Read on every file"; "Verify, don't guess"; desconhecido explícito é melhor que chute |
| `repo-onboarding` | [skills.sh](https://www.skills.sh/site/smithery.ai/repo-onboarding) | carrega governança antes de agir | ler `AGENTS.md` primeiro (2 instalações, não auditado) |
| Explore (embutido) | [sub-agents](https://code.claude.com/docs/en/sub-agents) | busca somente leitura, níveis quick/medium/very thorough | começa sem CLAUDE.md para ser barato; um agente nosso chamado `Explore` substitui o embutido e mantém o `model:` |
| `anthropics/skills` | [GitHub](https://github.com/anthropics/skills/tree/main/skills) | 19 skills oficiais | nenhuma de exploração de código; `skill-creator` como referência de formato |
| Listas awesome | [travisvn](https://github.com/travisvn/awesome-claude-skills) (15,8k ★, não auditado) · [ComposioHQ](https://github.com/ComposioHQ/awesome-claude-skills) · [VoltAgent](https://github.com/VoltAgent/awesome-claude-code-subagents) (26,5k ★, não auditado) · [wshobson/agents](https://github.com/wshobson/agents) (42,4k ★, não auditado) | — | nada de onboarding de repo além do GSD; `context-manager` (VoltAgent) só tangencial |

Catálogo local: `~\.agents\skills-avaliacao\_catalogo.json` tem 138 entradas / 117 skills únicas (campos `skill`, `dir`, `hash`, `origins`, `description`). Não verificados: `onboard` do Continuous-Claude-v3, `codebase-onboarding` do my-codex, "Codebase Orientation" (só vistos em agregadores).

## 2 · Autoria de skills (Anthropic e padrão aberto)
Fontes: [best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) · [overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [agentskills.io](https://agentskills.io/specification) · [skills no Claude Code](https://code.claude.com/docs/en/skills)
- `name`: ≤64 caracteres, minúsculas/números/hífen, sem `anthropic`/`claude`, **igual ao nome da pasta** (agentskills.io), sem hífen no início/fim nem `--`. `description`: ≤1.024 caracteres, **terceira pessoa**, diz o que faz e quando usar.
- Corpo do `SKILL.md` **<500 linhas e <5k tokens**; o resto em arquivos referenciados **a um nível** (em cadeias aninhadas o modelo pode ler só `head -100`). Arquivo de referência >100 linhas leva sumário no topo.
- Graus de liberdade: ponte estreita (passos exatos) quando a operação é frágil, campo aberto quando há várias abordagens válidas. **Para o Haiku: ponte estreita.**
- "What works perfectly for Opus might need more detail for Haiku." Testar com Haiku, Sonnet e Opus; **criar as avaliações antes da skill** (nosso baseline de 10/11 cumpre esse papel).
- Workflows: checklist que o modelo copia e marca; ciclo validar → corrigir → repetir.
- **Portabilidade:** fora do Claude Code só valem `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` (experimental). Chaves próprias do Claude Code (`model`, `effort`, `context`, `paths`…) quebram em outros clientes. Conclusão: **skill só com campos do padrão aberto; modelo e esforço ficam no subagente**.
- No Claude Code, o corpo da skill carregada fica no contexto em todos os turnos seguintes (custo recorrente): mais um motivo para ser curta.

## 3 · Subagentes no Claude Code
Fonte: [sub-agents](https://code.claude.com/docs/en/sub-agents)
- Obrigatórios: `name`, `description`. Úteis aqui: `tools`, `model` (`haiku`), `effort` (`medium`), `skills` (injeta o conteúdo completo, até 32), `maxTurns` (saída marcada parcial ao atingir), `permissionMode`.
- `skills:` só pré-carrega; para impedir outras skills, tirar `Skill` de `tools`.
- Locais: `~/.claude/agents/` (pessoal) e `.claude/agents/` (projeto).

## 4 · Prompting para o Haiku 5.5
Fontes: [prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [prompting Haiku 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-haiku-5-5)
- Instruções claras e diretas, **com o porquê**; 3–5 exemplos em `<example>`; XML para separar partes.
- `effort: medium` é o padrão; `low` aumenta a chance de **pular busca e verificação** e parar cedo. Subir `low` → `medium` reduziu a parada precoce à metade, mas mais que dobrou a saída. Para coleta, `medium`.
- Pedir resposta direta não desliga o raciocínio; quem controla é o `effort`.

## 5 · Advisor e "forte planeja, barato executa"
Fontes: [advisor no Claude Code](https://code.claude.com/docs/en/advisor) · [[2026-11-09 - Radar Dev & IA]] (achado 2)
- Ferramenta de servidor, experimental, **só na Anthropic API**. Liga com `/advisor <modelo>`, setting `"advisorModel"` ou `claude --advisor opus`; desliga com `/advisor off`.
- Quem decide quando consultar é o executor (tende a: antes de escolher abordagem, em erro repetido, antes de concluir). Sem setting para forçar; dá para pedir no prompt.
- Haiku 5.5 como principal aceita Opus/Sonnet/Fable como advisor (exige v2.1.293+). **Subagentes herdam o advisor.**
- Custo: tokens do advisor à tarifa dele; a leitura da conversa pelo advisor não usa cache. "Haiku + Opus advisor" é mais caro que Haiku sozinho e mais barato que trocar o principal.
- Radar de 09/11: `effort: medium` nos agentes e "modelo forte planeja, barato executa" (subagente `executor` com `model: haiku`); relato de US$ 80 → US$ 20 por PR (não auditado).

## 6 · Preços de lista (USD por 1M tokens)
Fonte: [pricing](https://platform.claude.com/docs/en/about-claude/pricing), conferida em 2026-11-10.

| Modelo | Input | Leitura de cache | Output |
|---|---|---|---|
| Opus 5.5 | 4 | 0,20 | 20 |
| Sonnet 5.5 | 2 | 0,10 | 10 |
| Haiku 5.5 (prompt ≤100k) | 0,10 | 0,01 | 0,50 |
| Haiku 5.5 (prompt >100k) | 0,50 | 0,05 | 2,50 |

**Conta do teste de 10/11** (aproximada: sem a divisão input/output/cache): custo Haiku ÷ Sonnet = 1,34 × 0,05 ≈ **6,7%** (≤100k) a 1,34 × 0,25 ≈ **33,5%** (>100k). O Sonnet saiu de 3× a 15× mais caro. No plano de time (DEC-2026-11-08-24) o que pesa é a cota, mas a proporção de preço é a melhor aproximação disponível.

## Trechos / links úteis
- Lacunas que nenhuma fonte cobre e a skill precisa cobrir: lista de arquivos **por nível** (com `AGENTS.md`/`CLAUDE.md` de cada app), teto de leitura numérico, checagem de existência sem ler, `arquivo:linha` obrigatório.
- Ideia estrutural: **um subagente por repo** reduz o contexto acumulado de cada chamada e mantém o prompt do Haiku abaixo de 100k (faixa barata). Muda o desenho do teste; ver proposta.
