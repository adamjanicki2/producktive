import React from "react";
import logo from "../../logo.svg";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../util";

const LINK_CLASS_NAME = "no-underline primary-text dim f3 fw3 mh2";

const Nav = ({
  user,
  logout,
}: {
  user?: User;
  logout: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-primary w-100 ma0 pa0">
      <div className="flex flex-row items-center justify-between ml3">
        <Link
          className="flex flex-row items-center pointer dim no-underline primary-text"
          to="/"
        >
          <img src={logo} width="48px" height="48px" alt="Logo" />
          <h1 className="i">PRODUCKTIVE</h1>
        </Link>
        <div className="flex flex-row items-center justify-around mr3">
          {(
            <Link className={LINK_CLASS_NAME} to="/">
              Home
            </Link>
          )}
          {user && (
            <Link className={LINK_CLASS_NAME} to="/lists/">
              Todos
            </Link>
          )}
          {user && (
            <Link className={LINK_CLASS_NAME} to="/pet/">
              Pet
            </Link>
          )}
          {user && (
            <Link className={LINK_CLASS_NAME} to="/store/">
              Store
            </Link>
          )}
          {(
            <Link className={LINK_CLASS_NAME} to="/about/">
              About
            </Link>
          )}
          {user && (
            <Link className={LINK_CLASS_NAME} to="/settings/">
              Settings
            </Link>
          )}
          {user ? (
            <div
              className={LINK_CLASS_NAME + " pointer"}
              onClick={() => {
                logout().then(() => {
                  navigate("/");
                });
              }}
            >
              Logout
            </div>
          ) : (
            <Link className={LINK_CLASS_NAME} to="/login/">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
