import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App/App";
import "./index.scss";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
