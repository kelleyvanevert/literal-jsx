import "styled-components/macro";
import React, { useRef, useEffect, useState } from "react";
import createPersistedState from "use-persisted-state";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { parse } from "~/lib/json";
import rr from "railroad-diagrams";

// @ts-ignore
window.rr = rr;

// @ts-ignore
window.p = parse;

// @ts-ignore
window.perf = function perf(f: (source: string) => any) {
  let t0 = performance.now();
  for (let i = 0; i < 10000; i++) {
    f('[23,-5,true,{"h":{"h":2},"age":{}}]');
  }
  return performance.now() - t0;
};

// @ts-ignore
rr.Diagram.INTERNAL_ALIGNMENT = "left";

const diagrams = {
  object: rr.Diagram(
    "{",
    rr.ZeroOrMore(
      rr.Sequence(rr.NonTerminal("string"), ":", rr.NonTerminal("value")),
      ","
    ),
    "}"
  ),
  array: rr.Diagram("[", rr.ZeroOrMore(rr.NonTerminal("value"), ","), "]"),
  value: rr.Diagram(
    rr.Choice(
      0,
      rr.NonTerminal("string"),
      rr.NonTerminal("number"),
      rr.NonTerminal("object"),
      rr.NonTerminal("array"),
      "true",
      "false",
      "null"
    )
  ),
  string: rr.Diagram(
    '"',
    rr.Optional(
      rr.OneOrMore(
        rr.Choice(
          0,
          rr.NonTerminal("almost any UNICODE character"),
          rr.Sequence(
            "\\",
            rr.Choice(
              0,
              rr.Sequence('"', rr.Comment("quotation mark")),
              rr.Sequence("\\", rr.Comment("reverse solidus")),
              rr.Sequence("/", rr.Comment("solidus")),
              rr.Sequence("b", rr.Comment("backspace")),
              rr.Sequence("f", rr.Comment("formfeed")),
              rr.Sequence("n", rr.Comment("newline")),
              rr.Sequence("r", rr.Comment("carriage return")),
              rr.Sequence("t", rr.Comment("horizontal tab")),
              rr.Sequence("u", rr.NonTerminal("4 hexademical digits"))
            )
          )
        )
      )
    ),
    '"'
  ),
  number: rr.Diagram(
    rr.Sequence(
      rr.Choice(0, rr.Skip(), "-"),
      rr.Choice(
        0,
        "0",
        rr.Sequence(
          rr.NonTerminal("digit 1-9"),
          rr.OneOrMore(rr.Skip(), rr.NonTerminal("digit"))
        )
      ),
      rr.Optional(rr.Sequence(".", rr.OneOrMore(rr.NonTerminal("digit")))),
      rr.Choice(
        0,
        rr.Skip(),
        rr.Sequence(
          rr.Choice(0, "e", "E"),
          rr.Choice(1, "-", rr.Skip(), "+"),
          rr.OneOrMore(rr.NonTerminal("digit"))
        )
      )
    )
  )
};

console.log(diagrams.string);

const CM_OPTS = {
  mode: "plain",
  lineNumbers: true,
  smartIndent: true,
  tabSize: 2,
  indentWithTabs: false
};

const usePersistedJson = createPersistedState("json");

const INITIAL_JSON = `{
  "name": "Kelley",
  "age": 27
}`;

export default function PlayWithJSON() {
  const [json, setJson] = usePersistedJson<string>(INITIAL_JSON);
  const [parsedJson, setParsedJson] = useState<any>(null);
  const editJson = useRef<{
    editor?: CodeMirror.Editor;
    sel: CodeMirror.TextMarker[];
  }>({ sel: [] });

  useEffect(() => {
    try {
      setParsedJson(parse(json));
    } catch (e) {
      setParsedJson(e);
      console.log(e);
    }
  }, [json]);

  return (
    <div>
      <div
        css={`
          min-height: 20rem;
          display: flex;
          flex-direction: row;
          align-items: stretch;
        `}
      >
        <div
          css={`
            width: 40%;
            border-right: 1px solid black;

            .react-codemirror2,
            .CodeMirror {
              height: 100%;
            }
          `}
        >
          <CodeMirror
            value={json}
            options={CM_OPTS}
            onBeforeChange={(editor, data, value) => {
              setJson(value);
            }}
          />
        </div>
        <pre>{JSON.stringify(parsedJson, null, 2)}</pre>
      </div>
      <table>
        <tbody>
          {Object.entries(diagrams).map(([key, diagram]) => (
            <tr key={key}>
              <td>{key}</td>
              <td dangerouslySetInnerHTML={{ __html: diagram }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
