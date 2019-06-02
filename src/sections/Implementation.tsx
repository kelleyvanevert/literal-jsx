import "styled-components/macro";
import React, { useMemo } from "react";
import createPersistedState from "use-persisted-state";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import LJSX, {
  makeParser,
  Identifier,
  Element,
  Fragment,
  Name,
  Attribute,
  Child
} from "~/lib/parse-v2";

const CM_OPTS = {
  mode: "plain",
  theme: "material",
  lineNumbers: true,
  smartIndent: true,
  tabSize: 2,
  indentWithTabs: false
};

const parsers = {
  "JSX - Identifier": Identifier,
  "JSX - Name": Name,
  // invoked in order to use default factory fn
  "JSX - Element": Element(),
  "JSX - Fragment": Fragment(),
  "JSX - Attribute": Attribute(),
  "JSX - Child": Child()
};

const usePersistedCode = createPersistedState("code");
const usePersistedParserId = createPersistedState("parser");

export default function Implementation() {
  const [code, setCode] = usePersistedCode<string>("");
  const [parserId, setParserId] = usePersistedParserId<string>();
  const parser = useMemo(() => {
    // @ts-ignore
    return makeParser(parsers[parserId] || parsers["JSX - Identifier"]);
  }, [parserId]);

  return (
    <section>
      <h2>Implementation</h2>
      <p>
        <select value={parserId} onChange={e => setParserId(e.target.value)}>
          {Object.keys(parsers).map(id => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </p>
      <div
        css={`
          .react-codemirror2,
          .CodeMirror {
            height: 100%;
          }
        `}
      >
        <CodeMirror
          value={code}
          options={CM_OPTS}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
          }}
        />
      </div>
      <div>
        <pre
          css={`
            max-width: 100%;
            overflow: auto;
            white-space: pre-wrap;
          `}
        >
          {JSON.stringify(parser(code), null, 2)}
        </pre>
      </div>
    </section>
  );
}
