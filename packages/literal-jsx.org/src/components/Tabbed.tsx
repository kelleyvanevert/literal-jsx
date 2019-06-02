import "styled-components/macro";
import React, { useState } from "react";
import styles from "./Tabbed.module.scss";

export interface ITab {
  title: string;
  content: React.ReactNode;
}

interface Props {
  tabs: ITab[];
}

export default function Tabbed({ tabs }: Props) {
  const [i, set_i] = useState<number>(0);

  return (
    <div className={styles.container}>
      <ul className={styles.nav}>
        {tabs.map((tab, j) => (
          <li key={j}>
            <button
              onClick={() => set_i(j)}
              className={i === j ? styles.selected : ""}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.content}>{tabs[i] ? tabs[i].content : null}</div>
    </div>
  );
}
