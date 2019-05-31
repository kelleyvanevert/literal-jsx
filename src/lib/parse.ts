import {
  str,
  sequenceOf,
  possibly,
  choice,
  many,
  many1,
  anythingExcept,
  digit,
  anyOfString,
  char,
  mapTo,
  sepBy,
  between,
  letter,
  regex,
  pipeParsers,
  endOfInput,
  takeLeft,
  takeRight,
  whitespace,
  recursiveParser,
  parse as arcParse
} from "arcsecond";

type Node = any & { type: string };

const t = takeRight(whitespace);
const tchar = (x: string) => t(char(x));

type parser = (source: string) => any;
const repeat = (n: number) => (p: parser) => sequenceOf(Array(n).fill(p));

const flat = (x: any) => (x.join ? x.map(flat).join("") : x);
const otherwise = <T>(x: T) => (y: null | T) => y || x;

const squareBracketed = between(tchar("["))(tchar("]"));
const curlyBracketed = between(tchar("{"))(tchar("}"));
const commaSeparated = sepBy(tchar(","));

// TODO actually follow the spec
export const jsonStr: (source: string) => string = pipeParsers([
  sequenceOf([tchar('"'), many(anythingExcept(char('"'))), char('"')]),
  mapTo((arr: ['"', string[], '"']) => arr[1].join(""))
]);

export const jsonNum: (source: string) => number = sequenceOf([
  possibly(tchar("-")).map((x: null | "-") => x || ""),
  t(
    choice([
      char("0"),
      sequenceOf([anyOfString("123456789"), many(t(digit))]).map(
        ([initial, rest]: [string, string[]]) => initial + rest.join("")
      )
    ])
  ),
  t(possibly(sequenceOf([char("."), many1(t(digit))]).map(flat))).map(
    otherwise("")
  ),
  possibly(
    sequenceOf([
      t(choice([char("e"), char("E")])),
      t(possibly(choice([char("-"), char("+")]))).map(otherwise("")),
      many1(t(digit))
    ])
  ).map(otherwise(""))
])
  .map(flat)
  .map(parseFloat);

export const jsonVal: (source: string) => unknown = recursiveParser(() =>
  t(
    choice([
      jsonStr,
      jsonNum,
      jsonArr,
      jsonObj,
      str("true").map(() => true),
      str("false").map(() => false),
      str("null").map(() => null)
    ])
  )
);

export const jsonArr: (source: string) => unknown[] = squareBracketed(
  commaSeparated(jsonVal)
);

export const jsonKeyValPair: (source: string) => [string, unknown] = sequenceOf(
  [jsonStr, tchar(":"), jsonVal]
).map(([k, _, v]: [string, string, unknown]) => [k, v]);

export const jsonObj: (source: string) => object = curlyBracketed(
  commaSeparated(jsonKeyValPair)
).map((pairs: [string, unknown][]) =>
  pairs.reduce<object>((o, [k, v]) => ({ ...o, [k]: v }), {})
);

export const UnicodeEscapeSeq = sequenceOf([
  str("u"),
  repeat(4)(anyOfString("0123456789abcdefABCDEF"))
]).map(flat);

export const IdentifierStart = choice([
  letter,
  anyOfString("$_"),
  sequenceOf([char("\\"), UnicodeEscapeSeq]).map(flat)
]);
export const IdentifierPart = choice([IdentifierStart, digit]);

export const JSXIdentifier = sequenceOf([IdentifierStart, many(IdentifierPart)])
  .map(flat)
  .map((name: string) => ({ type: "JSXIdentifier", name }));

export const JSXNamespacedName = sequenceOf([
  JSXIdentifier,
  char(":"),
  JSXIdentifier
]).map(([namespace, _, name]: [Node, ":", Node]) => ({
  type: "JSXNamespacedName",
  namespace,
  name
}));

// Actually, JSXIdentifier --or-- JSXMemberExpression
export const JSXMemberExpression = sequenceOf([
  JSXIdentifier,
  many(takeRight(char("."))(JSXIdentifier))
]).map(([initial, rest]: [Node, Node[]]) => {
  return rest.reduce<Node>(
    (object, property) => ({
      type: "JSXMemberExpression",
      object,
      property
    }),
    initial
  );
});

export const full = takeLeft(JSXMemberExpression)(t(endOfInput));

export const parse = arcParse(full);
