import {
  str,
  sequenceOf,
  possibly,
  choice,
  many,
  anythingExcept,
  digit,
  digits,
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

const squareBracketed = between(tchar("["))(tchar("]"));
const curlyBracketed = between(tchar("{"))(tchar("}"));
const commaSeparated = sepBy(tchar(","));

// TODO actually follow the spec
export const jsonStr: (source: string) => string = pipeParsers([
  sequenceOf([tchar('"'), many(anythingExcept(char('"'))), char('"')]),
  mapTo((arr: ['"', string[], '"']) => arr[1].join(""))
]);

export const jsonNum: (source: string) => number = pipeParsers([
  sequenceOf([
    t(possibly(char("-"))),
    t(choice([char("0"), sequenceOf([anyOfString("123456789"), many(digit)])])),
    t(possibly(sequenceOf([char("."), digits]))),
    possibly(
      sequenceOf([
        t(choice([char("e"), char("E")])),
        t(possibly(choice([char("-"), char("+")]))),
        t(digits)
      ])
    )
  ]),
  mapTo(
    ([s, n, d, e]: [
      null | "-",
      "0" | [string, string[]],
      null | [".", string],
      null | ["e" | "E", null | "-" | "+", string]
    ]) => {
      if (n === "0") return 0;
      const sign = s ? -1 : 1;
      const num =
        sign * parseFloat(n[0] + n[1].join("") + (d ? "." + d[1] : ""));
      return (
        num * Math.pow(10, e ? (e[1] === "-" ? -1 : 1) * parseInt(e[2]) : 0)
      );
    }
  )
]);

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

export const full = takeLeft(jsonVal)(endOfInput);

export const parse = arcParse(full);
