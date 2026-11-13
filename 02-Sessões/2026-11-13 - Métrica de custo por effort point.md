---
tipo: sessão
status: consolidado
tags: [devagent, sessão, custo, métrica, effort-point]
criado: 2026-11-13
atualizado: 2026-11-13
participantes: [Vítor]
ferramenta: Claude Code (Opus 5.5)
---
# 2026-11-13 - Métrica de custo por effort point

## Objetivo da sessão
Implementar no setup a métrica "effort point" do incident.io, vista em [[2026-11-12 - Radar Dev & IA]], para acompanhar o custo e a sua evolução.

## O que foi feito
- Levantamento: os transcripts locais do Claude Code (`~/.claude/projects`) trazem o `usage` de cada resposta (input, output, cache write 5m/1h, cache read, modelo). O `gh` conta os PRs mergeados por autor.
- Script `05-Agente/Avaliação/scripts/effort-points.js`: calcula o custo equivalente de API por repo e por modelo, conta os PRs mergeados do Vítor no período e grava uma linha semanal com `--append`.
- Nota [[Custo por effort point]]: definição, método, armadilhas, linha de base e histórico.
- Linha de base, 30 dias (14/10 a 13/11): US$ 1.766 de custo equivalente, 73 PRs, **US$ 19 por effort point**; 22% do custo sem PR. Primeira semana (06/11 a 12/11): **US$ 12 por effort point**, 33 PRs.

## Decisões
- DEC-2026-11-13-01: 1 effort point = 1 PR mergeado do Vítor; o custo é o custo equivalente de API; o trabalho sem PR fica separado.
- DEC-2026-11-13-02: script no vault + nota semanal com histórico.
- DEC-2026-11-13-03: execução por tarefa agendada local no Windows.

## Aprendizados
- O Fable (5 e 5.1) foi 30% do custo nos 30 dias e caiu para 8% na última semana. É a alavanca mais visível.
- O cache read domina o volume de tokens, mas não o custo. O custo vem sobretudo de cache write e output.
- A diferença entre protótipo e script (US$ 1.999 → 1.766) veio de separar o cache write de 5 min do de 1 h. O preço exato importa.

## Próximos passos
- [x] Execução semanal agendada no Windows (DEC-2026-11-13-03): segundas às 09:00, testada com código de saída 0.
- [ ] Se a métrica se mostrar útil, pensar em como incluir a equipe (hoje só cobre a máquina do Vítor).

## Arquivos criados/alterados
- `05-Agente/Avaliação/scripts/effort-points.js` (novo)
- `05-Agente/Avaliação/Custo por effort point.md` (novo)
- `01-Projeto/Decisões/Registro de decisões.md` (DEC-2026-11-13-01/02)
- `01-Projeto/Roadmap.md` (Fase 4 e Próximos passos)
