---
tipo: referência
status: em-construção
tags: [devagent, referência, modelo, qwen, camada-barata]
criado: 2026-11-08
atualizado: 2026-11-08
fonte: https://huggingface.co/Qwen/Qwen3-Coder-Next
formato: repo
---
# Qwen3-Coder-Next

## Resumo
Modelo de código da Qwen, **MoE híbrido de 80B parâmetros totais com 3B ativos por token** (48 camadas, 512 experts, 10 ativos + 1 compartilhado; Gated DeltaNet + Gated Attention). Só modo não-thinking. Contexto nativo de 262.144 tokens (YaRN validado até 131K). Licença **Apache-2.0** segundo o model card (arquivo LICENSE não conferido). Relatório técnico: [arXiv 2603.00729](https://arxiv.org/abs/2603.00729) (28/02/2026). Há versão Base e [GGUF oficial](https://huggingface.co/Qwen/Qwen3-Coder-Next-GGUF).

## Correção ao radar
O [[2026-11-08 - Radar Dev & IA (Ciclo 3)]] o descreveu como "modelo pequeno, ~3B, foco em rodar local". **Errado:** os ~3B são só os parâmetros *ativos*. A memória necessária é a dos 80B (pesos). O foco declarado é agentes de código, não rodar local.

## Por que guardei
Candidato à **camada barata** do pool, **via API** (Fase 3 do [[Roadmap]], ver [[Roteamento de LLMs]]).

## Números do model card (do fornecedor, **não auditados**; asterisco do card sem explicação, scaffold não confirmado)
- SWE-bench Verified 70,6 · Multilingual 64,3 · Pro 44,3 · Terminal-Bench 2.0 36,2 · MMLU-Pro 80,52.
- Tool calling nativo (parser `qwen3_coder` no vLLM ≥0.15.0 / SGLang ≥0.5.8); card cita compatibilidade com Claude Code, Qwen Code, Cline, Kilo, Trae, Qoder.

## Rodar local *(futuro distante — o foco atual é modelo de API barato/gratuito, DEC-2026-11-08-26)*
O card **não** informa requisitos de VRAM/RAM. Tamanhos dos GGUF (só pesos, sem KV cache): Q4_K_M 48,4 GB · Q5_K_M 56,7 GB · Q6_K 65,5 GB · Q8_0 84,8 GB · F16 159 GB. Inferência (não do card): não cabe em GPU de consumo de 24 GB; precisa de máquina com ≥64 GB de memória unificada/RAM com offload de experts, ou multi-GPU. Como só 3B estão ativos, a velocidade tende a ser boa se os pesos couberem.

## Não confirmado
Data exata de lançamento (coleção "Updated Feb 3" sugere início de fev/2026) · requisitos oficiais de hardware · significado do asterisco nos benchmarks · números do relatório técnico.

## Próximo passo
Levantar provedores de API que sirvam o modelo (preço, limites, tool calling) e avaliá-lo no nosso harness (OpenCode, tarefas de [[Tarefas transversais]]) antes de adotar. Rodar local fica para depois.
