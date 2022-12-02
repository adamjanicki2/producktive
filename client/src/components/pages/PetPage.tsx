import React from "react";
import {
  User,
  Pet,
  StoreItem,
  ColorOption,
  get,
  COLOR_OPTIONS,
  MUI_BUTTON_STYLE,
} from "../../util";
import Duck from "../modules/Duck";
import { Button, MenuItem, Select } from "@mui/material";

const TEST_ITEMS: StoreItem[] = [
  {
    _id: "1",
    type: "beak",
    userId: "user1",
    identifier: "beak_color_blue",
    properties: {
      color: "blue",
    },
  },
  {
    _id: "2",
    type: "duck",
    userId: "user1",
    identifier: "body_color_purple",
    properties: {
      color: "purple",
    },
  },
];

const PetPage = ({ user }: { user?: User }) => {
  const [pet, setPet] = React.useState<Pet>();
  const [beakColor, setbeakColor] = React.useState<ColorOption>("orange");
  const [bodyColor, setbodyColor] = React.useState<ColorOption>("yellow");
  const [items, setItems] = React.useState<StoreItem[]>([]);

  React.useEffect(() => {
    get(`/api/pets/${user.username}`).then((pet) => {
      pet && setPet(pet);
    });
    get(`/api/items/`).then((items) => {
      // items && setItems(items);
      setItems(TEST_ITEMS);
    });
  }, [user.username]);

  const saveDuck = () => {
    console.log("saveDuck");
  };

  const beakOptions = items
    .filter((item) => item.type === "beak")
    .map((item) => item.properties.color)
    .concat(["orange"]) as ColorOption[];

  const duckOptions = items
    .filter((item) => item.type === "duck")
    .map((item) => item.properties.color)
    .concat(["yellow"]) as ColorOption[];

  return (
    <div className="flex flex-column primary-text items-center">
      <h1 className="tc f-subheadline ma0 pa0">Your Duck</h1>
      <div className="m-auto w-fc">
        <Duck size={450} beakColor={beakColor} bodyColor={bodyColor} />
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
      {pet && <h2 className="tc mh4">{JSON.stringify(pet)}</h2>}
    </div>
  );
};

export default PetPage;
