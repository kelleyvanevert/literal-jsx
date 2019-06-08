// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const merge = require("deepmerge");
const lexer = require("./lexer")();




function compound_empty(type) {
  return function ([open,,close]) {
    return {
      type,
      children: [],
      loc: { start: pos(open), end: pos(close, true) }
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
      loc: { start: pos(open), end: pos(close, true) }
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
        end: pos(token, true)
      }
    };
  };
}

function plaintext_literal([token]) {
  return {
    type: "Literal",
    value: token.text,
    raw: token.text,
    loc: {
      start: pos(token),
      end: pos(token, true)
    }
  };
}

function mergeWhitespaceInPlaintext(...children) {
  const nodes = [];
  children.forEach(child => {
    if (child.type === "space") {
      if (nodes[0] && nodes[0].type === "Literal") {
        nodes[0].value += child.value;
        nodes[0].raw += child.raw;
        nodes[0].loc.end = pos(child, true);
      } else {
        nodes.unshift(plaintext_literal([child]));
      }
    } else if (nodes[0] && nodes[0].type === "Literal" && child.type === "Literal") {
      nodes[0].value += child.value;
      nodes[0].raw += child.raw;
      nodes[0].loc.end = child.loc.end;
    } else if (child.type) {
      nodes.unshift(child);
    }
  });
  return nodes.reverse();
}

