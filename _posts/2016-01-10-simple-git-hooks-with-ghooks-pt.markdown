---
layout: post
title: "Usando Git Hooks com Ghooks"
date: 2016-01-10T18:27:59-02:00
translation_id: 6c1babcd20a7f22e79eb0ed2fb75c0a4
keywords: git, hooks, workflow
author: rafaeleyng
excerpt: >
  Aprenda como usar git hooks facilmente para promover boas práticas em seu workflow.
translation_id: 6c1babcd20a7f22e79eb0ed2fb75c0a4
lang: pt
---

## git hooks

git disponibiliza uma forma de algumas vincular algumas ações (como commit, push) a rodarem scripts customizados. São os chamados *hooks* (ganchos), que podem rodar em diferentes momentos dessas ações e melhorar seu workflow de diversas formas. Alguns exemplos são evitar que um commit aconteça se houverem testes falhando, ou rodar algum tipo de ferramenta de build antes de fazer push.

Quando você cria um projeto git, são criados diversos exemplos de hooks dentro de `.git/hooks`. Nenhum deles será rodado porque todos tem a extensão `.sample`. Se você remover essa extensão, o hook passará a ser chamado.

## O que há de errado com git hooks

Seus git hooks ficam dentro da pasta `.git`. Esta pasta contém o seu histórico local de versionamento, e os arquivos dentro dela não são versionados da mesma forma que os arquivos do resto do seu projeto. O problema é que, mesmo que você crie um arquivo de hook, você não poderá fazer commit desse arquivo e push para seu remote, então esse arquivo não existirá para o resto do seu time.

## ghooks ao resgate!

Começe instalando ghooks:

```sh
npm i -D ghooks
```

Quando você fizer isso, ghooks irá criar uma série de arquivos dentro de `.git/hooks`. Mas agora isso não é mais um problema, porque todos que clonarem seu projeto também terão esses arquivos criados quando eles rodarem `npm install`. E todos esses arquivos de hooks criados são idênticos: eles simplesmente fazem `require` de ghooks e o chamam passando o próprio nome do arquivo de hook. Então, supondo que você faça um commit, git chama o hook, mas o hook chama ghooks, dizendo "git está rodando o pre-commit hook, faça o que você tiver que fazer".

ghooks irá então procurar o que você definiu para aquele hook. A forma de definir alguma ação para um hooke é, no seu `package.json`:

```js
"config": {
  "ghooks": {
    "pre-commit": "npm run test"
  }
}
```

Ainda que os git hooks (gerados pelo ghooks) estejam dentro da pasta `.git`, o código que será realmente executado não está. Agora você pode manter esse código versionado e consistente entre os membros do seu time.

### Um pouco de shell scripting

Programas são chamados, executados, e encerrados. Um programa encerra com um código numérico que diz se ele rodou com sucesso ou não. `0` é sucesso. Qualquer outro código é um erro.

Alguns hooks tem o poder de fazer com que a ação invocada (commit, por exemplo) não aconteça. *pre-commit* é um desses hooks. Se seu hook terminar com erro (não-zero), o commit não irá acontecer. Dessa forma, você pode rodar seu linter ou testes antes de fazer commit, e se eles falharem, terminarão com não-zero e o commit não irá acontecer.

### Um gotcha com códigos terminação

Você pode na verdade rodar mais de um comando no seu hook, por exemplo `npm run test; npm run build`.

Mas note que, para o git, apenas importa o código de terminação do último programa do seu hook. Então mesmo que `npm run test` falhe, `npm run build` poderia rodar com sucesso, e o commit iria acontecer.

Eu tive esse problema, em uma situação em que eu precisava fazer commit de um arquivo de bundle de JavaScript no meu projeto. Antes de fazer commit, meu hook rodava meu linter, testes e o bundler com configurações de ambiente de produção. Mas após rodar o bundler, eu precisaria adicionar o arquivo ao índice do git, então eu precisava rodar `git add dist/bundle.js`. Eu criei um npm script chamado `pre-commit` que iria chamar minha task de Gulp apropriada para fazer o bundle, então meu hook ficou assim: `npm run pre-commit; git add dist/bundle.js`.

Viu o problema? Mesmo que meu linter ou meus testes falhem, ou mesmo que meu bundler (Webpack) falhe, `git add dist/bundle.js` rodaria com sucesso e finalizaria com `0`. Meu commit **iria** acontecer, mas ele **não deveria**.

A solução foi usar um `if` do shell script (se você não sabe como o `if` do shell script funciona, não é como você espera das outras linguagens de programação):

```javascript
  "pre-commit": "if npm run pre-commit; then git add dist/bundle.js; else printf 'pre-commit error: fix the test and/or lint errors and commit again'; (exit 1); fi"
```

Vê o `(exit 1)`? Isso fará o hook terminar com não-zero, e o commit não irá acontecer.

### Evitando hooks

Suponha que você adicionou uma linha ao seu README. Você não quer rodar seu linter/testes/build antes de fazer commit. Apenas use:

```sh
git commit -m 'message' --no-verify
```

## Lista de git hooks

Veja a [documentação](https://git-scm.com/docs/githooks).
