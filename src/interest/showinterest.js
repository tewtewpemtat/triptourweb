import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./showinterest.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Navbar from "../navbar";
import { useParams } from "react-router-dom";
import { query, where } from "firebase/firestore";
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
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
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

function ShowInterest() {
  const { userId } = useParams();
  const [tripData, setUserData] = useState([]);
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
        const usersRef = collection(firestore, "interest");
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
  }, [userId]);

  const handleDeleteUser = async (uid) => {
    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        await deleteDoc(doc(firestore, "interest", uid));
        const updatedUserData = tripData.filter((user) => user.uid !== uid);
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
      <Box sx={{ marginLeft: margins.showMargin }}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ overflow: { xs: "auto", sm: "unset" } }}>
              <TableContainer>
                <Table staria-label="simple table" className={classes.table}>
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
                        PLACEID
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
                        PLACEADDRESS
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
                        PLACETRIPID
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
                        LATITUDE
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
                        LONGITUDE
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
                        USERUID
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
                        PLACEPIC
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
                          width: "90px",
                        }}
                      >
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {tripData.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.uid || "N/A"}</TableCell>
                        <TableCell>{user.placeid || "N/A"}</TableCell>
                        <TableCell>{user.placeaddress || "N/A"}</TableCell>
                        <TableCell>{user.placetripid || "N/A"}</TableCell>
                        <TableCell>{user.placeLatitude || "N/A"}</TableCell>
                        <TableCell>{user.placeLongitude || "N/A"}</TableCell>
                        <TableCell>{user.useruid || "N/A"}</TableCell>
                        <TableCell>
                          {user.placepicUrl ? (
                            <img
                              src={user.placepicUrl}
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
                          <Link
                            to={`/editinterest/${user.placetripid}/${user.uid}`}
                          >
                            <IconButton>
                              <CreateIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => handleDeleteUser(user.uid)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default ShowInterest;
