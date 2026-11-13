# Relatório — verificação de https://xend.exchange com agent-browser 0.39.4

Sessão: `abA`. Data: 2026-11-10. Só leitura: nenhum formulário foi preenchido ou enviado.

## 1. Título e URL final

- Home PT: `https://xend.exchange/` (sem redirect observado). Título: "XEND Exchange — Pagamentos, Liquidez e FX Otimizado".
- Home EN: `https://xend.exchange/en/`. Título: "XEND Exchange — Cross-border Payments, Liquidity and Optimized FX".
- Política de privacidade: `https://xend.exchange/privacy-policy/`. Título: "XEND Exchange — Política de Privacidade".

## 2. Menu / navegação principal

| Texto | Destino | Resultado |
|---|---|---|
| Logo XEND EXCHANGE | `/` | Carrega (home PT) |
| Início | `#inicio` | Âncora existe na página |
| Soluções | `#fazemos` | Âncora existe na página |
| Por que mudar | `#dor` | Âncora existe na página |
| Como funciona | `#como` | Âncora existe na página |
| Contato | `#contato` | Âncora existe na página |
| EN / PT (idioma) | `/en/` e `/` | `/en/` carrega (título em inglês) |

Não há link de menu para páginas internas separadas; todos os itens de navegação são âncoras da própria home. Os itens do menu aparecem duplicados (versão desktop e menu mobile). Não cliquei nas âncoras; verifiquei só que os IDs de destino existem no DOM.

Links de rodapé: LinkedIn (`https://www.linkedin.com/company/xend-exchange/`), WhatsApp (`https://wa.me/5511936213862`), e-mail `contato@xend.exchange`, Política de Privacidade (`/privacy-policy/`, carrega). Também há `mailto:institucional@xend.exchange`.

## 3. Botões e CTAs da home

| Texto | Destino |
|---|---|
| Simular pagamento → (topo, e duas vezes na página) | `https://wa.me/5511936213862` |
| Falar no WhatsApp → (hero) | `https://wa.me/5511936213862` |
| Comparar com o banco → | `https://wa.me/5511936213862` |
| SIMULAR PAGAMENTO → (cartão) | `https://wa.me/5511936213862` |
| COMPARAR COM O BANCO → (cartão) | `https://wa.me/5511936213862` |
| FALAR COM ESPECIALISTA → (cartão) | `https://wa.me/5511936213862` |
| Falar no WhatsApp → (botão da seção de contato) | Botão sem `href`; ação não verificada |
| Botão "Abrir chat de atendimento" / "Falar com o atendimento" / "Iniciar conversa" | Botões sem `href` (widget de chat); não acionados |
| Toggle menu (mobile) | Botão sem `href`; não acionado |

Todos os CTAs de conversão levam ao mesmo número de WhatsApp. Não há CTA que leve a página interna de produto ou de cadastro.

Formulário de contato (visível na home, não enviado): campos NOME, EMPRESA, EMAIL CORPORATIVO (obrigatórios), combobox INTERESSE (opções: Pagamento internacional a fornecedor, Cotação de FX, Volume recorrente / tesouraria, Outro) e CONTE SEU CASO. O botão de envio do formulário é o "Falar no WhatsApp →".

## 4. Screenshots

- Desktop (viewport 1440x900, página inteira): `desktop.png` salvo. Não revisei o conteúdo visual da imagem.
- Mobile (viewport 390x844): `mobile.png` salvo. Verificação visual feita sobre essa imagem; ver item 5.
- Overflow horizontal no mobile: `scrollWidth` 390 = `clientWidth` 390 (sem rolagem horizontal).

## 5. Problemas visíveis

Observados:
- No mobile, o botão flutuante de chat (canto inferior direito) sobrepõe a faixa de cotações no rodapé da primeira dobra (USD/BRL, EUR/BRL), cobrindo parte do texto.
- No mobile, a faixa de cotações ("ROLE" / "USD/BRL 5.42 ▲ +0.12% / EUR/BRL 5.82") aparece cortada nas bordas; é um marquee, então pode ser intencional.
- Textos com a palavra "TESTE" na home: são só o rótulo "Teste no seu próximo pagamento." (com `text-transform` em caixa alta). Não é placeholder.
- Nenhuma imagem com falha de carregamento (`naturalWidth` 0): 2 imagens na página, ambas carregaram.
- Nenhum link interno quebrado entre os verificados (`/en/`, `/privacy-policy/`, âncoras).

Não verificados:
- Erros de console: o comando `console` retornou vazio e o comando `errors` também retornou vazio. Isso pode significar ausência de erros, ou que mensagens anteriores ao início da sessão não foram capturadas. Não tenho como afirmar que não há erros.
- Links externos (LinkedIn, wa.me) não foram abertos.
- Cards de conteúdo não foram revisados visualmente além da primeira dobra mobile.

## Comandos agent-browser executados: 25; falhas de comando: 0

Não houve falha de comando. Os 25 comandos incluem: `--help`, `open`, `get title`, `get url`, `snapshot -i`, `eval` (5 vezes: links, âncoras, overflow mobile, placeholders e contexto do "TESTE"), `open` (EN e privacidade), `set viewport` (2), `screenshot` (2), `reload`, `console`, `errors`, `close`. Os comandos `mkdir`, `ls` e a leitura da imagem `mobile.png` foram feitos com Bash/Read, fora da contagem.
