---
layout: post
title: "How to Use Axios as Your HTTP Client"
date: 2015-07-15T22:39:43-03:00
author: marlonbernardes
excerpt: >
  Axios is a promise-based HTTP client that works both in the browser and in a node.js environment. 
  In this post we'll see how to perform HTTP requests using it.
---

## Introduction

Axios is a promise-based HTTP client that works both in the browser and in a node.js environment. It basically provides a single API for dealing with `XMLHttpRequest`s and node’s `http` interface. Besides that, it wraps the requests using a polyfill for ES6 new's promise syntax. In this post we'll see how to perform HTTP requests using axios. Looks *promising*, right? Let's go!

## Installation

Using npm:

```
$ npm install axios --save
```

Using bower:

```
$ bower install axios
```

You can also dowload it manually at [https://github.com/mzabriskie/axios/tree/master/dist](https://github.com/mzabriskie/axios/tree/master/dist)

## First steps

After installing, performing requests becomes trivial. In this example, we’ll be performing requests to GitHub’s API.

```js
// Performing a GET request
axios.get('https://api.github.com/users/' + username)
  .then(function(response){
    console.log(response.data); // ex.: { user: 'Your User'}
    console.log(response.status); // ex.: 200
  });  

// Performing a POST request
axios.post('/save', { firstName: 'Marlon', lastName: 'Bernardes' })
  .then(function(response){
    console.log('saved successfully')
  });  
```

Besides `post` and `get`, there are also methods named after the http methods `delete`, `head`, `put` and `patch`. 

## Performing Multiple Requests simultaneously

To execute multiple requests in parallel, simply provide an array argument to `axios.all`. When both requests are complete, you'll receive an array containing the response objects in the same order they were sent. Alternatively you can use `axios.spread` to spread the array into multiple arguments. Spread is preferred since dealing with array indexes could be misleading.

```js
// Requests will be executed in parallel...
axios.all([
    axios.get('https://api.github.com/users/codeheaven-io');
    axios.get('https://api.github.com/users/codeheaven-io/repos')
  ])
  .then(axios.spread(function (userResponse, reposResponse) {
    //... but this callback will be executed only when both requests are complete.
    console.log('User', userResponse.data);
    console.log('Repositories', reposResponse.data);
  }));
```

## Running axios in node

It might be obvious now, but running the code above should be pretty straightforward. Install axios with npm and require it as you do with any other dependency in node:

```js
var axios = require('axios')
axios.get('https://api.github.com/users/codeheaven-io');
```

## Running axios in the browser

Simply import axios (using a `<script>` tag, requirejs, browserify, webpack etc)

```html
<script src="./bower_components/axios/dist/axios.js"></script>
axios.get('https://api.github.com/users/codeheaven-io');
```


You can read more information about axios here: [https://github.com/mzabriskie/axios](https://github.com/mzabriskie/axios)
