// TablePage.js
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase"; // เรียกใช้ firestore
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // เรียกใช้งาน collection, getDocs, doc และ deleteDoc จาก Firebase Firestore
import "./showtrip.css"; // Corrected CSS import path
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Navbar from "../navbar";
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
function ShowTrip() {
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
        const usersRef = collection(firestore, "trips");
        const usersSnapshot = await getDocs(usersRef);
        const userDataArray = usersSnapshot.docs.map((doc) => {
          const data = doc.data();
          data.uid = doc.id; // เพิ่ม Document ID ลงในข้อมูลผู้ใช้
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
        await deleteDoc(doc(firestore, "trips", uid));
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
      <Box sx={{ marginLeft: 25 }}>
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
                      TRIPCREATE
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
                      NAME
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
                      STARTDATE
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
                      ENDDATE
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
                      LIMIT
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
                      TRIPJOIN
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
                      STATUS
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
                      TRIPPROFILE
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
                      ACTION
                    </Typography>
                  </TableCell>
                </TableHead>
                <TableBody>
                  {tripData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.uid || "N/A"}</TableCell>
                      <TableCell>{user.tripCreate || "N/A"}</TableCell>
                      <TableCell>{user.tripName || "N/A"}</TableCell>
                      <TableCell>
                        {user.tripStartDate
                          ? `${user.tripStartDate
                              .toDate()
                              .toLocaleDateString("th-TH")} ${user.tripStartDate
                              .toDate()
                              .toLocaleTimeString("th-TH")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {user.tripEndDate
                          ? `${user.tripEndDate
                              .toDate()
                              .toLocaleDateString("th-TH")} ${user.tripEndDate
                              .toDate()
                              .toLocaleTimeString("th-TH")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{user.tripLimit || "N/A"}</TableCell>
                      <TableCell>{user.tripJoin.length || "N/A"}</TableCell>
                      <TableCell>{user.tripStatus || "N/A"}</TableCell>
                      <TableCell>
                        {user.tripProfileUrl ? (
                          <img
                            src={user.tripProfileUrl}
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
                        <Link to={`/edittrip/${user.uid}`}>
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

export default ShowTrip;
