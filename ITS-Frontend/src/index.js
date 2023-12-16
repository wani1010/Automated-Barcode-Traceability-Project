import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./Main";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  // <Main></Main>,
  document.getElementById("root")
);

serviceWorker.unregister();
