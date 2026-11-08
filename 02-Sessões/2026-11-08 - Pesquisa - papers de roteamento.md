---
tipo: sessão
status: consolidado
tags: [devagent, sessão, pesquisa, roteamento, papers]
criado: 2026-11-08
atualizado: 2026-11-08
participantes: [Vítor]
ferramenta: Claude Code
---
# 2026-11-08 - Pesquisa - papers de roteamento

## Objetivo da sessão
Sessão 03 (Pesquisa): concluir as notas dos papers [[LLMRouterBench (paper)]] e [[LLMRouter (paper)]]; atualizar newsletters e a pauta de modelos baratos/gratuitos.

## O que foi feito
- Dois subagentes leram os papers no HTML do arXiv (os PDFs vieram ilegíveis) e extraíram tabelas literais; as duas notas foram reescritas e promovidas a `consolidado`.
- **LLMRouterBench:** listas dos 20 + 13 modelos com preços, AvgAcc/custo de todos os roteadores, condição do 31,7% (relativa ao GPT-5 no flagship; roteador não nomeado), embeddings, limitações. Correção: a nota anterior dizia que os embeddings variavam 0,3–2,2 pontos; o certo é 0,7–2,2.
- **LLMRouter:** lista dos 18 modelos candidatos (só Together/NVIDIA, sem Claude/GLM/Kimi), 17 roteadores, xRouteBench, resultados e deploy. O **+14,6% do abstract não é reproduzível** pelo texto (métrica e baseline não definidos); multi-turn fica abaixo até do menor modelo.
- Newsletters (TLDR, AI/TLDR, Latent Space, Pragmatic Engineer): marcadas como confirmadas, a pedido do Vítor, que verificou.
- Roadmap atualizado; DEC-27 e DEC-28 registradas.

## Decisões
- DEC-2026-11-08-27: usar e verificar os modelos free do OpenCode na pauta de modelos baratos/gratuitos.
- DEC-2026-11-08-28: API gratuita do Groq no OpenCode e no Warp Terminal fica como pendência (aprender a configurar no environment como opção de roteamento).

## Aprendizados
- Os dois papers convergem: nenhum roteador domina, o ganho depende do pool e da trilha, e a baseline "melhor modelo único" tem de estar sempre na comparação. No flagship, Qwen3-235B custa ~5% do GPT-5 e fica ~10 pontos abaixo (valores do paper, não auditados).
- Nenhum dos dois mede trabalho de código em repositório, então os números não se transferem direto ao nosso agente.
- Candidato a levar para `04-Conhecimento/Roteamento de LLMs`: a síntese acima (ainda não feita).

## Próximos passos
- [ ] Usar e verificar os modelos free do OpenCode (DEC-27).
- [ ] Groq no OpenCode e no Warp, e aprender a configurar no environment (DEC-28).
- [ ] Atualizar [[Roteamento de LLMs]] com os achados dos dois papers.
- [ ] Levantar provedores de API e preços para [[Qwen3-Coder-Next]] (Together: US$ 0,50/1,20 por 1M tokens, segundo o LLMRouter).

## Arquivos criados/alterados
- `03-Pesquisa/Papers/LLMRouterBench (paper).md`, `LLMRouter (paper).md`
- `01-Projeto/Roadmap.md`, `01-Projeto/Decisões/Registro de decisões.md`
- `02-Sessões/2026-11-08 - Pesquisa - papers de roteamento.md`
