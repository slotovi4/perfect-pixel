import React from "react";
import { cn } from "@bem-react/classname";
import logo from "./logo.svg";
import "./Home.scss";

const Home = () => {
    const home = cn("Home");
    
    return (
        <section className={home()}>
            <header className={home("Header")}>
                <img src={logo} className={home("Logo")} alt="logo" />
                <h1 className={home("Title")}>Welcome to React</h1>
            </header>
            <p className={home("Intro")}>
                To get started, edit <code>src/App.tsx</code> and save to reload.
            </p>
        </section>
    )
}

export default Home
