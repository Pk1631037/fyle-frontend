import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./components/Home/home.jsx";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App () {
    return (
      <Router >
        <Route exact path="/">
          <HomePage />
        </Route>
      </Router>
    );
}
export default App;
