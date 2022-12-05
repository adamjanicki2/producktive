import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import { User, StoreItem, post } from "../../util";
import { COLOR_TO_HEX } from "./Duck";

const StoreItemCard = ({
  user,
  item,
  own,
  price,
  purchase,
  updateUser
}: {
  user?: User;
  item: StoreItem;
  own: boolean;
  price: number;
  purchase: () => void;
  updateUser: (user: User) => void;
}) => {
  const purchaseItem = () => {
    post("/api/items/", {
      type: item.type,
      identifier: item.identifier,
      properties: item.properties,
    }).then((itemtobuy) => {
      if (itemtobuy?.error) {
        window.alert(itemtobuy.error);
      }
    });
  };

  return (
    <Card sx={{ maxWidth: 275 }}>
      <div
        style={{
          height: 220,
          width: "100%",
          backgroundColor: COLOR_TO_HEX[item.properties.color].primary,
        }}
      ></div>
      <CardContent>
        <div className="flex flex-row items-center justify-center">
          <h3 className="mr2">{item.properties.color} </h3>
          <br />
          <Typography variant="h6">-- {price} coins</Typography>
        </div>
      </CardContent>
      <CardActions className="flex flex-row items-center justify-center">
        <div>
          {own ? (
            <Button size="small" variant="outlined">
              Already Own
            </Button>
          ) : (
            <Button onClick={purchaseItem} size="small" variant="contained">
              Buy
            </Button>
          )}
        </div>
      </CardActions>
    </Card>
  );
};

export default StoreItemCard;
