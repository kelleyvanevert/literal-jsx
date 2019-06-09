import "styled-components/macro";
import React, { useMemo } from "react";
import createPersistedState from "use-persisted-state";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "~/assets/codemirror-theme.scss";
// @ts-ignore
import { ObjectInspector, chromeLight } from "react-inspector";
// @ts-ignore
import LJSX from "@literal-jsx/parser";
import Tabbed from "~/components/Tabbed";
import LinkIcon from "~/components/LinkIcon";

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

const INSPECT_THEME = {
  ...chromeLight,
  ...{
    BASE_BACKGROUND_COLOR: "transparent",
    TREENODE_PADDING_LEFT: 20,
    TREENODE_FONT_SIZE: "12px"
  }
};

const usePersistedCode = createPersistedState("code");

const INITIAL_CODE = `<Button.NavLike
  name="Hello"
  something={{ "a": 24 }}
  ok
>
 	Plain text is always a <bit:boring />
  {[25, {}, "hello", <a.b.c> hi! </ a.b.c>]}
</Button.NavLike>`;

export default function Implementation() {
  const [code, setCode] = usePersistedCode<string>(INITIAL_CODE);
  const parsed = useMemo(() => {
    try {
      return { value: LJSX.parseValue(code), ast: LJSX.parseAST(code) };
    } catch (error) {
      return { error };
    }
  }, [code]);

  return (
    <section id="implementation">
      <h2>
        <a href="#implementation">
          Example implementation
          <LinkIcon />
        </a>
      </h2>
      <p>
        An example parser implementation is provided in the{" "}
        <a href="https://www.npmjs.com/package/@literal-jsx/parser">
          <code>@literal-jsx/parser</code>
        </a>{" "}
        npm package. It can be used as follows:
      </p>
      <CodeMirror
        value={`import { parseValue, parseAST } from "literal-jsx";
const data = parseValue('<Button primary text="Hi" />');`}
        options={{ ...CM_OPTS, readOnly: "nocursor" }}
        onBeforeChange={() => {}}
      />
      <p>
        You can play around with the parser below. It will parse the given
        literal JSX source code starting with the <em className="nt">Value</em>{" "}
        non-terminal, as per the spec. No factory function is passed, and
        therefore the content is just transformed to a default content structure
        detailing the Literal JSX structure.
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
        <Tabbed
          tabs={[
            {
              title: "Value",
              content:
                "value" in parsed
                  ? inspect(parsed.value)
                  : errorMsg(parsed.error)
            },
            {
              title: "AST",
              content:
                "ast" in parsed ? inspect(parsed.ast) : errorMsg(parsed.error)
            }
          ]}
        />
      </div>
    </section>
  );
}

function inspect(something: any) {
  return (
    <div
      css={`
        white-space: pre;
        margin-top: 1.4rem;
        max-width: 100%;
        overflow-x: auto;
        text-align: left;
      `}
    >
      <ObjectInspector theme={INSPECT_THEME} data={something} expandLevel={5} />
    </div>
  );
}

function errorMsg(error: Error) {
  return (
    <div
      css={`
        color: #ca390c;
        font-weight: bold;
        text-align: left;
      `}
    >
      <p css="font-style: italic;">That couldn't be parsed :(</p>
      <pre css="font-size: 80%;">{error.toString()}</pre>
    </div>
  );
}
