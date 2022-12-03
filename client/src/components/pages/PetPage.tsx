import React from "react";
import {
  User,
  Pet,
  StoreItem,
  ColorOption,
  get,
  // COLOR_OPTIONS,
  MUI_BUTTON_STYLE,
  patch,
} from "../../util";
import Duck from "../modules/Duck";
import { Button, IconButton, MenuItem, Select, TextField } from "@mui/material";
import { Edit, Lock } from "@mui/icons-material";

const PetPage = ({
  user,
  updateUser,
}: {
  user?: User;
  updateUser: (user: User) => void;
}) => {
  const [pet, setPet] = React.useState<Pet>();
  const [beakColor, setbeakColor] = React.useState<ColorOption>("orange");
  const [bodyColor, setbodyColor] = React.useState<ColorOption>("yellow");
  const [items, setItems] = React.useState<StoreItem[]>([]);
  const [editing, setEditing] = React.useState(false);
  const [duckName, setDuckName] = React.useState("");

  React.useEffect(() => {
    get(`/api/pets/${user.username}`).then((pet) => {
      if (pet) {
        setPet(pet);
        setbeakColor(pet.itemsOn.beak);
        setbodyColor(pet.itemsOn.duck);
        setDuckName(pet.petName);
      }
    });
    get(`/api/items/`).then((items) => {
      items && setItems(items);
    });
  }, [user.username]);

  const saveDuck = () => {
    patch("/api/pets/updateItemsOn", { duck: bodyColor, beak: beakColor }).then(
      (duck) => {
        duck && setPet(duck);
      }
    );
  };

  const feedDuck = () => {
    patch("/api/pets/feed").then((res) => {
      if (res) {
        const { healthDelta, coinsDelta } = res;
        setPet({ ...pet, health: pet.health + healthDelta });
        updateUser({ ...user, coins: user.coins + coinsDelta });
      }
    });
  };

  const saveName = () => {
    duckName !== pet.petName &&
      patch("/api/pets/updateName", { petName: duckName }).then(() => {
        setPet({ ...pet, petName: duckName });
      });
  };

  const beakOptions = items
    .filter((item) => item.type === "beak")
    .map((item) => item.properties.color) as ColorOption[];

  const duckOptions = items
    .filter((item) => item.type === "duck")
    .map((item) => item.properties.color) as ColorOption[];

  return pet && user ? (
    <div className="flex flex-column primary-text items-center">
      <h1 className="tc f-subheadline ma0 pa0 i">{pet.petName}</h1>
      <Button
        className="w-fc m-auto"
        variant="contained"
        style={MUI_BUTTON_STYLE}
        onClick={feedDuck}
      >
        Feed Me!
      </Button>
      <h2>
        Coins: {user.coins} | Health: {pet.health}
      </h2>
      <div className="ba bw1 br2 b--near-black w-50">
        <div
          className={
            pet.health < 33
              ? "bg-dark-red"
              : pet.health < 66
              ? "bg-yellow"
              : "bg-green"
          }
          style={{ height: 20, width: `${pet.health}%` }}
        ></div>
      </div>
      <div className="m-auto w-fc">
        <Duck size={450} beakColor={beakColor} bodyColor={bodyColor} />
      </div>
      <div className="flex flex-row items-center justify-center">
        {editing ? (
          <TextField
            value={duckName}
            onChange={(e) => setDuckName(e.target.value)}
          />
        ) : (
          <h2 className="i">{pet.petName}</h2>
        )}

        <IconButton
          onClick={() => {
            if (editing) {
              saveName();
            }
            setEditing(!editing);
          }}
        >
          {editing ? <Lock /> : <Edit />}
        </IconButton>
      </div>

      <div className="flex flex-row items-center justify-center">
        <h3 className="mr2">Beak Color:</h3>
        <Select
          value={beakColor}
          onChange={(e) => setbeakColor(e.target.value as ColorOption)}
          className="bg-near-white mv2"
          variant="outlined"
        >
          {beakOptions.map((color) => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="flex flex-row items-center justify-center">
        <h3 className="mr2">Duck Color:</h3>
        <Select
          value={bodyColor}
          onChange={(e) => setbodyColor(e.target.value as ColorOption)}
          className="bg-near-white mv2"
          variant="outlined"
        >
          {duckOptions.map((color) => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Button
        onClick={saveDuck}
        className="w-fc m-auto"
        variant="contained"
        style={MUI_BUTTON_STYLE}
      >
        Save
      </Button>
    </div>
  ) : (
    <></>
  );
};

export default PetPage;
