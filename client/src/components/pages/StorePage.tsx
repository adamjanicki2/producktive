import React from "react";
import { styled } from '@mui/material/styles';
import StoreItemCard from "../modules/StoreItemCard"
import {Grid, Paper, Box } from "@mui/material";

import {
  User,
  StoreItem,
  get,
  COLOR_OPTIONS,
} from "../../util";

const StorePage = ({ user }: { user: User }) => {
  const [owned, setOwned] = React.useState<StoreItem[]>([]);

  React.useEffect(() => {
    get(`/api/items/`).then((items) => {
      items && setOwned(items);
    });
  }, []);

  // how to do this without a useEffect?
  let itemsList = [];
    for (let i=0; i < COLOR_OPTIONS.length; i++) {
      let newItemBeak = {type: "beak", properties: { "color": COLOR_OPTIONS[i] }, identifier: "beak_" + COLOR_OPTIONS[i]};
      itemsList.push(newItemBeak);
      let newItemBody = {type: "duck", properties: { "color": COLOR_OPTIONS[i] }, identifier: "duck_" + COLOR_OPTIONS[i]};
      itemsList.push(newItemBody);
    };
  const items = itemsList;

  let ownedList = [];
  for (let i=0; i < owned.length; i++) {
    console.log(owned[i].identifier);
    ownedList.push(owned[i].identifier)
  };
  const ownedString = ownedList;


  //dividing store between beak and duck
  const beakOptions = items
    .filter((item) => item.type === "beak")
    .map((item) => item);

  const duckOptions = items
    .filter((item) => item.type === "duck")
    .map((item) => item);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <div>
      <Box sx={{ width: '100%' }}>
      <h1 className="mr2 primary-text">Beak Color: </h1>
        <Grid container direction="row"
              wrap="wrap"
              rowSpacing={4}
              columnSpacing={4}>
        {beakOptions.map((item) => (
          ownedString.includes(item.identifier)  ? (
            <Grid item xs={1.7} >
              <StoreItemCard user={user} item={item} own={true} price={1}/>
            </Grid>
          ) : (
            <Grid item xs={1.7}>
            <StoreItemCard user={user} item={item} own={false} price={1}/>
          </Grid>
          )
      ))}
        </Grid>
      </Box>

      <Box sx={{ width: '100%' }}>
      <h1 className="mr2 primary-text">Duck Color: </h1>
        <Grid container direction="row"
              wrap="wrap"
              rowSpacing={4}
              columnSpacing={4}>
        {duckOptions.map((item) => (
          ownedString.includes(item.identifier)  ? (
            <Grid item xs={1.7} >
              <StoreItemCard user={user} item={item} own={true} price={2}/>
            </Grid>
          ) : (
            <Grid item xs={1.7}>
            <StoreItemCard user={user} item={item} own={false} price={2}/>
          </Grid>
          )
      ))}
        </Grid>
      </Box>
      
    </div>

  );
}


export default StorePage;
