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
  pipeParsers,
  endOfInput,
  takeLeft,
  takeRight,
  whitespace,
  recursiveParser,
  parse as arcParse
} from "arcsecond";

// TODO: whitespace

const t = takeRight(whitespace);
const tchar = (x: string) => t(char(x));
const tstr = (x: string) => t(char(x));

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

export const full = takeLeft(jsonVal)(t(endOfInput));

export const parse = arcParse(full);
