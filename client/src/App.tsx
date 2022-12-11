import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/modules/Nav";
// import Footer from "./components/modules/Footer";
import HomePage from "./components/pages/HomePage";
import NotFoundPage from "./components/pages/NotFoundPage";
import AboutPage from "./components/pages/AboutPage";
import LoginPage from "./components/pages/LoginPage";
import PetPage from "./components/pages/PetPage";
import SettingsPage from "./components/pages/SettingsPage";
import ListPage from "./components/pages/ListPage";
import StorePage from "./components/pages/StorePage";
import ListViewPage from "./components/pages/ListViewPage";
import "./app.css";
import { get, post, del } from "./util";
import type { User } from "./util";

const { useState, useEffect } = React;

const App = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const setup = async () => {
      const res = await get("/api/users/session");
      res && setUser(res.user);
    };
    setup();
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

  const logout = async () => {
    await del("/api/users/session");
    setUser(undefined);
  };

  const deleteAccount = async () => {
    await del("/api/users");
    setUser(undefined);
  };

  return (
    <BrowserRouter>
      <Nav user={user} logout={logout} />
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} updateUser={updateUser} />}
        />
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
        {user && (
          <Route
            path="/pet/"
            element={<PetPage user={user} updateUser={updateUser} />}
          />
        )}
        {user && (
          <Route
            path="/settings/"
            element={
              <SettingsPage
                user={user}
                updateUser={updateUser}
                deleteAccount={deleteAccount}
              />
            }
          />
        )}
        {user && (
          <Route
            path="/store/"
            element={<StorePage user={user} updateUser={updateUser} />}
          />
        )}
        {user && (
          <Route
            path="/list/:listId"
            element={<ListPage user={user} updateUser={updateUser} />}
          />
        )}
        {user && (
          <Route
            path="/lists/"
            element={<ListViewPage user={user} updateUser={updateUser} />}
          />
        )}
        {/* Make sure this is the last route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default App;
