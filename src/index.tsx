import React from "react";
import ReactDOM from "react-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";


import App from './App'
import { RateProvider } from "./RateContext";

ReactDOM.render(
  <RateProvider>
    <App />
  </RateProvider>,
  document.querySelector("#root")
);
