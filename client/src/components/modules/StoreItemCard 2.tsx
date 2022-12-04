import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import React from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MenuItem, Select } from "@mui/material";

import {
  User,
  StoreItem,
  ColorOption,
  get,
  COLOR_OPTIONS,
  MUI_BUTTON_STYLE,
  patch,
  post,
  List
} from "../../util";

const StoreItemCard = ({ user, item , own}: { user?: User; item: StoreItem, own: boolean }) => {
  let [items, setItems] = React.useState<StoreItem[]>([]);

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
          <h3 className="mr2">{item.type}: {item.properties.color} </h3>
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
