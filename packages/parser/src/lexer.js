const moo = require("moo");

const common = {
  space: { match: /\s+/, lineBreaks: true },
  string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/
};

module.exports = () =>
  moo.states({
    jsonValue: {
      ...common,
      number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
      "{": { match: "{", push: "jsonValue" },
      "}": { match: "}", pop: 1 },
      "[": "[",
      "]": "]",
      ",": ",",
      ":": ":",
      true: "true",
      false: "false",
      null: "null",
      plaintext: { match: /(?:(?!(?:\{|\}|<))[^])+/, lineBreaks: true },
      "<": { match: "<", push: "jsxTag" }
    },
    jsxTag: {
      ...common,
      "=": "=",
      ".": ".",
      ":": ":",
      identifier: require("./JSIdentifier"),
      "/": "/",
      ">": { match: ">", pop: 1 },
      "{": { match: "{", push: "jsonValue" }
    }
  });
