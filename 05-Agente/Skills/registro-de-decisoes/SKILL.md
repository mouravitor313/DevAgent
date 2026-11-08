---
name: registro-de-decisoes
description: Registra e recupera as decisões do Vítor (organização, arquitetura, ferramentas, escopo, o que fica ou sai, restrições temporárias como "não tocar em X"). Use SEMPRE que o usuário tomar ou confirmar uma decisão (ex.: "decidi", "pode remover", "fica", "sai", "vamos usar", respostas D1/D2…), para gravá-la no mesmo turno. Use também ANTES de agir sobre algo que já pode ter sido decidido (apagar, mover ou reorganizar; mexer em um repo; escolher ferramenta, modelo ou estrutura) ou quando perguntarem "o que decidimos sobre X", para consultar as decisões e restrições vigentes.
---

# Registro de decisões

Decisões só têm valor se forem lembradas **quando importam**. Esta skill garante duas coisas:
1. Toda decisão é gravada em um lugar único.
2. Antes de agir, o agente consulta só o que é relevante, sem carregar tudo em toda sessão.

## Onde fica
- **Registro (índice append-only):** `C:\Users\Pedro\Documents\vitorvalt\DevAgent\01-Projeto\Decisões\Registro de decisões.md`
- **ADRs:** mesma pasta, `ADR-000N - Título.md`, a partir do template `DevAgent\90-Templates\Decisão (ADR).md`
- Se o vault não estiver acessível na sessão (outro diretório sem acesso), avise o usuário e peça `--add-dir` ou o caminho. Não grave decisões em outro lugar.

## Registrar — quando uma decisão é tomada
1. **Grave no mesmo turno** em que a decisão foi tomada. Não deixe para o fim da sessão.
2. Acrescente **uma linha** à tabela do Registro:
   `| DEC-AAAA-MM-DD-NN | data | escopo | decisão | tipo | status | ref |`
   - **escopo:** `global`, `devagent` ou o nome do repo/projeto (é a chave de busca depois)
   - **decisão:** uma frase, fiel às palavras do usuário. Inclua o porquê só se ele foi dito. Não invente justificativa.
   - **tipo:** `permanente`, ou `temporária, até <condição>`
   - **status:** `vigente`, `substituída por <ID>` ou `expirada`
   - **ref:** ADR, nota de sessão ou plano
3. **Decisão estrutural** (afeta arquitetura, vários projetos, é difícil de reverter ou muda o fluxo de trabalho): crie também um ADR e aponte a linha para ele.
4. **Restrição temporária** ("não mexer em X agora"): além da linha, crie uma pendência em `DevAgent\01-Projeto\Roadmap.md` → "Próximos passos", para revisitar.
5. **Nunca reescreva** linhas antigas. Para mudar uma decisão, acrescente uma linha nova e marque a antiga como `substituída por <ID>`.
6. Se a decisão estiver ambígua (escopo, prazo, exceções), pergunte antes de registrar.
7. Atualize o `atualizado:` do frontmatter do Registro.

## Recuperar — quando necessário
**Gatilhos:**
- antes de apagar, mover, limpar ou reorganizar algo
- antes de começar a trabalhar em um repo ou projeto
- ao escolher ferramenta, modelo, estrutura ou convenção
- quando o usuário perguntar o que foi decidido

**Como:**
1. Busque no Registro pelo escopo e por termos do assunto (ex.: `grep -i "xend-baas-api\|worktree"`). Não leia o arquivo inteiro sem necessidade.
2. Abra o ADR só se a linha não bastar.
3. Considere apenas as linhas com status `vigente`. Para as `temporária`, verifique se a condição de expiração já ocorreu; se não tiver certeza, pergunte.
4. Se o pedido atual **conflitar** com uma decisão vigente, **pare e avise** antes de agir, citando o ID (ex.: "isso conflita com DEC-2026-11-08-07"). O usuário decide se a decisão muda; se mudar, registre a nova.

## O que não registrar
- Preferências triviais de uma única tarefa.
- Fatos que o código ou o git já registram.
- Detalhes de implementação sem impacto futuro.
