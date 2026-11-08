---
tipo: conceito
status: em-construção
tags: [devagent, segurança, contexto, vibecoding]
criado: 2026-11-08
atualizado: 2026-11-08
---

## Problemas do Vibecoding

### **Segurança no Vibecode - Funcionar != Ser Seguro**

Quando olhamos para a geração de código por IA (o famoso "vibecode", onde você itera com o modelo até o código simplesmente funcionar), podemos interpretar o processo como encomendar um prato em um restaurante sem ver a cozinha. O prato chega rápido, tem uma aparência excelente e sacia a fome. No entanto, você não sabe se os ingredientes estavam na validade, se a faca foi lavada ou se a temperatura de cozimento foi segura.

É extremamente intuitivo pensar que, se o script gerado pelo LLM compila, passa nos testes unitários e executa a funcionalidade que você pediu no prompt, o trabalho está feito e o código está pronto para produção. Afinal, a IA resolveu o problema lógico, certo?

A realidade de segurança da informação, no entanto, prova o contrário. Para aplicações reais, depender exclusivamente de código gerado por IA sem auditoria profunda é perigoso e propenso a introduzir vetores de ataque críticos. Modelos de linguagem são otimizados para agradar o usuário e fazer o código "funcionar" o mais rápido possível, muitas vezes sacrificando as melhores práticas de segurança em prol da conveniência. A abordagem de tratar a IA como um rascunhador, aliada a uma revisão defensiva rigorosa e testes de segurança automatizados, é tecnicamente superior.

#### 1. Alucinação de Dependências e Pacotes Fantasmas

Modelos de linguagem prevêem o próximo token mais provável com base em padrões estatísticos, não em um índice atualizado de gerenciadores de pacotes. Um risco explícito e crescente é a capacidade do LLM de alucinar bibliotecas.

- **Typosquatting Induzido por IA:** O modelo pode sugerir a instalação de um pacote que parece real (ex: `requests-promise` em vez de `requests`), mas que não existe no repositório oficial. Atacantes monitoram essas alucinações comuns geradas por IAs e registram esses nomes falsos com códigos maliciosos. Ao copiar e colar o comando de instalação gerado, você infecta seu próprio ambiente.
    
- **Dependências Obsoletas e Vulneráveis:** Como o treinamento dos modelos tem uma data de corte, eles frequentemente sugerem versões de bibliotecas antigas que possuem CVEs (vulnerabilidades conhecidas) já mapeadas, introduzindo falhas de segurança conhecidas direto no seu projeto.
    

#### 2. Vulnerabilidades Ocultas na Lógica de Negócio e Controle de Acesso

Modelos são excelentes na sintaxe e na micro-lógica (como fazer um loop ou uma query de banco de dados), mas péssimos em compreender o contexto macro de segurança da sua aplicação.

A IA frequentemente omite validações cruciais de estado ou autorização. Por exemplo, ao pedir para "criar uma rota para deletar um usuário", o modelo gerará a rota, a query SQL e a resposta HTTP perfeitas. No entanto, ele silenciosamente esquecerá de verificar se o usuário que fez a requisição _tem permissão_ (admin) para deletar aquela conta. Esse tipo de falha (como IDOR - _Insecure Direct Object Reference_) é invisível em um teste de funcionamento básico, mas letal em produção. O código funciona perfeitamente para o atacante também.

#### 3. Falhas Criptográficas e "Caminhos de Menor Resistência"

Matematicamente e estatisticamente, fóruns de programação na internet estão cheios de tutoriais antigos e atalhos inseguros que foram absorvidos no treinamento do modelo. Quando o modelo precisa resolver um problema complexo, ele frequentemente escolhe o caminho de menor resistência para garantir que o código funcione na sua máquina de primeira. Isso resulta em:

- **Implementações Criptográficas Fracas:** O modelo pode usar algoritmos defasados (como MD5 ou SHA1) ou _seeds_ de randomização previsíveis (`random` em vez de bibliotecas _cryptographically secure_, como `secrets`) simplesmente porque são mais fáceis de implementar e mais comuns nos dados de treino.
    
