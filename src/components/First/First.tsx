import * as React from "react";
import { cn } from "@bem-react/classname";

import "./First.scss";
import logo from "./logo.svg";

export default class First extends React.Component {
  public render() {
    const first = cn("First");

    return (
      <section className={first()}>
        <header className={first("Header")}>
          <img src={logo} className={first("Logo")} alt="logo" />
          <h1 className={first("Title")}>Welcome to React</h1>
        </header>
        <p className={first("Intro")}>
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </section>
    );
  }
}
