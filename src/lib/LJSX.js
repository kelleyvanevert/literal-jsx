import {
  regex,
  parse as arcParse,
  sequenceOf,
  possibly,
  decide,
  choice,
  char,
  many,
  between,
  takeRight,
  whitespace,
  takeLeft,
  fail,
  str,
  sepBy,
  endOfInput,
  toValue,
  recursiveParser
} from "arcsecond";
import IDENTIFIER_REGEX from "./IdentifierRegex";

const defaultFactory = (name, attributes, ...children) => ({
  name,
  attributes,
  children
});

const t = takeRight(whitespace);
const otherwise = x => y => (typeof y === "undefined" ? x : y);
const curlyBracketed = between(t(char("{")))(t(char("}")));
const squareBracketed = between(t(char("[")))(t(char("]")));
const commaSeparated = sepBy(t(char(",")));

export const JSONString = regex(/^\s*"[^"]*"/).map(str =>
  str.replace(/^\s*"/, "").replace(/"$/, "")
);

export const JSONNumber = regex(
  /^\s*-?\s*(0|[1-9][0-9]*)(\s*\.\s*[0-9]+)?(\s*[eE]\s*[-+]?\s*[0-9]+)?/
).map(str => parseFloat(str.replace(/ /g, "")));

export const JSONValue = (factory = defaultFactory) =>
  recursiveParser(() =>
    choice([
      JSXElement(factory), // (!) added
      JSONString,
      JSONNumber,
      JSONArray(factory),
      JSONObject(factory),
      t(str("true")).map(() => true),
      t(str("false")).map(() => false),
      t(str("null")).map(() => null)
    ])
  );

export const JSONArray = (factory = defaultFactory) =>
  squareBracketed(commaSeparated(JSONValue(factory)));

export const JSONObject = (factory = defaultFactory) =>
  curlyBracketed(
    commaSeparated(
      sequenceOf([JSONString, t(char(":")), JSONValue(factory)]).map(
        ([k, _, v]) => [k, v]
      )
    )
  ).map(pairs => pairs.reduce((o, [k, v]) => ({ ...o, [k]: v }), {}));

export const JSIdentifier = t(regex(IDENTIFIER_REGEX));

export const JSXName = sequenceOf([
  JSIdentifier,
  possibly(
    choice([
      takeRight(t(char(":")))(JSIdentifier).map(id => ":" + id),
      many(takeRight(t(char(".")))(JSIdentifier)).map(
        arr => (arr.length ? "." : "") + arr.join(".")
      )
    ])
  )
]).map(([a, b]) => a + b);

export const JSXAttribute = (factory = defaultFactory) =>
  sequenceOf([
    sequenceOf([
      JSIdentifier,
      possibly(takeRight(t(char(":")))(JSIdentifier)).map(id =>
        id ? ":" + id : ""
      )
    ]).map(([a, b]) => a + b),
    possibly(
      takeRight(t(char("=")))(
        choice([JSONString, curlyBracketed(JSONValue(factory))])
      )
    ).map(otherwise(true))
  ]);

export const JSXPlainText = regex(/^[^}{><]+/);

export const JSXChild = (factory = defaultFactory) =>
  recursiveParser(() =>
    choice([
      JSXPlainText,
      JSXElement(factory),
      curlyBracketed(JSONValue(factory))
    ])
  );

export const JSXElement = (factory = defaultFactory) =>
  sequenceOf([
    t(char("<")),
    JSXName,
    decide(openingName =>
      sequenceOf([
        many(JSXAttribute(factory)),
        choice([
          sequenceOf([t(char("/")), t(char(">"))]).map(() => []),
          sequenceOf([
            t(char(">")),
            many(JSXChild(factory)),
            t(char("<")),
            t(char("/")),
            JSXName,
            decide(closingName =>
              openingName === closingName
                ? t(char(">"))
                : fail("closing tag name must match opening tag name")
            )
          ]).map(arr => arr[1])
        ])
      ])
    )
  ]).map(([__, name, [attributes, children]]) => {
    return factory(name, attributes, ...children);
  });

export const makeParser = arcParser =>
  arcParse(takeLeft(arcParser)(t(endOfInput)));

export default {
  parse(str, h = defaultFactory) {
    return toValue(makeParser(JSXElement(h))(str));
  },
  parseJSON(str, h = defaultFactory) {
    return toValue(makeParser(JSONValue(h))(str));
  }
};
