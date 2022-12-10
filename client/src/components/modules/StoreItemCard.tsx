import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";

import { User, StoreItem, post } from "../../util";
// import { COLOR_TO_HEX } from "./Duck";

const StoreItemCard = ({
  user,
  item,
  own,
  purchase,
  updateUser,
}: {
  user?: User;
  item: StoreItem;
  own: boolean;
  purchase: () => void;
  updateUser: (user: User) => void;
}) => {
  const purchaseItem = async () => {
    const res = await post("/api/items/", {
      type: item.type,
      identifier: item.identifier,
      properties: item.properties,
    });
    if (res?.error) {
      window.alert(res.error);
    } else {
      const { coinsDelta } = res;
      purchase();
      updateUser({ ...user, coins: user.coins + coinsDelta });
    }
  };

  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardMedia
        component="img"
        height="50%"
        image={require('../../color_cards/' + item.type + '_' + item.properties.color  + '.png')}
      />
      <CardContent>
        <div className="flex flex-row items-center justify-center">
          <h3 className="mr2 primary-text">{item.properties.color.toUpperCase()}</h3>
        </div>
      </CardContent>
      <CardActions className="flex flex-row items-center justify-center">
        <div>
          {own ? (
            <p className="primary-text pa0 ma2 fw5">Already Own</p>
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
