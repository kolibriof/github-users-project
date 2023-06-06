import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const globalContext = React.createContext();

const GlobalContextProvider = ({ children }) => {
  return (
    <globalContext.Provider value={{ hello: "ddd" }}>
      {children}
    </globalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(globalContext);
};

export { globalContext, GlobalContextProvider };
