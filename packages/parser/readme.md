This is an example implementation of a Literal JSX parser, built with [nearley.js](https://nearley.js.org) + [moo](https://github.com/no-context/moo).

## Literal JSX

<p align="center">
  <img src="https://user-images.githubusercontent.com/43432/58766059-90999780-857a-11e9-91df-7a42baa79c38.png" height="140" />
</p>

**Literal JSX** is a lightweight format for interchanging content structures potentially rich in shape and data. It extends JSON by adding an "Element" node type, which is shaped as JSX, but which can only contain literal (JSON) data structures. For more information, see http://literal-jsx.org/.

## Usage

```js
import {
  // converts LJSX to an AST similar to Babel's output
  parseAST,

  // converts LJSX directly to a value
  // (you can optionally pass it a component hydration factory)
  parseValue,

  // create a moo lexer like the one used under the hood
  makeLexer,

  // the nearley.js generated grammar
  grammar,

  // for if you want to stream feed the nearley.js parser
  Parser
} from "literal-jsx";
```

_Note: line/col numbers come from moo, and are 1-based; offsets are 0-based._

Literal JSX is a conservative extension of JSON, so in particular, it will parse any JSON data structure.

```js
parseValue(`{ "normal": ["json", "data"] }`);
// { normal: ["json", "data"] }
```

Parse some typical JSX. By default, JSX elements are described by nodes of the shape `{ _JSXElement: true, name, attributes, children }`.

```js
parseValue(`<Button size="large" primary>Hi {"there"}</Button>`);
// { _JSXElement: true,
//   name: "Button",
//   attributes: { size: "large", primary: true },
//   children: ["Hi ", "there"] }
```

If you pass it a factory function (such as a simple wrapper around `React.createElement` that does a component lookup by name), it will use that factory function to hydrate the JSX. For example:

```js
const components = {
  Button,
  NavBar
};

const h = (name, attrs, ...children) =>
  React.createElement(components[name] || name, attrs, ...children);

parseValue(`<Button size="large" primary>Hi {"there"}</Button>`, h);
// React.createElement(Button, { size: "large", primary: true }, "Hi ", "there")
```
