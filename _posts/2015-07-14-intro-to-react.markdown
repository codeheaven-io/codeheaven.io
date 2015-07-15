---
layout: post
title: "Intro to React"
date: 2015-07-14T03:16:14-03:00
author: marlonbernardes
---

# Introduction

Today we are going to kick off the first installment in a new series of tutorials, Learning React, that will focus on becoming proficient and effective with Facebook’s React library. Before we start building anything meaningful, its important that we cover some base concepts first, so lets get this party started.

# What is React?

React is a UI library developed at Facebook to facilitate the creation of interactive, stateful & reusable UI components. It is used at Facebook in production, and Instagram.com is written entirely in React.

One of it’s unique selling points is that not only does it perform on the client side, but it can also be rendered server side, and they can work together inter-operably.

It also uses a concept called the Virtual DOM that selectively renders subtrees of nodes based upon state changes. It does the least amount of DOM manipulation possible in order to keep your components up to date.

# How does the Virtual DOM work?

Imagine you had an object that you modeled around a person. It had every relevant property a person could possibly have, and mirrored the persons current state. This is basically what React does with the DOM.

Now think about if you took that object and made some changes. Added a mustache, some sweet biceps and Steve Buscemi eyes. In React-land, when we apply these changes, two things take place. First, React runs a “diffing” algorithm, which identifies what has changed. The second step is reconciliation, where it updates the DOM with the results of diff.

The way React works, rather than taking the real person and rebuilding them from the ground up, it would only change the face and the arms. This means that if you had text in an input and a render took place, as long as the input’s parent node wasn’t scheduled for reconciliation, the text would stay undisturbed.

Because React is using a fake DOM and not a real one, it also opens up a fun new possibility. We can render that fake DOM on the server, and boom, server side React views.

# Page Setup

When setting up your page, you want to include react.js and JSXTransformer.js, and then write your component in a script node with type set to text/jsx:


```java
public class Test {
  
  public static void main(String[] args){
    String s = "aeee";
  }
}
```

In React, components mount to an element, so in this example we can use the div mount-point as it’s parent container.

While this is the easiest way to get started, when its time to actually build something, its probably a good idea to use Browserify or webpack and set your components up in separate files.

# The Basics

React’s basic building blocks are called components. Lets write one:

``` html
<script type="text/jsx">
    /** @jsx React.DOM */
    React.render(
        <h1>Hello, world!</h1>,
        document.getElementById('myDiv')
    );
</script>
```

A CSS Snippet

```css
/* simple comment */ 
.page-title {
  font-size: 3rem;
  text-transform: uppercase;
}
```

# State

The render method is the only required spec for creating a component, but there are several lifecycle methods & specs we can use that are mighty helpful when you actually want your component to do anything.

**Lifecycle Methods**

  - `componentWillMount` – Invoked once, on both client & server before rendering occurs. 
  - `componentDidMount` – Invoked once, only on the client, after rendering occurs
  - `bla` - test


