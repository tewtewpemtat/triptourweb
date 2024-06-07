import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link ,  Navigate} from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import ShowUser from './users/showuser';
import EditUser from './users/edituser'; 
import ShowTrip from './trips/showtrip'; 
import EditTrip from './trips/edittrip'; 
import ShowPlace from './places/showplace'; 
import EditPlace from './places/editplace';
import ShowTimeLine from './timeline/showtimeline'; 
import EditTimeLine from './timeline/edittimeline'; 
import EditPlaceMeet from './placemeet/editplacemeet';
import ShowPlaceMeet from './placemeet/showplacemeet';
import Manage from './manage/manage'; 
import Add from './manage/add'; 
import Login from './authen/login'; 
import './App.css';



function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f2f2f2' }}>
        <Routes>
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
          <Route path="/users" element={<ShowUser />} />
          <Route path="/edituser/:userId" element={<EditUser />} />
          <Route path="/timelines" element={<ShowTimeLine />} />
          <Route path="/edittimeline/:userId" element={<EditTimeLine />} />
          <Route path="/placemeet" element={<ShowPlaceMeet />} />
          <Route path="/editplacemeet/:placeTripId/:userId" element={<EditPlaceMeet />} />
          <Route path="/edittrip/:userId" element={<EditTrip />} />
          <Route path="/editplace/:placeId/:userId" element={<EditPlace />} />
          <Route path="/trips" element={<ShowTrip />} />
          <Route path="/place/:userId" element={<ShowPlace />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/manage/add" element={<Add />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
