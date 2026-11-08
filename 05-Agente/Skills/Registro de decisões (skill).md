---
tipo: conceito
status: em-construção
tags: [devagent, conceito, skill, decisões]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Registro de decisões]]", "[[ADR-0003 - Organização da instalação Claude na máquina]]"]
---
# Registro de decisões (skill)

## Definição curta
É a primeira skill própria do Dev Agent. Ela faz o agente **gravar toda decisão** do Vítor no [[Registro de decisões]] (e em ADR, se for estrutural) e **consultá-la sob demanda** antes de agir.
- Fonte: `05-Agente/Skills/registro-de-decisoes/SKILL.md`
- Instalação global: junção `C:\Users\Pedro\.claude\skills\registro-de-decisoes` → pasta-fonte acima. Vale em qualquer projeto.

## Por que importa para o Dev Agent
Pedido explícito do Vítor em 08/11 (DEC-2026-11-08-08). Decisões ficavam espalhadas em conversas, em `CLAUDE.md` de repos e em memórias por projeto, e se perdiam. Uma restrição como "não tocar no xend-baas-api" precisa ser lembrada na próxima sessão, e não só na atual.

## Como aplicar
- **Gravação imediata**, no mesmo turno da decisão, com uma linha no índice.
- **Recuperação sob demanda**, com `grep` por escopo/termo no índice, em vez de carregar tudo em toda sessão. Essa é a parte do "QUANDO necessário".
- O índice é append-only: decisões são substituídas, nunca apagadas.

## Armadilhas
- O gatilho depende da `description` da skill. Se o agente não a acionar, um **hook** pode reforçar (ex.: `UserPromptSubmit` detectando "decidi/pode remover"). Isso fica para a Fase 2 do [[Roadmap]].
- Fora do vault (repos em `Projetos`), o agente só grava se tiver acesso ao vault (`additionalDirectories` global, item do [[Plano - Migração para agentes no terminal]]).
- `SKILL.md` usa o frontmatter do padrão de skills (`name`/`description`), não o do vault. Por isso existe esta nota-companheira.

## Fontes
- [Agent Skills — docs Claude Code](https://docs.claude.com/en/docs/claude-code/skills)
- [[2026-11-08 - Inventário da instalação Claude]]
