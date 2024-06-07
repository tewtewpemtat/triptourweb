import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import {
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from "@mui/material";
import Navbar from "../navbar";
import "./showuser.css";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { margins } from '../styles/margin'

const useStyles = makeStyles((theme) => ({
  table: {
    borderCollapse: "collapse",
    width: "100%",

    "& th": {
      borderBottom: "1px solid #ddd",
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(1, 2),
      textAlign: "left",
    },
    "& td": {
      borderBottom: "1px solid #ddd",
      padding: theme.spacing(1, 2),
      textAlign: "left",
    },
  },
}));
function ShowUser() {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, "users");
        const usersSnapshot = await getDocs(usersRef);
        const userDataArray = usersSnapshot.docs.map((doc) => {
          const data = doc.data();
          data.uid = doc.id;
          return data;
        });
        setUserData(userDataArray);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteUser = async (uid) => {
    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        await deleteDoc(doc(firestore, "users", uid));
        const updatedUserData = userData.filter((user) => user.uid !== uid);
        setUserData(updatedUserData);
        alert("ลบข้อมูลสำเร็จ");
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ marginLeft: margins.showMargin}}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ overflow: { xs: "auto", sm: "unset" } }}>
              <Table aria-label="simple table" className={classes.table}>
                <TableHead>
                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                      }}
                    >
                      ID
                    </Typography>
                  </TableCell>

                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                      }}
                    >
                      FIRSTNAME
                    </Typography>
                  </TableCell>
                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                      }}
                    >
                      LASTNAME
                    </Typography>
                  </TableCell>
                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                      }}
                    >
                      NICKNAME
                    </Typography>
                  </TableCell>
                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                      }}
                    >
                      CONTACTNUMBER
                    </Typography>
                  </TableCell>
                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                      }}
                    >
                      GENDER
                    </Typography>
                  </TableCell>
                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                      }}
                    >
                      PROFILEIMAGE
                    </Typography>
                  </TableCell>
                  <TableCell style={{ backgroundColor: "transparent" }}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Arial, sans-serif",
                        color: "#4a5568",
                        paddingLeft: "20px",
                      }}
                    >
                      ACTION
                    </Typography>
                  </TableCell>
                </TableHead>
                <TableBody>
                  {userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.uid || "N/A"}</TableCell>
                      <TableCell>{user.firstName || "N/A"}</TableCell>
                      <TableCell>{user.lastName || "N/A"}</TableCell>
                      <TableCell>{user.nickname || "N/A"}</TableCell>
                      <TableCell>{user.contactNumber || "N/A"}</TableCell>
                      <TableCell>{user.gender || "N/A"}</TableCell>
                      <TableCell>
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt="Profile"
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`/edituser/${user.uid}`}>
                          <IconButton>
                            <CreateIcon />
                          </IconButton>
                        </Link>
                        <IconButton onClick={() => handleDeleteUser(user.uid)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default ShowUser;