- **Injeção Silenciosa (Injection):** Para evitar erros complexos de parsing, a IA pode recorrer a funções perigosas (como `eval()`, `exec()`, ou concatenação direta de strings em queries de banco de dados e comandos de SO) em vez de usar _prepared statements_ ou sanitização rigorosa, abrindo portas escancaradas para SQL Injection ou Remote Code Execution (RCE).
    

#### 4. A Superioridade da Revisão Defensiva + "Secure by Design"

Em vez de aceitar o "vibecode" como um produto finalizado, a engenharia de software moderna que utiliza IAs adota uma postura de **Zero Trust (Confiança Zero)** com o código gerado.

Nesta abordagem:

- **Assunção de Insegurança:** O código da IA é tratado como se tivesse sido escrito por um desenvolvedor júnior brilhante, mas que desconhece completamente o contexto do negócio. Todas as validações de entrada (input) e saída (output) devem ser adicionadas manualmente ou exigidas explicitamente no prompt.
    
- **Análise Estática e Dinâmica (SAST/DAST):** A integração contínua (CI/CD) passa a ser a barreira de contenção. O código gerado deve obrigatoriamente passar por ferramentas de análise de segurança automatizadas (como SonarQube, Snyk, ou linters de segurança específicos da linguagem) antes de ser considerado válido.
    
- **Princípio do Menor Privilégio:** Como não se pode garantir 100% o que o código gerado faz por baixo dos panos (especialmente se usar regex complexos gerados por IA), a arquitetura ao redor dele deve limitar seu raio de explosão. O código deve rodar em contêineres com permissões restritas ao mínimo necessário para aquela execução específica.

### **Tamanho de contexto - Maior != Melhor**

Quando olhamos para modelos, podemos interpretar conversas com LLMs como uma conversa de cara-a-cara com um ser humano. Após comentar sobre uma história, 15 minutos depois, o ouvinte ainda lembra de todos os detalhes. Após 10 horas de conversa, a memória não é tão clara como nos primeiros 15, 30, 60 minutos.

É extremamente intuitivo pensar que, com o lançamento de modelos capazes de processar 1 milhão ou até 2 milhões de tokens, o problema da memória em Inteligência Artificial estaria resolvido. Afinal, bastaria jogar todo o histórico da conversa e os documentos na janela de contexto e deixar o modelo se virar, certo?

A realidade arquitetural, no entanto, prova o contrário. Para execuções complexas e prolongadas, depender exclusivamente de uma janela de contexto gigante é ineficiente, caro e propenso a falhas críticas de raciocínio. A abordagem de dividir a execução em janelas menores (chunking), aliada a uma memória persistente (como RAG ou arquitetura de agentes), é tecnicamente superior.
#### 1. O Fenômeno "Lost in the Middle" (Perdido no Meio)

Modelos de linguagem não processam a informação de forma linear e igualitária. Um estudo seminal de Stanford e UC Berkeley revelou que a capacidade de um LLM de recuperar e usar uma informação depende drasticamente de **onde** essa informação está localizada no prompt.

- **Viés de Primazia e Recência:** Os modelos prestam muita atenção ao início do prompt (instruções do sistema) e ao final (a última mensagem ou pergunta do usuário).
    
- **A Queda no Meio:** Qualquer informação crucial que esteja "enterrada" no meio de um contexto massivo de 100k+ tokens sofre uma degradação severa na taxa de recuperação (Recall). O modelo literalmente "esquece" ou ignora esses dados, gerando alucinações mesmo quando a resposta correta está no texto.
    

#### 2. Diluição da Atenção e Poluição de Contexto

Conversas prolongadas acumulam "ruído" — correções, caminhos errados, hesitações e dados que já não são mais relevantes para o estado atual da tarefa.

