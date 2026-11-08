---
tipo: referência
status: em-construção
tags: [devagent, referência, harness, sdd, context-engineering, ranking]
criado: 2026-11-08
atualizado: 2026-11-08
fonte: "[[2026-11-08 - Radar Dev & IA (Ciclo 1)]]"
formato: repo
---
# Ferramentas de organização e templates — ranking

Avaliação das ferramentas listadas no [[2026-11-08 - Radar Dev & IA (Ciclo 1)]] (seções "Organização / Second Brain" e "Starter kits"), tomando o **Project-of-Projects (PoP)** como base. Estrelas medidas em 08/11/2026. Números de desempenho citados nos READMEs são dos próprios autores (**não auditado**).

> Ideia central: as ferramentas atuam em **camadas** diferentes. O risco maior é instalar duas que fazem o mesmo papel (ex.: dois sistemas de tarefas).

## O que é o PoP
Vault Obsidian (Apache-2.0) que funciona como segundo cérebro + harness de agentes. Guarda planejamento, acompanhamento e harness; **não** guarda o código dos projetos — agrega os repositórios reais em volta.
- **Anatomia por projeto:** `PROJECT.md`, roadmap (épocas → fases → tarefas), specs, memória e kanban de 5 estágios com aprovação humana em **003** (plano) e **005** (o merge do PR é a verificação).
- **6 papéis de agente:** planner, recon, execution-orchestrator, executor, judge-dredd, phase-verifier. Projeções prontas para Claude Code, Codex, Kimi e OpenCode, com política de modelo por papel (Planner/Judge = Opus; executores = Sonnet) → já é **roteamento por papel**, ligado a [[Roteamento de LLMs]].
- **Scripts** Python sem dependências (status, validate, move, worktree, check_scope) + instalador de harness versionado em outros repositórios (`pop_install_unirepo.py`).
- 4 modos de uso: fork para um projeto multi-repo; clone como instalador de harness; fork para projetos sem repo; "cérebro de processo" de um orquestrador.

## Ranking (encaixe na nossa implementação)

| # | Ferramenta | Camada | ⭐ | O que acrescenta ao PoP | Sobreposição / risco | Veredito |
|---|---|---|---|---|---|---|
| 1 | **PoP** | Processo + portfólio | — | Base: kanban, aprovações humanas, papéis, memória | Projeto pequeno, um autor | **Adotar como base** |
| 2 | **repomix** | Utilitário de contexto | 29k | Empacota o repo num arquivo, contagem de tokens, `--compress` (Tree-sitter), Secretlint | Nenhuma | **Adotar já** (ganho rápido) |
| 3 | **Agent-Skills-for-Context-Engineering** | Conhecimento | 18k | Skills de memória, multi-agente, filesystem-context, compressão, avaliação; citado em papers | Material de estudo, não ferramenta | **Estudar e aproveitar partes** |
| 4 | **planning-with-files** | Memória da execução | 27,7k | `task_plan / findings / progress` em disco + hook a cada turno; sobrevive a `/clear` | Hooks podem conflitar com os do PoP | **Adotar o padrão** no estágio 004 |
| 5 | **AlexPEClub/ai-coding-starter-kit** | Template de app | 382 | Next 16 + **Supabase + Vercel**; skills `/architecture /frontend /backend /qa /deploy`; regras por arquivo | Fluxo próprio (`features/INDEX.md`) duplica o kanban | **Template do 1º app**, sem o fluxo dele |
| 6 | **github/spec-kit** | Processo (SDD) | 146k | v1.0 madura: constitution, `specify→plan→tasks→implement→converge`, extensões bug/assess | **Alta** com a etapa 002 e specs do PoP | **Aproveitar ideias/templates**, não instalar o fluxo |
| 7 | **leonvanzyl/agentic-coding-starter-kit** | Template de app | 434 | Next 16, Better Auth, Drizzle, **AI SDK + OpenRouter**, specs em ondas | Sem Supabase; fluxo próprio | Alternativa se o app precisar de IA/troca de modelo |
| 8 | **claude-task-master** | Tarefas (PRD→tasks) | 28k | Quebra PRD em tarefas com dependências via MCP | **Duplica** roadmap/kanban (`tasks.json`); exige chaves de API | **Não adotar** |

- **Go:** criar skill interna em `.agents/skills/` (ao lado de `clean-code-change/review` do PoP), via skill-creator. Não verifiquei se existe skill madura de Go.
- **Dados:** skill xlsx + repomix. O repomix também serve no recon do `import-project` e para mandar contexto compacto a modelos baratos.

## Como as peças se encaixam
```
PoP (portfólio, kanban, aprovações, papéis)
 ├─ 002 planning  ← templates inspirados no spec-kit (constitution, checklists)
 ├─ 004 execução  ← padrão planning-with-files para tarefas longas
 ├─ recon/import  ← repomix
 ├─ skills        ← Context-Engineering (referência) + skill Go interna
 └─ apps          ← AlexPEClub (Vercel + Supabase) como esqueleto
```

## Próximos passos sugeridos
- [ ] Testar o PoP num clone separado e rodar `import-project` num repo real (ex.: dashboard OTC).
- [ ] Colocar o repomix no recon.
- [ ] Piloto do planning-with-files numa tarefa longa; checar convivência dos hooks.
- [ ] ADR: "spec-kit — aproveitar ideias, não instalar o fluxo".
- [ ] Skill Go interna.

## Links
- [gabesan21/project-of-projects](https://github.com/gabesan21/project-of-projects)
- [github/spec-kit](https://github.com/github/spec-kit)
- [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)
- [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering)
- [yamadashy/repomix](https://github.com/yamadashy/repomix)
- [leonvanzyl/agentic-coding-starter-kit](https://github.com/leonvanzyl/agentic-coding-starter-kit)
- [AlexPEClub/ai-coding-starter-kit](https://github.com/AlexPEClub/ai-coding-starter-kit)
- Relacionado: [[Plano - Migração para agentes no terminal]] · [[Roadmap]]
