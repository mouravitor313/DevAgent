---
tipo: projeto
status: em-construção
tags: [devagent, claude-code, terminal, organização]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[ADR-0002 - Claude Code CLI como ambiente principal]]", "[[Ferramentas de organização e templates - ranking]]"]
---
# Plano — Migração para agentes no terminal

Executa o [[ADR-0002 - Claude Code CLI como ambiente principal]]. Objetivo: trabalhar com **agentes no terminal** (Claude Code primeiro, sem ficar preso a ele — Codex, OpenCode, Kimi devem funcionar com os mesmos arquivos).

## Princípios
1. **Cérebro ≠ código.** O vault guarda planejamento, decisões e memória; os repositórios guardam código. Um não vai dentro do outro (mesma ideia do PoP).
2. **`AGENTS.md` é a fonte da verdade** (lido por Codex/OpenCode). `CLAUDE.md` só contém `@AGENTS.md` + o que for específico do Claude.
3. **Três níveis de regras**, do geral ao específico — o Claude Code lê `CLAUDE.md` da pasta onde abre **e de todas as pastas acima dela** ([docs](https://docs.claude.com/en/docs/claude-code/memory)):
   - **Global** `C:\Users\Pedro\.claude\CLAUDE.md` → vale em qualquer pasta: quem sou, idioma, preferências, onde fica o vault.
   - **Portfólio** `C:\Users\Pedro\Projetos\CLAUDE.md` → vale para todo repo dentro de `Projetos\`: convenções comuns (git, commits, stack).
   - **Projeto** `<repo>\AGENTS.md` (+ `CLAUDE.md` → `@AGENTS.md`) → comandos, arquitetura, regras do repo.

## Estrutura alvo da máquina
```
C:\Users\Pedro\
├── .claude\
│   ├── CLAUDE.md          ← regras globais (curto)
│   ├── settings.json      ← permissões + additionalDirectories (vault)
│   └── skills\            ← skills pessoais usadas em qualquer projeto
├── Documents\vitorvalt\    ← VAULT (cérebro) — com git
│   ├── DevAgent\          ← AGENTS.md / CLAUDE.md do projeto Dev Agent
│   ├── OnChain\  Câmbio\  ← pessoais (fora do escopo dos agentes)
└── Projetos\              ← CÓDIGO
    ├── AGENTS.md + CLAUDE.md   ← regras comuns a todos os repos
    ├── xend-otc-dashboard\     ← cada repo: AGENTS.md, CLAUDE.md, .claude\
    └── ...
```
- Verificar se `Documents\` está sincronizado pelo **OneDrive**: sincronização + git + agentes editando ao mesmo tempo costuma gerar conflitos. Se estiver, considerar mover o vault para `C:\Users\Pedro\vitorvalt`.
- Skills agnósticas: fonte em `.agents\skills\`, ligada a `.claude\skills\` por junção do Windows (`mklink /J .claude\skills .agents\skills`), como faz o PoP.

## De onde iniciar
| Trabalho                                         | Abrir o terminal em  | Acesso extra                                            |
| ------------------------------------------------ | -------------------- | ------------------------------------------------------- |
| Pensar, planejar, pesquisar, organizar o cérebro | `vitorvalt\DevAgent` | `--add-dir` do repo se precisar ler código              |
| Programar num projeto                            | `Projetos\<repo>`    | vault via `additionalDirectories` global ou `--add-dir` |
| Reorganizar a máquina (1ª sessão)                | `vitorvalt\DevAgent` | `--add-dir C:\Users\Pedro\Projetos`                     |

## Checklist de execução
- [x] **Git no vault antes de tudo** (`git init` + commit inicial) → toda mudança do agente fica reversível.
- [x] Instalar Claude Code no Windows (PowerShell) e checar com `claude doctor`.
- [x] Criar `~\.claude\CLAUDE.md` global (curto) e `settings.json` com o vault em `additionalDirectories`.
  - 2026-11-08: `additionalDirectories` aponta só para `vitorvalt\DevAgent` (não o vault inteiro). O `autoMode` do global não foi mexido (DEC-2026-11-08-07). Backup: `arquivo-claude\2026-11-08\settings.json.antes-hooks`.
- [x] Verificar OneDrive: `Documents` **não** é redirecionado (`MyDocuments` = `C:\Users\Pedro\Documents`), então o vault fica onde está.
- [x] Inventariar `C:\Users\Pedro\Projetos` (o que é repo, o que é lixo, o que vira projeto do vault).
  - 2026-11-08: scan feito → [[Inventário - Instalação Claude na máquina]]. Os repos ficam em **`C:\Users\Pedro\Projetos`**, não em `Projects`. Decisões em [[ADR-0003 - Organização da instalação Claude na máquina]]; limpeza executada (exceto xend-baas-api, DEC-2026-11-08-07).
- [x] Criar `Projetos\AGENTS.md` + `CLAUDE.md` comuns.
  - 2026-11-08: regras comuns tiradas dos `AGENTS.md` dos repos (`# noqa`, checar commits/PRs, `/compact`) + git e prod. ⚠️ Codex/OpenCode só leem `AGENTS.md` da raiz do repo para baixo, então este arquivo vale só para o Claude. Validar no teste com o 2º agente.
- [ ] Em cada repo ativo: `/init` → revisar → mover o conteúdo para `AGENTS.md`, deixar `CLAUDE.md` = `@AGENTS.md`.
- [x] Ajustar `DevAgent\CLAUDE.md` para o fluxo CLI (ler Index + Roadmap ao iniciar; nota de sessão ao final).
- [x] Hooks: lembrete de nota de sessão; bloquear escrita fora de `DevAgent\` no vault.
  - 2026-11-08: **global** `PreToolUse` → `~\.claude\hooks\vault-guard.js` (nega Write/Edit/NotebookEdit no vault fora de `DevAgent\`; testado ao vivo). Não cobre escrita via Bash. **Projeto** `Stop` → `DevAgent\.claude\hooks\session-note-reminder.js` (se há mudanças no DevAgent e nenhuma nota `02-Sessões/<hoje>*`, pede a nota uma vez).
- [ ] Decidir rotina do Radar: fica no Cowork ou migra (Claude Code headless + Agendador do Windows).
- [ ] Testar o mesmo repo com um segundo agente (Codex ou OpenCode) para validar o `AGENTS.md` agnóstico.
- [ ] Depois: piloto do PoP como instalador de harness (ver [[Ferramentas de organização e templates - ranking]]).
