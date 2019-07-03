const { makeLexer, parseAST, parseValue } = require(".");
const lexer = makeLexer();

const W_NUMBER = `<Bla> 42 </Bla>`;

const W_ARRAY = `<Bla> [42] </Bla>`;

const NESTED_1 = `<A><B /></A>`;

const NESTED_2 = `[<A><B /><C /></A>]`;

const NESTED_3 = `[ <A>  <B /> <A><B /></A> <C />  </A> ]`;

const BASIC = `
    <Hi there={42}> plain
      text <
    /Hi>
  `;

const COMPLICATED = `
        <Button.NavLike
          name="Hello"
          someData={{ "a": [24, <a />] }}
          false={false}
          implicitlyTrue
          explicitlyNull={null}
        >
          Plain text is always a bit <svg:yep>boring</svg:yep>
          {[25, {}, "hello", <a.b.c> hi! </ a.b.c>]}
        </Button.NavLike>
      `;

const BRACES_IN_SOURCE_IN_CONTENT = `
  <Markdown>
  \`\`\`js
  // So there's some code
  function hi() {}
  \`\`\`
  </Markdown>
`;

const INLINE_CODE = `<InlineMdCode> \`function eat (lunch) { }\` </InlineMdCode>`;

const COMPLICATED_2 = `[
  <MultiChoice
    id="1562017094809"
    shuffle
    question="Which of the following is an anonymous function?"
    content={<Markdown>
      - \`function eat (lunch) { /* etc */ }\`
      - \`const eat = function (lunch) { /* etc */ };\`
      - \`const eat = (lunch) => { /* etc */ };\`
    </Markdown>}
    options={[
      "both (2) and (3)",
      "only (1)",
      "only (3)",
      "both (1) and (2)"
    ]}
    correctIndex={0}
    learning_goals={["functions"]}
  />,
  <MultiChoice
    id="1562017094809"
    shuffle
    question="Which of the following is an anonymous function?"
    content={<Markdown>
      1.  \`\`\`js
          function eat (lunch) {
            // etc
          }
          \`\`\`
      2.  \`\`\`js
          function eat (lunch) {
            // etc
          }
          \`\`\`
    </Markdown>}
    options={[
      "both (2) and (3)",
      "only (1)",
      "only (3)",
      "both (1) and (2)"
    ]}
    correctIndex={0}
    learning_goals={["functions"]}
  />
]`;

describe("lexer", () => {
  it("should lex correctly", () => {
    lexer.reset("6");
    expect(lexer.next()).toMatchObject({ type: "number", value: "6" });
  });

  it("should push to jsxTag state and then recognize an identifier", () => {
    lexer.reset("true<blabla");
    expect(lexer.next()).toMatchObject({ type: "true", value: "true" });
    expect(lexer.next()).toMatchObject({ type: "<", value: "<" });
    expect(lexer.next()).toMatchObject({ type: "identifier", value: "blabla" });
  });

  // it.only("should WORK!", () => {
  //   lexer.reset(INLINE_CODE);
  //   let t,
  //     i = 0;
  //   while ((t = lexer.next())) {
  //     console.log(i++, t, lexer.state, lexer.stack);
  //   }
  // });
});

