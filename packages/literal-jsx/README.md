This is an example implementation of Literal JSX. (Note: it is not particularly fast, nor entirely corrrect. But for now it's _good enough_.)

## Literal JSX

<p align="center">
  <img src="./logo.svg" height="140" />
</p>

**Literal JSX** is a lightweight format for interchanging content structures potentially rich in shape and data. It extends JSON by adding an "Element" node type, which is shaped as JSX, but which can only contain literal (JSON) data structures. For more information, see http://literal-jsx.org/.

## Usage

```js
import LJSX from "literal-jsx";
```

Literal JSX is a conservative extension of JSON, so in particular, it will parse any JSON data structure.

```js
LJSX.parse(`{ "normal": ["json", "data] }`);
// { normal: ["json", "data"] }
```

Parse some typical JSX. By default, JSX elements are described by nodes of the shape `{ _JSXElement: true, name, attributes, children }`.

```js
LJSX.parse(`<Button size="large" primary>Hi {"there"}</Button>`);
// { _JSXElement: true,
//   name: "Button",
//   attributes: { size: "large", primary: true },
//   children: ["Hi ", "there"] }
```

If you pass it a factory function (such as a simple wrapper around `React.createElement` that does a component lookup by name), it will use that factory function to hydrate the JSX.

```js
const components = {
  Button,
  NavBar
};

const h = (name, attrs, ...children) =>
  React.createElement(components[name] || name, attrs, ...children);

LJSX.parse(`<Button size="large" primary>Hi {"there"}</Button>`, h);
// React.createElement(Button, { size: "large", primary: true }, "Hi ", "there")
```
