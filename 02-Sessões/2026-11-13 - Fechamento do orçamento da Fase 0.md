---
tipo: sessão
status: consolidado
tags: [devagent, sessão, orçamento, fase-0]
criado: 2026-11-13
atualizado: 2026-11-13
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# 2026-11-13 - Fechamento do orçamento da Fase 0

## Objetivo da sessão
Listar o que faltava para fechar as duas últimas tasks da Fase 0 do [[Roadmap]] e fechar a que dependia só de decisão: o orçamento do [[Kickoff]].

## O que foi feito
- Levantamento das duas tasks abertas: **orçamento** e **migração para o Claude Code CLI** ([[ADR-0002 - Claude Code CLI como ambiente principal]] · [[Plano - Migração para agentes no terminal]]).
- Orçamento fechado pelo Vítor e registrado; Kickoff e Roadmap atualizados.
- Migração adiada por pedido do Vítor.

## Decisões
- **DEC-2026-11-13-04:** teto de ~R$ 2.000/mês para a equipe toda; meta de reduzir **55% a 60%** (→ ~R$ 800–900/mês), sem deadline; cobre licenças e API. Substitui a DEC-2026-11-08-23.
- **DEC-2026-11-13-05:** medir os effort points antes de cancelar qualquer assinatura cara; depois manter 1 Claude premium + outras assinaturas mais baratas.
- **DEC-2026-11-13-06:** a migração para o CLI fica para outra sessão.

## Aprendizados
- A meta de custo depende de [[Custo por effort point]], que hoje só cobre a máquina do Vítor e mede custo-sombra de API. A fatura real do time (licenças) ainda não está no vault.

## Próximos passos
- [ ] Definir quantas semanas de effort points bastam como série antes de cortar.
- [ ] Levantar a lista de assinaturas (custo, uso, quem usa) para escolher o que cancelar.
- [ ] Retomar a migração para o CLI (itens pendentes anotados no Roadmap).

## Arquivos criados/alterados
- `01-Projeto/Decisões/Registro de decisões.md` (DEC-04/05/06; DEC-2026-11-08-23 marcada como substituída)
- `01-Projeto/Kickoff.md` · `01-Projeto/Roadmap.md` · `00 - Index.md` (só o `atualizado:`)
