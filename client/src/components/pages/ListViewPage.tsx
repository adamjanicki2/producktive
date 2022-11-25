import { Button, TextField } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { List, MUI_BUTTON_STYLE } from "../../util";

const TEMP_LISTS = [
  { _id: "1", title: "Chores" },
  { _id: "2", title: "Work" },
];

const ListView = () => {
  const [lists, setLists] = React.useState<List[]>();
  const [newList, setNewList] = React.useState<List>({
    _id: "Not set",
    title: "",
  });

  React.useEffect(() => {
    setLists(TEMP_LISTS);
  }, []);

  const submitList = () => {
    console.log("submitting list: ", newList);
  };

  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0 ">List View</h1>
      <div className="flex flex-column w-70 m-auto">
        {lists?.map((list) => (
          <Link className="ma2" to={`/list/${list._id}`}>
            {list.title}
          </Link>
        ))}
        <hr />
        <TextField
          placeholder="Create a new list..."
          className="bg-near-white ma1"
          value={newList.title}
          onChange={(e) => setNewList({ ...newList, title: e.target.value })}
        />
        <Button
          onClick={submitList}
          style={MUI_BUTTON_STYLE}
          variant="contained"
        >
          Create Task
        </Button>
      </div>
    </div>
  );
};

export default ListView;
