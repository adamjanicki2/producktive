import { Button, TextField } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  onFormSubmitCallback: (email: string, password: string) => Promise<void>;
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleSubmit = async () => {
    if (email && password) {
      await onFormSubmitCallback(email, password);
      navigate("/");
    }
  };

  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0">{PAGE_TITLE[type]}</h1>
      <h2 className="tc">{PAGE_MESSAGE[type]}</h2>
      <div className="flex flex-column w-70 m-auto items-center">
        <TextField
          style={{ margin: "4px" }}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <TextField
          style={{ margin: "4px" }}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button
          onClick={handleSubmit}
          style={{ textTransform: "none", margin: "4px" }}
          variant="contained"
        >
          {PAGE_TITLE[type]}
        </Button>
      </div>
      <h2 className="tc">
        {PAGE_MESSAGE[otherType(type)]}{" "}
        <Link to={`/${otherType(type)}`}>{PAGE_TITLE[otherType(type)]}</Link>.
      </h2>
    </div>
  );
};

export default Login;
