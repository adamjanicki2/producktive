import React from "react";
import {
  User,
  Pet,
  StoreItem,
  ColorOption,
  get,
  MUI_BUTTON_STYLE,
  patch,
} from "../../util";
import Duck from "../modules/Duck";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

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
  const [disabled, setDisabled] = React.useState(false);
  const [feedCount, setFeedCount] = React.useState(0);
  const [editingDuck, setEditingDuck] = React.useState(false);
  const [editingBeak, setEditingBeak] = React.useState(false);

  React.useEffect(() => {
    const setup = async () => {
      const pet = await get(`/api/pets/${user.username}`);
      if (pet) {
        setPet(pet);
        setbeakColor(pet.itemsOn.beak);
        setbodyColor(pet.itemsOn.duck);
        setDuckName(pet.petName);
      }
      const items = await get(`/api/items/`);
      items && setItems(items);
    };

    const getFeedCount = async () => {
      const feedCount = await get(`/api/pets/feedAmount`);

      feedCount && setFeedCount(feedCount.amount);
    };

    setup();
    getFeedCount();
  }, [user.username]);

  const saveDuck = async () => {
    const duck = await patch("/api/pets/updateItemsOn", {
      duck: bodyColor,
      beak: beakColor,
    });
    duck && setPet(duck);
    setEditingBeak(false);
    setEditingDuck(false);
    window.alert("Changes to your duck have been saved!");
  };

  const feedDuck = async () => {
    setDisabled(true);
    const res = await patch("/api/pets/feed");
    if (!res?.error) {
      const { healthDelta, coinsDelta, feedCount } = res;
      setPet({ ...pet, health: pet.health + healthDelta });
      updateUser({ ...user, coins: user.coins + coinsDelta });
      setFeedCount(feedCount);
    } else {
      window.alert(res.error);
    }
    setDisabled(false);
  };

  const saveName = async () => {
    if (duckName !== pet.petName && duckName.trim() !== "") {
      await patch("/api/pets/updateName", { petName: duckName });
      setPet({ ...pet, petName: duckName });
    }
  };

  const beakOptions = items
    .filter((item) => item.type === "beak")
    .map((item) => item.properties.color) as ColorOption[];

  const duckOptions = items
    .filter((item) => item.type === "duck")
    .map((item) => item.properties.color) as ColorOption[];

  function editBeak(e) {
    setbeakColor(e.target.value as ColorOption);
    setEditingBeak(true);
  }

  function editDuck(e) {
    setEditingDuck(true);
    setbodyColor(e.target.value as ColorOption);
  }

  return pet && user ? (
    <div className="flex flex-column primary-text items-center">
      <div className="flex flex-row items-center justify-center">
        {editing ? (
          <TextField
            sx={{ mt: 3, mb: 3 }}
            value={duckName}
            onChange={(e) => setDuckName(e.target.value)}
          />
        ) : (
          <h1 className="tc f-subheadline mv3 ph4 pv2 i">
            {pet.petName}
          </h1>
        )}

        {editing ? (
          <div className="mv2">
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={() => {
                if (editing) {
                  saveName();
                }
                setEditing(!editing);
              }}
            >
              Save
            </Button>
          </div>
        ) : (
          <IconButton>
            <Edit
              className="black"
              onClick={() => {
                setEditing(!editing);
              }}
            />
          </IconButton>
        )}
      </div>

      <hr className="moon-gray b--moon-gray ba bw1 w-60" />
      <div className="flex flex-row items-center justify-center">
        <Tooltip
          title={
            <div className="f3 fw3">Complete tasks to earn more coins and feed your duck to increase health!</div>
          }
          arrow
        >
          <h2 className="flex flex-row items-center justify-center">
            Coins: {user.coins} | Health: {pet.health}
          </h2>
        </Tooltip>
      </div>
      { feedCount !== 0 && (<div className="flex flex-row items-center justify-center">
      <Button
          className="w-fc m-auto"
          variant="contained"
          style={MUI_BUTTON_STYLE}
          onClick={feedDuck}
          disabled={disabled}
        >
          Feed Me {feedCount} Health ({feedCount * 15} coins)
        </Button>
      </div> )}
      { feedCount === 0 && pet.health !== 100 &&(<div className="flex flex-row items-center justify-center">
          Complete Todos to Earn Coins and Buy Food (15 coins per unit food)
      </div> )}
      { feedCount === 0 && pet.health === 100 &&(<div className="flex flex-row items-center justify-center">
          Come Back Tomorrow to Feed Duck!
      </div> )}
      <br></br>
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
        <Duck
          size={450}
          beakColor={beakColor}
          bodyColor={bodyColor}
          petHealth={pet.health}
        />
      </div>

    <div className="flex flex-row items-center justify-center">
      <div className="flex flex-row items-center justify-center">
        <h3 className="mr2">Beak Color:</h3>
        <Select
          value={beakColor}
          onChange={editBeak}
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
        <h3 className="mr2 ml3">Duck Color:</h3>
        <Select
          value={bodyColor}
          onChange={editDuck}
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

      <div className="ml3">
        {editingBeak || editingDuck ? (
          <Button
            onClick={saveDuck}
            className="w-fc m-auto"
            variant="contained"
            style={MUI_BUTTON_STYLE}
          >
            Save
          </Button>
        ) : (
          <></>
        )}
      </div> 
    </div>

    </div>
  ) : (
    <></>
  );
};

export default PetPage;
