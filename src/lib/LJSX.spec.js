import { parse as arcParse, endOfInput, takeLeft, toValue } from "arcsecond";
import { JSIdentifier } from "./LJSX";

const parse = parser => arcParse(takeLeft(parser)(endOfInput));

describe("parse", () => {
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
});
