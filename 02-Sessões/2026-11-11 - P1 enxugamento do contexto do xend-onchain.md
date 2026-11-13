---
tipo: sessão
status: consolidado
tags: [devagent, sessão, contexto, skills]
criado: 2026-11-11
atualizado: 2026-11-11
participantes: [Vítor]
ferramenta: Claude Code
---
# 2026-11-11 — P1: enxugamento do contexto do xend-onchain

## Objetivo da sessão
Iniciar a Prioridade 1 do [[Roadmap]]: enxugar `AGENTS.md`/`CLAUDE.md` para o que todo agente precisa sempre, movendo o resto para skills ([[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]).

## O que foi feito
- Medição: global (16 linhas) e portfólio (27) já estão no alvo; 8 dos 10 repos têm 9–22 linhas. Excessos: `xend-platform` (AGENTS 289 + CLAUDE 65) e `xend-onchain` (CLAUDE 89, divergente do AGENTS de 13).
- `xend-onchain`: bloco "AWS Agent Toolkit rules" (75 linhas) movido, sem alterar o texto, para a skill de usuário `aws-xend` (`~\.agents\skills\aws-xend\`, junção em `~\.claude\skills\`). `CLAUDE.md` 89 → 1 linha (`@AGENTS.md`); `AGENTS.md` 13 → 15 linhas, com linha-índice para a skill (DEC-2026-11-11-03). Nada commitado; as alterações do `/sdd-phase` já estavam no working tree.

## Teste de ativação da `aws-xend`
Mesmo método de [[2026-11-11 - Teste de ativação de skills]] (Sonnet 5.5, `claude -p` limpo por prompt, config isolada só com a `aws-xend`, sem `CLAUDE.md` global). 20 prompts: 6 explícitos, 8 implícitos, 6 negativos.

| braço | explícito | implícito | falso positivo | custo |
|---|---|---|---|---|
| baseline (sem linha-índice) | 6/6 | 7/8 | 0/6 | US$ 2,64 |
| V2 (com linha-índice) | 6/6 | 8/8 | 0/6 | US$ 2,66 |

Com índice: 14/14 positivos e 0 falsos positivos. O único implícito que falhou no baseline foi A14 ("ainda tem coisa rodando na nuvem?"): o agente foi para os MCPs de Supabase/Vercel.

**Limitações:** a `description` da `aws-xend` já é cheia de termos AWS e meus prompts "implícitos" citam região, CLI, RDS e SCP, o que facilita; por isso o baseline ficou bem acima dos 25% de ontem. Só havia 1 skill disponível (sem competição das ~280 de plugins). N=20, uma execução por prompt. O teste não mostra ganho claro do índice aqui: confirma que ele não atrapalha e cobre o caso vago (A14). Dados em `05-Agente/Avaliação/Ativação aws-xend 2026-11-11/`.

## Decisões
- DEC-2026-11-11-04: escopo da P1 só no `xend-onchain`; `xend-platform` abandonado, será apagado pelo Vítor.

## Aprendizados
- O bloco AWS é marcado `BEGIN/END AWS Agent Toolkit rules`: o toolkit pode reinjetá-lo no `CLAUDE.md`. Se voltar, é preciso desligar a injeção, não só apagar.

## Próximos passos
- [x] Testar a ativação da `aws-xend` — feito, ver acima.
- [ ] Repetir o teste com o índice completo de skills (plugins ligados) e prompts menos óbvios (ver Limitações).
- [ ] Decidir sobre as duas regras de `.specs/` no `AGENTS.md` do onchain: item próprio no [[Roadmap]], a avaliar junto com a P2 (tasks em GitHub Issues).
- [ ] Commit/PR das mudanças do onchain, quando o Vítor pedir.

## Arquivos criados/alterados
- `~\.agents\skills\aws-xend\SKILL.md` (novo) + junção `~\.claude\skills\aws-xend`
- `05-Agente/Avaliação/Ativação aws-xend 2026-11-11/` (novo)
- `Projetos\xend-onchain\AGENTS.md`, `CLAUDE.md`
- [[Registro de decisões]], [[Roadmap]]
