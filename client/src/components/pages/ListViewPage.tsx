import React from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { del, get, List, MUI_BUTTON_STYLE, post } from "../../util";

const ListView = () => {
  const [lists, setLists] = React.useState<List[]>();
  const [newList, setNewList] = React.useState<List>({
    _id: "Not set",
    title: "",
  });

  React.useEffect(() => {
    get("/api/lists/all").then((lists) => {
      if (lists?.error) {
        setLists([]);
        window.alert("Error getting lists");
      } else {
        setLists(lists);
      }
    });
  }, []);

  const submitList = () => {
    post("/api/lists/", { title: newList.title }).then((list) => {
      if (list?.error) {
        window.alert(list.error);
      } else {
        setLists([...(lists || []), list]);
      }
    });
  };

  const deleteList = (id: string) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      del(`/api/lists/${id}`).then((list) => {
        if (list?.error) {
          window.alert(list.error);
        } else {
          setLists(lists.filter((l) => l._id !== id));
        }
      });
    }
  };

  return (
    <div className="flex flex-column primary-text">
      <h1 className="tc f-subheadline ma0 pa0 ">List View</h1>
      <div className="flex flex-column w-70 m-auto">
        {(!lists || !lists.length) && <h3>You don't have any lists!</h3>}
        {lists?.map((list, index) => (
          <div className="flex flex-row items-center" key={index}>
            <Link className="ma2" to={`/list/${list._id}`}>
              {list.title}
            </Link>
            <IconButton onClick={() => deleteList(list._id)}>
              <DeleteIcon />
            </IconButton>
          </div>
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
          Create List
        </Button>
      </div>
    </div>
  );
};

export default ListView;
