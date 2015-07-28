---
layout: post
title: "Programação Funcional na Prática"
date: 2015-07-26T16:23:50-03:00
author: rafaeleyng
lang: pt
excerpt: >
  Programação Funcional fica em algum lugar entre a Ciência da Computação e a Matemática. Esse é um tema denso e teórico, de forma que a minha meta aqui é te mostrar como começar a usar no seu dia-a-dia algumas funções clássicas para manipulação de coleções, focando em exemplos práticos.
translation_id: cb68d175ae1e479ad2e0d67b08b3c938
---

## Introdução

Programação Funcional fica em algum lugar entre a Ciência da Computação e a Matemática. Esse é um tema denso e teórico, de forma que a minha meta aqui é te mostrar como começar a usar no seu dia-a-dia algumas funções clássicas para manipulação de coleções, focando em exemplos práticos.

Nesse post, vou mostrar as 7 funções clássicas que eu considero mais úteis para manipulação de coleções:

* [each](#each)
* [filter](#filter)
* [find](#find)
* [some](#some)
* [every](#every)
* [map](#map)
* [reduce](#reduce)

Ao usar essas simples funções você irá tornar seu código mais conciso e expressivo, evitando diversos `for` loops e `if`. Nosso código ficará focado em lógica de negócio, não em percorrer coleções e acessar arrays.

<small>
(Os exemplos são em Javascript, mas esses princípios são aplicados a várias outras linguagens como Ruby, os lambdas de Java 8 e C#, com LINQ. Embora eu irei implementar as funções manualmente para mostrar seu funcionamento, a maioria dessas funções são implementadas nativamente no array do Javascript e em várias libs. Nos exemplos, iremos manipular uma hipotética coleção de <a href="https://gist.githubusercontent.com/rafaeleyng/e381da0b19039531dd33/raw/1ae6dc1e28ae2169110bfa5c9077ddb322065169/ch-functional-programming-data.js" target="_blank">dados de pedidos</a>.)
</small>

<!-- ======================================================================= -->

## each

Você tem uma coleção de coisas, e quer fazer algo com cada uma dessas coisas.

**Caso de uso:** Quero setar cada um dos meus pedidos como finalizados

```javascript
for (var i = 0; i < orders.length; i++) {
  orders[i].finished = true;
}
```

**Implementação básica:** `each` é uma função que opera em uma coleção. Para cada item da coleção, uma função será chamada, recebendo esse item como parâmetro. Dentro dessa função, você faz o que quiser com esse item.

```javascript
var each = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    operation(list[i]);
  }
}
```

Reescrevendo o exemplo usando `each`:

```javascript
each(orders, function(order) {
  order.finished = true;
});
```

Nós não nos preocupamos em percorrer coleções ou acessar elementos usando índices. Apenas nos preocupamos com o que queremos fazer com cada item.

<!-- ======================================================================= -->

## filter

Você tem uma coleção de coisas, e quer uma outra coleção, contendo apenas as coisas que tenha alguma característica do seu interesse.

**Caso de uso:** Quero uma lista com os pedidos do cliente com código 1.

```javascript
var ordersCustomer1 = [];
for (var i = 0; i < orders.length; i++) {
  if (orders[i].customer === 1) {
    ordersCustomer1.push(orders[i]);
  }
}
```

**Implementação básica:** `filter` é uma função que, para cada item de uma coleção, chama uma função passando esse item como parâmetro. Essa função deve testar alguma característica desse item (um *predicado*), e retornar um booleano que indica se o item tem ou não aquela característica desejada. Todos os items que tiverem a característica serão acumulados em uma nova coleção e retornados por `filter`.

```javascript
var filter = function(list, operation) {
  var results = []
  for (var i = 0; i < list.length; i++) {
    if (operation(list[i])) {
      results.push(list[i]);
    }
  }
  return results;
}
```

Reescrevendo o exemplo usando `filter`:

```javascript
var ordersCustomer1 = filter(orders, function(order) {
  return order.customer === 1;
});
```

<!-- ======================================================================= -->

## find

`find` é um `filter` com 2 diferenças: você filtra usando um identificador único, e ela retorna um único item (não uma coleção).

**Caso de uso:** Quero encontrar o pedido com código 2.

```javascript
var order2;
for (var i = 0; i < orders.length; i++) {
  if (orders[i].number === 2) {
    order2 = orders[i];
    break;
  }
}
```

**Implementação básica:** `find` é uma função que, para cada item de uma coleção, chama uma função passando esse item como parâmetro. Essa função deve usar esse item para testar algum identificador único desse item (um *predicado*), e retornar um booleano que indica se o item tem ou não aquele identificador. `find` interrompe a pesquisa assim que encontra o primeiro item que implementa o predicado retorna esse item.

```javascript
var find = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    if (operation(list[i])) {
      return list[i];
    }
  }
}
```

Reescrevendo o exemplo usando `find`:

```javascript
var order2 = find(orders, function(order) {
  return order.number === 2;
});
```

<!-- ======================================================================= -->

## some

Você quer saber se algum dos itens da sua coleção tem uma certa característica. Pode ser um item, dois, ou até mesmo todos eles.

**Caso de uso:** Quero saber se existe um pedido não finalizado.

```javascript
var existsNotFinished = false;
for (var i = 0; i < orders.length; i++) {
  if (!orders[i].finished) {
    existsNotFinished = true;
    break;
  }
}
```

**Implementação básica:** `some` é uma função que, para cada item de uma coleção, chama uma função passando esse item como parâmetro. Essa função deve usar esse item para retornar um booleano que indica se o item tem a característica desejada. `some` retornará `true` assim que encontrar algum item que tenha essa característica, ou `false` se nenhum tiver.

```javascript
var some = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    if (operation(list[i])) {
      return true;
    }
  }
  return false;
}
```

Reescrevendo o exemplo usando `some`:

```javascript
var existsNotFinished = some(orders, function(order) {
  return !order.finished;
});
```

<!-- ======================================================================= -->

## every

Você quer saber se todos os itens da sua coleção tem uma certa característica.

**Caso de uso:** Quero saber se todos os pedidos estão não finalizados.

```javascript
var allFinished = true;
for (var i = 0; i < orders.length; i++) {
  if (!orders[i].finished) {
    allFinished = false;
    break;
  }
}
```

**Implementação básica:** `every` é uma função que, para cada item de uma coleção, chama uma função passando esse item como parâmetro. Essa função deve usar esse item para retornar um booleano que indica se o item tem a característica desejada. `every` retornará `false` assim que encontrar algum item que não tenha a característica, ou `true` se todos tiverem.

```javascript
var every = function(list, operation) {
  for (var i = 0; i < list.length; i++) {
    if (!operation(list[i])) {
      return false;
    }
  }
  return true;
}
```

Reescrevendo o exemplo usando `every`:

```javascript
var allFinished = every(orders, function(order) {
  return order.finished;
});
```

<!-- ======================================================================= -->

## map

Para cada item da sua coleção você quer obter algum valor a partir de uma transformação daquele item, e você quer uma coleção desses valores.

**Caso de uso:** Quero uma lista contendo apenas os números dos meus pedidos (quero *transformar* meus pedidos nos números desses pedidos).

```javascript
var orderNumbers = [];
for (var i = 0; i < orders.length; i++) {
  orderNumbers.push(orders[i].number);
}
```

**Implementação básica:** `map` é uma função que, para cada item de uma coleção, chama uma função passando esse item como parâmetro. Essa função deve usar esse item para obter algum valor a partir dele (retornando alguma de suas propriedades, fazendo algum cálculo usando suas propriedades etc) e retornar esse valor. `map` irá acumular esses valores em uma coleção e retornar essa coleção.

```javascript
var map = function(list, operation) {
  var results = [];
  for (var i = 0; i < list.length; i++) {
    results.push(operation(list[i]));
  }
  return results;
}
```

Reescrevendo o exemplo usando `map`:

```javascript
var orderNumbers = map(orders, function(order) {
  return order.number;
});
```

<!-- ======================================================================= -->

## reduce

Você quer obter algum valor a partir da sua coleção que, de alguma forma, represente sua coleção. Como algum tipo de totalização.

**Caso de uso:** Quero saber o valor total de um pedido.

```javascript
var orderTotal = 0;
var order = orders[0]
for (var i = 0; i < order.items.length; i++) {
  var item = order.items[i];
  orderTotal += item.value * item.quantity;
}
```

**Implementação básica:** `reduce` é uma função que, para cada item de uma coleção, chama uma função passando esse item e um valor acumulador como parâmetros. Essa função deve usar esse item e o acumulador para calcular obter algum valor, que será o novo valor do acumulador. `reduce` recebe um valor inicial para o acumulador, que para adição é normalmente `0`.

```javascript
var reduce = function(list, operation, initial) {
  var accumulator = initial;
  for (var i = 0; i < list.length; i++) {
    accumulator = operation(accumulator, list[i]);
  }
  return accumulator;
}
```

Reescrevendo o exemplo usando `reduce`:

```javascript
var orderTotal = reduce(orders[0].items, function(acc, item) {
  return acc + (item.value * item.quantity);
}, 0)
```

<!-- ======================================================================= -->

## Combinando funções

Eu quero te mostrar um exemplo de como essas funções podem ser combinadas para tornar seu código mais conciso e expressivo. Suponha que queremos obter uma lista com o valor total de cada um dos pedidos. Poderíamos fazer:

```javascript
var totals = [];
for (var i = 0; i < orders.length; i++) {
  var order = orders[i];
  var total = 0;
  for (var j = 0; j < order.items.length; j++) {
    var item = order.items[j];
    total += item.value * item.quantity;
  }
  totals.push(total);
}
```

Genericamente, o que queremos é *mapear cada pedido a uma função* (`map`) que *reduza a um único valor o valor de seus items multiplicados pelas quantidades* (`reduce`), ou seja, que calcule o total de cada pedido:

```javascript
var totals = map(orders, function(order) {
  return reduce(order.items, function(acc, item) {
    return acc + (item.quantity * item.value);
  }, 0);
});
```

## Leitura adicional

Se você quer um material bala sobre Programação Funcional, confere o [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://github.com/DrBoolean/mostly-adequate-guide).

Alguns cursos em vídeo sobre o assunto: [Programming Languages](https://www.coursera.org/course/proglang) e [Functional Programming Principles in Scala](https://www.coursera.org/course/progfun).

Eu recomendo ainda que você leia algumas implementações reais das funções explicadas aqui no código fonte do [Underscore.js](http://underscorejs.org/).
