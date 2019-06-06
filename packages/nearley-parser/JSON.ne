# Initially based on [https://github.com/kach/nearley/blob/master/examples/json.ne],
#  and then reworked to resemble JSON parse from [https://astexplorer.net/]

# JSON [https://json.org/]

# Tested with nearleyc v2.16.0

# interface Pos {
#   line: number;
#   column: number;
#   offset: number;
# }

# interface Loc {
#   start: Pos;
#   end: Pos;
# }

# interface Node {
#   type: string;
#   loc: Loc;
# }

# interface PrimitiveLiteral extends Node {
#   type: "Literal";
#   value: any;
#   raw: string;
# }

# interface Identifier extends Node {
#   type: "Identifier";
#   value: any;
#   raw: string;
# }

# interface Object extends Node {
#   children: Property[];
# }

# interface Array extends Node {
#   children: Value[];
# }

# type Value = PrimitiveLiteral | Object | Array;

# interface Property extends Node {
#   type: "Property";
#   key: Identifier;
#   value: Value;
# }

@lexer lexer

json -> _ value _ {% ([,val,]) => val %}

object ->
    "{" _ "}"                                 {% compound_empty("Object") %}
  | "{" _ property (_ "," _ property):* _ "}" {% compound_children("Object") %}

array ->
    "[" _ "]"                           {% compound_empty("Array") %}
  | "[" _ value (_ "," _ value):* _ "]" {% compound_children("Array") %}

value ->
    object  {% id %}
  | array   {% id %}
  | %true   {% primitive_literal() %}
  | %false  {% primitive_literal() %}
  | %null   {% primitive_literal() %}
  | %number {% primitive_literal() %}
  | %string {% primitive_literal() %}

property -> key _ ":" _ value {% property %}

key -> %string {% primitive_literal("Identifier") %}

_ -> null | %space {% d => null %}

@{%

const moo = require("moo");

const lexer = moo.compile({
  // id: require("./JSIdentifier"),
  space: { match: /\s+/, lineBreaks: true },
  number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
  "{": "{",
  "}": "}",
  "[": "[",
  "]": "]",
  ",": ",",
  ":": ":",
  true: "true",
  false: "false",
  null: "null"
});

function compound_empty(type) {
  return function ([open,,close]) {
    return {
      type,
      children: [],
      loc: { start: pos(open), end: pos(close, 1) }
    };
  };
}

function compound_children(type) {
  return function ([open,,first,rest,,close]) {
    return {
      type,
      children: [
        first,
        ...rest.map(([,,,property]) => property)
      ],
      loc: { start: pos(open), end: pos(close, 1) }
    };
  };
}

function primitive_literal(type = "Literal") {
  return function ([token]) {
    return {
      type,
      value: JSON.parse(token.value),
      raw: token.text,
      loc: {
        start: pos(token),
        end: pos(token, token.text.length)
      }
    };
  };
}

function property ([key,,,,value]) {
  return {
    type: "Property",
    key,
    value,
    loc: {
      start: key.loc.start,
      end: value.loc.end
    }
  };
}

function pos({ line, col, offset }, add = 0) {
  return {
    line,
    column: col + add,
    offset: offset + add
  };
}

%}
