import React from "react";
import type { User } from "../../util";
import { patch, MUI_BUTTON_STYLE, del } from "../../util";
import { Button, TextField } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const Settings = ({
  user,
  updateUser,
}: {
  user?: User;
  updateUser: (user: User) => void;
}) => {
  const [email, setEmail] = React.useState<string>(user?.email);
  const [password, setPassword] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>(user?.username);
  const [notifPeriod, setNotifPeriod] = React.useState<User["notifPeriod"]>(
    user?.notifPeriod
  );

  const updateAccount = async (updateObject: {
    email?: string;
    password?: string;
    username?: string;
    notifPeriod?: User["notifPeriod"];
  }) => {
    const updatedUser = await patch("/api/users", updateObject);
    if (updatedUser?.user) {
      updateUser(updatedUser.user);
      if (updateObject.email) return window.alert("Email updated!");
      if (updateObject.password) return window.alert("Password updated!");
      if (updateObject.username) return window.alert("Username updated!");
      if (updateObject.notifPeriod)
        return window.alert("Notification period updated!");
    } else {
      window.alert(updatedUser?.error ?? "Error updating account information.");
    }
  };

  const deleteAccount = async () => {
    const pet = await del(`/api/users`);
    
  };

  return (
    <div className="flex flex-column primary-text">
      {user && (
        <>
          <h1 className="tc f-subheadline ma0 pa0">Settings</h1>
          <h2 className="tc mh4">
            Welcome back <span className="i">{user.username}</span>!
          </h2>
          <div className="flex flex flex-column m-auto items-center pa3">
            <TextField
              placeholder="New Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => updateAccount({ email })}
              style={MUI_BUTTON_STYLE}
            >
              Change Email
            </Button>
          </div>
          <div className="flex flex flex-column m-auto items-center pa3">
            <TextField
              placeholder="New Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => updateAccount({ username })}
              style={MUI_BUTTON_STYLE}
            >
              Change Username
            </Button>
          </div>
          <div className="flex flex flex-column m-auto items-center pa3">
            <TextField
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => updateAccount({ password })}
              style={MUI_BUTTON_STYLE}
            >
              Change Password
            </Button>

            <Button
              variant="contained"
              onClick={() => deleteAccount()}
              style={MUI_BUTTON_STYLE}
            >
              Delete Your Account
            </Button>
          </div>
          <div className="flex flex flex-column m-auto items-center pa3">
            <ToggleButtonGroup
              size="small"
              value={notifPeriod}
              exclusive
              onChange={(
                event: React.MouseEvent<HTMLElement>,
                newPref: string
              ) => {
                setNotifPeriod(newPref as User["notifPeriod"]);
              }}
              aria-label="Small sizes"
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="none">None</ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              onClick={() => updateAccount({ notifPeriod })}
              style={MUI_BUTTON_STYLE}
            >
              Change Notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
