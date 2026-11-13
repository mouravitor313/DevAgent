---
tipo: sessão
status: consolidado
tags: [devagent, sessão, ferramentas, radar]
criado: 2026-11-13
atualizado: 2026-11-13
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# 2026-11-13 - Ferramentas do Radar - encaixe nos projetos

## Objetivo da sessão
Avaliar cinco ferramentas da seção de ferramentas do digest semanal do Radar ([[2026-11-13 - Radar Dev & IA]]): Gemini Decisions API, AWS Emulator, o artigo da OpenRouter "MCP vs CLI vs Skills", Modern Web Guidance e A2UI. A pergunta era como cada uma complementa o DevAgent, o `terminal`, o `xend-onchain` e o dia a dia do fundo.

## O que foi feito
- Leitura das cinco fontes primárias.
- Contraste com o contexto real dos repos (leitura apenas):
  - `terminal`: Electron, chat com 6 tools `ui_*`;
  - `xend-onchain`: `intelligence-mcp` com ~14 tools e default de 500 linhas em `arb`; `bff` e `intelligence-mcp` com deploy por systemd em VM; F1 sem AWS.
- Nota criada: [[Ferramentas do Radar de 13-11 - encaixe nos projetos]], com prioridade: OpenRouter e Modern Web Guidance agora, Decisions API em experimento, A2UI depois, AWS Emulator em monitoramento.

## Decisões
- Nenhuma. As pendências da nota aguardam o Vítor.

## Aprendizados
- O artigo da OpenRouter mostra que o **tamanho do resultado das tools** pesa mais que a quantidade de tools (não auditado, uma tarefa só). Candidato a entrar na [[Filosofia do setup de agentes]] depois da auditoria do `intelligence-mcp`.
- A Gemini Decisions API é um classificador, não um roteador pronto. Encaixa como estratégia 3 de [[Roteamento de LLMs]].

## Próximos passos
- [ ] Vítor escolher quais pendências da nota seguem (auditoria do `intelligence-mcp`, `legacy-scan`, experimento da Decisions API…)

## Arquivos criados/alterados
- `03-Pesquisa/Referências/Ferramentas do Radar de 13-11 - encaixe nos projetos.md` (novo)
- `02-Sessões/2026-11-13 - Ferramentas do Radar - encaixe nos projetos.md` (novo)
