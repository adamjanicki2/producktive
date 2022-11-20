import React from "react";
import { Link } from "react-router-dom";
import { post } from "../../util";

const otherType = (type: "login" | "create") =>
  type === "login" ? "create" : "login";

const PAGE_TITLE = {
  login: "Login",
  create: "Create Account",
} as const;

const PAGE_MESSAGE = {
  create: "New to Producktive?",
  login: "Already joined Producktive?",
} as const;

const Login = ({
  type,
  onFormSubmitCallback,
}: {
  type: "login" | "create";
  onFormSubmitCallback: (email: string, password: string) => void;
}) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (email && password) {
      onFormSubmitCallback(email, password);
    }
  };

  return (
    <div className="flex flex-column">
      <h1 className="tc f-subheadline ma0 pa0">{PAGE_TITLE[type]}</h1>
      <h2 className="tc">{PAGE_MESSAGE[type]}</h2>
      <form
        className="flex flex-column w-70 m-auto items-center"
        onSubmit={handleFormSubmit}
      >
        <label className="ma2">
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="ma2">
          Password:
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" className="pointer" value={PAGE_TITLE[type]} />
      </form>
      <h2 className="tc">
        {PAGE_MESSAGE[otherType(type)]}{" "}
        <Link to={`/${otherType(type)}`}>{PAGE_TITLE[otherType(type)]}</Link>.
      </h2>
    </div>
  );
};

export default Login;
