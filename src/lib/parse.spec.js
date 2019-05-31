import { parse as arcParse, endOfInput, takeLeft, toValue } from "arcsecond";
import {
  JSXIdentifier,
  JSXNamespacedName,
  JSXMemberExpression,
  JSXElementName,
  JSXSelfClosingElement,
  JSXClosingElement
} from "./parse";

const parse = parser => arcParse(takeLeft(parser)(endOfInput));

describe("parse", () => {
  describe("JSXIdentifier", () => {
    it("should parse valids", () => {
      ["kelley", "_kelley", "_123", "_", "\\u1b5Fk"].forEach(name => {
        expect(parse(JSXIdentifier)(name)).toEqual({
          value: {
            type: "JSXIdentifier",
            name: name
          }
        });
      });
    });
    it("should not parse invalids", () => {
      ["9", "&k", "\\u78i9", ""].forEach(name => {
        expect(() => toValue(parse(JSXIdentifier)(name))).toThrow();
      });
    });
  });

  describe("JSXNamespacedName", () => {
    it("should parse valids", () => {
      ["kelley:abc", "_:a", "_123:_456", "_:_", "\\u1b5Fk:\\u1b5Fk"].forEach(
        str => {
          expect(parse(JSXNamespacedName)(str)).toEqual({
            value: {
              type: "JSXNamespacedName",
              namespace: {
                type: "JSXIdentifier",
                name: str.split(":")[0]
              },
              name: {
                type: "JSXIdentifier",
                name: str.split(":")[1]
              }
            }
          });
        }
      );
    });
    it("should not parse invalids", () => {
      ["kelley:", ":a", "_123", "kelley", ""].forEach(str => {
        expect(() => toValue(parse(JSXNamespacedName)(str))).toThrow();
      });
    });
  });

  describe("JSXMemberExpression", () => {
    it("should parse valids", () => {
      expect(parse(JSXMemberExpression)("a.b.c")).toEqual({
        value: {
          type: "JSXMemberExpression",
          object: {
            type: "JSXMemberExpression",
            object: {
              type: "JSXIdentifier",
              name: "a"
            },
            property: {
              type: "JSXIdentifier",
              name: "b"
            }
          },
          property: {
            type: "JSXIdentifier",
            name: "c"
          }
        }
      });
    });
  });

  describe("JSXElementName", () => {
    it("should parse valids", () => {
      ["kelley", "_kelle", "_123", "_", "\\u1b5Fk"].forEach(name => {
        expect(parse(JSXElementName)(name)).toEqual({
          value: {
            type: "JSXIdentifier",
            name: name
          }
        });
      });
      ["kelley:abc", "_:a", "_123:_456", "_:_", "\\u1b5Fk:\\u1b5Fk"].forEach(
        str => {
          expect(parse(JSXElementName)(str)).toEqual({
            value: {
              type: "JSXNamespacedName",
              namespace: {
                type: "JSXIdentifier",
                name: str.split(":")[0]
              },
              name: {
                type: "JSXIdentifier",
                name: str.split(":")[1]
              }
            }
          });
        }
      );
      expect(parse(JSXElementName)("a.b.c")).toEqual({
        value: {
          type: "JSXMemberExpression",
          object: {
            type: "JSXMemberExpression",
            object: {
              type: "JSXIdentifier",
              name: "a"
            },
            property: {
              type: "JSXIdentifier",
              name: "b"
            }
          },
          property: {
            type: "JSXIdentifier",
            name: "c"
          }
        }
      });
    });
  });

  describe("JSXClosingElement", () => {
    it("should parse valids", () => {
      expect(parse(JSXClosingElement)("</ Button._4>")).toEqual({
        value: {
          type: "JSXClosingElement",
          name: {
            type: "JSXMemberExpression",
            object: {
              type: "JSXIdentifier",
              name: "Button"
            },
            property: {
              type: "JSXIdentifier",
              name: "_4"
            }
          }
        }
      });
    });
  });

  describe("JSXSelfClosingElement", () => {
    it("should parse valids", () => {
      expect(
        parse(JSXSelfClosingElement)('<Button._4 a="b" name={[2,3,{}]} />')
      ).toEqual({
        value: {
          type: "JSXOpeningElement",
          name: {
            type: "JSXMemberExpression",
            object: {
              type: "JSXIdentifier",
              name: "Button"
            },
            property: {
              type: "JSXIdentifier",
              name: "_4"
            }
          },
          attributes: [
            {
              type: "JSXAttribute",
              name: {
                type: "JSXIdentifier",
                name: "a"
              },
              value: {
                type: "Literal",
                value: "b"
              }
            },
            {
              type: "JSXAttribute",
              name: {
                type: "JSXIdentifier",
                name: "name"
              },
              value: {
                type: "JSXExpressionContainer",
                expression: {
                  type: "Literal",
                  value: [2, 3, {}]
                }
              }
            }
          ],
          selfClosing: true
        }
      });
    });
  });
});
