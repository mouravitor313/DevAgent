---
tipo: sessão
status: consolidado
tags: [devagent, sessão, git, agentes]
criado: 2026-11-12
atualizado: 2026-11-12
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# Push e PR ao executar issue

## Objetivo da sessão
Fazer os agentes que executam issues abertas irem até o push e o PR e esperarem a revisão, em vez de pararem antes do push (problema visto no F0 do `xend-onchain`).

## O que foi feito
- Encontrada a causa: a regra global "Não fazer push, nem abrir ou mergear PR, sem pedido explícito" em `Projetos\AGENTS.md`.
- Regra trocada por: **executando uma issue** → branch própria; quando os critérios de aceite passarem, push + PR com `Closes #N`, e parar para revisão. Fora de issue, push/PR seguem exigindo pedido; merge e push na branch padrão, sempre.

## Decisões
- DEC-2026-11-12-01 em [[Registro de decisões]]. Sem ADR: ajusta uma regra de Git e não muda a estrutura.

## Aprendizados
- Regra global restritiva sobrepõe o fluxo "uma issue = um agente = uma branch = um PR" ([[ADR-0007 - Spec versionada e estado no GitHub]]). Ao definir um fluxo novo, revisar as restrições globais que o contradizem.

## Próximos passos
- [ ] (Opcional) Seção "Entrega" no template `agent-task` do `xend-onchain` (exige PR).

## Arquivos criados/alterados
- `C:\Users\Pedro\Projetos\AGENTS.md` (seção Git)
- `01-Projeto/Decisões/Registro de decisões.md`
