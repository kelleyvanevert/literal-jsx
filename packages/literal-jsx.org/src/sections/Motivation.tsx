import React from "react";

export default function Motivation() {
  return (
    <section id="motivation">
      <h2>
        <a href="#motivation">Motivation</a>
      </h2>
      <p>
        Literal JSX aims to serve a similar purpose as JSON did: by subsetting
        the syntax of JSX to its well-founded, unambiguously structured, easily
        parseable, and non-Turing-complete core, a{" "}
        <em>technically flexible and visually intuitive content format</em> is
        obtained. On the one hand, Literal JSX is easily parseable (due to its
        single-pass unambiguous grammar), making it a good candidate for
        at-runtime compilation. On the other, it is an easily authored and
        well-known syntax, mainly due to the immense popularity of React, the
        web UI library that invented and popularized JSX.
      </p>
      <p>
        Especially in the intersection of the two rising trends in web
        development that are: (1) lightweight markup format content authoring
        (that is, using Markdown or some other simple markup format to serve the
        content of your site, documentation, or something else); and (2)
        component-based UI design, which is emerging as a best-practice
        engineering technique for complex interfaces; there is a strong need for
        a simple standard for describing nominal and data-rich content
        structures, as opposed to the various case-specific "grammar-hacks" that
        are now commonly used for this purpose. Literal JSX aims to satisfy that
        need.
      </p>
      <p>
        The idea of interspersing JSX in markdown is not new, and libraries such
        as <a href="https://mdxjs.com/">MDX</a> are currently popularizing this
        idea. However MDX is a <em>library</em> dependent on a full-blown
        JavaScript parser, thereby making it technically non-trivial and dubious
        to compile content at runtime (e.g. in the browser). By instead just
        outlining a narrow and unambiguous subset grammar of JSX, Literal JSX
        defines a <em>standard</em> that is language- and framework-agnostic.
      </p>
      <p>
        To summarize: Literal JSX aims to privide a{" "}
        <em>straightforward and intuitive standard</em> for content-authoring in
        the component-based design era.
      </p>
    </section>
  );
}
