const { makeLexer, parseAST, parseValue } = require(".");
const lexer = makeLexer();

const BASIC = `
    <Hi there={42}> plain
      text <
    /Hi>
  `;

const COMPLICATED = `
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
      `;

describe("lexer", () => {
  it("should lex correctly", () => {
    lexer.reset("6");
    expect(lexer.next()).toMatchObject({ type: "number", value: "6" });
  });

  it("should push to jsxTag state and then recognize an identifier", () => {
    lexer.reset("true<blabla");
    expect(lexer.next()).toMatchObject({ type: "true", value: "true" });
    expect(lexer.next()).toMatchObject({ type: "<", value: "<" });
    expect(lexer.next()).toMatchObject({ type: "identifier", value: "blabla" });
  });
});

describe("parser", () => {
  it("should parse something complicated correctly", () => {
    expect(parseValue(COMPLICATED)).toEqual({
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

  it("should generate correct location data", () => {
    expect(parseAST(BASIC)).toEqual({
      type: "Element",
      loc: {
        start: { line: 2, column: 5, offset: 5 },
        end: { line: 4, column: 9, offset: 48 }
      },
      name: {
        type: "Name",
        loc: {
          start: { line: 2, column: 6, offset: 6 },
          end: { line: 2, column: 8, offset: 8 }
        },
        name: "Hi"
      },
      attributes: [
        {
          type: "Attribute",
          loc: {
            start: { line: 2, column: 9, offset: 9 },
            end: { line: 2, column: 19, offset: 19 }
          },
          name: {
            type: "Name",
            loc: {
              start: { line: 2, column: 9, offset: 9 },
              end: { line: 2, column: 14, offset: 14 }
            },
            name: "there"
          },
          value: {
            type: "Expression",
            loc: {
              start: { line: 2, column: 15, offset: 15 },
              end: { line: 2, column: 19, offset: 19 }
            },
            expression: {
              type: "Literal",
              value: 42,
              raw: "42",
              loc: {
                start: { line: 2, column: 16, offset: 16 },
                end: { line: 2, column: 18, offset: 18 }
              }
            }
          }
        }
      ],
      children: [
        {
          type: "Literal",
          value: " plain\n      text ",
          raw: " plain\n      text ",
          loc: {
            start: { line: 2, column: 20, offset: 20 },
            end: { line: 3, column: 12, offset: 38 }
          }
        }
      ]
    });
  });
});
