import {
  str,
  sequenceOf,
  namedSequenceOf,
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

const t = takeRight(whitespace);
const tchar = x => t(char(x));

const repeat = n => p => sequenceOf(Array(n).fill(p));

const flat = x => (x.join ? x.map(flat).join("") : x);
const otherwise = x => y => y || x;

const squareBracketed = between(tchar("["))(tchar("]"));
const curlyBracketed = between(tchar("{"))(tchar("}"));
const commaSeparated = sepBy(tchar(","));

// TODO actually follow the spec
export const jsonStr = pipeParsers([
  sequenceOf([tchar('"'), many(anythingExcept(char('"'))), char('"')]),
  mapTo(arr => arr[1].join(""))
]);

export const jsonNum = sequenceOf([
  possibly(tchar("-")).map(x => x || ""),
  t(
    choice([
      char("0"),
      sequenceOf([anyOfString("123456789"), many(t(digit))]).map(
        ([initial, rest]) => initial + rest.join("")
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

export const jsonVal = recursiveParser(() =>
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

export const jsonArr = squareBracketed(commaSeparated(jsonVal));

export const jsonKeyValPair = sequenceOf([jsonStr, tchar(":"), jsonVal]).map(
  ([k, _, v]) => [k, v]
);

export const jsonObj = curlyBracketed(commaSeparated(jsonKeyValPair)).map(
  pairs => pairs.reduce((o, [k, v]) => ({ ...o, [k]: v }), {})
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
  .map(name => ({ type: "JSXIdentifier", name }));

export const JSXNamespacedName = sequenceOf([
  JSXIdentifier,
  char(":"),
  JSXIdentifier
]).map(([namespace, _, name]) => ({
  type: "JSXNamespacedName",
  namespace,
  name
}));

// Actually, JSXIdentifier --or-- JSXMemberExpression
export const JSXMemberExpression = sequenceOf([
  JSXIdentifier,
  many(takeRight(tchar("."))(t(JSXIdentifier)))
]).map(([initial, rest]) => {
  return rest.reduce(
    (object, property) => ({
      type: "JSXMemberExpression",
      object,
      property
    }),
    initial
  );
});

export const JSXElementName = choice([JSXNamespacedName, JSXMemberExpression]);

export const JSXAttribute = namedSequenceOf([
  ["name", choice([JSXNamespacedName, JSXIdentifier])],
  [
    "value",
    possibly(
      takeRight(tchar("="))(
        choice([
          jsonStr.map(value => ({
            type: "Literal",
            value
          })),
          curlyBracketed(jsonVal).map(value => ({
            type: "JSXExpressionContainer",
            expression: {
              type: "Literal",
              value
            }
          }))
        ])
      )
    ).map(otherwise(undefined))
  ]
]).map(({ name, value }) => ({
  type: "JSXAttribute",
  name,
  value
}));

export const JSXSelfClosingElement = between(tchar("<"))(
  sequenceOf([tchar("/"), tchar(">")])
)(
  namedSequenceOf([
    ["name", t(JSXElementName)],
    ["attributes", many(t(JSXAttribute))]
  ])
).map(({ name, attributes }) => ({
  type: "JSXOpeningElement",
  name,
  attributes,
  selfClosing: true
}));

export const JSXOpeningElement = between(tchar("<"))(tchar(">"))(
  namedSequenceOf([
    ["name", t(JSXElementName)],
    ["attributes", many(t(JSXAttribute))]
  ])
).map(({ name, attributes }) => ({
  type: "JSXOpeningElement",
  name,
  attributes,
  selfClosing: false
}));

export const JSXClosingElement = between(sequenceOf([tchar("<"), tchar("/")]))(
  tchar(">")
)(t(JSXElementName)).map(name => ({
  type: "JSXClosingElement",
  name
}));

export const full = takeLeft(JSXClosingElement)(t(endOfInput));

export const parse = arcParse(full);
