const nearley = require("nearley");
const grammar = require("./LJSX");

function parse(source) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(source);
  return simplify(parser.results[0]);
}

describe("LJSX.parse", () => {
  it("should parse interesting things correctly", () => {
    expect(
      parse(`
        <Button.NavLike
          name="Hello"
          someData={{ "a": [24, <a />] }}
          false={false}
          implicitlyTrue
          explicitlyNull={null}
        >
          Plain text is always a bit <svg:yep>boring</svg:yep>
          {[25, {}, "hello", <a.b.c> hi! </ a.b.c>]}
        </Button.NavLike>
      `)
    ).toEqual({
      _JSXElement: true,
      name: "Button.NavLike",
      attributes: {
        name: "Hello",
        someData: {
          a: [
            24,
            { _JSXElement: true, name: "a", attributes: {}, children: [] }
          ]
        },
        false: false,
        implicitlyTrue: true,
        explicitlyNull: null
      },
      children: [
        "\n          Plain text is always a bit ",
        {
          _JSXElement: true,
          name: "svg:yep",
          attributes: {},
          children: ["boring"]
        },
        "\n          ",
        [
          25,
          {},
          "hello",
          {
            _JSXElement: true,
            name: "a.b.c",
            attributes: {},
            children: [" hi! "]
          }
        ],
        "\n        "
      ]
    });
  });
});

function simplify(node) {
  switch (node.type) {
    case "Literal":
      return node.value;
    case "Array":
      return node.children.map(simplify);
    case "Object":
      return node.children.reduce((obj, { key, value }) => {
        return {
          ...obj,
          [key.value]: simplify(value)
        };
      }, {});
    case "Name":
      return node.name;
    case "Expression":
      return simplify(node.expression);
    case "Element":
      return {
        _JSXElement: true,
        name: simplify(node.name),
        attributes: node.attributes.reduce((obj, { name, value }) => {
          return {
            ...obj,
            [name.name]: typeof value === "undefined" ? true : simplify(value)
          };
        }, {}),
        children: node.children.map(simplify)
      };
    default:
      return node;
  }
}
