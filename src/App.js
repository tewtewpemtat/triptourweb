import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ShowUser from './users/showuser';
import EditUser from './users/edituser'; 
import ShowTrip from './trips/showtrip'; 
import EditTrip from './trips/edittrip'; 
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
                <ListItem button key="ข้อมูลผู้ใช้">
                  <ListItemText primary="ข้อมูลผู้ใช้" />
                </ListItem>
              </Link>
              <Link to="/trips" className={classes.linkText}> 
                <ListItem button key="ข้อมูลทริป">
                  <ListItemText primary="ข้อมูลทริป" />
                </ListItem>
              </Link>
           
            </List>
          </div>
        </Drawer>
        <Routes>
          <Route path="/" element={<ShowUser />} />
          <Route path="/edituser/:userId" element={<EditUser />} />
          <Route path="/edittrip/:userId" element={<EditTrip />} />
          <Route path="/trips" element={<ShowTrip />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
