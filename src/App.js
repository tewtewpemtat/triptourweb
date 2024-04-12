import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link ,  Navigate} from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'; // Import ExitToAppIcon for logout button
import MenuIcon from '@material-ui/icons/Menu';
import ShowUser from './users/showuser';
import EditUser from './users/edituser'; 
import ShowTrip from './trips/showtrip'; 
import EditTrip from './trips/edittrip'; 
import ShowPlace from './places/showplace'; 
import EditPlace from './places/editplace'; 
import Login from './authen/login'; 
import './App.css'; // Corrected CSS import path

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f2f2f2' }}>
        <Routes>
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
          <Route path="/users" element={<ShowUser />} />
          <Route path="/edituser/:userId" element={<EditUser />} />
          <Route path="/edittrip/:userId" element={<EditTrip />} />
          <Route path="/editplace/:userId" element={<EditPlace />} />
          <Route path="/trips" element={<ShowTrip />} />
          <Route path="/places" element={<ShowPlace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
