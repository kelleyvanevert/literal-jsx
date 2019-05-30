import React from "react";
import { hot } from "react-hot-loader";
import "~/assets/railroads.scss";
import PlayWithJSON from "./sections/PlayWithJSON";

function App() {
  return (
    <div>
      <h1>Introducing Literal JSX</h1>
      <PlayWithJSON />
    </div>
  );
}

const wrap =
  process.env.NODE_ENV === "development" ? hot(module) : (x: any) => x;

export default wrap(App);
