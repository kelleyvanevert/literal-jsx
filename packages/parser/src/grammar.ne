# JSON [https://json.org/]
# Literal JSX [https://literal-jsx.org/]

# Tested with nearleyc v2.16.0

@{%

const merge = require("deepmerge");
const lexer = require("./lexer")();

%}

@lexer lexer

json -> _ value _ {% ([,val,]) => val %}

nsName -> %identifier _ ":" _ %identifier {%
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
  %}

memberName -> %identifier (_ "." _ %identifier):+ {%
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
  %}

idName -> %identifier {%
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
  %}

elementName ->
    nsName {% id %}
  | memberName {% id %}
  | idName {% id %}

closingTag -> "<" _ "/" _ elementName _ ">" {%
    function ([open,,,,name,,close]) {
      const start = pos(open);
      const end = pos(close, true);
      return {
        closingTagName: name.name,
        loc: { start, end }
      };
    }
  %}

furtherElement ->
    "/" _ ">" {%
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
    %}
  | ">" (_ child):* _ closingTag {%
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
    %}

child ->
    %plaintext {% plaintext_literal %}
  | element {% id %}
  | expression {% id %}

element -> "<" _ elementName (_ attr):* _ furtherElement {%
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
    %}

attrname ->
    nsName {% id %}
  | idName {% id %}

attr -> attrname (_ "=" _ attrval):? {%
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
    %}

expression -> "{" _ value _ "}" {%
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
    %}

attrval ->
    %string {% primitive_literal() %}
  | expression {% id %}

object ->
    "{" _ "}"                                 {% compound_empty("Object") %}
  | "{" _ property (_ "," _ property):* _ "}" {% compound_children("Object") %}

array ->
    "[" _ "]"                           {% compound_empty("Array") %}
  | "[" _ value (_ "," _ value):* _ "]" {% compound_children("Array") %}

value ->
    object  {% id %}
  | array   {% id %}
  | "true"  {% primitive_literal() %}
  | "false" {% primitive_literal() %}
  | "null"  {% primitive_literal() %}
  | %number {% primitive_literal() %}
  | %string {% primitive_literal() %}
  | element {% id %}

property -> key _ ":" _ value {%
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
    %}

key -> %string {% primitive_literal("Identifier") %}

_ -> null | %space {% id %}

@{%

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

%}
