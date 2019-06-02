import "styled-components/macro";
import React, { useState } from "react";
import cx from "classnames";
import { hot } from "react-hot-loader";
import "~/assets/railroads.scss";
import Specification from "./sections/Specification";
import Examples from "./sections/Examples";
import Implementation from "./sections/Implementation";
// import styles from "./App.module.scss";
import logo from "~/assets/logo.svg";

function App() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

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
      <header
        css={`
          padding: 0.4rem;
          background: white;
          display: flex;
        `}
      >
        <span css="flex-grow: 1" />
        <button
          className="hamburger"
          css={`
            display: none;
            border: none;
            background: ${showMenu ? "#ddd" : "none"};
            outline: none;
            padding: 0.3rem;
            cursor: pointer;
          `}
          title="Toggle menu"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="24"
            height="24"
            fill="none"
            stroke="currentcolor"
            strokeWidth="2"
            css="display:block;vertical-align:middle;overflow:visible"
          >
            <path
              d="
                M0 2.5 L16 2.5
                M0 8 L16 8
                M0 13.5 L16 13.5
              "
            />
          </svg>
        </button>
      </header>
      <main
        css={`
          display: flex;
          flex-direction: row;

          aside {
            position: sticky;
            top: 0;
            margin: 4rem 0 5rem 1.4rem;
            max-height: 100vh;
            overflow-y: auto;
          }
        `}
      >
        <div
          className={cx("sidebar", showMenu ? "show" : "")}
          css={`
            flex: none;
            width: 16rem;
          `}
        >
          <aside>
            <ul
              css={`
                margin: 0;
                padding: 2rem 0;
              `}
            >
              <li>Motivation</li>
              <li>Specification</li>
              <li>Examples</li>
              <li>Implementation</li>
            </ul>
          </aside>
        </div>
        <div
          css={`
            flex: 1;
          `}
        >
          <div
            css={`
              max-width: 56rem;
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
              <img
                alt=""
                src={logo}
                css={`
                  height: 6rem;
                  width: auto;
                  display: block;
                `}
              />
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
                  Let JSX embrace its potential as a markup format for
                  transferring data-rich content structures!
                </p>
              </div>
            </div>
            <p>
              <strong>Literal JSX</strong> is a lightweight format for
              interchanging content structures potentially rich in shape and
              data. It aims to serve a similar purpose as JSON did. Where JSON
              subsetted the JavaScript expression, and provided a community
              standard for data exchange,
            </p>
            <p>
              Wonderful libraries such as MDX try to combine the best of JSX, as
              a standard for authoring component-rich content structures, with
              Markdown, as a standard for easily authoring content. It runs into
              technical difficulties though, due to the fact that parsing full
              MDX requires an entire JavaScript parser. This goes against the
              grain of Markdown philosophy, being a format that is easily and
              often parsed and rendered lazily at view-time.
            </p>
            <p>
              JSX aims to fill that gap, prividing a{" "}
              <em>straightforward and intuitive standard</em> instead of an
              implementation.
            </p>
            <Specification />
            <Examples />
            <Implementation />
          </div>
        </div>
      </main>
    </div>
  );
}

const wrap =
  process.env.NODE_ENV === "development" ? hot(module) : (x: any) => x;

export default wrap(App);
