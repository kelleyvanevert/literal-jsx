import React from "react";
import { hot } from "react-hot-loader";

function App() {
  return <div>Hello Kelley</div>;
}

const wrap =
  process.env.NODE_ENV === "development" ? hot(module) : (x: any) => x;

export default wrap(App);
