---
tipo: sessão
status: consolidado
tags: [devagent, sessão, claude-code, inventário]
criado: 2026-11-08
atualizado: 2026-11-08
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# 2026-11-08 — Inventário da instalação Claude

## Objetivo da sessão
Organizar a instalação do Claude Code na máquina, no nível global e por projeto. Primeiro passo: escanear cada sub-instalação, propor o que sai e o que fica, e inventariar cada projeto. É o início da centralização do Dev Agent.

## O que foi feito
- Scan somente leitura de `~\.claude\`, `~\.claude.json`, plugins, skills, MCP e das 25 pastas de sessão.
- Scan das 65 pastas em `C:\Users\Pedro\Projetos`: git, remote, branch, arquivos sujos, `CLAUDE.md`/`AGENTS.md`, conteúdo e tamanho do `.claude\`.
- Worktrees cruzados com o estado dos PRs no GitHub (`gh pr list`) e com a contagem de commits só locais.
- Resultado completo em [[Inventário - Instalação Claude na máquina]].

## Decisões
- Nenhuma tomada ainda. Seis decisões pendentes estão listadas no §4 do inventário.

## Aprendizados
- Os repos ficam em `Projetos` (não `Projects`). Só 17 dos 65 diretórios são repos; o resto são worktrees criados pelos agentes, que se acumulam sem limpeza. **Lição para o harness:** limpar worktrees ao mergear o PR.
- Um kit de terceiros (ECC) foi colado como `.claude\` inteiro, trazendo histórico e transcrições de outra máquina, inclusive versionados no git. **Lição:** instalar harness por cópia de pasta é perigoso; o `.claude\` precisa ter um gitignore explícito para dados de runtime.
- `.mcp.json` dentro de `.claude\` não é lido pelo Claude Code; o lugar é a raiz do repo.

## Próximos passos
- [ ] Vítor decide os 6 pontos do §4 do inventário
- [ ] Remover worktrees mergeados (após conferir os arquivos sujos)
- [ ] Limpar o ECC: local nos repos gitignored, PR no baas-api e no RFQ-PORTAL
- [ ] Mover `autoMode.environment` do settings global para cada projeto
- [ ] Criar `~\.claude\CLAUDE.md` global

## Arquivos criados/alterados
- Criado: `01-Projeto/Inventário - Instalação Claude na máquina.md`
- Criado: esta nota
- Alterados: [[00 - Index]], [[Roadmap]], [[Plano - Migração para agentes no terminal]] (links e caminho `Projetos`)

---
## Parte 2 — Decisões e execução
- O Vítor respondeu ao §4 do inventário → [[ADR-0003 - Organização da instalação Claude na máquina]]. Cada decisão também está no [[Registro de decisões]] (DEC-2026-11-08-01 a 08).
- Execução detalhada no §5 do [[Inventário - Instalação Claude na máquina]]:
  - 12 worktrees removidos
  - kit ECC e commands removidos de 7 repos
  - 117 skills guardadas para avaliação
  - trading movido para o `arb`
- **Skill criada:** `registro-de-decisoes` ([[Registro de decisões (skill)]]), com fonte no vault e junção global em `~\.claude\skills`. **Validada na prática:** a sessão paralela no xend-baas-api já gravou as DEC-09 a DEC-13 sozinha.
- Regra nova no `AGENTS.md`: registrar decisões no mesmo turno e consultar antes de agir.
- **Incidente:** o job de backup/remoção foi morto pelo sistema por memória baixa. Ficou pendente só o `xend-onchain-binance-venue` (intacto). Não foi reiniciado.

### Próximos passos (parte 2)
- [ ] Remover o kit do `xend-onchain-binance-venue` (quando houver memória livre)
- [ ] Commitar/abrir PR: deleções do kit no RFQ-PORTAL e no dashboard_xend; regra `/sdd-phase` nos repos
- [ ] Limpeza do xend-baas-api quando as sessões encerrarem
- [ ] Avaliar `~\.agents\skills-avaliacao\`
