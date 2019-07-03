import moo from "moo";

const identifier = require("./JSIdentifier");
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
      codeblock_backticks: { match: "```", push: "mdCodeBlock" },
      inlinecode_backtick: { match: "`", push: "mdInlineCode" },
      plaintext: { match: /(?:(?!(?:\`|\{|\}|<))[^])+/, lineBreaks: true },
      "<": { match: "<", push: "jsxTag" }
    },
    mdInlineCode: {
      inlinecode_backtick: { match: "`", pop: 1 },
      plaintext: { match: /(?:(?!(?:`))[^])+/, lineBreaks: true }
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
      identifier,
      selfclose: { match: /\/\s*>/, pop: 1, lineBreaks: true },
      "/": "/",
      ">": { match: ">", next: "jsxChild" },
      "{": { match: "{", push: "jsonValue" }
    },
    jsxClosingTag: {
      space,
      ".": ".",
      ":": ":",
      identifier,
      ">": { match: ">", pop: 1 }
    },
    jsxChild: {
      "{": { match: "{", push: "jsonValue" },
      startclose: { match: /<\s*\//, next: "jsxClosingTag", lineBreaks: true },
      "<": { match: "<", push: "jsxTag" },
      codeblock_backticks: { match: "```", push: "mdCodeBlock" },
      inlinecode_backtick: { match: "`", push: "mdInlineCode" },
      plaintext: { match: /(?:(?!(?:\`|\{|<))[^])+/, lineBreaks: true }
    }
  });
