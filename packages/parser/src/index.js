const nearley = require("nearley");
const makeLexer = require("./lexer");
const grammar = require("./grammar");

class Parser extends nearley.Parser {
  constructor() {
    super(nearley.Grammar.fromCompiled(grammar));
  }
}

function parseAST(source) {
  const parser = new Parser();
  parser.feed(source);
  if (parser.results[0]) {
    return parser.results[0];
  } else {
    throw new Error("could not parse");
  }
}

function parseValue(source, h = defaultFactory) {
  const ast = parseAST(source);
  return toValue(ast, h);
}

module.exports = {
  makeLexer,
  grammar,
  Parser,
  parseAST,
  parseValue
};

function defaultFactory(name, attributes, ...children) {
  return {
    _JSXElement: true,
    name,
    attributes,
    children
  };
}

function toValue(node, h) {
  switch (node.type) {
    case "Literal":
      return node.value;
    case "Array":
      return node.children.map(child => toValue(child, h));
    case "Object":
      return node.children.reduce((obj, { key, value }) => {
        return {
          ...obj,
          [key.value]: toValue(value, h)
        };
      }, {});
    case "Name":
      return node.name;
    case "Expression":
      return toValue(node.expression, h);
    case "Element":
      return h(
        toValue(node.name, h),
        node.attributes.reduce((obj, { name, value }) => {
          return {
            ...obj,
            [name.name]: typeof value === "undefined" ? true : toValue(value, h)
          };
        }, {}),
        ...node.children.map(child => toValue(child, h))
      );
    default:
      return node;
  }
}
