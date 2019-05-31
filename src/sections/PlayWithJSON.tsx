import "styled-components/macro";
import React, { useRef, useEffect, useState } from "react";
import createPersistedState from "use-persisted-state";
import rr from "railroad-diagrams";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import Tabbed, { ITab } from "~/components/Tabbed";
import { parse } from "~/lib/parse";

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

const JSXL_DIAGRAM_TABS: ITab[] = [
  {
    title: "Element",
    diagram: rr.Diagram(
      rr.Sequence(
        "<",
        rr.NonTerminal("Identifier"),
        rr.ZeroOrMore(rr.NonTerminal("Attribute")),
        rr.Choice(
          0,
          "/>",
          rr.Sequence(
            ">",
            rr.ZeroOrMore(rr.NonTerminal("Child")),
            "</",
            rr.NonTerminal("(same) Identifier"),
            ">"
          )
        )
      )
    )
  },
  {
    title: "Attribute",
    diagram: rr.Diagram(
      rr.NonTerminal("Identifier"),
      rr.Optional(
        rr.Sequence(
          "=",
          rr.Choice(
            0,
            rr.NonTerminal("String"),
            rr.Sequence("{", rr.NonTerminal("JSON value"), "}")
          )
        )
      )
    )
  },
  {
    title: "Child",
    diagram: rr.Diagram(
      rr.Choice(
        0,
        rr.NonTerminal("plain text"),
        rr.NonTerminal("Element"),
        rr.NonTerminal("JSON value")
      )
    )
  }
].map(tab => ({
  ...tab,
  content: <div dangerouslySetInnerHTML={{ __html: tab.diagram }} />
}));

const JSON_DIAGRAM_TABS: ITab[] = [
  {
    title: "JSON value",
    diagram: rr.Diagram(
      rr.Choice(
        0,
        rr.NonTerminal("Element"),
        rr.NonTerminal("String"),
        rr.NonTerminal("Number"),
        rr.NonTerminal("Object"),
        rr.NonTerminal("Array"),
        "true",
        "false",
        "null"
      )
    )
  },
  {
    title: "Object",
    diagram: rr.Diagram(
      "{",
      rr.ZeroOrMore(
        rr.Sequence(
          rr.NonTerminal("String"),
          ":",
          rr.NonTerminal("JSON value")
        ),
        ","
      ),
      "}"
    )
  },
  {
    title: "Array",
    diagram: rr.Diagram(
      "[",
      rr.ZeroOrMore(rr.NonTerminal("JSON value"), ","),
      "]"
    )
  },
  {
    title: "String",
    diagram: rr.Diagram(
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
    )
  },
  {
    title: "Number",
    diagram: rr.Diagram(
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
  }
].map(tab => ({
  ...tab,
  content: <div dangerouslySetInnerHTML={{ __html: tab.diagram }} />
}));

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
      <Tabbed tabs={JSXL_DIAGRAM_TABS} />
      <Tabbed tabs={JSON_DIAGRAM_TABS} />
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
    </div>
  );
}
