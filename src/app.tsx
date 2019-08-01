import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { HomeContainer } from "./containers";
import store from "./redux/store";

class App extends React.Component {
    public render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact={true} path="/" component={HomeContainer} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default App;
