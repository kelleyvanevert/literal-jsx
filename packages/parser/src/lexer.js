import moo from "moo";

const space = { match: /\s+/, lineBreaks: true };
const string = /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/;

export default () =>
  moo.states({
    jsonValue: {
      space,
      string,
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
      plaintext: { match: /(?:(?!(?:```|\{|\}|<))[^])+/, lineBreaks: true },
      codeblock_backticks: { match: "```", push: "mdCodeBlock" },
      "<": { match: "<", push: "jsxTag" }
    },
    mdCodeBlock: {
      codeblock_backticks: { match: "```", pop: 1 },
      plaintext: { match: /(?:(?!(?:```))[^])+/, lineBreaks: true }
    },
    jsxTag: {
      space,
      string,
      "=": "=",
      ".": ".",
      ":": ":",
      identifier: require("./JSIdentifier"),
      "/": "/",
      ">": { match: ">", pop: 1 },
      "{": { match: "{", push: "jsonValue" }
    }
  });
