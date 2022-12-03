import React from "react";
// import { User } from "../../util";
// import { styled } from '@mui/material/styles';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import Divider from '@mui/material/Divider';
// import { MenuItem, Select } from "@mui/material";
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/Inbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
import StoreItemCard from "../modules/StoreItemCard"


import {
  User,
  Pet,
  StoreItem,
  ColorOption,
  get,
  COLOR_OPTIONS,
} from "../../util";

const StorePage = ({ user }: { user: User }) => {
  const [beakColor, setbeakColor] = React.useState<ColorOption>("orange");
  const [bodyColor, setbodyColor] = React.useState<ColorOption>("yellow");
  // const [items, setItems] = React.useState<StoreItem[]>([]);
  const [owned, setOwned] = React.useState<StoreItem[]>([]);
  // const [ownedString, setOwnedString] = React.useState<string[]>([]);


  React.useEffect(() => {
    get(`/api/items/`).then((items) => {
      items && setOwned(items);
    });

  }, []);

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

  return (
    <div>
      
          <div className="flex flex-wrap" >
          {items.map((item) => (
             ownedString.includes(item.identifier)  ? (
              <StoreItemCard user={user} item={item} own={true}/>
              ) : (
              <StoreItemCard user={user} item={item} own={false}/>
              )
          ))}
          </div>
      
    </div>

  );
}


export default StorePage;
