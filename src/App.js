import React, { useEffect } from "react";
import Provider from "./context/";
import ThemeProvider from "./features/ThemeProvider";
import Nav from "./features/Nav";
import Main from "./features/Main";
import packageJson from "../package.json";
const App = () => {
  //   window.onunload = () => {
  //     localStorage.clear();
  //   };

  return (
    <Provider>
      <ThemeProvider>
        <Nav />
        <Main />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
