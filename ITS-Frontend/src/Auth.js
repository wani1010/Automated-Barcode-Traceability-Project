import decode from "jwt-decode";
import axios from "axios";

export default class AuthService {
  // Initializing important variables
  constructor(domain) {
    axios.defaults.headers.common["Authorization"] = this.loggedIn()
      ? "Bearer " + this.getToken()
      : "";
    this.domain = domain || "http://localhost:8080/";
  }

  login = (email, password) => {
    // Get a token from api server using the fetch api
    console.log(email, password, "login");
    return axios
      .post(`${this.domain}login`, {
        email: email,
        password: password
      })
      .then(res => {
        console.log(res.data.token); // Setting the token in localStorage

        this.setToken(res.data.token); // Setting the token in localStorage
        return Promise.resolve(res);
      })
      .catch(() => {
        return Promise.reject("email or passowrd incorrect");
      });
  };

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // GEtting token from localstorage
    console.log(token, "token");
    return !!token && !this.isTokenExpired(token); // handwaiving here
  };

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  setToken = idToken => {
    // Saves user token to localStorage
    localStorage.setItem("jwt_token", idToken);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem("jwt_token");
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("jwt_token");
  };

  getProfile = () => {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  };

  getRole = () => {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken()).role;
  };
}
