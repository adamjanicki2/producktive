import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/modules/Nav";
import HomePage from "./components/pages/HomePage";
import NotFoundPage from "./components/pages/NotFoundPage";
import AboutPage from "./components/pages/AboutPage";
import LoginPage from "./components/pages/LoginPage";
import Profile from "./components/pages/Profile";
import "./app.css";
import { get, post, del } from "./util";
import type { User } from "./util";

const { useState, useEffect } = React;

const App = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    get("/api/users/session").then((user) => {
      user && setUser(user.user);
    });
  }, []);

  const login = async (email: string, password: string) => {
    post("/api/users/session", { email, password }).then((user) => {
      if (user?.user) {
        setUser(user.user);
      } else {
        window.alert(user?.error ?? "Error logging in.");
      }
    });
  };

  const createAccount = async (email: string, password: string) => {
    post("/api/users", { email, password }).then((user) => {
      if (user?.user) {
        setUser(user.user);
      } else {
        window.alert(user?.error ?? "Error logging in.");
      }
    });
  };

  const logout = () => {
    del("/api/users/session").then(() => {
      setUser(undefined);
    });
  };

  return (
    <BrowserRouter>
      <Nav user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route
          path="/login/"
          element={<LoginPage type="login" onFormSubmitCallback={login} />}
        />
        <Route
          path="/create/"
          element={
            <LoginPage type="create" onFormSubmitCallback={createAccount} />
          }
        />
        <Route path="/profile/" element={<Profile user={user} />} />
        {/* Make sure this is the last route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
