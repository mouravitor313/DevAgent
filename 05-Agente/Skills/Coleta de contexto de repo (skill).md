---
tipo: conceito
status: em-construção
tags: [devagent, conceito, skill, stacks, haiku, advisor-strategy]
criado: 2026-11-10
atualizado: 2026-11-10
relacionados: ["[[Stacks]]", "[[2026-11-10 - Teste Haiku x Sonnet na coleta das Stacks]]", "[[Skills de coleta de contexto e Haiku como executor]]", "[[Registro de decisões (skill)]]"]
---
# Coleta de contexto de repo (skill)

## Definição curta
Skill que o Haiku carrega ao coletar contexto de repos para as [[Stacks]] (DEC-2026-11-10-03). Lista os arquivos a ler por nível, impõe um orçamento de leitura, libera a checagem de existência sem leitura e fixa o checklist e o formato do dossiê com `arquivo:linha`.
- Fonte: `05-Agente/Skills/coleta-contexto-repo/SKILL.md` (rascunho v0.1)
- Instalação: junções em `~\.claude\skills\` e `~\.agents\skills\`; subagente `~\.claude\agents\coletor-contexto.md` (DEC-2026-11-10-05). Reteste v0.1: [[2026-11-10 - Skill de coleta para o Haiku]].

## Por que importa para o Dev Agent
O teste de 10/11 mostrou que o Haiku custa de 7% a 34% do Sonnet na coleta ([[Skills de coleta de contexto e Haiku como executor#6 · Preços de lista (USD por 1M tokens)|preços]]), mas tem três falhas: lê volume demais, é literal com regras de escopo e não fecha lacunas baratas. A skill ataca as três. Os pontos fortes (fidelidade das citações e volume de divergências) estão preservados no checklist de divergências.

## Proposta (para aprovação)
### Onde fica
| Peça | Caminho | Por quê |
|---|---|---|
| Fonte da skill | `DevAgent/05-Agente/Skills/coleta-contexto-repo/SKILL.md` | mesmo padrão da `registro-de-decisoes`: versionada no vault |
| Claude Code | junção `~\.claude\skills\coleta-contexto-repo` → fonte | faz a skill valer em qualquer sessão |
| OpenCode/Codex | junção `~\.agents\skills\coleta-contexto-repo` → fonte | o padrão aberto lê `.agents/skills`; frontmatter só com `name`/`description`/`metadata` |
| Subagente | `~\.claude\agents\coletor-contexto.md` | `model`/`effort`/`skills` são do Claude Code e ficam fora da skill para não quebrar a portabilidade |

### Subagente dedicado: sim
Motivo: o campo `skills:` injeta a skill inteira no início, de modo que o Haiku não depende de decidir carregá-la. `model` e `effort` ficam fixos no arquivo (no teste, eram passados à mão). Sem `Bash`, o agente não tem como rodar comandos que escrevam. A escrita fica restrita ao dossiê por instrução.

```markdown
---
name: coletor-contexto
description: Coletor somente leitura de contexto de repositórios (stacks, comandos, regras, divergências) para as notas de Stacks. Use quando o orquestrador pedir um dossiê de repo.
model: haiku
effort: medium
tools: Read, Glob, Grep, Write
skills:
  - coleta-contexto-repo
maxTurns: 40
---
Siga a skill `coleta-contexto-repo` à risca. Você é somente leitura nos repos;
a única escrita permitida é o dossiê no caminho de saída do pedido.
```

### Decisões em aberto para o Vítor
1. **Aprovar a instalação** acima (junções e arquivo do agente fora do vault).
2. **Formato do reteste:** (A) 1 Haiku com os 3 repos, igual ao baseline, que dá comparação limpa; ou (A+B) também 3 Haikus, um por repo. O B tende a gastar menos tokens, porque o contexto acumulado de cada chamada fica menor e o prompt fica abaixo de 100k, a faixa barata do Haiku. Mas o B muda duas variáveis ao mesmo tempo.

## Como aplicar
- O orquestrador (Opus) chama `coletor-contexto` com a lista de repos e o caminho de saída. O resultado alimenta o Sonnet ou o próprio Opus, que preenche as Stacks.
- Orçamento por repo: 20 arquivos, 1.500 linhas, 25 checagens de existência, nenhuma releitura.

## Armadilhas
- **Teto de 1.500 linhas pode ser curto** em repo com `AGENTS.md` longo (o do xend-platform tem 289 linhas). A regra de seções (>150 linhas: índice + grep + seções) existe para isso. Calibrar no reteste.
- `Write` sem restrição de caminho: um erro do modelo poderia escrever no repo. Se acontecer, trocar por "devolver o dossiê no texto" ou adicionar um hook de caminho.
- O Advisor nativo (`/advisor opus`) é herdado pelos subagentes. Não ligar durante o reteste, para não confundir a medição.

## Fontes
- [[Skills de coleta de contexto e Haiku como executor]] (pesquisa completa com links)
- [Agent Skills — best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) · [sub-agents](https://code.claude.com/docs/en/sub-agents) · [agentskills.io](https://agentskills.io/specification)
