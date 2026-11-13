---
tipo: sessão
status: consolidado
tags: [devagent, sessão, limpeza, plugins]
criado: 2026-11-10
atualizado: 2026-11-10
participantes: [Vítor]
ferramenta: Claude Code
---
# Limpeza de plugins órfãos do hedglobal

## Objetivo da sessão
Ranquear os "Próximos passos (curto prazo)" do [[Roadmap]] pelo custo e executar os mais baratos, na ordem de [[2026-11-09 - Ordem dos próximos passos]].

## O que foi feito
- Ranking dos 12 itens abertos por custo estimado (esforço e tokens), do mais barato ao mais caro.
- Item 1 (apagar as pastas vazias `Desenvolvimento/` e `LLM/` na raiz do vault): o Vítor executou por conta própria.
- Item 2 (plugins órfãos do `hedglobal-plataform` e cache do `claude-mem`):
  - Consultei o Registro de decisões. Não há decisão específica sobre esses plugins. A DEC-2026-11-08-03 (remover o kit ECC) cobre a origem deles.
  - Confirmei que o repo não habilita mais nenhum plugin (`.claude/` só tem `settings.local.json`).
  - Desinstalei 8 plugins com `claude plugin uninstall --scope project --keep-data`: `claude-mem`, `anthropic-essentials`, `anthropic-plugin-dev`, `github-dev`, `ultralytics-dev`, `reflexion`, `tdd`, `sadd`.
  - Apaguei `~\.claude\plugins\cache\thedotmack` (524 MB). `~\.claude\plugins` foi de 942 MB para 396 MB.

## Decisões
- **DEC-2026-11-10-01:** manter o MCP do Clerk no escopo local do `xend-baas-api` (item 4 do Roadmap). Reafirma a DEC-2026-11-08-14. Temporária, até atualizar a CLI (3.3.0 → 4.1.0) ou deixar de usar o Clerk no baas-api.
- Item 2: ficou de fora da remoção: `~\.claude-mem` (dados do claude-mem), o marketplace `thedotmack`, `vercel-plugin` (duplicado), `quandora` e `trading-ideas`.

## Aprendizados
- O roadmap citava só `claude-mem` e a suíte `claude-settings`. Os 3 plugins do `context-engineering-kit` também estavam registrados para o `hedglobal-plataform` e vieram do ECC. Entraram na limpeza.
- `claude plugin uninstall --scope project` precisa rodar com o diretório do projeto como cwd.
- O CLI não apaga a pasta de cache do plugin ao desinstalar. A remoção foi manual.

## Próximos passos
- [ ] Marcar o item 2 como feito no [[Roadmap]] e na nota de ordem de execução (`00-Inbox/Próximos passos - ordem de execução.md`).
- [ ] Item 3: remover o kit ECC do worktree `xend-onchain-binance-venue` (fechar outros apps antes, por causa da memória).
- [ ] Item 4: MCP do Clerk mantido (DEC-2026-11-10-01). Só reavaliar após atualizar a CLI.
- [ ] Decidir se `~\.claude-mem` (dados) também sai.

## Arquivos criados/alterados
- Criado: esta nota.
- Fora do vault: `~\.claude\plugins\installed_plugins.json` (8 registros removidos) e `~\.claude\plugins\cache\thedotmack\` (apagado).
