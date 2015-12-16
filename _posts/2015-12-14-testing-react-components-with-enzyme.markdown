---
layout: post
title: "Testing React Components With Enzyme"
date: 2015-12-14T12:51:46-02:00
translation_id: 265ad0b488c037ed974acb0c2be0190b
keywords: react, testing, javascript
author: marlonbernardes
excerpt: >
  Enzyme is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components' output.

  In this post we will see how to use it to make our components' tests more isolated and reliable.
---

## Introduction

Enzyme is a JavaScript utility library for testing React components. I recently discovered about it and decided to give it a try: I liked it so much that I decided to rewrite all my tests using it. Below you'll find how to get started and also some tips on how to properly unit test your React components.

To install Enzyme, simply run the following commands in your project's folder:

```js
  npm install enzyme --save-dev
  npm i --save-dev react-addons-test-utils
  npm i --save-dev react-dom
```

After that, you can simply import the methods `shallow`/`mount`/`render` from `enzyme.`. Importing React's TestUtils is not needed anymore.

```js
import { shallow, mount } from 'enzyme';
```

## A little background, or why use Enzyme

Let's say you're writing a component that will represent a table's row:

```html
import React, {PropTypes} from 'react';
import TableColumn from './TableColumn.jsx';

export default class TableRow extends React.Component {

  render () {
    return (
      <tr>
        <TableColumn content="first column" />
        <TableColumn content="second column" />
      </tr>
    );
  }
}

```

Pretty straightforward. Now, let's test it, using React's TestUtils:

```js
it('should contain two table columns', () => {
  const row = TestUtils.renderIntoDocument(<TableRow />)
  const columns = TestUtils.scryRenderedDOMComponentsWithType(row, TableColumn);
  expect(columns).to.have.length.of(2);
});
```

The first problem I see with this approach is that we're not testing our component as a unit. Let's say our component `TableColumn` has a syntax error. I would expect only the TableColumn tests to fail, but since `TestUtils.renderIntoDocument` renders the whole component tree, all our TableRow tests would fail too! The higher we are in the component hierarchy, the worst!

Anyway, this is the output after running this test:

```
Error: Invariant Violation: findComponentRoot(..., .g): Unable to find element.
This probably means the DOM was unexpectedly mutated (e.g., by the browser),
usually due to forgetting a <tbody> when using tables, nesting tags like
<form>, <p>, or <a>, or using non-SVG elements in an <svg> parent.
Try inspecting the child nodes of the element with React ID.
```

Wow! It didn't work as we expected, React threw an error.

This happens because a `<tr>` element **should** be inside a table's tbody. Rendering a `<tr>` alone, as we're doing, is not valid. We could render the whole table, but we have a better option. Shallow Rendering to the rescue!

## Testing with Enzyme: Shallow Rendering

Shallow rendering let us render our component without touching the DOM. It also let us test our component as a unit, since it renders our component only one-level deep. Errors in children components wouldn't propagate to top level components, making our tests more isolated and reliable.

React provides the method `TestUtils.createRenderer` for shallow rendering, but we'll be using Airbnb's Enzyme, a JavaScript library *that makes it easier to assert, manipulate, and traverse your React Components' output.*

Our test, rewritten using Enzyme, would look like this:

```js
import { shallow } from 'enzyme';

it('should contain two table columns', () => {
  const row = shallow(<TableRow />)
  const columns = row.find(TableColumn);
  expect(columns).to.have.length.of(2);
});
```

## Finding elements with Enzyme

In the example above, we used the method `find`, one of the beauties of Enzyme. We all gotta agree that `find` is a better name than React's  `scryRenderedComponentsWithTypeWhyTheHellThisNameIsSoLong`. Most Enzyme method names were based on names from jQuery API.

Beyond that, the method `find` has several different uses:

  - **Finding elements using css selectors:**

```js
component.find('.my-class'); // by class name
component.find('#my-id'); // by id
component.find('td'); // by tag
component.find('div.custom-class'); // by compound selector
```

  - **Finding elements using their properties:**

```js
component.find(TableRow); // by constructor
component.find('TableRow'); // by display name
```

If you're familiar with React's TestUtils you have noticed that `find` alone can be used in place of (and has more power than)  `scryRenderedDOMComponentsWithClass`, `scryRenderedDOMComponentsWithTag` and `scryRenderedComponentsWithType`. Amazing!

## Other useful examples

Below you'll find some useful methods for testing your React components using Enzyme. I won't be covering all methods available in their API, but there is a link for their documentation in the end of this article.

```js
  const row = shallow(<TableRow columns={5}/>)
  // Using prop to retrieve the columns property
  expect(row.prop('columns')).to.eql(5);
  // Using 'at' to retrieve the forth column's content
  expect(row.find(TableColumn).at(3).prop('content')).to.exist;
  // Using first and text to retrieve the columns text content
  expect(row.find(TableColumn).first().text()).to.eql('First column');

  // Simulating events
  const button = shallow(<MyButton />);
  button.simulate('click');
  expect(button.state('myActionWasPerformed')).to.be.true;
```

## Full Rendering

```js
import { mount } from 'enzyme';
```

Quoting their docs, full rendering  *is ideal for use cases where you have components that may interact with DOM apis, or may require the full lifecycle in order to fully test the component (ie, componentDidMount etc.). Full DOM rendering depends on a library called jsdom which is essentially a headless browser implemented completely in JS.*.

Differently from shallow rendering, full rendering interacts with the DOM and renders the whole component tree.

```
it('allows us to set props', () => {
  // Use the method 'mount' to perform a full render
  const foo = mount(<Foo bar='baz' />);
  expect(wrapper.prop('bar')).to.equal('baz');
  foo.setProps({ bar: 'foo' });
  expect(wrapper.props('bar')).to.equal('foo');
});
```

## Conclusion

Enzyme is a great test utility for React. It provides a well written API (and intuitive to use), has a great documentation and it's methods make it easier to unit test React components'. I suggest that you give it a try!


## References

- [Enzyme GitHub](https://github.com/airbnb/enzyme)
- [Enzyme API Docs](http://airbnb.io/enzyme/)
- [React Test Utilities](https://facebook.github.io/react/docs/test-utils.html)
