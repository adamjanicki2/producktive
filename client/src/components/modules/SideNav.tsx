import React from "react";
import { Edit, Delete } from "@mui/icons-material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { List, get, post, patch, del, MUI_BUTTON_STYLE } from "../../util";

const SideNav = () => {
  const [lists, setLists] = React.useState<List[]>([]);
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    const setup = async () => {
      const lists = await get("/api/lists/all");
      if (lists.error) {
        setLists([]);
      } else {
        setLists(lists);
      }
    };
    setup();
  }, []);

  const submitList = async () => {
    const list = await post("/api/lists/", { title });
    if (list?.error) {
      window.alert(list.error);
    } else {
      setLists([...(lists || []), list]);
      setTitle("");
    }
  };

  const deleteList = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      const list = await del(`/api/lists/${id}`);
      if (list?.error) {
        window.alert(list.error);
      } else {
        setLists(lists.filter((l) => l._id !== id));
      }
    }
  };

  const editListName = async (id: string, updatedTitle: string) => {
    const list = await patch(`/api/lists/${id}`, { title: updatedTitle });
    if (list?.error) {
      window.alert(list.error);
    } else {
      setLists(lists.map((l) => (l._id === id ? list : l)));
    }
  };

  return (
    <div className="flex flex-column primary-text sidenav w-20">
      <h1 className="tc f2 ph3">Todo Lists</h1>
      <hr className="b--primary bw1 ba primary w-100" />
      {lists &&
        lists.length !== 0 &&
        lists.map((list, index) => (
          <div className="pa2" key={`list${index}`}>
            <ListNode
              list={list}
              deleteList={deleteList}
              editListName={editListName}
            />
            <hr className="b--primary ba primary w-100" />
          </div>
        ))}
      <TextField
        placeholder="Create a new list..."
        className="bg-near-white ma1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        onClick={() => {
          submitList();
        }}
        style={MUI_BUTTON_STYLE}
        variant="contained"
      >
        Create List
      </Button>
    </div>
  );
};

const ListNode = ({
  list,
  editListName,
  deleteList,
}: {
  list: List;
  editListName: (id: string, title: string) => void;
  deleteList: (id: string) => void;
}) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>(list.title);

  return (
    <div className="flex flex-row items-center justify-between">
      {editing ? (
        <TextField value={title} onChange={(e) => setTitle(e.target.value)} />
      ) : (
        <Link
          className="f2 fw4 no-underline underline-hover primary-text"
          to={`/list/${list._id}`}
        >
          {title}
        </Link>
      )}{" "}
      <div className="flex flex-row items-center">
        {editing ? (
          <div className="mv2">
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={() => {
                if (editing) {
                  editListName(list._id, title);
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
        <Tooltip arrow title="Delete">
          <IconButton onClick={() => deleteList(list._id)} className="w-fc">
            <Delete className="dark-red" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default SideNav;
