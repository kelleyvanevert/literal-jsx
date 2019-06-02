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
  endOfInput,
  recursiveParser
} from "arcsecond";
import IDENTIFIER_REGEX from "./IdentifierRegex";

// TODO incorporate here, with simpler regex usage and factory fn
import { jsonStr, jsonVal } from "./parse";

const defaultFactory = (name, attributes, children) => ({
  name,
  attributes,
  children
});

const t = takeRight(whitespace);
const otherwise = x => y => y || x;
const curlyBracketed = between(t(char("{")))(t(char("}")));

export const Identifier = regex(IDENTIFIER_REGEX);

export const Name = sequenceOf([
  t(Identifier),
  possibly(
    choice([
      takeRight(t(char(":")))(t(Identifier)).map(id => ":" + id),
      many(takeRight(t(char(".")))(t(Identifier))).map(
        arr => (arr.length ? "." : "") + arr.join(".")
      )
    ])
  )
]).map(([a, b]) => a + b);

export const Attribute = (factory = defaultFactory) =>
  sequenceOf([
    sequenceOf([
      t(Identifier),
      possibly(takeRight(t(char(":")))(t(Identifier))).map(id =>
        id ? ":" + id : ""
      )
    ]).map(([a, b]) => a + b),
    possibly(
      takeRight(t(char("=")))(choice([jsonStr, curlyBracketed(jsonVal)]))
    ).map(otherwise(true))
  ]);

export const Child = (factory = defaultFactory) =>
  recursiveParser(() => choice([Element(factory), curlyBracketed(jsonVal)]));

export const Element = (factory = defaultFactory) =>
  sequenceOf([
    t(char("<")),
    Name,
    decide(openingName =>
      sequenceOf([
        many(Attribute(factory)),
        choice([
          sequenceOf([t(char("/")), t(char(">"))]).map(() => []),
          sequenceOf([
            t(char(">")),
            many(Child(factory)),
            t(char("<")),
            t(char("/")),
            Name,
            decide(closingName =>
              openingName === closingName
                ? t(char(">"))
                : fail("closing tag name must match opening tag name")
            )
          ]).map(arr => arr[1])
        ])
      ])
    )
  ]).map(([name, attributes, children]) => {
    return factory(name, attributes, children);
  });

export const Fragment = (factory = defaultFactory) =>
  sequenceOf([
    t(char("<")),
    t(char(">")),
    many(Child(factory)),
    t(char("<")),
    t(char("/")),
    t(char(">"))
  ]).map(arr => arr[2]);

export const makeParser = arcParser =>
  arcParse(takeLeft(arcParser)(t(endOfInput)));

export default {
  parse(str, h) {
    return makeParser(Element(h))(str);
  }
};
