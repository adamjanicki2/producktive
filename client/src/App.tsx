import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/modules/Nav";
import Footer from "./components/modules/Footer";
import HomePage from "./components/pages/HomePage";
import NotFoundPage from "./components/pages/NotFoundPage";
import AboutPage from "./components/pages/AboutPage";
import LoginPage from "./components/pages/LoginPage";
import ProfilePage from "./components/pages/ProfilePage";
import SettingsPage from "./components/pages/SettingsPage";
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

  const updateUser = (user: User) => {
    setUser(user);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = await post("/api/users/session", { email, password });
    if (user?.user) {
      setUser(user.user);
      return true;
    }
    window.alert(user?.error ?? "Error logging in.");
    return false;
  };

  const createAccount = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const user = await post("/api/users", { email, password });
    if (user?.user) {
      setUser(user.user);
      return true;
    }
    window.alert(user?.error ?? "Error logging in.");
    return false;
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
        <Route path="/profile/" element={<ProfilePage user={user} />} />
        <Route
          path="/settings/"
          element={<SettingsPage user={user} updateUser={updateUser} />}
        />
        {/* Make sure this is the last route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
