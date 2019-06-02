This is an example implementation of Literal JSX. (Note: it is not particularly fast, nor entirely corrrect. But for now it's _good enough_.)

## Literal JSX

<p align="center">
  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iLTE1MCAtMTAwIDMwMCAyMDAi%0D%0AIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8bGlu%0D%0AZWFyR3JhZGllbnQgaWQ9ImJ3X3ZlcnQiIHgyPSIwIiB5Mj0iMSI+CiAgICA8c3RvcCBvZmZzZXQ9%0D%0AIjAlIiBzdG9wLWNvbG9yPSIjY2NjIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiLz4KICA8L2xp%0D%0AbmVhckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0iYndfaG9yeiI+CiAgICA8c3RvcCBv%0D%0AZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjY2NjIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiLz4K%0D%0AICA8L2xpbmVhckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JlZW5fdmVydCIgeDI9%0D%0AIjAiIHkyPSIxIj4KICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNiOWM3YzYiLz4K%0D%0AICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwNjc1ZCIgLz4KICA8L2xpbmVh%0D%0AckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JlZW5faG9yeiI+CiAgICA8c3RvcCBv%0D%0AZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjYjljN2M2Ii8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUi%0D%0AIHN0b3AtY29sb3I9IiMwMDY3NWQiIC8+CiAgPC9saW5lYXJHcmFkaWVudD4KICA8ZyBzdHJva2U9%0D%0AInJnYmEoMCwwLDAsLjEpIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0i%0D%0Acm91bmQiPgogICAgPHBhdGggZmlsbD0idXJsKCNid192ZXJ0KSIgZD0iTTExMi4yNDU2NDM2MyA2%0D%0AMS4yOTEzNzYzOGwyOC4wNjE0MTA5LTE5LjE5Nzg0NDFMNTYuMTIyODIxODEtMTUuNWwxMTIuMjQ1%0D%0ANjQzNjMtNzYuNzkxMzc2MzhoLTU2LjEyMjgyMTgxTDAtMTUuNXoiIHRyYW5zZm9ybT0idHJhbnNs%0D%0AYXRlKC0xNDAuMzA3MDU0NTMpIi8+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI2J3X2hvcnopIiBkPSJN%0D%0ANTYuMTIyODIxODEtMTUuNUw3OC43NzkxMDkgMGw4OS41ODkzNTY0NS02MS4yOTEzNzYzOEwyODAu%0D%0ANjE0MTA5MDcgMTUuNXYtMzFMMTY4LjM2ODQ2NTQ0LTkyLjI5MTM3NjM4eiIgdHJhbnNmb3JtPSJ0%0D%0AcmFuc2xhdGUoLTE0MC4zMDcwNTQ1MykiLz4KICAgIDxnPgogICAgICA8cGF0aCBmaWxsPSJ1cmwo%0D%0AI2J3X3ZlcnQpIiBkPSJNMTEyLjI0NTY0MzYzIDYxLjI5MTM3NjM4bDI4LjA2MTQxMDktMTkuMTk3%0D%0AODQ0MUw1Ni4xMjI4MjE4MS0xNS41bDExMi4yNDU2NDM2My03Ni43OTEzNzYzOGgtNTYuMTIyODIx%0D%0AODFMMC0xNS41eiIgdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDcwLjE1MzUyNzI3IDApIi8+CiAgICAg%0D%0AIDxwYXRoIGZpbGw9InVybCgjYndfaG9yeikiIGQ9Ik01Ni4xMjI4MjE4MS0xNS41TDc4Ljc3OTEw%0D%0AOSAwbDg5LjU4OTM1NjQ1LTYxLjI5MTM3NjM4TDI4MC42MTQxMDkwNyAxNS41di0zMUwxNjguMzY4%0D%0ANDY1NDQtOTIuMjkxMzc2Mzh6IiB0cmFuc2Zvcm09InJvdGF0ZSgxODAgNzAuMTUzNTI3MjcgMCki%0D%0ALz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==" height="140" />
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
