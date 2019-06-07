import "styled-components/macro";
import React from "react";
import { hot } from "react-hot-loader";
import "~/assets/railroads.scss";
import Motivation from "./sections/Motivation";
import Specification from "./sections/Specification";
// import Examples from "./sections/Examples";
import Implementation from "./sections/Implementation";
// import styles from "./App.module.scss";
import logo from "~/assets/logo.svg";

function App() {
  return (
    <>
      <main id="top">
        <div className="wrap">
          <div className="titlecontainer">
            <a href="#top">
              <img
                alt=""
                src={logo}
                css={`
                  height: 6rem;
                  width: auto;
                  display: block;
                `}
              />
            </a>
            <div className="titleblock">
              <h1
                css={`
                  margin: 0;
                `}
              >
                Introducing Literal JSX
              </h1>
              <p
                className="lead"
                css={`
                  margin: 1rem 0 0;
                `}
              >
                <em>
                  Let JSX embrace its potential as a content authoring markup
                  format for the component-based era!
                </em>
              </p>
            </div>
          </div>
          <p className="lead">
            <strong>Literal JSX</strong> is a lightweight format for content
            potentially rich in data and nominal structure. It extends{" "}
            <a href="https://json.org">
              <strong>JSON</strong>
            </a>{" "}
            by adding the JSX-like <em className="nt">Element</em> type as a
            possible value type aside objects, arrays, numbers, strings,
            booleans, and <code>null</code>. However, instead of the full
            JavaScript expression syntax, only JSON data (possibly including
            more <em className="nt">Element</em> nodes) is allowed inside of its
            attributes ("props") and children.
          </p>
          <Motivation />
          <Specification />
          {/* <Examples /> */}
          <Implementation />
        </div>
      </main>
      <footer>
        <div className="wrap">
          An idea proposed by <a href="https://klve.nl/">Kelley van Evert</a>,
          but really, low-hanging fruit. Inspired by{" "}
          <a href="https://json.org/">JSON</a>. Also, this site and the example
          implementation could not have been made without these lovely
          libraries: tabatkins'{" "}
          <a href="https://github.com/tabatkins/railroad-diagrams">
            <code>railroad-diagrams</code>
          </a>
          , Hardmath123's{" "}
          <a href="https://github.com/francisrstokes/arcsecond">
            <code>nearley.js</code>
          </a>
          .
        </div>
      </footer>
    </>
  );
}

const wrap =
  process.env.NODE_ENV === "development" ? hot(module) : (x: any) => x;

export default wrap(App);