O mecanismo de autoatenção (Self-Attention) dos Transformers obriga o modelo a calcular a relação de cada token com todos os outros tokens da sequência. Quando você tem um contexto gigantesco e cheio de ruído, a "atenção" do modelo se dilui. Ele perde o foco da restrição principal e começa a misturar variáveis antigas com novas, quebrando o encadeamento lógico (reasoning) necessário para tarefas complexas.

#### 3. Custo Computacional e Latência Inviáveis

Matematicamente, o custo computacional do mecanismo de atenção padrão cresce de forma quadrática em relação ao tamanho da sequência, representado como $O(N^2)$ (onde $N$ é o número de tokens).

Mesmo com otimizações recentes (como _Ring Attention_ ou _Sliding Window Attention_), processar todo o histórico a cada nova interação é um desperdício maciço de recursos. Se você tem um contexto de 500.000 tokens e o usuário digita _"Sim, continue"_, o modelo precisa reprocessar e recalcular a atenção de todos os meio milhão de tokens para gerar a próxima palavra. Isso resulta em:

- **Latência altíssima:** Respostas que demoram de 30 a 60 segundos, contra 1 a 2 segundos de pipelines otimizados.
    
- **Custos exorbitantes:** Você paga por inferência de entrada repetidas vezes pelo mesmo texto histórico.
    

#### 4. A Superioridade da Execução Modular + Memória Persistente

Em vez de um "caderno gigante" que é reescrito a cada turno, a engenharia moderna de LLMs usa arquiteturas baseadas em **Agentes e RAG (Retrieval-Augmented Generation)**, como frameworks estilo _MemGPT_ ou _Letta_.

Nesta abordagem:

- **Alta Relação Sinal-Ruído:** O modelo recebe uma janela de contexto curta, contendo apenas as instruções centrais, a tarefa imediata e os recortes (chunks) cirurgicamente recuperados de um Banco de Dados Vetorial que importam para _aquele exato momento_.
    
- **Gerenciamento de Estado de Banco de Dados:** A memória passa a ser um problema de banco de dados (inserir, indexar, atualizar, esquecer), não de inferência. O modelo atualiza variáveis em uma memória externa persistente, evitando confusões.
    
- **Modularidade:** Se um passo da execução falhar, você pode debugar a janela de contexto daquele passo específico, em vez de tentar adivinhar onde o modelo se perdeu em um pergaminho de milhares de páginas.

