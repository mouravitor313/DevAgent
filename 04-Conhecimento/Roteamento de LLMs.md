---
tipo: conceito
status: em-construção
tags: [devagent, roteamento, llm-router]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[LLMRouter (paper)]]", "[[LLMRouterBench (paper)]]"]
---
> Movida de `Anotações - Construção DevAgent.md` (raiz do vault) no kickoff de 08/11/2026.


# Roteamento
## Requisitos de escolha:

**Como os Roteadores Decidem (O que as ferramentas fazem na prática):**

Repositórios e frameworks líderes (como **LiteLLM**, **RouteLLM** da LMSYS, e **OpenRouter**) utilizam três estratégias principais para mapear tarefas para modelos:

1. **Roteamento por Heurística (Baseado em Regras):** O método mais fácil de implementar. Se o prompt exceder 30.000 tokens ou contiver a palavra "resuma os arquivos", o roteador manda para o _Gemini 1.5 Pro_. Se tiver código regex complexo, vai para _Claude 3.5 Sonnet_.
    
2. **Roteamento em Cascata (Fallback):** Tenta resolver a tarefa primeiro com um modelo pequeno, rápido e barato (como o _Llama 3 8B_ local ou _Qwen 2.5_). O roteador avalia a saída (ou verifica se houve erro sintático); se a resposta for de baixa confiança, ele reenvia a tarefa para um modelo "pesado" (como _GPT-4o_ ou _DeepSeek R1_).
    
3. **Classificador Preditivo (Matrix Factorization/ML):** O roteador usa um modelo leve local (frequentemente um modelo de embeddings) para ler o prompt do usuário, cruzar os vetores com o histórico de performance dos LLMs conhecidos (como os dados do _LLMRouterBench_), e enviar a requisição para o modelo que tem o melhor custo-benefício estatístico para aquele vetor específico.