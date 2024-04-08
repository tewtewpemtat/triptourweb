import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ShowUser from './users/showuser';
import EditUser from './users/edituser'; 
import Settings from './settings'; // Assuming you have a Settings component

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: 'none',
    color: 'black',
  },
});

function App() {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
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
              <Link to="/" className={classes.linkText}>
                <ListItem button key="Home">
                  <ListItemText primary="Home" />
                </ListItem>
              </Link>
              <Link to="/edituser" className={classes.linkText}> 
                <ListItem button key="Edit User">
                  <ListItemText primary="Edit User" />
                </ListItem>
              </Link>
           
            </List>
          </div>
        </Drawer>
        <Routes>
          <Route path="/" element={<ShowUser />} />
          <Route path="/edituser/:userId" element={<EditUser />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
