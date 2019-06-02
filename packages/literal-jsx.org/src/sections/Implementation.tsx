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
    <section id="implementation">
      <h2>
        <a href="#implementation">Implementation</a>
      </h2>
      <p>
        An example implementation is provided in the{" "}
        <a href="https://www.npmjs.com/package/literal-jsx">
          <code>literal-jsx</code>
        </a>{" "}
        npm package. It can be used as follows:
      </p>
      <CodeMirror
        value={`import LJSX from "literal-jsx";

const data = LJSX.parse('<Button primary text="Hi" />');

// LJSX.parse: (jsx: string, factory?: Factory) => Value

// type Factory = (
//   name: string,
//   attributes: null | { [key: string]: Value },
//   ...children: Value[]
// ) => any`}
        options={{ ...CM_OPTS, readOnly: "nocursor" }}
        onBeforeChange={() => {}}
      />
      <p>
        <select value={parserId} onChange={e => setParserId(e.target.value)}>
          {Object.keys(parsers).map(id => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </p>
      <CodeMirror
        className="editable"
        value={code}
        options={CM_OPTS}
        onBeforeChange={(editor, data, value) => {
          setCode(value);
        }}
      />
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
