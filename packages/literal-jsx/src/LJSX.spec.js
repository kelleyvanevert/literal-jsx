import { parse as arcParse, endOfInput, takeLeft, toValue } from "arcsecond";
import LJSX, { JSIdentifier, JSONValue } from "./LJSX";

const parse = parser => arcParse(takeLeft(parser)(endOfInput));

describe("JSIdentifier", () => {
  it("should parse valids", () => {
    ["kelley", "_kelley", "_123", "_"].forEach(name => {
      expect(toValue(parse(JSIdentifier)(name))).toBeTruthy();
    });
  });
  it("should not parse invalids", () => {
    ["9", "&k", "\\u78i9", ""].forEach(name => {
      expect(() => toValue(parse(JSIdentifier)(name))).toThrow();
    });
  });
});

describe("LJSX.parse", () => {
  it("should parse interesting things correctly", () => {
    expect(
      LJSX.parse(`
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
            { _JSXElement: true, name: "a", attributes: null, children: [] }
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
          attributes: null,
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
            attributes: null,
            children: [" hi! "]
          }
        ],
        "\n        "
      ]
    });
  });
});
