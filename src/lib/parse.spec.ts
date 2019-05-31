import { parse, toValue } from "arcsecond";
import { JSXIdentifier, JSXNamespacedName, JSXMemberExpression } from "./parse";

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
});
