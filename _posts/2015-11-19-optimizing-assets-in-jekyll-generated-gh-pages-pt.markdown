---
layout: post
title: "Otimizando Assets em sites com Jekyll + gh-pages"
date: 2015-11-19T00:20:27-02:00
author: rafaeleyng
excerpt: >
  Aprenda como otimizar assets para seu site em Jekyll sem depender de plugins.
translation_id: 72b9d74bc3627e2a44f18630af141ef2
lang: pt
---

## Jekyll + gh-pages

Se você tem um site estático gerado com [Jekyll](https://jekyllrb.com/), provavelmente ele está hospedado com[gh-pages](https://help.github.com/articles/using-jekyll-with-pages/).

gh-pages são ótimas pela simplicidade de hospedagem e publicação do seu site estático, mas elas não te permitem customizar o seu processo de build. Por razões de segurança, o Github não permite que você arbitrariamente rode  plugins no seu ambiente.

Nesse post eu juntei várias técnicas para otimizar os seus assets em tempo de build, que você pode usar mesmo hospedando seu site com Jekyll no gh-pages.


## Otimizar HTML

### Minificar HTML com Compress

[Jekyll Compress HTML](https://github.com/penibelst/jekyll-compress-html) é um arquivo de layout do Jekyll que comprime HTML removendo espaços desnecessários e [tags HTML opcionais](http://www.w3.org/TR/html5/syntax.html#optional-tags).

Trata-se de [um único arquivo HTML](https://github.com/penibelst/jekyll-compress-html/blob/master/site/_layouts/compress.html) que você baixa e coloca dentro da sua pasta `_layouts` e referencia colocando

```
---
layout: compress
---
```

no front-matter do seu layout default, ou nos seus arquivos HTML. Você ainda pode remover espaços de arquivos JSON/XML que você gere, usando a mesma abordagem.

Veja como é feito [nesse commit](https://github.com/codeheaven-io/codeheaven.io/commit/96187be6c5c96c4785243c9ebf194823f5db9a35).

## Otimizar CSS

Jekyll suporta Sass nativamente. Com isso, você já pode concatenar todos seus arquivos SASS em um único bundle. Mas isso não irá minificar seu CSS.

### Inline CSS

É recomendado você colocar inline o CSS usado para renderizar o conteúdo acima da primeira dobra da sua página. Mas se o seu site é um simples blog ou página de projeto, provavelmente o seu CSS acima da dobra é *todo* o seu CSS. Então você pode colocar todo seu CSS em uma tag `<style>` no head de sua página. Especialmente se seu HTML + inline CSS juntos são menores do que 14.6kb comprimidos (gh-pages serve seu site comprimido com gzip), porque esse é [o tamanho que o cliente consegue receber na primeira roundtrip ao servidor](https://developers.google.com/speed/docs/insights/mobile?hl=en).

Para fazer isso, crie um arquivo `inline.scss` na pasta `_includes`, e importe os arquivos SCSS que você quer que sejam fiquem inline. Geralmente, algo como importar o arquivo `main.scss` (da sua pasta `_sass`):

```
@import "main";
```

Então incluímos esse arquivo dentro de uma tag `<style>` no head do documento, passando o conteúdo pelo filtro nativo do Jekyll [scssify](http://www.rubydoc.info/github/jekyll/jekyll/Jekyll/Filters:scssify):

{% raw %}
```
{% capture inline_css %}
  {% include inline.scss %}
{% endcapture %}
{{ inline_css | scssify }}
```
{% endraw %}

Veja como é feito [nesse commit](https://github.com/codeheaven-io/codeheaven.io/commit/12ed5810d2edf6a967154cd14ee77b69ccf25c7f).

Claro que você pode escolher colocar inline só uma parte do CSS e carregar um arquivo CSS separado com o resto.

<small>
Essa técnica eu aprendi nesse post do [Kevin Sweet](http://www.kevinsweet.com/inline-scss-jekyll-github-pages/).
</small>

### Minificar inline CSS

Lembra do nosso amigo Jekyll Compress HTML? Compress removerá os espaços vazios (que é basicamente como CSS é minificado) de todo seu inline CSS.

## Otimizar JS

### Concatenar JS

Escreva todo seu JS em quantos arquivos você preciasr e dê `include` de todos eles em um único arquivo, e adicione uma única tag `<script>` no seu HTML para requisitar esse arquivo.

`include` irá procurar arquivos somente na pasta `_includes`, então se você quiser manter seus arquivos JS em uma pasta separada, use [`include_relative`](http://jekyllrb.com/docs/templates/), que te permite incluir arquivos relativamente ao arquivo no qual você está trabalhando.

Veja como é feito [nesse commit](https://github.com/CWISoftware/eventos/commit/b180160afb613287c50bcc2f8f411fc4fe0d6fe0).

### Minificar JS

Isso é o que eu ainda não descobri como fazer sem um plugin. Se você souber, por favor me conte nos comentários.

Jekyll Compress não vai funcionar: ele somente remove espaços em branco, e não é assim que JS é minificado. Além disso, se você usar `//` para comentário, todo o código depois disso estará comentado.

### Inline JS

Um simples `include` ou `include_relative` do seu arquivo dentro de uma tag `<script>` já basta. Mas **não irá funcionar** junto com o Jekyll Compress HTML, então escolha qual dos dois é mais útil para você e use só ele.