#### Links:
[Por que LLMs se tornam burras?](https://youtu.be/TeQDr4DkLYo?si=A6pE4MY8OmMsDZgf)
[Maioria dos devs não entendem como a janela de contexto funciona](https://youtu.be/-uW5-TaVXu4?si=he_CuFUmDWaEhB4a)
[Context Rot: Como Aumentar Tokens de Entrada Impacta A Performance de LLMs]([Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.youtube.com/watch?v=TUjQuC4ugak))
[Tamanho de Contexto em LLMs: O Que É e Porque É Importante]([Context Length in LLMs: What Is It and Why It Is Important?](https://datanorth.ai/blog/context-length))
### **Tipos de Modelos**

Quando olhamos para a arquitetura de sistemas com IA, podemos interpretar o uso de um único modelo de ponta (os chamados _State-of-the-Art_, ou SotA) como o equivalente a usar um canivete suíço banhado a ouro para construir uma casa inteira. Ele tem todas as ferramentas, corta bem e impressiona. No entanto, usar a lâmina principal para apertar um parafuso ou bater um prego não é apenas ineficiente, mas eventualmente desgasta a ferramenta e atrasa a obra.

É extremamente intuitivo pensar que, com modelos ultra-inteligentes e de janelas de contexto massivas acessíveis via API, bastaria enviar todas as requisições (desde um "Olá" até o debug de uma arquitetura de microsserviços) para o modelo mais pesado. Afinal, se ele é o mais inteligente, ele fará o melhor trabalho em qualquer situação, certo?

A realidade arquitetural, no entanto, prova o contrário. Para fluxos de trabalho que envolvem o ciclo completo de desenvolvimento, depender exclusivamente de um modelo "peso-pesado" é financeiramente insustentável e introduz latências inaceitáveis. A abordagem de roteamento de modelos (_Model Routing_), onde você seleciona cirurgicamente o nível de inteligência e o tamanho da janela de contexto para cada etapa específica (Pesquisa, Planejamento, Execução e Debug), é tecnicamente superior.

#### 1. Research e Planejamento: O Domínio do Raciocínio e Contexto Amplo

A fase de design arquitetural, pesquisa de viabilidade (Research) e planejamento (Plan) é onde a "força bruta" intelectual é necessária. O modelo precisa correlacionar documentações extensas, entender restrições de negócio e projetar o futuro da aplicação.

- **Modelos Ideais:** Modelos "Heavyweights" (como as categorias _Pro_, _Opus_ ou modelos baseados em _Reasoning/CoT - Chain of Thought_). Eles dedicam tempo de inferência para "pensar" antes de gerar o plano.
    
- **Gestão de Contexto:** Janelas grandes (ex: 100k+ tokens), pois você precisará ingerir PDFs de documentação, regras de negócio e diagramas. O foco aqui não é a velocidade da resposta, mas a precisão holística e a capacidade de abstração. Um erro no planejamento custa muito mais caro do que a latência de 20 segundos da API.
    

#### 2. Quebra de Tarefas (Tasks): O Ponto de Equilíbrio

Uma vez que o plano mestre foi criado pelo modelo pesado, dividi-lo em tickets (como no Jira ou Trello) ou sub-tarefas lógicas não exige genialidade criativa, apenas obediência estrita às instruções de formatação (ex: gerar um JSON válido com os passos).

- **Modelos Ideais:** Modelos intermediários e focados em _instruction-following_ e chamadas de ferramentas (_Function Calling_).
    
- **Gestão de Contexto:** Janela média (16k a 32k tokens). O modelo recebe o plano do passo anterior no prompt do sistema e tem a única função de extrair e organizar. Usar um modelo massivo e caro aqui é como contratar um arquiteto sênior apenas para carregar tijolos.
    

#### 3. Execução (Code Generation): Velocidade e Foco Cirúrgico

Na hora da execução (escrever o código de fato), a IA não precisa saber sobre a arquitetura de infraestrutura na nuvem que foi discutida no planejamento, a menos que esteja escrevendo o Terraform. Se a tarefa é "criar uma função de validação de CPF", o excesso de contexto apenas atrapalha.

- **Modelos Ideais:** Modelos "Lightweights" e ultrarrápidos (as variantes _Flash_, _Haiku_ ou modelos open-source menores e específicos para código, como _DeepSeek Coder_ ou _Qwen_).
    
- **Gestão de Contexto:** Janela estritamente curta e isolada (2k a 8k tokens). Você passa apenas a assinatura da função, o framework utilizado e os testes unitários desejados. Isso garante respostas em milissegundos e evita a "Diluição da Atenção". O modelo foca 100% em resolver o micro-problema com a sintaxe correta.
    

#### 4. A Superioridade do Roteamento de Modelos (Model Routing) e Debug

Em vez de acoplar sua aplicação a um único provedor ou tamanho de modelo, a engenharia avançada de agentes LLM adota uma postura de **Orquestração Dinâmica** (usando frameworks como LangGraph, Autogen ou roteadores customizados).

Nesta abordagem:

- **Debug Escalonado:** Se o código gerado pelo modelo rápido falha, o erro (Traceback/Logs) não é simplesmente devolvido a ele. O roteador percebe a falha de compilação e "escala" o problema (Fallback): envia o log de erro, o código falho e o objetivo original de volta para um modelo de _raciocínio profundo_. O modelo pesado analisa o porquê da falha, corrige e devolve para o fluxo rápido.
    
- **Trade-off de Custo e Latência:** Sistemas que implementam _Cascading_ ou _Routing_ economizam até 80% em custos de token e reduzem a latência média drasticamente, mantendo a exata mesma qualidade do resultado final, pois a IA mais inteligente e cara só é invocada quando o problema exige abstração real.
### **Agent VS Skills (e Rules ;D)**

Quando olhamos para a necessidade de dar aos LLMs conhecimento de negócios específico, podemos interpretar o problema como a expansão de uma empresa. A primeira intuição (a abordagem de criar múltiplos "Agentes Customizados por Domínio") é contratar dezenas de especialistas isolados: um agente focado só em frontend, outro só em relatórios financeiros, e outro apenas para o banco de dados. Você então precisa criar um "agente gerente" supercomplexo apenas para decidir com qual especialista falar a cada momento.

É extremamente intuitivo pensar que dividir o sistema em múltiplos agentes (sistemas _Multi-Agent_) alimentados por prompts de sistema gigantescos é a única forma de evitar que a IA se confunda. Afinal, se o contexto é limitado e as regras de negócio são muitas, melhor criar "mini-cérebros" isolados e focados em uma única coisa, certo?

A realidade arquitetural, impulsionada pelo movimento liderado pela Anthropic (com o ecossistema do Claude) prova o contrário. Construir e manter dezenas de agentes customizados cria um pesadelo de roteamento, latência e fragmentação de contexto. A abordagem de usar um agente generalista poderoso que carrega **Skills** (habilidades empacotadas com conhecimento processual) sob demanda é tecnicamente superior, mais barata e mais fácil de escalar.

Para entender essa transição e como o Claude opera nesse novo paradigma, precisamos separar claramente as camadas de inteligência: **Rules**, **Tools**, **Custom Agents** e **Skills**.

#### 1. Rules (Regras / System Prompts): O Limite da Memória Curta

As Regras são as instruções de nível de conversação que você coloca no _System Prompt_ principal (ex: _"Você é um programador sênior", "Sempre verifique tipagem", "Use o guia de estilo X"_).

- **A Limitação:** As regras precisam ser passadas e processadas em _todas_ as interações. Se você tentar socar toda a arquitetura de software da sua empresa, o manual de RH e as regras de infraestrutura em um único System Prompt, o modelo sofrerá de "Poluição de Contexto". Ele se torna lento, mais caro e começa a ignorar diretrizes cruciais porque a atenção foi diluída. As Regras são ótimas para comportamento geral, mas péssimas para conhecimento de domínio profundo.
    

#### 2. Tools (Ferramentas / MCP): Capacidade Bruta sem Sabedoria

Ferramentas (através de Function Calling ou _Model Context Protocol_ - MCP) são ações atômicas. Elas dão à IA "mãos e olhos" para interagir com o mundo externo, como ler um arquivo, fazer uma query SQL ou consultar o clima.

- **A Limitação:** Uma ferramenta define _o que_ o agente pode fazer (ex: a função `executar_sql_query`), mas não ensina _como_ ou _por que_ fazer aquilo dentro da metodologia da sua empresa. As ferramentas não carregam "sabedoria". Elas são apenas utilitários que o modelo precisa adivinhar como encadear corretamente baseado no seu conhecimento genérico de treinamento.
    

#### 3. Custom Agents (A Abordagem Antiga): O Pesadelo do Roteamento

Para contornar as limitações acima, a indústria começou a criar "Agentes Especialistas". Você construía um agente isolado só para lidar com integrações de API, equipado com seu próprio System Prompt e suas próprias ferramentas.

- **O Gargalo:** Quando um usuário pede algo que cruza domínios (ex: _"Crie o endpoint da API e já monte o componente React no frontend"_), a arquitetura quebra. Você precisa de orquestradores complexos passando mensagens entre o "Agente de API" e o "Agente de Frontend". O contexto se perde no meio do caminho, o custo de tokens dispara (pois os agentes ficam resumindo a conversa uns para os outros) e o debug se torna um labirinto.
    

#### 4. Agent Skills (O Padrão Claude/Anthropic): Especialização Sob Demanda

Em vez de fragmentar a inteligência, o padrão de _Agent Skills_ (fortemente adotado pelo _Claude Code_ e pelo padrão aberto _AgentSkills.io_) transforma o agente em um profissional generalista brilhante que tem acesso a uma biblioteca de "Manuais de Procedimento".

Uma **Skill** não é um agente novo, nem uma simples API. É um pacote autônomo (geralmente um diretório com um arquivo `SKILL.md`, scripts de validação e documentos de referência).

- **Descoberta Leve:** O agente Claude carrega apenas os metadados (nome e um resumo de 2 linhas) de dezenas de Skills disponíveis na sua inicialização, gastando pouquíssimos tokens.
    
- **Injeção de Procedimento (Progressive Disclosure):** Quando o usuário pede algo específico, o agente percebe que a tarefa exige expertise técnica. Ele então "lê" a Skill correspondente. A Skill injeta dinamicamente na janela de contexto a metodologia exata da empresa para aquele problema (ex: o design system aprovado, as restrições de segurança, os templates de código preferidos).
    
- **A Vantagem Definitiva:** A Skill fornece _conhecimento de domínio_ e _workflows_ no exato momento em que são necessários, sem inchar o prompt de sistema global. A IA continua sendo uma única entidade orquestradora (sem perda de contexto), mas veste um "chapéu de especialista" cirurgicamente durante a execução daquela tarefa, guiando como as ferramentas simples devem ser usadas para atingir um resultado de nível sênior.
    

---

#### Fontes e Referências Recomendadas

1. **[Agent Skills - Claude API Docs (Anthropic)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview):** A documentação oficial da Anthropic explicando como as Skills eliminam a necessidade de repetir o mesmo _guidance_ (procedimentos e contexto) entre conversas, transformando agentes de propósito geral em especialistas baseados em arquivos.
    
2. **[Agent Skills: Padrão Aberto (AgentSkills.io)](https://agentskills.io/home):** O hub da iniciativa _open-source_ que mostra como empacotar "conhecimento processual e contexto específico da empresa" de forma portátil.
    
3. **[Skills vs Tools for AI Agents: Production Guide (Arcade.dev)](https://www.arcade.dev/blog/what-are-agent-skills-and-tools/):** Um artigo crucial que define a taxonomia técnica: a indústria confunde os termos, mas _Tools_ definem o que o agente pode _fazer_, enquanto _Skills_ definem o que o agente _sabe_ (julgamento, abordagem e expertise de domínio).
    
4. **[Agent Skills for Large Language Models: Architecture... (arXiv:2602.12430)](https://arxiv.org/html/2602.12430v3):** Paper acadêmico focado em engenharia de software (Fev/2026) que detalha matematicamente como as Skills operam injetando contexto silencioso (fase de preparação) versus as tradicionais "Tools" (fase de execução de resultados), comprovando a superioridade em latência e economia de tokens sobre arquiteturas multi-agentes fragmentadas.

## Ferramentas

WIP
## Links Úteis para Consulta - Arquivo de Referências 
[NeoLabHQ/context-engineering-kit: Hand-crafted Claude Code Skills focused on improving agent results quality. Compatible with OpenCode, Cursor, Antigravity, Gemini CLI, and others.](https://github.com/NeoLabHQ/context-engineering-kit)

[affaan-m/everything-claude-code: The agent harness performance optimization system. Skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor and beyond.](https://github.com/affaan-m/everything-claude-code)

[agent-sh/agentsys: AI writes code. This automates everything else · 19 plugins, 47 agents, and 40 skills · for Claude Code, OpenCode, Codex, Cursor, Kiro.](https://github.com/agent-sh/agentsys)

[fcakyon/claude-codex-settings: My personal Claude Code and OpenAI Codex setup with battle-tested skills, commands, hooks, agents and MCP servers that I use daily.](https://github.com/fcakyon/claude-codex-settings)

[zarazhangrui/codebase-to-course: A Claude Code skill that turns any codebase into a beautiful, interactive single-page HTML course for non-technical vibe coders.](https://github.com/zarazhangrui/codebase-to-course)