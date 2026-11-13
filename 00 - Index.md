---
tipo: index
tags: [devagent, moc]
criado: 2026-11-08
atualizado: 2026-11-13
---
# Dev Agent — Index

Ponto de entrada do projeto **Estudos Dev Agent**. Regras do vault: [[AGENTS.md]].

## Projeto
- [[Kickoff]] · [[Roadmap]]
- Decisões: [[ADR-0001 - Vault como memória do projeto]] · [[ADR-0002 - Claude Code CLI como ambiente principal]] (proposta) · [[ADR-0003 - Organização da instalação Claude na máquina]] · [[ADR-0004 - Stacks agnósticas e seção de Stacks modular]] · [[ADR-0005 - Arquitetura-alvo do Market Making BRL]] (xend-onchain) · [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]] · [[ADR-0007 - Spec versionada e estado no GitHub]]
- **[[Registro de decisões]]** — índice de todas as decisões (consultar antes de agir)
- Agente: **[[Stacks]]** (contexto, skills, docs, MCPs e plugins por stack · [[Tarefas transversais]]) · skill [[Registro de decisões (skill)]] · catálogo de skills candidatas em `C:\Users\Pedro\.agents\skills-avaliacao\` ([[Avaliação do catálogo skills-avaliacao]])
- Planos: [[Plano - Migração para agentes no terminal]] · [[Inventário - Instalação Claude na máquina]]

## Fluxo das notas
```
00-Inbox  →  03-Pesquisa (Radar, Papers, Referências)  →  04-Conhecimento  →  05-Agente
   ↑                                                          ↑
02-Sessões (registro de cada conversa) ─────────────────────────┘
01-Projeto/Decisões (ADRs) registram as escolhas
```

## Pastas
| Pasta | Para quê |
|---|---|
| `00-Inbox/` | Captura rápida |
| `01-Projeto/` | Kickoff, roadmap, decisões |
| `02-Sessões/` | Registro de conversas |
| `03-Pesquisa/` | Radar, papers, referências |
| `04-Conhecimento/` | Conceitos consolidados |
| `05-Agente/` | Arquitetura, specs, skills, prompts, avaliação |
| `90-Templates/` | Templates |
| `99-Arquivo/` | Obsoletos |

## Conhecimento
- [[Roteamento de LLMs]]
- [[Filosofia do setup de agentes]]
- [[Uma Breve Introdução ao Desenvolvimento com LLMs]]

## Pesquisa recente
- [[2026-11-13 - Radar Dev & IA]] · [[2026-11-12 - Radar Dev & IA]] · [[2026-11-11 - Radar Dev & IA]] · [[2026-11-10 - Radar Dev & IA]] · [[2026-11-09 - Radar Dev & IA]]
- Papers: [[LLMRouter (paper)]] · [[LLMRouterBench (paper)]] · [[TwinRouterBench (paper)]] · [[Agent-as-a-Router (paper)]] · [[SWE-Router (paper)]]
- Referências: [[SDD para agentes e integração com GitHub Issues]] · [[Subagents, agent teams e cross-session messaging]] · [[Web3 and DeFi Research Agent]] · [[Ferramentas de organização e templates - ranking]]

## Sessões
- [[2026-11-08 - Kickoff do vault DevAgent]]
- [[2026-11-08 - Ranking de ferramentas e plano de migração para o terminal]]
- [[2026-11-08 - Inventário da instalação Claude]]
- [[2026-11-10 - Check de realidade do MM BRL contra o PDF]]

## Notas a ler / em construção (requer o plugin Bases ou Dataview para listas automáticas)
- Busque no Obsidian por `status: a-ler` ou `status: em-construção`.
