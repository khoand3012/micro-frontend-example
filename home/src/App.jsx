import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";
// import Header from "./Header";
const Header = React.lazy(() => loadRemoteModule('header_v1', './Header'))
import Footer from "./Footer";
import { loadRemoteModule } from "./load-remote-modules";

const App = () => (
  <div className="text-3xl mx-auto max-w-6xl">
    <Header></Header>
    <div>Page Content here!</div>
    <Footer></Footer>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
