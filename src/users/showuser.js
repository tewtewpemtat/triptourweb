import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar'; 

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: 'none',
    color: 'black',
  },
});

function ShowUser() {
  const [userData, setUserData] = useState([]);
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
  
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const userDataArray = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          data.uid = doc.id;
          return data;
        });
        setUserData(userDataArray);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteUser = async (uid) => {
    try {
      await deleteDoc(doc(firestore, 'users', uid));
      const updatedUserData = userData.filter(user => user.uid !== uid);
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  return (
    <div >
      <Navbar/>
      <h1>ข้อมูลผู้ใช้</h1>
      <table>
        <thead>
          <tr>
            <th>UID</th>
            <th>Contact Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Nickname</th>
            <th>Gender</th>
            <th>Profile Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td>{user.uid}</td>
              <td>{user.contactNumber}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.nickname}</td>
              <td>{user.gender}</td>
              <td><img src={user.profileImageUrl} alt="Profile" /></td>
              <td>
                <Link to={`/edituser/${user.uid}`}>
                  <img src="/pencil.png" alt="Edit" className="action-icon" />
                </Link>
                <img src="/delete.png" alt="Delete" className="action-icon" onClick={() => handleDeleteUser(user.uid)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowUser;
