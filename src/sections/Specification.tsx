import "styled-components/macro";
import React from "react";
import rr from "railroad-diagrams";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import Tabbed, { ITab } from "~/components/Tabbed";

// @ts-ignore
rr.Diagram.INTERNAL_ALIGNMENT = "left";

const JSXL_DIAGRAM_TABS: Array<ITab & { diagram: any }> = [
  {
    title: "Element",
    diagram: rr.ComplexDiagram(
      "<",
      rr.NonTerminal("Name"),
      rr.ZeroOrMore(rr.NonTerminal("Attribute")),
      rr.Choice(
        1,
        rr.Sequence("/", ">"),
        rr.Sequence(
          ">",
          rr.ZeroOrMore(rr.NonTerminal("Child")),
          "<",
          "/",
          rr.NonTerminal("Name*"),
          ">"
        )
      )
    )
  },
  {
    title: "Fragment",
    diagram: rr.ComplexDiagram(
      "<",
      ">",
      rr.ZeroOrMore(rr.NonTerminal("Child")),
      "<",
      "/",
      ">"
    )
  },
  {
    title: "Name",
    diagram: rr.ComplexDiagram(
      rr.NonTerminal("Identifier"),
      rr.Choice(
        0,
        rr.ZeroOrMore(rr.Sequence(".", rr.NonTerminal("Identifier"))),
        rr.Sequence(":", rr.NonTerminal("Identifier"))
      )
    )
  },
  {
    title: "Attribute",
    diagram: rr.ComplexDiagram(
      rr.NonTerminal("Identifier"),
      rr.Choice(0, rr.Skip(), rr.Sequence(":", rr.NonTerminal("Identifier"))),
      rr.Optional(
        rr.Sequence(
          "=",
          rr.Choice(
            0,
            rr.NonTerminal("String"),
            rr.Sequence("{", rr.NonTerminal("Value"), "}")
          )
        )
      )
    )
  },
  {
    title: "Child",
    diagram: rr.ComplexDiagram(
      rr.Choice(
        0,
        rr.NonTerminal("plain text"),
        rr.NonTerminal("Element"),
        rr.Sequence("{", rr.NonTerminal("Value"), "}")
      )
    )
  }
].map(tab => ({
  ...tab,
  content: <div dangerouslySetInnerHTML={{ __html: tab.diagram }} />
}));

JSXL_DIAGRAM_TABS[0].content = (
  <div>
    <div>{JSXL_DIAGRAM_TABS[0].content}</div>
    <p>*must match the one on in the opening tag</p>
  </div>
);

JSXL_DIAGRAM_TABS[2].content = (
  <div>
    <div>{JSXL_DIAGRAM_TABS[2].content}</div>
    <p>
      <em>Identifier</em> is any valid variable name in JavaScript
    </p>
  </div>
);

const JSON_DIAGRAM_TABS: ITab[] = [
  {
    title: "Value",
    diagram: rr.ComplexDiagram(
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
    diagram: rr.ComplexDiagram(
      "{",
      rr.ZeroOrMore(
        rr.Sequence(rr.NonTerminal("String"), ":", rr.NonTerminal("Value")),
        ","
      ),
      "}"
    )
  },
  {
    title: "Array",
    diagram: rr.ComplexDiagram(
      "[",
      rr.ZeroOrMore(rr.NonTerminal("Value"), ","),
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

export default function Specification() {
  return (
    <section>
      <h2>Specification</h2>
      <p>
        Literal JSX subsets JSX in the same spirit as JSON subsets JavaScript.
        This means some "additional" JSX syntax has been omitted intentionally.
        For example, JSX elements cannot be assigned unquoted to attributes of
        other elements, and strings are always double-quoted, just like in JSON.
      </p>
      <Tabbed tabs={JSXL_DIAGRAM_TABS} />
      <Tabbed tabs={JSON_DIAGRAM_TABS} />
    </section>
  );
}
