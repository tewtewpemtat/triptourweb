import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./showplacemeet.css";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { margins } from "../styles/margin";
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

function ShowPlaceMeet() {
  const { userId } = useParams();
  const [tripData, setUserData] = useState([]);
  const navigate = useNavigate();
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, "placemeet");
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTrips = tripData.filter((place) => {
    const matchesSearchTerm =
      place.uid?.toLowerCase().includes(searchTerm) ||
      place.placename?.toLowerCase().includes(searchTerm) ||
      place.placeid?.toLowerCase().includes(searchTerm) ||
      place.placeaddress?.toLowerCase().includes(searchTerm) ||
      place.placeLongitude?.toString().toLowerCase().includes(searchTerm) ||
      place.placeLatitude?.toString().toLowerCase().includes(searchTerm) ||
      place.useruid?.toLowerCase().includes(searchTerm) ||
      place.placetripid?.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });

  const handleDeleteUser = async (uid) => {
    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        await deleteDoc(doc(firestore, "placemeet", uid));
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gridColumnGap: 10,
                marginBottom: "20px",
                "& .MuiTextField-root": {
                  height: "45px",
                },
              }}
            >
              <TextField
                label="ค้นหา ID"
                variant="outlined"
                name="uid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา PLACEID"
                variant="outlined"
                name="placeid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา PLACENAME"
                variant="outlined"
                name="placename"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา PLACEADDRESS"
                variant="outlined"
                name="placeaddress"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา PLACETRIPID"
                variant="outlined"
                name="placetripid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา LATITUDE"
                variant="outlined"
                name="placeLatitude"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา LONGITUDE"
                variant="outlined"
                name="placeLongitude"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา USERUID"
                variant="outlined"
                name="useruid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
            </Box>
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
                        PLACENAME
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
                    {/* <TableCell style={{ backgroundColor: "transparent" }}>
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
                    </TableCell> */}
                  </TableHead>
                  <TableBody>
                    {filteredTrips.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.uid || "N/A"}</TableCell>
                        <TableCell>{user.placeid || "N/A"}</TableCell>
                        <TableCell>{user.placename || "N/A"}</TableCell>
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
                        {/* <TableCell>
                          <Link
                            to={`/editplacemeet/${user.placetripid}/${user.uid}`}
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
                        </TableCell> */}
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

export default ShowPlaceMeet;
