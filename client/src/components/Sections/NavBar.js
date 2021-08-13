import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Grid from "@material-ui/core/Grid";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import * as actions from "../../state/actions/user";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "10vh",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar({ props }) {
  const classes = useStyles();

  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { friends, followers } = user;
  const possibleFriends = followers.filter(
    (follower) => !friends.some((friend) => friend.id === follower.id)
  );

  const friendshipRequest = (possibleFriend) => {
    const { id, name, email, profilePicture } = user;
    dispatch(
      actions.sendFollower(
        { id, name, email, profilePicture },
        { id: possibleFriend.id }
      )
    );
    dispatch(actions.followUserRequest(possibleFriend, { userId: user.id }));
  };
  const baseURL = "/api";
  //const baseURL = "http://localhost:8000";

  const onLogout = () => {
    const getUser = async () => {
      try {
        const res = await axios.post(baseURL + "/users/signout");
        dispatch(actions.stopSocket());
        dispatch(actions.stopChat());
        dispatch(actions.stopConversations());
        dispatch(actions.stopUser());
        dispatch(actions.deleteSocket());

        props.history.push("/login");

        // if (res.data === null) {
        //   console.log('AAA');
        //   return <Redirect to={'/login'} />;
        // }
      } catch (error) {
        props.history.push("/login");
      }
    };
    getUser();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Chat Application
          </Typography>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
          >
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={possibleFriends.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Button>

          {possibleFriends.length > 0 && (
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {possibleFriends.map((possibleFriend) => (
                <MenuItem style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    {`${t("navbar.friendship")} ${possibleFriend.name} ?`}
                  </div>
                  <ButtonGroup
                    variant="contained"
                    color="primary"
                    aria-label="contained primary button group"
                  >
                    <Button onClick={() => friendshipRequest(possibleFriend)}>
                      <CheckCircleOutlineIcon />
                    </Button>
                    <Button color="secondary" onClick={handleClose}>
                      <HighlightOffIcon />
                    </Button>
                  </ButtonGroup>
                </MenuItem>
              ))}
            </Menu>
          )}

          <Button
            endIcon={<AccountCircleIcon />}
            onClick={() => {
              props.history.push("/profileuser");
            }}
            color="inherit"
          >
            {`${t("navbar.welcome")} ${user.name}`}
          </Button>
          <Button onClick={onLogout} color="inherit">
            {t("navbar.logout")}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