function pos({ line, col, offset, text }, addLen = false) {
  const position = {
    line,
    column: col,
    offset
  };
  if (addLen) {
    position.offset += text.length;
    const [first, ...rest] = text.split(/\r?\n/);
    position.line += rest.length;
    if (rest.length > 0) {
      position.column = rest[rest.length - 1].length + 1; // moo column numbers are 1-based
    } else {
      position.column += first.length;
    }
  }
  return position;
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "json", "symbols": ["_", "value", "_"], "postprocess": ([,val,]) => val},
    {"name": "nsName", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":":"}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        function ([nsToken,,,,idToken]) {
          return {
            type: "Name",
            loc: {
              start: pos(nsToken),
              end: pos(idToken, true)
            },
            name: nsToken.value + ":" + idToken.value
          };
        }
          },
    {"name": "memberName$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"."}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "memberName$ebnf$1", "symbols": ["memberName$ebnf$1$subexpression$1"]},
    {"name": "memberName$ebnf$1$subexpression$2", "symbols": ["_", {"literal":"."}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "memberName$ebnf$1", "symbols": ["memberName$ebnf$1", "memberName$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "memberName", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "memberName$ebnf$1"], "postprocess": 
        function ([first, rest]) {
          const last = rest[rest.length - 1][3];
          return {
            type: "Name",
            loc: {
              start: pos(first),
              end: pos(last, true)
            },
            name: first.value + rest.map(([,,,t]) => "." + t.value).join("")
          };
        }
          },
    {"name": "idName", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        function ([id]) {
          return {
            type: "Name",
            loc: {
              start: pos(id),
              end: pos(id, true)
            },
            name: id.value
          };
        }
          },
    {"name": "elementName", "symbols": ["nsName"], "postprocess": id},
    {"name": "elementName", "symbols": ["memberName"], "postprocess": id},
    {"name": "elementName", "symbols": ["idName"], "postprocess": id},
    {"name": "closingTag", "symbols": [{"literal":"<"}, "_", {"literal":"/"}, "_", "elementName", "_", {"literal":">"}], "postprocess": 
        function ([open,,,,name,,close]) {
          const start = pos(open);
          const end = pos(close, true);
          return {
            closingTagName: name.name,
            loc: { start, end }
          };
        }
          },
    {"name": "furtherElement", "symbols": [{"literal":"/"}, "_", {"literal":">"}], "postprocess": 
        function ([,,close]) {
          return {
            further: {
              loc: {
                end: pos(close, true)
              },
              children: []
            }
          };
        }
            },
    {"name": "furtherElement$ebnf$1", "symbols": []},
    {"name": "furtherElement$ebnf$1$subexpression$1", "symbols": ["_", "child"]},
    {"name": "furtherElement$ebnf$1", "symbols": ["furtherElement$ebnf$1", "furtherElement$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "furtherElement", "symbols": [{"literal":">"}, "furtherElement$ebnf$1", "_", "closingTag"], "postprocess": 
        function ([,children,remainingWhitespace,{closingTagName, loc}]) {
          return {
            closingTagName,
            further: {
              loc: {
                end: loc.end
              },
              children: mergeWhitespaceInPlaintext(
                ...children.flat(),
                remainingWhitespace
              )
            }
          };
        }
            },
    {"name": "child", "symbols": [(lexer.has("plaintext") ? {type: "plaintext"} : plaintext)], "postprocess": plaintext_literal},
    {"name": "child", "symbols": ["element"], "postprocess": id},
    {"name": "child", "symbols": ["expression"], "postprocess": id},
    {"name": "element$ebnf$1", "symbols": []},
    {"name": "element$ebnf$1$subexpression$1", "symbols": ["_", "attr"]},
    {"name": "element$ebnf$1", "symbols": ["element$ebnf$1", "element$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "element", "symbols": [{"literal":"<"}, "_", "elementName", "element$ebnf$1", "_", "furtherElement"], "postprocess": 
        function ([open,,name,attributes,,{closingTagName, further}]) {
          if (closingTagName && name.name !== closingTagName) {
            throw new Error("closing tag must match opening tag name!");
          }
          return merge(
            {
              type: "Element",
              loc: { start: pos(open) },
              name,
              attributes: attributes.map(([,attr]) => attr)
            },
            further
          );
        }
            },
    {"name": "attrname", "symbols": ["nsName"], "postprocess": id},
    {"name": "attrname", "symbols": ["idName"], "postprocess": id},
    {"name": "attr$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"="}, "_", "attrval"]},
    {"name": "attr$ebnf$1", "symbols": ["attr$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "attr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attr", "symbols": ["attrname", "attr$ebnf$1"], "postprocess": 
        function ([name,maybeval]) {
          return {
            type: "Attribute",
            loc: {
              start: name.loc.start,
              end: maybeval ? maybeval[3].loc.end : name.loc.end
            },
            name,
            ...(maybeval
              ? { value: maybeval[3] }
              : {}
            )
          };
        }
            },
    {"name": "expression", "symbols": [{"literal":"{"}, "_", "value", "_", {"literal":"}"}], "postprocess": 
        function ([open,,expression,,close]) {
          return {
            type: "Expression",
            loc: {
              start: pos(open),
              end: pos(close, true)
            },
            expression
          };
        }
            },
    {"name": "attrval", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": primitive_literal()},
    {"name": "attrval", "symbols": ["expression"], "postprocess": id},
    {"name": "object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": compound_empty("Object")},
    {"name": "object$ebnf$1", "symbols": []},
    {"name": "object$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "property"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "property", "object$ebnf$1", "_", {"literal":"}"}], "postprocess": compound_children("Object")},
    {"name": "array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": compound_empty("Array")},
    {"name": "array$ebnf$1", "symbols": []},
    {"name": "array$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "array$ebnf$1", "_", {"literal":"]"}], "postprocess": compound_children("Array")},
    {"name": "value", "symbols": ["object"], "postprocess": id},
    {"name": "value", "symbols": ["array"], "postprocess": id},
    {"name": "value", "symbols": [{"literal":"true"}], "postprocess": primitive_literal()},
    {"name": "value", "symbols": [{"literal":"false"}], "postprocess": primitive_literal()},
    {"name": "value", "symbols": [{"literal":"null"}], "postprocess": primitive_literal()},
    {"name": "value", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": primitive_literal()},
    {"name": "value", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": primitive_literal()},
    {"name": "value", "symbols": ["element"], "postprocess": id},
    {"name": "property", "symbols": ["key", "_", {"literal":":"}, "_", "value"], "postprocess": 
        function ([key,,,,value]) {
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
            },
    {"name": "key", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": primitive_literal("Identifier")},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id}
]
  , ParserStart: "json"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
