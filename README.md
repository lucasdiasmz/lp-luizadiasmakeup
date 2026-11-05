# Luiza Dias Makeup

Landing page da Luiza Dias, maquiadora de noivas em Divinópolis-MG, com atendimento no Studio Dias.

Site no ar: https://luizadiasmakeup.vercel.app

## Sobre o projeto

Página única em HTML, CSS e JavaScript puros, sem framework e sem dependências. A única chamada externa é o Google Fonts (Cormorant Garamond e Jost); se ela falhar, a página usa as fontes de reserva.

Seções, na ordem em que aparecem:

1. Hero com vídeo de fundo em loop
2. Números (anos de experiência, depoimentos, Instagram)
3. Sobre a Luiza
4. Serviços
5. Atendimento para noivas e convidadas, com gráfico de cronograma
6. Portfólio
7. Bastidores (reels do Instagram)
8. Depoimentos de clientes
9. Studio Dias e curso de maquiagem
10. Como funciona
11. Chamada final para o WhatsApp

Todos os botões de agendamento abrem o WhatsApp com uma mensagem pronta. O pop-up "Consultar data" envia nome, telefone e data do evento já preenchidos.

## Estrutura

```
index.html        estrutura e textos da página
styles.css        estilos (tokens do design system no :root)
script.js         menu, pop-up, links do WhatsApp, vídeo e animações
assets/img/       fotos otimizadas para web (600 px e 1100 px)
assets/video/     vídeo da hero e a imagem de capa
materiais/        material bruto da cliente (fotos originais, textos, contatos)
design_system/    cores, tipografia, espaçamentos e componentes
copy.txt          textos originais da página
dados_cliente/    informações iniciais da cliente
```

## Rodar localmente

Qualquer servidor estático serve. Com Python:

```bash
python -m http.server 5510
```

Depois é só abrir http://localhost:5510.

## Como atualizar

- **WhatsApp e Instagram:** ficam no objeto `CONFIG`, no início do `script.js`. Os links no HTML servem de reserva quando o JavaScript está desligado.
- **Fotos novas:** salve em `assets/img/` nas duas larguras (`nome-600.jpg` e `nome-1100.jpg`) e preencha o `alt` descrevendo a foto.
- **Enquadramento do portfólio:** cada foto da galeria tem um `style="--pos: X% Y%"` que define o ponto de foco do corte.
- **Cache:** depois de mudar o `styles.css` ou o `script.js`, aumente o número em `?v=` nos links do `index.html` para o navegador baixar a versão nova.

## Publicação

O deploy é feito pela Vercel a cada push na branch `main`.

## Pendências com a cliente

- Confirmar se a Rua Pains, 131 é o endereço do Studio Dias
- Autorização de uso das fotos dos fotógrafos (@fotodarafa e outros), mantendo o crédito
- Autorização da aluna que aparece na foto do curso, antes de usá-la no site
- Tabela de preços ou pacotes de noiva
- Horário de atendimento e e-mail
