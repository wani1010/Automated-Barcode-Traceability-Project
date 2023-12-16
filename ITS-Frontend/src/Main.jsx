import React, { Component } from "react";
import AuthService from "./Auth";
import config from "./Components/config";
import SignIn from "./SignIn";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";

class Main extends Component {
  state = {
    loading: true,
    loggedIn: false
  };

  componentDidMount() {
    // toast.configure({
    //     autoClose: 3000,
    // })
    // new AuthService().logout();
    // console.log("main");
    if (new AuthService(config.baseUrl).loggedIn()) {
      this.setState({
        loading: false,
        loggedIn: true
      });
    } else {
      this.setState({
        loading: false,
        loggedIn: false
      });
    }
  }

  login = (username, password) => {
    this.setState({
      loading: true,
      loggedIn: false
    });

    new AuthService(config.baseUrl)
      .login(username, password)
      .then(() => {
        this.setState({
          loading: false,
          loggedIn: true
        });
        // toast.info('Login successful!');
      })
      .catch(() => {
        // toast.error('Email or password incorrect!');
        this.setState({
          loading: false,
          loggedIn: false
        });
      });
  };

  render() {
    if (this.state.loading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }

    if (!this.state.loggedIn) {
      return <SignIn login={this.login} />;
    }

    return (
      <Router>
        <App />
      </Router>
    );
  }
}

export default Main;
