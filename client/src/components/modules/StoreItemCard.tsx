import React from "react";
import {Card, CardActions, CardContent, Divider, Typography, Button, CardMedia } from "@mui/material";

import {
  User,
  StoreItem,
  MUI_BUTTON_STYLE,
  post,
} from "../../util";

const StoreItemCard = ({ user, item , own, price}: { user?: User; item: StoreItem, own: boolean, price: number }) => {
  // let [items, setItems] = React.useState<StoreItem[]>([]);

  const purchaseItem = () => {
    post("/api/items/", { type: item.type, identifier: item.identifier, properties: item.properties }).then((itemtobuy) => {
      if (itemtobuy?.error) {
        window.alert(itemtobuy.error);
      }
    });
  };

  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardMedia
        component="img"
        height="220"
        image={require('/Users/dianeba3/Desktop/MIT_FALL_22/6.1040/producktive/client/src/color_images/' + item.properties.color + ".png")}
      />
      <CardContent>
        <div className="flex flex-row items-center justify-center">
          <h3 className="mr2">{item.properties.color} </h3>
            <br />
          <Typography variant="h6">
            -- {price} coins
           
          </Typography>
        </div>
      </CardContent>
      <CardActions className="flex flex-row items-center justify-center">
        <div>
          {own ? (
              <Button
                size="small"
                variant="outlined"
              >
                Already Own
              </Button>
          ) : (
            <Button
              onClick={purchaseItem}
              size="small"
              variant="contained"
            >
              Buy
            </Button>
          )}
          
        </div>
      </CardActions>
    </Card>
  );
}

export default StoreItemCard;
