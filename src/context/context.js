import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const globalContext = React.createContext();

const getDataLocalStorage = (data) => {
  if (!localStorage.getItem(data)) {
    return mockFollowers;
  }
  return JSON.parse(localStorage.getItem(data));
};

const GlobalContextProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(
    getDataLocalStorage("github-user")
  );
  const [repos, setRepos] = useState(getDataLocalStorage("repos"));
  const [followers, setFollowers] = useState(getDataLocalStorage("followers"));
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ show: false, msg: "" });
  const searchGithubUser = async (user) => {
    setIsLoading(true);
    setIsError({ show: false, msg: "" });
    try {
      const response = await axios(`${rootUrl}/users/${user}`);
      if (response) {
        setGithubUser(response.data);
        localStorage.setItem("github-user", JSON.stringify(response.data));
        setIsLoading(false);
      } else {
        setIsError({ show: true, msg: "This user does not exist!" });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const searchGithubRepos = async (user) => {
    setIsLoading(true);
    try {
      const response = await axios(
        `https://api.github.com/users/${user}/repos?per_page=100`
      );
      if (repos) {
        setRepos(response.data);
        localStorage.setItem("repos", JSON.stringify(response.data));
      } else {
        setIsError({ show: true, msg: "Error! No repos loaded!" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const searchGithubFollowers = async (user) => {
    setIsLoading(true);
    try {
      const response = await axios(
        `https://api.github.com/users/${user}/followers`
      );
      console.log(response);
      if (repos) {
        setFollowers(response.data);
        localStorage.setItem("followers", JSON.stringify(response.data));
      } else {
        setIsError({ show: true, msg: "Error! No followers loaded!" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios(`${rootUrl}/rate_limit`);
      if (response.data.rate.remaining === 0) {
        setIsError({ show: true, msg: "Your limit is 0!" });
        throw new Error("No more requests left!!");
      }
      setRequests(response.data.rate.remaining);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    checkRequests();
  }, []);
  return (
    <globalContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        isLoading,
        isError,
        searchGithubUser,
        searchGithubRepos,
        searchGithubFollowers,
      }}
    >
      {children}
    </globalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(globalContext);
};

export { globalContext, GlobalContextProvider };
