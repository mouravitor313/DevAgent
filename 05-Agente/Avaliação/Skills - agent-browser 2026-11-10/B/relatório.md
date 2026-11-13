# Relatório de verificação — https://xend.exchange (sessão abB, agent-browser 0.39.4)

Data: 2026-11-10. Site público, sem login. Nenhum formulário foi preenchido ou enviado.

## 1. Título e URL final

- URL pedida: `https://xend.exchange` → URL final: `https://xend.exchange/` (sem redirect observado).
- Título: "XEND Exchange — Pagamentos, Liquidez e FX Otimizado".

## 2. Navegação principal

| Texto | Destino (href) | Resultado |
|---|---|---|
| Logo "XEND EXCHANGE" | `/` | Home (mesma página) |
| Início | `#inicio` | Âncora existe (`id="inicio"`) |
| Soluções | `#fazemos` | Âncora existe (`id="fazemos"`) |
| Por que mudar | `#dor` | Âncora existe (`id="dor"`) |
| Como funciona | `#como` | Âncora existe (`id="como"`) |
| Contato | `#contato` | Âncora existe (`id="contato"`) |
| EN | `/en/` | Carregou. Título: "XEND Exchange — Cross-border Payments, Liquidity and Optimized FX" |
| Simular pagamento → (botão do cabeçalho) | `https://wa.me/5511936213862` | Link externo (WhatsApp), não aberto |
| Abrir chat de atendimento (botão flutuante) | não é link | Não testado além da presença no DOM |

Links no rodapé: LinkedIn (`https://www.linkedin.com/company/xend-exchange/`), WhatsApp (`https://wa.me/5511936213862`), e-mail `mailto:contato@xend.exchange`, Política de Privacidade `/privacy-policy/`.

Página de privacidade: `/privacy-policy/` carregou. Título: "XEND Exchange — Política de Privacidade".

Links externos (LinkedIn, WhatsApp, mailto) não foram abertos.

## 3. Botões e CTAs da home

| Texto | Destino |
|---|---|
| Alerta do topo: "Falar com o atendimento" | Não verificado (botão do banner; destino não extraído) |
| Simular pagamento → (cabeçalho) | WhatsApp `wa.me/5511936213862` |
| Falar no WhatsApp → (hero) | WhatsApp `wa.me/5511936213862` |
| Comparar com o banco → (seção "Como o banco opera") | WhatsApp `wa.me/5511936213862` |
| SIMULAR PAGAMENTO → (card 01 de Soluções) | WhatsApp `wa.me/5511936213862` |
| COMPARAR COM O BANCO → (card 02) | WhatsApp `wa.me/5511936213862` |
| FALAR COM ESPECIALISTA → (card 03) | WhatsApp `wa.me/5511936213862` |
| Simular pagamento → (seção "Teste") | WhatsApp `wa.me/5511936213862` |
| Falar no WhatsApp → (botão do formulário de contato) | Botão presente; não clicado |

Observação: todos os CTAs da home levam ao mesmo WhatsApp. Não há página interna de simulação ou de soluções.

Formulário de contato (seção Contato): campos NOME, EMPRESA, EMAIL CORPORATIVO (obrigatórios), INTERESSE (select com 4 opções) e CONTE SEU CASO. Não foi preenchido nem enviado.

## 4. Screenshots

- Desktop (1440x900, página inteira): `desktop.png`. A primeira captura saiu com faixas em branco (seções de conteúdo sem renderizar). Rolando a página até o fim e refazendo a captura, as seções apareceram. A versão salva é a segunda. Altura da página: 7190 px.
- Mobile (390x844): `mobile.png`. Captura da área visível (sem página inteira). Layout sem overflow horizontal: scrollWidth = clientWidth = 390.

## 5. Problemas observados

- Links internos: todas as âncoras (`#inicio`, `#fazemos`, `#dor`, `#como`, `#contato`) existem na página. Nenhum link interno quebrado encontrado. Nenhum erro 404 observado nos destinos internos testados (`/en/`, `/privacy-policy/`).
- Placeholders: não encontrei textos de placeholder tipo "lorem" ou "TODO" no texto extraído.
- Textos possivelmente mal formados, vindos do `get text body` (pode ser artefato de extração, não verificado visualmente): "o banconão é o custo realda sua operação" (seção "Como o banco opera"), e os ícones de cards de Soluções aparecem no texto como letras soltas ("p", "c", "l").
- Console: `console` retornou vazio e `errors` retornou vazio. Não é possível afirmar que não houve erros, só que nenhum foi capturado nesta sessão.
- Faixa de cotações (USD/BRL, EUR/BRL etc.) mostra valores estáticos no HTML extraído (5.42, 5.82, 6.88, 7.26, 1.07), sem indicação de horário.

## Comandos agent-browser executados: 27; falhas de comando: 0

Nenhuma falha de comando. Detalhe: open 6, get url 3, get title 3, snapshot -i 1, get text body 1, eval 4, console 1, errors 1, set viewport 3, screenshot 3 (duas de desktop e uma de mobile), close 1. Total 27, incluindo o close final.
