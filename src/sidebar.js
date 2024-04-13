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
    height: "100vh", // ทำให้ sidebar เต็มความสูงของหน้าจอ
  },
}));

function Sidebar() {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  return (
    <div className={classes.sidebar}>
      <List>
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
              <FlightIcon />
            </ListItemIcon>
            <ListItemText primary="ข้อมูลทริป" />
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
  );
}

export default Sidebar;