describe("parser", () => {
  it("should not fail if the rawtext child is a json value #1", () => {
    expect(parseValue(W_NUMBER)).toEqual({
      _JSXElement: true,
      name: "Bla",
      attributes: {},
      children: [" 42 "]
    });
  });

  it("should not fail if the rawtext child is a json value #2", () => {
    expect(parseValue(W_ARRAY)).toEqual({
      _JSXElement: true,
      name: "Bla",
      attributes: {},
      children: [" [42] "]
    });
  });

  it("should parse nested tags correctly #1", () => {
    expect(parseValue(NESTED_1)).toEqual({
      _JSXElement: true,
      name: "A",
      attributes: {},
      children: [
        {
          _JSXElement: true,
          name: "B",
          attributes: {},
          children: []
        }
      ]
    });
  });

  it("should parse nested tags correctly #2", () => {
    expect(parseValue(NESTED_2)).toEqual([
      {
        _JSXElement: true,
        name: "A",
        attributes: {},
        children: [
          {
            _JSXElement: true,
            name: "B",
            attributes: {},
            children: []
          },
          {
            _JSXElement: true,
            name: "C",
            attributes: {},
            children: []
          }
        ]
      }
    ]);
  });

  it("should parse nested tags correctly #3", () => {
    expect(parseValue(NESTED_3)).toEqual([
      {
        _JSXElement: true,
        name: "A",
        attributes: {},
        children: [
          "  ",
          {
            _JSXElement: true,
            name: "B",
            attributes: {},
            children: []
          },
          " ",
          {
            _JSXElement: true,
            name: "A",
            attributes: {},
            children: [
              {
                _JSXElement: true,
                name: "B",
                attributes: {},
                children: []
              }
            ]
          },
          " ",
          {
            _JSXElement: true,
            name: "C",
            attributes: {},
            children: []
          },
          "  "
        ]
      }
    ]);
  });

  it("should parse something complicated correctly #1", () => {
    expect(parseValue(COMPLICATED)).toEqual({
      _JSXElement: true,
      name: "Button.NavLike",
      attributes: {
        name: "Hello",
        someData: {
          a: [
            24,
            { _JSXElement: true, name: "a", attributes: {}, children: [] }
          ]
        },
        false: false,
        implicitlyTrue: true,
        explicitlyNull: null
      },
      children: [
        "\n          Plain text is always a bit ",
        {
          _JSXElement: true,
          name: "svg:yep",
          attributes: {},
          children: ["boring"]
        },
        "\n          ",
        [
          25,
          {},
          "hello",
          {
            _JSXElement: true,
            name: "a.b.c",
            attributes: {},
            children: [" hi! "]
          }
        ],
        "\n        "
      ]
    });
  });

  it("should parse something complicated correctly #2", () => {
    expect(parseValue(COMPLICATED_2)).toEqual([
      {
        _JSXElement: true,
        name: "MultiChoice",
        attributes: {
          id: "1562017094809",
          shuffle: true,
          question: "Which of the following is an anonymous function?",
          content: {
            _JSXElement: true,
            name: "Markdown",
            attributes: {},
            children: [
              "\n      - `function eat (lunch) { /* etc */ }`\n      - `const eat = function (lunch) { /* etc */ };`\n      - `const eat = (lunch) => { /* etc */ };`\n    "
            ]
          },
          options: [
            "both (2) and (3)",
            "only (1)",
            "only (3)",
            "both (1) and (2)"
          ],
          correctIndex: 0,
          learning_goals: ["functions"]
        },
        children: []
      },
      {
        _JSXElement: true,
        name: "MultiChoice",
        attributes: {
          id: "1562017094809",
          shuffle: true,
          question: "Which of the following is an anonymous function?",
          content: {
            _JSXElement: true,
            name: "Markdown",
            attributes: {},
            children: [
              "\n      1.  ```js\n          function eat (lunch) {\n            // etc\n          }\n          ```\n      2.  ```js\n          function eat (lunch) {\n            // etc\n          }\n          ```\n    "
            ]
          },
          options: [
            "both (2) and (3)",
            "only (1)",
            "only (3)",
            "both (1) and (2)"
          ],
          correctIndex: 0,
          learning_goals: ["functions"]
        },
        children: []
      }
    ]);
  });

  it("should parse braces in plaintext content", () => {
    expect(parseAST(BRACES_IN_SOURCE_IN_CONTENT)).toBeTruthy();
  });

  it("should generate correct location data", () => {
    expect(parseAST(BASIC)).toEqual({
      type: "Element",
      loc: {
        start: { line: 2, column: 5, offset: 5 },
        end: { line: 4, column: 9, offset: 48 }
      },
      name: {
        type: "Name",
        loc: {
          start: { line: 2, column: 6, offset: 6 },
          end: { line: 2, column: 8, offset: 8 }
        },
        name: "Hi"
      },
      attributes: [
        {
          type: "Attribute",
          loc: {
            start: { line: 2, column: 9, offset: 9 },
            end: { line: 2, column: 19, offset: 19 }
          },
          name: {
            type: "Name",
            loc: {
              start: { line: 2, column: 9, offset: 9 },
              end: { line: 2, column: 14, offset: 14 }
            },
            name: "there"
          },
          value: {
            type: "Expression",
            loc: {
              start: { line: 2, column: 15, offset: 15 },
              end: { line: 2, column: 19, offset: 19 }
            },
            expression: {
              type: "Literal",
              value: 42,
              raw: "42",
              loc: {
                start: { line: 2, column: 16, offset: 16 },
                end: { line: 2, column: 18, offset: 18 }
              }
            }
          }
        }
      ],
      children: [
        {
          type: "Literal",
          value: " plain\n      text ",
          raw: " plain\n      text ",
          loc: {
            start: { line: 2, column: 20, offset: 20 },
            end: { line: 3, column: 12, offset: 38 }
          }
        }
      ]
    });
  });
});
