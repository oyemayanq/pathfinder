import "./styles/app.css";
import React from "react";

import Main from "./components/Main";
import Nav from "./components/Nav";

const App = () => {
  return (
    <div>
      <Nav />
      <Main />
    </div>
  );
};

export default App;
