import React from "react";
import StoreItemCard from "../modules/StoreItemCard";
import { Grid, Box, Tooltip } from "@mui/material";

import { User, StoreItem, get, COLOR_OPTIONS } from "../../util";

const StorePage = ({
  user,
  updateUser,
}: {
  user?: User;
  updateUser: (user: User) => void;
}) => {
  const [owned, setOwned] = React.useState<StoreItem[]>([]);

  React.useEffect(() => {
    const setup = async () => {
      const items = await get("/api/items/");
      items && setOwned(items);
    };
    setup();
  }, []);

  // how to do this without a useEffect?
  let itemsList = [];
  for (let i = 0; i < COLOR_OPTIONS.length; i++) {
    let newItemBeak = {
      type: "beak",
      properties: { color: COLOR_OPTIONS[i] },
      identifier: "beak_" + COLOR_OPTIONS[i],
    };
    itemsList.push(newItemBeak);
    let newItemBody = {
      type: "duck",
      properties: { color: COLOR_OPTIONS[i] },
      identifier: "duck_" + COLOR_OPTIONS[i],
    };
    itemsList.push(newItemBody);
  }
  const items = itemsList;

  let ownedList = [];
  for (let i = 0; i < owned.length; i++) {
    // console.log(owned[i].identifier);
    ownedList.push(owned[i].identifier);
  }
  const ownedString = ownedList;

  //updates Owned List so user doesn't have to reload page
  const purchase = async () => {
    const res = await get("/api/items/");
    if (!res?.error) {
      res && setOwned(res);
    }
  };

  //dividing store between beak and duck
  const beakOptions = items
    .filter((item) => item.type === "beak")
    .map((item) => item);

  const duckOptions = items
    .filter((item) => item.type === "duck")
    .map((item) => item);

  return (
    <div>
      <div className="flex flex-column primary-text">
        <h1 className="tc f-subheadline ma0 pa0 primary-text">Store</h1>
        <Tooltip
          title={
            <div className="f3 fw3">Complete tasks to earn more coins!</div>
          }
          arrow
        >
          <h2 className="tc f1 lh-copy ma0 pt3 primary-text">
            Coins: {user.coins}
          </h2>
        </Tooltip>
      </div>
      <Box className="ma4" sx={{ width: "100%" }}>
        <h1 className="mr2 primary-text">Beak Color | 200 Coins</h1>
        <Grid
          container
          direction="row"
          wrap="wrap"
          rowSpacing={4}
          columnSpacing={4}
        >
          {beakOptions.map((item) =>
            ownedString.includes(item.identifier) ? (
              <Grid item xs={1.7}>
                <StoreItemCard
                  user={user}
                  item={item}
                  own={true}
                  purchase={purchase}
                  updateUser={updateUser}
                />
              </Grid>
            ) : (
              <Grid item xs={1.7}>
                <StoreItemCard
                  user={user}
                  item={item}
                  own={false}
                  purchase={purchase}
                  updateUser={updateUser}
                />
              </Grid>
            )
          )}
        </Grid>
      </Box>

      <Box className="ma4" sx={{ width: "100%" }}>
        <h1 className="mr2 primary-text">Duck Color | 250 Coins</h1>
        <Grid
          container
          direction="row"
          wrap="wrap"
          rowSpacing={4}
          columnSpacing={4}
        >
          {duckOptions.map((item) =>
            ownedString.includes(item.identifier) ? (
              <Grid item xs={1.7}>
                <StoreItemCard
                  user={user}
                  item={item}
                  own={true}
                  purchase={purchase}
                  updateUser={updateUser}
                />
              </Grid>
            ) : (
              <Grid item xs={1.7}>
                <StoreItemCard
                  user={user}
                  item={item}
                  own={false}
                  purchase={purchase}
                  updateUser={updateUser}
                />
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default StorePage;
