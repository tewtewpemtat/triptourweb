import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: 'none',
    color: 'black',
  },
});

function Navbar() {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    navigate('/login', { replace: true });
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  


  return (
    <div >
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <div className={classes.logoutButton}>
            <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar> 
      <Drawer anchor="left" open={openDrawer} onClose={handleDrawerClose}>
        <div
          className={classes.list}
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
        >
          <List>
            <Link to="/users" className={classes.linkText}>
              <ListItem button key="ข้อมูลผู้ใช้">
                <ListItemText primary="ข้อมูลผู้ใช้" />
              </ListItem>
            </Link>
            <Link to="/trips" className={classes.linkText}> 
              <ListItem button key="ข้อมูลทริป">
                <ListItemText primary="ข้อมูลทริป" />
              </ListItem>
            </Link>
            <Link to="/places" className={classes.linkText}> 
              <ListItem button key="ข้อมูลสถานที่">
                <ListItemText primary="ข้อมูลสถานที่" />
              </ListItem>
            </Link>
          </List>
        </div>
      </Drawer> 
    </div>
  );
}

export default Navbar;
