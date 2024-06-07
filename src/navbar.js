import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  ListItemIcon,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import FlightIcon from "@material-ui/icons/Flight";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MapIcon from "@mui/icons-material/Map";
import TimelineIcon from "@mui/icons-material/Timeline";
import RoomIcon from '@mui/icons-material/Room';
const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: "100",
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    border: `1px solid ${theme.palette.divider}`,
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
  },
  linkText: {
    textDecoration: "none",
    color: theme.palette.text.primary,
    display: "block",
    padding: theme.spacing(2),
    transition: "background-color 0.3s ease",
    fontWeight: 500,
    fontSize: theme.typography.body1.fontSize,
    fontFamily: "Roboto, sans-serif",
  },
  listItemText: {
    fontWeight: 400,
    fontFamily: "Roboto, sans-serif",
    fontSize: theme.typography.body1.fontSize,
  },
  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    "&:last-child": {
      borderBottom: "none",
    },
  },
}));

function Navbar() {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <AppBar style={{ backgroundColor: "#fcfafa" }} position="static">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div></div>
          <div>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              style={{ color: "#757575" }}
            >
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.sidebar}>
        <List>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              marginTop: "15px",
            }}
          >
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="Logo"
              style={{ maxWidth: "120px" }}
            />
          </div>
          <Link to="/users" className={classes.linkText}>
            <ListItem button key="ข้อมูลผู้ใช้">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="ข้อมูลผู้ใช้" />
            </ListItem>
          </Link>
          <Link to="/trips" className={classes.linkText}>
            <ListItem button key="ข้อมูลทริป">
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="ข้อมูลทริป" />
            </ListItem>
          </Link>
          <Link to="/timelines" className={classes.linkText}>
            <ListItem button key="ข้อมูลไทมไลน์">
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="ข้อมูลไทมไลน์" />
            </ListItem>
          </Link>
          <Link to="/placemeet" className={classes.linkText}>
            <ListItem button key="ข้อมูลจุดนัดพบ">
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary="ข้อมูลจุดนัดพบ" />
            </ListItem>
          </Link>
          <Link to="/manage" className={classes.linkText}>
            <ListItem button key="จัดการข้อมูล">
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="จัดการข้อมูล" />
            </ListItem>
          </Link>
        </List>
      </div>
    </div>
  );
}

export default Navbar;
