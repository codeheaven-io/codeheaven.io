---
layout: post
title: "Como usar Axios como cliente HTTP"
lang: "pt"
date: 2015-07-15T22:39:43-03:00
author: marlonbernardes
excerpt: >
  Axios é um cliente HTTP que funciona tanto no browser quanto em node.js. Neste post veremos como fazer requisições HTTP utilizando a biblbioteca.
---

## Introdução

Axios é um cliente HTTP, que funciona tanto no browser quanto em node.js. A biblioteca é basicamente uma API que sabe interagir tanto com `XMLHttpRequest` quanto com a interface `http` do node. Isso significa que o mesmo código utilizado para fazer requisições ajax no browser também funciona no servidor. Além disso, as requisições feitas através da biblioteca retornam uma `promise`, compatível com a nova versão do JavaScript - ES6.  *Promissor*, certo? Vamos ver como funciona!

## Instalação

Antes de utilizar axios, primeiro é necessário instalar. Há diversas formas de fazer isso:

1) Usando npm:

```
$ npm install axios
```

2) Usando bower:

```
$ bower install axios
```

3) Download manual:
[https://github.com/mzabriskie/axios/tree/master/dist](https://github.com/mzabriskie/axios/tree/master/dist)

## Primeiros passos

Depois de instalar, utilizar a biblioteca é bastante simples. Neste post, faremos requisições para a API do GitHub:

```js
// Requisições do tipo GET
axios.get('https://api.github.com/users/' + username)
  .then(function(response){
    console.log(response.data); // ex.: { user: 'Your User'}
    console.log(response.status); // ex.: 200
  });  

// Requisições POST, note há um parâmetro extra indicando os parâmetros da requisição
axios.post('/save', { firstName: 'Marlon', lastName: 'Bernardes' })
  .then(function(response){
    console.log('salvo com sucesso')
  });  
```

Além de `post` e `get`, existem os métodos `delete`, `head`, `put` e `patch`, que fazem requisições com o tipo equivalente em HTTP.

Os método `put` e `patch` são similares ao `post`, e exigem um parâmetro extra contendo os dados que serão enviados.

## Executando múltiplas requisições em paralelo

Para executar múltiplas requisições em paralelo, simplesmente forneça um array para o método `axios.all`. Quando todas as requisições forem concluídas, você receberá um array contendo as respostas na mesma ordem em que estes foram enviados. Uma outra alternativa é utilizar o método `axios.spread`, que converte um array para múltiplos argumentos. Utilizar spread é uma boa alternativa, visto que referenciar os objetos pelo índice do array pode deixar o código confuso.

```js
// Requisições serão executadas em paralelo...
axios.all([
    axios.get('https://api.github.com/users/codeheaven-io');
    axios.get('https://api.github.com/users/codeheaven-io/repos')
  ])
  .then(axios.spread(function (userResponse, reposResponse) {
    //... mas este callback será executada apenas quando todas as requisições concluírem
    console.log('User', userResponse.data);
    console.log('Repositories', reposResponse.data);
  }));
```

## Usando axios em node

Deve ser óbvio agora, mas rodar o código acima no node deve ser bem fácil. Instale axios com `npm` e importe como você já faz com qualquer outra dependência:

```js
var axios = require('axios')
axios.get('https://api.github.com/users/codeheaven-io');
```

## Usando axios no browser

Simplesmente importe axios (através de uma tag `<script>`, browserify, requirejs, webpack, etc)

```html
<script src="./bower_components/axios/dist/axios.js"></script>
<script>
axios.get('https://api.github.com/users/codeheaven-io');
</script>
```

## Enviando headers HTTP customizados

Para enviar headers customizados, forneça um objeto contendo os headers HTTP como último argumento:

```js
var config = {
  headers: {'X-My-Custom-Header': 'Header-Value'}
};

axios.get('https://api.github.com/users/codeheaven-io', config);
axios.post('/save', { firstName: 'Marlon' }, config);
```

Você pode ler mais sobre axios em:
[https://github.com/mzabriskie/axios](https://github.com/mzabriskie/axios)
