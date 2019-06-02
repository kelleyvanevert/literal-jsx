import "styled-components/macro";
import React, { useMemo } from "react";
import createPersistedState from "use-persisted-state";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "~/assets/codemirror-theme.scss";
import LJSX, {
  makeParser,
  JSONNumber,
  JSONString,
  JSONArray,
  JSONObject,
  JSONValue,
  JSIdentifier,
  JSXElement,
  JSXName,
  JSXAttribute,
  JSXChild
  // @ts-ignore
} from "literal-jsx/lib/LJSX";

// @ts-ignore
window.LJSX = LJSX;

const CM_OPTS = {
  mode: "text/jsx",
  theme: "ljsx",
  lineNumbers: false,
  smartIndent: true,
  tabSize: 2,
  indentWithTabs: false
};

const parsers = {
  JSONString,
  JSONNumber,
  JSONArray: JSONArray(),
  JSONObject: JSONObject(),
  JSONValue: JSONValue(),
  JSIdentifier,
  JSXName,
  JSXElement: JSXElement(),
  // "JSX - Fragment": Fragment(),
  JSXAttribute: JSXAttribute(),
  JSXChild: JSXChild()
};

const usePersistedCode = createPersistedState("code");
const usePersistedParserId = createPersistedState("parser");

const INITIAL_CODE = `<Button.NavLike
  name="Hello"
  something={{ "a": 24 }}
  ok={true}
>
 	Plain text is always a bit 
  {[25, {}, "hello", <a.b.c> hi! </ a.b.c>]}
</Button.NavLike>`;

export default function Implementation() {
  const [code, setCode] = usePersistedCode<string>(INITIAL_CODE);
  const [parserId, setParserId] = usePersistedParserId<string>("JSIdentifier");
  const parser = useMemo(() => {
    // @ts-ignore
    return makeParser(parsers[parserId] || parsers["JSIdentifier"]);
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
            max-width: 100%;
            height: 100%;
            box-sizing: border-box;
          }

          .CodeMirror {
            transition: box-shadow 0.1s ease, border-color 0.1s ease;

            box-shadow: 4px 4px 0 #dedcd9;
            border: 1px solid white;

            &-focused {
              box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2), 4px 4px 0 #009688;
              border-color: #009688;
            }
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
