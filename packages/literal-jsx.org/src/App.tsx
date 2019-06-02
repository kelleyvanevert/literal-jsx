import "styled-components/macro";
import React from "react";
import { hot } from "react-hot-loader";
import "~/assets/railroads.scss";
import Motivation from "./sections/Motivation";
import Specification from "./sections/Specification";
import Examples from "./sections/Examples";
import Implementation from "./sections/Implementation";
// import styles from "./App.module.scss";
import logo from "~/assets/logo.svg";

function App() {
  return (
    <div
      css={`
        @media (max-width: 800px) {
          main {
            flex-direction: column;
            .sidebar {
              display: none;

              &.show {
                display: block;
              }
            }
            aside {
              margin: 0 1.4rem;
            }
          }

          .hamburger {
            display: block;
          }

          .titlecontainer {
            flex-direction: column;
            .titleblock {
              margin: 1rem 0 0;
            }
          }
        }
      `}
    >
      <main
        id="top"
        css={`
          max-width: 50rem;
          margin: 0 auto;
          padding: 1.4rem;
          margin-bottom: 20rem;
        `}
      >
        <div
          className="titlecontainer"
          css={`
            display: flex;
            align-items: center;
            padding: 1rem 0;

            .titleblock {
              margin: 0 0 0 1.4rem;
            }
          `}
        >
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
                format for the component-based design era!
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
          by adding the JSX-like <code>Element</code> type as a possible value
          type aside objects, arrays, numbers, strings, booleans, and{" "}
          <code>null</code>. However, instead of the full JavaScript expression
          syntax, only JSON data (possibly including more <code>Element</code>{" "}
          nodes) is allowed inside of its attributes ("props") and children.
        </p>
        <Motivation />
        <Specification />
        <Examples />
        <Implementation />
      </main>
    </div>
  );
}

const wrap =
  process.env.NODE_ENV === "development" ? hot(module) : (x: any) => x;

export default wrap(App);
