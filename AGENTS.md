# AGENTS.md — Vault do projeto Dev Agent

Instruções para qualquer agente (Claude, Codex, Gemini, OpenCode…) que leia ou escreva nesta pasta.
Mantenha este arquivo curto: **cada regra nova deve vir de uma falha real** ("ratchet").

## Escopo
- Trabalhe **somente dentro de `DevAgent/`**. O resto do vault (`OnChain/`, `Câmbio/`, `Trader/`…) é pessoal: não leia nem altere sem pedido explícito.
- Idioma das notas: **português**. Termos técnicos podem ficar em inglês.

## Onde cada coisa vai
| Pasta | Conteúdo | Quem escreve |
|---|---|---|
| `00-Inbox/` | Captura rápida, sem formato. Triar semanalmente. | humano + agente |
| `01-Projeto/` | Kickoff, roadmap, `Decisões/` (ADRs numerados). | humano (agente propõe) |
| `02-Sessões/` | Um registro por conversa/sessão de trabalho relevante. | agente |
| `03-Pesquisa/Radar/` | Saída das rotinas "Research e descobrimento". | agente |
| `03-Pesquisa/Papers/` | Uma nota por paper (resumo + o que importa para nós). | agente |
| `03-Pesquisa/Referências/` | Artigos, repos, vídeos, ideias externas. | ambos |
| `04-Conhecimento/` | Conceitos sintetizados e duráveis (evergreen). Cresce a partir de Pesquisa. | ambos |
| `05-Agente/` | Construção do agente: `Arquitetura/`, `Specs/`, `Skills/`, `Prompts/`, `Avaliação/`. | ambos |
| `90-Templates/` | Templates. Não edite sem pedido. | humano |
| `99-Arquivo/` | Notas obsoletas. Mova em vez de apagar. | ambos |

## Convenções
- **Sempre use um template** de `90-Templates/` e preencha o frontmatter (`tipo`, `status`, `tags`, `criado`, `atualizado`).
- `status`: `a-ler` → `em-construção` → `consolidado` (ou `arquivado`).
- Nomes de arquivo: datados `AAAA-MM-DD - Título.md` para Sessões e Radar; título simples para o resto. ADRs: `ADR-000N - Título.md`.
- **Links**: use `[[wikilinks]]`. Ao criar nota, ligue-a a pelo menos uma nota existente e ao [[00 - Index]] se for um hub.
- **Fontes**: toda afirmação externa leva link. Números de fontes secundárias recebem a marca "não auditado".
- Ao atualizar uma nota, mude `atualizado:` — não reescreva o histórico de decisões; acrescente.

## Ao final de cada sessão de trabalho
1. Criar/atualizar a nota em `02-Sessões/` (o que foi feito, decisões, próximos passos).
2. Achados duráveis → `04-Conhecimento/` (ou atualizar a nota existente).
3. Decisões tomadas → ADR em `01-Projeto/Decisões/`.

## Decisões
- **Toda decisão do Vítor é registrada no mesmo turno** em `01-Projeto/Decisões/Registro de decisões.md` (e em ADR, se estrutural), via skill `registro-de-decisoes`. Antes de apagar, mover ou mexer em um projeto, consulte o Registro (`grep` por escopo) e respeite as restrições vigentes. *(Origem: pedido do Vítor em 08/11/2026, DEC-2026-11-08-08.)*
4. Pendências → seção "Próximos passos" do [[Roadmap]].

## Não faça
- Não apague notas (mova para `99-Arquivo/`).
- Não mexa em `.obsidian/`.
- Não cole papers inteiros — resuma e linke a fonte.
